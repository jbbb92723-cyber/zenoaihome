import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: 'Tools',
  description:
    'Practical tools and utilities from Zeno AI Home — prompt playground, acceptance checklist, budget planning, and writing workflow.',
}

const tools = [
  {
    title: 'Prompt Playground',
    description:
      'A practical prompt utility for real work scenarios — especially for creators and traditional industry practitioners who want to use AI without hype.',
    status: 'available' as const,
    href: '/en/tools/prompts',
    cta: 'Try the prompt playground',
  },
  {
    title: 'Acceptance Checklist',
    description:
      'A field-friendly checklist for on-site review and practical handover. Built from 16+ years of renovation site experience — designed to be used at the job site, not just read at a desk.',
    status: 'coming' as const,
    href: null,
    cta: null,
  },
  {
    title: 'Budget Lite',
    description:
      'A practical budget planning utility for more durable home decisions. Helps you see where the money really goes — before you sign anything.',
    status: 'coming' as const,
    href: null,
    cta: null,
  },
  {
    title: 'Writing & Publishing Workflow',
    description:
      'A writing and publishing workflow entry for long-form content — Markdown to WeChat, newsletter-style publishing, and cross-platform distribution.',
    status: 'available' as const,
    href: '/tools/md2wechat',
    cta: 'Try the writing tool',
  },
]

export default function EnToolsPage() {
  return (
    <>
      {/* Header */}
      <div className="pt-12 sm:pt-16 pb-10 sm:pb-12 border-b border-border">
        <Container size="content">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-4">
            Tools
          </p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">
            Practical Tools
          </h1>
          <p className="text-base text-ink-muted leading-[1.7] mt-4 max-w-2xl">
            Tools and utilities from Zeno AI Home — built for practitioners,
            not for show. Each tool solves a real problem I&apos;ve encountered
            in renovation, writing, or AI-assisted work.
          </p>
        </Container>
      </div>

      {/* Tools list */}
      <Container size="content" className="py-14 sm:py-16">
        <div className="space-y-6">
          {tools.map((tool) => (
            <div
              key={tool.title}
              className="border border-border p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-base font-semibold text-ink">{tool.title}</h2>
                  {tool.status === 'coming' && (
                    <span className="text-[0.65rem] text-ink-faint uppercase tracking-widest border border-border px-2 py-0.5">
                      Coming soon
                    </span>
                  )}
                </div>
                <p className="text-sm text-ink-muted leading-relaxed max-w-xl">
                  {tool.description}
                </p>
              </div>
              {tool.status === 'available' && tool.href && (
                <Link
                  href={tool.href}
                  className="text-sm font-medium text-paper bg-stone px-4 py-2 hover:bg-stone/85 transition-colors whitespace-nowrap self-start"
                >
                  {tool.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Approach note */}
        <div className="mt-12 pt-8 border-t border-border">
          <h3 className="text-sm font-semibold text-ink mb-3">How I build tools</h3>
          <div className="space-y-3 text-sm text-ink-muted leading-relaxed max-w-xl">
            <p>
              Every tool here starts from a real problem — something I ran into on a job site,
              while writing, or while helping someone navigate a complex decision. I don&apos;t
              build tools to look impressive. I build them because they save real time.
            </p>
            <p>
              Tools are released incrementally. If something says &quot;coming soon,&quot; it means
              I&apos;m still testing it in my own workflow before making it public.
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/en"
            className="text-sm text-stone hover:underline underline-offset-4 transition-colors"
          >
            ← Back to home
          </Link>
          <Link
            href="/"
            className="text-sm text-ink-muted hover:text-ink underline underline-offset-4 transition-colors"
          >
            Visit Chinese site
          </Link>
        </div>
      </Container>
    </>
  )
}
