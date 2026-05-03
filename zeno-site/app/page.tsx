import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import StructuredData from '@/components/StructuredData'
import { getRecentArticles } from '@/data/articles'

export const metadata: Metadata = {
  title: '签合同前，先把报价、预算和验收风险看清楚',
  description:
    'ZenoAIHome 先帮普通装修业主看清报价单、预算表、合同条款和施工验收风险，再决定先做自测、拿清单还是进入人工判断。AI 只作为第二层辅助叙事出现。',
  alternates: {
    canonical: 'https://zenoaihome.com/',
  },
}

const riskCardItems = [
  {
    label: '报价单',
    title: '先找漏项、模糊项和另计项',
    detail: '主材辅材谁负责、水电按实怎么算、哪些项目后面最容易加钱。',
  },
  {
    label: '预算表',
    title: '先拆结构，不先猜总价',
    detail: '硬装、采购、预备金不拆开，后面就容易一边做一边补。',
  },
  {
    label: '合同',
    title: '先盯变更确认、验收标准和尾款条件',
    detail: '很多扯皮不是开工后才发生，而是签字前就埋下了。',
  },
  {
    label: '验收',
    title: '先看节点留证，不等竣工一起算',
    detail: '水电、防水、泥工、木作、油漆和竣工验收，每一步都要先拍、先留、先问。',
  },
]

const coreEntryCards = [
  {
    label: '报价',
    title: '报价单漏项、模糊项、另计项，先在签字前揪出来',
    description:
      '你可以接受一份报价贵一点，但不应该接受一份你看不懂的报价。先把容易漏掉的项目、写得模糊的工艺和后面可能另计的部分标出来。',
    bullets: ['柜体、五金、辅材到底谁负责', '水电按实结算到底怎么算', '哪些位置后面最容易被补报价'],
    href: '/resources#baojia-shenhe-qingdan',
    layoutClass: 'lg:col-span-5 lg:row-span-2',
  },
  {
    label: '预算',
    title: '预算超支，往往不是钱不够，而是顺序先乱了',
    description:
      '先把预算表拆成能追踪的结构，再决定哪里该省、哪里不能省。不要只拿一个总数硬顶全流程。',
    bullets: ['硬装、采购、预备金先分区', '别把家电和定制混成一笔糊涂账', '留出现场变化和增项缓冲'],
    href: '/tools/budget-risk',
    layoutClass: 'lg:col-span-7',
  },
  {
    label: '合同',
    title: '合同里最容易扯皮的，不是你以为的大条款',
    description:
      '很多问题都卡在一句没写清的话：变更怎么确认、验收按什么算、尾款什么时候付、增项怎么落字。',
    bullets: ['书面确认优先，别只靠微信口头说过', '验收标准写不清，后面很难对', '尾款条件不清，主动权就不在你手里'],
    href: '/start',
    layoutClass: 'lg:col-span-7',
  },
  {
    label: '验收',
    title: '水电增项、防水验收、节点留证，别等做完再回头翻',
    description:
      '施工阶段最怕“到时候再看”。每个节点看什么、拍什么、怎么留证，提前准备比后面补救便宜得多。',
    bullets: ['水电交底前先把点位和计价问清', '防水闭水和照片视频要留全', '竣工前先核对整改和书面确认'],
    href: '/resources#construction-checkpoints',
    layoutClass: 'lg:col-span-12',
  },
]

const transparencyPoints = [
  {
    title: '利益关系透明',
    description: '现阶段不靠建材返点、装修公司导流成交和隐形利益绑定来做内容判断。',
  },
  {
    title: '不为了佣金误导判断',
    description: '不会因为佣金、返点或合作关系，把原本该提醒你的风险说轻，或者把不适合你的东西说成适合。',
  },
  {
    title: '未来可以做产品，但要说明白',
    description: '以后如果这里出现自有工具、课程、精选产品或电商合作，会把推荐理由、适用场景和商业关系写清楚。',
  },
]

const pathSteps = [
  {
    step: '01',
    title: '免费文章、清单、自测',
    description: '先把问题缩到能判断的一层，再决定是不是要发材料。',
    href: '/start',
    ctaLabel: '先按问题进入',
  },
  {
    step: '02',
    title: '39 元签约前不踩坑指南',
    description: '低价入门产品。先把报价、预算、合同、增项这四件事串起来，不再零散地到处找答案。',
  },
  {
    step: '03',
    title: '399 预算咨询 / 699 报价审核',
    description: '预算结构没拆清，就先做预算咨询；手里已经有报价单，就直接进报价审核。',
    href: '/services/renovation',
    ctaLabel: '看人工判断服务',
  },
  {
    step: '04',
    title: '1499 签约前决策包',
    description: '规划中 / 内测中 / 可预约沟通。适合临近签约，想把报价、合同、预算和关键追问一起看的人。',
    href: '/contact',
    ctaLabel: '预约沟通',
  },
]

