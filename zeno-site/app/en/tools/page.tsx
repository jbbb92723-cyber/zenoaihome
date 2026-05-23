import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Quote Risk Tools | ZenoAIHome',
  description:
    'A selective English guide to ZenoAIHome quote risk tools: quote check, risky wording, pre-signing checklists, and project risk library for homeowners in China.',
  alternates: {
    canonical: 'https://zenoaihome.com/en/tools',
    languages: { 'zh-CN': 'https://zenoaihome.com/tools/quote-check', en: 'https://zenoaihome.com/en/tools' },
  },
}

const riskLanguage = [
  ['Billed by actual quantity', 'Reasonable when the scope is truly unknown, dangerous when the unit price, cap, and approval step are missing.'],
  ['Same-grade substitute', 'A gentle phrase that needs hard details: brand, model, specification, and written approval rules.'],
  ['Subject to site conditions', 'Sometimes fair, often too elastic. Ask what counts as a change, who confirms it, and whether there is an upper limit.'],
  ['Payment milestone', 'Money should follow verified progress. If payment runs ahead of leverage, every later correction gets harder.'],
]

const checklists = [
  'Initial quote check',
  'Contract before signing',
  'Plumbing and electrical work',
  'Older-home renovation',
  'Payment milestones',
]

const projectRisks = [
  'Demolition',
  'Waste removal',
  'Plumbing and electrical work',
  'Waterproofing',
  'Floor leveling',
  'Tile installation',
  'Ceilings',
  'Cabinetry',
  'Doors and windows',
  'Finished-product protection',
]

export default function EnToolsPage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Quote Risk Check',
          url: 'https://zenoaihome.com/en/tools',
          description: metadata.description,
          inLanguage: 'en',
        }}
      />

      <section className="border-b border-border bg-surface-warm py-12 sm:py-16">
        <Container size="content">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone">Quote Risk Check</p>
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            A first pass before you sign, not another renovation calculator.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-ink-muted">
            The Chinese tool checks whether a renovation quote clearly states scope, materials, quantities, change-order rules, acceptance standards, warranty scope, and payment milestones. It does not decide whether a contractor is “good.” It tells you what is still too fuzzy to sign comfortably.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/tools/quote-check" className="bg-stone px-5 py-3 text-sm font-semibold text-white hover:bg-stone/90">
              Open the Chinese quote check tool
            </Link>
            <Link href="/en/services" className="border border-border px-5 py-3 text-sm font-semibold text-ink hover:border-stone">
              See expert review options
            </Link>
          </div>
        </Container>
      </section>

      <Container size="layout" className="py-14 sm:py-16">
        <section id="risk-language" className="mb-14">
          <div className="mb-6 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone">Risk Language</p>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">Harmless-looking phrases that deserve a second look.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {riskLanguage.map(([term, meaning]) => (
              <div key={term} className="border border-border bg-surface p-5">
                <h3 className="text-base font-semibold text-ink">{term}</h3>
                <p className="mt-3 text-sm leading-7 text-ink-muted">{meaning}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="checklists" className="mb-14 grid gap-8 lg:grid-cols-[0.42fr_0.58fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone">Checklists</p>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">Questions you can actually ask, not downloadable clutter.</h2>
            <p className="mt-4 text-sm leading-7 text-ink-muted">
              Each checklist is designed to move important promises out of chat and into the quote, contract, or written addendum.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {checklists.map((item) => (
              <div key={item} className="border border-border bg-surface px-4 py-3 text-sm font-semibold text-ink">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section id="project-risks" className="border border-border bg-surface-warm p-6 sm:p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone">Project Risk Library</p>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">Every line item has a boundary.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-ink-muted">
            The project library answers long-tail quote questions such as “What should waterproofing include?” or “How should plumbing and electrical work be priced?” It always comes back to quote clarity before signing, not construction tutorials.
          </p>
          <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {projectRisks.map((item) => (
              <div key={item} className="border border-border bg-surface px-3 py-2 text-xs font-semibold text-ink-muted">
                {item}
              </div>
            ))}
          </div>
        </section>
      </Container>
    </>
  )
}
