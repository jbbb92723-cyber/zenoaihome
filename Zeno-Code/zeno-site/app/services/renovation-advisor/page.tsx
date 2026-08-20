import type { Metadata } from 'next'
import Container from '@/components/ui/Container'
import CTA from '@/components/ui/CTA'
import StructuredData from '@/components/ui/StructuredData'
import {
  RENOVATION_ADVISOR_BASE_SCOPE,
  RENOVATION_ADVISOR_COMPLEXITY_FACTORS,
  SERVICE_PRICING,
} from '@/data/services/pricing'

const service = SERVICE_PRICING.renovationAdvisor

export const metadata: Metadata = {
  title: `ZENO 装修决策顾问｜${service.displayPrice}`,
  description:
    '在约定周期和关键节点内，协助核对资料、比较方案、控制预算并准备沟通问题。基准范围最多 6 个节点、最长 120 天，复杂项目评估后报价。',
  alternates: {
    canonical: 'https://zenoaihome.com/services/renovation-advisor',
  },
}

const decisionNodes = [
  ['01', '需求与预算', '把使用目标、预算上限和优先级放进同一张项目地图。'],
  ['02', '方案与空间取舍', '核对效果与实际使用、施工条件和成本之间的冲突。'],
  ['03', '报价与合同', '检查范围、计量、材料、付款、变更和责任是否写清。'],
  ['04', '材料与设备', '结合预算、使用频率、维护和替代成本比较候选方案。'],
  ['05', '施工变更与付款', '发生变化时回到原约定，判断影响、证据和下一步沟通。'],
  ['06', '验收与结算', '整理待整改项、付款条件、项目资料和仍需专业确认的事项。'],
] as const

export default function RenovationAdvisorPage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.name,
          description: metadata.description,
          provider: { '@type': 'Person', name: '赞诺' },
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'CNY',
            lowPrice: String(service.startingAmount),
            offerCount: '1',
          },
          url: 'https://zenoaihome.com/services/renovation-advisor',
        }}
      />

      <main className="bg-canvas text-ink">
        <section className="border-b border-border bg-ink px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto max-w-[1120px]">
            <p className="text-sm font-semibold text-white/60">ZENO 装修决策顾问</p>
            <h1 className="editorial-display mt-5 max-w-[17ch] text-[2.4rem] leading-[1.1] sm:text-[3.2rem]">
              不是替你管工地，是在关键节点帮你把决定做清楚。
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
              从预算、方案和报价，到材料、变更、付款和验收。我根据双方确认的资料和服务节点参与判断，最终选择、签署和现场责任仍由对应当事人承担。
            </p>
            <div className="mt-8 flex flex-wrap items-end gap-x-5 gap-y-3">
              <span className="text-5xl font-bold">{service.displayPrice}</span>
              <span className="pb-1 text-sm text-white/60">{service.priceNote}</span>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CTA href="/contact" label="说明你的项目情况 →" variant="primary" />
              <p className="text-sm text-white/55">先评估项目类型、节点、周期和资料，再出书面报价。</p>
            </div>
          </div>
        </section>

        <Container size="content" className="py-16 sm:py-20">
          <section>
            <p className="text-sm font-semibold text-stone">基准价格对应什么</p>
            <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.4rem]">“起”对应明确范围，不按人随意报价。</h2>
            <div className="mt-10 grid gap-8 border-y border-border py-8 lg:grid-cols-[0.45fr_0.55fr]">
              <div>
                <p className="text-4xl font-bold text-ink">{service.displayPrice}</p>
                <p className="mt-3 text-sm leading-7 text-ink-muted">普通住宅标准范围的项目基准价。最终费用以开始前确认的服务说明为准。</p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {RENOVATION_ADVISOR_BASE_SCOPE.map((item) => (
                  <li key={item} className="border-l-2 border-stone pl-4 text-sm leading-7 text-ink-muted">{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mt-16 sm:mt-20">
            <p className="text-sm font-semibold text-stone">六个决策节点</p>
            <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.4rem]">按项目实际情况约定，不要求机械走满。</h2>
            <div className="mt-10 border-t border-border">
              {decisionNodes.map(([code, title, body]) => (
                <div key={code} className="grid gap-3 border-b border-border py-6 sm:grid-cols-[3rem_13rem_1fr] sm:items-start">
                  <span className="text-xs font-semibold text-stone">{code}</span>
                  <h3 className="text-base font-semibold text-ink">{title}</h3>
                  <p className="text-sm leading-7 text-ink-muted">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16 bg-surface-warm px-6 py-10 sm:mt-20 sm:px-8">
            <p className="text-sm font-semibold text-stone">哪些情况需要重新报价</p>
            <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.4rem]">工作量和责任范围发生变化，价格才变化。</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {RENOVATION_ADVISOR_COMPLEXITY_FACTORS.map((item) => (
                <p key={item} className="border-t border-border pt-4 text-sm leading-7 text-ink-muted">{item}</p>
              ))}
            </div>
            <p className="mt-8 border-l-2 border-stone pl-4 text-sm leading-7 text-ink-muted">
              咖啡厅、餐饮、门店等商业空间还涉及经营动线、设备、消防、排烟和燃气等条件。ZENO 只处理约定的项目判断与协作，相关专业结论由持证机构负责。
            </p>
          </section>

          <section className="mt-16 grid gap-8 sm:mt-20 lg:grid-cols-2">
            <div className="border-t border-border pt-6">
              <p className="text-sm font-semibold text-stone">报价会写清</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-ink-muted">
                <li>基础顾问范围和已经包含的决策节点</li>
                <li>新增节点按 ¥2,500 / 个确认</li>
                <li>现场次数、距离、差旅和紧急处理费用</li>
                <li>第三方设计、监理、检测或专业服务费用</li>
              </ul>
            </div>
            <div className="border-t border-border pt-6">
              <p className="text-sm font-semibold text-stone">明确不承担</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-ink-muted">
                <li>正式设计、施工图、工程监理和施工安全责任</li>
                <li>代替客户签约、付款、采购或现场验收</li>
                <li>代替造价、法律、结构、消防和燃气专业意见</li>
                <li>未约定材料、节点和周期的无限答疑</li>
              </ul>
            </div>
          </section>

          <section className="mt-16 grid gap-6 border-y border-border py-10 sm:mt-20 lg:grid-cols-[0.62fr_0.38fr] lg:items-center">
            <div>
              <h2 className="editorial-display text-[1.8rem] leading-[1.15] sm:text-[2.4rem]">还没有完整项目，只卡在一个节点？</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-muted">先从 ¥299 单问题判断诊断或 ¥2,500 装修专项判断开始。需要持续协作时，再把已付诊断费用按约定抵扣到项目中。</p>
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              <CTA href="/services/diagnosis" label="先做单问题判断诊断 →" variant="secondary" />
              <CTA href="/services/quote-review" label="看装修专项判断 →" variant="ghost" />
            </div>
          </section>
        </Container>
      </main>
    </>
  )
}
