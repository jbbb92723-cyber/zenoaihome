import type { Metadata } from 'next'
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
              <div key={mod.title} className="border border-border bg-surface p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone">
                  {mod.duration} · {mod.audience}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-ink">{mod.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {mod.description}
                </p>
                <ul className="mt-4 space-y-2">
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

        {/* CTA */}
        <section className="border border-border bg-surface p-6 sm:p-8 text-center">
          <h2 className="text-xl font-semibold text-ink mb-3">邀请我来培训</h2>
          <p className="mb-5 text-sm leading-relaxed text-ink-muted max-w-lg mx-auto">
            如果你是 HR、商会负责人、社群主理人，需要一位既真干过又能讲清楚的人——加微信，我把详细提纲和过往案例发你。
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
