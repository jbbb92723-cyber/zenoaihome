import type { Metadata } from 'next'
import HomePageGptSkill from '@/components/home/HomePageGptSkill'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'AI 居住判断系统｜装修前看清生活方式、预算和签约风险｜ZenoAIHome',
  description:
    'ZenoAIHome 面向自我成长型家庭，用 AI 辅助分析和 16 年装修现场经验，帮助你在装修前看清真实生活方式、空间秩序、预算取舍、报价合同和签约风险。',
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
            '@type': 'WebSite',
            name: 'ZenoAIHome',
            url: 'https://zenoaihome.com',
            description:
              'ZenoAIHome 帮助自我成长型家庭在装修前看清生活方式、空间秩序、预算取舍、报价合同和签约风险。',
            inLanguage: 'zh-CN',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'ZenoAIHome',
            url: 'https://zenoaihome.com',
            description:
              'ZenoAIHome 是一个面向自我成长型家庭的 AI 居住判断系统，不做泛装修百科，也不替装修公司背书。',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'AI 居住判断系统｜装修前看清生活方式、预算和签约风险',
            url: 'https://zenoaihome.com/',
            description:
              'ZenoAIHome 面向自我成长型家庭，用 AI 辅助分析和装修现场经验，帮助用户在装修前看清生活方式、空间秩序、预算取舍和签约风险。',
            inLanguage: 'zh-CN',
            isPartOf: {
              '@type': 'WebSite',
              name: 'ZenoAIHome',
              url: 'https://zenoaihome.com',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'AI 居住诊断与装修签约前风险判断',
            provider: {
              '@type': 'Organization',
              name: 'ZenoAIHome',
              url: 'https://zenoaihome.com/',
            },
            areaServed: '中国',
            serviceType: '装修前生活方式、空间秩序、预算取舍、报价合同和签约风险判断',
            audience: {
              '@type': 'Audience',
              audienceType: '自我成长型装修家庭',
            },
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'AI 居住判断与签约前风险路径',
              itemListElement: [
                { '@type': 'Offer', name: '免费 AI 居住诊断', url: 'https://zenoaihome.com/living-diagnosis' },
                { '@type': 'Offer', name: '免费报价风险初筛', url: 'https://zenoaihome.com/tools/quote-check' },
                { '@type': 'Offer', name: '¥99 报价风险初查', url: 'https://zenoaihome.com/services/renovation#quote-entry' },
                { '@type': 'Offer', name: '¥299 标准报价快审', url: 'https://zenoaihome.com/services/renovation#quote-standard' },
                { '@type': 'Offer', name: '¥699 签约前深度判断', url: 'https://zenoaihome.com/services/renovation#quote-deep' },
              ],
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'AI 居住诊断是什么？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'AI 居住诊断不是风格测试，而是把生活方式、空间秩序、审美偏好、预算取舍和签约风险放在一起做初步判断。',
                },
              },
              {
                '@type': 'Question',
                name: '为什么装修前要先看生活方式？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '因为风格、预算和施工方案都应该服务真实生活。先看清家庭关系、收纳秩序、家务动线和情绪需求，后面才不容易反复推翻。',
                },
              },
              {
                '@type': 'Question',
                name: '已有报价时还需要居住诊断吗？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '需要，但顺序会变。临近签约时，要把居住需求、预算取舍、报价边界和合同条款放在一起看，而不是继续只讨论风格。',
                },
              },
              {
                '@type': 'Question',
                name: 'ZenoAIHome 会替我判断哪家公司靠谱吗？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '不会。ZenoAIHome 不替装修公司背书，也不替你做最终签约决定，只帮你看清报价、合同和付款节点里的风险点。',
                },
              },
              {
                '@type': 'Question',
                name: '报价风险初筛还保留吗？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '保留。报价风险初筛仍然是临近签约用户的重要入口，用来检查漏项、模糊项、材料边界、付款节点和合同承诺。',
                },
              },
            ],
          },
        ]}
      />
      <HomePageGptSkill fontClassName="" />
    </>
  )
}
