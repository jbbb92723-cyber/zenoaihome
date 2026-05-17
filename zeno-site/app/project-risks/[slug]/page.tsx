import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import StructuredData from '@/components/StructuredData'
import {
  getRenovationProjectRiskBySlug,
  renovationProjectRisks,
  type RenovationProjectRisk,
} from '@/data/renovation-project-risks'
import { getChecklistTemplateBySlug, type ChecklistTemplate } from '@/data/checklist-templates'
import { getQuoteRiskRuleById, type QuoteRiskRule } from '@/data/quote-risk-rules'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return renovationProjectRisks.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getRenovationProjectRiskBySlug(params.slug)
  if (!project) return {}

  return {
    title: `${project.name}报价风险 | 施工项目风险库 | ZenoAIHome`,
    description: `${project.oneLine} 签约前看清报价范围、漏项、模糊词和增项口子。`,
    alternates: {
      canonical: `https://zenoaihome.com/project-risks/${project.slug}`,
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

function RelatedRisks({ ids }: { ids: string[] }) {
  const risks = ids
    .map((id) => getQuoteRiskRuleById(id))
    .filter((item): item is QuoteRiskRule => Boolean(item))

  if (risks.length === 0) return <p>暂无关联风险词条。</p>

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {risks.map((risk) => (
        <Link key={risk.id} href={`/risk-dictionary/${risk.slug}`} className="border border-border bg-canvas p-4 transition-colors hover:border-stone/50">
          <p className="text-sm font-semibold text-ink">{risk.name}</p>
          <p className="mt-2 text-xs leading-relaxed text-ink-muted">{risk.oneLine}</p>
        </Link>
      ))}
    </div>
  )
}

function RelatedChecklists({ slugs }: { slugs: string[] }) {
  const templates = slugs
    .map((slug) => getChecklistTemplateBySlug(slug))
    .filter((item): item is ChecklistTemplate => Boolean(item))

  if (templates.length === 0) return <p>暂无关联检查模板。</p>

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {templates.map((template) => (
        <Link key={template.id} href={`/checklists/${template.slug}`} className="border border-border bg-canvas p-4 transition-colors hover:border-stone/50">
          <p className="text-sm font-semibold text-ink">{template.title}</p>
          <p className="mt-2 text-xs leading-relaxed text-ink-muted">{template.subtitle}</p>
        </Link>
      ))}
    </div>
  )
}

function ProjectStructuredData({ project }: { project: RenovationProjectRisk }) {
  return (
    <StructuredData
      data={[
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: `${project.name}报价风险 | 施工项目风险库`,
          description: project.oneLine,
          url: `https://zenoaihome.com/project-risks/${project.slug}`,
          inLanguage: 'zh-CN',
          articleSection: '施工项目风险库',
          about: {
            '@type': 'Thing',
            name: `${project.name}装修报价风险`,
            description: `签约前核对${project.name}报价的范围、漏项、模糊词和增项风险。`,
          },
          isPartOf: {
            '@type': 'CollectionPage',
            name: '施工项目风险库',
            url: 'https://zenoaihome.com/project-risks',
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: '施工项目风险库',
              item: 'https://zenoaihome.com/project-risks',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: `${project.name}报价风险`,
              item: `https://zenoaihome.com/project-risks/${project.slug}`,
            },
          ],
        },
      ]}
    />
  )
}

export default async function ProjectRiskDetailPage({ params }: Props) {
  const project = getRenovationProjectRiskBySlug(params.slug)
  if (!project) notFound()

  return (
    <>
      <ProjectStructuredData project={project} />

      <Container size="content" className="pt-12 sm:pt-16">
        <nav className="mb-8 flex items-center gap-2 text-xs text-ink-muted">
          <Link href="/project-risks" className="transition-colors hover:text-stone">施工项目风险库</Link>
          <span>/</span>
          <span className="text-stone">{project.name}</span>
        </nav>

        <header className="border-b border-border pb-10">
          <p className="page-label mb-4">施工项目风险库</p>
          <h1 className="page-title">{project.name}报价风险</h1>
          <p className="mt-5 max-w-2xl text-base leading-[1.7] text-ink-muted sm:text-lg">{project.oneLine}</p>
        </header>
      </Container>

      <Container size="content" className="py-section">
        <div className="grid gap-5">
          <Section title="这个项目通常包含什么">
            <Tags items={project.usuallyIncludes} />
          </Section>

          <Section title="报价里应该写清什么">
            <BulletList items={project.quoteShouldClarify} />
          </Section>

          <Section title="常见漏项">
            <BulletList items={project.commonMissingItems} />
          </Section>

          <Section title="常见模糊词">
            <Tags items={project.vagueWords} />
          </Section>

          <Section title="常见增项口子">
            <BulletList items={project.addOnRisks} />
          </Section>

          <Section title="签约前要问什么">
            <BulletList items={project.preSigningQuestions} />
          </Section>

          <Section title="建议写进报价/合同的话">
            <div className="border-l-2 border-stone bg-stone/5 p-4 text-ink">
              {project.contractSuggestion}
            </div>
          </Section>

          <Section title="关联风险词条">
            <RelatedRisks ids={project.relatedRiskIds} />
          </Section>

          <Section title="关联检查模板">
            <RelatedChecklists slugs={project.relatedChecklistSlugs} />
          </Section>
        </div>

        <section className="mt-10 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">下一步</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">不要只看单个项目，回到整份报价一起判断。</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
            如果这个项目已经出现模糊词、漏项或增项口子，建议先用免费报价初筛把整份报价过一遍；临近签约再看人工快审。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <CTA href="/tools/quote-check" label="做免费报价初筛" variant="primary" />
            <CTA href="/services/renovation#quote-standard" label="看人工报价快审" variant="secondary" />
          </div>
        </section>
      </Container>
    </>
  )
}
