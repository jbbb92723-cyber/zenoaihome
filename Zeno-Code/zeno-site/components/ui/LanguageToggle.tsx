'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getLangHref } from '@/lib/navigation'

/**
 * 语言切换按钮
 *
 * 设计：单按钮 toggle，点击直接切到对方语言。
 * 视觉：地球图标 + 目标语言短标识，与 ThemeToggle 视觉对齐。
 */
export default function LanguageToggle() {
  const pathname = usePathname()
  const isEn = pathname.startsWith('/en')
  const langHref = getLangHref(pathname, isEn)
  const targetLabel = isEn ? '中文' : 'EN'
  const ariaLabel = isEn ? '切换到中文' : 'Switch to English'

  return (
    <Link
      href={langHref}
      aria-label={ariaLabel}
      title={ariaLabel}
      className="group inline-flex items-center gap-1.5 h-7 px-2.5 border border-border rounded-full text-[0.6875rem] font-medium text-ink-muted hover:text-ink hover:border-stone/50 transition-all duration-150"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3a13.5 13.5 0 0 1 0 18" />
        <path d="M12 3a13.5 13.5 0 0 0 0 18" />
      </svg>
      <span className="leading-none">{targetLabel}</span>
    </Link>
  )
}
