/**
 * 装修预算风险自测 — 题目定义
 *
 * 设计原则：
 * 1. 题目不超过 10 题，全部单选（Q9 多选独立处理），让用户 5 分钟内做完。
 * 2. 每个选项都映射到 4 个风险维度（R1-R4）的加分，避免简单总分。
 * 3. 选项文案使用用户原话，不用行业黑话——这一点贯穿 Zeno 文字心率规则。
 *
 * 维度说明：
 *   R1 漏项风险  — 预算结构里有钱没算进去
 *   R2 增项风险  — 报价/施工方留了"补刀"的口子
 *   R3 失控风险  — 没有 buffer / 没有结构
 *   R4 时机风险  — 现在再纠结预算还来不来得及
 */

export type RiskDimension = 'R1' | 'R2' | 'R3' | 'R4'

export interface Option {
  /** 选项值，提交时用 */
  value: string
  /** 选项展示文案 */
  label: string
  /** 这个选项在每个维度上加多少分。0-3 分制，3 分代表"高风险" */
  scores: Partial<Record<RiskDimension, number>>
}

export interface Question {
  id: string
  /** 题目正文，给用户看的 */
  prompt: string
  /** 一句话解释为什么问这道题，可选，渲染在题目下方小字 */
  hint?: string
  /** 单选 single；Q9 用 multi（最多两项） */
  type: 'single' | 'multi'
  options: Option[]
  /** multi 题专用：最多可选几项 */
  maxSelect?: number
}

export const questions: Question[] = [
  {
    id: 'Q1',
    prompt: '你这次装修的总预算大概是？',
    hint: '不用很精确，给一个心里的数即可。',
    type: 'single',
    options: [
      { value: 'a', label: '5 万以内', scores: { R3: 2 } },
      { value: 'b', label: '5–10 万', scores: { R3: 1 } },
      { value: 'c', label: '10–20 万', scores: {} },
      { value: 'd', label: '20–40 万', scores: {} },
      { value: 'e', label: '40 万以上', scores: {} },
      { value: 'f', label: '还没定', scores: { R3: 2 } },
    ],
  },
  {
    id: 'Q2',
    prompt: '这个预算是怎么算出来的？',
    type: 'single',
    options: [
      { value: 'a', label: '装修公司报的', scores: { R3: 2, R2: 1 } },
      { value: 'b', label: '朋友推荐的"差不多就这个数"', scores: { R3: 2 } },
      { value: 'c', label: '自己按面积估的（X 元/㎡）', scores: { R3: 1 } },
      { value: 'd', label: '自己按分项列过表', scores: {} },
      { value: 'e', label: '没算，先看了再说', scores: { R3: 3 } },
    ],
  },
  {
    id: 'Q3',
    prompt: '你预留了多少应急 buffer？',
    hint: 'buffer = 预留给意外开支的钱，比如水电改造超量、墙体问题。',
    type: 'single',
    options: [
      { value: 'a', label: '没留', scores: { R3: 3 } },
      { value: 'b', label: '5% 以内', scores: { R3: 2 } },
      { value: 'c', label: '5–10%', scores: { R3: 1 } },
      { value: 'd', label: '10–20%', scores: {} },
      { value: 'e', label: '20% 以上', scores: {} },
    ],
  },
  {
    id: 'Q4',
    prompt: '主材（瓷砖 / 地板 / 橱柜 / 门）的钱算在总预算里了吗？',
    type: 'single',
    options: [
      { value: 'a', label: '全算了', scores: {} },
      { value: 'b', label: '算了一部分', scores: { R1: 1 } },
      { value: 'c', label: '没算，以为是另算的', scores: { R1: 3 } },
      { value: 'd', label: '不确定', scores: { R1: 2 } },
    ],
  },
  {
    id: 'Q5',
    prompt: '家电、家具、窗帘、灯具的钱呢？',
    type: 'single',
    options: [
      { value: 'a', label: '全算了', scores: {} },
      { value: 'b', label: '算了一部分', scores: { R1: 1 } },
      { value: 'c', label: '没算', scores: { R1: 3 } },
      { value: 'd', label: '不确定', scores: { R1: 2 } },
    ],
  },
  {
    id: 'Q6',
    prompt: '水电改造按什么算？',
    hint: '这是最容易"装到一半被加钱"的环节。',
    type: 'single',
    options: [
      { value: 'a', label: '报价里写的"包干价"', scores: {} },
      { value: 'b', label: '报价里写"按实际发生计算"', scores: { R2: 3 } },
      { value: 'c', label: '没看清楚', scores: { R2: 2, R1: 1 } },
      { value: 'd', label: '我会自己点位算', scores: {} },
    ],
  },
  {
    id: 'Q7',
    prompt: '你目前看到的报价单是？',
    type: 'single',
    options: [
      { value: 'a', label: '一份完整的、分项的 Excel/PDF', scores: {} },
      { value: 'b', label: '微信里发的几张表格图片', scores: { R1: 1, R2: 1 } },
      { value: 'c', label: '一张总价 + "包含 XX"的简表', scores: { R1: 3, R2: 2 } },
      { value: 'd', label: '还没拿到报价', scores: {} },
    ],
  },
  {
    id: 'Q8',
    prompt: '你打算找的施工方是？',
    type: 'single',
    options: [
      { value: 'a', label: '装修公司（中大型）', scores: { R2: 1 } },
      { value: 'b', label: '装修公司（本地小型 / 工作室）', scores: { R2: 1 } },
      { value: 'c', label: '独立工长 / 熟人介绍', scores: { R2: 2 } },
      { value: 'd', label: '自己分包', scores: { R2: 2, R1: 1 } },
      { value: 'e', label: '还没决定', scores: {} },
    ],
  },
  {
    id: 'Q9',
    prompt: '你最担心的是哪一件？',
    hint: '最多选两项。',
    type: 'multi',
    maxSelect: 2,
    options: [
      { value: 'omit', label: '报价里有看不见的漏项', scores: { R1: 1 } },
      { value: 'addon', label: '装一半被加钱', scores: { R2: 1 } },
      { value: 'swap', label: '材料被偷换', scores: { R2: 1 } },
      { value: 'quality', label: '施工质量没人盯', scores: {} },
      { value: 'delay', label: '工期拖', scores: {} },
      { value: 'other', label: '其他', scores: {} },
    ],
  },
  {
    id: 'Q10',
    prompt: '你目前装修进度到哪一步？',
    type: 'single',
    options: [
      { value: 'a', label: '还在了解阶段', scores: {} },
      { value: 'b', label: '在收报价', scores: {} },
      { value: 'c', label: '即将签合同', scores: { R4: 1 } },
      { value: 'd', label: '已签合同，未开工', scores: { R4: 2 } },
      { value: 'e', label: '已经开工', scores: { R4: 3 } },
    ],
  },
]
