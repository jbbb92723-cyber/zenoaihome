import type { Metadata } from 'next'
import ServicesBrandHub from '@/components/features/services/ServicesBrandHub'
import StructuredData from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: '服务合作｜AI培训、知识库、智能体与网站开发',
  description:
    '赞诺当前可承接的AI实战服务：企业培训、AI工具与工作流、企业知识库、AI智能体和网站开发。先明确问题、材料、交付物与验收边界，再启动合作。',
  alternates: {
    canonical: 'https://zenoaihome.com/services',
  },
}

const serviceNames = [
  'AI培训与企业内训',
  'AI工具与工作流',
  '企业AI知识库',
  'AI智能体',
  '网站开发',
]

export default function ServicesPage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: '赞诺 AI 实战服务',
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
