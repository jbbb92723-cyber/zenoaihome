import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import StructuredData from '@/components/StructuredData'
import { getServiceBySlug } from '@/data/services'

export const metadata: Metadata = {
  title: '我手里的装修报价，现在该买哪一档判断？| ZenoAIHome',
  description:
    '装修签约前报价风险判断服务。先判断你现在适合免费初筛、¥99 体验版、¥299 标准版，还是 ¥699 深度版。',
  alternates: {
    canonical: 'https://zenoaihome.com/services/renovation',
  },
}

const serviceSlugs = ['quote-entry', 'quote-standard', 'quote-deep']
const renovationServices = serviceSlugs
  .map((slug) => getServiceBySlug(slug))
  .filter((service): service is NonNullable<ReturnType<typeof getServiceBySlug>> => Boolean(service))

const choiceCards = [
  {
    label: '还没完整报价',
    title: '免费初筛 + 检查模板',
    description: '先不要买人工服务。把报价、合同和付款节点材料补齐，再决定是否需要人工判断。',
    href: '/tools/quote-check',
    action: '先做免费初筛',
  },
  {
    label: '只有几行重点报价',
    title: '¥99 体验版',
    description: '适合先看明显风险，不做整份报价审查。重点是先知道这份报价有没有明显不清楚的地方。',
    href: '#quote-entry',
    action: '看 ¥99 初查',
  },
  {
    label: '有完整报价准备谈',
    title: '¥299 标准版',
    description: '适合已经拿到完整报价，准备继续谈或准备签约，需要系统看漏项、模糊项和增项口子。',
    href: '#quote-standard',
    action: '看 ¥299 快审',
  },
  {
    label: '快签合同且有合同草稿',
    title: '¥699 深度版',
    description: '适合报价、合同草稿和付款节点都已经有，临近签字前想把关键风险一次看清。',
    href: '#quote-deep',
    action: '看 ¥699 深度版',
  },
]

const sampleReports = [
  {
    src: '/images/services/sample-risk-report.svg',
    title: '报价风险报告',
    description: '把漏项、模糊项、增项口子和需要追问的地方整理出来。',
  },
  {
    src: '/images/services/sample-followup-checklist.svg',
    title: '签约前追问清单',
    description: '把你下一轮该问施工方的问题列清楚，避免只停留在“感觉不对”。',
  },
  {
    src: '/images/services/sample-communication-script.svg',
    title: '沟通话术示例',
    description: '把风险问题转成能直接发给对方确认的话，不制造对立。',
  },
]

const materialChecklist = [
  '报价单 Excel / PDF / 截图',
  '城市、面积、装修方式',
  '是否准备签约',
  '合同草稿 / 付款节点截图',
  '你现在最担心的问题',
]

const faqs = [
  {
    question: '我没有报价能不能买？',
    answer:
      '不建议买人工服务。没有报价时，人工判断很容易变成泛泛咨询。先用免费初筛、检查模板和风险词典，把报价材料补齐。',
  },
  {
    question: '¥99 和 ¥299 区别是什么？',
    answer:
      '¥99 只看 10 行以内重点报价，帮你先判断有没有明显风险。¥299 看完整报价，重点是漏项、模糊项、增项口子和签约前追问清单。',
  },
  {
    question: '¥299 和 ¥699 区别是什么？',
    answer:
      '¥299 主要看报价。¥699 适合快签前，把报价、合同草稿和付款节点一起看，并附 30 分钟微信语音解读。',
  },
  {
    question: '会不会替我砍价？',
    answer:
      '不会。这不是砍价服务，也不代谈判。服务重点是帮你看清哪些内容没说清、哪些地方需要签约前追问。',
  },
  {
    question: '能不能保证不被坑？',
    answer:
      '不能保证。装修是高变量交易，我能做的是把签约前能看到的报价风险、合同风险和付款节点风险尽量说清楚，最终决定仍由你自己做。',
  },
  {
    question: '结果能不能直接发给装修公司？',
    answer:
      '可以参考使用，但建议你只发追问清单和确认话术，不必把完整判断报告原样发给对方。重点是让对方把边界写清楚。',
  },
]

