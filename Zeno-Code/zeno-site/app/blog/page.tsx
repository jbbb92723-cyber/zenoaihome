import { Suspense } from 'react'
import type { Metadata } from 'next'
import StructuredData from '@/components/ui/StructuredData'
import { articles } from '@/data/content/articles'
import BlogClient from './BlogClient'

export const metadata: Metadata = {
  title: '全部文章｜AI 落地判断、装修全案判断、OPC·同行有你',
  description:
    '赞诺的文章库。按 AI 落地判断、装修全案判断、OPC·同行有你三个判断方向组织——17 年一线经验里长出来的真实内容。',
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
          name: '居住判断文章库',
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
