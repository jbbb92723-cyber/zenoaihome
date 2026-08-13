import type { Metadata } from 'next'
import HomePageBrandHub from '@/components/features/home/HomePageBrandHub'
import StructuredData from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: 'Zeno 赞诺｜把传统行业经验变成可复用的职业资产',
  description:
    '赞诺的个人品牌母站与公开实践档案。记录一个从装修现场走出来的 OPC 实践者，如何用 AI 把传统行业经验变成判断、内容、工具和服务。',
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
            name: '陈国赞',
            alternateName: ['Zeno', '赞诺', '赞诺 Zeno'],
            url: 'https://zenoaihome.com',
            description:
              '拥有17年传统行业经营与项目经验的 OPC 实践者，正在公开验证如何用 AI 把真实经验变成可复用的判断、内容、工具和服务。',
            jobTitle: '传统行业经验资产化实践者',
            knowsAbout: [
              '传统行业经验资产化',
              '装修判断',
              '一人公司经营',
              '企业AI知识库',
              '流程自动化',
              'AI智能体',
              '内容资产',
              'Vibe Coding',
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
              '赞诺的个人博客与公开实践档案，记录传统行业经验资产化、OPC一人公司、装修判断和星火者共同体。',
            inLanguage: 'zh-CN',
            author: {
              '@type': 'Person',
              name: '陈国赞',
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
                  text: '这是赞诺的个人品牌母站与公开实践档案，展示他如何把传统行业经验整理成判断、内容、工具和服务。装修是最深的垂直验证场。',
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
                  text: '主要包括传统行业经验资产化、OPC一人公司、装修判断，以及知识库、工作流、智能体和网站如何进入真实工作。',
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
