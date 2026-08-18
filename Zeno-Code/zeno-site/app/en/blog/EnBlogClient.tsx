'use client'

import { useState } from 'react'
import ArticleCardEn from '@/app/en/ArticleCardEn'
import Container from '@/components/ui/Container'
import PageHero from '@/components/ui/PageHero'
import type { LocalizedArticleSummary } from '@/lib/i18n'

interface Props {
  articles: LocalizedArticleSummary[]
  categories: string[]
  copy: {
    pageLabel: string
    pageTitle: string
    pageSubtitle: string
    allCategories: string
    noArticles: string
  }
}

export default function EnBlogClient({ articles, categories, copy }: Props) {
  const [activeCategory, setActiveCategory] = useState(copy.allCategories)
  const visibleArticles = activeCategory === copy.allCategories
    ? articles
    : articles.filter((article) => article.category === activeCategory)

  return (
    <>
      <PageHero
        label={copy.pageLabel}
        title={copy.pageTitle}
        subtitle={copy.pageSubtitle}
      />

      <Container size="content" className="py-12 sm:py-16">
        <div className="mb-10 flex flex-wrap gap-2">
          {[copy.allCategories, ...categories].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`min-h-11 border px-4 py-1.5 text-sm transition-colors ${
                activeCategory === category
                  ? 'border-stone bg-stone text-white'
                  : 'border-border text-ink-muted hover:border-stone hover:text-stone'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div>
          {visibleArticles.length === 0 ? (
            <p className="py-8 text-sm text-ink-muted">{copy.noArticles}</p>
          ) : (
            visibleArticles.map((article) => (
              <ArticleCardEn key={article.id} article={article} />
            ))
          )}
        </div>
      </Container>
    </>
  )
}
