'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageToggle from '@/components/LanguageToggle'
import { primaryNav } from '@/lib/navigation'

/* ─── 搜索触发（派发 Ctrl+K 打开 SearchDialog） ─── */
function triggerSearch() {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
}

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 管理后台使用独立布局，隐藏全站导航
  if (pathname.startsWith('/admin')) return null

  const isEn = pathname.startsWith('/en')
  const logoHref = isEn ? '/en' : '/'
  const loginLabel = isEn ? 'Log in' : '登录'
  const loginHref = isEn ? '/en/login' : '/login'

  /* 桌面 mega menu 鼠标交互 */
  const handleMenuEnter = (key: string) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    setActiveMenu(key)
  }
  const handleMenuLeave = () => {
    closeTimerRef.current = setTimeout(() => setActiveMenu(null), 150)
  }

  /* 路由变化时关闭菜单 */
  useEffect(() => { setMenuOpen(false); setActiveMenu(null) }, [pathname])

  /* 移动端 body scroll lock */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navItems = primaryNav.map((item) => ({
    ...item,
    label: isEn ? item.en.label : item.zh.label,
    href: isEn ? item.en.href : item.zh.href,
    children: item.children?.map((c) => ({
      ...c,
      label: isEn ? c.en.label : c.zh.label,
      href: isEn ? c.en.href : c.zh.href,
      desc: isEn ? c.en.desc : c.zh.desc,
    })),
  }))

  return (
    <header className="sticky top-0 z-40 bg-canvas/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link
            href={logoHref}
            className="text-ink font-semibold text-[0.9375rem] tracking-tight hover:text-stone transition-colors shrink-0"
          >
            ZenoAIHome
          </Link>

          {/* ─── Desktop Nav with Mega Menu ─── */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.key}
                className="relative"
                onMouseEnter={() => item.children && handleMenuEnter(item.key)}
                onMouseLeave={handleMenuLeave}
              >
                <Link
                  href={item.href}
                  className={`px-3 py-2 text-[0.8125rem] whitespace-nowrap transition-colors rounded-sm ${
                    pathname.startsWith(item.href.split('#')[0]) && item.href !== '/' && item.href !== '/en'
                      ? 'text-stone font-semibold'
                      : 'text-ink-muted hover:text-ink hover:bg-surface-warm/50'
                  }`}
                >
                  {item.label}
                  {item.children && (
                    <svg className="inline-block w-3 h-3 ml-0.5 -mt-px opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>

                {/* Mega Menu Panel */}
                {item.children && activeMenu === item.key && (
                  <div
                    className="absolute top-full left-0 pt-2 z-50"
                    onMouseEnter={() => handleMenuEnter(item.key)}
                    onMouseLeave={handleMenuLeave}
                  >
                    <div className="w-[320px] bg-canvas border border-border shadow-lg p-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.key}
                          href={child.href}
                          className="block px-3 py-2.5 rounded-sm hover:bg-surface-warm/60 transition-colors group"
                        >
                          <span className="text-sm text-ink group-hover:text-stone font-medium">{child.label}</span>
                          {child.desc && (
                            <span className="block text-xs text-ink-muted mt-0.5">{child.desc}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* ─── Desktop Utilities ─── */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Search icon */}
            <button
              onClick={triggerSearch}
              className="p-2 text-ink-muted hover:text-ink transition-colors"
              aria-label={isEn ? 'Search' : '搜索'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <LanguageToggle />
            <ThemeToggle />

            <Link
              href={loginHref}
              className={`ml-1 px-3 py-1.5 text-[0.8125rem] border border-border rounded-sm transition-colors ${
                pathname.startsWith('/account') || pathname === '/login' || pathname === '/en/login'
                  ? 'text-stone border-stone/30 font-semibold'
                  : 'text-ink-muted hover:text-ink hover:border-ink/20'
              }`}
            >
              {loginLabel}
            </Link>
          </div>

          {/* ─── Mobile: Search + Hamburger ─── */}
          <div className="flex lg:hidden items-center gap-1">
            <button
              onClick={triggerSearch}
              className="p-2 text-ink-muted hover:text-ink transition-colors"
              aria-label={isEn ? 'Search' : '搜索'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
              aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
              aria-expanded={menuOpen}
            >
              <span className={`block w-[18px] h-[1.5px] bg-ink transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
              <span className={`block w-[18px] h-[1.5px] bg-ink transition-all duration-150 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-[18px] h-[1.5px] bg-ink transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Mobile Full-screen Menu ─── */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 top-14 z-40 bg-canvas overflow-y-auto">
          <nav className="max-w-6xl mx-auto px-5 py-4">
            {navItems.map((item) => (
              <MobileNavGroup key={item.key} item={item} onNavigate={() => setMenuOpen(false)} />
            ))}

            {/* Utilities */}
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <Link
                href={loginHref}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-ink-muted hover:text-ink transition-colors"
              >
                {loginLabel}
              </Link>
              <div className="flex items-center gap-2">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

/* ─── Mobile collapsible nav group ─── */
function MobileNavGroup({
  item,
  onNavigate,
}: {
  item: { key: string; label: string; href: string; children?: { key: string; label: string; href: string; desc?: string }[] }
  onNavigate: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  if (!item.children || item.children.length === 0) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className="block py-3 text-sm text-ink border-b border-border"
      >
        {item.label}
      </Link>
    )
  }

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between py-3 text-sm text-ink"
      >
        {item.label}
        <svg
          className={`w-3.5 h-3.5 text-ink-muted transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div className="pb-3 pl-3 space-y-1">
          <Link
            href={item.href}
            onClick={onNavigate}
            className="block py-2 text-sm text-stone font-medium"
          >
            概览
          </Link>
          {item.children.map((child) => (
            <Link
              key={child.key}
              href={child.href}
              onClick={onNavigate}
              className="block py-2 text-sm text-ink-muted hover:text-ink"
            >
              {child.label}
              {child.desc && <span className="block text-xs text-ink-faint mt-0.5">{child.desc}</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
