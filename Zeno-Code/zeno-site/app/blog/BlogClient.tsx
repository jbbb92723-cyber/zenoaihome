'use client'

import Link from 'next/link'
import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import ArticleCard from '@/components/features/content/ArticleCard'
import TagCloud from '@/components/features/content/TagCloud'
import PageHero from '@/components/ui/PageHero'
import Container from '@/components/ui/Container'
import { articles } from '@/data/content/articles'
import {
  primaryCategories,
  getSubcategoriesForParent,
  getPrimaryCategory,
  getSubcategory,
} from '@/data/content/categories'
import { currentPractice } from '@/data/practice/experiments'

const startHere = [
  {
    label: '真实起点',
    title: '四版报价单和几百条聊天记录，让我开始认真用 AI',
    body: 'AI 先整理和对比，人保留判断与责任。这是赞诺人机协作方式的现实起点。',
    href: '/blog/04-wei-shenme-wo-kaishi-renzheng-xue-ai',
  },
  {
    label: '一人公司实践',
    title: '从装修现场出发，我开始搭一人公司的工作系统',
    body: '为什么不急着做课程，而是先把真实经验放进内容、工具和最小交付里。',
    href: '/blog/zeno-from-renovation-to-opc',
  },
  {
    label: '垂直验证场',
    title: '报价单真正怎么看：先查范围，再谈总价',
    body: '从一份具体报价开始，看装修经验如何被拆成别人可以使用的判断顺序。',
    href: '/blog/baojia-dan-zhenzheng-zenme-kan',
  },
]

const publicArticles = articles.filter((article) => article.parentCategory !== 'mattress')

export default function BlogClient() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category') ?? ''
  const visibleCategoryParam = categoryParam === 'mattress' ? '' : categoryParam
  const subParam = searchParams.get('sub') ?? ''
  const tagParam = searchParams.get('tag') ?? ''

  const [activeCategory, setActiveCategory] = useState<string>(visibleCategoryParam || '全部')
  const [activeSub, setActiveSub] = useState<string>(subParam || '')
  const [activeTag, setActiveTag] = useState<string>(tagParam || '')

  // 只展示当前确实有公开文章的一级分类。
  const allCategories = useMemo(() => {
    const available = new Set(publicArticles.map((article) => article.parentCategory).filter(Boolean))
    return ['全部', ...primaryCategories.filter((category) => category.slug !== 'about' && available.has(category.slug)).map((category) => category.slug)]
  }, [])

  useEffect(() => {
    setActiveCategory(visibleCategoryParam || '全部')
    setActiveSub(subParam)
    setActiveTag(tagParam)
  }, [visibleCategoryParam, subParam, tagParam])

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
    let result = publicArticles

    if (activeCategory !== '全部') {
      // 先按 parentCategory 筛选（新分类体系）
      result = result.filter((a) => a.parentCategory === activeCategory)
      // 如果设置了二级分类，再过滤
      if (activeSub) {
        result = result.filter((a) => a.subcategory === activeSub)
      }
    }

    // 标签过滤
    if (activeTag) {
      result = result.filter((a) => a.tags?.includes(activeTag))
    }

    return result
  }, [activeCategory, activeSub, activeTag])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => b.date.localeCompare(a.date))
  }, [filtered])

  return (
    <>
      <PageHero
        label="公开实践"
        title="从真实问题，到可以被核对的下一版"
        subtitle="这里记录做过的事、仍在验证的判断，以及工具和方法被使用后发生的修改。"
        note={`当前重点：${currentPractice.title}`}
      />

      <Container size="content" className="py-12 sm:py-16">
        <section className="mb-12 grid gap-6 border-y border-border py-7 sm:grid-cols-[0.72fr_0.28fr] sm:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="system-label">当前实验</p>
              <span className="border border-cinnabar/30 bg-cinnabar/5 px-2 py-1 text-[0.7rem] font-semibold text-cinnabar">{currentPractice.status}</span>
              <span className="border border-border px-2 py-1 text-[0.7rem] font-semibold text-ink-muted">{currentPractice.evidenceStatus}</span>
            </div>
            <h2 className="mt-4 text-xl font-semibold leading-8 text-ink">{currentPractice.title}</h2>
            <p className="mt-3 text-sm leading-7 text-ink-muted">{currentPractice.nextAction}</p>
          </div>
          <Link href="/#current-practice" className="inline-flex min-h-11 items-center justify-center border border-border px-4 py-3 text-sm font-semibold text-ink hover:border-stone">
            查看公开进度
          </Link>
        </section>

        <section className="mb-12">
          <p className="system-label">从这里开始</p>
          <div className="mt-5 grid border-y border-border md:grid-cols-3">
            {startHere.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex min-h-64 flex-col py-6 md:px-6 ${index < startHere.length - 1 ? 'border-b border-border md:border-b-0 md:border-r' : ''} ${index === 0 ? 'md:pl-0' : ''} ${index === startHere.length - 1 ? 'md:pr-0' : ''}`}
              >
                <p className="text-xs font-semibold text-stone">{item.label}</p>
                <h2 className="mt-4 text-lg font-semibold leading-7 text-ink group-hover:text-stone">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-ink-muted">{item.body}</p>
                <span className="mt-auto pt-6 text-sm font-semibold text-stone">阅读全文 →</span>
              </Link>
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

        {/* 标签作为二级探索入口，不抢占首屏。 */}
        <details className="mb-8 border-b border-border pb-5">
          <summary className="cursor-pointer text-xs font-semibold text-ink-muted hover:text-ink">更多标签</summary>
          <TagCloud limit={20} className="mt-4" />
        </details>

        {activeTag && (
          <div className="mb-8 flex items-center gap-3 border-l-2 border-stone pl-4">
            <p className="text-sm text-ink-muted">当前标签：<span className="font-semibold text-ink">{activeTag}</span></p>
            <button onClick={() => setActiveTag('')} className="text-xs font-semibold text-stone hover:text-ink">清除</button>
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
