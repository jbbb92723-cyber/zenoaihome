import { articles } from '@/data/content/articles'
import {
  quoteRiskRules,
  renovationProjectRisks,
} from '@/data/risk-control/quote-risk'
import { SERVICE_PRICING } from '@/data/services/pricing'

type Locale = 'zh' | 'en'

export type HistoryMessage = {
  role: 'user' | 'assistant'
  content: string
}

type SiteContextInput = {
  message: string
  history?: HistoryMessage[]
  locale: Locale
  pagePath?: string
}

type SiteResource = {
  href: string
  title: string
  titleEn: string
  summary: string
  summaryEn: string
  signals: RegExp[]
  articleKeywords: string[]
  fallback?: boolean
}

export type AssistantRiskMatch = {
  href: string
  title: string
  summary: string
  questions: string[]
  contractSuggestion: string
}

type ScoredRiskContextEntry = AssistantRiskMatch & {
  currentScore: number
  historyScore: number
}

const SITE_RESOURCES: SiteResource[] = [
  {
    href: '/living-diagnosis',
    title: '居住需求自检',
    titleEn: 'Living-needs self-check',
    summary: '用预设问题梳理家庭成员、生活场景、空间优先级和预算取舍。',
    summaryEn: 'Clarifies household, routines, spatial priorities and budget tradeoffs.',
    signals: [/生活方式|居住|户型|动线|收纳|家庭|老人|孩子|宠物|风格|审美|方案/i],
    articleKeywords: ['居住', '空间', '审美', '生活', '方案'],
  },
  {
    href: '/tools/quote-check',
    title: '报价初筛工具',
    titleEn: 'Quote screening tool',
    summary: '初筛漏项、模糊工艺、材料边界、增项流程和付款节点。',
    summaryEn: 'Screens omissions, vague scope, material boundaries, change orders and payments.',
    signals: [/报价|预算|总价|单价|漏项|增项|暂估|结算|付款|合同/i],
    articleKeywords: ['报价', '预算', '合同', '增项', '付款'],
  },
  {
    href: '/risk-dictionary',
    title: '报价风险词典',
    titleEn: 'Quote-risk dictionary',
    summary: '解释“按实际发生”“暂估”“同等档次”等高风险表述。',
    summaryEn: 'Explains open-ended and high-risk wording in renovation quotes.',
    signals: [/按实际|暂估|同等档次|综合价|另计|风险词|模糊/i],
    articleKeywords: ['报价', '风险', '增项', '合同'],
  },
  {
    href: '/project-risks',
    title: '施工项目风险库',
    titleEn: 'Construction risk library',
    summary: '按拆除、水电、防水、泥工、木作、油漆和安装查看检查点。',
    summaryEn: 'Stage-based checks for demolition, utilities, waterproofing, finishes and installation.',
    signals: [/开工|施工|水电|防水|泥工|木作|油漆|安装|验收|整改|工地/i],
    articleKeywords: ['施工', '验收', '工地', '水电', '防水'],
  },
  {
    href: '/ai-tools/task-planner',
    title: '工作流任务拆解器',
    titleEn: 'Workflow task planner',
    summary: '把真实工作拆成输入、步骤、完成标准、人工责任和可交接结果。',
    summaryEn: 'Breaks real work into inputs, steps, acceptance criteria and human ownership.',
    signals: [/AI|人工智能|工作流|自动化|智能体|Agent|重复工作|任务|交接|知识库/i],
    articleKeywords: ['AI', '工作流', '知识库', '一人公司', '任务'],
  },
  {
    href: '/opc-knowledge',
    title: '经验怎样变成方法',
    titleEn: 'Experience assets and solo work',
    summary: '把传统行业经验整理成可检索、可复用、可验证的方法。',
    summaryEn: 'Turns field experience into searchable, reusable and testable working assets.',
    signals: [/经验|一人公司|OPC|个人品牌|内容系统|知识系统|转型|传统行业/i],
    articleKeywords: ['经验', '一人公司', 'OPC', '个人品牌', '传统行业'],
  },
  {
    href: SERVICE_PRICING.diagnosis.href,
    title: `${SERVICE_PRICING.diagnosis.shortName} · ${SERVICE_PRICING.diagnosis.displayPrice}`,
    titleEn: 'Single-question diagnosis',
    summary: '一个具体问题、必要资料、一次沟通和一页判断记录；先确认是否适合再开始。',
    summaryEn: 'One question, source materials, one conversation and a concise judgment record.',
    signals: [/一个问题|拿不准|怎么选|咨询|问一下|帮我判断|单问题|诊断/i],
    articleKeywords: ['判断', '咨询', '选择'],
  },
  {
    href: SERVICE_PRICING.renovationSpecialist.href,
    title: `${SERVICE_PRICING.renovationSpecialist.shortName} · ${SERVICE_PRICING.renovationSpecialist.displayPrice}`,
    titleEn: 'Renovation specialist review',
    summary: '围绕完整报价合同、预算材料或一个施工节点完成资料预审、沟通和书面判断。',
    summaryEn: 'Reviews a full quote, contract, budget package or one construction decision point.',
    signals: [/整份报价|报价合同|合同审查|付款节点|施工节点|材料选择|专项判断|完整材料/i],
    articleKeywords: ['报价', '合同', '施工', '材料'],
  },
  {
    href: SERVICE_PRICING.renovationAdvisor.href,
    title: `${SERVICE_PRICING.renovationAdvisor.shortName} · ${SERVICE_PRICING.renovationAdvisor.displayPrice}`,
    titleEn: 'Renovation decision advisor',
    summary: '多个关键节点持续协作；基准范围最多 6 个节点、最长 120 天，按项目复杂度报价。',
    summaryEn: 'Ongoing collaboration across multiple renovation decisions, scoped and quoted by project.',
    signals: [/全程|整个装修|持续跟进|多个节点|项目顾问|商业空间|旧房改造|装修决策顾问/i],
    articleKeywords: ['装修', '项目', '决策', '交付'],
  },
  {
    href: SERVICE_PRICING.focusedCollaboration.href,
    title: `${SERVICE_PRICING.focusedCollaboration.shortName} · ${SERVICE_PRICING.focusedCollaboration.displayPrice}`,
    titleEn: 'Focused AI collaboration',
    summary: '围绕一个明确 AI 任务、工作坊、工作流工作包或阶段性交付，先做小范围验证。',
    summaryEn: 'A focused AI task, workshop, workflow package or delivery phase for a scoped validation.',
    signals: [/AI培训|培训|工作坊|工作流|自动化|一个任务|专项协作|小范围实操/i],
    articleKeywords: ['AI', '培训', '工作流', '协作'],
  },
  {
    href: SERVICE_PRICING.projectAdvisor.href,
    title: `${SERVICE_PRICING.projectAdvisor.shortName} · ${SERVICE_PRICING.projectAdvisor.displayPrice}`,
    titleEn: 'AI project advisor',
    summary: '面向知识库、任务型助手、网站和多任务协作项目，按团队、资料、系统范围和周期评估。',
    summaryEn: 'Scoped project advising for knowledge bases, task assistants, websites and multi-task collaboration.',
    signals: [/企业知识库|知识库项目|智能体项目|网站开发|网站项目|系统上线|多人协作|项目顾问/i],
    articleKeywords: ['知识库', '智能体', '网站', '项目'],
  },
  {
    href: '/services',
    title: '项目合作与人工判断',
    titleEn: 'Projects and human review',
    summary: '需要结合具体材料、明确范围并承担交付责任时进入人工合作。',
    summaryEn: 'Human review for work that requires source materials, scope and delivery responsibility.',
    signals: [/服务|合作|咨询|人工|帮我看|具体材料|联系|报价审查/i],
    articleKeywords: ['服务', '合作', '判断'],
  },
  {
    href: '/practice',
    title: '实践与证据',
    titleEn: 'Practice and evidence',
    summary: '查看赞诺正在验证什么、依据是什么，以及方法如何被修订。',
    summaryEn: 'Shows what Zeno is testing, the evidence used and how methods change.',
    signals: [/证据|案例|实践|验证|结果|依据|方法/i],
    articleKeywords: ['实践', '验证', '判断', '长期主义'],
    fallback: true,
  },
  {
    href: '/blog',
    title: '文章与判断记录',
    titleEn: 'Writing and judgment records',
    summary: '从文章中查看完整背景、判断过程和公开实践。',
    summaryEn: 'Long-form context, judgment and public practice.',
    signals: [/文章|博客|观点|怎么想|为什么|经历/i],
    articleKeywords: ['判断', '实践'],
    fallback: true,
  },
]

