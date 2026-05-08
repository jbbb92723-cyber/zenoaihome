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

export default function UnitConverterClient() {
  const [mode, setMode] = useState<keyof typeof modes>('area')
  const [value, setValue] = useState('100')
  const [area, setArea] = useState('100')
  const number = Number(value) || 0
  const areaNumber = Number(area) || 0

  const result = useMemo(() => {
    if (mode === 'area') return [`${number} ㎡ = ${(number * 10.7639).toFixed(1)} ft²`, `${number} ㎡ ≈ ${(number / 3.3058).toFixed(1)} 坪`, `${number} ㎡地面通常不是墙面面积，墙面要另算周长和层高。`]
    if (mode === 'length') return [`${number} m = ${(number * 100).toFixed(0)} cm`, `${number} m = ${(number * 1000).toFixed(0)} mm`, '报价里“延米”常见于柜体、台面、踢脚线，不能直接等同面积。']
    return [`总价 ${number.toLocaleString()} 元 / ${areaNumber || 1} ㎡ = ${Math.round(number / (areaNumber || 1)).toLocaleString()} 元/㎡`, '单方只能粗看预算压力，不能判断报价是否合理。', '还要继续看漏项、材料、工艺和增项边界。']
  }, [mode, number, areaNumber])

  return (
    <ToolPageShell label="Unit Converter" title="先把单位看懂，再看价格。" subtitle="装修报价里很多误解，来自㎡、米、延米、坪、单方混在一起。这个工具只做普通业主需要的常用换算。" bestFor="正在看报价单或材料清单的人" time="1-3 分钟" prepare={["一个数字", "对应单位"]}>
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.5fr_0.5fr]">
        <div className="border border-border bg-surface p-5 sm:p-6">
          <p className="mb-3 text-sm font-semibold text-ink">选择你要换算的类型</p>
          <div className="mb-5 grid gap-2 sm:grid-cols-3">
            {Object.entries(modes).map(([key, item]) => (
              <button key={key} onClick={() => setMode(key as keyof typeof modes)} type="button" className={`border px-4 py-3 text-left text-sm ${mode === key ? 'border-stone bg-stone/5 text-ink' : 'border-border bg-canvas text-ink-muted hover:border-stone/50'}`}>{item.label}</button>
            ))}
          </div>
          <NumberInput label="输入数值" unit={modes[mode].unit} value={value} onChange={setValue} />
          {mode === 'price' && <div className="mt-4"><NumberInput label="房屋面积" unit="㎡" value={area} onChange={setArea} /></div>}
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">{modes[mode].hint}</p>
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
