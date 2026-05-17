export type RiskKey = 'R1' | 'R2' | 'R3' | 'R4'

export interface BudgetRiskQuestion {
  id: string
  dimension: RiskKey
  title: string
  detail: string
}

export interface RiskSummary {
  key: RiskKey
  name: string
  shortName: string
  headline: string
  description: string
  whyItMatters: string
  firstStep: string
  resource: { label: string; href: string }
  article: { label: string; href: string }
  service: { label: string; href: string }
}

export type BudgetRiskAnswers = Record<string, number>

export const answerOptions = [
  {
    value: 0,
    label: '基本没有这个问题',
    help: '我这块相对清楚，暂时不是主要风险。',
  },
  {
    value: 1,
    label: '有一点，但还能控制',
    help: '偶尔会犹豫，但还没明显影响决策。',
  },
  {
    value: 2,
    label: '已经开始影响判断',
    help: '这块让我反复纠结，已经拖慢推进。',
  },
  {
    value: 3,
    label: '这就是我现在最大的卡点',
    help: '如果不先处理它，后面大概率会更乱。',
  },
] as const

export const budgetRiskQuestions: BudgetRiskQuestion[] = [
  {
    id: 'quote-clarity',
    dimension: 'R1',
    title: '你现在手里的报价单，项目、单位、材料和工艺写得清楚吗？',
    detail: '如果描述含糊，后面最容易变成增项和扯皮。',
  },
  {
    id: 'missing-items',
    dimension: 'R1',
    title: '你能说出这份报价里哪些可能漏了，哪些只是暂时没写吗？',
    detail: '看不出漏项时，低价往往只是把问题往后推。',
  },
  {
    id: 'budget-structure',
    dimension: 'R2',
    title: '你的预算现在是分区清楚的，还是只有一个总数？',
    detail: '只有总预算，没有结构，最容易越做越超。',
  },
  {
    id: 'scope-creep',
    dimension: 'R2',
    title: '你最近是不是经常临时加项目、升级材料，却说不清优先级？',
    detail: '范围扩张如果没有边界，预算失控只是时间问题。',
  },
  {
    id: 'change-log',
    dimension: 'R3',
    title: '施工过程中的变更，你们现在有明确的确认和留痕方式吗？',
    detail: '只靠口头沟通，问题通常会在节点后集中爆出来。',
  },
  {
    id: 'site-checkpoints',
    dimension: 'R3',
    title: '你知道每个施工阶段该盯什么，还是只能等做完再看？',
    detail: '验收晚一步，返工成本通常就高一截。',
  },
  {
    id: 'living-needs',
    dimension: 'R4',
    title: '你现在的方案，是按真实作息和生活习惯排的，还是按参考图感觉在走？',
    detail: '需求没厘清时，风格讨论通常只会越聊越偏。',
  },
  {
    id: 'daily-friction',
    dimension: 'R4',
    title: '你能明确说出住进去后最怕哪里不顺手吗？',
    detail: '说不出真实摩擦点，就很难做出真正服务生活的选择。',
  },
]

export const riskOrder: RiskKey[] = ['R1', 'R2', 'R3', 'R4']

