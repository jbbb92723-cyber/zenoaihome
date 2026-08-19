'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  CheckCircle,
  FileCsv,
  FileXls,
  SpinnerGap,
  UploadSimple,
  WarningCircle,
} from '@phosphor-icons/react'
import {
  detectQuoteLayout,
  MAX_QUOTE_IMPORT_BYTES,
  mapQuoteRows,
  parseQuoteFile,
  quoteFieldKeys,
  type ParsedQuoteFile,
  type QuoteFieldKey,
  type QuoteFieldMapping,
} from '@/lib/domains/renovation-archive/client-parser'
import { MAX_QUOTE_ITEMS_PER_VERSION } from '@/lib/domains/renovation-archive/constants'
import { trackRenovationArchiveEvent } from '@/lib/domains/renovation-archive/analytics'
import {
  cancelArchiveUpload,
  createQuoteVersion,
  requestArchiveUpload,
  uploadArchiveFile,
} from '@/lib/domains/renovation-archive/client-api'
import type {
  ArchiveLimits,
  RenovationArchive,
} from '@/lib/domains/renovation-archive/types'

type ImportStatus = 'idle' | 'parsing' | 'uploading' | 'saving' | 'success'

const fieldLabels: Record<QuoteFieldKey, { label: string; required?: boolean }> = {
  category: { label: '分类' },
  itemName: { label: '项目名称', required: true },
  specification: { label: '规格 / 工艺' },
  unit: { label: '单位' },
  quantity: { label: '数量 / 工程量' },
  unitPrice: { label: '单价' },
  total: { label: '合价 / 金额' },
  notes: { label: '备注' },
}

function defaultVersionLabel(fileName: string) {
  const cleanName = fileName.replace(/\.(csv|xlsx)$/i, '').trim()
  const date = new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
  return `${cleanName || '报价'} · ${date}`
}

