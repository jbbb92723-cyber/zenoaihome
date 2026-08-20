import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import { AI_SERVICE_LEVELS } from '@/data/services/pricing'

export const metadata: Metadata = {
  title: 'AI 培训｜从团队每天的工作开始',
  description:
    '赞诺面向企业、商会和创业社群提供AI实战培训。从传统行业真实工作出发，覆盖AI应用入门、工具实操、内容工作流和一人公司实践。',
  alternates: {
    canonical: 'https://zenoaihome.com/training',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://zenoaihome.com/training',
    siteName: 'Zeno 赞诺',
    title: 'AI 培训｜从团队每天的工作开始',
    description:
      '赞诺面向企业、商会和创业社群提供AI实战培训。从传统行业真实工作出发，覆盖AI应用入门、工具实操、内容工作流和一人公司实践。',
    images: [
      {
        url: 'https://zenoaihome.com/images/brand/zeno-portrait.jpg',
        width: 940,
        height: 940,
        alt: '赞诺 Zeno',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 培训｜从团队每天的工作开始',
    description:
      '赞诺面向企业、商会和创业社群提供AI实战培训。从传统行业真实工作出发，覆盖AI应用入门、工具实操、内容工作流和一人公司实践。',
    images: ['https://zenoaihome.com/images/brand/zeno-portrait.jpg'],
  },
}

const modules = [
  {
    code: '01',
    title: '传统行业 × AI 实战',
    audience: '企业负责人、商会、传统行业团队',
    question: 'AI 到底能进入哪些真实工作，应该从哪里开始？',
    content: ['识别适合 AI 的任务', '传统经验如何整理成知识资产', '从个人尝试到团队使用的推进顺序'],
  },
  {
    code: '02',
    title: 'AI 工具与工作流实操',
    audience: '需要动手使用 AI 的小班团队',
    question: '不再停留在听懂，现场完成一条能继续使用的工作流。',
    content: ['工具选择与基础提示', '内容、资料和客户沟通场景实操', '工作流测试、记录与交接'],
  },
  {
    code: '03',
    title: 'AI 内容与知识系统',
    audience: '个人品牌、创业团队、内容负责人',
    question: '如何让内容不是一次性发布，而是持续积累的业务资产？',
    content: ['素材收集与选题结构', '知识库与内容生产协同', '从公开内容到服务入口的连接'],
  },
  {
    code: '04',
    title: '装修与家居企业 AI 应用',
    audience: '装修公司、家居门店、设计与施工团队',
    question: '把行业经验、报价判断、客户沟通和项目资料真正用起来。',
    content: ['装修业务中的 AI 使用边界', '报价与项目资料结构化', '内容、销售和服务环节的场景演练'],
  },
]

const delivery = [
  { title: '课前确认', body: '收集团队背景、真实问题、工具基础和希望练习的工作场景。' },
  { title: '课程定制', body: '从现有模块中组合内容，确认形式、时长、人数和需要准备的材料。' },
  { title: '现场实操', body: '学员使用自己的电脑和真实材料完成练习，不以演示代替操作。' },
  { title: '资料交接', body: '交付操作资料、模板和课后行动清单，复杂项目可另行评估。' },
]

export default function TrainingPage() {
  return (
    <main className="bg-canvas text-ink">
      <section className="border-b border-border bg-surface-warm">
        <Container className="grid gap-10 py-14 sm:py-16 lg:grid-cols-[0.62fr_0.38fr] lg:items-end lg:py-20">
          <div>
            <p className="text-sm font-semibold text-stone">AI 培训</p>
            <h1 className="editorial-display mt-5 max-w-[14ch] text-[2.4rem] leading-[1.1] sm:text-[3.2rem]">从团队每天重复的工作开始。</h1>
            <p className="mt-7 max-w-3xl text-base leading-8 text-ink-muted sm:text-lg">赞诺用传统行业经营者的视角讲 AI。目标不是让学员记住更多工具，而是带着一个真实任务完成第一次可继续使用的实践。</p>
          </div>
          <div>
            <p className="border-l-2 border-stone pl-5 text-sm leading-7 text-ink-muted">小范围定向实操从 ¥2,500 起；企业内训、商会分享和多人现场项目，会根据人数、形式、材料与周期评估。</p>
            <Link href="/contact" className="motion-press mt-6 inline-flex min-h-11 items-center rounded-[7px] bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-stone-deep">沟通培训需求</Link>
          </div>
        </Container>
      </section>

      <Container className="py-16 sm:py-20 lg:py-24">
        <section className="border-y border-border py-10 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold text-stone">培训如何定价</p>
              <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.2rem]">先从一个场景开始，再决定是否做项目。</h2>
              <p className="mt-4 text-sm leading-7 text-ink-muted">培训不按课时堆内容，而按真实任务、参与人数、材料准备和后续交付确定范围。价格是判断入口，不是脱离范围的承诺。</p>
            </div>
            <div className="border-t border-border">
              {AI_SERVICE_LEVELS.map((level) => (
                <Link key={level.code} href={level.href} className="group grid gap-2 border-b border-border py-5 sm:grid-cols-[2rem_1fr_auto] sm:items-center">
                  <span className="text-xs font-semibold text-stone">{level.code}</span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{level.name}</span>
                    <span className="mt-1 block text-xs leading-5 text-ink-muted">{level.note}</span>
                  </span>
                  <span className="text-sm font-bold text-ink group-hover:text-stone">{level.price} →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-12 lg:grid-cols-[0.3fr_0.7fr]">
          <div>
            <p className="text-sm font-semibold text-stone">课程模块</p>
            <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.2rem] lg:text-[2.6rem]">按问题组合，不卖固定课件。</h2>
          </div>
          <div className="border-t border-border">
            {modules.map((item) => (
              <article key={item.code} className="grid gap-5 border-b border-border py-7 sm:grid-cols-[3rem_0.85fr_1.15fr]">
                <span className="text-xs font-semibold tabular-nums text-stone">{item.code}</span>
                <div>
                  <h3 className="text-xl font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-xs leading-6 text-ink-muted">适合：{item.audience}</p>
                  <p className="mt-4 text-sm leading-7 text-ink-muted">{item.question}</p>
                </div>
                <ul className="space-y-3 sm:border-l sm:border-border sm:pl-6">
                  {item.content.map((point) => (
                    <li key={point} className="text-sm leading-7 text-ink-muted">— {point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20 border-y border-border py-12 sm:mt-24 sm:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-stone">交付方式</p>
            <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.2rem] lg:text-[2.6rem]">培训结束，要留下能继续做的东西。</h2>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4">
            {delivery.map((item, index) => (
              <div key={item.title} className={`py-6 sm:px-6 ${index < 3 ? 'border-b border-border sm:border-r lg:border-b-0' : ''} ${index === 1 ? 'sm:border-r-0 lg:border-r' : ''}`}>
                <p className="text-lg font-semibold text-ink">{item.title}</p>
                <p className="mt-3 text-sm leading-7 text-ink-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-10 bg-surface-warm p-7 sm:mt-24 sm:p-10 lg:grid-cols-[0.4fr_0.6fr]">
          <div>
            <p className="text-sm font-semibold text-stone">为什么由赞诺来讲</p>
            <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.2rem] lg:text-[2.6rem]">不是旁观转型，而是正在转型。</h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-ink-muted">
            <p>截至 2026 年，我有 17 年传统行业经营与项目经验，长期涉及家居、销售管理和装修项目。这些经历让我知道，工具最终要进入团队、客户、合同和交付，而不是停在演示里。</p>
            <p>我正在用 AI 搭建自己的网站、内容系统、知识库和智能体。这些仍在迭代，我会把能复用的方法和踩过的坑同时讲清楚。</p>
            <p className="font-semibold text-ink">我不承诺听完就完成转型，只确保学员离开时已经真正动手，并知道下一步做什么。</p>
          </div>
        </section>

        <section className="mt-16 grid gap-8 border-y border-border py-10 sm:mt-20 lg:grid-cols-[0.62fr_0.38fr] lg:items-center">
          <div>
            <h2 className="editorial-display text-[1.8rem] leading-[1.15] sm:text-[2.2rem] lg:text-[2.6rem]">把团队情况和目标说清楚。</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-muted">请提供行业、人数、目前使用过的 AI 工具、最希望解决的三个场景。一个明确场景可以先从 ¥2,500 起的专项协作开始；需要跨多个场景持续推进时，再按 ¥12,800 起的项目顾问评估。企业内训的最终费用还会结合人数、形式、资料准备和周期确认。</p>
          </div>
          <div className="lg:text-right">
            <Link href="/contact" className="motion-press inline-flex min-h-11 items-center rounded-[7px] bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-stone-deep">查看联系方式</Link>
          </div>
        </section>
      </Container>
    </main>
  )
}
