/**
 * POST /api/publish/wechat-draft
 *
 * 公众号创作工作台 — 推送草稿（含网站回流链接注入）
 *
 * 在 Markdown 末尾自动追加"阅读原文"回流链接，驱动公众号读者回到 zenoaihome.com。
 *
 * 权限：仅管理员（admin_session cookie）
 * ⚠️  只创建草稿，不自动发布！
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAdminActor } from '@/lib/admin'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

// ─── 回流链接 ──────────────────────────────────────────────────

const SITE_BASE = 'https://zenoaihome.com'

/**
 * 生成追加到 Markdown 末尾的回流链接片段。
 * articlePath 可传 '/blog/some-slug'，默认指向首页。
 */
function buildBacklinkMarkdown(articlePath = ''): string {
  const url = `${SITE_BASE}${articlePath}?utm_source=wechat&utm_medium=article`
  return `\n\n---\n\n*本文同步发布于 [zenoaihome.com](${url})，欢迎访问网站阅读更多内容。*\n`
}

// ─── 请求体类型 ─────────────────────────────────────────────────

const draftSchema = z.object({
  title: z.string().trim().min(1).max(200),
  markdown: z.string().trim().min(1).max(100_000),
  coverImageUrl: z.string().trim().url().max(2000).optional(),
  theme: z.string().trim().min(1).max(50).default('default'),
  fontSize: z.enum(['small', 'medium', 'large']).default('medium'),
  articlePath: z.string().trim().max(300).regex(/^\/[a-z0-9/_-]*$/i).default(''),
})

// ─── 路由处理器 ─────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // ── 权限验证 ──────────────────────────────────────────────────
  const actor = await getAdminActor()
  if (!actor) {
    return NextResponse.json(
      { error: '无权限。此接口仅限管理员使用。' },
      { status: 403 },
    )
  }

  const limiter = checkRateLimit(
    `wechat-draft:${actor.id ?? getClientIp(request)}`,
    20,
    60 * 60_000,
  )
  if (!limiter.allowed) {
    return NextResponse.json({ error: '草稿推送请求过于频繁，请稍后再试。' }, { status: 429 })
  }

  // ── 环境变量检查 ───────────────────────────────────────────────
  const missingEnvs: string[] = []
  const apiKey       = process.env.MD2WECHAT_API_KEY
  const wechatAppid  = process.env.WECHAT_APPID
  const wechatSecret = process.env.WECHAT_APP_SECRET

  if (!process.env.MD2WECHAT_BASE_URL) missingEnvs.push('MD2WECHAT_BASE_URL')
  if (!apiKey)                          missingEnvs.push('MD2WECHAT_API_KEY')
  if (!wechatAppid)                     missingEnvs.push('WECHAT_APPID')
  if (!wechatSecret)                    missingEnvs.push('WECHAT_APP_SECRET')

  if (missingEnvs.length > 0) {
    console.warn('[publish/wechat-draft] missing configuration:', missingEnvs.join(','))
    return NextResponse.json(
      { error: '公众号草稿服务暂未配置。' },
      { status: 503 },
    )
  }

  // ── 解析请求体 ─────────────────────────────────────────────────
  const parsed = draftSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: '请求参数无效。' }, { status: 422 })
  }
  const { title, markdown, coverImageUrl, theme, fontSize, articlePath } = parsed.data

  // ── 注入回流链接 ───────────────────────────────────────────────
  const markdownWithBacklink = markdown + buildBacklinkMarkdown(articlePath)

  // ── 构建草稿请求 ───────────────────────────────────────────────
  const draftPayload: Record<string, unknown> = {
    title,
    markdown: markdownWithBacklink,
    theme,
    fontSize,
    convertVersion: 'v1',
    draft: true,
  }

  if (coverImageUrl) {
    draftPayload.coverImageUrl = coverImageUrl
  }

  const baseUrl = (process.env.MD2WECHAT_BASE_URL ?? 'https://md2wechat.com').replace(/\/$/, '')
  const draftUrl = `${baseUrl}/api/v1/article-draft`

  // ── 调用 md2wechat ─────────────────────────────────────────────
  let upstreamResponse: Response
  try {
    upstreamResponse = await fetch(draftUrl, {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'Md2wechat-API-Key': apiKey as string,
        'Wechat-Appid':      wechatAppid as string,
        'Wechat-App-Secret': wechatSecret as string,
      },
      body: JSON.stringify(draftPayload),
      signal: AbortSignal.timeout(30_000),
    })
  } catch (err) {
    console.error('[publish/wechat-draft] 网络请求失败:', err)
    return NextResponse.json(
      { error: '无法连接 md2wechat 服务，请稍后重试。' },
      { status: 502 },
    )
  }

  const upstreamText = await upstreamResponse.text()

  if (!upstreamResponse.ok) {
    console.error(`[publish/wechat-draft] upstream status: ${upstreamResponse.status}`)
    return NextResponse.json(
      {
        error: `创建草稿失败（HTTP ${upstreamResponse.status}）。请检查公众号和排版服务配置。`,
      },
      { status: 502 },
    )
  }

  try {
    const json = JSON.parse(upstreamText)
    return NextResponse.json({
      success: true,
      message: '草稿已创建成功！已自动注入网站回流链接。请前往微信公众号后台"草稿箱"审核后手动发布。',
      backlinkAdded: true,
      data: json,
    })
  } catch {
    return NextResponse.json({
      success: true,
      message: '草稿已创建成功！已自动注入网站回流链接。请前往微信公众号后台"草稿箱"审核后手动发布。',
      backlinkAdded: true,
      data: null,
    })
  }
}
