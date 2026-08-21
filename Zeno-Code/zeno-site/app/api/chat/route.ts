/**
 * AI Chat API — Zeno 智能问答接口
 *
 * 设计原则：
 * 1. 优先通过统一 Provider 适配器调用 OpenAI 兼容协议，用一段写死的系统提示词
 *    把 Zeno 的人设、使命和边界注入。
 * 2. 没有配置 Provider 时，自动回退到关键词知识库——保证未配置 Key 的环境
 *    （比如本地开发、首次部署）也不报错。
 * 3. 所有用户问题在 server 端落地，浏览器端不直接持有 API Key。
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { createAiChatCompletion, type AiMessage } from '@/lib/integrations/ai/client'
import { getAiTaskStatus } from '@/lib/integrations/ai/config'
import {
  buildAssistantSiteContext,
  findRelevantAssistantRisks,
} from '@/lib/assistant/site-context'
import { buildAssistantSystemPrompt } from '@/lib/assistant/system-prompt'
import { routeAssistantIntent } from '@/lib/assistant/intent-router'
import {
  AssistantImageInputError,
  parseAssistantImage,
  type AssistantImageInput,
} from '@/lib/assistant/image-input'
import { isRenovationArchiveEnabled } from '@/lib/domains/renovation-archive/feature'
import type {
  AssistantCard,
  AssistantPersona,
  ChatAction,
  ChatActionKind,
} from '@/lib/assistant/contracts'
import { articles } from '@/data/content/articles'
import { checklistTemplates } from '@/data/risk-control/checklist-templates'
import { quoteRiskRules } from '@/data/risk-control/quote-risk-rules'
import { renovationProjectRisks } from '@/data/risk-control/renovation-project-risks'
import { SERVICE_PRICING } from '@/data/services/pricing'

interface ChatRequest {
  message: string
  locale?: 'zh' | 'en'
  /** 历史消息，用于多轮上下文，可选 */
  history?: { role: 'user' | 'assistant'; content: string }[]
  /** 用户打开助手时所在的页面，用于判断当前任务背景 */
  pagePath?: string
  /** 当前轮临时图片；不写入对话历史或数据库 */
  image?: AssistantImageInput
}

const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(1000),
  locale: z.enum(['zh', 'en']).default('zh'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().trim().min(1).max(2000),
  })).max(12).optional(),
  pagePath: z.string().trim().regex(/^\/(?!\/)[A-Za-z0-9/_-]*$/).max(160).optional(),
  image: z.object({
    dataUrl: z.string().max(2_800_000),
    name: z.string().trim().max(100).optional(),
  }).optional(),
})

interface ChatReplyPayload {
  reply: string
  bullets?: string[]
  actions?: ChatAction[]
  followUps?: string[]
}

// ─────────────────────────────────────────────
// 关键词回退知识库（无 LLM Key 时使用）
// ─────────────────────────────────────────────

const ROUTE_LABELS: Record<'zh' | 'en', Record<string, string>> = {
  zh: {
    '/about': '了解 Zeno',
    '/account/renovation': '打开我的装修档案',
    '/blog': '先看相关文章',
    '/contact': '直接联系 Zeno',
    '/checklists': '看签约前检查模板',
    '/checklists/contract-pre-signing-check': '看合同检查模板',
    '/checklists/payment-milestone-check': '看付款节点检查模板',
    '/checklists/project-record-keeping': '看工程签约与留痕清单',
    '/project-risks': '看施工项目风险库',
    '/risk-dictionary': '查装修报价风险词典',
    '/living-diagnosis': '先做居住需求自检',
    '/services': '看服务路径',
    '/services/diagnosis': `了解${SERVICE_PRICING.diagnosis.displayPrice}单问题判断诊断`,
    '/services/quote-review': `了解${SERVICE_PRICING.renovationSpecialist.displayPrice}装修专项判断`,
    '/services/node-advisor': '了解施工节点专项判断',
    '/services/renovation-advisor': `了解${SERVICE_PRICING.renovationAdvisor.displayPrice}装修决策顾问`,
    '/tools/quote-check': '先做报价初筛',
    '/community': '了解星火者共同体',
    '/community/apply': '提交星火者申请',
    '/training': '了解 AI 实战培训',
    '/blog/zeno-from-renovation-to-opc': '读 Zeno 的转型记录',
  },
  en: {
    '/en/about': 'About Zeno',
    '/en/articles': 'Read related articles',
    '/en/services': 'View services',
    '/en/tools': 'Open tools',
  },
}

const STATIC_ACTION_HREFS = [
  '/',
  '/about',
  '/account/renovation',
  '/ai-tools',
  '/ai-tools/task-planner',
  '/blog',
  '/cases',
  '/checklists',
  '/community',
  '/community/apply',
  '/contact',
  '/living-diagnosis',
  '/opc-knowledge',
  '/practice',
  '/project-risks',
  '/renovation',
  '/resources',
  '/risk-dictionary',
  '/services',
  '/services/diagnosis',
  '/services/node-advisor',
  '/services/quote-review',
  '/services/renovation-advisor',
  '/tools',
  '/tools/quote-check',
  '/training',
  '/en',
  '/en/about',
  '/en/articles',
  '/en/services',
  '/en/tools',
]

