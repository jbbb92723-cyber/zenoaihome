import type { Metadata } from 'next'
import Container from '@/components/ui/Container'
import CTA from '@/components/ui/CTA'
import StructuredData from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: '报价/合同快审｜¥499，报价+合同+付款节点一起看',
  description:
    '在比较两三家装修公司？17年经验帮你看哪份报价更实在、哪份合同更靠谱。完整报价逐项分析+合同关键条款检查+付款节点建议+漏项增项标记。',
  alternates: {
    canonical: 'https://zenoaihome.com/services/quote-standard',
  },
}

/* ── 审查范围 ── */
const scopeItems = [
  {
    label: '报价逐项分析',
    desc: '不是看总价，是拆开每一项——单价合理吗、数量对吗、有没有重复收费、有没有漏项。你会拿到一份逐项标注的结果。',
  },
  {
    label: '合同关键条款检查',
    desc: '付款比例是否合理、工期顺延条款是否公平、违约责任是否对等、口头承诺有没有写进去——这些都是签约后被动的源头。',
  },
  {
    label: '付款节点建议',
    desc: '每一笔钱该在什么时候付、付多少、付之前要看到什么——按节点付款，而不是按信任付款。',
  },
  {
    label: '漏项和增项风险标记',
    desc: '哪些项目报价里没写全、哪些地方最容易变成"后期增项"——在签合同之前标出来，比施工中被动接受好得多。',
  },
  {
    label: '三家公司横向对比',
    desc: '如果你在比较两三家，我可以帮你并排看——同一套判断标准，哪家更实在一目了然。最多可以一起看3份。',
  },
]

/* ── 和 ¥2,500 的区别 ── */
const vsFlagship = [
  { label: '¥499 快审', items: ['报价逐项分析', '合同关键条款检查', '付款节点建议', '漏项增项标记', '支持3家公司横向对比', '2-3个工作日内出结果'] },
  { label: '¥2,500 全审', items: ['₊ 13个风险边界逐项排查', '₊ 每个问题标注到"第几页第几行"', '₊ 24小时内出结果', '₊ 赠品：合同避雷指南+3个月答疑+1年售后+谈判话术', '₊ 保证：审过的项目被加价帮你追回，追不回全额退款'] },
]

/* ── 赠品 ── */
const bonusItems = [
  { name: '装修公司谈判追问清单', value: '¥99', desc: '不知道怎么开口质疑报价？照着清单问，一句话一句话帮你写好了。' },
  { name: '付款节点对照表模板', value: '¥79', desc: '每个付款节点对应什么验收标准——施工方说"该付款了"，你先对照这个表问三个问题。' },
]

/* ── 保证 ── */
const guaranteeItems = [
  '如果审核后你发现的问题少于3个——退款',
  '不是"不满意退款"，是客观标准：一份没被专业眼光看过的报价单，正常会有3个以上值得追问的地方。少于3个，说明这家确实靠谱——¥499退给你。',
  '换句话说：你花¥499，要么拿回一份至少指出3个问题的报告，要么拿回¥499。你怎么都不亏。',
]

/* ── 算账 ── */
const comparison = [
  {
    label: '不审查',
    items: [
      '三份报价摆在一起，只能比总价——但你不知道总价低的那家是不是因为漏了项目',
      '合同里的"工期顺延由施工方确认"——签的时候没注意，工期拖3个月你只能等',
      '付款比例70%/25%/5%——签完发现主动权全在对方手里',
      '口头承诺"这个你放心，到时候给你弄好"——没有任何法律效力',
    ],
  },
  {
    label: '花 ¥499 审查',
    items: [
      '三份报价并排看，知道每家便宜在哪、贵在哪、漏在哪——选哪家不再靠猜',
      '合同里的关键条款逐个检查——你知道哪句话后面会变成增项通知',
      '每一笔钱该在什么时候付、付之前要确认什么——主动权回到你手里',
      '漏项和风险标出来，签字之前让对方补全——省下来的不是¥499，是几万',
    ],
  },
]

