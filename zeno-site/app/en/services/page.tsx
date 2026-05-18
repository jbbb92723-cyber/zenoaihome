import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Expert Quote Review | ZenoAIHome',
  description:
    'English overview of ZenoAIHome expert review options: RMB 99 entry review, RMB 299 standard quote review, and RMB 699 pre-signing review for quote, contract, and payment milestones.',
  alternates: {
    canonical: 'https://zenoaihome.com/en/services',
    languages: {
      'zh-CN': 'https://zenoaihome.com/services/renovation',
      en: 'https://zenoaihome.com/en/services',
    },
  },
}

const services = [
  {
    price: 'RMB 99',
    title: 'Entry Quote Risk Review',
    bestFor: 'You only want to know whether a few important quote lines contain obvious risks.',
    includes: 'Checks up to 10 key quote lines, highlights 3 high-risk points, and gives 5 pre-signing questions.',
    boundary: 'Not a full quote review. No negotiation, no promise that a contractor is reliable.',
  },
  {
    price: 'RMB 299',
    title: 'Standard Quote Risk Review',
    bestFor: 'You already have a complete quote and are preparing to keep negotiating or sign soon.',
    includes: 'Quote risk notes, missing scope items, unclear wording, add-on cost openings, and a pre-signing question list.',
    boundary: 'No negotiation on your behalf, no lowest-price promise, no final signing decision made for you.',
  },
  {
    price: 'RMB 699',
    title: 'Deep Pre-Signing Review',
    bestFor: 'You are close to signing and already have a quote, draft contract, and payment schedule.',
    includes: 'Quote risk report, contract/payment milestone reminders, question sequence, and a 30-minute WeChat voice explanation.',
    boundary: 'Not legal contract review. No signing on your behalf. No direct communication with the contractor for you.',
  },
]

const faqs = [
  ['Can I buy this without a quote?', 'No. If you do not yet have a quote, start with the free quote risk check and checklists. Expert review works only when there is concrete material to read.'],
  ['Is this a legal contract review?', 'No. The review focuses on renovation quote scope, payment milestones, and practical risk questions before signing. For legal advice, consult a qualified lawyer.'],
  ['Will you negotiate the price for me?', 'No. The output helps you ask clearer questions and request written clarification. It does not replace negotiation or your final decision.'],
  ['Can English-speaking users use the service?', 'The current service is primarily designed for Chinese renovation quotes. English summaries are available, but the source material is usually Chinese.'],
]

export default function EnServicesPage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'ZenoAIHome Expert Quote Review',
          url: 'https://zenoaihome.com/en/services',
          description: metadata.description,
          inLanguage: 'en',
          areaServed: 'China',
        }}
      />

      <section className="border-b border-border bg-surface-warm py-12 sm:py-16">
        <Container size="content">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone">Expert Review</p>
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            If you already have a renovation quote, choose the review level by how close you are to signing.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-ink-muted">
            Do not buy expert review too early. If you do not yet have a complete quote, use the free quote risk check and checklists first. Human review is most useful when real quote, contract, and payment materials are already in hand.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/tools/quote-check" className="bg-stone px-5 py-3 text-sm font-semibold text-white hover:bg-stone/90">
              Start with the Chinese free check
            </Link>
            <Link href="/services/renovation" className="border border-border px-5 py-3 text-sm font-semibold text-ink hover:border-stone">
              Open Chinese service page
            </Link>
          </div>
        </Container>
      </section>

      <Container size="layout" className="py-14 sm:py-16">
        <section className="mb-14">
          <div className="mb-6 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone">Pricing Path</p>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">Free check first. Paid review only when the materials are ready.</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service.title} className="flex flex-col border border-border bg-surface p-6">
                <p className="text-sm font-semibold text-stone">{service.price}</p>
                <h3 className="mt-3 text-lg font-semibold leading-snug text-ink">{service.title}</h3>
                <div className="mt-5 space-y-4 text-sm leading-7 text-ink-muted">
                  <p><span className="font-semibold text-ink">Best for: </span>{service.bestFor}</p>
                  <p><span className="font-semibold text-ink">Includes: </span>{service.includes}</p>
                  <p><span className="font-semibold text-ink">Boundary: </span>{service.boundary}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-14 grid gap-8 lg:grid-cols-[0.4fr_0.6fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone">Prepare Before Review</p>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">The review is only as useful as the material you provide.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              'Renovation quote: Excel, PDF, screenshot, or text',
              'City, home size, and renovation method',
              'Whether you are preparing to sign',
              'Draft contract or payment milestone screenshot',
              'The one issue you are most worried about',
            ].map((item) => (
              <div key={item} className="border border-border bg-surface px-4 py-3 text-sm text-ink-muted">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="border border-border bg-surface-warm p-6 sm:p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone">FAQ</p>
          <div className="grid gap-5 md:grid-cols-2">
            {faqs.map(([question, answer]) => (
              <div key={question}>
                <h3 className="text-sm font-semibold text-ink">{question}</h3>
                <p className="mt-2 text-sm leading-7 text-ink-muted">{answer}</p>
              </div>
            ))}
          </div>
        </section>
      </Container>
    </>
  )
}
