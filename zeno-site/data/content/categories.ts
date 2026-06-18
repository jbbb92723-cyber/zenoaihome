/**
 * data/content/categories.ts
 *
 * ZenoAIHome 网站内容分类体系。
 * 7 个一级分类 + 床垫干货 & OPC 的二级子分类。
 */

export interface ContentCategory {
  slug: string
  name: string
  parentSlug?: string
  description?: string
}

/* ─── 一级分类 ─────────────────────────────────────── */

export const primaryCategories: ContentCategory[] = [
  {
    slug: 'renovation',
    name: '装修避坑',
    description: '装修合同陷阱、施工标准、验收清单、预算拆解',
  },
  {
    slug: 'mattress',
    name: '床垫干货',
    description: '床垫材料拆解、选购指南、行业内幕、避坑技巧',
  },
  {
    slug: 'lifestyle',
    name: '生活方式',
    description: '第四代居住审美、睡眠哲学、身心空间、消费观',
  },
  {
    slug: 'ip',
    name: 'IP方法论',
    description: '个人品牌定位、内容创作、信任建立、变现路径',
  },
  {
    slug: 'ai',
    name: 'AI实战',
    description: 'AI工具清单、工作流搭建、提示词工程、传统行业应用',
  },
  {
    slug: 'opc',
    name: 'OPC·同行有你',
    description: '一人公司模式、实战项目、社群动态、AI新学社',
  },
  {
    slug: 'about',
    name: '关于我',
    description: '我的转型故事、从业经历、联系方式',
  },
]

/* ─── 二级分类 ─────────────────────────────────────── */

export const subcategories: ContentCategory[] = [
  // 床垫干货的子分类
  { slug: 'buying', name: '选购认知', parentSlug: 'mattress' },
  { slug: 'material', name: '材料拆解', parentSlug: 'mattress' },
  { slug: 'insider', name: '行业内幕', parentSlug: 'mattress' },
  { slug: 'care', name: '保养与使用', parentSlug: 'mattress' },
  // OPC·同行有你的子分类
  { slug: 'solo-method', name: '一人公司方法论', parentSlug: 'opc' },
  { slug: 'projects', name: '实战项目', parentSlug: 'opc' },
  { slug: 'community', name: '社群动态', parentSlug: 'opc' },
  { slug: 'ai-school', name: 'AI新学社', parentSlug: 'opc' },
]

/* ─── 查找辅助函数 ──────────────────────────────────── */

export function getPrimaryCategory(slug: string): ContentCategory | undefined {
  return primaryCategories.find((c) => c.slug === slug)
}

export function getSubcategory(slug: string): ContentCategory | undefined {
  return subcategories.find((c) => c.slug === slug)
}

export function getSubcategoriesForParent(parentSlug: string): ContentCategory[] {
  return subcategories.filter((c) => c.parentSlug === parentSlug)
}

export function getCategoryBySlug(slug: string): ContentCategory | undefined {
  return (
    getPrimaryCategory(slug) ??
    getSubcategory(slug)
  )
}

/**
 * 将旧的 article.category 中文名映射到新的 category slug。
 * 用于 BlogClient 筛选时兼容存量数据。
 */
export function mapLegacyCategoryToSlug(legacyCategory: string): string {
  const lookup: Record<string, string> = {
    '真实居住': 'renovation',
    '判断与生活': 'lifestyle',
    '工具与产品': 'renovation',
    'AI 实践': 'ai',
    '一人公司': 'opc',
    '生活判断': 'renovation',
    '方案与空间判断': 'lifestyle',
    '报价与交付判断': 'renovation',
    'AI与个体判断': 'ai',
  }
  return lookup[legacyCategory] ?? legacyCategory
}

/**
 * 按旧中文分类名获取对应的新分类中文名。
 */
export function mapLegacyCategoryToName(legacyCategory: string): string {
  const slug = mapLegacyCategoryToSlug(legacyCategory)
  const found = getPrimaryCategory(slug)
  return found?.name ?? legacyCategory
}

/* ─── 分类中文名 → slug 映射（用于 category 字段和 url 参数） ─── */

export const categoryNameToSlug: Record<string, string> = {
  '装修避坑': 'renovation',
  '床垫干货': 'mattress',
  '生活方式': 'lifestyle',
  'IP方法论': 'ip',
  'AI实战': 'ai',
  'OPC·同行有你': 'opc',
  '关于我': 'about',
  '选购认知': 'buying',
  '材料拆解': 'material',
  '行业内幕': 'insider',
  '保养与使用': 'care',
  '一人公司方法论': 'solo-method',
  '实战项目': 'projects',
  '社群动态': 'community',
  'AI新学社': 'ai-school',
}
