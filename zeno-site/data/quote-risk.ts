export type QuoteRiskDimension = {
  key:
    | 'hasItemizedQuote'
    | 'hasMaterialBrand'
    | 'hasProcessDescription'
    | 'hasMeasurementRule'
    | 'hasChangeOrderRule'
    | 'hasAcceptanceStandard'
    | 'hasWarrantyScope'
    | 'hasPaymentMilestone'
  dimension: string
  label: string
  risk: string
  question: string
  weight: number
}

export type QuoteRiskDictionaryItem = {
  term: string
  plain: string
  whatToLookFor: string
}

export type QuoteRiskRule = {
  title: string
  trigger: string
  why: string
  ask: string
}

export type QuoteCheckTemplate = {
  title: string
  use: string
  output: string
}

export type ProjectRiskItem = {
  project: string
  commonRisk: string
  mustAsk: string[]
  keywords: string[]
}

export const quoteRiskDimensions: QuoteRiskDimension[] = [
  {
    key: 'hasItemizedQuote',
    dimension: '项目完整性',
    label: '按空间或工种拆分到具体项目',
    risk: '项目颗粒度不足，后期容易用“没包含”解释增项。',
    question: '请把每个空间/工种的项目、数量、单位和单价拆出来，不要只给总价。',
    weight: 2,
  },
  {
    key: 'hasMaterialBrand',
    dimension: '材料边界',
    label: '主材/辅材品牌、型号、规格清楚',
    risk: '材料描述模糊，后期替换空间很大。',
    question: '这项材料的品牌、型号、规格、环保等级和可替代规则分别是什么？',
    weight: 1,
  },
  {
    key: 'hasProcessDescription',
    dimension: '工艺边界',
    label: '关键工艺做法写清楚',
    risk: '工艺边界不清，现场质量很难验。',
    question: '这项施工的基层处理、施工步骤、厚度/遍数和验收标准是什么？',
    weight: 2,
  },
  {
    key: 'hasMeasurementRule',
    dimension: '工程量算法',
    label: '工程量计算规则写清楚',
    risk: '面积、米数、点位算法不清，结算容易变形。',
    question: '工程量按什么规则计算？门窗洞口、损耗、转角和重复计算怎么处理？',
    weight: 1,
  },
  {
    key: 'hasChangeOrderRule',
    dimension: '增减项流程',
    label: '增减项和变更流程写清楚',
    risk: '变更没有前置确认，预算会在施工中失控。',
    question: '所有增减项是否必须先报价、先确认、再施工？未确认施工如何处理？',
    weight: 2,
  },
  {
    key: 'hasAcceptanceStandard',
    dimension: '验收标准',
    label: '节点验收标准写清楚',
    risk: '只写“合格”没有意义，出问题很难争取。',
    question: '水电、泥木、油漆、安装分别按什么标准验收？谁签字后进入下一步？',
    weight: 1,
  },
  {
    key: 'hasWarrantyScope',
    dimension: '售后边界',
    label: '保修范围和期限写清楚',
    risk: '售后边界不清，后期维权成本高。',
    question: '哪些项目保修？保修多久？人为损坏、材料问题、施工问题如何区分？',
    weight: 1,
  },
  {
    key: 'hasPaymentMilestone',
    dimension: '付款节点',
    label: '付款节点和交付节点对应',
    risk: '钱走得比工程快，业主会失去主动权。',
    question: '每一笔付款对应哪个完成节点？未验收通过是否可以拒付下一笔？',
    weight: 2,
  },
]

export const quoteRiskDictionary: QuoteRiskDictionaryItem[] = [
  { term: '漏项', plain: '报价里本该出现却没出现的项目。', whatToLookFor: '垃圾外运、保护、收口、调试、辅材和现场杂费。' },
  { term: '模糊项', plain: '描述太泛，后期容易被换掉或加价。', whatToLookFor: '品牌写得太笼统、工艺只写“按规范施工”。' },
  { term: '增项口子', plain: '先不写清，后面再补钱的入口。', whatToLookFor: '按实结算、暂定、现场另计、变更另算。' },
  { term: '工程量', plain: '到底做多少。', whatToLookFor: '按面积、长度、点位还是实际发生量。' },
  { term: '工艺边界', plain: '怎么做、做到什么程度。', whatToLookFor: '基层处理、遍数、厚度、是否含找平和修补。' },
  { term: '材料边界', plain: '用什么材料、能不能替换。', whatToLookFor: '品牌、型号、规格、环保等级、替换规则。' },
  { term: '验收标准', plain: '做完后按什么算合格。', whatToLookFor: '节点验收、空鼓、平整度、闭水、色差、收口。' },
  { term: '付款节点', plain: '钱什么时候付、付多少。', whatToLookFor: '是否和验收节点对应，尾款是否足够。' },
  { term: '质保范围', plain: '后期哪些问题算谁的。', whatToLookFor: '保修多久、保什么、不保什么。' },
]

