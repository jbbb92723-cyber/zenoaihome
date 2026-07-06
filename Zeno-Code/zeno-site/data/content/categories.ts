/**
 * data/content/categories.ts
 *
 * ZenoAIHome 网站内容分类体系。
 * 6 个一级分类，对齐「判断框架」而非「主题标签」。
 * 每个分类回答的不是「我写过什么话题」，
 * 而是「我能在这个领域提供什么判断」。
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
    name: '装修全案判断',
    description: '从空间方案到交付风险，17 年全链条判断——合同审查、施工标准、预算拆解、验收清单',
  },
  {
    slug: 'mattress',
    name: '床垫选购判断',
    description: '床垫材料拆解、选购方法、定价逻辑、使用与保养',
  },
  {
    slug: 'lifestyle',
    name: '居住方式',
    description: '第四代居住审美、睡眠哲学、身心空间、消费观',
  },
  {
    slug: 'ip',
    name: '把自己重做一遍',
    description: '一个传统行业的人怎么用内容和 AI 重建自己——定位、表达、信任建立',
  },
  {
    slug: 'ai',
    name: 'AI 落地判断',
    description: '哪些能用、哪些是坑——传统行业 × AI 实战、工作流搭建、真实案例',
  },
  {
    slug: 'opc',
    name: 'OPC·同行有你',
    description: '一人公司模式、工程方法、实战项目、社群共建',
  },
  {
    slug: 'about',
    name: '关于我',
    description: '我的转型故事、从业经历、判断年表、联系方式',
  },
]

/* ─── 二级分类 ─────────────────────────────────────── */

export const subcategories: ContentCategory[] = [
  // 床垫选购判断的子分类
  { slug: 'buying', name: '选购认知', parentSlug: 'mattress' },
  { slug: 'material', name: '材料拆解', parentSlug: 'mattress' },
  { slug: 'insider', name: '买手经验', parentSlug: 'mattress' },
  { slug: 'care', name: '保养与使用', parentSlug: 'mattress' },
  // OPC·同行有你的子分类
  { slug: 'solo-method', name: '一人公司工程方法', parentSlug: 'opc' },
  { slug: 'projects', name: '实战项目', parentSlug: 'opc' },
  { slug: 'community', name: '同行社群', parentSlug: 'opc' },
  { slug: 'ai-school', name: 'AI 成长营', parentSlug: 'opc' },
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
  // 新标签名（判断框架）
  '装修全案判断': 'renovation',
  '床垫选购判断': 'mattress',
  '居住方式': 'lifestyle',
  '把自己重做一遍': 'ip',
  'AI 落地判断': 'ai',
  'OPC·同行有你': 'opc',
  '关于我': 'about',
  // 旧标签名（向后兼容存量文章数据）
  '装修避坑': 'renovation',
  '装修美学': 'renovation',
  '床垫干货': 'mattress',
  '生活方式': 'lifestyle',
  'IP方法论': 'ip',
  'IP孵化': 'ip',
  'AI实战': 'ai',
  'AI知识库': 'ai',
  '行业内幕': 'insider',
  // 二级分类
  '选购认知': 'buying',
  '材料拆解': 'material',
  '买手经验': 'insider',
  '保养与使用': 'care',
  '一人公司工程方法': 'solo-method',
  '实战项目': 'projects',
  '同行社群': 'community',
  'AI 成长营': 'ai-school',
}
