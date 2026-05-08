'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import ToolSeoAssetSection from '@/components/tools/ToolSeoAssetSection'
import { toolSeoAssets } from '@/data/toolSeoAssets'

interface QuoteFormState {
  area: string
  total: string
  hasItemizedQuote: boolean
  hasMaterialBrand: boolean
  hasProcessDescription: boolean
  hasMeasurementRule: boolean
  hasChangeOrderRule: boolean
  hasAcceptanceStandard: boolean
  hasWarrantyScope: boolean
  hasPaymentMilestone: boolean
}

const storageKey = 'zeno.quote-check.v1'

const defaultState: QuoteFormState = {
  area: '',
  total: '',
  hasItemizedQuote: false,
  hasMaterialBrand: false,
  hasProcessDescription: false,
  hasMeasurementRule: false,
  hasChangeOrderRule: false,
  hasAcceptanceStandard: false,
  hasWarrantyScope: false,
  hasPaymentMilestone: false,
}

const checks: Array<{ key: keyof QuoteFormState; label: string; risk: string; question: string }> = [
  { key: 'hasItemizedQuote', label: '按空间或工种拆分到具体项目', risk: '项目颗粒度不足，后期容易用“没包含”解释增项。', question: '请把每个空间/工种的项目、数量、单位和单价拆出来，不要只给总价。' },
  { key: 'hasMaterialBrand', label: '主材/辅材品牌、型号、规格清楚', risk: '材料描述模糊，后期替换空间很大。', question: '这项材料的品牌、型号、规格、环保等级和可替代规则分别是什么？' },
  { key: 'hasProcessDescription', label: '关键工艺做法写清楚', risk: '工艺边界不清，现场质量很难验。', question: '这项施工的基层处理、施工步骤、厚度/遍数和验收标准是什么？' },
  { key: 'hasMeasurementRule', label: '工程量计算规则写清楚', risk: '面积、米数、点位算法不清，结算容易变形。', question: '工程量按什么规则计算？门窗洞口、损耗、转角和重复计算怎么处理？' },
  { key: 'hasChangeOrderRule', label: '增减项和变更流程写清楚', risk: '变更没有前置确认，预算会在施工中失控。', question: '所有增减项是否必须先报价、先确认、再施工？未确认施工如何处理？' },
  { key: 'hasAcceptanceStandard', label: '节点验收标准写清楚', risk: '只写“合格”没有意义，出问题很难争取。', question: '水电、泥木、油漆、安装分别按什么标准验收？谁签字后进入下一步？' },
  { key: 'hasWarrantyScope', label: '保修范围和期限写清楚', risk: '售后边界不清，后期维权成本高。', question: '哪些项目保修？保修多久？人为损坏、材料问题、施工问题如何区分？' },
  { key: 'hasPaymentMilestone', label: '付款节点和交付节点对应', risk: '钱走得比工程快，业主会失去主动权。', question: '每一笔付款对应哪个完成节点？未验收通过是否可以拒付下一笔？' },
]

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
  const unitPrice = useMemo(() => {
    const area = Number(form.area)
    const total = Number(form.total)
    if (!area || !total) return null
    return Math.round(total / area)
  }, [form.area, form.total])

  const riskLevel = riskItems.length >= 5 ? '高风险' : riskItems.length >= 3 ? '中风险' : '低风险'
  const riskCopy = riskItems.length >= 5
    ? '这份报价不适合直接签。先把缺失信息补齐，再谈价格。'
    : riskItems.length >= 3
      ? '可以继续谈，但要先追问边界，别只盯总价。'
      : '报价结构相对清楚，下一步重点看合同和现场验收。'

  function updateField(key: keyof QuoteFormState, value: string | boolean) {
    setForm((previous) => ({ ...previous, [key]: value }))
  }

  function reset() {
    setForm(defaultState)
    setFileName('')
    setShowResult(false)
    window.localStorage.removeItem(storageKey)
  }

  async function copyResultLink() {
    const params = new URLSearchParams()
    params.set('risk', riskLevel)
    params.set('missing', String(riskItems.length))
    if (unitPrice) params.set('unit', String(unitPrice))
    await navigator.clipboard.writeText(`${window.location.origin}/tools/quote-check?${params.toString()}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  async function copyQuestionList() {
    const text = riskItems.length === 0
      ? '这份报价的关键边界已经相对清楚。下一步重点核对合同条款、付款节点和验收标准。'
      : riskItems.map((item, index) => `${index + 1}. ${item.question}`).join('\n')
    await navigator.clipboard.writeText(text)
    setCopiedQuestions(true)
    setTimeout(() => setCopiedQuestions(false), 1600)
  }

  return (
    <main className="bg-canvas min-h-screen">
      <section className="border-b border-border bg-surface-warm">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-18">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">Quote Check</p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            报价单别急着签，先做一轮风险初筛。
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
            先不判断贵不贵，先判断能不能签：有没有漏项、有没有模糊工艺、有没有增项口子、钱有没有跑在工程前面。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#quote-form" className="inline-flex h-11 items-center bg-stone px-5 text-sm font-semibold text-white hover:bg-stone/90">
              开始初筛
            </a>
            <Link href="/services/renovation#baojia-shenhe" className="inline-flex h-11 items-center border border-border px-5 text-sm font-semibold text-ink hover:border-stone">
              需要人工审核
            </Link>
          </div>
        </div>
      </section>

      <section id="quote-form" className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.58fr_0.42fr]">
        <div className="space-y-6">
          <div className="border border-border bg-surface p-5">
            <h2 className="text-lg font-semibold text-ink">1. 上传或记录你的报价材料</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              文件只作为你本地对照材料，不上传服务器。真正要判断，还是看报价内容有没有写清楚。
            </p>
            <label className="mt-5 flex cursor-pointer flex-col items-center justify-center border border-dashed border-border bg-canvas px-5 py-8 text-center hover:border-stone">
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
            <h2 className="text-lg font-semibold text-ink">2. 对照报价单勾选已写清的部分</h2>
            <div className="mt-5 space-y-3">
              {checks.map((item) => (
                <label key={item.key} className="flex cursor-pointer items-start gap-3 border border-border bg-canvas p-3 hover:border-stone/60">
                  <input
                    type="checkbox"
                    checked={Boolean(form[item.key])}
                    onChange={(event) => updateField(item.key, event.target.checked)}
                    className="mt-1 h-4 w-4 accent-stone"
                  />
                  <span>
                    <span className="block text-sm font-medium text-ink">{item.label}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-ink-muted">没写清时，后面会生成对应追问。</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setShowResult(true)} className="inline-flex h-11 items-center bg-stone px-5 text-sm font-semibold text-white hover:bg-stone/90">
              生成初筛结果
            </button>
            <button type="button" onClick={reset} className="inline-flex h-11 items-center border border-border px-5 text-sm font-semibold text-ink hover:border-stone">
              重新填写
            </button>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="border border-border bg-surface-warm p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">Progress</p>
            <p className="mt-3 text-3xl font-semibold text-ink">{completedCount}/{checks.length}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">已写清的关键报价边界。越少，越不适合直接签。</p>
            {unitPrice && (
              <div className="mt-4 border-t border-border pt-4 text-sm text-ink-muted">
                粗略单方：<span className="font-semibold text-ink">{unitPrice.toLocaleString()} 元/㎡</span>
              </div>
            )}
          </div>

          <div className="border border-border bg-surface p-5">
            <h2 className="text-lg font-semibold text-ink">初筛看什么</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-muted">
              <li>看颗粒度，不只看总价。</li>
              <li>看边界，不只看优惠。</li>
              <li>看变更流程，不只看承诺。</li>
              <li>看付款节点，不让钱跑在工程前面。</li>
            </ul>
          </div>
        </aside>
      </section>

      {showResult && (
        <section className="border-t border-border bg-surface-warm">
          <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
            <div className="grid gap-6 lg:grid-cols-[0.35fr_0.65fr]">
              <div className="border border-border bg-canvas p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone">Result</p>
                <h2 className="mt-3 text-3xl font-semibold text-ink">{riskLevel}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{riskCopy}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" onClick={copyResultLink} className="inline-flex h-10 items-center bg-stone px-4 text-sm font-semibold text-white hover:bg-stone/90">
                    {copied ? '已复制' : '保存结果链接'}
                  </button>
                  <button type="button" onClick={copyQuestionList} className="inline-flex h-10 items-center border border-stone px-4 text-sm font-semibold text-stone hover:bg-stone-pale">
                    {copiedQuestions ? '已复制追问' : '复制追问清单'}
                  </button>
                  <Link href="/services#service-form" className="inline-flex h-10 items-center border border-border px-4 text-sm font-semibold text-ink hover:border-stone">
                    提交人工判断
                  </Link>
                </div>
              </div>

              <div className="grid gap-3">
                {riskItems.length === 0 ? (
                  <div className="border border-border bg-canvas p-5 text-sm leading-relaxed text-ink-muted">
                    关键边界都已经写清。下一步可以把报价内容放进合同、付款节点和验收节点里交叉检查。
                  </div>
                ) : riskItems.map((item) => (
                  <div key={item.key} className="border border-border bg-canvas p-5">
                    <h3 className="text-sm font-semibold text-ink">{item.label}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.risk}</p>
                    <p className="mt-3 border-l-2 border-stone-light pl-3 text-sm leading-relaxed text-stone">{item.question}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <Link href="/resources#baojia-shenhe-qingdan" className="border border-border bg-canvas p-5 hover:border-stone">
                <p className="text-sm font-semibold text-ink">领取报价审核清单</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">把追问内容整理成签约前检查表。</p>
              </Link>
              <Link href="/pricing/baojia-guide" className="border border-border bg-canvas p-5 hover:border-stone">
                <p className="text-sm font-semibold text-ink">看报价避坑指南</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">适合想自己系统看报价的人。</p>
              </Link>
              <Link href="/services/renovation#baojia-shenhe" className="border border-border bg-canvas p-5 hover:border-stone">
                <p className="text-sm font-semibold text-ink">找 Zeno 做人工审核</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">工具看不明白的地方，可以找我帮你判断。</p>
              </Link>
            </div>
          </div>
        </section>
      )}
      <ToolSeoAssetSection asset={toolSeoAssets.quoteCheck} />
    </main>
  )
}
