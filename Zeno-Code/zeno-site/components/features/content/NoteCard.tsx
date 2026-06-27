import Link from 'next/link'
import type { NoteListItem } from '@/lib/notes'

interface NoteCardProps {
  note: NoteListItem
  variant?: 'default' | 'compact'
}

export default function NoteCard({ note, variant = 'default' }: NoteCardProps) {
  const formattedDate = new Date(note.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  if (variant === 'compact') {
    return (
      <Link
        href={`/notes/${note.slug}`}
        className="group flex items-start gap-4 py-4 border-b border-border last:border-0 hover:opacity-80 transition-opacity"
      >
        {note.category && (
          <span className="text-xs text-stone font-medium mt-0.5 shrink-0 pt-px whitespace-nowrap">
            {note.category}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-sm text-ink font-medium group-hover:text-stone transition-colors leading-snug truncate">
            {note.title}
          </h3>
          <p className="text-xs text-ink-muted mt-1">{formattedDate}</p>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/notes/${note.slug}`}
      className="group block py-6 border-b border-border last:border-0"
    >
      <div className="flex items-center gap-2 mb-2">
        {note.category && (
          <span className="text-xs text-stone font-medium">{note.category}</span>
        )}
        {note.category && <span className="text-border">·</span>}
        <time className="text-xs text-ink-muted">{formattedDate}</time>
        {note.tags.length > 0 && (
          <>
            <span className="text-border">·</span>
            <span className="text-xs text-ink-faint truncate max-w-[12rem]">
              {note.tags.slice(0, 3).join(' · ')}
            </span>
          </>
        )}
      </div>
      <h2 className="text-base sm:text-lg font-medium text-ink group-hover:text-stone transition-colors leading-snug mb-2">
        {note.title}
      </h2>
      {note.excerpt && (
        <p className="text-sm text-ink-muted leading-relaxed line-clamp-2">{note.excerpt}</p>
      )}
    </Link>
  )
}
