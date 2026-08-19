'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowsLeftRight, Plus, WarningCircle } from '@phosphor-icons/react'
import type {
  RenovationQuoteItem,
  RenovationQuoteVersion,
} from '@/lib/domains/renovation-archive/types'

type DiffRow = {
  key: string
  category: string
  itemName: string
  previousCents: number | null
  currentCents: number | null
  deltaCents: number
  status: 'added' | 'removed' | 'changed'
}

function money(cents: number | null) {
  if (cents === null) return '-'
  return `${(cents / 100).toLocaleString('zh-CN', { maximumFractionDigits: 2 })} 元`
}

function itemKey(item: RenovationQuoteItem) {
  if (item.stableKey) return item.stableKey
  return [item.section, item.itemName, item.materialSpec, item.unit]
    .map((value) => (value ?? '').trim().toLowerCase())
    .join('|')
}

function aggregate(items: RenovationQuoteItem[]) {
  const map = new Map<string, { item: RenovationQuoteItem; cents: number | null }>()
  for (const item of items) {
    const key = itemKey(item)
    const existing = map.get(key)
    const nextCents = item.amountCents
    if (!existing) {
      map.set(key, { item, cents: nextCents })
    } else if (existing.cents !== null || nextCents !== null) {
      existing.cents = (existing.cents ?? 0) + (nextCents ?? 0)
    }
  }
  return map
}

function buildDiff(previous: RenovationQuoteVersion, current: RenovationQuoteVersion): DiffRow[] {
  const before = aggregate(previous.items)
  const after = aggregate(current.items)
  const keys = new Set([...Array.from(before.keys()), ...Array.from(after.keys())])
  const rows: DiffRow[] = []

  for (const key of Array.from(keys)) {
    const left = before.get(key)
    const right = after.get(key)
    if (!left && right) {
      rows.push({
        key,
        category: right.item.section || '未分类',
        itemName: right.item.itemName,
        previousCents: null,
        currentCents: right.cents,
        deltaCents: right.cents ?? 0,
        status: 'added',
      })
      continue
    }
    if (left && !right) {
      rows.push({
        key,
        category: left.item.section || '未分类',
        itemName: left.item.itemName,
        previousCents: left.cents,
        currentCents: null,
        deltaCents: -(left.cents ?? 0),
        status: 'removed',
      })
      continue
    }
    if (!left || !right || left.cents === right.cents) continue
    rows.push({
      key,
      category: right.item.section || left.item.section || '未分类',
      itemName: right.item.itemName || left.item.itemName,
      previousCents: left.cents,
      currentCents: right.cents,
      deltaCents: (right.cents ?? 0) - (left.cents ?? 0),
      status: 'changed',
    })
  }

  return rows.sort((left, right) => Math.abs(right.deltaCents) - Math.abs(left.deltaCents))
}

const statusLabels: Record<DiffRow['status'], string> = {
  added: '新增',
  removed: '移除',
  changed: '金额变化',
}

