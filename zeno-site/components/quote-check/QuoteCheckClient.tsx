'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import ToolSeoAssetSection from '@/components/tools/ToolSeoAssetSection'
import { toolSeoAssets } from '@/data/toolSeoAssets'

type QuoteStage = 'firstQuote' | 'comparing' | 'readyToSign' | 'alreadyStarted'

interface QuoteFormState {
  area: string
  total: string
  quoteStage: QuoteStage
  hasContractDraft: boolean
  hasItemizedQuote: boolean
  hasMaterialBrand: boolean
  hasProcessDescription: boolean
  hasMeasurementRule: boolean
  hasChangeOrderRule: boolean
  hasAcceptanceStandard: boolean
  hasWarrantyScope: boolean
  hasPaymentMilestone: boolean
}

type CheckKey =
  | 'hasItemizedQuote'
  | 'hasMaterialBrand'
  | 'hasProcessDescription'
  | 'hasMeasurementRule'
  | 'hasChangeOrderRule'
  | 'hasAcceptanceStandard'
  | 'hasWarrantyScope'
  | 'hasPaymentMilestone'

const storageKey = 'zeno.quote-check.v2'

const defaultState: QuoteFormState = {
  area: '',
  total: '',
  quoteStage: 'readyToSign',
  hasContractDraft: false,
  hasItemizedQuote: false,
  hasMaterialBrand: false,
  hasProcessDescription: false,
  hasMeasurementRule: false,
  hasChangeOrderRule: false,
  hasAcceptanceStandard: false,
  hasWarrantyScope: false,
  hasPaymentMilestone: false,
}

const stageOptions: Array<{ value: QuoteStage; label: string; desc: string }> = [
  { value: 'firstQuote', label: '刚拿到第一版报价', desc: '先看结构和明显缺口' },
  { value: 'comparing', label: '正在几家之间比较', desc: '不要只比总价' },
  { value: 'readyToSign', label: '一两周内准备签约', desc: '先把追问写清楚' },
  { value: 'alreadyStarted', label: '已经签约或开工', desc: '更多是复盘和补救' },
]

