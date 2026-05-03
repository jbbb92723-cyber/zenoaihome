import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import SectionHeader from '@/components/SectionHeader'
import { getDictionary } from '@/lib/i18n'
import { getRecentLocalizedArticles } from '@/lib/i18n'
import ArticleCardEn from './ArticleCardEn'

export const metadata: Metadata = {
  title: 'Zeno — Building a One-Person Business from Real-World Experience',
  description:
    "16 years in home renovation. Now using AI, content systems, and digital products to turn hard-earned expertise into a sustainable solo business. Writing about what actually works.",
  openGraph: {
    type: 'website',
    locale: 'en',
    url: 'https://zenoaihome.com/en',
    siteName: 'Zeno',
    title: 'Zeno — Building a One-Person Business from Real-World Experience',
    description: 'From renovation sites to a one-person business — on AI, products, judgment, and long-term thinking.',
  },
  alternates: {
    canonical: 'https://zenoaihome.com/en',
    languages: { 'zh-CN': 'https://zenoaihome.com', en: 'https://zenoaihome.com/en' },
  },
}

export default function EnHomePage() {
  const t = getDictionary('en')
  const recentArticles = getRecentLocalizedArticles('en', 3)

  return (
    <>
      {/* ───── Hero ───── */}
      <section className="py-14 sm:py-20 border-b border-border">
        <Container size="content">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-12">
            <div className="flex-1 max-w-xl">
              <p className="text-[0.7rem] font-semibold tracking-[0.1em] uppercase text-stone mb-5">Zeno</p>
              <h1 className="text-[1.625rem] sm:text-[1.875rem] md:text-[2.25rem] font-semibold leading-[1.3] tracking-[-0.02em] text-ink mb-5">
                Turning real-world expertise<br />
                into a sustainable one-person business.
              </h1>
              <p className="text-[0.9375rem] text-ink-muted leading-[1.85] mb-3">
                I spent 16 years on renovation sites — managing projects, reviewing quotes, and solving real problems for real families. Now I&apos;m building something different: using AI, content systems, and digital products to turn that experience into reusable assets.
              </p>
              <p className="text-sm text-ink-muted/80 leading-relaxed mb-8">
                This site is where I share what I&apos;m learning — about building with less, thinking long-term, and making clearer decisions in complex environments.
              </p>
              <div className="flex flex-wrap gap-3 items-center">
                <Link href="/en/blog" className="text-sm font-medium text-paper bg-stone px-5 py-2.5 hover:bg-stone/85 transition-colors">
                  Read the blog
                </Link>
                <Link href="/en/resources" className="text-sm font-medium text-stone border border-stone/40 px-5 py-2.5 hover:bg-stone-pale transition-colors">
                  Free tools & resources
                </Link>
              </div>
            </div>

            {/* Persona card */}
            <div className="shrink-0 w-full md:w-[240px] border border-border bg-surface p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-stone-pale flex items-center justify-center text-stone font-semibold">Z</div>
                <div>
                  <p className="text-sm font-semibold text-ink">Zeno</p>
                  <p className="text-xs text-ink-muted">Builder & Writer</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-surface-warm px-3 py-2">
                  <p className="text-lg font-semibold text-stone">16</p>
                  <p className="text-[0.6rem] text-ink-muted">years in industry</p>
                </div>
                <div className="bg-surface-warm px-3 py-2">
                  <p className="text-lg font-semibold text-stone">AI</p>
                  <p className="text-[0.6rem] text-ink-muted">powered workflow</p>
                </div>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                Based in China. Writing about building a solo business from traditional industry experience.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ───── What I Write About (Bento) ───── */}
      <section className="py-16 sm:py-20 border-b border-border">
        <Container>
          <SectionHeader
            label="What I write about"
            title="Five threads, all grounded in real experience"
            subtitle="Not theory. Not hot takes. Each thread comes from years of hands-on work."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Featured area */}
            <Link href="/en/topics#ai-upgrade" className="group sm:col-span-2 border border-stone/30 bg-stone/5 p-7 card-hover flex flex-col">
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-3">Core theme</p>
              <h3 className="text-lg font-semibold text-ink mb-3 group-hover:text-stone transition-colors">AI for Traditional Industries</h3>
              <p className="text-sm text-ink-muted leading-relaxed flex-1 max-w-lg">How someone from a hands-on industry uses AI to build content systems, automate workflows, and create digital products — without pretending to be a tech founder.</p>
              <span className="text-xs text-stone mt-4 group-hover:underline underline-offset-2">Explore this thread →</span>
            </Link>

            <Link href="/en/topics#living-renovation" className="group border border-border bg-surface p-6 card-hover flex flex-col">
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-3">Livable Design</p>
              <h3 className="card-title mb-3 group-hover:text-stone transition-colors">Renovation as a Thinking Framework</h3>
              <p className="text-sm text-ink-muted leading-relaxed flex-1">Budgets, quotes, materials — and the judgment calls that matter when you live in the result.</p>
              <span className="text-xs text-stone mt-4 group-hover:underline underline-offset-2">Read more →</span>
            </Link>

            <Link href="/en/resources" className="group border border-border bg-surface p-6 card-hover flex flex-col">
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-3">Tools & Products</p>
              <h3 className="card-title mb-3 group-hover:text-stone transition-colors">Experience Turned into Assets</h3>
              <p className="text-sm text-ink-muted leading-relaxed flex-1">Templates, checklists, prompt packs, and digital tools — packaged from real workflow.</p>
              <span className="text-xs text-stone mt-4 group-hover:underline underline-offset-2">Browse resources →</span>
            </Link>

            <Link href="/en/blog" className="group sm:col-span-2 border border-border bg-surface-warm p-6 card-hover flex flex-col">
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-3">One-Person Business</p>
              <h3 className="card-title mb-3 group-hover:text-stone transition-colors">Building Lighter, Freer, Smarter</h3>
              <p className="text-sm text-ink-muted leading-relaxed flex-1 max-w-lg">Documenting how a traditional-industry professional builds a sustainable solo business with AI, content, and automation.</p>
              <span className="text-xs text-stone mt-4 group-hover:underline underline-offset-2">Follow the journey →</span>
            </Link>
          </div>
        </Container>
      </section>

      {/* ───── Recent Articles ───── */}
      <section className="py-16 sm:py-20 border-b border-border">
        <Container size="content">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="page-label mb-3">Recent writing</p>
              <h2 className="section-heading">Selected for substance, not traffic</h2>
            </div>
            <Link href="/en/blog" className="text-sm text-stone hover:underline underline-offset-2 shrink-0 ml-4 pb-1">
              All articles →
            </Link>
          </div>
          <div>
            {recentArticles.map((article) => (
              <ArticleCardEn key={article.id} article={article} />
            ))}
          </div>
        </Container>
      </section>

      {/* ───── About & CTA ───── */}
      <section className="py-16 sm:py-20">
        <Container size="content">
          <div className="border border-border bg-surface p-7 sm:p-9">
            <p className="page-label mb-4">About this site</p>
            <p className="text-base text-ink leading-relaxed mb-4">
              This isn&apos;t a typical blog or portfolio. It&apos;s a long-term experiment: can someone from a traditional industry build a sustainable, independent business using AI, content, and digital products?
            </p>
            <p className="text-sm text-ink-muted leading-relaxed mb-6">
              I share the real process — what works, what doesn&apos;t, and the judgment calls in between. No hype, no shortcuts.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/en/about" className="text-sm text-stone hover:underline underline-offset-2">
                More about me →
              </Link>
              <Link href="/en/services" className="text-sm text-ink-muted hover:text-stone transition-colors">
                Work with me
              </Link>
              <Link href="/en/notes" className="text-sm text-ink-muted hover:text-stone transition-colors">
                Read my notes →
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
