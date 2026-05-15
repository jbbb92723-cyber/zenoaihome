import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { auth } from '@/auth'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import StructuredData from '@/components/StructuredData'
import { PRODUCTS, formatYuan } from '@/data/products'
import PurchaseButton from './PurchaseButton'
import CommercialLadder from '@/components/CommercialLadder'

export const metadata: Metadata = {
  title: '判断力产品 | 先用低价产品把问题看懂',
  description:
    'ZenoAIHome 的判断力产品页。先用免费工具和低价产品把装修报价、判断顺序、AI 场景和内容资产分开，再决定要不要进入人工服务。',
  alternates: {
    canonical: 'https://zenoaihome.com/pricing',
  },
}

const categoryOrder = ['装修判断', 'AI 升级', '内容资产'] as const

const sectionMeta: Record<
  (typeof categoryOrder)[number],
  { id: string; kicker: string; title: string; description: string }
> = {
  装修判断: {
    id: 'zhuangxiu-judgment',
    kicker: '主线 / 装修判断',
    title: '给普通业主的判断力产品',
    description: '先把报价、预算、合同和验收的顺序看懂，再决定要不要进入人工服务。',
  },
  'AI 升级': {
    id: 'ai-upgrade',
    kicker: '延伸 / AI 升级',
    title: '给传统行业人的真实场景小课',
    description: '从一个能落地的任务开始，把经验接进 AI，而不是追工具堆。',
  },
  '内容资产': {
    id: 'content-assets',
    kicker: '长期 / 内容资产',
    title: '给长期经营个人品牌的人',
    description: '把选题、提示词和结构沉淀成资产，不靠临时灵感。',
  },
}

const flowCards = [
  {
    title: '免费工具先缩小问题',
    body: '报价初筛、预算分配和验收节点先给结果，先别急着买更重的东西。',
  },
  {
    title: '低价产品先固定判断',
    body: '指南、小课和年卡把判断顺序写下来，方便反复使用。',
  },
  {
    title: '人工服务处理具体材料',
    body: '当你已经有报价、合同或场景时，再进入更重的服务。',
  },
]

const faqs = [
  {
    question: '为什么先卖低价产品？',
    answer:
      '因为很多问题先靠工具和资料就能缩小。产品负责把判断顺序固定下来，服务只处理具体材料。',
  },
  {
    question: '课程和服务有什么区别？',
    answer:
      '课程和资料解决可重复学习的部分，服务处理你手里的具体报价、预算、合同和场景。',
  },
  {
    question: '买完后在哪里看？',
    answer:
      '资源类产品会进入订单和用户中心；开通后按页面说明查看。',
  },
  {
    question: '退款规则是什么？',
    answer:
      '报价指南这类低价数字产品开通后不支持退款，其他产品以各自页面说明为准。',
  },
]

