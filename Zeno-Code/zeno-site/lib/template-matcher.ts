/**
 * lib/template-matcher.ts
 * 模板匹配 + 变量填充
 *
 * 复用 AiReplyClient 的 12 条预写模板
 */

// ─── 模板库（从 AiReplyClient.tsx 提取 + 补充） ──────────

interface Template {
  id: string
  category: string
  title: string
  scenario: string
  content: string
}

const TEMPLATES: Template[] = [
  {
    id: 'eff-01', category: 'quote_review',
    title: '审核完真的能省多少钱？', scenario: '业主问效果/价值',
    content: `您好。这个问题我没办法给您一个"保证省多少"的数字——因为每份报价单的问题不一样。

但我可以告诉您我17年见过的规律：一份没被审过的报价单，隐藏加价项平均多算 2-5 万。

我做的事情不是"帮您砍价"——是帮您把报价单里那些模糊的描述（比如"按实结算""同等品牌""常规工艺"）翻译成具体的数字和边界。让您在签字之前，清清楚楚知道每一块钱花在哪、哪些地方可能会变。

如果您现在手里有报价单，可以先做免费初筛工具扫一眼。做完如果您觉得"这东西我自己也能看"——那可能真的不用找我。如果做完您心里更没底了——那种"不确定感"就是我的价值。`,
  },
  {
    id: 'quote-01', category: 'quote_review',
    title: '报价单怎么发给你看？', scenario: '业主问如何提交',
    content: `您好。您可以把报价单截图、PDF或Excel直接发给我。

重点看这几样东西就行：
1. 有没有"按实结算""暂估""另计"这些模糊词
2. 材料只写了品牌没写型号
3. 基础部分总合计——很多人以为这是最终价，其实不是

发过来之后我会先快速扫一眼，如果问题不大就告诉您"这份还行，继续谈"。如果有隐患，我会逐项标出来。`,
  },
  {
    id: 'quote-02', category: 'quote_review',
    title: '为什么免费报价初查和付费审查不一样？', scenario: '业主问收费',
    content: `免费初查只扫10行以内的重点报价，告诉您有没有明显雷。

付费审查是逐项看——我把报价单拆成13个风险边界，每一个都会告诉你：包含什么、不包含什么、单价是否合理、数量是否清楚、工艺是否明确。

两者的区别不是"用心"和"不用心"——是深度。初查帮你判断"要不要继续谈"，审查帮你判断"签约前哪些必须改"。`,
  },
  {
    id: 'contract-01', category: 'contract_review',
    title: '签合同前要注意什么？', scenario: '业主问签约',
    content: `签合同前，有几样东西您必须自己看清楚——不是律师，是我17年见过最多人后悔的地方：

1. 口头承诺有没有写进合同或附件
2. 材料品牌后面有没有跟型号和替换规则
3. 付款节点有没有跟验收绑定——付完钱才验收是最危险的
4. 工期约定有没有写顺延条件和延期责任
5. "按实结算"项目的确认流程——是不是必须先告知再施工

合同不是拿来吓人的，是拿来防止扯皮的。把这些写清楚，双方都轻松。`,
  },
  {
    id: 'contract-02', category: 'contract_review',
    title: '装修公司的合同能改吗？', scenario: '业主担心不能改',
    content: `能改。装修公司的格式合同不是圣旨——它只是他们的起点。

您不需要跟对方吵架。只需要说："这几个地方我不太放心，能不能帮忙写清楚一下？"

重点是改什么：不是改价格，是改规则。把模糊的条款变成双方都能执行的约定。如果对方极度抗拒把写清楚——那本身就是一条重要信息。`,
  },
  {
    id: 'live-01', category: 'living_diagnosis',
    title: '还不确定风格，能先做居住诊断吗？', scenario: '业主问诊断',
    content: `完全可以。居住诊断不是帮您选风格——是先帮您理清"我到底需要什么样的家"。

很多人在这阶段容易绕弯：刷了三个月小红书，攒了500张灵感图，但说不上来自己到底喜欢什么。

诊断做的事：把您和家人的日常生活场景翻译成空间优先级。比如：您家谁做饭、谁带娃、谁需要安静——这些看起来跟"装修"无关，但决定了厨房是开放还是封闭、动线怎么走、收纳在哪里。

先把这些理清了，再去跟设计师聊，方向就清楚多了。`,
  },
  {
    id: 'budget-01', category: 'budget',
    title: '预算总是越算越乱怎么办？', scenario: '业主问预算',
    content: `您不是一个人。几乎每个业主的预算都会在装修过程中被拉长——不是因为您乱花钱，是因为在签合同前，没有人帮您把"基础部分总合计"翻译成"真正的最终价"。

预算不是一道算术题，是一道边界题。我建议您把预算拆成四类钱来看：
1. 必须花的（水电、防水、基层——这部分基本跑不掉）
2. 现在不花以后更贵的（隐蔽工程、环保材料）
3. 可以晚点买的（智能家居、高端电器）
4. 只是想要的（装饰、升级款）

先把第一类锁住，再谈剩下的。`,
  },
  {
    id: 'general-01', category: 'general',
    title: '我该先做什么？', scenario: '业主不知道从哪开始',
    content: `您好。装修这件事，多数人都是第一次，不知道从哪开始很正常。

我建议您先做三件事：
1. 确定您的家庭在空间里会怎么生活（不是"想要什么风格"，是"谁做什么、在哪做"）
2. 确定您的真实预算上限——不是"理想预算"，是"咬牙也能接受的数字"
3. 多看几份报价单，不急着签。拿回来先看看——报价单是最好的装修教材

这三件事做完了，您对接下来的每一步都会清楚很多。如果中间有拿不准的，随时来问。`,
  },
]

// ─── 匹配逻辑 ────────────────────────────────────────────

interface MatchResult {
  template: Template | null
  filledContent: string
  category: string
}

export function matchTemplate(
  category: string,
  variables: { name?: string; phone?: string; wechat?: string; message?: string; serviceType?: string }
): MatchResult {
  // 找到分类下的所有模板
  const candidates = TEMPLATES.filter((t) => t.category === category)

  // 没有匹配则用 general
  const pool = candidates.length > 0 ? candidates : TEMPLATES.filter((t) => t.category === 'general')

  // 选第一个（后续可加智能排序）
  const template = pool[0] ?? null

  // 填充变量
  let filledContent = template?.content ?? ''
  const name = variables.name ?? '业主'
  filledContent = filledContent.replace(/您好/g, `${name ? name + '，' : ''}您好`)
  if (variables.serviceType) {
    filledContent = filledContent.replace(/报价单/g, variables.serviceType.includes('合同') ? '合同' : '报价单')
  }

  return {
    template,
    filledContent,
    category,
  }
}

/**
 * 获取所有可用模板（用于 Zeno OS 手动选择）
 */
export function getAllTemplates(): Template[] {
  return TEMPLATES
}

/**
 * 按分类获取模板列表
 */
export function getTemplatesByCategory(category: string): Template[] {
  return TEMPLATES.filter((t) => t.category === category)
}