/* ── 不适合的人 ── */
const notForItems = [
  { label: '你已经准备签合同，时间很紧', detail: '快审需要2-3个工作日。如果你一周内必须签约，直接走 ¥2,500 全审——24小时出结果，还有强保证。' },
  { label: '你只有一份报价可以看', detail: '快审的核心价值之一是横向对比。只有一份报价的时候，免费初筛工具就够你先扫一眼了。' },
  { label: '装修预算在 ¥80,000 以下', detail: '¥499占你总预算比例偏高。先用免费初筛工具看风险等级，如果风险低可能不需要人工审查。' },
]

/* ── FAQ ── */
const faqs = [
  {
    q: '¥499 和 ¥2,500 到底差在哪？',
    a: '快审是"帮你看+帮你比"——拆开报价、检查合同、标出漏项、横向对比。全审是"帮你看+帮你追"——13个边界逐项排查、每个问题标注到页和行、24小时出结果、出问题帮你追回、追不回全额退款。简单说：快审是让你心里有底，全审是让你签字不慌。',
  },
  {
    q: '我能发三份不同的报价给你吗？',
    a: '可以。¥499包含最多3家公司的报价+合同对比。如果你只有一两份——也可以，费用不变。对比的价值在于同一套标准看不同公司，差异会非常明显。',
  },
  {
    q: '2-3个工作日，能不能更快？',
    a: '正常情况下2-3个工作日出结果。如果你很着急，跟我说一声，我会尽量快。但如果时间特别紧（一周内签约），建议直接走 ¥2,500 全审——24小时保障出结果。',
  },
  {
    q: '你不怕"找出少于3个问题就退款"这条被人利用吗？',
    a: '17年里，我没见过一份没有被专业眼光审过的报价单找不出3个问题的。如果真有一份——说明这家公司确实靠谱，你不需要花任何钱审查。¥499退给你，你省了一笔冤枉的装修费。对我来说，这是帮我筛选——我只服务有真实需求的人。',
  },
  {
    q: '审查完我还是不确定该选哪家怎么办？',
    a: '报告会用同一套标准标注每家的问题——你不需要"选哪家"，你只需要"排除问题最多的那家"。如果排除后还剩两家难选，你可以加购 ¥1,999 居住方案综合判断——把方案、预算和报价放在一起看。',
  },
  {
    q: '合同里的法律问题你看吗？',
    a: '我不是律师。我看的是合同里的"装修行业特有问题"——付款比例、工期计算方式、材料替代条款、验收标准、增项确认流程、质保范围。这些不是法律问题，是装修行业的经验问题。真正涉及法律效力的条款，建议请律师过目。',
  },
]