const aiWorkflowCards = [
  {
    label: '报价与预算',
    title: 'AI 帮你先把报价和预算问题整理出来',
    description: '把分散在报价单、预算表、聊天记录里的问题收拢成一份可追问的清单。',
  },
  {
    label: '验收与留证',
    title: 'AI 帮你整理节点检查项和留证动作',
    description: '把水电、防水、泥工、木作、油漆和竣工验收要拍的、要记的、要追问的先理顺。',
  },
  {
    label: '内容与工具',
    title: 'AI 帮我把现场经验沉淀成文章、资料和判断工具',
    description: '它擅长整理信息，不擅长承担关系，所以 AI 在这里始终是辅助，不是主角。',
  },
]

export default function HomePage() {
  const recentArticles = getRecentArticles(3)

  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Zeno AI Home',
            url: 'https://zenoaihome.com/',
            description:
              '先帮普通装修业主看清报价单、预算表、合同条款和施工验收风险，再决定先做自测、拿清单还是进入人工判断。',
            inLanguage: 'zh-CN',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: '首页四个核心入口',
            itemListElement: coreEntryCards.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.title,
              url: `https://zenoaihome.com${item.href}`,
            })),
          },
        ]}
      />

      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface-warm via-surface to-surface py-14 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(90deg,rgba(139,115,85,0.16),rgba(139,115,85,0))]" />
        <div className="pointer-events-none absolute left-[7%] top-0 hidden h-full w-px bg-border/70 lg:block" />
        <div className="pointer-events-none absolute bottom-0 right-[10%] hidden h-40 w-40 rounded-full bg-stone/10 blur-3xl lg:block" />
        <Container size="layout">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.04fr_0.96fr] lg:items-start lg:gap-10">
            <div className="relative lg:pt-4">
              <p className="page-label mb-4">ZenoAIHome · 装修判断入口</p>
              <h1 className="text-[clamp(2.2rem,5vw,4.25rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-ink max-w-4xl">
                签合同前，
                <br className="hidden sm:block" />
                先把报价、预算和验收风险看清楚。
              </h1>
              <p className="mt-5 max-w-2xl text-[1.03rem] leading-[1.95] text-ink-muted">
                我做了 16 年装修，见过报价单漏项、预算一路失控、合同条款没写清、节点返工和住进去才发现家并不顺手。这里先不讲大词，先帮普通业主把眼前最容易出事的地方拆开。
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-muted">
                不同城市价格不同，不同预算档位、不同工艺、不同施工队、不同合同约定和现场条件，最后判断都会变。所以这里不卖万能答案，只先帮你把风险重心看清。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CTA href="/tools/budget-risk" label="免费做预算风险自测" variant="primary" />
                <CTA href="/services/renovation" label="查看报价审核服务" variant="secondary" />
              </div>
              <div className="mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="border border-border bg-surface/95 px-4 py-4 shadow-[0_10px_26px_rgba(30,25,20,0.04)]">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-stone mb-2">先看证据</p>
                  <p className="text-sm leading-6 text-ink-muted">先看报价、预算、合同和验收节点，不先听口号。</p>
                </div>
                <div className="border border-border bg-surface/95 px-4 py-4 shadow-[0_10px_26px_rgba(30,25,20,0.04)]">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-stone mb-2">四个主入口</p>
                  <p className="text-sm leading-6 text-ink-muted">报价、预算、合同、验收先分开，问题才不会混成一团。</p>
                </div>
                <div className="border border-border bg-surface/95 px-4 py-4 shadow-[0_10px_26px_rgba(30,25,20,0.04)]">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-stone mb-2">内容系统</p>
                  <p className="text-sm leading-6 text-ink-muted">文章、清单、工具、轻产品和人工判断，前后是接得上的。</p>
                </div>
              </div>
            </div>

            <div className="relative lg:pt-2">
              <div className="overflow-hidden border border-border bg-surface shadow-[0_20px_50px_rgba(30,25,20,0.08)]">
                <div className="border-b border-border bg-surface-warm px-6 py-5">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-stone mb-2">签约前风险卡</p>
                  <h2 className="text-[1.3rem] font-semibold leading-tight text-ink">报价单风险体检卡</h2>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    适合已经拿到报价单、开始做预算，或者正准备签合同的人。先把最容易出事的点看一遍，再决定要不要往下走。
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {riskCardItems.map((item, index) => (
                      <div key={item.title} className="border border-border bg-surface-warm/70 px-4 py-4 shadow-[0_8px_20px_rgba(30,25,20,0.03)]">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-stone mb-1">{item.label}</p>
                            <p className="text-sm font-semibold leading-6 text-ink">{item.title}</p>
                          </div>
                          <span className="text-[0.72rem] font-semibold tracking-[0.08em] text-ink-faint">0{index + 1}</span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-ink-muted">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 border border-dashed border-border bg-surface px-4 py-4">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-ink-faint mb-2">这张卡能帮你先看什么</p>
                    <p className="text-sm leading-6 text-ink-muted">
                      报价贵不贵不是第一问题，有没有说清才是。装修超预算，不只是钱的问题，往往是顺序的问题。
                    </p>
                    <Link href="/services/renovation" className="mt-4 inline-block text-sm font-medium text-stone hover:underline underline-offset-2">
                      继续看报价审核服务 →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="pathways" className="border-b border-border py-16 sm:py-20">
        <Container size="layout">
          <div className="mb-10 max-w-3xl">
            <p className="page-label mb-3">四个核心入口</p>
            <h2 className="section-heading">别把所有风险混在一起。报价、预算、合同、验收，先一类一类看。</h2>
            <p className="mt-3 text-sm leading-7 text-ink-muted">
              这四块不是四张普通功能卡，而是普通业主签约前、开工前、施工中最容易出事的四个真实场景。
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:auto-rows-[minmax(180px,auto)]">
            {coreEntryCards.map((item, index) => (
              <Link
                key={item.title}
                href={item.href}
                className={`group flex flex-col border border-border bg-surface p-6 shadow-[0_12px_30px_rgba(30,25,20,0.04)] transition-transform duration-150 hover:-translate-y-0.5 ${item.layoutClass}`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-stone">{item.label}</p>
                  <span className="text-[0.75rem] font-semibold tracking-[0.08em] text-ink-faint">0{index + 1}</span>
                </div>
                <h3 className="text-[1.08rem] font-semibold leading-[1.45] text-ink group-hover:text-stone transition-colors">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-ink-muted">{item.description}</p>
                <ul className="mt-5 space-y-2 text-sm leading-6 text-ink-muted">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-stone" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <span className="mt-6 text-sm font-medium text-stone">进入对应入口 →</span>
              </Link>
            ))}
          </div>
          <div className="mt-5 border border-dashed border-border bg-surface-warm px-5 py-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-ink-faint mb-2">居住场景补充</p>
            <p className="text-sm leading-7 text-ink-muted">
              家不是样板间，是人长期生活的容器。如果你真正担心的是住进去以后不顺手，就回到家里真正怎么住：做饭频率、收纳习惯、老人小孩和居家办公怎么分配，这些会反过来影响前面的装修判断。
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-surface-warm py-16 sm:py-20">
        <Container size="layout">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.58fr_0.42fr] lg:items-start">
            <div>
              <div className="border border-border bg-surface px-6 py-7 shadow-[0_16px_36px_rgba(30,25,20,0.05)] sm:px-7 sm:py-8">
                <p className="page-label mb-3">信任说明</p>
                <h2 className="section-heading mb-4">我不是把资料堆给你自己猜，而是把现场里最容易踩坑的地方先指出来。</h2>
                <p className="text-base leading-8 text-ink mb-4">
                  这些判断不是网上整合来的，是 16 年现场经验一点点拧出来的：报价单里一行没写清的另计项，预算里那笔没单独留出来的预备金，合同里一句以后最容易扯皮的话，施工节点该留什么证据，住进去后哪些问题最常反噬回来。
                </p>
                <p className="text-sm leading-7 text-ink-muted">
                  这里的独立，不是“永远不卖任何东西”。更准确地说，是先帮业主建立判断力，再透明地提供工具、产品和服务。边界越清楚，后面越省时间。
                </p>
              </div>

              <div className="mt-6 border-l-2 border-stone pl-5">
                <p className="text-sm leading-7 text-ink-muted">
                  这里不是传统装修公司官网，也不是纯 AI 工具站，更不是漂亮但空泛的 SaaS Landing Page。先看证据，不先听口号，才是这个首页该做的事。
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {transparencyPoints.map((item) => (
                <div key={item.title} className="border border-border bg-surface px-5 py-5 shadow-[0_10px_24px_rgba(30,25,20,0.03)]">
                  <h3 className="text-base font-semibold text-ink mb-2">{item.title}</h3>
                  <p className="text-sm leading-7 text-ink-muted">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[0.36fr_0.64fr] lg:items-start">
            <div>
              <p className="page-label mb-3">抓手路径</p>
              <h2 className="section-heading">这站不是只卖服务，而是把现场经验往前接成内容、清单、工具和轻产品。</h2>
              <p className="mt-3 text-sm leading-7 text-ink-muted">
                你可以先自己判断，再决定要不要把材料发出来。路径要顺，钱才花得值。
              </p>
            </div>
            <div className="space-y-4">
              {pathSteps.map((item) => (
                <div key={item.step} className="flex gap-4 border-b border-border pb-4 last:border-b-0 last:pb-0">
                  <span className="pt-0.5 text-[0.74rem] font-semibold tracking-[0.08em] text-stone">{item.step}</span>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-ink">{item.title}</h3>
                    <p className="mt-1 text-sm leading-7 text-ink-muted">{item.description}</p>
                    {item.href ? (
                      <Link href={item.href} className="mt-2 inline-block text-sm font-medium text-stone hover:underline underline-offset-2">
                        {item.ctaLabel} →
                      </Link>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <Container size="layout">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:items-start">
            <div>
              <p className="page-label mb-3">AI 第二层叙事</p>
              <h2 className="section-heading">AI 落地装修全流程，但它只放在首页后半段。</h2>
              <p className="mt-3 text-base leading-8 text-ink">
                AI 不进首页首屏主位。它在这里的任务，是帮我把报价、预算、验收清单、内容资料和判断工具整理得更清楚，不是把网站写成 AI 装修平台。
              </p>
              <p className="mt-4 text-sm leading-7 text-ink-muted">
                工具可以提高效率，不能替代价值观。AI 不是替你判断，是帮你把判断放大。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <CTA href="/services/ai-workflow" label="看 AI 工作流入口" variant="secondary" />
                <CTA href="/blog/04-wei-shenme-wo-kaishi-renzheng-xue-ai" label="看 AI 相关文章" variant="ghost" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {aiWorkflowCards.map((item) => (
                <div key={item.title} className="border border-border bg-surface px-5 py-6 shadow-[0_10px_24px_rgba(30,25,20,0.03)]">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-stone mb-3">{item.label}</p>
                  <h3 className="text-base font-semibold leading-7 text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-ink-muted">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container size="layout">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.56fr_0.44fr] lg:items-start">
            <div>
              <div className="mb-8 max-w-3xl">
                <p className="page-label mb-3">最近写的</p>
                <h2 className="section-heading">先看几篇最能代表判断路径的文章。</h2>
                <p className="mt-3 text-sm leading-7 text-ink-muted">
                  不是按流量排，也不是为了把首页做成博客聚合页。先放能代表判断力和现场感的文章。
                </p>
              </div>
              <div className="border border-border bg-surface px-6 py-3 shadow-[0_12px_28px_rgba(30,25,20,0.04)]">
                {recentArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="compact" />
                ))}
              </div>
            </div>

            <div className="border border-border bg-surface-warm px-6 py-7 shadow-[0_18px_40px_rgba(30,25,20,0.06)] lg:sticky lg:top-24 sm:px-7 sm:py-8">
              <p className="page-label mb-3">下一步行动</p>
              <h2 className="section-heading mb-4">还没分清问题，就先做自测；已经拿到报价，就直接看人工判断。</h2>
              <p className="text-base leading-8 text-ink mb-4">
                这里不是把所有资料摊给你自己猜，而是先帮你找入口。你现在最该做的，不是把所有东西都看一遍，而是先走对一步。
              </p>
              <p className="text-sm leading-7 text-ink-muted mb-6">
                如果你还在摸清风险重心，先做预算风险自测；如果你已经有具体报价单、预算表或合同材料，就直接去看报价审核和人工判断服务。
              </p>
              <div className="space-y-3">
                <CTA href="/tools/budget-risk" label="免费做预算风险自测" variant="primary" />
                <CTA href="/services/renovation" label="查看报价审核服务" variant="secondary" />
                <CTA href="/resources" label="先去资料区拿清单" variant="ghost" />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
