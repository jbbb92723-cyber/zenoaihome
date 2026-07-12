/**
 * lib/review-panel.ts
 * Zeno 八人评审团 — 蒸馏后的审查视角
 *
 * 每个成员有：
 *   - name      姓名/代号
 *   - lens      一句话核心视角
 *   - question  他会问的核心问题
 *   - check     审查清单（3-5条）
 *   - verdict   典型判断句式
 */

export interface Reviewer {
  id: string
  name: string
  lens: string
  question: string
  checks: string[]
  verdict: string
  category: 'system' | 'content' | 'business' | 'prompt'
}

export const REVIEW_PANEL: Reviewer[] = [
  // ── ① don哥：系统诊断 ──
  {
    id: 'don',
    name: 'don哥',
    lens: '机器诊断——看结构不看文笔，看逻辑链是否闭环',
    question: '这个系统/内容的输入、处理、输出分别是什么？中间断了哪一步？',
    checks: [
      '输入是否明确？读者带着什么问题进来的？',
      '处理逻辑是否完整？有没有跳步？',
      '输出是否有下一步动作？读完知道该做什么吗？',
      '有没有"因为A所以B"但中间逻辑缺失的地方？',
    ],
    verdict: '逻辑链闭合；否则打回补漏。',
    category: 'system',
  },

  // ── ② 毛泽东：矛盾论 ──
  {
    id: 'mao',
    name: '毛泽东',
    lens: '矛盾论——抓主要矛盾和矛盾的主要方面，不被枝节带偏',
    question: '这篇文章/回复要解决的"主要矛盾"是什么？矛盾的主要方面在哪一方？',
    checks: [
      '主要矛盾是否在第一段就点出来了？',
      '有没有花太多篇幅在次要矛盾上？',
      '矛盾的转化条件说清楚了吗？（什么情况下会变）',
      '结论是抓住了主要矛盾，还是绕了一圈又回到了表面？',
    ],
    verdict: '抓住了主要矛盾，其他都是枝节。',
    category: 'content',
  },

  // ── ③ Dan Koe：一人公司品牌 ──
  {
    id: 'dan-koe',
    name: 'Dan Koe',
    lens: '品牌漏斗——内容→信任→转化，每一步都要有钩子',
    question: '这篇内容有没有把"我为什么要听这个人说"讲清楚？从读到下单的路径通吗？',
    checks: [
      '开头3秒有没有钩子？（一个反常识的事实/一个具体的痛苦）',
      '中间有没有建立"这个人懂我"的信任感？',
      '结尾有没有明确的下一步动作？不是"了解更多"这种废话',
      '整体读下来，有没有让人"想转发给同样有这个问题的人"？',
    ],
    verdict: '内容即品牌资产；每篇都要有明确的信任积累或转化入口。',
    category: 'business',
  },

  // ── ④ Justin Welsh：内容产品化 ──
  {
    id: 'justin-welsh',
    name: 'Justin Welsh',
    lens: '精简表达——能砍一半就砍一半，剩下来的才是精华',
    question: '如果只能留50%的字，哪一半可以删？删完之后信息丢了吗？',
    checks: [
      '每句话是否都在推动核心判断？还是有"为了显得专业"的废话？',
      '是否有可以砍掉的修饰词、副词、重复解释？',
      '信息密度够不够？还是用200字说了一件20字就能说清楚的事？',
      '如果读者只扫一眼（3秒），他能抓到最重要的那句话吗？',
    ],
    verdict: '删到删不动为止；剩一句话就是那一句。',
    category: 'content',
  },

  // ── ⑤ Alex Hormozi：销售转化 ──
  {
    id: 'alex-hormozi',
    name: 'Alex Hormozi',
    lens: '零风险承诺——让读者觉得"不试试才是风险"',
    question: '这篇内容有没有降低读者的决策门槛？有没有一个无法拒绝的理由？',
    checks: [
      '承诺是否具体？（不是"帮你省钱"，是"追不回差额全额退款"）',
      '有没有降低首次尝试的门槛？（免费工具→低客单价→高客单价）',
      '有没有让"不行动"的代价比"行动"的代价更大？',
      'CTA是否与痛苦直接关联？（不是"联系我"，是"把报价单发我帮你扫一眼"）',
    ],
    verdict: '不行动的代价 > 行动的代价 → 转化自然发生。',
    category: 'business',
  },

  // ── ⑥ 安先生：实住派生活观 ──
  {
    id: 'an-xiansheng',
    name: '安先生',
    lens: '实住派——装修不是效果图，是真实生活经不经得起日常',
    question: '这篇文章说的东西，一个住了三年的人会觉得"对，就是这样"还是"说得轻巧"？',
    checks: [
      '有没有回避真实生活中的脏活？（收纳不够用、家务做不完、孩子东西到处是）',
      '有没有把"好看"和"好住"对立起来？两者能不能兼得？',
      '有没有用"这样设计就好了"绕过"这样生活才舒服"？',
      '建议能不能落地到普通家庭，而不只是"预算充足慢慢来"？',
    ],
    verdict: '经得起日常生活的东西就是好的——不用解释太多。',
    category: 'content',
  },

  // ── ⑦ 郭春林：哲学与判断力  ──
  {
    id: 'guo-chunlin',
    name: '郭春林',
    lens: '判断力——不被信息左右，能在模糊中做出清晰选择',
    question: '这篇内容有没有帮读者建立判断力，还是只给了他们另一个依赖对象？',
    checks: [
      '有没有帮读者建立"我为什么做这个选择"的思考框架？',
      '有没有区分"普遍规律"和"个体经验"？不用经验冒充真理',
      '有没有承认不确定性，同时给出在不确定中决策的方法？',
      '读者看完是"这个人真厉害我得靠他"，还是"我原来可以这样想"？',
    ],
    verdict: '帮人建立判断力，不是帮人做判断。',
    category: 'content',
  },

  // ── ⑧ 生财有术：商业实战 ──
  {
    id: 'shengcai',
    name: '生财有术',
    lens: '商业实战——能不能赚到钱，用最小的成本最快验证',
    question: '这个方案的最小可验证版本是什么？第一块钱从哪来？',
    checks: [
      '有没有一个可以今天就开始做的动作（最小闭环）？',
      '变现路径是否清晰？免费→低价→高价的梯子搭好了吗？',
      '有没有过度建设？能不能先跑起来再优化？',
      'ROI是否算得过来？投入100分时间，能产出多少分收入？',
    ],
    verdict: '能赚到第一块钱的方案，比完美的方案重要100倍。',
    category: 'prompt',
  },
]

// ─── 辅助函数 ────────────────────────────────────────────

/** 按分类获取评审团成员 */
export function getReviewersByCategory(category: Reviewer['category']): Reviewer[] {
  return REVIEW_PANEL.filter((r) => r.category === category)
}

/** 获取全部评审团成员 */
export function getAllReviewers(): Reviewer[] {
  return REVIEW_PANEL
}

/** 生成八视角审查提示词 */
export function buildReviewPrompt(content: string, includeAll = true): string {
  const reviewers = includeAll ? REVIEW_PANEL : REVIEW_PANEL.slice(0, 5)

  const sections = reviewers.map((r) =>
    `**${r.name}（${r.lens}）**：\n` +
    `问自己：${r.question}\n` +
    r.checks.map((c, i) => `  ${i + 1}. ${c}`).join('\n')
  ).join('\n\n')

  return `以下内容需要经过八人评审团审查：\n\n---\n${content}\n---\n\n请每个视角分别给出判断：\n\n${sections}`
}
