export type LivingDiagnosisDimension =
  | 'lifeOrder'
  | 'familyRelation'
  | 'aestheticMaturity'
  | 'workAndStudy'
  | 'storageAndMaintenance'
  | 'budgetClarity'
  | 'signingRisk'

export type LivingDiagnosisQuestion = {
  id: string
  dimension: LivingDiagnosisDimension
  title: string
  helper: string
  options: Array<{
    value: string
    label: string
    score: number
  }>
}

export const livingDiagnosisQuestions: LivingDiagnosisQuestion[] = [
  {
    id: 'current-stage',
    dimension: 'signingRisk',
    title: '你现在处在装修的哪个阶段？',
    helper: '阶段决定下一步该先看需求、预算，还是报价合同。',
    options: [
      { value: 'thinking', label: '还在想怎么住，没定方案', score: 1 },
      { value: 'planning', label: '有户型或灵感图，准备做方案', score: 2 },
      { value: 'quote', label: '已经拿到报价，准备比较', score: 4 },
      { value: 'signing', label: '快签约了，心里没底', score: 5 },
    ],
  },
  {
    id: 'life-problem',
    dimension: 'lifeOrder',
    title: '你最想让这个家改善哪件事？',
    helper: '这不是风格问题，而是空间要支持的生活问题。',
    options: [
      { value: 'order', label: '生活更有秩序，不再乱', score: 5 },
      { value: 'emotion', label: '情绪更稳定，回家能放松', score: 4 },
      { value: 'relation', label: '家人之间更舒服，少冲突', score: 4 },
      { value: 'efficiency', label: '工作、学习、家务更顺手', score: 3 },
    ],
  },
  {
    id: 'aesthetic-state',
    dimension: 'aestheticMaturity',
    title: '你对审美最担心什么？',
    helper: '成熟审美不是追流行，而是知道什么适合长期生活。',
    options: [
      { value: 'trend', label: '怕被网红风带偏', score: 4 },
      { value: 'boring', label: '怕太实用但不好看', score: 3 },
      { value: 'messy', label: '喜欢很多东西，但组合起来乱', score: 5 },
      { value: 'unclear', label: '说不清自己到底喜欢什么', score: 5 },
    ],
  },
  {
    id: 'budget-mindset',
    dimension: 'budgetClarity',
    title: '你现在怎么看预算？',
    helper: '预算不是总价，是取舍顺序。',
    options: [
      { value: 'only-total', label: '只知道一个总预算', score: 5 },
      { value: 'fear-overrun', label: '最怕后期超预算', score: 5 },
      { value: 'can-tradeoff', label: '愿意为核心空间多花，其他后置', score: 2 },
      { value: 'unclear', label: '完全不知道怎么拆', score: 5 },
    ],
  },
]
