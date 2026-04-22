import type { Metadata } from 'next'
import Container from '@/components/Container'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Topics',
  description: 'Explore topics: real living & renovation, aesthetics & daily life, human judgment, and AI for traditional industry people.',
}

const topics = [
  {
    title: 'Real Living & Renovation',
    description:
      'What renovation actually teaches you about decision-making, budgets, and living with imperfection. Based on 16+ years of on-site experience.',
    slug: 'living-renovation',
    status: 'active' as const,
  },
  {
    title: 'Aesthetics & Daily Life',
    description:
      'How restraint, proportion, and everyday choices shape the way a home feels — beyond trends and decorating tips.',
    slug: 'aesthetics',
    status: 'active' as const,
  },
  {
    title: 'Human Judgment',
    description:
      'Patterns in how people make decisions — on job sites, in business, and in life. Observations from the field, not from textbooks.',
    slug: 'judgment',
    status: 'active' as const,
  },
  {
    title: 'AI for Traditional Industry People',
    description:
      'How practitioners in hands-on industries can genuinely benefit from AI — without hype, without replacing judgment, and without pretending it solves everything.',
    slug: 'ai-upgrade',
    status: 'active' as const,
  },
]

export default function EnTopicsPage() {
  return (
    <>
      <div className="pt-12 sm:pt-16 pb-10 sm:pb-12 border-b border-border">
        <Container size="content">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-4">Topics</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">Explore Topics</h1>
          <p className="text-base text-ink-muted leading-[1.7] mt-4 max-w-2xl">
            Four areas I write about — each rooted in lived experience rather than abstract theory.
          </p>
        </Container>
      </div>

      <Container size="content" className="py-14 sm:py-16">
        <div className="space-y-6">
          {topics.map((topic) => (
            <div
              key={topic.slug}
              className="border border-border bg-surface p-6 hover:bg-surface-warm transition-colors"
            >
              <h2 className="text-base font-semibold text-ink mb-2">{topic.title}</h2>
              <p className="text-sm text-ink-muted leading-relaxed">{topic.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-ink-muted leading-relaxed">
            Detailed essays for each topic are available on the{' '}
            <Link href="/topics" className="text-stone hover:underline underline-offset-2">
              Chinese topics page
            </Link>
            . English essays are added selectively.
          </p>
        </div>
      </Container>
    </>
  )
}
