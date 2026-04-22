/**
 * lib/volcengine-image.ts
 *
 * 火山引擎豆包图片生成服务端封装
 * 文档：https://www.volcengine.com/product/doubao
 *
 * ⚠️ 此模块只能在服务端调用，VOLCENGINE_ARK_API_KEY 绝不能暴露给前端。
 *
 * 环境变量：
 * - VOLCENGINE_ARK_API_KEY  火山方舟 API Key
 * - VOLCENGINE_IMAGE_BASE_URL  API 基础地址（默认 https://ark.cn-beijing.volces.com/api/v3）
 * - VOLCENGINE_IMAGE_MODEL  模型 ID（不写死，从环境变量读取）
 * - VOLCENGINE_IMAGE_PRICE_PER_IMAGE  单张成本（元），用于 estimatedCost 字段
 */

// ─── 类型定义 ──────────────────────────────────────────────────

export type ImageUsage = 'cover' | 'inline'

export interface ImageGenerateParams {
  prompt: string
  articleTitle?: string
  articleSummary?: string
  usage?: ImageUsage
  style?: string   // TODO：根据豆包实际支持的风格参数填写
  size?: string    // 例如 '2560x1440' | '1024x1024'
}

export interface ImageGenerateResult {
  imageUrl?: string
  imageBase64?: string
  model: string
  estimatedCost: number  // 元
  raw?: unknown
}

// ─── 内部工具 ──────────────────────────────────────────────────

function getConfig(): { apiKey: string; baseUrl: string; model: string; pricePerImage: number } {
  const apiKey = process.env.VOLCENGINE_ARK_API_KEY
  if (!apiKey) {
    throw new Error('VOLCENGINE_ARK_API_KEY 环境变量未配置。请在火山控制台获取 API Key。')
  }

  const model = process.env.VOLCENGINE_IMAGE_MODEL
  if (!model) {
    throw new Error(
      'VOLCENGINE_IMAGE_MODEL 环境变量未配置。请填写豆包图片生成模型 ID，例如：doubao-seedream-3-0-t2i-250415',
    )
  }

  const baseUrl = (
    process.env.VOLCENGINE_IMAGE_BASE_URL ?? 'https://ark.cn-beijing.volces.com/api/v3'
  ).replace(/\/$/, '')

  const pricePerImage = parseFloat(process.env.VOLCENGINE_IMAGE_PRICE_PER_IMAGE ?? '0.22')

  return { apiKey, baseUrl, model, pricePerImage }
}

// ─── 公开 API ──────────────────────────────────────────────────

/**
 * 调用火山引擎豆包生成图片
 * 接口：POST {baseUrl}/images/generations
 *
 * TODO：豆包图片生成接口的完整字段（尤其 style、seed 等）请以火山控制台实际文档为准。
 *       当前实现基于 OpenAI 兼容格式（火山方舟支持）。
 */
async function generateImage(params: ImageGenerateParams): Promise<ImageGenerateResult> {
  const { apiKey, baseUrl, model, pricePerImage } = getConfig()

  const size = params.size ?? '1024x1024'

  // TODO：如果豆包支持 system prompt 风格指令，可在此处补充
  const requestBody: Record<string, unknown> = {
    model,
    prompt: params.prompt,
    n: 1,
    size,
    // TODO：response_format: 'url' 或 'b64_json'（根据需要切换）
    response_format: 'url',
  }

  const res = await fetch(`${baseUrl}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`火山引擎图片生成请求失败 (${res.status})：${text}`)
  }

  const json = await res.json()

  if (json.error) {
    throw new Error(`火山引擎图片生成错误：${json.error.message ?? JSON.stringify(json.error)}`)
  }

  const first = json.data?.[0]
  return {
    imageUrl:      first?.url       ?? undefined,
    imageBase64:   first?.b64_json  ?? undefined,
    model,
    estimatedCost: pricePerImage,
    raw:           json,
  }
}

/**
 * 生成微信公众号封面图
 */
export async function generateWechatCoverImage(
  params: ImageGenerateParams,
): Promise<ImageGenerateResult> {
  return generateImage({ ...params, usage: 'cover' })
}

/**
 * 生成文中配图
 */
export async function generateArticleImage(
  params: ImageGenerateParams,
): Promise<ImageGenerateResult> {
  return generateImage({ ...params, usage: 'inline' })
}
