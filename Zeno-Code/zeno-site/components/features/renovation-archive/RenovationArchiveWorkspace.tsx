'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ChartDonut,
  FileArrowUp,
  FolderOpen,
  Gear,
  Plus,
  SpinnerGap,
  Stack,
  Trash,
  WarningCircle,
} from '@phosphor-icons/react'
import {
  createRenovationArchive,
  deleteRenovationArchive,
  getRenovationArchive,
} from '@/lib/domains/renovation-archive/client-api'
import { trackRenovationArchiveEvent } from '@/lib/domains/renovation-archive/analytics'
import type {
  ArchiveLimits,
  RenovationArchive,
  RenovationQuoteVersion,
} from '@/lib/domains/renovation-archive/types'
import QuoteImportPanel from './QuoteImportPanel'
import ArchiveOverview from './ArchiveOverview'
import VersionDiffPanel from './VersionDiffPanel'

type WorkspaceTab = 'overview' | 'import' | 'compare' | 'settings'

const tabs: Array<{
  id: WorkspaceTab
  label: string
  icon: typeof ChartDonut
}> = [
  { id: 'overview', label: '预算总览', icon: ChartDonut },
  { id: 'import', label: '导入报价', icon: FileArrowUp },
  { id: 'compare', label: '版本对照', icon: Stack },
  { id: 'settings', label: '档案设置', icon: Gear },
]

const defaultLimits: ArchiveLimits = {
  archives: 1,
  versionsPerArchive: 2,
  filesPerArchive: 10,
  totalBytesPerArchive: 50 * 1024 * 1024,
}

function sortVersions(versions: RenovationQuoteVersion[]) {
  return [...versions].sort((left, right) => (
    new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  ))
}

