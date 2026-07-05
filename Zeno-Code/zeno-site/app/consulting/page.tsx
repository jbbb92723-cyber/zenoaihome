import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/ui/Container'

export const metadata: Metadata = {
  title: '咨询服务｜赞诺的一对一选购建议',
  description:
    '17年床垫与装修经验，帮你做一对一的选购判断。简单问题免费看，完整方案按需付费——只为你，不为任何品牌。',
  alternates: {
    canonical: 'https://zenoaihome.com/consulting',
  },
}

const FAQS = [
  {
    q: '你在哪个城市？只能线上吗？',
    a: '我在南宁。咨询全部线上完成——微信沟通，不用见面。你有报价单、合同、户型图、身体情况，发过来就行。',
  },
  {
    q: '免费咨询和付费咨询有什么区别？',
    a: '免费咨询适合简单问题，比如"这两款床垫怎么选""这个报价项目是不是贵了"——我抽空看，给个方向。付费咨询适合需要系统判断的情况，比如完整的睡眠方案、整份报价审核、签约前综合判断——我会花专门的时间，按流程出报告。',
  },
  {
    q: '你怎么收费？',
    a: '看具体需求。床垫选购建议、装修报价审核、居住方案判断——不同服务花的时间不一样。加微信 zanxiansheng2025，说明你的情况，我把对应的流程和费用发给你。不是销售套路，你觉得不合适，直接不回就行。',
  },
  {
    q: '你不是卖床垫的吧？',
    a: '我不是卖床垫的。我收的是咨询费，不是销售提成。所以我的建议，只为你，不为任何品牌。你觉得哪款好就去哪买，我不带货。',
  },
  {
    q: '能帮我看合同吗？',
    a: '可以帮你看合同里的付款节点、验收标准、材料规格、延期责任和口头承诺是否落字。但我不是律师，不替代法律审查。涉及法律效力的问题，建议同步咨询专业律师。',
  },
  {
    q: '装修问题呢？你也看吗？',
    a: '看。装修是我做了17年的老本行。报价、合同、预算、施工标准、验收——这些我比床垫还熟。加微信说清楚你的阶段和需求。',
  },
]

export default function ConsultingPage() {
  return (
    <>
      <section className="border-b border-border bg-surface-warm">
        <Container size="content" className="py-14 sm:py-16">
          <p className="page-label mb-4">咨询服务</p>
          <h1 className="page-title mb-5">睡了17年床垫，我比你自己更清楚你适合什么</h1>
          <p className="max-w-2xl text-base leading-[1.85] text-ink-muted sm:text-lg">
            如果你正在几款床垫之间纠结，拿不定主意；腰不舒服，不知道什么样的床垫能帮到你；看完了我的文章，还是不确定自己的判断对不对——可以找我聊聊。
          </p>
        </Container>
      </section>

      <Container size="content" className="py-14 sm:py-16">

        {/* ── 两条路径 ── */}
        <section className="mb-14 grid gap-6 sm:grid-cols-2">
          <div className="border border-border bg-surface p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone mb-3">免费</p>
            <h2 className="text-lg font-semibold text-ink mb-3">简单问题，免费帮你看</h2>
            <p className="text-sm leading-relaxed text-ink-muted mb-4">
              加微信，把你的情况简单说清楚，我有空就回。适合问题明确、不需要深度分析的场景。
            </p>
            <ul className="space-y-1.5 text-sm text-ink-muted">
              <li>· 两款床垫怎么选</li>
              <li>· 这个报价项目合理吗</li>
              <li>· 看了文章还有一个小疑问</li>
            </ul>
          </div>

          <div className="border border-stone bg-surface-warm p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone mb-3">付费</p>
            <h2 className="text-lg font-semibold text-ink mb-3">完整方案，一对一定制</h2>
            <p className="text-sm leading-relaxed text-ink-muted mb-4">
              根据你的身体状况、睡眠习惯、预算和需求，做一套完整的选购建议。具体费用和流程，加微信后我发给你。
            </p>
            <ul className="space-y-1.5 text-sm text-ink-muted">
              <li>· 完整睡眠方案 + 床垫推荐</li>
              <li>· 整份装修报价逐项审核</li>
              <li>· 签约前居住方案综合判断</li>
            </ul>
          </div>
        </section>

        {/* ── 核心承诺 ── */}
        <section className="mb-14 border border-border bg-surface p-6 sm:p-8">
          <h2 className="section-heading mb-4">我的承诺</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { title: '只为你，不为任何品牌', desc: '我不是卖床垫的，也不是装修公司的销售。我收的是咨询费，所以我的建议没有利益偏向。' },
              { title: '不制造焦虑，不逼单', desc: '你觉得需要了再来。我不会追着你问"考虑得怎么样了"。信任是长期的事，不是一次性成交。' },
              { title: '帮你看清，不替你做决定', desc: '我会把选项拆开、把风险说清、把取舍讲明白。但最终选择，你自己做——没有人比你更了解自己的生活。' },
            ].map((item) => (
              <div key={item.title} className="p-4">
                <h3 className="text-sm font-semibold text-ink mb-2">{item.title}</h3>
                <p className="text-xs leading-relaxed text-ink-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 联系入口 ── */}
        <section className="mb-14 border-2 border-stone bg-surface-warm p-6 sm:p-8 text-center">
          <h2 className="text-xl font-semibold text-ink mb-3">加我微信</h2>
          <p className="text-2xl font-bold text-stone tracking-wide mb-4">zanxiansheng2025</p>
          <p className="text-sm leading-relaxed text-ink-muted max-w-md mx-auto mb-5">
            加微信时请备注你的来意——比如"床垫选购""报价审核""综合判断"。说清楚背景，我能更快帮你判断。
          </p>
          <div className="border border-border bg-surface p-4 text-left max-w-md mx-auto">
            <p className="text-xs font-semibold text-ink mb-2">建议备注信息</p>
            <ul className="space-y-1 text-xs text-ink-muted">
              <li>1. 你当前阶段（正在看 / 已选好几款 / 快下单了）</li>
              <li>2. 预算范围和城市</li>
              <li>3. 最关心的问题（一句话就行）</li>
            </ul>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="mb-14">
          <h2 className="section-heading mb-6">常见问题</h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="border border-border bg-surface p-5">
                <h3 className="text-sm font-semibold text-ink mb-2">{faq.q}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 还没想好？ ── */}
        <section className="border-t border-border pt-10">
          <p className="text-sm text-ink leading-relaxed mb-4">
            不急。你先想好，觉得需要了再来。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/blog"
              className="text-sm text-stone hover:underline underline-offset-2"
            >
              先看文章，建立判断 →
            </Link>
            <Link
              href="/about"
              className="text-sm text-stone hover:underline underline-offset-2"
            >
              了解我是谁 →
            </Link>
          </div>
        </section>

      </Container>
    </>
  )
}
