import type { Metadata } from 'next'
import HomePageBrandHub from '@/components/features/home/HomePageBrandHub'

export const metadata: Metadata = {
  title: { absolute: '赞诺｜一个传统行业人的 AI 转型记录' },
  description:
    '赞诺的个人博客与公开实践。记录一个传统行业从业者怎样把 AI 用进装修、一人公司和真实协作，并公开判断、方法、结果与修订。',
  alternates: {
    canonical: 'https://zenoaihome.com/',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://zenoaihome.com/',
    siteName: 'Zeno 赞诺',
    title: '赞诺｜一个传统行业人的 AI 转型记录',
    description:
      '赞诺的个人博客与公开实践。记录一个传统行业从业者怎样把 AI 用进装修、一人公司和真实协作，并公开判断、方法、结果与修订。',
    images: [{ url: 'https://zenoaihome.com/images/brand/zeno-portrait.jpg', width: 940, height: 940, alt: '赞诺 Zeno' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '赞诺｜一个传统行业人的 AI 转型记录',
    description: '赞诺的个人博客与公开实践。记录传统行业 AI 转型和真实协作。',
    images: ['https://zenoaihome.com/images/brand/zeno-portrait.jpg'],
  },
}

export default function HomePage() {
  return <HomePageBrandHub />
}
