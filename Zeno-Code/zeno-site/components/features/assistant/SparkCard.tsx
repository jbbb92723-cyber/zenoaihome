'use client'

import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Handshake,
  UsersThree,
} from '@phosphor-icons/react'

interface SparkCardProps {
  onNavigate?: () => void
}

const benefits = [
  { label: '技能读书会与项目复盘', icon: BookOpen },
  { label: '带上下文的成员连接', icon: UsersThree },
  { label: '合适项目的协作参与机会', icon: Handshake },
]

export default function SparkCard({ onNavigate }: SparkCardProps) {
  return (
    <article
      aria-label="星火者共同体"
      className="w-full min-w-0 rounded-[4px] border border-border bg-surface-warm/55 p-4 text-ink sm:p-5"
    >
      <div className="flex min-w-0 items-start gap-3">
        <UsersThree size={22} weight="duotone" className="mt-0.5 shrink-0 text-stone" aria-hidden />
        <div className="min-w-0">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-stone">星火者共同体</p>
          <h3 className="mt-1 break-words text-base font-semibold leading-6 text-ink">申请制实践共同体</h3>
        </div>
      </div>

      <ul className="mt-4 grid gap-2.5">
        {benefits.map((benefit) => {
          const Icon = benefit.icon
          return (
            <li key={benefit.label} className="flex min-w-0 items-start gap-2.5 text-sm leading-6 text-ink-muted">
              <Icon size={17} weight="duotone" className="mt-1 shrink-0 text-stone" aria-hidden />
              <span className="min-w-0 break-words">{benefit.label}</span>
            </li>
          )
        })}
      </ul>

      <p className="mt-4 border-l-2 border-stone-light pl-3 text-xs leading-5 text-ink-muted">
        提供连接与协作机会，不保证客户派单或任何结果。
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link
          href="/community/apply"
          onClick={() => onNavigate?.()}
          className="motion-press inline-flex min-h-11 w-full min-w-0 items-center justify-between gap-2 rounded-[3px] bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-stone-deep"
        >
          <span className="break-words">提交成员申请</span>
          <ArrowRight size={16} className="shrink-0" aria-hidden />
        </Link>
        <Link
          href="/community"
          onClick={() => onNavigate?.()}
          className="motion-press inline-flex min-h-11 w-full min-w-0 items-center justify-between gap-2 rounded-[3px] border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink hover:border-stone"
        >
          <span className="break-words">先了解共同体</span>
          <ArrowRight size={16} className="shrink-0" aria-hidden />
        </Link>
      </div>
    </article>
  )
}
