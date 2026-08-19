'use client'

import Link from 'next/link'
import {
  ArrowRight,
  ArrowsLeftRight,
  FolderOpen,
  ListChecks,
  UploadSimple,
} from '@phosphor-icons/react'
import { trackAssistantEvent } from '@/lib/assistant/analytics'

interface ArchiveCardProps {
  onNavigate?: () => void
}

const steps = [
  { label: '上传报价', detail: '保留原始资料', icon: UploadSimple },
  { label: '结构化预算', detail: '按项目整理金额', icon: ListChecks },
  { label: '版本对比', detail: '查看前后变化', icon: ArrowsLeftRight },
]

export default function ArchiveCard({ onNavigate }: ArchiveCardProps) {
  return (
    <article
      aria-label="我的装修档案"
      className="w-full min-w-0 rounded-[4px] border border-border bg-surface p-4 text-ink sm:p-5"
    >
      <div className="flex min-w-0 items-start gap-3">
        <FolderOpen size={22} weight="duotone" className="mt-0.5 shrink-0 text-stone" aria-hidden />
        <div className="min-w-0">
          <p className="text-[0.68rem] font-semibold uppercase text-stone">我的装修档案</p>
          <h3 className="mt-1 break-words text-base font-semibold leading-6 text-ink">把散落的报价留在同一处</h3>
        </div>
      </div>

      <ol className="mt-4 grid gap-2.5">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <li key={step.label} className="flex min-w-0 items-center gap-3 border-b border-border/70 pb-2.5 last:border-b-0 last:pb-0">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-border bg-canvas text-stone">
                <Icon size={16} weight="duotone" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-ink">{step.label}</span>
                <span className="block text-xs leading-5 text-ink-muted">{step.detail}</span>
              </span>
              <span className="shrink-0 font-mono text-[0.68rem] tabular-nums text-ink-faint">0{index + 1}</span>
            </li>
          )
        })}
      </ol>

      <p className="mt-4 border-l-2 border-stone-light pl-3 text-xs leading-5 text-ink-muted">
        首版只支持 CSV / XLSX。自动整理和版本对比用于管理资料，不等于 Zeno 人工审核。
      </p>

      <Link
        href="/account/renovation"
        onClick={() => {
          trackAssistantEvent('ai_archive_click', {
            destination: '/account/renovation',
            action: 'open_archive',
          })
          onNavigate?.()
        }}
        className="motion-press mt-4 inline-flex min-h-11 w-full min-w-0 items-center justify-between gap-2 rounded-[3px] bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-stone-deep"
      >
        <span className="break-words">打开我的装修档案</span>
        <ArrowRight size={16} className="shrink-0" aria-hidden />
      </Link>
    </article>
  )
}
