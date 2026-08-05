/**
 * POST /api/md2wechat/convert
 *
 * 公开接口：将 Markdown 转换为微信公众号 HTML，按 IP 限流。
 *
 * API Key 只在服务端读取，不会暴露给前端。
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { convertMarkdownToWechat } from '@/lib/md2wechat'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

const convertSchema = z.object({
  markdown: z.string().trim().min(1).max(50_000),
  theme: z.string().trim().min(1).max(50).default('default'),
  fontSize: z.enum(['small', 'medium', 'large']).default('medium'),
  backgroundType: z.string().trim().min(1).max(50).default('default'),
})

export async function POST(request: NextRequest) {
  const limiter = checkRateLimit(
    `md2wechat-convert:${getClientIp(request)}`,
    10,
    60 * 60_000,
  )
  if (!limiter.allowed) {
    return NextResponse.json({ error: '转换请求过于频繁，请稍后再试。' }, { status: 429 })
  }

  // 检查 API 是否已配置（不暴露密钥，只说明状态）
  if (!process.env.MD2WECHAT_BASE_URL || !process.env.MD2WECHAT_API_KEY) {
    return NextResponse.json(
      { error: '排版服务暂未开放。' },
      { status: 503 },
    )
  }

  const parsed = convertSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: '请求参数无效。' }, { status: 422 })
  }

  try {
    const result = await convertMarkdownToWechat({
      markdown: parsed.data.markdown,
      theme: parsed.data.theme,
      fontSize: parsed.data.fontSize,
      backgroundType: parsed.data.backgroundType,
    })

    return NextResponse.json({ success: true, ...result })
  } catch (err) {
    console.error('[md2wechat/convert] upstream failed:', err instanceof Error ? err.message : 'unknown')
    return NextResponse.json({ error: '排版服务暂时不可用，请稍后重试。' }, { status: 502 })
  }
}
