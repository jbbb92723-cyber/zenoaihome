import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import CTA from '@/components/ui/CTA'
import StructuredData from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: '装修报价与合同人工审查｜¥2,500 一次审核',
  description:
    '基于长期传统行业经营与装修项目实践，逐项审核报价与合同材料，写清待确认项、追问和修改方向。材料与范围确认后，目标 24 小时内交付。',
  alternates: {
    canonical: 'https://zenoaihome.com/services/quote-review',
  },
}

/* ── 13边界 ── */
const boundaries = [
  { label: '基础部分总合计', risk: '总价是否包含全部已知项目，哪些费用仍需另计？' },
  { label: '水电点位', risk: '点位如何计数，增减一个点位按什么单价确认？' },
  { label: '按实际结算', risk: '实际工程量由谁测量，何时确认，是否约定单价或上限？' },
  { label: '防水', risk: '材料型号、施工范围、厚度或遍数、闭水与验收要求是否写清？' },
  { label: '封窗', risk: '型材、玻璃、五金、安装和收口分别包含什么？' },
  { label: '垃圾外运', risk: '清运、下楼、装车和外运是否重复计费或留有空白？' },
  { label: '另计·甲供·暂估', risk: '哪些费用未进入当前总价，后续怎样确认？' },
  { label: '口头承诺', risk: '重要说明是否已经写回报价、合同或双方确认的附件？' },
  { label: '低价报价', risk: '价格差异来自材料与范围取舍，还是项目或工程量没有列全？' },
  { label: '付款节点', risk: '每次付款对应哪些已完成工作和验收条件？' },
  { label: '验收质保', risk: '什么时候验、按什么标准验，未通过如何整改？' },
  { label: '材料型号', risk: '品牌之外，系列、型号、规格和可替换条件是否明确？' },
  { label: '工期顺延', risk: '工期从哪天起算，哪些情况可以顺延，如何书面确认？' },
]

/* ── 服务包含 ── */
const bonusItems = [
  { name: '逐项标注', desc: '把问题定位到具体页面和条目，方便你回到原材料逐项核对。' },
  { name: '追问清单', desc: '把模糊项目改写成可以直接向施工方确认的问题。' },
  { name: '修改方向', desc: '说明哪些内容适合进入报价备注、合同附件或书面确认。' },
  { name: '约定范围内复核', desc: '报告交付后，按服务确认单约定的期限和范围说明审核结论。' },
]

/* ── 保证 ── */
const guaranteeItems = [
  '审核范围内出现后续争议时，我会协助你复核材料、定位边界并准备沟通依据',
  '退款条件、服务范围和协助期限，会在开始前的服务确认单中写清楚',
  '如果材料不适合这项服务，我会先说明原因，不让你为不匹配的判断付费',
]

/* ── 不适合这个服务的人 ── */
const notForItems = [
  { label: '已有独立专业人员逐项审过材料', detail: '先使用已有结论，不需要重复购买相同范围的审核。' },
  { label: '只想知道本地市场最低价', detail: '这项服务核对文件边界，不提供当地最低价承诺或议价代理。' },
  { label: '需要现场验收或法律结论', detail: '远程材料审查不能替代现场监理、检测、造价或法律专业意见。' },
]

/* ── FAQ ── */
const faqs = [
  {
    q: '¥2,500是一次还是一年？',
    a: '一次。开始前会确认这一轮包含的报价、合同和附件；更换施工方或新增整套材料时，需要重新确认范围和价格。',
  },
  {
    q: '你只服务南宁吗？',
    a: '这项服务可以远程完成，重点核对文件中的范围、计量、材料、付款和责任。各地单价、法规和现场条件不同，需要当地专业人员确认的部分会在报告中标明。',
  },
  {
    q: '审完就完了吗？施工中出了问题怎么办？',
    a: '审核范围内出现争议时，可以按服务确认单约定的范围和期限联系我复核。它不是现场监理，也不替代法律审查。',
  },
  {
    q: '能帮我砍价吗？',
    a: '不代替你砍价。报告会把问题定位到具体页码和条目，例如“第 3 页第 5 项的工程量来源和计量规则需要确认”，方便你带着原文向施工方追问。',
  },
  {
    q: '退款和后续协助怎么约定？',
    a: '开始前会书面确认审核材料、交付范围、协助期限和退款边界。没有写清的承诺，不会默认包含在服务里。',
  },
]

