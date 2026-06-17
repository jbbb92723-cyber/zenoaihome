/**
 * components/layout/AdminLayout.tsx
 *
 * 统一后台布局：左侧导航 + 右侧内容区
 * 所有 admin 页面共用，不需要各自写导航。
 */

import type { ReactNode } from 'react'
import Link from 'next/link'

type AdminNavItem = {
  label: string
  href: string
  desc: string
}

const adminNav: AdminNavItem[] = [
  { label: '后台首页', href: '/admin', desc: '概览' },
  { label: '判断笔记', href: '/admin/notes', desc: '写/发/管笔记' },
  { label: '操作日志', href: '/admin/logs', desc: '谁在什么时候做了什么' },
  { label: '内容草稿', href: '/admin/content', desc: '飞书推送过来的草稿' },
]

const bottomNav: AdminNavItem[] = [
  { label: '← 回前台首页', href: '/', desc: '' },
]

export default function AdminLayout({ children, currentPath }: { children: ReactNode; currentPath: string }) {
  return (
    <div className="min-h-screen bg-canvas flex">
      {/* 侧边栏 */}
      <aside className="w-56 shrink-0 border-r border-border bg-surface-warm flex flex-col">
        <div className="px-5 py-5 border-b border-border">
          <Link href="/admin" className="text-sm font-semibold tracking-tight text-ink hover:text-stone transition-colors">
            ZenoAIHome 后台
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {adminNav.map(item => {
            const active = currentPath === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 text-sm transition-colors ${
                  active
                    ? 'bg-stone/10 text-stone font-medium'
                    : 'text-ink-muted hover:text-ink hover:bg-surface'
                }`}
              >
                <span>{item.label}</span>
                {item.desc && (
                  <span className="block text-[0.65rem] text-ink-faint mt-0.5">{item.desc}</span>
                )}
              </Link>
            )
          })}
        </nav>
        <div className="px-3 py-4 border-t border-border">
          {bottomNav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 text-xs text-ink-faint hover:text-ink transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  )
}
