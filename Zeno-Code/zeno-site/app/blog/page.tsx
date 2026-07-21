import { Suspense } from 'react'
import type { Metadata } from 'next'
import StructuredData from '@/components/ui/StructuredData'
import { articles } from '@/data/content/articles'
import BlogClient from './BlogClient'

export const metadata: Metadata = {
  title: '全部文章｜传统行业AI、装修实践与一人公司',
  description:
    '赞诺的公开文章库，记录传统行业AI实践、装修判断、一人公司与星火者共同体。内容来自真实经历、项目和持续迭代。',
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
          name: '赞诺的公开实践文章库',
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
