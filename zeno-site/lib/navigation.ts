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
    zh: { label: '报价风险判断', href: '/tools/quote-check' },
    en: { label: 'Judgment', href: '/en' },
    groups: [
      {
        key: 'quote-risk',
        zh: { label: '签约前主线', desc: '报价、合同、付款节点先说清' },
        en: { label: 'By Decision Order', desc: 'From people to living, 6 steps' },
        items: [
          { key: 'quote-screening-main', zh: { label: '01 · 免费报价初筛', href: '/tools/quote-check', desc: '先看哪里没写清' }, en: { label: '01 · Quote screening', href: '/en', desc: 'Start with quote risk' } },
          { key: 'risk-library', zh: { label: '02 · 风险词典与规则', href: '/tools/quote-check#risk-library', desc: '漏项、模糊项、增项口子' }, en: { label: '02 · Risk library', href: '/en', desc: 'Risk rules' } },
          { key: 'quote-checklist', zh: { label: '03 · 报价审核清单', href: '/resources#baojia-shenhe-qingdan', desc: '签约前逐项核对' }, en: { label: '03 · Checklist', href: '/en/resources', desc: 'Pre-sign checklist' } },
          { key: 'contract-stage', zh: { label: '04 · 合同和付款节点', href: '/start/contract', desc: '口头承诺写进文字' }, en: { label: '04 · Contract', href: '/en', desc: 'Contract checkpoints' } },
          { key: 'service-ladder', zh: { label: '05 · 人工快审三档', href: '/services/renovation', desc: '¥399 / ¥699 / ¥1499' }, en: { label: '05 · Services', href: '/en/services', desc: 'Human review' } },
        ],
      },
    ],
  },
  {
    key: 'tools',
    zh: { label: '工具与资料', href: '/tools/quote-check' },
    en: { label: 'Tools', href: '/en/tools' },
    groups: [
      {
        key: 'pre-sign-tools',
        zh: { label: '签约前工具', desc: '报价初筛为主，其他只做辅助' },
        en: { label: 'Free Tools', desc: 'Use online, no signup' },
        items: [
          { key: 'quote-screening', zh: { label: '报价初筛', href: '/tools/quote-check', desc: '主入口：看能不能继续签' }, en: { label: 'Quote Screening', href: '/en/tools', desc: 'Upload and check' } },
          { key: 'risk-library-tool', zh: { label: '风险词典与模板', href: '/tools/quote-check#risk-library', desc: '结构化风险资产' }, en: { label: 'Risk Library', href: '/en/tools', desc: 'Risk assets' } },
          { key: 'budget-structure', zh: { label: '预算辅助', href: '/tools/budget-structure', desc: '简约够住 / 舒适耐用 / 精致改善' }, en: { label: 'Budget Split', href: '/en/tools', desc: 'Split by tier' } },
          { key: 'budget-risk', zh: { label: '超预算原因', href: '/tools/budget-risk', desc: '辅助判断，不替代报价' }, en: { label: 'Overrun Quiz', href: '/en/tools', desc: 'Find risk source' } },
          { key: 'unit-converter', zh: { label: '单位换算', href: '/tools/unit-converter', desc: '先统一报价口径' }, en: { label: 'Unit Converter', href: '/en/tools', desc: 'Area & length' } },
          { key: 'inspection-guide', zh: { label: '验收向导', href: '/tools/inspection-guide', desc: '付款前留痕辅助' }, en: { label: 'Inspection Guide', href: '/en/tools', desc: 'By stage' } },
        ],
      },
      {
        key: 'templates',
        zh: { label: '风险资料', desc: '签约前能直接用' },
        en: { label: 'Templates', desc: 'Free to claim' },
        items: [
          { key: 'quote-list', zh: { label: '报价审核清单', href: '/resources#baojia-shenhe-qingdan' }, en: { label: 'Quote Checklist', href: '/en/resources' } },
          { key: 'budget-template', zh: { label: '预算模板', href: '/resources#zhuangxiu-yusuan-moban' }, en: { label: 'Budget Template', href: '/en/resources' } },
          { key: 'handover-list', zh: { label: '验收清单', href: '/resources#yanshou-qingdan' }, en: { label: 'Handover Checklist', href: '/en/resources' } },
        ],
      },
      {
        key: 'paid',
        zh: { label: '付费资料' },
        en: { label: 'Paid' },
        items: [
          { key: 'quote-guide', zh: { label: '报价风险自查指南 ¥39', href: '/pricing/baojia-guide' }, en: { label: 'Quote Guide ¥39', href: '/en/pricing/baojia-guide' } },
        ],
      },
    ],
  },
  {
    key: 'services',
    zh: { label: '服务价格', href: '/services/renovation' },
    en: { label: 'Services', href: '/en/services' },
    groups: [
      {
        key: 'all-services',
        zh: { label: '三档人工判断', desc: '预算 / 报价 / 签约前' },
        en: { label: 'Human Services', desc: 'Use tools first, come when stuck' },
        items: [
          { key: 'quote-fast', zh: { label: '报价风险快审', href: '/services/renovation#baojia-shenhe', desc: '¥699 / 份' }, en: { label: 'Quote Quick Review', href: '/en/services', desc: '¥699' } },
          { key: 'decision-pack', zh: { label: '签约前决策包', href: '/services/renovation#qianyue-qian-juece-bao', desc: '¥1499 / 次' }, en: { label: 'Pre-sign Pack', href: '/en/services', desc: '¥1499' } },
          { key: 'budget-diagnosis', zh: { label: '预算取舍诊断', href: '/services/renovation#yusuan-zixun', desc: '¥399 / 次' }, en: { label: 'Budget Diagnosis', href: '/en/services', desc: '¥399' } },
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
          { key: 'resources-main', zh: { label: '风险资料库', href: '/resources', desc: '词典、规则、模板和清单' }, en: { label: 'Resources', href: '/en/resources', desc: 'Risk resources' } },
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
