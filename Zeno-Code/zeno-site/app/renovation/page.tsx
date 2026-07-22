import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import CTA from '@/components/ui/CTA'
import StructuredData from '@/components/ui/StructuredData'
import { commercialLadder } from '@/data/services/commercial-ladder'

export const metadata: Metadata = {
  title: '装修判断服务｜免费初筛 → ¥2,500审查 → ¥2,000节点 → ¥299床垫',
  description:
    '17年经验帮你判断装修报价、施工节点和床垫选择。从免费工具开始，按需进入付费服务。不是卖方案，是帮你建立自己的判断。',
  alternates: {
    canonical: 'https://zenoaihome.com/renovation',
  },
}

// 从 commercial-ladder 提取展示用数据，按决策阶段重排
const ladderTiers = commercialLadder

// 流程说明
const journey = [
  {
    step: '1',
    title: '还没定方向？',
    desc: '先做免费居住诊断，把你的生活方式、家庭场景和预算捋一遍。不急着看报价——先搞清楚你要什么样的家。',
    action: '做居住诊断',
    href: '/living-diagnosis',
  },
  {
    step: '2',
    title: '拿到报价了？',
    desc: '先做免费初筛——2分钟勾几个框，至少知道报价有没有明显雷。高风险的话，再进¥2,500旗舰审查。',
    action: '免费初筛',
    href: '/tools/quote-check',
  },
  {
    step: '3',
    title: '签完合同要开工？',
    desc: '施工节点顾问——每个关键节点拍照发给我，告诉你看什么、漏了什么、下一步注意什么。',
    action: '看节点顾问',
    href: '/services/node-advisor',
  },
  {
    step: '4',
    title: '装完入住了？',
    desc: '最后一件大事——选一张能睡十几年的床垫。¥299起，内部结构保50年。自己选品自己卖，不是代购。',
    action: '选床垫',
    href: '/mattress',
  },
]

// 为什么找 Zeno 做判断
const whyZeno = [
  {
    label: '17年工地经验',
    desc: '不是从教程里学来的。水电、防水、贴砖、油漆、竣工——每个节点都在现场盯过。知道哪里会出问题，因为见过。',
  },
  {
    label: '只做判断，不卖施工',
    desc: '我不是装修公司，不推荐工长。我的立场和你的利益一致——帮你看清报价里的坑，帮你判断施工质量。',
  },
  {
    label: '保证可退款',
    desc: '审查服务：审过的项目被加价追不回——全额退。节点顾问：第一个节点不满意——后续全退。床垫：内部结构保50年。',
  },
]

