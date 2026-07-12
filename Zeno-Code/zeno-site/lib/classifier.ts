/**
 * lib/classifier.ts
 * AI 分类引擎 — 纯规则，零外部依赖
 *
 * 优先级：serviceType 映射 > 关键词匹配 > general 兜底
 */

// ─── serviceType → 分类映射 ──────────────────────────────

const SERVICE_TYPE_MAP: Record<string, string> = {
  '报价风险初查':      'quote_review',
  '报价 / 合同快审':   'contract_review',
  '居住需求洞察报告':   'living_diagnosis',
  '居住方案综合判断':   'living_diagnosis',
  '预算取舍诊断':       'budget',
  '居住场景装修服务':   'living_diagnosis',
  'quote_review':      'quote_review',
  'contract_review':   'contract_review',
  'living_diagnosis':  'living_diagnosis',
  'budget':            'budget',
}

// ─── 关键词词典 ──────────────────────────────────────────

interface KeywordRule {
  keywords: string[]
  category: string
}

const KEYWORD_RULES: KeywordRule[] = [
  {
    category: 'quote_review',
    keywords: [
      '报价', '报价单', '报价表', '报价审查', '报价审核',
      '价格', '总价', '单价', '多少钱', '预算不够',
      '增项', '漏项', '暂估', '另计', '按实结算',
      '材料费', '人工费', '管理费', '税费',
      '基础部分', '总合计', '闭口价',
    ],
  },
  {
    category: 'contract_review',
    keywords: [
      '合同', '签约', '签合同', '合同条款', '合同审核',
      '付款节点', '付款比例', '定金', '首付', '尾款',
      '口头承诺', '写进合同', '材料替换', '型号',
      '工期', '延期', '违约金', '质保', '保修',
    ],
  },
  {
    category: 'living_diagnosis',
    keywords: [
      '设计', '方案', '户型', '平面', '效果图',
      '风格', '审美', '生活方式', '家庭成员', '收纳',
      '动线', '空间', '客厅', '卧室', '厨房', '卫生间',
      '居住需求', '需求梳理', '生活习惯', '旧房翻新',
    ],
  },
  {
    category: 'budget',
    keywords: [
      '预算', '多少钱', '花多少', '省钱', '划算',
      '性价比', '装修费用', '装修要花', '控制预算', '超预算',
      '分配', '优先级', '取舍',
    ],
  },
]

// ─── 分类函数 ────────────────────────────────────────────

export interface ClassificationResult {
  category: string
  categoryLabel: string
  confidence: number  // 0-1
  matchedKeywords: string[]
  source: 'serviceType' | 'keywords' | 'fallback'
}

const CATEGORY_LABELS: Record<string, string> = {
  quote_review:     '报价审查',
  contract_review:  '合同审核',
  living_diagnosis: '居住诊断',
  budget:           '预算咨询',
  general:          '通用咨询',
}

export function classify(serviceType: string, message: string): ClassificationResult {
  // 1. 优先：用户选择的 serviceType
  const mapped = SERVICE_TYPE_MAP[serviceType]
  if (mapped) {
    return {
      category: mapped,
      categoryLabel: CATEGORY_LABELS[mapped] ?? mapped,
      confidence: 0.9,
      matchedKeywords: [serviceType],
      source: 'serviceType',
    }
  }

  // 2. 关键词匹配
  const text = (serviceType + ' ' + (message ?? '')).toLowerCase()
  let bestMatch: { category: string; keywords: string[] } | null = null
  let bestScore = 0

  for (const rule of KEYWORD_RULES) {
    const matched = rule.keywords.filter((kw) => text.includes(kw.toLowerCase()))
    if (matched.length > bestScore) {
      bestScore = matched.length
      bestMatch = { category: rule.category, keywords: matched }
    }
  }

  if (bestMatch && bestScore >= 2) {
    return {
      category: bestMatch.category,
      categoryLabel: CATEGORY_LABELS[bestMatch.category] ?? bestMatch.category,
      confidence: Math.min(0.8, bestScore * 0.15),
      matchedKeywords: bestMatch.keywords,
      source: 'keywords',
    }
  }

  // 3. 兜底
  return {
    category: 'general',
    categoryLabel: '通用咨询',
    confidence: 0.3,
    matchedKeywords: [],
    source: 'fallback',
  }
}

/**
 * 根据分类匹配相关文章
 */
export function suggestArticles(category: string): string[] {
  const map: Record<string, string[]> = {
    quote_review:     ['01', '02', '05', '109', '110', '111'],
    contract_review:  ['01', '03', '109', '112', '113'],
    living_diagnosis: ['08', '09', '16', '21', '22'],
    budget:           ['01', '02', '03', '05'],
    general:          ['01', '02', '03', '08'],
  }
  return map[category] ?? map.general!
}