export default function QuoteImportPanel({
  archive,
  limits,
  onImported,
  onReload,
}: {
  archive: RenovationArchive
  limits: ArchiveLimits
  onImported: () => Promise<void>
  onReload: () => Promise<void>
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [parsedFile, setParsedFile] = useState<ParsedQuoteFile | null>(null)
  const [sheetIndex, setSheetIndex] = useState(0)
  const [headerRowIndex, setHeaderRowIndex] = useState(0)
  const [mapping, setMapping] = useState<QuoteFieldMapping>(() => (
    Object.fromEntries(quoteFieldKeys.map((key) => [key, null])) as QuoteFieldMapping
  ))
  const [versionLabel, setVersionLabel] = useState('')
  const [materialConsent, setMaterialConsent] = useState(false)
  const [status, setStatus] = useState<ImportStatus>('idle')
  const [error, setError] = useState('')
  const [uploadRequestKey, setUploadRequestKey] = useState<string | null>(null)
  const [reloading, setReloading] = useState(false)

  const sheet = parsedFile?.sheets[sheetIndex] ?? null
  const headers = sheet?.rows[headerRowIndex] ?? []
  const rows = useMemo(() => (
    sheet ? mapQuoteRows({ sheet, headerRowIndex, mapping }) : []
  ), [headerRowIndex, mapping, sheet])
  const versionLimitReached = archive.quoteVersions.length >= limits.versionsPerArchive

  useEffect(() => {
    if (!sheet) return
    const detected = detectQuoteLayout(sheet.rows)
    setHeaderRowIndex(detected.headerRowIndex)
    setMapping(detected.mapping)
  }, [sheet])

  function rejectFile(message: string) {
    setFile(null)
    setParsedFile(null)
    setMaterialConsent(false)
    setStatus('idle')
    setUploadRequestKey(null)
    setError(message)
  }

  async function handleFile(selected: File | null) {
    if (!selected) return
    if (versionLimitReached) {
      rejectFile(`当前档案最多保存 ${limits.versionsPerArchive} 个报价版本。`)
      return
    }
    if (archive.assets.length >= limits.filesPerArchive) {
      rejectFile(`当前档案最多保存 ${limits.filesPerArchive} 份文件。`)
      return
    }
    if (selected.size > MAX_QUOTE_IMPORT_BYTES) {
      rejectFile('文件超过 10 MB，请先精简后再上传。')
      return
    }
    const usedBytes = archive.assets.reduce((sum, asset) => sum + asset.sizeBytes, 0)
    if (usedBytes + selected.size > limits.totalBytesPerArchive) {
      rejectFile('该文件会使档案总量超过 50 MB，请先精简后再上传。')
      return
    }
    if (!/\.(csv|xlsx)$/i.test(selected.name)) {
      rejectFile('目前只支持 CSV 和 XLSX 文件。')
      return
    }

    setStatus('parsing')
    setError('')
    setUploadRequestKey(null)
    setFile(selected)
    setParsedFile(null)
    setMaterialConsent(false)
    try {
      const parsed = await parseQuoteFile(selected)
      if (parsed.sheets.length === 0) throw new Error('文件中没有可读取的工作表。')
      setParsedFile(parsed)
      setSheetIndex(0)
      setVersionLabel(defaultVersionLabel(selected.name))
      const detected = detectQuoteLayout(parsed.sheets[0].rows)
      setHeaderRowIndex(detected.headerRowIndex)
      setMapping(detected.mapping)
      setStatus('idle')
    } catch (parseError) {
      setError(parseError instanceof Error ? parseError.message : '文件读取失败。')
      setFile(null)
      setStatus('idle')
    }
  }

  function handleHeaderRow(nextIndex: number) {
    if (!sheet) return
    setHeaderRowIndex(nextIndex)
    setMapping(detectQuoteLayout(sheet.rows.slice(nextIndex, nextIndex + 1)).mapping)
  }

  async function handleImport() {
    if (status === 'success') return
    if (!file || !parsedFile || !sheet) return
    if (mapping.itemName === null) {
      setError('请先指定“项目名称”所在列。')
      return
    }
    if (rows.length === 0) {
      setError('当前映射没有得到可导入的报价条目，请检查表头和字段。')
      return
    }
    if (rows.length > MAX_QUOTE_ITEMS_PER_VERSION) {
      setError(`单个版本最多导入 ${MAX_QUOTE_ITEMS_PER_VERSION} 条报价，请先精简文件。`)
      return
    }
    if (!versionLabel.trim()) {
      setError('请给这一版报价填写名称。')
      return
    }
    if (!materialConsent) {
      setError('请先确认你有权处理该材料，并已移除不必要的敏感信息。')
      return
    }

    setError('')
    let ticket: Awaited<ReturnType<typeof requestArchiveUpload>> | null = null
    let versionCreated = false
    let fileUploaded = false
    let createdVersionNumber = 0
    const idempotencyKey = uploadRequestKey ?? crypto.randomUUID()
    setUploadRequestKey(idempotencyKey)
    try {
      setStatus('uploading')
      ticket = await requestArchiveUpload({
        archiveId: archive.id,
        file,
        idempotencyKey,
      })
      await uploadArchiveFile(file, ticket)
      fileUploaded = true
      setStatus('saving')
      const created = await createQuoteVersion({
        archiveId: archive.id,
        ticket,
        label: versionLabel.trim(),
        rows,
      })
      versionCreated = true
      createdVersionNumber = created.quoteVersion.versionNumber
    } catch (uploadError) {
      if (ticket && fileUploaded && uploadError instanceof TypeError) {
        // Both idempotent save attempts lost their response. The transaction
        // may already have committed, so do not delete the source asset or let
        // the user submit another version until the archive is reloaded.
        setStatus('success')
        setError('网络在保存结果返回前中断。版本可能已经建立，请重新读取装修档案，不要重复上传。')
        return
      }
      if (ticket && !versionCreated) {
        let cancelled = false
        try {
          await cancelArchiveUpload(archive.id, ticket.upload.assetId)
          cancelled = true
        } catch {
          // Keep the same idempotency key after an uncertain cancellation so
          // a retry cannot silently consume another reservation.
        }
        if (cancelled) setUploadRequestKey(null)
      } else if (!(uploadError instanceof TypeError)) {
        // Keep the key only for a genuine network ambiguity. An HTTP failure
        // has a deterministic server result and the next attempt should use a
        // fresh reservation key.
        setUploadRequestKey(null)
      }
      setError(uploadError instanceof Error ? uploadError.message : '导入没有完成，请重试。')
      setStatus('idle')
      return
    }

    trackRenovationArchiveEvent('renovation_archive_upload_complete', {
      versionNumber: createdVersionNumber,
      isSecondVersion: createdVersionNumber === 2,
      rowCount: rows.length,
    })
    setStatus('success')
    try {
      await onImported()
    } catch {
      setError('报价版本已建立，但页面没有刷新。请重新打开装修档案，不要重复上传。')
    }
  }

  const busy = status === 'parsing' || status === 'uploading' || status === 'saving'
  const importLocked = status === 'success'

  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone">导入报价</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">先核对字段，再保存为一个版本。</h2>
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          程序只负责提取表格，不判断价格合理性。原文件会保存在你的私人档案中；字段映射和预览确认后，才会建立报价版本。
        </p>
      </header>

      <section className="border border-border bg-surface p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone">Step 1</p>
            <h3 className="mt-1 text-lg font-semibold text-ink">选择 CSV 或 XLSX</h3>
            <p className="mt-1 text-xs leading-6 text-ink-muted">文件不会发送给聊天模型。</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={(event) => {
              const selected = event.currentTarget.files?.[0] ?? null
              event.currentTarget.value = ''
              void handleFile(selected)
            }}
            className="sr-only"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={busy || importLocked || versionLimitReached}
            className="motion-press inline-flex min-h-11 w-full items-center justify-center gap-2 border border-stone bg-canvas px-5 text-sm font-semibold text-stone hover:bg-stone-pale disabled:opacity-50 sm:w-auto"
          >
            <UploadSimple size={17} aria-hidden />
            {file ? '重新选择文件' : '选择文件'}
          </button>
        </div>

        {versionLimitReached && (
          <p className="mt-5 border-l-2 border-stone bg-surface-warm px-3 py-2 text-sm leading-6 text-ink-muted" role="status">
            当前档案已保存 {limits.versionsPerArchive} 个报价版本，不能继续导入。
          </p>
        )}

        {file && (
          <div className="mt-5 flex min-w-0 items-center gap-3 border border-border bg-canvas p-4">
            {file.name.toLowerCase().endsWith('.csv')
              ? <FileCsv size={24} weight="duotone" className="shrink-0 text-stone" aria-hidden />
              : <FileXls size={24} weight="duotone" className="shrink-0 text-stone" aria-hidden />}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{file.name}</p>
              <p className="mt-0.5 text-xs text-ink-faint">{(file.size / 1024).toLocaleString('zh-CN', { maximumFractionDigits: 1 })} KB</p>
            </div>
            {status === 'parsing' && <SpinnerGap size={18} className="ml-auto animate-spin text-stone" aria-label="正在读取" />}
          </div>
        )}
      </section>

      {parsedFile && sheet && (
        <>
          <section className="border border-border bg-surface p-5 sm:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone">Step 2</p>
              <h3 className="mt-1 text-lg font-semibold text-ink">检查工作表和字段映射</h3>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {parsedFile.sheets.length > 1 && (
                <label className="text-sm font-medium text-ink">
                  工作表
                  <select
                    value={sheetIndex}
                    onChange={(event) => setSheetIndex(Number(event.target.value))}
                    className="mt-2 min-h-11 w-full border border-border bg-canvas px-3 text-sm outline-none focus:border-stone"
                  >
                    {parsedFile.sheets.map((item, index) => (
                      <option key={`${item.name}-${index}`} value={index}>{item.name} · {item.rows.length} 行</option>
                    ))}
                  </select>
                </label>
              )}
              <label className="text-sm font-medium text-ink">
                表头所在行
                <select
                  value={headerRowIndex}
                  onChange={(event) => handleHeaderRow(Number(event.target.value))}
                  className="mt-2 min-h-11 w-full border border-border bg-canvas px-3 text-sm outline-none focus:border-stone"
                >
                  {sheet.rows.slice(0, 12).map((row, index) => (
                    <option key={index} value={index}>第 {index + 1} 行 · {row.filter(Boolean).slice(0, 3).join(' / ') || '空行'}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quoteFieldKeys.map((key) => (
                <label key={key} className="text-sm font-medium text-ink">
                  {fieldLabels[key].label}{fieldLabels[key].required && <span className="ml-1 text-stone">*</span>}
                  <select
                    value={mapping[key] ?? ''}
                    onChange={(event) => setMapping((current) => ({
                      ...current,
                      [key]: event.target.value === '' ? null : Number(event.target.value),
                    }))}
                    className="mt-2 min-h-11 w-full min-w-0 border border-border bg-canvas px-3 text-sm outline-none focus:border-stone"
                  >
                    <option value="">不导入</option>
                    {headers.map((header, column) => (
                      <option key={`${column}-${header}`} value={column}>
                        {header || `第 ${column + 1} 列`}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </section>

          <section className="border border-border bg-surface p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone">Step 3</p>
                <h3 className="mt-1 text-lg font-semibold text-ink">预览 {rows.length} 条报价</h3>
                <p className="mt-1 text-xs leading-6 text-ink-muted">这里只展示前 8 条；导入后可以逐项修改。</p>
              </div>
              <label className="w-full text-sm font-medium text-ink sm:max-w-xs">
                版本名称
                <input
                  value={versionLabel}
                  onChange={(event) => setVersionLabel(event.target.value)}
                  maxLength={100}
                  className="mt-2 min-h-11 w-full border border-border bg-canvas px-3 text-sm outline-none focus:border-stone"
                />
              </label>
            </div>

            <div className="mt-6 hidden overflow-x-auto border border-border md:block">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-surface-warm text-xs text-ink-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold">分类</th>
                    <th className="px-4 py-3 font-semibold">项目</th>
                    <th className="px-4 py-3 font-semibold">规格 / 工艺</th>
                    <th className="px-4 py-3 text-right font-semibold">数量</th>
                    <th className="px-4 py-3 text-right font-semibold">金额</th>
                    <th className="px-4 py-3 font-semibold">来源</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.slice(0, 8).map((row) => (
                    <tr key={`${sheet.name}-${row.sourceRow}`} className="bg-canvas align-top">
                      <td className="px-4 py-3 text-ink-muted">{row.section || '未分类'}</td>
                      <td className="px-4 py-3 font-medium text-ink">{row.itemName}</td>
                      <td className="max-w-[18rem] px-4 py-3 text-ink-muted">{row.materialSpec || '-'}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-ink-muted">{row.quantity ?? '-'} {row.unit}</td>
                      <td className="px-4 py-3 text-right font-medium tabular-nums text-ink">{row.amountCents == null ? '-' : `${(row.amountCents / 100).toLocaleString()} 元`}</td>
                      <td className="px-4 py-3 text-xs text-ink-faint">{sheet.name} · {row.sourceRow}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid gap-3 md:hidden">
              {rows.slice(0, 8).map((row) => (
                <article key={`${sheet.name}-${row.sourceRow}`} className="border border-border bg-canvas p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-stone">{row.section || '未分类'}</p>
                      <h4 className="mt-1 break-words text-sm font-semibold text-ink">{row.itemName}</h4>
                    </div>
                    <p className="shrink-0 text-sm font-semibold tabular-nums text-ink">{row.amountCents == null ? '-' : `${(row.amountCents / 100).toLocaleString()} 元`}</p>
                  </div>
                  {row.materialSpec && <p className="mt-2 text-xs leading-5 text-ink-muted">{row.materialSpec}</p>}
                  <p className="mt-3 text-xs text-ink-faint">第 {row.sourceRow} 行 · 自动提取</p>
                </article>
              ))}
            </div>

            <label className="mt-6 flex cursor-pointer items-start gap-3 border-t border-border pt-5 text-xs leading-6 text-ink-muted">
              <input
                type="checkbox"
                checked={materialConsent}
                onChange={(event) => setMaterialConsent(event.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-stone"
              />
              <span>
                我有权处理该材料，已移除不必要的身份证、银行卡、门锁密码、精确住址等敏感信息。详见{' '}
                <Link href="/privacy" target="_blank" rel="noreferrer" className="font-semibold text-stone underline underline-offset-2">
                  隐私说明
                </Link>
                。
              </span>
            </label>

            {error && (
              <p className="mt-5 flex items-start gap-2 border-l-2 border-stone bg-surface-warm px-3 py-2 text-sm leading-6 text-ink-muted" role="alert">
                <WarningCircle size={17} className="mt-1 shrink-0 text-stone" aria-hidden />
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-6 text-ink-muted" aria-live="polite">
                {status === 'uploading' && '正在上传原文件…'}
                {status === 'saving' && '原文件已上传，正在建立报价版本…'}
                {status === 'success' && (error ? '请先重新读取档案。' : '报价版本已建立。')}
                {status === 'idle' && '提交后仍标记为“自动提取”，需要你逐项确认。'}
              </p>
              <button
                type="button"
                onClick={() => void handleImport()}
                disabled={busy || importLocked || rows.length === 0 || mapping.itemName === null || !materialConsent}
                className="motion-press inline-flex min-h-11 w-full items-center justify-center gap-2 bg-stone px-5 text-sm font-semibold text-white hover:bg-stone/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {busy ? <SpinnerGap size={17} className="animate-spin" aria-hidden /> : <CheckCircle size={17} aria-hidden />}
                {busy ? '正在导入' : importLocked ? (error ? '等待重新读取' : '已建立版本') : '上传并建立版本'}
                {!busy && !importLocked && <ArrowRight size={16} aria-hidden />}
              </button>
              {importLocked && error && (
                <button
                  type="button"
                  disabled={reloading}
                  onClick={async () => {
                    setReloading(true)
                    try {
                      await onReload()
                    } catch (reloadError) {
                      setError(reloadError instanceof Error ? reloadError.message : '档案仍未能刷新，请稍后重试。')
                    } finally {
                      setReloading(false)
                    }
                  }}
                  className="inline-flex min-h-11 w-full items-center justify-center border border-border px-4 text-sm font-semibold text-ink hover:border-stone disabled:opacity-50 sm:w-auto"
                >
                  {reloading ? '正在读取' : '重新读取档案'}
                </button>
              )}
            </div>
          </section>
        </>
      )}

      {error && !parsedFile && (
        <p className="flex items-start gap-2 border-l-2 border-stone bg-surface-warm px-4 py-3 text-sm leading-6 text-ink-muted" role="alert">
          <WarningCircle size={17} className="mt-1 shrink-0 text-stone" aria-hidden />
          {error}
        </p>
      )}
    </div>
  )
}
