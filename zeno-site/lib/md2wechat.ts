/**
 * lib/md2wechat.ts
 *
 * md2wechat API 服务端封装
 *
 * 接口文档：https://md2wechat.cn/api-docs
 * 服务域名：md2wechat.cn / md2wechat.app（通过 MD2WECHAT_BASE_URL 配置）
 *
 * ⚠️ 此模块只能在服务端（Server Component / API Route）调用，绝不能导入到客户端代码。
 */

// ─── 类型定义 ──────────────────────────────────────────────────

export interface ConvertParams {
  markdown: string
  theme?: string       // 'default' | 'bytedance' | 'apple' | 'github-readme' | 'elegant-gold' | ...
  fontSize?: string    // 'small' | 'medium' | 'large'
  backgroundType?: string  // 'default' | 'grid' | 'none'
}

export interface ConvertResult {
  html: string
  theme: string
  fontSize: string
  wordCount: number
  estimatedReadTime: number
}

export interface DraftParams {
  markdown: string
  theme?: string
  fontSize?: string
  coverImageUrl?: string  // 必须是 HTTPS 公网链接
}

export interface DraftResult {
  draftId: string
  html: string
  theme: string
  fontSize: string
  wordCount: number
}

// ─── 内部工具 ──────────────────────────────────────────────────

function getBaseUrl(): string {
  const base = process.env.MD2WECHAT_BASE_URL
  if (!base) {
    throw new Error('MD2WECHAT_BASE_URL 环境变量未配置。请填写 md2wechat API 服务地址，例如：https://md2wechat.cn')
  }
  return base.replace(/\/$/, '')
}

function getApiKey(): string {
  const key = process.env.MD2WECHAT_API_KEY
  if (!key) {
    throw new Error('MD2WECHAT_API_KEY 环境变量未配置。')
  }
  return key
}

function getWechatHeaders(): Record<string, string> {
  const appid  = process.env.WECHAT_APPID
  const secret = process.env.WECHAT_APP_SECRET
  if (!appid || !secret) {
    throw new Error('WECHAT_APPID 或 WECHAT_APP_SECRET 未配置，草稿接口无法调用。')
  }
  return {
    'Wechat-Appid':       appid,
    'Wechat-App-Secret':  secret,
  }
}

// ─── 公开 API ──────────────────────────────────────────────────

/**
 * 将 Markdown 转换为微信公众号 HTML
 * 对应接口：POST /api/v1/convert
 */
export async function convertMarkdownToWechat(params: ConvertParams): Promise<ConvertResult> {
  const baseUrl  = getBaseUrl()
  const apiKey   = getApiKey()

  const res = await fetch(`${baseUrl}/api/v1/convert`, {
    method:  'POST',
    headers: {
      'Content-Type':      'application/json',
      'Md2wechat-API-Key': apiKey,
    },
    body: JSON.stringify({
      markdown:         params.markdown,
      theme:            params.theme            ?? 'default',
      fontSize:         params.fontSize         ?? 'medium',
      backgroundType:   params.backgroundType   ?? 'default',
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`md2wechat convert 请求失败 (${res.status})：${text}`)
  }

  const json = await res.json()

  if (json.code !== 0) {
    throw new Error(`md2wechat convert 返回错误：${json.message ?? JSON.stringify(json)}`)
  }

  return {
    html:               json.data.html              ?? '',
    theme:              json.data.theme             ?? params.theme ?? 'default',
    fontSize:           json.data.fontSize          ?? params.fontSize ?? 'medium',
    wordCount:          json.data.wordCount         ?? 0,
    estimatedReadTime:  json.data.estimatedReadTime ?? 0,
  }
}

/**
 * 在微信公众号后台创建图文草稿
 * 对应接口：POST /article-draft
 *
 * 注意：coverImageUrl 必须是 HTTPS 公网链接。
 */
export async function createWechatDraft(params: DraftParams): Promise<DraftResult> {
  const baseUrl = getBaseUrl()
  const apiKey  = getApiKey()
  const wechat  = getWechatHeaders()

  const res = await fetch(`${baseUrl}/article-draft`, {
    method:  'POST',
    headers: {
      'Content-Type':      'application/json',
      'Md2wechat-API-Key': apiKey,
      ...wechat,
    },
    body: JSON.stringify({
      markdown:       params.markdown,
      theme:          params.theme        ?? 'default',
      fontSize:       params.fontSize     ?? 'medium',
      coverImageUrl:  params.coverImageUrl ?? '',
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`md2wechat article-draft 请求失败 (${res.status})：${text}`)
  }

  const json = await res.json()

  if (json.code !== 0) {
    throw new Error(`md2wechat article-draft 返回错误：${json.message ?? JSON.stringify(json)}`)
  }

  return {
    draftId:   json.data.draft_id         ?? '',
    html:      json.data.html             ?? '',
    theme:     json.data.theme            ?? params.theme ?? 'default',
    fontSize:  json.data.fontSize         ?? 'medium',
    wordCount: json.data.wordCount        ?? 0,
  }
}

/**
 * 批量上传素材（预留，TODO：补充接口实现）
 * 对应接口：POST /batch-upload
 */
export async function uploadAssets(_params: unknown): Promise<never> {
  // TODO：实现批量素材上传
  // 接口地址：POST /batch-upload
  // 请求头：同 createWechatDraft
  // 参考文档：https://md2wechat.cn/api-docs
  throw new Error('uploadAssets 尚未实现，请参考 md2wechat 文档补充。')
}
