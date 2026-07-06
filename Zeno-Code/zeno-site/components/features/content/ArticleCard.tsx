import Link from 'next/link'
import Image from 'next/image'
import type { Article } from '@/data/content/articles'

interface ArticleCardProps {
  article: Article
  variant?: 'default' | 'compact'
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const formattedDate = new Date(article.date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  if (variant === 'compact') {
    return (
      <Link
        href={`/blog/${article.slug}`}
        className="group flex items-start gap-4 py-4 border-b border-border last:border-0 hover:opacity-80 transition-opacity"
      >
        <span className="text-xs text-stone font-medium mt-0.5 shrink-0 pt-px">
          {article.category}
        </span>
        <div>
          <h3 className="text-sm text-ink font-medium group-hover:text-stone transition-colors leading-snug">
            {article.title}
          </h3>
          <p className="text-xs text-ink-muted mt-1">{formattedDate}</p>
        </div>
      </Link>
    )
  }

  const hasCover = article.coverImage && article.coverImage.length > 0

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group block py-10 border-b border-border last:border-0"
    >
      {hasCover && (
        <div className="relative w-full aspect-[3/1] overflow-hidden mb-6">
          <Image
            src={article.coverImage!}
            alt={article.coverAlt || article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.01]"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      )}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-medium uppercase tracking-widest text-stone">
          {article.category}
        </span>
        <span className="text-border text-xs">·</span>
        <time className="text-xs text-ink-faint">{formattedDate}</time>
      </div>
      <h2 className="text-xl sm:text-2xl font-medium text-ink group-hover:text-stone transition-colors leading-tight mb-3 max-w-3xl">
        {article.title}
      </h2>
      <p className="text-sm text-ink-muted leading-relaxed line-clamp-3 max-w-2xl">
        {article.excerpt}
      </p>
    </Link>
  )
}
