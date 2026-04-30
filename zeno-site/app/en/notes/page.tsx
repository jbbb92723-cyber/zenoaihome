import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import PageHero from '@/components/PageHero'
import { getPublicNotes } from '@/lib/notes'

export const metadata: Metadata = {
  title: 'Notes — Thinking in Progress',
  description:
    'Short-form reflections on renovation, AI, business, and long-term thinking. These are seeds — some will grow into full articles, some remain as observations.',
  alternates: {
    canonical: 'https://zenoaihome.com/en/notes',
    languages: { 'zh-CN': 'https://zenoaihome.com/notes', en: 'https://zenoaihome.com/en/notes' },
  },
}

export const dynamic = 'force-dynamic'

export default async function EnNotesPage() {
  const notes = await getPublicNotes()

  return (
    <>
      <PageHero
        label="Notes"
        title="Thinking in Progress"
        subtitle="Short reflections from renovation sites, AI experiments, business decisions, and daily observations. Not polished essays — raw seeds of thought with real-world temperature."
      />

      <Container size="content" className="py-12 sm:py-16">
        {/* Featured (top 3) */}
        {notes.length >= 3 && (
          <div className="mb-12 pb-10 border-b border-border">
            <div className="mb-8">
              <p className="page-label mb-3">Featured</p>
              <h2 className="section-heading">Worth reading twice</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {notes.slice(0, 3).map((note) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.slug}`}
                  className="group border border-stone/20 bg-stone/5 p-5 card-hover flex flex-col"
                >
                  {note.category && (
                    <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-2">
                      {note.category}
                    </span>
                  )}
                  <h3 className="text-sm font-semibold text-ink group-hover:text-stone transition-colors leading-snug mb-2">
                    {note.title}
                  </h3>
                  {note.excerpt && (
                    <p className="text-xs text-ink-muted leading-relaxed flex-1 line-clamp-3">
                      {note.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All notes */}
        <div>
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-6">
            All Notes ({notes.length})
          </p>
          {notes.length === 0 ? (
            <p className="text-sm text-ink-muted py-8">No notes published yet.</p>
          ) : (
            notes.map((note) => {
              const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
              return (
                <Link
                  key={note.id}
                  href={`/notes/${note.slug}`}
                  className="group block py-6 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {note.category && (
                      <span className="text-xs text-stone font-medium">{note.category}</span>
                    )}
                    {note.category && <span className="text-border">·</span>}
                    <time className="text-xs text-ink-muted">{formattedDate}</time>
                  </div>
                  <h2 className="text-base sm:text-lg font-medium text-ink group-hover:text-stone transition-colors leading-snug mb-2">
                    {note.title}
                  </h2>
                  {note.excerpt && (
                    <p className="text-sm text-ink-muted leading-relaxed line-clamp-2">
                      {note.excerpt}
                    </p>
                  )}
                </Link>
              )
            })
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-ink-muted mb-4">
            Want more structured content? Check the full articles.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/en/blog" className="text-sm text-stone hover:underline underline-offset-2">
              Read articles →
            </Link>
            <Link href="/en/resources" className="text-sm text-ink-muted hover:text-stone transition-colors">
              Tools & Resources
            </Link>
          </div>
        </div>
      </Container>
    </>
  )
}
