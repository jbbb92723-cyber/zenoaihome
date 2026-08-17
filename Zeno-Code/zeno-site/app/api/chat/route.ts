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

interface ChatRequest {
  message: string
  locale?: 'zh' | 'en'
  /** 历史消息，用于多轮上下文，可选 */
  history?: { role: 'user' | 'assistant'; content: string }[]
}

const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(1000),
  locale: z.enum(['zh', 'en']).default('zh'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().trim().min(1).max(2000),
  })).max(12).optional(),
})

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

const SYSTEM_PROMPT_ZH = `你是 ZenoAIHome 的网站协作助手，名称是 Zeno 助手。赞诺拥有 17 年传统行业经营与项目经验，长期涉及家居、销售管理和装修项目，现在把现场判断带进 AI、知识库、内容系统和一人公司的实践。

【你的使命】
帮助用户把一个模糊、分散或卡住的问题，推进到更清楚的下一步。你可以处理传统行业实践、AI 工作流、经验整理、内容系统、一人公司和装修判断等问题。
你的工作顺序是：先理解用户的目标、阶段、材料和限制；信息不足时只追问最关键的 1-3 个问题；再整理信息、检索资料、比较选项、推荐工具或转入人工服务。不要一上来把用户推向某个模块。
你的成功标准是：用户问完之后，更看得清自己面前的问题，并知道下一步做什么，而不是被推着买东西。

【说话方式】
- 像一个真实、温和、克制、有判断力的协作伙伴，不冒充 Zeno 本人。
- 一句话能说完的不写两句；先给判断，再给理由和下一步。
- 不用“赋能 / 打造 / 解锁 / 沉淀 / 价值体系 / 一站式 / 解决方案”这类空泛词。
- 不用 emoji，不用感叹号开头或结尾，不夸大，不承诺未经验证的数字结果。
- 允许明确说“目前资料不够”，并告诉用户缺什么，而不是用通用话术填空。

【人机分工】
- AI 负责理解、整理、查找、比较、生成追问、发现缺口和提出候选路径。
- 人负责方向、经验判断、取舍、关系沟通、风险承担和最终确认。
- 重要判断不要只给结论，要说明依据、缺口和需要人工确认的部分。

【知识范围】
- 传统行业与一人公司：真实工作拆解、经验资产化、内容和知识系统、AI 协作边界。
- 装修：生活方式、空间场景、预算、报价、合同、付款节点、增项、施工和验收。
- 网站本身：公开实践、文章、工具、服务、星火者和合作入口。

【边界】
- 不知道的事直说不知道，不编造数字、案例、合同条款、法律条文或个人经历。
- 不替用户做最终决定，不把 AI 包装成数字员工、专家或自动获客机器。
- 涉及合同、法律、人身安全、付款和具体项目责任时，提醒用户进行人工或专业复核。
- 如果用户要求看具体材料、执行具体项目或进入合作，先说明需要哪些材料，再引导到 /contact。

【常用站内链接】（适当时给出，每条单独一行，前面加 →）
- 实践与证据：/practice
- 公开 AI 工具：/ai-tools
- 居住需求自检：/living-diagnosis
- 报价初筛工具：/tools/quote-check
- 装修报价风险词典：/risk-dictionary
- 签约前检查模板：/checklists
- 服务路径：/services
- 经验资产化与一人公司：/opc-knowledge
- 联系 Zeno：/contact
- 文章博客：/blog

【链接输出格式】
- 如果你推荐站内页面，不要把裸路径混在正文里。
- 把推荐页单独放在结尾，每行一个，固定写成：→ 标签 | /path
- 最多给 3 个链接，优先给最能推进下一步的入口。

【回复长度】
- 默认 3-6 句话以内。
- 涉及清单类问题最多列 5 条；如果需要更多材料，先给最小可行动版本。

【继续追问】
- 回复末尾可以根据当前问题生成最多 3 个真正相关的下一问，帮助用户继续提供信息。
- 每个下一问单独一行，严格使用“@@followup: 问题”格式；不要生成“我还没定方案”这类通用入口。
- 如果当前已经足够回答，或继续追问没有价值，就不要输出 @@followup 行。`

const SYSTEM_PROMPT_EN = `You are the Zeno assistant inside ZenoAIHome. Zeno is a person with 17 years of traditional-industry and project experience who now brings field judgment into AI, knowledge systems, content and solo work.

Your mission is to move a vague or stuck problem toward a clear next step. You can help with traditional-industry work, AI workflows, experience assets, content systems, solo-company practice and renovation decisions.

Your order of work is: understand the user's goal, stage, materials and constraints; ask only the 1-3 most important questions when information is missing; then organize, retrieve, compare, recommend a tool or route to human help. Do not push the user into a module before understanding the problem.

AI organizes, searches, compares, raises questions and proposes options. The person owns direction, judgment, tradeoffs, relationships, risk and final confirmation. Explain evidence, gaps and human review when the decision matters.

Voice: real, calm, restrained and useful. Do not impersonate Zeno. Do not fabricate numbers, cases, legal terms or personal experience. Do not present AI as a digital employee, expert or automated acquisition machine. No emojis, hype or exaggerated promises.

Useful links (use when relevant, one per line prefixed with →):
- Practice and evidence: /practice
- Public AI tools: /ai-tools
- Renovation tools: /en/tools
- Services: /en/services
- Contact: /en/about

When recommending an internal page, keep the link out of the body copy and put it at the end in this exact format:
→ Label | /path
Use at most 3 links.

At the end, you may generate up to 3 genuinely relevant next questions based on the current situation. Put each one on its own line using exactly "@@followup: question". Do not use generic entry labels. If the answer is already sufficient, omit all @@followup lines.

Keep replies to 3-6 sentences when possible.`

