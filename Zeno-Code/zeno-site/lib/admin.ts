/**
 * lib/admin.ts
 *
 * 管理员身份判断
 *
 * 优先使用 Auth.js 中的 ADMIN / OPERATOR 角色。
 * 旧 ADMIN_PASSWORD cookie 仅作为迁移期间的应急入口。
 */

import { cookies } from 'next/headers'
import crypto from 'crypto'
import { auth } from '@/auth'

const ADMIN_COOKIE = 'admin_session'
const ADMIN_ROLES = new Set(['ADMIN', 'OPERATOR'])
const LEGACY_ADMIN_SESSION_MS = 12 * 60 * 60 * 1000

export type AdminActor = {
  id: string | null
  email: string | null
  role: 'ADMIN' | 'OPERATOR'
  source: 'auth' | 'legacy-cookie'
}

function getAdminSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? ''
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)
  if (leftBuffer.length !== rightBuffer.length) return false
  return crypto.timingSafeEqual(leftBuffer, rightBuffer)
}

/**
 * 生成管理员 session token
 */
export function generateAdminToken(): string | null {
  const secret = getAdminSecret()
  if (!secret) return null
  const payload = `admin:${Date.now()}`
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return `${payload}:${hmac}`
}

export function isLegacyAdminLoginConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && getAdminSecret())
}

/**
 * 验证管理员 session token
 */
export function verifyAdminToken(token: string): boolean {
  const secret = getAdminSecret()
  if (!secret || !token) return false

  const parts = token.split(':')
  if (parts.length !== 3) return false

  const [prefix, ts, hmac] = parts
  if (prefix !== 'admin') return false

  // 旧管理员入口只保留短会话，降低共享密码泄露后的影响。
  const timestamp = parseInt(ts, 10)
  const age = Date.now() - timestamp
  if (isNaN(timestamp) || age < 0 || age > LEGACY_ADMIN_SESSION_MS) return false

  const expected = crypto.createHmac('sha256', secret).update(`${prefix}:${ts}`).digest('hex')
  return safeEqual(hmac, expected)
}

/**
 * 返回当前管理员身份。Auth.js 角色优先，旧 cookie 作为过渡兜底。
 */
export async function getAdminActor(): Promise<AdminActor | null> {
  try {
    const session = await auth()
    const role = session?.user?.role?.toUpperCase()
    if (session?.user?.id && role && ADMIN_ROLES.has(role)) {
      return {
        id: session.user.id,
        email: session.user.email ?? null,
        role: role as AdminActor['role'],
        source: 'auth',
      }
    }
  } catch {
    // Auth.js 不可用时继续检查迁移期应急 cookie。
  }

  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ADMIN_COOKIE)?.value
    if (!token || !verifyAdminToken(token)) return null

    return {
      id: null,
      email: null,
      role: 'ADMIN',
      source: 'legacy-cookie',
    }
  } catch {
    return null
  }
}

export async function isAdminUser(): Promise<boolean> {
  return Boolean(await getAdminActor())
}

export async function requireAdminActor(): Promise<AdminActor> {
  const actor = await getAdminActor()
  if (!actor) throw new Error('Unauthorized')
  return actor
}

/**
 * 验证管理员密码
 */
export function verifyAdminPassword(password: string): boolean {
  const adminPwd = process.env.ADMIN_PASSWORD
  if (!adminPwd || !password) return false
  return safeEqual(password, adminPwd)
}