const ALLOWED_ACTION_HREFS = new Set([
  ...STATIC_ACTION_HREFS,
  ...articles.map((article) => `/blog/${article.slug}`),
  ...checklistTemplates.map((checklist) => `/checklists/${checklist.slug}`),
  ...quoteRiskRules.map((rule) => `/risk-dictionary/${rule.slug}`),
  ...renovationProjectRisks.map((risk) => `/project-risks/${risk.slug}`),
])

const RECORD_KEEPING_TOPIC_ZH =
  /工程签证|签证单|变更确认|增项确认|材料代购|代购垫付|返工|窝工|留痕|聊天记录|付款凭证|进度汇总/i

type IntentKey = 'greeting' | 'living' | 'budget' | 'quote' | 'service' | 'ai' | 'tools' | 'about' | 'contact' | 'default'

const FOLLOW_UPS_ZH: Record<IntentKey, string[]> = {
  greeting: ['我还没定方案', '我在看报价单', '我怕装修超预算'],
  living: ['我想要好看又好住', '我不知道预算该先投哪里', '我已经有方案但不确定适不适合'],
  budget: ['我已经拿到报价单了', '我预算 20 万够不够', '我最怕后期增项'],
  quote: ['你先教我怎么看漏项', '这种按实际发生怎么算风险', '我该选哪项服务'],
  service: ['一个问题该选哪项服务', '专项协作适合什么任务', '项目顾问适合什么情况'],
  ai: ['我想先解决一个具体 AI 问题', '我想做一项工作流或培训实操', '我想做知识库、智能体或网站项目'],
  tools: ['我现在最该先用哪个入口', '还没定方案先用什么', '已有报价先看哪里'],
  about: ['Zeno 主要帮什么人', '你和装修公司有什么区别', '我想先看你的文章'],
  contact: ['我该怎么描述我的情况', '联系前要准备什么', '我先看工具还是直接联系'],
  default: ['我现在最该先看哪里', '先给我一个最省时间的入口', '我该先用工具还是先看文章'],
}

const FOLLOW_UPS_EN: Record<IntentKey, string[]> = {
  greeting: ['I am checking a quote', 'I worry about budget overrun', 'The project has started'],
  living: ['I have not fixed the plan yet', 'I want a home that looks good and works', 'I already have a plan but I am unsure'],
  budget: ['I already have a quote', 'Is my budget enough', 'I fear change orders'],
  quote: ['How do I spot missing items', 'What does actual usage settlement mean', 'Should I ask for manual review'],
  service: ['Which entry fits my case', 'What is a focused collaboration', 'What belongs in project advising'],
  ai: ['Which workflow should AI improve first', 'Should I start with a focused task', 'Do I need a knowledge base or agent project'],
  tools: ['Which tool should I start with', 'Which resource should I read first', 'Where do I check budget risk'],
  about: ['Who is Zeno for', 'How is this different from a contractor', 'Show me the writing first'],
  contact: ['What details should I send first', 'What should I prepare before contacting', 'Should I use tools first'],
  default: ['Show me the fastest next step', 'Should I start with a tool or article', 'What is the right entry for me'],
}

