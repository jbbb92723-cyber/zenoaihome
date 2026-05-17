import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import StructuredData from '@/components/StructuredData'
import { getQuoteRiskRuleById, getQuoteRiskRuleBySlug, quoteRiskRules, type QuoteRiskRule } from '@/data/quote-risk-rules'

interface Props {
  params: { slug: string }
}

const riskLevelClass: Record<string, string> = {
  高: 'border-red-200 bg-red-50 text-red-700',
  中: 'border-amber-200 bg-amber-50 text-amber-700',
  低: 'border-stone/20 bg-stone-pale text-stone',
}

export function generateStaticParams() {
  return quoteRiskRules.map((rule) => ({ slug: rule.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const rule = getQuoteRiskRuleBySlug(params.slug)
  if (!rule) return {}

  return {
    title: `${rule.name} | 装修报价风险词典 | ZenoAIHome`,
    description: `${rule.oneLine} 签约前先问清，避免后期增项和扯皮。`,
    alternates: {
      canonical: `https://zenoaihome.com/risk-dictionary/${rule.slug}`,
    },
  }
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border border-border bg-surface p-5 sm:p-6">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-ink-muted">{children}</div>
    </section>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="border-l-2 border-stone-light pl-3">
          {item}
        </li>
      ))}
    </ul>
  )
}

function Tags({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="bg-stone-pale px-2 py-1 text-xs font-medium text-stone">
          {item}
        </span>
      ))}
    </div>
  )
}

function RelatedRisks({ rule }: { rule: QuoteRiskRule }) {
  const related = rule.relatedRiskIds
    .map((id) => getQuoteRiskRuleById(id))
    .filter((item): item is QuoteRiskRule => Boolean(item))

  if (related.length === 0) {
    return <p>暂无相关风险。</p>
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {related.map((item) => (
        <Link key={item.id} href={`/risk-dictionary/${item.slug}`} className="border border-border bg-canvas p-4 transition-colors hover:border-stone/50">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className={`border px-2 py-0.5 text-xs font-semibold ${riskLevelClass[item.riskLevel]}`}>
              {item.riskLevel}风险
            </span>
            <span className="text-xs text-ink-faint">{item.category}</span>
          </div>
          <p className="text-sm font-semibold text-ink">{item.name}</p>
          <p className="mt-2 text-xs leading-relaxed text-ink-muted">{item.oneLine}</p>
        </Link>
      ))}
    </div>
  )
}

export default async function RiskDictionaryDetailPage({ params }: Props) {
  const rule = getQuoteRiskRuleBySlug(params.slug)
  if (!rule) notFound()

  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: `${rule.name} | 装修报价风险词典`,
            description: `${rule.oneLine} 签约前先问清，避免后期增项和扯皮。`,
            url: `https://zenoaihome.com/risk-dictionary/${rule.slug}`,
            inLanguage: 'zh-CN',
            articleSection: '装修报价风险词典',
            about: {
              '@type': 'Thing',
              name: rule.name,
              description: rule.oneLine,
            },
            isPartOf: {
              '@type': 'CollectionPage',
              name: '装修报价风险词典',
              url: 'https://zenoaihome.com/risk-dictionary',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'DefinedTerm',
            name: rule.name,
            description: rule.oneLine,
            url: `https://zenoaihome.com/risk-dictionary/${rule.slug}`,
            termCode: rule.id,
            inDefinedTermSet: {
              '@type': 'DefinedTermSet',
              name: '装修报价风险词典',
              url: 'https://zenoaihome.com/risk-dictionary',
            },
            subjectOf: {
              '@type': 'WebPage',
              name: `${rule.name} | 装修报价风险词典`,
              description: `${rule.oneLine} 签约前先问清，避免后期增项和扯皮。`,
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: '风险词典',
                item: 'https://zenoaihome.com/risk-dictionary',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: rule.name,
                item: `https://zenoaihome.com/risk-dictionary/${rule.slug}`,
              },
            ],
          },
        ]}
      />

      <Container size="content" className="pt-12 sm:pt-16">
        <nav className="mb-8 flex items-center gap-2 text-xs text-ink-muted">
          <Link href="/risk-dictionary" className="transition-colors hover:text-stone">风险词典</Link>
          <span>/</span>
          <span className="text-stone">{rule.name}</span>
        </nav>

        <header className="border-b border-border pb-10">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className={`border px-2 py-0.5 text-xs font-semibold ${riskLevelClass[rule.riskLevel]}`}>
              {rule.riskLevel}风险
            </span>
            <span className="border border-border bg-canvas px-2 py-0.5 text-xs text-ink-muted">
              {rule.category}
            </span>
          </div>
          <h1 className="page-title">{rule.name}</h1>
          <p className="mt-5 max-w-2xl text-base leading-[1.7] text-ink-muted sm:text-lg">{rule.oneLine}</p>
        </header>
      </Container>

      <Container size="content" className="py-section">
        <div className="grid gap-5">
          <Section title="这是什么意思">
            <p>{rule.plainExplanation}</p>
          </Section>

          <Section title="为什么危险">
            <p>{rule.whyItMatters}</p>
          </Section>

          <Section title="报价里常见触发词">
            <Tags items={rule.triggerTerms} />
          </Section>

          <Section title="常出现在哪些项目">
            <Tags items={rule.commonItems} />
          </Section>

          <Section title="业主常见误判">
            <p>{rule.homeownerMisjudgment}</p>
          </Section>

          <Section title="签约前应该问什么">
            <BulletList items={rule.preSigningQuestions} />
          </Section>

          <Section title="建议写进合同/报价备注的话">
            <div className="border-l-2 border-stone bg-stone/5 p-4 text-ink">
              {rule.contractSuggestion}
            </div>
          </Section>

          <Section title="适合谁重点看">
            <Tags items={rule.suitableFor} />
          </Section>

          <Section title="相关风险">
            <RelatedRisks rule={rule} />
          </Section>
        </div>

        <section className="mt-10 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">下一步</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">回到你的报价单，看这个风险是否真的存在。</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
            单个词条只能帮你理解风险。真正要判断能不能签，需要把报价单、合同、付款节点和现场项目放在一起看。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <CTA href="/tools/quote-check" label="先做免费报价初筛" variant="primary" />
            <CTA href="/checklists" label="看签约前检查模板" variant="secondary" />
            <CTA href="/services/renovation#quote-standard" label="看人工报价快审" variant="ghost" />
          </div>
        </section>
      </Container>
    </>
  )
}
