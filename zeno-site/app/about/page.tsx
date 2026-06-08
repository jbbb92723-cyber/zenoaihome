import type { Metadata } from 'next'
import Container from '@/components/Container'
import CTA from '@/components/CTA'

export const metadata: Metadata = {
  title: '关于 ZenoAIHome｜为什么从美学与生活开始做装修判断',
  description:
    '了解 ZenoAIHome 如何把美学、生活方式、空间方案、预算边界、报价合同和交付风险放在一起判断。不做装修百科，不替装修公司销售，只帮业主把装修前该问清的问题拆开。',
  alternates: {
    canonical: 'https://zenoaihome.com/about',
  },
}

const principles = [
  {
    title: '先看生活，不先套风格',
    body: '风格只是表层。真正会影响长期居住的，是光线、动线、收纳、家务、陪伴、独处和预算取舍。',
  },
  {
    title: '先把取舍说清，再谈落地',
    body: '好看的设计必须经得起日常生活。审美、功能和预算不能分开判断，否则后面很容易互相打架。',
  },
  {
    title: '报价合同要承接方案',
    body: '报价不是单独看的，它应该能承接空间选择、材料工艺、付款节点、验收标准和交付责任。',
  },
]

const notDo = [
  '我们不做装修知识大全。',
  '我们不替装修公司销售，也不替任何品牌背书。',
  '我们不承诺最低价，不代谈判，不代签约。',
  '我们不制造业主和装修公司的对立。',
  '我们不把 AI 包装成能替你做最终决定的人。',
]

const canHelp = [
  '把“我想要的生活”翻译成空间优先级、审美取舍和预算边界。',
  '把家庭关系、家务动线、收纳系统、独处和社交需求拆成具体判断。',
  '把方案里的美学选择和报价里的材料、工艺、范围、责任边界对上。',
  '把签约前该写进报价、合同、附件或沟通记录的问题整理成清单。',
]

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-border bg-surface-warm">
        <Container size="content" className="py-14 sm:py-16">
          <p className="page-label mb-4">关于 ZenoAIHome</p>
          <h1 className="page-title mb-5">为什么 ZenoAIHome 从美学与生活开始做装修判断</h1>
          <p className="max-w-3xl text-base leading-[1.85] text-ink-muted sm:text-lg">
            装修真正难的，不只是看报价，也不是选一个好看的风格。难的是把你想要的生活，翻译成能落地、能签约、能交付、能长期居住的空间决策。
          </p>
        </Container>
      </section>

      <Container size="content" className="py-14 sm:py-16">
        <section className="mb-14">
          <h2 className="section-heading mb-5">1. 为什么不能只从报价开始</h2>
          <div className="space-y-4 text-base leading-[1.85] text-ink">
            <p>
              报价当然重要，但报价只是结果。它背后承接的是方案、材料、工艺、范围、付款节点和交付责任。如果前面的生活目标和空间取舍没有说清，后面的报价很容易变成一张看似完整、实际无法判断的价格表。
            </p>
            <p>
              很多装修后悔，不是因为业主一开始少看了一条报价，而是因为好看、好住、好维护、能承受、能交付这几件事没有放在一起判断。
            </p>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="section-heading mb-5">2. 美学与生活为什么必须放在一起</h2>
          <div className="border border-border bg-surface p-6 sm:p-7">
            <p className="text-base leading-[1.85] text-ink">
              好看的设计，必须经得起日常生活。光线、比例、材质、秩序、收纳、家务、亲友来访、孩子成长、老人同住、独处和情绪恢复，都不是效果图里一句“风格”能解决的事。
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
              边界说清楚，服务才不会变味。ZenoAIHome 不把自己包装成万能装修顾问，也不把 AI 包装成最终裁判。
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
            ZenoAIHome 是一个美学与生活结合后的装修判断系统，帮助业主把理想生活翻译成空间方案、装修决策、预算边界、合同约定和交付风险控制。
            报价风险仍然重要，但它是“这套生活方案能否真正落地”的一个风险入口。
          </p>
        </section>

        <section className="border border-border bg-surface-warm p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink">如果你还没定方向，先做居住诊断；如果已经拿到报价，先做免费初筛。</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
            居住诊断帮你看清生活方式、审美取舍和空间优先级；报价初筛帮你找出报价里没说清的边界。两者最终都服务同一件事：让想要的生活真正落地。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <CTA href="/living-diagnosis" label="先做居住诊断" variant="primary" />
            <CTA href="/tools/quote-check" label="已有报价，做初筛" variant="secondary" />
          </div>
        </section>
      </Container>
    </>
  )
}