const KNOWLEDGE_ZH: Array<{ pattern: RegExp; intent: IntentKey; payload: ChatReplyPayload }> = [
  {
    pattern: /一人公司|OPC|如何转型|怎么转型|你一个人怎么做|一个人怎么做|用的什么工具|经验.{0,8}(变成|做成|整理成).{0,6}(资产|方法)|AI.{0,8}(工作流|真实工作)/i,
    intent: 'ai',
    payload: {
      reply: 'Zeno 的做法不是让 AI 替代经验，而是先把真实工作里的材料、判断步骤和验收标准整理出来，再让 AI 承担可重复的整理与比较。核心是“用 AI 做复用，把时间留给交付”，方向、关系、风险和最终确认仍由人负责。',
      bullets: [
        '先从一项反复发生、结果可检查的真实任务开始。',
        '保留原始材料和人工复核，不把模型输出当成事实。',
      ],
      actions: [
        { label: '读 Zeno 的转型记录', href: '/blog/zeno-from-renovation-to-opc', kind: 'article' },
      ],
      followUps: ['我该从哪项重复工作开始', '怎么把经验整理成可复用步骤'],
    },
  },
  {
    pattern: /^(你好|您好|嗨|在吗|有人吗)$/,
    intent: 'greeting',
    payload: {
      reply: '在。你不用先把问题讲得很完整，直接告诉我你现在在哪个阶段，或者你手上已经有什么材料。',
      bullets: [
        '比如你可以直接说：我在看报价单。',
        '或者说：我怕预算超支。',
        '也可以说：已经开工了，现在最该盯什么。',
      ],
      actions: [
        { label: '先做居住需求自检', href: '/living-diagnosis', kind: 'tool' },
        { label: '先做报价初筛', href: '/tools/quote-check', kind: 'tool' },
        { label: '看服务路径', href: '/services', kind: 'service' },
      ],
      followUps: FOLLOW_UPS_ZH.greeting,
    },
  },
  {
    pattern: /方案|风格|审美|生活|居住|户型|动线|收纳|家庭|老人|孩子|宠物|办公|好看|好住/,
    intent: 'living',
    payload: {
      reply: '如果还没定方案，先别急着选风格。更重要的是把你家怎么住、谁在用、哪些场景最常发生、预算最该投在哪里说清楚。',
      bullets: [
        '先看生活方式和家庭场景，再看审美偏好。',
        '把家务、收纳、陪伴、独处和社交放进空间优先级。',
        '等方案方向稳定后，再看报价能不能承接这些选择。',
      ],
      actions: [
        { label: '先做居住需求自检', href: '/living-diagnosis', kind: 'tool' },
        { label: '继续做居住需求自检', href: '/living-diagnosis', kind: 'service' },
        { label: '看文章判断库', href: '/blog', kind: 'article' },
      ],
      followUps: FOLLOW_UPS_ZH.living,
    },
  },
  {
    pattern: /预算|花多少钱|费用|超支|增项/,
    intent: 'budget',
    payload: {
      reply: '可以先帮你搭一个粗预算框架，但先别急着问总价。多数人真正出问题，不是预算低，而是钱花在哪一层还没分清。',
      bullets: [
        '先把预算拆成基础施工、主材选择、柜子收纳、设备电器、家具软装、预留机动几份钱。',
        '如果你已经拿到报价单，优先核对漏项、暂估项和“按实际发生”这类口子。',
        '如果你愿意继续聊，直接补充面积、城市、当前阶段和是否含家电家具。',
      ],
      actions: [
        { label: '先做报价初筛', href: '/tools/quote-check', kind: 'tool' },
        { label: '查风险词典', href: '/risk-dictionary', kind: 'resource' },
        { label: '看付款节点模板', href: '/checklists/payment-milestone-check', kind: 'resource' },
      ],
      followUps: FOLLOW_UPS_ZH.budget,
    },
  },
  {
    pattern: /报价|报价单/,
    intent: 'quote',
    payload: {
      reply: '报价单先别盯总价，先看它有没有故意留口子。看不清这些口子，后面再努力控制预算也会很被动。',
      bullets: [
        '先核对有没有漏项，尤其是拆除、水电、收边、成品保护这些容易后补的部分。',
        '再看单价里是否写清人工、辅材和损耗。',
        '最后看有没有“按实际发生”“暂估”这类能继续往上加钱的描述。',
      ],
      actions: [
        { label: '先做报价初筛', href: '/tools/quote-check', kind: 'tool' },
        { label: '查风险词典', href: '/risk-dictionary', kind: 'resource' },
        { label: '看报价单初查模板', href: '/checklists/quote-initial-check', kind: 'resource' },
      ],
      followUps: FOLLOW_UPS_ZH.quote,
    },
  },
  {
    pattern: /服务|合作|咨询/,
    intent: 'service',
    payload: {
      reply: '先按问题深度选择，不必为不同工作硬套同一种套餐。一个具体问题先做单问题判断诊断；一个明确 AI 任务或工作包进入专项协作；多个任务、多人协作或系统上线，再评估项目顾问。装修项目仍按自己的节点路径判断。',
      bullets: [
        `${SERVICE_PRICING.diagnosis.displayPrice}：一个问题、一次沟通和一页判断记录。`,
        `${SERVICE_PRICING.focusedCollaboration.displayPrice}：一个明确 AI 任务、工作坊、工作流工作包或阶段性交付。`,
        `${SERVICE_PRICING.projectAdvisor.displayPrice}：跨多个任务持续协作，按团队、资料和系统范围报价。`,
        `${SERVICE_PRICING.renovationSpecialist.displayPrice} 装修专项判断和 ${SERVICE_PRICING.renovationAdvisor.displayPrice} 装修决策顾问，继续按装修节点路径判断。`,
      ],
      actions: [
        { label: '看单问题判断诊断', href: '/services/diagnosis', kind: 'service' },
        { label: '看 AI 项目合作', href: '/services', kind: 'service' },
        { label: '提交项目情况', href: '/contact', kind: 'contact' },
      ],
      followUps: FOLLOW_UPS_ZH.service,
    },
  },
  {
    pattern: /AI|人工智能|提示词|培训|内训|工作坊|工作流|知识库|智能体|网站|自动化|项目顾问|项目合作/,
    intent: 'ai',
    payload: {
      reply: 'AI 在这里不是一个单独的模块，而是帮助你把真实工作往前推进的一层协作能力。先说清楚任务、材料和验收标准，再判断哪些交给 AI、哪些必须由人负责。',
      bullets: [
        '适合先交给 AI 的通常是整理、对比、查漏、生成追问和形成候选方案。',
        '你需要提供真实任务、已有材料、合格结果和不能越过的边界。',
        '涉及方案取舍、合同、付款和最终责任，仍要回到人工复核和书面确认。',
        `${SERVICE_PRICING.diagnosis.displayPrice}适合先判断一个问题；${SERVICE_PRICING.focusedCollaboration.displayPrice}适合一个明确任务或工作包；${SERVICE_PRICING.projectAdvisor.displayPrice}适合跨多个任务的项目。`,
      ],
      actions: [
        { label: '看实践与证据', href: '/practice', kind: 'page' },
        { label: '看公开 AI 工具', href: '/ai-tools', kind: 'tool' },
        { label: '说明你的工作场景', href: '/contact', kind: 'contact' },
      ],
      followUps: FOLLOW_UPS_ZH.ai,
    },
  },
  {
    pattern: /工具|资料|清单/,
    intent: 'tools',
    payload: {
      reply: '如果你还没确定要不要咨询，先走工具和资料通常更划算。先把问题分清，再决定要不要找人看。',
      bullets: [
        '还没定方案，先用居住需求自检整理生活方式和空间优先级。',
        '报价阶段再做免费报价初筛。',
        '看不懂风险词时，去风险词典查清楚。',
      ],
      actions: [
        { label: '先做居住需求自检', href: '/living-diagnosis', kind: 'tool' },
        { label: '看检查模板', href: '/checklists', kind: 'resource' },
        { label: '查风险词典', href: '/risk-dictionary', kind: 'resource' },
      ],
      followUps: FOLLOW_UPS_ZH.tools,
    },
  },
  {
    pattern: /关于|你是谁/,
    intent: 'about',
    payload: {
      reply: '我是 Zeno 网站里的判断助手。这里不是装修公司官网，也不是卖建材页面，重点是把经验做成文章、工具和服务，让你先看清问题。',
      bullets: [
        'Zeno 有 17 年传统行业经营与项目经验，长期涉及家居与装修实践。',
        '现在重点做内容、工具和有限度的人工作业。',
        '先分流，再决定是否需要联系。',
      ],
      actions: [
        { label: '了解 Zeno', href: '/about', kind: 'page' },
        { label: '先看相关文章', href: '/blog', kind: 'article' },
        { label: '查看风险词典', href: '/risk-dictionary', kind: 'resource' },
      ],
      followUps: FOLLOW_UPS_ZH.about,
    },
  },
  {
    pattern: /联系|微信|公众号/,
    intent: 'contact',
    payload: {
      reply: '可以直接联系，但最好别只发一句“在吗”。先把你的阶段、房屋情况和现在最卡的一件事说清楚，回复效率会高很多。',
      bullets: [
        '微信：zanxiansheng2025',
        '邮箱：1603165918@qq.com',
        '如果只是先判断方向，先看工具和资料也可以。',
      ],
      actions: [
        { label: '打开联系页', href: '/contact', kind: 'contact' },
        { label: '先看服务路径', href: '/services', kind: 'service' },
        { label: '先看检查模板', href: '/checklists', kind: 'resource' },
      ],
      followUps: FOLLOW_UPS_ZH.contact,
    },
  },
]

