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
  title: '先别急着装修，先建立判断力 | ZenoAIHome',
  description:
    'ZenoAIHome 是从 16 年装修现场经验长出来的装修判断力系统，帮普通业主在看报价、做预算、签合同、盯施工和验收前，先把该问清的问题问清楚。',
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
            '先别急着装修，先建立判断力。从报价、预算、合同、施工、验收和居住场景出发，帮普通业主在做决定前更清醒。',
          inLanguage: 'zh-CN',
        }}
      />
      <HomePageGptSkill fontClassName={outfit.className} />
    </>
  )
}
