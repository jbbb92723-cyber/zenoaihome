import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import StructuredData from '@/components/StructuredData'
import ArticleCardEn from './ArticleCardEn'
import { getRecentLocalizedArticles } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'ZenoAIHome — Pre-Signing Renovation Quote Risk Check',
  description:
    'A selective English edition of ZenoAIHome. Before you sign a renovation contract, understand what the quote does not clearly say: missing scope, change orders, payment milestones, and verbal promises.',
  openGraph: {
    type: 'website',
    locale: 'en',
    url: 'https://zenoaihome.com/en',
    siteName: 'ZenoAIHome',
    title: 'ZenoAIHome — Pre-Signing Renovation Quote Risk Check',
    description:
      'Clarify renovation quote scope before signing. Built from 16 years of real renovation experience in China.',
  },
  alternates: {
    canonical: 'https://zenoaihome.com/en',
    languages: { 'zh-CN': 'https://zenoaihome.com', en: 'https://zenoaihome.com/en' },
  },
}

const riskSignals = [
  'Missing scope items',
  'Open-ended change orders',
  'Unclear material models',
  'Loose payment milestones',
]

const assets = [
  {
    title: 'Quote Risk Check',
    body: 'A lightweight first pass for homeowners who already have a renovation quote and need to know what to ask before signing.',
    href: '/en/tools',
  },
  {
    title: 'Risk Dictionary',
    body: 'English summaries of the core risk language behind terms such as actual settlement, temporary estimates, same-grade substitution, and site conditions.',
    href: '/en/tools#risk-language',
  },
  {
    title: 'Checklists',
    body: 'Practical pre-signing questions for quotes, contracts, payment milestones, water and electrical work, and older-home renovation.',
    href: '/en/tools#checklists',
  },
  {
    title: 'Expert Review',
    body: 'When the quote, draft contract, and payment schedule are already in hand, a human review helps you decide what still needs to be clarified.',
    href: '/en/services',
  },
]

export default function EnHomePage() {
  const recentArticles = getRecentLocalizedArticles('en', 3)

  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'ZenoAIHome',
          url: 'https://zenoaihome.com/en',
          description: metadata.description,
          inLanguage: 'en',
        }}
      />

      <section className="border-b border-border bg-surface-warm py-14 sm:py-20">
        <Container size="content">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-stone">
                Selective English Edition
              </p>
              <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
                Before you sign a renovation contract, understand what the quote does not clearly say.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-ink-muted">
                ZenoAIHome helps homeowners check renovation quotes before signing. The goal is not to chase the lowest price, but to clarify scope, materials, change orders, payment milestones, and verbal promises before they become disputes.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/en/tools" className="bg-stone px-5 py-3 text-sm font-semibold text-white hover:bg-stone/90">
                  Start with the quote risk check
                </Link>
                <Link href="/en/services" className="border border-border px-5 py-3 text-sm font-semibold text-ink hover:border-stone">
                  See expert review options
                </Link>
              </div>
            </div>

            <div className="border border-border bg-surface p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone">What this site checks first</p>
              <div className="mt-5 grid gap-3">
                {riskSignals.map((item) => (
                  <div key={item} className="border border-border bg-canvas px-4 py-3 text-sm font-semibold text-ink">
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-7 text-ink-muted">
                Built from 16 years of renovation-site experience. AI can help organize information, but the core value is human judgment and clear scope before signing.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <Container size="layout">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone">Judgment Assets</p>
            <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Not a renovation encyclopedia. A pre-signing judgment system.
            </h2>
            <p className="mt-4 text-sm leading-7 text-ink-muted">
              The Chinese site contains the full toolset and data library. This English edition explains the system clearly for international readers and future bilingual expansion.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {assets.map((asset) => (
              <Link key={asset.title} href={asset.href} className="border border-border bg-surface p-6 transition-colors hover:border-stone hover:bg-surface-warm">
                <h3 className="text-lg font-semibold text-ink">{asset.title}</h3>
                <p className="mt-3 text-sm leading-7 text-ink-muted">{asset.body}</p>
                <p className="mt-5 text-xs font-semibold text-stone">Open →</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container size="content">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone">Selected Writing</p>
              <h2 className="text-2xl font-semibold tracking-tight text-ink">Context behind the judgment</h2>
            </div>
            <Link href="/en/blog" className="shrink-0 text-sm font-semibold text-stone hover:underline underline-offset-4">
              All English writing →
            </Link>
          </div>
          <div>
            {recentArticles.map((article) => (
              <ArticleCardEn key={article.id} article={article} />
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
