'use client'

import { useMemo, useState } from 'react'
import { BridgePanel, NumberInput, ResultPanel, ToolPageShell } from '@/components/tools/ToolPageShell'

const lossOptions = [
  { key: 'simple', label: '常规铺贴', loss: 0.08 },
  { key: 'complex', label: '斜铺/异形/多切割', loss: 0.12 },
  { key: 'small', label: '小空间或拼花', loss: 0.15 },
]

export default function TileCalculatorClient() {
  const [area, setArea] = useState('30')
  const [width, setWidth] = useState('800')
  const [height, setHeight] = useState('800')
  const [perBox, setPerBox] = useState('3')
  const [lossKey, setLossKey] = useState('simple')
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    const tileArea = ((Number(width) || 1) * (Number(height) || 1)) / 1000000
    const basePieces = Math.ceil((Number(area) || 0) / tileArea)
    const loss = lossOptions.find((item) => item.key === lossKey)?.loss ?? 0.08
    const pieces = Math.ceil(basePieces * (1 + loss))
    const boxes = Math.ceil(pieces / (Number(perBox) || 1))
    return { tileArea, basePieces, pieces, boxes, loss }
  }, [area, width, height, perBox, lossKey])

  async function copyResult() {
    await navigator.clipboard.writeText(`瓷砖估算\n铺贴面积：${area}㎡\n瓷砖规格：${width}x${height}mm\n建议购买：${result.pieces} 片，约 ${result.boxes} 箱\n损耗：${Math.round(result.loss * 100)}%`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <ToolPageShell label="Tile Calculator" title="瓷砖先估够，不要只听一句“大概够”。" subtitle="输入铺贴面积和瓷砖规格，先估算片数、箱数和损耗。结果用于和商家、工长沟通，不替代现场复尺。" bestFor="准备买砖或核对瓷砖数量的人" time="3-5 分钟" prepare={["铺贴面积", "瓷砖规格", "每箱片数"]}>
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.55fr_0.45fr]">
        <div className="border border-border bg-surface p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberInput label="铺贴面积" unit="㎡" value={area} onChange={setArea} />
            <NumberInput label="每箱片数" unit="片" value={perBox} onChange={setPerBox} />
            <NumberInput label="瓷砖宽度" unit="mm" value={width} onChange={setWidth} />
            <NumberInput label="瓷砖高度" unit="mm" value={height} onChange={setHeight} />
          </div>
          <div className="mt-5">
            <p className="mb-3 text-sm font-semibold text-ink">损耗情况</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {lossOptions.map((item) => (
                <button key={item.key} type="button" onClick={() => setLossKey(item.key)} className={`border px-3 py-3 text-left text-sm ${lossKey === item.key ? 'border-stone bg-stone/5 text-ink' : 'border-border bg-canvas text-ink-muted hover:border-stone/50'}`}>{item.label}<span className="block text-xs text-ink-faint">{Math.round(item.loss * 100)}%</span></button>
              ))}
            </div>
          </div>
        </div>

        <ResultPanel title={`建议约 ${result.boxes} 箱`} actions={<button type="button" onClick={copyResult} className="inline-flex h-10 items-center bg-stone px-4 text-sm font-semibold text-white hover:bg-stone/90">{copied ? '已复制' : '复制结果'}</button>}>
          <div className="space-y-3">
            <p>单片面积约 <span className="font-semibold text-ink">{result.tileArea.toFixed(2)}㎡</span>。</p>
            <p>不含损耗约 <span className="font-semibold text-ink">{result.basePieces} 片</span>，加损耗后建议 <span className="font-semibold text-ink">{result.pieces} 片</span>。</p>
            <p>提醒：厨卫墙地面、门槛石、过门石、波打线不要混在一个数里算。</p>
          </div>
        </ResultPanel>
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-12 sm:px-8">
        <BridgePanel items={[
          { label: '单位换算工具', href: '/tools/unit-converter', desc: '先看清面积和单位，再核对数量。' },
          { label: '预算结构工具', href: '/tools/budget-structure', desc: '把瓷砖预算放回整体预算结构。' },
          { label: '验收节点向导', href: '/tools/inspection-guide', desc: '铺贴完成后按节点验收。' },
        ]} />
      </section>
    </ToolPageShell>
  )
}
