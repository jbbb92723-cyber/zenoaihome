import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/auth'
import Container from '@/components/Container'
import PageHero from '@/components/PageHero'
import { formatYuan, getProductById } from '@/data/products'
import PurchaseButton from '../PurchaseButton'

export const metadata: Metadata = {
  title: '装修报价避坑完整指南',
  description:
    '拿到报价单后，逐行对照检查。六张核心清单，把签合同前 30 分钟该看的事写清楚。',
  alternates: {
    canonical: 'https://zenoaihome.com/pricing/baojia-guide',
  },
}

const painPoints = [
  '拿到报价单一头雾水，不知道该先看哪里、问什么',
  '知道大概率有坑，但不确定坑在哪一行',
  '看过零散的避坑文章，但没有可以直接对照检查的工具',
  '不想一上来就进入人工服务，但需要一份 ¥39 就能落地的签约前检查框架',
]

const willGet = [
  'PDF 完整版（约 28-32 页）',
  '六张核心检查表（PDF 表格 + 可填写版）',
  '三类常见陷阱的识别方法 + 应对话术',
  '合同关键条款查漏清单',
  '升级到报价风险快审或签约前决策包的优先判断入口',
]

const tableOfContents = [
  '01　怎么用这份指南（30 分钟自查路径）',
  '02　装修报价单的真实结构：你看到的和没看到的',
  '03　报价单完整度检查表',
  '04　漏项风险检查表',
  '05　模糊描述识别表',
  '06　增项风险记录表',
  '07　水电报价检查表',
  '08　合同条款检查表',
  '09　三类常见陷阱与应对话术',
  '10　自查后还不放心怎么办（升级路径）',
]

const checklists = [
  { name: '表 1 · 报价单完整度检查表', use: '判断该有的项目是否都列了' },
  { name: '表 2 · 漏项风险检查表', use: '识别"应该有但没写"的项目' },
  { name: '表 3 · 模糊描述识别表', use: '标记看似详细实际模糊的描述' },
  { name: '表 4 · 增项风险记录表', use: '集中记录所有另计/甲供/暂估项' },
  { name: '表 5 · 水电报价检查表', use: '隐蔽工程的专项检查' },
  { name: '表 6 · 合同条款检查表', use: '签合同前最后一次自查' },
]

const forWho = [
  '正在收集装修报价、即将签合同的人',
  '担心合同里有条款看不懂的人',
  '需要一份能落地工具、不想做一对一审核的人',
  '不在南宁、暂时不能走线下服务的人',
]

const notForWho = [
  '完全不打算自己看报价的人',
  '已经装修到中后期、想挽回损失的人',
  '期望"读完就能省一半钱"的人——这份指南帮你避坑，不替你砍价',
]

