import type { Metadata } from 'next'
import StructuredData from '@/components/StructuredData'
import { articles } from '@/data/articles'
import BlogClient from './BlogClient'

export const metadata: Metadata = {
  title: '居住判断文章｜美学、生活、装修决策与报价合同风险',
  description:
    'ZenoAIHome 文章库按四类问题组织：美学与生活、空间与家庭场景、装修决策、报价合同风险。帮助业主把理想生活落到方案、预算、签约和交付判断。',
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
      <BlogClient />
    </>
  )
}
