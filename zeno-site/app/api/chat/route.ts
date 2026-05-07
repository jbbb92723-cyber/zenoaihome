/**
 * AI Chat API — Zeno 智能问答接口
 *
 * 设计原则：
 * 1. 优先调用真实大模型（DeepSeek / OpenAI 兼容协议），用一段写死的系统提示词
 *    把 Zeno 的人设、使命和边界注入。
 * 2. 没有配置 LLM_API_KEY 时，自动回退到关键词知识库——保证未配置 Key 的环境
 *    （比如本地开发、首次部署）也不报错。
 * 3. 所有用户问题在 server 端落地，浏览器端不直接持有 API Key。
 *
 * 环境变量：
 *   LLM_API_KEY       必填（接 LLM 时）— DeepSeek / OpenAI 等服务的 API Key
 *   LLM_BASE_URL      可选 — 默认 https://api.deepseek.com/v1
 *   LLM_MODEL         可选 — 默认 deepseek-chat
 */

import { NextRequest, NextResponse } from 'next/server'

interface ChatRequest {
  message: string
  locale?: 'zh' | 'en'
  /** 历史消息，用于多轮上下文，可选 */
  history?: { role: 'user' | 'assistant'; content: string }[]
}

// ─────────────────────────────────────────────
// Zeno 系统提示词
// 这段决定了 AI 客服的"人格"。改这里 = 改全站 AI 助手的行为。
// ─────────────────────────────────────────────

const SYSTEM_PROMPT_ZH = `你是 Zeno（赞诺）的网站 AI 助手。Zeno 是一位有 16 年装修一线经验、现在用 AI 把经验做成工具和内容的人。

【你的使命】
帮助装修行业更健康地发展，帮助普通用户在装修这件事上少踩坑、少花冤枉钱、住得更舒展。
你的成功标准只有一个：用户问完之后，更看得清自己面前的问题，而不是被推着买东西。

【说话方式】
- 像 Zeno 本人在说话：真实、温和、克制、有判断力，但不端着、不说教。
- 一句话能说完的不写两句。
- 不用"赋能 / 打造 / 解锁 / 沉淀 / 价值体系 / 一站式 / 解决方案"这类词。
- 不用 emoji，不用感叹号开头/结尾。
- 不夸大、不承诺"省一万块""效果翻倍"这类数字。
- 不冒充 Zeno 本人。如果用户要求约见、看具体材料、做具体诊断，礼貌引导到 /contact。

【知识范围】
- 装修：报价、预算、合同、水电、主材、施工、验收、真实居住选择。
- AI 实践：把 AI 接进真实工作流（内容、客户沟通、报价分析等）。
- 一人公司：用 AI、内容、产品化摆脱重交付。
- 网站本身：服务、工具、资料、文章入口。

【边界】
- 不知道的事直说不知道，不要编造数字、案例、合同条款、法律条文。
- 不替用户做最终决定，只帮看清几个数字、几个口子、几个选项。
- 不替任何品牌做推荐或贬低。
- 涉及合同、法律、人身安全的问题，提醒用户找对应专业人士。

【常用站内链接】（适当时给出，每条单独一行，前面加 →）
- 报价避坑指南：/pricing/baojia-guide
- 预算风险自测：/tools/budget-risk
- 工具与资料库：/resources
- 服务（看报价 / 预算结构诊断 / AI 工作流）：/services
- 联系 Zeno：/contact
- 文章博客：/blog

【回复长度】
- 默认 3-6 句话以内。
- 涉及清单类问题最多列 5 条，超过 5 条就建议用户去对应文章或工具。`

const SYSTEM_PROMPT_EN = `You are the website assistant for Zeno — a person with 16 years of hands-on renovation experience who now builds tools and content using AI.

Your mission: help the renovation industry become healthier, and help ordinary users avoid common pitfalls and overspending.

Voice: real, calm, restrained, with judgment but never preachy. No marketing words like "empower", "unlock", "one-stop solution". No emojis. No exaggerated promises.

Boundaries: don't impersonate Zeno, don't fabricate numbers/cases, don't make legal or contractual judgments. For specific case review, point users to /contact.

Useful links (use when relevant, one per line prefixed with →):
- Quote pitfall guide: /pricing/baojia-guide
- Budget risk self-check: /tools/budget-risk
- Tools & resources: /en/resources
- Services: /en/services
- Contact: /en/about

Keep replies to 3-6 sentences when possible.`

// ─────────────────────────────────────────────
// 关键词回退知识库（无 LLM Key 时使用）
// ─────────────────────────────────────────────

