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
    key: 'judgment',
    zh: { label: '装修判断', href: '/start' },
    en: { label: 'Judgment', href: '/en' },
    groups: [
      {
        key: 'stages',
        zh: { label: '按决策顺序进', desc: '从看人到看居住，6 步走完' },
        en: { label: 'By Decision Order', desc: 'From people to living, 6 steps' },
        items: [
          { key: 'stage-people', zh: { label: '01 · 先看人', href: '/start/people', desc: '装修公司 / 设计师 / 工长 / 师傅怎么判断' }, en: { label: '01 · People', href: '/en', desc: 'Choose the right team' } },
          { key: 'stage-budget', zh: { label: '02 · 再看钱', href: '/start/budget', desc: '预算和报价怎么定' }, en: { label: '02 · Budget', href: '/en', desc: 'Budget vs quote' } },
          { key: 'stage-contract', zh: { label: '03 · 再看合同', href: '/start/contract', desc: '签约前必须改什么' }, en: { label: '03 · Contract', href: '/en', desc: 'What to fix before signing' } },
          { key: 'stage-build', zh: { label: '04 · 再看施工', href: '/start/build', desc: '工地怎么盯、变更怎么留痕' }, en: { label: '04 · Build', href: '/en', desc: 'On-site checkpoints' } },
          { key: 'stage-inspect', zh: { label: '05 · 再看验收', href: '/start/inspect', desc: '验收和质保怎么写' }, en: { label: '05 · Inspect', href: '/en', desc: 'Handover & warranty' } },
          { key: 'stage-living', zh: { label: '06 · 再看居住', href: '/start/living', desc: '怎么避免住进去才后悔' }, en: { label: '06 · Living', href: '/en', desc: 'Live well after move-in' } },
        ],
      },
    ],
  },
  {
    key: 'tools',
    zh: { label: '工具与资料', href: '/tools' },
    en: { label: 'Tools', href: '/en/tools' },
    groups: [
      {
        key: 'free-tools',
        zh: { label: '免费工具', desc: '在线用，不用注册' },
        en: { label: 'Free Tools', desc: 'Use online, no signup' },
        items: [
          { key: 'quote-screening', zh: { label: '报价初筛', href: '/tools/quote-check', desc: '上传报价，看风险类型' }, en: { label: 'Quote Screening', href: '/en/tools', desc: 'Upload and check' } },
          { key: 'budget-structure', zh: { label: '预算分配', href: '/tools/budget-structure', desc: '按取向拆钱' }, en: { label: 'Budget Split', href: '/en/tools', desc: 'Split by tier' } },
          { key: 'budget-risk', zh: { label: '超预算自测', href: '/tools/budget-risk', desc: '查超支来源' }, en: { label: 'Overrun Quiz', href: '/en/tools', desc: 'Find risk source' } },
          { key: 'inspection-guide', zh: { label: '验收向导', href: '/tools/inspection-guide', desc: '按节点生成清单' }, en: { label: 'Inspection Guide', href: '/en/tools', desc: 'By stage' } },
          { key: 'unit-converter', zh: { label: '单位换算', href: '/tools/unit-converter', desc: '㎡ / 米 / 延米' }, en: { label: 'Unit Converter', href: '/en/tools', desc: 'Area & length' } },
          { key: 'tile-calculator', zh: { label: '瓷砖计算', href: '/tools/tile-calculator', desc: '片数和损耗' }, en: { label: 'Tile Calculator', href: '/en/tools', desc: 'Pieces & waste' } },
          { key: 'paint-calculator', zh: { label: '乳胶漆计算', href: '/tools/paint-calculator', desc: '底漆面漆桶数' }, en: { label: 'Paint Calculator', href: '/en/tools', desc: 'Primer & topcoat' } },
        ],
      },
      {
        key: 'templates',
        zh: { label: '清单与模板', desc: '免费领取' },
        en: { label: 'Templates', desc: 'Free to claim' },
        items: [
          { key: 'quote-list', zh: { label: '报价审核清单', href: '/resources#baojia-shenhe-qingdan' }, en: { label: 'Quote Checklist', href: '/en/resources' } },
          { key: 'budget-template', zh: { label: '预算模板', href: '/resources#zhuangxiu-yusuan-moban' }, en: { label: 'Budget Template', href: '/en/resources' } },
          { key: 'handover-list', zh: { label: '验收清单', href: '/resources#yanshou-qingdan' }, en: { label: 'Handover Checklist', href: '/en/resources' } },
          { key: 'living-list', zh: { label: '居住场景自查表', href: '/resources#shizhu-pai-zijian-biao' }, en: { label: 'Living Checklist', href: '/en/resources' } },
        ],
      },
      {
        key: 'paid',
        zh: { label: '付费资料' },
        en: { label: 'Paid' },
        items: [
          { key: 'quote-guide', zh: { label: '报价避坑指南 ¥39', href: '/pricing/baojia-guide' }, en: { label: 'Quote Guide ¥39', href: '/en/pricing/baojia-guide' } },
        ],
      },
    ],
  },
  {
    key: 'services',
    zh: { label: '服务', href: '/services' },
    en: { label: 'Services', href: '/en/services' },
    groups: [
      {
        key: 'all-services',
        zh: { label: '人工服务', desc: '先用工具，卡住了再来' },
        en: { label: 'Human Services', desc: 'Use tools first, come when stuck' },
        items: [
          { key: 'quote-fast', zh: { label: '报价风险快审', href: '/services/renovation#baojia-shenhe', desc: '¥699 / 份' }, en: { label: 'Quote Quick Review', href: '/en/services', desc: '¥699' } },
          { key: 'decision-pack', zh: { label: '签约前决策包', href: '/services/renovation#qianyue-qian-juece-bao', desc: '¥1499 / 次' }, en: { label: 'Pre-sign Pack', href: '/en/services', desc: '¥1499' } },
          { key: 'budget-diagnosis', zh: { label: '预算取舍诊断', href: '/services/renovation#yusuan-zixun', desc: '¥399 / 次' }, en: { label: 'Budget Diagnosis', href: '/en/services', desc: '¥399' } },
          { key: 'living-service', zh: { label: '居住场景装修', href: '/services/renovation#shi-zhu-pai-zhuangxiu', desc: '¥9800 起 · 南宁本地' }, en: { label: 'Real Living Service', href: '/en/services', desc: '¥9800+' } },
          { key: 'ai-service', zh: { label: 'AI 工作流咨询', href: '/services/ai-workflow', desc: '¥1999 起' }, en: { label: 'AI Consulting', href: '/en/services', desc: '¥1999+' } },
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
          { key: 'blog', zh: { label: '文章与记录', href: '/blog', desc: '工地观察、装修判断、AI 实践' }, en: { label: 'Writing', href: '/en/blog', desc: 'Field notes & articles' } },
          { key: 'ai-hub', zh: { label: 'AI 实践路线', href: '/ai', desc: '传统行业人怎么接 AI' }, en: { label: 'AI Route', href: '/en', desc: 'AI for traditional work' } },
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
  '/tools/prompts': '/en/tools/prompts',
  '/tools/quote-check': '/en/tools',
  '/tools/budget-structure': '/en/tools',
  '/tools/budget-risk': '/en/tools',
  '/tools/budget-risk/result': '/en/tools',
  '/tools/unit-converter': '/en/tools',
  '/tools/tile-calculator': '/en/tools',
  '/tools/paint-calculator': '/en/tools',
  '/tools/inspection-guide': '/en/tools',
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
    const knownCn = ['/', '/start', '/about', '/blog', '/cases', '/ai', '/tools', '/tools/prompts', '/tools/quote-check', '/tools/budget-structure', '/tools/budget-risk', '/tools/unit-converter', '/tools/tile-calculator', '/tools/paint-calculator', '/tools/inspection-guide', '/topics', '/resources', '/services', '/contact', '/login', '/register']
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
