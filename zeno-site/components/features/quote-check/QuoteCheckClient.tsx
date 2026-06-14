'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import ToolSeoAssetSection from '@/components/features/tools/ToolSeoAssetSection'
import { toolSeoAssets } from '@/data/tools/toolSeoAssets'
import {
  getQuoteRiskRuleById,
  projectRiskLibrary,
  quoteCheckTemplates,
  quoteRiskDictionary,
  quoteRiskDimensions,
  quoteRiskRules,
} from '@/data/risk-control/quote-risk'
import type { QuoteRiskRule } from '@/data/risk-control/quote-risk-rules'

type QuoteStage = 'firstQuote' | 'comparing' | 'readyToSign' | 'alreadyStarted'

interface QuoteFormState {
  area: string
  total: string
  quoteText: string
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

type CheckItem = (typeof quoteRiskDimensions)[number] & {
  relatedRiskIds: string[]
}

type TextRiskSignal = {
  id: string
  title: string
  reason: string
  matchedTerms: string[]
  relatedRiskIds: string[]
}

const storageKey = 'zeno.quote-check.v2'

const defaultState: QuoteFormState = {
  area: '',
  total: '',
  quoteText: '',
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

const checkRelatedRiskIds: Record<CheckKey, string[]> = {
  hasItemizedQuote: ['qr-04', 'qr-06', 'qr-07'],
  hasMaterialBrand: ['qr-02', 'qr-16'],
  hasProcessDescription: ['qr-03', 'qr-17'],
  hasMeasurementRule: ['qr-05'],
  hasChangeOrderRule: ['qr-14'],
  hasAcceptanceStandard: ['qr-17', 'qr-19'],
  hasWarrantyScope: ['qr-19'],
  hasPaymentMilestone: ['qr-13'],
}

const checks: CheckItem[] = quoteRiskDimensions.map((item) => ({
  ...item,
  relatedRiskIds: checkRelatedRiskIds[item.key] ?? [],
}))

const textRiskRules: Array<{
  id: string
  title: string
  reason: string
  terms: string[]
  relatedRiskIds: string[]
}> = [
  {
    id: 'text-actual-settlement',
    title: '出现按实结算类表述',
    reason: '这类词通常意味着最终数量、范围或金额还没有锁定，签约前要问清单价、上限和确认流程。',
    terms: ['按实结算', '按实际结算', '实测实量', '按现场实际', '最终以现场为准'],
    relatedRiskIds: ['qr-01', 'qr-05', 'qr-14'],
  },
  {
    id: 'text-provisional-estimate',
    title: '出现暂估或另计类表述',
    reason: '暂估、另计、不含项目很容易成为后期增项入口，需要问清是否包含、怎么计价、谁确认。',
    terms: ['暂估', '暂定', '预估', '另计', '另行收费', '不含', '未含'],
    relatedRiskIds: ['qr-06', 'qr-07', 'qr-14'],
  },
  {
    id: 'text-material-vague',
    title: '材料描述可能不够具体',
    reason: '只写品牌、同档或环保材料，不写型号规格时，后期替换和验收容易扯皮。',
    terms: ['同等品牌', '同档品牌', '同档次', '环保材料', '优质材料', '品牌或同等'],
    relatedRiskIds: ['qr-02', 'qr-16', 'qr-17'],
  },
  {
    id: 'text-process-vague',
    title: '工艺描述可能过于笼统',
    reason: '常规工艺、标准施工这类表述不等于验收标准，签约前要问清具体做法和验收口径。',
    terms: ['标准工艺', '常规工艺', '规范施工', '国标施工', '按规范'],
    relatedRiskIds: ['qr-03', 'qr-17'],
  },
  {
    id: 'text-water-electric-open',
    title: '水电费用可能没有锁边界',
    reason: '水电最容易因为点位、米数和开槽方式变化超预算，要提前约定计量规则和增项确认。',
    terms: ['水电按实', '水电预收', '水电另计', '水电改造按实际', '强弱电按实际'],
    relatedRiskIds: ['qr-10', 'qr-05', 'qr-14'],
  },
  {
    id: 'text-payment-front-loaded',
    title: '付款可能过早',
    reason: '付款比例如果走在验收前面，后面要求整改和补充说明会更被动。',
    terms: ['签约付', '开工付', '预付款', '首付款', '进场付'],
    relatedRiskIds: ['qr-13'],
  },
  {
    id: 'text-change-order-missing',
    title: '增项确认流程需要重点追问',
    reason: '报价里出现变更、增项、现场确认时，要写清谁确认、何时确认、单价怎么定。',
    terms: ['变更', '增项', '现场确认', '现场签证', '工程签证'],
    relatedRiskIds: ['qr-14', 'qr-01'],
  },
]

const maxScore = checks.reduce((sum, item) => sum + item.weight, 0)
const quoteScanSteps = ['读取报价阶段', '核对边界字段', '标记文本信号', '生成追问清单']

function analyzeQuoteText(text: string): TextRiskSignal[] {
  const normalized = text.replace(/\s+/g, '')
  if (normalized.length < 12) return []

  const signals = textRiskRules
    .map((rule) => {
      const matchedTerms = rule.terms.filter((term) => normalized.includes(term))
      if (matchedTerms.length === 0) return null
      return {
        id: rule.id,
        title: rule.title,
        reason: rule.reason,
        matchedTerms,
        relatedRiskIds: rule.relatedRiskIds,
      }
    })
    .filter((item): item is TextRiskSignal => Boolean(item))

  const hasMaterialDetail = ['型号', '规格', '品牌', '系列'].some((term) => normalized.includes(term))
  if (!hasMaterialDetail) {
    signals.push({
      id: 'text-missing-material-detail',
      title: '未看到明确材料型号或规格',
      reason: '如果你粘贴的是完整报价，材料型号规格缺失需要重点追问；如果只是片段，可回到原报价核对。',
      matchedTerms: ['未见型号/规格'],
      relatedRiskIds: ['qr-02', 'qr-16'],
    })
  }

  const hasAcceptanceOrWarranty = ['验收', '质保', '保修'].some((term) => normalized.includes(term))
  if (!hasAcceptanceOrWarranty) {
    signals.push({
      id: 'text-missing-acceptance-warranty',
      title: '未看到验收或质保表述',
      reason: '报价和合同最终要能对齐验收标准、质保范围和售后责任。',
      matchedTerms: ['未见验收/质保'],
      relatedRiskIds: ['qr-17', 'qr-19'],
    })
  }

  return signals.slice(0, 8)
}

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
  if (score >= 8) return '这份报价不建议直接签。先把缺失边界补齐，再谈价格和优惠。'
  if (score >= 4) return '可以继续谈，但要先把这些追问问清楚。'
  return '报价结构相对清楚，下一步重点核对合同和付款节点。'
}

function getPrimaryNextStep(score: number, stage: QuoteStage) {
  if (stage === 'alreadyStarted') {
    return {
      label: '查看检查模板',
      href: '/checklists',
      desc: '已经开工或签约后，先用清单补齐变更、验收和付款记录。',
    }
  }
  if (score >= 8) {
    return {
      label: '查看人工复核服务',
      href: '/services',
      desc: '这份报价不建议直接签。先把缺失边界补齐，再谈价格和优惠。',
      reviewNote: '如果你已经准备签约，建议做一次报价 / 合同快审；如果方案也不确定，再看综合判断。',
    }
  }
  if (score >= 4) {
    return {
      label: '查看人工复核服务',
      href: '/services',
      desc: '可以继续谈，但要先把这些追问问清楚。',
      reviewNote: '如果你已经准备签约，可以考虑报价 / 合同快审。',
    }
  }
  return {
    label: '看合同签约前检查模板',
    href: '/checklists/contract-pre-signing-check',
    desc: '报价结构相对清楚，下一步重点核对合同和付款节点。',
  }
}

function getRelatedRiskRules(riskItems: CheckItem[]): QuoteRiskRule[] {
  const ids = Array.from(new Set(riskItems.flatMap((item) => item.relatedRiskIds)))
  return ids
    .map((id) => getQuoteRiskRuleById(id))
    .filter((item): item is QuoteRiskRule => Boolean(item))
}

export default function QuoteCheckClient() {
  const [form, setForm] = useState<QuoteFormState>(defaultState)
  const [fileName, setFileName] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
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
  const relatedRiskRules = useMemo(() => getRelatedRiskRules(riskItems), [riskItems])
  const textSignals = useMemo(() => analyzeQuoteText(form.quoteText), [form.quoteText])
  const textRelatedRiskRules = useMemo(() => {
    const ids = Array.from(new Set(textSignals.flatMap((item) => item.relatedRiskIds)))
    return ids
      .map((id) => getQuoteRiskRuleById(id))
      .filter((item): item is QuoteRiskRule => Boolean(item))
  }, [textSignals])

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
    setIsScanning(false)
    window.localStorage.removeItem(storageKey)
  }

