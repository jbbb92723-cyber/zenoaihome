/**
 * lib/i18n/dictionaries/en.ts
 *
 * English UI dictionary
 */

const en = {
  // ── Global ────────────────────────────────
  siteName: 'Zeno',
  siteDescription: 'From renovation sites to real living — on design, human nature, growth, and long-term thinking in the age of AI.',
  locale: 'en',

  // ── Navigation ────────────────────────────
  nav: {
    home: 'Home',
    about: 'About',
    blog: 'Blog',
    topics: 'Topics',
    resources: 'Resources',
    services: 'Services',
    tools: 'Tools',
    contact: 'Contact',
    login: 'Log in',
    switchLang: '中文',
  },

  // ── Home ──────────────────────────────────
  home: {
    heroLabel: 'Zeno',
    heroTitle: 'From renovation sites\nto real-world clarity.',
    heroDesc: "I'm Zeno — 16 years in home renovation, now writing about livable design, human judgment, and building a thoughtful life in the age of AI. Not just how to renovate, but how to think clearly when the stakes are real.",
    ctaBlog: 'Read the blog',
    ctaAbout: 'About me',
    ctaResources: 'Free resources',
    ctaServices: 'Work with me',
    sectionDirections: 'What I write about',
    sectionDirectionsHeading: 'Five threads, all grounded in real experience',
    sectionDirectionsNote: '',
    sectionRecent: 'Recent writing',
    sectionRecentHeading: 'Selected for substance, not traffic',
    sectionRecentNote: '',
    viewAll: 'View all →',
    viewAllArticles: 'View all articles →',
    sectionTopics: 'Deep dives',
    sectionTopicsHeading: 'Ongoing questions, honest answers',
    readMore: 'Read more',
  },

  // ── Blog ──────────────────────────────────
  blog: {
    pageLabel: 'Blog',
    pageTitle: 'Writing',
    pageSubtitle: 'From renovation to real living — on design, human nature, growth, and AI. Prioritized for substance over clicks.',
    allCategories: 'All',
    noArticles: 'No articles in this category yet.',
    readMore: 'Read more',
  },

  // ── Article detail ────────────────────────
  article: {
    breadcrumbHome: 'Home',
    breadcrumbBlog: 'Blog',
    authorName: 'Zeno',
    authorDesc: 'From renovation sites to real living — on design, human nature, growth, and long-term thinking.',
    relatedArticles: 'You might also like',
  },

  // ── Writing areas ─────────────────────────
  writingAreas: [
    { title: 'Real Living', desc: 'Budgets, materials, contractors, and the judgment calls that actually matter when you live in the result.' },
    { title: 'AI in Practice', desc: 'How traditional industry professionals build content systems, tools, and digital leverage with AI.' },
    { title: 'Tools & Products', desc: 'Turning experience into reusable, tradeable assets — content systems, templates, and digital products.' },
    { title: 'One-Person Company', desc: 'Building a lighter, freer business with AI, development, content, and automation.' },
    { title: 'Judgment & Life', desc: 'Staying clear-headed under pressure — on job sites, in business, and in daily decisions.' },
  ],

  // ── Categories ────────────────────────────
  categories: {
    '真实居住': 'Real Living',
    'AI 实践': 'AI in Practice',
    '工具与产品': 'Tools & Products',
    '一人公司': 'One-Person Company',
    '判断与生活': 'Judgment & Life',
  } as Record<string, string>,

  // ── Footer ────────────────────────────────
  footer: {
    navigate: 'Navigate',
    contact: 'Contact',
    rights: '© {year} Zeno. All rights reserved.',
  },
} as const

export default en
