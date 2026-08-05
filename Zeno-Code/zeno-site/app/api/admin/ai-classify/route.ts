import { NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyApiRequest } from '@/lib/api-auth'
import { createAiChatCompletion } from '@/lib/integrations/ai/client'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

const requestSchema = z.object({
  message: z.string().max(5000).nullish(),
  serviceType: z.string().max(100).nullish(),
})

const CATEGORIES = new Set([
  'quote_review',
  'contract_review',
  'budget',
  'construction',
  'living_diagnosis',
  'general',
])

const CLASSIFY_PROMPT = `你是装修咨询分类助手。根据业主的问题内容，判断属于以下哪一类：

- quote_review: 报价相关的咨询（看报价、比价、审核报价单）
- contract_review: 合同相关的咨询（签合同、条款、法律风险）
- budget: 预算相关的咨询（预算够不够、多少钱、超预算）
- construction: 施工相关的咨询（施工质量、验收、已经开工了）
- living_diagnosis: 居住需求诊断（还没想好装什么、风格、户型规划）
- general: 综合咨询或不确定类型

只返回分类代码（如 quote_review），不要返回额外文字。`

function classifyByKeyword(text: string) {
  const normalized = text.toLowerCase()
  if (normalized.includes('报价') || normalized.includes('报价单') || normalized.includes('比价') || normalized.includes('价格')) return 'quote_review'
  if (normalized.includes('合同') || normalized.includes('签约') || normalized.includes('条款')) return 'contract_review'
  if (normalized.includes('预算') || normalized.includes('多少钱') || normalized.includes('超支') || normalized.includes('贵不贵')) return 'budget'
  if (normalized.includes('施工') || normalized.includes('验收') || normalized.includes('开工') || normalized.includes('工地')) return 'construction'
  if (normalized.includes('装修') || normalized.includes('风格') || normalized.includes('户型') || normalized.includes('设计')) return 'living_diagnosis'
  return 'general'
}

export async function POST(request: Request) {
  if (!(await verifyApiRequest(request))) {
    return NextResponse.json({ ok: false, error: '未授权' }, { status: 401 })
  }

  const limiter = checkRateLimit(`admin-ai-classify:${getClientIp(request)}`, 60, 60 * 60_000)
  if (!limiter.allowed) {
    return NextResponse.json({ ok: false, error: '请求过于频繁，请稍后再试' }, { status: 429 })
  }

  let fallbackText = ''
  try {
    const parsed = requestSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: '请求参数无效' }, { status: 422 })
    }

    const { message, serviceType } = parsed.data
    const text = message || serviceType || ''
    fallbackText = text
    if (!text.trim()) {
      return NextResponse.json({ category: 'general' })
    }

    const completion = await createAiChatCompletion({
      task: 'classification',
      messages: [
        { role: 'system', content: CLASSIFY_PROMPT },
        { role: 'user', content: text.slice(0, 500) },
      ],
      temperature: 0.1,
      maxTokens: 20,
      timeoutMs: 12_000,
    })

    if (!completion) return NextResponse.json({ category: classifyByKeyword(text), source: 'rules' })
    const candidate = completion.content
    const category = CATEGORIES.has(candidate) ? candidate : 'general'
    return NextResponse.json({
      category,
      source: 'model',
      provider: completion.provider,
      model: completion.model,
    })
  } catch (error) {
    console.error('Classify error:', error instanceof Error ? error.name : 'unknown')
    return NextResponse.json({ category: classifyByKeyword(fallbackText), source: 'fallback' })
  }
}
