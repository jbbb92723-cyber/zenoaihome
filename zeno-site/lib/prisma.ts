/**
 * lib/prisma.ts
 *
 * Prisma Client 单例（防止开发模式热重载时重复创建连接）
 */

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

// 导出 prisma 变量。若未配置 DATABASE_URL，导出一个安全的 stub
// 以避免在构建时抛出错误（例如 Vercel 构建环境未设置数据库时）。
let prisma: PrismaClient

if (process.env.DATABASE_URL) {
  const client = globalForPrisma.prisma ?? new PrismaClient()
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client
  }
  prisma = client
} else {
  // 当没有 DATABASE_URL 时，返回一个通用的 stub：任何模型方法调用都返回空数组
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

  // @ts-ignore: runtime stub to avoid build-time DB requirement
  // 将 stub 断言为 PrismaClient 类型，这样 TypeScript 能识别模型方法的类型
  // 在运行时 stub 会返回空数组，避免构建时访问真实数据库。
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  prisma = new Proxy({}, stubHandler) as unknown as PrismaClient

  if (process.env.NODE_ENV !== 'production') {
    // 在开发 / 构建日志中给出提示，说明现在使用 stub
    // 这样 Vercel 的构建不会因为缺失 DATABASE_URL 而失败
    // 真实生产环境请在 Vercel 项目设置中添加 DATABASE_URL
    //（示例：postgresql://user:pass@host:5432/dbname）
    // 注意：stub 会导致 admin 页面在无 DB 环境下显示为空数据。
    // 如果需要真实数据，请在 Vercel 中配置 DATABASE_URL 并重新部署。
    // eslint-disable-next-line no-console
    console.warn('数据库环境变量 DATABASE_URL 未配置，Prisma 使用 stub（构建时将返回空数据）。')
  }
}

export { prisma }
