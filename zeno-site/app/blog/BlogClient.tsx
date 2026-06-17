'use client'

import { useState } from 'react'
import ArticleCard from '@/components/features/content/ArticleCard'
import PageHero from '@/components/ui/PageHero'
import Container from '@/components/ui/Container'
import { articles, categories } from '@/data/content/articles'

export default function BlogClient() {
  const [activeCategory, setActiveCategory] = useState<string>('全部')

  const allCategories = ['全部', ...categories]
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      真实居住: '生活判断',
      判断与生活: '方案与空间判断',
      工具与产品: '报价与交付判断',
      'AI 实践': 'AI与个体判断',
      一人公司: 'AI与个体判断',
      生活判断: '生活判断',
      '方案与空间判断': '方案与空间判断',
      '报价与交付判断': '报价与交付判断',
      'AI与个体判断': 'AI与个体判断',
    }
    return labels[category] ?? category
  }
  const contentSystem = [
    ['生活判断', '从真实居住出发——光线、动线、收纳、家务、陪伴、独处，先看清这个家怎么住。'],
    ['方案与空间判断', '把"我想要的生活"翻译成空间优先级、审美取舍和预算边界。'],
    ['报价与交付判断', '报价、合同、付款节点、验收标准——签约前必须拆开的边界。'],
    ['AI与个体判断', 'AI 怎么用、一人公司怎么跑、判断力怎么长——个体在 AI 时代的实践。'],
  ]
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
        label="判断文章库"
        title="按判断域阅读：生活、方案、报价交付、AI与个体"
        subtitle="这里不是装修知识大全。文章按四类判断域组织——你卡在哪一层，就从哪一层进入。不按话题分，按判断深度分。"
        note="先确定你当前要判断的问题属于哪一层，而不是从最新文章开始刷。"
      />

      <Container size="content" className="py-12 sm:py-16">
        <section className="mb-10 report-sheet p-5 sm:p-6">
          <p className="system-label">How to use</p>
          <h2 className="mt-2 text-lg font-semibold text-ink">这个文章库怎么用</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            先判断你的问题属于哪一层：生活方式、美学取舍、空间场景、装修决策，还是报价合同风险。文章不替代诊断、报价初筛和人工复核，但能帮你知道下一步该问什么。
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {contentSystem.map(([title, desc]) => (
              <div key={title} className="border border-border bg-surface/92 px-4 py-3">
                <h3 className="text-sm font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mb-10 flex flex-wrap gap-2 border-b border-border pb-6">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`min-h-10 border px-4 py-1.5 text-sm transition-colors ${
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
