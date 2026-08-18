import type { Metadata } from 'next'
import { getDictionary, getLocalizedArticleSummaries } from '@/lib/i18n'
import EnBlogClient from './EnBlogClient'

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'Selected English writing from ZenoAIHome on residential judgment, AI in real work, one-person companies, and long-term thinking.',
  alternates: {
    canonical: 'https://zenoaihome.com/en/blog',
  },
}

export default function EnBlogPage() {
  const t = getDictionary('en')
  const articles = getLocalizedArticleSummaries('en').filter((article) => article.category !== 'Mattress')
  const categories = Array.from(new Set(articles.map((article) => article.category)))

  return <EnBlogClient articles={articles} categories={categories} copy={t.blog} />
}
