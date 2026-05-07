'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageToggle from '@/components/LanguageToggle'
import { SearchTrigger } from '@/components/SearchDialog'
import { mainNav } from '@/lib/navigation'

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // 管理后台使用独立布局，隐藏全站导航
  if (pathname.startsWith('/admin')) return null

  const isEn = pathname.startsWith('/en')

  const navLinks = mainNav.map((item) => ({ key: item.key, ...(isEn ? item.en : item.zh) }))
  const logoText = isEn ? 'ZenoAIHome' : 'ZenoAIHome'
  const logoHref = isEn ? '/en' : '/'
  const loginLabel = isEn ? 'Log in' : '登录'
  const loginHref = isEn ? '/en/login' : '/login'

  const isActive = (href: string) => {
    // 去掉锚点和查询参数后匹配路径
    const base = href.split('#')[0].split('?')[0]
    if (isEn) {
      return base === '/en' ? pathname === '/en' : pathname.startsWith(base)
    }
    return base === '/' ? pathname === '/' : pathname.startsWith(base)
  }

  return (
    <header className="sticky top-0 z-40 bg-canvas/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-[3.5rem]">
          {/* Logo */}
          <Link
            href={logoHref}
            className="text-ink font-semibold text-[0.9375rem] tracking-tight hover:text-stone transition-colors"
          >
            {logoText}
          </Link>

          {/* Desktop Nav — lg 断点防止中等屏幕拥挤 */}
          <nav className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={`text-[0.8125rem] whitespace-nowrap transition-colors ${
                  isActive(link.href)
                    ? 'text-stone font-semibold'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* 语言切换 */}
            <LanguageToggle />

            {/* 搜索 */}
            <SearchTrigger />

            {/* 主题切换 */}
            <ThemeToggle />

            {/* 登录入口 */}
            <Link
              href={loginHref}
              className={`text-[0.8125rem] transition-colors ${
                pathname === '/login' || pathname === '/en/login' || pathname.startsWith('/account')
                  ? 'text-stone font-semibold'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {loginLabel}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
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
        <div className="lg:hidden border-t border-border bg-canvas">
          <nav className="max-w-6xl mx-auto px-5 py-3 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`py-3 text-sm border-b border-border last:border-0 transition-colors ${
                  isActive(link.href) ? 'text-stone font-semibold' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {/* 底部控制栏：登录 + 语言 + 主题 */}
            <div className="flex items-center justify-between py-3">
              <Link
                href={loginHref}
                onClick={() => setMenuOpen(false)}
                className={`text-sm transition-colors ${
                  pathname === '/login' || pathname === '/en/login' || pathname.startsWith('/account')
                    ? 'text-stone font-semibold'
                    : 'text-ink-muted hover:text-ink'
                }`}
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
