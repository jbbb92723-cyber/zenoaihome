import type { Metadata } from 'next'
import Container from '@/components/ui/Container'
import CTA from '@/components/ui/CTA'
import StructuredData from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: '报价快审｜¥199，24小时内告诉你合同里藏了什么',
  description:
    '17年装修经验的人逐项审核你的报价单。审不出关键问题，全额退款。你只做一件事：拍照发给我。',
  alternates: {
    canonical: 'https://zenoaihome.com/services/quote-review',
  },
}

const valueItems = [
  {
    label: '你得到的',
    desc: '逐项审核你的报价单，标注所有隐藏加价项、模糊描述、增项入口。不是"有问题"，是"第3页第5项多算"。',
  },
  {
    label: '多长时间',
    desc: '24小时内出结果。你今晚发，明天下午拿到详细审核报告。不耽误你的签约时间。',
  },
  {
    label: '你要做什么',
    desc: '把报价单拍照发给我。没了。不需要整理Excel，不需要打字说明——拍张照就行。',
  },
]

const bonusStack = [
  { name: '装修合同避雷指南', value: '¥299', desc: '合同里常见的8个坑，和怎么把口头承诺写进合同' },
  { name: '施工前3个月短信答疑', value: '¥499', desc: '签约后遇到不确定的事，随时发微信问我' },
  { name: '装修公司谈判话术模板', value: '¥199', desc: '不知道怎么开口拒绝加价？模板给你，你复制粘贴' },
]

const guaranteeItems = [
  '审核过的项目如果在施工中被变相加价，我帮你追回差额',
  '追不回，全额退款——¥199退给你，没有任何条件',
  '零风险：退一万步说，即使你不满意，你也免费拿到了一份装修合同避雷指南',
]

const comparisonItems = [
  { label: '不审核的后果', items: ['预算超支 ¥20,000-50,000', '施工中反复加价、扯皮3个月', '住进去后发现质量问题，后悔来不及'] },
  { label: '花¥199审核', items: ['一眼看出3-5个隐藏加价项', '签约前把模糊表述改清楚', '施工中遇到加价——有人帮你判断该不该给'] },
]

export default function QuoteReviewPage() {
  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: '装修报价快审',
            description: '17年装修经验的人逐项审核您的报价单，24小时内出详细审核报告。审不出关键问题，全额退款。',
            provider: { '@type': 'Person', name: 'Zeno' },
            offers: { '@type': 'Offer', priceCurrency: 'CNY', price: '199' },
            url: 'https://zenoaihome.com/services/quote-review',
          },
        ]}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-border bg-canvas">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(222,210,190,0.38),transparent_38%)]" aria-hidden />
        <Container size="content" className="relative py-14 sm:py-18">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone">Quote Review</p>
          <h1 className="editorial-display mt-5 max-w-4xl text-[2.4rem] leading-[1.12] text-ink sm:text-[3.6rem]">
            你在装修上多花的每一块钱，都是因为签合同之前没有17年经验的人帮你看一眼。
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
            一份装修报价单，少则几页，多则几十页。看不懂是正常的——你不是干这行的。但签了字，每一个模糊的词都可能变成开工后的加价通知。
          </p>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-5xl font-bold text-ink">¥199</span>
            <span className="text-base text-ink-muted">/ 一次审核，24小时内出结果</span>
          </div>
          <p className="mt-2 text-sm text-stone">审不出关键问题，全额退款。没有条件。</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CTA href="/contact" label="把报价单发给我 →" variant="primary" />
            <p className="flex items-center text-sm text-ink-muted">
              微信: zanxiansheng2025 · 备注「报价快审」· 把报价单拍照发来就行
            </p>
          </div>
        </Container>
      </section>

      {/* 你会得到什么 */}
      <Container size="content" className="py-section">
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-ink mb-8">¥199，你得到什么</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {valueItems.map((item) => (
              <div key={item.label} className="border border-border bg-surface p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone mb-3">{item.label}</p>
                <p className="text-sm leading-relaxed text-ink">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 赠品价值堆叠 */}
        <section className="mb-16 border border-stone bg-surface-warm p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink mb-2">不只是审核——你还免费获得这些</h2>
          <p className="text-sm text-ink-muted mb-6">一份¥199的报价审核 = ¥3,596的价值。不是因为我们定价低，是因为我们送的东西你做起来不费力，但对你有用。</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {bonusStack.map((bonus) => (
              <div key={bonus.name} className="border border-border bg-canvas p-5">
                <p className="text-lg font-bold text-stone">{bonus.value}</p>
                <h3 className="mt-1 text-sm font-semibold text-ink">{bonus.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{bonus.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-border pt-4 flex items-baseline gap-3">
            <span className="text-sm text-ink-muted line-through">总价值 ¥3,596</span>
            <span className="text-2xl font-bold text-ink">¥199</span>
            <span className="text-sm text-ink-muted">一次审核，全包在内</span>
          </div>
        </section>

        {/* 风险逆转 */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-ink mb-6">你的风险是零。我的风险是全额退款。</h2>
          <div className="border-2 border-stone bg-surface p-6 sm:p-8">
            <p className="text-sm text-ink-muted mb-5">成交最大的阻力不是你嫌贵，是你担心"买了没用"。所以我们把这个风险从我转移到我自己身上：</p>
            <ul className="space-y-3">
              {guaranteeItems.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-ink">
                  <span className="mt-0.5 shrink-0 text-stone font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-xs text-ink-faint">
            17年经验。如果我的审核会出错，我不会拿自己的全额退款开玩笑。
          </p>
        </section>

        {/* 算账 */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-ink mb-6">算一笔账</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {comparisonItems.map((col) => (
              <div key={col.label} className="border border-border bg-surface p-6">
                <p className="text-sm font-semibold text-ink mb-4">{col.label}:</p>
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
          <p className="mt-5 text-sm text-ink-muted max-w-2xl">
            你可能会损失¥20,000+，也可能花¥199避免这笔损失。这是2.5%的保险费用。花¥199，省¥20,000——这个账，谁都算得过来。
          </p>
        </section>

        {/* CTA */}
        <section className="border-2 border-stone bg-surface-warm p-6 sm:p-8 text-center">
          <h2 className="text-xl font-semibold text-ink mb-3">现在，把你的报价单发给我</h2>
          <p className="text-2xl font-bold text-stone tracking-wide mb-2">zanxiansheng2025</p>
          <p className="text-sm text-ink-muted mb-5 max-w-md mx-auto">
            加微信，备注「报价快审」。把报价单拍照发来。24小时内，你手里会有一份被17年经验看过、每个问题都标清楚、可以直接拿去跟装修公司谈的报告。
          </p>
          <p className="text-xs text-ink-faint">审不出关键问题，全额退款。这不是促销话术——这是承诺。</p>
        </section>

        {/* 还不确定？ */}
        <section className="mt-12 border-t border-border pt-10">
          <p className="text-sm text-ink leading-relaxed mb-4">
            还不确定？先看看我的文章，建立自己的判断。觉得需要了再来——我不催你。
          </p>
          <div className="flex flex-wrap gap-4">
            <CTA href="/blog/wo-shi-shui-17-nian-gongdi" label="先了解我是谁 →" variant="secondary" />
            <CTA href="/blog" label="看更多文章 →" variant="secondary" />
          </div>
        </section>
      </Container>
    </>
  )
}