export default async function BaojiaGuidePage() {
  const session = await auth()
  const product = getProductById('quote-guide-pack')

  return (
    <>
      <PageHero
        label="低价产品"
        title="装修报价避坑完整指南"
        subtitle="拿到报价单后，先别只看总价。六张核心清单，帮你把签合同前 30 分钟最该看的事一次看清。"
        size="content"
      />

      <Container size="content" className="py-12 sm:py-16 space-y-16">

        {/* Hero 状态条 */}
        <div className="flex flex-wrap items-center gap-3 border border-stone/30 bg-stone/5 px-5 py-4">
          <span className="text-[0.65rem] text-stone border border-stone/40 px-2 py-0.5 uppercase tracking-wider">
            已开放
          </span>
          <p className="text-sm text-ink-muted">
            定价 {product ? formatYuan(product.price) : '¥39'} · 数字产品 · 一次购买，小版本更新免费
          </p>
        </div>

        {/* 用户痛点 */}
        <section>
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">用户痛点</p>
          <h2 className="text-lg font-semibold text-ink mb-5">如果你正在准备签装修合同</h2>
          <ul className="space-y-2.5">
            {painPoints.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-ink leading-relaxed">
                <span className="text-stone shrink-0 mt-1">·</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 这份指南解决什么 */}
        <section className="border-t border-border pt-12">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">这份指南解决什么</p>
          <h2 className="text-lg font-semibold text-ink mb-5">不替你砍价，帮你在签前看懂</h2>
          <div className="space-y-4 text-sm text-ink leading-[1.85]">
            <p>
              这不是课程，也不是文章合集。它是一份你拿到装修报价单后可以直接对照检查的实用 PDF 指南。
            </p>
            <p className="text-ink-muted">
              这份指南真正卖的，不是 PDF 本身，而是签合同前少后悔的那半小时。你可以先自己过一遍，再决定要不要进报价快审。
            </p>
          </div>

        </section>

        {/* 30 分钟使用路径 */}
        <section className="border-t border-border pt-12">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">30 分钟怎么用</p>
          <h2 className="text-lg font-semibold text-ink mb-5">不是从头读完，是签约前按顺序查</h2>
          <ol className="grid gap-3 sm:grid-cols-5">
            {[
              '先看报价单有没有拆到项目、数量、单位和单价',
              '再标记漏项、模糊描述和另计项目',
              '接着检查水电、付款节点和验收口径',
              '把最重要的追问发给施工方确认',
              '仍然看不懂，再升级到报价风险快审',
            ].map((step, index) => (
              <li key={step} className="border border-border bg-surface p-4 text-sm leading-relaxed text-ink-muted">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-stone">{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        {/* 你会得到什么 */}
        <section className="border-t border-border pt-12">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">你会得到什么</p>
          <h2 className="text-lg font-semibold text-ink mb-5">完整交付物</h2>
          <ul className="space-y-2.5">
            {willGet.map((g) => (
              <li key={g} className="flex items-start gap-3 text-sm text-ink leading-relaxed">
                <span className="text-stone shrink-0">✓</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 目录预览 */}
        <section className="border-t border-border pt-12">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">目录预览</p>
          <h2 className="text-lg font-semibold text-ink mb-5">10 章，约 28-32 页</h2>
          <ol className="space-y-2 border border-border p-6 bg-surface-warm/40">
            {tableOfContents.map((t) => (
              <li key={t} className="text-sm text-ink leading-relaxed font-mono tracking-tight">
                {t}
              </li>
            ))}
          </ol>
        </section>

        {/* 六张检查表 */}
        <section className="border-t border-border pt-12">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">核心检查表</p>
          <h2 className="text-lg font-semibold text-ink mb-5">六张可直接对照的清单</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {checklists.map((c) => (
              <div key={c.name} className="border border-border bg-surface p-5">
                <p className="text-sm font-semibold text-ink leading-snug">{c.name}</p>
                <p className="text-xs text-ink-muted mt-2 leading-relaxed">{c.use}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 适合谁 / 不适合谁 */}
        <section className="border-t border-border pt-12">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">适合谁</p>
          <h2 className="text-lg font-semibold text-ink mb-5">先确认是不是你想要的</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-stone font-semibold uppercase tracking-widest mb-3">适合</p>
              <ul className="space-y-2">
                {forWho.map((w) => (
                  <li key={w} className="flex items-start gap-2 text-sm text-ink leading-relaxed">
                    <span className="text-stone shrink-0">+</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">不适合</p>
              <ul className="space-y-2">
                {notForWho.map((w) => (
                  <li key={w} className="flex items-start gap-2 text-sm text-ink-muted leading-relaxed">
                    <span className="text-ink-faint shrink-0">−</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 购买 + 下一步引导 */}
        <section className="border border-stone/30 bg-stone/5 p-7 sm:p-9">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-stone mb-3">购买入口</p>
          <h2 className="text-lg font-semibold text-ink mb-3">定价 {product ? formatYuan(product.price) : '¥39'}，适合签约前自己先过一遍</h2>
          <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-prose">
            如果你手里已经有报价单，先用指南和清单自己过一遍；如果已经明显看不懂，再去报价风险快审；如果报价、预算和合同一起乱，再直接看签约前决策包。
          </p>
          <div className="grid gap-3 sm:grid-cols-[minmax(0,18rem)_auto_auto_auto] sm:items-center">
            {product && (
              <PurchaseButton
                productId={product.id}
                label={`购买 ${product.name}`}
                isLoggedIn={!!session?.user}
              />
            )}
            <Link
              href="/tools/quote-check"
              className="inline-flex items-center text-sm font-medium text-stone border border-stone/40 px-4 py-2 hover:bg-stone-pale transition-colors"
            >
              先用报价初筛 →
            </Link>
            <Link
              href="/services/renovation#baojia-shenhe"
              className="inline-flex items-center text-sm font-medium text-stone border border-stone/40 px-4 py-2 hover:bg-stone-pale transition-colors"
            >
              看报价风险快审 →
            </Link>
            <Link
              href="/services/renovation#qianyue-qian-juece-bao"
              className="inline-flex items-center text-sm font-medium text-stone border border-stone/40 px-4 py-2 hover:bg-stone-pale transition-colors"
            >
              看签约前决策包 →
            </Link>
          </div>
        </section>

        {/* 售后说明 */}
        <section className="border-t border-border pt-8 text-xs text-ink-muted leading-relaxed space-y-1.5">
          <p>· 定价 ¥39，数字产品，售出后不支持退款</p>
          <p>· 一次购买，后续小版本更新免费</p>
          <p>· 购买后可在用户中心看到领取记录</p>
          <p>· 购买后添加 Zeno 微信，获取后续更新 + 答疑通道</p>
          <p>· 个人使用授权，不可二次分发</p>
        </section>

      </Container>
    </>
  )
}
