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
          { key: 'quote-tool', zh: { label: '报价初筛工具', href: '/tools/quote-check', desc: '不用先懂施工，先做一轮风险初筛' }, en: { label: 'Quote Screening Tool', href: '/en/tools', desc: 'Screen quote risks first' } },
          { key: 'quote-checklist', zh: { label: '报价审核清单', href: '/resources#baojia-shenhe-qingdan', desc: '按漏项、单价、工艺逐项核对' }, en: { label: 'Quote Checklist', href: '/en/resources', desc: 'Line-by-line checklist' } },
          { key: 'quote-guide', zh: { label: '报价避坑指南', href: '/pricing/baojia-guide', desc: '低价数字产品，签约前系统看一遍' }, en: { label: 'Quote Guide', href: '/en/pricing/baojia-guide', desc: 'A compact paid guide' } },
          { key: 'sign-pack', zh: { label: '签约前决策包', href: '/services/renovation#qianyue-qian-juece-bao', desc: '报价、预算、合同一次看全' }, en: { label: 'Sign-before Decision Pack', href: '/en/services', desc: 'Review quote, budget and contract together' } },
          { key: 'quote-service', zh: { label: '报价风险快审', href: '/services/renovation#baojia-shenhe', desc: '只看报价重点风险，适合快速判断' }, en: { label: 'Quote Quick Review', href: '/en/services', desc: 'Fast human review when needed' } },
        ],
      },
      {
        key: 'budget',
        zh: { label: '分预算', desc: '先看总预算更像简约、舒适还是精致' },
        en: { label: 'Budget', desc: 'Split baseline, flex and buffer' },
        items: [
          { key: 'budget-structure', zh: { label: '预算分配工具', href: '/tools/budget-structure', desc: '按简约、舒适、精致三档拆钱' }, en: { label: 'Budget Split Tool', href: '/en/tools', desc: 'Split budget into working buckets' } },
          { key: 'budget-risk', zh: { label: '超预算原因自测', href: '/tools/budget-risk', desc: '看超支更像来自报价、流程还是需求' }, en: { label: 'Overrun Cause Quiz', href: '/en/tools', desc: 'Find the risk source' } },
          { key: 'budget-template', zh: { label: '预算模板', href: '/resources#zhuangxiu-yusuan-moban', desc: '把预算按几份钱写下来' }, en: { label: 'Budget Template', href: '/en/resources', desc: 'Structure the budget' } },
          { key: 'budget-service', zh: { label: '预算取舍诊断', href: '/services/renovation#yusuan-zixun', desc: '预算越算越乱时进入人工判断' }, en: { label: 'Budget Diagnosis', href: '/en/services', desc: 'Human budget diagnosis' } },
        ],
      },
      {
        key: 'construction',
        zh: { label: '施工验收', desc: '关键节点要确认，现场变更要留痕' },
        en: { label: 'Build & Handover', desc: 'Check milestones and keep evidence' },
        items: [
          { key: 'inspection-guide', zh: { label: '验收节点向导', href: '/tools/inspection-guide', desc: '水电、防水、泥工、木作、油漆、竣工' }, en: { label: 'Inspection Guide', href: '/en/tools', desc: 'Stage-based inspection checklist' } },
          { key: 'checkpoint-entry', zh: { label: '节点验收资料', href: '/resources#construction-checkpoints', desc: '把关键节点资料留档' }, en: { label: 'Checkpoint Entry', href: '/en/resources', desc: 'Electrical, waterproofing, masonry...' } },
          { key: 'evidence-list', zh: { label: '留痕清单', href: '/resources#yanshou-qingdan', desc: '该拍什么、该确认什么' }, en: { label: 'Evidence Checklist', href: '/en/resources', desc: 'What to record' } },
          { key: 'site-article', zh: { label: '施工阶段常见问题', href: '/blog/03-cong-gongdi-kan-shijie', desc: '从工地现场看责任和边界' }, en: { label: 'Site Issues', href: '/en/blog', desc: 'Responsibility and boundaries' } },
        ],
      },
      {
        key: 'living',
        zh: { label: '居住场景', desc: '先按家庭怎么住来判断' },
        en: { label: 'Real Living', desc: 'Do not design only for photos' },
        items: [
          { key: 'home-not-showroom', zh: { label: '家不是样板间', href: '/blog/02-jia-bu-shi-yangban-jian', desc: '先看家里到底怎么住' }, en: { label: 'Home Is Not A Showroom', href: '/en/articles/home-is-not-a-showroom', desc: 'Design for actual living' } },
          { key: 'living-check', zh: { label: '居住场景自查表', href: '/resources#shizhu-pai-zijian-biao', desc: '家庭成员、做饭、收纳、清洁' }, en: { label: 'Living Checklist', href: '/en/resources', desc: 'Family, cooking, storage' } },
          { key: 'living-service', zh: { label: '居住场景服务', href: '/services/renovation#shi-zhu-pai-zhuangxiu', desc: '南宁本地深度服务' }, en: { label: 'Real Living Service', href: '/en/services', desc: 'Deep service when fit' } },
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
        zh: { label: '判断工具', desc: '报价、预算和验收先缩小风险' },
        en: { label: 'Judgment Tools', desc: 'Narrow down quote, budget and handover risks' },
        items: [
          { key: 'quote-screening', zh: { label: '报价初筛工具', href: '/tools/quote-check', desc: '已上线：先做风险类型初筛' }, en: { label: 'Quote Screening', href: '/en/tools', desc: 'Live' } },
          { key: 'budget-structure', zh: { label: '预算分配工具', href: '/tools/budget-structure', desc: '已上线：先拆清钱该怎么分' }, en: { label: 'Budget Split', href: '/en/tools', desc: 'Live' } },
          { key: 'inspection-guide', zh: { label: '验收节点向导', href: '/tools/inspection-guide', desc: '已上线：按节点生成清单' }, en: { label: 'Inspection Guide', href: '/en/tools', desc: 'Live' } },
          { key: 'budget-risk', zh: { label: '超预算原因自测', href: '/tools/budget-risk', desc: '补充诊断' }, en: { label: 'Overrun Cause Quiz', href: '/en/tools', desc: 'Live' } },
          { key: 'content-brain', zh: { label: '内容诊断大脑', href: '/tools/content-brain', desc: '发布前检查选题、标题和转化路径' }, en: { label: 'Content Brain', href: '/en/tools', desc: 'Content diagnosis' } },
          { key: 'needs-map', zh: { label: '需求梳理问卷', href: '/resources#shizhu-pai-zijian-biao', desc: '清单模式' }, en: { label: 'Needs Map', href: '/en/resources', desc: 'Checklist' } },
        ],
      },
      {
        key: 'calculators',
        zh: { label: '计算工具', desc: '单位、瓷砖和乳胶漆先算一个范围' },
        en: { label: 'Calculators', desc: 'Estimate units, tiles and paint' },
        items: [
          { key: 'unit-converter', zh: { label: '单位换算工具', href: '/tools/unit-converter', desc: '㎡、米、延米、坪、单方' }, en: { label: 'Unit Converter', href: '/en/tools', desc: 'Area, length and unit price' } },
          { key: 'tile-calculator', zh: { label: '瓷砖计算器', href: '/tools/tile-calculator', desc: '估算片数、箱数和损耗' }, en: { label: 'Tile Calculator', href: '/en/tools', desc: 'Pieces, boxes and waste' } },
          { key: 'paint-calculator', zh: { label: '乳胶漆计算器', href: '/tools/paint-calculator', desc: '估算底漆、面漆升数和桶数' }, en: { label: 'Paint Calculator', href: '/en/tools', desc: 'Primer and topcoat estimate' } },
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
          { key: 'living-list', zh: { label: '居住场景自查表', href: '/resources#shizhu-pai-zijian-biao' }, en: { label: 'Real Living Checklist', href: '/en/resources' } },
        ],
      },
      {
        key: 'products',
        zh: { label: '低价数字产品', desc: '付费后进入订单与用户中心' },
        en: { label: 'Digital Products', desc: 'Paid guides and packs' },
        items: [
          { key: 'quote-guide', zh: { label: '报价避坑完整指南', href: '/pricing/baojia-guide', desc: '¥39' }, en: { label: 'Quote Guide', href: '/en/pricing/baojia-guide', desc: '¥39' } },
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
    key: 'services',
    zh: { label: '服务', href: '/services' },
    en: { label: 'Services', href: '/en/services' },
    groups: [
      {
        key: 'quote-service',
        zh: { label: '签约前判断', desc: '先分清是只看报价，还是一次看全' },
        en: { label: 'Sign-before Judgment', desc: 'Choose between quick review and full pre-sign package' },
        items: [
          { key: 'quote-fast', zh: { label: '报价风险快审', href: '/services/renovation#baojia-shenhe', desc: '¥699 / 份，只看报价重点风险' }, en: { label: 'Quote Quick Review', href: '/en/services', desc: 'Fast review of quote risks' } },
          { key: 'decision-pack', zh: { label: '签约前决策包', href: '/services/renovation#qianyue-qian-juece-bao', desc: '¥1499 / 次，报价预算合同一起看' }, en: { label: 'Pre-sign Decision Pack', href: '/en/services', desc: 'Review quote, budget and contract together' } },
          { key: 'quote-guide-entry', zh: { label: '先看 ¥39 指南', href: '/pricing/baojia-guide', desc: '先自己过一轮，再决定是否进入人工服务' }, en: { label: 'Start with the Guide', href: '/en/pricing/baojia-guide', desc: 'Self-check before human review' } },
          { key: 'quote-submit', zh: { label: '提交服务资料', href: '/services#service-form', desc: '带着报价和合同材料再来' }, en: { label: 'Submit Materials', href: '/en/services', desc: 'Bring your documents first' } },
        ],
      },
      {
        key: 'budget-service',
        zh: { label: '预算取舍诊断', desc: '适合预算有数但越算越乱的人' },
        en: { label: 'Budget Diagnosis', desc: 'For messy budget structure' },
        items: [
          { key: 'budget-fit', zh: { label: '适合谁', href: '/services/renovation#yusuan-zixun' }, en: { label: 'Who it fits', href: '/en/services' } },
          { key: 'budget-deliver', zh: { label: '交付内容', href: '/services/renovation#yusuan-zixun' }, en: { label: 'Deliverables', href: '/en/services' } },
          { key: 'budget-price', zh: { label: '价格与边界：¥399 / 次', href: '/services/renovation#yusuan-zixun' }, en: { label: 'Price & boundaries', href: '/en/services' } },
          { key: 'budget-submit', zh: { label: '立即提交资料', href: '/services#service-form' }, en: { label: 'Submit materials', href: '/en/services' } },
        ],
      },
      {
        key: 'living-service',
        zh: { label: '居住场景装修服务', desc: '适合南宁本地、重视长期使用的人' },
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
          { key: 'blog', zh: { label: '长期记录', href: '/blog', desc: '文章、工地观察与同行思考' }, en: { label: 'Writing', href: '/en/blog', desc: 'Articles and field notes' } },
          { key: 'contact', zh: { label: '联系方式', href: '/contact', desc: '微信、邮箱和服务咨询' }, en: { label: 'Contact', href: '/en/about', desc: 'Email and contact' } },
        ],
      },
      {
        key: 'ai-extension',
        zh: { label: 'AI 延伸', desc: '传统行业人怎么接 AI，仅为同行准备' },
        en: { label: 'AI Extension', desc: 'For peers in traditional industries' },
        items: [
          { key: 'ai-hub', zh: { label: 'AI 实践路线', href: '/ai', desc: '现场经验如何变成工具、内容和产品' }, en: { label: 'AI Practice Route', href: '/en', desc: 'How field work meets AI' } },
          { key: 'ai-article', zh: { label: '为什么我开始认真学 AI', href: '/blog/04-wei-shenme-wo-kaishi-renzheng-xue-ai', desc: '从现场经验进入 AI' }, en: { label: 'Why I Started Learning AI', href: '/en/articles/why-i-started-learning-ai' } },
          { key: 'ai-service', zh: { label: 'AI 工作流咨询', href: '/services/ai-workflow', desc: '适合传统行业人做系统化' }, en: { label: 'AI Workflow Consulting', href: '/en/services' } },
          { key: 'notes-ai', zh: { label: '思考札记', href: '/notes', desc: '日常观察与方法沉淀' }, en: { label: 'Notes', href: '/en/notes' } },
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
