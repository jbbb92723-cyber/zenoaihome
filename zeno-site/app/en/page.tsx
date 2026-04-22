import Link from 'next/link'
import Container from '@/components/Container'

export default function EnHomePage() {
  return (
    <>
      {/* Hero */}
      <div className="pt-16 sm:pt-20 pb-12 sm:pb-16 border-b border-border">
        <Container size="content">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-4">
            Zeno · English
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight leading-snug max-w-2xl">
            From renovation sites to long-term living, human judgment, and AI-enabled growth.
          </h1>
          <p className="text-base sm:text-lg text-ink-muted leading-[1.7] mt-5 max-w-2xl">
            I&apos;m Zeno, a renovation practitioner from China. I write about real living,
            aesthetics, human decisions, work-site observations, and how traditional industry
            people can upgrade themselves with AI.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              href="/en/articles"
              className="text-sm font-medium text-paper bg-stone px-4 py-2 hover:bg-stone/85 transition-colors"
            >
              Read selected essays
            </Link>
            <Link
              href="/en/about"
              className="text-sm font-medium text-stone border border-stone/40 px-4 py-2 hover:bg-stone-pale transition-colors"
            >
              About Zeno
            </Link>
            <Link
              href="/en/topics"
              className="text-sm text-ink-muted hover:text-ink underline underline-offset-4 px-2 py-2 transition-colors"
            >
              Explore topics
            </Link>
          </div>
        </Container>
      </div>

      {/* Brief intro */}
      <Container size="content" className="py-14 sm:py-16">
        <div className="max-w-xl">
          <h2 className="text-lg font-semibold text-ink mb-4">What you&apos;ll find here</h2>
          <div className="space-y-4 text-sm text-ink-muted leading-relaxed">
            <p>
              This site is my personal writing space. The Chinese version is the primary site
              with full articles, resources, and services. The English section offers selected
              essays and topic overviews for international readers.
            </p>
            <p>
              I don&apos;t do machine translations. Everything here is written or carefully adapted
              for English readers. Content is added gradually — quality over quantity.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border">
          <p className="text-xs text-ink-faint">
            Full content is available on the{' '}
            <Link href="/" className="text-stone hover:underline underline-offset-2">
              Chinese site
            </Link>
            . English content is updated periodically.
          </p>
        </div>
      </Container>
    </>
  )
}
