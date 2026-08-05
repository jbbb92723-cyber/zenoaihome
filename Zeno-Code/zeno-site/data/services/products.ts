import {
  SPARK_COMMUNITY_DURATION_DAYS,
  SPARK_COMMUNITY_PLAN,
  SPARK_COMMUNITY_PRICE,
  SPARK_COMMUNITY_PRODUCT_ID,
} from '@/lib/domains/community/constants'

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
  category:    '装修判断' | '星火者'
  bestFor:     string
  deliverable: string
  isActive:    boolean
  requiresApproval?: boolean
}

export const PRODUCTS: Product[] = [
  {
    id:           SPARK_COMMUNITY_PRODUCT_ID,
    name:         '星火者共同体 · 首期成员',
    tagline:      '20 人，6 个月，一起验证真实协作',
    type:         'membership',
    value:        `${SPARK_COMMUNITY_PLAN}:${SPARK_COMMUNITY_DURATION_DAYS}`,
    price:        SPARK_COMMUNITY_PRICE,
    category:     '星火者',
    bestFor:      '正在经营一人公司、转型创业或推进真实项目，并愿意分享与协作的实践者。',
    deliverable:  '6 个月共同体成员资格、火种读书会、成员连接与共燃项目参与机会。',
    description:  [
      '申请与 15 分钟面聊，先确认彼此预期',
      '火种技能读书会与真实项目复盘',
      '带上下文的成员连接，而不是通讯录交换',
      '72 小时无条件退款',
    ],
    badge:        '首期 20 人',
    isActive:     true,
    requiresApproval: true,
  },
  {
    id:           'quote-self-check-kit',
    name:         '装修报价自查工具包',
    tagline:      '¥49，对着清单自己审一遍——13个边界、3个真实案例、一步步来',
    type:         'resource',
    value:        'quote-self-check-kit|装修报价自查工具包|/resources',
    price:        4900,
    originalPrice: 9900,
    category:     '装修判断',
    bestFor:      '刚拿到报价单，想自己先审一遍、有一定学习意愿的人。',
    deliverable:  '13边界逐项检查清单(PDF) + 15分钟视频讲解 + 3个真实报价单标注案例。',
    description:  [
      '13边界逐项检查清单（可打印，对着你的报价单逐项打勾）',
      '15分钟视频讲解（每个边界具体看报价单上的什么位置）',
      '3个真实报价单的标注案例（看看Zeno是怎么标注问题的）',
      '审完还不确定？¥2,500 完整审核等你升级',
    ],
    badge: '自助',
    isActive: true,
  },
  {
    id:           'quote-guide-pack',
    name:         '装修报价风险自查指南',
    tagline:      '签约前先把报价看明白',
    type:         'resource',
    value:        'quote-guide-pack|装修报价风险自查指南|/services',
    price:        0,
    originalPrice: 0,
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
    price:        0,
    originalPrice: 0,
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
