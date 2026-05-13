import type { Metadata } from 'next'
import Container from '@/components/Container'
import CopyLinkButton from '@/components/CopyLinkButton'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import StructuredData from '@/components/StructuredData'
import RiskDimensionCard from '@/components/budget-risk/RiskDimensionCard'
import { parseScoreQuery, riskSummaries } from '@/data/budget-risk'

export const metadata: Metadata = {
  title: '你的超预算原因自测结果',
  description:
    '根据超预算原因自测结果，先分清你当前更值得先处理的是报价、预算分配、流程还是居住场景需求。',
  alternates: {
    canonical: 'https://zenoaihome.com/tools/budget-risk/result',
  },
}

const resultFaqs = [
  {
    question: '这个结果是不是已经等于最终结论？',
    answer:
      '不是。它只负责先把风险类型分清，不替你做最终决策。真正要不要签、哪里要改，还要结合你的报价和预算材料来看。',
  },
  {
    question: '什么时候该直接进入人工判断？',
    answer:
      '如果你已经临近签约、已经出现多轮改价，或者你知道有问题但不知道怎么追问，就别再停留在结果页。',
  },
  {
    question: '做完结果页之后，下一步最合理的顺序是什么？',
    answer:
      '通常是先看对应文章，再拿清单或模板堵风险口子，最后如果还拿不准，再进入人工服务。',
  },
]

export default function BudgetRiskResultPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const result = parseScoreQuery(searchParams)
  const dominantSummary = riskSummaries[result.dominant]

  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: '超预算原因自测结果',
            url: 'https://zenoaihome.com/tools/budget-risk/result',
            description: dominantSummary.headline,
            inLanguage: 'zh-CN',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: resultFaqs.map((item) => ({
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
        label="结果页"
        title={result.isEmpty ? '你还没完成这轮自测' : dominantSummary.headline}
        subtitle={
          result.isEmpty
            ? '这个页面需要从超预算原因自测进入。先把问题做一轮缩小，再看结果会更有意义。'
            : dominantSummary.description
        }
        note={result.isEmpty ? '如果你只是直接打开了结果页，先回去做完 8 个问题。' : dominantSummary.whyItMatters}
        size="content"
      />

      <Container size="content" className="py-section">
        {result.isEmpty ? (
          <section className="border border-border bg-surface-warm p-6 sm:p-8">
            <div className="flex flex-wrap gap-3">
              <CTA href="/tools/budget-risk" label="回去做自测" variant="primary" />
              <CTA href="/resources#sign-before-contract" label="直接去签约前入口" variant="secondary" />
            </div>
          </section>
        ) : (
          <>
            <section className="mb-10 border border-border bg-surface-warm p-6 sm:p-8">
              <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">你现在最该先做的事</p>
              <h2 className="text-lg font-semibold text-ink mb-3">{dominantSummary.firstStep}</h2>
              <p className="text-sm text-ink-muted leading-relaxed mb-5">{dominantSummary.whyItMatters}</p>
              <div className="flex flex-wrap gap-3">
                <CTA href={dominantSummary.resource.href} label={dominantSummary.resource.label} variant="primary" />
                <CTA href={dominantSummary.service.href} label={dominantSummary.service.label} variant="secondary" />
                <CTA href={dominantSummary.article.href} label={dominantSummary.article.label} variant="ghost" />
                <CopyLinkButton label="保存结果链接" />
              </div>
            </section>

            <section className="mb-10">
              <div className="mb-6">
                <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">四类风险分布</p>
                <h2 className="text-lg font-semibold text-ink">不要只看最高项，也看看第二风险在追你什么</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.ranking.map((item) => (
                  <RiskDimensionCard
                    key={item.key}
                    summary={item.summary}
                    score={item.score}
                    maxScore={result.maxPerDimension}
                    isDominant={item.key === result.dominant}
                  />
                ))}
              </div>
            </section>

            <section className="mb-10 grid grid-cols-1 lg:grid-cols-[1fr_0.95fr] gap-6">
              <div className="border border-border bg-surface p-6 sm:p-8">
                <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">下一步顺序</p>
                <div className="space-y-4 text-sm text-ink-muted leading-relaxed">
                  <p>1. 先看与你最高风险对应的文章，先把“问题为什么会发生”看清。</p>
                  <p>2. 再拿对应的清单或模板，把问题缩到可以直接操作的一层。</p>
                  <p>3. 如果仍然拿不准，再进入服务页，不要在模糊阶段就急着找人判断。</p>
                </div>
              </div>

              <div className="border border-border bg-surface-warm p-6 sm:p-8">
                <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">重新来一轮</p>
                <p className="text-sm text-ink-muted leading-relaxed mb-5">
                  如果你补充了新报价、重新拆了预算，或者现在已经进入了施工阶段，可以重新做一轮，看风险重心有没有变化。
                </p>
                <div className="flex flex-wrap gap-3">
                  <CTA href="/tools/budget-risk" label="重新做自测" variant="secondary" />
                  <CTA href="/start" label="回问题入口页" variant="ghost" />
                </div>
              </div>
            </section>

            <section className="border border-border bg-surface p-6 sm:p-8">
              <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">常见问题</p>
              <div className="space-y-5">
                {resultFaqs.map((item) => (
                  <div key={item.question}>
                    <h2 className="text-base font-semibold text-ink mb-2">{item.question}</h2>
                    <p className="text-sm text-ink-muted leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </Container>
    </>
  )
}
