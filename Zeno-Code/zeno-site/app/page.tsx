import type { Metadata } from 'next'
import HomePageBrandHub from '@/components/features/home/HomePageBrandHub'
import StructuredData from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: 'Zeno 赞诺｜传统行业 × AI 实战',
  description:
    '赞诺的个人品牌与商业入口。17年传统行业经营与项目经验，提供AI培训、AI工具与工作流、企业知识库、智能体和网站开发。',
  alternates: {
    canonical: 'https://zenoaihome.com/',
  },
}

export default function HomePage() {
  return (
    <>
      <StructuredData
        data={[
          // 0. Person — GEO 最核心信号：让 AI 知道 Zeno 是谁
          {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: '赞诺',
            alternateName: ['Zeno', '赞诺 Zeno'],
            url: 'https://zenoaihome.com',
            description:
              '17年传统行业经营与项目经验，从家居和装修行业转向AI实践，正在提供AI培训、工作流、企业知识库、智能体和网站开发服务，并发起赞诺·星火者共同体。',
            jobTitle: '传统行业AI实践者 · 星火者共同体发起人',
            knowsAbout: [
              'AI培训',
              'AI工具与工作流',
              '企业AI知识库',
              'AI智能体',
              '网站开发',
              '传统行业AI实践',
              '一人公司经营',
              '装修判断',
            ],
            hasCredential: {
              '@type': 'EducationalOccupationalCredential',
              credentialCategory: '17年传统行业经营、销售与项目管理经验',
            },
            sameAs: [
              'https://zenoaihome.com',
              'https://zenoaihome.com/about',
            ],
            affiliation: {
              '@type': 'Organization',
              name: 'Zeno 赞诺',
              url: 'https://zenoaihome.com',
            },
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
            '@type': 'WebSite',
            name: 'Zeno 赞诺',
            url: 'https://zenoaihome.com',
            description:
              '赞诺的个人品牌与商业入口，记录传统行业转向AI的实践，并提供培训、知识库、智能体和网站项目合作。',
            inLanguage: 'zh-CN',
          },
          // 2. Organization — 关联 Person 为 founder，增加 sameAs 和 knowsAbout
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Zeno 赞诺',
            url: 'https://zenoaihome.com',
            description:
              '赞诺的个人实践与商业入口，围绕传统行业AI应用、项目交付、公开内容和星火者共同体展开。',
            founder: {
              '@type': 'Person',
              name: '赞诺',
              sameAs: 'https://zenoaihome.com',
            },
            sameAs: [
              'https://zenoaihome.com',
            ],
            knowsAbout: [
              'AI培训',
              '企业AI知识库',
              'AI智能体',
              '网站开发',
              '装修判断',
              '一人公司实践',
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Zeno 赞诺｜传统行业 × AI 实战',
            url: 'https://zenoaihome.com/',
            description:
              '17年传统行业经营与项目经验，提供AI培训、AI工具与工作流、企业知识库、智能体和网站开发。',
            inLanguage: 'zh-CN',
            isPartOf: {
              '@type': 'WebSite',
              name: 'Zeno 赞诺',
              url: 'https://zenoaihome.com',
            },
            about: {
              '@type': 'Person',
              name: '赞诺',
              sameAs: 'https://zenoaihome.com',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: '传统行业 AI 实战服务',
            provider: {
              '@type': 'Organization',
              name: 'Zeno 赞诺',
              url: 'https://zenoaihome.com/',
            },
            areaServed: '中国',
            serviceType: 'AI培训、AI工具与工作流、企业知识库、AI智能体和网站开发',
            audience: {
              '@type': 'Audience',
              audienceType: '传统行业企业、创业团队与一人公司',
            },
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'AI 实战服务与项目合作',
              itemListElement: [
                { '@type': 'Offer', name: 'AI培训与企业内训', url: 'https://zenoaihome.com/training' },
                { '@type': 'Offer', name: 'AI工具与工作流', url: 'https://zenoaihome.com/services#ai-workflow' },
                { '@type': 'Offer', name: '企业AI知识库', url: 'https://zenoaihome.com/services#knowledge-base' },
                { '@type': 'Offer', name: 'AI智能体', url: 'https://zenoaihome.com/services#ai-agent' },
                { '@type': 'Offer', name: '网站开发', url: 'https://zenoaihome.com/services#website' },
              ],
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: '赞诺目前提供哪些服务？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '目前可合作方向包括AI培训与企业内训、AI工具与工作流、企业AI知识库、AI智能体和网站开发。',
                },
              },
              {
                '@type': 'Question',
                name: 'AI项目有统一价格吗？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '目前采用项目制合作。先确认真实问题、现有材料、交付物和验收边界，再根据范围给出报价。',
                },
              },
              {
                '@type': 'Question',
                name: '原来的装修内容还保留吗？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '保留。装修判断、报价初筛、风险词典和案例样张是赞诺最完整的垂直实践，会继续更新，但不再代表整个网站。',
                },
              },
              {
                '@type': 'Question',
                name: '星火者共同体是什么？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '赞诺发起、但希望能够独立运转的成员共同体，面向AI时代的一人公司、转型创业者和独立实践者。',
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
