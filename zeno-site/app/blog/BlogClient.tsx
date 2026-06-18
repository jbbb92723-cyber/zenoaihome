'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import ArticleCard from '@/components/features/content/ArticleCard'
import PageHero from '@/components/ui/PageHero'
import Container from '@/components/ui/Container'
import { articles } from '@/data/content/articles'
import {
  primaryCategories,
  getSubcategoriesForParent,
  getPrimaryCategory,
  getSubcategory,
} from '@/data/content/categories'

export default function BlogClient() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category') ?? ''
  const subParam = searchParams.get('sub') ?? ''

  const [activeCategory, setActiveCategory] = useState<string>(categoryParam || '全部')
  const [activeSub, setActiveSub] = useState<string>(subParam || '')

  // 所有一级分类 + "全部"
  const allCategories = useMemo(() => ['全部', ...primaryCategories.map((c) => c.slug)], [])

  // 当前一级分类对应的二级分类
  const activeSubcategories = useMemo(
    () => (activeCategory !== '全部' ? getSubcategoriesForParent(activeCategory) : []),
    [activeCategory],
  )

  // 获取分类中文名
  const getCategoryName = (slug: string): string => {
    if (slug === '全部') return '全部'
    const found = getPrimaryCategory(slug)
    return found?.name ?? slug
  }

  // 获取分类描述
  const getCategoryDesc = (slug: string): string => {
    const found = getPrimaryCategory(slug)
    return found?.description ?? ''
  }

  // 筛选文章
  const filtered = useMemo(() => {
    let result = articles

    if (activeCategory !== '全部') {
      // 先按 parentCategory 筛选（新分类体系）
      result = result.filter((a) => a.parentCategory === activeCategory)
      // 如果设置了二级分类，再过滤
      if (activeSub) {
        result = result.filter((a) => a.subcategory === activeSub)
      }
    }
    return result
  }, [activeCategory, activeSub])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => b.date.localeCompare(a.date))
  }, [filtered])

  // 版块介绍（6个内容方向）
  const contentSystem = useMemo(() => {
    return primaryCategories
      .filter((c) => c.slug !== 'about') // 关于我 不是文章分类
      .map((c) => [c.name, c.description ?? ''] as [string, string])
  }, [])

  return (
    <>
      <PageHero
        label="文章库"
        title="装修避坑、床垫干货、生活方式、IP方法论、AI实战、OPC社群"
        subtitle="这里不是装修知识大全，也不是床垫百科。每篇文章都从真实经历出发——16年一线经验，拆成你能用的判断。"
        note="先选你关心的版块，再看有什么。不用按时间刷。"
      />

      <Container size="content" className="py-12 sm:py-16">
        {/* How to use */}
        <section className="mb-10 report-sheet p-5 sm:p-6">
          <p className="system-label">内容版块</p>
          <h2 className="mt-2 text-lg font-semibold text-ink">这个文章库怎么用</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            六个版块各有侧重。选你当前最关心的方向，从那里开始。每篇文章结尾有统一的行动建议——看完知道下一步该做什么。
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {contentSystem.map(([title, desc]) => (
              <button
                key={title}
                onClick={() => {
                  const cat = primaryCategories.find((c) => c.name === title)
                  if (cat) {
                    setActiveCategory(cat.slug)
                    setActiveSub('')
                  }
                }}
                className="border border-border bg-surface/92 px-4 py-3 text-left hover:border-stone transition-colors"
              >
                <h3 className="text-sm font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* 一级分类筛选 */}
        <div className="mb-4 flex flex-wrap gap-2 border-b border-border pb-6">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat)
                setActiveSub('')
              }}
              className={`min-h-10 border px-4 py-1.5 text-sm transition-colors ${
                activeCategory === cat
                  ? 'border-stone bg-stone text-white'
                  : 'border-border text-ink-muted hover:border-stone hover:text-stone'
              }`}
            >
              {getCategoryName(cat)}
            </button>
          ))}
        </div>

        {/* 二级分类筛选（只在有子分类时显示） */}
        {activeSubcategories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2 border-b border-border/50 pb-5">
            <button
              onClick={() => setActiveSub('')}
              className={`min-h-9 border px-3 py-1 text-xs transition-colors ${
                activeSub === ''
                  ? 'border-stone/60 bg-surface-warm text-stone font-medium'
                  : 'border-border text-ink-muted hover:border-stone/40 hover:text-stone'
              }`}
            >
              全部{getCategoryName(activeCategory)}
            </button>
            {activeSubcategories.map((sub) => (
              <button
                key={sub.slug}
                onClick={() => setActiveSub(sub.slug)}
                className={`min-h-9 border px-3 py-1 text-xs transition-colors ${
                  activeSub === sub.slug
                    ? 'border-stone/60 bg-surface-warm text-stone font-medium'
                    : 'border-border text-ink-muted hover:border-stone/40 hover:text-stone'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* 当前分类描述 */}
        {activeCategory !== '全部' && (
          <div className="mb-8">
            <div className="flex items-baseline gap-3">
              <h2 className="text-lg font-semibold text-ink">
                {getCategoryName(activeCategory)}
                {activeSub && (
                  <>
                    <span className="mx-2 text-stone">/</span>
                    <span>{getSubcategory(activeSub)?.name ?? activeSub}</span>
                  </>
                )}
              </h2>
              <span className="text-xs text-ink-muted">{filtered.length} 篇</span>
            </div>
            {!activeSub && (
              <p className="mt-2 text-sm text-ink-muted">{getCategoryDesc(activeCategory)}</p>
            )}
          </div>
        )}

        {/* 文章列表 */}
        <div>
          {sorted.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-ink-muted mb-2">该分类下暂无文章。</p>
              <p className="text-xs text-ink-faint">内容正在准备中，先看看其他版块吧。</p>
            </div>
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
