import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import PageHero from '@/components/PageHero'
import CTA from '@/components/CTA'
import StructuredData from '@/components/StructuredData'
import { getArticleBySlug } from '@/data/articles'

type CaseGroup = {
  title: string
  intro: string
  articleSlugs: string[]
  tool: { label: string; href: string }
  service: { label: string; href: string }
}

export const metadata: Metadata = {
  title: '案例复盘：先看判断过程，再决定怎么做',
  description:
    '这里先公开能公开的判断复盘，不编造客户隐私案例。重点看报价、预算、合同和施工节点里，判断是怎么一步步做出来的。',
  alternates: {
    canonical: 'https://zenoaihome.com/cases',
  },
}

const caseGroups: CaseGroup[] = [
  {
    title: '报价与签约复盘',
    intro: '先看一份报价是怎么被拆开、怎么识别风险、为什么低价不一定更划算。',
    articleSlugs: ['baojia-dan-zenme-kan', 'article-03-04', 'article-03-02'],
    tool: { label: '先看报价风险自查指南', href: '/pricing/baojia-guide' },
    service: { label: '签约前决策包', href: '/services/renovation#qianyue-qian-juece-bao' },
  },
  {
    title: '预算与施工复盘',
    intro: '先看预算为什么会失控，施工阶段为什么要按节点盯，而不是等全部做完再回头。',
    articleSlugs: ['zhuangxiu-yusuan-weishenme-zongchao', 'shuidian-gongcheng-zongchao-yusuan', 'zhuangxiu-hou-hue-de-wu-jian'],
    tool: { label: '去找验收清单和预算模板', href: '/resources' },
    service: { label: '预算取舍诊断', href: '/services/renovation#yusuan-zixun' },
  },
  {
    title: 'AI 辅助整理复盘',
    intro: '先看 AI 怎么辅助整理报价、清单和内容，但最后仍然回到人的判断。',
    articleSlugs: ['04-wei-shenme-wo-kaishi-renzheng-xue-ai', 'article-05-06', 'neirong-xitong-jianqi'],
    tool: { label: '去提示词体验场', href: '/tools/prompts' },
    service: { label: '回到报价初筛', href: '/tools/quote-check' },
  },
]

export default function CasesPage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: '案例复盘',
          url: 'https://zenoaihome.com/cases',
          description: '先公开能公开的判断过程，不编造客户隐私案例。',
          inLanguage: 'zh-CN',
        }}
      />

      <PageHero
        label="案例复盘"
        title="先看判断过程，再决定怎么做"
        subtitle="这里先公开能公开的判断复盘，不编造客户隐私案例，也不把复杂现实讲成一句口号。先看我是怎么判断的，再决定这条路适不适合你。"
        note="现在公开的主要是判断复盘、问题拆解和方法样例。更具体的项目细节，只在适合公开的范围内逐步补。"
        size="content"
      />

      <Container size="content" className="py-section">
        <div className="space-y-10">
          {caseGroups.map((group) => {
            const articles = group.articleSlugs
              .map((slug) => getArticleBySlug(slug))
              .filter((article): article is NonNullable<typeof article> => Boolean(article))

            return (
              <section key={group.title} className="border border-border overflow-hidden">
                <div className="border-b border-border bg-surface-warm px-6 py-5 sm:px-8 sm:py-6">
                  <h2 className="section-heading mb-2">{group.title}</h2>
                  <p className="text-sm text-ink-muted leading-relaxed max-w-2xl">{group.intro}</p>
                </div>

                <div className="px-6 py-6 sm:px-8 sm:py-8 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
                  <div className="space-y-3">
                    {articles.map((article) => (
                      <Link
                        key={article.id}
                        href={`/blog/${article.slug}`}
                        className="group block border border-border bg-surface p-5 hover:bg-surface-warm transition-colors"
                      >
                        <p className="text-[0.7rem] uppercase tracking-widest text-ink-faint mb-2">{article.category}</p>
                        <h3 className="text-base font-semibold text-ink group-hover:text-stone transition-colors mb-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-ink-muted leading-relaxed">{article.excerpt}</p>
                        <p className="text-xs text-stone mt-3">看这篇复盘 →</p>
                      </Link>
                    ))}
                  </div>

                  <div className="border border-border bg-surface p-5 sm:p-6 h-fit">
                    <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">看完这一组，下一步怎么走</p>
                    <div className="flex flex-col gap-3">
                      <CTA href={group.tool.href} label={group.tool.label} variant="primary" />
                      <CTA href={group.service.href} label={group.service.label} variant="secondary" />
                    </div>
                  </div>
                </div>
              </section>
            )
          })}
        </div>

        <section className="mt-14 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="page-label mb-3">下一步</p>
          <h2 className="section-heading mb-3">如果你不是来看复盘，而是想先解决手头问题</h2>
          <p className="text-sm text-ink-muted leading-relaxed max-w-2xl mb-5">
            直接回到“从这里开始”，按你当前阶段选路径。这样比先看完所有复盘更省时间。
          </p>
          <div className="flex flex-wrap gap-3">
            <CTA href="/start" label="回到从这里开始" variant="primary" />
            <CTA href="/tools" label="按问题找工具" variant="secondary" />
            <CTA href="/services" label="先看服务边界" variant="ghost" />
          </div>
        </section>
      </Container>
    </>
  )
}
