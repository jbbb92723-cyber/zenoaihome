import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'

export const metadata: Metadata = {
  title: '关于我',
  description:
    '我是 Zeno。装修行业 16 年，从工地现场走出来。现在把报价、预算、施工、验收和居住场景里的判断，整理成文章、清单、工具和服务。',
}

const believes = [
  '真实比包装重要。',
  '清晰比热闹重要。',
  '过程比口号重要。',
  '长期积累比短期爆发更可靠。',
]

const dontDo = [
  '不做传统装修公司官网式表达。',
  '不做"焦虑驱动"的营销话术。',
  '不做卖课式承诺和速成神话。',
]

const doingNow = [
  '把签约前最容易踩的报价、预算、合同问题，做成工具和清单。',
  '在文章里持续记录报价案例和工地现场的判断过程。',
  '提供从 ¥39 自查指南到 ¥9800 起居住场景服务的人工判断。',
  '把 AI 怎么接进装修这门传统行业，做成给同行看的延伸内容。',
]

export default function AboutPage() {
  return (
    <>
      {/* ── Custom Hero: 几何色块 + 16 年数字锚点 ── */}
      <div className="border-b border-border pt-12 pb-10 sm:pt-16 sm:pb-12">
        <Container size="content">
          <div className="grid items-end gap-8 sm:grid-cols-[1fr_auto]">
            <div>
              <p className="page-label mb-4">关于我</p>
              <h1 className="page-title mb-5">我是 Zeno</h1>
              <p className="max-w-2xl text-base leading-[1.7] text-ink-muted sm:text-lg">
                从装修现场出发，把普通业主真正会遇到的报价、预算、合同、施工和验收问题讲清楚。
              </p>
            </div>
            {/* 几何锚点 */}
            <div className="flex shrink-0 items-end gap-3">
              <div className="border-l-[3px] border-[#9a5424] pl-4">
                <p className="text-[3.5rem] font-bold leading-none tracking-tight text-[#272421]">16</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-[#9a5424]">年装修现场</p>
              </div>
              <div className="mb-1 h-8 w-px bg-[#e7ded3]" />
              <div>
                <p className="text-sm font-medium text-[#272421]">报价 · 预算 · 施工</p>
                <p className="text-xs text-[#7b6d5d]">经验做成工具和服务</p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container size="content" className="py-14 sm:py-16">
        {/* ── 我是谁（精简版） ── */}
        <section className="mb-12">
          <h2 className="section-heading mb-5">我是谁</h2>
          <p className="text-base text-ink leading-[1.85]">
            装修行业 16 年。跑过工地、盯过施工、审过无数报价单、处理过数不清的客户分歧。
            这些年教会我一件事：传统行业最大的消耗不在技术，在信息差、在信任成本、在好经验没被记下来。
          </p>
          <p className="text-base text-ink leading-[1.85] mt-4">
            我现在做的事很简单：帮装修这个行业透明一点，
            帮普通人少踩点坑、少花点冒柉钱、住得更舒展。
          </p>
          <p className="text-base text-ink leading-[1.85] mt-4">
            这个网站不是装修公司官网，也不是单纯的博客。
            它更像是我把过去 16 年攒下的现场判断，一件一件做成你能直接用的东西的地方——
            一篇文章、一张表、一个工具、一次咨询。
          </p>
          <p className="text-base text-ink leading-[1.85] mt-4">
            Zeno 这个名字来自芝诺。提醒我两件事：少做几件事；把要做的那件做到底。
          </p>
          <div className="mt-5">
            <Link
              href="/blog/zeno-from-renovation-to-opc"
              className="text-sm text-stone hover:underline underline-offset-2"
            >
              阅读完整文章：从装修现场到一人公司 →
            </Link>
          </div>
        </section>

        {/* ── 为什么用 AI ── */}
        <section className="mb-12">
          <h2 className="section-heading mb-5">为什么用 AI</h2>
          <p className="text-base text-ink leading-[1.85]">
            我不是技术出身的人。我从装修现场、客户沟通、报价审核和项目管理里走出来，
            知道传统行业真正痛的不是"不努力"，而是信息太散、沟通太慢、经验太难沉淀。
          </p>
          <p className="text-base text-ink leading-[1.85] mt-4">
            所以我用 AI 做的不是炫技，而是把客户问题、报价判断、施工经验、内容创作和服务流程，
            整理成可复用、可交易的工具和产品。AI 是让经验走得更远的工具，不是目的本身。
          </p>
        </section>

        {/* ── 我相信什么 ── */}
        <section className="mb-12">
          <h2 className="section-heading mb-5">我相信什么</h2>
          <div className="space-y-3">
            {believes.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="text-stone text-sm mt-1 shrink-0">—</span>
                <p className="text-sm text-ink leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 我不做什么 ── */}
        <section className="mb-12">
          <h2 className="section-heading mb-5">我不做什么</h2>
          <div className="space-y-3">
            {dontDo.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="text-stone text-sm mt-1 shrink-0">×</span>
                <p className="text-sm text-ink-muted leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 我现在在做什么 ── */}
        <section className="mb-12">
          <h2 className="section-heading mb-5">我现在在做什么</h2>
          <div className="space-y-3">
            {doingNow.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="text-stone text-sm mt-1 shrink-0">→</span>
                <p className="text-sm text-ink">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 如果你需要更具体的判断 ── */}
        <section className="mb-12 border border-border p-6 sm:p-8">
          <h2 className="section-heading mb-4">你需要的不是更多信息，而是具体的判断</h2>
          <p className="text-sm text-ink-muted leading-relaxed mb-2">
            手里有报价单、方案、预算或施工问题，可以直接看我现在开放的服务。
          </p>
          <p className="text-sm text-ink-muted leading-relaxed mb-5">
            想把 AI 接进工作流，可以先看咨询方向。
          </p>
          {/* 改了什么：CTA 文案从“看看我能帮什么”改成更具体的行动引导 */}
          <CTA href="/services" label="看服务边界" variant="secondary" />
        </section>

        {/* ── 联系入口 ── */}
        <section className="border-t border-border pt-10">
          <h2 className="section-heading mb-4">如果你想联系我</h2>

          <CTA href="/contact" label="去联系页" variant="secondary" />
        </section>
      </Container>
    </>
  )
}
