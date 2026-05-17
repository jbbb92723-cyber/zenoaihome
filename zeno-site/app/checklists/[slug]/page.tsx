import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import StructuredData from '@/components/StructuredData'
import { checklistTemplates, getChecklistTemplateBySlug, type ChecklistTemplate } from '@/data/checklist-templates'
import { getQuoteRiskRuleById, type QuoteRiskRule } from '@/data/quote-risk-rules'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return [
    ...checklistTemplates.map((template) => ({ slug: template.slug })),
    { slug: 'contract-before-signing' },
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const template = getChecklistTemplateBySlug(params.slug)
  if (!template) return {}

  return {
    title: `${template.title} | 签约前检查模板 | ZenoAIHome`,
    description: `${template.subtitle} 可直接照着检查、复制追问，适合装修签约前核对报价、合同和付款节点。`,
    alternates: {
      canonical: `https://zenoaihome.com/checklists/${template.slug}`,
    },
  }
}

function buildCopyText(template: ChecklistTemplate) {
  return [
    `# ${template.title}`,
    template.subtitle,
    '',
    '适合谁：',
    ...template.suitableFor.map((item) => `- ${item}`),
    '',
    '开始前先准备：',
    ...template.beforeYouStart.map((item) => `- ${item}`),
    '',
    ...template.sections.flatMap((section) => [
      `## ${section.title}`,
      ...section.items.flatMap((item) => [`- 要检查：${item.check}`, `  为什么：${item.why}`]),
      '',
    ]),
    `下一步：${template.nextStep}`,
  ].join('\n')
}

function RiskLinks({ ids }: { ids: string[] }) {
  const risks = ids
    .map((id) => getQuoteRiskRuleById(id))
    .filter((item): item is QuoteRiskRule => Boolean(item))

  if (risks.length === 0) return null

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {risks.map((risk) => (
        <Link
          key={risk.id}
          href={`/risk-dictionary/${risk.slug}`}
          className="border border-stone/20 bg-stone-pale px-2 py-1 text-xs font-medium text-stone transition-colors hover:border-stone/50"
        >
          {risk.name}
        </Link>
      ))}
    </div>
  )
}

export default async function ChecklistDetailPage({ params }: Props) {
  const template = getChecklistTemplateBySlug(params.slug)
  if (!template) notFound()

  const copyText = buildCopyText(template)

  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: `${template.title} | 签约前检查模板`,
            description: `${template.subtitle} 可直接照着检查、复制追问，适合装修签约前核对报价、合同和付款节点。`,
            url: `https://zenoaihome.com/checklists/${template.slug}`,
            inLanguage: 'zh-CN',
            articleSection: '签约前检查模板',
            about: {
              '@type': 'Thing',
              name: template.title,
              description: template.subtitle,
            },
            isPartOf: {
              '@type': 'CollectionPage',
              name: '签约前检查模板',
              url: 'https://zenoaihome.com/checklists',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: template.title,
            description: template.subtitle,
            url: `https://zenoaihome.com/checklists/${template.slug}`,
            inLanguage: 'zh-CN',
            tool: template.beforeYouStart.map((item) => ({
              '@type': 'HowToTool',
              name: item,
            })),
            step: template.sections.flatMap((section) =>
              section.items.map((item) => ({
                '@type': 'HowToStep',
                name: item.check,
                text: item.why,
              })),
            ),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: '检查模板',
                item: 'https://zenoaihome.com/checklists',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: template.title,
                item: `https://zenoaihome.com/checklists/${template.slug}`,
              },
            ],
          },
        ]}
      />

      <Container size="content" className="pt-12 sm:pt-16">
        <nav className="mb-8 flex items-center gap-2 text-xs text-ink-muted">
          <Link href="/checklists" className="transition-colors hover:text-stone">检查模板</Link>
          <span>/</span>
          <span className="text-stone">{template.title}</span>
        </nav>

        <header className="border-b border-border pb-10">
          <p className="page-label mb-4">签约前检查模板</p>
          <h1 className="page-title">{template.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-[1.7] text-ink-muted sm:text-lg">{template.subtitle}</p>
        </header>
      </Container>

      <Container size="content" className="py-section">
        <section className="mb-6 border border-border bg-surface p-5 sm:p-6">
          <h2 className="text-base font-semibold text-ink">适合谁</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {template.suitableFor.map((item) => (
              <span key={item} className="bg-stone-pale px-2 py-1 text-xs font-medium text-stone">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-6 border border-border bg-surface p-5 sm:p-6">
          <h2 className="text-base font-semibold text-ink">开始前先准备</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-muted">
            {template.beforeYouStart.map((item) => (
              <li key={item} className="border-l-2 border-stone-light pl-3">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <div className="grid gap-6">
          {template.sections.map((section) => (
            <section key={section.title} className="border border-border bg-surface p-5 sm:p-6">
              <h2 className="text-lg font-semibold tracking-tight text-ink">{section.title}</h2>
              <div className="mt-5 grid gap-4">
                {section.items.map((item, index) => (
                  <article key={`${section.title}-${index}`} className="border border-border bg-canvas p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-stone">要检查什么</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink">{item.check}</p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-stone">为什么要看</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.why}</p>
                    <RiskLinks ids={item.relatedRiskIds} />
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-8 border border-border bg-surface-warm p-5 sm:p-6">
          <h2 className="text-base font-semibold text-ink">可复制文本</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            第一版先做网页可读、可复制。你可以直接选中下面文本，发给自己、家人或施工方逐条确认。
          </p>
          <textarea
            readOnly
            value={copyText}
            className="mt-4 min-h-[360px] w-full resize-y border border-border bg-canvas p-4 text-sm leading-relaxed text-ink outline-none"
          />
        </section>

        <section className="mt-10 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">下一步</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">清单只是帮你问清楚，最终还要回到报价和合同。</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">{template.nextStep}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <CTA href="/tools/quote-check" label="做免费报价初筛" variant="primary" />
            <CTA href="/risk-dictionary" label="看相关风险词典" variant="secondary" />
            <CTA href="/services/renovation#quote-standard" label="看人工快审服务" variant="ghost" />
          </div>
        </section>
      </Container>
    </>
  )
}
