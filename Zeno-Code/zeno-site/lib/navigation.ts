/**
 * lib/navigation.ts
 * 全站导航。Header mega menu 与 Footer 统一读取。
 *
 * 导航结构（2026-07-22）：
 * 首页 → AI 工具 → AI 服务 → 星火者 → 装修视野 → 文章 → 关于
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

/* ─── 一级导航 ─────────────────────────────────────── */

export const primaryNav: PrimaryNavItem[] = [
  {
    key: 'home',
    zh: { label: '首页', href: '/' },
    en: { label: 'Home', href: '/en' },
  },
  {
    key: 'ai-tools',
    zh: { label: 'AI 工具', href: '/ai-tools' },
    en: { label: 'AI Tools', href: '/en/tools' },
    groups: [
      {
        key: 'free-tools',
        zh: { label: '免费工具', desc: '先自己试试——不花钱，直接用' },
        en: { label: 'Free Tools', desc: 'Try them yourself — no signup, no cost.' },
        items: [
          { key: 'opc-diagnosis', zh: { label: '一人公司诊断', href: '/ai-tools#opc', desc: '10 个问题，看看你现在卡在哪一步' }, en: { label: 'Solo Business Check', href: '/en/tools', desc: '' } },
          { key: 'content-strategy', zh: { label: '内容策略生成', href: '/ai-tools#content', desc: '输入你的行业和经验，生成 3 个内容方向' }, en: { label: 'Content Strategy', href: '/en/tools', desc: '' } },
          { key: 'renovation-tools', zh: { label: '装修判断工具', href: '/tools', desc: '居住诊断、报价初筛、计算器——17 年经验做成公开工具' }, en: { label: 'Renovation Tools', href: '/en/tools', desc: '' } },
        ],
      },
    ],
  },
  {
    key: 'services',
    zh: { label: 'AI 服务', href: '/services' },
    en: { label: 'AI Services', href: '/en/services' },
    groups: [
      {
        key: 'ai-services-group',
        zh: { label: 'AI 实战服务', desc: '不卖课。每一项都能验收，先从一个真实问题开始。' },
        en: { label: 'AI Services', desc: 'Scoped delivery. Start with one real problem.' },
        items: [
          { key: 'training', zh: { label: 'AI 实战工作坊', href: '/training', desc: '面向企业团队，现场完成一次真实操作' }, en: { label: 'AI Workshop', href: '/en/services', desc: 'Hands-on training for teams.' } },
          { key: 'workflow', zh: { label: 'AI 工具与工作流', href: '/services#ai-workflow', desc: '梳理重复工作，搭成可执行流程' }, en: { label: 'AI Workflows', href: '/en/services', desc: 'Turn repeated work into workflows.' } },
          { key: 'knowledge-base', zh: { label: '企业 AI 知识库', href: '/services#knowledge-base', desc: '把分散资料整理成可检索入口' }, en: { label: 'Knowledge Base', href: '/en/services', desc: 'Structure knowledge for retrieval.' } },
          { key: 'agent', zh: { label: 'AI 智能体', href: '/services#ai-agent', desc: '围绕明确任务设计、测试和交接' }, en: { label: 'AI Agents', href: '/en/services', desc: 'Scoped agents with clear handoff.' } },
          { key: 'website', zh: { label: '网站开发', href: '/services#website', desc: '从信息架构到上线交接' }, en: { label: 'Website Dev', href: '/en/services', desc: 'From IA to launch.' } },
        ],
      },
    ],
  },
  {
    key: 'community',
    zh: { label: '星火者', href: '/community' },
    en: { label: 'Spark', href: '/en/blog' },
    groups: [
      {
        key: 'spark-info',
        zh: { label: 'OPC 协作共同体', desc: '一人是星火，众人是燎原。试运行招募中。' },
        en: { label: 'OPC Community', desc: 'Solo operators, collaborative network.' },
        items: [
          { key: 'community-intro', zh: { label: '共同体说明', href: '/community', desc: '星火者是什么、怎么运转、适合谁' }, en: { label: 'About Spark', href: '/en/blog', desc: '' } },
          { key: 'community-join', zh: { label: '试运行招募', href: '/community#join', desc: '20 人 · ¥1,499 · 6 个月 · 72h 退款' }, en: { label: 'Join', href: '/en/blog', desc: '' } },
        ],
      },
    ],
  },
  {
    key: 'renovation',
    zh: { label: '装修视野', href: '/renovation' },
    en: { label: 'Renovation Lens', href: '/en/tools' },
    groups: [
      {
        key: 'reno-content',
        zh: { label: '17 年装修视野', desc: '不是教程——是从工地里长出来的判断方法。' },
        en: { label: '17 Years of Renovation Insight', desc: 'Judgment built from the job site.' },
        items: [
          { key: 'reno-method', zh: { label: 'Zeno 的装修方法', href: '/renovation', desc: '不是教你怎么装——是教你怎么判断' }, en: { label: 'Method', href: '/en/tools', desc: '' } },
          { key: 'reno-tools', zh: { label: '免费判断工具', href: '/tools', desc: '居住诊断、报价初筛、风险词典、检查清单' }, en: { label: 'Free Tools', href: '/en/tools', desc: '' } },
          { key: 'reno-articles', zh: { label: '装修相关文章', href: '/blog?category=renovation', desc: '真实案例、判断方法、行业洞察' }, en: { label: 'Articles', href: '/en/blog', desc: '' } },
          { key: 'reno-contact', zh: { label: '需要深度对接？', href: '/contact', desc: '装修是重决策——不标价，慢慢聊' }, en: { label: 'Contact', href: '/en/about', desc: '' } },
        ],
      },
    ],
  },
  {
    key: 'blog',
    zh: { label: '文章', href: '/blog' },
    en: { label: 'Writing', href: '/en/blog' },
    groups: [
      {
        key: 'content-all',
        zh: { label: '全部内容', desc: '把实践过程、判断和方法持续公开。' },
        en: { label: 'All Writing', desc: 'Work, judgment, and methods in public.' },
        items: [
          { key: 'articles-all', zh: { label: '全部文章', href: '/blog', desc: 'AI 实践、装修判断、一人公司、星火者' }, en: { label: 'All Articles', href: '/en/blog', desc: '' } },
          { key: 'articles-ai', zh: { label: '传统行业 × AI', href: '/blog?category=ai', desc: '工具、工作流、真实复盘' }, en: { label: 'AI Practice', href: '/en/blog', desc: '' } },
          { key: 'articles-opc', zh: { label: '一人公司', href: '/blog?category=opc', desc: '转型、产品、协作' }, en: { label: 'Solo Business', href: '/en/blog', desc: '' } },
          { key: 'notes', zh: { label: '碎片笔记', href: '/notes', desc: '比文章短，比动态重' }, en: { label: 'Notes', href: '/en/notes', desc: '' } },
        ],
      },
    ],
  },
  {
    key: 'about',
    zh: { label: '关于', href: '/about' },
    en: { label: 'About', href: '/en/about' },
    groups: [
      {
        key: 'about-group',
        zh: { label: '认识赞诺', desc: '从工地到 AI，一个传统行业人的转型实践。' },
        en: { label: 'About Zeno', desc: 'From job site to AI practice.' },
        items: [
          { key: 'about-story', zh: { label: '我的经历', href: '/about', desc: '睡宝集团 → 城堡项目 → AI 实践 → 星火者' }, en: { label: 'My Story', href: '/en/about', desc: '' } },
          { key: 'contact', zh: { label: '联系我', href: '/contact', desc: '微信 zanxiansheng2025 · 注明来意' }, en: { label: 'Contact', href: '/en/about', desc: '' } },
        ],
      },
    ],
  },
]

