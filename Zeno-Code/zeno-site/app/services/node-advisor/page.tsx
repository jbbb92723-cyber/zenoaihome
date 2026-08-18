import type { Metadata } from 'next'
import Container from '@/components/ui/Container'
import CTA from '@/components/ui/CTA'
import StructuredData from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: '装修施工节点顾问｜¥2,000 起，按节点整理现场疑点',
  description:
    '进入施工后，在约定的关键节点提交照片和材料，获得拍摄清单、疑点整理与现场追问建议。远程判断不替代现场监理或工程验收。',
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

const tiers = [
  {
    name: '核心节点版',
    price: '¥2,000',
    nodes: '3 个节点',
    includes: ['水电验收', '防水验收', '竣工验收'],
    bestFor: '第一次装修，最担心隐蔽工程和最终交付的人',
  },
  {
    name: '标准节点版',
    price: '¥4,500',
    nodes: '7 个节点',
    includes: ['水电', '防水', '木工', '贴砖', '油漆', '安装', '竣工'],
    bestFor: '想每个关键节点都有人帮你看一眼的人',
    badge: '推荐',
  },
  {
    name: '扩展节点版',
    price: '¥8,000',
    nodes: '10+ 节点',
    includes: ['标准7节点 + 拆除、砌墙、定制安装等额外节点'],
    bestFor: '大户型或复杂改造，需要在标准范围外增加约定节点',
  },
]

