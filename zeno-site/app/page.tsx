import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import HeroTagline from '@/components/HeroTagline'
import StructuredData from '@/components/StructuredData'
import { getRecentArticles } from '@/data/articles'

export const metadata: Metadata = {
  title: '装修判断、真实居住与 AI 工作流',
  description:
    '先分清你现在是装修判断问题，还是真实居住问题，还是传统行业里的 AI 工作流问题。入口先清楚，再决定看文章、拿资料还是找我。',
  alternates: {
    canonical: 'https://zenoaihome.com/',
  },
}

const pathwayCards = [
  {
    label: '签约前',
    title: '报价和合同看不清，先到这里',
    description: '如果你手上已经有报价单，但还分不清哪些是模糊项、漏项和后续增项风险。',
    href: '/resources#sign-before-contract',
  },
  {
    label: '预算结构',
    title: '预算越做越乱，先把结构理清',
    description: '不是继续猜总价，而是先把预算拆成能追踪的几个结构层。',
    href: '/resources#zhuangxiu-yusuan-moban',
  },
  {
    label: '施工中',
    title: '已经开工了，先盯施工节点',
    description: '别等竣工再看。每个阶段看什么、怎么留痕、哪里最容易出问题，都先摆出来。',
    href: '/resources#construction-checkpoints',
  },
  {
    label: '真实居住',
    title: '住进去后不顺手，问题通常更早',
    description: '如果你已经感到空间不服务生活，先回到真实需求，而不是继续加风格词。',
    href: '/resources#living-beyond-completion',
  },
  {
    label: '传统行业 + AI',
    title: '想把 AI 接进业务，先跑一个真实场景',
    description: '不是先学一堆工具，而是先找出你今天最重复、最耗时、最值得接进 AI 的那一步。',
    href: '/resources#traditional-industry-ai',
  },
]

const serviceEntranceCards = [
  {
    label: '装修相关咨询',
    title: '报价、预算和真实居住判断服务',
    description: '给普通装修业主。先分清你现在是签约前风险、预算失控，还是需求没厘清。',
    href: '/services/renovation',
    image: '/images/services/renovation-judgment-proof.svg',
    imageAlt: '装修判断服务的报价审核与预算结构示意图',
  },
  {
    label: 'AI 轻交付咨询',
    title: '传统行业人的 AI 工作流入口',
    description: '给已经有业务、内容或服务场景的人。先跑通一个环节，再决定是否继续搭系统。',
    href: '/services/ai-workflow',
    image: '/images/services/ai-workflow-proof.svg',
    imageAlt: 'AI 工作流咨询的真实场景拆解示意图',
  },
]

