import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import CTA from '@/components/CTA'
import Container from '@/components/Container'
import PageHero from '@/components/PageHero'
import ResourceClaimButton from '@/components/resources/ResourceClaimButton'
import StructuredData from '@/components/StructuredData'
import { resources } from '@/data/resources'
import {
  projectRiskLibrary,
  quoteCheckTemplates,
  quoteRiskDictionary,
  quoteRiskRules,
} from '@/data/quote-risk'

export const metadata: Metadata = {
  title: '签约前报价风险资料库 | 风险词典、检查模板、报价清单',
  description:
    'ZenoAIHome 的签约前报价风险资料库：风险词典、风险规则库、检查模板、施工项目风险库和报价审核清单，帮助业主在签装修合同前看清边界。',
  alternates: {
    canonical: 'https://zenoaihome.com/resources',
  },
}

const mainResourceSlugs = ['baojia-shenhe-qingdan', 'zhuangxiu-yusuan-moban', 'yanshou-qingdan'] as const
const mainResources = resources.filter((resource) => mainResourceSlugs.includes(resource.slug as (typeof mainResourceSlugs)[number]))

const tagClasses: Record<string, string> = {
  装修: 'bg-stone-pale text-stone border border-stone/20',
  居住: 'bg-stone-pale/60 text-stone border border-stone/20',
  AI: 'bg-surface-warm text-stone border border-stone/20',
}

function ResourceCard({ resource }: { resource: (typeof resources)[number] }) {
  return (
    <article id={resource.slug} className="border border-border bg-surface">
      <div className="grid gap-0 md:grid-cols-[0.36fr_0.64fr]">
        <div className="relative min-h-48 border-b border-border bg-canvas md:min-h-full md:border-b-0 md:border-r">
          {resource.previewImage ? (
            <Image
              src={resource.previewImage}
              alt={resource.previewAlt ?? resource.title}
              fill
              sizes="(max-width: 768px) 100vw, 35vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-ink-faint">无预览图</div>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2 py-0.5 text-xs font-medium ${tagClasses[resource.tag] ?? 'bg-stone-pale text-stone border border-stone/20'}`}>
              {resource.tag}
            </span>
            <span className="text-xs text-stone">{resource.forWho}</span>
          </div>

          <h3 className="mt-3 text-lg font-semibold text-ink">{resource.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{resource.subtitle}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink">{resource.solves}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <ResourceClaimButton resourceId={resource.id} resourceTitle={resource.title} />
            <Link href={`/tools/quote-check#risk-library`} className="text-sm font-semibold text-stone underline-offset-4 hover:underline">
              看风险资产
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function ResourcesPage() {
  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: '签约前报价风险资料库',
            url: 'https://zenoaihome.com/resources',
            description: '围绕签约前报价、合同和付款节点风险沉淀的词典、规则、模板和清单。',
            inLanguage: 'zh-CN',
            hasPart: [
              ...quoteRiskDictionary.map((item) => ({
                '@type': 'DefinedTerm',
                name: item.term,
                description: item.plain,
              })),
              ...mainResources.map((resource) => ({
                '@type': 'DigitalDocument',
                name: resource.title,
                description: resource.description,
                url: `https://zenoaihome.com/resources#${resource.slug}`,
              })),
            ],
          },
        ]}
      />

      <PageHero
        label="签约前报价风险资料库"
        title="资料库只服务一件事：签约前把报价风险看清。"
        subtitle="这里不是装修百科。风险词典、规则库、检查模板和项目风险库，都围绕报价、合同、付款节点有没有说清。"
        size="content"
      />

      <Container size="content" className="py-section">
        <section className="mb-12 border border-stone/30 bg-stone/5 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">先走主路径</p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-ink">如果你手上已经有报价，先不要乱翻资料。</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            先做免费报价初筛，再用风险词典和检查模板补问题；如果仍然看不明白，再进入人工快审或签约前决策包。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <CTA href="/tools/quote-check" label="先做报价初筛" variant="primary" />
            <CTA href="#baojia-shenhe-qingdan" label="拿报价审核清单" variant="secondary" />
            <CTA href="/services/renovation" label="看三档人工服务" variant="ghost" />
          </div>
        </section>

        <section className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">资料库结构</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">人看得懂，AI 也能复用。</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {[
              ['风险词典', '把“漏项、模糊项、增项口子”说成人话。'],
              ['风险规则库', '告诉你什么情况要停下来追问。'],
              ['检查模板', '把问题整理成可复制的追问和合同补充。'],
              ['项目风险库', '按水电、防水、拆改等项目看风险。'],
            ].map(([title, body]) => (
              <div key={title} className="border border-border bg-surface p-5">
                <p className="text-sm font-semibold text-ink">{title}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <div className="mb-5 border-l-2 border-stone/40 pl-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">风险词典</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">业主看报价时最容易被绕晕的词，先解释清楚。</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {quoteRiskDictionary.map((item) => (
              <div key={item.term} className="border border-border bg-surface p-4">
                <h3 className="text-sm font-semibold text-ink">{item.term}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{item.plain}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink-faint">{item.whatToLookFor}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <div className="mb-5 border-l-2 border-stone/40 pl-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">风险规则库</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">不是吓唬你，而是告诉你什么时候该停下来问清楚。</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {quoteRiskRules.map((rule) => (
              <article key={rule.title} className="border border-border bg-surface p-5">
                <h3 className="text-base font-semibold text-ink">{rule.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">触发：{rule.trigger}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">原因：{rule.why}</p>
                <p className="mt-3 border-l-2 border-stone-light pl-3 text-sm leading-relaxed text-stone">追问：{rule.ask}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <div className="mb-5 border-l-2 border-stone/40 pl-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">检查模板</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">把“我有点担心”变成能发出去、能写进合同的问题。</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {quoteCheckTemplates.map((template) => (
              <article key={template.title} className="border border-border bg-surface p-5">
                <h3 className="text-base font-semibold text-ink">{template.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{template.use}</p>
                <p className="mt-3 text-xs leading-relaxed text-ink-faint">输出：{template.output}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <div className="mb-5 border-l-2 border-stone/40 pl-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">施工项目风险库</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">按报价单常见项目，先看最容易没说清的地方。</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {projectRiskLibrary.map((item) => (
              <article key={item.project} className="border border-border bg-surface p-5">
                <h3 className="text-base font-semibold text-ink">{item.project}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.commonRisk}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.keywords.map((keyword) => (
                    <span key={keyword} className="bg-stone-pale px-2 py-1 text-xs font-medium text-stone">
                      {keyword}
                    </span>
                  ))}
                </div>
                <ul className="mt-4 space-y-2">
                  {item.mustAsk.map((ask) => (
                    <li key={ask} className="text-sm leading-relaxed text-stone">- {ask}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-5 border-l-2 border-stone/40 pl-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">可领取资料</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">保留少量真正有用的资料，不把网站做成资料堆。</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {mainResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>

        <section className="border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">下一步</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">资料看完，还是要回到你的报价单。</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
            词典和模板只能帮你知道该看什么。真正决定能不能签，还是要看你手上那份报价和合同有没有把边界写清。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <CTA href="/tools/quote-check" label="回到报价初筛" variant="primary" />
            <CTA href="/pricing/baojia-guide" label="看 ¥39 指南" variant="secondary" />
            <CTA href="/services/renovation#baojia-shenhe" label="看 ¥699 快审" variant="ghost" />
          </div>
        </section>
      </Container>
    </>
  )
}