function resourceScore(resource: SiteResource, query: string, pagePath?: string) {
  let score = resource.signals.reduce(
    (total, signal) => total + (signal.test(query) ? 3 : 0),
    0,
  )

  const cleanHref = resource.href.split('#')[0]
  if (pagePath && (pagePath === cleanHref || pagePath.startsWith(`${cleanHref}/`))) {
    score += 5
  }

  return score
}

function articleScore(article: (typeof articles)[number], query: string, keywords: string[]) {
  const haystack = `${article.title} ${article.excerpt} ${article.category} ${article.tags.join(' ')}`.toLowerCase()
  let score = 0

  for (const tag of article.tags) {
    if (tag.length > 1 && query.includes(tag.toLowerCase())) score += 4
  }

  for (const keyword of keywords) {
    const normalized = keyword.toLowerCase()
    if (query.includes(normalized) && haystack.includes(normalized)) score += 3
    else if (haystack.includes(normalized)) score += 1
  }

  return score
}

const ENGLISH_RISK_ALIASES: Array<[RegExp, string[]]> = [
  [/\b(change order|add[ -]?on|extra charge)\b/i, ['增项', '另计']],
  [/\b(actual settlement|actual cost)\b/i, ['按实结算', '按实际发生']],
  [/\b(estimate|provisional)\b/i, ['暂估', '估算']],
  [/\b(brand|model|specification)\b/i, ['品牌', '型号', '规格']],
  [/\b(scope|included|excluded)\b/i, ['施工范围', '包含范围', '不含']],
  [/\bdemolition\b/i, ['拆除', '拆改']],
  [/\b(waste|debris|rubbish)\b/i, ['垃圾清运']],
  [/\b(plumbing|electrical|wiring|utilities)\b/i, ['水电', '强弱电']],
  [/\b(waterproof|waterproofing|leak)\b/i, ['防水', '漏水']],
  [/\b(leveling|levelling)\b/i, ['找平']],
  [/\b(wall|plaster)\b/i, ['墙面基层']],
  [/\b(latex paint|wall paint)\b/i, ['乳胶漆']],
  [/\b(tile laying|tiling)\b/i, ['瓷砖铺贴']],
  [/\bgrout\b/i, ['美缝']],
  [/\bceiling\b/i, ['吊顶']],
  [/\bcabinet(s|ry)?\b/i, ['橱柜']],
  [/\b(door|window)s?\b/i, ['门窗']],
  [/\b(switch|socket|outlet)s?\b/i, ['开关插座']],
  [/\b(lighting|light fixture)s?\b/i, ['灯具安装']],
  [/\bflooring\b/i, ['地板']],
]

