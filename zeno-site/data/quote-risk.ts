import { quoteRiskDimensions, type QuoteRiskDimension } from './quote-risk-rules'

export type { QuoteRiskDimension, QuoteRiskDictionaryItem, QuoteRiskRule } from './quote-risk-rules'
export { quoteRiskDimensions, quoteRiskDictionary, quoteRiskRules } from './quote-risk-rules'
export type { RenovationProjectRiskItem } from './renovation-project-risks'
export { projectRiskLibrary } from './renovation-project-risks'
export type { QuoteCheckTemplate } from './checklist-templates'
export { quoteCheckTemplates } from './checklist-templates'

export function getQuoteRiskDimensionByKey(key: QuoteRiskDimension['key']) {
  return quoteRiskDimensions.find((item) => item.key === key)
}
