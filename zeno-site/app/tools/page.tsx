import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: '工具工作台',
  description:
    'ZenoAIHome 工具工作台：报价初筛、预算风险自测、AI 场景生成器、公众号排版工作台。',
  alternates: {
    canonical: 'https://zenoaihome.com/tools',
  },
}

const toolGroups = [
  {
    title: '装修判断工具',
    desc: '给正在装修或准备装修的人，先把风险缩小到能行动。',
    tools: [
      {
        title: '报价初筛工具',
        status: '已上线',
        price: '免费',
        time: '8-15 分钟',
        job: '拿到报价单后，先找出漏项、模糊项、增项口子和付款风险。',
        output: '风险等级、追问清单、下一步服务入口。',
        href: '/tools/quote-check',
        cta: '上传报价单',
      },
      {
        title: '预算风险自测',
        status: '已上线',
        price: '免费',
        time: '5-8 分钟',
        job: '预算越算越乱时，先分清是报价问题、结构问题、流程问题还是需求问题。',
        output: '四类风险排序、对应资源、文章和服务建议。',
        href: '/tools/budget-risk',
        cta: '开始自测',
      },
    ],
  },
  {
    title: 'AI 赋能工具',
    desc: '给传统装修从业者和内容创作者，把真实经验接进 AI。',
    tools: [
      {
        title: 'AI 场景生成器',
        status: '已上线',
        price: '免费',
        time: '3-10 分钟',
        job: '把报价追问、客户沟通、施工留痕、内容选题变成可复制提示词。',
        output: '可直接复制到 Claude / ChatGPT 的提示词和执行清单。',
        href: '/tools/prompts',
        cta: '生成提示词',
      },
      {
        title: '创作工作台',
        status: '已上线',
        price: '免费',
        time: '按文章长度',
        job: '把 Markdown 文章转成公众号可用排版，服务内容资产沉淀。',
        output: '可复制粘贴的公众号排版结果。',
        href: '/tools/md2wechat',
        cta: '打开工作台',
      },
    ],
  },
]

const routes = [
  ['手上有报价单', '先走报价初筛', '/tools/quote-check'],
  ['怕预算失控', '先做预算自测', '/tools/budget-risk'],
  ['想用 AI 提效', '先生成一个场景提示词', '/tools/prompts'],
  ['要发公众号', '进创作工作台', '/tools/md2wechat'],
]

export default function ToolsPage() {
  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: '工具工作台',
            url: 'https://zenoaihome.com/tools',
            description: '可直接使用的装修判断和 AI 赋能工具入口。',
            inLanguage: 'zh-CN',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: '工具列表',
            itemListElement: toolGroups.flatMap((group) => group.tools).map((tool, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: tool.title,
              url: `https://zenoaihome.com${tool.href}`,
            })),
          },
        ]}
      />

      <PageHero
        label="工具工作台"
        title="不要先逛工具，先选你现在要解决的问题"
        subtitle="这里的工具只服务两件事：一是帮业主建立装修判断力，二是帮传统装修从业者把经验接进 AI。每个工具都必须给你一个可带走的结果。"
        note="工具之后才是清单、文章、课程或服务。路径清楚，交付才有意义。"
        size="content"
      />

      <Container size="content" className="py-section">
        <section className="mb-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {routes.map(([situation, action, href]) => (
            <Link key={situation} href={href} className="group border border-border bg-surface p-5 transition-all duration-150 hover:-translate-y-1 hover:border-stone hover:bg-surface-warm hover:shadow-[0_16px_40px_rgba(42,39,35,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone">{situation}</p>
              <p className="mt-3 text-sm font-semibold leading-snug text-ink group-hover:text-stone">{action}</p>
            </Link>
          ))}
        </section>

        <div className="space-y-12">
          {toolGroups.map((group) => (
            <section key={group.title}>
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone">{group.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{group.desc}</p>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {group.tools.map((tool) => (
                  <article key={tool.title} className="border border-border bg-surface p-6 transition-all duration-150 hover:border-stone/70 hover:shadow-[0_18px_46px_rgba(42,39,35,0.07)]">
                    <div className="flex flex-wrap gap-2 text-[0.68rem] font-semibold uppercase tracking-widest">
                      <span className="text-stone">{tool.status}</span>
                      <span className="text-ink-faint">{tool.price}</span>
                      <span className="text-ink-faint">{tool.time}</span>
                    </div>
                    <h2 className="mt-3 text-lg font-semibold text-ink">{tool.title}</h2>
                    <dl className="mt-4 grid gap-4 text-sm">
                      <div>
                        <dt className="font-semibold text-ink">解决什么</dt>
                        <dd className="mt-1 leading-relaxed text-ink-muted">{tool.job}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-ink">你会得到什么</dt>
                        <dd className="mt-1 leading-relaxed text-ink-muted">{tool.output}</dd>
                      </div>
                    </dl>
                    <Link href={tool.href} className="mt-6 inline-flex h-10 items-center bg-stone px-4 text-sm font-semibold text-white transition-colors hover:bg-stone/90">
                      {tool.cta}
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14 grid gap-5 border border-border bg-surface-warm p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">下一步</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              如果工具已经帮你得到结果，下一步不是继续乱看，而是按结果进入清单、课程或服务。工具看不明白的地方，可以找我帮你判断。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CTA href="/resources" label="去资料库" variant="secondary" />
            <CTA href="/pricing" label="看课程和数字产品" variant="ghost" />
            <CTA href="/services#service-form" label="提交服务需求" variant="ghost" />
          </div>
        </div>
      </Container>
    </>
  )
}
