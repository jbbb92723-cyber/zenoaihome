import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/ui/Container'

export const metadata: Metadata = {
  title: 'AI培训与企业内训｜传统行业从真实工作开始',
  description:
    '赞诺面向企业、商会和创业社群提供AI实战培训。从传统行业真实工作出发，覆盖AI应用入门、工具实操、内容工作流和一人公司实践。',
  alternates: {
    canonical: 'https://zenoaihome.com/training',
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
            <p className="text-sm font-semibold text-stone">AI 培训与企业内训</p>
            <h1 className="editorial-display mt-5 max-w-[14ch] text-[3.2rem] leading-[1.03] sm:text-[4.8rem]">不从概念开始，从你们每天重复的工作开始。</h1>
            <p className="mt-7 max-w-3xl text-base leading-8 text-ink-muted sm:text-lg">赞诺用传统行业经营者的视角讲 AI。目标不是让学员记住更多工具，而是带着一个真实任务完成第一次可继续使用的实践。</p>
          </div>
          <div>
            <p className="border-l-2 border-stone pl-5 text-sm leading-7 text-ink-muted">适合企业内训、商会分享、创业社群和小班实操。具体内容、形式和费用根据人数与需求确认。</p>
            <Link href="/contact" className="motion-press mt-6 inline-flex min-h-11 items-center rounded-[7px] bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-stone-deep">沟通培训需求</Link>
          </div>
        </Container>
      </section>

      <Container className="py-16 sm:py-20 lg:py-24">
        <section className="grid gap-12 lg:grid-cols-[0.3fr_0.7fr]">
          <div>
            <p className="text-sm font-semibold text-stone">课程模块</p>
            <h2 className="editorial-display mt-4 text-[2.5rem] leading-[1.12] sm:text-[3.5rem]">按问题组合，不卖固定课件。</h2>
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
            <h2 className="editorial-display mt-4 text-[2.5rem] leading-[1.12] sm:text-[3.5rem]">培训结束，要留下能继续做的东西。</h2>
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
            <h2 className="editorial-display mt-4 text-[2.4rem] leading-[1.12] sm:text-[3.3rem]">不是旁观转型，而是正在转型。</h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-ink-muted">
            <p>17 年传统行业经营、销售管理和大型装修项目经验，让我知道工具最终要进入团队、客户、合同和交付，而不是停在演示里。</p>
            <p>我正在用 AI 搭建自己的网站、内容系统、知识库和智能体。这些仍在迭代，我会把能复用的方法和踩过的坑同时讲清楚。</p>
            <p className="font-semibold text-ink">我不承诺听完就完成转型，只确保学员离开时已经真正动手，并知道下一步做什么。</p>
          </div>
        </section>

        <section className="mt-16 grid gap-8 border-y border-border py-10 sm:mt-20 lg:grid-cols-[0.62fr_0.38fr] lg:items-center">
          <div>
            <h2 className="editorial-display text-[2.4rem] leading-[1.12] sm:text-[3.3rem]">把团队情况和目标说清楚。</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-muted">请提供行业、人数、目前使用过的 AI 工具、最希望解决的三个场景。确认匹配后，再给出课程组合和正式报价。</p>
          </div>
          <div className="lg:text-right">
            <Link href="/contact" className="motion-press inline-flex min-h-11 items-center rounded-[7px] bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-stone-deep">查看联系方式</Link>
          </div>
        </section>
      </Container>
    </main>
  )
}