const ENGLISH_RENOVATION_CONTEXT = /\b(renovation|remodel(?:ing|ling)?|construction|contractor|quote|contract|home improvement|demolition|debris|plumbing|waterproof(?:ing)?|tiling|grout|ceiling|cabinetry|flooring)\b/i

function normalizeRiskQuery(value: string) {
  const query = value.toLowerCase().replace(/\s+/g, ' ').trim()
  const aliases = ENGLISH_RENOVATION_CONTEXT.test(query)
    ? ENGLISH_RISK_ALIASES
        .filter(([signal]) => signal.test(query))
        .flatMap(([, terms]) => terms)
    : []

  return [query, ...aliases].join(' ')
}

function hasRiskTerm(query: string, value: string) {
  const term = value.toLowerCase().trim()
  return term.length >= 2 && query.includes(term)
}

function scoreRiskFields(query: string, fields: Array<{ values: string[]; weight: number }>) {
  return fields.reduce((total, field) => (
    total + field.values.reduce(
      (fieldTotal, value) => fieldTotal + (hasRiskTerm(query, value) ? field.weight : 0),
      0,
    )
  ), 0)
}

export function findRelevantAssistantRisks({
  message,
  history = [],
}: {
  message: string
  history?: HistoryMessage[]
}): AssistantRiskMatch[] {
  const currentQuery = normalizeRiskQuery(message)
  const historyQuery = normalizeRiskQuery(
    history
      .filter((item) => item.role === 'user')
      .slice(-2)
      .map((item) => item.content)
      .join(' '),
  )

  const quoteRisks: ScoredRiskContextEntry[] = quoteRiskRules.map((risk) => {
    const currentScore = scoreRiskFields(currentQuery, [
      { values: [risk.name], weight: 12 },
      { values: risk.triggerTerms, weight: 8 },
      { values: risk.commonItems, weight: 5 },
    ])
    const historyScore = scoreRiskFields(historyQuery, [
      { values: [risk.name], weight: 2 },
      { values: risk.triggerTerms, weight: 1 },
      { values: risk.commonItems, weight: 0.5 },
    ])

    return {
      href: `/risk-dictionary/${risk.slug}`,
      title: risk.name,
      summary: risk.oneLine,
      questions: risk.preSigningQuestions.slice(0, 2),
      contractSuggestion: risk.contractSuggestion,
      currentScore,
      historyScore,
    }
  })

  const projectRisks: ScoredRiskContextEntry[] = renovationProjectRisks.map((risk) => {
    const currentScore = scoreRiskFields(currentQuery, [
      { values: [risk.name], weight: 12 },
      { values: risk.vagueWords, weight: 8 },
      { values: risk.usuallyIncludes, weight: 5 },
      { values: risk.commonMissingItems, weight: 4 },
      { values: risk.addOnRisks, weight: 3 },
    ])
    const historyScore = scoreRiskFields(historyQuery, [
      { values: [risk.name], weight: 2 },
      { values: risk.vagueWords, weight: 1 },
      { values: risk.usuallyIncludes, weight: 0.5 },
      { values: risk.commonMissingItems, weight: 0.5 },
    ])

    return {
      href: `/project-risks/${risk.slug}`,
      title: risk.name,
      summary: risk.oneLine,
      questions: risk.preSigningQuestions.slice(0, 2),
      contractSuggestion: risk.contractSuggestion,
      currentScore,
      historyScore,
    }
  })

  return [...quoteRisks, ...projectRisks]
    // History can refine an active topic, but it cannot introduce a risk by itself.
    .filter((risk) => risk.currentScore >= 5)
    .sort((a, b) => (
      (b.currentScore + b.historyScore) - (a.currentScore + a.historyScore)
      || b.currentScore - a.currentScore
      || a.href.localeCompare(b.href)
    ))
    .slice(0, 3)
    .map(({ currentScore: _currentScore, historyScore: _historyScore, ...risk }) => risk)
}

