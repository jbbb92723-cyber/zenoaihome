import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import PageHero from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Services — Zeno',
  description:
    "What I sell isn't renovation services — it's clearer judgment. Renovation, AI, and content systems are three surfaces of the same underlying work: helping you make sharper decisions in noisy environments.",
  alternates: {
    canonical: 'https://zenoaihome.com/en/services',
    languages: {
      'zh-CN': 'https://zenoaihome.com/services',
      en: 'https://zenoaihome.com/en/services',
    },
  },
}

const lightConsulting = [
  {
    title: 'Renovation Quote Review',
    desc: 'A line-by-line review of your renovation quote to identify hidden risks, inflated items, and missing contingencies before you sign.',
    price: '¥699 / quote',
  },
  {
    title: 'Renovation Budget Consulting',
    desc: 'Build a structured budget framework before you start. Clarify what to prioritize, where to leave flexibility, and where the typical overruns hide.',
    price: '¥399 / session',
  },
  {
    title: 'AI + Content System Consulting',
    desc: 'A practical AI integration path designed for your specific industry context — covering workflow design and prompt frameworks tailored to your scenario.',
    price: '¥1,999 / session',
  },
]

const deepService = [
  {
    title: 'Real-Living Renovation Service',
    desc: 'Designed from how a family actually lives — not from reference photos. Limited to projects in Nanning, China. I take only projects I think are a fit.',
    price: 'From ¥9,800',
  },
]

const partnerships = [
  'Content system buildouts for traditional industries',
  'AI workflow consulting for small teams / companies',
  'Personal website + brand system co-build',
  'Co-creation on content and digital products',
]

export default function EnServicesPage() {
  return (
    <>
      <PageHero
        label="Services"
        title="Three Surfaces, One Underlying Work"
        subtitle="What I sell isn't renovation services — it's clearer judgment. Renovation, AI, and content systems are three surfaces of the same underlying work."
      />

      <Container size="content" className="py-12 sm:py-16 space-y-16">

        <div className="border-l-2 border-stone-light pl-4">
          <p className="text-sm text-ink-muted leading-relaxed">
            Light consulting is remote and quick. Deep service is limited and on the ground.
            Partnerships are open conversations — reach out if there's a real fit.
          </p>
        </div>

        {/* Light consulting */}
        <section>
          <header className="mb-6">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">Light Consulting</p>
            <h2 className="text-lg font-semibold text-ink">Remote, fast, one specific problem at a time</h2>
          </header>
          <div className="space-y-4">
            {lightConsulting.map((s) => (
              <div key={s.title} className="border border-border p-5 hover:border-stone/40 transition-colors">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                  <p className="text-sm font-semibold text-ink">{s.title}</p>
                  <p className="text-xs text-stone font-medium">{s.price}</p>
                </div>
                <p className="text-sm text-ink-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Deep service */}
        <section>
          <header className="mb-6">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">Deep Service</p>
            <h2 className="text-lg font-semibold text-ink">Limited capacity, on-the-ground</h2>
          </header>
          <div className="space-y-4">
            {deepService.map((s) => (
              <div key={s.title} className="border border-border p-5 hover:border-stone/40 transition-colors">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                  <p className="text-sm font-semibold text-ink">{s.title}</p>
                  <p className="text-xs text-stone font-medium">{s.price}</p>
                </div>
                <p className="text-sm text-ink-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Partnerships */}
        <section>
          <header className="mb-6">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">Partnerships</p>
            <h2 className="text-lg font-semibold text-ink">Open directions I'm exploring</h2>
            <p className="text-sm text-ink-muted mt-1">If you have a matching need, let's talk.</p>
          </header>
          <ul className="space-y-2.5">
            {partnerships.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-ink leading-relaxed">
                <span className="text-stone shrink-0 mt-1">·</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <div className="pt-8 border-t border-border flex flex-wrap gap-3">
          <Link
            href="mailto:zenoaihome@qq.com"
            className="text-sm font-medium text-paper bg-stone px-5 py-2.5 hover:bg-stone/85 transition-colors"
          >
            Contact Zeno
          </Link>
          <Link
            href="/services"
            className="text-sm font-medium text-stone border border-stone/30 px-5 py-2.5 hover:bg-stone-pale/50 transition-colors"
          >
            View Chinese version →
          </Link>
        </div>
      </Container>
    </>
  )
}
