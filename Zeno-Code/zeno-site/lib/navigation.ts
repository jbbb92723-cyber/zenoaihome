/**
 * 全站导航。个人博客与公开实践是主入口，工具、服务和共同体是延伸。
 * Header mega menu 与 Footer 统一读取这里的数据。
 */

export type Locale = 'zh' | 'en'

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

export const primaryNav: PrimaryNavItem[] = [
  {
    key: 'blog',
    zh: { label: '我的实践', href: '/blog' },
    en: { label: 'Public practice', href: '/en/blog' },
    groups: [
      {
        key: 'writing',
        zh: { label: '公开写作', desc: '做过的事、踩过的坑和仍在验证的判断。' },
        en: { label: 'Writing', desc: 'Work, lessons, and ideas still being tested.' },
        items: [
          { key: 'all', zh: { label: '全部文章', href: '/blog', desc: '按时间查看所有公开文章' }, en: { label: 'All writing', href: '/en/blog' } },
          { key: 'ai', zh: { label: '传统行业 × AI', href: '/blog?category=ai', desc: '知识库、工作流、智能体与真实复盘' }, en: { label: 'AI practice', href: '/en/blog' } },
          { key: 'opc', zh: { label: '一人公司', href: '/blog?category=opc', desc: '产品、获客、交付与协作' }, en: { label: 'Solo business', href: '/en/blog' } },
          { key: 'practice', zh: { label: '实践与证据', href: '/practice', desc: '正在验证什么、依据是什么、下一版怎么改' }, en: { label: 'Practice & evidence', href: '/en/blog' } },
          { key: 'notes', zh: { label: '碎片笔记', href: '/notes', desc: '比文章短，比动态重' }, en: { label: 'Notes', href: '/en/notes' } },
        ],
      },
    ],
  },
  {
    key: 'experience',
    zh: { label: '经验变成系统', href: '/opc-knowledge' },
    en: { label: 'Experience systems', href: '/en/blog' },
    groups: [
      {
        key: 'experience-practice',
        zh: { label: '从一个真实任务开始', desc: '先看过程和证据，再决定是否需要工具或项目合作。' },
        en: { label: 'Start with real work', desc: 'See the process and evidence before choosing a tool or project.' },
        items: [
          { key: 'experience-home', zh: { label: '经验资产化实践', href: '/opc-knowledge', desc: '问题、判断、最小交付与反馈回流' }, en: { label: 'Experience practice', href: '/en/blog' } },
          { key: 'cases', zh: { label: '方法示例与实践档案', href: '/cases', desc: '区分演示样张与真实使用结果' }, en: { label: 'Practice records', href: '/en/blog' } },
          { key: 'task-planner', zh: { label: '工作流任务拆解器', href: '/ai-tools/task-planner', desc: '查看预设任务结构和验收步骤' }, en: { label: 'Workflow task breakdown', href: '/en/tools' } },
          { key: 'ai-tools', zh: { label: '全部公开工具', href: '/ai-tools', desc: '查看实际能力、适用场景与边界' }, en: { label: 'Public tools', href: '/en/tools' } },
        ],
      },
    ],
  },
  {
    key: 'renovation',
    zh: { label: '装修判断', href: '/renovation' },
    en: { label: 'Renovation', href: '/en/tools' },
    groups: [
      {
        key: 'renovation-practice',
        zh: { label: '装修判断路径', desc: '先自己看清楚，仍然拿不准时再进入具体服务。' },
        en: { label: 'Renovation judgment', desc: 'Start with self-serve tools, then bring a specific question.' },
        items: [
          { key: 'renovation-home', zh: { label: '装修视野', href: '/renovation', desc: '传统行业与装修实践整理出的判断路径' }, en: { label: 'Renovation practice', href: '/en/tools' } },
          { key: 'renovation-tools', zh: { label: '免费判断工具', href: '/tools', desc: '居住需求自检、报价初筛和检查工具' }, en: { label: 'Free tools', href: '/en/tools' } },
          { key: 'renovation-resources', zh: { label: '签约前资料库', href: '/resources', desc: '风险词典、规则库和检查模板' }, en: { label: 'Resources', href: '/en/tools' } },
          { key: 'renovation-review', zh: { label: '报价 / 合同人工审查', href: '/services/quote-review', desc: '已有具体材料时，看清交付和价格' }, en: { label: 'Quote review', href: '/en/services' } },
        ],
      },
    ],
  },
  {
    key: 'community',
    zh: { label: '星火者', href: '/community' },
    en: { label: 'Spark', href: '/en/blog' },
  },
  {
    key: 'about',
    zh: { label: '关于', href: '/about' },
    en: { label: 'About', href: '/en/about' },
  },
]

export const mainNav: NavItem[] = primaryNav.map((item) => ({
  key: item.key,
  zh: { label: item.zh.label, href: item.zh.href },
  en: { label: item.en.label, href: item.en.href },
}))

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
  '/training': '/en/services',
  '/services': '/en/services',
  '/contact': '/en/about',
  '/notes': '/en/notes',
  '/practice': '/en/blog',
  '/login': '/en/login',
  '/register': '/en/register',
  '/community': '/en/blog',
  '/opc-knowledge': '/en/blog',
  '/knowledge': '/en/blog',
  '/topics': '/en/tools',
}

const EN_TO_CN: Record<string, string> = {
  '/en': '/',
  '/en/about': '/about',
  '/en/blog': '/blog',
  '/en/tools': '/ai-tools',
  '/en/training': '/training',
  '/en/services': '/services',
  '/en/notes': '/notes',
  '/en/login': '/login',
  '/en/register': '/register',
}

export function getLangHref(pathname: string, isEn: boolean): string {
  if (isEn) {
    if (EN_TO_CN[pathname]) return EN_TO_CN[pathname]
    if (pathname.startsWith('/en/blog/') || pathname.startsWith('/en/articles/')) return '/blog'
    const cnPath = pathname.replace(/^\/en/, '') || '/'
    const knownCn = Object.keys(CN_TO_EN)
    if (knownCn.includes(cnPath)) return cnPath
    return '/'
  }

  if (CN_TO_EN[pathname]) return CN_TO_EN[pathname]
  if (pathname.startsWith('/blog/')) return '/en/blog'
  if (pathname.startsWith('/risk-dictionary/')) return '/en'
  if (pathname.startsWith('/services/')) return '/en/services'
  if (pathname.startsWith('/tools/')) return '/en/tools'
  return '/en'
}