const KNOWLEDGE_EN: Array<{ pattern: RegExp; intent: IntentKey; payload: ChatReplyPayload }> = [
  {
    pattern: /^(hi|hello|hey)$/i,
    intent: 'greeting',
    payload: {
      reply: 'Here. You do not need to explain everything first. Just tell me your current stage or what you already have in hand.',
      bullets: [
        'For example: I am checking a quote.',
        'Or: I worry about budget overrun.',
        'Or: The project has already started, what should I watch first?',
      ],
      actions: [
        { label: 'Open quote tools', href: '/en/tools', kind: 'tool' },
        { label: 'View services', href: '/en/services', kind: 'service' },
      ],
      followUps: FOLLOW_UPS_EN.greeting,
    },
  },
  {
    pattern: /budget|cost|price|overrun|change order/i,
    intent: 'budget',
    payload: {
      reply: 'I can help you frame a rough budget first, but the key is not the total number yet. The real issue is usually where the money is allocated and where it can slip.',
      bullets: [
        'Split the budget into base construction, main materials, furniture/appliances, and buffer.',
        'If you already have a quote, check missing items and open-ended wording first.',
        'If you want to continue here, send area, city, current stage, and whether furniture/appliances are included.',
      ],
      actions: [
        { label: 'Open quote tools', href: '/en/tools', kind: 'tool' },
        { label: 'View services', href: '/en/services', kind: 'service' },
      ],
      followUps: FOLLOW_UPS_EN.budget,
    },
  },
  {
    pattern: /quote|quotation/i,
    intent: 'quote',
    payload: {
      reply: 'Do not start with the total price. Start with whether the quote leaves room for later additions.',
      bullets: [
        'Check for missing items first.',
        'Check whether labor and materials are clearly included.',
        'Check any wording tied to actual usage or provisional amounts.',
      ],
      actions: [
        { label: 'Open quote tools', href: '/en/tools', kind: 'tool' },
        { label: 'View services', href: '/en/services', kind: 'service' },
      ],
      followUps: FOLLOW_UPS_EN.quote,
    },
  },
  {
    pattern: /service|consult/i,
    intent: 'service',
    payload: {
      reply: 'Choose by depth rather than by a fixed package. One question starts with a single-question diagnosis; one focused AI task or work package starts at CNY 2,500; multi-task, multi-person or system projects start at CNY 12,800 and are scoped before a formal quote.',
      bullets: [
        'If you already have a quote, review is the clearest entry.',
        'If the issue is budget structure, start with budget consulting or the self-check.',
        'If you are an operator, start with one focused AI task; knowledge bases, agents and websites usually need project-level scoping.',
      ],
      actions: [
        { label: 'View services', href: '/en/services', kind: 'service' },
        { label: 'Open resources', href: '/en/tools', kind: 'resource' },
        { label: 'About Zeno', href: '/en/about', kind: 'contact' },
      ],
      followUps: FOLLOW_UPS_EN.service,
    },
  },
  {
    pattern: /ai|prompt/i,
    intent: 'ai',
    payload: {
      reply: 'AI here is meant to remove repetitive work, not fake expertise. Start with one real task, then decide whether it needs a focused collaboration or a larger project.',
      bullets: [
        'Start with the most repetitive workflow first.',
        'Use AI to structure information before using it to make decisions.',
        'One working use case is more valuable than many unfinished experiments. One question starts at CNY 299, a focused task at CNY 2,500, and a multi-task project at CNY 12,800.',
      ],
      actions: [
        { label: 'Open tools', href: '/en/tools', kind: 'tool' },
        { label: 'Open quote check', href: '/en/tools', kind: 'tool' },
        { label: 'View services', href: '/en/services', kind: 'service' },
      ],
      followUps: FOLLOW_UPS_EN.ai,
    },
  },
  {
    pattern: /tool|resource|checklist/i,
    intent: 'tools',
    payload: {
      reply: 'If you are not sure whether you need direct consulting yet, tools and resources are usually the right first step.',
      bullets: [
        'Use tools to identify the stage and risk source.',
        'Use resources when you need a checklist or reference pack.',
        'Escalate to service only after the problem is clearer.',
      ],
      actions: [
        { label: 'Open resources', href: '/en/tools', kind: 'resource' },
        { label: 'Open tools', href: '/en/tools', kind: 'tool' },
        { label: 'Run the budget self-check', href: '/tools/budget-risk', kind: 'tool' },
      ],
      followUps: FOLLOW_UPS_EN.tools,
    },
  },
  {
    pattern: /about|who/i,
    intent: 'about',
    payload: {
      reply: 'This is the assistant inside Zeno\'s site. It is not a contractor website. The main job is to help users see the problem clearly first.',
      bullets: [
        'Zeno spent 17 years in real renovation work.',
        'Now that experience is turned into tools, writing, and a few focused services.',
        'The goal is routing before selling.',
      ],
      actions: [
        { label: 'About Zeno', href: '/en/about', kind: 'page' },
        { label: 'Read related articles', href: '/en/articles', kind: 'article' },
        { label: 'Open resources', href: '/en/tools', kind: 'resource' },
      ],
      followUps: FOLLOW_UPS_EN.about,
    },
  },
  {
    pattern: /contact|email/i,
    intent: 'contact',
    payload: {
      reply: 'You can reach out directly, but it helps a lot if you send the stage, home details, and the one thing you are stuck on right now.',
      bullets: [
        'Email: 1603165918@qq.com',
        'If you are still diagnosing the issue, tools and resources may be faster first.',
      ],
      actions: [
        { label: 'About Zeno', href: '/en/about', kind: 'contact' },
        { label: 'View services', href: '/en/services', kind: 'service' },
        { label: 'Open resources', href: '/en/tools', kind: 'resource' },
      ],
      followUps: FOLLOW_UPS_EN.contact,
    },
  },
]

