/**
 * POST /api/md2wechat/draft
 *
 * 管理员接口：通过 md2wechat 在微信公众号后台创建图文草稿。
 * ⚠️ 只创建草稿，不自动发布！
 *
 * 权限：仅管理员（ADMIN_EMAILS 中的邮箱登录后可调用）
 */

import { NextRequest, NextResponse } from 'next/server'
import { isAdminUser } from '@/lib/admin'
import { createWechatDraft } from '@/lib/md2wechat'

interface DraftRequestBody {
  markdown: string
  theme?: string
  fontSize?: string
  coverImageUrl?: string
}

export async function POST(request: NextRequest) {
  // 管理员验证
  const isAdmin = await isAdminUser()
  if (!isAdmin) {
    return NextResponse.json(
      { error: '无权限。此接口仅限管理员使用。' },
      { status: 403 },
    )
  }

  // 检查 API 配置
  const missing: string[] = []
  if (!process.env.MD2WECHAT_BASE_URL)  missing.push('MD2WECHAT_BASE_URL')
  if (!process.env.MD2WECHAT_API_KEY)   missing.push('MD2WECHAT_API_KEY')
  if (!process.env.WECHAT_APPID)        missing.push('WECHAT_APPID')
  if (!process.env.WECHAT_APP_SECRET)   missing.push('WECHAT_APP_SECRET')

  if (missing.length > 0) {
    return NextResponse.json(
      { error: `以下环境变量未配置：${missing.join('、')}` },
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

  const b = body as DraftRequestBody

  if (!b?.markdown || typeof b.markdown !== 'string' || !b.markdown.trim()) {
    return NextResponse.json({ error: '缺少 markdown 字段或内容为空。' }, { status: 400 })
  }

  try {
    const result = await createWechatDraft({
      markdown:      b.markdown,
      theme:         b.theme        ?? 'default',
      fontSize:      b.fontSize     ?? 'medium',
      coverImageUrl: b.coverImageUrl,
    })

    return NextResponse.json({ success: true, ...result })
  } catch (err) {
    const message = err instanceof Error ? err.message : '未知错误'
    return NextResponse.json({ error: `草稿创建失败：${message}` }, { status: 500 })
  }
}
