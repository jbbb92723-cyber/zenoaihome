'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Container from '@/components/Container'

type ScenarioId = 'quote' | 'client' | 'site' | 'content' | 'workflow'

interface Scenario {
  id: ScenarioId
  label: string
  job: string
  bestFor: string
  output: string
  placeholder: string
  steps: string[]
}

const scenarios: Scenario[] = [
  {
    id: 'quote',
    label: '报价追问',
    job: '把一份看不懂的报价，变成可追问、可比较、可留痕的问题清单。',
    bestFor: '业主、设计师、项目经理、装修顾问。',
    output: '报价风险、追问话术、下一步材料清单。',
    placeholder: '例如：南宁 108 平，半包报价 12.8 万，水电按实结算，柜子另算，报价里辅材品牌没写清。',
    steps: ['粘贴报价关键信息', '让 AI 先找模糊项', '让 AI 生成追问清单', '你用现场经验判断哪些必须写进合同'],
  },
  {
    id: 'client',
    label: '客户沟通',
    job: '把客户零散表达，整理成需求优先级、风险提醒和下一次沟通提纲。',
    bestFor: '装修从业者、设计师、销售和顾问。',
    output: '客户画像、需求排序、沟通问题、成交风险。',
    placeholder: '例如：客户夫妻意见不一致，女方想要奶油风，男方担心预算，家里有两个孩子，需要大量收纳。',
    steps: ['记录客户原话', '拆分显性需求和隐性担心', '生成下一次沟通问题', '把确认结果写成项目备忘'],
  },
  {
    id: 'site',
    label: '施工留痕',
    job: '把当天工地情况整理成节点记录、问题清单和整改沟通话术。',
    bestFor: '已经开工的业主、项目经理、监理。',
    output: '施工节点记录、照片清单、整改话术。',
    placeholder: '例如：今天水电开槽结束，厨房有一处横槽，卫生间防水还没做，现场说周五验收。',
    steps: ['写下当天节点', '列出需要拍照的位置', '生成整改确认话术', '把结果发到项目群留痕'],
  },
  {
    id: 'content',
    label: '内容选题',
    job: '把真实现场经验转成有观点、有判断、有转化路径的内容选题。',
    bestFor: '传统行业内容创作者、装修博主、个人品牌。',
    output: '选题、标题、结构、案例切入点、CTA。',
    placeholder: '例如：最近很多客户都问为什么同样 100 平报价差几万，我想写一篇不标题党的文章。',
    steps: ['输入真实观察', '生成反常识角度', '挑一个最有判断力的标题', '按文章结构写成长期资产'],
  },
  {
    id: 'workflow',
    label: 'AI 工作流',
    job: '找出传统装修业务里最适合 AI 先介入的一个重复任务。',
    bestFor: '传统行业老板、装修公司、个人咨询业务。',
    output: 'AI 切入点、输入模板、提示词、人工校准点。',
    placeholder: '例如：我每天要回复很多客户问题，还要整理报价和发朋友圈，不知道哪个环节先用 AI。',
    steps: ['列出每天重复任务', '筛选高频低风险任务', '设计输入模板', '做一版提示词并持续迭代'],
  },
]

function buildPrompt(scenario: Scenario, context: string, desiredOutput: string) {
  const contextText = context.trim() || '[在这里补充你的真实情况、材料或客户原话]'
  const outputText = desiredOutput.trim() || scenario.output

  return `你是一位懂装修现场、客户沟通和 AI 工作流的顾问。你的任务不是写漂亮废话，而是把真实情况拆成可判断、可执行、可复用的步骤。

当前场景：${scenario.label}
要解决的问题：${scenario.job}
我的真实情况：
${contextText}

我希望得到的结果：${outputText}

请按下面结构输出：
1. 先判断：这个问题真正卡在哪里，不要泛泛而谈。
2. 风险拆解：列出 3-5 个最需要先确认的风险点。
3. 关键追问：给出可以直接复制给客户、施工方或团队的追问话术。
4. 执行步骤：告诉我下一步先做什么、再做什么、最后留下什么记录。
5. 人工校准点：哪些地方不能交给 AI，需要我用现场经验或商业判断来定。
6. 可复用模板：把这次处理方式整理成下次还能用的模板。

要求：
- 语言直接，少用形容词。
- 不要编造数据、案例和承诺。
- 不要把 AI 神化，也不要假装 AI 没用。
- 输出必须能被我今天拿去执行。`
}

