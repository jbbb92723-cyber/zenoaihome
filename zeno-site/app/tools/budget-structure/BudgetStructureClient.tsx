'use client'

import { useMemo, useState } from 'react'
import ToolSeoAssetSection from '@/components/tools/ToolSeoAssetSection'
import { BridgePanel, NumberInput, ResultPanel, ToolPageShell } from '@/components/tools/ToolPageShell'
import { toolSeoAssets } from '@/data/toolSeoAssets'

type BudgetBucketKey = 'hard' | 'materials' | 'custom' | 'equipment' | 'soft' | 'buffer'

type BudgetPlan = {
  label: string
  unitRange: readonly [number, number]
  summary: string
} & Record<BudgetBucketKey, number>

const plans = {
  simple: {
    label: '简约够住',
    unitRange: [1200, 1800],
    summary: '预算紧时，先保基础施工和机动钱，少做造型，软装慢慢补。',
    hard: 0.36,
    materials: 0.22,
    custom: 0.14,
    equipment: 0.08,
    soft: 0.08,
    buffer: 0.12,
  },
  comfortable: {
    label: '舒适耐用',
    unitRange: [1800, 2600],
    summary: '大多数自住家庭更稳的选择，基础、收纳、设备和软装都留一点。',
    hard: 0.30,
    materials: 0.20,
    custom: 0.20,
    equipment: 0.13,
    soft: 0.09,
    buffer: 0.08,
  },
  refined: {
    label: '精致改善',
    unitRange: [2600, 3800],
    summary: '预算更宽时，把钱放到定制、设备、材质和软装质感上。',
    hard: 0.26,
    materials: 0.22,
    custom: 0.20,
    equipment: 0.15,
    soft: 0.11,
    buffer: 0.06,
  },
} satisfies Record<string, BudgetPlan>

const bucketLabels = [
  ['hard', '基础施工', '水电、防水、墙地面这些做错很难改，别先砍这里。'],
  ['materials', '主材选择', '瓷砖、地板、门、洁具。够用、好打理，比一味追贵更重要。'],
  ['custom', '柜子收纳', '橱柜、衣柜和收纳系统。实住体验很靠它，但别盲目全屋打满。'],
  ['equipment', '设备电器', '空调、热水、厨电、新风净水等。先分刚需，再谈升级。'],
  ['soft', '家具软装', '沙发、床、灯、窗帘、装饰。可以分批买，别一开始把钱花光。'],
  ['buffer', '预留机动', '留给漏项、增项、临时变更。预算越紧越要留。'],
] as const

function formatMoney(value: number) {
  return Math.round(value).toLocaleString()
}

function getUnitStatus(unit: number, range: readonly [number, number]) {
  if (!unit) return { label: '待输入', copy: '先填总预算和面积，再看它落在哪个区间。' }
  if (unit < range[0]) {
    return {
      label: '偏紧',
      copy: '低于这个取向的参考区间。不要硬挤所有项目，先删可选项，守住基础施工和机动钱。',
    }
  }
  if (unit > range[1]) {
    return {
      label: '空间更足',
      copy: '高于这个取向的参考区间。预算空间更大，但也要防止项目越加越散。',
    }
  }
  return {
    label: '大致匹配',
    copy: '这个单方和当前取向大致匹配。下一步重点看每一类钱有没有被挤压。',
  }
}

