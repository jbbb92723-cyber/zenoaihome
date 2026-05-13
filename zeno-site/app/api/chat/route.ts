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

type ChatActionKind = 'tool' | 'article' | 'resource' | 'service' | 'contact' | 'page'

interface ChatAction {
  label: string
  href: string
  kind: ChatActionKind
}

interface ChatReplyPayload {
  reply: string
  bullets?: string[]
  actions?: ChatAction[]
  followUps?: string[]
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
- 装修：报价、预算、合同、水电、主材、施工、验收、居住场景选择。
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
- 预算分配工具：/tools/budget-structure
- 超预算原因自测：/tools/budget-risk
- 资料与清单：/resources
- 服务（报价快审 / 签约前决策包 / 预算结构诊断 / AI 工作流）：/services
- 联系 Zeno：/contact
- 文章博客：/blog

【链接输出格式】
- 如果你推荐站内页面，不要把裸路径混在正文里。
- 把推荐页单独放在结尾，每行一个，固定写成：→ 标签 | /path
- 最多给 3 个链接，优先给最能推进下一步的入口。

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

When recommending an internal page, keep the link out of the body copy and put it at the end in this exact format:
→ Label | /path
Use at most 3 links.

Keep replies to 3-6 sentences when possible.`

// ─────────────────────────────────────────────
// 关键词回退知识库（无 LLM Key 时使用）
// ─────────────────────────────────────────────

const ROUTE_LABELS: Record<'zh' | 'en', Record<string, string>> = {
  zh: {
    '/about': '了解 Zeno',
    '/blog': '先看相关文章',
    '/blog/baojia-dan-zenme-kan': '看报价单怎么查',
    '/blog/zhuangxiu-yusuan-weishenme-zongchao': '看预算为什么总超',
    '/contact': '直接联系 Zeno',
    '/pricing/baojia-guide': '看报价避坑指南',
    '/resources': '去资料库拿清单',
    '/resources#baojia-shenhe-qingdan': '拿报价审核清单',
    '/resources#zhuangxiu-yusuan-moban': '拿预算模板',
    '/services': '看服务说明',
    '/services/ai-workflow': '看 AI 工作流咨询',
    '/services/renovation#baojia-shenhe': '了解报价风险快审',
    '/services/renovation#qianyue-qian-juece-bao': '了解签约前决策包',
    '/tools/budget-risk': '查超预算原因',
    '/tools/budget-structure': '先拆预算分配',
    '/tools/prompts': '试 AI 提示词工具',
    '/tools/quote-check': '先做报价初筛',
  },
  en: {
    '/en/about': 'About Zeno',
    '/en/articles': 'Read related articles',
    '/en/resources': 'Open resources',
    '/en/services': 'View services',
    '/en/tools': 'Open tools',
    '/en/tools/prompts': 'Try the prompt tool',
    '/pricing/baojia-guide': 'Check the quote guide',
    '/tools/budget-risk': 'Run the budget self-check',
  },
}

type IntentKey = 'greeting' | 'budget' | 'quote' | 'service' | 'ai' | 'tools' | 'about' | 'contact' | 'default'

const FOLLOW_UPS_ZH: Record<IntentKey, string[]> = {
  greeting: ['我在看报价单', '我怕装修超预算', '我已经开工了'],
  budget: ['我已经拿到报价单了', '我预算 20 万够不够', '我最怕后期增项'],
  quote: ['你先教我怎么看漏项', '这种按实际发生怎么算风险', '我该快审还是决策包'],
  service: ['报价快审适合什么情况', '签约前决策包会看什么', '我先用工具还是先咨询'],
  ai: ['AI 先接进哪条工作流最值', '提示词工具能帮我做什么', '我想把客户沟通先提效'],
  tools: ['我现在最该先用哪个工具', '资料库里先看哪份清单', '我怕预算超支先从哪查'],
  about: ['Zeno 主要帮什么人', '你和装修公司有什么区别', '我想先看你的文章'],
  contact: ['我该怎么描述我的情况', '联系前要准备什么', '我先看工具还是直接联系'],
  default: ['我现在最该先看哪里', '先给我一个最省时间的入口', '我该先用工具还是先看文章'],
}

const FOLLOW_UPS_EN: Record<IntentKey, string[]> = {
  greeting: ['I am checking a quote', 'I worry about budget overrun', 'The project has started'],
  budget: ['I already have a quote', 'Is my budget enough', 'I fear change orders'],
  quote: ['How do I spot missing items', 'What does actual usage settlement mean', 'Should I ask for manual review'],
  service: ['Which service fits my case', 'What happens in budget consulting', 'Should I start with tools first'],
  ai: ['Which workflow should AI improve first', 'What can the prompt tool do', 'I want to improve client communication'],
  tools: ['Which tool should I start with', 'Which resource should I read first', 'Where do I check budget risk'],
  about: ['Who is Zeno for', 'How is this different from a contractor', 'Show me the writing first'],
  contact: ['What details should I send first', 'What should I prepare before contacting', 'Should I use tools first'],
  default: ['Show me the fastest next step', 'Should I start with a tool or article', 'What is the right entry for me'],
}

const KNOWLEDGE_ZH: Array<{ pattern: RegExp; intent: IntentKey; payload: ChatReplyPayload }> = [
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
        { label: '先拆预算分配', href: '/tools/budget-structure', kind: 'tool' },
        { label: '去资料库拿清单', href: '/resources', kind: 'resource' },
        { label: '看服务说明', href: '/services', kind: 'service' },
      ],
      followUps: FOLLOW_UPS_ZH.greeting,
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
        { label: '先拆预算分配', href: '/tools/budget-structure', kind: 'tool' },
        { label: '查超预算原因', href: '/tools/budget-risk', kind: 'tool' },
        { label: '看预算为什么总超', href: '/blog/zhuangxiu-yusuan-weishenme-zongchao', kind: 'article' },
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
        { label: '看报价避坑指南', href: '/pricing/baojia-guide', kind: 'article' },
        { label: '拿报价审核清单', href: '/resources#baojia-shenhe-qingdan', kind: 'resource' },
      ],
      followUps: FOLLOW_UPS_ZH.quote,
    },
  },
  {
    pattern: /服务|合作|咨询/,
    intent: 'service',
    payload: {
      reply: '现在主要是四类支持：报价风险快审、签约前决策包、预算结构诊断、AI 工作流咨询。不是所有情况都需要直接买服务，能先用工具、清单和 ¥39 指南看清的，先看清再说。',
      bullets: [
        '只是不确定报价重点风险，优先看报价风险快审。',
        '报价、预算、合同和付款节点一起乱，优先看签约前决策包。',
        '卡在预算分配和超支风险，优先看预算结构诊断。',
        '你是同行，想把 AI 接进获客、内容或交付流程，再看 AI 工作流咨询。',
      ],
      actions: [
        { label: '看服务说明', href: '/services', kind: 'service' },
        { label: '直接联系 Zeno', href: '/contact', kind: 'contact' },
        { label: '先用工具判断', href: '/resources', kind: 'resource' },
      ],
      followUps: FOLLOW_UPS_ZH.service,
    },
  },
  {
    pattern: /AI|人工智能|提示词/,
    intent: 'ai',
    payload: {
      reply: 'AI 在这里不是拿来装专业的，主要是帮你把重复判断和重复表达省下来。最值得先接的，通常是内容生产、报价分析和客户沟通。',
      bullets: [
        '如果你是装修同行，先选最重复、最耗时间的一条流程试。',
        '如果你是普通用户，AI 更适合帮你整理信息，不适合替你拍板。',
        '先跑通一个小场景，比一下子接很多工具更稳。',
      ],
      actions: [
        { label: '看 AI 升级路线', href: '/ai', kind: 'page' },
        { label: '试 AI 提示词工具', href: '/tools/prompts', kind: 'tool' },
        { label: '看 AI 工作流咨询', href: '/services/ai-workflow', kind: 'service' },
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
        '报价阶段先看报价初筛和报价指南。',
        '预算阶段先拆预算分配，再查超预算原因。',
        '开工后优先找验收节点和留痕清单。',
      ],
      actions: [
        { label: '去资料库拿清单', href: '/resources', kind: 'resource' },
        { label: '查超预算原因', href: '/tools/budget-risk', kind: 'tool' },
        { label: '先做报价初筛', href: '/tools/quote-check', kind: 'tool' },
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
        'Zeno 做过 16 年装修一线。',
        '现在重点做内容、工具和有限度的人工作业。',
        '先分流，再决定是否需要联系。',
      ],
      actions: [
        { label: '了解 Zeno', href: '/about', kind: 'page' },
        { label: '先看相关文章', href: '/blog', kind: 'article' },
        { label: '去资料库看看', href: '/resources', kind: 'resource' },
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
        { label: '先看服务说明', href: '/services', kind: 'service' },
        { label: '先去资料库看看', href: '/resources', kind: 'resource' },
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
        { label: 'Run the budget self-check', href: '/tools/budget-risk', kind: 'tool' },
        { label: 'Open resources', href: '/en/resources', kind: 'resource' },
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
        { label: 'Run the budget self-check', href: '/tools/budget-risk', kind: 'tool' },
        { label: 'Open resources', href: '/en/resources', kind: 'resource' },
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
        { label: 'Check the quote guide', href: '/pricing/baojia-guide', kind: 'article' },
        { label: 'Open resources', href: '/en/resources', kind: 'resource' },
        { label: 'View services', href: '/en/services', kind: 'service' },
      ],
      followUps: FOLLOW_UPS_EN.quote,
    },
  },
  {
    pattern: /service|consult/i,
    intent: 'service',
    payload: {
      reply: 'There are three main support paths here: quote review, budget consulting, and AI workflow consulting. You do not always need a paid service first.',
      bullets: [
        'If you already have a quote, review is the clearest entry.',
        'If the issue is budget structure, start with budget consulting or the self-check.',
        'If you are an operator, AI workflow consulting is the right track.',
      ],
      actions: [
        { label: 'View services', href: '/en/services', kind: 'service' },
        { label: 'Open resources', href: '/en/resources', kind: 'resource' },
        { label: 'About Zeno', href: '/en/about', kind: 'contact' },
      ],
      followUps: FOLLOW_UPS_EN.service,
    },
  },
  {
    pattern: /ai|prompt/i,
    intent: 'ai',
    payload: {
      reply: 'AI here is meant to remove repetitive work, not fake expertise. The best first use cases are usually content, quote analysis, and client communication.',
      bullets: [
        'Start with the most repetitive workflow first.',
        'Use AI to structure information before using it to make decisions.',
        'One working use case is more valuable than many unfinished experiments.',
      ],
      actions: [
        { label: 'Open tools', href: '/en/tools', kind: 'tool' },
        { label: 'Try the prompt tool', href: '/en/tools/prompts', kind: 'tool' },
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
        { label: 'Open resources', href: '/en/resources', kind: 'resource' },
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
        'Zeno spent 16 years in real renovation work.',
        'Now that experience is turned into tools, writing, and a few focused services.',
        'The goal is routing before selling.',
      ],
      actions: [
        { label: 'About Zeno', href: '/en/about', kind: 'page' },
        { label: 'Read related articles', href: '/en/articles', kind: 'article' },
        { label: 'Open resources', href: '/en/resources', kind: 'resource' },
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
        { label: 'Open resources', href: '/en/resources', kind: 'resource' },
      ],
      followUps: FOLLOW_UPS_EN.contact,
    },
  },
]

function inferIntent(message: string, locale: 'zh' | 'en'): IntentKey {
  if (locale === 'en') {
    if (/^(hi|hello|hey)$/i.test(message)) return 'greeting'
    if (/budget|cost|price|overrun|change order/i.test(message)) return 'budget'
    if (/quote|quotation/i.test(message)) return 'quote'
    if (/service|consult/i.test(message)) return 'service'
    if (/ai|prompt/i.test(message)) return 'ai'
    if (/tool|resource|checklist/i.test(message)) return 'tools'
    if (/about|who/i.test(message)) return 'about'
    if (/contact|email/i.test(message)) return 'contact'
    return 'default'
  }

  if (/^(你好|您好|嗨|在吗|有人吗)$/.test(message)) return 'greeting'
  if (/预算|花多少钱|费用|超支|增项/.test(message)) return 'budget'
  if (/报价|报价单/.test(message)) return 'quote'
  if (/服务|合作|咨询/.test(message)) return 'service'
  if (/AI|人工智能|提示词/.test(message)) return 'ai'
  if (/工具|资料|清单/.test(message)) return 'tools'
  if (/关于|你是谁/.test(message)) return 'about'
  if (/联系|微信|公众号/.test(message)) return 'contact'
  return 'default'
}

function normalizeActionHref(rawHref: string): string {
  const trimmed = rawHref.trim()
  const withoutDomain = trimmed.replace(/^https?:\/\/[^/]+/i, '')
  return withoutDomain.replace(/[)）】】,，。.!！?？]+$/, '')
}

function inferActionKind(href: string): ChatActionKind {
  if (href.includes('/tools')) return 'tool'
  if (href.includes('/blog') || href.includes('/articles')) return 'article'
  if (href.includes('/resources')) return 'resource'
  if (href.includes('/services')) return 'service'
  if (href.includes('/contact') || href.includes('/about')) return 'contact'
  return 'page'
}

function toAction(locale: 'zh' | 'en', href: string, label?: string): ChatAction {
  const normalizedHref = normalizeActionHref(href)
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

function getSuggestedFollowUps(message: string, locale: 'zh' | 'en'): string[] {
  const intent = inferIntent(message, locale)
  return locale === 'en' ? FOLLOW_UPS_EN[intent] : FOLLOW_UPS_ZH[intent]
}

function fallbackAnswer(message: string, locale: 'zh' | 'en'): ChatReplyPayload {
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
          { label: 'Open resources', href: '/en/resources', kind: 'resource' },
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
          { label: '去资料库拿清单', href: '/resources', kind: 'resource' },
          { label: '打开工具入口', href: '/tools/budget-risk', kind: 'tool' },
          { label: '直接联系 Zeno', href: '/contact', kind: 'contact' },
        ],
        followUps: FOLLOW_UPS_ZH.default,
      }
}

function buildStructuredReply(rawReply: string, message: string, locale: 'zh' | 'en'): ChatReplyPayload {
  const actionLineRegex = /^\s*[→>-]\s*(?:(.+?)\s*[|｜]\s*)?(\/\S+)\s*$/
  const bulletLineRegex = /^\s*(?:[-*•]|\d+[.)])\s+(.+)$/
  const actions: ChatAction[] = []
  const bullets: string[] = []
  const replyLines: string[] = []

  for (const line of rawReply.split(/\r?\n/)) {
    const trimmed = line.trim()

    if (!trimmed) {
      replyLines.push('')
      continue
    }

    const actionMatch = trimmed.match(actionLineRegex)
    if (actionMatch) {
      actions.push(toAction(locale, actionMatch[2], actionMatch[1]))
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
    followUps: getSuggestedFollowUps(message, locale),
  }
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
    const payload = llmReply ? buildStructuredReply(llmReply, trimmed, locale) : fallbackAnswer(trimmed, locale)

    return NextResponse.json({ ...payload, source: llmReply ? 'llm' : 'fallback' })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
