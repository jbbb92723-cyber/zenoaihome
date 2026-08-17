import type { Metadata } from 'next'
import ServicesBrandHub from '@/components/features/services/ServicesBrandHub'
import StructuredData from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: '项目合作｜把 AI 用进具体工作',
  description:
    '赞诺公开实践的项目合作入口：AI实战工作坊、流程自动化、企业知识库、AI智能体和网站内容系统。先明确问题、材料、交付物与验收边界，再决定是否合作。',
  alternates: {
    canonical: 'https://zenoaihome.com/services',
  },
}

const serviceNames = [
  'AI实战工作坊',
  '流程自动化',
  '企业AI知识库',
  'AI智能体',
  '网站与内容系统',
]

export default function ServicesPage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: '赞诺 AI 落地项目合作',
          description: metadata.description,
          itemListElement: serviceNames.map((name, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Service',
              name,
              provider: {
                '@type': 'Person',
                name: '赞诺',
                url: 'https://zenoaihome.com/about',
              },
              areaServed: '中国',
            },
          })),
        }}
      />
      <ServicesBrandHub />
    </>
  )
}
