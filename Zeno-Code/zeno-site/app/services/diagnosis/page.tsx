import type { Metadata } from 'next'
import Container from '@/components/ui/Container'
import CTA from '@/components/ui/CTA'
import StructuredData from '@/components/ui/StructuredData'
import { SERVICE_PRICING } from '@/data/services/pricing'

const service = SERVICE_PRICING.diagnosis

export const metadata: Metadata = {
  title: `ZENO 单问题判断诊断｜${service.displayPrice} 首批验证价`,
  description:
    '围绕一个具体问题，先看已有资料，再进行一次沟通并交付简短判断记录。适用于装修判断、AI 使用与落地、OPC 和项目运营问题。',
  alternates: {
    canonical: 'https://zenoaihome.com/services/diagnosis',
  },
}

const directions = [
  {
    title: '居住与装修判断',
    body: '空间、材料、预算、报价、合同和施工过程中，一个正在影响选择的问题。',
  },
  {
    title: 'AI 使用与落地',
    body: '工具、电脑与手机使用、真实任务拆解，或一项工作是否适合交给 AI。',
  },
  {
    title: 'OPC 与项目运营',
    body: '一人公司、社区、培训中心或项目推进中，一个需要明确下一步的问题。',
  },
]

const process = [
  ['01', '先提交一个问题', '说明背景、当前阶段、已有材料和必须做决定的时间。'],
  ['02', '确认是否适合', '问题需要先缩小；不适合这项服务时，不让你为错误入口付款。'],
  ['03', '资料预看与沟通', '围绕已确认的问题进行资料预看和一次不超过 45 分钟的沟通。'],
  ['04', '交付判断记录', '整理事实、判断依据、风险、下一步和仍需专业确认的事项。'],
] as const

export default function DiagnosisPage() {
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
            '@type': 'Offer',
            priceCurrency: 'CNY',
            price: String(service.amount),
          },
          url: 'https://zenoaihome.com/services/diagnosis',
        }}
      />

      <main className="bg-canvas text-ink">
        <section className="border-b border-border bg-ink px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto max-w-[1120px]">
            <p className="text-sm font-semibold text-white/60">ZENO 单问题判断诊断</p>
            <h1 className="editorial-display mt-5 max-w-[16ch] text-[2.4rem] leading-[1.1] sm:text-[3.2rem]">
              先把一个真正影响决定的问题说清楚。
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
              不是无限答疑，也不是一场销售电话。你带着一个具体问题和必要材料来，我先判断缺少什么，再和你一起形成可执行的下一步。
            </p>
            <div className="mt-8 flex flex-wrap items-end gap-x-5 gap-y-3">
              <span className="text-5xl font-bold">{service.displayPrice}</span>
              <span className="pb-1 text-sm text-white/60">{service.priceNote}</span>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CTA href="/contact" label="提交一个具体问题 →" variant="primary" />
              <p className="text-sm text-white/55">先确认问题和范围，再付款开始。</p>
            </div>
          </div>
        </section>

        <Container size="content" className="py-16 sm:py-20">
          <section>
            <p className="text-sm font-semibold text-stone">适合处理什么</p>
            <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.4rem]">三个方向，同一套判断流程。</h2>
            <div className="mt-10 grid border-y border-border sm:grid-cols-3">
              {directions.map((direction, index) => (
                <article key={direction.title} className={`py-7 sm:px-6 ${index < directions.length - 1 ? 'border-b border-border sm:border-b-0 sm:border-r' : ''}`}>
                  <h3 className="text-lg font-semibold text-ink">{direction.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-ink-muted">{direction.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-16 sm:mt-20">
            <p className="text-sm font-semibold text-stone">交付流程</p>
            <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.4rem]">一个问题，四步走完。</h2>
            <div className="mt-10 border-t border-border">
              {process.map(([code, title, body]) => (
                <div key={code} className="grid gap-3 border-b border-border py-6 sm:grid-cols-[3rem_13rem_1fr] sm:items-start">
                  <span className="text-xs font-semibold text-stone">{code}</span>
                  <h3 className="text-base font-semibold text-ink">{title}</h3>
                  <p className="text-sm leading-7 text-ink-muted">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16 grid gap-8 border-y border-border bg-surface-warm px-6 py-10 sm:mt-20 sm:px-8 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-stone">你会得到</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-ink-muted">
                <li>一次不超过 45 分钟的语音或视频沟通</li>
                <li>一页简短判断记录：事实、判断、风险和下一步</li>
                <li>交付后 7 天内一次文字澄清</li>
                <li>7 天内升级装修专项服务，可抵扣本次诊断费用</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-stone">这项服务不包含</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-ink-muted">
                <li>同时处理多个互不相关的问题</li>
                <li>代做设计、效果图、施工管理或长期微信答疑</li>
                <li>替代法律、工程安全、造价和其他持证专业意见</li>
                <li>没有材料依据时替你做最终决定</li>
              </ul>
            </div>
          </section>

          <section className="mt-16 grid gap-6 border-t border-border pt-10 sm:mt-20 lg:grid-cols-[0.62fr_0.38fr] lg:items-center">
            <div>
              <h2 className="editorial-display text-[1.8rem] leading-[1.15] sm:text-[2.4rem]">问题变成完整装修节点后，再进入专项服务。</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-muted">
                报价合同、预算材料或施工节点需要结合完整资料判断时，统一进入 ¥2,500 装修专项判断；需要持续参与多个节点时，再评估全程顾问。
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              <CTA href="/services/quote-review" label="看装修专项判断 →" variant="secondary" />
              <CTA href="/services/renovation-advisor" label="看全程顾问 →" variant="ghost" />
            </div>
          </section>
        </Container>
      </main>
    </>
  )
}