export const riskSummaries: Record<RiskKey, RiskSummary> = {
  R1: {
    key: 'R1',
    name: '报价风险',
    shortName: '报价没说清',
    headline: '你现在最该先盯的，是报价有没有被说清。',
    description: '你不是单纯觉得贵，而是看不清这份报价到底写了什么、没写什么，以及后面会从哪里长出增项。',
    whyItMatters: '只要报价描述模糊，后期再讨论“是不是包含”通常都晚了。',
    firstStep: '先把报价里的模糊项、漏项和追问清单列出来，再决定谈不谈价格。',
    resource: { label: '先看报价单初查模板', href: '/checklists/quote-initial-check' },
    article: { label: '先看装修预算为什么总超', href: '/blog/zhuangxiu-yusuan-weishenme-zongchao' },
    service: { label: '直接看报价风险快审', href: '/services/renovation#quote-standard' },
  },
  R2: {
    key: 'R2',
    name: '预算风险',
    shortName: '钱没有分清',
    headline: '你现在最该先盯的，是钱有没有先分成几份。',
    description: '问题不一定是钱不够，而是你还没有先分清基础施工、主材选择、柜子收纳、设备电器、家具软装和预留机动，所以每次新增选择都在吞预算。',
    whyItMatters: '没有分清的钱，表面看是在省，实际上是在把超支延后。',
    firstStep: '先把总预算拆成几份钱，再看哪些不能动、哪些可以晚点买、哪些只是想要。',
    resource: { label: '先拿装修预算模板', href: '/resources#zhuangxiu-yusuan-moban' },
    article: { label: '先看预算为什么总超', href: '/blog/zhuangxiu-yusuan-weishenme-zongchao' },
    service: { label: '直接看标准版报价风险快审', href: '/services/renovation#quote-standard' },
  },
  R3: {
    key: 'R3',
    name: '流程风险',
    shortName: '节点和变更没控住',
    headline: '你现在最该先盯的，是节点和变更有没有被控住。',
    description: '你未必是预算算错了，而是施工过程的确认、留痕和节点检查太弱，问题都堆到后面才发现。',
    whyItMatters: '流程没有控制点时，返工、拖延和责任不清会一起出现。',
    firstStep: '先把当前施工节点该看什么列出来，再把后续变更改成可确认、可留痕。',
    resource: { label: '先拿施工节点验收清单', href: '/resources#construction-checkpoints' },
    article: { label: '先看从工地看世界', href: '/blog/03-cong-gongdi-kan-shijie' },
    service: { label: '先看装修判断服务边界', href: '/services/renovation' },
  },
  R4: {
    key: 'R4',
    name: '居住风险',
    shortName: '真实需求没厘清',
    headline: '你现在最该先盯的，是报价和合同有没有把边界说清。',
    description: '如果你现在主要靠网图、风格词或短期展示感做选择，住进去后的摩擦往往会在后面慢慢显现。',
    whyItMatters: '需求顺序一旦错了，后面的预算、材料和方案讨论都会被带偏。',
    firstStep: '先把家庭成员、作息、收纳、做饭、办公这些真实需求写出来，再回头看方案。',
    resource: { label: '先看合同签约前检查模板', href: '/checklists/contract-pre-signing-check' },
    article: { label: '先看家不是样板间', href: '/blog/02-jia-bu-shi-yangban-jian' },
    service: { label: '先看深度版签约前判断', href: '/services/renovation#quote-deep' },
  },
}

export function scoreAnswers(answers: BudgetRiskAnswers) {
  const scores: Record<RiskKey, number> = {
    R1: 0,
    R2: 0,
    R3: 0,
    R4: 0,
  }

  for (const question of budgetRiskQuestions) {
    scores[question.dimension] += answers[question.id] ?? 0
  }

  const ranking = riskOrder
    .map((key) => ({
      key,
      score: scores[key],
      summary: riskSummaries[key],
    }))
    .sort((left, right) => right.score - left.score)

  return {
    scores,
    ranking,
    dominant: ranking[0]?.key ?? 'R1',
    maxPerDimension: budgetRiskQuestions.filter((question) => question.dimension === 'R1').length * 3,
  }
}

export function parseScoreQuery(searchParams: Record<string, string | string[] | undefined>) {
  const fromParam = (key: string) => {
    const raw = searchParams[key]
    const value = Array.isArray(raw) ? raw[0] : raw
    const parsed = Number.parseInt(value ?? '0', 10)
    return Number.isFinite(parsed) ? parsed : 0
  }

  const scores: Record<RiskKey, number> = {
    R1: fromParam('r1'),
    R2: fromParam('r2'),
    R3: fromParam('r3'),
    R4: fromParam('r4'),
  }

  const ranking = riskOrder
    .map((key) => ({
      key,
      score: scores[key],
      summary: riskSummaries[key],
    }))
    .sort((left, right) => right.score - left.score)

  const rawDominant = searchParams.dominant
  const dominantValue = Array.isArray(rawDominant) ? rawDominant[0] : rawDominant
  const dominant = riskOrder.includes(dominantValue as RiskKey)
    ? (dominantValue as RiskKey)
    : (ranking[0]?.key ?? 'R1')

  return {
    scores,
    ranking,
    dominant,
    isEmpty: ranking.every((item) => item.score === 0),
    maxPerDimension: budgetRiskQuestions.filter((question) => question.dimension === 'R1').length * 3,
  }
}