export default function QuoteReviewPage() {
  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: '装修报价 / 合同人工审查',
            description:
              '基于长期传统行业经营与装修项目实践，逐项审核报价与合同材料，按 13 个边界整理待确认项、追问和修改方向。',
            provider: { '@type': 'Person', name: 'Zeno' },
            offers: { '@type': 'Offer', priceCurrency: 'CNY', price: '2500' },
            url: 'https://zenoaihome.com/services/quote-review',
          },
        ]}
      />

      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden border-b border-border bg-canvas">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(222,210,190,0.42),transparent_38%)]" aria-hidden />
        <Container size="content" className="relative py-14 sm:py-18">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone">
            装修报价与合同人工审查
          </p>
          <h1 className="editorial-display mt-5 max-w-4xl text-[2.2rem] leading-[1.12] text-ink sm:text-[3.2rem]">
            签合同之前，先让一份报价被认真看一遍。
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
            一份装修报价单，少则几页，多则几十页。我会在签字之前帮你逐项查找范围、计量、材料、付款和责任中需要继续确认的地方。
          </p>

          {/* 价格 */}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-5xl font-bold text-ink">¥2,500</span>
            <span className="text-base text-ink-muted">/ 一次审核，目标 24 小时内交付</span>
          </div>

          {/* 保证 */}
          <div className="mt-3 border-l-2 border-stone pl-4">
            <p className="text-sm font-semibold text-stone">
              审核范围内出现争议时，我会按确认的服务范围协助你复核材料和沟通依据。
            </p>
            <p className="mt-1 text-xs text-ink-faint">
              先确认材料、审核范围、交付时间和后续协助边界，再开始服务。
            </p>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CTA href="/contact" label="把报价单发给我 →" variant="primary" />
            <p className="text-sm text-ink-muted">
              微信 zanxiansheng2025 · 备注「审报价」· 先发去敏样张确认范围
            </p>
          </div>
          <p className="mt-4 max-w-2xl text-xs leading-6 text-ink-faint">
            请先删除身份证号、银行卡号、密码、客户姓名等不必要的敏感信息。材料使用和删除说明见
            <Link href="/privacy" className="ml-1 underline underline-offset-2 hover:text-ink-muted">隐私说明</Link>。
          </p>
        </Container>
      </section>

      <Container size="content" className="py-section">

        {/* ── 你得到什么 ── */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-ink mb-3">¥2,500，你得到什么</h2>
          <p className="text-sm text-ink-muted mb-8 max-w-2xl">
            不是笼统地说“这份报价有问题”，而是指出具体页码、具体条目、缺少什么信息，以及应该向谁确认。
          </p>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                label: '逐项审核报告',
                desc: '按 13 个边界逐项核对。每个待确认项尽量标注到具体页码和条目，并给出追问或修改方向。',
              },
              {
                label: '目标 24 小时内交付',
                desc: '材料清晰、范围确认后开始计时；材料复杂或需要补充时，会在开始前重新确认交付时间。',
              },
              {
                label: '材料提交要求',
                desc: '提供清晰、连续的报价与合同材料，并说明签约阶段和最关心的问题；提交前先删除不必要的敏感信息。',
              },
            ].map((item) => (
              <div key={item.label} className="border border-border bg-surface p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone mb-3">
                  {item.label}
                </p>
                <p className="text-sm leading-relaxed text-ink">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 13个风险边界 ── */}
        <section className="mb-16 border border-stone bg-surface-warm p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink mb-2">
            13个风险边界，逐项排查
          </h2>
          <p className="text-sm text-ink-muted mb-6">
            这些边界覆盖报价、合同和现场交付中反复需要核对的项目；是否适用于你的情况，以你提交的具体材料为准。
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {boundaries.map((b) => (
              <div key={b.label} className="border border-border bg-canvas p-4">
                <h3 className="text-sm font-semibold text-ink">{b.label}</h3>
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">{b.risk}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 服务包含 ── */}
        <section className="mb-16 border-2 border-stone bg-surface-warm p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink mb-2">
            一次审核具体包含什么
          </h2>
          <p className="text-sm text-ink-muted mb-6 max-w-2xl">
            价格对应以下审核内容。交付范围、协助期限和退款边界，以开始前双方确认的服务说明为准。
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {bonusItems.map((bonus) => (
              <div key={bonus.name} className="border border-border bg-canvas p-5">
                <h3 className="text-sm font-semibold text-ink">{bonus.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{bonus.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 风险逆转：保证 ── */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-ink mb-6">
            先把服务边界写清，再开始判断。
          </h2>
          <div className="border-2 border-stone bg-surface p-6 sm:p-8">
            <p className="text-sm text-ink-muted mb-5">
              这项服务不是替你保证施工结果，而是把报价和合同里需要追问、修改和留痕的地方逐项整理出来：
            </p>
            <ul className="space-y-3">
              {guaranteeItems.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-ink">
                  <span className="mt-0.5 shrink-0 text-stone font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-xs text-ink-faint max-w-2xl">
            具体服务范围、交付时间、协助期限和退款边界，以开始前双方确认的服务说明为准。
          </p>
        </section>

        {/* ── 定价边界 ── */}
        <section className="mb-16 border border-border bg-surface p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink mb-4">为什么是 ¥2,500</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                num: '一份',
                label: '材料范围',
                desc: '针对双方确认的一份报价或合同材料逐项审核；更换施工方或新增整套材料需重新确认范围。',
              },
              {
                num: '24h',
                label: '目标交付时间',
                desc: '材料清晰、范围确认后，目标在 24 小时内交付；复杂材料会在开始前另行说明。',
              },
              {
                num: '13项',
                label: '检查边界',
                desc: '按 13 个边界检查范围、计量、材料、付款和责任，最终结论仍以具体文件为准。',
              },
            ].map((item) => (
              <div key={item.label} className="text-center p-4">
                <p className="text-2xl font-bold text-stone">{item.num}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-ink">{item.label}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 不适合这个服务的人 ── */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-ink mb-4">谁不适合这个服务</h2>
          <p className="text-sm text-ink-muted mb-5">
            是否适合这项服务，取决于材料状态、项目阶段和你需要的判断范围。以下情况可以先不购买：
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {notForItems.map((item) => (
              <div key={item.label} className="border border-border bg-surface p-5">
                <h3 className="text-sm font-semibold text-ink mb-2">{item.label}</h3>
                <p className="text-xs leading-relaxed text-ink-muted">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
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

        {/* ── 最终 CTA ── */}
        <section className="border-2 border-stone bg-surface-warm p-6 sm:p-8 text-center">
          <h2 className="text-xl font-semibold text-ink mb-3">
            现在，把你的报价单发给我
          </h2>
          <p className="text-2xl font-bold text-stone tracking-wide mb-2">zanxiansheng2025</p>
          <p className="text-sm text-ink-muted mb-5 max-w-md mx-auto">
            加微信，备注「审报价」。先发材料样张确认是否适合这项服务；开始后按 13 个边界逐项检查，并把问题定位到具体页码和条目。
          </p>
          <p className="text-xs text-ink-faint">
            这项服务只对确认范围内的报价和合同材料负责，不替代现场监理、法律意见或施工方责任。
          </p>
        </section>

        {/* ── 还不确定？先用免费工具 ── */}
        <section className="mt-12 border-t border-border pt-10">
          <h2 className="text-lg font-semibold text-ink mb-3">还不确定？</h2>
          <p className="text-sm text-ink leading-relaxed mb-2">
            先用免费的「装修报价风险初筛」按问题核对哪些边界已经写清。
          </p>
          <p className="text-sm text-ink-muted mb-5 max-w-xl">
            初筛由勾选项和浏览器本地关键词规则生成，不会自动理解上传文件。先把缺失边界交给施工方补充；仍需结合原文逐项判断时，再确认人工审查范围。
          </p>
          <div className="flex flex-wrap gap-4">
            <CTA href="/tools/quote-check" label="先做免费初筛 →" variant="primary" />
            <CTA href="/blog" label="先看文章，建立判断 →" variant="secondary" />
          </div>
        </section>

        {/* ── 签完合同了？盯施工 ── */}
        <section className="mt-12 border-t border-border pt-10">
          <h2 className="text-lg font-semibold text-ink mb-3">签完合同，要开工了？</h2>
          <p className="text-sm text-ink-muted mb-5 max-w-xl">
            如果你已经签了合同准备开工，施工节点顾问可以在约定节点提供拍摄清单、整理可见疑点和现场追问。¥2,000 起，具体节点、材料条件和退款边界在开始前确认；远程判断不替代现场监理或工程验收。
          </p>
          <div className="flex flex-wrap gap-4">
            <CTA href="/services/node-advisor" label="¥2,000起 节点顾问 →" variant="primary" />
            <CTA href="/renovation" label="看完整判断路径 →" variant="secondary" />
          </div>
        </section>

      </Container>
    </>
  )
}
