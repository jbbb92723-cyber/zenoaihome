'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageToggle from '@/components/LanguageToggle'
import { primaryNav } from '@/lib/navigation'

type LocalizedLeaf = {
  key: string
  label: string
  href: string
  desc?: string
}

type LocalizedGroup = {
  key: string
  label: string
  desc?: string
  items: LocalizedLeaf[]
}

type LocalizedPrimary = {
  key: string
  label: string
  href: string
  groups?: LocalizedGroup[]
}

function triggerSearch() {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, metaKey: true }))
}

function SearchIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isAdmin = pathname.startsWith('/admin')

  const isEn = pathname.startsWith('/en')
  const logoHref = isEn ? '/en' : '/'
  const loginLabel = isEn ? 'Log in' : '登录'
  const loginHref = isEn ? '/en/login' : '/login'
  const uploadHref = isEn ? '/en/tools' : '/tools/quote-check'
  const uploadLabel = isEn ? 'Start With Quote' : '先看报价'

  const navItems = useMemo<LocalizedPrimary[]>(() => primaryNav.map((item) => ({
    key: item.key,
    label: isEn ? item.en.label : item.zh.label,
    href: isEn ? item.en.href : item.zh.href,
    groups: item.groups?.map((group) => ({
      key: group.key,
      label: isEn ? group.en.label : group.zh.label,
      desc: isEn ? group.en.desc : group.zh.desc,
      items: group.items.map((leaf) => ({
        key: leaf.key,
        label: isEn ? leaf.en.label : leaf.zh.label,
        href: isEn ? leaf.en.href : leaf.zh.href,
        desc: isEn ? leaf.en.desc : leaf.zh.desc,
      })),
    })),
  })), [isEn])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setActiveMenu(null)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleMenuEnter = (key: string) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    setActiveMenu(key)
  }

  const handleMenuLeave = () => {
    closeTimerRef.current = setTimeout(() => setActiveMenu(null), 140)
  }

  const isActive = (href: string) => {
    const base = href.split('#')[0]
    if (base === '/' || base === '/en') return pathname === base
    return pathname.startsWith(base)
  }

  if (isAdmin) return null

  return (
    <header
      className={`sticky top-0 z-[90] border-b border-border bg-canvas transition-all duration-200 ${
        scrolled ? 'shadow-[0_10px_30px_rgba(42,39,35,0.05)]' : 'shadow-none'
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className={`flex items-center justify-between transition-all duration-200 ${scrolled ? 'h-14' : 'h-16'}`}>
          <Link
            href={logoHref}
            className="shrink-0 text-[0.9375rem] font-semibold tracking-tight text-ink transition-colors hover:text-stone"
          >
            ZenoAIHome
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label={isEn ? 'Primary navigation' : '主导航'}>
            {navItems.map((item) => (
              <div
                key={item.key}
                className="relative"
                onMouseEnter={() => item.groups && handleMenuEnter(item.key)}
                onMouseLeave={handleMenuLeave}
              >
                <Link
                  href={item.href}
                  onFocus={() => item.groups && setActiveMenu(item.key)}
                  className={`group/nav relative inline-flex items-center gap-1 px-3 py-2 text-sm transition-colors ${
                    isActive(item.href)
                      ? 'text-stone font-semibold'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.groups && (
                    <svg className={`h-3 w-3 opacity-50 transition-transform duration-200 ${activeMenu === item.key ? 'rotate-180' : 'group-hover/nav:translate-y-0.5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                  <span className={`absolute bottom-0 left-3 right-3 h-px origin-left bg-stone transition-transform duration-200 ${isActive(item.href) || activeMenu === item.key ? 'scale-x-100' : 'scale-x-0 group-hover/nav:scale-x-100'}`} />
                </Link>

                {item.groups && activeMenu === item.key && (
                  <>
                    <div className={`pointer-events-none fixed inset-x-0 bottom-0 z-[64] bg-canvas/80 backdrop-blur-sm ${scrolled ? 'top-14' : 'top-16'}`} />
                    <div
                      className={`fixed left-1/2 z-[70] -translate-x-1/2 pt-3 animate-menu-in ${scrolled ? 'top-14' : 'top-16'} ${item.groups.length === 1 ? 'w-[min(460px,calc(100vw-3rem))]' : 'w-[min(900px,calc(100vw-3rem))]'}`}
                      onMouseEnter={() => handleMenuEnter(item.key)}
                      onMouseLeave={handleMenuLeave}
                    >
                      <div className="border border-border/60 bg-canvas shadow-[0_20px_56px_rgba(42,39,35,0.15)]">
                        {/* top bar */}
                        <div className="flex items-center justify-between border-b border-border/50 px-6 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone">{item.label}</p>
                          <Link href={item.href} className="text-[11px] text-ink-faint transition-colors hover:text-stone">
                            {isEn ? 'View all →' : '查看全部 →'}
                          </Link>
                        </div>

                        {item.groups.length === 1 ? (
                          /* ── 单组：两列 ── */
                          <div className="p-6">
                            {item.groups[0].desc && (
                              <p className="mb-4 text-xs text-ink-muted">{item.groups[0].desc}</p>
                            )}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-px">
                              {item.groups[0].items.map((leaf) => (
                                <Link
                                  key={leaf.key}
                                  href={leaf.href}
                                  className="group flex flex-col border-l-2 border-transparent py-2.5 pl-3 transition-colors duration-100 hover:border-stone/50 hover:bg-surface-warm"
                                >
                                  <span className="text-sm font-medium leading-snug text-ink group-hover:text-stone">{leaf.label}</span>
                                  {leaf.desc && <span className="mt-0.5 text-[11px] leading-snug text-ink-faint">{leaf.desc}</span>}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          /* ── 多组：分栏 + 竖分割线 ── */
                          <div className="grid" style={{ gridTemplateColumns: `repeat(${item.groups.length}, 1fr)` }}>
                            {item.groups.map((group, gi) => (
                              <div
                                key={group.key}
                                className={`p-6 ${gi < item.groups!.length - 1 ? 'border-r border-border/40' : ''}`}
                              >
                                <div className="mb-4 border-b border-border/40 pb-3">
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-stone/70">{group.label}</p>
                                  {group.desc && <p className="mt-1 text-[11px] leading-relaxed text-ink-faint">{group.desc}</p>}
                                </div>
                                <div className="space-y-px">
                                  {group.items.map((leaf) => (
                                    <Link
                                      key={leaf.key}
                                      href={leaf.href}
                                      className="group flex flex-col border-l-2 border-transparent py-2 pl-3 transition-colors duration-100 hover:border-stone/50 hover:bg-surface-warm"
                                    >
                                      <span className="text-sm leading-snug text-ink group-hover:text-stone">{leaf.label}</span>
                                      {leaf.desc && <span className="mt-0.5 text-[11px] leading-snug text-ink-faint">{leaf.desc}</span>}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={triggerSearch}
              className="inline-flex h-9 w-9 items-center justify-center text-ink-muted transition-colors hover:text-ink"
              aria-label={isEn ? 'Open search' : '打开搜索'}
            >
              <SearchIcon />
            </button>
            <LanguageToggle />
            <ThemeToggle />
            <Link href={loginHref} className="px-2 py-2 text-sm text-ink-muted transition-colors hover:text-ink">
              {loginLabel}
            </Link>
            <Link
              href={uploadHref}
              className="ml-1 inline-flex h-9 items-center bg-stone px-4 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-px hover:bg-stone/90 hover:shadow-[0_12px_28px_rgba(139,115,85,0.20)] active:scale-[0.97] active:translate-y-0"
            >
              {uploadLabel}
            </Link>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <button
              type="button"
              onClick={triggerSearch}
              className="inline-flex h-9 w-9 items-center justify-center text-ink-muted transition-colors hover:text-ink"
              aria-label={isEn ? 'Open search' : '打开搜索'}
            >
              <SearchIcon />
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px]"
              aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
              aria-expanded={menuOpen}
            >
              <span className={`block h-[1.5px] w-[18px] bg-ink transition-all duration-200 ${menuOpen ? 'translate-y-[6.5px] rotate-45' : ''}`} />
              <span className={`block h-[1.5px] w-[18px] bg-ink transition-all duration-150 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-[1.5px] w-[18px] bg-ink transition-all duration-200 ${menuOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-[95] overflow-y-auto border-t border-border bg-canvas shadow-[0_24px_80px_rgba(42,39,35,0.18)] lg:hidden">
          <nav className="mx-auto max-w-3xl px-5 py-5" aria-label={isEn ? 'Mobile navigation' : '移动端导航'}>
            {navItems.map((item) => (
              <MobileNavGroup key={item.key} item={item} isEn={isEn} onNavigate={() => setMenuOpen(false)} />
            ))}

            <div className="mt-6 grid gap-3 border-t border-border pt-5">
              <Link href={uploadHref} onClick={() => setMenuOpen(false)} className="inline-flex h-11 items-center justify-center bg-stone px-4 text-sm font-medium text-white">
                {uploadLabel}
              </Link>
              <div className="flex items-center justify-between">
                <Link href={loginHref} onClick={() => setMenuOpen(false)} className="text-sm text-ink-muted hover:text-ink">
                  {loginLabel}
                </Link>
                <div className="flex items-center gap-2">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

function MobileNavGroup({
  item,
  isEn,
  onNavigate,
}: {
  item: LocalizedPrimary
  isEn: boolean
  onNavigate: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  if (!item.groups) {
    return (
      <Link href={item.href} onClick={onNavigate} className="block border-b border-border py-4 text-sm font-medium text-ink">
        {item.label}
      </Link>
    )
  }

  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-ink"
      >
        {item.label}
        <svg className={`h-3.5 w-3.5 text-ink-muted transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="pb-4">
          <Link href={item.href} onClick={onNavigate} className="mb-3 inline-block text-xs text-ink-muted hover:text-stone">
            {isEn ? 'View all →' : '查看全部 →'}
          </Link>
          <div className="space-y-4">
            {item.groups.map((group) => (
              <div key={group.key}>
                {item.groups!.length > 1 && (
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.15em] text-ink-faint">{group.label}</p>
                )}
                <div className="grid gap-0.5">
                  {group.items.map((leaf) => (
                    <Link key={leaf.key} href={leaf.href} onClick={onNavigate} className="flex items-baseline gap-2 py-1.5 text-sm text-ink-muted hover:text-ink">
                      <span>{leaf.label}</span>
                      {leaf.desc && <span className="text-[11px] text-ink-faint">{leaf.desc}</span>}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
