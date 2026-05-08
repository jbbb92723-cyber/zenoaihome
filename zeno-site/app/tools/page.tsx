import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: '工具工作台',
  description:
    'ZenoAIHome 工具工作台：报价初筛、预算结构、单位换算、瓷砖计算、乳胶漆计算、验收节点向导和 AI 场景生成器。',
  alternates: {
    canonical: 'https://zenoaihome.com/tools',
  },
}

const toolGroups = [
  {
    title: '装修判断六件套',
    desc: '给普通业主从报价、预算、数量到验收建立一条完整的网页端判断链路。',
    tools: [
      {
        title: '报价初筛工具',
        status: '已上线',
        price: '免费',
        time: '8-15 分钟',
        job: '拿到报价单后，先找出漏项、模糊项、增项口子和付款风险。',
        output: '风险等级、追问清单、下一步服务入口。',
        href: '/tools/quote-check',
        cta: '开始初筛',
      },
      {
        title: '预算结构工具',
        status: '已上线',
        price: '免费',
        time: '5-8 分钟',
        job: '输入总预算和面积，把钱拆成硬装、主材、定制、设备、软装和缓冲。',
        output: '预算结构、单方参考、可复制的分配清单。',
        href: '/tools/budget-structure',
        cta: '拆预算',
      },
      {
        title: '单位换算工具',
        status: '已上线',
        price: '免费',
        time: '1-3 分钟',
        job: '看懂报价里的㎡、米、延米、坪和单方，减少被单位绕晕。',
        output: '常用单位换算结果和报价理解提醒。',
        href: '/tools/unit-converter',
        cta: '换算单位',
      },
      {
        title: '瓷砖计算器',
        status: '已上线',
        price: '免费',
        time: '3-5 分钟',
        job: '输入铺贴面积和瓷砖规格，估算片数、箱数和损耗。',
        output: '建议购买片数、箱数、损耗说明。',
        href: '/tools/tile-calculator',
        cta: '算瓷砖',
      },
      {
        title: '乳胶漆计算器',
        status: '已上线',
        price: '免费',
        time: '3-5 分钟',
        job: '输入墙面面积、涂布率和桶规格，估算底漆、面漆用量。',
        output: '底漆/面漆升数、桶数和采购提醒。',
        href: '/tools/paint-calculator',
        cta: '算乳胶漆',
      },
      {
        title: '验收节点向导',
        status: '已上线',
        price: '免费',
        time: '5-10 分钟',
        job: '按水电、防水、泥工、木作、油漆、安装和竣工生成验收清单。',
        output: '检查项、拍照点、高风险信号、可复制清单。',
        href: '/tools/inspection-guide',
        cta: '生成清单',
      },
    ],
  },
  {
    title: '诊断补充',
    desc: '当你已经有初步结果，但还不知道风险来自哪里，再进入诊断型工具。',
    tools: [
      {
        title: '预算风险自测',
        status: '已上线',
        price: '免费',
        time: '5-8 分钟',
        job: '预算越算越乱时，分清是报价、结构、流程还是需求问题。',
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
  ['手上有报价单', '先做报价初筛', '/tools/quote-check'],
  ['怕预算失控', '先拆预算结构', '/tools/budget-structure'],
  ['正在买材料', '先算数量和单位', '/tools/tile-calculator'],
  ['准备验收', '生成节点清单', '/tools/inspection-guide'],
  ['想用 AI 提效', '生成场景提示词', '/tools/prompts'],
  ['要发公众号', '进入创作工作台', '/tools/md2wechat'],
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
        subtitle="这里先把装修里的高频问题拆成 6 个能直接使用的工具：报价、预算、单位、瓷砖、乳胶漆和验收。AI 工具放在第二条线，服务传统行业人的升级。"
        note="工具看不明白的地方，可以找我帮你判断。"
        size="content"
      />

      <Container size="content" className="py-section">
        <section className="mb-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {routes.map(([situation, action, href]) => (
            <Link key={situation} href={href} className="group border border-border bg-surface p-5 transition-all duration-150 hover:-translate-y-1 hover:border-stone hover:bg-surface-warm hover:shadow-[0_16px_40px_rgba(42,39,35,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone">{situation}</p>
              <p className="mt-3 text-sm font-semibold leading-snug text-ink group-hover:text-stone">{action}</p>
            </Link>
          ))}
        </section>

        <section className="mb-12 border border-border bg-surface-warm p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.38fr_0.62fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone">为什么先做这 6 个工具</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">全国各地价格不同，但判断问题的顺序相似。</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['先判断结构', '报价、预算、单位、数量和验收先被拆清楚，用户才不会被总价和效果图牵着走。'],
                ['再承接服务', '工具只解决可标准化的问题，看不明白的地方再进入清单、文章、课程或人工判断。'],
                ['未来可翻译', '这套链路不依赖单一城市，后续可以扩展到英文装修预算、材料计算和验收指南。'],
              ].map(([title, body]) => (
                <div key={title} className="border border-border bg-canvas p-5">
                  <p className="text-sm font-semibold text-ink">{title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-ink-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>
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
            <CTA href="/resources" label="去资料页" variant="secondary" />
            <CTA href="/pricing" label="看课程和数字产品" variant="ghost" />
            <CTA href="/services#service-form" label="提交服务需求" variant="ghost" />
          </div>
        </div>
      </Container>
    </>
  )
}
