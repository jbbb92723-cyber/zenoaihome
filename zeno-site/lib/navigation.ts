/**
 * lib/navigation.ts
 * 全站导航统一配置。Header（mega menu）和 Footer 均从此文件读取。
 */

export type Locale = 'zh' | 'en'

/* ─── 基础类型 ─────────────────────────────────────── */

export interface NavItem {
  key: string
  zh: { label: string; href: string }
  en: { label: string; href: string }
}

export interface NavLeaf {
  key: string
  zh: { label: string; href: string; desc?: string }
  en: { label: string; href: string; desc?: string }
}

export interface NavGroup {
  key: string
  zh: { label: string; desc?: string }
  en: { label: string; desc?: string }
  items: NavLeaf[]
}

export interface PrimaryNavItem {
  key: string
  zh: { label: string; href: string }
  en: { label: string; href: string }
  groups?: NavGroup[]
}

/* ─── 一级导航 + mega menu 子项 ─────────────────────── */

export const primaryNav: PrimaryNavItem[] = [
  {
    key: 'home',
    zh: { label: '首页', href: '/' },
    en: { label: 'Home', href: '/en' },
  },
  {
    key: 'quote-risk',
    zh: { label: '看报价', href: '/risk-dictionary' },
    en: { label: 'Quote Check', href: '/en/tools' },
  },
  {
    key: 'contract-risk',
    zh: { label: '看合同', href: '/checklists' },
    en: { label: 'Risk Language', href: '/en/tools#risk-language' },
  },
  {
    key: 'addon-risk',
    zh: { label: '看增项', href: '/project-risks' },
    en: { label: 'Checklists', href: '/en/tools#checklists' },
  },
  {
    key: 'risk-tools',
    zh: { label: '风险工具', href: '/tools/quote-check' },
    en: { label: 'Project Risks', href: '/en/tools#project-risks' },
  },
  {
    key: 'services',
    zh: { label: '服务', href: '/services/renovation' },
    en: { label: 'Services', href: '/en/services' },
    groups: [
      {
        key: 'all-services',
        zh: { label: '签约前人工判断', desc: '报价、合同、付款节点一起看清' },
        en: { label: 'Expert Review', desc: 'Use the free check first. Review only when the paperwork is ready.' },
        items: [
          { key: 'quote-risk-initial', zh: { label: '报价风险初筛', href: '/services/renovation#quote-entry', desc: '看报价有没有明显坑' }, en: { label: 'Free Quote Risk Check', href: '/en/tools', desc: 'Start with a lightweight first pass' } },
          { key: 'quote-fast', zh: { label: '合同风险初筛', href: '/services/renovation#quote-standard', desc: '看口头承诺和付款节点有没有写清' }, en: { label: 'Standard Quote Review', href: '/en/services', desc: 'For a complete renovation quote' } },
          { key: 'decision-pack', zh: { label: '报价对比判断', href: '/services/renovation#quote-deep', desc: '2-3 家报价差异和风险对比' }, en: { label: 'Deep Pre-Signing Review', href: '/en/services', desc: 'Quote, contract, and payment milestones' } },
        ],
      },
    ],
  },
  {
    key: 'about',
    zh: { label: '关于 Zeno', href: '/about' },
    en: { label: 'About', href: '/en/about' },
    groups: [
      {
        key: 'about-group',
        zh: { label: '关于' },
        en: { label: 'About' },
        items: [
          { key: 'about-zeno', zh: { label: '我是谁', href: '/about', desc: '16 年装修现场' }, en: { label: 'Who I Am', href: '/en/about', desc: '16 years on-site' } },
          { key: 'blog', zh: { label: '文章与记录', href: '/blog', desc: '报价风险、装修判断、工地观察' }, en: { label: 'Writing', href: '/en/blog', desc: 'Field notes & articles' } },
          { key: 'contact', zh: { label: '联系我', href: '/contact', desc: '微信 / 邮箱' }, en: { label: 'Contact', href: '/en/about', desc: 'WeChat / Email' } },
        ],
      },
    ],
  },
]

/* ─── 扁平化导航（Footer 使用） ─────────────────────── */

// Footer 必须从 primaryNav 派生，避免和 Header 维护两套一级导航。
export const mainNav: NavItem[] = primaryNav.map((item) => ({
  key: item.key,
  zh: { label: item.zh.label, href: item.zh.href },
  en: { label: item.en.label, href: item.en.href },
}))

// ─── 路由映射（语言切换用） ───────────────────────────

const CN_TO_EN: Record<string, string> = {
  '/':           '/en',
  '/start':      '/en',
  '/start/people':   '/en',
  '/start/budget':   '/en',
  '/start/contract': '/en',
  '/start/build':    '/en',
  '/start/inspect':  '/en',
  '/start/living':   '/en',
  '/about':      '/en/about',
  '/blog':       '/en/blog',
  '/cases':      '/en/blog',
  '/ai':         '/en',
  '/tools':      '/en/tools',
  '/topics':     '/en/topics',
  '/tools/prompts': '/en/tools',
  '/tools/quote-check': '/en/tools',
  '/tools/budget-structure': '/en/tools',
  '/tools/budget-risk': '/en/tools',
  '/tools/budget-risk/result': '/en/tools',
  '/tools/unit-converter': '/en/tools',
  '/tools/tile-calculator': '/en/tools',
  '/tools/paint-calculator': '/en/tools',
  '/tools/inspection-guide': '/en/tools',
  '/risk-dictionary': '/en',
  '/checklists': '/en',
  '/project-risks': '/en',
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
  '/en/tools/prompts': '/tools/quote-check',
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
    const knownCn = ['/', '/start', '/about', '/blog', '/cases', '/ai', '/tools', '/tools/prompts', '/tools/quote-check', '/tools/budget-structure', '/tools/budget-risk', '/tools/unit-converter', '/tools/tile-calculator', '/tools/paint-calculator', '/tools/inspection-guide', '/risk-dictionary', '/checklists', '/project-risks', '/topics', '/resources', '/services', '/services/renovation', '/contact', '/login', '/register']
    if (knownCn.includes(cnPath)) return cnPath
    return '/'
  } else {
    if (CN_TO_EN[pathname]) return CN_TO_EN[pathname]
    if (pathname.startsWith('/blog/')) return '/en/blog'
    if (pathname.startsWith('/risk-dictionary/')) return '/en'
    if (pathname.startsWith('/checklists/')) return '/en'
    if (pathname.startsWith('/project-risks/')) return '/en'
    if (pathname.startsWith('/services/')) return '/en/services'
    if (pathname.startsWith('/tools/')) return '/en/tools'
    return '/en'
  }
}
