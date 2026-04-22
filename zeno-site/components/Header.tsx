'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { href: '/',          label: '首页' },
  { href: '/about',     label: '关于我' },
  { href: '/blog',      label: '文章' },
  { href: '/topics',    label: '专题' },
  { href: '/resources', label: '资料库' },
  { href: '/services',  label: '服务' },
  { href: '/tools/md2wechat', label: '排版工具' },
  { href: '/contact',   label: '联系' },
]

function LanguageSwitcher() {
  const pathname = usePathname()
  const isEn = pathname.startsWith('/en')
  const targetHref = isEn ? pathname.replace(/^\/en/, '') || '/' : `/en${pathname === '/' ? '' : pathname}`

  return (
    <Link
      href={targetHref}
      className="text-[0.75rem] text-ink-faint hover:text-ink-muted transition-colors"
    >
      {isEn ? '中文' : 'EN'}
    </Link>
  )
}

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-canvas/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-[3.5rem]">
          {/* Logo */}
          <Link
            href="/"
            className="text-ink font-semibold text-[0.9375rem] tracking-tight hover:text-stone transition-colors"
          >
            Zeno 赞诺
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[0.8125rem] transition-colors ${
                    isActive
                      ? 'text-stone font-semibold'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}

            {/* 语言切换 */}
            <LanguageSwitcher />

            {/* 登录入口 */}
            <Link
              href="/login"
              className={`text-[0.8125rem] transition-colors ${
                pathname === '/login' || pathname.startsWith('/account')
                  ? 'text-stone font-semibold'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              登录
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
            aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={menuOpen}
          >
            <span
              className={`block w-[18px] h-[1.5px] bg-ink transition-all duration-200 ${
                menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''
              }`}
            />
            <span
              className={`block w-[18px] h-[1.5px] bg-ink transition-all duration-150 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-[18px] h-[1.5px] bg-ink transition-all duration-200 ${
                menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-canvas">
          <nav className="max-w-6xl mx-auto px-5 py-3 flex flex-col">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`py-3 text-sm border-b border-border last:border-0 transition-colors ${
                    isActive ? 'text-stone font-semibold' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            {/* 语言切换 + 登录 */}
            <div className="flex items-center justify-between py-3">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className={`text-sm transition-colors ${
                  pathname === '/login' || pathname.startsWith('/account')
                    ? 'text-stone font-semibold'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                登录
              </Link>
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