export default async function PricingPage() {
  const session = await auth()

  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: '判断力产品',
            url: 'https://zenoaihome.com/pricing',
            description: '先用低价产品把装修判断、AI 场景和内容资产看懂。',
            inLanguage: 'zh-CN',
            hasPart: PRODUCTS.map((product) => ({
              '@type': 'Product',
              name: product.name,
              description: product.tagline,
              url:
                product.id === 'quote-guide-pack'
                  ? 'https://zenoaihome.com/pricing/baojia-guide'
                  : `https://zenoaihome.com/pricing#${product.id}`,
              offers: {
                '@type': 'Offer',
                priceCurrency: 'CNY',
                price: product.price / 100,
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
        label="判断力产品"
        title="先用低价产品把一个问题看懂"
        subtitle="装修判断先从报价和预算开始，AI 产品先从真实场景开始。这里不是大而全的商店，而是把产品按你现在卡在哪一步排好。"
        note="工具负责初筛，产品负责系统化，服务负责具体判断。"
        size="content"
      />

      <Container size="layout" className="py-section">
        <section className="mb-12 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-faint">业主签约前判断梯子</p>
          <h2 className="mb-2 text-lg font-semibold text-ink">先按你现在卡在哪一步选</h2>
          <p className="mb-6 max-w-3xl text-sm leading-relaxed text-ink-muted">
            从免费报价初筛到 ¥9800 起的居住场景服务。下面的小课、AI 工作流、内容年卡是延伸产品，先看完主梯子再决定要不要看。
          </p>
          <CommercialLadder variant="summary" />
        </section>

        <section className="mb-12 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-faint">产品逻辑</p>
          <h2 className="mb-5 text-lg font-semibold text-ink">先看懂路径，再选产品</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {flowCards.map((item) => (
              <div key={item.title} className="border border-border bg-canvas p-5">
                <p className="text-sm font-semibold text-ink">{item.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mb-8 flex flex-wrap gap-3">
          {categoryOrder.map((category) => {
            const meta = sectionMeta[category]
            return (
              <a
                key={category}
                href={`#${meta.id}`}
                className="border border-border bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-stone hover:bg-surface-warm"
              >
                {meta.kicker}
              </a>
            )
          })}
        </div>

        <div className="space-y-12">
          {categoryOrder.map((category) => {
            const products = PRODUCTS.filter((product) => product.category === category)
            const meta = sectionMeta[category]
            if (products.length === 0) return null

            return (
              <section key={category} id={meta.id} className="scroll-mt-24">
                <div className="mb-5 max-w-3xl">
                  <p className="text-xs font-semibold uppercase tracking-widest text-stone">{meta.kicker}</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{meta.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{meta.description}</p>
                </div>

                <div className={`grid gap-5 ${products.length === 1 ? 'max-w-3xl' : 'md:grid-cols-2'}`}>
                  {products.map((product) => (
                    <article
                      key={product.id}
                      id={product.id}
                      className="scroll-mt-24 flex flex-col overflow-hidden border border-border bg-surface"
                    >
                      <div className="flex items-start justify-between gap-4 border-b border-border bg-surface-warm px-6 py-5">
                        <div className="min-w-0">
                          {product.badge && (
                            <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone">
                              {product.badge}
                            </span>
                          )}
                          <h3 className="mt-2 text-xl font-semibold leading-snug text-ink">{product.name}</h3>
                          <p className="mt-1 text-sm text-stone">{product.tagline}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-xs font-semibold uppercase tracking-widest text-stone">{product.category}</p>
                          <p className="mt-2 text-2xl font-semibold text-ink">{formatYuan(product.price)}</p>
                          {product.originalPrice && (
                            <p className="text-xs text-ink-faint line-through">{formatYuan(product.originalPrice)}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col gap-5 p-6">
                        <div className="grid gap-5 sm:grid-cols-2">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint">适合谁</p>
                            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{product.bestFor}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint">交付物</p>
                            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{product.deliverable}</p>
                          </div>
                        </div>

                        <ul className="space-y-2">
                          {product.description.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-ink-muted">
                              <span className="mt-0.5 text-stone shrink-0">-</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-auto flex flex-wrap gap-3 pt-1">
                          <PurchaseButton
                            productId={product.id}
                            label={`购买 ${product.name}`}
                            isLoggedIn={!!session?.user}
                          />
                          {product.id === 'quote-guide-pack' && (
                            <Link
                              href="/pricing/baojia-guide"
                              className="inline-flex h-11 items-center border border-stone px-4 text-sm font-semibold text-stone transition-colors hover:bg-stone-pale"
                            >
                              看指南详情
                            </Link>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        <section className="mt-14 grid gap-6 border border-border bg-surface-warm p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">产品之后怎么走</p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
              业主看不懂报价或临近签约，去装修服务；同行已经跑过一个 AI 场景，去 AI 工作流咨询；还在摸问题，就先拿资料和低价指南。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CTA href="/services/renovation" label="我是业主，看装修服务" variant="primary" />
            <CTA href="/services/ai-workflow" label="我是同行，看 AI 咨询" variant="secondary" />
            <CTA href="/tools/quote-check" label="先做报价初筛" variant="ghost" />
            <CTA href="/tools/content-brain" label="先做内容诊断" variant="ghost" />
          </div>
        </section>

        <div className="mt-14">
          <h3 className="mb-6 text-base font-semibold text-ink">购买前先看清楚</h3>
          <div className="grid gap-5 md:grid-cols-2">
            {faqs.map((item) => (
              <div key={item.question} className="border border-border bg-surface p-5">
                <p className="mb-1.5 text-sm font-medium text-ink">{item.question}</p>
                <p className="text-sm leading-relaxed text-ink-muted">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  )
}