export default function RenovationArchiveWorkspace() {
  const [archive, setArchive] = useState<RenovationArchive | null>(null)
  const [limits, setLimits] = useState<ArchiveLimits>(defaultLimits)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [archiveName, setArchiveName] = useState('我的装修档案')
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview')
  const [selectedVersionId, setSelectedVersionId] = useState('')
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const refreshArchive = useCallback(async (throwOnError = false) => {
    setLoadError('')
    try {
      const data = await getRenovationArchive()
      setArchive(data.archive)
      setLimits(data.limits)
      if (data.archive?.quoteVersions.length) {
        const versions = sortVersions(data.archive.quoteVersions)
        setSelectedVersionId((current) => (
          versions.some((version) => version.id === current) ? current : versions[0].id
        ))
      } else {
        setSelectedVersionId('')
      }
    } catch (error) {
      if (!throwOnError) {
        setLoadError(error instanceof Error ? error.message : '装修档案暂时无法读取。')
      }
      if (throwOnError) throw error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshArchive()
  }, [refreshArchive])

  const versions = useMemo(
    () => sortVersions(archive?.quoteVersions ?? []),
    [archive?.quoteVersions],
  )
  const selectedVersion = versions.find((version) => version.id === selectedVersionId)
    ?? versions[0]
    ?? null

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = archiveName.trim()
    if (!name) {
      setCreateError('请先给档案起一个便于识别的名称。')
      return
    }

    setCreating(true)
    setCreateError('')
    try {
      const data = await createRenovationArchive(name)
      trackRenovationArchiveEvent('renovation_archive_create', { source: 'workspace' })
      setArchive(data.archive)
      setLimits(data.limits)
      setActiveTab('import')
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : '档案创建失败，请稍后重试。')
    } finally {
      setCreating(false)
    }
  }

  async function handleDeleteArchive() {
    if (!archive || deleteConfirmation !== '删除档案') return
    setDeleting(true)
    setDeleteError('')
    try {
      await deleteRenovationArchive(archive.id)
      setArchive(null)
      setSelectedVersionId('')
      setDeleteConfirmation('')
      setActiveTab('overview')
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : '档案没有删除，请重试。')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-[70dvh] bg-canvas px-5 py-16 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center gap-3 text-sm text-ink-muted" role="status">
          <SpinnerGap size={20} className="animate-spin text-stone" aria-hidden />
          正在读取你的装修档案
        </div>
      </main>
    )
  }

  if (loadError) {
    return (
      <main className="min-h-[70dvh] bg-canvas px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-xl border border-border bg-surface p-6">
          <WarningCircle size={24} className="text-stone" aria-hidden />
          <h1 className="mt-4 text-xl font-semibold text-ink">装修档案暂时没有打开</h1>
          <p className="mt-2 text-sm leading-7 text-ink-muted">{loadError}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true)
              void refreshArchive()
            }}
            className="motion-press mt-5 inline-flex min-h-11 items-center bg-stone px-5 text-sm font-semibold text-white hover:bg-stone/90"
          >
            重新读取
          </button>
        </div>
      </main>
    )
  }

  if (!archive) {
    return (
      <main className="min-h-screen bg-canvas text-ink">
        <section className="border-b border-border bg-surface-warm">
          <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
            <Link href="/account" className="inline-flex min-h-11 items-center gap-2 text-sm text-ink-muted hover:text-ink">
              <ArrowLeft size={16} aria-hidden />
              返回个人中心
            </Link>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-stone">我的装修档案</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-ink sm:text-5xl">
              把每一版报价放在同一个地方对照。
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-ink-muted">
              创建一个私人档案，导入 CSV 或 XLSX 报价，核对自动提取的字段，再查看预算分类和版本变化。自动提取不等于人工审核。
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.62fr_0.38fr]">
          <form onSubmit={handleCreate} className="border border-border bg-surface p-5 sm:p-7">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-stone text-white">
                <FolderOpen size={21} weight="duotone" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone">第一步</p>
                <h2 className="mt-1 text-xl font-semibold text-ink">创建一个装修档案</h2>
              </div>
            </div>

            <label className="mt-7 block text-sm font-medium text-ink">
              档案名称
              <input
                value={archiveName}
                onChange={(event) => setArchiveName(event.target.value)}
                maxLength={80}
                className="mt-2 min-h-11 w-full border border-border bg-canvas px-3 text-sm outline-none placeholder:text-ink-faint focus:border-stone"
                placeholder="例如：南宁新家装修"
              />
            </label>

            {createError && (
              <p className="mt-4 border-l-2 border-stone bg-surface-warm px-3 py-2 text-sm leading-6 text-ink-muted" role="alert">
                {createError}
              </p>
            )}

            <button
              type="submit"
              disabled={creating}
              className="motion-press mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-stone px-5 text-sm font-semibold text-white hover:bg-stone/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {creating ? <SpinnerGap size={17} className="animate-spin" aria-hidden /> : <Plus size={17} aria-hidden />}
              {creating ? '正在创建' : '创建档案'}
            </button>
          </form>

          <aside className="border-l-2 border-stone-light pl-5">
            <h2 className="text-sm font-semibold text-ink">当前只建一个档案</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-ink-muted">
              <li>原文件先上传到你的私人档案。</li>
              <li>字段由程序自动提取，你可以逐项修改。</li>
              <li>只有你主动确认后，才显示“客户已确认”。</li>
              <li>需要 Zeno 人工判断时，另行进入报价审核服务。</li>
            </ul>
          </aside>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <section className="border-b border-border bg-surface-warm">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
          <Link href="/account" className="inline-flex min-h-11 items-center gap-2 text-sm text-ink-muted hover:text-ink">
            <ArrowLeft size={16} aria-hidden />
            返回个人中心
          </Link>
          <div className="mt-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone">我的装修档案</p>
              <h1 className="mt-2 break-words text-3xl font-semibold leading-tight text-ink sm:text-4xl">{archive.title}</h1>
              <p className="mt-2 text-sm leading-6 text-ink-muted">
                {versions.length} 个报价版本 · {archive.assets.length} 份原始文件
              </p>
            </div>
            {selectedVersion && (
              <Link
                href={`/services/quote-review?archiveId=${encodeURIComponent(archive.id)}&versionId=${encodeURIComponent(selectedVersion.id)}`}
                onClick={() => trackRenovationArchiveEvent('renovation_archive_review_click', {
                  source: 'workspace_header',
                })}
                className="motion-press inline-flex min-h-11 w-full items-center justify-center bg-stone px-5 text-sm font-semibold text-white hover:bg-stone/90 md:w-auto"
              >
                申请 Zeno 人工审核
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
        <nav className="grid grid-cols-4 border border-border bg-surface" aria-label="装修档案功能">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id)
                  if (tab.id === 'compare') {
                    trackRenovationArchiveEvent('renovation_archive_compare_view', {
                      versionCount: versions.length,
                    })
                  }
                }}
                aria-current={active ? 'page' : undefined}
                className={`motion-surface flex min-h-12 min-w-0 items-center justify-center gap-2 border-r border-border px-2 text-xs font-semibold last:border-r-0 sm:text-sm ${
                  active ? 'bg-stone text-white' : 'bg-surface text-ink-muted hover:bg-surface-warm hover:text-ink'
                }`}
              >
                <Icon size={17} weight="duotone" className="shrink-0" aria-hidden />
                <span className="truncate">{tab.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="mt-8">
          {activeTab === 'overview' && (
            <ArchiveOverview
              archive={archive}
              versions={versions}
              selectedVersion={selectedVersion}
              onSelectVersion={setSelectedVersionId}
              onRefresh={refreshArchive}
              onImport={() => setActiveTab('import')}
            />
          )}
          {activeTab === 'import' && (
            <QuoteImportPanel
              archive={archive}
              limits={limits}
              onImported={async () => {
                await refreshArchive(true)
                setActiveTab('overview')
              }}
              onReload={async () => {
                await refreshArchive(true)
                setActiveTab('overview')
              }}
            />
          )}
          {activeTab === 'compare' && (
            <VersionDiffPanel versions={versions} />
          )}
          {activeTab === 'settings' && (
            <section className="border border-border bg-surface p-5 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone">档案设置</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">删除整份装修档案</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-muted">
                申请删除后，档案会立即从账号中隐藏；原文件会先尝试清理，安全窗口结束后再由系统最终删除在线记录。清理失败会保留删除标记并自动重试。请输入“删除档案”确认本次操作。
              </p>

              <label className="mt-6 block max-w-md text-sm font-medium text-ink">
                确认文字
                <input
                  value={deleteConfirmation}
                  onChange={(event) => setDeleteConfirmation(event.target.value)}
                  disabled={deleting}
                  autoComplete="off"
                  placeholder="删除档案"
                  className="mt-2 min-h-11 w-full border border-border bg-canvas px-3 text-sm outline-none placeholder:text-ink-faint focus:border-stone disabled:opacity-60"
                />
              </label>

              {deleteError && (
                <p className="mt-4 flex items-start gap-2 border-l-2 border-stone bg-surface-warm px-3 py-2 text-sm leading-6 text-ink-muted" role="alert">
                  <WarningCircle size={17} className="mt-1 shrink-0 text-stone" aria-hidden />
                  {deleteError}
                </p>
              )}

              <button
                type="button"
                onClick={() => void handleDeleteArchive()}
                disabled={deleting || deleteConfirmation !== '删除档案'}
                className="motion-press mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 border border-stone bg-canvas px-5 text-sm font-semibold text-stone hover:bg-surface-warm disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
              >
                {deleting ? <SpinnerGap size={17} className="animate-spin" aria-hidden /> : <Trash size={17} aria-hidden />}
                {deleting ? '正在申请删除' : '申请删除档案'}
              </button>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
