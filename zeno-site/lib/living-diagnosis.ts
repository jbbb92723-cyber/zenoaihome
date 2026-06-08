import { livingDiagnosisQuestions } from '@/data/living-diagnosis'

export type LivingDiagnosisAnswer = {
  questionId: string
  value: string
}

export type LivingDiagnosisResult = {
  primaryType: string
  riskLevel: 'low' | 'medium' | 'high'
  totalScore: number
  summary: string
  priorities: string[]
  nextSteps: Array<{ label: string; href: string }>
}

export function analyzeLivingDiagnosis(answers: LivingDiagnosisAnswer[]): LivingDiagnosisResult {
  const score = answers.reduce((sum, answer) => {
    const question = livingDiagnosisQuestions.find((item) => item.id === answer.questionId)
    const option = question?.options.find((item) => item.value === answer.value)
    return sum + (option?.score ?? 0)
  }, 0)

  const stage = answers.find((item) => item.questionId === 'current-stage')?.value
  const riskLevel = score >= 17 ? 'high' : score >= 10 ? 'medium' : 'low'

  if (stage === 'quote' || stage === 'signing') {
    return {
      primaryType: '签约前风险型',
      riskLevel,
      totalScore: score,
      summary:
        '你已经接近报价或签约阶段，不能只继续讨论风格。下一步要把生活需求、预算取舍和报价合同边界放在一起看。',
      priorities: ['报价边界', '预算取舍', '口头承诺落字'],
      nextSteps: [
        { label: '先做报价风险初筛', href: '/tools/quote-check' },
        { label: '查看签约前服务', href: '/services' },
      ],
    }
  }

  return {
    primaryType: '居住需求未定型',
    riskLevel,
    totalScore: score,
    summary: '你现在最重要的不是马上定风格，而是先把生活方式、家庭关系、空间秩序和预算优先级说清楚。',
    priorities: ['生活方式', '空间秩序', '审美偏好'],
    nextSteps: [
      { label: '保存诊断结果', href: '/living-diagnosis' },
      { label: '查看案例复盘', href: '/cases' },
    ],
  }
}
