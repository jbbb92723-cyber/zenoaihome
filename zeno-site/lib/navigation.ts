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
    key: 'living-judgment',
    zh: { label: '居住判断', href: '/living-diagnosis' },
    en: { label: 'Living Judgment', href: '/en/services' },
    groups: [
      {
        key: 'living-method',
        zh: { label: '先看生活', desc: '把审美、家庭关系、空间秩序和预算取舍放在一起判断' },
        en: { label: 'Living Method', desc: 'Lifestyle, aesthetics, family scenes, and budget tradeoffs.' },
        items: [
          { key: 'diagnosis', zh: { label: 'AI 居住诊断', href: '/living-diagnosis', desc: '从生活方式和空间问题开始' }, en: { label: 'AI Living Diagnosis', href: '/en/services', desc: 'Start from how the home will be lived in.' } },
          { key: 'living-report', zh: { label: '居住需求洞察报告', href: '/services#living-insight-beta', desc: '把模糊需求整理成判断清单' }, en: { label: 'Living Insight Report', href: '/en/services', desc: 'Turn vague needs into a decision brief.' } },
          { key: 'cases', zh: { label: '案例复盘', href: '/cases', desc: '看需求如何落到报价和交付' }, en: { label: 'Case Notes', href: '/en/blog', desc: 'How needs turn into decisions.' } },
          { key: 'living-articles', zh: { label: '美学与生活文章', href: '/blog', desc: '好看也要经得起日常' }, en: { label: 'Writing', href: '/en/blog', desc: 'Aesthetics that survive daily life.' } },
        ],
      },
    ],
  },
  {
    key: 'quote-check',
    zh: { label: '报价初筛', href: '/tools/quote-check' },
    en: { label: 'Quote Check', href: '/en/tools' },
  },
  {
    key: 'services',
    zh: { label: '服务', href: '/services' },
    en: { label: 'Services', href: '/en/services' },
    groups: [
      {
        key: 'decision-services',
        zh: { label: '居住决策支持', desc: '按你现在最需要判断的层级选择，不急着购买服务' },
        en: { label: 'Decision Support', desc: 'Choose the level of judgment you need now.' },
        items: [
          { key: 'living-insight', zh: { label: '居住需求洞察报告', href: '/services#living-insight-beta', desc: '还没定方案，先把生活和审美说清' }, en: { label: 'Living Insight Report', href: '/en/services', desc: 'Clarify lifestyle and aesthetic direction.' } },
          { key: 'quote-risk-initial', zh: { label: '报价风险初查', href: '/services#quote-entry', desc: '重点报价先看明显风险' }, en: { label: 'Quote Risk First Pass', href: '/en/services', desc: 'A quick look at the obvious risks.' } },
          { key: 'quote-fast', zh: { label: '报价 / 合同快审', href: '/services#quote-standard', desc: '报价、合同和付款节点一起看' }, en: { label: 'Quote & Contract Review', href: '/en/services', desc: 'Quote, contract, and payment milestones.' } },
          { key: 'decision-pack', zh: { label: '综合判断', href: '/services#quote-deep', desc: '方案、预算、报价、合同和交付风险一起看' }, en: { label: 'Integrated Decision Review', href: '/en/services', desc: 'Lifestyle, budget, quote, contract, and delivery risk.' } },
        ],
      },
    ],
  },
  {
    key: 'method',
    zh: { label: '案例方法', href: '/cases' },
    en: { label: 'Cases', href: '/en/blog' },
    groups: [
      {
        key: 'method-group',
        zh: { label: '方法资产', desc: '用真实问题看清空间、预算和风险如何互相影响' },
        en: { label: 'Method Assets', desc: 'How space, budget, and risk affect each other.' },
        items: [
          { key: 'cases', zh: { label: '案例复盘', href: '/cases', desc: '从模糊需求到签约问题' }, en: { label: 'Case Notes', href: '/en/blog', desc: 'From vague needs to contract questions.' } },
          { key: 'resources', zh: { label: '方法与资料', href: '/resources', desc: '判断框架和可复用清单' }, en: { label: 'Resources', href: '/en/tools', desc: 'Frameworks and checklists.' } },
          { key: 'risk-dictionary', zh: { label: '风险词典', href: '/risk-dictionary', desc: '看懂报价合同里的高频风险词' }, en: { label: 'Risk Dictionary', href: '/en/tools', desc: 'Common quote and contract terms.' } },
          { key: 'checklists', zh: { label: '检查模板', href: '/checklists', desc: '签约前逐项追问' }, en: { label: 'Checklists', href: '/en/tools', desc: 'Questions before signing.' } },
        ],
      },
    ],
  },
  {
    key: 'blog',
    zh: { label: '文章', href: '/blog' },
    en: { label: 'Writing', href: '/en/blog' },
  },
  {
    key: 'judgment',
    zh: { label: 'Zeno 的判断', href: '/notes' },
    en: { label: 'Judgment Notes', href: '/en/notes' },
    groups: [
      {
        key: 'judgment-group',
        zh: { label: '一个人的判断系统', desc: '不是关于我的介绍，是我的判断习惯被公开的痕迹' },
        en: { label: 'Judgment System', desc: 'How one person makes decisions, made visible.' },
        items: [
          { key: 'notes', zh: { label: '判断笔记', href: '/notes', desc: '日常判断记录——比文章轻，比朋友圈重' }, en: { label: 'Judgment Notes', href: '/en/notes', desc: 'Real-time judgment traces.' } },
          { key: 'cases', zh: { label: '判断样张', href: '/cases', desc: '三个完整的判断过程复盘' }, en: { label: 'Case Notes', href: '/en/blog', desc: 'Full judgment walkthroughs.' } },
          { key: 'about-zeno', zh: { label: '我的判断年表', href: '/about', desc: '哪一年、哪个坑、改了哪个判断习惯' }, en: { label: 'Judgment Timeline', href: '/en/about', desc: 'When my judgment changed, and why.' } },
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
