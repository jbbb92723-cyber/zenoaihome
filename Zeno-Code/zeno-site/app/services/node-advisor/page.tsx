import type { Metadata } from 'next'
import Container from '@/components/ui/Container'
import CTA from '@/components/ui/CTA'
import StructuredData from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: '施工全程节点顾问｜¥2,000起，每个关键节点帮你看一眼',
  description:
    '签完合同进入施工？每个关键节点拍照发给我，告诉你该查什么、照片里漏了什么、下一步注意什么。17年经验，第一个节点不满意退款。',
  alternates: {
    canonical: 'https://zenoaihome.com/services/node-advisor',
  },
}

const nodes = [
  { name: '水电验收', risk: '走线对不对、管卡间距够不够、强弱电距离、点位数量和位置——签了之后改一个点位就是一笔钱' },
  { name: '防水验收', risk: '刷了几遍、厚度够不够、阴角处理、闭水试验——住进去漏水，修一次就是大几千' },
  { name: '木工验收', risk: '吊顶龙骨间距、石膏板接缝处理、柜体安装牢固度——歪了裂了，后面全受影响' },
  { name: '贴砖验收', risk: '空鼓率、平整度、缝隙均匀度、坡度——空鼓的砖早晚要掉' },
  { name: '油漆验收', risk: '基层处理、遍数、平整度、阴阳角——刷完看不出来，住半年全出来' },
  { name: '安装验收', risk: '橱柜、门、卫浴、开关面板——安装阶段最容易被糊弄，因为业主累了' },
  { name: '竣工验收', risk: '整体观感、使用功能、遗留问题清单、尾款支付判断——最后一关，也是最容易被"差不多就行"糊过去的一关' },
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
    name: '全流程版',
    price: '¥8,000',
    nodes: '10+ 节点',
    includes: ['标准7节点 + 拆除、砌墙、定制安装等额外节点'],
    bestFor: '大户型或复杂改造，节点多、不想漏掉任何一步',
  },
]

const guaranteeItems = [
  '第一个节点做完后，你觉得没用——后续所有节点全额退款',
  '不是"不满意退差价"，是"全额退还没做的节点"',
  '试一个节点，再决定要不要继续。零压力',
]

const comparison = [
  {
    label: '不找人盯',
    items: [
      '自己去工地不知道该看什么，拍照也不知道拍哪里',
      '施工方说"按标准做的"——但你不知道标准是什么',
      '水电封了、防水刷了，只能相信对方说的',
      '竣工验收走马观花，住进去才发现问题——已经晚了',
    ],
  },
  {
    label: '花 ¥2,000 起，每个节点有人帮你看',
    items: [
      '每个节点去工地之前：知道该拍什么角度、问什么问题',
      '拍照发来之后：17年经验判断你照片里有没有疑点',
      '施工方知道你"有内行在看"——做事更认真',
      '竣工验收有清单对照，不是"看着差不多就行"',
    ],
  },
]

const notForItems = [
  { label: '你已经请了第三方监理且信任他', detail: '监理能去现场，能做更多。如果你已经有了，不需要我。' },
  { label: '你对施工质量"差不多就行"', detail: '这个服务的颗粒度会浪费你的时间和钱。' },
  { label: '施工方是你很熟悉的熟人且合作过', detail: '信任比顾问更值钱。如果你信他，不用我再插手。' },
]

