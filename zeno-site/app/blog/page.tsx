'use client'

import { useState } from 'react'
import ArticleCard from '@/components/ArticleCard'
import PageHero from '@/components/PageHero'
import Container from '@/components/Container'
import { articles, categories } from '@/data/articles'

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string>('全部')

  const allCategories = ['全部', ...categories]

  const filtered =
    activeCategory === '全部'
      ? articles
      : articles.filter((a) => a.category === activeCategory)

  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <PageHero
        label="文章"
        title="我写的东西"
        subtitle="从真实居住出发，记录 AI 实践、工具产品、一人公司和判断系统。这里不是普通博客，而是 Zeno 把经验沉淀成资产的内容入口。"
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
              {cat}
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
