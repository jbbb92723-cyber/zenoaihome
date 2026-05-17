import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/auth'
import Container from '@/components/Container'
import PageHero from '@/components/PageHero'
import { formatYuan, getProductById } from '@/data/products'
import PurchaseButton from '../PurchaseButton'

export const metadata: Metadata = {
  title: '装修报价风险自查指南',
  description:
    '拿到报价单后，先把漏项、模糊项、增项口子和付款节点看清楚。六张检查表，专门给签约前自查用。',
  alternates: {
    canonical: 'https://zenoaihome.com/pricing/baojia-guide',
  },
}

const painPoints = [
  '拿到报价单，不知道先看哪里',
  '知道可能有坑，但不知道坑在哪一行',
  '想自己先看一遍，不想立刻进人工服务',
  '需要一份能直接对照的签约前检查框架',
]

const deliverables = [
  'PDF 完整版（约 28-32 页）',
  '6 张核心检查表',
  '3 类常见风险的识别方法',
  '合同关键条款查漏清单',
  '升级到报价快审或决策包的入口',
]

const tableOfContents = [
  '01  怎么用这份指南',
  '02  报价单真实结构',
  '03  完整度检查表',
  '04  漏项风险检查表',
  '05  模糊描述识别表',
  '06  增项风险记录表',
  '07  水电报价检查表',
  '08  合同条款检查表',
  '09  常见风险与追问话术',
  '10  看完后下一步怎么走',
]

const checklists = [
  { name: '表 1 · 报价单完整度检查表', use: '看该有的项目是否都列了' },
  { name: '表 2 · 漏项风险检查表', use: '找出“应该有但没写”的项目' },
  { name: '表 3 · 模糊描述识别表', use: '标记看似详细、实际模糊的描述' },
  { name: '表 4 · 增项风险记录表', use: '集中记录另计、甲供、暂估项' },
  { name: '表 5 · 水电报价检查表', use: '看隐蔽工程有没有写清' },
  { name: '表 6 · 合同条款检查表', use: '签合同前最后一次自查' },
]

const forWho = [
  '正在收集装修报价、即将签合同的人',
  '担心合同里有条款看不懂的人',
  '需要一份能落地的工具、不想做一对一审核的人',
  '不在南宁、暂时不能走线下服务的人',
]

const notForWho = [
  '完全不打算自己看报价的人',
  '已经装修到中后期、想挽回损失的人',
  '期望“读完就能省一半钱”的人',
]

export default async function BaojiaGuidePage() {
  const session = await auth()
  const product = getProductById('quote-guide-pack')

  return (
    <>
      <PageHero
        label="低价产品"
        title="装修报价风险自查指南"
        subtitle="拿到报价单后，先别只看总价。六张核心清单，帮你把签合同前最该看的事一次看清。"
        size="content"
      />

      <Container size="content" className="space-y-14 py-12 sm:py-16">
        <section className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint">你可能正在遇到</p>
          <ul className="space-y-2.5">
            {painPoints.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm leading-relaxed text-ink">
                <span className="mt-1 shrink-0 text-stone">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-border pt-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint">这份指南解决什么</p>
          <h2 className="mt-3 text-lg font-semibold text-ink">不是替你砍价，是帮你在签约前看清边界</h2>
          <div className="mt-4 space-y-4 text-sm leading-[1.85] text-ink-muted">
            <p>这是一份可以直接对照报价单使用的 PDF 指南，不是长篇装修百科。</p>
            <p>你可以先自己过一遍，再决定要不要进报价快审或签约前决策包。</p>
          </div>
        </section>

        <section className="border-t border-border pt-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint">30 分钟路径</p>
          <h2 className="mt-3 text-lg font-semibold text-ink">不是从头读完，是先按顺序查</h2>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tableOfContents.map((step, index) => (
              <li key={step} className="border border-border bg-surface p-4 text-sm leading-relaxed text-ink-muted">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-stone">{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-border pt-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint">你会得到什么</p>
          <ul className="mt-4 space-y-2.5">
            {deliverables.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-ink">
                <span className="mt-1 shrink-0 text-stone">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-border pt-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint">六张检查表</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {checklists.map((item) => (
              <div key={item.name} className="border border-border bg-surface p-5">
                <p className="text-sm font-semibold text-ink">{item.name}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{item.use}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border pt-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint">适合谁</p>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone">适合</p>
              <ul className="space-y-2">
                {forWho.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-ink">
                    <span className="mt-1 shrink-0 text-stone">+</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-faint">不适合</p>
              <ul className="space-y-2">
                {notForWho.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-ink-muted">
                    <span className="mt-1 shrink-0 text-ink-faint">−</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border border-stone/30 bg-stone/5 p-7 sm:p-9">
          <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-stone">购买入口</p>
          <h2 className="mb-3 text-lg font-semibold text-ink">定价 {product ? formatYuan(product.price) : '¥39'}</h2>
          <p className="mb-6 max-w-prose text-sm leading-relaxed text-ink-muted">
            如果你已经拿到报价单，先用这份指南自己过一遍；如果已经看不明白，再去报价快审。
          </p>
          <div className="flex flex-wrap gap-3">
            {product && (
              <PurchaseButton productId={product.id} label={`购买 ${product.name}`} isLoggedIn={!!session?.user} />
            )}
            <Link
              href="/tools/quote-check"
              className="inline-flex h-11 items-center border border-stone px-4 text-sm font-semibold text-stone transition-colors hover:bg-stone-pale"
            >
              先做报价初筛
            </Link>
            <Link
              href="/services/renovation#baojia-shenhe"
              className="inline-flex h-11 items-center border border-stone px-4 text-sm font-semibold text-stone transition-colors hover:bg-stone-pale"
            >
              看报价快审
            </Link>
          </div>
        </section>
      </Container>
    </>
  )
}
