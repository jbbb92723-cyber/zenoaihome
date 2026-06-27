import {
  getQuoteRiskRuleById,
  getQuoteRiskRuleBySlug,
  quoteRiskDimensions,
  type QuoteRiskDimension,
} from './quote-risk-rules'

export type { QuoteRiskDimension, QuoteRiskDictionaryItem, QuoteRiskRule } from './quote-risk-rules'
export { quoteRiskDimensions, quoteRiskDictionary, quoteRiskRules } from './quote-risk-rules'
export type { RenovationProjectRisk, RenovationProjectRiskItem } from './renovation-project-risks'
export { getRenovationProjectRiskBySlug, projectRiskLibrary, renovationProjectRisks } from './renovation-project-risks'
export type { ChecklistTemplate, QuoteCheckTemplate } from './checklist-templates'
export { checklistTemplates, getChecklistTemplateBySlug, quoteCheckTemplates } from './checklist-templates'

export function getQuoteRiskDimensionByKey(key: QuoteRiskDimension['key']) {
  return quoteRiskDimensions.find((item) => item.key === key)
}

export { getQuoteRiskRuleBySlug, getQuoteRiskRuleById }
