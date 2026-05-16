import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import ServiceCard from '@/components/ServiceCard'
import StructuredData from '@/components/StructuredData'
import { getServiceBySlug } from '@/data/services'

export const metadata: Metadata = {
  title: '装修签约前判断服务 | 报价快审、预算取舍诊断、决策包怎么选',
  description:
    '装修签约前判断服务入口。按你的材料和阶段选择：免费报价初筛、¥39 指南、¥399 预算取舍诊断、¥699 报价快审或 ¥1499 签约前决策包。',
  alternates: {
    canonical: 'https://zenoaihome.com/services/renovation',
  },
}

const renovationSlugs = ['baojia-shenhe', 'qianyue-qian-juece-bao', 'yusuan-zixun', 'shi-zhu-pai-zhuangxiu']

const routeCards = [
  {
    label: '还没拿到完整报价',
    title: '先不要买人工服务',
    desc: '先用免费初筛、报价审核清单和 ¥39 指南，把你要看的内容补齐。',
    href: '/tools/quote-check',
    action: '先做免费初筛',
  },
  {
    label: '报价看不懂',
    title: '选 ¥699 报价风险快审',
    desc: '你已经有报价单，想知道漏项、模糊项、异常单价和增项口子在哪里。',
    href: '#baojia-shenhe',
    action: '看快审边界',
  },
  {
    label: '预算越算越乱',
    title: '选 ¥399 预算取舍诊断',
    desc: '你还没到逐行看报价的阶段，核心问题是哪些钱不能砍、哪些可以晚点买。',
    href: '#yusuan-zixun',
    action: '看取舍诊断',
  },
  {
    label: '马上要签约',
    title: '选 ¥1499 签约前决策包',
    desc: '报价、预算、合同、付款节点和追问顺序都要一起看，适合临近签字。',
    href: '#qianyue-qian-juece-bao',
    action: '看决策包',
  },
]

const priceLadder = [
  {
    price: '免费',
    title: '报价初筛工具',
    desc: '先知道报价里哪些没写清。',
    href: '/tools/quote-check',
  },
  {
    price: '¥39',
    title: '报价避坑指南',
    desc: '自己系统补一遍报价、合同和增项常识。',
    href: '/pricing/baojia-guide',
  },
  {
    price: '¥399',
    title: '预算取舍诊断',
    desc: '预算总数有了，但不知道哪里该守、哪里该放。',
    href: '#yusuan-zixun',
  },
  {
    price: '¥699',
    title: '报价风险快审',
    desc: '拿着一份报价，快速找出重点风险。',
    href: '#baojia-shenhe',
  },
  {
    price: '¥1499',
    title: '签约前决策包',
    desc: '报价、预算、合同和付款节点一次看全。',
    href: '#qianyue-qian-juece-bao',
  },
]

const comparisonRows = [
  ['你手里有什么', '一份或多份报价单', '报价单、合同草稿、付款节点、预算上限'],
  ['主要解决什么', '先找出报价里的明显风险和追问点', '把签约前的风险、顺序和取舍一次理清'],
  ['适合什么阶段', '还在比较报价，想快速判断重点', '临近签约，已经进入最终决策'],
  ['交付重点', '报价风险说明 + 追问清单', '风险判断 + 合同追问 + 预算校准 + 解读'],
]

const materialChecklist = [
  '报价单 Excel、PDF 或截图',
  '房屋面积、城市、户型和装修方式',
  '施工方类型：装修公司、工长、设计工作室或熟人介绍',
  '合同草稿、付款节点或关键条款截图',
  '你的预算上限，以及现在最担心的问题',
]

const relatedArticles: Record<string, { label: string; href: string }[]> = {
  'baojia-shenhe': [
    { label: '装修预算为什么总超？', href: '/blog/zhuangxiu-yusuan-weishenme-zongchao' },
    { label: '从工地看世界', href: '/blog/03-cong-gongdi-kan-shijie' },
  ],
  'qianyue-qian-juece-bao': [
    { label: '装修预算为什么总超？', href: '/blog/zhuangxiu-yusuan-weishenme-zongchao' },
    { label: '报价避坑完整指南', href: '/pricing/baojia-guide' },
    { label: '家不是样板间', href: '/blog/02-jia-bu-shi-yangban-jian' },
  ],
  'yusuan-zixun': [
    { label: '装修预算为什么总超？', href: '/blog/zhuangxiu-yusuan-weishenme-zongchao' },
    { label: '长期主义不是忍耐', href: '/blog/05-changqi-zhuyi-bushi-rennai' },
  ],
  'shi-zhu-pai-zhuangxiu': [
    { label: '家不是样板间', href: '/blog/02-jia-bu-shi-yangban-jian' },
    { label: '我为什么不想只做一个教人装修的人', href: '/blog/01-wo-wei-shenme-bu-xiang-zhi-zuo-jiaoren-zhuangxiu' },
  ],
}

