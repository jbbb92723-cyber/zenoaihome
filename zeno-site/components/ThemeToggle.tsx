'use client'

import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

/**
 * 主题切换按钮
 *
 * 设计：单按钮循环 light → eye → dark，配对应图标。
 * 与 LanguageToggle 视觉对齐。
 */

const ORDER = ['light', 'eye', 'dark'] as const
type ThemeKey = (typeof ORDER)[number]

const META: Record<ThemeKey, { zhLabel: string; enLabel: string; zhNext: string; enNext: string }> = {
  light: { zhLabel: '亮色', enLabel: 'Light', zhNext: '切换到护眼模式', enNext: 'Switch to eye-comfort mode' },
  eye:   { zhLabel: '护眼', enLabel: 'Eye',   zhNext: '切换到暗色模式', enNext: 'Switch to dark mode' },
  dark:  { zhLabel: '暗色', enLabel: 'Dark',  zhNext: '切换到亮色模式', enNext: 'Switch to light mode' },
}

function getNext(current: ThemeKey): ThemeKey {
  const idx = ORDER.indexOf(current)
  return ORDER[(idx + 1) % ORDER.length]
}

function Icon({ theme }: { theme: ThemeKey }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: 'w-3.5 h-3.5',
    'aria-hidden': true,
  }

  if (theme === 'light') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    )
  }

  if (theme === 'dark') {
    return (
      <svg {...common}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  )
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const isEn = pathname.startsWith('/en')

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="h-7 w-[4.25rem]" aria-hidden />
  }

  const current = ((ORDER as readonly string[]).includes(theme ?? '')
    ? theme
    : 'light') as ThemeKey
  const next = getNext(current)
  const meta = META[current]
  const label = isEn ? meta.enLabel : meta.zhLabel
  const nextTitle = isEn ? meta.enNext : meta.zhNext

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      title={nextTitle}
      aria-label={nextTitle}
      className="group inline-flex items-center gap-1.5 h-7 px-2.5 border border-border rounded-full text-[0.6875rem] font-medium text-ink-muted hover:text-ink hover:border-stone/50 transition-all duration-150"
    >
      <Icon theme={current} />
      <span className="leading-none">{label}</span>
    </button>
  )
}
