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
  const prioritySlugs = [
    'baojiadan-an-shiji-zengjian-jiesuan-qianyueqian-wenqing',
    'baojiadan-lingji-jiagong-zangu-yinggai-zenme-kan',
    'zhuangxiu-baojia-fengxian-xilie',
    'zhuangxiu-cailiao-zhi-xie-pinpai-bugou-xinghao-tihuan-guize-yao-xieqing',
    'qianhetong-qian-ba-koutou-chengnuo-xiejin-qu',
    'zhuangxiu-baojia-mingxian-di-qianyueqian-cha-6ge-weizhi',
  ]
  const getPriority = (slug: string) => {
    const index = prioritySlugs.indexOf(slug)
    return index === -1 ? 999 : index
  }

  const filtered =
    activeCategory === '全部'
      ? articles
      : articles.filter((a) => a.category === activeCategory)

  const sorted = [...filtered].sort((a, b) => {
    const priorityDiff = getPriority(a.slug) - getPriority(b.slug)
    if (priorityDiff !== 0) return priorityDiff
    return b.date.localeCompare(a.date)
  })

  return (
    <>
      <PageHero
        label="文章 / 判断库"
        title="签约前，先看懂这些报价和合同风险"
        subtitle="这里优先整理具体风险词、具体后果和签约前动作：按实结算、暂估、漏项、口头承诺、付款节点和材料替换。"
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
