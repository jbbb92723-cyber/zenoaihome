/**
 * lib/i18n/dictionaries/zh.ts
 *
 * 中文 UI 字典
 */

const zh = {
  // ── 全局 ──────────────────────────────────
  siteName: 'Zeno 赞诺',
  siteDescription: '从装修出发，聊居住、美学、人性、成长与 AI 时代的长期主义。',
  locale: 'zh-CN',

  // ── 导航 ──────────────────────────────────
  nav: {
    home: '首页',
    about: '关于我',
    blog: '文章',
    topics: '专题',
    resources: '资料库',
    services: '服务',
    tools: '排版工具',
    contact: '联系',
    login: '登录',
    switchLang: 'EN',
  },

  // ── 首页 ──────────────────────────────────
  home: {
    heroLabel: 'Zeno',
    heroTitle: '从装修出发，\n聊居住、美学、人性、成长与 AI 时代的长期主义。',
    heroDesc: '我是 Zeno。做装修，盯过工地，也在持续学习 AI 和技术。这里不只谈房子怎么装，也谈人怎么判断、怎么成长、怎么在变化越来越快的时代里活得更清醒。',
    ctaBlog: '看最新文章',
    ctaAbout: '了解我是谁',
    ctaResources: '领取资料',
    ctaServices: '查看服务',
    sectionDirections: '内容方向',
    sectionDirectionsHeading: '我主要写什么',
    sectionDirectionsNote: '五个方向，都从真实经历出发。',
    sectionRecent: '最近写的',
    sectionRecentHeading: '优先放能代表判断力的文章',
    sectionRecentNote: '不按流量排序。',
    viewAll: '全部 →',
    viewAllArticles: '查看所有文章 →',
    sectionTopics: '专题',
    sectionTopicsHeading: '连续问题的连续回答',
    readMore: '阅读全文',
  },

  // ── 博客 ──────────────────────────────────
  blog: {
    pageLabel: '文章',
    pageTitle: '我写的东西',
    pageSubtitle: '从装修出发，写居住、美学、人性、成长与 AI。优先放能代表判断力的文章，不按流量排序。',
    allCategories: '全部',
    noArticles: '该分类暂无文章。',
    readMore: '阅读全文',
  },

  // ── 文章详情 ──────────────────────────────
  article: {
    breadcrumbHome: '首页',
    breadcrumbBlog: '文章',
    authorName: 'Zeno',
    authorDesc: '从居住场景出发，记录 AI 实践、工具产品、一人公司和判断系统。',
    relatedArticles: '你可能还想看',
  },

  // ── 写作方向 ──────────────────────────────
  writingAreas: [
    { title: '居住场景', desc: '从预算、报价、材料、施工和居住场景出发，拆清楚传统行业的真实问题。' },
    { title: 'AI 实践', desc: '用 AI 辅助内容生产、资料整理、工具开发和个人系统搭建。' },
    { title: '工具与产品', desc: '把经验做成可复用、可交易的内容资产和数字产品。' },
    { title: '一人公司', desc: '用 AI、开发、内容和自动化，逐步摆脱重交付。' },
    { title: '判断与生活', desc: '在压力和噪音中保持清醒的判断，做更耐久的选择。' },
  ],

  // ── 分类 ──────────────────────────────────
  categories: {
    '真实居住': '居住场景',
    'AI 实践': 'AI 实践',
    '工具与产品': '工具与产品',
    '一人公司': '一人公司',
    '判断与生活': '判断与生活',
  } as Record<string, string>,

  // ── Footer ────────────────────────────────
  footer: {
    navigate: '导航',
    contact: '联系方式',
    rights: '© {year} Zeno 赞诺 版权所有',
  },
} as const

export default zh
