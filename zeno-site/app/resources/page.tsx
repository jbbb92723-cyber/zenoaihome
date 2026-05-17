import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import CTA from '@/components/CTA'
import Container from '@/components/Container'
import PageHero from '@/components/PageHero'
import ResourceClaimButton from '@/components/resources/ResourceClaimButton'
import SectionHeader from '@/components/SectionHeader'
import { resources } from '@/data/resources'

export const metadata: Metadata = {
  title: '装修判断力资源入口 | 按问题拿清单和工具',
  description:
    '按报价风险、签约前判断、预算分配、施工验收和居住需求拿清单、模板和工具，先解决当前问题，再进入更深入服务。',
  alternates: {
    canonical: 'https://zenoaihome.com/resources',
  },
}

const quickEntries = [
  {
    title: '我正在看报价单',
    description: '先把漏项、模糊项、异常单价和后期增项口子筛一遍。',
    primary: { label: '拿报价风险清单', href: '#baojia-shenhe-qingdan' },
    secondary: { label: '先做报价初筛', href: '/tools/quote-check' },
  },
  {
    title: '我快要签合同了',
    description: '报价、预算、合同和付款节点一起看，别只听口头承诺。',
    primary: { label: '拿报价审核清单', href: '#baojia-shenhe-qingdan' },
    secondary: { label: '看签约前决策包', href: '/services/renovation#qianyue-qian-juece-bao' },
  },
  {
    title: '我怕装修超预算',
    description: '先看这笔钱更像简约够住、舒适耐用，还是精致改善，再查为什么会超。',
    primary: { label: '拿装修预算模板', href: '#zhuangxiu-yusuan-moban' },
    secondary: { label: '拆预算分配', href: '/tools/budget-structure' },
  },
  {
    title: '我已经开工了',
    description: '按施工节点看该检查什么、该拍什么、哪些问题要先留证据。',
    primary: { label: '拿验收清单', href: '#yanshou-qingdan' },
    secondary: { label: '生成验收向导', href: '/tools/inspection-guide' },
  },
]

const stageBlocks = [
  {
    id: 'people',
    label: '① 先看人',
    anchor: 'people',
    title: '先看人：业主 / 家人 / 需求',
    subtitle: '先把真实需求和家人意见写清楚，别被风格和预算带偏。',
    resourceIds: ['shizhu-pai-zijian-biao'],
    tools: [],
    services: [],
  },
  {
    id: 'budget',
    label: '② 再看钱',
    anchor: 'budget',
    title: '再看钱：预算 / 分配 / 风险',
    subtitle: '预算分配和风险识别是决策底线，先分清楚再谈优化。',
    resourceIds: ['zhuangxiu-yusuan-moban'],
    tools: [
      { label: '预算分配工具', href: '/tools/budget-structure', desc: '把钱先拆开，再看哪一块更容易失控。' },
      { label: '超预算原因自测', href: '/tools/budget-risk', desc: '先分清是报价、流程，还是需求本身在失控。' },
    ],
    services: [{ label: '预算取舍诊断', href: '/services/renovation#yusuan-zixun', desc: '预算越乱，越要先判断哪些钱该守住。' }],
  },
  {
    id: 'contract',
    label: '③ 再看合同',
    anchor: 'contract',
    title: '再看合同：报价 / 合同 / 付款',
    subtitle: '报价、合同、付款节点是签约前的核心，别只看总价和优惠。',
    resourceIds: ['baojia-shenhe-qingdan'],
    tools: [{ label: '报价初筛工具', href: '/tools/quote-check', desc: '先把报价里的边界筛一遍，再谈签不签。' }],
    services: [
      { label: '报价风险快审', href: '/services/renovation#baojia-shenhe', desc: '已有报价单，先看最容易出问题的地方。' },
      { label: '签约前决策包', href: '/services/renovation#qianyue-qian-juece-bao', desc: '报价、预算、合同一起乱时，一次看全。' },
    ],
  },
  {
    id: 'build',
    label: '④ 再看施工',
    anchor: 'build',
    title: '再看施工：工序 / 节点 / 留证',
    subtitle: '施工阶段重点是节点验收和证据留存，别等出问题才补救。',
    resourceIds: [],
    tools: [{ label: '验收节点向导', href: '/tools/inspection-guide', desc: '按节点生成检查顺序，别临场乱看。' }],
    services: [],
  },
  {
    id: 'inspect',
    label: '⑤ 再看验收',
    anchor: 'inspect',
    title: '再看验收：检查 / 整改 / 交付',
    subtitle: '验收不是走流程，要提前知道每步查什么、怎么整改。',
    resourceIds: ['yanshou-qingdan'],
    tools: [],
    services: [],
  },
  {
    id: 'living',
    label: '⑥ 再看居住',
    anchor: 'living',
    title: '再看居住：场景 / 习惯 / 改善',
    subtitle: '居住改善是终点也是起点，先看真实生活再谈风格升级。',
    resourceIds: ['shizhu-pai-zijian-biao'],
    tools: [],
    services: [{ label: '居住场景装修服务', href: '/services/renovation#shi-zhu-pai-zhuangxiu', desc: '适合重视长期体验的人。' }],
  },
] as const

