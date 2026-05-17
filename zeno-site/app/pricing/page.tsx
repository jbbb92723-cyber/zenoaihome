import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import CommercialLadder from '@/components/CommercialLadder'
import PageHero from '@/components/PageHero'
import StructuredData from '@/components/StructuredData'
import { commercialLadder } from '@/data/commercial-ladder'

export const metadata: Metadata = {
  title: '报价风险与签约前判断 | ZenoAIHome',
  description:
    '先看报价里哪些地方没说清，再决定要不要进入人工判断。这里只讲报价初筛、风险自查和三档人工服务，不做装修百科。',
  alternates: {
    canonical: 'https://zenoaihome.com/pricing',
  },
}

const howItWorks = [
  {
    title: '先看报价里有没有口子',
    body: '免费初筛先判断漏项、模糊项、按实际结算和付款风险。',
  },
  {
    title: '再用自查指南补一遍',
    body: '¥39 指南适合自己先过一遍报价、合同和付款节点。',
  },
  {
    title: '最后再进人工判断',
    body: '预算取舍、报价快审、签约前决策包，按卡点选一档就够。',
  },
]

const faqs = [
  {
    question: '这页和 tools/quote-check 有什么区别？',
    answer:
      '工具页先出风险初筛，这一页负责把免费初筛、¥39 自查和三档人工服务排成一条清楚的路径。',
  },
  {
    question: '我已经拿到报价单，先看哪一档？',
    answer:
      '先看免费初筛。如果已经能明确说出问题在哪里，再看 ¥39 自查指南。只有当报价、预算或合同一起卡住时，才进人工服务。',
  },
  {
    question: '为什么没有把 AI 和内容产品放在这里？',
    answer:
      '因为这页只负责签约前报价判断。AI 和内容是辅助层，不放在主价格梯子里。',
  },
]

export default function PricingPage() {
  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: '报价风险与签约前判断',
            url: 'https://zenoaihome.com/pricing',
            description: '签约前先看清报价、合同和付款节点的风险，再决定是否进入人工判断。',
            inLanguage: 'zh-CN',
            hasPart: commercialLadder.map((item) => ({
              '@type': item.source === 'service' ? 'Service' : 'Product',
              name: item.title,
              description: item.delivers,
              url: `https://zenoaihome.com${item.href}`,
              offers: {
                '@type': 'Offer',
                priceCurrency: 'CNY',
                price: item.priceNumeric,
              },
            })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          },
        ]}
      />

      <PageHero
        label="报价风险主线"
        title="先看报价里没说清的风险"
        subtitle="免费初筛、¥39 自查指南和三档人工判断都围绕同一件事：签约前先把边界看清楚。"
        note="工具先看，清单补问，服务再处理具体材料。"
        size="content"
      />

      <Container size="layout" className="py-section">
        <section className="mb-12 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-faint">业主判断梯子</p>
          <h2 className="mb-2 text-lg font-semibold text-ink">先按你现在卡在哪一步选</h2>
          <p className="mb-6 max-w-3xl text-sm leading-relaxed text-ink-muted">
            从免费报价初筛到 ¥1499 签约前决策包。这里不展开装修百科，只保留签约前最常用的判断路径。
          </p>
          <CommercialLadder variant="summary" />
        </section>

        <section className="mb-12 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-faint">怎么用</p>
          <h2 className="mb-5 text-lg font-semibold text-ink">先看懂路径，再选产品</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {howItWorks.map((item) => (
              <div key={item.title} className="border border-border bg-canvas p-5">
                <p className="text-sm font-semibold text-ink">{item.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.42fr_0.58fr]">
          <div className="border border-border bg-surface p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">你下一步该做什么</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">别先看价格，先看你卡在哪一步</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              如果你只有一份报价单，先去免费初筛；如果你已经能说出风险点，先看 ¥39 自查指南；如果报价、预算和合同一起乱，再进人工判断。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <CTA href="/tools/quote-check" label="先做免费初筛" variant="primary" />
              <CTA href="/pricing/baojia-guide" label="看 ¥39 自查指南" variant="secondary" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {faqs.map((item) => (
              <div key={item.question} className="border border-border bg-surface p-5">
                <p className="text-sm font-semibold text-ink">{item.question}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-6 border border-border bg-surface-warm p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">下一步入口</p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
              业主先从报价初筛开始；看不明白再拿 ¥39 自查指南；临近签约就去三档人工服务。AI 和内容产品不放在主价格梯子里。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CTA href="/tools/quote-check" label="报价初筛" variant="primary" />
            <CTA href="/services/renovation" label="三档人工服务" variant="secondary" />
          </div>
        </section>
      </Container>
    </>
  )
}