// ─────────────────────────────────────────────
// 关键词回退知识库（无 LLM Key 时使用）
// ─────────────────────────────────────────────

const ROUTE_LABELS: Record<'zh' | 'en', Record<string, string>> = {
  zh: {
    '/about': '了解 Zeno',
    '/blog': '先看相关文章',
    '/contact': '直接联系 Zeno',
    '/checklists': '看签约前检查模板',
    '/checklists/contract-pre-signing-check': '看合同检查模板',
    '/checklists/payment-milestone-check': '看付款节点检查模板',
    '/project-risks': '看施工项目风险库',
    '/risk-dictionary': '查装修报价风险词典',
    '/living-diagnosis': '先做居住需求自检',
    '/services': '看服务路径',
    '/services/quote-review': '了解报价 / 合同人工审查',
    '/tools/quote-check': '先做报价初筛',
  },
  en: {
    '/en/about': 'About Zeno',
    '/en/articles': 'Read related articles',
    '/en/services': 'View services',
    '/en/tools': 'Open tools',
  },
}

type IntentKey = 'greeting' | 'living' | 'budget' | 'quote' | 'service' | 'ai' | 'tools' | 'about' | 'contact' | 'default'

const FOLLOW_UPS_ZH: Record<IntentKey, string[]> = {
  greeting: ['我还没定方案', '我在看报价单', '我怕装修超预算'],
  living: ['我想要好看又好住', '我不知道预算该先投哪里', '我已经有方案但不确定适不适合'],
  budget: ['我已经拿到报价单了', '我预算 20 万够不够', '我最怕后期增项'],
  quote: ['你先教我怎么看漏项', '这种按实际发生怎么算风险', '我该选哪项服务'],
  service: ['居住报告和综合判断怎么选', '什么时候需要报价 / 合同快审', '我先用工具还是先咨询'],
  ai: ['AI 能帮我整理居住需求吗', 'AI 能帮我整理报价吗', 'AI 不能替我判断什么'],
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
      reply: '服务不是从“要不要查报价”开始，而是先判断你卡在哪一层：生活和方案没说清，还是报价、合同和交付边界没说清。',
      bullets: [
        '还没定方案，先看居住需求洞察报告。',
        '已有完整报价、合同草稿或付款节点，优先看报价 / 合同快审。',
        '方案、预算、报价、合同和交付都要一起判断时，再看居住方案综合判断。',
      ],
      actions: [
        { label: '看服务路径', href: '/services', kind: 'service' },
        { label: '直接联系 Zeno', href: '/contact', kind: 'contact' },
        { label: '先做居住需求自检', href: '/living-diagnosis', kind: 'tool' },
      ],
      followUps: FOLLOW_UPS_ZH.service,
    },
  },
  {
    pattern: /AI|人工智能|提示词/,
    intent: 'ai',
    payload: {
      reply: 'AI 在这里不是一个单独的模块，而是帮助你把真实工作往前推进的一层协作能力。先说清楚任务、材料和验收标准，再判断哪些交给 AI、哪些必须由人负责。',
      bullets: [
        '适合先交给 AI 的通常是整理、对比、查漏、生成追问和形成候选方案。',
        '你需要提供真实任务、已有材料、合格结果和不能越过的边界。',
        '涉及方案取舍、合同、付款和最终责任，仍要回到人工复核和书面确认。',
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
      reply: 'There are three main support paths here: quote review, budget consulting, and AI workflow consulting. You do not always need a paid service first.',
      bullets: [
        'If you already have a quote, review is the clearest entry.',
        'If the issue is budget structure, start with budget consulting or the self-check.',
        'If you are an operator, AI workflow consulting is the right track.',
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
      reply: 'AI here is meant to remove repetitive work, not fake expertise. The best first use cases are usually content, quote analysis, and client communication.',
      bullets: [
        'Start with the most repetitive workflow first.',
        'Use AI to structure information before using it to make decisions.',
        'One working use case is more valuable than many unfinished experiments.',
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

function inferIntent(message: string, locale: 'zh' | 'en'): IntentKey {
  if (locale === 'en') {
    if (/^(hi|hello|hey)$/i.test(message)) return 'greeting'
    if (/living|lifestyle|aesthetic|style|layout|family|storage|home office|space/i.test(message)) return 'living'
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
  if (/方案|风格|审美|生活|居住|户型|动线|收纳|家庭|老人|孩子|宠物|办公|好看|好住/.test(message)) return 'living'
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
    followUps: followUps.length > 0 ? Array.from(new Set(followUps)).slice(0, 3) : undefined,
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
  // 控制上下文长度：只取最近 6 轮
  const recent = (history || []).slice(-6)

  const messages: AiMessage[] = [
    { role: 'system', content: locale === 'en' ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_ZH },
    ...recent,
    { role: 'user', content: message },
  ]

  try {
    const completion = await createAiChatCompletion({
      task: 'public_chat',
      messages,
      temperature: 0.4,
      maxTokens: 600,
      timeoutMs: 12_000,
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
    const { message, locale, history } = parsed.data

    const modelConfigured = getAiTaskStatus('public_chat').configured
    const limiter = checkRateLimit(
      `public-chat:${getClientIp(request)}`,
      modelConfigured ? 20 : 120,
      60 * 60_000,
    )
    if (!limiter.allowed) {
      return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 })
    }

    const llmReply = await callLLM(message, history, locale)
    const payload = llmReply ? buildStructuredReply(llmReply, locale) : fallbackAnswer(message, locale)

    return NextResponse.json({ ...payload, source: llmReply ? 'llm' : 'fallback' })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
