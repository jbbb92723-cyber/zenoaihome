/**
 * data/products.ts
 *
 * 站内售卖商品静态定义
 * 价格单位：分（人民币）
 */

export interface Product {
  id:          string
  name:        string
  tagline:     string
  type:        'membership' | 'resource' | 'service'
  /** 权益参数，与兑换码 value 格式一致 */
  value:       string
  price:       number    // 分
  originalPrice?: number // 划线价（分）
  description: string[]
  badge?:      string
  category:    '装修判断' | 'AI 升级' | '内容资产'
  bestFor:     string
  deliverable: string
  isActive:    boolean
}

export const PRODUCTS: Product[] = [
  {
    id:           'quote-guide-pack',
    name:         '装修报价避坑完整指南',
    tagline:      '签约前先把报价看明白',
    type:         'resource',
    value:        'quote-guide-pack|装修报价避坑完整指南|/pricing/baojia-guide',
    price:        3900,
    originalPrice: 9900,
    category:     '装修判断',
    bestFor:      '已经拿到报价单，想自己先过一遍风险的人。',
    deliverable:  '6 张检查表 + 报价追问框架 + 签约前核对顺序。',
    description:  [
      '报价漏项检查表',
      '模糊工艺追问清单',
      '水电和增项风险提醒',
      '合同前最后一轮核对顺序',
    ],
    badge: '入门',
    isActive: true,
  },
  {
    id:           'renovation-judgment-course',
    name:         '装修判断力入门小课',
    tagline:      '从报价、预算、合同到验收的判断顺序',
    type:         'resource',
    value:        'renovation-judgment-course|装修判断力入门小课|/resources',
    price:        9900,
    originalPrice: 19900,
    category:     '装修判断',
    bestFor:      '第一次装修、想系统建立判断顺序的人。',
    deliverable:  '4 节短课 + 3 张流程图 + 关键节点清单。',
    description:  [
      '装修前先判断什么，不先判断什么',
      '报价、预算、合同三者怎么互相校验',
      '施工节点怎么留痕和验收',
      '什么时候该自己判断，什么时候该找人',
    ],
    isActive: true,
  },
  {
    id:           'ai-workflow-course',
    name:         '传统装修行业 AI 工作流小课',
    tagline:      '把现场经验接进 AI，而不是追工具',
    type:         'resource',
    value:        'ai-workflow-course|传统装修行业 AI 工作流小课|/tools/prompts',
    price:        19900,
    originalPrice: 39900,
    category:     'AI 升级',
    bestFor:      '装修从业者、设计师、销售、内容创作者和一人公司。',
    deliverable:  '5 个装修行业 AI 场景 + 输入模板 + 提示词框架。',
    description:  [
      '报价追问、客户沟通、施工留痕、内容选题四类场景',
      '每个场景的输入模板和人工校准点',
      '如何把一次提示词沉淀成 SOP',
      '从工具使用走向内容、服务和数字产品',
    ],
    badge: '推荐',
    isActive: true,
  },
  {
    id:           'creator-yearly',
    name:         '内容资产会员年卡',
    tagline:      '长期更新的选题、提示词和内容系统',
    type:         'membership',
    value:        'creator:365',
    price:        19900,
    originalPrice: 34800,
    category:     '内容资产',
    bestFor:      '已经决定长期写作和经营个人品牌的人。',
    deliverable:  '全年内容资产库 + 提示词包 + 模板持续更新。',
    description:  [
      '选题库、标题库和文章结构模板',
      'AI 提示词完整包持续更新',
      '发布前检查清单',
      '1 次 30 分钟创作问诊',
    ],
    isActive: true,
  },
]

/** 根据 id 查找商品（不存在返回 null）*/
export function getProductById(id: string): Product | null {
  return PRODUCTS.find((p) => p.id === id && p.isActive) ?? null
}

/** 分 → 元字符串 */
export function formatYuan(cents: number): string {
  return `¥${(cents / 100).toFixed(2).replace(/\.00$/, '')}`
}
