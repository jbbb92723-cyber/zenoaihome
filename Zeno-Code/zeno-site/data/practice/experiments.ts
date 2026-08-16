export type PracticeMetric = {
  label: string
  current: number
  target: number
  unit: string
}

export type PracticeExperiment = {
  title: string
  question: string
  goal: string
  status: '待启动' | '进行中' | '已完成'
  evidenceStatus: '待验证' | '已试用' | '已验证' | '已否定'
  updatedAt: string
  nextAction: string
  metrics: PracticeMetric[]
}

export const currentPractice: PracticeExperiment = {
  title: '把一份真实报价问题，做成别人能使用的判断工具。',
  question: '传统行业经验能否经过一次真实交付，变成不依赖赞诺现场解释也能使用的清单？',
  goal: '在 30 天内完成一个从真实问题、最小审核、用户反馈到方法修订的闭环。',
  status: '待启动',
  evidenceStatus: '待验证',
  updatedAt: '2026-08-16',
  nextAction: '先收集 3 份可回溯的签约前报价问题，再选择 1 份完成最小审核。',
  metrics: [
    { label: '可回溯真实问题', current: 0, target: 3, unit: '份' },
    { label: '最小审核或试用', current: 0, target: 1, unit: '次' },
    { label: '原始使用反馈', current: 0, target: 2, unit: '条' },
    { label: '被修订的假设', current: 0, target: 1, unit: '项' },
  ],
}

export const humanAiProtocol = [
  { code: '01', title: '人先判断', body: '先写下原始判断、依据、未知项和验收标准。' },
  { code: '02', title: 'AI 负责质疑', body: '让 AI 找反例、查缺口、比较选项，不替人做最终决定。' },
  { code: '03', title: '人完成交付', body: '由人确认边界、承担选择，并做出一次可以被使用的最小产物。' },
  { code: '04', title: '结果修订方法', body: '记录哪里有效、哪里失效，把反馈写回下一版。' },
]
