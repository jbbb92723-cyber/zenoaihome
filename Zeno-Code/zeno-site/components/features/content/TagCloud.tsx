'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { getAllArticles } from '@/data/content/articles'

interface TagCloudProps {
  /** Optional: limit to top N tags */
  limit?: number
  /** Optional: CSS class for the container */
  className?: string
}

export default function TagCloud({ limit, className = '' }: TagCloudProps) {
  const tagCounts = useMemo(() => {
    const articles = getAllArticles()
    const counts: Record<string, number> = {}
    articles.forEach((a) => {
      a.tags?.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1
      })
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
  }, [limit])

  if (tagCounts.length === 0) return null

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {tagCounts.map(([tag, count]) => (
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
