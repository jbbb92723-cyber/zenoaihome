import { type MetadataRoute } from 'next'
import { articles } from '@/data/content/articles'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://zenoaihome.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/services`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tools`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/resources`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/topics`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/cases`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/living-diagnosis`, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${baseUrl}/risk-dictionary`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/project-risks`, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/checklists`, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/zeno-os`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/quote-review`, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${baseUrl}/services/node-advisor`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/mattress`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/consulting`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/notes`, changeFrequency: 'weekly', priority: 0.6 },
  ]

  // Tool pages
  const toolPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/tools/quote-check`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/tools/budget-structure`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/tools/budget-risk`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/tools/unit-converter`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tools/tile-calculator`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/tools/paint-calculator`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/tools/inspection-guide`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/tools/publish`, changeFrequency: 'monthly', priority: 0.5 },
  ]

  // All blog articles
  const blogPages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: article.date ? new Date(article.date) : undefined,
    changeFrequency: 'yearly' as const,
    priority: 0.8,
  }))

  // English pages
  const enPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/en`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/en/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/en/services`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/en/tools`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/en/blog`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/en/articles`, changeFrequency: 'monthly', priority: 0.7 },
  ]

  // English static articles
  const enArticleSlugs = [
    'home-is-not-a-showroom',
    'long-term-thinking-is-not-patience',
    'seeing-the-world-from-a-job-site',
    'why-i-dont-just-teach-renovation',
    'why-i-started-learning-ai',
  ]
  const enArticlePages: MetadataRoute.Sitemap = enArticleSlugs.map((slug) => ({
    url: `${baseUrl}/en/articles/${slug}`,
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...toolPages, ...blogPages, ...enPages, ...enArticlePages]
}