const faqs = [
  {
    question: '什么时候该直接把报价发我，而不是继续自己看？',
    answer:
      '当你已经临近签约、对比了几轮仍分不出风险差异，或者你已经发现问题但不知道该怎么追问时，直接进入人工判断会更省时间。',
  },
  {
    question: '预算取舍诊断和报价风险快审有什么区别？',
    answer:
      '报价风险快审是在你拿到具体报价单之后，看漏项、模糊项和风险边界。预算取舍诊断是在报价前或报价混乱时，先判断哪些钱不能砍、哪些可以晚点买。',
  },
  {
    question: '报价风险快审和签约前决策包有什么区别？',
    answer:
      '快审更适合“我手里已经有报价单，想尽快知道关键风险”。决策包适合“我快要签了，想把报价、预算、合同和追问顺序一次理清”。',
  },
  {
    question: '居住场景装修服务为什么放在后面？',
    answer:
      '当前主线是签约前报价判断。居住场景服务适合南宁本地、重视长期使用体验的项目，不是人人需要。',
  },
]

export default function RenovationServicesPage() {
  const renovationServices = renovationSlugs
    .map((slug) => getServiceBySlug(slug))
    .filter((service): service is NonNullable<ReturnType<typeof getServiceBySlug>> => Boolean(service))

  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: '装修签约前判断服务',
            url: 'https://zenoaihome.com/services/renovation',
            description: '按材料和签约阶段选择报价快审、预算取舍诊断或签约前决策包。',
            inLanguage: 'zh-CN',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          },
        ]}
      />

      <section className="border-b border-border bg-surface-warm">
        <Container size="layout" className="py-14 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.62fr_0.38fr] lg:items-center">
            <div className="min-w-0">
              <p className="page-label mb-4">装修签约前判断服务</p>
              <h1 className="max-w-[22rem] text-[2.1rem] font-semibold leading-tight tracking-tight text-ink sm:max-w-4xl sm:text-5xl">
                别急着买服务，先分清你卡在哪一步。
              </h1>
              <p className="mt-5 max-w-[24rem] text-base leading-relaxed text-ink-muted sm:max-w-2xl sm:text-lg">
                普通业主最容易在签约前被总价、优惠和口头承诺带跑。这里先把免费工具、低价指南、预算取舍诊断、报价快审和决策包分清楚。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CTA href="/tools/quote-check" label="先做免费报价初筛" variant="primary" />
                <CTA href="#choose" label="直接看怎么选" variant="secondary" />
              </div>
            </div>

            <div className="border border-border bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone">这页只解决一个问题</p>
              <h2 className="mt-3 text-xl font-semibold leading-snug text-ink">签约前，我到底该买哪一档判断？</h2>
              <div className="mt-5 grid gap-3">
                {['没有材料，先不要买服务', '只有报价，看 ¥699 快审', '预算取舍乱，看 ¥399 诊断', '马上签约，看 ¥1499 决策包'].map((item) => (
                  <div key={item} className="border border-border bg-canvas px-4 py-3 text-sm font-medium text-ink">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container size="layout" className="py-section">
        <section id="choose" className="mb-14 scroll-mt-24">
          <div className="mb-6 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">先选你现在的状态</p>
            <h2 className="mt-3 max-w-full text-[1.35rem] font-semibold leading-snug tracking-tight text-ink sm:text-2xl">
              不是越贵越好，是看你现在有没有材料、有没有临近签约。
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {routeCards.map((item) => (
              <Link key={item.title} href={item.href} className="group flex min-h-[15rem] min-w-0 flex-col border border-border bg-surface p-5 transition-all duration-150 hover:-translate-y-1 hover:border-stone hover:shadow-[0_18px_46px_rgba(42,39,35,0.07)]">
                <p className="text-[0.68rem] font-semibold uppercase tracking-widest text-stone">{item.label}</p>
                <h3 className="mt-3 text-lg font-semibold leading-snug text-ink [overflow-wrap:anywhere]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.desc}</p>
                <span className="mt-auto pt-5 text-sm font-semibold text-stone">{item.action} -&gt;</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-14 border border-stone/30 bg-stone/5 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">快速选择</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">你现在该走哪一步？</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-stone/20 text-xs uppercase tracking-widest text-ink-faint">
                  <th className="py-3 pr-4 font-semibold">你的情况</th>
                  <th className="px-4 py-3 font-semibold">建议动作</th>
                  <th className="px-4 py-3 font-semibold">不要急着做什么</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['还没有完整报价', '先用免费报价初筛和清单补材料', '不要直接买人工服务'],
                  ['有报价，但看不懂风险', '看 ¥699 报价风险快审', '不要只拿总价比高低'],
                  ['预算总数混乱', '看 ¥399 预算取舍诊断', '不要先被材料档次带跑'],
                  ['马上要签合同', '看 ¥1499 签约前决策包', '不要只听口头承诺和限时优惠'],
                ].map(([situation, action, warning]) => (
                  <tr key={situation} className="border-b border-stone/20 last:border-b-0">
                    <th className="py-4 pr-4 font-semibold text-ink">{situation}</th>
                    <td className="px-4 py-4 text-ink-muted">{action}</td>
                    <td className="px-4 py-4 text-ink-muted">{warning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-14 border border-border bg-surface-warm p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone">价格梯子</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">先低门槛，再人工判断。</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                这不是把所有东西都卖给你。每一档只负责解决当前阶段最该解决的问题。
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {priceLadder.map((item) => (
                <Link key={item.title} href={item.href} className="border border-border bg-surface p-4 transition-colors hover:border-stone">
                  <p className="text-xs font-semibold uppercase tracking-widest text-stone">{item.price}</p>
                  <h3 className="mt-2 text-sm font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink-muted">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-14 grid gap-6 lg:grid-cols-[0.52fr_0.48fr]">
          <div className="overflow-hidden border border-border bg-surface">
            <div className="relative aspect-[16/10] border-b border-border bg-stone-pale/40">
              <Image
                src="/images/services/sample-risk-report.svg"
                alt="报价风险报告脱敏样张"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
            </div>
            <div className="p-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-stone">样张 1 / 报价风险报告</p>
              <p className="text-sm leading-relaxed text-ink-muted">
                你提交报价单后会收到的第一份文件。包含风险等级、漏项、模糊项、异常单价和追问建议。
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="overflow-hidden border border-border bg-surface">
              <div className="relative aspect-[16/7] border-b border-border bg-stone-pale/40">
                <Image
                  src="/images/services/sample-followup-checklist.svg"
                  alt="签约前追问清单脱敏样张"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 480px"
                />
              </div>
              <div className="p-5">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-stone">样张 2 / 追问清单</p>
                <p className="text-xs leading-relaxed text-ink-muted">
                  基于风险报告生成，逐项列出你该问施工方的具体问题。
                </p>
              </div>
            </div>
            <div className="overflow-hidden border border-border bg-surface">
              <div className="relative aspect-[16/7] border-b border-border bg-stone-pale/40">
                <Image
                  src="/images/services/sample-communication-script.svg"
                  alt="话术示例脱敏样张"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 480px"
                />
              </div>
              <div className="p-5">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-stone">样张 3 / 话术示例</p>
                <p className="text-xs leading-relaxed text-ink-muted">
                  可以直接发给装修公司的追问话术，不用暴露来源。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-14">
          <div className="border border-border bg-surface p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">快审还是决策包</p>
            <h2 className="mt-3 text-xl font-semibold text-ink">¥699 和 ¥1499 的区别，不是时间长短。</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-widest text-ink-faint">
                    <th className="py-3 pr-4 font-semibold">判断点</th>
                    <th className="px-4 py-3 font-semibold">¥699 快审</th>
                    <th className="px-4 py-3 font-semibold">¥1499 决策包</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map(([label, quick, pack]) => (
                    <tr key={label} className="border-b border-border last:border-b-0">
                      <th className="py-4 pr-4 text-xs font-semibold uppercase tracking-widest text-stone">{label}</th>
                      <td className="px-4 py-4 text-ink-muted">{quick}</td>
                      <td className="px-4 py-4 text-ink-muted">{pack}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mb-14 grid gap-6 lg:grid-cols-[0.44fr_0.56fr]">
          <div className="border border-border bg-surface-warm p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">提交前先准备</p>
            <h2 className="mt-3 text-xl font-semibold text-ink">材料越具体，判断越省时间。</h2>
            <ul className="mt-6 space-y-3">
              {materialChecklist.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-ink-muted">
                  <span className="mt-1 text-stone">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['适合买服务', '已经有报价或合同材料，且一两周内要继续谈或签。'],
              ['先别买服务', '只有想法，没有报价、合同、预算或户型信息。'],
              ['适合买低价指南', '你想先自己看懂报价、合同、预算和增项逻辑。'],
              ['适合买决策包', '报价、预算、合同、付款节点一起乱，单看报价已经不够。'],
            ].map(([title, desc]) => (
              <div key={title} className="border border-border bg-surface p-5">
                <p className="text-sm font-semibold text-ink">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">服务明细</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">每项服务解决什么、需要什么、交付什么。</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">每一档服务对应一个判断阶段，下面括号里的链接是它在「装修判断」里所在的位置。</p>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { slug: 'baojia-shenhe',           name: '帮你审报价',     stage: '02 再看钱',   href: '/start/budget' },
            { slug: 'yusuan-zixun',            name: '帮你定预算',     stage: '02 再看钱',   href: '/start/budget' },
            { slug: 'qianyue-qian-juece-bao',  name: '帮你过签约这一关', stage: '03 再看合同', href: '/start/contract' },
            { slug: 'shi-zhu-pai-zhuangxiu',   name: '帮你做整套居住判断', stage: '06 再看居住', href: '/start/living' },
          ].map((item) => (
            <a
              key={item.slug}
              href={`#${item.slug}`}
              className="border border-border bg-surface p-4 text-sm hover:border-stone"
            >
              <p className="font-semibold text-ink">{item.name}</p>
              <p className="mt-2 text-xs text-stone">
                对应阶段：
                <Link href={item.href} className="underline underline-offset-2 hover:text-stone-deep">
                  {item.stage}
                </Link>
              </p>
            </a>
          ))}
        </div>

        <div className="space-y-10">
          {renovationServices.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              relatedArticles={relatedArticles[service.slug]}
            />
          ))}
        </div>

        {/* ── 下单后流程 ── */}
        <section className="mt-14 mb-14 border-y-2 border-[#9a5424] bg-[#fbf3e9] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#9a5424]">下单后会发生什么</p>
          <h2 className="mt-3 text-xl font-semibold text-ink">服务流程一共 6 步，每步你都知道在等什么。</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { step: '01', title: '提交材料', desc: '报价单、合同草稿、户型信息或预算上限，放网盘链接或截图。' },
              { step: '02', title: '我先判断适不适合接', desc: '如果你的情况不在服务范围，会直接告诉你，不收费。' },
              { step: '03', title: '确认档位和付款', desc: '按你的材料和阶段确认服务档位，付款后启动。' },
              { step: '04', title: '输出书面风险说明', desc: '报价风险、追问清单、预算校准或合同建议，全部文字交付。' },
              { step: '05', title: '必要时微信语音解读', desc: '文字说不清的部分，30 分钟内语音补充。' },
              { step: '06', title: '你拿清单回去确认', desc: '拿追问清单和风险说明，回去和施工方逐项确认。' },
            ].map((item) => (
              <div key={item.step} className="border border-[#d4a574]/40 bg-white/70 p-5">
                <p className="text-2xl font-bold text-[#9a5424]/30">{item.step}</p>
                <p className="mt-2 text-sm font-semibold text-ink">{item.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.95fr]">
          <div className="border border-border bg-surface p-6 sm:p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-faint">常见问题</p>
            <div className="space-y-5">
              {faqs.map((item) => (
                <div key={item.question}>
                  <h2 className="mb-2 text-base font-semibold text-ink">{item.question}</h2>
                  <p className="text-sm leading-relaxed text-ink-muted">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-border bg-surface-warm p-6 sm:p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-faint">下一步</p>
            <h2 className="mb-3 text-lg font-semibold text-ink">如果你已经接近签约</h2>
            <p className="mb-5 text-sm leading-relaxed text-ink-muted">
              先决定你是只需要“看清报价风险”，还是要把报价、预算、合同和追问顺序一起梳理。还不确定，就先回工具，不要硬买服务。
            </p>
            <div className="flex flex-wrap gap-3">
              <CTA href="#baojia-shenhe" label="看报价快审" variant="primary" />
              <CTA href="#qianyue-qian-juece-bao" label="看签约前决策包" variant="secondary" />
              <CTA href="/tools/quote-check" label="回报价初筛工具" variant="ghost" />
            </div>
          </div>
        </section>
      </Container>
    </>
  )
}