const faqs = [
  {
    q: '你不去现场，怎么判断？',
    a: '17年工地经验告诉我，大部分施工问题不需要到现场才能判断。水电走线对不对——看照片里的走向、管卡间距、强弱电距离就知道。防水刷了几遍——看厚度、颜色、阴角处理就知道。关键是知道看什么，不是站在哪里。',
  },
  {
    q: '节点是怎么定义的？什么时候该找你？',
    a: '每个节点施工方说"可以验收了"的时候——你拍照发我，我告诉你该查什么。不是每天找你，是每个关键节点找一次。你不需要记住所有节点——加微信后我会提醒你。',
  },
  {
    q: '施工方愿意配合拍照吗？',
    a: '大部分愿意。你只需要说"我有个朋友做装修的，帮我看看"——这句话就够了。你的身份从"不懂的业主"变成"有内行在看的业主"，施工方会更认真。',
  },
  {
    q: '和 ¥2,500 报价审核有什么区别？',
    a: '审核是签合同前一次性帮你审报价单。节点顾问是签了合同之后施工中的持续陪伴。通常先做审核（确保合同没坑），再做节点顾问（确保施工不走偏）。两个产品互补。',
  },
  {
    q: '如果照片看不出问题，实际有问题呢？',
    a: '我会告诉你"这个角度看不到XX，去工地的时候重点看XX，拍下来发我"。我帮你缩小风险区域，但最终检查需要你在现场——这是远程顾问的边界。我有信心：我让你看的地方，就是最容易出问题的地方。',
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
            name: '施工全程节点顾问',
            description:
              '每个施工关键节点拍照发给赞诺，17年经验告诉您该查什么、照片里漏了什么、下一步注意什么。第一个节点不满意退款。',
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
            Zeno Milestone Advisor · 进阶服务
          </p>
          <h1 className="editorial-display mt-5 max-w-4xl text-[2.2rem] leading-[1.12] text-ink sm:text-[3.2rem]">
            签了合同只是开始。三个月施工，每一个节点都可能走偏——有人帮你看一眼，就不一样。
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
            你不用每天盯着工地。但水电、防水、贴砖、竣工——这几个节点，差一步就是差一整个工期。每个节点你拍照发给我，17年经验告诉你：该查什么，照片里可能漏了什么，下一步该注意什么。
          </p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-5xl font-bold text-ink">¥2,000</span>
            <span className="text-base text-ink-muted">起 · 按节点收费</span>
          </div>

          <div className="mt-3 border-l-2 border-stone pl-4">
            <p className="text-sm font-semibold text-stone">
              第一个节点不满意，后续节点全额退款。
            </p>
            <p className="mt-1 text-xs text-ink-faint">
              试一个节点——你觉得有用，继续。觉得没用，止损。零压力。
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
            不需要学任何装修知识。你只需要在关键节点去工地（或让施工方拍照），剩下的我来。
          </p>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                step: '01',
                title: '施工方说"可以验收了"',
                desc: '你去工地之前，我会告诉你这个节点该拍什么角度、问什么问题。你不需要记住——加了微信，我到节点会提醒你。',
              },
              {
                step: '02',
                title: '拍照发给我',
                desc: '拍完发过来。我根据你的照片和17年经验，逐项判断：哪里没问题，哪里有疑点，哪里需要你再去确认一下。',
              },
              {
                step: '03',
                title: '拿到清单，去跟施工方确认',
                desc: '你拿到一份针对你工地的检查清单。拿着清单去跟施工方对——你的底气不是"我觉得有问题"，而是"这个角度这个位置，17年经验的人说有疑点"。',
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
          <h2 className="text-xl font-semibold text-ink mb-2">7个关键节点，一个不落</h2>
          <p className="text-sm text-ink-muted mb-6">
            标准版本覆盖从水电到竣工的全部关键节点。每个节点都是17年工地上真实出过事的地方。
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
                  <span className="absolute -top-2.5 right-4 bg-stone text-paper text-xs font-semibold px-3 py-0.5">
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
            试一个节点。不满意，后续全退。
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
            17年经验。如果第一个节点就觉得没用，说明你的施工方确实靠谱——那恭喜你，你不需要我。如果第一个节点就觉得有用，后面你会主动来找我。
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
            <p className="text-sm font-semibold text-ink mb-2">
              水电重做一次 ¥3,000-8,000。防水重做一次 ¥5,000-15,000。贴砖返工 ¥2,000-5,000。
            </p>
            <p className="text-sm leading-relaxed text-ink-muted">
              花 ¥2,000，每个节点有人帮你看一眼——这三个数字，帮你躲过任何一个，都划算。
            </p>
          </div>
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
            你的第一个节点，我帮你免费判断一次
          </h2>
          <p className="text-2xl font-bold text-stone tracking-wide mb-2">zanxiansheng2025</p>
          <p className="text-sm text-ink-muted mb-5 max-w-md mx-auto">
            加微信，备注「节点顾问」。告诉我你的面积、城市、施工阶段。你在下一个节点去工地之前，我会告诉你该拍什么——你先体验一次，觉得有用再付费。
          </p>
          <p className="text-xs text-ink-faint">
            第一个付费节点不满意，后续全额退款。这不是促销——这是让你零风险体验"有人帮你看一眼"的差别。
          </p>
        </section>

        {/* ── 还没签合同？先审报价 ── */}
        <section className="mt-12 border-t border-border pt-10">
          <h2 className="text-lg font-semibold text-ink mb-3">还没签合同？</h2>
          <p className="text-sm text-ink leading-relaxed mb-2">
            如果你还在签约前阶段，先做报价审核——确保合同没有隐藏加价项，再进入施工。
          </p>
          <p className="text-sm text-ink-muted mb-5 max-w-xl">
            ¥2,500零加价保障审查 → 13个风险边界逐项排查 → 审过的项目被加价帮你追回。签完合同后，再用节点顾问盯施工。两个产品互补。
          </p>
          <div className="flex flex-wrap gap-4">
            <CTA href="/services/quote-review" label="¥2,500 报价审核 →" variant="primary" />
            <CTA href="/tools/quote-check" label="先做免费初筛 →" variant="secondary" />
          </div>
        </section>

        {/* ── 装完入住？选床垫 ── */}
        <section className="mt-12 border-t border-border pt-10">
          <h2 className="text-lg font-semibold text-ink mb-3">装完入住了？</h2>
          <p className="text-sm text-ink-muted mb-5 max-w-xl">
            最后一件大事——选一张能睡十几年的床垫。¥299起，内部结构保50年。17年行业经验严选，不是代购。
          </p>
          <div className="flex flex-wrap gap-4">
            <CTA href="/mattress" label="¥299起 严选床垫 →" variant="primary" />
            <CTA href="/renovation" label="看完整判断路径 →" variant="secondary" />
          </div>
        </section>

      </Container>
    </>
  )
}
