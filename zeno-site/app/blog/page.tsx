import type { Metadata } from 'next'
import StructuredData from '@/components/ui/StructuredData'
import { articles } from '@/data/content/articles'
import BlogClient from './BlogClient'

export const metadata: Metadata = {
  title: '判断文章库｜生活判断、方案判断、报价交付判断、AI与个体判断',
  description:
    'ZenoAIHome 文章库按四类判断域组织：生活判断、方案与空间判断、报价与交付判断、AI与个体判断。帮助业主建立装修判断力，也帮助个体在 AI 时代建立判断力。',
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
