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
    key: 'renovation',
    zh: { label: '装修避坑', href: '/blog?category=renovation' },
    en: { label: 'Renovation', href: '/en/blog' },
  },
  {
    key: 'mattress',
    zh: { label: '床垫干货', href: '/blog?category=mattress' },
    en: { label: 'Mattress', href: '/en/blog' },
    groups: [
      {
        key: 'mattress-sub',
        zh: { label: '床垫选购指南', desc: '从材料到合同，把床垫买明白' },
        en: { label: 'Mattress Guide', desc: 'Materials, selection, and insider knowledge.' },
        items: [
          { key: 'buying', zh: { label: '选购认知', href: '/blog?category=mattress&sub=buying', desc: '怎么选、怎么看、怎么比' }, en: { label: 'Buying Tips', href: '/en/blog', desc: 'How to choose and compare.' } },
          { key: 'material', zh: { label: '材料拆解', href: '/blog?category=mattress&sub=material', desc: '弹簧、乳胶、海绵、面料拆开看' }, en: { label: 'Materials', href: '/en/blog', desc: 'Springs, latex, foam, and fabric.' } },
          { key: 'insider', zh: { label: '行业内幕', href: '/blog?category=mattress&sub=insider', desc: '导购话术、定价逻辑、品牌真相' }, en: { label: 'Insider', href: '/en/blog', desc: 'Sales tactics and pricing truths.' } },
          { key: 'care', zh: { label: '保养与使用', href: '/blog?category=mattress&sub=care', desc: '延长寿命、清洁、翻面、更换时机' }, en: { label: 'Care', href: '/en/blog', desc: 'Maintenance and replacement.' } },
        ],
      },
    ],
  },
  {
    key: 'lifestyle',
    zh: { label: '生活方式', href: '/blog?category=lifestyle' },
    en: { label: 'Lifestyle', href: '/en/blog' },
  },
  {
    key: 'ip',
    zh: { label: 'IP方法论', href: '/blog?category=ip' },
    en: { label: 'IP Method', href: '/en/blog' },
  },
  {
    key: 'ai',
    zh: { label: 'AI实战', href: '/blog?category=ai' },
    en: { label: 'AI in Practice', href: '/en/blog' },
  },
  {
    key: 'opc',
    zh: { label: 'OPC·同行有你', href: '/blog?category=opc' },
    en: { label: 'OPC Community', href: '/en/blog' },
    groups: [
      {
        key: 'opc-sub',
        zh: { label: 'OPC 版块', desc: '一人公司模式、实战复盘与社群共建' },
        en: { label: 'OPC Sections', desc: 'Solo business, projects, and community.' },
        items: [
          { key: 'solo-method', zh: { label: '一人公司方法论', href: '/blog?category=opc&sub=solo-method', desc: '怎么干、怎么管、怎么分钱' }, en: { label: 'Solo Method', href: '/en/blog', desc: 'How to run a one-person business.' } },
          { key: 'projects', zh: { label: '实战项目', href: '/blog?category=opc&sub=projects', desc: '茉莉花出海、跨境电商、AI短剧复盘' }, en: { label: 'Projects', href: '/en/blog', desc: 'Real project reviews.' } },
          { key: 'community', zh: { label: '社群动态', href: '/blog?category=opc&sub=community', desc: '活动、公约、成员故事' }, en: { label: 'Community', href: '/en/blog', desc: 'Events, guidelines, and stories.' } },
          { key: 'ai-school', zh: { label: 'AI成长营', href: '/blog?category=opc&sub=ai-school', desc: '轻培训、轻陪跑、新手转型' }, en: { label: 'AI School', href: '/en/blog', desc: 'Light training and mentoring.' } },
        ],
      },
    ],
  },
  {
    key: 'about',
    zh: { label: '关于我', href: '/about' },
    en: { label: 'About', href: '/en/about' },
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
  '/living-diagnosis': '/en/services',
  '/tools':      '/en/tools',
  '/topics':     '/en/tools',
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
  '/resources':  '/en/tools',
  '/services':   '/en/services',
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
    const knownCn = ['/', '/start', '/about', '/blog', '/cases', '/living-diagnosis', '/tools', '/tools/quote-check', '/tools/budget-structure', '/tools/budget-risk', '/tools/unit-converter', '/tools/tile-calculator', '/tools/paint-calculator', '/tools/inspection-guide', '/risk-dictionary', '/checklists', '/project-risks', '/topics', '/resources', '/services', '/contact', '/login', '/register']
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
