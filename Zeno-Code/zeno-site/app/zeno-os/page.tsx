import type { Metadata } from 'next'
import Container from '@/components/ui/Container'
import CTA from '@/components/ui/CTA'
import StructuredData from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: '装修报价判断框架｜13 个签约前检查边界',
  description:
    '基于长期传统行业经营与装修项目实践整理的 13 个报价检查边界，帮助你在签约前看清范围、责任和付款节点。',
  alternates: {
    canonical: 'https://zenoaihome.com/zeno-os',
  },
}

const principles = [
  {
    num: '01',
    title: '先看总价是否完整',
    body: '基础总价之外，把另计、甲供、暂估和按实际结算逐项找出来。总价只有在范围清楚时才有比较意义。',
  },
  {
    num: '02',
    title: '再看项目能否核对',
    body: '水电点位、材料型号、施工数量都要有明确的计量方式。只写一个模糊的“按实际结算”，后面就没有共同的尺子。',
  },
  {
    num: '03',
    title: '把口头承诺写下来',
    body: '品牌、型号、遍数、包含的服务和超出后的算法，都应该回到报价或合同里。没有写清楚的承诺，很难在争议时核对。',
  },
  {
    num: '04',
    title: '让付款跟验收相连',
    body: '付款节点不是财务细节，而是项目中的主动权安排。每一笔付款前，都要知道对应什么完成结果、谁来确认、出了问题怎么办。',
  },
  {
    num: '05',
    title: '遇到不确定时先停下来',
    body: '低价、模糊词和前后矛盾不一定代表对方有问题，但都值得在签约前问清楚。不能核对的地方，不要用猜测替代确认。',
  },
]

const boundaries = [
  { name: '基础部分总合计', detail: '是不是最终价，还是后面还有' },
  { name: '水电点位', detail: '"个"字背后的计量陷阱' },
  { name: '按实际结算', detail: '七个字底下该有的半页纸规则' },
  { name: '防水', detail: '品牌只回答了七分之一' },
  { name: '封窗', detail: '参数之外的增项来源' },
  { name: '垃圾外运', detail: '报价编号自己跟自己打架' },
  { name: '另计·甲供·暂估', detail: '三个词告诉你总价不完整' },
  { name: '口头承诺', detail: '没写进报价单等于没说过' },
  { name: '低价报价', detail: '便宜来自清晰取舍还是漏项少算' },
  { name: '付款节点', detail: '不是财务细节，是主动权安排' },
  { name: '验收质保', detail: '"已验收"三个字的背后' },
  { name: '材料型号', detail: '同品牌不同系列差价可达一倍' },
  { name: '工期顺延', detail: '60天从哪天算起' },
]

const usageSteps = [
  {
    label: '先看框架',
    body: '先用这 13 个边界检查报价的范围、计量、责任和节点。',
    href: '/zeno-os',
    action: '阅读本页框架',
  },
  {
    label: '自己初筛',
    body: '把具体报价放进初筛工具，先定位需要回到施工方确认的地方。',
    href: '/tools/quote-check',
    action: '开始报价初筛',
  },
  {
    label: '申请具体审核',
    body: '如果你已经有具体报价单，需要逐项确认范围、金额和责任，可以申请人工审核。',
    href: '/services/quote-review',
    action: '查看审核服务',
  },
]

const faqs = [
  {
    q: '这套框架适合什么时候使用？',
    a: '最适合在签约前拿到报价单时使用。已经开工或发生争议时，它仍然可以帮助你整理问题，但不能替代监理、法律或工程鉴定。',
  },
  {
    q: '我可以自己使用这套框架吗？',
    a: '可以。页面上的边界、文章和工具都面向公开使用，你可以据此整理自己的检查表。具体项目的判断仍然要以报价、合同和现场材料为准。',
  },
  {
    q: '什么时候需要人工审核？',
    a: '当报价涉及多种计价方式、项目之间存在矛盾，或者你已经找到问题但无法判断影响范围时，可以把具体材料交给人工审核。服务开始前会先确认范围、交付物、周期和退款边界。',
  },
]

