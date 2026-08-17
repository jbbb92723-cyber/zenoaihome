import type { Metadata } from 'next'
import LivingDiagnosisClient from '@/components/features/living-diagnosis/LivingDiagnosisClient'
import StructuredData from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: '装修前需求自检｜先想清楚你要的生活空间',
  description:
    '通过预设问题和规则，梳理生活方式、空间秩序、审美偏好、预算取舍和签约风险，形成下一步核对清单。',
  alternates: {
    canonical: 'https://zenoaihome.com/living-diagnosis',
  },
}

export default function LivingDiagnosisPage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: '居住需求自检',
          url: 'https://zenoaihome.com/living-diagnosis',
          description: '装修前先看清真实生活方式、空间秩序、预算取舍和签约风险。',
          inLanguage: 'zh-CN',
          isPartOf: {
            '@type': 'WebSite',
            name: 'ZenoAIHome',
            url: 'https://zenoaihome.com',
          },
        }}
      />
      <LivingDiagnosisClient />
    </>
  )
}
