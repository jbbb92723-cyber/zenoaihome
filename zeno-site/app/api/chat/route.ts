import { NextRequest, NextResponse } from 'next/server'

/**
 * AI Chat API - 智能问答接口
 *
 * 当前实现：基于关键词匹配的预设回复系统（无需外部 AI API）
 * 未来可接入 OpenAI / DeepSeek / 其他 LLM API
 *
 * 安全边界：
 * - 不暴露任何内部系统信息
 * - 不执行任何数据库写操作
 * - 限制回复长度
 */

interface ChatRequest {
  message: string
  locale?: 'zh' | 'en'
}

// 预设知识库（中文）
const KNOWLEDGE_ZH: Record<string, string> = {
  '预算|花多少钱|费用|价格': '装修预算建议做"三层结构"：硬装基础层（占 50-60%）、软装生活层（占 25-30%）、应急备用层（留 10-15%）。建议先看我的文章《装修预算为什么总超》，或直接使用资料库里的预算模板。\n\n→ /blog/zhuangxiu-yusuan-weishenme-zongchao\n→ /resources',
  '报价|报价单|怎么看': '报价单要重点看三个地方：①单价是否含辅材和人工 ②面积计算方式（展开面积 vs 投影面积）③是否有"暂估项"和"另计项"。建议用我的报价审核清单逐条对照。\n\n→ /blog/baojia-dan-zenme-kan\n→ /resources',
  '服务|合作|咨询': 'Zeno 目前提供三类服务：\n1. 装修报价诊断（¥699/份）\n2. AI 内容系统咨询（¥1999/次）\n3. 实住派装修服务（限南宁，¥9800起）\n\n→ /services',
  'AI|人工智能|提示词': '我用 AI 主要做三件事：内容生产（选题+写作+排版）、工具开发（提示词系统+在线工具）、客户服务（智能问答+报价分析）。你可以先体验 AI 提示词体验场。\n\n→ /tools/prompts\n→ /blog/04-wei-shenme-wo-kaishi-renzheng-xue-ai',
  '工具|资料|模板|下载': '资料库里目前有：装修预算模板、报价审核清单、竣工验收清单、AI 内容提示词包。全部免费，关注公众号回复关键词即可领取。\n\n→ /resources',
  '关于|你是谁|介绍': '我是 Zeno（赞诺），装修行业 16 年从业者。现在用 AI、开发和内容，把一线经验做成工具、资料和服务。这个网站是我的长期实验场——不是装修公司官网，而是一个一人公司系统。\n\n→ /about',
  '联系|微信|公众号': '你可以通过以下方式联系我：\n• 公众号：Zeno AI装修笔记\n• 微信：zanxiansheng2025\n• 邮箱：zenoaihome@qq.com\n\n→ /contact',
}

// 预设知识库（英文）
const KNOWLEDGE_EN: Record<string, string> = {
  'budget|cost|price|how much': 'I recommend a three-layer budget structure: Core construction (50-60%), furnishing & lifestyle (25-30%), and contingency buffer (10-15%). Check my article on why renovation budgets always overrun.\n\n→ /en/blog',
  'quote|quotation|review': 'When reviewing a quote, focus on: ① Are unit prices inclusive of materials and labor? ② How is area calculated? ③ Are there "provisional items" or "additional charges"? Use my free checklist.\n\n→ /en/resources',
  'service|work with|consult': 'I offer three types of services:\n1. Renovation Quote Review (¥699/quote)\n2. AI Content System Consulting (¥1,999/session)\n3. Real-Living Renovation (Nanning only, from ¥9,800)\n\n→ /en/services',
  'AI|artificial intelligence|prompt': 'I use AI for three things: content production, tool development, and client service automation. You can try my AI Prompt Playground to get started.\n\n→ /en/tools/prompts',
  'tool|resource|template|download': 'The resource library includes: renovation budget template, quote review checklist, final acceptance checklist, and AI content prompt pack. All free.\n\n→ /en/resources',
  'about|who are you': 'I\'m Zeno — 16 years in renovation, now building a one-person business using AI, content, and digital products. This site is my long-term experiment.\n\n→ /en/about',
  'contact|email|reach': 'You can reach me at: zenoaihome@qq.com\n\n→ /en/about',
}

function findAnswer(message: string, locale: string): string {
  const knowledge = locale === 'en' ? KNOWLEDGE_EN : KNOWLEDGE_ZH
  const lowerMsg = message.toLowerCase()

  for (const [pattern, answer] of Object.entries(knowledge)) {
    const keywords = pattern.split('|')
    if (keywords.some((kw) => lowerMsg.includes(kw.toLowerCase()))) {
      return answer
    }
  }

  // Default response
  if (locale === 'en') {
    return "I don't have a specific answer for that yet. You can browse my articles, check the resource library, or contact me directly.\n\n→ /en/blog\n→ /en/resources\n→ /en/about"
  }
  return '这个问题我暂时没有预设回复。你可以浏览文章、查看资料库，或者直接联系我。\n\n→ /blog\n→ /resources\n→ /contact'
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { message, locale = 'zh' } = body

    if (!message || typeof message !== 'string' || message.length > 500) {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }

    const reply = findAnswer(message.trim(), locale)

    return NextResponse.json({ reply })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
