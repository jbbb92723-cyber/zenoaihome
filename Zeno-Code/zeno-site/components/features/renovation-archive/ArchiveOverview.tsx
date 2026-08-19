'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  Check,
  CheckCircle,
  DownloadSimple,
  PencilSimple,
  Plus,
  SpinnerGap,
  WarningCircle,
  X,
} from '@phosphor-icons/react'
import {
  confirmQuoteVersion,
  updateQuoteItem,
} from '@/lib/domains/renovation-archive/client-api'
import { trackRenovationArchiveEvent } from '@/lib/domains/renovation-archive/analytics'
import type {
  QuoteItemChanges,
  RenovationArchive,
  RenovationQuoteItem,
  RenovationQuoteVersion,
} from '@/lib/domains/renovation-archive/types'

type EditState = {
  category: string
  itemName: string
  specification: string
  unit: string
  quantity: string
  unitPrice: string
  total: string
  notes: string
}

function formatYuan(cents: number | null | undefined) {
  if (cents === null || cents === undefined) return '-'
  return `${(cents / 100).toLocaleString('zh-CN', { maximumFractionDigits: 2 })} 元`
}

function inputNumber(value: number | null | undefined, divisor = 1) {
  return value === null || value === undefined ? '' : String(value / divisor)
}

function parseOptionalNumber(value: string) {
  if (!value.trim()) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function editStateFromItem(item: RenovationQuoteItem): EditState {
  return {
    category: item.section ?? '',
    itemName: item.itemName,
    specification: item.materialSpec ?? '',
    unit: item.unit ?? '',
    quantity: inputNumber(item.quantity),
    unitPrice: inputNumber(item.unitPriceCents, 100),
    total: inputNumber(item.amountCents, 100),
    notes: item.description ?? '',
  }
}

function isCustomerConfirmed(version: RenovationQuoteVersion) {
  return version.status === 'confirmed' || Boolean(version.customerConfirmedAt)
}

function escapeCsv(value: unknown) {
  const text = value === null || value === undefined ? '' : String(value)
  const spreadsheetSafe = /^[=+\-@]/.test(text.trimStart()) ? `'${text}` : text
  return /[",\r\n]/.test(spreadsheetSafe)
    ? `"${spreadsheetSafe.replace(/"/g, '""')}"`
    : spreadsheetSafe
}

function exportVersion(version: RenovationQuoteVersion) {
  const headers = ['分类', '项目名称', '规格/工艺', '单位', '数量', '单价（元）', '合价（元）', '备注', '来源文件', '来源行']
  const body = version.items.map((item) => [
    item.section,
    item.itemName,
    item.materialSpec,
    item.unit,
    item.quantity,
    item.unitPriceCents === null ? '' : item.unitPriceCents / 100,
    item.amountCents === null ? '' : item.amountCents / 100,
    item.description,
    version.asset.originalName,
    item.sourceRow,
  ])
  const csv = `\uFEFF${[headers, ...body].map((row) => row.map(escapeCsv).join(',')).join('\r\n')}`
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  const label = version.label || `第 ${version.versionNumber} 版报价`
  link.download = `${label.replace(/[\\/:*?"<>|]/g, '-')}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export default function ArchiveOverview({
  archive,
  versions,
  selectedVersion,
  onSelectVersion,
  onRefresh,
  onImport,
}: {
  archive: RenovationArchive
  versions: RenovationQuoteVersion[]
  selectedVersion: RenovationQuoteVersion | null
  onSelectVersion: (id: string) => void
  onRefresh: () => Promise<void>
  onImport: () => void
}) {
  const [editingItemId, setEditingItemId] = useState('')
  const [editState, setEditState] = useState<EditState | null>(null)
  const [savingItem, setSavingItem] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [actionError, setActionError] = useState('')

  const summary = useMemo(() => {
    const items = selectedVersion?.items ?? []
    const totalCents = items.reduce((sum, item) => sum + (item.amountCents ?? 0), 0)
    const categoryMap = new Map<string, number>()
    let missingAmountCount = 0
    for (const item of items) {
      if (item.amountCents === null) missingAmountCount += 1
      const category = item.section?.trim() || '未分类'
      categoryMap.set(category, (categoryMap.get(category) ?? 0) + (item.amountCents ?? 0))
    }
    const categories = Array.from(categoryMap.entries())
      .map(([name, value]) => ({
        name,
        value,
        percent: totalCents > 0 ? Math.round((value / totalCents) * 1000) / 10 : 0,
      }))
      .sort((left, right) => right.value - left.value)

    return { totalCents, categories, itemCount: items.length, missingAmountCount }
  }, [selectedVersion])

  function startEdit(item: RenovationQuoteItem) {
    setEditingItemId(item.id)
    setEditState(editStateFromItem(item))
    setActionError('')
  }

  function cancelEdit() {
    setEditingItemId('')
    setEditState(null)
  }

  async function saveEdit() {
    if (!selectedVersion || !editState || !editingItemId) return
    if (!editState.itemName.trim()) {
      setActionError('项目名称不能为空。')
      return
    }

    const invalidNumber = [
      ['数量', editState.quantity, false],
      ['单价', editState.unitPrice, true],
      ['合价', editState.total, true],
    ] as const
    const invalid = invalidNumber.find(([, value, allowNegative]) => {
      if (!value.trim()) return false
      const parsed = parseOptionalNumber(value)
      return parsed === null || (!allowNegative && parsed < 0)
    })
    if (invalid) {
      setActionError(invalid[0] === '数量'
        ? '数量必须是大于或等于 0 的数字。'
        : `${invalid[0]}必须是有效数字；折扣项可以填写负数。`)
      return
    }

    const changes: QuoteItemChanges = {
      section: editState.category.trim() || null,
      itemName: editState.itemName.trim(),
      materialSpec: editState.specification.trim() || null,
      unit: editState.unit.trim() || null,
      quantity: parseOptionalNumber(editState.quantity),
      unitPriceCents: editState.unitPrice.trim()
        ? Math.round((parseOptionalNumber(editState.unitPrice) ?? 0) * 100)
        : null,
      amountCents: editState.total.trim()
        ? Math.round((parseOptionalNumber(editState.total) ?? 0) * 100)
        : null,
      description: editState.notes.trim() || null,
    }

    setSavingItem(true)
    setActionError('')
    try {
      await updateQuoteItem({
        archiveId: archive.id,
        versionId: selectedVersion.id,
        itemId: editingItemId,
        changes,
      })
      await onRefresh()
      cancelEdit()
    } catch (error) {
      setActionError(error instanceof Error ? error.message : '条目没有保存，请重试。')
    } finally {
      setSavingItem(false)
    }
  }

  async function confirmVersion() {
    if (!selectedVersion) return
    if (editingItemId) {
      setActionError('请先保存或取消正在修改的条目，再确认本版数据。')
      return
    }
    setConfirming(true)
    setActionError('')
    try {
      await confirmQuoteVersion(archive.id, selectedVersion.id)
      trackRenovationArchiveEvent('renovation_archive_version_confirm', {
        versionNumber: selectedVersion.versionNumber,
      })
      await onRefresh()
      cancelEdit()
      setShowConfirmation(false)
    } catch (error) {
      setActionError(error instanceof Error ? error.message : '确认状态没有保存，请重试。')
    } finally {
      setConfirming(false)
    }
  }

  if (!selectedVersion) {
    return (
      <section className="border border-border bg-surface p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone">预算总览</p>
        <h2 className="mt-3 text-2xl font-semibold text-ink">还没有报价版本</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-muted">
          先导入一份 CSV 或 XLSX 报价。系统会提取条目和金额，你核对字段后再保存。
        </p>
        <button
          type="button"
          onClick={onImport}
          className="motion-press mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-stone px-5 text-sm font-semibold text-white hover:bg-stone/90 sm:w-auto"
        >
          <Plus size={17} aria-hidden />
          导入第一版报价
        </button>
      </section>
    )
  }

  const confirmed = isCustomerConfirmed(selectedVersion)

  return (
    <div className="space-y-7">
      <section className="grid gap-5 lg:grid-cols-[0.68fr_0.32fr]">
        <div className="border border-border bg-surface p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone">当前版本</p>
              <h2 className="mt-2 break-words text-2xl font-semibold text-ink">
                {selectedVersion.label || `第 ${selectedVersion.versionNumber} 版报价`}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <ResponsibilityStatus
                  confirmed={confirmed}
                  edited={selectedVersion.items.some((item) => item.isCustomerEdited)}
                  zenoReviewedAt={selectedVersion.zenoReviewedAt}
                />
              </div>
            </div>
            <label className="w-full text-sm font-medium text-ink sm:max-w-[18rem]">
              切换报价版本
              <select
                value={selectedVersion.id}
                onChange={(event) => {
                  onSelectVersion(event.target.value)
                  cancelEdit()
                  setShowConfirmation(false)
                }}
                className="mt-2 min-h-11 w-full border border-border bg-canvas px-3 text-sm outline-none focus:border-stone"
              >
                {versions.map((version) => (
                  <option key={version.id} value={version.id}>
                    {version.label || `第 ${version.versionNumber} 版报价`}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-7 grid gap-px bg-border sm:grid-cols-3">
            <div className="bg-canvas p-4">
              <p className="text-xs text-ink-faint">版本合计</p>
              <p className="mt-1 text-xl font-semibold tabular-nums text-ink">{formatYuan(summary.totalCents)}</p>
            </div>
            <div className="bg-canvas p-4">
              <p className="text-xs text-ink-faint">报价条目</p>
              <p className="mt-1 text-xl font-semibold tabular-nums text-ink">{summary.itemCount}</p>
            </div>
            <div className="bg-canvas p-4">
              <p className="text-xs text-ink-faint">金额待补</p>
              <p className="mt-1 text-xl font-semibold tabular-nums text-ink">{summary.missingAmountCount}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => exportVersion(selectedVersion)}
              className="motion-press inline-flex min-h-11 w-full items-center justify-center gap-2 border border-border bg-canvas px-4 text-sm font-semibold text-ink hover:border-stone sm:w-auto"
            >
              <DownloadSimple size={17} aria-hidden />
              导出 CSV
            </button>
            {!confirmed && (
              <button
                type="button"
                onClick={() => setShowConfirmation(true)}
                disabled={Boolean(editingItemId) || savingItem}
                title={editingItemId ? '请先保存或取消正在修改的条目' : undefined}
                className="motion-press inline-flex min-h-11 w-full items-center justify-center gap-2 bg-stone px-4 text-sm font-semibold text-white hover:bg-stone/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <CheckCircle size={17} aria-hidden />
                确认本版数据
              </button>
            )}
          </div>

          {showConfirmation && !confirmed && (
            <div className="mt-5 border-l-2 border-stone bg-surface-warm px-4 py-4">
              <p className="text-sm font-semibold text-ink">确认你已经核对这一版？</p>
              <p className="mt-2 text-xs leading-6 text-ink-muted">
                确认后只表示“客户已确认”，不表示 Zeno 已审核，也不替代造价、法律或现场专业意见。
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => void confirmVersion()}
                  disabled={confirming}
                  className="inline-flex min-h-11 items-center justify-center gap-2 bg-stone px-4 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {confirming && <SpinnerGap size={16} className="animate-spin" aria-hidden />}
                  确认，标记为客户已确认
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmation(false)}
                  disabled={confirming}
                  className="inline-flex min-h-11 items-center justify-center border border-border px-4 text-sm font-semibold text-ink"
                >
                  暂不确认
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="border border-border bg-surface-warm p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone">分类占比</p>
          <div className="mt-5 space-y-4">
            {summary.categories.length === 0 ? (
              <p className="text-sm leading-7 text-ink-muted">当前没有可汇总的金额。</p>
            ) : summary.categories.slice(0, 8).map((category) => (
              <div key={category.name}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="min-w-0 truncate text-sm font-medium text-ink">{category.name}</p>
                  <p className="shrink-0 text-xs tabular-nums text-ink-muted">{category.percent}% · {formatYuan(category.value)}</p>
                </div>
                <div className="mt-2 h-1.5 bg-stone-pale">
                  <div className="h-full bg-stone" style={{ width: `${Math.min(100, category.percent)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      {actionError && (
        <p className="flex items-start gap-2 border-l-2 border-stone bg-surface-warm px-4 py-3 text-sm leading-6 text-ink-muted" role="alert">
          <WarningCircle size={17} className="mt-1 shrink-0 text-stone" aria-hidden />
          {actionError}
        </p>
      )}

      <section>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone">报价条目</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">逐项核对自动提取结果</h2>
          </div>
          <p className="max-w-xl text-xs leading-6 text-ink-muted">修改只作用于当前版本。原文件和来源行会继续保留，便于回看。</p>
        </div>

        <div className="mt-5 hidden overflow-x-auto border border-border md:block">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-surface-warm text-xs text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">分类 / 项目</th>
                <th className="px-4 py-3 font-semibold">规格 / 工艺</th>
                <th className="px-4 py-3 text-right font-semibold">数量</th>
                <th className="px-4 py-3 text-right font-semibold">单价</th>
                <th className="px-4 py-3 text-right font-semibold">合价</th>
                <th className="px-4 py-3 font-semibold">责任状态</th>
                <th className="w-16 px-4 py-3 text-right font-semibold">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {selectedVersion.items.map((item) => (
                <DesktopItemRow
                  key={item.id}
                  item={item}
                  confirmed={confirmed}
                  zenoReviewedAt={selectedVersion.zenoReviewedAt}
                  editing={editingItemId === item.id}
                  editState={editingItemId === item.id ? editState : null}
                  onEditState={setEditState}
                  onStartEdit={() => startEdit(item)}
                  onCancel={cancelEdit}
                  onSave={() => void saveEdit()}
                  saving={savingItem}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 grid gap-3 md:hidden">
          {selectedVersion.items.map((item) => (
            <MobileItemCard
              key={item.id}
              item={item}
              confirmed={confirmed}
              zenoReviewedAt={selectedVersion.zenoReviewedAt}
              editing={editingItemId === item.id}
              editState={editingItemId === item.id ? editState : null}
              onEditState={setEditState}
              onStartEdit={() => startEdit(item)}
              onCancel={cancelEdit}
              onSave={() => void saveEdit()}
              saving={savingItem}
            />
          ))}
        </div>

        <div className="mt-7 flex flex-col justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onImport}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-border bg-surface px-5 text-sm font-semibold text-ink hover:border-stone sm:w-auto"
          >
            <Plus size={17} aria-hidden />
            导入新版本
          </button>
          <Link
            href={`/services/quote-review?archiveId=${encodeURIComponent(archive.id)}&versionId=${encodeURIComponent(selectedVersion.id)}`}
            onClick={() => trackRenovationArchiveEvent('renovation_archive_review_click', {
              source: 'archive_overview',
            })}
            className="inline-flex min-h-11 w-full items-center justify-center bg-stone px-5 text-sm font-semibold text-white hover:bg-stone/90 sm:w-auto"
          >
            需要结合原文判断，申请人工审核
          </Link>
        </div>
      </section>
    </div>
  )
}

function ResponsibilityStatus({
  confirmed,
  edited = false,
  zenoReviewedAt,
}: {
  confirmed: boolean
  edited?: boolean
  zenoReviewedAt?: string | null
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {!edited && <span className="border border-border bg-canvas px-2 py-1 text-[0.68rem] font-semibold text-ink-muted">自动提取</span>}
      {edited && <span className="border border-border bg-surface-warm px-2 py-1 text-[0.68rem] font-semibold text-ink-muted">客户已修正</span>}
      {confirmed && <span className="border border-stone/35 bg-stone-pale px-2 py-1 text-[0.68rem] font-semibold text-stone">客户已确认</span>}
      {zenoReviewedAt && <span className="border border-ink/20 bg-ink px-2 py-1 text-[0.68rem] font-semibold text-white">Zeno 本人已审核 · {new Date(zenoReviewedAt).toLocaleDateString('zh-CN')}</span>}
    </div>
  )
}

function ItemEditFields({
  state,
  onChange,
}: {
  state: EditState
  onChange: (state: EditState) => void
}) {
  const textFields: Array<{ key: keyof EditState; label: string }> = [
    { key: 'category', label: '分类' },
    { key: 'itemName', label: '项目名称' },
    { key: 'specification', label: '规格 / 工艺' },
    { key: 'unit', label: '单位' },
    { key: 'quantity', label: '数量' },
    { key: 'unitPrice', label: '单价（元）' },
    { key: 'total', label: '合价（元）' },
    { key: 'notes', label: '备注' },
  ]
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {textFields.map((field) => (
        <label key={field.key} className="text-xs font-medium text-ink-muted">
          {field.label}
          <input
            value={state[field.key]}
            onChange={(event) => onChange({ ...state, [field.key]: event.target.value })}
            inputMode={['quantity', 'unitPrice', 'total'].includes(field.key) ? 'decimal' : undefined}
            className="mt-1.5 min-h-11 w-full border border-border bg-canvas px-3 text-sm text-ink outline-none focus:border-stone"
          />
        </label>
      ))}
    </div>
  )
}

type ItemRowProps = {
  item: RenovationQuoteItem
  confirmed: boolean
  zenoReviewedAt?: string | null
  editing: boolean
  editState: EditState | null
  onEditState: (state: EditState) => void
  onStartEdit: () => void
  onCancel: () => void
  onSave: () => void
  saving: boolean
}

function DesktopItemRow(props: ItemRowProps) {
  const { item, confirmed, zenoReviewedAt, editing, editState, onEditState, onStartEdit, onCancel, onSave, saving } = props
  if (editing && editState) {
    return (
      <tr className="bg-surface align-top">
        <td colSpan={7} className="p-4">
          <ItemEditFields state={editState} onChange={onEditState} />
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={onCancel} disabled={saving} className="inline-flex min-h-11 items-center gap-2 border border-border px-4 text-sm font-semibold text-ink">
              <X size={16} aria-hidden />取消
            </button>
            <button type="button" onClick={onSave} disabled={saving} className="inline-flex min-h-11 items-center gap-2 bg-stone px-4 text-sm font-semibold text-white disabled:opacity-50">
              {saving ? <SpinnerGap size={16} className="animate-spin" aria-hidden /> : <Check size={16} aria-hidden />}
              保存修改
            </button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tr className="bg-canvas align-top">
      <td className="px-4 py-4">
        <p className="text-xs text-stone">{item.section || '未分类'}</p>
        <p className="mt-1 font-medium text-ink">{item.itemName}</p>
        <p className="mt-1 text-xs text-ink-faint">原文件 · 第 {item.sourceRow} 行</p>
      </td>
      <td className="max-w-[18rem] px-4 py-4 text-ink-muted">{item.materialSpec || item.description || '-'}</td>
      <td className="px-4 py-4 text-right tabular-nums text-ink-muted break-words">{item.quantity ?? '-'} {item.unit}</td>
      <td className="px-4 py-4 text-right tabular-nums text-ink-muted">{formatYuan(item.unitPriceCents)}</td>
      <td className="px-4 py-4 text-right font-semibold tabular-nums text-ink">{formatYuan(item.amountCents)}</td>
      <td className="px-4 py-4"><ResponsibilityStatus confirmed={confirmed} edited={item.isCustomerEdited} zenoReviewedAt={zenoReviewedAt} /></td>
      <td className="px-4 py-4 text-right">
        {!confirmed && (
          <button type="button" onClick={onStartEdit} className="inline-flex h-11 w-11 items-center justify-center text-ink-muted hover:bg-surface-warm hover:text-ink" aria-label={`修改 ${item.itemName}`} title="修改条目">
            <PencilSimple size={17} aria-hidden />
          </button>
        )}
      </td>
    </tr>
  )
}

function MobileItemCard(props: ItemRowProps) {
  const { item, confirmed, zenoReviewedAt, editing, editState, onEditState, onStartEdit, onCancel, onSave, saving } = props
  return (
    <article className="border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-stone">{item.section || '未分类'}</p>
          <h3 className="mt-1 break-words text-sm font-semibold leading-6 text-ink">{item.itemName}</h3>
        </div>
        {!editing && !confirmed && (
          <button type="button" onClick={onStartEdit} className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-ink-muted hover:bg-surface-warm" aria-label={`修改 ${item.itemName}`} title="修改条目">
            <PencilSimple size={17} aria-hidden />
          </button>
        )}
      </div>

      {!editing && (
        <>
          {(item.materialSpec || item.description) && (
            <p className="mt-2 text-xs leading-5 text-ink-muted">{item.materialSpec || item.description}</p>
          )}
          <div className="mt-4 grid min-w-0 grid-cols-3 gap-px bg-border">
            <div className="min-w-0 bg-canvas p-3">
              <p className="text-[0.68rem] text-ink-faint">数量</p>
              <p className="mt-1 break-words text-xs font-semibold tabular-nums text-ink">{item.quantity ?? '-'} {item.unit}</p>
            </div>
            <div className="bg-canvas p-3">
              <p className="text-[0.68rem] text-ink-faint">单价</p>
              <p className="mt-1 text-xs font-semibold tabular-nums text-ink">{formatYuan(item.unitPriceCents)}</p>
            </div>
            <div className="bg-canvas p-3">
              <p className="text-[0.68rem] text-ink-faint">合价</p>
              <p className="mt-1 text-xs font-semibold tabular-nums text-ink">{formatYuan(item.amountCents)}</p>
            </div>
          </div>
          <div className="mt-3 flex items-end justify-between gap-3">
            <ResponsibilityStatus confirmed={confirmed} edited={item.isCustomerEdited} zenoReviewedAt={zenoReviewedAt} />
            <p className="shrink-0 text-[0.68rem] text-ink-faint">第 {item.sourceRow} 行</p>
          </div>
        </>
      )}

      {editing && editState && (
        <div className="mt-4 border-t border-border pt-4">
          <ItemEditFields state={editState} onChange={onEditState} />
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button type="button" onClick={onCancel} disabled={saving} className="inline-flex min-h-11 items-center justify-center gap-2 border border-border text-sm font-semibold text-ink"><X size={16} aria-hidden />取消</button>
            <button type="button" onClick={onSave} disabled={saving} className="inline-flex min-h-11 items-center justify-center gap-2 bg-stone text-sm font-semibold text-white disabled:opacity-50">
              {saving ? <SpinnerGap size={16} className="animate-spin" aria-hidden /> : <Check size={16} aria-hidden />}保存
            </button>
          </div>
        </div>
      )}
    </article>
  )
}
