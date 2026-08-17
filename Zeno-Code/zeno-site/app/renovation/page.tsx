import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import CTA from '@/components/ui/CTA'
import StructuredData from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: '装修判断｜报价、合同和施工怎么检查',
  description:
    '从长期传统行业经营与装修项目实践中整理报价、合同和施工节点的核对方法。先用免费工具整理问题，需要结合材料时再进入人工判断。',
  alternates: {
    canonical: 'https://zenoaihome.com/renovation',
  },
}

/* ── 不是做什么——是判断什么 ── */
const method = [
  {
    title: '看报价',
    desc: '不只比价格高低，还要看哪些项目没写清楚。遇到“按实结算”或“暂估”，继续确认计量方式、单价、上限和变更流程。',
    href: '/tools/quote-check',
  },
  {
    title: '看施工',
    desc: '水电、防水、贴砖等节点的核对条件不同。先明确该看什么、该拍什么，以及哪些问题必须由现场人员或仪器确认。',
    href: '/blog?category=renovation',
  },
  {
    title: '看合同',
    desc: '把重要口头说明写回报价或合同，并确认付款对应的工作内容、验收条件、变更流程和双方责任。',
    href: '/risk-dictionary',
  },
]

/* ── 免费工具 ── */
const tools = [
  { title: '居住需求自检', desc: '还没定方案时，用预设问题整理生活方式和优先级。', href: '/living-diagnosis', cta: '开始自检' },
  { title: '报价初筛', desc: '手里有报价单时，按规则标记还没有写清的边界。', href: '/tools/quote-check', cta: '免费初筛' },
  { title: '风险词典', desc: '把\"按实结算\"\"品牌型号缺失\"这些模糊词拆成人话。', href: '/risk-dictionary', cta: '查词典' },
  { title: '检查清单', desc: '报价、合同、付款、水电——拿到材料逐项对照。', href: '/checklists', cta: '看清单' },
]

/* ── 相关文章 ── */
const articles = [
  { title: '你做的不是答疑，是帮人下定论', href: '/blog/ni-zuo-de-bushi-dayi-shi-bangren-xiadinglun' },
  { title: '装修公司上 AI，搞错了顺序', href: '/blog/zhuangxiu-gongsi-shang-ai-gaocuole-shunxu' },
  { title: '你家不是样板间', href: '/blog/nijia-bushi-yangbanjian' },
  { title: '看全部装修文章 →', href: '/blog?category=renovation' },
]

export default function RenovationPage() {
  return (
    <>
      <StructuredData
        data={[{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: '装修视野',
          url: 'https://zenoaihome.com/renovation',
          description: '从长期传统行业经营与装修项目实践中整理的判断方法，帮助业主看报价、问合同和核对施工节点。',
          inLanguage: 'zh-CN',
        }]}
      />

      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden border-b border-border bg-ink">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(222,210,190,0.18),transparent_45%)]" aria-hidden />
        <Container size="content" className="relative py-16 sm:py-20 lg:py-24">
          <p className="text-sm font-semibold text-white/55">装修判断</p>
          <h1 className="editorial-display mt-5 max-w-[14ch] text-[2.4rem] leading-[1.1] text-white sm:text-[3.2rem]">
            装修前，先把报价、合同和施工看明白。
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            截至 2026 年，我有 17 年传统行业经营与项目经验，长期涉及家居与装修实践。这里把能够公开的判断方法摊开，你可以先自己使用；拿不准时，再带着具体材料来聊。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CTA href="/tools" label="先用免费工具 →" variant="primary" />
            <CTA href="/services/quote-review" label="看报价审核服务 →" variant="secondary" />
          </div>
          <p className="mt-4 text-sm text-white/50">先自己判断；需要具体材料审核时，服务页会写清价格、交付和边界。</p>
        </Container>
      </section>

      <Container size="content" className="py-16 sm:py-20">

        {/* ── 判断什么 ── */}
        <section>
          <p className="text-sm font-semibold text-stone">装修判断三件事</p>
          <h2 className="editorial-display mt-4 text-[2.2rem] leading-[1.12] sm:text-[3rem]">
            不必先成为行家，也能知道该从哪里开始核对。
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {method.map((item) => (
              <Link key={item.title} href={item.href} className="group border border-border bg-surface p-6 transition-colors hover:border-stone">
                <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-stone group-hover:text-ink transition-colors">
                  了解更多 →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 免费工具 ── */}
        <section className="mt-16 sm:mt-20">
          <p className="text-sm font-semibold text-stone">免费工具</p>
          <h2 className="editorial-display mt-4 text-[2.2rem] leading-[1.12] sm:text-[3rem]">
            自己先试。用完了还拿不准，再来找我。
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {tools.map((tool) => (
              <Link key={tool.title} href={tool.href} className="group flex flex-col border border-border bg-surface p-6 transition-colors hover:border-stone">
                <h3 className="text-base font-semibold text-ink">{tool.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted flex-1">{tool.desc}</p>
                <span className="mt-4 text-xs font-semibold text-stone group-hover:text-ink transition-colors">
                  {tool.cta} →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 为什么找 Zeno ── */}
        <section className="mt-16 border border-stone bg-surface-warm p-6 sm:mt-20 sm:p-8">
          <h2 className="text-xl font-semibold text-ink mb-6">为什么我说的话可能对你有用</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-ink">长期经营与项目实践</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">判断来自家居经营、客户沟通、报价合同和装修项目经历，不把年限本身当作结论。</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink">不卖施工，不推荐工长</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">我的立场和你的利益一致。只做判断——帮你看清报价和施工质量，不从中拿回扣。</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink">区分经验、示例与案例</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">方法示例会明确标注；只有材料、使用过程和授权边界能够核对时，才会称为真实案例。</p>
            </div>
          </div>
        </section>

        {/* ── 相关文章 ── */}
        <section className="mt-16 sm:mt-20">
          <p className="text-sm font-semibold text-stone">相关文章</p>
          <h2 className="editorial-display mt-4 text-[2.2rem] leading-[1.12] sm:text-[3rem]">
            从真实案例里建立自己的判断。
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {articles.map((item) => (
              <Link key={item.title} href={item.href} className="group border border-border bg-surface p-5 transition-colors hover:border-stone">
                <p className="text-sm font-semibold text-ink group-hover:text-stone transition-colors">{item.title}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 需要深度对接？ ── */}
        <section className="mt-16 border-2 border-stone bg-surface-warm p-6 sm:p-8 text-center sm:mt-20">
          <h2 className="text-xl font-semibold text-ink mb-3">
            看完还是拿不准？
          </h2>
          <p className="text-2xl font-bold text-stone tracking-wide mb-2">zanxiansheng2025</p>
          <p className="text-sm text-ink-muted mb-5 max-w-lg mx-auto">
            已有报价或合同，先看人工审查的价格、交付和边界；情况不适合标准服务，再通过联系页沟通。
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <CTA href="/services/quote-review" label="看 ¥2,500 报价审核 →" variant="primary" />
            <CTA href="/contact" label="情况复杂，先联系我 →" variant="secondary" />
          </div>
        </section>

      </Container>
    </>
  )
}