export default function PromptPlayground() {
  const [activeId, setActiveId] = useState<ScenarioId>('quote')
  const [context, setContext] = useState('')
  const [desiredOutput, setDesiredOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const activeScenario = scenarios.find((scenario) => scenario.id === activeId) ?? scenarios[0]
  const generatedPrompt = useMemo(
    () => buildPrompt(activeScenario, context, desiredOutput),
    [activeScenario, context, desiredOutput]
  )

  function copyPrompt() {
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    })
  }

  return (
    <main className="min-h-screen bg-canvas">
      <div className="border-b border-border bg-surface-warm py-12 sm:py-16">
        <Container size="content">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">AI Tool</p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            AI 场景生成器：把装修经验变成可执行提示词
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
            选一个真实场景，填入你的材料，生成一段能直接复制到 Claude / ChatGPT 的提示词。目标不是炫技，而是让 AI 帮你做报价追问、客户沟通、施工留痕、内容选题和工作流拆解。
          </p>
        </Container>
      </div>

      <Container size="wide" className="py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[0.34fr_0.66fr]">
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-faint">选择场景</p>
              <div className="grid gap-2">
                {scenarios.map((scenario) => {
                  const active = scenario.id === activeId
                  return (
                    <button
                      key={scenario.id}
                      type="button"
                      onClick={() => { setActiveId(scenario.id); setContext(''); setDesiredOutput('') }}
                      className={`border px-4 py-3 text-left transition-all duration-150 ${
                        active
                          ? 'border-stone bg-surface-warm shadow-[0_12px_28px_rgba(42,39,35,0.06)]'
                          : 'border-border bg-surface hover:border-stone/50 hover:bg-surface-warm'
                      }`}
                    >
                      <span className="block text-sm font-semibold text-ink">{scenario.label}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-ink-muted">{scenario.job}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="border border-border bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone">这个场景适合</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{activeScenario.bestFor}</p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-stone">执行顺序</p>
              <ol className="mt-3 space-y-2">
                {activeScenario.steps.map((step, index) => (
                  <li key={step} className="flex gap-2 text-sm leading-relaxed text-ink-muted">
                    <span className="shrink-0 text-stone">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <section className="grid gap-6">
            <div className="grid gap-4 border border-border bg-surface p-5 sm:p-6">
              <label className="text-sm font-semibold text-ink">
                你的真实情况
                <textarea
                  value={context}
                  onChange={(event) => setContext(event.target.value)}
                  placeholder={activeScenario.placeholder}
                  className="mt-2 min-h-32 w-full resize-none border border-border bg-canvas px-3 py-3 text-sm leading-relaxed text-ink outline-none placeholder:text-ink-faint focus:border-stone"
                />
              </label>
              <label className="text-sm font-semibold text-ink">
                希望 AI 输出什么
                <input
                  value={desiredOutput}
                  onChange={(event) => setDesiredOutput(event.target.value)}
                  placeholder={activeScenario.output}
                  className="mt-2 w-full border border-border bg-canvas px-3 py-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-stone"
                />
              </label>
            </div>

            <div className="border border-border bg-surface">
              <div className="flex items-center justify-between gap-4 border-b border-border bg-surface-warm px-5 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-stone">Generated Prompt</p>
                  <p className="mt-1 text-xs text-ink-muted">复制到 Claude / ChatGPT，再用你的现场经验校准。</p>
                </div>
                <button
                  type="button"
                  onClick={copyPrompt}
                  className="inline-flex h-9 shrink-0 items-center bg-stone px-4 text-xs font-semibold text-white hover:bg-stone/90"
                >
                  {copied ? '已复制' : '复制提示词'}
                </button>
              </div>
              <pre className="max-h-[560px] overflow-auto whitespace-pre-wrap p-5 font-sans text-sm leading-relaxed text-ink">
                {generatedPrompt}
              </pre>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Link href="/ai" className="border border-border bg-surface p-5 hover:border-stone">
                <p className="text-sm font-semibold text-ink">看 AI 升级路线</p>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">从工具试用走向方法、服务和产品化。</p>
              </Link>
              <Link href="/pricing#ai-workflow-course" className="border border-border bg-surface p-5 hover:border-stone">
                <p className="text-sm font-semibold text-ink">AI 工作流小课</p>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">适合想系统学一遍的人。</p>
              </Link>
              <Link href="/services/ai-workflow" className="border border-border bg-surface p-5 hover:border-stone">
                <p className="text-sm font-semibold text-ink">AI 工作流咨询</p>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">工具跑不通时，再进入人工拆解。</p>
              </Link>
            </div>
          </section>
        </div>
      </Container>
    </main>
  )
}
