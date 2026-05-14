'use client'

import { useMemo, useState } from 'react'
import ToolSeoAssetSection from '@/components/tools/ToolSeoAssetSection'
import { BridgePanel, NumberInput, ResultPanel, ToolPageShell } from '@/components/tools/ToolPageShell'
import { toolSeoAssets } from '@/data/toolSeoAssets'

const modes = {
  area: { label: '面积换算', unit: '㎡', hint: '常用于墙面、地面、瓷砖、乳胶漆。' },
  length: { label: '长度换算', unit: 'm', hint: '常用于踢脚线、柜体、灯带、线管。' },
  price: { label: '单方换算', unit: '元', hint: '用总价和面积粗看预算压力。' },
}

const examples: Record<keyof typeof modes, Array<{ label: string; value: string; area?: string }>> = {
  area: [
    { label: '80 ㎡', value: '80' },
    { label: '100 ㎡', value: '100' },
    { label: '120 ㎡', value: '120' },
  ],
  length: [
    { label: '2.4 m', value: '2.4' },
    { label: '3 m', value: '3' },
    { label: '5.8 m', value: '5.8' },
  ],
  price: [
    { label: '10 万 / 100㎡', value: '100000', area: '100' },
    { label: '18 万 / 120㎡', value: '180000', area: '120' },
    { label: '25 万 / 140㎡', value: '250000', area: '140' },
  ],
}

function toPositiveNumber(value: string) {
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? number : 0
}

export default function UnitConverterClient() {
  const [mode, setMode] = useState<keyof typeof modes>('area')
  const [value, setValue] = useState('100')
  const [area, setArea] = useState('100')
  const number = toPositiveNumber(value)
  const areaNumber = toPositiveNumber(area)

  const result = useMemo(() => {
    if (!number) return ['先输入一个大于 0 的数字。', '这个工具只做口径换算，不直接判断贵不贵。']
    if (mode === 'area') return [`${number} ㎡ = ${(number * 10.7639).toFixed(1)} ft²`, `${number} ㎡ ≈ ${(number / 3.3058).toFixed(1)} 坪`, '房屋面积、铺贴面积和墙面面积不是同一个数，报价里要问清楚口径。']
    if (mode === 'length') return [`${number} m = ${(number * 100).toFixed(0)} cm`, `${number} m = ${(number * 1000).toFixed(0)} mm`, '延米常见于柜体、台面、踢脚线，不能直接和平方米单价比较。']
    if (!areaNumber) return ['做单方换算时，还需要填写房屋面积。', '单方只是粗看预算压力，不能替代报价审核。']
    return [`总价 ${number.toLocaleString()} 元 / ${areaNumber} ㎡ = ${Math.round(number / areaNumber).toLocaleString()} 元/㎡`, '单方只能粗看预算压力，不能判断报价是否合理。', '还要继续看漏项、材料、工艺、工程量和增项边界。']
  }, [mode, number, areaNumber])

  return (
    <ToolPageShell label="Unit Converter" title="先把单位看懂，再看价格。" subtitle="装修报价里很多误解，来自㎡、米、延米、坪、单方混在一起。这个工具只做普通业主需要的常用换算。" bestFor="正在看报价单或材料清单的人" time="1-3 分钟" prepare={["一个数字", "对应单位"]}>
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.5fr_0.5fr]">
        <div className="border border-border bg-surface p-5 sm:p-6">
          <p className="mb-3 text-sm font-semibold text-ink">选择你要换算的类型</p>
          <div className="mb-5 grid gap-2 sm:grid-cols-3">
            {Object.entries(modes).map(([key, item]) => (
              <button key={key} onClick={() => setMode(key as keyof typeof modes)} type="button" className={`border px-4 py-3 text-left text-sm transition-colors ${mode === key ? 'border-stone bg-stone/5 text-ink' : 'border-border bg-canvas text-ink-muted hover:border-stone/50'}`}>{item.label}</button>
            ))}
          </div>
          <NumberInput label="输入数值" unit={modes[mode].unit} value={value} onChange={setValue} hint="可以输入小数；千分位逗号会自动清掉。" />
          {mode === 'price' && <div className="mt-4"><NumberInput label="房屋面积" unit="㎡" value={area} onChange={setArea} hint="最好确认是建筑面积还是套内面积，不同口径不能混用。" /></div>}
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">{modes[mode].hint}</p>
          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-faint">常用例子</p>
            <div className="flex flex-wrap gap-2">
              {examples[mode].map((example) => (
                <button
                  key={example.label}
                  type="button"
                  onClick={() => {
                    setValue(example.value)
                    if (example.area) setArea(example.area)
                  }}
                  className="border border-border bg-canvas px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-stone hover:text-stone"
                >
                  {example.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <ResultPanel title="换算结果">
          <ul className="space-y-3">
            {result.map((item) => <li key={item} className="border border-border bg-canvas p-3 text-sm text-ink-muted">{item}</li>)}
          </ul>
        </ResultPanel>
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-12 sm:px-8">
        <BridgePanel items={[
          { label: '报价初筛工具', href: '/tools/quote-check', desc: '单位看懂后，再看报价风险。' },
          { label: '瓷砖计算器', href: '/tools/tile-calculator', desc: '面积换算后，继续估算瓷砖数量。' },
          { label: '乳胶漆计算器', href: '/tools/paint-calculator', desc: '墙面面积估算后，继续算漆量。' },
        ]} />
      </section>
      <ToolSeoAssetSection asset={toolSeoAssets.unitConverter} />
    </ToolPageShell>
  )
}
