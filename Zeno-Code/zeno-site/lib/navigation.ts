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
    key: 'home',
    zh: { label: '首页', href: '/' },
    en: { label: 'Home', href: '/en' },
  },
  {
    key: 'blog',
    zh: { label: '公开实践', href: '/blog' },
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
          { key: 'notes', zh: { label: '碎片笔记', href: '/notes', desc: '比文章短，比动态重' }, en: { label: 'Notes', href: '/en/notes' } },
        ],
      },
      {
        key: 'practice',
        zh: { label: '长期实践', desc: '用真实行业和项目检验 AI 是否有用。' },
        en: { label: 'Practice', desc: 'Testing AI against real work.' },
        items: [
          { key: 'knowledge', zh: { label: '知识体系', href: '/knowledge', desc: '见自己、见天地、见众生' }, en: { label: 'Knowledge map', href: '/en/blog' } },
          { key: 'cases', zh: { label: '项目与判断样张', href: '/cases', desc: '看具体过程和交付颗粒度' }, en: { label: 'Cases', href: '/en/blog' } },
          { key: 'resources', zh: { label: '资料库', href: '/resources', desc: '模板、规则、清单与可复用资料' }, en: { label: 'Resources', href: '/en/tools' } },
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
          { key: 'renovation-home', zh: { label: '装修视野', href: '/renovation', desc: '17 年现场经验整理出的判断路径' }, en: { label: 'Renovation practice', href: '/en/tools' } },
          { key: 'renovation-tools', zh: { label: '免费判断工具', href: '/tools', desc: '居住诊断、报价初筛和检查工具' }, en: { label: 'Free tools', href: '/en/tools' } },
          { key: 'renovation-resources', zh: { label: '签约前资料库', href: '/resources', desc: '风险词典、规则库和检查模板' }, en: { label: 'Resources', href: '/en/tools' } },
          { key: 'renovation-review', zh: { label: '报价 / 合同人工审查', href: '/services/quote-review', desc: '已有具体材料时，看清交付和价格' }, en: { label: 'Quote review', href: '/en/services' } },
        ],
      },
    ],
  },
  {
    key: 'ai-tools',
    zh: { label: 'AI 工具', href: '/ai-tools' },
    en: { label: 'AI Tools', href: '/en/tools' },
    groups: [
      {
        key: 'free-tools',
        zh: { label: '先自己试试', desc: '免费使用，不要求先购买服务。' },
        en: { label: 'Try first', desc: 'Free tools, no purchase required.' },
        items: [
          { key: 'opc-diagnosis', zh: { label: '一人公司诊断', href: '/ai-tools/opc-diagnosis', desc: '看看产品、获客和交付卡在哪一步' }, en: { label: 'Solo business check', href: '/en/tools' } },
          { key: 'content-strategy', zh: { label: '内容策略生成', href: '/ai-tools/content-strategy', desc: '从行业和经验里找到值得写的方向' }, en: { label: 'Content strategy', href: '/en/tools' } },
          { key: 'task-planner', zh: { label: 'AI Agent 任务规划器', href: '/ai-tools/task-planner', desc: '把专业任务拆成可执行步骤' }, en: { label: 'Agent task planner', href: '/en/tools' } },
          { key: 'renovation-tools', zh: { label: '装修判断工具', href: '/tools', desc: '17 年经验做成的垂直工具组' }, en: { label: 'Renovation tools', href: '/en/tools' } },
        ],
      },
    ],
  },
  {
    key: 'services',
    zh: { label: '项目合作', href: '/services' },
    en: { label: 'Work together', href: '/en/services' },
    groups: [
      {
        key: 'services-group',
        zh: { label: 'AI 落地服务', desc: '先说真实问题，再确认范围、交付物和验收边界。' },
        en: { label: 'AI delivery', desc: 'Start with a real problem and a clear scope.' },
        items: [
          { key: 'training', zh: { label: 'AI 实战工作坊', href: '/training', desc: '面向企业团队的现场实操' }, en: { label: 'AI workshop', href: '/en/services' } },
          { key: 'workflow', zh: { label: '流程自动化', href: '/services#ai-workflow', desc: '把重复工作搭成可执行流程' }, en: { label: 'AI workflows', href: '/en/services' } },
          { key: 'knowledge-base', zh: { label: '企业知识库', href: '/services#knowledge-base', desc: '让分散经验变成可调用知识' }, en: { label: 'Knowledge base', href: '/en/services' } },
          { key: 'agent', zh: { label: '智能体开发', href: '/services#ai-agent', desc: '围绕明确任务设计、测试和交接' }, en: { label: 'AI agents', href: '/en/services' } },
          { key: 'website', zh: { label: '网站与内容系统', href: '/services#website', desc: '从信息架构到上线交接' }, en: { label: 'Website systems', href: '/en/services' } },
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
        zh: { label: 'OPC 协作共同体', desc: '分享真实项目，带着上下文连接。' },
        en: { label: 'OPC community', desc: 'Real projects and contextual connections.' },
        items: [
          { key: 'community-intro', zh: { label: '共同体说明', href: '/community', desc: '星火者是什么、怎么运转、适合谁' }, en: { label: 'About Spark', href: '/en/blog' } },
          { key: 'community-join', zh: { label: '申请加入', href: '/community#join', desc: '先判断彼此是否适合' }, en: { label: 'Join', href: '/en/blog' } },
          { key: 'opc-knowledge', zh: { label: 'OPC 知识体系', href: '/opc-knowledge', desc: '从理论、工具到行动框架' }, en: { label: 'OPC knowledge', href: '/en/blog' } },
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
        zh: { label: '认识赞诺', desc: '从传统行业到 AI 实践。' },
        en: { label: 'About Zeno', desc: 'From traditional business to AI practice.' },
        items: [
          { key: 'about-story', zh: { label: '我的经历', href: '/about', desc: '经营、项目、AI 与一人公司' }, en: { label: 'My story', href: '/en/about' } },
          { key: 'contact', zh: { label: '联系我', href: '/contact', desc: '请说明身份、问题和希望交流的方向' }, en: { label: 'Contact', href: '/en/about' } },
        ],
      },
    ],
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
