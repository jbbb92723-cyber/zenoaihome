import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import Container from '@/components/Container'
import CTA from '@/components/CTA'

export const metadata: Metadata = {
  title: '关于我',
  description:
    '我是 Zeno。装修行业 16 年，从工地现场走出来。现在用 AI、开发、内容和产品化能力，把真实经验逐步沉淀成可复用、可交易、可持续的个人资产。',
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
  '持续更新文章和专题内容。',
  '沉淀装修与居住相关的实用资料和在线工具。',
  '把 AI 工作流用于内容生产、工具开发与知识整理。',
  '搭建一人公司系统——让内容、资料、工具、服务和数字产品形成可持续循环。',
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="关于我"
        title="我是 Zeno"
        subtitle="从装修现场出发，用 AI、产品和内容，逐步搭建更自由的个人事业系统。"
      />

      <Container size="content" className="py-14 sm:py-16">
        {/* ── 我是谁（精简版） ── */}
        <section className="mb-12">
          <h2 className="section-heading mb-5">我是谁</h2>
          <p className="text-base text-ink leading-[1.85]">
            装修行业 16 年。跑过工地、盯过施工、审过无数报价单、处理过数不清的客户分歧。
            这些年教会我一件事：传统行业最大的消耗不在技术，在信息差、在信任成本、在好经验没有被系统化。
          </p>
          <p className="text-base text-ink leading-[1.85] mt-4">
            我不想把自己固定成某一种身份。装修只是我最熟悉的起点。
            我现在更关心的是：一个普通传统行业从业者，能不能借助 AI、开发、内容和产品化能力，
            逐步摆脱重交付，建立更自由、更有创造力的事业系统。
          </p>
          <p className="text-base text-ink leading-[1.85] mt-4">
            所以这个网站不是装修公司官网，也不是单纯的个人博客。
            它是我把经验变成工具、把内容变成资产、把服务变成产品的长期实验场。
          </p>
          <p className="text-base text-ink leading-[1.85] mt-4">
            Zeno 这个名字来自斯多葛哲学——提醒我在混乱中保持清醒，在压力下做对的事。
            装修是支点，AI 是工具，产品化是方向，自由度是目标。
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
          <h2 className="section-heading mb-4">如果你需要的不是更多信息，而是更具体的判断</h2>
          <p className="text-sm text-ink-muted leading-relaxed mb-2">
            如果你正在装修，手里已经有报价单、方案、预算或施工判断问题，可以直接看我现在开放的服务。
          </p>
          <p className="text-sm text-ink-muted leading-relaxed mb-5">
            如果你想把 AI 真正接进自己的工作流，而不是停留在工具尝鲜，也可以先看看我提供的咨询方向。
          </p>
          {/* 改了什么：CTA 文案从“查看服务”改为更具体的行动引导 */}
          <CTA href="/services" label="看看我能帮什么" variant="secondary" />
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
