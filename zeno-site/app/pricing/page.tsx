import type { Metadata } from 'next'
import { auth } from '@/auth'
import Container from '@/components/Container'
import PageHero from '@/components/PageHero'
import { PRODUCTS, formatYuan } from '@/data/products'
import PurchaseButton from './PurchaseButton'

export const metadata: Metadata = {
  title: '课程与数字产品 · ZenoAIHome',
  description: 'ZenoAIHome 的装修判断、AI 工作流和内容资产数字产品。',
}

const categories = ['装修判断', 'AI 升级', '内容资产'] as const

export default async function PricingPage() {
  const session = await auth()

  return (
    <>
      <PageHero
        label="课程与数字产品"
        title="先用低价产品解决一个具体问题，再决定要不要服务"
        subtitle="这里不做泛泛卖课。每个产品都对应一个明确任务：看报价、建判断顺序、把装修经验接进 AI，或者长期沉淀内容资产。"
        note="工具看不明白的地方，可以找我帮你判断；课程解决的是可重复学习的部分。"
        size="content"
      />

      <Container size="content" className="py-12 pb-section">
        <div className="mb-10 grid gap-3 sm:grid-cols-3">
          {categories.map((category) => (
            <a key={category} href={`#${category}`} className="border border-border bg-surface p-4 text-sm font-semibold text-ink hover:border-stone hover:bg-surface-warm">
              {category}
            </a>
          ))}
        </div>

        <div className="space-y-12">
          {categories.map((category) => {
            const products = PRODUCTS.filter((product) => product.category === category)
            if (products.length === 0) return null

            return (
              <section key={category} id={category} className="scroll-mt-24">
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-stone">{category}</p>
                  <h2 className="mt-2 text-xl font-semibold text-ink">{category === 'AI 升级' ? '传统装修行业的第二增长曲线' : category === '装修判断' ? '给业主的判断力产品' : '长期经营的内容资产'}</h2>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className={`relative border p-6 flex flex-col gap-5 ${
                        product.badge
                          ? 'border-stone bg-surface-warm'
                          : 'border-border bg-surface'
                      }`}
                    >
                      {product.badge && (
                        <span className="absolute -top-px right-4 bg-stone px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-widest text-white">
                          {product.badge}
                        </span>
                      )}

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-stone">{product.tagline}</p>
                        <h3 className="mt-2 text-xl font-semibold text-ink">{product.name}</h3>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-ink">{formatYuan(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-ink-faint line-through">{formatYuan(product.originalPrice)}</span>
                        )}
                      </div>

                      <div className="grid gap-3 text-sm leading-relaxed">
                        <p className="text-ink-muted"><span className="font-semibold text-ink">适合谁：</span>{product.bestFor}</p>
                        <p className="text-ink-muted"><span className="font-semibold text-ink">交付物：</span>{product.deliverable}</p>
                      </div>

                      <ul className="space-y-2 flex-1">
                        {product.description.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-ink-muted">
                            <span className="mt-0.5 text-stone shrink-0">-</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <PurchaseButton
                        productId={product.id}
                        label={`购买 ${product.name}`}
                        isLoggedIn={!!session?.user}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        <div className="mt-14 border-t border-border pt-10">
          <h3 className="text-base font-semibold text-ink mb-6">购买前先看清楚</h3>
          <div className="grid gap-5 md:grid-cols-2">
            {FAQ.map((item) => (
              <div key={item.q} className="border border-border bg-surface p-5">
                <p className="text-sm font-medium text-ink mb-1.5">{item.q}</p>
                <p className="text-sm text-ink-muted leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  )
}

const FAQ = [
  {
    q: '支付方式是什么？',
    a: '目前支持微信或支付宝扫码手动转账。下单后页面会显示收款方式，付款完成后点击“我已付款”，人工确认后开通权益。',
  },
  {
    q: '买完后在哪里看？',
    a: '资源类产品会进入用户中心的已领资料记录。部分课程内容会先以网页资料、清单和提示词包形式交付，再逐步补视频或图文课。',
  },
  {
    q: '课程能替代人工服务吗？',
    a: '不能。课程解决可重复学习的部分，人工服务解决具体材料、具体项目和具体判断。',
  },
  {
    q: '是否支持退款？',
    a: '开通后 7 天内、且内容资源未大量下载的情况下，可申请退款。请联系我说明原因，协商处理。',
  },
]
