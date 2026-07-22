import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import CTA from '@/components/ui/CTA'
import StructuredData from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: '装修视野｜17 年工地里长出来的判断方法',
  description:
    '不是装修教程——是怎么看报价、怎么判断施工质量、怎么在入住前避开大多数人都踩过的坑。免费工具自己用，拿不准的来聊。',
  alternates: {
    canonical: 'https://zenoaihome.com/renovation',
  },
}

/* ── 不是做什么——是判断什么 ── */
const method = [
  {
    title: '看报价',
    desc: '不是比价格高低——是看哪些项目没写清楚。\"按实结算\"四个字下面该有半页纸的规则，没写就意味着后面要加钱。',
    href: '/tools/quote-check',
  },
  {
    title: '看施工',
    desc: '水电走线对不对、防水刷了几遍、贴砖空鼓率——不是你盯着工人干活，是知道在哪个节点该看什么。',
    href: '/blog?category=renovation',
  },
  {
    title: '看合同',
    desc: '口头承诺没写进合同等于没说过。付款节点不是财务细节——是你手里的筹码什么时候用完。',
    href: '/risk-dictionary',
  },
]

/* ── 免费工具 ── */
const tools = [
  { title: 'AI 居住诊断', desc: '还没定方案？先把生活方式和优先级捋清楚。', href: '/living-diagnosis', cta: '开始诊断' },
  { title: '报价初筛', desc: '手里有报价单？2 分钟扫一眼有没有明显雷。', href: '/tools/quote-check', cta: '免费初筛' },
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
          description: '17 年工地经验提炼的装修判断方法。不是教程——是怎么看报价、判断施工和避开常见坑。',
          inLanguage: 'zh-CN',
        }]}
      />

      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden border-b border-border bg-ink">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(222,210,190,0.18),transparent_45%)]" aria-hidden />
        <Container size="content" className="relative py-16 sm:py-20 lg:py-24">
          <p className="text-sm font-semibold text-white/55">装修视野</p>
          <h1 className="editorial-display mt-5 max-w-[14ch] text-[2.8rem] leading-[1.05] text-white sm:text-[4.2rem] lg:text-[5.2rem]">
            不是教你怎么装——<br />是帮你怎么判断。
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            17 年工地经验。做过施工、谈过报价、处理过无数预算纠纷。不卖装修——把判断方法摊开来给你，你自己用。
            拿不准了，再来聊。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CTA href="/tools" label="先用免费工具 →" variant="primary" />
            <p className="self-center text-sm text-white/50">装修是重决策——不标价，不急接。</p>
          </div>
        </Container>
      </section>

      <Container size="content" className="py-16 sm:py-20">

        {/* ── 判断什么 ── */}
        <section>
          <p className="text-sm font-semibold text-stone">装修判断三件事</p>
          <h2 className="editorial-display mt-4 text-[2.2rem] leading-[1.12] sm:text-[3rem]">
            不在工地盯 17 年，也能知道该看哪里。
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
              <h3 className="text-sm font-semibold text-ink">17 年在现场</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">不是从教程里学来的。水电、防水、贴砖、竣工——每个节点都在工地盯过。知道哪里会出问题，因为见过。</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink">不卖施工，不推荐工长</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">我的立场和你的利益一致。只做判断——帮你看清报价和施工质量，不从中拿回扣。</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink">不是内容创作者——是实践者</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">每篇装修文章背后都是一个真实案例或一段真实经历。不写我没有验证过的东西。</p>
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
            加微信，备注「装修」。把你的情况说一下——城市、面积、装修阶段。
            装修是重决策，不标价，不接急单。先聊聊，看能不能帮到你。
          </p>
          <CTA href="/contact" label="联系我 →" variant="primary" />
        </section>

      </Container>
    </>
  )
}