const guaranteeItems = [
  '第一个节点完成后，可以决定是否继续后续节点',
  '不继续时，未完成节点按服务确认单约定退款',
  '已经完成的节点、材料范围和退款算法会在开始前写清楚',
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
    q: '和 ¥2,500 报价审核有什么区别？',
    a: '报价审核发生在签约前，重点是报价与合同里的范围、计量和责任；节点顾问发生在施工中，重点是拍摄清单、可见疑点和现场追问。两项服务都不能保证项目没有问题。',
  },
  {
    q: '如果照片看不出问题，实际有问题呢？',
    a: '我会明确告诉你哪些位置当前看不到，并补充拍摄或现场核对要求。远程顾问只能基于收到的材料提出疑点，最终检查仍需要你、施工方和必要的现场专业人员完成。',
  },
  {
    q: '节点之间可以加吗？比如先买3节点，中间觉得不够再加？',
    a: '可以。你随时可以补差价升级到更多节点。不用担心一开始选错了——先试3个核心节点，够用就够用，不够再加。',
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
            name: '施工节点顾问',
            description:
              '在约定的施工关键节点提交照片和材料，获得拍摄清单、可见疑点整理与现场追问建议。远程判断不替代现场监理或工程验收。',
            provider: { '@type': 'Person', name: 'Zeno' },
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'CNY',
              lowPrice: '2000',
              highPrice: '8000',
              offerCount: '3',
            },
            url: 'https://zenoaihome.com/services/node-advisor',
          },
        ]}
      />

      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden border-b border-border bg-canvas">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(222,210,190,0.36),transparent_40%)]" aria-hidden />
        <Container size="content" className="relative py-14 sm:py-18">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone">
            装修施工节点顾问
          </p>
          <h1 className="editorial-display mt-5 max-w-4xl text-[2.2rem] leading-[1.12] text-ink sm:text-[3.2rem]">
            签了合同只是开始。关键节点到来前，先知道该拍什么、问什么。
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
            在水电、防水、贴砖和竣工等约定节点，你提交照片与现场信息。我会整理可见疑点、缺失材料和下一步追问，同时明确远程照片不能判断的部分。
          </p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-5xl font-bold text-ink">¥2,000</span>
            <span className="text-base text-ink-muted">起 · 按节点收费</span>
          </div>

          <div className="mt-3 border-l-2 border-stone pl-4">
            <p className="text-sm font-semibold text-stone">
              第一个节点完成后再决定是否继续；未完成节点按服务确认单约定退款。
            </p>
            <p className="mt-1 text-xs text-ink-faint">
              退款范围和已经完成的节点如何计算，会在开始前的服务确认单中写清楚。
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CTA href="/contact" label="加微信聊聊你的项目 →" variant="primary" />
            <p className="text-sm text-ink-muted">
              微信 zanxiansheng2025 · 备注「节点顾问」· 告诉我你的面积和施工阶段
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

        {/* ── 7个节点 ── */}
        <section className="mb-16 border border-stone bg-surface-warm p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink mb-2">7 个常见关键节点</h2>
          <p className="text-sm text-ink-muted mb-6">
            标准版本覆盖从水电到竣工的 7 个常见关键节点。具体项目是否需要增减节点，会在开始前按施工范围确认。
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

        {/* ── 三个档位 ── */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-ink mb-3">三个档位，按你需要的深度选</h2>
          <p className="text-sm text-ink-muted mb-6 max-w-2xl">
            不确定需要几个节点？从核心版开始——3个节点做完，觉得有用再升级。
          </p>

          <div className="grid gap-5 sm:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`border p-6 ${tier.badge ? 'border-stone bg-surface-warm relative' : 'border-border bg-surface'}`}
              >
                {tier.badge && (
                  <span className="absolute -top-2.5 right-4 bg-stone text-canvas text-xs font-semibold px-3 py-0.5">
                    {tier.badge}
                  </span>
                )}
                <p className="text-xs font-semibold uppercase tracking-widest text-stone mb-2">{tier.name}</p>
                <p className="text-3xl font-bold text-ink">{tier.price}</p>
                <p className="text-sm text-ink-muted mt-1 mb-4">{tier.nodes}</p>
                <ul className="space-y-1.5 mb-4">
                  {tier.includes.map((item) => (
                    <li key={item} className="text-xs text-ink-muted flex gap-2">
                      <span className="text-stone shrink-0">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-ink-faint leading-relaxed border-t border-border pt-3">
                  {tier.bestFor}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-ink-faint max-w-2xl">
            中途可以升级。先买3个核心节点，觉得有用再补差价加节点。不用一开始就决定。
          </p>
        </section>

        {/* ── 风险逆转 ── */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-ink mb-6">
            先完成一个节点，再决定是否继续。
          </h2>
          <div className="border-2 border-stone bg-surface p-6 sm:p-8">
            <p className="text-sm text-ink-muted mb-5">
              你不需要一开始就信任我。试一个节点——你亲身体验了"有人帮你看一眼"的差别，再决定要不要继续。
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
            是否继续，应以第一次真实节点的交付是否解决了你的问题为准。
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
            加微信，备注「节点顾问」。说明面积、城市、施工阶段和下一个节点；我会先确认材料条件、服务范围和对应档位。
          </p>
          <p className="text-xs text-ink-faint">
            第一个付费节点完成后如不继续，未完成节点如何退款，以开始前双方确认的服务说明为准。
          </p>
        </section>

        {/* ── 还没签合同？先审报价 ── */}
        <section className="mt-12 border-t border-border pt-10">
          <h2 className="text-lg font-semibold text-ink mb-3">还没签合同？</h2>
          <p className="text-sm text-ink leading-relaxed mb-2">
            如果你还在签约前阶段，先做报价审核——确保合同没有隐藏加价项，再进入施工。
          </p>
          <p className="text-sm text-ink-muted mb-5 max-w-xl">
            ¥2,500 报价 / 合同人工审查，会按 13 个边界逐项整理需要追问和修改的内容；它不保证零增项，也不替代法律审查。
          </p>
          <div className="flex flex-wrap gap-4">
            <CTA href="/services/quote-review" label="¥2,500 报价审核 →" variant="primary" />
            <CTA href="/tools/quote-check" label="先做免费初筛 →" variant="secondary" />
          </div>
        </section>

      </Container>
    </>
  )
}
