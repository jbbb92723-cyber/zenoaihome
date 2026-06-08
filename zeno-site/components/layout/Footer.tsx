'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { mainNav } from '@/lib/navigation'

export default function Footer() {
  const year = new Date().getFullYear()
  const pathname = usePathname()

  // 管理后台使用独立布局，隐藏全站 Footer
  if (pathname.startsWith('/admin')) return null

  const isEn = pathname.startsWith('/en')

  const navLinks = mainNav.map((item) => ({ key: item.key, ...(isEn ? item.en : item.zh) }))

  return (
    <footer className="mt-20 border-t border-border bg-canvas">
      <div className="mx-auto max-w-[1320px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12">

        {/* 主体三列 */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-[1.2fr_0.55fr_0.75fr]">

          {/* 品牌 + 定位 */}
          <div className="sm:col-span-1">
            <Link href={isEn ? '/en' : '/'} className="text-[0.82rem] font-black uppercase tracking-[0.16em] text-ink transition-colors hover:text-ink-muted">
              {isEn ? 'ZenoAIHome' : 'ZenoAIHome'}
            </Link>
            <p className="editorial-serif mt-4 max-w-[320px] text-[1.55rem] leading-[1.28] text-ink">
              {isEn
                ? 'A living decision system before renovation contracts.'
                : '把看不清的地方拆开，再进入装修决定。'}
            </p>
            <p className="mt-4 max-w-[300px] text-sm leading-7 text-ink-muted">
              {isEn
                ? 'From life goals to space order, budget boundaries, quote terms and delivery risk.'
                : '从生活方式、空间秩序、预算边界，到报价合同和交付风险。'}
            </p>
          </div>

          {/* 导航 */}
          <div>
            <p className="text-[0.65rem] text-ink-faint font-semibold uppercase tracking-widest mb-4">
              {isEn ? 'Navigate' : '导航'}
            </p>
            <nav className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="text-[0.8125rem] text-ink-muted hover:text-ink transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* 联系方式 */}
          <div>
            <p className="text-[0.65rem] text-ink-faint font-semibold uppercase tracking-widest mb-4">
              {isEn ? 'Contact' : '联系方式'}
            </p>
            {/* 改了什么：去掉 [To be added] 占位 */}
            {/* 为什么改：暴露空白降低信任 */}
            {isEn ? (
              <ul className="space-y-3">
                <li>
                  <p className="text-[0.65rem] text-ink-faint uppercase tracking-widest mb-0.5">Email</p>
                  <p className="text-[0.8125rem] text-ink">zenoaihome@qq.com</p>
                </li>
              </ul>
            ) : (
              <ul className="space-y-3">
                <li>
                  <p className="text-[0.65rem] text-ink-faint uppercase tracking-widest mb-0.5">公众号</p>
                  <p className="text-[0.8125rem] text-ink">Zeno AI装修笔记</p>
                </li>
                <li>
                  <p className="text-[0.65rem] text-ink-faint uppercase tracking-widest mb-0.5">微信</p>
                  <p className="text-[0.8125rem] text-ink">zanxiansheng2025</p>
                </li>
                <li>
                  <p className="text-[0.65rem] text-ink-faint uppercase tracking-widest mb-0.5">邮箱</p>
                  <p className="text-[0.8125rem] text-ink">zenoaihome@qq.com</p>
                </li>
              </ul>
            )}
          </div>

        </div>

        {/* 版权栏 */}
        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-[0.75rem] text-ink-faint">
            © {year} ZenoAIHome · zenoaihome.com
          </p>
          <p className="text-[0.75rem] text-ink-faint">
            {isEn
              ? 'Clarify the quote before you sign.'
              : '先建立判断力，再做装修决定。'}
          </p>
        </div>

      </div>
    </footer>
  )
}