const tagClasses: Record<string, string> = {
  装修: 'bg-stone-pale text-stone border border-stone/20',
  居住: 'bg-stone-pale/60 text-stone border border-stone/20',
  AI: 'bg-surface-warm text-stone border border-stone/20',
}

function ResourceCard({ resource }: { resource: (typeof resources)[number] }) {
  return (
    <article id={resource.slug} className="border border-border bg-surface">
      <div className="grid gap-0 md:grid-cols-[0.38fr_0.62fr]">
        <div className="relative min-h-52 border-b border-border bg-canvas md:min-h-full md:border-b-0 md:border-r">
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
            <Link href={`/resources#${resource.slug}`} className="text-sm font-semibold text-stone underline-offset-4 hover:underline">
              查看详情
            </Link>
            <ResourceClaimButton resourceId={resource.id} resourceTitle={resource.title} />
          </div>
        </div>
      </div>
    </article>
  )
}

export default function ResourcesPage() {
  const claimableResources = resources

  return (
    <>
      <PageHero
        label="装修判断力资源入口"
        title="按你卡住的问题，拿对应清单和工具"
        subtitle="先找到你现在最难判断的那一步，再拿清单、模板或工具。材料已经具体的，再进人工服务。"
        size="content"
      />

      <Container size="content" className="py-section">
        <section className="mb-12 border border-stone/30 bg-stone/5 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">签约前优先</p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-ink">如果你手上已经有报价，先别从资料库乱翻。</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            先走报价初筛，再拿报价审核清单；如果要自己系统看，进 ¥39 指南；如果已经临近签约，再看人工快审或决策包。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <CTA href="/tools/quote-check" label="先做报价初筛" variant="primary" />
            <CTA href="#baojia-shenhe-qingdan" label="拿报价审核清单" variant="secondary" />
            <CTA href="/pricing/baojia-guide" label="看 ¥39 指南" variant="ghost" />
          </div>
        </section>

        <section className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">按问题进入</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">先把当前问题定位准，再拿对应入口。</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {quickEntries.map((card) => (
              <div key={card.title} className="border border-border bg-surface p-5 sm:p-6">
                <h3 className="text-base font-semibold text-ink">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{card.description}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link href={card.primary.href} className="text-sm font-medium text-stone underline-offset-4 hover:underline">
                    {card.primary.label}
                  </Link>
                  <Link href={card.secondary.href} className="text-sm font-medium text-ink-muted underline-offset-4 hover:text-stone hover:underline">
                    {card.secondary.label}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">内容路径</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">6 个阶段，不是 6 个堆叠栏目。</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {stageBlocks.map((stage) => (
              <a
                key={stage.id}
                href={`#${stage.anchor}`}
                className="border border-stone/30 px-3 py-1.5 text-xs font-medium text-stone transition-colors hover:bg-stone-pale"
              >
                {stage.label}
              </a>
            ))}
          </div>
        </section>

        {stageBlocks.map((stage) => {
          const stageResourceIds = stage.resourceIds as readonly string[]
          const stageResources = claimableResources.filter((resource) => stageResourceIds.includes(resource.slug))

          return (
            <section key={stage.id} id={stage.anchor} className="mb-16 scroll-mt-20">
              <SectionHeader label={stage.label} title={stage.title} subtitle={stage.subtitle} />

              {stageResources.length > 0 && (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {stageResources.map((resource) => (
                    <div key={resource.id} className="border border-border bg-surface p-5">
                      <p className={`inline-flex px-2 py-0.5 text-xs font-medium ${tagClasses[resource.tag] ?? 'bg-stone-pale text-stone border border-stone/20'}`}>
                        {resource.tag}
                      </p>
                      <h3 className="mt-3 text-base font-semibold text-ink">{resource.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{resource.subtitle}</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Link href={`#${resource.slug}`} className="text-sm font-medium text-stone underline-offset-4 hover:underline">
                          查看详情
                        </Link>
                        <ResourceClaimButton resourceId={resource.id} resourceTitle={resource.title} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {stage.tools.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-semibold text-ink">工具</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {stage.tools.map((tool) => (
                      <Link key={tool.href} href={tool.href} className="border border-border bg-surface p-5 transition-colors hover:border-stone hover:bg-surface-warm">
                        <p className="text-sm font-semibold text-ink">{tool.label}</p>
                        <p className="mt-2 text-xs leading-relaxed text-ink-muted">{tool.desc}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {stage.services.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-semibold text-ink">服务</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {stage.services.map((service) => (
                      <Link key={service.href} href={service.href} className="border border-border bg-surface p-5 transition-colors hover:border-stone hover:bg-surface-warm">
                        <p className="text-sm font-semibold text-ink">{service.label}</p>
                        <p className="mt-2 text-xs leading-relaxed text-ink-muted">{service.desc}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )
        })}

        <section className="mb-16">
          <SectionHeader
            label="方法层 / AI 延伸"
            title="AI 只能放大你的判断，不能替你做判断"
            subtitle="内容生产、提示词和个人工作流的入口放在这里。主问题如果还是装修签约前判断，先回到前面的报价和预算工具。"
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link href="/tools/prompts" className="group border border-stone/30 bg-stone/5 p-6 transition-colors hover:bg-stone/10 sm:col-span-2 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-widest text-stone">延伸工具</p>
                  <p className="text-base font-semibold text-ink transition-colors group-hover:text-stone">AI 提示词体验场</p>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-muted">
                    选场景、填情况、一键生成可直接用的提示词。重点不是炫技，而是让真实任务更容易推进。
                  </p>
                </div>
                <span className="mt-1 shrink-0 text-xl text-stone transition-transform group-hover:translate-x-1">-&gt;</span>
              </div>
            </Link>

            <Link href="/tools/md2wechat" className="group border border-border bg-surface p-5 transition-colors hover:bg-surface-warm sm:p-6">
              <p className="text-sm font-semibold text-ink transition-colors group-hover:text-stone">Markdown 微信排版工具</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">把 Markdown 文稿转成微信公众号排版，用于内容中台的日常发布。</p>
              <p className="mt-3 text-xs text-stone">立即使用 -&gt;</p>
            </Link>

            <Link href="#ai-neirong-gongzuoliu-tishici-bao" className="group border border-border bg-surface p-5 transition-colors hover:border-stone hover:bg-surface-warm sm:p-6">
              <p className="text-sm font-semibold text-ink transition-colors group-hover:text-stone">AI 工作流提示词包</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">如果你想把经验放大成可复用流程，可以先看这份提示词资料。</p>
              <p className="mt-3 text-xs text-stone">查看资料 -&gt;</p>
            </Link>

            <Link href="/services/ai-workflow" className="group border border-border bg-surface p-5 transition-colors hover:border-stone hover:bg-surface-warm sm:p-6">
              <p className="text-sm font-semibold text-ink transition-colors group-hover:text-stone">AI 工作流咨询</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">工具跑不通时，再进入人工拆解，把重复任务先梳理成流程。</p>
              <p className="mt-3 text-xs text-stone">看服务 -&gt;</p>
            </Link>
          </div>
        </section>

        <section className="mb-12">
          <SectionHeader
            label="资料领取区"
            title="所有清单、模板和工具"
            subtitle="如果你已经知道要找哪一份，直接从这里领取。前面的阶段入口负责帮你判断先用哪一份。"
          />

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {claimableResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>

        <section className="border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">需要更深入的帮助</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">工具不够时，再进入人工判断。</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
            先用免费工具建立基本判断，再决定是否需要更具体的报价、预算或签约前服务。不要一上来就把问题直接丢进高客单。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <CTA href="/pricing/baojia-guide" label="看 ¥39 报价指南" variant="primary" />
            <CTA href="/tools/quote-check" label="先做报价初筛" variant="secondary" />
            <CTA href="/blog" label="看文章" variant="ghost" />
          </div>
        </section>
      </Container>
    </>
  )
}
