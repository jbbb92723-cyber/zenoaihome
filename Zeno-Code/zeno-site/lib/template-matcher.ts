/**
 * lib/template-matcher.ts
 * 模板匹配 + 变量填充 — 从统一模板库匹配
 */

import { ALL_TEMPLATES, getTemplatesBySystemCategory, SYSTEM_TO_UI } from './templates'
import type { Template } from './templates'

export type { Template }

interface MatchResult {
  template: Template | null
  filledContent: string
  category: string
}

/**
 * 根据系统分类匹配最佳模板 + 填充变量
 */
export function matchTemplate(
  systemCategory: string,
  variables: { name?: string; phone?: string; wechat?: string; message?: string; serviceType?: string }
): MatchResult {
  const candidates = getTemplatesBySystemCategory(systemCategory)

  // 无匹配则用 general
  const pool = candidates.length > 0
    ? candidates
    : getTemplatesBySystemCategory('general')

  const template = pool[0] ?? null

  let filledContent = template?.content ?? ''
  const name = variables.name
  if (name) {
    filledContent = filledContent.replace(/您好/g, `${name}，您好`)
  }

  return { template, filledContent, category: systemCategory }
}

/** 获取所有模板（AiReplyClient 用） */
export function getAllTemplates(): Template[] {
  return ALL_TEMPLATES
}

/** 按 UI 分类获取模板 */
export { getTemplatesByCategory } from './templates'