export const quoteRiskRules: QuoteRiskRule[] = [
  {
    title: '总价低，不代表风险低',
    trigger: '看到明显低价时',
    why: '低价常常靠删项、弱化工艺或把费用放到后面。',
    ask: '把项目拆开，看看少了什么，再比总价。',
  },
  {
    title: '单位不统一，就不能直接比价',
    trigger: '㎡、米、延米、点位混在一起时',
    why: '不同单位不是同一种价格口径。',
    ask: '先统一单位，再看单价和工程量。',
  },
  {
    title: '写得越笼统，后面越容易扯皮',
    trigger: '出现“按规范施工”“具体现场确定”这类词时',
    why: '没有边界，责任就容易漂移。',
    ask: '让对方写出材料、工艺、验收和变更规则。',
  },
  {
    title: '没有变更流程，预算很难守住',
    trigger: '增减项没确认机制时',
    why: '任何口头调整都可能变成未预料支出。',
    ask: '所有增减项是否先报价、先确认、再施工？',
  },
  {
    title: '付款跑得比工程快，会失去主动权',
    trigger: '前期付款比例过高时',
    why: '尾款太少，就很难推动返工和整改。',
    ask: '每笔付款对应哪个节点，尾款还剩多少？',
  },
  {
    title: '能不能把话写进合同，比口头承诺更重要',
    trigger: '对方只愿意口头承诺时',
    why: '签约后真正有用的是文字。',
    ask: '把关键边界写进合同或补充协议。',
  },
]

export const quoteCheckTemplates: QuoteCheckTemplate[] = [
  {
    title: '签约前追问模板',
    use: '直接发给施工方，追问报价里最容易漏掉的边界。',
    output: '问题 + 需要写清的内容 + 回复后是否影响签约判断。',
  },
  {
    title: '合同补充模板',
    use: '把口头承诺落进补充条款。',
    output: '项目范围、材料型号、变更流程、验收节点、付款节点。',
  },
  {
    title: '报价对比模板',
    use: '把几家报价放到同一口径里比较。',
    output: '拆项目、拆单位、拆工艺、拆变更、拆付款。',
  },
  {
    title: '风险摘要模板',
    use: '给家人或自己做最终判断时看。',
    output: '风险等级、最重要的 3 个问题、下一步建议。',
  },
]

export const projectRiskLibrary: ProjectRiskItem[] = [
  {
    project: '水电',
    commonRisk: '按米/按点位/按实结算混用，最容易出增项。',
    mustAsk: ['开槽范围', '单价和计量方式', '是否含回填和恢复'],
    keywords: ['水电', '开槽', '点位', '按实结算'],
  },
  {
    project: '防水',
    commonRisk: '面积、遍数、闭水和节点没写清。',
    mustAsk: ['刷几遍', '闭水多久', '返工责任怎么算'],
    keywords: ['防水', '闭水', '卫生间', '厨卫'],
  },
  {
    project: '拆改',
    commonRisk: '垃圾外运、清运、保护和恢复常被漏掉。',
    mustAsk: ['是否含清运', '是否含成品保护', '拆后恢复范围'],
    keywords: ['拆改', '垃圾外运', '清运', '保护'],
  },
  {
    project: '瓦工 / 瓷砖',
    commonRisk: '空鼓、找平、损耗和收口没说清。',
    mustAsk: ['损耗比例', '铺贴方式', '是否含找平和收口'],
    keywords: ['瓷砖', '瓦工', '空鼓', '找平'],
  },
  {
    project: '木作 / 柜体',
    commonRisk: '板材、封边、五金和尺寸确认最容易模糊。',
    mustAsk: ['板材型号', '封边标准', '五金品牌'],
    keywords: ['木作', '柜体', '封边', '五金'],
  },
  {
    project: '油工 / 乳胶漆',
    commonRisk: '基层修补、遍数、颜色和涂布率容易说不清。',
    mustAsk: ['刷几遍', '是否含修补', '颜色返工怎么算'],
    keywords: ['油工', '乳胶漆', '基层', '涂布率'],
  },
  {
    project: '门窗 / 安装',
    commonRisk: '测量、收口、五金、安装调试容易临时加钱。',
    mustAsk: ['是否含安装调试', '收口是否含在内', '补货或返工怎么处理'],
    keywords: ['门窗', '安装', '调试', '收口'],
  },
  {
    project: '设备 / 家电',
    commonRisk: '点位、安装条件和配套辅材经常被忽略。',
    mustAsk: ['是否含安装', '安装条件是否满足', '辅材是否含在报价里'],
    keywords: ['设备', '家电', '安装', '配套辅材'],
  },
]

export function getQuoteRiskDimensionByKey(key: QuoteRiskDimension['key']) {
  return quoteRiskDimensions.find((item) => item.key === key)
}

