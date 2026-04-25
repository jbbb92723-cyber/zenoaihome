'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getLangHref } from '@/lib/navigation'

/**
 * 语言切换分段按钮：[中文 | EN]
 * 当前语言高亮，另一语言为可点击链接。
 */
export default function LanguageToggle() {
  const pathname = usePathname()
  const isEn = pathname.startsWith('/en')
  const langHref = getLangHref(pathname, isEn)

  const activeClass = 'px-2 py-0.5 bg-surface-warm text-ink cursor-default select-none'
  const inactiveClass = 'px-2 py-0.5 text-ink-faint hover:text-ink transition-colors'

  return (
    <div
      className="flex items-center border border-border rounded-sm overflow-hidden text-[0.6875rem] font-medium leading-none"
      aria-label="语言切换"
    >
      {/* 中文 */}
      {isEn ? (
        <Link href={langHref} className={inactiveClass}>
          中文
        </Link>
      ) : (
        <span className={activeClass} aria-current="true">
          中文
        </span>
      )}

      <span className="w-px self-stretch bg-border" aria-hidden="true" />

      {/* EN */}
      {isEn ? (
        <span className={activeClass} aria-current="true">
          EN
        </span>
      ) : (
        <Link href={langHref} className={inactiveClass}>
          EN
        </Link>
      )}
    </div>
  )
}