export default function ZenoOSPage() {
  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: '装修报价判断框架 — 13 个签约前检查边界',
            url: 'https://zenoaihome.com/zeno-os',
            description: '基于长期传统行业经营与装修项目实践整理的 13 个报价检查边界，帮助业主在签约前看清范围、责任和付款节点。',
            inLanguage: 'zh-CN',
          },
        ]}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-border bg-canvas">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(222,210,190,0.34),transparent_38%)]" aria-hidden />
        <Container size="content" className="relative py-14 sm:py-18">
          <div className="flex items-center gap-3 mb-5">
            <span className="bg-ink text-paper text-xs font-bold px-3 py-1">装修报价判断框架</span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone">公开判断框架 v1</span>
          </div>
          <h1 className="editorial-display max-w-4xl text-[2.4rem] leading-[1.1] text-ink sm:text-[3.2rem]">
            装修风险判断，不应该是一个人的秘密。
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
            这些检查边界来自长期传统行业经营与装修项目实践，帮助你在签约前看清报价范围、责任和付款节点。
            你可以先自己检查；如果手里的具体材料仍有疑问，再决定是否需要人工审核。
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <CTA href="/tools/quote-check" label="先用免费工具试试 →" variant="primary" />
            <CTA href="/services/quote-review" label="¥2,500 完整审核 →" variant="secondary" />
          </div>
        </Container>
      </section>

      <Container size="content" className="py-section">

        {/* 五个检查原则 */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-ink mb-3">五个检查原则</h2>
          <p className="text-sm text-ink-muted mb-8 max-w-2xl">
            每一条都来自装修报价、合同和现场交付中反复出现的问题。
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((p) => (
              <div key={p.num} className="border border-border bg-surface p-6">
                <p className="text-3xl font-bold text-stone/20 mb-3">{p.num}</p>
                <h3 className="text-sm font-semibold text-ink mb-2">{p.title}</h3>
                <p className="text-xs leading-relaxed text-ink-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 13边界 */}
        <section className="mb-16 border border-stone bg-surface-warm p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink mb-2">核心框架：13边界</h2>
          <p className="text-sm text-ink-muted mb-6 max-w-2xl">
            一份装修报价单可以从 13 个边界逐项核对。它们覆盖报价、合同和现场交付中反复需要确认的范围、计量与责任问题。
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {boundaries.map((b) => (
              <div key={b.name} className="border border-border bg-canvas p-4">
                <h3 className="text-sm font-semibold text-ink">{b.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">{b.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-ink-faint">
            当前版本是公开判断框架 v1，可用于整理问题和追问清单。它不代表每一条都已完成外部验证，也不能替代针对具体报价、合同和现场材料的专业判断。
          </p>
        </section>

        {/* 使用路径 */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-ink mb-3">接下来怎么用</h2>
          <p className="text-sm text-ink-muted mb-8 max-w-2xl">
            先处理你手里的具体问题。能自己确认的地方自己确认，需要具体判断时再了解服务范围。
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {usageSteps.map((step) => (
              <div key={step.label} className="border border-border bg-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone mb-4">{step.label}</p>
                <p className="text-sm leading-relaxed text-ink-muted">{step.body}</p>
                <CTA href={step.href} label={`${step.action} →`} variant="ghost" />
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-ink mb-6">常见问题</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="border border-border bg-surface p-5">
                <h3 className="text-sm font-semibold text-ink mb-2">{faq.q}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 底部CTA */}
        <section className="border-2 border-stone bg-surface-warm p-6 sm:p-8 text-center">
          <h2 className="text-xl font-semibold text-ink mb-3">
            先把报价单看清楚，再决定下一步。
          </h2>
          <p className="text-sm text-ink-muted mb-5 max-w-md mx-auto">
            报价初筛适合先定位问题；具体审核适合需要逐项确认材料、金额和责任边界的情况。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <CTA href="/tools/quote-check" label="免费初筛 →" variant="primary" />
            <CTA href="/services/quote-review" label="¥2,500 完整审核 →" variant="secondary" />
          </div>
        </section>

      </Container>
    </>
  )
}
