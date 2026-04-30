import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import PageHero from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Renovation Quote Pitfall Guide — Zeno',
  description:
    'A line-by-line PDF reviewed against six core checklists: missing items, vague descriptions, add-on traps, contract clauses, and electrical/plumbing pricing.',
  alternates: {
    canonical: 'https://zenoaihome.com/en/pricing/baojia-guide',
    languages: {
      'zh-CN': 'https://zenoaihome.com/pricing/baojia-guide',
      en: 'https://zenoaihome.com/en/pricing/baojia-guide',
    },
  },
}

const painPoints = [
  "You got a renovation quote and have no idea where to start reading it",
  "You suspect there are traps but can't pinpoint which line",
  "You've read scattered advice online but have nothing structured to check against",
  "You don't want to pay ¥699 for a one-on-one review, but need a ¥39 actionable checklist",
]

const willGet = [
  'Full PDF guide (~28-32 pages)',
  'Six core checklists (PDF tables + fillable version)',
  'Three common trap types with identification methods + response scripts',
  'Contract key-clause verification checklist',
  'Priority access to Quote Review service (with ¥100 coupon)',
]

const tableOfContents = [
  '01　How to use this guide (30-minute self-check path)',
  "02　Real structure of a renovation quote: what you see vs. what's hidden",
  '03　Quote completeness checklist',
  '04　Missing item risk checklist',
  '05　Vague description identification table',
  '06　Add-on risk tracker',
  '07　Electrical & plumbing quote checklist',
  '08　Contract clause checklist',
  '09　Three common traps + response scripts',
  '10　Still unsure after self-check? (upgrade path)',
]

const checklists = [
  { name: 'Table 1 · Quote Completeness', use: 'Are all expected items listed?' },
  { name: 'Table 2 · Missing Items', use: "Identify 'should be there but isn\u2019t' items" },
  { name: 'Table 3 · Vague Descriptions', use: 'Flag seemingly detailed but actually vague lines' },
  { name: 'Table 4 · Add-on Risk Tracker', use: 'Collect all "extra charge / TBD / provisional" items' },
  { name: 'Table 5 · Electrical & Plumbing', use: 'Dedicated check for hidden works' },
  { name: 'Table 6 · Contract Clauses', use: 'Final self-check before signing' },
]

const forWho = [
  'Currently collecting renovation quotes or about to sign a contract',
  "Worried about clauses you don't fully understand",
  'Need a practical tool without paying for a full one-on-one review',
  "Not in Nanning \u2014 can't access in-person services right now",
]

const notForWho = [
  'Not planning to review the quote yourself at all',
  'Already mid-renovation and hoping to recover sunk costs',
  'Expecting to "save half the budget" just by reading — this guide helps you see clearly, not bargain',
]

