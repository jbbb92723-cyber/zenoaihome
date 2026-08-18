'use client'

import Link from 'next/link'

interface TagCloudProps {
  tagCounts: Array<[string, number]>
  /** Optional: limit to top N tags */
  limit?: number
  /** Optional: CSS class for the container */
  className?: string
}

export default function TagCloud({ tagCounts, limit, className = '' }: TagCloudProps) {
  const visibleTags = typeof limit === 'number' ? tagCounts.slice(0, limit) : tagCounts

  if (visibleTags.length === 0) return null

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {visibleTags.map(([tag, count]) => (
          <Link
            key={tag}
            href={`/blog?tag=${encodeURIComponent(tag)}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-ink-muted transition-colors hover:border-stone hover:text-ink hover:bg-surface-warm"
          >
            {tag}
            <span className="text-[10px] tabular-nums text-ink-faint">{count}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
