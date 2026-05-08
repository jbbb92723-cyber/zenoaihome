'use client'

import { useMemo, useState } from 'react'
import { BridgePanel, NumberInput, ResultPanel, ToolPageShell } from '@/components/tools/ToolPageShell'

const plans = {
  balanced: { label: '均衡型', hard: 0.32, materials: 0.22, custom: 0.18, equipment: 0.12, soft: 0.08, buffer: 0.08 },
  living: { label: '实住优先', hard: 0.30, materials: 0.18, custom: 0.22, equipment: 0.14, soft: 0.06, buffer: 0.10 },
  control: { label: '控预算', hard: 0.34, materials: 0.20, custom: 0.14, equipment: 0.10, soft: 0.07, buffer: 0.15 },
}

const bucketLabels = [
  ['hard', '基础硬装', '拆改、水电、泥木、油漆等，不建议压到过低。'],
  ['materials', '主材', '瓷砖、地板、门、洁具等，最容易被风格带偏。'],
  ['custom', '定制与收纳', '柜子、收纳系统，真实居住体验的关键。'],
  ['equipment', '设备电器', '空调、新风、热水、厨电等，先分清刚需和改善。'],
  ['soft', '软装家具', '窗帘、灯具、家具和后期可调整部分。'],
  ['buffer', '缓冲金', '留给增项、临时变更和未写清费用。'],
] as const

export default function BudgetStructureClient() {
  const [total, setTotal] = useState('180000')
  const [area, setArea] = useState('108')
  const [mode, setMode] = useState<keyof typeof plans>('balanced')
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    const totalValue = Number(total) || 0
    const areaValue = Number(area) || 0
    const plan = plans[mode]
    return {
      unit: areaValue > 0 ? Math.round(totalValue / areaValue) : 0,
      buckets: bucketLabels.map(([key, label, desc]) => ({ key, label, desc, amount: Math.round(totalValue * plan[key]) })),
    }
  }, [total, area, mode])

  async function copyResult() {
    const text = result.buckets.map((item) => `${item.label}：约 ${item.amount.toLocaleString()} 元`).join('\n')
    await navigator.clipboard.writeText(`装修预算结构（${plans[mode].label}）\n总预算：${Number(total || 0).toLocaleString()} 元\n单方：${result.unit.toLocaleString()} 元/㎡\n${text}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <ToolPageShell
      label="Budget Structure"
      title="预算不是一个总数，是一套取舍顺序。"
      subtitle="输入总预算和面积，先把钱拆成基础硬装、主材、定制、设备、软装和缓冲。普通业主先看结构，不要一上来追材料清单。"
      bestFor="预算有上限，但越算越乱的人"
      time="5-8 分钟"
      prepare={["总预算", "房屋面积", "装修倾向"]}
    >
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.55fr_0.45fr]">
        <div className="space-y-5">
          <div className="border border-border bg-surface p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberInput label="总预算" unit="元" value={total} onChange={setTotal} placeholder="180000" />
              <NumberInput label="房屋面积" unit="㎡" value={area} onChange={setArea} placeholder="108" />
            </div>
            <div className="mt-5">
              <p className="mb-3 text-sm font-semibold text-ink">你现在更接近哪一种装修取向</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {Object.entries(plans).map(([key, plan]) => (
                  <button key={key} type="button" onClick={() => setMode(key as keyof typeof plans)} className={`border px-4 py-3 text-left text-sm transition-colors ${mode === key ? 'border-stone bg-stone/5 text-ink' : 'border-border bg-canvas text-ink-muted hover:border-stone/50'}`}>
                    {plan.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <ResultPanel title={`${plans[mode].label}预算结构`} actions={<button type="button" onClick={copyResult} className="inline-flex h-10 items-center bg-stone px-4 text-sm font-semibold text-white hover:bg-stone/90">{copied ? '已复制' : '复制预算结构'}</button>}>
            <p>粗略单方：<span className="font-semibold text-ink">{result.unit.toLocaleString()} 元/㎡</span>。这个数字只用于结构判断，不代表市场报价标准。</p>
          </ResultPanel>
        </div>

        <div className="space-y-3">
          {result.buckets.map((item) => {
            const percent = Number(total) ? Math.round((item.amount / Number(total)) * 100) : 0
            return (
              <div key={item.key} className="border border-border bg-surface p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-ink">{item.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-muted">{item.desc}</p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-stone">{item.amount.toLocaleString()} 元</p>
                </div>
                <div className="mt-3 h-1.5 bg-stone-pale"><div className="h-full bg-stone" style={{ width: `${percent}%` }} /></div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-12 sm:px-8">
        <BridgePanel items={[
          { label: '拿装修预算模板', href: '/resources#zhuangxiu-yusuan-moban', desc: '把这套结构填进表格，继续追踪版本。' },
          { label: '做预算风险自测', href: '/tools/budget-risk', desc: '如果结构看懂了，再判断风险来自哪里。' },
          { label: '预算结构诊断', href: '/services/renovation#yusuan-zixun', desc: '预算越算越乱时，再进入人工判断。' },
        ]} />
      </section>
    </ToolPageShell>
  )
}
