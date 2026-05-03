import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: '从真实问题出发，建立判断力 | ZenoAIHome',
  description:
    'ZenoAIHome 从装修现场经验出发，帮普通业主看懂预算、报价、合同和验收问题；也记录一个传统行业人，如何借助 AI 把一线经验整理成内容、工具、课程和服务。',
  alternates: {
    canonical: 'https://zenoaihome.com/',
  },
}

const homeownerItems = [
  '装修前判断',
  '报价预算审核',
  '水电防水验收',
  '竣工检查清单',
]

const industryItems = [
  '经验资产整理',
  '内容矩阵搭建',
  'AI 工作流',
  '课程与产品化',
]

const knowledgeCards = [
  {
    label: '报价判断',
    title: '装修报价单怎么看？',
    description: '先别急着比总价。先看结构、漏项、计量方式和后面最容易补上的那一列。',
    href: '/blog/baojia-dan-zenme-kan',
  },
  {
    label: '预算判断',
    title: '装修预算为什么总超？',
    description: '很多超支不是意外，而是顺序、变更和报价结构一开始就没有分清。',
    href: '/blog/zhuangxiu-yusuan-weishenme-zongchao',
  },
  {
    label: '验收判断',
    title: '竣工验收不是走流程',
    description: '验收不是最后签个字，而是节点留证、标准写清和问题前置处理。',
    href: '/blog/03-cong-gongdi-kan-shijie',
  },
]

const evidenceCards = [
  '报价单标注',
  '水电留证',
  '防水闭水',
  '瓷砖铺贴',
  '吊顶收口',
  '竣工验收',
]

const aiCanHelp = [
  '报价模糊项检查',
  '合同条款解释',
  '验收清单整理',
  '问题归类和沟通准备',
]

const aiCannotReplace = [
  '现场判断',
  '合同约定本身',
  '专业验收责任',
  '你自己的取舍和边界',
]

const manifestoParagraphs = [
  '真正适合普通人的路径，不是追热点、搬项目、天天换工具，而是从自己已经做过的行业、见过的客户、处理过的问题开始。',
  '你服务过的客户，踩过的坑，写过的方案，做过的交付，反复解释过的话术，都是资产。',
  '过去这些经验只能靠嘴讲，靠熟人介绍，靠一单一单服务客户。',
  '现在，你可以借助 AI，把它们整理成文章、图文、课程、清单、咨询服务、行业资料包和工具产品。',
  'AI 一人公司，不是逃离原来的行业，而是把你在行业里积累的判断力，重新变成自己的长期资产。',
]

const courseSteps = [
  {
    num: '01',
    title: '整理经验',
    description: '先把客户问题、常见场景、交付流程和判断方法梳成可复用的结构。',
  },
  {
    num: '02',
    title: '持续输出',
    description: '把经验变成文章、图文、讲解和清单，不靠临场发挥，也不靠追热点。',
  },
  {
    num: '03',
    title: '产品化服务',
    description: '让内容继续沉淀成资料包、课程和咨询服务，形成自己的长期资产。',
  },
]

