export interface QuoteCheckTemplate {
  id: string
  title: string
  use: string
  output: string
}

export const quoteCheckTemplates: QuoteCheckTemplate[] = [
  {
    id: 'pre-sign-question',
    title: '签约前追问模板',
    use: '直接发给施工方，追问报价里最容易漏掉的边界。',
    output: '问题 + 需要写清的内容 + 回复后是否影响签约判断。',
  },
  {
    id: 'contract-addendum',
    title: '合同补充模板',
    use: '把口头承诺落进补充条款。',
    output: '项目范围、材料型号、变更流程、验收节点、付款节点。',
  },
  {
    id: 'quote-comparison',
    title: '报价对比模板',
    use: '把几家报价放到同一口径里比较。',
    output: '拆项目、拆单位、拆工艺、拆变更、拆付款。',
  },
  {
    id: 'risk-summary',
    title: '风险摘要模板',
    use: '给家人或自己做最终判断时看。',
    output: '风险等级、最重要的 3 个问题、下一步建议。',
  },
]
