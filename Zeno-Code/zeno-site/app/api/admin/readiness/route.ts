import { NextResponse } from 'next/server'
import { isAdminUser } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import { isEmailConfigured } from '@/lib/email'
import { AI_TASKS, getAiTaskStatus } from '@/lib/integrations/ai/config'
import { getPaymentOptions } from '@/lib/payment-config'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isAdminUser())) {
    return NextResponse.json({ ok: false, error: '未授权' }, { status: 401 })
  }

  let database = false
  try {
    await prisma.$queryRaw`SELECT 1`
    database = true
  } catch {
    database = false
  }

  const paymentOptions = getPaymentOptions()
  const checks = {
    database: { ok: database },
    auth: {
      ok: Boolean(process.env.AUTH_SECRET),
      google: Boolean(
        (process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID)
        && (process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET),
      ),
      legacyAdmin: Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET),
    },
    email: { ok: isEmailConfigured() },
    ai: AI_TASKS.map(getAiTaskStatus),
    integrations: {
      manualPayment: {
        ok: paymentOptions.length > 0,
        methods: paymentOptions.map((option) => option.method),
      },
      md2wechat: Boolean(process.env.MD2WECHAT_BASE_URL && process.env.MD2WECHAT_API_KEY),
      wechatDraft: Boolean(process.env.WECHAT_APPID && process.env.WECHAT_APP_SECRET),
      imageGeneration: Boolean(
        process.env.VOLCENGINE_ARK_API_KEY && process.env.VOLCENGINE_IMAGE_MODEL,
      ),
    },
  }

  const ready = checks.database.ok && checks.auth.ok
  return NextResponse.json(
    { ok: ready, checks },
    {
      status: ready ? 200 : 503,
      headers: { 'Cache-Control': 'no-store' },
    },
  )
}
