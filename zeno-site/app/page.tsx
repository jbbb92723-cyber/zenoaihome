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
  title: '装修现场长出来的 AI 判断力系统 | ZenoAIHome',
  description:
    'ZenoAIHome 用 16 年装修现场经验做样板，把真实经验拆成判断 SOP，再用 AI 放大成工具、内容、产品和一人公司实践。',
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
            '装修是现场，AI 是方法，一人公司是结果。ZenoAIHome 把真实行业经验拆成判断 SOP，再做成工具、内容和产品。',
          inLanguage: 'zh-CN',
        }}
      />
      <HomePageGptSkill fontClassName={outfit.className} />
    </>
  )
}
