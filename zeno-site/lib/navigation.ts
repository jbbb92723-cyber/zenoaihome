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
        key: 'quote',
        zh: { label: '看报价', desc: '先看清有没有漏、有没有糊、后面会不会加钱' },
        en: { label: 'Quote', desc: 'Find gaps, vague scope and add-on risks' },
        items: [
          { key: 'quote-tool', zh: { label: '报价初筛工具', href: '/tools/quote-check', desc: '上传报价单，先做一轮风险初筛' }, en: { label: 'Quote Screening Tool', href: '/en/tools', desc: 'Screen quote risks first' } },
          { key: 'quote-checklist', zh: { label: '报价审核清单', href: '/resources#baojia-shenhe-qingdan', desc: '按漏项、单价、工艺逐项核对' }, en: { label: 'Quote Checklist', href: '/en/resources', desc: 'Line-by-line checklist' } },
          { key: 'quote-guide', zh: { label: '报价避坑指南', href: '/pricing/baojia-guide', desc: '低价数字产品，签约前系统看一遍' }, en: { label: 'Quote Guide', href: '/en/pricing/baojia-guide', desc: 'A compact paid guide' } },
          { key: 'quote-service', zh: { label: '报价单审核服务', href: '/services/renovation#baojia-shenhe', desc: '看不明白时再进入人工审核' }, en: { label: 'Quote Audit Service', href: '/en/services', desc: 'Human review when needed' } },
        ],
      },
      {
        key: 'budget',
        zh: { label: '控预算', desc: '把总价拆成底线、弹性和缓冲' },
        en: { label: 'Budget', desc: 'Split baseline, flex and buffer' },
        items: [
          { key: 'budget-risk', zh: { label: '预算风险自测', href: '/tools/budget-risk', desc: '先分清风险来自哪里' }, en: { label: 'Budget Risk Quiz', href: '/en/tools', desc: 'Find the risk source' } },
          { key: 'budget-template', zh: { label: '预算模板', href: '/resources#zhuangxiu-yusuan-moban', desc: '把预算按结构写下来' }, en: { label: 'Budget Template', href: '/en/resources', desc: 'Structure the budget' } },
          { key: 'budget-service', zh: { label: '预算结构诊断', href: '/services/renovation#yusuan-zixun', desc: '预算越算越乱时进入人工判断' }, en: { label: 'Budget Diagnosis', href: '/en/services', desc: 'Human budget diagnosis' } },
        ],
      },
      {
        key: 'construction',
        zh: { label: '施工验收', desc: '关键节点要确认，现场变更要留痕' },
        en: { label: 'Build & Handover', desc: 'Check milestones and keep evidence' },
        items: [
          { key: 'checkpoint-entry', zh: { label: '节点验收入口', href: '/resources#construction-checkpoints', desc: '水电、防水、泥工、木作、油漆' }, en: { label: 'Checkpoint Entry', href: '/en/resources', desc: 'Electrical, waterproofing, masonry...' } },
          { key: 'evidence-list', zh: { label: '留痕清单', href: '/resources#yanshou-qingdan', desc: '该拍什么、该确认什么' }, en: { label: 'Evidence Checklist', href: '/en/resources', desc: 'What to record' } },
          { key: 'site-article', zh: { label: '施工阶段常见问题', href: '/blog/03-cong-gongdi-kan-shijie', desc: '从工地现场看责任和边界' }, en: { label: 'Site Issues', href: '/en/blog', desc: 'Responsibility and boundaries' } },
        ],
      },
      {
        key: 'living',
        zh: { label: '真实居住', desc: '不要只为效果图买单' },
        en: { label: 'Real Living', desc: 'Do not design only for photos' },
        items: [
          { key: 'home-not-showroom', zh: { label: '家不是样板间', href: '/blog/02-jia-bu-shi-yangban-jian', desc: '先看家里真正怎么住' }, en: { label: 'Home Is Not A Showroom', href: '/en/articles/home-is-not-a-showroom', desc: 'Design for actual living' } },
          { key: 'living-check', zh: { label: '实住派自查表', href: '/resources#shizhu-pai-zijian-biao', desc: '家庭成员、做饭、收纳、清洁' }, en: { label: 'Living Checklist', href: '/en/resources', desc: 'Family, cooking, storage' } },
          { key: 'living-service', zh: { label: '真实居住服务', href: '/services/renovation#shi-zhu-pai-zhuangxiu', desc: '南宁本地深度服务' }, en: { label: 'Real Living Service', href: '/en/services', desc: 'Deep service when fit' } },
        ],
      },
      {
        key: 'ai',
        zh: { label: 'AI 进入传统工作', desc: '先用真实任务接 AI，不追工具堆' },
        en: { label: 'AI In Real Work', desc: 'Start from a real task' },
        items: [
          { key: 'prompt-lab', zh: { label: '提示词体验场', href: '/tools/prompts', desc: '用一个真实任务先跑一轮' }, en: { label: 'Prompt Lab', href: '/en/tools/prompts', desc: 'Run one real task first' } },
          { key: 'ai-article', zh: { label: 'AI 工作流文章', href: '/blog/04-wei-shenme-wo-kaishi-renzheng-xue-ai', desc: '为什么从现场经验接入 AI' }, en: { label: 'AI Workflow Writing', href: '/en/articles/why-i-started-learning-ai', desc: 'Why AI must start from work' } },
          { key: 'ai-service', zh: { label: 'AI 咨询服务', href: '/services/ai-workflow', desc: '把经验、内容和流程整理成系统' }, en: { label: 'AI Consulting', href: '/en/services', desc: 'Structure experience into workflow' } },
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
        key: 'self-tests',
        zh: { label: '自测工具', desc: '先把问题缩小' },
        en: { label: 'Self Checks', desc: 'Narrow down the problem' },
        items: [
          { key: 'budget-risk', zh: { label: '预算风险自测', href: '/tools/budget-risk', desc: '已上线' }, en: { label: 'Budget Risk Quiz', href: '/en/tools', desc: 'Live' } },
          { key: 'quote-screening', zh: { label: '报价初筛工具', href: '/tools/quote-check', desc: '已上线：先做风险类型初筛' }, en: { label: 'Quote Screening', href: '/en/tools', desc: 'Live' } },
          { key: 'needs-map', zh: { label: '需求梳理问卷', href: '/resources#shizhu-pai-zijian-biao', desc: '清单模式' }, en: { label: 'Needs Map', href: '/en/resources', desc: 'Checklist' } },
        ],
      },
      {
        key: 'templates',
        zh: { label: '清单模板', desc: '网页端领取，进入用户中心留记录' },
        en: { label: 'Templates', desc: 'Claim on web' },
        items: [
          { key: 'quote-list', zh: { label: '报价审核清单', href: '/resources#baojia-shenhe-qingdan' }, en: { label: 'Quote Checklist', href: '/en/resources' } },
          { key: 'budget-template', zh: { label: '预算模板', href: '/resources#zhuangxiu-yusuan-moban' }, en: { label: 'Budget Template', href: '/en/resources' } },
          { key: 'handover-list', zh: { label: '验收清单', href: '/resources#yanshou-qingdan' }, en: { label: 'Handover Checklist', href: '/en/resources' } },
          { key: 'living-list', zh: { label: '真实居住自查表', href: '/resources#shizhu-pai-zijian-biao' }, en: { label: 'Real Living Checklist', href: '/en/resources' } },
        ],
      },
      {
        key: 'products',
        zh: { label: '低价数字产品', desc: '付费后进入订单与用户中心' },
        en: { label: 'Digital Products', desc: 'Paid guides and packs' },
        items: [
          { key: 'quote-guide', zh: { label: '报价避坑完整指南', href: '/pricing/baojia-guide', desc: '¥39' }, en: { label: 'Quote Guide', href: '/en/pricing/baojia-guide', desc: '¥39' } },
          { key: 'contract-pack', zh: { label: '合同条款提醒包', href: '/pricing#contract-pack', desc: '规划中' }, en: { label: 'Contract Pack', href: '/en/pricing/baojia-guide', desc: 'Planned' } },
          { key: 'startup-pack', zh: { label: '装修启动包', href: '/pricing#renovation-start-pack', desc: '规划中' }, en: { label: 'Renovation Starter Pack', href: '/en/pricing/baojia-guide', desc: 'Planned' } },
        ],
      },
      {
        key: 'cases',
        zh: { label: '案例复盘', desc: '从真实问题回看判断过程' },
        en: { label: 'Case Reviews', desc: 'Review the judgment process' },
        items: [
          { key: 'quote-review', zh: { label: '报价复盘', href: '/cases#quote' }, en: { label: 'Quote Review', href: '/en/blog' } },
          { key: 'budget-review', zh: { label: '预算复盘', href: '/cases#budget' }, en: { label: 'Budget Review', href: '/en/blog' } },
          { key: 'ai-review', zh: { label: 'AI / 内容资产复盘', href: '/blog/04-wei-shenme-wo-kaishi-renzheng-xue-ai' }, en: { label: 'AI / Content Asset Review', href: '/en/articles/why-i-started-learning-ai' } },
        ],
      },
    ],
  },
  {
    key: 'ai-upgrade',
    zh: { label: 'AI 升级', href: '/ai' },
    en: { label: 'AI Upgrade', href: '/en' },
    groups: [
      {
        key: 'ai-tools',
        zh: { label: 'AI 工具', desc: '先用真实任务跑起来' },
        en: { label: 'AI Tools', desc: 'Start from real tasks' },
        items: [
          { key: 'ai-hub', zh: { label: 'AI 升级路线', href: '/ai', desc: '传统装修经验如何接入 AI' }, en: { label: 'AI Upgrade Route', href: '/en', desc: 'How field work meets AI' } },
          { key: 'prompt-lab', zh: { label: 'AI 场景生成器', href: '/tools/prompts', desc: '报价、客户、施工、内容一键生成提示词' }, en: { label: 'Prompt Lab', href: '/en/tools/prompts', desc: 'Generate prompts from scenarios' } },
          { key: 'quote-ai', zh: { label: '报价初筛工具', href: '/tools/quote-check', desc: '把报价判断变成可复用流程' }, en: { label: 'Quote Screening', href: '/en/tools', desc: 'Reusable quote screening' } },
        ],
      },
      {
        key: 'ai-methods',
        zh: { label: '方法论', desc: '不追工具，先重排流程' },
        en: { label: 'Methods', desc: 'Workflow before tools' },
        items: [
          { key: 'ai-article', zh: { label: '为什么我开始认真学 AI', href: '/blog/04-wei-shenme-wo-kaishi-renzheng-xue-ai', desc: '从现场经验进入 AI' }, en: { label: 'Why I Started Learning AI', href: '/en/articles/why-i-started-learning-ai' } },
          { key: 'content-system', zh: { label: '内容资产 SOP', href: '/resources#ai-neirong-gongzuoliu-tishici-bao', desc: '把经验变成可复用提示词' }, en: { label: 'Content System', href: '/en/resources' } },
          { key: 'ai-workflow-service', zh: { label: 'AI 工作流咨询', href: '/services/ai-workflow', desc: '适合传统行业人做系统化' }, en: { label: 'AI Workflow Consulting', href: '/en/services' } },
        ],
      },
      {
        key: 'ai-notes',
        zh: { label: '经验心得', desc: '工具体验、日常思考和复盘' },
        en: { label: 'Notes', desc: 'Experiments and reflections' },
        items: [
          { key: 'blog-ai', zh: { label: 'AI 实践文章', href: '/blog#ai', desc: '长期记录' }, en: { label: 'AI Writing', href: '/en/blog' } },
          { key: 'notes-ai', zh: { label: '思考札记', href: '/notes', desc: '日常观察与方法沉淀' }, en: { label: 'Notes', href: '/en/notes' } },
          { key: 'pricing-ai-course', zh: { label: 'AI 小课与产品', href: '/pricing#ai-workflow-course', desc: '低价产品和课程入口' }, en: { label: 'AI Products', href: '/en/pricing/baojia-guide' } },
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
        key: 'quote-service',
        zh: { label: '报价单审核', desc: '适合快签约但报价看不明白的人' },
        en: { label: 'Quote Audit', desc: 'For unclear quotes before signing' },
        items: [
          { key: 'quote-fit', zh: { label: '适合谁', href: '/services/renovation#baojia-shenhe' }, en: { label: 'Who it fits', href: '/en/services' } },
          { key: 'quote-deliver', zh: { label: '交付内容', href: '/services/renovation#baojia-shenhe' }, en: { label: 'Deliverables', href: '/en/services' } },
          { key: 'quote-price', zh: { label: '价格与边界：¥699 / 份', href: '/services/renovation#baojia-shenhe' }, en: { label: 'Price & boundaries', href: '/en/services' } },
          { key: 'quote-submit', zh: { label: '立即提交资料', href: '/services#service-form' }, en: { label: 'Submit materials', href: '/en/services' } },
        ],
      },
      {
        key: 'budget-service',
        zh: { label: '预算结构诊断', desc: '适合预算有数但越算越乱的人' },
        en: { label: 'Budget Diagnosis', desc: 'For messy budget structure' },
        items: [
          { key: 'budget-fit', zh: { label: '适合谁', href: '/services/renovation#yusuan-zixun' }, en: { label: 'Who it fits', href: '/en/services' } },
          { key: 'budget-deliver', zh: { label: '交付内容', href: '/services/renovation#yusuan-zixun' }, en: { label: 'Deliverables', href: '/en/services' } },
          { key: 'budget-price', zh: { label: '价格与边界：¥1299 / 次起', href: '/services/renovation#yusuan-zixun' }, en: { label: 'Price & boundaries', href: '/en/services' } },
          { key: 'budget-submit', zh: { label: '立即提交资料', href: '/services#service-form' }, en: { label: 'Submit materials', href: '/en/services' } },
        ],
      },
      {
        key: 'living-service',
        zh: { label: '真实居住派服务', desc: '适合南宁本地、重视长期使用的人' },
        en: { label: 'Real Living Service', desc: 'For deep real-living projects' },
        items: [
          { key: 'living-fit', zh: { label: '适合谁', href: '/services/renovation#shi-zhu-pai-zhuangxiu' }, en: { label: 'Who it fits', href: '/en/services' } },
          { key: 'living-deliver', zh: { label: '交付内容', href: '/services/renovation#shi-zhu-pai-zhuangxiu' }, en: { label: 'Deliverables', href: '/en/services' } },
          { key: 'living-price', zh: { label: '价格与边界：¥9800 起', href: '/services/renovation#shi-zhu-pai-zhuangxiu' }, en: { label: 'Price & boundaries', href: '/en/services' } },
          { key: 'living-submit', zh: { label: '立即提交资料', href: '/services#service-form' }, en: { label: 'Submit materials', href: '/en/services' } },
        ],
      },
      {
        key: 'ai-service',
        zh: { label: 'AI 工作流咨询', desc: '适合传统行业人把经验接进 AI' },
        en: { label: 'AI Workflow Consulting', desc: 'Bring field experience into AI' },
        items: [
          { key: 'ai-fit', zh: { label: '适合谁', href: '/services/ai-workflow' }, en: { label: 'Who it fits', href: '/en/services' } },
          { key: 'ai-deliver', zh: { label: '交付内容', href: '/services/ai-workflow' }, en: { label: 'Deliverables', href: '/en/services' } },
          { key: 'ai-price', zh: { label: '价格与边界：¥1999 起', href: '/services/ai-workflow' }, en: { label: 'Price & boundaries', href: '/en/services' } },
          { key: 'ai-submit', zh: { label: '立即提交资料', href: '/services#service-form' }, en: { label: 'Submit materials', href: '/en/services' } },
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
        key: 'identity',
        zh: { label: '这个人从哪里来', desc: '现场经验、写作和长期记录' },
        en: { label: 'Who Zeno Is', desc: 'Field experience and writing' },
        items: [
          { key: 'about-zeno', zh: { label: '我是谁', href: '/about', desc: '16 年现场经验' }, en: { label: 'Who I Am', href: '/en/about', desc: '16 years on-site' } },
          { key: 'why-site', zh: { label: '为什么做这个站', href: '/about#why-site', desc: '把经验变成可用判断工具' }, en: { label: 'Why This Site', href: '/en/about', desc: 'Turn experience into tools' } },
          { key: 'blog', zh: { label: '长期记录', href: '/blog', desc: '文章、工地观察与 AI 实践' }, en: { label: 'Writing', href: '/en/blog', desc: 'Articles and field notes' } },
          { key: 'contact', zh: { label: '联系方式', href: '/contact', desc: '微信、邮箱和服务咨询' }, en: { label: 'Contact', href: '/en/about', desc: 'Email and contact' } },
        ],
      },
    ],
  },
]

/* ─── 扁平化导航（Footer 使用） ─────────────────────── */

export const mainNav: NavItem[] = [
  { key: 'home', zh: { label: '首页', href: '/' }, en: { label: 'Home', href: '/en' } },
  { key: 'start', zh: { label: '装修判断入口', href: '/start' }, en: { label: 'Start Here', href: '/en' } },
  { key: 'tools', zh: { label: '工具与资料', href: '/tools' }, en: { label: 'Tools', href: '/en/tools' } },
  { key: 'ai-upgrade', zh: { label: 'AI 升级', href: '/ai' }, en: { label: 'AI Upgrade', href: '/en' } },
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
  '/ai':         '/en',
  '/tools':      '/en/tools',
  '/topics':     '/en/topics',
  '/tools/prompts': '/en/tools/prompts',
  '/tools/quote-check': '/en/tools',
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
    const knownCn = ['/', '/start', '/about', '/blog', '/cases', '/ai', '/tools', '/tools/prompts', '/tools/quote-check', '/tools/budget-risk', '/topics', '/resources', '/services', '/contact', '/login', '/register']
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
