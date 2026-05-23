import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import StructuredData from '@/components/StructuredData'
import { checklistTemplates } from '@/data/checklist-templates'

export const metadata: Metadata = {
  title: '装修签约前检查模板｜报价、合同、水电和付款节点清单',
  description:
    '提供报价单初查、合同签约前检查、水电改造、老房翻新和付款节点检查模板，帮助业主在装修签字前逐项核对风险边界。',
  alternates: {
    canonical: 'https://zenoaihome.com/checklists',
  },
}

const faqs = [
  {
    question: '签约前检查模板适合什么时候用？',
    answer: '适合已经拿到报价单、合同草稿或付款节点截图时使用。没有具体材料时，模板只能帮你了解方向，不能替代对真实报价的判断。',
  },
  {
    question: '合同签约前最应该检查什么？',
    answer: '优先检查口头承诺是否写入合同、材料替换规则是否明确、付款节点是否和验收绑定、增项确认流程是否需要业主书面同意。',
  },
  {
    question: '检查模板能直接发给装修公司吗？',
    answer: '可以把模板里的问题整理成追问清单发给装修公司，但建议让对方把回答写进报价备注、合同附件或微信确认记录里。',
  },
]

export default function ChecklistsPage() {
  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: '签约前检查模板',
            url: 'https://zenoaihome.com/checklists',
            description: '围绕装修签约前报价、合同、水电、老房翻新和付款节点整理的检查模板。',
            inLanguage: 'zh-CN',
            hasPart: checklistTemplates.map((template) => ({
              '@type': 'HowTo',
              name: template.title,
              description: template.subtitle,
              url: `https://zenoaihome.com/checklists/${template.slug}`,
              step: template.sections.flatMap((section) =>
                section.items.map((item) => ({
                  '@type': 'HowToStep',
                  name: item.check,
                  text: item.why,
                })),
              ),
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
        label="看合同"
        title="销售说过的话，不等于合同里有保障。"
        subtitle="围绕口头承诺、付款节点、延期责任、材料替换、质保范围和增项确认流程，签约前逐项对照。"
        size="content"
      />

      <Container size="content" className="pt-8">
        <div className="flex flex-wrap gap-3">
          <CTA href="/tools/quote-check" label="我先做报价初筛" variant="primary" />
          <CTA href="/risk-dictionary" label="查看风险词典" variant="secondary" />
        </div>
      </Container>

      <Container size="layout" className="py-section">
        <section className="mb-12 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">这个栏目解决什么</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">把“对方说过”变成“合同里写清”。</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
            如果你刚拿到报价，先看报价单初查；已经临近签约，就看合同和付款节点；
            如果是水电多、老房翻新，就优先看对应模板。每张模板都可以照着问，也可以复制成自己的追问清单。
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {[
              ['解决的问题', '把“销售说过”变成“报价或合同里写清”，减少口头承诺和后期扯皮。'],
              ['适合的阶段', '拿到报价、合同草稿、付款节点截图后使用；没有报价时先不用买人工服务。'],
              ['和工具关系', '报价初筛发现问题，检查模板负责把问题变成可以逐项确认的清单。'],
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
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">5 个检查模板</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">不做资料堆，只保留签约前最常用的检查入口。</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {checklistTemplates.map((template) => (
              <article key={template.id} className="border border-border bg-surface p-5">
                <h2 className="text-base font-semibold text-ink">{template.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{template.subtitle}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {template.suitableFor.slice(0, 2).map((item) => (
                    <span key={item} className="bg-stone-pale px-2 py-1 text-xs font-medium text-stone">
                      {item}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/checklists/${template.slug}`}
                  className="mt-5 inline-flex text-sm font-semibold text-stone underline-offset-4 hover:underline"
                >
                  查看模板
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">临近签约时</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">模板适合自查，不适合替你做最终判断。</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
            如果你已经临近签约，不建议只靠模板自己判断。可以先做免费报价初筛；
            如果报价、合同和付款节点一起看不清，再进入对应的人工判断服务。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <CTA href="/tools/quote-check" label="先做免费报价初筛" variant="primary" />
            <CTA href="/services/renovation" label="查看服务" variant="secondary" />
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
