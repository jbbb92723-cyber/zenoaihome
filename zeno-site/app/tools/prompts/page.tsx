'use client'

import { useState } from 'react'
import Container from '@/components/Container'

const scenarios = [
  {
    id: 'wechat',
    label: '写公众号文章',
    icon: '✍️',
    description: '写一篇有观点、有结构的公众号长文',
    prompt: (topic: string) => `你是一位有 16 年装修行业经验的内容创作者，擅长把真实经历转化成有判断力的文章。

请帮我围绕这个主题写一篇公众号文章：
${topic ? `主题：${topic}` : '[请在上方输入你的主题]'}

要求：
1. 开头不用"在这个……"、"随着……"等套话，直接切入真实情境或观点
2. 有具体的经历细节，不要空泛说教
3. 主体结构清晰（2-3个层次）
4. 结尾有收拢感，但不要硬煽情
5. 全文 800-1200 字，口语化但不失判断力
6. 避免 AI 腔，不用"值得注意的是"、"不可否认"等过渡词

请先给出文章大纲，再写正文。`,
  },
  {
    id: 'renovation',
    label: '做装修沟通',
    icon: '🏠',
    description: '梳理装修需求、准备沟通框架',
    prompt: (topic: string) => `你是一位专业的装修顾问，帮助业主理清需求并准备好与施工方的沟通。

我的情况：
${topic ? topic : '[请描述你的装修情况，比如：新房 90 平、预算 15 万、想做北欧风]'}

请帮我：
1. 梳理我的核心需求清单（按优先级排列）
2. 列出与施工方沟通时必须确认的关键问题（至少 5 条）
3. 给出 3 个容易忽略的风险点，以及预防方法
4. 提供一个简短的"开口白"，帮助我在第一次见面时问到关键信息

格式简洁，直接可用，不要废话。`,
  },
  {
    id: 'budget',
    label: '做报价分析',
    icon: '📊',
    description: '分析装修报价单，识别漏项和风险',
    prompt: (topic: string) => `你是一位有丰富经验的装修从业者，帮我分析报价单。

${topic ? `报价单信息：${topic}` : '[请粘贴你的报价单关键内容，或描述你收到的报价情况]'}

请从以下角度分析：
1. **完整性检查**：有没有明显漏项（防水、基础处理、辅材等）
2. **价格合理性**：哪些项目价格偏高或偏低，需要追问
3. **风险项**：哪些描述模糊可能导致后期增项
4. **建议问题清单**：我应该反问施工方的 5 个关键问题
5. **总体判断**：这份报价整体是否值得继续谈

请用直接、专业的语气，不要回避风险，帮我看清真实情况。`,
  },
  {
    id: 'topics',
    label: '做内容选题',
    icon: '💡',
    description: '生成有价值的内容选题和角度',
    prompt: (topic: string) => `你是一位内容策略顾问，帮助传统行业从业者生成有价值的内容选题。

我的背景：
${topic ? topic : '[请描述你的行业背景，比如：装修行业 10 年，主要做住宅改造]'}

请帮我生成 10 个内容选题，要求：
1. 有真实痛点，不是泛泛的行业科普
2. 有判断和立场，不是中立的"两面说"
3. 适合写成 800-1500 字的深度文章
4. 标题要有冲突感或反常识感，能引发点击
5. 覆盖不同角度：避坑类、观点类、方法类、案例类

每个选题给出：
- 标题
- 核心观点一句话
- 适合切入的角度（从什么经历出发）`,
  },
  {
    id: 'ai-upgrade',
    label: '传统行业 AI 升级',
    icon: '🤖',
    description: '找到你行业中 AI 真正能用的场景',
    prompt: (topic: string) => `你是一位专注于帮助传统行业从业者真正用好 AI 的顾问（不卖焦虑、不神化工具）。

我的情况：
${topic ? topic : '[请描述你的行业和当前的工作方式，比如：建材销售，每天大量客户咨询]'}

请帮我：
1. **找出 3 个最适合用 AI 提效的场景**（必须是你行业里真实存在的重复劳动）
2. **给出每个场景的具体操作方式**（用什么工具，怎么写提示词，大概节省多少时间）
3. **指出 2 个看起来能用但其实用不上的场景**（避免踩坑）
4. **建议第一步从哪里开始**（最容易落地、风险最小的一个）

请实事求是，不要夸大 AI 的能力，也不要假装它没用。`,
  },
]

