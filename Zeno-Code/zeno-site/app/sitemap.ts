import { type MetadataRoute } from 'next'
import { articles } from '@/data/content/articles'
import { checklistTemplates } from '@/data/risk-control/checklist-templates'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://zenoaihome.com'

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/ai-tools`, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/services`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/training`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/opc-knowledge`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/community`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/tools`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/renovation`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/resources`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/topics`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/privacy`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/cases`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/practice`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/living-diagnosis`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/risk-dictionary`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/project-risks`, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/checklists`, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/zeno-os`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services/quote-review`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services/node-advisor`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services/diagnosis`, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/services/renovation-advisor`, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/notes`, changeFrequency: 'weekly', priority: 0.6 },
  ]

  const aiToolPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/ai-tools/opc-diagnosis`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/ai-tools/content-strategy`, changeFrequency: 'monthly', priority: 0.9 },
  ]

  const toolPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/tools/quote-check`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/tools/budget-structure`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tools/budget-risk`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tools/unit-converter`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/tools/tile-calculator`, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/tools/paint-calculator`, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/tools/inspection-guide`, changeFrequency: 'monthly', priority: 0.8 },
  ]

  const checklistPages: MetadataRoute.Sitemap = checklistTemplates.map((template) => ({
    url: `${baseUrl}/checklists/${template.slug}`,
    changeFrequency: 'monthly',
    priority: 0.75,
  }))

  const blogPages: MetadataRoute.Sitemap = articles
    .filter((article) => article.parentCategory !== 'mattress')
    .map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: article.date ? new Date(article.date) : undefined,
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    }))

  return [...staticPages, ...aiToolPages, ...toolPages, ...checklistPages, ...blogPages]
}
