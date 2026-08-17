import type { Metadata } from 'next'
import HomePageBrandHub from '@/components/features/home/HomePageBrandHub'
import StructuredData from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: '赞诺｜一个传统行业人的 AI 转型记录',
  description:
    '赞诺的个人博客与公开判断实践系统。记录 17 年传统行业经营与项目经验如何进入 AI、知识库、工作流、智能体、内容系统和星火者共同实践，并公开依据、结果与方法修订。',
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
              '拥有 17 年传统行业经营与项目经验的 OPC 实践者，正在公开记录人与 AI 如何把真实经验变成可检查、可使用、可修订的判断、内容、工具、服务和共同实践。',
            jobTitle: '传统行业经验资产化实践者',
            knowsAbout: [
              '传统行业经验资产化',
              '装修判断',
              '一人公司经营',
              '企业AI知识库',
              '流程自动化',
              'AI智能体',
              '内容资产',
              '公开判断与证据实践',
              '星火者共同体',
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
              '赞诺的个人博客与公开判断实践档案，记录传统行业经验资产化、人与 AI 协作、OPC 一人公司、装修判断和星火者共同体。',
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
                  text: '主要包括传统行业经验资产化、OPC一人公司、装修判断，以及知识库、工作流、智能体和星火者共同实践如何进入真实工作。',
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
