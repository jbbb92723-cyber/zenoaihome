'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Check,
  Compass,
  HouseLine,
  Notebook,
  ShieldCheck,
  WarningCircle,
} from '@phosphor-icons/react'
import { livingDiagnosisQuestions } from '@/data/living-diagnosis'
import type { LivingDiagnosisResult } from '@/lib/living-diagnosis'

type FormState = {
  city: string
  homeType: string
  area: string
  budgetRange: string
  contactName: string
  contactWechat: string
  contactEmail: string
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error'

const emptyForm: FormState = {
  city: '',
  homeType: '',
  area: '',
  budgetRange: '',
  contactName: '',
  contactWechat: '',
  contactEmail: '',
}

const homeTypeOptions = ['新房毛坯', '二手房翻新', '精装房改造', '局部更新', '还没确定']
const budgetOptions = ['20 万以内', '20-40 万', '40-80 万', '80 万以上', '还没拆预算']

function getRiskLabel(level: LivingDiagnosisResult['riskLevel']) {
  if (level === 'high') return '高优先级'
  if (level === 'medium') return '中优先级'
  return '低优先级'
}

export default function LivingDiagnosisClient() {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<LivingDiagnosisResult | null>(null)
  const [diagnosisId, setDiagnosisId] = useState('')
  const [persisted, setPersisted] = useState<boolean | null>(null)
  const [status, setStatus] = useState<SubmitState>('idle')
  const [error, setError] = useState('')

  const answeredCount = Object.keys(answers).length
  const isComplete = answeredCount === livingDiagnosisQuestions.length
  const progress = Math.round((answeredCount / livingDiagnosisQuestions.length) * 100)
  const selectedStage = answers['current-stage'] ?? ''

  const previewItems = useMemo(() => {
    const selectedLabels = livingDiagnosisQuestions
      .map((question) => {
        const value = answers[question.id]
        const option = question.options.find((item) => item.value === value)
        return option ? { title: question.title, label: option.label } : null
      })
      .filter((item): item is { title: string; label: string } => Boolean(item))

    return selectedLabels.slice(-3)
  }, [answers])

  function updateForm(key: keyof FormState, value: string) {
    setForm((previous) => ({ ...previous, [key]: value }))
    setResult(null)
    setDiagnosisId('')
    setPersisted(null)
    setStatus('idle')
    setError('')
  }

  function updateAnswer(questionId: string, value: string) {
    setAnswers((previous) => ({ ...previous, [questionId]: value }))
    setResult(null)
    setDiagnosisId('')
    setPersisted(null)
    setStatus('idle')
    setError('')
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isComplete) {
      setError('请先完成所有判断问题。')
      return
    }

    setStatus('loading')
    setError('')

    try {
      const response = await fetch('/api/living-diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          stage: selectedStage,
          answers: livingDiagnosisQuestions.map((question) => ({
            questionId: question.id,
            value: answers[question.id],
          })),
        }),
      })

      if (!response.ok) {
        setStatus('error')
        setError('提交失败，请检查信息后稍后再试。')
        return
      }

      const data = await response.json() as {
        diagnosisId?: string
        persisted?: boolean
        result?: LivingDiagnosisResult
      }

      if (!data.result) {
        setStatus('error')
        setError('系统没有返回诊断结果，请稍后再试。')
        return
      }

      setResult(data.result)
      setDiagnosisId(data.diagnosisId ?? '')
      setPersisted(data.persisted ?? null)
      setStatus('success')
    } catch {
      setStatus('error')
      setError('网络异常，请稍后再试。')
    }
  }

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <section className="border-b border-border bg-surface-warm">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.58fr_0.42fr] lg:px-12 lg:py-20">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone">AI Living Diagnosis</p>
            <h1 className="mt-4 max-w-[24rem] text-[2.35rem] font-semibold leading-tight tracking-tight text-ink sm:max-w-4xl sm:text-6xl">
              装修前，先看清你真正想怎样生活。
            </h1>
            <p className="mt-6 max-w-[42rem] text-base leading-8 text-ink-muted sm:text-lg">
              这不是风格测试，而是把生活方式、空间秩序、审美偏好、预算取舍和签约风险放在一起看。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#diagnosis-form" className="inline-flex min-h-11 items-center gap-2 bg-stone px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone/90">
                开始诊断
                <ArrowRight size={16} aria-hidden />
              </a>
              <Link href="/tools/quote-check" className="inline-flex min-h-11 items-center border border-border bg-surface px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-stone">
                已有报价，先看风险
              </Link>
            </div>
          </div>

          <div className="border border-border bg-surface p-5 sm:p-6">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone">判断口径</p>
                <h2 className="mt-3 text-xl font-semibold leading-snug text-ink">不是给你一个风格标签，而是先分清下一步该处理什么。</h2>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-border bg-canvas text-stone">
                <Compass size={26} weight="duotone" aria-hidden />
              </span>
            </div>
            <div className="mt-6 grid gap-px bg-border sm:grid-cols-2">
              {[
                ['生活方式', '家要支持什么样的一天'],
                ['空间秩序', '动线、收纳、家务如何少摩擦'],
                ['审美偏好', '灵感图背后的长期偏好'],
                ['签约风险', '现在是否该先看报价合同'],
              ].map(([title, desc]) => (
                <div key={title} className="bg-canvas p-4">
                  <p className="text-sm font-semibold text-ink">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-ink-muted">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <form id="diagnosis-form" onSubmit={submit} className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.26fr_0.48fr_0.26fr] lg:px-12">
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <section className="border border-border bg-surface p-5">
            <HouseLine size={30} weight="duotone" className="text-stone" aria-hidden />
            <h2 className="mt-4 text-lg font-semibold text-ink">先收集生活现场</h2>
            <p className="mt-2 text-sm leading-7 text-ink-muted">
              城市、面积、预算只是背景。真正要看的，是你现在的生活矛盾和空间优先级。
            </p>
          </section>
          <section className="border border-border bg-surface p-5">
            <Notebook size={30} weight="duotone" className="text-stone" aria-hidden />
            <h2 className="mt-4 text-lg font-semibold text-ink">诊断边界</h2>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-ink-muted">
              <li>不替你定最终风格。</li>
              <li>不输出施工图和报价。</li>
              <li>不判断哪家公司一定靠谱。</li>
              <li>只帮你先看清决策顺序。</li>
            </ul>
          </section>
        </aside>

        <div className="space-y-6">
          <section className="border border-border bg-surface p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone">Step 1</p>
            <h2 className="mt-2 text-xl font-semibold text-ink">基础信息</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-ink">
                城市
                <input
                  value={form.city}
                  onChange={(event) => updateForm('city', event.target.value)}
                  className="mt-2 w-full border border-border bg-canvas px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-ink-faint focus:border-stone"
                  placeholder="例如：上海"
                />
              </label>
              <label className="text-sm font-medium text-ink">
                面积
                <input
                  value={form.area}
                  onChange={(event) => updateForm('area', event.target.value)}
                  className="mt-2 w-full border border-border bg-canvas px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-ink-faint focus:border-stone"
                  placeholder="例如：105 平"
                />
              </label>
              <label className="text-sm font-medium text-ink">
                房屋类型
                <select
                  value={form.homeType}
                  onChange={(event) => updateForm('homeType', event.target.value)}
                  className="mt-2 w-full border border-border bg-canvas px-3 py-2.5 text-sm outline-none transition-colors focus:border-stone"
                >
                  <option value="">请选择</option>
                  {homeTypeOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium text-ink">
                预算范围
                <select
                  value={form.budgetRange}
                  onChange={(event) => updateForm('budgetRange', event.target.value)}
                  className="mt-2 w-full border border-border bg-canvas px-3 py-2.5 text-sm outline-none transition-colors focus:border-stone"
                >
                  <option value="">请选择</option>
                  {budgetOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
            </div>
          </section>

          <section className="space-y-5">
            {livingDiagnosisQuestions.map((question, index) => (
              <div key={question.id} className="border border-border bg-surface p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone">Step {index + 2}</p>
                <h2 className="mt-2 text-lg font-semibold leading-snug text-ink">{question.title}</h2>
                <p className="mt-2 text-sm leading-7 text-ink-muted">{question.helper}</p>
                <div className="mt-5 grid gap-3">
                  {question.options.map((option) => {
                    const isActive = answers[question.id] === option.value
                    return (
                      <label
                        key={option.value}
                        className={`group flex cursor-pointer items-start gap-3 border p-4 transition-all duration-150 ${
                          isActive
                            ? 'border-stone bg-stone-pale shadow-[0_12px_30px_rgba(42,39,35,0.06)]'
                            : 'border-border bg-canvas hover:-translate-y-px hover:border-stone/60 hover:bg-surface-warm'
                        }`}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option.value}
                          checked={isActive}
                          onChange={() => updateAnswer(question.id, option.value)}
                          className="sr-only"
                        />
                        <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border ${isActive ? 'border-stone bg-stone text-white' : 'border-border bg-surface text-transparent'}`}>
                          <Check size={13} weight="bold" aria-hidden />
                        </span>
                        <span className="text-sm font-medium leading-6 text-ink">{option.label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            ))}
          </section>

          <section className="border border-border bg-surface p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone">Optional</p>
            <h2 className="mt-2 text-xl font-semibold text-ink">需要人工整理报告时再留下联系方式</h2>
            <p className="mt-2 text-sm leading-7 text-ink-muted">免费诊断不强制留资。想继续拿《居住需求洞察报告 Beta》时，填写微信或邮箱即可。</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <label className="text-sm font-medium text-ink">
                称呼
                <input
                  value={form.contactName}
                  onChange={(event) => updateForm('contactName', event.target.value)}
                  className="mt-2 w-full border border-border bg-canvas px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-ink-faint focus:border-stone"
                  placeholder="可选"
                />
              </label>
              <label className="text-sm font-medium text-ink">
                微信
                <input
                  value={form.contactWechat}
                  onChange={(event) => updateForm('contactWechat', event.target.value)}
                  className="mt-2 w-full border border-border bg-canvas px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-ink-faint focus:border-stone"
                  placeholder="可选"
                />
              </label>
              <label className="text-sm font-medium text-ink">
                邮箱
                <input
                  value={form.contactEmail}
                  onChange={(event) => updateForm('contactEmail', event.target.value)}
                  className="mt-2 w-full border border-border bg-canvas px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-ink-faint focus:border-stone"
                  placeholder="可选"
                />
              </label>
            </div>
          </section>

          {error && (
            <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 border border-border bg-surface-warm p-5">
            <button
              type="submit"
              disabled={!isComplete || status === 'loading'}
              className={`inline-flex min-h-11 items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors ${
                isComplete && status !== 'loading'
                  ? 'bg-stone text-white hover:bg-stone/90'
                  : 'cursor-not-allowed bg-stone/35 text-white'
              }`}
            >
              {status === 'loading' ? '生成中...' : '生成居住判断'}
              <ArrowRight size={16} aria-hidden />
            </button>
            <p className="text-xs leading-6 text-ink-muted">当前完成 {answeredCount} / {livingDiagnosisQuestions.length}。生成后优先展示判断结果；如成功生成记录编号，后续人工复核会更顺手。</p>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <section className="border border-border bg-surface p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone">Progress</p>
                <p className="mt-1 text-sm font-semibold text-ink">已完成 {answeredCount} / {livingDiagnosisQuestions.length}</p>
              </div>
              <span className="text-2xl font-semibold text-stone">{progress}%</span>
            </div>
            <div className="mt-4 h-1.5 bg-stone-pale">
              <div className="h-full bg-stone transition-all duration-200" style={{ width: `${progress}%` }} />
            </div>
            {previewItems.length > 0 && (
              <div className="mt-5 space-y-3">
                {previewItems.map((item) => (
                  <div key={item.title} className="border border-border bg-canvas p-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ink-faint">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-ink">{item.label}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {result ? (
            <section className="border border-stone bg-surface p-5 shadow-[0_18px_56px_rgba(67,45,26,0.09)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone">Result</p>
                  <h2 className="mt-2 text-2xl font-semibold text-ink">{result.primaryType}</h2>
                </div>
                <span className="border border-border bg-canvas px-3 py-1 text-xs font-semibold text-stone">
                  {getRiskLabel(result.riskLevel)}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-ink-muted">{result.summary}</p>
              <div className="mt-5 grid gap-px bg-border">
                <div className="bg-canvas p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">判断分</p>
                  <p className="mt-1 text-xl font-semibold text-ink">{result.totalScore}</p>
                </div>
                <div className="bg-canvas p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">优先级</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.priorities.map((item) => (
                      <span key={item} className="border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-stone">{item}</span>
                    ))}
                  </div>
                </div>
              </div>
              {diagnosisId && <p className="mt-4 text-xs leading-6 text-ink-faint">诊断记录：{diagnosisId}</p>}
              {persisted === false && (
                <p className="mt-4 border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-6 text-amber-800">
                  本次判断已生成，但暂未生成记录编号。需要人工复核时，请稍后重新提交或从服务页继续联系。
                </p>
              )}
              <div className="mt-5 grid gap-3">
                {result.nextSteps.map((item, index) => (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className={index === 0
                      ? 'group flex items-center justify-between gap-3 bg-stone px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone/90'
                      : 'group flex items-center justify-between gap-3 border border-border bg-canvas px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-stone'
                    }
                  >
                    {item.label}
                    <ArrowRight size={16} className="shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
                  </Link>
                ))}
              </div>
            </section>
          ) : (
            <section className="border border-border bg-surface-warm p-5">
              <ShieldCheck size={30} weight="duotone" className="text-stone" aria-hidden />
              <h2 className="mt-4 text-lg font-semibold text-ink">结果会分两条主路径</h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-ink-muted">
                <p>还没想清怎么住：先做居住需求洞察，别急着谈风格和报价。</p>
                <p>已经临近报价签约：把需求、预算和报价合同边界放在一起看。</p>
              </div>
            </section>
          )}

          {status === 'error' && (
            <section className="border border-red-200 bg-red-50 p-5 text-sm leading-7 text-red-700">
              <WarningCircle size={22} weight="duotone" className="mb-2" aria-hidden />
              {error || '提交失败，请稍后再试。'}
            </section>
          )}
        </aside>
      </form>
    </main>
  )
}
