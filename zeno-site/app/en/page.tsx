import Link from 'next/link'
import Container from '@/components/Container'

const writingAreas = [
  {
    title: 'Real Living & Renovation',
    desc: 'What renovation really teaches you about decisions, budgets, and living with imperfection.',
  },
  {
    title: 'Aesthetics & Daily Life',
    desc: 'Restraint over decoration. Proportion over trends. How everyday choices shape the way a home feels.',
  },
  {
    title: 'Human Judgment',
    desc: 'Patterns in how people decide — on job sites, in business, and in life.',
  },
  {
    title: 'AI for Traditional Industry',
    desc: 'How practitioners in hands-on industries can genuinely benefit from AI — without hype.',
  },
]

const tools = [
  {
    title: 'Prompt Playground',
    desc: 'A practical prompt utility for creators and traditional industry practitioners.',
    href: '/en/tools',
    status: 'available',
  },
  {
    title: 'Acceptance Checklist',
    desc: 'A field-friendly checklist for on-site review and practical handover.',
    href: '/en/tools',
    status: 'coming',
  },
  {
    title: 'Budget Lite',
    desc: 'A practical budget planning utility for durable home decisions.',
    href: '/en/tools',
    status: 'coming',
  },
]

export default function EnHomePage() {
  return (
    <>
      {/* ───── Hero ───── */}
      <section className="py-12 sm:py-16 border-b border-border">
        <Container size="reading">
          <p className="text-[0.7rem] font-semibold tracking-[0.1em] uppercase text-stone mb-5">
            Zeno
          </p>
          <h1 className="text-[1.625rem] sm:text-[1.875rem] md:text-[2.25rem] font-semibold leading-[1.3] tracking-[-0.02em] text-ink mb-5 max-w-xl">
            From renovation sites to real living, human judgment, and AI-enabled growth.
          </h1>
          <p className="text-[0.9375rem] text-ink-muted leading-[1.85] max-w-lg mb-8">
            I&apos;m Zeno, a renovation practitioner from China. I write about real living,
            aesthetics, durable choices, and how traditional industry people can upgrade
            themselves with AI.
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <Link
              href="/en/tools"
              className="text-sm font-medium text-paper bg-stone px-4 py-2 hover:bg-stone/85 transition-colors"
            >
              Explore tools
            </Link>
            <Link
              href="/en/about"
              className="text-sm font-medium text-stone border border-stone/40 px-4 py-2 hover:bg-stone-pale transition-colors"
            >
              About Zeno
            </Link>
            <Link
              href="/en/articles"
              className="text-sm text-ink-muted hover:text-ink underline underline-offset-4 px-2 py-2 transition-colors"
            >
              Read selected ideas
            </Link>
          </div>
        </Container>
      </section>

      {/* ───── What I write about ───── */}
      <section className="py-14 sm:py-16 border-b border-border">
        <Container size="content">
          <h2 className="text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-ink-faint mb-8">
            What I write about
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {writingAreas.map((area) => (
              <div key={area.title} className="border-l-2 border-stone/30 pl-5 py-1">
                <h3 className="text-[0.9375rem] font-semibold text-ink mb-1.5">{area.title}</h3>
                <p className="text-[0.8125rem] text-ink-muted leading-relaxed">{area.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/en/topics"
              className="text-sm text-stone hover:underline underline-offset-4 transition-colors"
            >
              Explore all topics →
            </Link>
          </div>
        </Container>
      </section>

      {/* ───── Why this site exists ───── */}
      <section className="py-14 sm:py-16 border-b border-border">
        <Container size="reading">
          <h2 className="text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-ink-faint mb-6">
            Why this site exists
          </h2>
          <div className="space-y-4 text-[0.9375rem] text-ink-muted leading-[1.85]">
            <p>
              Most renovation content online is either marketing or surface-level tips.
              I wanted a place to write honestly — about how homes are really built,
              how people actually make decisions, and what happens when someone from a
              traditional industry starts taking AI seriously.
            </p>
            <p>
              This is not a media company. It&apos;s one person&apos;s long-term writing home.
              The Chinese version is the primary site with 50+ original articles, resources,
              and services. The English section offers selected writing and practical tools
              for international readers.
            </p>
            <p>
              I don&apos;t do machine translations. Everything here is written or carefully
              adapted for English readers. Content is added gradually — quality over quantity.
            </p>
          </div>
        </Container>
      </section>

      {/* ───── Tools ───── */}
      <section className="py-14 sm:py-16 border-b border-border">
        <Container size="content">
          <h2 className="text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-ink-faint mb-8">
            Practical tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {tools.map((tool) => (
              <div
                key={tool.title}
                className="border border-border p-5 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-[0.9375rem] font-semibold text-ink mb-1.5">{tool.title}</h3>
                  <p className="text-[0.8125rem] text-ink-muted leading-relaxed">{tool.desc}</p>
                </div>
                <div className="mt-4">
                  {tool.status === 'available' ? (
                    <Link
                      href={tool.href}
                      className="text-sm text-stone hover:underline underline-offset-4"
                    >
                      Try it →
                    </Link>
                  ) : (
                    <span className="text-xs text-ink-faint uppercase tracking-widest">
                      Coming soon
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/en/tools"
              className="text-sm text-stone hover:underline underline-offset-4 transition-colors"
            >
              View all tools →
            </Link>
          </div>
        </Container>
      </section>

      {/* ───── Topics entry ───── */}
      <section className="py-14 sm:py-16">
        <Container size="reading">
          <h2 className="text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-ink-faint mb-6">
            Explore by topic
          </h2>
          <p className="text-[0.9375rem] text-ink-muted leading-[1.85] mb-6">
            I organize my writing around four core themes — each grounded in real experience
            rather than abstract theory.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/en/topics"
              className="text-sm font-medium text-paper bg-stone px-4 py-2 hover:bg-stone/85 transition-colors"
            >
              Explore topics
            </Link>
            <Link
              href="/"
              className="text-sm text-ink-muted hover:text-ink underline underline-offset-4 px-2 py-2 transition-colors"
            >
              Visit Chinese site
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