export default function PromptPlayground() {
  const [activeScenario, setActiveScenario] = useState(scenarios[0])
  const [userInput, setUserInput] = useState('')
  const [copied, setCopied] = useState(false)

  const generatedPrompt = activeScenario.prompt(userInput)

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border py-10 sm:py-12">
        <Container size="content">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">工具</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">AI 提示词体验场</h1>
          <p className="text-sm text-ink-muted mt-3 max-w-xl leading-relaxed">
            选择场景，输入你的具体情况，一键生成可直接用于 Claude / ChatGPT 的高质量提示词。不需要登录，不调用 AI 模型，纯本地生成。
          </p>
        </Container>
      </div>

      <Container size="content" className="py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">
          {/* 左栏：场景选择 + 输入 */}
          <div className="space-y-6">
            {/* 场景选择 */}
            <div>
              <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">选择场景</p>
              <div className="space-y-2">
                {scenarios.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setActiveScenario(s); setUserInput('') }}
                    className={`w-full text-left px-4 py-3 border transition-colors ${
                      activeScenario.id === s.id
                        ? 'border-stone bg-stone/5 text-stone'
                        : 'border-border text-ink-muted hover:border-stone/50 hover:text-ink'
                    }`}
                  >
                    <span className="mr-2">{s.icon}</span>
                    <span className="text-sm font-medium">{s.label}</span>
                    <p className={`text-xs mt-1 ${activeScenario.id === s.id ? 'text-stone/70' : 'text-ink-faint'}`}>
                      {s.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* 用户输入 */}
            <div>
              <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">补充你的具体情况（可选）</p>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="输入你的具体情况，让提示词更精准……"
                rows={4}
                className="w-full border border-border bg-surface text-sm text-ink placeholder:text-ink-faint px-3 py-2.5 resize-none focus:outline-none focus:border-stone transition-colors"
              />
              <p className="text-xs text-ink-faint mt-1">
                不填也可以——生成的提示词里有占位说明，你复制后自己补充也行。
              </p>
            </div>
          </div>

          {/* 右栏：生成结果 */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest">生成的提示词</p>
              <button
                onClick={handleCopy}
                className={`text-xs font-medium px-3 py-1.5 border transition-colors ${
                  copied
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-stone text-stone hover:bg-stone hover:text-white'
                }`}
              >
                {copied ? '已复制 ✓' : '一键复制'}
              </button>
            </div>

            <div className="flex-1 border border-border bg-surface p-4 overflow-auto">
              <pre className="text-sm text-ink leading-relaxed whitespace-pre-wrap font-sans">
                {generatedPrompt}
              </pre>
            </div>

            <div className="mt-4 p-4 border border-border bg-surface-warm">
              <p className="text-xs text-ink-muted leading-relaxed">
                <span className="font-semibold text-ink">怎么用：</span>
                复制上面的提示词，直接粘贴到{' '}
                <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="text-stone hover:underline underline-offset-2">Claude</a>
                {' '}或{' '}
                <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-stone hover:underline underline-offset-2">ChatGPT</a>
                {' '}中即可。这些提示词经过真实场景测试，可以直接用，也可以根据你的情况修改。
              </p>
            </div>
          </div>
        </div>

        {/* 底部说明 */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">关于这个工具</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-ink-muted">
            <div>
              <p className="font-medium text-ink mb-1">不调用 AI 模型</p>
              <p>提示词在本地直接生成，不消耗 API，速度即时。</p>
            </div>
            <div>
              <p className="font-medium text-ink mb-1">不需要登录</p>
              <p>直接用，没有账号要求，不收集你的输入内容。</p>
            </div>
            <div>
              <p className="font-medium text-ink mb-1">经过真实测试</p>
              <p>所有模板来自 Zeno 实际工作流，不是从网上收集的范例。</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
