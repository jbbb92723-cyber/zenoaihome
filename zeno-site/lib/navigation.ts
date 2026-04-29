/**
 * lib/navigation.ts
 * 全站导航统一配置。Header 和 Footer 均从此文件读取，禁止各自维护导航数组。
 */

export type Locale = 'zh' | 'en'

export interface NavItem {
  key: string
  zh: { label: string; href: string }
  en: { label: string; href: string }
}

/** 主导航（Header + Footer 均使用） */
export const mainNav: NavItem[] = [
  {
    key: 'home',
    zh: { label: '首页', href: '/' },
    en: { label: 'Home', href: '/en' },
  },
  {
    key: 'now',
    zh: { label: '正在做', href: '/#now' },
    en: { label: 'Now', href: '/en#now' },
  },
  {
    key: 'ai',
    zh: { label: 'AI 实践', href: '/topics#chuantong-hangyeren-zenme-yong-ai' },
    en: { label: 'AI in Practice', href: '/en/topics#ai-upgrade' },
  },
  {
    key: 'resources',
    zh: { label: '工具与资料', href: '/resources' },
    en: { label: 'Tools & Resources', href: '/en/resources' },
  },
  {
    key: 'living',
    zh: { label: '真实居住', href: '/topics#shi-zhu-pai-zhuangxiu' },
    en: { label: 'Livable Design', href: '/en/topics#living-renovation' },
  },
  {
    key: 'services',
    zh: { label: '服务与合作', href: '/services' },
    en: { label: 'Services', href: '/en/services' },
  },
  {
    key: 'about',
    zh: { label: '关于 Zeno', href: '/about' },
    en: { label: 'About', href: '/en/about' },
  },
]

/** 仅 Footer 使用的联系入口 */
export const contactNav: NavItem = {
  key: 'contact',
  zh: { label: '联系', href: '/contact' },
  en: { label: 'Contact', href: '/en/about' },
}

// ─── 路由映射（语言切换用） ───────────────────────────

const CN_TO_EN: Record<string, string> = {
  '/':           '/en',
  '/about':      '/en/about',
  '/blog':       '/en/blog',
  '/topics':     '/en/topics',
  '/resources':  '/en/resources',
  '/services':   '/en/services',
  '/contact':    '/en/about',
  '/login':      '/en/login',
  '/register':   '/en/register',
}

const EN_TO_CN: Record<string, string> = {
  '/en':            '/',
  '/en/about':      '/about',
  '/en/blog':       '/blog',
  '/en/topics':     '/topics',
  '/en/resources':  '/resources',
  '/en/services':   '/services',
  '/en/login':      '/login',
  '/en/register':   '/register',
}

/**
 * 根据当前路径返回切换语言后的目标路径。
 * - 动态文章：/blog/[slug] → /en/blog（无英文稿），/en/blog/[slug] → /blog
 * - 未知路径兜底：CN→/en，EN→/
 */
export function getLangHref(pathname: string, isEn: boolean): string {
  if (isEn) {
    if (EN_TO_CN[pathname]) return EN_TO_CN[pathname]
    if (pathname.startsWith('/en/blog/')) return '/blog'
    if (pathname.startsWith('/en/articles/')) return '/blog'
    const cnPath = pathname.replace(/^\/en/, '') || '/'
    const knownCn = ['/', '/about', '/blog', '/topics', '/resources', '/services', '/contact', '/login', '/register']
    if (knownCn.includes(cnPath)) return cnPath
    return '/'
  } else {
    if (CN_TO_EN[pathname]) return CN_TO_EN[pathname]
    if (pathname.startsWith('/blog/')) return '/en/blog'
    return '/en'
  }
}