export default function QuoteStandardPage() {
  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: '报价/合同快审',
            description:
              '17年装修经验帮您逐项分析报价单、检查合同关键条款、给付款节点建议、标记漏项和增项风险。支持最多3家公司横向对比。找出少于3个问题退款。',
            provider: { '@type': 'Person', name: 'Zeno' },
            offers: { '@type': 'Offer', priceCurrency: 'CNY', price: '499' },
            url: 'https://zenoaihome.com/services/quote-standard',
          },
        ]}
      />

      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden border-b border-border bg-canvas">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(222,210,190,0.36),transparent_42%)]" aria-hidden />
        <Container size="content" className="relative py-14 sm:py-18">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone">
            Zeno Quick Review · 主推服务
          </p>
          <h1 className="editorial-display mt-5 max-w-4xl text-[2.2rem] leading-[1.12] text-ink sm:text-[3.2rem]">
            三份报价摆在面前，比总价是没用的。便宜的那家可能漏了项目，贵的那家可能实打实——你得有人帮你拆开看。
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
            不是每一份报价都需要全审。如果你还在比较阶段——手里有两三家公司的报价，想知道哪份更实在、哪份合同更靠谱——快审是性价比最高的选择。
          </p>

          {/* 价格 */}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-5xl font-bold text-ink">¥499</span>
            <span className="text-base text-ink-muted">/ 一次审查，支持最多3家公司对比</span>
          </div>

          {/* 保证 */}
          <div className="mt-3 border-l-2 border-stone pl-4">
            <p className="text-sm font-semibold text-stone">
              找不出3个以上值得追问的问题 → ¥499全额退款。
            </p>
            <p className="mt-1 text-xs text-ink-faint">
              不是"不满意就退"的模糊承诺。是客观标准：17年经验告诉我，没被审过的报价单不可能少于3个问题。
            </p>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CTA href="/contact" label="把报价和合同发给我 →" variant="primary" />
            <p className="text-sm text-ink-muted">
              微信 zanxiansheng2025 · 备注「快审」· 拍照发来
            </p>
          </div>
        </Container>
      </section>

      <Container size="content" className="py-section">

        {/* ── 你得到什么 ── */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-ink mb-3">¥499，你得到什么</h2>
          <p className="text-sm text-ink-muted mb-8 max-w-2xl">
            一份能让你在几家公司之间做决定的报告——不是"哪家好"，而是"每家的问题分别是什么，哪家的问题你最能接受"。
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {scopeItems.slice(0, 3).map((item) => (
              <div key={item.label} className="border border-border bg-surface p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone mb-3">
                  {item.label}
                </p>
                <p className="text-sm leading-relaxed text-ink">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {scopeItems.slice(3).map((item) => (
              <div key={item.label} className="border border-border bg-surface p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone mb-3">
                  {item.label}
                </p>
                <p className="text-sm leading-relaxed text-ink">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 和 ¥2,500 全审的区别 ── */}
        <section className="mb-16 border border-stone bg-surface-warm p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink mb-2">
            快审 vs 全审：选哪个？
          </h2>
          <p className="text-sm text-ink-muted mb-6 max-w-2xl">
            两个产品解决不同阶段的问题。不确定该选哪个？看这个对比。
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {vsFlagship.map((col) => (
              <div key={col.label} className={`p-6 ${col.label.includes('¥499') ? 'border-2 border-stone bg-surface' : 'border border-border bg-surface'}`}>
                <p className="text-lg font-bold text-ink mb-4">{col.label}</p>
                <ul className="space-y-2">
                  {col.items.map((item, i) => (
                    <li key={i} className={`flex gap-2 text-sm ${item.startsWith('₊') ? 'text-stone font-medium' : 'text-ink-muted'}`}>
                      <span className="shrink-0 text-stone">·</span>
                      <span>{item.startsWith('₊') ? item.slice(2) : item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-ink-muted max-w-2xl">
            <b className="text-ink">一句话：</b>还在比价、还没决定选哪家 → 快审。已经选定一家、准备签约 → 全审。两个都买的话，全审减 ¥200——已经做过快审的客户，全审 ¥2,300。
          </p>
        </section>

        {/* ── 赠品 ── */}
        <section className="mb-16 border-2 border-stone bg-surface-warm p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink mb-2">
            不只是审查——你还免费获得这些
          </h2>
          <p className="text-sm text-ink-muted mb-6 max-w-2xl">
            快审不堆叠大量赠品——我们不把¥499包装成¥4,000。但我们给你两件"拿到就能用"的东西。
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {bonusItems.map((bonus) => (
              <div key={bonus.name} className="border border-border bg-canvas p-5">
                <p className="text-lg font-bold text-stone">{bonus.value}</p>
                <h3 className="mt-1 text-sm font-semibold text-ink">{bonus.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{bonus.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-border pt-4 flex items-baseline gap-3">
            <span className="text-sm text-ink-muted line-through">赠品总价值 ¥178</span>
            <span className="text-2xl font-bold text-ink">¥0</span>
            <span className="text-sm text-ink-muted">购买快审即免费获得</span>
          </div>
        </section>

        {/* ── 风险逆转 ── */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-ink mb-6">
            找不出3个问题——全额退款。
          </h2>
          <div className="border-2 border-stone bg-surface p-6 sm:p-8">
            <p className="text-sm text-ink-muted mb-5">
              我们不保证"你会满意"——那是主观的，没法衡量。我们保证的是客观的：17年经验的人看完你的报价，如果找不出至少3个值得追问的地方，¥499退给你。
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
            这个保证敢给的底气是：17年里，没被审过的报价单少于3个问题的情况，我一次都没见过。如果真的遇到——这家的报价单可以直接签，你省了¥499审查费，我也帮你确认了一个靠谱施工方。双赢。
          </p>
        </section>

        {/* ── 算账 ── */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-ink mb-6">算一笔账</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {comparison.map((col) => (
              <div key={col.label} className="border border-border bg-surface p-6">
                <p className="text-sm font-semibold text-ink mb-4">{col.label}：</p>
                <ul className="space-y-2">
                  {col.items.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-ink-muted">
                      <span className="shrink-0 text-stone">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-5 border border-stone bg-surface-warm p-5">
            <p className="text-sm font-semibold text-ink mb-2">选错一家公司，代价可能是几万。花 ¥499 看清三家的差别——这是 0.5% 的决策保险。</p>
            <p className="text-sm leading-relaxed text-ink-muted">
              如果你装修总预算15万，选错施工方带来的损失（返工、增项、延期）轻松超过2-3万。¥499帮你避免这个决策错误——这笔账，怎么算都划算。
            </p>
          </div>
        </section>

        {/* ── 为什么是 ¥499 ── */}
        <section className="mb-16 border border-border bg-surface p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink mb-4">为什么是 ¥499</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                num: '¥499',
                label: '不是 ¥199',
                desc: '¥199只能快速扫一眼，指出3个最高风险点。¥499给你完整逐项分析+合同检查——你能拿着报告做决定，不是拿着提醒继续猜。',
              },
              {
                num: '不是 ¥2,500',
                label: '全审的一半功能',
                desc: '快审覆盖全审的核心分析能力——逐项拆报价、查合同、标漏项。但全审多了：13边界排查、24小时出结果、强保证。你付更少，拿到80%的核心价值。',
              },
              {
                num: '2-3家',
                label: '一份钱，比三家',
                desc: '¥499不是一个报价的审查费，是"帮你在几家公司之间做选择"的决策支持。你用一份钱，省了选错公司的几万。',
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

        {/* ── 不适合谁 ── */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-ink mb-4">谁不适合这个服务</h2>
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
            把报价和合同发给我，2-3天还你一份能用来做决定的报告
          </h2>
          <p className="text-2xl font-bold text-stone tracking-wide mb-2">zanxiansheng2025</p>
          <p className="text-sm text-ink-muted mb-5 max-w-md mx-auto">
            加微信，备注「快审」。把你手头两三家公司的报价单和合同拍照发来。2-3个工作日内，你拿到一份逐项分析+合同检查+横向对比的报告。
          </p>
          <p className="text-xs text-ink-faint">
            找不出3个以上值得追问的问题，¥499全额退款。这是客观标准，不是营销话术。
          </p>
        </section>

        {/* ── 还不确定？── */}
        <section className="mt-12 border-t border-border pt-10">
          <h2 className="text-lg font-semibold text-ink mb-3">还不确定？</h2>
          <p className="text-sm text-ink leading-relaxed mb-2">
            先用免费工具扫一眼，或者了解一下全审服务。
          </p>
          <p className="text-sm text-ink-muted mb-5 max-w-xl">
            免费初筛2分钟出风险热力图——如果扫完你觉得安心了，¥499省下来了。如果扫完你更不放心了——那种"不确定该信哪家"的感觉就是¥499帮你消除的东西。
          </p>
          <div className="flex flex-wrap gap-4">
            <CTA href="/tools/quote-check" label="先做免费初筛 →" variant="primary" />
            <CTA href="/services/quote-review" label="看 ¥2,500 全审 →" variant="secondary" />
          </div>
        </section>

      </Container>
    </>
  )
}
