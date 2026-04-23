import type { Metadata } from 'next'
import Container from '@/components/Container'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Selected Articles',
  description: 'Selected essays by Zeno — renovation, living, aesthetics, and AI in traditional industries.',
}

const articles = [
  {
    title: 'Why I Don\'t Want to Be Just a Renovation Blogger',
    summary: 'What started as renovation writing became something broader — about living, judgment, and long-term thinking.',
    status: 'draft' as const,
  },
  {
    title: 'A Home Is Not a Showroom',
    summary: 'The gap between what looks good in photos and what actually works for living. A perspective from the job site.',
    status: 'draft' as const,
  },
  {
    title: 'Why Traditional Industry People Should Learn AI',
    summary: 'AI isn\'t just for tech people. For practitioners in renovation, manufacturing, and trades, the real opportunity is in augmenting — not replacing — judgment.',
    status: 'draft' as const,
  },
]

export default function EnArticlesPage() {
  return (
    <>
      <div className="pt-12 sm:pt-16 pb-10 sm:pb-12 border-b border-border">
        <Container size="content">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-4">Articles</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">Selected Articles</h1>
          <p className="text-base text-ink-muted leading-[1.7] mt-4 max-w-2xl">
            A small selection of essays, written or adapted for English readers.
            Full articles are published first on the Chinese site.
          </p>
        </Container>
      </div>

      <Container size="content" className="py-14 sm:py-16">
        <div className="space-y-6">
          {articles.map((article) => (
            <div
              key={article.title}
              className="border border-border bg-surface p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-ink mb-2">{article.title}</h2>
                  <p className="text-sm text-ink-muted leading-relaxed">{article.summary}</p>
                </div>
                <span className="shrink-0 text-xs text-ink-faint border border-border px-2 py-0.5 uppercase">
                  {article.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-ink-muted leading-relaxed">
            These articles are in draft. Full English versions will be published as they are ready.
            For all articles in Chinese, visit the{' '}
            <Link href="/blog" className="text-stone hover:underline underline-offset-2">
              blog
            </Link>.
          </p>
        </div>
      </Container>
    </>
  )
}
