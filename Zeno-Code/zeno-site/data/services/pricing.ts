export const SERVICE_PRICING = {
  diagnosis: {
    id: 'single-question-diagnosis',
    name: 'ZENO 单问题判断诊断',
    shortName: '单问题判断诊断',
    href: '/services/diagnosis',
    amount: 299,
    displayPrice: '¥299',
    priceNote: '首批验证价 / 次',
  },
  focusedCollaboration: {
    id: 'focused-ai-collaboration',
    name: 'ZENO AI 专项协作',
    shortName: 'AI 专项协作',
    href: '/services',
    amount: 2500,
    displayPrice: '¥2,500 起',
    priceNote: '一个明确任务 / 工作包',
  },
  projectAdvisor: {
    id: 'ai-project-advisor',
    name: 'ZENO AI 项目顾问',
    shortName: 'AI 项目顾问',
    href: '/contact',
    startingAmount: 12800,
    displayPrice: '¥12,800 起',
    priceNote: '按项目范围报价',
  },
  renovationSpecialist: {
    id: 'renovation-specialist-review',
    name: 'ZENO 装修专项判断',
    shortName: '装修专项判断',
    href: '/services/quote-review',
    amount: 2500,
    displayPrice: '¥2,500',
    priceNote: '一个约定决策节点 / 次',
  },
  renovationAdvisor: {
    id: 'renovation-decision-advisor',
    name: 'ZENO 装修决策顾问',
    shortName: '装修决策顾问',
    href: '/services/renovation-advisor',
    startingAmount: 12800,
    displayPrice: '¥12,800 起',
    priceNote: '按项目范围报价',
  },
} as const

export const RENOVATION_ADVISOR_BASE_SCOPE = [
  '普通住宅装修或翻新，默认线上协作',
  '最多 6 个双方约定的关键决策节点',
  '服务周期最长 120 天',
  '每个节点包含资料预审、沟通和书面判断记录',
  '约定范围内的后续澄清',
] as const

export const RENOVATION_ADVISOR_COMPLEXITY_FACTORS = [
  '别墅、大户型、旧房复杂改造或商业空间',
  '中途接入且历史资料、遗留问题较多',
  '超过 6 个决策节点或 120 天服务周期',
  '图纸、报价、合同和供应商数量明显增加',
  '需要现场查看、跨城市出行或紧急插单',
  '需要协调设计、施工、供应商等多个参与方',
] as const

export const AI_SERVICE_LEVELS = [
  {
    code: '01',
    name: SERVICE_PRICING.diagnosis.shortName,
    price: SERVICE_PRICING.diagnosis.displayPrice,
    note: '一个具体问题，先确认是否适合使用 AI、需要什么材料和下一步怎么做。',
    href: SERVICE_PRICING.diagnosis.href,
  },
  {
    code: '02',
    name: SERVICE_PRICING.focusedCollaboration.shortName,
    price: SERVICE_PRICING.focusedCollaboration.displayPrice,
    note: '围绕一场定向实操、一个工作流工作包或一个明确阶段完成交付。',
    href: SERVICE_PRICING.focusedCollaboration.href,
  },
  {
    code: '03',
    name: SERVICE_PRICING.projectAdvisor.shortName,
    price: SERVICE_PRICING.projectAdvisor.displayPrice,
    note: '跨多个任务持续协作，按团队、资料、系统范围、周期和上线要求书面报价。',
    href: SERVICE_PRICING.projectAdvisor.href,
  },
] as const

export const RENOVATION_SERVICE_LEVELS = [
  {
    code: '01',
    name: SERVICE_PRICING.diagnosis.shortName,
    price: SERVICE_PRICING.diagnosis.displayPrice,
    note: '先解决一个具体问题，确认是否需要继续投入。',
    href: SERVICE_PRICING.diagnosis.href,
  },
  {
    code: '02',
    name: SERVICE_PRICING.renovationSpecialist.shortName,
    price: SERVICE_PRICING.renovationSpecialist.displayPrice,
    note: '围绕报价合同、预算材料或一个施工节点完成专项判断。',
    href: SERVICE_PRICING.renovationSpecialist.href,
  },
  {
    code: '03',
    name: SERVICE_PRICING.renovationAdvisor.shortName,
    price: SERVICE_PRICING.renovationAdvisor.displayPrice,
    note: '在约定周期和节点内，持续参与装修关键决策。',
    href: SERVICE_PRICING.renovationAdvisor.href,
  },
] as const
