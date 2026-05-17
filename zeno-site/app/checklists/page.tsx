import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import StructuredData from '@/components/StructuredData'
import { checklistTemplates } from '@/data/checklist-templates'

export const metadata: Metadata = {
  title: '签约前检查模板 | ZenoAIHome',
  description:
    '签约前检查模板：报价单初查、合同签约前检查、水电改造、老房翻新和付款节点检查清单，帮助业主拿到报价和合同后逐项对照。',
  alternates: {
    canonical: 'https://zenoaihome.com/checklists',
  },
}

export default function ChecklistsPage() {
  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: '签约前检查模板',
            url: 'https://zenoaihome.com/checklists',
            description: '围绕装修签约前报价、合同、水电、老房翻新和付款节点整理的检查模板。',
            inLanguage: 'zh-CN',
            hasPart: checklistTemplates.map((template) => ({
              '@type': 'HowTo',
              name: template.title,
              description: template.subtitle,
              url: `https://zenoaihome.com/checklists/${template.slug}`,
              step: template.sections.flatMap((section) =>
                section.items.map((item) => ({
                  '@type': 'HowToStep',
                  name: item.check,
                  text: item.why,
                })),
              ),
            })),
          },
        ]}
      />

      <PageHero
        label="签约前检查模板"
        title="签约前检查模板"
        subtitle="不是泛泛的装修资料，而是你拿到报价、合同和付款节点后，可以逐项对照的检查清单。"
        size="content"
      />

      <Container size="content" className="pt-8">
        <div className="flex flex-wrap gap-3">
          <CTA href="/tools/quote-check" label="我先做报价初筛" variant="primary" />
          <CTA href="/risk-dictionary" label="查看风险词典" variant="secondary" />
        </div>
      </Container>

      <Container size="layout" className="py-section">
        <section className="mb-12 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">怎么用</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">先选你现在最卡的那一张清单。</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
            如果你刚拿到报价，先看报价单初查；已经临近签约，就看合同和付款节点；
            如果是水电多、老房翻新，就优先看对应模板。每张模板都可以照着问，也可以复制成自己的追问清单。
          </p>
        </section>

        <section>
          <div className="mb-6 border-l-2 border-stone/40 pl-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">5 个检查模板</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">不做资料堆，只保留签约前最常用的检查入口。</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {checklistTemplates.map((template) => (
              <article key={template.id} className="border border-border bg-surface p-5">
                <h2 className="text-base font-semibold text-ink">{template.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{template.subtitle}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {template.suitableFor.slice(0, 2).map((item) => (
                    <span key={item} className="bg-stone-pale px-2 py-1 text-xs font-medium text-stone">
                      {item}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/checklists/${template.slug}`}
                  className="mt-5 inline-flex text-sm font-semibold text-stone underline-offset-4 hover:underline"
                >
                  查看模板
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">临近签约时</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">模板适合自查，不适合替你做最终判断。</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
            如果你已经临近签约，不建议只靠模板自己判断。可以先做免费报价初筛；
            如果报价、合同和付款节点一起看不清，再把报价和合同一起做人工快审。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <CTA href="/tools/quote-check" label="先做免费报价初筛" variant="primary" />
            <CTA href="/services/renovation#baojia-shenhe" label="看人工报价快审" variant="secondary" />
          </div>
        </section>
      </Container>
    </>
  )
}
