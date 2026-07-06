import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/ui/Container'

export const metadata: Metadata = {
  title: 'AI 培训与企业服务｜传统行业 × AI 实战',
  description:
    '给传统行业团队讲 AI 实战——不讲概念，讲怎么用。面向商会、企业内训、创业社群。17 年装修老兵的真实转型经验，方法对任何传统行业通用。',
  alternates: {
    canonical: 'https://zenoaihome.com/training',
  },
}

const trainingModules = [
  {
    title: '传统行业 × AI 实战',
    duration: '2-3 小时',
    audience: '商会、企业内训、创业社群',
    price: '企业内训 ¥8,000-15,000',
    description:
      '不是讲 AI 概念，是讲一个在装修行业干了 17 年的人，怎么用 AI 把经验整理成结构化资产。从真实踩坑案例出发，方法对任何传统行业通用。',
    takeaways: [
      '传统行业经验怎么用 AI 变成可交付的判断',
      'AI 工作流搭建的真实路径（不是演示，是踩过的坑）',
      '一个传统行业的人转型 AI 培训的完整复盘',
    ],
  },
  {
    title: 'AI 工具实操',
    duration: '1.5-2 小时',
    audience: '企业团队、创业社群、小班教学',
    price: '小班 ¥299-499 / 人（10 人起）',
    description:
      '全程屏幕演示，不讲概念。学员打开电脑跟着操作，走之前带走第一个能用的 AI 工作流。',
    takeaways: [
      '从零搭一个 AI 工作流（提示词 + 工具链）',
      'AI 辅助内容创作、数据分析、客户沟通的具体方法',
      '常见工具的选型判断——哪个场景用哪个',
    ],
  },
  {
    title: '装修全案判断方法论',
    duration: '2-3 小时',
    audience: '装修公司、设计师社群、家居行业从业者',
    price: '企业内训 ¥5,000-12,000',
    description:
      '17 年工地经验系统化输出——报价、合同、施工管控、材料判断。不是讲知识，是讲判断习惯怎么养成。',
    takeaways: [
      '报价审核的核心框架——暂估、漏项、计量规则',
      '合同边界的判断方法——什么该签、什么不能签',
      '施工管控的关键节点——选对人、说对话、盯对点',
    ],
  },
]

const whoIsThisFor = [
  {
    role: '商会 / 行业协会',
    reason: '会员企业普遍面临数字化转型压力，但不知道该从哪开始。一场 2-3 小时的分享，用真实案例帮他们看到「传统行业的人也能用 AI」。',
  },
  {
    role: '企业内训',
    reason: '团队需要 AI 技能，但市面上的 AI 培训偏技术、偏互联网。这里讲的是传统行业视角——工厂、门店、工地的人怎么用 AI。',
  },
  {
    role: '创业社群',
    reason: '社群成员最需要的不是 AI 工具清单，是一个跟他们一样从传统行业爬出来的人，告诉他们「这条路能走通」。',
  },
  {
    role: '装修 / 家居企业',
    reason: '行业专属判断方法论——报价、合同、施工、材料。不是通用的管理课，是装修行业长出来的判断体系。',
  },
]

const serviceFlow = [
  { step: '01', title: '加微信说明需求', desc: '告诉我你的团队规模、行业背景、想解决什么问题。' },
  { step: '02', title: '我发详细提纲', desc: '根据你的情况推荐最合适的模块和时长，附过往案例和参考价格。' },
  { step: '03', title: '确认时间与形式', desc: '线上或线下，确定日期、设备和学员准备事项。' },
  { step: '04', title: '交付 + 课后资料', desc: '培训结束后发完整的操作手册和 AI 工作流模板，学员可以立刻用起来。' },
]

