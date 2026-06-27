/**
 * POST /api/images/generate
 *
 * 管理员接口：调用火山引擎豆包生成图片（封面图或文中配图）。
 * API Key 只在服务端读取，不会暴露给前端。
 *
 * 权限：仅管理员（ADMIN_EMAILS 中的邮箱登录后可调用）
 */

import { NextRequest, NextResponse } from 'next/server'
import { isAdminUser } from '@/lib/admin'
import { generateWechatCoverImage, generateArticleImage, ImageUsage } from '@/lib/volcengine-image'

interface GenerateRequestBody {
  prompt: string
  articleTitle?: string
  articleSummary?: string
  usage?: ImageUsage   // 'cover' | 'inline'
  style?: string
  size?: string
}

export async function POST(request: NextRequest) {
  // 管理员验证
  const isAdmin = await isAdminUser()
  if (!isAdmin) {
    return NextResponse.json(
      { error: '无权限。图片生成接口仅限管理员使用，避免产生不可控费用。' },
      { status: 403 },
    )
  }

  // 检查 API 配置
  if (!process.env.VOLCENGINE_ARK_API_KEY || !process.env.VOLCENGINE_IMAGE_MODEL) {
    return NextResponse.json(
      { error: '火山引擎图片生成 API 尚未配置，请设置 VOLCENGINE_ARK_API_KEY 和 VOLCENGINE_IMAGE_MODEL。' },
      { status: 503 },
    )
  }

  // 解析请求体
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '请求格式错误，需要 JSON 格式。' }, { status: 400 })
  }

  const b = body as GenerateRequestBody

  if (!b?.prompt || typeof b.prompt !== 'string' || !b.prompt.trim()) {
    return NextResponse.json({ error: '缺少 prompt 字段。' }, { status: 400 })
  }

  if (b.prompt.length > 2000) {
    return NextResponse.json({ error: 'prompt 过长，最大 2000 字符。' }, { status: 400 })
  }

  const params = {
    prompt:         b.prompt,
    articleTitle:   b.articleTitle,
    articleSummary: b.articleSummary,
    style:          b.style,
    size:           b.size,
  }

  try {
    const result = b.usage === 'inline'
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
    const message = err instanceof Error ? err.message : '未知错误'
    return NextResponse.json({ error: `图片生成失败：${message}` }, { status: 500 })
  }
}
