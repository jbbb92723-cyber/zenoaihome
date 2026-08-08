import type { Metadata } from 'next'
import HomePageBrandHub from '@/components/features/home/HomePageBrandHub'
import StructuredData from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: 'Zeno 赞诺｜传统行业、AI 实践与一人公司',
  description:
    '赞诺的个人博客与公开实践。记录17年传统行业经验如何进入AI知识库、工作流、智能体、内容系统与一人公司。',
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
              '拥有17年传统行业经营与项目经验的AI落地实践者，持续公开企业知识库、流程自动化、智能体、内容系统和一人公司的真实实践。',
            jobTitle: '传统行业AI落地实践者 · OPC圈南宁城市主理人',
            knowsAbout: [
              '传统行业AI落地',
              '企业AI知识库',
              '流程自动化',
              'AI智能体',
              '内容获客',
              'Vibe Coding',
              '一人公司经营',
              '装修行业实践',
            ],
            hasCredential: [
              {
                '@type': 'EducationalOccupationalCredential',
                credentialCategory: '智联企服认证AI落地专家',
              },
              {
                '@type': 'EducationalOccupationalCredential',
                credentialCategory: '注册建造师',
              },
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
              '赞诺的个人博客，记录传统行业、AI实践、一人公司、装修垂直经验和星火者共同体。',
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
                  text: '这是赞诺的个人博客与公开实践站，主要记录传统行业如何使用AI、一人公司实践、装修垂直经验和星火者共同体。',
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
                  text: '主要包括企业知识库、流程自动化、内容获客、AI智能体、Vibe Coding、一人公司和装修行业AI实践。',
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
