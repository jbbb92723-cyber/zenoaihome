import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import StructuredData from '@/components/StructuredData'
import { quoteRiskRules } from '@/data/quote-risk-rules'

export const metadata: Metadata = {
  title: '装修报价风险词典｜按实结算、暂估、漏项和材料模糊风险',
  description:
    '装修报价风险词典解释按实结算、暂估、另计、材料品牌型号缺失、施工范围不清等签约前高频风险词，帮助业主看清报价边界。',
  alternates: {
    canonical: 'https://zenoaihome.com/risk-dictionary',
  },
}

const riskLevelClass: Record<string, string> = {
  高: 'border-red-200 bg-red-50 text-red-700',
  中: 'border-amber-200 bg-amber-50 text-amber-700',
  低: 'border-stone/20 bg-stone-pale text-stone',
}

const faqs = [
  {
    question: '装修报价风险词典是做什么的？',
    answer: '装修报价风险词典把按实结算、暂估、另计、同档替换等高频风险词讲清楚，帮助业主在签约前知道这些词可能对应什么增项口子。',
  },
  {
    question: '看完风险词典就能判断报价能不能签吗？',
    answer: '不能只靠词典决定是否签约。词典适合理解风险词含义，真正判断还要结合整份报价、合同、付款节点和装修方式一起看。',
  },
  {
    question: '报价里出现“按实结算”一定不能签吗？',
    answer: '不一定。按实结算可以存在，但签约前要写清计量方式、单价、上限、确认流程和谁来验收，否则后期金额很容易失控。',
  },
]

export default function RiskDictionaryPage() {
  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: '装修报价风险词典',
            url: 'https://zenoaihome.com/risk-dictionary',
            description: '围绕装修签约前报价风险、合同边界和增项口子整理的风险词典。',
            inLanguage: 'zh-CN',
            hasPart: quoteRiskRules.map((rule) => ({
              '@type': 'DefinedTerm',
              name: rule.name,
              description: rule.oneLine,
              url: `https://zenoaihome.com/risk-dictionary/${rule.slug}`,
              termCode: rule.id,
              inDefinedTermSet: '装修报价风险词典',
            })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          },
        ]}
      />

      <PageHero
        label="看报价"
        title="装修报价风险词典"
        subtitle="报价单不是看总价，而是看边界。按报价风险词、材料品牌型号、数量面积、漏项和低价陷阱，把签约前必须问清的报价边界先看懂。"
        size="content"
      />

      <Container size="content" className="pt-8">
        <div className="flex flex-wrap gap-3">
          <CTA href="/tools/quote-check" label="先做免费报价初筛" variant="primary" />
          <CTA href="/checklists" label="查看检查模板" variant="secondary" />
        </div>
      </Container>

      <Container size="layout" className="py-section">
        <section className="mb-12 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">这个栏目解决什么</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">报价单不是看总价，而是看项目、材料、计量和增项入口。</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
            报价单里很多风险不是藏在专业术语里，而是藏在“按实结算、暂估、以现场为准、另计、不含”这些看似普通的词里。
            这个词典把每个风险拆成触发词、常见项目、签约前追问和合同备注建议，方便你回到自己的报价单逐项核对。
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {[
              ['搜索意图', '适合搜索“装修报价按实结算什么意思”“报价暂估有什么风险”“材料同档替换怎么问”的业主。'],
              ['页面关系', '词典负责解释风险词，报价初筛负责判断你自己的报价是否命中这些风险。'],
              ['下一步动作', '看完词条后，把对应追问写进报价备注、合同附件或微信确认话术。'],
            ].map(([title, body]) => (
              <div key={title} className="border border-border bg-surface p-4">
                <h3 className="text-sm font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6 border-l-2 border-stone/40 pl-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">20 个风险词条</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">先看跟你报价单最像的词，再点进详情页抄问题。</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {quoteRiskRules.map((rule) => (
              <article key={rule.id} className="border border-border bg-surface p-5">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className={`border px-2 py-0.5 text-xs font-semibold ${riskLevelClass[rule.riskLevel]}`}>
                    {rule.riskLevel}风险
                  </span>
                  <span className="border border-border bg-canvas px-2 py-0.5 text-xs text-ink-muted">
                    {rule.category}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-ink">{rule.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{rule.oneLine}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {rule.triggerTerms.slice(0, 3).map((term) => (
                    <span key={term} className="bg-stone-pale px-2 py-1 text-xs font-medium text-stone">
                      {term}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/risk-dictionary/${rule.slug}`}
                  className="mt-5 inline-flex text-sm font-semibold text-stone underline-offset-4 hover:underline"
                >
                  查看详情
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">下一步</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">如果你手里已经有报价单，先别只靠词典猜。</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
            不确定哪些风险与你有关，先做一次免费报价初筛。初筛会把漏项、模糊项、增项口子和付款风险先筛出来。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <CTA href="/tools/quote-check" label="先做免费报价初筛" variant="primary" />
            <CTA href="/checklists" label="查看检查模板" variant="secondary" />
            <CTA href="/services" label="查看人工报价复核" variant="secondary" />
          </div>
        </section>

        <section className="mt-10 border border-border bg-surface p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">常见问题</p>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {faqs.map((item) => (
              <div key={item.question}>
                <h2 className="text-sm font-semibold text-ink">{item.question}</h2>
                <p className="mt-2 text-sm leading-7 text-ink-muted">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </Container>
    </>
  )
}
