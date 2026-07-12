/**
 * 全站统一的「居住决策支持」判断路径。
 * 任何展示判断路径的位置（首页、服务页、Footer CTA）都必须从这里读，
 * 不要在页面里再写一遍文案、跳转。
 *
 * 维护规则：
 * - 改路径 / 改命名 / 增减档位 → 只动这个文件
 * - 两个 variant（compact / full）由 CommercialLadder 组件统一渲染
 * - 精简原则（2026-07-13）：
 *   免费层接流量 → ¥2,500 旗舰交付 → 节点顾问锁定长期 → 床垫延长客户关系
 *   砍掉：¥199 信任入口（免费工具已足够筛选）、¥499 快审（和旗舰边界模糊）、
 *         ¥1,999 综合（无人下单）
 */

export type LadderTier =
  | 'free'
  | 'paid-flagship'
  | 'paid-high'
  | 'paid-low'

export type LadderRung = {
  tier: LadderTier
  price: string
  priceNumeric: number
  title: string
  whoFor: string
  delivers: string
  href: string
  cta: string
  source: 'tool' | 'product' | 'service'
  badge?: string
}

export const commercialLadder: LadderRung[] = [
  // ── 免费层：判断工具（帮人自己看）─────────────────
  {
    tier: 'free',
    price: '免费',
    priceNumeric: 0,
    title: 'AI 居住诊断',
    whoFor: '还没想清楚要装成什么样的人。先别急着翻效果图，把你的生活方式和偏好捋一遍。',
    delivers: '理清你的生活目标、家庭场景、审美偏好和预算边界，给一个下一步的方向',
    href: '/living-diagnosis',
    cta: '先做居住诊断',
    source: 'tool',
    badge: '起点',
  },
  {
    tier: 'free',
    price: '免费',
    priceNumeric: 0,
    title: '报价初筛工具',
    whoFor: '手里已经有一两份报价了，想知道它有没有坑、有没有漏项。',
    delivers: '风险等级、重点缺项标记和签约前要追问的问题清单',
    href: '/tools/quote-check',
    cta: '先做免费初筛',
    source: 'tool',
    badge: '签约前入口',
  },
  // ── 旗舰层：零加价保障审查 ──────────────────
  {
    tier: 'paid-flagship',
    price: '¥2,500',
    priceNumeric: 250000,
    title: '装修报价零加价保障审查',
    whoFor: '准备签约了，需要一个人把报价单的每一行都审过去——13个风险边界逐项排查，审过的项目出了问题帮你追回。',
    delivers: '13边界逐项审核报告（24h内）+ 施工前3个月微信答疑 + 装修合同避雷指南 + 入住后1年售后咨询。保证：审过的项目变相加价，帮你追回——追不回，全额退款。',
    href: '/services/quote-review',
    cta: '提交报价单',
    source: 'service',
    badge: '旗舰',
  },
  // ── 进阶层：施工陪伴 ──────────────────
  {
    tier: 'paid-high',
    price: '¥2,000起',
    priceNumeric: 200000,
    title: '施工全程节点顾问',
    whoFor: '已经签了合同进入施工阶段，想在每个关键节点（水电、防水、贴砖、竣工）有人帮你判断的人。',
    delivers: '每个节点发照片给我 → 告诉你该查什么、照片里漏了什么、下一步注意什么。第一个节点不满意退款。',
    href: '/services/node-advisor',
    cta: '看节点顾问',
    source: 'service',
    badge: '进阶',
  },
  // ── 延长关系：床垫直售 ──────────────────
  {
    tier: 'paid-low',
    price: '¥299起',
    priceNumeric: 29900,
    title: 'Zeno 严选床垫',
    whoFor: '装完入住，最后一件大事——选一张能睡十几年的床垫。',
    delivers: '内部结构保50年。不是代购，是我自己选品自己卖——17年行业经验帮你筛掉了市面上90%的坑。',
    href: '/mattress',
    cta: '选床垫',
    source: 'product',
    badge: '自有产品',
  },
]

/** 首页展示完整主路径 */
export const homepageLadder: LadderRung[] = commercialLadder

/** 主服务档：保留完整路径 */
export const serviceLadder: LadderRung[] = commercialLadder
