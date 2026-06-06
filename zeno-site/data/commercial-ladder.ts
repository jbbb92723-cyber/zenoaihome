/**
 * 全站唯一的"AI 居住判断 + 签约前报价风险判断"商业梯子。
 * 任何展示价格梯度的位置（首页、服务页、价格页、Footer CTA）都必须从这里读，
 * 不要在页面里再写一遍价格、文案、跳转。
 *
 * 维护规则：
 * - 改价格 / 改命名 / 增减档位 → 只动这个文件
 * - 三个 variant（compact / full / summary）由 CommercialLadder 组件统一渲染
 * - 主路径：AI 居住诊断 -> ¥399-599 居住需求洞察报告 -> 报价初筛 -> ¥99/¥299/¥699 签约前风险判断
 */

export type LadderTier =
  | 'free'
  | 'paid-low'
  | 'paid-mid'
  | 'paid-high'
  | 'paid-flagship'

export type LadderRung = {
  /** 档位，用于排序 / 样式分组 */
  tier: LadderTier
  /** 展示用价格文本，如 "免费" / "¥99" / "¥699" */
  price: string
  /** 数值价格（元），用于 SEO Schema 与排序，免费=0 */
  priceNumeric: number
  /** 主标题 */
  title: string
  /** 一句话："适合谁" */
  whoFor: string
  /** 一句话："给你什么" */
  delivers: string
  /** 站内跳转地址 */
  href: string
  /** CTA 文案 */
  cta: string
  /** 数据来源（决定 PurchaseButton 还是普通跳链） */
  source: 'tool' | 'product' | 'service'
  /** 可选高亮徽标，例如 "主线起点" / "主推" */
  badge?: string
}

export const commercialLadder: LadderRung[] = [
  {
    tier: 'free',
    price: '免费',
    priceNumeric: 0,
    title: 'AI 居住诊断',
    whoFor: '还没想清怎么住、怎么取舍的人',
    delivers: '识别生活方式、空间优先级、预算取舍和下一步路径',
    href: '/living-diagnosis',
    cta: '先做居住诊断',
    source: 'tool',
    badge: '新主线起点',
  },
  {
    tier: 'paid-mid',
    price: '¥399-599',
    priceNumeric: 399,
    title: 'AI 居住需求洞察报告',
    whoFor: '已经开始认真规划，但生活方式和空间优先级还没说清的人',
    delivers: '输出居住类型、空间优先级、审美偏好、预算取舍和下一步判断清单',
    href: '/services#living-insight-beta',
    cta: '看洞察报告',
    source: 'service',
    badge: '核心产品',
  },
  {
    tier: 'free',
    price: '免费',
    priceNumeric: 0,
    title: '报价初筛工具',
    whoFor: '已经拿到报价，但还没签字的人',
    delivers: '生成风险等级、可能存在的 3 个风险和签约前追问问题',
    href: '/tools/quote-check',
    cta: '先做免费初筛',
    source: 'tool',
    badge: '签约前入口',
  },
  {
    tier: 'paid-low',
    price: '¥99',
    priceNumeric: 99,
    title: '报价风险初查',
    whoFor: '刚拿到报价，只想先看明显风险的人',
    delivers: '3 个高风险点 + 5 个签约前追问问题',
    href: '/services/renovation#quote-entry',
    cta: '看 ¥99 初查',
    source: 'service',
    badge: '低门槛验证',
  },
  {
    tier: 'paid-mid',
    price: '¥299',
    priceNumeric: 299,
    title: '标准报价快审',
    whoFor: '已有完整报价，准备继续谈或签约的人',
    delivers: '漏项、模糊项、增项口子、签约前追问清单',
    href: '/services/renovation#quote-standard',
    cta: '看 ¥299 快审',
    source: 'service',
    badge: '主推',
  },
  {
    tier: 'paid-high',
    price: '¥699',
    priceNumeric: 699,
    title: '签约前深度判断',
    whoFor: '报价、合同和付款节点都已经有，且临近签约',
    delivers: '报价风险报告 + 合同/付款节点风险提醒 + 30 分钟语音解读',
    href: '/services/renovation#quote-deep',
    cta: '看 ¥699 深度判断',
    source: 'service',
    badge: '快签前',
  },
]

/** 仅取付费档（用于价格页主梯子展示） */
export const paidLadder = commercialLadder.filter((r) => r.tier !== 'free')

/** 首页展示完整主路径：居住诊断 -> 居住需求洞察报告 -> 报价初筛 -> 三档人工判断 */
export const homepageLadder: LadderRung[] = commercialLadder

/** 主服务档：居住需求洞察报告 / 报价风险初查 / 标准报价快审 / 签约前深度判断 */
export const serviceLadder: LadderRung[] = paidLadder
