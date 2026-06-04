import type { Metadata } from 'next'
import LivingDiagnosisClient from '@/components/living-diagnosis/LivingDiagnosisClient'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'AI 居住诊断｜装修前先看清你真正想怎样生活',
  description:
    'ZenoAIHome 的 AI 居住诊断帮助自我成长型家庭在装修前梳理生活方式、空间秩序、审美偏好、预算取舍和签约风险。',
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
          name: 'AI 居住诊断',
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
