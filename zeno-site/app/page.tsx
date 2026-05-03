import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'
import Container from '@/components/Container'
import SectionHeader from '@/components/SectionHeader'
import CTASection from '@/components/CTASection'
import StructuredData from '@/components/StructuredData'
import { getArticleBySlug } from '@/data/articles'

type RouteCard = {
  title: string
  desc: string
  href: string
}

type ActionCard = {
  label: string
  title: string
  desc: string
  href: string
}

type CaseReview = {
  slug: string
  label: string
  takeaway: string
}

export const metadata: Metadata = {
  title: '先把装修报价、预算、施工和真实居住看清',
  description:
    'Zeno 做了 16 年装修，现在把报价、预算、施工、真实居住和 AI 工作流整理成文章、工具、资料和服务，先帮你把关键判断看清。',
  alternates: {
    canonical: 'https://zenoaihome.com',
  },
}

const featuredSlugs = [
  'baojia-dan-zenme-kan',
  'zhuangxiu-yusuan-weishenme-zongchao',
  'zhuangxiu-hou-hue-de-wu-jian',
  '02-jia-bu-shi-yangban-jian',
  '04-wei-shenme-wo-kaishi-renzheng-xue-ai',
  'zeno-from-renovation-to-opc',
]

const routeCards: RouteCard[] = [
  {
    title: '我正在看报价单',
    desc: '先看哪里没写清，再决定签不签。',
    href: '/start#quote',
  },
  {
    title: '我怕装修超预算',
    desc: '先把预算结构拆清，再谈要不要省。',
    href: '/start#budget',
  },
  {
    title: '我已经开工，不知道怎么验收',
    desc: '先按节点盯，不要等竣工再回头看。',
    href: '/start#construction',
  },
  {
    title: '我不想把家装成样板间',
    desc: '先按真实生活做决定，再谈风格。',
    href: '/start#living',
  },
  {
    title: '我是传统行业人，想用 AI',
    desc: '先跑通一个真实场景，再谈系统。',
    href: '/start#ai',
  },
]

const actionCards: ActionCard[] = [
  {
    label: '免费工具',
    title: '预算风险自测',
    desc: '10 分钟先看你属于哪类风险。',
    href: '/tools/budget-risk',
  },
  {
    label: '免费清单',
    title: '报价审核清单',
    desc: '先把模糊项和漏项找出来。',
    href: '/resources#baojia-shenhe-qingdan',
  },
  {
    label: '低价资料',
    title: '39 元报价避坑指南',
    desc: '签合同前自己先过一遍。',
    href: '/pricing/baojia-guide',
  },
  {
    label: '人工判断',
    title: '699 元报价单审核',
    desc: '时间紧，或者你已经看出不对劲。',
    href: '/services#baojia-shenhe',
  },
  {
    label: 'AI 咨询',
    title: 'AI 内容系统咨询',
    desc: '把经验接进工作流，不只是学工具。',
    href: '/services#ai-neirong-xitong-zixun',
  },
  {
    label: '复盘入口',
    title: '案例复盘',
    desc: '先看判断过程，再决定怎么做。',
    href: '/cases',
  },
]

const caseReviews: CaseReview[] = [
  {
    slug: 'article-03-04',
    label: '报价复盘',
    takeaway: '低价为什么常常会在后面补回来。',
  },
  {
    slug: 'zhuangxiu-yusuan-weishenme-zongchao',
    label: '预算复盘',
    takeaway: '超支多数不是意外，而是顺序和结构问题。',
  },
  {
    slug: 'neirong-xitong-jianqi',
    label: 'AI / 资产复盘',
    takeaway: '一个传统行业人怎么把经验一步步整理成系统。',
  },
]

