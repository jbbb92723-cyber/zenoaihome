/**
 * 全站统一的「居住决策支持」判断路径。
 * 任何展示判断路径的位置（首页、服务页、Footer CTA）都必须从这里读，
 * 不要在页面里再写一遍文案、跳转。
 *
 * 维护规则：
 * - 改路径 / 改命名 / 增减档位 → 只动这个文件
 * - 两个 variant（compact / full）由 CommercialLadder 组件统一渲染
 * - 主路径：理想生活 -> 美学与生活方式 -> 空间方案与家庭场景 -> 装修决策 -> 预算/报价/合同/交付风险
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
  /** 展示用价格文本，如 "免费" */
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
  /** 数据来源（工具、资料、人工服务） */
  source: 'tool' | 'product' | 'service'
  /** 可选高亮徽标 */
  badge?: string
}

export const commercialLadder: LadderRung[] = [
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
  {
    tier: 'paid-low',
    price: '¥199',
    priceNumeric: 19900,
    title: '报价风险初查',
    whoFor: '刚拿到第一份重点报价，想快速扫一眼有没有明显问题。',
    delivers: '3 个高风险点 + 5 个签约前必须问清楚的问题 + 微信发你结果',
    href: '/services#quote-entry',
    cta: '提交报价初查',
    source: 'service',
    badge: '低门槛',
  },
  {
    tier: 'paid-mid',
    price: '¥499',
    priceNumeric: 49900,
    title: '报价 / 合同快审',
    whoFor: '已经在比较两三家装修公司了，想知道哪份报价更实在、哪份合同更靠谱。',
    delivers: '完整报价逐项分析 + 合同关键条款检查 + 付款节点建议 + 漏项和增项风险标记',
    href: '/services/quote-standard',
    cta: '提交报价合同',
    source: 'service',
    badge: '主推',
  },
  {
    tier: 'paid-high',
    price: '¥1999',
    priceNumeric: 199900,
    title: '居住方案综合判断',
    whoFor: '需要把生活方式、预算、报价、合同和交付风险放在一起看的人。',
    delivers: '方案适配判断 + 完整报价/合同/交付风险报告 + 30 分钟语音给你讲清楚',
    href: '/services#quote-deep',
    cta: '提交完整材料',
    source: 'service',
    badge: '深度服务',
  },
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
  {
    tier: 'paid-low',
    price: '¥299',
    priceNumeric: 29900,
    title: '床垫选购建议',
    whoFor: '看了床垫文章还是拿不准，想让我帮你看几款，给一个适合你的推荐。',
    delivers: '根据你的身高体重、睡姿和预算，从你挑的 3-5 款里帮你选出最合适的 + 避坑提醒',
    href: '/services#mattress',
    cta: '提交床垫需求',
    source: 'service',
    badge: '新增',
  },
]

/** 首页展示完整主路径 */
export const homepageLadder: LadderRung[] = commercialLadder

/** 主服务档：全部免费，保留完整路径 */
export const serviceLadder: LadderRung[] = commercialLadder.filter((r) => r.tier !== 'paid-flagship')