export default function BudgetStructureClient() {
  const [total, setTotal] = useState('220000')
  const [area, setArea] = useState('108')
  const [mode, setMode] = useState<keyof typeof plans>('comfortable')
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    const totalValue = Number(total) || 0
    const areaValue = Number(area) || 0
    const plan = plans[mode]
    const unit = areaValue > 0 ? Math.round(totalValue / areaValue) : 0
    const suggestedTotalRange = [
      areaValue > 0 ? Math.round(areaValue * plan.unitRange[0]) : 0,
      areaValue > 0 ? Math.round(areaValue * plan.unitRange[1]) : 0,
    ] as const
    return {
      unit,
      unitStatus: getUnitStatus(unit, plan.unitRange),
      suggestedTotalRange,
      buckets: bucketLabels.map(([key, label, desc]) => ({
        key,
        label,
        desc,
        amount: Math.round(totalValue * plan[key]),
        percent: Math.round(plan[key] * 100),
      })),
    }
  }, [total, area, mode])

  async function copyResult() {
    const plan = plans[mode]
    const text = result.buckets.map((item) => `${item.label}：约 ${item.amount.toLocaleString()} 元（${item.percent}%）`).join('\n')
    await navigator.clipboard.writeText(`装修预算分配（${plan.label}）\n总预算：${Number(total || 0).toLocaleString()} 元\n当前单方：${result.unit.toLocaleString()} 元/㎡\n参考单方：${plan.unitRange[0].toLocaleString()}-${plan.unitRange[1].toLocaleString()} 元/㎡\n参考总预算：${formatMoney(result.suggestedTotalRange[0])}-${formatMoney(result.suggestedTotalRange[1])} 元\n${text}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <ToolPageShell
      label="Budget Split"
      title="把总预算拆成业主能看懂的几份钱"
      subtitle="先选你更接近简约、舒适还是精致，再输入总预算和面积。这个工具不判断报价贵不贵，只帮你看钱是不是分得清、留得住。"
      bestFor="已经有总预算，但不知道钱该怎么分的人"
      time="5-8 分钟"
      prepare={["总预算", "房屋面积", "装修取向"]}
    >
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.55fr_0.45fr]">
        <div className="space-y-5">
          <div className="border border-border bg-surface p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberInput label="总预算" unit="元" value={total} onChange={setTotal} placeholder="180000" />
              <NumberInput label="房屋面积" unit="㎡" value={area} onChange={setArea} placeholder="108" />
            </div>
            <div className="mt-5">
              <p className="mb-3 text-sm font-semibold text-ink">你想把家做到哪种程度</p>
              <div className="grid gap-3">
                {Object.entries(plans).map(([key, plan]) => (
                  <button key={key} type="button" onClick={() => setMode(key as keyof typeof plans)} className={`border px-4 py-3 text-left transition-colors ${mode === key ? 'border-stone bg-stone/5 text-ink' : 'border-border bg-canvas text-ink-muted hover:border-stone/50'}`}>
                    <span className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold">{plan.label}</span>
                      <span className="text-xs text-stone">{plan.unitRange[0].toLocaleString()}-{plan.unitRange[1].toLocaleString()} 元/㎡</span>
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-ink-muted">{plan.summary}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <ResultPanel title={`${plans[mode].label}预算分配`} actions={<button type="button" onClick={copyResult} className="inline-flex h-10 items-center bg-stone px-4 text-sm font-semibold text-white hover:bg-stone/90">{copied ? '已复制' : '复制预算分配'}</button>}>
            <div className="space-y-3">
              <p>
                当前单方：<span className="font-semibold text-ink">{result.unit.toLocaleString()} 元/㎡</span>。
                {plans[mode].label}参考：<span className="font-semibold text-ink">{plans[mode].unitRange[0].toLocaleString()}-{plans[mode].unitRange[1].toLocaleString()} 元/㎡</span>。
              </p>
              <p>
                按 {Number(area || 0).toLocaleString()}㎡ 粗算，这个取向的参考总预算约
                <span className="font-semibold text-ink"> {formatMoney(result.suggestedTotalRange[0])}-{formatMoney(result.suggestedTotalRange[1])} 元</span>。
              </p>
              <div className="border border-border bg-surface px-4 py-3">
                <p className="text-xs font-semibold text-stone">{result.unitStatus.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">{result.unitStatus.copy}</p>
              </div>
              <p className="text-xs text-ink-faint">参考区间是站内初筛用的粗口径，不代表你所在城市的最终报价。真正签约前仍要回到报价单和项目范围。</p>
            </div>
          </ResultPanel>
        </div>

        <div className="space-y-3">
          {result.buckets.map((item) => {
            return (
              <div key={item.key} className="border border-border bg-surface p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-ink">{item.label} <span className="text-xs font-normal text-stone">{item.percent}%</span></p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-muted">{item.desc}</p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-stone">{item.amount.toLocaleString()} 元</p>
                </div>
                <div className="mt-3 h-1.5 bg-stone-pale"><div className="h-full bg-stone" style={{ width: `${item.percent}%` }} /></div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-12 sm:px-8">
        <BridgePanel items={[
          { label: '拿装修预算模板', href: '/resources#zhuangxiu-yusuan-moban', desc: '把这套结构填进表格，继续追踪版本。' },
          { label: '查超预算原因', href: '/tools/budget-risk', desc: '如果你还是怕失控，再判断问题来自报价、流程还是需求。' },
          { label: '标准版报价风险快审', href: '/services/renovation#quote-standard', desc: '预算越算越乱时，先回到完整报价做人工判断。' },
        ]} />
      </section>
      <ToolSeoAssetSection asset={toolSeoAssets.budgetStructure} />
    </ToolPageShell>
  )
}