export default function HomePage() {
  const featuredArticles = featuredSlugs
    .map((slug) => getArticleBySlug(slug))
    .filter((article): article is NonNullable<typeof article> => Boolean(article))

  const caseArticles = caseReviews
    .map((item) => {
      const article = getArticleBySlug(item.slug)
      return article ? { ...item, article } : null
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Zeno 赞诺',
            url: 'https://zenoaihome.com',
            inLanguage: 'zh-CN',
            description:
              '从装修报价、预算、施工和真实居住出发，延伸到 AI 工作流和一人公司内容资产。',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Zeno',
            url: 'https://zenoaihome.com/about',
            jobTitle: '装修判断顾问 / 内容系统实践者',
            knowsAbout: ['装修报价', '装修预算', '施工验收', '真实居住', 'AI 工作流', '内容资产'],
          },
        ]}
      />

      <section className="py-14 sm:py-20 border-b border-border">
        <Container size="content">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-12">
            <div className="flex-1 max-w-2xl">
              <p className="text-[0.7rem] font-semibold tracking-[0.1em] uppercase text-stone mb-5">Zeno · 装修 16 年，现在用 AI 把判断变成工具</p>
              <h1 className="hero-title mb-5">
                先别急着装修。<br />
                先把报价、预算、施工和真实居住这四件事看清。
              </h1>
              <p className="text-[0.96rem] text-ink-muted leading-[1.9] mb-3 max-w-2xl">
                我是 Zeno。做了 16 年装修，不卖材料，不拿返点。这个网站主要帮五类人：正在看报价单的人、怕装修超预算的人、已经开工要盯验收的人、不想把家装成样板间的人，以及想把 AI 接进真实工作的传统行业人。
              </p>
              <p className="text-sm text-ink-muted/80 leading-relaxed mb-8 max-w-2xl">
                你不用先研究栏目。先走对下一步：看文章、用工具、拿清单、买资料，还是直接找我判断。
              </p>
              <div className="flex flex-wrap gap-3 items-center">
                <Link href="/start" className="text-sm font-medium text-paper bg-stone px-5 py-2.5 hover:bg-stone/85 transition-colors">
                  从这里开始
                </Link>
                <Link href="/tools/budget-risk" className="text-sm font-medium text-stone border border-stone/40 px-5 py-2.5 hover:bg-stone-pale transition-colors">
                  免费做预算风险自测
                </Link>
                <Link href="/services" className="text-sm font-medium text-stone hover:underline underline-offset-2">
                  找我帮你看 →
                </Link>
              </div>
            </div>

            <div className="shrink-0 w-full md:w-[300px] border border-border bg-surface p-6">
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-4">你会在这里找到什么</p>
              <div className="space-y-3">
                <div className="border border-border bg-surface-warm px-4 py-3">
                  <p className="text-sm font-semibold text-ink">谁在写</p>
                  <p className="text-xs text-ink-muted mt-1">从工地和报价现场走出来的人，不讲空话。</p>
                </div>
                <div className="border border-border bg-surface-warm px-4 py-3">
                  <p className="text-sm font-semibold text-ink">帮谁</p>
                  <p className="text-xs text-ink-muted mt-1">普通装修业主，以及想认真用 AI 的传统行业人。</p>
                </div>
                <div className="border border-border bg-surface-warm px-4 py-3">
                  <p className="text-sm font-semibold text-ink">解决什么</p>
                  <p className="text-xs text-ink-muted mt-1">报价、预算、施工、真实居住和 AI 工作流里的关键判断。</p>
                </div>
                <div className="border border-border bg-surface-warm px-4 py-3">
                  <p className="text-sm font-semibold text-ink">下一步</p>
                  <p className="text-xs text-ink-muted mt-1">先走路径页，再用工具和清单，最后再看服务。</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20 border-b border-border">
        <Container>
          <SectionHeader
            label="先选路径"
            title="你现在更像哪一种？"
            subtitle="不用一次看完整个站。先选你当前最像的那个问题，我已经把下一步排好了。"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {routeCards.map((route, index) => (
              <Link
                key={route.title}
                href={route.href}
                className={`group border p-6 sm:p-7 card-hover flex flex-col ${index === 0 ? 'border-stone/30 bg-stone/5' : 'border-border bg-surface'}`}
              >
                <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-3">路径 {String(index + 1).padStart(2, '0')}</p>
                <h2 className="card-title mb-3 group-hover:text-stone transition-colors">{route.title}</h2>
                <p className="text-sm text-ink-muted leading-relaxed flex-1">{route.desc}</p>
                <span className="text-xs text-stone mt-5 group-hover:underline underline-offset-2">走这条路 →</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20 border-b border-border bg-surface-warm">
        <Container>
          <SectionHeader
            label="先自己判断"
            title="这 6 个入口，能把大部分问题先理清"
            subtitle="免费工具先用，低价资料再补，人工服务放在后面。这样才不会一上来就花冤枉钱。"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {actionCards.map((card) => (
              <Link key={card.title} href={card.href} className="group border border-border bg-surface p-6 card-hover flex flex-col">
                <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-3">{card.label}</p>
                <h2 className="card-title mb-3 group-hover:text-stone transition-colors">{card.title}</h2>
                <p className="text-sm text-ink-muted leading-relaxed flex-1">{card.desc}</p>
                <span className="text-xs text-stone mt-5 group-hover:underline underline-offset-2">打开入口 →</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20 border-b border-border">
        <Container size="content">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-start">
            <div>
              <p className="page-label mb-3">为什么从装修出发</p>
              <h2 className="section-heading mb-5">装修行业是我的现实支点</h2>
              <div className="space-y-4 text-base text-ink leading-[1.85]">
                <p>为什么谈 AI、长期主义和内容资产的人，入口还是装修？因为这是我真正待了 16 年的地方。</p>
                <p>我盯过工地、审过报价、处理过客户分歧。装修行业里那些信息差、信任问题和流程混乱，不是我听来的，是我长期在里面看过、做过、吃过亏的。</p>
                <p className="text-sm text-ink-muted">所以这里不做“装修知识大全”，也不做“AI 工具站”。我更关心的是：怎么帮普通人少踩坑，怎么把真实经验整理成普通人能用的系统。</p>
              </div>
            </div>
            <div className="hidden md:flex flex-col gap-3 w-[180px]">
              <div className="border border-border bg-surface-warm p-4">
                <p className="text-2xl font-semibold text-stone">16年</p>
                <p className="text-xs text-ink-muted mt-1">全流程装修实战</p>
              </div>
              <div className="border border-border bg-surface-warm p-4">
                <p className="text-2xl font-semibold text-stone">1000+</p>
                <p className="text-xs text-ink-muted mt-1">真实沟通与报价判断</p>
              </div>
              <div className="border border-border bg-surface-warm p-4">
                <p className="text-2xl font-semibold text-stone">不编造</p>
                <p className="text-xs text-ink-muted mt-1">案例、反馈、结论都尽量说清边界</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20 border-b border-border">
        <Container>
          <SectionHeader
            label="案例复盘"
            title="先看判断过程，再决定怎么做"
            subtitle="现在先公开能公开的判断复盘，不编造客户隐私案例。你先看我是怎么拆问题的，再决定这条路要不要走。"
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {caseArticles.map(({ article, label, takeaway }) => (
              <Link key={article.id} href={`/blog/${article.slug}`} className="group border border-border bg-surface p-6 card-hover flex flex-col">
                <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-3">{label}</p>
                <h2 className="card-title mb-3 group-hover:text-stone transition-colors">{article.title}</h2>
                <p className="text-sm text-ink-muted leading-relaxed">{takeaway}</p>
                <p className="text-xs text-ink-faint mt-3 leading-relaxed flex-1">{article.excerpt}</p>
                <span className="text-xs text-stone mt-5 group-hover:underline underline-offset-2">看这篇复盘 →</span>
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/cases" className="text-sm text-stone hover:underline underline-offset-2">
              查看全部案例复盘 →
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20 border-b border-border">
        <Container size="content">
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <p className="page-label mb-3">先看这几篇</p>
              <h2 className="section-heading">如果你第一次来，这几篇最省时间</h2>
              <p className="text-sm text-ink-muted mt-2">先看高意图问题，再看长期主题，不用在栏目里乱翻。</p>
            </div>
            <Link href="/blog" className="text-sm text-stone hover:underline underline-offset-2 shrink-0 pb-1">
              全部文章 →
            </Link>
          </div>
          <div>
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20 border-b border-border bg-surface-warm">
        <Container size="content">
          <p className="page-label mb-3">AI 接进传统工作</p>
          <h2 className="section-heading mb-5">如果你不是来装修，而是想认真用 AI，也可以从这里起步</h2>
          <div className="space-y-4 text-base text-ink leading-[1.85]">
            <p>我不是技术出身的人。我关心的不是“哪个 AI 最强”，而是哪一步真的值得自动化、哪一步必须保留人工判断。</p>
            <p className="text-sm text-ink-muted">所以这里的 AI 内容不是炫技，也不是万能感，而是从真实行业流程出发：怎么把经验变成内容、图解、工具和服务。</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/topics#chuantong-hangyeren-zenme-yong-ai" className="text-sm font-medium text-paper bg-stone px-5 py-2.5 hover:bg-stone/85 transition-colors">
              看 AI 工作流专题
            </Link>
            <Link href="/tools/prompts" className="text-sm font-medium text-stone border border-stone/40 px-5 py-2.5 hover:bg-stone-pale transition-colors">
              试试提示词体验场
            </Link>
            <Link href="/services#ai-neirong-xitong-zixun" className="text-sm text-stone hover:underline underline-offset-2">
              AI 内容系统咨询 →
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20 border-b border-border">
        <Container size="content">
          <div className="border border-border bg-surface p-7 sm:p-9">
            <p className="page-label mb-4">关于 Zeno</p>
            <p className="text-base text-ink leading-relaxed mb-4">
              装修只是我最熟悉的起点。我现在更关心的是：一个普通传统行业出身的人，能不能借助 AI、内容和产品化能力，把一线经验整理成长期有价值的资产。
            </p>
            <p className="text-sm text-ink-muted leading-relaxed mb-6">
              所以这个网站的目标不是多，而是清楚：清楚地讲问题，清楚地给判断，清楚地说边界，清楚地给下一步。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/about" className="text-sm text-stone hover:underline underline-offset-2 decoration-stone-light">
                了解更多关于 Zeno →
              </Link>
              <Link href="/cases" className="text-sm text-ink-muted hover:text-stone transition-colors">
                看案例复盘
              </Link>
              <Link href="/services" className="text-sm text-ink-muted hover:text-stone transition-colors">
                查看服务
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <CTASection
        title="先做对下一步，不用一次看完整站"
        description="如果你手里已经有报价或预算，先做一次免费自测；如果你还不知道从哪类问题开始，就先去“从这里开始”；如果你已经很明确，只差一个判断，就直接看服务页。"
        actions={[
          { label: '免费做预算风险自测', href: '/tools/budget-risk', variant: 'primary' },
          { label: '从这里开始', href: '/start', variant: 'secondary' },
          { label: '找我帮你看', href: '/services', variant: 'ghost' },
        ]}
        bg="warm"
      />
    </>
  )
}