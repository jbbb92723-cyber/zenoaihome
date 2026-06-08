/**
 * data/services/products.ts
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
  category:    '装修判断'
  bestFor:     string
  deliverable: string
  isActive:    boolean
}

export const PRODUCTS: Product[] = [
  {
    id:           'quote-guide-pack',
    name:         '装修报价风险自查指南',
    tagline:      '签约前先把报价看明白',
    type:         'resource',
    value:        'quote-guide-pack|装修报价风险自查指南|/services',
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
    isActive: false,
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
]

/** 根据 id 查找商品（不存在返回 null）*/
export function getProductById(id: string): Product | null {
  return PRODUCTS.find((p) => p.id === id && p.isActive) ?? null
}

/** 分 → 元字符串 */
export function formatYuan(cents: number): string {
  return `¥${(cents / 100).toFixed(2).replace(/\.00$/, '')}`
}
