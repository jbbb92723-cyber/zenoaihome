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
    key: 'start',
    zh: { label: '装修判断入口', href: '/start' },
    en: { label: 'Start Here', href: '/en' },
  },
  {
    key: 'quote',
    zh: { label: '报价审核工具', href: '/resources#baojia-shenhe-qingdan' },
    en: { label: 'Quote Check', href: '/en/resources' },
  },
  {
    key: 'tools',
    zh: { label: '找问题工具', href: '/tools' },
    en: { label: 'Tools', href: '/en/tools' },
  },
  {
    key: 'resources',
    zh: { label: '工具与资料', href: '/resources' },
    en: { label: 'Tools & Resources', href: '/en/resources' },
  },
  {
    key: 'cases',
    zh: { label: '真实工地', href: '/cases' },
    en: { label: 'Livable Design', href: '/en/topics#living-renovation' },
  },
  {
    key: 'ai',
    zh: { label: 'AI 工作流', href: '/services/ai-workflow' },
    en: { label: 'AI Workflows', href: '/en/services' },
  },
  {
    key: 'services',
    zh: { label: '找我咨询', href: '/services' },
    en: { label: 'Work with Zeno', href: '/en/services' },
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
  '/start':      '/en',
  '/about':      '/en/about',
  '/blog':       '/en/blog',
  '/cases':      '/en/blog',
  '/tools':      '/en/tools',
  '/topics':     '/en/topics',
  '/tools/prompts': '/en/tools/prompts',
  '/tools/budget-risk': '/en/tools',
  '/tools/budget-risk/result': '/en/tools',
  '/resources':  '/en/resources',
  '/services':   '/en/services',
  '/services/renovation': '/en/services',
  '/services/ai-workflow': '/en/services',
  '/contact':    '/en/about',
  '/notes':      '/en/notes',
  '/login':      '/en/login',
  '/register':   '/en/register',
}

const EN_TO_CN: Record<string, string> = {
  '/en':            '/',
  '/en/about':      '/about',
  '/en/blog':       '/blog',
  '/en/tools':      '/tools',
  '/en/tools/prompts': '/tools/prompts',
  '/en/topics':     '/topics',
  '/en/resources':  '/resources',
  '/en/services':   '/services',
  '/en/notes':      '/notes',
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
    const knownCn = ['/', '/start', '/about', '/blog', '/cases', '/tools', '/tools/prompts', '/tools/budget-risk', '/topics', '/resources', '/services', '/contact', '/login', '/register']
    if (knownCn.includes(cnPath)) return cnPath
    return '/'
  } else {
    if (CN_TO_EN[pathname]) return CN_TO_EN[pathname]
    if (pathname.startsWith('/blog/')) return '/en/blog'
    if (pathname.startsWith('/services/')) return '/en/services'
    if (pathname.startsWith('/tools/')) return pathname === '/tools/prompts' ? '/en/tools/prompts' : '/en/tools'
    return '/en'
  }
}
