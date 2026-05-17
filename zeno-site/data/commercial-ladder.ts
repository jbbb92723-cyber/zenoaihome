/**
 * 全站唯一的"业主签约前报价风险判断"商业梯子。
 * 任何展示价格梯度的位置（首页、服务页、价格页、Footer CTA）都必须从这里读，
 * 不要在页面里再写一遍价格、文案、跳转。
 *
 * 维护规则：
 * - 改价格 / 改命名 / 增减档位 → 只动这个文件
 * - 三个 variant（compact / full / summary）由 CommercialLadder 组件统一渲染
 * - 主路径只保留：免费初筛 -> ¥99 体验版 -> ¥299 标准版 -> ¥699 深度版
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
    delivers: '8 分钟生成风险等级和重点追问清单',
    href: '/tools/quote-check',
    cta: '先做免费初筛',
    source: 'tool',
    badge: '主线起点',
  },
  {
    tier: 'paid-low',
    price: '¥99',
    priceNumeric: 99,
    title: '体验版报价风险初查',
    whoFor: '只想先知道这份报价有没有明显风险',
    delivers: '检查 10 行以内重点报价，标出 3 个高风险点和 5 个追问问题',
    href: '/services/renovation#quote-entry',
    cta: '看 ¥99 初查',
    source: 'service',
    badge: '低门槛验证',
  },
  {
    tier: 'paid-mid',
    price: '¥299',
    priceNumeric: 299,
    title: '标准版报价风险快审',
    whoFor: '手里有完整报价，准备继续谈或准备签约',
    delivers: '完整报价风险说明 + 漏项/模糊项/增项口子 + 签约前追问清单',
    href: '/services/renovation#quote-standard',
    cta: '看 ¥299 快审',
    source: 'service',
    badge: '主推',
  },
  {
    tier: 'paid-high',
    price: '¥699',
    priceNumeric: 699,
    title: '深度版签约前判断',
    whoFor: '已经接近签合同，报价、合同和付款节点都要一起看',
    delivers: '报价 + 合同 + 付款节点风险判断，附 30 分钟微信语音解读',
    href: '/services/renovation#quote-deep',
    cta: '看 ¥699 深度版',
    source: 'service',
    badge: '快签前',
  },
]

/** 仅取付费档（用于价格页主梯子展示） */
export const paidLadder = commercialLadder.filter((r) => r.tier !== 'free')

/** 首页展示完整主路径：免费初筛 -> ¥99 -> ¥299 -> ¥699 */
export const homepageLadder: LadderRung[] = commercialLadder

/** 主服务三档：体验版初查 / 标准版快审 / 深度版签约前判断 */
export const serviceLadder: LadderRung[] = paidLadder
