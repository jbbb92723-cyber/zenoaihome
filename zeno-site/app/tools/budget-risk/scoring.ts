/**
 * 装修预算风险自测 — 评分逻辑（纯函数，便于单测）
 *
 * 输入：用户答案（题目 id → 选项 value 或 value[]）
 * 输出：4 个维度的等级 + 主导维度 + 文案字典
 *
 * 设计取舍：
 * - 不输出百分制分数，只输出 low/mid/high。原因：百分制容易引发"凭什么 75 分"的争论，
 *   而 Zeno 的品牌定位是"帮你看清"，不是"给你打分"。
 * - 主导维度用最大值，并列时按 R1 > R2 > R3 > R4 优先级（与用户实际损失大小一致）。
 */

import { questions, type Question, type RiskDimension } from './questions'

export type RiskLevel = 'low' | 'mid' | 'high'

export type Answers = Record<string, string | string[]>

export type DimensionScores = Record<RiskDimension, number>

export type DimensionLevels = Record<RiskDimension, RiskLevel>

const DIMENSIONS: RiskDimension[] = ['R1', 'R2', 'R3', 'R4']

/** 把维度原始分换算成等级。阈值是经验值，可后续根据真实数据调。 */
function toLevel(score: number, dim: RiskDimension): RiskLevel {
  // R4（时机风险）阈值更紧，因为可改动空间小
  if (dim === 'R4') {
    if (score >= 2) return 'high'
    if (score >= 1) return 'mid'
    return 'low'
  }
  if (score >= 4) return 'high'
  if (score >= 2) return 'mid'
  return 'low'
}

/** 计算每个维度的原始分 */
export function scoreAnswers(answers: Answers): {
  scores: DimensionScores
  levels: DimensionLevels
  /** 主导风险维度，用于结果页头部文案 */
  dominant: RiskDimension
} {
  const scores: DimensionScores = { R1: 0, R2: 0, R3: 0, R4: 0 }

  for (const q of questions) {
    const ans = answers[q.id]
    if (!ans) continue

    const selected: string[] = Array.isArray(ans) ? ans : [ans]
    for (const value of selected) {
      const opt = q.options.find((o) => o.value === value)
      if (!opt) continue
      for (const dim of DIMENSIONS) {
        const add = opt.scores[dim]
        if (add) scores[dim] += add
      }
    }
  }

  const levels: DimensionLevels = {
    R1: toLevel(scores.R1, 'R1'),
    R2: toLevel(scores.R2, 'R2'),
    R3: toLevel(scores.R3, 'R3'),
    R4: toLevel(scores.R4, 'R4'),
  }

  // 主导维度：原始分最高；并列时按 R1 > R2 > R3 > R4 优先
  const dominant = DIMENSIONS.reduce<RiskDimension>((acc, d) => {
    return scores[d] > scores[acc] ? d : acc
  }, 'R1')

  return { scores, levels, dominant }
}

// ─────────────────────────────────────────────
// 文案字典：维度元信息 + 总判断 + 行动建议
// 全部走 Zeno 文字心率规则：动词开头、不夸张、不说教。
// ─────────────────────────────────────────────

export const DIMENSION_META: Record<
  RiskDimension,
  { label: string; oneLine: Record<RiskLevel, string> }
> = {
  R1: {
    label: '漏项风险',
    oneLine: {
      low: '主要花费都算进去了。',
      mid: '有一两块大头还没明确算账。',
      high: '预算里至少有一类钱大概率没算进去。',
    },
  },
  R2: {
    label: '增项风险',
    oneLine: {
      low: '报价口子收得比较紧。',
      mid: '有几处描述含糊，可能成为加钱入口。',
      high: '当前结构里留了不止一个被加钱的口子。',
    },
  },
  R3: {
    label: '失控风险',
    oneLine: {
      low: '总数和结构都比较清楚。',
      mid: '总数有，但结构和 buffer 还不够稳。',
      high: '现在更像"花到没钱为止"，不是"按结构花"。',
    },
  },
  R4: {
    label: '时机风险',
    oneLine: {
      low: '现在改预算还很从容。',
      mid: '已经接近签合同，调整空间在变小。',
      high: '已经在执行阶段，能改的主要是剩下的钱怎么花。',
    },
  },
}

/** 主导维度对应的总判断（结果页第一句） */
export const HEADLINE: Record<RiskDimension, string> = {
  R1: '你这次装修最大的风险，是预算里还有一些钱没算进去。它们大概率会在装到一半的时候出现，而那时候你已经没有退路了。',
  R2: '你的报价结构里有几处留给装修方加钱的口子。不一定是恶意，但只要这几处不写死，最后就是你来兜底。',
  R3: '你预算的总数可能是合理的，问题在于它没有结构。没有结构的预算，本质上是"花到没钱为止"。',
  R4: '你已经到了不太能"重做预算"的阶段。但还来得及做一件事：把剩下的每一笔花在该花的地方。',
}

/** 主导维度对应的"如果是我，我会先做这一件事" */
export const NEXT_STEP: Record<RiskDimension, string> = {
  R1:
    '把你的主材清单（瓷砖、地板、橱柜、门、卫浴、灯具、窗帘）单独列一张表，每一项写出"已选 / 未选"和"目前预算"。这张表如果今天就能列出来，意味着没人能再把概念偷换给你。',
  R2:
    '把报价单里所有写着"按实际发生"、"现场协商"、"暂估"的条目单独标出来，逐条问对方："如果超出，按什么单价、谁来确认？"——能写进合同的，全部写进合同。',
  R3:
    '别再纠结总数。先把预算按四块分：硬装基础、主材、家电家具、应急 buffer。每一块定一个数，再看哪一块和你的真实生活最不匹配。',
  R4:
    '先停一下，把"还没花出去"的钱单独列一张表。这部分钱比已经花掉的更值得规划——它是这次装修最后能影响结果的部分。',
}