const evidenceCards = [
  {
    title: '报价审核不是一句“贵不贵”',
    description: '先把模糊项、漏项和后期扯皮点标出来，你才知道该问什么。',
    href: '/resources#baojia-shenhe-qingdan',
    image: '/images/resources/quote-checklist-preview.svg',
    imageAlt: '报价审核清单示意图',
  },
  {
    title: '施工验收要按节点提前拦',
    description: '水电、泥工、木作、油漆都不是做完再看。每一步都要有自己的检查口。',
    href: '/resources#construction-checkpoints',
    image: '/images/resources/acceptance-checkpoints.svg',
    imageAlt: '施工节点验收示意图',
  },
  {
    title: 'AI 要接进真实工作，而不是接进想象',
    description: '把任务拆成几步，再决定 AI 接哪里。这样才不会一开始就掉进工具堆里。',
    href: '/resources#traditional-industry-ai',
    image: '/images/resources/explainer-storyboard.svg',
    imageAlt: '传统行业 AI 工作流示意图',
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
              '装修判断、真实居住和传统行业 AI 工作流入口。先分清问题，再决定看资料、文章还是服务。',
            inLanguage: 'zh-CN',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: '首页问题入口',
            itemListElement: pathwayCards.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.title,
              url: `https://zenoaihome.com${item.href}`,
            })),
          },
        ]}
      />

      <section className="border-b border-border py-14 sm:py-20">
        <Container size="layout">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <p className="text-[0.7rem] font-semibold tracking-[0.1em] uppercase text-stone mb-5">Zeno · 赞诺</p>
              <h1 className="text-[1.75rem] sm:text-[2rem] md:text-[2.5rem] font-semibold leading-[1.22] tracking-[-0.02em] text-ink mb-5 max-w-3xl">
                装修判断、真实居住，
                <br className="hidden sm:block" />
                以及传统行业人怎么把 AI 接进真实工作。
              </h1>
              <p className="text-base text-ink-muted leading-[1.85] max-w-2xl mb-4">
                这里不是泛泛的“服务与合作”页，也不是把所有资料摊给你自己挑。先分清你现在遇到的是哪类问题，再决定该看文章、拿清单模板，还是直接找我帮你看。
              </p>
              <p className="text-sm text-ink-muted/85 leading-relaxed max-w-2xl mb-4">
                装修是我进入这个时代的现实入口。AI 不是换赛道，而是把传统行业里的判断、表达和服务流程继续往前推进。
              </p>
              <p className="text-sm text-stone/80 italic mb-8 h-6">
                <HeroTagline />
              </p>
              <div className="flex flex-wrap gap-3">
                <CTA href="/start" label="按问题找入口" variant="primary" />
                <CTA href="/services" label="直接找我帮你看" variant="secondary" />
              </div>
            </div>

            <div className="border border-border bg-surface overflow-hidden">
              <div className="border-b border-border bg-surface-warm px-6 py-5">
                <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">先别急着全站乱看</p>
                <h2 className="text-lg font-semibold text-ink">先确认你更像哪一类人</h2>
              </div>
              <div className="p-6 space-y-5">
                <Link href="/services/renovation" className="group block border border-border bg-surface-warm p-5 hover:bg-stone-pale/40 transition-colors">
                  <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">普通装修业主</p>
                  <p className="text-base font-semibold text-ink group-hover:text-stone transition-colors mb-2">先看装修判断入口</p>
                  <p className="text-sm text-ink-muted leading-relaxed">适合已经拿到报价、开始做预算，或者住进去后发现“这个家并不服务生活”的人。</p>
                </Link>
                <Link href="/services/ai-workflow" className="group block border border-border bg-surface-warm p-5 hover:bg-stone-pale/40 transition-colors">
                  <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">传统行业从业者</p>
                  <p className="text-base font-semibold text-ink group-hover:text-stone transition-colors mb-2">先看 AI 工作流入口</p>
                  <p className="text-sm text-ink-muted leading-relaxed">适合已经在做内容、沟通、资料整理或轻交付服务，但想先跑通一个 AI 场景的人。</p>
                </Link>
                <div className="border border-border p-5">
                  <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">先看证据</p>
                  <p className="text-sm text-ink-muted leading-relaxed">这站里的媒体和示意图不是装饰，它们对应清单、流程和判断方法，目的是让你先看到“交付长什么样”。</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="pathways" className="border-b border-border py-16 sm:py-20 scroll-mt-20">
        <Container size="layout">
          <div className="mb-10 max-w-3xl">
            <p className="page-label mb-3">按问题进入</p>
            <h2 className="section-heading">你现在卡在哪一步，就从那一步进</h2>
            <p className="text-sm text-ink-muted mt-2 leading-relaxed">
              我不想让你在首页上看到一堆抽象身份标签。真正更有效的入口，是你眼下最具体的那个问题。
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {pathwayCards.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group border border-border bg-surface p-5 card-hover flex flex-col"
              >
                <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-3">{item.label}</p>
                <h3 className="text-base font-semibold text-ink mb-3 leading-snug group-hover:text-stone transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed flex-1">{item.description}</p>
                <span className="text-xs text-stone mt-5">进入对应入口 →</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 sm:py-20 bg-surface-warm">
        <Container size="layout">
          <div className="mb-10 max-w-3xl">
            <p className="page-label mb-3">服务入口</p>
            <h2 className="section-heading">首页上的“找我帮你看”，现在拆成两条明确入口</h2>
            <p className="text-sm text-ink-muted mt-2 leading-relaxed">
              装修相关咨询放在前面，AI 轻交付咨询单独成页。你不用先理解我的全部业务，再猜自己该去哪一页。
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {serviceEntranceCards.map((item) => (
              <Link key={item.title} href={item.href} className="group border border-border bg-surface overflow-hidden card-hover">
                <div className="relative aspect-[16/10] border-b border-border bg-stone-pale/30">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 520px"
                  />
                </div>
                <div className="p-6 sm:p-7">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-3">{item.label}</p>
                  <h3 className="text-xl font-semibold text-ink mb-3 leading-snug group-hover:text-stone transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{item.description}</p>
                  <span className="text-sm text-stone mt-5 inline-block">进入这条入口 →</span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <Container size="layout">
          <div className="mb-10 max-w-3xl">
            <p className="page-label mb-3">可验证证据</p>
            <h2 className="section-heading">先看 3 张图，再决定要不要继续看下去</h2>
            <p className="text-sm text-ink-muted mt-2 leading-relaxed">
              这些示意图对应的不是概念，而是清单、节点和流程骨架。你至少能先看见它们解决什么问题。
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {evidenceCards.map((item) => (
              <Link key={item.title} href={item.href} className="group border border-border bg-surface overflow-hidden card-hover">
                <div className="relative aspect-[16/10] border-b border-border bg-stone-pale/25">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 360px"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-ink mb-2 group-hover:text-stone transition-colors">{item.title}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <Container size="content">
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <p className="page-label mb-3">最近写的</p>
              <h2 className="section-heading">先看几篇最能代表判断路径的文章</h2>
              <p className="text-sm text-ink-muted mt-2">不是流量最高的，而是最能看出我如何判断的。</p>
            </div>
            <Link href="/blog" className="text-sm text-stone hover:underline underline-offset-2 shrink-0 pb-1">
              全部文章 →
            </Link>
          </div>
          <div>
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container size="content">
          <div className="border border-border bg-surface p-7 sm:p-9">
            <p className="page-label mb-3">站点立场</p>
            <h2 className="section-heading mb-4">这个站为什么同时讨论装修、居住和 AI</h2>
            <p className="text-base text-ink leading-relaxed mb-4">
              因为我不打算把装修经验停在“教你怎么装”这一层。装修现场教会我的，是怎么在噪音、信息差和现实限制里做判断。AI 只是把这些判断继续往前推进的工具。
            </p>
            <p className="text-sm text-ink-muted leading-relaxed mb-6">
              所以你在这里看到的不是杂糅，而是一条连续路径：从真实问题出发，把经验变成内容、工具、服务和长期资产。
            </p>
            <div className="flex flex-wrap gap-3">
              <CTA href="/about" label="了解我是谁" variant="secondary" />
              <CTA href="/topics" label="看所有专题" variant="ghost" />
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