  function generateResult() {
    setShowResult(false)
    setIsScanning(true)
    window.setTimeout(() => {
      setIsScanning(false)
      setShowResult(true)
    }, 900)
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
      textSignals.length > 0 ? `文本初扫：发现 ${textSignals.length} 个需要追问的报价表述` : '',
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
      <section className="relative overflow-hidden border-b border-border bg-canvas system-grid">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(244,241,232,0.96),rgba(244,241,232,0.78)),radial-gradient(circle_at_82%_16%,rgba(222,210,190,0.3),transparent_32%)]" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.62fr_0.38fr] lg:py-16">
          <div className="min-w-0">
            <p className="system-label">Quote Boundary Check</p>
            <h1 className="mt-4 max-w-[25rem] text-[2.35rem] font-semibold leading-tight tracking-tight text-ink sm:max-w-3xl sm:text-5xl">
              看报价能不能承接你的方案和生活目标。
            </h1>
            <p className="mt-5 max-w-[22rem] text-base leading-relaxed text-ink-muted sm:max-w-2xl sm:text-lg">
              报价不是单独看的。它应该能承接你的空间选择、材料工艺、预算边界、付款节点、验收标准和交付责任。这个工具先帮你把没写清的地方拆出来。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#quote-form" className="motion-press inline-flex h-11 items-center bg-stone px-5 text-sm font-semibold text-white hover:bg-stone/90">
                开始初筛
              </a>
              <Link href="/checklists" className="inline-flex h-11 items-center border border-border px-5 text-sm font-semibold text-ink transition-colors hover:border-stone">
                查看检查模板
              </Link>
            </div>
          </div>

          <div className="blueprint-panel p-5">
            <p className="system-label">结果会给你什么</p>
            <div className="mt-5 grid gap-3">
              {[
                ['风险等级', '低 / 中 / 高，不直接替你拍板'],
                ['3 个风险', '先看最可能影响签约的缺口'],
                ['3 个追问', '先问最影响签约判断的问题'],
                ['是否快审', '判断是否建议进入报价 / 合同快审或综合判断'],
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

            <label className="mt-5 block text-sm font-medium text-ink">
              粘贴报价文字（可选）
              <textarea
                value={form.quoteText}
                onChange={(event) => updateField('quoteText', event.target.value)}
                rows={7}
                placeholder={'可以粘贴报价里的重点行，例如：\n水电改造按实结算，材料同等品牌，防水按规范施工，最终以现场为准。'}
                className="mt-2 w-full resize-y border border-border bg-canvas px-3 py-2 text-sm leading-6 outline-none focus:border-stone"
              />
              <span className="mt-2 block text-xs leading-relaxed text-ink-muted">
                文本只在浏览器本地做关键词初扫，不上传服务器，也不替代人工审核。先帮你找出“按实结算、暂估、同档、现场为准”等需要追问的词。
              </span>
            </label>

            {textSignals.length > 0 && (
              <div className="mt-5 border border-stone/30 bg-stone/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone">文本初扫</p>
                <div className="mt-3 space-y-3">
                  {textSignals.slice(0, 3).map((signal) => (
                    <div key={signal.id} className="border border-border bg-surface p-3">
                      <p className="text-sm font-semibold text-ink">{signal.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-muted">{signal.reason}</p>
                      <p className="mt-2 text-xs text-stone">触发：{signal.matchedTerms.join(' / ')}</p>
                    </div>
                  ))}
                </div>
                {textSignals.length > 3 && (
                  <p className="mt-3 text-xs text-ink-faint">还有 {textSignals.length - 3} 个文本信号会在结果页展示。</p>
                )}
              </div>
            )}
          </div>

          <div className="border border-border bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">Step 3</p>
            <h2 className="mt-2 text-lg font-semibold text-ink">对照报价单，勾选已经写清的部分</h2>
            <div className="mt-5 space-y-3">
              {checks.map((item) => (
                <label key={item.key} className="motion-surface flex cursor-pointer items-start gap-3 border border-border bg-canvas p-3 hover:border-stone/60">
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
            <button type="button" onClick={generateResult} disabled={isScanning} className="motion-press inline-flex h-11 items-center bg-stone px-5 text-sm font-semibold text-white hover:bg-stone/90 disabled:cursor-not-allowed disabled:bg-stone/45">
              {isScanning ? '生成中...' : '生成初筛结果'}
            </button>
            <button type="button" onClick={reset} className="motion-press inline-flex h-11 items-center border border-border px-5 text-sm font-semibold text-ink hover:border-stone">
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
              你还没确定施工方，或者只是想先知道报价里哪里没写清。已经临近签约、材料很多、问题复杂，再考虑对应人工判断。
            </p>
          </div>
        </aside>
      </section>

      {isScanning && (
        <section className="border-y border-border bg-surface-warm system-grid">
          <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
            <div className="report-sheet decision-scan p-6">
              <p className="system-label">Scanning / Quote Boundary</p>
              <h2 className="mt-3 text-2xl font-semibold leading-tight text-ink">正在把报价拆成签约前追问。</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-4">
                {quoteScanSteps.map((step, index) => (
                  <div key={step} className="border border-border bg-canvas p-4">
                    <span className="text-xs font-semibold text-stone tabular-nums">0{index + 1}</span>
                    <p className="mt-2 text-sm font-semibold leading-6 text-ink">{step}</p>
                    <span className="mt-3 block h-1 overflow-hidden bg-stone-pale">
                      <span className="motion-line-grow block h-full bg-stone" style={{ animationDelay: `${index * 140}ms` }} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {showResult && (
        <section className="border-y border-border bg-surface-warm system-grid">
          <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
            <div className="grid gap-6 lg:grid-cols-[0.38fr_0.62fr]">
              <div className="report-sheet p-6">
                <p className="system-label">Quote Report / Summary</p>
                <h2 className="mt-3 text-4xl font-semibold tracking-tight text-ink">{riskLevel}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{riskCopy}</p>

                <div className="mt-6 grid gap-px bg-border sm:grid-cols-3 lg:grid-cols-1">
                  <div className="bg-surface p-4">
                    <p className="system-label text-ink-faint">签约阶段</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{getStageLabel(form.quoteStage)}</p>
                  </div>
                  <div className="bg-surface p-4">
                    <p className="system-label text-ink-faint">可能风险</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{Math.min(riskItems.length, 3)} 个重点风险</p>
                  </div>
                  <div className="bg-surface p-4">
                    <p className="system-label text-ink-faint">人工复核</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{riskScore >= 4 && form.quoteStage !== 'alreadyStarted' ? '建议准备签约前复核' : '可先自查合同和付款节点'}</p>
                  </div>
                </div>

                <div className="mt-6 border border-stone-light bg-stone-pale/45 p-4">
                  <p className="text-sm font-semibold text-ink">报告判断口径</p>
                  <p className="mt-2 text-xs leading-6 text-ink-muted">
                    这不是审价，也不承诺最低价。它只判断报价、合同和付款节点里哪些边界还没有承接你的空间选择和生活目标。
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" onClick={copyResultSummary} className="motion-press inline-flex h-10 items-center bg-stone px-4 text-sm font-semibold text-white hover:bg-stone/90">
                    {copied ? '已复制摘要' : '复制结果摘要'}
                  </button>
                  <button type="button" onClick={copyQuestionList} className="motion-press inline-flex h-10 items-center border border-stone px-4 text-sm font-semibold text-stone hover:bg-stone-pale">
                    {copiedQuestions ? '已复制追问' : '复制追问清单'}
                  </button>
                </div>
              </div>

              <div className="space-y-5">
                <div className="report-sheet p-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <p className="system-label">3 个风险 + 3 个追问</p>
                      <h3 className="mt-2 text-lg font-semibold text-ink">先看边界，再问问题，不要一上来只谈优惠。</h3>
                    </div>
                    <span className="w-fit bg-stone-pale px-3 py-1 text-xs font-semibold text-stone">{riskScore}/{maxScore} 风险分</span>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {topQuestions.length === 0 ? (
                      <div className="border border-border bg-surface p-5 text-sm leading-relaxed text-ink-muted">
                        关键边界已经相对清楚。下一步可以把报价内容放进合同、付款节点和验收节点里交叉检查。
                      </div>
                    ) : topQuestions.map((item, index) => (
                      <div key={item.key} className="border border-border bg-surface/92 p-5">
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

                {textSignals.length > 0 && (
                  <div className="border border-border bg-canvas p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-stone">报价文本初扫</p>
                    <h3 className="mt-2 text-lg font-semibold text-ink">这些表述在你粘贴的报价文字里出现过。</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                      这不是 AI 审价，只是把高频风险词先标出来。真正签约前，还要让对方把范围、单价、上限和确认流程写清楚。
                    </p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {textSignals.map((signal) => (
                        <div key={signal.id} className="border border-border bg-surface p-4">
                          <h4 className="text-sm font-semibold text-ink">{signal.title}</h4>
                          <p className="mt-2 text-xs leading-relaxed text-ink-muted">{signal.reason}</p>
                          <p className="mt-3 text-xs font-semibold text-stone">触发：{signal.matchedTerms.join(' / ')}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                  <Link href={primaryNextStep.href} className="group border border-stone bg-stone p-6 text-white transition-colors hover:bg-stone/90">
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/65">建议下一步</p>
                    <h3 className="mt-2 text-xl font-semibold">{primaryNextStep.label}</h3>
                    {'reviewNote' in primaryNextStep && primaryNextStep.reviewNote && (
                      <p className="mt-3 text-sm font-semibold leading-relaxed text-white">{primaryNextStep.reviewNote}</p>
                    )}
                    <p className="mt-3 text-sm leading-relaxed text-white/76">{primaryNextStep.desc}</p>
                    <span className="mt-5 inline-flex text-sm font-semibold">进入这一步 -&gt;</span>
                  </Link>

                  <div className="grid gap-3">
                    {[
                      { label: '查看报价 / 合同快审', href: '/services#quote-standard' },
                      { label: '查看居住方案综合判断', href: '/services#quote-deep' },
                      { label: '查看风险词典', href: '/risk-dictionary' },
                    ].map((item) => (
                      <Link key={item.href} href={item.href} className="flex items-center justify-between border border-border bg-canvas px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-stone">
                        {item.label}
                        <span className="text-stone">-&gt;</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {relatedRiskRules.length > 0 && (
                  <div className="border border-border bg-canvas p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-stone">相关风险词典</p>
                    <h3 className="mt-2 text-lg font-semibold text-ink">这些词条和你未勾选的风险有关。</h3>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {relatedRiskRules.map((rule) => (
                        <Link
                          key={rule.id}
                          href={`/risk-dictionary/${rule.slug}`}
                          className="group border border-border bg-surface p-4 transition-colors hover:border-stone"
                        >
                          <h4 className="text-sm font-semibold text-ink">{rule.name}</h4>
                          <p className="mt-2 text-xs leading-relaxed text-ink-muted">{rule.oneLine}</p>
                          <p className="mt-3 text-xs font-semibold text-stone">查看词条 -&gt;</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {textRelatedRiskRules.length > 0 && (
                  <div className="border border-border bg-canvas p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-stone">文本相关风险词条</p>
                    <h3 className="mt-2 text-lg font-semibold text-ink">这些词条和你粘贴的报价文字有关。</h3>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {textRelatedRiskRules.map((rule) => (
                        <Link
                          key={rule.id}
                          href={`/risk-dictionary/${rule.slug}`}
                          className="group border border-border bg-surface p-4 transition-colors hover:border-stone"
                        >
                          <h4 className="text-sm font-semibold text-ink">{rule.name}</h4>
                          <p className="mt-2 text-xs leading-relaxed text-ink-muted">{rule.oneLine}</p>
                          <p className="mt-3 text-xs font-semibold text-stone">查看词条 -&gt;</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid gap-5 border border-border bg-surface p-6 sm:p-8 lg:grid-cols-[0.34fr_0.66fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">服务路径</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">看不明白时，再进入对应人工判断。</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['免费', '报价初筛', '先知道边界哪里没写清'],
              ['免费', '报价风险初查', '3 个高风险点 + 5 个追问问题'],
              ['免费', '报价 / 合同快审', '报价、合同、付款节点一起看'],
              ['免费', '居住方案综合判断', '方案、预算、报价、合同和交付一起看'],
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

      {/* ── 样张预览 ── */}
      <section className="border-t border-border bg-canvas">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">人工服务你会拿到什么</p>
          <h2 className="mt-3 text-xl font-semibold text-ink">以下是脱敏样张，实际基于你的报价、合同或方案材料生成。</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { src: '/images/services/sample-risk-report.svg', label: '判断报告' },
              { src: '/images/services/sample-followup-checklist.svg', label: '追问清单' },
              { src: '/images/services/sample-communication-script.svg', label: '话术示例' },
            ].map((item) => (
              <div key={item.label} className="overflow-hidden border border-border bg-surface">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.src}
                    alt={`${item.label}脱敏样张`}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <p className="p-3 text-xs font-semibold text-stone">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/services" className="text-sm font-semibold text-stone hover:underline underline-offset-2">
              查看服务 →
            </Link>
          </div>
        </div>
      </section>

      <section id="risk-library" className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.36fr_0.64fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone">结构化资产</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">风险词典、规则和项目库，会持续沉淀。</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                这部分不是装修百科，而是给报价、合同和交付边界判断用的数据资产。人能看懂，未来 AI 工具和搜索引擎也能读取。
              </p>
            </div>

            <div className="grid gap-5">
              <article className="border border-border bg-canvas p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone">风险词典</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {quoteRiskDictionary.slice(0, 9).map((item) => (
                    <div key={item.term} className="border border-border bg-surface p-4">
                      <h3 className="text-sm font-semibold text-ink">{item.term}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-ink-muted">{item.plain}</p>
                      <p className="mt-2 text-xs leading-relaxed text-ink-faint">{item.whatToLookFor}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="border border-border bg-canvas p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone">风险规则库</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {quoteRiskRules.map((rule) => (
                    <div key={rule.title} className="border border-border bg-surface p-4">
                      <h3 className="text-sm font-semibold text-ink">{rule.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-ink-muted">触发：{rule.trigger}</p>
                      <p className="mt-2 text-xs leading-relaxed text-ink-muted">原因：{rule.why}</p>
                      <p className="mt-2 text-xs leading-relaxed text-stone">追问：{rule.ask}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="border border-border bg-canvas p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone">检查模板</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {quoteCheckTemplates.map((template) => (
                    <div key={template.title} className="border border-border bg-surface p-4">
                      <h3 className="text-sm font-semibold text-ink">{template.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-ink-muted">{template.use}</p>
                      <p className="mt-2 text-xs leading-relaxed text-ink-faint">输出：{template.output}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="border border-border bg-canvas p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone">施工项目风险库</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {projectRiskLibrary.map((item) => (
                    <div key={item.project} className="border border-border bg-surface p-4">
                      <h3 className="text-sm font-semibold text-ink">{item.project}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-ink-muted">{item.commonRisk}</p>
                      <ul className="mt-3 space-y-1">
                        {item.mustAsk.map((ask) => (
                          <li key={ask} className="text-xs leading-relaxed text-stone">- {ask}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <ToolSeoAssetSection asset={toolSeoAssets.quoteCheck} />
    </main>
  )
}