const checks: Array<{
  key: CheckKey
  dimension: string
  label: string
  risk: string
  question: string
  weight: number
}> = [
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

const maxScore = checks.reduce((sum, item) => sum + item.weight, 0)

function getStageLabel(stage: QuoteStage) {
  return stageOptions.find((item) => item.value === stage)?.label ?? '准备签约'
}

function getRiskLevel(score: number) {
  if (score >= 8) return '高风险'
  if (score >= 4) return '中风险'
  return '低风险'
}

function getRiskCopy(score: number, stage: QuoteStage) {
  if (stage === 'alreadyStarted') {
    return '你已经过了签约前最适合调整的窗口。现在重点是把变更、验收和付款留痕补起来。'
  }
  if (score >= 8) return '这份报价不适合直接签。先把缺失信息补齐，再谈价格和优惠。'
  if (score >= 4) return '可以继续谈，但要先追问边界。不要只盯总价，也不要只听口头承诺。'
  return '报价结构相对清楚。下一步重点把关键内容写进合同，并核对付款和验收节点。'
}

function getPrimaryNextStep(score: number, stage: QuoteStage) {
  if (stage === 'alreadyStarted') {
    return {
      label: '生成验收节点清单',
      href: '/tools/inspection-guide',
      desc: '已经开工时，先把现场节点、照片和确认记录补起来。',
    }
  }
  if (score >= 8) {
    return {
      label: '看 ¥699 报价风险快审',
      href: '/services/renovation#baojia-shenhe',
      desc: '缺失项多，先带着报价单进入人工判断，别急着签。',
    }
  }
  if (score >= 4) {
    return {
      label: '看 ¥39 报价避坑指南',
      href: '/pricing/baojia-guide',
      desc: '先系统补一遍报价、合同、预算和增项常识，再继续谈。',
    }
  }
  return {
    label: '领取签约前检查清单',
    href: '/resources#baojia-shenhe-qingdan',
    desc: '报价结构还可以，下一步把追问清单拿去对照合同和付款节点。',
  }
}

export default function QuoteCheckClient() {
  const [form, setForm] = useState<QuoteFormState>(defaultState)
  const [fileName, setFileName] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copiedQuestions, setCopiedQuestions] = useState(false)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey)
      if (saved) setForm({ ...defaultState, ...JSON.parse(saved) })
    } catch {
      window.localStorage.removeItem(storageKey)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(form))
  }, [form])

  const riskItems = useMemo(() => checks.filter((item) => !form[item.key]), [form])
  const completedCount = checks.length - riskItems.length
  const riskScore = riskItems.reduce((sum, item) => sum + item.weight, 0)
  const riskLevel = getRiskLevel(riskScore)
  const riskCopy = getRiskCopy(riskScore, form.quoteStage)
  const topQuestions = riskItems.slice(0, 3)
  const primaryNextStep = getPrimaryNextStep(riskScore, form.quoteStage)

  const unitPrice = useMemo(() => {
    const area = Number(form.area)
    const total = Number(form.total)
    if (!area || !total) return null
    return Math.round(total / area)
  }, [form.area, form.total])

  function updateField(key: keyof QuoteFormState, value: string | boolean) {
    setForm((previous) => ({ ...previous, [key]: value }))
  }

  function reset() {
    setForm(defaultState)
    setFileName('')
    setShowResult(false)
    window.localStorage.removeItem(storageKey)
  }

  async function copyResultSummary() {
    const lines = [
      '装修报价风险初筛结果',
      `风险等级：${riskLevel}`,
      `签约阶段：${getStageLabel(form.quoteStage)}`,
      `已写清边界：${completedCount}/${checks.length}`,
      `缺失风险分：${riskScore}/${maxScore}`,
      unitPrice ? `粗略单方：${unitPrice.toLocaleString()} 元/㎡` : '',
      `判断提醒：${riskCopy}`,
      `建议下一步：${primaryNextStep.label}`,
      '',
      '优先追问：',
      ...(topQuestions.length > 0
        ? topQuestions.map((item, index) => `${index + 1}. 【${item.dimension}】${item.question}`)
        : ['关键边界已经相对清楚，下一步重点核对合同条款、付款节点和验收标准。']),
    ].filter(Boolean)

    await navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  async function copyQuestionList() {
    const text = riskItems.length === 0
      ? '这份报价的关键边界已经相对清楚。下一步重点核对合同条款、付款节点和验收标准。'
      : riskItems.map((item, index) => `${index + 1}. 【${item.dimension}】${item.question}`).join('\n')
    await navigator.clipboard.writeText(text)
    setCopiedQuestions(true)
    setTimeout(() => setCopiedQuestions(false), 1600)
  }

  return (
    <main className="min-h-screen bg-canvas">
      <section className="border-b border-border bg-surface-warm">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.62fr_0.38fr] lg:py-16">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">签约前报价风险初筛</p>
            <h1 className="mt-4 max-w-[22rem] text-[2rem] font-semibold leading-tight tracking-tight text-ink sm:max-w-3xl sm:text-5xl">
              <span className="block">报价单别急着签，</span>
              <span className="block">先看哪里没写清。</span>
            </h1>
            <p className="mt-5 max-w-[22rem] text-base leading-relaxed text-ink-muted sm:max-w-2xl sm:text-lg">
              这不是自动审报价，也不是帮你砍价。它先帮你判断一件事：这份报价在签约前，哪些地方必须追问，哪些内容要写进合同。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#quote-form" className="inline-flex h-11 items-center bg-stone px-5 text-sm font-semibold text-white transition-colors hover:bg-stone/90">
                开始初筛
              </a>
              <Link href="/resources#baojia-shenhe-qingdan" className="inline-flex h-11 items-center border border-border px-5 text-sm font-semibold text-ink transition-colors hover:border-stone">
                先领检查清单
              </Link>
            </div>
          </div>

          <div className="border border-border bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">结果会给你什么</p>
            <div className="mt-5 grid gap-3">
              {[
                ['风险等级', '低 / 中 / 高，不直接替你拍板'],
                ['缺失项数量', '看报价里哪些边界没写清'],
                ['前三个追问', '先问最影响签约判断的问题'],
                ['下一步入口', '清单、¥39 指南、¥699 快审或 ¥1499 决策包'],
              ].map(([title, desc]) => (
                <div key={title} className="border border-border bg-canvas px-4 py-3">
                  <p className="text-sm font-semibold text-ink">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-muted">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="quote-form" className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.58fr_0.42fr]">
        <div className="space-y-6">
          <div className="border border-border bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">Step 1</p>
            <h2 className="mt-2 text-lg font-semibold text-ink">你现在离签约有多近</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {stageOptions.map((stage) => (
                <label key={stage.value} className={`cursor-pointer border p-4 transition-colors ${form.quoteStage === stage.value ? 'border-stone bg-stone-pale' : 'border-border bg-canvas hover:border-stone/70'}`}>
                  <input
                    type="radio"
                    name="quote-stage"
                    value={stage.value}
                    checked={form.quoteStage === stage.value}
                    onChange={() => updateField('quoteStage', stage.value)}
                    className="sr-only"
                  />
                  <span className="block text-sm font-semibold text-ink">{stage.label}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-ink-muted">{stage.desc}</span>
                </label>
              ))}
            </div>
            <label className="mt-4 flex cursor-pointer items-start gap-3 border border-border bg-canvas p-3 hover:border-stone/60">
              <input
                type="checkbox"
                checked={form.hasContractDraft}
                onChange={(event) => updateField('hasContractDraft', event.target.checked)}
                className="mt-1 h-4 w-4 accent-stone"
              />
              <span>
                <span className="block text-sm font-medium text-ink">我已经拿到合同草稿或付款节点</span>
                <span className="mt-1 block text-xs leading-relaxed text-ink-muted">如果临近签约，报价、合同和付款节点要一起看。</span>
              </span>
            </label>
          </div>

          <div className="border border-border bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">Step 2</p>
            <h2 className="mt-2 text-lg font-semibold text-ink">上传或记录你的报价材料</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              文件只作为你本地对照材料，不上传服务器。真正要判断，还是看报价内容有没有写清楚。
            </p>
            <label className="mt-5 flex cursor-pointer flex-col items-center justify-center border border-dashed border-border bg-canvas px-5 py-8 text-center transition-colors hover:border-stone">
              <input
                type="file"
                accept=".pdf,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={(event) => setFileName(event.target.files?.[0]?.name ?? '')}
              />
              <span className="text-sm font-semibold text-ink">选择 PDF / Excel / 图片</span>
              <span className="mt-1 text-xs text-ink-muted">{fileName || '用于辅助你对照填写，不会被自动解析'}</span>
            </label>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-ink">
                房屋面积
                <input
                  value={form.area}
                  onChange={(event) => updateField('area', event.target.value)}
                  inputMode="decimal"
                  placeholder="例如 108"
                  className="mt-2 w-full border border-border bg-canvas px-3 py-2 text-sm outline-none focus:border-stone"
                />
              </label>
              <label className="text-sm font-medium text-ink">
                报价总额
                <input
                  value={form.total}
                  onChange={(event) => updateField('total', event.target.value)}
                  inputMode="decimal"
                  placeholder="例如 180000"
                  className="mt-2 w-full border border-border bg-canvas px-3 py-2 text-sm outline-none focus:border-stone"
                />
              </label>
            </div>
          </div>

          <div className="border border-border bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">Step 3</p>
            <h2 className="mt-2 text-lg font-semibold text-ink">对照报价单，勾选已经写清的部分</h2>
            <div className="mt-5 space-y-3">
              {checks.map((item) => (
                <label key={item.key} className="flex cursor-pointer items-start gap-3 border border-border bg-canvas p-3 transition-colors hover:border-stone/60">
                  <input
                    type="checkbox"
                    checked={Boolean(form[item.key])}
                    onChange={(event) => updateField(item.key, event.target.checked)}
                    className="mt-1 h-4 w-4 accent-stone"
                  />
                  <span>
                    <span className="block text-[0.7rem] font-semibold uppercase tracking-widest text-stone">{item.dimension}</span>
                    <span className="mt-1 block text-sm font-medium text-ink">{item.label}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-ink-muted">没写清时，结果里会生成对应风险和追问。</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setShowResult(true)} className="inline-flex h-11 items-center bg-stone px-5 text-sm font-semibold text-white transition-colors hover:bg-stone/90">
              生成初筛结果
            </button>
            <button type="button" onClick={reset} className="inline-flex h-11 items-center border border-border px-5 text-sm font-semibold text-ink transition-colors hover:border-stone">
              重新填写
            </button>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="border border-border bg-surface-warm p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">当前初筛</p>
            <div className="mt-4 grid grid-cols-2 gap-px bg-border">
              <div className="bg-surface p-4">
                <p className="text-2xl font-semibold text-ink">{completedCount}/{checks.length}</p>
                <p className="mt-1 text-xs text-ink-muted">已写清边界</p>
              </div>
              <div className="bg-surface p-4">
                <p className="text-2xl font-semibold text-ink">{riskScore}/{maxScore}</p>
                <p className="mt-1 text-xs text-ink-muted">缺失风险分</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">越临近签约，缺失风险分越不能忽略。没有写进报价和合同的承诺，后面很难讲清。</p>
            {unitPrice && (
              <div className="mt-4 border-t border-border pt-4 text-sm text-ink-muted">
                粗略单方：<span className="font-semibold text-ink">{unitPrice.toLocaleString()} 元/㎡</span>
              </div>
            )}
          </div>

          <div className="border border-border bg-surface p-5">
            <h2 className="text-lg font-semibold text-ink">初筛不做什么</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-muted">
              <li>不自动识别文件内容。</li>
              <li>不替你做最终签约决定。</li>
              <li>不承诺最低价，不代谈判。</li>
              <li>不制造焦虑，只把没写清的地方列出来。</li>
            </ul>
          </div>

          <div className="border border-stone/30 bg-stone/5 p-5">
            <h2 className="text-sm font-semibold text-ink">适合先用工具的情况</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              你还没确定施工方，或者只是想先知道报价里哪里没写清。已经临近签约、材料很多、问题复杂，再考虑人工快审。
            </p>
          </div>
        </aside>
      </section>

      {showResult && (
        <section className="border-y border-border bg-surface-warm">
          <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
            <div className="grid gap-6 lg:grid-cols-[0.38fr_0.62fr]">
              <div className="border border-border bg-canvas p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone">Result</p>
                <h2 className="mt-3 text-4xl font-semibold tracking-tight text-ink">{riskLevel}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{riskCopy}</p>

                <div className="mt-6 grid gap-px bg-border sm:grid-cols-3 lg:grid-cols-1">
                  <div className="bg-surface p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint">签约阶段</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{getStageLabel(form.quoteStage)}</p>
                  </div>
                  <div className="bg-surface p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint">缺失项</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{riskItems.length} 项需要追问</p>
                  </div>
                  <div className="bg-surface p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint">合同材料</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{form.hasContractDraft ? '已拿到，建议一起核对' : '暂未拿到，先补付款节点'}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" onClick={copyResultSummary} className="inline-flex h-10 items-center bg-stone px-4 text-sm font-semibold text-white transition-colors hover:bg-stone/90">
                    {copied ? '已复制摘要' : '复制结果摘要'}
                  </button>
                  <button type="button" onClick={copyQuestionList} className="inline-flex h-10 items-center border border-stone px-4 text-sm font-semibold text-stone transition-colors hover:bg-stone-pale">
                    {copiedQuestions ? '已复制追问' : '复制追问清单'}
                  </button>
                </div>
              </div>

              <div className="space-y-5">
                <div className="border border-border bg-canvas p-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-stone">前三个最该追问的问题</p>
                      <h3 className="mt-2 text-lg font-semibold text-ink">先问这些，不要一上来只谈优惠。</h3>
                    </div>
                    <span className="w-fit bg-stone-pale px-3 py-1 text-xs font-semibold text-stone">{riskScore}/{maxScore} 风险分</span>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {topQuestions.length === 0 ? (
                      <div className="border border-border bg-surface p-5 text-sm leading-relaxed text-ink-muted">
                        关键边界已经相对清楚。下一步可以把报价内容放进合同、付款节点和验收节点里交叉检查。
                      </div>
                    ) : topQuestions.map((item, index) => (
                      <div key={item.key} className="border border-border bg-surface p-5">
                        <div className="flex items-start gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-stone text-xs font-semibold text-white">{index + 1}</span>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-stone">{item.dimension}</p>
                            <h4 className="mt-1 text-sm font-semibold text-ink">{item.label}</h4>
                            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.risk}</p>
                            <p className="mt-3 border-l-2 border-stone-light pl-3 text-sm leading-relaxed text-stone">{item.question}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                  <Link href={primaryNextStep.href} className="group border border-stone bg-stone p-6 text-white transition-colors hover:bg-stone/90">
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/65">建议下一步</p>
                    <h3 className="mt-2 text-xl font-semibold">{primaryNextStep.label}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/76">{primaryNextStep.desc}</p>
                    <span className="mt-5 inline-flex text-sm font-semibold">进入这一步 -&gt;</span>
                  </Link>

                  <div className="grid gap-3">
                    {[
                      { label: '领取报价审核清单', href: '/resources#baojia-shenhe-qingdan' },
                      { label: '看 ¥39 报价避坑指南', href: '/pricing/baojia-guide' },
                      { label: '看 ¥1499 签约前决策包', href: '/services/renovation#qianyue-qian-juece-bao' },
                    ].map((item) => (
                      <Link key={item.href} href={item.href} className="flex items-center justify-between border border-border bg-canvas px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-stone">
                        {item.label}
                        <span className="text-stone">-&gt;</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid gap-5 border border-border bg-surface p-6 sm:p-8 lg:grid-cols-[0.34fr_0.66fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">价格梯子</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">看不明白时，再进入付费。</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['免费', '报价初筛', '先知道哪里没写清'],
              ['¥39', '报价避坑指南', '自己系统补一遍'],
              ['¥699', '报价风险快审', '带材料进入人工判断'],
              ['¥1499', '签约前决策包', '报价、预算、合同一起看'],
            ].map(([price, title, desc]) => (
              <div key={title} className="border border-border bg-canvas p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone">{price}</p>
                <h3 className="mt-2 text-sm font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ToolSeoAssetSection asset={toolSeoAssets.quoteCheck} />
    </main>
  )
}
