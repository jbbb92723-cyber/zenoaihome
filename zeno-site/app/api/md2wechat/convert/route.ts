/**
 * POST /api/md2wechat/convert
 *
 * 公开接口：将 Markdown 转换为微信公众号 HTML。
 * 无需登录，任何用户均可调用（排版预览功能）。
 *
 * API Key 只在服务端读取，不会暴露给前端。
 */

import { NextRequest, NextResponse } from 'next/server'
import { convertMarkdownToWechat } from '@/lib/md2wechat'

interface ConvertRequestBody {
  markdown: string
  theme?: string
  fontSize?: string
  backgroundType?: string
}

export async function POST(request: NextRequest) {
  // 检查 API 是否已配置（不暴露密钥，只说明状态）
  if (!process.env.MD2WECHAT_BASE_URL || !process.env.MD2WECHAT_API_KEY) {
    return NextResponse.json(
      { error: 'md2wechat API 尚未配置，请联系管理员设置 MD2WECHAT_BASE_URL 和 MD2WECHAT_API_KEY。' },
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

  const b = body as ConvertRequestBody

  if (!b?.markdown || typeof b.markdown !== 'string' || !b.markdown.trim()) {
    return NextResponse.json({ error: '缺少 markdown 字段或内容为空。' }, { status: 400 })
  }

  // 基本长度限制（防止滥用）
  if (b.markdown.length > 50000) {
    return NextResponse.json({ error: 'Markdown 内容过长，最大支持 50000 字符。' }, { status: 400 })
  }

  try {
    const result = await convertMarkdownToWechat({
      markdown:       b.markdown,
      theme:          b.theme         ?? 'default',
      fontSize:       b.fontSize      ?? 'medium',
      backgroundType: b.backgroundType ?? 'default',
    })

    return NextResponse.json({ success: true, ...result })
  } catch (err) {
    const message = err instanceof Error ? err.message : '未知错误'
    return NextResponse.json({ error: `转换失败：${message}` }, { status: 500 })
  }
}
