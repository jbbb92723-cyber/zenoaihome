import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import HomePageGptSkill from '@/components/home/HomePageGptSkill'
import StructuredData from '@/components/StructuredData'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: '装修签约前报价风险初筛 | ZenoAIHome',
  description:
    'ZenoAIHome 帮助业主在装修前看懂报价风险，建立判断力，少花冤枉钱。先做签约前报价风险初筛，再决定是否需要人工快审。',
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
            'ZenoAIHome 聚焦装修签约前判断，帮助业主看懂报价风险、关键追问和预算取舍。',
          inLanguage: 'zh-CN',
        }}
      />
      <HomePageGptSkill fontClassName={outfit.className} />
    </>
  )
}