export default function RenovationServicesPage() {
  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: '装修签约前报价风险判断',
            url: 'https://zenoaihome.com/services/renovation',
            description: '帮助业主按报价材料完整度选择免费初筛、¥99 初查、¥299 快审或 ¥699 深度判断。',
            inLanguage: 'zh-CN',
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: '签约前报价判断三档服务',
              itemListElement: renovationServices.map((service) => ({
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: service.title,
                  description: service.description,
                },
                priceCurrency: 'CNY',
                price: service.price,
                url: `https://zenoaihome.com/services/renovation#${service.slug}`,
              })),
            },
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
          <div className="max-w-4xl">
            <p className="page-label mb-4">装修签约前报价判断</p>
            <h1 className="text-[2.1rem] font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
              我手里的装修报价，现在该买哪一档判断？
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-ink-muted sm:text-lg">
              如果你还没有完整报价，先不要买人工服务。先用免费初筛和检查模板。只有当你已经拿到报价、准备继续谈或临近签约时，再进入人工快审。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CTA href="/tools/quote-check" label="先做免费报价初筛" variant="primary" />
              <CTA href="#pricing" label="直接看三档服务" variant="secondary" />
            </div>
          </div>
        </Container>
      </section>

      <Container size="layout" className="py-section">
        <section className="mb-14">
          <div className="mb-6 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">选择路径</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">先看你手里有什么，再决定买哪一档。</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {choiceCards.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex min-h-[15rem] flex-col border border-border bg-surface p-5 transition-all duration-150 hover:-translate-y-1 hover:border-stone hover:shadow-[0_18px_46px_rgba(42,39,35,0.07)]"
              >
                <p className="text-[0.68rem] font-semibold uppercase tracking-widest text-stone">{item.label}</p>
                <h3 className="mt-3 text-lg font-semibold leading-snug text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.description}</p>
                <span className="mt-auto pt-5 text-sm font-semibold text-stone">{item.action} -&gt;</span>
              </Link>
            ))}
          </div>
        </section>

        <section id="pricing" className="mb-14 scroll-mt-24">
          <div className="mb-6 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">三档价格</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">只保留签约前报价判断三档。</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              每一档都对应一个真实阶段。不要为了“更全面”直接买高档，先看你的材料是否已经到那个阶段。
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {renovationServices.map((service, index) => (
              <article key={service.slug} id={service.slug} className="scroll-mt-24 border border-border bg-surface">
                <div className="border-b border-border bg-surface-warm p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-stone">0{index + 1}</p>
                      <h3 className="mt-2 text-xl font-semibold leading-snug text-ink">{service.title}</h3>
                    </div>
                    <p className="shrink-0 border border-stone/30 px-3 py-1 text-xs font-semibold text-stone">{service.price}</p>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{service.tagline}</p>
                </div>

                <div className="space-y-6 p-5">
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-faint">适合谁</p>
                    <ul className="space-y-2">
                      {service.forWho.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-ink">
                          <span className="mt-1 text-stone">+</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-faint">你需要提供什么</p>
                    <ul className="space-y-2">
                      {service.youProvide.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-ink-muted">
                          <span className="mt-1 text-stone">-</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-faint">我交付什么</p>
                    <ul className="space-y-2">
                      {service.iDeliver.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-ink">
                          <span className="mt-1 text-stone">-</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-l-2 border-stone-light pl-4">
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-ink-faint">边界是什么</p>
                    <p className="text-sm leading-relaxed text-ink-muted">{service.boundary}</p>
                  </div>
                </div>

                <div className="border-t border-border bg-stone-pale/20 p-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-faint">联系方式 / 下单提示</p>
                  <p className="text-sm leading-relaxed text-ink-muted">{service.contactNote}</p>
                  <Link
                    href={`/services?service=${service.slug}#service-form`}
                    className="mt-4 inline-flex h-10 items-center bg-stone px-4 text-sm font-semibold text-white transition-colors hover:bg-stone/90"
                  >
                    提交这档资料
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <div className="mb-6 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">报告样张</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">交付不是一句“有风险”，而是能拿去追问的清单。</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {sampleReports.map((item) => (
              <div key={item.title} className="overflow-hidden border border-border bg-surface">
                <div className="relative aspect-[16/10] border-b border-border bg-stone-pale/40">
                  <Image src={item.src} alt={`${item.title}脱敏样张`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 360px" />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14 grid gap-6 lg:grid-cols-[0.42fr_0.58fr]">
          <div className="border border-border bg-surface-warm p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">材料准备清单</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">发资料前，先把这些准备好。</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              材料越具体，判断越省时间。材料不完整时，先做免费初筛和检查模板，不要直接买人工服务。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {materialChecklist.map((item) => (
              <div key={item} className="border border-border bg-surface p-5 text-sm font-medium leading-relaxed text-ink">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <div className="mb-6 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">FAQ</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">先把服务边界说清楚。</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {faqs.map((item) => (
              <div key={item.question} className="border border-border bg-surface p-5">
                <h3 className="text-base font-semibold text-ink">{item.question}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-border bg-surface-warm p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone">下一步</p>
              <h2 className="mt-3 text-xl font-semibold text-ink">如果你已经有报价，先做免费初筛。</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
                如果结果显示高风险，再进入人工快审。这样不会一上来买错档，也能先把真正该问的问题找出来。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <CTA href="/tools/quote-check" label="先做免费报价初筛" variant="primary" />
              <CTA href="#pricing" label="看三档服务" variant="secondary" />
            </div>
          </div>
        </section>
      </Container>
    </>
  )
}
