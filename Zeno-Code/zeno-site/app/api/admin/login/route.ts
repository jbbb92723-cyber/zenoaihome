/**
 * POST /api/admin/login
 */

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import {
  generateAdminToken,
  isLegacyAdminLoginConfigured,
  verifyAdminPassword,
} from '@/lib/admin'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

const loginSchema = z.object({
  password: z.string().min(1).max(256),
})

export async function POST(req: Request) {
  // ── IP 暴力破解防护：5 次失败锁定 10 分钟 ──────────────────
  const ip = getClientIp(req)
  const limiter = checkRateLimit(`admin-login:${ip}`, 5, 10 * 60_000)
  if (!limiter.allowed) {
    return NextResponse.json(
      { error: `登录尝试过多，请 10 分钟后重试` },
      { status: 429 },
    )
  }

  if (!isLegacyAdminLoginConfigured()) {
    return NextResponse.json({ error: '应急登录未配置，请使用管理员账户登录' }, { status: 503 })
  }

  const parsed = loginSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: '请求参数无效' }, { status: 422 })
  }
  const { password } = parsed.data

  if (!password || !verifyAdminPassword(password)) {
    return NextResponse.json({ error: '密码不正确' }, { status: 401 })
  }

  const token = generateAdminToken()
  if (!token) {
    return NextResponse.json({ error: '应急登录未配置，请使用管理员账户登录' }, { status: 503 })
  }
  const cookieStore = await cookies()
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path:     '/',
    maxAge:   12 * 60 * 60,
  })

  return NextResponse.json({ message: '登录成功' })
}
