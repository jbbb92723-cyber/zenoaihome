/**
 * POST /api/images/generate
 *
 * 管理员接口：调用火山引擎豆包生成图片（封面图或文中配图）。
 * API Key 只在服务端读取，不会暴露给前端。
 *
 * 权限：仅管理员（ADMIN_EMAILS 中的邮箱登录后可调用）
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAdminActor } from '@/lib/admin'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { generateWechatCoverImage, generateArticleImage } from '@/lib/volcengine-image'

const generateSchema = z.object({
  prompt: z.string().trim().min(1).max(2000),
  articleTitle: z.string().trim().max(200).optional(),
  articleSummary: z.string().trim().max(1000).optional(),
  usage: z.enum(['cover', 'inline']).default('cover'),
  style: z.string().trim().max(100).optional(),
  size: z.string().trim().regex(/^\d{2,5}x\d{2,5}$/).optional(),
})

export async function POST(request: NextRequest) {
  // 管理员验证
  const actor = await getAdminActor()
  if (!actor) {
    return NextResponse.json(
      { error: '无权限。图片生成接口仅限管理员使用，避免产生不可控费用。' },
      { status: 403 },
    )
  }

  const limiter = checkRateLimit(
    `image-generate:${actor.id ?? getClientIp(request)}`,
    10,
    60 * 60_000,
  )
  if (!limiter.allowed) {
    return NextResponse.json({ error: '图片生成请求过于频繁，请稍后再试。' }, { status: 429 })
  }

  // 检查 API 配置
  if (!process.env.VOLCENGINE_ARK_API_KEY || !process.env.VOLCENGINE_IMAGE_MODEL) {
    return NextResponse.json(
      { error: '图片生成服务暂未配置。' },
      { status: 503 },
    )
  }

  const parsed = generateSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: '请求参数无效。' }, { status: 422 })
  }
  const body = parsed.data

  const params = {
    prompt: body.prompt,
    articleTitle: body.articleTitle,
    articleSummary: body.articleSummary,
    style: body.style,
    size: body.size,
  }

  try {
    const result = body.usage === 'inline'
      ? await generateArticleImage(params)
      : await generateWechatCoverImage(params)

    return NextResponse.json({
      success:       true,
      imageUrl:      result.imageUrl,
      imageBase64:   result.imageBase64,
      model:         result.model,
      estimatedCost: result.estimatedCost,
    })
  } catch (err) {
    console.error('[images/generate] upstream failed:', err instanceof Error ? err.message : 'unknown')
    return NextResponse.json({ error: '图片生成服务暂时不可用，请稍后重试。' }, { status: 502 })
  }
}
