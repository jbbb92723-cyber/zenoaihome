import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import StructuredData from '@/components/StructuredData'
import { quoteRiskRules } from '@/data/quote-risk-rules'

export const metadata: Metadata = {
  title: '装修报价风险词典 | ZenoAIHome',
  description:
    '把装修报价单里容易引发增项、扯皮和后悔的风险词讲清楚。不是装修百科，只看签约前必须问清的风险边界。',
  alternates: {
    canonical: 'https://zenoaihome.com/risk-dictionary',
  },
}

const riskLevelClass: Record<string, string> = {
  高: 'border-red-200 bg-red-50 text-red-700',
  中: 'border-amber-200 bg-amber-50 text-amber-700',
  低: 'border-stone/20 bg-stone-pale text-stone',
}

export default function RiskDictionaryPage() {
  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: '装修报价风险词典',
            url: 'https://zenoaihome.com/risk-dictionary',
            description: '围绕装修签约前报价风险、合同边界和增项口子整理的风险词典。',
            inLanguage: 'zh-CN',
            hasPart: quoteRiskRules.map((rule) => ({
              '@type': 'DefinedTerm',
              name: rule.name,
              description: rule.oneLine,
              url: `https://zenoaihome.com/risk-dictionary/${rule.slug}`,
              termCode: rule.id,
              inDefinedTermSet: '装修报价风险词典',
            })),
          },
        ]}
      />

      <PageHero
        label="装修报价风险词典"
        title="装修报价风险词典"
        subtitle="把报价单里容易引发增项、扯皮和后悔的词讲清楚。不是装修百科，只看签约前必须问清的风险边界。"
        size="content"
      />

      <Container size="content" className="pt-8">
        <div className="flex flex-wrap gap-3">
          <CTA href="/tools/quote-check" label="先做免费报价初筛" variant="primary" />
          <CTA href="/checklists" label="查看检查模板" variant="secondary" />
        </div>
      </Container>

      <Container size="layout" className="py-section">
        <section className="mb-12 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">这个词典解决什么</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">它不教你装修施工，只帮你在签约前把话问清。</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
            报价单里很多风险不是藏在专业术语里，而是藏在“按实结算、暂估、以现场为准、另计、不含”这些看似普通的词里。
            这个词典把每个风险拆成触发词、常见项目、签约前追问和合同备注建议，方便你回到自己的报价单逐项核对。
          </p>
        </section>

        <section>
          <div className="mb-6 border-l-2 border-stone/40 pl-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">20 个风险词条</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">先看跟你报价单最像的词，再点进详情页抄问题。</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {quoteRiskRules.map((rule) => (
              <article key={rule.id} className="border border-border bg-surface p-5">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className={`border px-2 py-0.5 text-xs font-semibold ${riskLevelClass[rule.riskLevel]}`}>
                    {rule.riskLevel}风险
                  </span>
                  <span className="border border-border bg-canvas px-2 py-0.5 text-xs text-ink-muted">
                    {rule.category}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-ink">{rule.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{rule.oneLine}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {rule.triggerTerms.slice(0, 3).map((term) => (
                    <span key={term} className="bg-stone-pale px-2 py-1 text-xs font-medium text-stone">
                      {term}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/risk-dictionary/${rule.slug}`}
                  className="mt-5 inline-flex text-sm font-semibold text-stone underline-offset-4 hover:underline"
                >
                  查看详情
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">下一步</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">如果你手里已经有报价单，先别只靠词典猜。</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
            不确定哪些风险与你有关，先做一次免费报价初筛。初筛会把漏项、模糊项、增项口子和付款风险先筛出来。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <CTA href="/tools/quote-check" label="先做免费报价初筛" variant="primary" />
            <CTA href="/checklists" label="查看检查模板" variant="secondary" />
          </div>
        </section>
      </Container>
    </>
  )
}
