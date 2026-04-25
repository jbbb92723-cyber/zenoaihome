'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const THEMES = [
  { key: 'light', label: '亮', title: '亮色模式' },
  { key: 'eye',   label: '护', title: '护眼模式' },
  { key: 'dark',  label: '暗', title: '暗色模式' },
] as const

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="w-[4.5rem] h-5" aria-hidden />
  }

  return (
    <div
      className="flex items-center border border-border rounded-sm overflow-hidden text-[0.6875rem] font-medium leading-none"
      role="group"
      aria-label="切换主题"
    >
      {THEMES.map((t) => (
        <button
          key={t.key}
          onClick={() => setTheme(t.key)}
          title={t.title}
          aria-pressed={theme === t.key}
          className={`px-2 py-0.5 transition-colors ${
            theme === t.key
              ? 'bg-surface-warm text-ink cursor-default'
              : 'text-ink-faint hover:text-ink'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
