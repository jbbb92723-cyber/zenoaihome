import type { Metadata } from 'next'
import HomePageBrandHub from '@/components/features/home/HomePageBrandHub'
import StructuredData from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: { absolute: '赞诺｜一个传统行业人的 AI 转型记录' },
  description:
    '赞诺的个人博客与公开实践。记录一个传统行业从业者怎样把 AI 用进装修、一人公司和真实协作，并公开判断、方法、结果与修订。',
  alternates: {
    canonical: 'https://zenoaihome.com/',
  },
}

export default function HomePage() {
  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: '赞诺',
            alternateName: ['Zeno', '赞诺'],
            url: 'https://zenoaihome.com',
            description:
              '拥有 17 年传统行业经营与项目经验的 OPC 一人公司实践者，正在公开记录 AI 怎样进入装修、内容、工具、服务和真实协作。',
            jobTitle: '传统行业 AI 转型实践者',
            knowsAbout: [
              '传统行业 AI 转型',
              '装修判断',
              'OPC 一人公司',
              '人机协作',
              '企业 AI 知识库',
              'AI 工作流',
              '任务型智能体',
              '网站与内容系统',
              '实践与证据',
              '星火者共同体',
            ],
            sameAs: [
              'https://zenoaihome.com',
              'https://zenoaihome.com/about',
            ],
            knowsLanguage: ['zh-CN', 'en'],
            nationality: {
              '@type': 'Country',
              name: '中国',
            },
            homeLocation: {
              '@type': 'Place',
              name: '广西南宁',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Zeno 赞诺',
            url: 'https://zenoaihome.com',
            description:
              '赞诺的个人博客与公开实践，记录传统行业 AI 转型、OPC 一人公司、装修判断和星火者共同体。',
            inLanguage: 'zh-CN',
            author: {
              '@type': 'Person',
              name: '赞诺',
              alternateName: 'Zeno 赞诺',
              url: 'https://zenoaihome.com/about',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Zeno 赞诺',
            url: 'https://zenoaihome.com',
            description: metadata.description,
            inLanguage: 'zh-CN',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: '这个网站主要是什么？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '这是赞诺的个人博客与公开实践档案，记录他如何让人先判断、让 AI 参与质疑，再用真实交付和反馈修订方法。装修是其中最完整的垂直实践样本之一。',
                },
              },
              {
                '@type': 'Question',
                name: '网站上的工具需要付费或注册吗？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '公开工具可以先直接使用。部分工具会在用户主动继续时提供保存或联系入口，但不会要求先购买服务。',
                },
              },
              {
                '@type': 'Question',
                name: '赞诺目前研究和实践哪些方向？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '主要包括传统行业 AI 转型、OPC 一人公司、装修判断，以及知识库、工作流、任务型智能体和星火者怎样进入真实工作。',
                },
              },
            ],
          },
        ]}
      />
      <HomePageBrandHub />
    </>
  )
}
