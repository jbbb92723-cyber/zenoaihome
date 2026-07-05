import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import StructuredData from '@/components/ui/StructuredData'
import ArticleCardEn from './ArticleCardEn'
import { getRecentLocalizedArticles } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'ZenoAIHome | Think Before You Sign',
  description:
    '17 years in renovation and mattresses. I help you figure out what you actually need — before the quote, before the contract, before the regret.',
  openGraph: {
    type: 'website',
    locale: 'en',
    url: 'https://zenoaihome.com/en',
    siteName: 'ZenoAIHome',
    title: 'ZenoAIHome | Think Before You Sign',
    description:
      'Real judgment from 17 years on job sites. Not a renovation company. Not a designer. Just someone who has seen enough to help you see clearly.',
  },
  alternates: {
    canonical: 'https://zenoaihome.com/en',
    languages: { 'zh-CN': 'https://zenoaihome.com', en: 'https://zenoaihome.com/en' },
  },
}

const riskSignals = [
  'Lifestyle goals that never become spatial priorities',
  'Aesthetic choices that fail in daily maintenance',
  'Quote scope that cannot carry the design intent',
  'Contract and payment terms that leave delivery fuzzy',
]

const assets = [
  {
    title: 'Living Diagnosis',
    body: 'Start from how the home will be lived in: family rhythm, storage, chores, solitude, guests, aesthetics, and budget tradeoffs.',
    href: '/en/tools',
  },
  {
    title: 'Risk Dictionary',
    body: 'Plain-English notes on the phrases that sound harmless now and expensive later: actual quantity, provisional estimates, same-grade substitutes, and site-condition clauses.',
    href: '/en/tools#risk-language',
  },
  {
    title: 'Checklists',
    body: 'Questions you can send to a contractor, not vague advice you forget five minutes after reading.',
    href: '/en/tools#checklists',
  },
  {
    title: 'Expert Review',
    body: 'When the plan, quote, draft contract, and payment schedule are already on your desk, a human second look helps you see what is still fuzzy.',
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
                Before you sign, figure out what you actually want.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-ink-muted">
                I've spent 17 years on renovation sites and in mattress showrooms. Most problems I've seen weren't construction mistakes. They were decisions made before anyone asked the right questions. This site is where I help you ask them.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/en/tools" className="bg-stone px-5 py-3 text-sm font-semibold text-white hover:bg-stone/90">
                  Start with the living diagnosis
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
                Built from 17 years on real renovation sites. AI can help organize questions, but the real work is judgment: what life the space should support, what the quote includes, and what must be written down before anyone picks up a hammer.
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
              Not a renovation encyclopedia. More like a decision system for a home that has to be lived in.
            </h2>
            <p className="mt-4 text-sm leading-7 text-ink-muted">
              The Chinese site contains the full toolset and data library. This English edition is intentionally selective: fewer pages, cleaner wording, and no machine-translation fog. It explains the system without pretending every local detail travels perfectly across languages.
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
