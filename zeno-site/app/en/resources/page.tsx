import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import PageHero from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Resource Library — Zeno',
  description:
    "Not a download center, but Zeno's first batch of productized experience. Free tools, free templates, low-priced products, and direct services — laid out in a usage-first order.",
  alternates: {
    canonical: 'https://zenoaihome.com/en/resources',
    languages: {
      'zh-CN': 'https://zenoaihome.com/resources',
      en: 'https://zenoaihome.com/en/resources',
    },
  },
}

const freeTools = [
  {
    title: 'AI Prompt Playground',
    desc: 'Pick a scenario, fill in your context, get a usable prompt. Covers writing, renovation comms, quote analysis, topic ideation, and AI upskilling.',
    href: '/en/tools',
    ready: true,
  },
  {
    title: 'Markdown to WeChat Formatter',
    desc: 'Convert Markdown drafts into ready-to-paste WeChat public-account HTML in one click.',
    href: '/en/tools',
    ready: true,
  },
  {
    title: 'Renovation Budget Risk Self-Check',
    desc: 'Answer a few questions, quickly judge whether your budget has overspending risk.',
    ready: false,
  },
  {
    title: 'Quotation Risk Self-Check',
    desc: 'Walk through your renovation quote against a checklist to spot vague or missing items.',
    ready: false,
  },
]

const freeResources = [
  {
    title: 'Renovation Budget Template',
    desc: 'A structured spreadsheet to plan and track your renovation budget with realistic contingency buffers.',
  },
  {
    title: 'Quotation Review Checklist',
    desc: 'Key items to verify before signing any contractor quote — unit prices, scope, hidden fees, and payment terms.',
  },
  {
    title: 'Final Acceptance Checklist',
    desc: 'A step-by-step walkthrough for inspecting finished work before final payment.',
  },
  {
    title: 'Real-Living Renovation Self-Check',
    desc: 'Questions to clarify what you actually need before designers or reference photos pull you in another direction.',
  },
  {
    title: 'AI Content Workflow Prompt Pack',
    desc: 'A starter set of prompts for topic ideation, structure, polish, and review — designed to keep your voice intact.',
  },
]

const lowTierProducts = [
  {
    title: 'Renovation Quote Pitfall Guide',
    desc: 'A line-by-line PDF reviewed against six core checklists: missing items, vague descriptions, add-on traps, contract clauses, and electrical/plumbing pricing.',
    price: '¥39',
    href: '/en/pricing/baojia-guide',
    ready: true,
  },
  {
    title: 'AI Content Workflow Prompt Pack Pro',
    desc: 'A complete prompt system for topic ideation, writing, formatting, and multi-platform distribution.',
    ready: false,
  },
  {
    title: 'AI Content System Template for Traditional Industries',
    desc: 'Helps practitioners in traditional industries build their own content production systems from zero.',
    ready: false,
  },
  {
    title: 'One-Person Company Starter Checklist',
    desc: 'From positioning to content, tools, services, and monetization — a complete launch checklist for a one-person business.',
    ready: false,
  },
]

const serviceEntries = [
  {
    title: 'Renovation Quote Diagnosis',
    desc: 'Got a contractor quote and not sure where the risks are? I review it line by line before you sign.',
  },
  {
    title: 'AI Workflow Consulting',
    desc: 'A practical AI integration path designed for your specific industry context — not generic advice.',
  },
  {
    title: 'Personal Site / Content System Consulting',
    desc: 'Help you turn scattered content into your own platform, building a sustainable content asset from scratch.',
  },
]

