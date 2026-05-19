/**
 * lib/i18n/dictionaries/en.ts
 *
 * English UI dictionary
 */

const en = {
  // ── Global ────────────────────────────────
  siteName: 'Zeno',
  siteDescription: 'Pre-signing renovation quote risk checks for homeowners who need clear scope before signing.',
  locale: 'en',

  // ── Navigation ────────────────────────────
  nav: {
    home: 'Home',
    about: 'About',
    blog: 'Blog',
    topics: 'Topics',
    resources: 'Risk Tools',
    services: 'Services',
    tools: 'Tools',
    contact: 'Contact',
    login: 'Log in',
    switchLang: '中文',
  },

  // ── Home ──────────────────────────────────
  home: {
    heroLabel: 'Zeno',
    heroTitle: 'Before signing,\nclarify the quote.',
    heroDesc: "I'm Zeno — 16 years in home renovation, now helping homeowners see what their renovation quotes leave unclear before they sign.",
    ctaBlog: 'Read the blog',
    ctaAbout: 'About me',
    ctaResources: 'Risk tools',
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
    pageSubtitle: 'Selected English writing from ZenoAIHome. The full quote-risk system is maintained in Chinese.',
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
    { title: 'Quote Risk', desc: 'Missing scope, unclear materials, add-on costs, and payment milestones before signing.' },
    { title: 'Risk Language', desc: 'Plain-English explanations of terms that often create later disputes.' },
    { title: 'Checklists', desc: 'Practical questions homeowners can ask before signing a renovation contract.' },
    { title: 'Project Risks', desc: 'What common renovation items should clarify inside a quote.' },
    { title: 'Judgment', desc: 'Field-tested thinking from renovation sites and real homeowner decisions.' },
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