/* ─── 扁平导航（Footer 用）─────────────────────────── */

export const mainNav: NavItem[] = primaryNav.map((item) => ({
  key: item.key,
  zh: { label: item.zh.label, href: item.zh.href },
  en: { label: item.en.label, href: item.en.href },
}))

/* ─── 路由映射（语言切换）────────────────────── */

const CN_TO_EN: Record<string, string> = {
  '/': '/en',
  '/start': '/en',
  '/about': '/en/about',
  '/blog': '/en/blog',
  '/cases': '/en/blog',
  '/living-diagnosis': '/en/services',
  '/tools': '/en/tools',
  '/ai-tools': '/en/tools',
  '/tools/quote-check': '/en/tools',
  '/tools/budget-structure': '/en/tools',
  '/tools/budget-risk': '/en/tools',
  '/tools/unit-converter': '/en/tools',
  '/tools/tile-calculator': '/en/tools',
  '/tools/paint-calculator': '/en/tools',
  '/tools/inspection-guide': '/en/tools',
  '/renovation': '/en/tools',
  '/risk-dictionary': '/en',
  '/checklists': '/en',
  '/project-risks': '/en',
  '/resources': '/en/tools',
  '/training': '/en/training',
  '/services': '/en/services',
  '/contact': '/en/about',
  '/notes': '/en/notes',
  '/login': '/en/login',
  '/register': '/en/register',
  '/community': '/en/blog',
  '/topics': '/en/tools',
}

const EN_TO_CN: Record<string, string> = {
  '/en': '/',
  '/en/about': '/about',
  '/en/blog': '/blog',
  '/en/tools': '/tools',
  '/en/training': '/training',
  '/en/services': '/services',
  '/en/notes': '/notes',
  '/en/login': '/login',
  '/en/register': '/register',
}

export function getLangHref(pathname: string, isEn: boolean): string {
  if (isEn) {
    if (EN_TO_CN[pathname]) return EN_TO_CN[pathname]
    if (pathname.startsWith('/en/blog/')) return '/blog'
    if (pathname.startsWith('/en/articles/')) return '/blog'
    const cnPath = pathname.replace(/^\/en/, '') || '/'
    const knownCn = ['/', '/start', '/about', '/blog', '/cases', '/living-diagnosis', '/training', '/tools', '/ai-tools', '/tools/quote-check', '/tools/budget-structure', '/tools/budget-risk', '/tools/unit-converter', '/tools/tile-calculator', '/tools/paint-calculator', '/tools/inspection-guide', '/risk-dictionary', '/checklists', '/project-risks', '/topics', '/resources', '/services', '/renovation', '/contact', '/login', '/register', '/community', '/notes']
    if (knownCn.includes(cnPath)) return cnPath
    return '/'
  } else {
    if (CN_TO_EN[pathname]) return CN_TO_EN[pathname]
    if (pathname.startsWith('/blog/')) return '/en/blog'
    if (pathname.startsWith('/risk-dictionary/')) return '/en'
    if (pathname.startsWith('/services/')) return '/en/services'
    if (pathname.startsWith('/tools/')) return '/en/tools'
    return '/en'
  }
}
