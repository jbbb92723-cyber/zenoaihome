import type { Metadata } from 'next'
import Container from '@/components/ui/Container'
import CTA from '@/components/ui/CTA'
import StructuredData from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: 'Zeno 严选床垫｜¥299起，内部结构保50年',
  description:
    '装完入住最后一件大事——选一张能睡十几年的床垫。17年行业经验自己选品自己卖，不是代购。内部结构保50年。',
  alternates: {
    canonical: 'https://zenoaihome.com/mattress',
  },
}

/* ── 为什么床垫值得单独选 ── */
const whyMattress = [
  {
    label: '你每天在上面躺6-8小时',
    desc: '床垫是你家里使用时间最长的家具。一张好床垫，十几年不塌不响。一张差床垫，三年就让你腰疼。',
  },
  {
    label: '市面90%的床垫在你看不见的地方省钱',
    desc: '面料你摸得到，弹簧你看不到。独立袋装弹簧的线径、围边钢的厚度、海绵的密度——这些才是决定一张床垫能睡几年的东西。',
  },
  {
    label: '品牌溢价吃掉了一半以上的成本',
    desc: '你在商场花¥3,000买的床垫，出厂成本可能不到¥800。剩下的都是渠道费、广告费和品牌溢价。',
  },
]

/* ── 严选标准 ── */
const standards = [
  {
    label: '独立袋装弹簧',
    detail: '每个弹簧独立封装，翻身边上的人感觉不到。线径≥2.0mm，回弹次数≥8万次——这是保50年的起点。',
  },
  {
    label: '高密度海绵围边',
    detail: '床边坐下去不塌。不是普通海绵，是密度≥28kg/m³的高回弹海绵。这个数字决定了五年后床边还有没有支撑。',
  },
  {
    label: '可拆洗面料',
    detail: '拉链一拉就能拆下来洗。不是那种缝死的——脏了你只能套个床笠盖住。',
  },
  {
    label: '透气底布',
    detail: '床垫底部不是密封的。梅雨季不回潮、不发霉——这在南方不是加分项，是及格线。',
  },
]

/* ── 对比 ── */
const comparison = [
  {
    label: '商场品牌床垫',
    items: [
      '¥2,000–8,000，其中50%+是渠道和广告费',
      '弹簧线径1.8mm，5年左右开始有异响',
      '面料缝死，脏了只能套床笠',
      '质保10年，但"正常使用痕迹"不保',
    ],
  },
  {
    label: 'Zeno 严选床垫',
    items: [
      '¥299起，出厂直供——没有中间商',
      '弹簧线径≥2.0mm，内部结构保50年',
      '可拆洗面料，拉链一拉就下来',
      '保50年是保结构——塌了、响了、变形了，换',
    ],
  },
]

/* ── 选购流程 ── */
const process = [
  { step: '1', label: '告诉我的你需求', desc: '谁睡、房间多大、预算多少、有没有腰的问题。不用专业知识，说你的真实情况就行。' },
  { step: '2', label: '我帮你匹配', desc: '根据你说的情况，告诉你该选偏硬还是偏软、什么厚度合适。不推最贵的，推最适合你的。' },
  { step: '3', label: '送到家，试睡', desc: '送到你家里，躺上去试。不是展厅里躺30秒那种——是在你自己家，真实感受。' },
]

/* ── FAQ ── */
const faqs = [
  {
    q: '¥299 是什么配置？',
    a: '¥299是单面针织布基础款，独立袋装弹簧+高密度海绵围边，适合出租房或预算有限的家庭。¥499起是双面可拆洗面料款。具体看你需要——不是说"¥299就够了"，是说"从¥299开始，往上都是实打实的材料和工艺升级"。',
  },
  {
    q: '保50年是真的吗？',
    a: '保的是内部结构——弹簧塌了、变形了、围边海绵失去支撑了。正常使用下出现这些问题，换。50年不是营销噱头，是因为我知道这些材料能用多久。我17年见过的床垫，好材料和差材料的差距就是这么大。',
  },
  {
    q: '怎么买？能线上吗？',
    a: '加微信告诉我你的需求，我帮你匹配型号。目前主要服务南宁和广西地区，可以送到家。外地的话运费另算——但你算一下，一张床垫¥299+运费，还是比你在当地商场买划算。',
  },
  {
    q: '你不做床垫品牌，为什么敢保50年？',
    a: '我不是在做"床垫品牌"。我是在用17年行业经验帮你选品——我自己去过工厂、看过材料、睡过样品。敢保50年不是因为我赌你不会坏，是因为我知道它不会坏。如果坏了，我换——就这么简单。',
  },
  {
    q: '可以先看再买吗？',
    a: '可以。南宁的朋友可以预约来看实物——不是展厅，就是放在那里的床垫。你躺上去试试，聊几句你的需求，合适就拿走，不合适也没关系。看实物不需要买。',
  },
]

