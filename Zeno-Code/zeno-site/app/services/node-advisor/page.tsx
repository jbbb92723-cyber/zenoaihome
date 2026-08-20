import type { Metadata } from 'next'
import Container from '@/components/ui/Container'
import CTA from '@/components/ui/CTA'
import StructuredData from '@/components/ui/StructuredData'
import { SERVICE_PRICING } from '@/data/services/pricing'

const service = SERVICE_PRICING.renovationSpecialist

export const metadata: Metadata = {
  title: `装修施工节点专项判断｜${service.displayPrice} / 节点`,
  description:
    'ZENO 装修专项判断的施工场景：围绕一个约定的关键节点提交照片和材料，获得拍摄清单、疑点整理与现场追问建议。',
  alternates: {
    canonical: 'https://zenoaihome.com/services/node-advisor',
  },
}

const nodes = [
  { name: '水电验收', risk: '核对走向、固定、强弱电间距、点位数量和位置；尺寸与性能仍需现场测量。' },
  { name: '防水验收', risk: '核对施工范围、阴角处理、材料记录和闭水安排；厚度与渗漏判断需要现场条件或仪器。' },
  { name: '木工验收', risk: '核对龙骨、接缝和柜体安装的可见状态，并记录需要现场复尺或加固确认的位置。' },
  { name: '贴砖验收', risk: '核对平整度、缝隙、坡向和可见缺陷；空鼓等项目需要现场敲检或仪器确认。' },
  { name: '油漆验收', risk: '核对基层记录、施工遍数、平整度和阴阳角，并区分照片可见项与现场光线下才能确认的部分。' },
  { name: '安装验收', risk: '按橱柜、门、卫浴和开关面板逐项核对安装状态、使用功能和待整改记录。' },
  { name: '竣工验收', risk: '整理整体观感、使用功能、遗留问题和尾款前待确认项；最终验收由合同责任方现场完成。' },
]

const guaranteeItems = [
  '开始前确认本次节点、材料范围、交付物和时间',
  '只处理一个约定决策节点，不用为整套项目预付费用',
  '需要继续多个节点时，再评估 ¥12,800 起的全程顾问',
]

const notForItems = [
  { label: '你已经请了第三方监理且信任他', detail: '监理能去现场，能做更多。如果你已经有了，不需要我。' },
  { label: '你对施工质量"差不多就行"', detail: '这个服务的颗粒度会浪费你的时间和钱。' },
  { label: '施工方是你很熟悉的熟人且合作过', detail: '信任比顾问更值钱。如果你信他，不用我再插手。' },
]

const faqs = [
  {
    q: '你不去现场，怎么判断？',
    a: '照片可以帮助识别走向、间距、收口和表面状态中的部分疑点，但无法排除照片之外、隐蔽位置或需要仪器检测的问题。我会说明照片能判断什么、还缺什么，以及哪些情况必须找现场监理或专业人员。',
  },
  {
    q: '节点是怎么定义的？什么时候该找你？',
    a: '开始前会按施工计划列出约定节点和材料要求。施工方通知可以验收时，你需要主动确认时间并按清单拍摄；我再基于收到的材料整理可见疑点和现场追问。',
  },
  {
    q: '施工方愿意配合拍照吗？',
    a: '这取决于你的合同约定和现场沟通。开始前建议先确认关键节点的拍照、验收和整改记录方式；不建议隐瞒顾问身份或用模糊关系施压。',
  },
  {
    q: '和报价、合同审查有什么区别？',
    a: '它们都是 ¥2,500 装修专项判断。报价与合同发生在签约前，重点是范围、计量和责任；施工节点发生在开工后，重点是拍摄清单、可见疑点和现场追问。',
  },
  {
    q: '如果照片看不出问题，实际有问题呢？',
    a: '我会明确告诉你哪些位置当前看不到，并补充拍摄或现场核对要求。远程顾问只能基于收到的材料提出疑点，最终检查仍需要你、施工方和必要的现场专业人员完成。',
  },
  {
    q: '后面还有其他节点，可以继续加吗？',
    a: '可以。每个新增节点按 ¥2,500 重新确认范围；如果需要持续参与多个节点，更适合评估全程装修决策顾问。',
  },
]

