/**
 * 全站统一的产品/服务路径。
 * 任何展示路径的位置（首页、服务页）都从这里读。
 *
 * 维护规则：
 * - 改路径 / 改命名 → 只动这个文件
 * - 装修付费产品不再公开标价——装修是重决策，需要一对一对接
 * - 床垫押后——IP 跑稳再做实物产品线
 */
export type LadderTier = 'free' | 'paid-core' | 'paid-community'

export type LadderRung = {
  tier: LadderTier
  price: string
  priceNumeric: number
  title: string
  whoFor: string
  delivers: string
  href: string
  cta: string
  source: 'tool' | 'service' | 'community'
  badge?: string
}

export const commercialLadder: LadderRung[] = [
  // ── 免费层：AI 工具 ──
  {
    tier: 'free',
    price: '免费',
    priceNumeric: 0,
    title: '一人公司诊断',
    whoFor: '不确定自己卡在哪一环——产品、获客、还是交付？10 个问题搞清楚。',
    delivers: '你的当前阶段、卡在哪一环、下一步优先做什么',
    href: '/ai-tools/opc-diagnosis',
    cta: '开始诊断',
    source: 'tool',
    badge: '起点',
  },
  {
    tier: 'free',
    price: '免费',
    priceNumeric: 0,
    title: '内容策略生成',
    whoFor: '想做内容但不知道写什么。输入行业和擅长的事，找到值得写的东西。',
    delivers: '3 个内容方向 × 每方向 2-3 个具体选题',
    href: '/ai-tools/content-strategy',
    cta: '生成策略',
    source: 'tool',
    badge: '免费',
  },
  {
    tier: 'free',
    price: '免费',
    priceNumeric: 0,
    title: '装修判断工具',
    whoFor: '手里有报价单、还没定方案、想先自己看看。',
    delivers: '居住诊断、报价初筛、风险词典、检查清单',
    href: '/tools',
    cta: '用工具',
    source: 'tool',
    badge: '免费',
  },
  // ── 核心层：AI 服务 ──
  {
    tier: 'paid-core',
    price: '项目定价',
    priceNumeric: 0,
    title: 'AI 实战服务',
    whoFor: '企业团队需要 AI 培训、工作流、知识库或智能体。先说清问题和边界，确认能交付再报价。',
    delivers: '培训工作坊、工作流搭建、知识库、智能体、网站开发——按项目签约交付',
    href: '/services',
    cta: '查看服务',
    source: 'service',
    badge: '核心',
  },
  // ── 社群层：星火者 ──
  {
    tier: 'paid-community',
    price: '¥1,499',
    priceNumeric: 149900,
    title: '星火者',
    whoFor: '正在经营一人公司，想找同路人。不是围观——是分享、连接、有项目一起做。',
    delivers: '隔周火种读书会 + 日常群内连接 + 知识星球内容沉淀 + 共燃项目机会',
    href: '/community',
    cta: '了解星火者',
    source: 'community',
    badge: '试运行',
  },
]

export const homepageLadder: LadderRung[] = commercialLadder
export const serviceLadder: LadderRung[] = commercialLadder
