import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Quote Risk Check | ZenoAIHome',
  description:
    'English overview of ZenoAIHome quote risk tools: quote risk check, risk language, pre-signing checklists, and project risk library.',
  alternates: {
    canonical: 'https://zenoaihome.com/en/tools',
    languages: { 'zh-CN': 'https://zenoaihome.com/tools/quote-check', en: 'https://zenoaihome.com/en/tools' },
  },
}

const riskLanguage = [
  ['Actual settlement', 'An open-ended pricing term that can turn site uncertainty into later add-on costs.'],
  ['Same-grade substitute', 'A vague material replacement phrase unless brand, model, specification, and approval rules are written down.'],
  ['Subject to site conditions', 'Often reasonable in construction, but dangerous when no process, upper limit, or written confirmation is defined.'],
  ['Payment milestone', 'A payment schedule should follow verified progress, not move too much money ahead of completed work.'],
]

const checklists = [
  'Initial quote check',
  'Contract before signing',
  'Water and electrical work',
  'Older-home renovation',
  'Payment milestones',
]

const projectRisks = [
  'Demolition',
  'Waste removal',
  'Water and electrical work',
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
            A first pass before you sign, not a generic renovation calculator.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-ink-muted">
            The Chinese tool lets homeowners check whether a renovation quote clearly states scope, materials, quantities, change-order rules, acceptance standards, warranty scope, and payment milestones.
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
            <h2 className="text-2xl font-semibold tracking-tight text-ink">Terms that should slow you down before signing.</h2>
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
            <h2 className="text-2xl font-semibold tracking-tight text-ink">Practical questions, not downloadable clutter.</h2>
            <p className="mt-4 text-sm leading-7 text-ink-muted">
              Each checklist is designed to help a homeowner ask clearer questions and move important promises into the quote or contract.
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
          <h2 className="text-2xl font-semibold tracking-tight text-ink">Every construction item has quote boundaries.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-ink-muted">
            The project library is built for long-tail quote questions such as “What should waterproofing include?” or “How should water and electrical work be priced?” It always comes back to pre-signing quote clarity, not construction tutorials.
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
