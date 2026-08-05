/**
 * lib/api-auth.ts
 *
 * Zeno OS API 路由认证 — 双重保护
 * 1. Bearer token（ZENO_INTERNAL_API_TOKEN）— 迁移期机器间调用
 * 2. Auth.js 管理员角色或旧 admin_session — 浏览器调用
 *
 * 任一通过即可访问
 */

import crypto from 'node:crypto'
import { isAdminUser } from '@/lib/admin'

/**
 * Bearer token 验证（复刻 verifyInternalApiRequest 逻辑）
 */
function verifyBearerToken(req: Request): boolean {
  const token = process.env.ZENO_INTERNAL_API_TOKEN
  if (!token) return false

  const authHeader = req.headers.get('authorization') ?? ''
  const incoming = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
  if (!incoming) return false

  const expected = Buffer.from(token)
  const received = Buffer.from(incoming)

  if (expected.length !== received.length) return false
  return crypto.timingSafeEqual(expected, received)
}

/**
 * 验证 API 请求 — Bearer token 或管理员身份任一有效即通过。
 */
export async function verifyApiRequest(req: Request): Promise<boolean> {
  if (verifyBearerToken(req)) return true
  return isAdminUser()
}
