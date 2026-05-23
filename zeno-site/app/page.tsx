import type { Metadata } from 'next'
import HomePageGptSkill from '@/components/home/HomePageGptSkill'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: '装修报价风险初筛｜签约前看懂报价、合同和增项风险｜ZenoAIHome',
  description:
    'ZenoAIHome 帮助准备装修的业主在签约前识别报价漏项、材料模糊、按实结算、暂估、口头承诺和后期增项风险。先用免费报价风险初筛，再决定是否需要人工复核。',
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
              'ZenoAIHome 帮助业主在装修签约前识别报价、合同和增项风险。',
            inLanguage: 'zh-CN',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'ZenoAIHome',
            url: 'https://zenoaihome.com',
            description:
              'ZenoAIHome 是一个面向装修业主的签约前报价风险判断网站，不做泛装修百科，也不替装修公司背书。',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: '装修报价风险初筛｜签约前看懂报价、合同和增项风险',
            url: 'https://zenoaihome.com/',
            description:
              'ZenoAIHome 帮助准备装修的业主在签约前识别报价漏项、材料模糊、按实结算、暂估、口头承诺和后期增项风险。',
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
            name: '装修报价风险初筛与人工复核',
            provider: {
              '@type': 'Organization',
              name: 'ZenoAIHome',
              url: 'https://zenoaihome.com/',
            },
            areaServed: '中国',
            serviceType: '装修签约前报价、合同和增项风险判断',
            audience: {
              '@type': 'Audience',
              audienceType: '准备签约的装修业主',
            },
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: '签约前报价风险判断路径',
              itemListElement: [
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
                name: '装修报价风险初筛是什么？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '装修报价风险初筛是签约前对报价单进行初步检查，重点看有没有漏项、模糊项、暂估、按实结算、材料型号不清和后期增项风险。',
                },
              },
              {
                '@type': 'Question',
                name: '装修报价只看总价可以吗？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '不建议只看总价。装修报价真正容易出问题的地方，往往不是总价，而是包含范围、计价方式、材料说明、施工工艺和变更规则。',
                },
              },
              {
                '@type': 'Question',
                name: '什么情况下需要人工复核报价？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '如果你已经准备签约，报价里出现按实结算、暂估、另计、以现场为准、材料型号不清，或者几家报价差异很大，就建议做人工复核。',
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
                name: '报价风险初筛和完整报价审核有什么区别？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '初筛主要发现明显风险和追问方向，完整人工复核会进一步看漏项、模糊项、材料边界、付款节点和合同承诺。',
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