export default function TrainingPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-surface-warm">
        <Container size="content" className="py-14 sm:py-16">
          <p className="page-label mb-4">AI 培训与企业服务</p>
          <h1 className="page-title mb-5 max-w-2xl">
            给传统行业团队讲 AI 实战——不讲概念，讲怎么用
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
            17 年装修老兵的真实转型经验。不是技术专家，是一个用 AI
            把自己重做了一遍的人。方法不挑行业——工厂、门店、工地都适用。
          </p>
        </Container>
      </section>

      <Container size="content" className="py-14 sm:py-16">
        {/* 培训模块 */}
        <section className="mb-14">
          <h2 className="section-heading mb-6">培训模块</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {trainingModules.map((mod) => (
              <div key={mod.title} className="border border-border bg-surface p-6 flex flex-col">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone">
                  {mod.duration} · {mod.audience}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-ink">{mod.title}</h3>
                <p className="mt-1 text-sm font-medium text-stone">{mod.price}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {mod.description}
                </p>
                <ul className="mt-4 space-y-2 flex-1">
                  {mod.takeaways.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-ink-muted">
                      <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-stone" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-ink-muted">
            以上为参考价格区间，具体根据人数、形式和企业需求调整。加微信获取正式报价。
          </p>
        </section>

        {/* 服务流程 */}
        <section className="mb-14 border border-border bg-surface-warm p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink mb-5">合作流程</h2>
          <div className="grid gap-4 sm:grid-cols-4">
            {serviceFlow.map((item) => (
              <div key={item.step}>
                <p className="text-2xl font-bold text-stone">{item.step}</p>
                <p className="mt-2 text-sm font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 适合谁 */}
        <section className="mb-14">
          <h2 className="section-heading mb-6">适合谁来</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {whoIsThisFor.map((item) => (
              <div key={item.role} className="border border-border bg-surface p-5">
                <h3 className="text-base font-semibold text-ink">{item.role}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.reason}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 为什么是我 */}
        <section className="mb-14 border border-border bg-surface-warm p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink mb-4">为什么是我来讲</h2>
          <div className="max-w-2xl space-y-3 text-sm leading-relaxed text-ink-muted">
            <p>
              不是 AI 技术专家。在装修和床垫行业干了 17
              年——卖过床垫、干过装修、当过经销商、带过团队。见过这个行业最真实的一面。
            </p>
            <p>
              2023 年开始用 AI 辅助装修判断，踩过所有该踩的坑——以为 AI
              能替我做判断、以为提示词写长一点就好、以为工作流越复杂越厉害。后来才搞清楚：AI
              应该固定在「帮我整理、对比、查漏」的位置上，不是「替我想」。
            </p>
            <p>
              现在我把这套方法做成培训——不是讲 AI 有多厉害，是讲一个传统行业的人怎么用 AI
              把自己的经验变成可交付的判断。
            </p>
          </div>
        </section>

        {/* 自助工具 */}
        <section className="mb-14 border border-border bg-surface-warm p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink mb-3">暂时不需要培训？</h2>
          <p className="text-sm leading-relaxed text-ink-muted mb-4 max-w-xl">
            如果你的团队还没准备好接受培训，或者你个人想先自己试试——这里有我 17 年经验浓缩成的自助工具。
          </p>
          <Link
            href="/tools/quote-checklist"
            className="inline-flex items-center text-sm font-medium border border-border text-ink px-4 py-2 hover:border-stone transition-colors"
          >
            装修报价自检清单（¥99）→
          </Link>
        </section>

        {/* 讲过的地方 */}
        <section className="mb-14">
          <h2 className="section-heading mb-5">讲过的地方</h2>
          <p className="mb-5 text-sm leading-relaxed text-ink-muted">
            每讲一次，迭代一次。下面的空白等着你来填——第一次培训之后，这里会变成最有说服力的区域。
          </p>
          <div className="border border-dashed border-stone bg-surface-warm p-8 text-center">
            <p className="text-sm text-ink-muted">
              如果你是我培训过的第一个客户——你的企业名字会第一个出现在这里。
            </p>
            <p className="mt-2 text-xs text-stone">
              这也意味着你会得到最用心的交付。
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="border border-border bg-surface p-6 sm:p-8 text-center">
          <h2 className="text-xl font-semibold text-ink mb-3">邀请我来培训</h2>
          <p className="mb-5 text-sm leading-relaxed text-ink-muted max-w-lg mx-auto">
            加微信，告诉我你的团队情况。我把详细提纲、过往案例和参考报价发你。不是销售——你看完觉得合适再聊下一步。
          </p>
          <p className="text-base text-ink">
            微信：<span className="font-semibold">zanxiansheng2025</span>
          </p>
          <p className="mt-1 text-sm text-ink-muted">备注「培训」</p>
        </section>
      </Container>
    </>
  )
}
