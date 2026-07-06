/**
 * lib/navigation.ts
 * 全站导航统一配置。Header（mega menu）和 Footer 均从此文件读取。
 *
 * 导航基于「判断框架」而非「主题标签」——
 * 每个一级导航项回答的不是「我写过什么话题」，
 * 而是「我能帮你在哪个领域省掉踩坑的代价」。
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
    zh: { label: '装修全案判断', href: '/blog?category=renovation' },
    en: { label: 'Renovation Judgment', href: '/en/blog' },
    groups: [
      {
        key: 'renovation-judgment',
        zh: { label: '装修全案判断', desc: '从空间方案到交付风险，17 年全链条判断' },
        en: { label: 'Renovation Judgment', desc: 'Full-chain judgment from spatial design to delivery risk.' },
        items: [
          { key: 'space', zh: { label: '空间方案与审美', href: '/blog?category=renovation&sub=space', desc: '生活方式、空间秩序、居住场景' }, en: { label: 'Space & Aesthetics', href: '/en/blog', desc: 'Lifestyle, spatial order, living scenarios.' } },
          { key: 'material', zh: { label: '材料与工艺判断', href: '/blog?category=renovation&sub=material', desc: '主材辅材、施工工艺、收口标准' }, en: { label: 'Materials & Craft', href: '/en/blog', desc: 'Materials, workmanship, and finishing standards.' } },
          { key: 'construction', zh: { label: '施工过程管控', href: '/blog?category=renovation&sub=construction', desc: '选对人、说对话、盯对点' }, en: { label: 'Construction Control', href: '/en/blog', desc: 'Choosing the right people and staying on critical points.' } },
          { key: 'contract', zh: { label: '合同与交付风险', href: '/blog?category=renovation&sub=contract', desc: '报价审核、合同边界、付款节点、验收标准' }, en: { label: 'Contract & Risk', href: '/en/blog', desc: 'Quote review, contract boundaries, payment milestones.' } },
        ],
      },
      {
        key: 'mattress-guide',
        zh: { label: '床垫选购判断', desc: '从材料到合同，把床垫买明白' },
        en: { label: 'Mattress Guide', desc: 'Materials, selection, and buying judgment.' },
        items: [
          { key: 'mattress-buying', zh: { label: '选购认知', href: '/blog?category=mattress&sub=buying', desc: '怎么选、怎么看、怎么比' }, en: { label: 'Buying Tips', href: '/en/blog', desc: 'How to choose and compare.' } },
          { key: 'mattress-material', zh: { label: '材料拆解', href: '/blog?category=mattress&sub=material', desc: '弹簧、乳胶、海绵、面料拆开看' }, en: { label: 'Materials', href: '/en/blog', desc: 'Springs, latex, foam, and fabric.' } },
          { key: 'mattress-insider', zh: { label: '买手经验', href: '/blog?category=mattress&sub=insider', desc: '导购不会告诉你的定价逻辑和选购方法' }, en: { label: 'Buyer Experience', href: '/en/blog', desc: 'Pricing logic and selection methods.' } },
          { key: 'mattress-care', zh: { label: '保养与使用', href: '/blog?category=mattress&sub=care', desc: '延长寿命、清洁、翻面、更换时机' }, en: { label: 'Care', href: '/en/blog', desc: 'Maintenance and replacement.' } },
        ],
      },
    ],
  },
  {
    key: 'ai',
    zh: { label: 'AI 落地判断', href: '/blog?category=ai' },
    en: { label: 'AI in Practice', href: '/en/blog' },
    groups: [
      {
        key: 'ai-sub',
        zh: { label: 'AI 落地判断', desc: '哪些能用、哪些是坑——交了学费的判断' },
        en: { label: 'AI in Practice', desc: 'What works and what doesn\'t — paid-for judgment.' },
        items: [
          { key: 'ai-practice', zh: { label: '传统行业 × AI 实战', href: '/blog?category=ai', desc: '工作流、提示词、真实案例' }, en: { label: 'Traditional Industry × AI', href: '/en/blog', desc: 'Workflows, prompts, real cases.' } },
          { key: 'ai-tools', zh: { label: 'AI 工具', href: '/tools', desc: '报价初筛、预算结构、居住诊断——免费使用' }, en: { label: 'AI Tools', href: '/en/tools', desc: 'Free renovation decision tools.' } },
        ],
      },
    ],
  },
  {
    key: 'opc',
    zh: { label: 'OPC·同行有你', href: '/blog?category=opc' },
    en: { label: 'OPC Community', href: '/en/blog' },
    groups: [
      {
        key: 'opc-sub',
        zh: { label: '一人公司', desc: '一个人不是孤独干活，是只做只有你能做的事' },
        en: { label: 'One Person Company', desc: 'Do only what only you can do.' },
        items: [
          { key: 'self-rebuild', zh: { label: '把自己重做一遍', href: '/blog?category=ip', desc: '一个传统行业的人怎么用内容重建自己' }, en: { label: 'Rebuild Yourself', href: '/en/blog', desc: 'Rebuilding yourself with content.' } },
          { key: 'solo-method', zh: { label: '一人公司工程方法', href: '/blog?category=opc&sub=solo-method', desc: '定价、获客、SOP、不做什么' }, en: { label: 'Solo Method', href: '/en/blog', desc: 'Pricing, acquisition, SOPs.' } },
          { key: 'community', zh: { label: '同行社群', href: '/blog?category=opc&sub=community', desc: '活动、公约、成员故事' }, en: { label: 'Community', href: '/en/blog', desc: 'Events, guidelines, member stories.' } },
          { key: 'ai-school', zh: { label: 'AI 成长营', href: '/blog?category=opc&sub=ai-school', desc: '轻培训、轻陪跑、新手转型' }, en: { label: 'AI School', href: '/en/blog', desc: 'Light training and mentoring.' } },
        ],
      },
    ],
  },
  {
    key: 'training',
    zh: { label: 'AI 培训与企业服务', href: '/training' },
    en: { label: 'AI Training', href: '/en/training' },
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
  '/training':   '/en/training',
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
  '/en/training':   '/training',
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
    const knownCn = ['/', '/start', '/about', '/blog', '/cases', '/living-diagnosis', '/training', '/tools', '/tools/quote-check', '/tools/budget-structure', '/tools/budget-risk', '/tools/unit-converter', '/tools/tile-calculator', '/tools/paint-calculator', '/tools/inspection-guide', '/risk-dictionary', '/checklists', '/project-risks', '/topics', '/resources', '/services', '/contact', '/login', '/register']
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
