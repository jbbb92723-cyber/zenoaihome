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

export interface NavChild {
  key: string
  zh: { label: string; href: string; desc?: string }
  en: { label: string; href: string; desc?: string }
}

export interface PrimaryNavItem {
  key: string
  zh: { label: string; href: string }
  en: { label: string; href: string }
  children?: NavChild[]
}

/* ─── 一级导航 + mega menu 子项 ─────────────────────── */

export const primaryNav: PrimaryNavItem[] = [
  {
    key: 'judgment',
    zh: { label: '装修判断', href: '/start' },
    en: { label: 'Judgment', href: '/en' },
    children: [
      {
        key: 'quote-check',
        zh: { label: '报价怎么看', href: '/resources#baojia-shenhe-qingdan', desc: '漏项、单价、工艺和增项边界' },
        en: { label: 'Quote Review', href: '/en/resources', desc: 'Spot gaps, unit prices & scope risks' },
      },
      {
        key: 'budget-split',
        zh: { label: '预算怎么拆', href: '/tools/budget-risk', desc: '底线、弹性和缓冲' },
        en: { label: 'Budget Split', href: '/en/tools', desc: 'Baseline, flex & buffer' },
      },
      {
        key: 'contract',
        zh: { label: '合同怎么审', href: '/resources#sign-before-contract', desc: '把口头承诺变成书面确认' },
        en: { label: 'Contract Check', href: '/en/resources', desc: 'Turn verbal into written' },
      },
      {
        key: 'construction',
        zh: { label: '施工怎么盯', href: '/resources#construction-checkpoints', desc: '关键节点确认与留证' },
        en: { label: 'Site Checkpoints', href: '/en/resources', desc: 'Key milestones & evidence' },
      },
      {
        key: 'living',
        zh: { label: '回到真实居住', href: '/topics#shi-zhu-pai-zhuangxiu', desc: '做饭、收纳、清洁和十年使用' },
        en: { label: 'Real Living', href: '/en/topics#living-renovation', desc: 'Cooking, storage & 10-year use' },
      },
    ],
  },
  {
    key: 'tools',
    zh: { label: '工具与资料', href: '/tools' },
    en: { label: 'Tools', href: '/en/tools' },
    children: [
      {
        key: 'budget-risk',
        zh: { label: '预算风险自测', href: '/tools/budget-risk', desc: '10 分钟分清你的最大风险' },
        en: { label: 'Budget Risk Quiz', href: '/en/tools', desc: '10 min to spot your biggest risk' },
      },
      {
        key: 'quote-list',
        zh: { label: '报价审核清单', href: '/resources#baojia-shenhe-qingdan', desc: '逐项核对漏项和模糊项' },
        en: { label: 'Quote Checklist', href: '/en/resources', desc: 'Line-by-line gap check' },
      },
      {
        key: 'checkpoint-list',
        zh: { label: '验收节点清单', href: '/resources#construction-checkpoints', desc: '每个节点该看、该拍、该确认什么' },
        en: { label: 'Checkpoint List', href: '/en/resources', desc: 'What to check at each stage' },
      },
      {
        key: 'prep-sheet',
        zh: { label: '装修准备表', href: '/resources#living-needs-map', desc: '签约前把家庭需求写清楚' },
        en: { label: 'Prep Sheet', href: '/en/resources', desc: 'Map needs before signing' },
      },
      {
        key: 'all-resources',
        zh: { label: '全部资料 →', href: '/resources' },
        en: { label: 'All Resources →', href: '/en/resources' },
      },
    ],
  },
  {
    key: 'services',
    zh: { label: '服务', href: '/services' },
    en: { label: 'Services', href: '/en/services' },
    children: [
      {
        key: 'svc-quote',
        zh: { label: '报价单审核', href: '/services/renovation#baojia-shenhe', desc: '¥699 / 份' },
        en: { label: 'Quote Audit', href: '/en/services', desc: '¥699 / report' },
      },
      {
        key: 'svc-budget',
        zh: { label: '预算结构诊断', href: '/services/renovation#yusuan-zixun', desc: '¥1299 / 次起' },
        en: { label: 'Budget Diagnosis', href: '/en/services', desc: 'From ¥1299' },
      },
      {
        key: 'svc-ai',
        zh: { label: 'AI 工作流整理', href: '/services/ai-workflow', desc: '¥1999 / 起' },
        en: { label: 'AI Workflow', href: '/en/services', desc: 'From ¥1999' },
      },
    ],
  },
  {
    key: 'about',
    zh: { label: '关于', href: '/about' },
    en: { label: 'About', href: '/en/about' },
    children: [
      {
        key: 'about-zeno',
        zh: { label: '关于 Zeno', href: '/about', desc: '16 年现场经验' },
        en: { label: 'About Zeno', href: '/en/about', desc: '16 years on-site' },
      },
      {
        key: 'blog',
        zh: { label: '长期记录', href: '/blog', desc: '文章与思考' },
        en: { label: 'Writing', href: '/en/blog', desc: 'Articles & thoughts' },
      },
      {
        key: 'cases',
        zh: { label: '真实工地', href: '/cases', desc: '案例与现场' },
        en: { label: 'Case Studies', href: '/en/blog', desc: 'Real projects' },
      },
      {
        key: 'contact',
        zh: { label: '联系', href: '/contact' },
        en: { label: 'Contact', href: '/en/about' },
      },
    ],
  },
]

/* ─── 扁平化导航（Footer 使用） ─────────────────────── */

export const mainNav: NavItem[] = [
  { key: 'start', zh: { label: '装修判断入口', href: '/start' }, en: { label: 'Start Here', href: '/en' } },
  { key: 'tools', zh: { label: '工具与资料', href: '/tools' }, en: { label: 'Tools', href: '/en/tools' } },
  { key: 'resources', zh: { label: '资料库', href: '/resources' }, en: { label: 'Resources', href: '/en/resources' } },
  { key: 'services', zh: { label: '服务', href: '/services' }, en: { label: 'Services', href: '/en/services' } },
  { key: 'blog', zh: { label: '长期记录', href: '/blog' }, en: { label: 'Writing', href: '/en/blog' } },
  { key: 'about', zh: { label: '关于 Zeno', href: '/about' }, en: { label: 'About', href: '/en/about' } },
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
