import type { Metadata } from 'next'
import HomePageGptSkill from '@/components/features/home/HomePageGptSkill'
import StructuredData from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: '16年床垫与装修老兵，只说真话的家居避坑指南｜ZenoAIHome',
  description:
    '赞诺的个人网站。装修避坑、床垫干货、生活方式、IP方法论、AI实战、OPC社群——16年真金白银换来的经验，全部公开。',
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
              '16年床垫与装修老兵赞诺的个人网站。装修避坑、床垫干货、生活方式、IP方法论、AI实战、OPC社群。',
            inLanguage: 'zh-CN',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'ZenoAIHome',
            url: 'https://zenoaihome.com',
            description:
              'ZenoAIHome 是赞诺的私人自留地——16年床垫与装修老兵，只说真话，不卖货。',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: '16年床垫与装修老兵，只说真话的家居避坑指南',
            url: 'https://zenoaihome.com/',
            description:
              '装修避坑、床垫干货、生活方式、IP方法论、AI实战、OPC社群——赞诺的私人自留地。',
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
            name: '居住决策支持与装修风险控制',
            provider: {
              '@type': 'Organization',
              name: 'ZenoAIHome',
              url: 'https://zenoaihome.com/',
            },
            areaServed: '中国',
            serviceType: '装修前生活方式、审美取舍、空间方案、预算报价、合同约定和交付风险判断',
            audience: {
              '@type': 'Audience',
              audienceType: '自我成长型装修家庭',
            },
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: '居住判断、报价初筛与人工服务路径',
              itemListElement: [
                { '@type': 'Offer', name: '免费 AI 居住诊断', url: 'https://zenoaihome.com/living-diagnosis' },
                { '@type': 'Offer', name: '免费报价风险初筛', url: 'https://zenoaihome.com/tools/quote-check' },
                { '@type': 'Offer', name: '免费 居住需求洞察报告', url: 'https://zenoaihome.com/services#living-insight-beta' },
                { '@type': 'Offer', name: '免费 报价风险初查', url: 'https://zenoaihome.com/services#quote-entry' },
                { '@type': 'Offer', name: '免费 报价 / 合同快审', url: 'https://zenoaihome.com/services#quote-standard' },
                { '@type': 'Offer', name: '免费 居住方案综合判断', url: 'https://zenoaihome.com/services#quote-deep' },
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
                  text: 'AI 居住诊断不是风格测试，而是把生活方式、空间秩序、审美偏好、预算取舍和后续签约边界放在一起做初步判断。',
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
                  text: '需要，但顺序会变。临近签约时，要把居住需求、空间选择、预算取舍、报价边界和合同条款放在一起看，而不是继续只讨论风格。',
                },
              },
              {
                '@type': 'Question',
                name: 'ZenoAIHome 会替我判断哪家公司靠谱吗？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '不会。ZenoAIHome 不替装修公司背书，也不替你做最终签约决定，只帮你看清方案、预算、报价、合同和付款节点里的风险点。',
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
