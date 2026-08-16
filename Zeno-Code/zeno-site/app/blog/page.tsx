import { Suspense } from 'react'
import type { Metadata } from 'next'
import StructuredData from '@/components/ui/StructuredData'
import { articles } from '@/data/content/articles'
import BlogClient from './BlogClient'

export const metadata: Metadata = {
  title: '公开实践｜实验、文章与方法样本',
  description:
    '赞诺的公开实践档案：正在进行的实验、可复盘文章和方法样本。聚焦传统行业 × AI、经验资产化、一人公司与装修判断，并明确当前证据边界。',
  alternates: {
    canonical: 'https://zenoaihome.com/blog',
  },
}

export default function BlogPage() {
  const priorityArticles = articles.slice(0, 12)

  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: '赞诺的公开实践档案',
          url: 'https://zenoaihome.com/blog',
          description: metadata.description,
          inLanguage: 'zh-CN',
          hasPart: priorityArticles.map((article) => ({
            '@type': 'Article',
            headline: article.title,
            description: article.excerpt,
            url: `https://zenoaihome.com/blog/${article.slug}`,
            datePublished: article.date,
          })),
        }}
      />
      <Suspense fallback={<div className="py-20 text-center text-ink-muted">加载中…</div>}>
        <BlogClient />
      </Suspense>
    </>
  )
}