export function buildAssistantSiteContext({
  message,
  history = [],
  locale,
  pagePath,
}: SiteContextInput) {
  const query = [
    ...history
      .filter((item) => item.role === 'user')
      .slice(-4)
      .map((item) => item.content),
    message,
  ].join(' ').toLowerCase()

  const rankedResources = SITE_RESOURCES
    .map((resource) => ({ resource, score: resourceScore(resource, query, pagePath) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  const selectedResources = rankedResources.length > 0
    ? rankedResources.slice(0, 4).map((item) => item.resource)
    : SITE_RESOURCES.filter((resource) => resource.fallback)

  const articleKeywords = Array.from(new Set(
    selectedResources.flatMap((resource) => resource.articleKeywords),
  ))

  const selectedArticles = articles
    .map((article) => ({ article, score: articleScore(article, query, articleKeywords) }))
    .filter((item) => item.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.article)

  const selectedRisks = findRelevantAssistantRisks({ message, history })

  const resourceLines = selectedResources.map((resource) => {
    const title = locale === 'en' ? resource.titleEn : resource.title
    const summary = locale === 'en' ? resource.summaryEn : resource.summary
    return `- ${title} | ${resource.href} | ${summary}`
  })

  const articleLines = selectedArticles.map((article) => (
    `- ${article.title} | /blog/${article.slug} | ${article.excerpt}`
  ))

  const riskLines = selectedRisks.map((risk) => {
    const questions = risk.questions.join(locale === 'en' ? '; ' : '；')
    return locale === 'en'
      ? `- ${risk.title} | ${risk.href} | ${risk.summary} | Questions before signing: ${questions} | Contract note: ${risk.contractSuggestion}`
      : `- ${risk.title} | ${risk.href} | ${risk.summary} | 签约前可问：${questions} | 合同建议：${risk.contractSuggestion}`
  })

  const currentPage = pagePath || (locale === 'en' ? '/en' : '/')
  const heading = locale === 'en'
    ? `Current page: ${currentPage}\nVerified site routes that may help:`
    : `用户当前页面：${currentPage}\n可能有帮助的站内可核对入口：`
  const articleHeading = locale === 'en'
    ? '\nRelated published article metadata (title and excerpt only):'
    : '\n可能相关的已发布文章元数据（只有标题和摘要）：'
  const riskHeading = locale === 'en'
    ? '\nRelevant published renovation risk entries (structured fields only):'
    : '\n可能相关的装修风险条目（仅使用结构化事实字段）：'
  const boundary = locale === 'en'
    ? '\nUse these only when relevant. Do not claim to have read a full article or private file from metadata alone.'
    : '\n只在确实相关时引用。仅凭元数据不得声称已经读过文章全文，也不得声称看过用户未提交的私人材料。'

  return [
    heading,
    ...resourceLines,
    ...(riskLines.length > 0 ? [riskHeading, ...riskLines] : []),
    ...(articleLines.length > 0 ? [articleHeading, ...articleLines] : []),
    boundary,
  ].join('\n')
}