export default function MattressPage() {
  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'Zeno 严选床垫',
            description:
              '17年装修行业经验严选。独立袋装弹簧、高密度海绵围边、可拆洗面料。内部结构保50年。¥299起，出厂直供，没有中间商。',
            offers: {
              '@type': 'Offer',
              priceCurrency: 'CNY',
              price: '299',
            },
            url: 'https://zenoaihome.com/mattress',
          },
        ]}
      />

      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden border-b border-border bg-canvas">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(222,210,190,0.42),transparent_38%)]" aria-hidden />
        <Container size="content" className="relative py-14 sm:py-18">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone">
            Zeno 自有产品 · 严选床垫
          </p>
          <h1 className="editorial-display mt-5 max-w-4xl text-[2.2rem] leading-[1.12] text-ink sm:text-[3.2rem]">
            装完入住，最后一件大事——
            <br />
            选一张能睡十几年的床垫。
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
            不是代购。是我自己选品自己卖——17年行业经验，帮你在市面上90%的坑里筛出那10%真正值得买的东西。内部结构保50年。塌了、响了、变形了，换。
          </p>

          {/* 价格 */}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-5xl font-bold text-ink">¥299 起</span>
            <span className="text-base text-ink-muted">出厂直供，没有中间商赚差价</span>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CTA href="/contact" label="告诉我你的需求 →" variant="primary" />
            <p className="text-sm text-ink-muted">
              微信 zanxiansheng2025 · 备注「床垫」· 帮你匹配最合适的
            </p>
          </div>
        </Container>
      </section>

      <Container size="content" className="py-section">

        {/* ── 为什么床垫值得认真选 ── */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-ink mb-6">
            你花¥3,000买的床垫，出厂成本可能不到¥800
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {whyMattress.map((item) => (
              <div key={item.label} className="border border-border bg-surface p-6">
                <p className="text-sm font-semibold text-ink mb-2">{item.label}</p>
                <p className="text-sm leading-relaxed text-ink-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 严选标准 ── */}
        <section className="mb-16 border border-stone bg-surface-warm p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink mb-2">
            我只选这四种配置
          </h2>
          <p className="text-sm text-ink-muted mb-6 max-w-2xl">
            不是越多越好。四种配置覆盖90%的需求——每一项都是17年经验里验证过"必须要有"的东西。
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {standards.map((s) => (
              <div key={s.label} className="border border-border bg-canvas p-5">
                <h3 className="text-sm font-semibold text-ink">{s.label}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{s.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 和商场床垫对比 ── */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-ink mb-6">和你在商场买的有什么不同</h2>
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
        </section>

        {/* ── 选购流程 ── */}
        <section className="mb-16 border-2 border-stone bg-surface-warm p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink mb-6 text-center">
            不用懂床垫。告诉我你的情况，我来匹配。
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {process.map((p) => (
              <div key={p.step} className="text-center">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-stone text-sm font-bold text-white mb-3">
                  {p.step}
                </div>
                <h3 className="text-sm font-semibold text-ink mb-2">{p.label}</h3>
                <p className="text-xs leading-relaxed text-ink-muted">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-ink mb-6">关于床垫，你可能想问的</h2>
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
            告诉我你的需求，我帮你匹配最合适的床垫
          </h2>
          <p className="text-2xl font-bold text-stone tracking-wide mb-2">zanxiansheng2025</p>
          <p className="text-sm text-ink-muted mb-5 max-w-lg mx-auto">
            加微信，备注「床垫」。跟我说：几个人睡、房间多大、有没有腰的问题、预算大概多少。
            不用专业知识——说你的真实情况就行。我帮你匹配，不推贵的，推对的。
          </p>
          <p className="text-xs text-ink-faint">
            内部结构保50年。塌了、响了、变形了——换。不是营销承诺，是我知道这些材料能用多久。
          </p>
        </section>

        {/* ── 还不确定？先做居住诊断 ── */}
        <section className="mt-12 border-t border-border pt-10">
          <h2 className="text-lg font-semibold text-ink mb-3">还不知道要不要换床垫？</h2>
          <p className="text-sm text-ink leading-relaxed mb-2">
            先做一份免费的「AI 居住诊断」。
          </p>
          <p className="text-sm text-ink-muted mb-5 max-w-xl">
            把你的生活方式、家庭场景、偏好和预算捋一遍，看看床垫是不是你现在优先级最高的事。
            如果诊断结果显示你更需要的是别的东西——那我不会让你买床垫。
          </p>
          <div className="flex flex-wrap gap-4">
            <CTA href="/living-diagnosis" label="先做居住诊断 →" variant="primary" />
            <CTA href="/renovation" label="看完整装修判断服务 →" variant="secondary" />
          </div>
        </section>

      </Container>
    </>
  )
}
