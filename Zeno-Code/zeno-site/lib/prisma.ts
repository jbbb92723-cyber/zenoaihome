/**
 * lib/prisma.ts
 *
 * Prisma Client 单例。
 *
 * 页面读取允许在构建期或数据库暂时不可用时降级为空数据；任何写入、事务和
 * 原始 SQL 都必须保留失败，避免接口返回一个并不存在的成功结果。
 */

import { Prisma, PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

const READ_METHODS = new Set([
  'aggregate',
  'count',
  'findFirst',
  'findMany',
  'findUnique',
  'groupBy',
])

const RAW_DATABASE_METHODS = new Set([
  '$executeRaw',
  '$executeRawUnsafe',
  '$queryRaw',
  '$queryRawUnsafe',
  '$transaction',
])

export class DatabaseUnavailableError extends Error {
  constructor(operation = 'database operation') {
    super(`Database is unavailable: ${operation}`)
    this.name = 'DatabaseUnavailableError'
  }
}

export function isDatabaseUnavailableError(error: unknown): error is DatabaseUnavailableError {
  return error instanceof DatabaseUnavailableError
}

function createRealClient(): PrismaClient {
  const client = globalForPrisma.prisma ?? new PrismaClient()
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client
  }
  return client
}

function emptyReadResult(methodName: string): unknown {
  if (methodName === 'count') return 0
  if (methodName === 'findUnique' || methodName === 'findFirst') return null
  if (methodName === 'aggregate') {
    return { _avg: {}, _count: {}, _max: {}, _min: {}, _sum: {} }
  }
  return []
}

function logReadFailure(modelName: string, methodName: string, error: unknown) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `[prisma] 数据库查询失败 (${modelName}.${methodName}):`,
      (error as Error)?.message?.split('\n')[0] ?? String(error),
    )
  }
}

const TRANSIENT_DATABASE_ERROR_CODES = new Set([
  'P1001', // database server unreachable
  'P1002', // connection timeout
  'P1008', // operation timeout
  'P1017', // connection closed
  'P2024', // connection pool timeout
  'P2037', // too many database connections
])

function canFallbackRead(error: unknown): boolean {
  if (error instanceof DatabaseUnavailableError) return true
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return TRANSIENT_DATABASE_ERROR_CODES.has(error.code)
  }
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return Boolean(error.errorCode && TRANSIENT_DATABASE_ERROR_CODES.has(error.errorCode))
  }
  return false
}

function createFallbackStub(): PrismaClient {
  const fallbackModelHandler: ProxyHandler<Record<string, unknown>> = {
    get(_target, methodName) {
      if (typeof methodName === 'symbol') return undefined

      const operation = String(methodName)
      if (READ_METHODS.has(operation)) {
        return async () => emptyReadResult(operation)
      }

      return async () => {
        throw new DatabaseUnavailableError(`model.${operation}`)
      }
    },
  }

  const fallbackHandler: ProxyHandler<Record<string, unknown>> = {
    get(_target, property) {
      if (property === 'then') return undefined
      if (typeof property === 'symbol') return undefined

      const operation = String(property)
      if (operation === '$disconnect') {
        return async () => undefined
      }
      if (operation === '$on') {
        return () => undefined
      }
      if (RAW_DATABASE_METHODS.has(operation) || operation === '$connect') {
        return async () => {
          throw new DatabaseUnavailableError(operation)
        }
      }

      return new Proxy({}, fallbackModelHandler)
    },
  }

  return new Proxy({}, fallbackHandler) as unknown as PrismaClient
}

/**
 * 只对读查询做空数据降级。写方法不在 catch 中转换，因此数据库故障会直接
 * 进入调用方的错误处理，不会伪装成空对象或成功响应。
 */
function wrapResilient(client: PrismaClient): PrismaClient {
  const handler: ProxyHandler<PrismaClient> = {
    get(target, property) {
      const original = Reflect.get(target, property, target)

      if (typeof property === 'symbol') return original

      // Prisma 内部属性不能被模型代理包装。
      if (property.startsWith('_')) return original

      if (typeof original === 'function') {
        // 事务、原始 SQL 和连接方法保留 Prisma 原本的失败语义，并绑定 this。
        return (...args: unknown[]) => Reflect.apply(original, target, args)
      }

      if (original === null || typeof original !== 'object' || property.startsWith('$')) {
        return original
      }

      return new Proxy(original, {
        get(modelTarget, methodName) {
          if (typeof methodName === 'symbol') return Reflect.get(modelTarget, methodName)

          const method = Reflect.get(modelTarget, methodName)
          if (typeof method !== 'function') return method

          return async (...args: unknown[]) => {
            try {
              return await Reflect.apply(method, modelTarget, args)
            } catch (error) {
              if (!READ_METHODS.has(methodName) || !canFallbackRead(error)) throw error

              logReadFailure(property, methodName, error)
              return emptyReadResult(methodName)
            }
          }
        },
      })
    },
  }

  return new Proxy(client, handler) as unknown as PrismaClient
}

let prisma: PrismaClient

if (process.env.DATABASE_URL) {
  prisma = wrapResilient(createRealClient())
} else {
  prisma = createFallbackStub()
  if (process.env.NODE_ENV !== 'production') {
    console.warn('[prisma] DATABASE_URL 未配置，读取使用空数据；写入将返回数据库不可用错误')
  }
}

export { prisma }
