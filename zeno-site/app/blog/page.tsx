import type { Metadata } from 'next'
import StructuredData from '@/components/StructuredData'
import { articles } from '@/data/articles'
import BlogClient from './BlogClient'

export const metadata: Metadata = {
  title: '装修报价风险文章｜签约前看懂合同、增项和付款节点',
  description:
    'ZenoAIHome 文章库优先整理装修报价风险、合同边界、增项风险、付款节点和签约前追问方法，帮助业主在签字前看懂具体风险。',
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
          name: '装修报价风险文章',
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
      <BlogClient />
    </>
  )
}
