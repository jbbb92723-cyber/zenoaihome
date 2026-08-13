/**
 * app/api/payments/webhook/route.ts
 *
 * 支付 Webhook 入口
 *
 * ⚠️ 重要安全说明：
 * 支付回调必须做签名验证（HMAC），不能只靠请求内容判断支付成功。
 * 当前没有启用自动支付 Provider，因此明确返回 501。
 *
 * TODO（第二阶段）：
 * 1. 根据支付平台读取相应的 webhook secret
 * 2. 验证签名（Stripe 用 stripe-signature header，微信用 XML + MD5）
 * 3. 验签通过后才处理业务逻辑
 * 4. 将原始事件存入 payment_events 表（幂等处理）
 * 5. 支付成功后更新 orders 表状态为 paid
 * 6. 支付成功后更新 memberships 表开通会员权限
 * 7. 返回正确的 HTTP 200（否则支付平台会重试）
 */

import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    {
      error: 'PAYMENT_WEBHOOK_NOT_IMPLEMENTED',
      message: '自动支付回调尚未启用，请使用人工付款确认流程。',
    },
    { status: 501 },
  )
}