export default function VersionDiffPanel({ versions }: { versions: RenovationQuoteVersion[] }) {
  const [previousId, setPreviousId] = useState(versions[1]?.id ?? '')
  const [currentId, setCurrentId] = useState(versions[0]?.id ?? '')

  useEffect(() => {
    if (!versions.some((version) => version.id === currentId)) setCurrentId(versions[0]?.id ?? '')
    if (!versions.some((version) => version.id === previousId)) setPreviousId(versions[1]?.id ?? '')
  }, [currentId, previousId, versions])

  const previous = versions.find((version) => version.id === previousId) ?? null
  const current = versions.find((version) => version.id === currentId) ?? null
  const diff = useMemo(
    () => previous && current && previous.id !== current.id ? buildDiff(previous, current) : [],
    [current, previous],
  )
  const previousTotal = previous?.items.reduce((sum, item) => sum + (item.amountCents ?? 0), 0) ?? 0
  const currentTotal = current?.items.reduce((sum, item) => sum + (item.amountCents ?? 0), 0) ?? 0
  const totalDelta = currentTotal - previousTotal

  if (versions.length < 2) {
    return (
      <section className="border border-border bg-surface p-6 sm:p-8">
        <ArrowsLeftRight size={27} weight="duotone" className="text-stone" aria-hidden />
        <h2 className="mt-4 text-2xl font-semibold text-ink">至少导入两个版本才能对照</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-muted">
          第二版报价导入后，这里会列出新增、移除和金额变化的项目。字段名称差异过大时，仍需要你人工核对。
        </p>
      </section>
    )
  }

  return (
    <div className="space-y-7">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone">版本对照</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">看清哪一项增加、减少或改了金额。</h2>
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          系统按分类、项目名称、规格和单位匹配条目。匹配结果属于自动对照，不表示 Zeno 已审核。
        </p>
      </header>

      <section className="border border-border bg-surface p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <label className="text-sm font-medium text-ink">
            较早版本
            <select value={previousId} onChange={(event) => setPreviousId(event.target.value)} className="mt-2 min-h-11 w-full border border-border bg-canvas px-3 text-sm outline-none focus:border-stone">
              {versions.map((version) => (
                <option key={version.id} value={version.id}>
                  {version.label || `第 ${version.versionNumber} 版报价`}
                </option>
              ))}
            </select>
          </label>
          <ArrowsLeftRight size={20} className="mx-auto mb-3 hidden text-stone sm:block" aria-hidden />
          <label className="text-sm font-medium text-ink">
            较新版本
            <select value={currentId} onChange={(event) => setCurrentId(event.target.value)} className="mt-2 min-h-11 w-full border border-border bg-canvas px-3 text-sm outline-none focus:border-stone">
              {versions.map((version) => (
                <option key={version.id} value={version.id}>
                  {version.label || `第 ${version.versionNumber} 版报价`}
                </option>
              ))}
            </select>
          </label>
        </div>

        {previousId === currentId && (
          <p className="mt-4 flex items-start gap-2 border-l-2 border-stone bg-surface-warm px-3 py-2 text-sm leading-6 text-ink-muted" role="alert">
            <WarningCircle size={17} className="mt-1 shrink-0 text-stone" aria-hidden />
            请选择两个不同的版本。
          </p>
        )}
      </section>

      {previous && current && previous.id !== current.id && (
        <>
          <section className="grid gap-px bg-border sm:grid-cols-3">
            <div className="bg-surface p-5">
              <p className="text-xs text-ink-faint">较早版本合计</p>
              <p className="mt-2 text-xl font-semibold tabular-nums text-ink">{money(previousTotal)}</p>
            </div>
            <div className="bg-surface p-5">
              <p className="text-xs text-ink-faint">较新版本合计</p>
              <p className="mt-2 text-xl font-semibold tabular-nums text-ink">{money(currentTotal)}</p>
            </div>
            <div className="bg-surface-warm p-5">
              <p className="text-xs text-ink-faint">版本差额</p>
              <p className="mt-2 text-xl font-semibold tabular-nums text-ink">{totalDelta > 0 ? '+' : ''}{money(totalDelta)}</p>
            </div>
          </section>

          {diff.length === 0 ? (
            <section className="border border-border bg-surface p-6 text-sm leading-7 text-ink-muted">
              没有发现可匹配条目的金额变化。仍需核对未填写金额、名称变化和报价范围是否一致。
            </section>
          ) : (
            <section>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone">变化明细</p>
                  <h3 className="mt-2 text-xl font-semibold text-ink">共 {diff.length} 项变化</h3>
                </div>
              </div>

              <div className="mt-5 hidden overflow-x-auto border border-border md:block">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-surface-warm text-xs text-ink-muted">
                    <tr>
                      <th className="px-4 py-3 font-semibold">状态</th>
                      <th className="px-4 py-3 font-semibold">分类 / 项目</th>
                      <th className="px-4 py-3 text-right font-semibold">较早版本</th>
                      <th className="px-4 py-3 text-right font-semibold">较新版本</th>
                      <th className="px-4 py-3 text-right font-semibold">差额</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {diff.map((row) => (
                      <tr key={row.key} className="bg-canvas">
                        <td className="px-4 py-4"><span className="border border-border bg-surface px-2 py-1 text-xs text-ink-muted">{statusLabels[row.status]}</span></td>
                        <td className="px-4 py-4"><p className="text-xs text-stone">{row.category}</p><p className="mt-1 font-medium text-ink">{row.itemName}</p></td>
                        <td className="px-4 py-4 text-right tabular-nums text-ink-muted">{money(row.previousCents)}</td>
                        <td className="px-4 py-4 text-right tabular-nums text-ink-muted">{money(row.currentCents)}</td>
                        <td className="px-4 py-4 text-right font-semibold tabular-nums text-ink">{row.deltaCents > 0 ? '+' : ''}{money(row.deltaCents)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 grid gap-3 md:hidden">
                {diff.map((row) => (
                  <article key={row.key} className="border border-border bg-surface p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs text-stone">{row.category} · {statusLabels[row.status]}</p>
                        <h4 className="mt-1 break-words text-sm font-semibold text-ink">{row.itemName}</h4>
                      </div>
                      <p className="shrink-0 text-sm font-semibold tabular-nums text-ink">{row.deltaCents > 0 ? '+' : ''}{money(row.deltaCents)}</p>
                    </div>
                    <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-xs text-ink-muted">
                      <span className="tabular-nums">{money(row.previousCents)}</span>
                      <Plus size={13} className="rotate-45 text-stone" aria-hidden />
                      <span className="text-right tabular-nums">{money(row.currentCents)}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
