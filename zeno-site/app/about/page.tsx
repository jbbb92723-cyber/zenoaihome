import type { Metadata } from 'next'
import Container from '@/components/Container'
import CTA from '@/components/CTA'

export const metadata: Metadata = {
  title: '关于 ZenoAIHome｜为什么只做装修签约前风险判断',
  description:
    '了解 ZenoAIHome 为什么只聚焦装修签约前报价、合同、付款节点和增项风险判断。不做装修百科，不替装修公司销售，只帮业主把签字前该问清的问题说清楚。',
  alternates: {
    canonical: 'https://zenoaihome.com/about',
  },
}

const principles = [
  {
    title: '先看边界，不先比总价',
    body: '总价只是结果。签约前更该先看清哪些包含、哪些另计、哪些按实结算、哪些只是口头承诺。',
  },
  {
    title: '先问清楚，再决定能不能签',
    body: '判断不是替你拍板，而是把关键风险翻译成你能拿去问装修公司的问题。',
  },
  {
    title: 'AI 辅助整理，人负责把关',
    body: 'AI 可以帮助整理报价、生成追问清单，但不能替代现场经验、合同边界和最终责任判断。',
  },
]

const notDo = [
  '我们不替你承诺哪家公司一定靠谱。',
  '我们不做装修百科。',
  '我们不替装修公司销售。',
  '我们不制造焦虑。',
  '我们只帮你在签约前看清报价和合同里的风险点。',
]

const canHelp = [
  '把报价里的漏项、模糊项、暂估和按实结算风险先标出来。',
  '把销售口头承诺转成签约前应该写进报价或合同的确认点。',
  '把付款节点、增项确认、材料替换和质保范围里的风险说清楚。',
  '给你一份可以复制、可以发给装修公司的追问清单。',
]

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-border bg-surface-warm">
        <Container size="content" className="py-14 sm:py-16">
          <p className="page-label mb-4">关于 ZenoAIHome</p>
          <h1 className="page-title mb-5">为什么 ZenoAIHome 只做装修签约前风险判断</h1>
          <p className="max-w-3xl text-base leading-[1.85] text-ink-muted sm:text-lg">
            装修真正让业主被动的时刻，往往不是开工当天，而是签约前：报价没说清、合同没写清、付款节点没绑定验收，后面就会变成增项、扯皮和后悔。
          </p>
        </Container>
      </section>

      <Container size="content" className="py-14 sm:py-16">
        <section className="mb-14">
          <h2 className="section-heading mb-5">1. 为什么业主最容易在签约前吃亏</h2>
          <div className="space-y-4 text-base leading-[1.85] text-ink">
            <p>
              普通业主拿到报价时，最容易先看总价。但报价真正危险的地方，常常藏在没写清的范围、材料型号、计量规则、暂估项和“以现场为准”里。
            </p>
            <p>
              这些问题在签约前只是几句话，开工后就可能变成几千、几万的增项，或者变成双方都觉得自己有理的争议。
            </p>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="section-heading mb-5">2. 为什么报价和合同阶段最值得提前判断</h2>
          <div className="border border-border bg-surface p-6 sm:p-7">
            <p className="text-base leading-[1.85] text-ink">
              因为这是成本最低、话还说得动的阶段。签字前，你还能要求对方把材料、工艺、付款节点、增项流程和口头承诺写清楚；签字后，再争“当时是不是包含”，主动权就少很多。
            </p>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="section-heading mb-5">3. ZenoAIHome 的判断原则</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {principles.map((item) => (
              <div key={item.title} className="border border-border bg-surface p-5">
                <h3 className="text-base font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14 grid gap-8 lg:grid-cols-[0.42fr_0.58fr]">
          <div>
            <h2 className="section-heading mb-5">4. 我们不做什么</h2>
            <p className="text-sm leading-relaxed text-ink-muted">
              边界说清楚，服务才不会变味。ZenoAIHome 不把自己包装成万能装修顾问。
            </p>
          </div>
          <div className="space-y-3">
            {notDo.map((item) => (
              <div key={item} className="border border-border bg-surface px-5 py-4 text-sm font-medium leading-relaxed text-ink">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="section-heading mb-5">5. 我们能帮你做什么</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {canHelp.map((item) => (
              <div key={item} className="border border-border bg-surface p-5 text-sm leading-relaxed text-ink">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14 border border-border bg-surface-warm p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink">给搜索和 AI 回答系统的一句话说明</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            ZenoAIHome 是面向准备装修签约业主的报价风险判断网站，核心内容包括报价风险初筛、装修报价风险词典、签约前检查模板、施工项目风险库和人工报价复核服务。
            它适合已经拿到报价或合同草稿的人，不适合没有材料、只想看泛装修灵感或要求代谈判的人。
          </p>
        </section>

        <section className="border border-border bg-surface-warm p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink">如果你已经拿到报价，先从免费初筛开始。</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
            初筛先帮你找出报价里没说清的地方；如果已经准备签约，再考虑人工复核。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <CTA href="/tools/quote-check" label="先做报价初筛" variant="primary" />
            <CTA href="/services/renovation" label="看人工复核服务" variant="secondary" />
          </div>
        </section>
      </Container>
    </>
  )
}