const KNOWLEDGE_ZH: Record<string, string> = {
  '预算|花多少钱|费用': '预算建议拆成四块来看：硬装基础、主材、家电家具、应急 buffer（10-20%）。如果你想快速判断自己的预算结构有没有问题，可以做一次 10 分钟的自测。\n\n→ /tools/budget-risk\n→ /blog/zhuangxiu-yusuan-weishenme-zongchao',
  '报价|报价单': '看报价单先盯三个地方：有没有漏项、单价是不是含辅材和人工、有没有"按实际发生计算"这种留口子的描述。完整的检查表在指南里。\n\n→ /pricing/baojia-guide\n→ /blog/baojia-dan-zenme-kan',
  '服务|合作|咨询': 'Zeno 现在主要做三件事：报价单审核、预算结构诊断、AI 工作流咨询。如果你想直接说说你的情况，发到 /contact 就可以。\n\n→ /services\n→ /contact',
  'AI|人工智能|提示词': 'AI 我主要用来做内容生产、报价分析、客户沟通三件事。提示词体验场可以直接试。\n\n→ /tools/prompts',
  '工具|资料': '工具库按装修阶段分了四块：装修前判断、装修中落地、真实居住选择、AI 辅助。最常用的是报价指南和预算自测。\n\n→ /resources\n→ /tools/budget-risk',
  '关于|你是谁': '我是 Zeno 网站的 AI 助手。Zeno 本人做了 16 年装修，现在用 AI 把经验做成工具。这里不是装修公司，不卖建材。\n\n→ /about',
  '联系|微信|公众号': '直接联系：微信 zanxiansheng2025，邮箱 zenoaihome@qq.com。\n\n→ /contact',
}

const KNOWLEDGE_EN: Record<string, string> = {
  'budget|cost|price': 'Split your renovation budget into four blocks: base construction, main materials, appliances/furniture, and a 10-20% buffer. Try the 10-minute self-check.\n\n→ /tools/budget-risk',
  'quote|quotation': 'Three things to check first: missing items, whether unit prices include materials and labor, and any "settled by actual usage" wording. Full checklist in the guide.\n\n→ /pricing/baojia-guide',
  'service|consult': 'Three core services: quote review, budget consulting, AI workflow consulting.\n\n→ /en/services',
  'AI|prompt': 'I use AI mostly for content, quote analysis, and client communication. Try the prompt playground.\n\n→ /en/tools/prompts',
  'tool|resource': 'Tools are organized by renovation stage. Most-used: quote guide and budget self-check.\n\n→ /en/resources',
  'about|who': 'I am the AI assistant on Zeno\'s website. Zeno spent 16 years in renovation, now uses AI to turn that experience into tools.\n\n→ /en/about',
  'contact|email': 'Email: zenoaihome@qq.com.\n\n→ /en/about',
}

function fallbackAnswer(message: string, locale: 'zh' | 'en'): string {
  const knowledge = locale === 'en' ? KNOWLEDGE_EN : KNOWLEDGE_ZH
  const lower = message.toLowerCase()
  for (const [pattern, answer] of Object.entries(knowledge)) {
    if (pattern.split('|').some((kw) => lower.includes(kw.toLowerCase()))) {
      return answer
    }
  }
  return locale === 'en'
    ? "I don't have a specific answer yet. Browse the articles or contact Zeno directly.\n\n→ /en/blog\n→ /en/about"
    : '这个问题我暂时没有合适的回答。可以浏览文章和工具，或者直接联系 Zeno。\n\n→ /blog\n→ /resources\n→ /contact'
}

// ─────────────────────────────────────────────
// LLM 调用（OpenAI 兼容协议）
// ─────────────────────────────────────────────

async function callLLM(
  message: string,
  history: ChatRequest['history'] = [],
  locale: 'zh' | 'en'
): Promise<string | null> {
  const apiKey = process.env.LLM_API_KEY
  if (!apiKey) return null

  const baseUrl = process.env.LLM_BASE_URL || 'https://api.deepseek.com/v1'
  const model = process.env.LLM_MODEL || 'deepseek-chat'

  // 控制上下文长度：只取最近 6 轮
  const recent = (history || []).slice(-6)

  const messages = [
    { role: 'system', content: locale === 'en' ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_ZH },
    ...recent,
    { role: 'user', content: message },
  ]

  try {
    // 12 秒超时，避免聊天面板长时间转圈
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 12_000)

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.4,
        max_tokens: 600,
      }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) return null
    const data = await res.json()
    const reply = data?.choices?.[0]?.message?.content
    return typeof reply === 'string' && reply.trim().length > 0 ? reply.trim() : null
  } catch {
    return null
  }
}

// ─────────────────────────────────────────────
// HTTP handler
// ─────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { message, locale = 'zh', history } = body

    if (!message || typeof message !== 'string' || message.length > 1000) {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }

    const trimmed = message.trim()
    const llmReply = await callLLM(trimmed, history, locale)
    const reply = llmReply ?? fallbackAnswer(trimmed, locale)

    return NextResponse.json({ reply, source: llmReply ? 'llm' : 'fallback' })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
