import type { Metadata } from 'next'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import CommercialLadder from '@/components/CommercialLadder'
import PageHero from '@/components/PageHero'
import StructuredData from '@/components/StructuredData'
import { commercialLadder } from '@/data/commercial-ladder'

export const metadata: Metadata = {
  title: '报价风险判断价格路径 | 免费初筛、¥99、¥299、¥699 | ZenoAIHome',
  description:
    'ZenoAIHome 当前价格主线：免费报价初筛、¥99 体验版初查、¥299 标准版报价快审、¥699 深度版签约前判断。',
  alternates: {
    canonical: 'https://zenoaihome.com/pricing',
  },
}

const faqs = [
  {
    question: '为什么不再把旧指南和其他服务放在主价格页？',
    answer:
      '当前网站先打穿签约前报价风险判断。旧产品和延伸服务可以保留历史入口，但不再作为新用户的主购买路径。',
  },
  {
    question: '我应该先买哪一档？',
    answer:
      '没有完整报价时先不要买人工服务。刚拿到少量重点报价看 ¥99；有完整报价看 ¥299；快签合同且有合同草稿和付款节点时看 ¥699。',
  },
  {
    question: '免费初筛和人工服务是什么关系？',
    answer:
      '免费初筛负责先找方向，人工服务负责看你的具体材料。初筛已经能解决的问题，不需要直接进入人工判断。',
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
            name: '报价风险判断价格路径',
            url: 'https://zenoaihome.com/pricing',
            description: '免费初筛、¥99 初查、¥299 快审、¥699 深度判断组成的签约前报价风险判断路径。',
            inLanguage: 'zh-CN',
            hasPart: commercialLadder.map((item) => ({
              '@type': item.source === 'service' ? 'Service' : 'WebApplication',
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
        label="价格路径"
        title="不要先比价格，先看你手里的材料到哪一步。"
        subtitle="当前主线只保留：免费报价初筛 → ¥99 体验版初查 → ¥299 标准版快审 → ¥699 深度版签约前判断。"
        size="content"
      />

      <Container size="content" className="py-section">
        <section className="mb-12 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">主价格梯子</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">报价看不懂，就按这个顺序走。</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
            免费初筛先判断哪里没写清；¥99 只看 10 行以内重点报价；¥299 看完整报价；¥699 才把报价、合同和付款节点一起看。
          </p>
          <div className="mt-6">
            <CommercialLadder variant="full" />
          </div>
        </section>

        <section className="mb-12 grid gap-4 md:grid-cols-2">
          {[
            ['还没完整报价', '先做免费初筛和检查模板，不建议买人工服务。', '/tools/quote-check', '先做免费初筛'],
            ['只有几行重点报价', '先用 ¥99 体验版看明显风险。', '/services/renovation#quote-entry', '看 ¥99 初查'],
            ['已有完整报价', '准备继续谈或准备签约，看 ¥299 标准版。', '/services/renovation#quote-standard', '看 ¥299 快审'],
            ['快签合同', '报价、合同和付款节点一起看，选 ¥699 深度版。', '/services/renovation#quote-deep', '看 ¥699 深度版'],
          ].map(([title, desc, href, action]) => (
            <div key={title} className="border border-border bg-surface p-5">
              <h2 className="text-base font-semibold text-ink">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{desc}</p>
              <div className="mt-4">
                <CTA href={href} label={action} variant="ghost" />
              </div>
            </div>
          ))}
        </section>

        <section className="mb-12 border border-border bg-surface p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">旧入口说明</p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-ink">旧资料和旧服务不再作为主购买路径。</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            以前的低价指南、预算取舍和居住场景服务先保留历史页面或文章链接，但新用户不要从那里开始。
            当前最清楚的商业路径，是先做报价初筛，再根据材料完整度进入三档人工判断。
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {faqs.map((item) => (
            <div key={item.question} className="border border-border bg-surface p-5">
              <h2 className="text-sm font-semibold text-ink">{item.question}</h2>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">{item.answer}</p>
            </div>
          ))}
        </section>
      </Container>
    </>
  )
}