export default function EnBaojiaGuidePage() {
  return (
    <>
      <PageHero
        label="Low-Tier Product｜Coming Soon"
        title="Renovation Quote Pitfall Guide"
        subtitle="After you receive a quote, check it line by line. Six core checklists covering everything you should verify in 30 minutes before signing."
        size="content"
      />

      <Container size="content" className="py-12 sm:py-16 space-y-16">

        {/* Status bar */}
        <div className="flex flex-wrap items-center gap-3 border border-stone/30 bg-stone/5 px-5 py-4">
          <span className="text-[0.65rem] text-stone border border-stone/40 px-2 py-0.5 uppercase tracking-wider">
            Coming soon
          </span>
          <p className="text-sm text-ink-muted">
            Price: ¥39 · Digital product · Buy once, free minor updates
          </p>
        </div>

        {/* Pain points */}
        <section>
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">Pain points</p>
          <h2 className="text-lg font-semibold text-ink mb-5">If you're about to sign a renovation contract</h2>
          <ul className="space-y-2.5">
            {painPoints.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-ink leading-relaxed">
                <span className="text-stone shrink-0 mt-1">·</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* What this solves */}
        <section className="border-t border-border pt-12">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">What this guide does</p>
          <h2 className="text-lg font-semibold text-ink mb-5">Doesn't bargain for you — helps you see clearly</h2>
          <div className="space-y-4 text-sm text-ink leading-[1.85]">
            <p>
              This isn't a course or an article collection. It's a practical PDF you can check against your renovation quote line by line.
            </p>
            <p className="text-ink-muted">
              Articles are for understanding. This guide is for checking side-by-side. Every table includes risk-level criteria, and response scripts tell you exactly how to question the contractor — all arranged in the real order from "receiving a quote" to "signing the contract".
            </p>
          </div>
        </section>

        {/* What you get */}
        <section className="border-t border-border pt-12">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">What you get</p>
          <h2 className="text-lg font-semibold text-ink mb-5">Full deliverables</h2>
          <ul className="space-y-2.5">
            {willGet.map((g) => (
              <li key={g} className="flex items-start gap-3 text-sm text-ink leading-relaxed">
                <span className="text-stone shrink-0">✓</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Table of contents */}
        <section className="border-t border-border pt-12">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">Table of contents</p>
          <h2 className="text-lg font-semibold text-ink mb-5">10 chapters, ~28-32 pages</h2>
          <ol className="space-y-2 border border-border p-6 bg-surface-warm/40">
            {tableOfContents.map((t) => (
              <li key={t} className="text-sm text-ink leading-relaxed font-mono tracking-tight">
                {t}
              </li>
            ))}
          </ol>
        </section>

        {/* Checklists */}
        <section className="border-t border-border pt-12">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">Core checklists</p>
          <h2 className="text-lg font-semibold text-ink mb-5">Six tables you can check against directly</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {checklists.map((c) => (
              <div key={c.name} className="border border-border bg-surface p-5">
                <p className="text-sm font-semibold text-ink leading-snug">{c.name}</p>
                <p className="text-xs text-ink-muted mt-2 leading-relaxed">{c.use}</p>
              </div>
            ))}
          </div>
        </section>

        {/* For who / not for who */}
        <section className="border-t border-border pt-12">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">Who is this for</p>
          <h2 className="text-lg font-semibold text-ink mb-5">Make sure it's what you need</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-stone font-semibold uppercase tracking-widest mb-3">Good fit</p>
              <ul className="space-y-2">
                {forWho.map((w) => (
                  <li key={w} className="flex items-start gap-2 text-sm text-ink leading-relaxed">
                    <span className="text-stone shrink-0">+</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">Not a fit</p>
              <ul className="space-y-2">
                {notForWho.map((w) => (
                  <li key={w} className="flex items-start gap-2 text-sm text-ink-muted leading-relaxed">
                    <span className="text-ink-faint shrink-0">−</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Coming soon CTA */}
        <section className="border border-stone/30 bg-stone/5 p-7 sm:p-9">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-stone mb-3">Coming soon</p>
          <h2 className="text-lg font-semibold text-ink mb-3">Priced at ¥39, expected to launch in May 2026</h2>
          <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-prose">
            If you already have a quote and can't wait, grab the free Quote Review Checklist for a quick self-check;
            or go straight to the Quote Diagnosis Service (guide purchase includes a ¥100 discount coupon).
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/en/resources"
              className="inline-flex items-center text-sm font-medium bg-stone text-white px-4 py-2 hover:bg-stone/85 transition-colors"
            >
              Get free checklist first →
            </Link>
            <Link
              href="/en/services"
              className="inline-flex items-center text-sm font-medium text-stone border border-stone/40 px-4 py-2 hover:bg-stone-pale transition-colors"
            >
              View Quote Diagnosis Service →
            </Link>
          </div>
        </section>

        {/* After-sales */}
        <section className="border-t border-border pt-8 text-xs text-ink-muted leading-relaxed space-y-1.5">
          <p>· Priced at ¥39, digital product, no refunds after purchase</p>
          <p>· Buy once, free minor version updates</p>
          <p>· Includes ¥100 coupon for Quote Diagnosis Service</p>
          <p>· Add Zeno on WeChat after purchase for updates + Q&A</p>
          <p>· Personal use license, no redistribution</p>
        </section>

      </Container>
    </>
  )
}
