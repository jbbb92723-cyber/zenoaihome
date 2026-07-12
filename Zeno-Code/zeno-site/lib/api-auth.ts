/**
 * lib/api-auth.ts
 *
 * Zeno OS API 路由认证 — 双重保护
 * 1. Bearer token（ZENO_INTERNAL_API_TOKEN）— 机器间调用
 * 2. Admin cookie（admin_session）— 浏览器直接调用
 *
 * 任一通过即可访问
 */

import crypto from 'node:crypto'

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
 * Admin cookie 验证
 */
function parseCookies(req: Request): Record<string, string> {
  const cookieHeader = req.headers.get('cookie') ?? ''
  const result: Record<string, string> = {}
  for (const pair of cookieHeader.split(';')) {
    const eqIdx = pair.indexOf('=')
    if (eqIdx < 0) continue
    const key = pair.slice(0, eqIdx).trim()
    const value = decodeURIComponent(pair.slice(eqIdx + 1).trim())
    if (key) result[key] = value
  }
  return result
}

function verifyAdminCookie(req: Request): boolean {
  const secret = process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? ''
  if (!secret) return false

  const cookies = parseCookies(req)
  const token = cookies['admin_session']
  if (!token) return false

  const parts = token.split(':')
  if (parts.length !== 3) return false

  const [prefix, ts, hmac] = parts
  if (prefix !== 'admin') return false

  const timestamp = parseInt(ts, 10)
  if (isNaN(timestamp) || Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) return false

  const expected = crypto.createHmac('sha256', secret).update(`${prefix}:${ts}`).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expected))
}

/**
 * 验证 API 请求 — Bearer token 或 Admin cookie 任一有效即通过
 */
export function verifyApiRequest(req: Request): boolean {
  return verifyBearerToken(req) || verifyAdminCookie(req)
}
