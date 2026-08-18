'use client'

import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle,
  FileText,
  WarningCircle,
} from '@phosphor-icons/react'
import { trackAssistantEvent } from '@/lib/assistant/analytics'

interface ServiceCardProps {
  onNavigate?: () => void
}

const deliverables = [
  '逐项整理待确认项',
  '形成可直接使用的追问',
  '给出报价与合同的修改方向',
]

export default function ServiceCard({ onNavigate }: ServiceCardProps) {
  return (
    <article
      aria-label="报价与合同人工审查"
      className="w-full min-w-0 rounded-[4px] border border-border bg-surface p-4 text-ink sm:p-5"
    >
      <div className="flex min-w-0 items-start gap-3">
        <FileText size={22} weight="duotone" className="mt-0.5 shrink-0 text-stone" aria-hidden />
        <div className="min-w-0">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-stone">人工审查</p>
          <h3 className="mt-1 break-words text-base font-semibold leading-6 text-ink">由 Zeno 本人按确认范围完成</h3>
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-ink-muted">
        结合双方确认的材料和范围，人工审查装修报价与合同。
      </p>

      <ul className="mt-4 grid gap-2.5">
        {deliverables.map((deliverable) => (
          <li key={deliverable} className="flex min-w-0 items-start gap-2.5 text-sm leading-6 text-ink-muted">
            <CheckCircle size={17} weight="duotone" className="mt-1 shrink-0 text-stone" aria-hidden />
            <span className="min-w-0 break-words">{deliverable}</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 flex items-start gap-2 border-l-2 border-stone-light pl-3 text-xs leading-5 text-ink-muted">
        <WarningCircle size={16} className="mt-0.5 shrink-0 text-stone" aria-hidden />
        <span>不替代现场监理、造价或法律意见。</span>
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link
          href="/services/quote-review"
          onClick={() => {
            trackAssistantEvent('ai_service_click', {
              destination: '/services/quote-review',
              action: 'review_scope',
            })
            onNavigate?.()
          }}
          className="motion-press inline-flex min-h-11 w-full min-w-0 items-center justify-between gap-2 rounded-[3px] bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-stone-deep"
        >
          <span className="break-words">查看人工审查范围</span>
          <ArrowRight size={16} className="shrink-0" aria-hidden />
        </Link>
        <Link
          href="/contact"
          onClick={() => {
            trackAssistantEvent('ai_service_click', {
              destination: '/contact',
              action: 'contact',
            })
            onNavigate?.()
          }}
          className="motion-press inline-flex min-h-11 w-full min-w-0 items-center justify-between gap-2 rounded-[3px] border border-border bg-canvas px-4 py-2.5 text-sm font-semibold text-ink hover:border-stone"
        >
          <span className="break-words">联系 Zeno</span>
          <ArrowRight size={16} className="shrink-0" aria-hidden />
        </Link>
      </div>
    </article>
  )
}
