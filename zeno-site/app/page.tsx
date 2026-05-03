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
  title: '从真实问题出发，建立判断力 | ZenoAIHome',
  description:
    'ZenoAIHome 从装修现场经验出发，帮普通业主看懂预算、报价、合同和验收问题；也记录一个传统行业人，如何借助 AI 把一线经验整理成内容、工具、课程和服务。',
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
            '从真实问题出发，建立判断力。面向装修业主，也面向想把经验接进 AI 的传统行业人。',
          inLanguage: 'zh-CN',
        }}
      />
      <HomePageGptSkill fontClassName={outfit.className} />
    </>
  )
}
