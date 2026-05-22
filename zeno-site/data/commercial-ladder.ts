/**
 * 全站唯一的"业主签约前报价风险判断"商业梯子。
 * 任何展示价格梯度的位置（首页、服务页、价格页、Footer CTA）都必须从这里读，
 * 不要在页面里再写一遍价格、文案、跳转。
 *
 * 维护规则：
 * - 改价格 / 改命名 / 增减档位 → 只动这个文件
 * - 三个 variant（compact / full / summary）由 CommercialLadder 组件统一渲染
 * - 主路径只保留：免费初筛 -> 报价风险初筛 -> 合同风险初筛 -> 报价对比判断
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
    title: '报价初筛工具',
    whoFor: '已经拿到报价，但还没签字',
    delivers: '生成风险等级、可能存在的 3 个风险和签约前追问问题',
    href: '/tools/quote-check',
    cta: '先做免费初筛',
    source: 'tool',
    badge: '主线起点',
  },
  {
    tier: 'paid-low',
    price: '¥99',
    priceNumeric: 99,
    title: '报价风险初筛',
    whoFor: '已经拿到装修报价，但看不懂里面有没有坑',
    delivers: '主要风险点 + 签约前追问清单',
    href: '/services/renovation#quote-entry',
    cta: '看报价初筛',
    source: 'service',
    badge: '低门槛验证',
  },
  {
    tier: 'paid-mid',
    price: '¥299',
    priceNumeric: 299,
    title: '合同风险初筛',
    whoFor: '准备签合同，但担心口头承诺没有写清',
    delivers: '合同模糊条款提醒 + 修改建议方向',
    href: '/services/renovation#quote-standard',
    cta: '看合同初筛',
    source: 'service',
    badge: '主推',
  },
  {
    tier: 'paid-high',
    price: '¥699',
    priceNumeric: 699,
    title: '报价对比判断',
    whoFor: '手里有 2-3 家装修公司报价，不知道怎么选',
    delivers: '报价差异分析 + 风险对比 + 追问重点',
    href: '/services/renovation#quote-deep',
    cta: '看报价对比',
    source: 'service',
    badge: '快签前',
  },
]

/** 仅取付费档（用于价格页主梯子展示） */
export const paidLadder = commercialLadder.filter((r) => r.tier !== 'free')

/** 首页展示完整主路径：免费初筛 -> 三档人工判断 */
export const homepageLadder: LadderRung[] = commercialLadder

/** 主服务三档：报价风险初筛 / 合同风险初筛 / 报价对比判断 */
export const serviceLadder: LadderRung[] = paidLadder
