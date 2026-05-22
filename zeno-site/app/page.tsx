import type { Metadata } from 'next'
import HomePageGptSkill from '@/components/home/HomePageGptSkill'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: '签约前装修报价风险判断 | ZenoAIHome',
  description:
    'ZenoAIHome 帮业主在签约前看懂装修报价、合同和增项风险。先做免费报价风险初筛，再决定是否需要 ¥99 初查、¥299 快审或 ¥699 深度判断。',
  alternates: {
    canonical: 'https://zenoaihome.com/',
  },
}

export default function HomePage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'ZenoAIHome',
          url: 'https://zenoaihome.com/',
          description:
            'ZenoAIHome 聚焦装修签约前判断，帮助业主看懂报价风险、合同边界、增项入口和关键追问。',
          inLanguage: 'zh-CN',
        }}
      />
      <HomePageGptSkill fontClassName="" />
    </>
  )
}
