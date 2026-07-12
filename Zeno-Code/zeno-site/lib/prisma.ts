/**
 * lib/prisma.ts
 *
 * Prisma Client 单例 — 容错版
 *
 * - DATABASE_URL 存在时：使用真实 PrismaClient，但查询失败时返回空数据
 * - DATABASE_URL 不存在时：使用通用 stub（构建时不依赖数据库）
 *
 * 任何情况下都不会因为数据库不可用导致页面 500。
 */

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createRealClient(): PrismaClient {
  const client = globalForPrisma.prisma ?? new PrismaClient()
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client
  }
  return client
}

function createFallbackStub(): PrismaClient {
  const stubHandler: ProxyHandler<any> = {
    get() {
      return new Proxy(() => {}, {
        get() {
          return async () => []
        },
        apply() {
          return async () => []
        },
      })
    },
  }
  // @ts-ignore
  return new Proxy({}, stubHandler) as unknown as PrismaClient
}

/**
 * 包装 PrismaClient，所有模型方法调用失败时返回空数据而非抛出异常。
 * 这样任何一个后台页面都不会因为数据库不可用而白屏。
 */
function wrapResilient(client: PrismaClient): PrismaClient {
  const handler: ProxyHandler<PrismaClient> = {
    get(target, prop) {
      const original = (target as any)[prop]

      // 非模型属性直接返回（$connect, $disconnect, $on, $transaction 等）
      if (typeof original !== 'object' || original === null) {
        return original
      }

      // 模型代理：拦截所有方法调用，失败返回空
      return new Proxy(original, {
        get(modelTarget, methodName) {
          const method = modelTarget[methodName]
          if (typeof method !== 'function') return method

          return async (...args: any[]) => {
            try {
              return await method.apply(modelTarget, args)
            } catch (error) {
              // 数据库不可用时静默降级，不阻塞页面渲染
              if (process.env.NODE_ENV !== 'production') {
                console.warn(
                  `[prisma] 数据库查询失败 (${String(prop)}.${String(methodName)}):`,
                  (error as Error).message?.split('\n')[0]
                )
              }
              // 根据方法名返回合理的空值
              if (String(methodName) === 'count') return 0
              if (String(methodName) === 'findMany') return []
              if (String(methodName) === 'findUnique' || String(methodName) === 'findFirst') return null
              if (String(methodName).startsWith('aggregate')) return { _sum: {}, _count: {} }
              if (String(methodName).startsWith('create') || String(methodName).startsWith('update') || String(methodName).startsWith('delete') || String(methodName).startsWith('upsert')) return {}
              return []
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
    console.warn('[prisma] DATABASE_URL 未配置，使用 stub（所有查询返回空数据）')
  }
}

export { prisma }