export default function HomePage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'ZenoAIHome',
          url: 'https://zenoaihome.com/',
          description:
            '从真实问题出发，建立判断力。面向装修业主，也面向想把经验接进 AI 的传统行业人。',
          inLanguage: 'zh-CN',
        }}
      />

      <section className="relative overflow-hidden border-b border-border py-16 sm:py-24 lg:py-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-stone/20 to-transparent" />
        <div className="pointer-events-none absolute left-[6%] top-0 hidden h-full w-px bg-border/50 lg:block" />

        <Container size="layout">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
            <div className="lg:pt-6">
              <p className="page-label mb-5">ZenoAIHome · 判断入口</p>
              <h1 className="text-[clamp(2rem,4.9vw,3.75rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-ink">
                从真实问题出发，
                <br className="hidden sm:block" />
                建立判断力。
              </h1>
              <p className="mt-6 max-w-2xl text-[1.02rem] leading-[1.9] text-ink-muted">
                ZenoAIHome 从装修现场经验出发，帮普通业主看懂预算、报价、合同和验收问题；也记录一个传统行业人，如何借助 AI 把一线经验整理成内容、工具、课程和服务。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CTA href="/start" label="我是装修业主，想少踩坑" variant="primary" />
                <CTA href="/services/ai-workflow" label="我是传统行业人，想做 AI 一人公司" variant="secondary" />
              </div>
            </div>

            <div className="relative">
              <div className="border border-border bg-surface shadow-[0_24px_60px_rgba(30,25,20,0.07)]">
                <div className="border-b border-border bg-surface-warm px-6 py-5">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-stone">判断卡片</p>
                  <h2 className="mt-1 text-lg font-semibold text-ink">先分清你面对的是什么问题</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
                  <div className="border border-border bg-surface-warm p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-stone mb-3">装修业主</p>
                    <ul className="space-y-2">
                      {['预算', '报价', '合同', '验收'].map((item) => (
                        <li key={item} className="text-sm text-ink flex items-center gap-2">
                          <span className="h-1.5 w-1.5 shrink-0 bg-stone/70" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border border-border bg-surface-warm p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-stone mb-3">传统行业人</p>
                    <ul className="space-y-2">
                      {['经验', '内容', '工具', '课程'].map((item) => (
                        <li key={item} className="text-sm text-ink flex items-center gap-2">
                          <span className="h-1.5 w-1.5 shrink-0 bg-stone/70" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="border-t border-border px-6 py-4">
                  <p className="text-xs leading-5 text-ink-faint">
                    先判断，再进入对应入口。不要一上来就把装修问题、AI 工具和课程混成一团。
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute -bottom-3 -right-3 hidden h-full w-full border border-border/40 -z-10 lg:block" />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 sm:py-20 lg:py-24">
        <Container size="layout">
          <div className="mb-12 max-w-3xl">
            <p className="page-label mb-3">双入口</p>
            <h2 className="section-heading">同一个站，服务两种真实问题</h2>
            <p className="mt-3 text-sm leading-7 text-ink-muted">
              一边是装修决策，一边是经验产品化。入口不同，但底层都不是包装，而是判断和整理。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="border border-border bg-surface p-7 shadow-[0_16px_40px_rgba(30,25,20,0.04)]">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-stone mb-3">给装修业主</p>
              <h3 className="text-[1.15rem] font-semibold leading-[1.4] text-ink mb-4">先把关键判断拆清，再决定下一步</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {homeownerItems.map((item) => (
                  <div key={item} className="border border-border bg-surface-warm px-4 py-3 text-sm text-ink">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <CTA href="/start" label="进入装修判断入口" variant="primary" />
                <CTA href="/tools/budget-risk" label="先做预算风险自测" variant="ghost" />
              </div>
            </div>

            <div className="border border-border bg-surface p-7 shadow-[0_16px_40px_rgba(30,25,20,0.04)]">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-stone mb-3">给传统行业人</p>
              <h3 className="text-[1.15rem] font-semibold leading-[1.4] text-ink mb-4">把做过的事，慢慢整理成自己的系统</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {industryItems.map((item) => (
                  <div key={item} className="border border-border bg-surface-warm px-4 py-3 text-sm text-ink">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <CTA href="/services/ai-workflow" label="进入 AI 一人公司入口" variant="primary" />
                <CTA href="/tools/prompts" label="先看 AI 工作流入口" variant="ghost" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <Container size="layout">
          <div className="mb-12 max-w-3xl">
            <p className="page-label mb-3">装修判断力知识库</p>
            <h2 className="section-heading">先看三篇最该先看的文章</h2>
            <p className="mt-3 text-sm leading-7 text-ink-muted">
              不是把所有文章铺开给你自己猜，而是先给你三条最常见、最容易花冤枉钱的判断入口。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {knowledgeCards.map((item) => (
              <Link key={item.title} href={item.href} className="group border border-border bg-surface p-6 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(30,25,20,0.05)]">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-stone mb-3">{item.label}</p>
                <h3 className="text-[1.05rem] font-semibold leading-[1.45] text-ink group-hover:text-stone transition-colors mb-3">
                  {item.title}
                </h3>
                <p className="text-sm leading-7 text-ink-muted">{item.description}</p>
                <span className="mt-5 inline-flex text-sm font-medium text-stone">进入文章 →</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-surface-warm py-16 sm:py-20 lg:py-24">
        <Container size="layout">
          <div className="mb-12 max-w-3xl">
            <p className="page-label mb-3">真实证据</p>
            <h2 className="section-heading">判断力来自现场，不来自空话</h2>
            <p className="mt-3 text-sm leading-7 text-ink-muted">
              图片先放占位卡。之后只补真实工地留证、脱敏报价和能解释问题的现场照片，不补效果图氛围素材。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {evidenceCards.map((item) => (
              <div key={item} className="aspect-[4/3] border border-dashed border-border bg-surface px-4 py-4 flex flex-col items-center justify-center text-center">
                <svg className="h-8 w-8 text-ink-faint/40 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
                <p className="text-[0.72rem] leading-5 text-ink-muted">{item}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 sm:py-20 lg:py-24">
        <Container size="layout">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <p className="page-label mb-3">AI 辅助装修决策</p>
              <h2 className="section-heading mb-5">AI 可以帮你整理问题，但不能替你盲目决定</h2>
              <p className="text-sm leading-7 text-ink-muted max-w-2xl">
                在装修这件事里，AI 更适合做梳理和准备，而不是替你跳过判断。它能缩短你从“看不清”到“知道该问什么”的距离，但不能代替现场、合同和专业责任。
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="border border-border bg-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone mb-3">AI 能帮你</p>
                <ul className="space-y-2">
                  {aiCanHelp.map((item) => (
                    <li key={item} className="text-sm text-ink flex items-start gap-2 leading-7">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-stone/70" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-border bg-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone mb-3">AI 不能替代</p>
                <ul className="space-y-2">
                  {aiCannotReplace.map((item) => (
                    <li key={item} className="text-sm text-ink flex items-start gap-2 leading-7">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-stone/70" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-surface-warm py-16 sm:py-20">
        <Container size="content">
          <div className="max-w-3xl">
            <p className="page-label mb-3">AI 一人公司</p>
            <h2 className="section-heading mb-5">AI 一人公司，不是让你从零编一个副业项目</h2>
          </div>

          <div className="border border-border bg-surface px-6 py-6 sm:px-8 sm:py-8">
            <div className="space-y-4 max-w-3xl">
              {manifestoParagraphs.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={index === 0 ? 'text-base font-semibold leading-8 text-ink' : 'text-sm leading-8 text-ink-muted'}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 sm:py-20 lg:py-24">
        <Container size="content">
          <div className="mb-8 max-w-3xl">
            <p className="page-label mb-3">视频占位</p>
            <h2 className="section-heading">一个真实行业问题，如何变成内容、工具和课程</h2>
          </div>

          <div className="relative aspect-video border border-dashed border-border bg-surface overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-surface-warm" />
            <div className="relative z-10 flex flex-col items-center gap-3 p-6 text-center">
              <svg className="h-14 w-14 text-stone/35" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
              <p className="text-sm font-medium text-ink-muted">16:9 视频占位卡</p>
              <p className="max-w-md text-xs leading-5 text-ink-faint">
                这里后续放一个真实问题的拆解过程：从一线经验出发，怎么一步步整理成文章、工具和课程。当前先不接真实视频。
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <Container size="layout">
          <div className="mb-12 max-w-3xl">
            <p className="page-label mb-3">课程入口</p>
            <h2 className="section-heading">从行业经验，搭建你的 AI 一人公司</h2>
            <p className="mt-3 text-sm leading-7 text-ink-muted">
              不是先找项目，而是先把你已经做过的事整理清楚，再慢慢把它们变成持续输出和产品化服务。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {courseSteps.map((step) => (
              <div key={step.num} className="border border-border bg-surface p-6 shadow-[0_8px_20px_rgba(30,25,20,0.03)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[0.72rem] font-semibold uppercase tracking-[0.09em] text-stone">步骤 {step.num}</span>
                </div>
                <h3 className="text-base font-semibold leading-snug text-ink mb-3">{step.title}</h3>
                <p className="text-sm leading-7 text-ink-muted">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <CTA href="/services/ai-workflow" label="进入课程入口" variant="primary" />
            <CTA href="/about" label="先看 Zeno 在做什么" variant="ghost" />
          </div>
        </Container>
      </section>
    </>
  )
}
