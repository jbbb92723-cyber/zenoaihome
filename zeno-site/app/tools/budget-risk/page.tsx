import type { Metadata } from 'next'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import StructuredData from '@/components/StructuredData'
import BudgetRiskQuiz from '@/components/budget-risk/BudgetRiskQuiz'

export const metadata: Metadata = {
  title: '超预算原因自测',
  description:
    '用 8 个问题先分清你担心超预算，更像来自报价没说清、预算没分好、施工流程，还是需求顺序本身。',
  alternates: {
    canonical: 'https://zenoaihome.com/tools/budget-risk',
  },
}

export default function BudgetRiskToolPage() {
  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: '超预算原因自测',
            url: 'https://zenoaihome.com/tools/budget-risk',
            description: '用 8 个问题缩小装修预算与判断风险。',
            inLanguage: 'zh-CN',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: '这个工具能替代人工判断吗？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '不能。它只负责先分清哪类风险更值得先处理，不替代你后续对报价、预算或方案的真实判断。',
                },
              },
              {
                '@type': 'Question',
                name: '适合什么时候做？',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '最适合在签约前、预算还没理顺，或者你已经感觉哪里不对但说不清问题到底在哪个层面的时候做。',
                },
              },
            ],
          },
        ]}
      />

      <PageHero
        label="工具"
        title="超预算原因自测"
        subtitle="如果你已经感觉钱可能失控，但说不清是报价、预算、流程还是需求顺序的问题，先用这 8 个问题把风险缩小。"
        note="结果页会告诉你先该看哪类资源、文章或服务，而不是给你一个虚假的“总分”。"
        size="content"
      />

      <Container size="content" className="py-section">
        <section className="mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            ['先分类型', '不是看你“危不危险”，而是看你更像卡在哪一类问题。'],
            ['先做缩小', '工具的价值是先缩小问题范围，方便你后面少走弯路。'],
            ['再进资源或服务', '结果出来后，你会拿到对应资源入口和更合适的下一步。'],
          ].map(([title, description]) => (
            <div key={title} className="border border-border bg-surface p-5">
              <p className="text-sm font-semibold text-ink mb-2">{title}</p>
              <p className="text-xs text-ink-muted leading-relaxed">{description}</p>
            </div>
          ))}
        </section>

        <BudgetRiskQuiz />

        <div className="mt-12 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">还不想做自测？</p>
          <div className="flex flex-wrap gap-3">
            <CTA href="/resources#sign-before-contract" label="先去签约前入口" variant="secondary" />
            <CTA href="/services/renovation" label="直接看装修服务边界" variant="ghost" />
          </div>
        </div>
      </Container>
    </>
  )
}