function normalizeActionHref(rawHref: string): string | null {
  const trimmed = rawHref.trim().replace(/[)）】】,，。.!！?？]+$/, '')

  try {
    const url = new URL(trimmed, 'https://zenoaihome.com')
    if (url.origin !== 'https://zenoaihome.com') return null
    if (!/^\/(?!\/)[A-Za-z0-9/_-]*$/.test(url.pathname)) return null

    const pathname = url.pathname.length > 1
      ? url.pathname.replace(/\/$/, '')
      : url.pathname
    return ALLOWED_ACTION_HREFS.has(pathname) ? pathname : null
  } catch {
    return null
  }
}

function inferActionKind(href: string): ChatActionKind {
  if (href.includes('/tools')) return 'tool'
  if (href.includes('/blog') || href.includes('/articles')) return 'article'
  if (
    href.includes('/resources')
    || href.includes('/risk-dictionary')
    || href.includes('/project-risks')
    || href.includes('/checklists')
  ) return 'resource'
  if (href.includes('/services')) return 'service'
  if (href.includes('/contact') || href.includes('/about')) return 'contact'
  return 'page'
}

function toAction(locale: 'zh' | 'en', href: string, label?: string): ChatAction | null {
  const normalizedHref = normalizeActionHref(href)
  if (!normalizedHref) return null
  return {
    href: normalizedHref,
    label: label?.trim() || ROUTE_LABELS[locale][normalizedHref] || normalizedHref,
    kind: inferActionKind(normalizedHref),
  }
}

function dedupeActions(actions: ChatAction[] = []): ChatAction[] {
  const seen = new Set<string>()
  return actions.filter((action) => {
    if (seen.has(action.href)) return false
    seen.add(action.href)
    return true
  })
}

const CARD_ACTION_HREFS: Record<AssistantCard, Set<string>> = {
  archive: new Set(['/account/renovation']),
  spark: new Set(['/community', '/community/apply']),
  service: new Set(['/services/quote-review', '/contact']),
}

