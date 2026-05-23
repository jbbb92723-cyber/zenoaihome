'use client'

import { useState } from 'react'
import ArticleCard from '@/components/ArticleCard'
import PageHero from '@/components/PageHero'
import Container from '@/components/Container'
import { articles, categories } from '@/data/articles'

export default function BlogClient() {
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
        <section className="mb-10 border border-border bg-surface-warm p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-ink">这个文章库怎么用</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            先看具体风险词和具体后果，再回到你的报价单、合同草稿或付款节点截图。文章不替代报价初筛和人工复核，但能帮你知道该问什么。
          </p>
        </section>

        <div className="mb-10 flex flex-wrap gap-2">
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

        <div>
          {sorted.length === 0 ? (
            <p className="py-8 text-sm text-ink-muted">该分类暂无文章。</p>
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
