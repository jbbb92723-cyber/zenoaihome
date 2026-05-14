'use client'

import { useMemo, useState } from 'react'
import ToolSeoAssetSection from '@/components/tools/ToolSeoAssetSection'
import { BridgePanel, NumberInput, ResultPanel, ToolPageShell } from '@/components/tools/ToolPageShell'
import { toolSeoAssets } from '@/data/toolSeoAssets'

const wallAreaPresets = [
  { label: '80㎡房子粗估', value: '170' },
  { label: '100㎡房子粗估', value: '220' },
  { label: '120㎡房子粗估', value: '260' },
]

const coveragePresets = [
  { label: '旧墙/深色 8㎡/L', value: '8' },
  { label: '常见 10㎡/L', value: '10' },
  { label: '遮盖好 12㎡/L', value: '12' },
]

function toPositiveNumber(value: string) {
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? number : 0
}

export default function PaintCalculatorClient() {
  const [wallArea, setWallArea] = useState('220')
  const [coverage, setCoverage] = useState('10')
  const [bucket, setBucket] = useState('5')
  const [coats, setCoats] = useState('2')
  const [primer, setPrimer] = useState(true)
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    const area = toPositiveNumber(wallArea)
    const cover = toPositiveNumber(coverage) || 10
    const bucketSize = toPositiveNumber(bucket) || 5
    const coatCount = Math.max(1, Math.floor(toPositiveNumber(coats) || 2))
    const topLiters = Math.ceil((area * coatCount / cover) * 1.1)
    const primerLiters = primer ? Math.ceil((area / cover) * 1.05) : 0
    return {
      topLiters,
      primerLiters,
      topBuckets: Math.ceil(topLiters / bucketSize),
      primerBuckets: primer ? Math.ceil(primerLiters / bucketSize) : 0,
    }
  }, [wallArea, coverage, bucket, coats, primer])

  async function copyResult() {
    await navigator.clipboard.writeText(`乳胶漆估算\n墙面面积：${wallArea}㎡\n面漆：约 ${result.topLiters}L，约 ${result.topBuckets} 桶\n底漆：${primer ? `约 ${result.primerLiters}L，约 ${result.primerBuckets} 桶` : '未计算'}\n说明：结果按常见涂布率和10%损耗估算，现场以基层和产品说明为准。`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <ToolPageShell label="Paint Calculator" title="乳胶漆别只问几桶，先把墙面和遍数算清。" subtitle="输入墙面面积、涂布率、桶规格和面漆遍数，估算底漆、面漆用量。结果用于采购前沟通，不替代现场复尺。" bestFor="准备买乳胶漆或核对油漆报价的人" time="3-5 分钟" prepare={["墙面面积", "产品涂布率", "桶规格"]}>
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.55fr_0.45fr]">
        <div className="border border-border bg-surface p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberInput label="墙面面积" unit="㎡" value={wallArea} onChange={setWallArea} hint="不是建筑面积。可先用房屋面积粗估，再让现场复尺修正。" />
            <NumberInput label="每升可刷面积" unit="㎡/L" value={coverage} onChange={setCoverage} hint="看产品说明。旧墙、深色、基层差时取低一点。" />
            <NumberInput label="单桶容量" unit="L" value={bucket} onChange={setBucket} />
            <NumberInput label="面漆遍数" unit="遍" value={coats} onChange={setCoats} />
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-faint">没有墙面面积时</p>
              <div className="flex flex-wrap gap-2">
                {wallAreaPresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setWallArea(preset.value)}
                    className="border border-border bg-canvas px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-stone hover:text-stone"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-faint">涂布率参考</p>
              <div className="flex flex-wrap gap-2">
                {coveragePresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setCoverage(preset.value)}
                    className="border border-border bg-canvas px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-stone hover:text-stone"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <label className="mt-5 flex cursor-pointer items-start gap-3 border border-border bg-canvas p-4 text-sm text-ink-muted hover:border-stone/50">
            <input type="checkbox" checked={primer} onChange={(event) => setPrimer(event.target.checked)} className="mt-1 h-4 w-4 accent-stone" />
            <span><span className="block font-semibold text-ink">计算底漆</span><span className="mt-1 block text-xs leading-relaxed">多数墙面建议一遍底漆，但旧墙翻新和特殊基层要按现场判断。</span></span>
          </label>
        </div>

        <ResultPanel title={`面漆约 ${result.topBuckets} 桶`} actions={<button type="button" onClick={copyResult} className="inline-flex h-10 items-center bg-stone px-4 text-sm font-semibold text-white hover:bg-stone/90">{copied ? '已复制' : '复制结果'}</button>}>
          <div className="space-y-3">
            <p>面漆用量约 <span className="font-semibold text-ink">{result.topLiters}L</span>，按 {bucket}L/桶，建议约 <span className="font-semibold text-ink">{result.topBuckets} 桶</span>。</p>
            {primer ? <p>底漆用量约 <span className="font-semibold text-ink">{result.primerLiters}L</span>，建议约 <span className="font-semibold text-ink">{result.primerBuckets} 桶</span>。</p> : <p>当前未计算底漆。旧墙、深色改浅色、基层问题多时，不建议跳过底漆判断。</p>}
            <p>这个结果已经按面漆约 10% 余量估算。门窗洞口、柜体遮挡、深色漆、修补返工都会影响实际用量。</p>
            <p>下单前要问清：是否含底漆、是否含基层找补、深色是否另算，以及剩余未开封桶能不能退。</p>
          </div>
        </ResultPanel>
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-12 sm:px-8">
        <BridgePanel items={[
          { label: '单位换算工具', href: '/tools/unit-converter', desc: '如果只有房屋面积，先估墙面面积。' },
          { label: '验收节点向导', href: '/tools/inspection-guide', desc: '油漆完成后看阴阳角、色差、流挂和修补。' },
          { label: '预算分配工具', href: '/tools/budget-structure', desc: '把油漆费用放回基础施工或主材选择里。' },
        ]} />
      </section>
      <ToolSeoAssetSection asset={toolSeoAssets.paintCalculator} />
    </ToolPageShell>
  )
}