export default function RenovationPage() {
  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: '装修判断服务',
            url: 'https://zenoaihome.com/renovation',
            description:
              '从免费工具到付费审查、节点顾问和床垫选购，17年经验帮你建立自己的装修判断。',
            inLanguage: 'zh-CN',
          },
        ]}
      />

      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden border-b border-border bg-ink">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(222,210,190,0.18),transparent_45%)]" aria-hidden />
        <Container size="content" className="relative py-16 sm:py-20 lg:py-24">
          <p className="text-sm font-semibold text-white/55">居住判断</p>
          <h1 className="editorial-display mt-5 max-w-[14ch] text-[2.8rem] leading-[1.05] text-white sm:text-[4.2rem] lg:text-[5.2rem]">
            不是帮你装，是帮你看清。
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            17年工地经验，不卖施工、不推荐工长、不带货。只做一件事——帮你在报价、施工和入住前，建立自己的判断。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CTA href="/tools/quote-check" label="先做免费初筛 →" variant="primary" />
            <p className="self-center text-sm text-white/50">
              还不确定？从免费的开始，不用急着付费。
            </p>
          </div>
        </Container>
      </section>

      {/* ── 判断路径：按阶段走 ── */}
      <Container size="content" className="py-16 sm:py-20">
        <section>
          <p className="text-sm font-semibold text-stone">按你的阶段走</p>
          <h2 className="editorial-display mt-4 text-[2.2rem] leading-[1.12] sm:text-[3rem]">
            不是越贵越好，是该到哪一步就用哪一步。
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-muted">
            有的人只需要免费初筛就够——知道了边界在哪，自己就能跟装修公司谈。有的人报价单几页密密麻麻，确实需要一个人逐项帮你看。按你的真实情况选。
          </p>

          <div className="mt-10 space-y-6">
            {journey.map((item, index) => (
              <div
                key={item.step}
                className="group relative grid gap-4 border border-border bg-surface p-5 transition-colors hover:border-stone sm:grid-cols-[3rem_1fr_auto] sm:items-center sm:p-6"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone text-sm font-bold text-white shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted max-w-2xl">{item.desc}</p>
                </div>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-stone hover:text-ink transition-colors shrink-0"
                >
                  {item.action} →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── 产品梯子一览 ── */}
        <section className="mt-16 sm:mt-20">
          <p className="text-sm font-semibold text-stone">完整判断服务</p>
          <h2 className="editorial-display mt-4 text-[2.2rem] leading-[1.12] sm:text-[3rem]">
            四层判断，一层比一层深。
          </h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ladderTiers.map((tier) => (
              <Link
                key={tier.href}
                href={tier.href}
                className={`group flex flex-col border border-border bg-surface p-5 transition-colors hover:border-stone ${
                  tier.tier === 'paid-flagship' ? 'ring-1 ring-stone/30' : ''
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-ink-faint uppercase tracking-wider">
                    {tier.badge}
                  </span>
                  {tier.tier === 'paid-flagship' && (
                    <span className="text-[0.6rem] font-semibold bg-stone text-white px-1.5 py-0.5 rounded uppercase tracking-wider">
                      推荐
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-ink">{tier.price}</p>
                <h3 className="mt-2 text-sm font-semibold text-ink">{tier.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted flex-1">{tier.whoFor}</p>
                <span className="mt-4 text-xs font-semibold text-stone group-hover:text-ink transition-colors">
                  {tier.cta} →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 为什么找 Zeno ── */}
        <section className="mt-16 border border-stone bg-surface-warm p-6 sm:mt-20 sm:p-8">
          <h2 className="text-xl font-semibold text-ink mb-6">为什么找我，而不是自己查？</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {whyZeno.map((item) => (
              <div key={item.label}>
                <h3 className="text-sm font-semibold text-ink">{item.label}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 还不确定？从免费开始 ── */}
        <section className="mt-16 border-t border-border pt-10 sm:mt-20">
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="border border-border bg-surface p-6">
              <h3 className="text-sm font-semibold text-ink mb-2">还没拿到报价？</h3>
              <p className="text-sm leading-relaxed text-ink-muted mb-4">
                先把你的生活方式和偏好捋一遍。搞清楚你要什么样的家，再去看报价。
              </p>
              <CTA href="/living-diagnosis" label="做居住诊断 →" variant="primary" />
            </div>
            <div className="border border-border bg-surface p-6">
              <h3 className="text-sm font-semibold text-ink mb-2">已经有报价单了？</h3>
              <p className="text-sm leading-relaxed text-ink-muted mb-4">
                2分钟免费初筛，至少知道报价有没有明显的坑。再决定要不要付费审查。
              </p>
              <CTA href="/tools/quote-check" label="免费初筛 →" variant="primary" />
            </div>
          </div>
        </section>

        {/* ── 底部 CTA ── */}
        <section className="mt-16 border-2 border-stone bg-surface-warm p-6 sm:p-8 text-center sm:mt-20">
          <h2 className="text-xl font-semibold text-ink mb-3">
            把你的报价单或问题发给我
          </h2>
          <p className="text-2xl font-bold text-stone tracking-wide mb-2">zanxiansheng2025</p>
          <p className="text-sm text-ink-muted mb-5 max-w-lg mx-auto">
            加微信，备注「装修」。把报价单拍照发我，或者直接说你的情况——城市、面积、装修阶段。
            我帮你看下一步该做什么。
          </p>
          <CTA href="/contact" label="查看联系方式 →" variant="primary" />
        </section>

        {/* ── 另一个领域：AI 服务 ── */}
        <section className="mt-12 border-t border-border pt-10">
          <h2 className="text-lg font-semibold text-ink mb-3">装修之外——AI 培训、工作流、知识库</h2>
          <p className="text-sm text-ink-muted mb-5 max-w-xl">
            赞诺也提供面向企业和个人的 AI 实战服务：培训、工具与工作流搭建、企业知识库和智能体开发。把传统行业的经验转化为 AI 能用的资产。
          </p>
          <CTA href="/services" label="查看 AI 服务 →" variant="secondary" />
        </section>
      </Container>
    </>
  )
}