export default function EnResourcesPage() {
  return (
    <>
      <PageHero
        label="Resource Library"
        title="A Productized Library, Not a Download Center"
        subtitle="Free tools, free templates, low-priced products, and direct services — laid out in the order you'd actually use them."
      />

      <Container size="content" className="py-12 sm:py-16 space-y-16">

        {/* Path note */}
        <div className="border-l-2 border-stone-light pl-4">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">Suggested order</p>
          <p className="text-sm text-ink-muted leading-relaxed">
            Free tools / templates → low-priced digital products → one-on-one service.
            Use the free ones first to build judgment, then decide whether you need deeper help.
          </p>
        </div>

        {/* Free tools */}
        <section>
          <header className="mb-6">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">Tier 1</p>
            <h2 className="text-lg font-semibold text-ink">Free Tools</h2>
            <p className="text-sm text-ink-muted mt-1">Open and use immediately. No login required.</p>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {freeTools.map((t) =>
              t.ready ? (
                <Link
                  key={t.title}
                  href={t.href!}
                  className="group border border-stone/30 bg-stone/5 p-5 hover:bg-stone/10 transition-colors"
                >
                  <p className="text-sm font-semibold text-ink group-hover:text-stone transition-colors">{t.title}</p>
                  <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">{t.desc}</p>
                </Link>
              ) : (
                <div key={t.title} className="border border-border bg-surface p-5 opacity-75">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <p className="text-sm font-semibold text-ink">{t.title}</p>
                    <span className="text-[0.65rem] text-stone border border-stone/30 px-2 py-0.5 uppercase tracking-wider">Coming soon</span>
                  </div>
                  <p className="text-xs text-ink-muted leading-relaxed">{t.desc}</p>
                </div>
              )
            )}
          </div>
        </section>

        {/* Free resources */}
        <section>
          <header className="mb-6">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">Tier 2</p>
            <h2 className="text-lg font-semibold text-ink">Free Resources</h2>
            <p className="text-sm text-ink-muted mt-1">Working documents from real projects. Most are still being translated from Chinese.</p>
          </header>
          <div className="grid gap-4 sm:grid-cols-2">
            {freeResources.map((r) => (
              <div key={r.title} className="border border-border p-5 hover:border-stone/40 transition-colors">
                <p className="text-sm font-semibold text-ink mb-1.5">{r.title}</p>
                <p className="text-xs text-ink-muted leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 px-5 py-4 border border-border bg-surface-warm text-sm text-ink-muted leading-relaxed">
            English versions are being translated. The Chinese resource library is fully available.
          </div>
        </section>

        {/* Low-tier products */}
        <section>
          <header className="mb-6">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">Tier 3</p>
            <h2 className="text-lg font-semibold text-ink">Low-Priced Products｜Coming Soon</h2>
            <p className="text-sm text-ink-muted mt-1">Deeper experience packaged into directly usable toolkits.</p>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lowTierProducts.map((p) =>
              p.ready ? (
                <Link
                  key={p.title}
                  href={p.href!}
                  className="group border border-stone/30 bg-stone/5 p-5 hover:bg-stone/10 transition-colors block"
                >
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <p className="text-sm font-semibold text-ink group-hover:text-stone transition-colors">{p.title}</p>
                    <span className="text-[0.65rem] text-stone border border-stone/30 px-2 py-0.5 uppercase tracking-wider">Preview</span>
                  </div>
                  <p className="text-xs text-ink-muted leading-relaxed mb-2">{p.desc}</p>
                  {p.price && <p className="text-xs text-stone font-medium">{p.price}</p>}
                </Link>
              ) : (
                <div key={p.title} className="border border-border bg-surface p-5 opacity-75 block">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <p className="text-sm font-semibold text-ink">{p.title}</p>
                    <span className="text-[0.65rem] text-stone border border-stone/30 px-2 py-0.5 uppercase tracking-wider">Coming soon</span>
                  </div>
                  <p className="text-xs text-ink-muted leading-relaxed">{p.desc}</p>
                </div>
              )
            )}
          </div>
        </section>

        {/* Services entry */}
        <section>
          <header className="mb-6">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">Tier 4</p>
            <h2 className="text-lg font-semibold text-ink">Direct Services</h2>
            <p className="text-sm text-ink-muted mt-1">When tools and templates aren't enough, work with me directly.</p>
          </header>
          <div className="space-y-3">
            {serviceEntries.map((s) => (
              <Link
                key={s.title}
                href="/en/services"
                className="group flex items-start justify-between gap-4 border border-border bg-surface p-5 hover:bg-surface-warm transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-ink group-hover:text-stone transition-colors">{s.title}</p>
                  <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">{s.desc}</p>
                </div>
                <span className="text-stone text-sm shrink-0 mt-0.5">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Bottom links */}
        <div className="pt-8 border-t border-border flex flex-wrap gap-3">
          <Link
            href="/en/services"
            className="text-sm font-medium text-stone border border-stone/40 px-4 py-2 hover:bg-stone-pale transition-colors"
          >
            View services →
          </Link>
          <Link
            href="/resources"
            className="text-sm font-medium text-ink-muted hover:text-stone transition-colors px-4 py-2"
          >
            Chinese resource library →
          </Link>
        </div>

      </Container>
    </>
  )
}