export default function NodeAdvisorPage() {
  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'ZENO 装修专项判断（施工节点）',
            description:
              '在约定的施工关键节点提交照片和材料，获得拍摄清单、可见疑点整理与现场追问建议。远程判断不替代现场监理或工程验收。',
            provider: { '@type': 'Person', name: 'Zeno' },
            offers: { '@type': 'Offer', priceCurrency: 'CNY', price: String(service.amount) },
            url: 'https://zenoaihome.com/services/node-advisor',
          },
        ]}
      />

      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden border-b border-border bg-canvas">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(222,210,190,0.36),transparent_40%)]" aria-hidden />
        <Container size="content" className="relative py-14 sm:py-18">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone">
            ZENO 装修专项判断 · 施工节点
          </p>
          <h1 className="editorial-display mt-5 max-w-4xl text-[2.2rem] leading-[1.12] text-ink sm:text-[3.2rem]">
            签了合同只是开始。关键节点到来前，先知道该拍什么、问什么。
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
            在水电、防水、贴砖和竣工等约定节点，你提交照片与现场信息。我会整理可见疑点、缺失材料和下一步追问，同时明确远程照片不能判断的部分。
          </p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-5xl font-bold text-ink">{service.displayPrice}</span>
            <span className="text-base text-ink-muted">/ 一个约定节点</span>
          </div>

          <div className="mt-3 border-l-2 border-stone pl-4">
            <p className="text-sm font-semibold text-stone">
              只为当前节点付费；需要持续参与多个节点时，再评估全程顾问。
            </p>
            <p className="mt-1 text-xs text-ink-faint">
              节点、材料范围、交付物和时间，会在开始前的服务确认单中写清楚。
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CTA href="/contact" label="加微信聊聊你的项目 →" variant="primary" />
            <p className="text-sm text-ink-muted">
              微信 zanxiansheng2025 · 备注「装修专项判断」· 告诉我你的面积和施工阶段
            </p>
          </div>
        </Container>
      </section>

      <Container size="content" className="py-section">

        {/* ── 怎么用 ── */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-ink mb-3">怎么用：每个节点，三次交互</h2>
          <p className="text-sm text-ink-muted mb-8 max-w-2xl">
            你需要在关键节点到场，或取得施工方同意后获得清晰材料。我负责说明拍摄要求、整理疑点和生成追问清单。
          </p>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                step: '01',
                title: '施工方说"可以验收了"',
                desc: '施工方通知节点时间后，你按开始前确认的节点表与我联系。我会提供当前节点的拍摄角度和现场追问清单。',
              },
              {
                step: '02',
                title: '拍照发给我',
                desc: '拍完发过来。我会区分可见疑点、材料不足和需要现场专业人员确认的部分。',
              },
              {
                step: '03',
                title: '拿到清单，去跟施工方确认',
                desc: '你会拿到一份针对当前节点的追问清单，用具体位置、照片和合同约定与施工方核对。',
              },
            ].map((item) => (
              <div key={item.step} className="border border-border bg-surface p-6">
                <p className="text-2xl font-bold text-stone/30 mb-3">{item.step}</p>
                <h3 className="text-sm font-semibold text-ink mb-2">{item.title}</h3>
                <p className="text-xs leading-relaxed text-ink-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 常见节点 ── */}
        <section className="mb-16 border border-stone bg-surface-warm p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink mb-2">7 个常见关键节点</h2>
          <p className="text-sm text-ink-muted mb-6">
            每次专项判断只处理一个双方确认的节点。以下是常见场景，不代表一次服务同时包含全部节点。
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {nodes.map((node) => (
              <div key={node.name} className="border border-border bg-canvas p-4">
                <h3 className="text-sm font-semibold text-ink">{node.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">{node.risk}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 单节点边界 ── */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-ink mb-6">
            一个节点，一次确认，一份交付。
          </h2>
          <div className="border-2 border-stone bg-surface p-6 sm:p-8">
            <p className="text-sm text-ink-muted mb-5">
              节点服务不预售多次权益。先把当前节点的材料、判断范围和交付结果写清楚，需要继续时再做下一次选择。
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
            多个节点连续发生、需要持续理解项目上下文时，单次购买通常不如全程顾问合适。
          </p>
        </section>

        {/* ── 不适合谁 ── */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-ink mb-4">谁不需要这个服务</h2>
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
            先确认你的下一个节点是否适合远程判断
          </h2>
          <p className="text-2xl font-bold text-stone tracking-wide mb-2">zanxiansheng2025</p>
          <p className="text-sm text-ink-muted mb-5 max-w-md mx-auto">
            加微信，备注「专项判断」。说明面积、城市、施工阶段和下一个节点；我会先确认材料条件、服务范围和交付时间。
          </p>
          <p className="text-xs text-ink-faint">
            远程材料判断不替代现场监理、检测、工程验收或施工方责任。
          </p>
        </section>

        {/* ── 还没签合同？先审报价 ── */}
        <section className="mt-12 border-t border-border pt-10">
          <h2 className="text-lg font-semibold text-ink mb-3">还没签合同？</h2>
          <p className="text-sm text-ink leading-relaxed mb-2">
            如果你还在签约前阶段，同一项装修专项判断会改为核对报价、合同、付款和责任边界。
          </p>
          <p className="text-sm text-ink-muted mb-5 max-w-xl">
            价格仍为 {service.displayPrice} / 次，会按 13 个边界整理需要追问和修改的内容；它不保证零增项，也不替代法律审查。
          </p>
          <div className="flex flex-wrap gap-4">
            <CTA href="/services/quote-review" label="看报价与合同场景 →" variant="primary" />
            <CTA href="/tools/quote-check" label="先做免费初筛 →" variant="secondary" />
          </div>
        </section>

        <section className="mt-12 border-t border-border pt-10">
          <h2 className="text-lg font-semibold text-ink mb-3">需要持续参与多个节点？</h2>
          <p className="text-sm text-ink-muted mb-5 max-w-xl">
            ZENO 装修决策顾问从 {SERVICE_PRICING.renovationAdvisor.displayPrice}，基准范围最多 6 个约定节点、最长 120 天。最终费用根据项目类型、复杂度、周期和现场需求书面确认。
          </p>
          <CTA href="/services/renovation-advisor" label="看全程装修决策顾问 →" variant="secondary" />
        </section>

      </Container>
    </>
  )
}
