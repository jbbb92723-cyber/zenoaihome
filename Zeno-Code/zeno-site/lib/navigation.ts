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
    key: 'services',
    zh: { label: '服务合作', href: '/services' },
    en: { label: 'Services', href: '/en/services' },
    groups: [
      {
        key: 'ai-services',
        zh: { label: 'AI 实战服务', desc: '从培训到项目交付，先把问题和边界说清楚' },
        en: { label: 'AI Services', desc: 'Training and scoped implementation for real work.' },
        items: [
          { key: 'training', zh: { label: 'AI 培训与内训', href: '/training', desc: '传统行业视角，现场完成一次真实操作' }, en: { label: 'AI Training', href: '/en/services', desc: 'Practical training for traditional businesses.' } },
          { key: 'workflow', zh: { label: 'AI 工具与工作流', href: '/services#ai-workflow', desc: '把重复工作整理成可执行流程' }, en: { label: 'AI Workflows', href: '/en/services', desc: 'Turn repeated work into usable workflows.' } },
          { key: 'knowledge-base', zh: { label: '企业 AI 知识库', href: '/services#knowledge-base', desc: '整理资料、规则和经验，建立可检索入口' }, en: { label: 'AI Knowledge Base', href: '/en/services', desc: 'Structure internal knowledge for retrieval.' } },
          { key: 'agent', zh: { label: 'AI 智能体', href: '/services#ai-agent', desc: '围绕明确任务设计、测试和交接' }, en: { label: 'AI Agents', href: '/en/services', desc: 'Scoped agents for clearly defined tasks.' } },
          { key: 'website', zh: { label: '网站开发', href: '/services#website', desc: '从信息架构到上线交接' }, en: { label: 'Website Development', href: '/en/services', desc: 'From information architecture to launch.' } },
        ],
      },
    ],
  },
  {
    key: 'content',
    zh: { label: '内容与实践', href: '/blog' },
    en: { label: 'Notes & Practice', href: '/en/blog' },
    groups: [
      {
        key: 'content-tracks',
        zh: { label: '公开记录', desc: '把实践过程、判断和方法持续公开' },
        en: { label: 'Public Notes', desc: 'Work, judgment, and methods documented in public.' },
        items: [
          { key: 'ai-practice', zh: { label: '传统行业 × AI', href: '/blog?category=ai', desc: '工具、工作流、内容系统和真实复盘' }, en: { label: 'Traditional Industry × AI', href: '/en/blog', desc: 'Tools, workflows, and field notes.' } },
          { key: 'renovation-content', zh: { label: '装修实践', href: '/blog?category=renovation', desc: '17 年一线经验沉淀的判断' }, en: { label: 'Renovation Practice', href: '/en/blog', desc: 'Judgment built from 17 years of field work.' } },
          { key: 'solo-company', zh: { label: '一人公司', href: '/blog?category=opc', desc: '转型、产品、协作与共同体实验' }, en: { label: 'Solo Business', href: '/en/blog', desc: 'Transformation, products, and collaboration.' } },
          { key: 'notes', zh: { label: '判断笔记', href: '/notes', desc: '比文章短，比动态重' }, en: { label: 'Notes', href: '/en/notes', desc: 'Shorter than essays, heavier than posts.' } },
        ],
      },
    ],
  },
  {
    key: 'renovation',
    zh: { label: '装修判断', href: '/tools' },
    en: { label: 'Renovation', href: '/en/tools' },
    groups: [
      {
        key: 'renovation-assets',
        zh: { label: '装修判断资产', desc: '保留为赞诺最完整的垂直实践样本' },
        en: { label: 'Renovation Assets', desc: 'Zeno\'s most complete vertical proof.' },
        items: [
          { key: 'tools', zh: { label: '装修判断工具', href: '/tools', desc: '居住诊断、报价初筛和计算工具' }, en: { label: 'Decision Tools', href: '/en/tools', desc: 'Diagnosis and quote-screening tools.' } },
          { key: 'cases', zh: { label: '判断样张', href: '/cases', desc: '先看判断过程，再决定怎么做' }, en: { label: 'Samples', href: '/en/blog', desc: 'See the judgment process.' } },
          { key: 'risk-dictionary', zh: { label: '风险词典', href: '/risk-dictionary', desc: '把报价和合同中的模糊词拆开' }, en: { label: 'Risk Dictionary', href: '/en/tools', desc: 'Decode ambiguous quote language.' } },
          { key: 'zeno-os', zh: { label: 'Zeno OS', href: '/zeno-os', desc: '装修风险判断的公开方法' }, en: { label: 'Zeno OS', href: '/en/tools', desc: 'Open renovation judgment methods.' } },
        ],
      },
    ],
  },
  {
    key: 'community',
    zh: { label: '星火者共同体', href: '/community' },
    en: { label: 'Spark Community', href: '/en/blog' },
  },
  {
    key: 'about',
    zh: { label: '关于Zeno', href: '/about' },
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
