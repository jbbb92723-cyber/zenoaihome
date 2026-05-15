'use client'

import { useState } from 'react'
import ArticleCard from '@/components/ArticleCard'
import PageHero from '@/components/PageHero'
import Container from '@/components/Container'
import { articles, categories } from '@/data/articles'

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string>('全部')

  const allCategories = ['全部', ...categories]
  const getCategoryLabel = (category: string) => (category === '真实居住' ? '居住场景' : category)

  const filtered =
    activeCategory === '全部'
      ? articles
      : articles.filter((a) => a.category === activeCategory)

  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <PageHero
        label="文章 / 判断库"
        title="业主真正会遇到的装修问题"
        subtitle="按报价、预算、合同、施工、居住分类。每篇都来自真实工地或真实客户问题，不是观点输出。"
      />

      <Container size="content" className="py-12 sm:py-16">
        {/* 分类筛选 */}
        <div className="flex flex-wrap gap-2 mb-10">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-sm px-4 py-1.5 border transition-colors ${
                activeCategory === cat
                  ? 'border-stone bg-stone text-white'
                  : 'border-border text-ink-muted hover:border-stone hover:text-stone'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* 文章列表 */}
        <div>
          {sorted.length === 0 ? (
            <p className="text-sm text-ink-muted py-8">该分类暂无文章。</p>
          ) : (
            sorted.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          )}
        </div>
      </Container>
    </>
  )
}
