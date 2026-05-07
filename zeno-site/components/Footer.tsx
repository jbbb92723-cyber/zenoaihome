'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { mainNav, contactNav } from '@/lib/navigation'

export default function Footer() {
  const year = new Date().getFullYear()
  const pathname = usePathname()

  // 管理后台使用独立布局，隐藏全站 Footer
  if (pathname.startsWith('/admin')) return null

  const isEn = pathname.startsWith('/en')

  const navLinks = mainNav.map((item) => ({ key: item.key, ...(isEn ? item.en : item.zh) }))
  const contact = isEn ? contactNav.en : contactNav.zh

  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-12 sm:py-14">

        {/* 主体三列 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

          {/* 品牌 + 定位 */}
          <div className="sm:col-span-1">
            <Link href={isEn ? '/en' : '/'} className="text-ink font-semibold text-[0.9375rem] hover:text-stone transition-colors">
              {isEn ? 'ZenoAIHome' : 'ZenoAIHome'}
            </Link>
            <p className="mt-3 text-[0.8125rem] text-ink-muted leading-relaxed max-w-[220px]">
              {isEn
                ? 'From a familiar industry, building a freer personal business system with AI, products, and content.'
                : '从 16 年装修现场出发，把报价、预算、合同、施工、验收和真实居住讲明白。'}
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
              {/* 联系入口仅在 Footer 出现 */}
              <Link
                href={contact.href}
                className="text-[0.8125rem] text-ink-muted hover:text-ink transition-colors"
              >
                {contact.label}
              </Link>
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
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-[0.75rem] text-ink-faint">
            © {year} ZenoAIHome · zenoaihome.com
          </p>
          <p className="text-[0.75rem] text-ink-faint">
            {isEn
              ? 'Content updated regularly. Quality over quantity.'
              : '先建立判断力，再做装修决定。'}
          </p>
        </div>

      </div>
    </footer>
  )
}

