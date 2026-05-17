/**
 * 全站唯一的"业主签约前报价风险判断"商业梯子。
 * 任何展示价格梯度的位置（首页、服务页、价格页、Footer CTA）都必须从这里读，
 * 不要在页面里再写一遍价格、文案、跳转。
 *
 * 维护规则：
 * - 改价格 / 改命名 / 增减档位 → 只动这个文件
 * - 三个 variant（compact / full / summary）由 CommercialLadder 组件统一渲染
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
  /** 展示用价格文本，如 "免费" / "¥39" / "¥699" */
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
  /** 可选高亮徽标，例如 "主线起点" / "签约前最常用" */
  badge?: string
}

export const commercialLadder: LadderRung[] = [
  {
    tier: 'free',
    price: '免费',
    priceNumeric: 0,
    title: '报价初筛工具',
    whoFor: '已经拿到报价，但还没签字',
    delivers: '8 分钟出风险等级 + 重点追问清单',
    href: '/tools/quote-check',
    cta: '先做免费初筛',
    source: 'tool',
    badge: '主线起点',
  },
  {
    tier: 'paid-low',
    price: '¥39',
    priceNumeric: 39,
    title: '装修报价风险自查指南',
    whoFor: '想自己系统过一遍报价、合同、付款节点和增项',
    delivers: '检查模板 + 追问框架 + 签约前自查 SOP',
    href: '/pricing/baojia-guide',
    cta: '看 ¥39 指南',
    source: 'product',
  },
  {
    tier: 'paid-mid',
    price: '¥399',
    priceNumeric: 399,
    title: '预算取舍诊断',
    whoFor: '预算总数有了，但不知道哪些钱该守、哪些可以缓',
    delivers: '一次诊断 + 取舍优先级表',
    href: '/services/renovation#yusuan-zixun',
    cta: '看取舍诊断',
    source: 'service',
  },
  {
    tier: 'paid-mid',
    price: '¥699',
    priceNumeric: 699,
    title: '报价风险快审',
    whoFor: '手里已经有报价单，想尽快判断该追问什么',
    delivers: '人工逐项审 + 风险说明 + 追问清单',
    href: '/services/renovation#baojia-shenhe',
    cta: '看 ¥699 快审',
    source: 'service',
    badge: '签约前最常用',
  },
  {
    tier: 'paid-high',
    price: '¥1499',
    priceNumeric: 1499,
    title: '签约前决策包',
    whoFor: '报价、预算、合同同时卡住，临近签字',
    delivers: '报价 + 合同 + 付款节点一次看全',
    href: '/services/renovation#qianyue-qian-juece-bao',
    cta: '看决策包',
    source: 'service',
  },
]

/** 仅取付费档（用于价格页主梯子展示） */
export const paidLadder = commercialLadder.filter((r) => r.tier !== 'free')

/** 首页展示完整主路径：免费初筛 -> 指南 -> 三档服务 */
export const homepageLadder: LadderRung[] = commercialLadder

/** 主服务三档：预算取舍 / 报价快审 / 签约前决策 */
export const serviceLadder: LadderRung[] = commercialLadder.filter((r) =>
  ['paid-mid', 'paid-high'].includes(r.tier),
)
