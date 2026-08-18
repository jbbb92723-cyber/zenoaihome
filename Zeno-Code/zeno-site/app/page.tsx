import type { Metadata } from 'next'
import HomePageBrandHub from '@/components/features/home/HomePageBrandHub'

export const metadata: Metadata = {
  title: { absolute: '赞诺｜一个传统行业人的 AI 转型记录' },
  description:
    '赞诺的个人博客与公开实践。记录一个传统行业从业者怎样把 AI 用进装修、一人公司和真实协作，并公开判断、方法、结果与修订。',
  alternates: {
    canonical: 'https://zenoaihome.com/',
  },
}

export default function HomePage() {
  return <HomePageBrandHub />
}