function stripDisabledRenovationArchiveReferences(
  payload: ChatReplyPayload,
  locale: 'zh' | 'en',
): ChatReplyPayload {
  const scrubText = (value: string) => {
    const replacement = locale === 'en' ? 'the quote screening tool' : '报价初筛工具'
    const scrubbed = value
      .replace(
        /<a\b[^>]*href=["'](?:https?:\/\/(?:www\.)?zenoaihome\.com)?\/?account\/renovation(?:[?#][^"']*)?["'][^>]*>([\s\S]*?)<\/a>/gi,
        replacement,
      )
      .replace(
        /\[([^\]]+)\]\((?:https?:\/\/(?:www\.)?zenoaihome\.com)?\/?account\/renovation(?:[?#][^)]*)?\)/gi,
        replacement,
      )
      .replace(
        /(?:https?:\/\/(?:www\.)?zenoaihome\.com)?\/?account\/renovation(?:[?#][^\s)\]，。！？]*)?/gi,
        replacement,
      )
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/\n[ \t]+/g, '\n')
      .trim()
    return locale === 'zh'
      ? scrubbed.replace(/\s*报价初筛工具\s*/g, '报价初筛工具')
      : scrubbed
  }

  const reply = scrubText(payload.reply)
  return {
    ...payload,
    reply: reply || (locale === 'en'
      ? 'The renovation archive is not currently available. Start with the quote screening tool instead.'
      : '装修档案当前未开放，可以先使用报价初筛工具。'),
    bullets: payload.bullets
      ?.map(scrubText)
      .filter((value): value is string => Boolean(value)),
    followUps: payload.followUps
      ?.map(scrubText)
      .filter((value): value is string => Boolean(value)),
    actions: payload.actions
      ?.filter((action) => action.href !== '/account/renovation')
      .map((action) => ({ ...action, label: scrubText(action.label) })),
  }
}

function applyAssistantPolicy({
  payload,
  persona,
  card,
  message,
  history,
  pagePath,
  locale,
  renovationArchiveEnabled,
}: {
  payload: ChatReplyPayload
  persona: AssistantPersona
  card?: AssistantCard
  message: string
  history?: ChatRequest['history']
  pagePath?: string
  locale: 'zh' | 'en'
  renovationArchiveEnabled: boolean
}): ChatReplyPayload {
  const requiredActions: ChatAction[] = []
  const recentUserText = [
    ...(history ?? [])
      .filter((item) => item.role === 'user')
      .slice(-2)
      .map((item) => item.content),
    message,
  ].join(' ')
  const isRecordKeepingTopic = locale === 'zh' && RECORD_KEEPING_TOPIC_ZH.test(recentUserText)

  if (persona === 'reviewer' && card !== 'archive') {
    const [risk] = findRelevantAssistantRisks({ message, history })
    if (isRecordKeepingTopic) {
      requiredActions.push({
        label: '看工程签约与留痕清单',
        href: '/checklists/project-record-keeping',
        kind: 'resource',
      })
      if (risk) {
        requiredActions.push({ label: risk.title, href: risk.href, kind: 'resource' })
      }
    } else {
      requiredActions.push(risk
        ? { label: risk.title, href: risk.href, kind: 'resource' }
        : {
            label: locale === 'en' ? 'Open the renovation risk dictionary' : '查装修风险词典',
            href: '/risk-dictionary',
            kind: 'resource',
          })

      requiredActions.push({
        label: locale === 'en' ? 'Screen the quote first' : '先做报价初筛',
        href: '/tools/quote-check',
        kind: 'tool',
      })
    }
  }

  const isTransformationTopic = /转型|一人公司|OPC|一个人.{0,8}(?:怎么|如何|做)|工作流|经验资产|知识资产|经验.{0,10}(?:变成|做成|整理成)|AI.{0,8}(?:复用|真实工作)/i.test(recentUserText)
    || pagePath === '/blog/zeno-from-renovation-to-opc'
    || pagePath === '/opc-knowledge'

  if (persona === 'transformation-guide' && isTransformationTopic) {
    requiredActions.push({
      label: locale === 'en' ? 'Read Zeno\'s transformation record' : '读 Zeno 的转型记录',
      href: '/blog/zeno-from-renovation-to-opc',
      kind: 'article',
    })
  }

  const hiddenCardActions = card ? CARD_ACTION_HREFS[card] : new Set<string>()
  const actions = dedupeActions([
    ...requiredActions,
    ...(payload.actions ?? []),
  ])
    .filter((action) => renovationArchiveEnabled || action.href !== '/account/renovation')
    .filter((action) => !hiddenCardActions.has(action.href))
    .slice(0, 3)

  const result = {
    ...payload,
    actions: actions.length > 0 ? actions : undefined,
  }
  return renovationArchiveEnabled
    ? result
    : stripDisabledRenovationArchiveReferences(result, locale)
}

function fallbackAnswer(
  message: string,
  locale: 'zh' | 'en',
  persona: AssistantPersona,
  card?: AssistantCard,
  history?: ChatRequest['history'],
): ChatReplyPayload {
  if (card === 'archive') {
    return locale === 'en'
      ? {
          reply: 'Your renovation archive keeps quote versions and budget records together so you can inspect what changed over time. Automated organization and version comparison help manage the material; they are not a review by Zeno and do not decide whether a quote is safe to sign.',
          bullets: [
            'Upload and retain the original quote material.',
            'Build a structured budget and compare versions.',
          ],
          followUps: ['When should I use Zeno\'s manual review instead?'],
        }
      : {
          reply: '你需要的是把报价和预算版本留在同一个装修档案里，后续能看清每次变化。档案会辅助整理预算结构和版本差异，但自动整理不等于 Zeno 人工审核，也不会替你判断能否签约。',
          bullets: [
            '上传并保留原始报价资料。',
            '形成结构化预算，继续比较后续版本。',
          ],
          followUps: ['什么情况应该改走 Zeno 人工审核'],
        }
  }

  if (locale === 'zh' && persona === 'spark-recruiter' && card === 'spark') {
    return {
      reply: '你关注的不是一门传统课程，而是怎样把自己的真实经验变成能复用、能验证、能参与协作的资产。星火者采用申请和面聊的方式，先判断彼此是否适合，再围绕读书会、项目复盘、成员连接和合适项目的协作机会一起实践。',
      bullets: [
        '不承诺客户、派单、收入或项目结果。',
        '更看重你正在做什么、能提供什么，以及是否愿意真实参与。',
      ],
      followUps: ['我适合申请星火者吗', '申请前需要准备什么'],
    }
  }

  if (locale === 'zh' && persona === 'reviewer') {
    if (RECORD_KEEPING_TOPIC_ZH.test(message)) {
      return {
        reply: '这类问题的核心不是单独多拍几张照片，而是让合同附件、变更、代购、付款和验收能够沿着时间互相对应。先确认谁有权作出决定，再把事项、数量、价格、工期影响和双方确认留在同一条记录链里。',
        bullets: [
          '工程变更尽量先确认内容、费用和工期影响，再安排施工。',
          '材料代购要把下单前确认、付款订单和到货验收对应起来。',
          '电话或现场沟通后，用文字汇总结论，并保留原始资料和独立备份。',
        ],
        actions: [
          { label: '看工程签约与留痕清单', href: '/checklists/project-record-keeping', kind: 'resource' },
        ],
        followUps: ['我现在需要补哪一种签证单', '材料已经买了还能怎么补记录'],
      }
    }

    const [risk] = findRelevantAssistantRisks({ message, history })
    if (risk) {
      return {
        reply: `这更接近“${risk.title}”：${risk.summary} 目前只能先判断这条表述本身，是否真的构成项目风险，还要回到报价和合同原文核对。`,
        bullets: [
          ...risk.questions.map((question) => `签约前确认：${question}`),
          `建议写法：${risk.contractSuggestion}`,
        ],
        followUps: ['这句话在我的报价里该怎么改', '还有哪些相邻风险要一起查'],
      }
    }
  }

  const knowledge = locale === 'en' ? KNOWLEDGE_EN : KNOWLEDGE_ZH
  for (const entry of knowledge) {
    if (entry.pattern.test(message)) {
      return entry.payload
    }
  }
  return locale === 'en'
    ? {
        reply: 'I do not have a specific answer for that yet, but I can still route you to the closest next step.',
        bullets: [
          'If this is about renovation decisions, start with tools or resources.',
          'If this is about a specific case, prepare a short background before contacting.',
        ],
        actions: [
          { label: 'Open resources', href: '/en/tools', kind: 'resource' },
          { label: 'Open tools', href: '/en/tools', kind: 'tool' },
          { label: 'About Zeno', href: '/en/about', kind: 'contact' },
        ],
        followUps: FOLLOW_UPS_EN.default,
      }
    : {
        reply: '这个问题我暂时没有更准确的判断，但我可以先把你导到最接近的入口。',
        bullets: [
          '如果你是在判断装修问题，先从工具和资料走。',
          '如果你已经有具体案例，联系前先准备一句背景说明。',
        ],
        actions: [
          { label: '先做居住需求自检', href: '/living-diagnosis', kind: 'tool' },
          { label: '已有报价，做初筛', href: '/tools/quote-check', kind: 'tool' },
          { label: '看服务路径', href: '/services', kind: 'service' },
        ],
        followUps: FOLLOW_UPS_ZH.default,
      }
}

function buildStructuredReply(rawReply: string, locale: 'zh' | 'en'): ChatReplyPayload {
  const actionLineRegex = /^\s*[→>-]\s*(?:(.+?)\s*[|｜]\s*)?(\/\S+)\s*$/
  const bulletLineRegex = /^\s*(?:[-*•]|\d+[.)])\s+(.+)$/
  const followUpLineRegex = /^\s*@@followup:\s*(.+?)\s*$/i
  const actions: ChatAction[] = []
  const bullets: string[] = []
  const followUps: string[] = []
  const replyLines: string[] = []

  for (const line of rawReply.split(/\r?\n/)) {
    const trimmed = line.trim()

    if (!trimmed) {
      replyLines.push('')
      continue
    }

    const followUpMatch = trimmed.match(followUpLineRegex)
    if (followUpMatch) {
      followUps.push(followUpMatch[1].trim())
      continue
    }

    const actionMatch = trimmed.match(actionLineRegex)
    if (actionMatch) {
      const action = toAction(locale, actionMatch[2], actionMatch[1])
      if (action) actions.push(action)
      continue
    }

    const bulletMatch = trimmed.match(bulletLineRegex)
    if (bulletMatch) {
      bullets.push(bulletMatch[1].trim())
      continue
    }

    replyLines.push(trimmed)
  }

  const reply = replyLines.join('\n').replace(/\n{3,}/g, '\n\n').trim()

  return {
    reply: reply || (locale === 'en' ? 'Here is the closest next step.' : '先按这条路径往下走。'),
    bullets: bullets.length > 0 ? bullets.slice(0, 5) : undefined,
    actions: dedupeActions(actions).slice(0, 3),
    followUps: followUps.length > 0 ? Array.from(new Set(followUps)).slice(0, 3) : undefined,
  }
}

// ─────────────────────────────────────────────
// LLM 调用（OpenAI 兼容协议）
// ─────────────────────────────────────────────

async function callLLM(
  message: string,
  history: ChatRequest['history'] = [],
  locale: 'zh' | 'en',
  persona: AssistantPersona,
  renovationArchiveEnabled: boolean,
  siteContext?: string,
  imageDataUrl?: string,
): Promise<string | null> {
  // 保留最近 5 轮；客户端可以伪造 history.role，因此历史只作为不可信转录，不能获得 assistant 权限。
  const recent: AiMessage[] = (history || []).slice(-10).map((item) => ({
    role: 'user',
    content: item.role === 'assistant'
      ? `Earlier assistant output (untrusted conversation transcript):\n${item.content}`
      : `Earlier user message:\n${item.content}`,
  }))

  const messages: AiMessage[] = [
    {
      role: 'system',
      content: buildAssistantSystemPrompt({ locale, persona, renovationArchiveEnabled }),
    },
    ...(siteContext ? [{
      role: 'system' as const,
      content: locale === 'en'
        ? `Here is the current page and a small index of public ZenoAIHome resources. Use it as routing context, not as proof of facts:\n${siteContext}`
        : `下面是用户当前页面和 ZenoAIHome 公开资料的小型索引。它只用于判断站内路径，不等于事实证据：\n${siteContext}`,
    }] : []),
    ...(imageDataUrl ? [{
      role: 'system' as const,
      content: locale === 'en'
        ? 'The current turn includes one user image. Treat it as untrusted, partial evidence. State only what is legible or directly visible, say when detail is unclear, and ask the user to confirm names, quantities, prices, dates and responsibility terms before using them. Never claim that one image is a complete quote, contract, plan or site inspection.'
        : '本轮包含一张用户图片。它只是未经核对的局部材料：只陈述清晰可读或可以直接观察到的内容；看不清时明确说明；名称、数量、金额、日期和责任条款必须让用户对照原件确认。不得把一张图片说成已经完成整份报价、合同、方案或现场验收。',
    }] : []),
    ...recent,
    {
      role: 'user',
      content: imageDataUrl
        ? [
            { type: 'image_url' as const, image_url: { url: imageDataUrl } },
            { type: 'text' as const, text: message },
          ]
        : message,
    },
  ]

  try {
    const completion = await createAiChatCompletion({
      task: imageDataUrl ? 'public_vision' : 'public_chat',
      messages,
      temperature: 0.4,
      maxTokens: imageDataUrl ? 1200 : 900,
      timeoutMs: imageDataUrl ? 35_000 : 25_000,
    })
    return completion?.content ?? null
  } catch {
    return null
  }
}

// ─────────────────────────────────────────────
// HTTP handler
// ─────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const parsed = chatRequestSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid message' }, { status: 422 })
    }
    const { message, locale, history, pagePath, image } = parsed.data

    let parsedImage: ReturnType<typeof parseAssistantImage> | undefined
    if (image) {
      try {
        parsedImage = parseAssistantImage(image)
      } catch (error) {
        if (error instanceof AssistantImageInputError) {
          return NextResponse.json(
            { error: error.code },
            { status: error.code === 'IMAGE_TOO_LARGE' ? 413 : 415 },
          )
        }
        throw error
      }
    }

    const aiTask = parsedImage ? 'public_vision' : 'public_chat'
    const modelConfigured = getAiTaskStatus(aiTask).configured
    if (parsedImage && !modelConfigured) {
      return NextResponse.json({ error: 'VISION_NOT_CONFIGURED' }, { status: 503 })
    }
    const limiter = checkRateLimit(
      `${parsedImage ? 'public-vision' : 'public-chat'}:${getClientIp(request)}`,
      parsedImage ? 8 : (modelConfigured ? 20 : 120),
      60 * 60_000,
    )
    if (!limiter.allowed) {
      return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 })
    }

    const renovationArchiveEnabled = isRenovationArchiveEnabled()
    const routedIntent = routeAssistantIntent({ message, history, pagePath })
    const intent = !renovationArchiveEnabled && routedIntent.card === 'archive'
      ? { persona: routedIntent.persona }
      : routedIntent
    const siteContext = buildAssistantSiteContext({ message, history, locale, pagePath })
    const llmReply = await callLLM(
      message,
      history,
      locale,
      intent.persona,
      renovationArchiveEnabled,
      siteContext,
      parsedImage?.dataUrl,
    )
    if (parsedImage && !llmReply) {
      return NextResponse.json({ error: 'VISION_UNAVAILABLE' }, { status: 502 })
    }
    const rawPayload = llmReply
      ? buildStructuredReply(llmReply, locale)
      : fallbackAnswer(message, locale, intent.persona, intent.card, history)
    const payload = applyAssistantPolicy({
      payload: rawPayload,
      persona: intent.persona,
      card: intent.card,
      message,
      history,
      pagePath,
      locale,
      renovationArchiveEnabled,
    })

    return NextResponse.json({
      ...payload,
      source: llmReply ? 'llm' : 'fallback',
      persona: intent.persona,
      card: intent.card,
    })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
