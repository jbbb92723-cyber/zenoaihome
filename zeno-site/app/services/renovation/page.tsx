import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import StructuredData from '@/components/StructuredData'
import { getServiceBySlug } from '@/data/services'

export const metadata: Metadata = {
  title: '装修前居住判断与签约风险服务｜ZenoAIHome',
  description:
    'ZenoAIHome 提供居住需求洞察、报价风险初查、标准报价快审和签约前深度判断，帮助你在装修前看清生活方式、预算取舍和签约风险。',
  alternates: {
    canonical: 'https://zenoaihome.com/services/renovation',
  },
}

const serviceSlugs = ['living-insight-beta', 'quote-entry', 'quote-standard', 'quote-deep']
const renovationServices = serviceSlugs
  .map((slug) => getServiceBySlug(slug))
  .filter((service): service is NonNullable<ReturnType<typeof getServiceBySlug>> => Boolean(service))

const choiceCards = [
  {
    label: '需求还没想清',
    title: 'AI 居住诊断 + 需求洞察报告',
    description: '先看生活方式、空间秩序、审美偏好和预算取舍，不要急着定方案。',
    href: '/living-diagnosis',
    action: '先做居住诊断',
  },
  {
    label: '已经拿到报价',
    title: '免费报价初筛 + 检查模板',
    description: '先看报价材料是否完整，再决定是否需要人工判断。',
    href: '/tools/quote-check',
    action: '先做报价初筛',
  },
  {
    label: '只有几行重点报价',
    title: '¥99 报价风险初查',
    description: '适合刚拿到报价，只想先看明显风险。重点是 3 个高风险点和 5 个追问问题。',
    href: '#quote-entry',
    action: '看 ¥99 初查',
  },
  {
    label: '有完整报价准备谈',
    title: '¥299 标准报价快审',
    description: '适合已有完整报价，准备继续谈或签约。重点是漏项、模糊项、增项口子和追问清单。',
    href: '#quote-standard',
    action: '看 ¥299 快审',
  },
  {
    label: '快签合同且有草稿',
    title: '¥699 签约前深度判断',
    description: '适合报价、合同、付款节点都已经有，且临近签约。一起看清签字前风险。',
    href: '#quote-deep',
    action: '看 ¥699 深度判断',
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
  '家庭成员和生活场景',
  '户型图 / 面积 / 城市',
  '审美参考或关键词',
  '预算范围和已知取舍',
  '报价单 Excel / PDF / 截图（如有）',
  '是否准备签约',
  '合同草稿 / 付款节点截图',
  '你现在最担心的问题',
]

const faqs = [
  {
    question: '我没有报价能不能买服务？',
    answer:
      '可以先做 AI 居住诊断，必要时再进入《居住需求洞察报告 Beta》。但不建议购买报价复核类服务，因为没有报价时很难判断漏项、模糊项和合同边界。',
  },
  {
    question: '居住需求洞察报告和设计方案有什么区别？',
    answer:
      '洞察报告不出施工图、效果图和材料清单，它先帮你把生活方式、空间优先级、审美偏好和预算取舍讲清楚，作为后续做方案或审报价的判断基础。',
  },
  {
    question: '¥99 和 ¥299 区别是什么？',
    answer:
      '¥99 看 10 行以内重点报价，适合先判断有没有明显风险。¥299 看完整报价，重点找漏项、模糊项、增项口子和签约前追问清单。',
  },
  {
    question: '¥299 和 ¥699 区别是什么？',
    answer:
      '¥299 主要看完整报价本身。¥699 会把报价、合同草稿和付款节点放在一起看，并附 30 分钟微信语音解读，适合已经快签约的人。',
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
            name: '装修前居住判断与签约风险服务',
            url: 'https://zenoaihome.com/services/renovation',
            description: '装修前梳理居住需求、空间优先级、预算取舍，并在签约前检查装修报价、合同和付款节点中的风险。',
            inLanguage: 'zh-CN',
            provider: {
              '@type': 'Organization',
              name: 'ZenoAIHome',
              url: 'https://zenoaihome.com',
            },
            serviceType: '装修前居住需求洞察与签约风险判断',
            areaServed: '中国',
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: '居住需求洞察与签约前风险判断服务',
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
            <p className="page-label mb-4">居住判断与签约风险</p>
            <h1 className="text-[2.1rem] font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
              装修前居住判断与签约风险服务
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-ink-muted sm:text-lg">
              服务分成三条线：先做居住需求洞察，再做报价风险快审，临近签约时把合同和付款节点一起判断。不是帮你砍价，也不是替你选装修公司，而是帮你看清需求、预算和边界。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CTA href="/living-diagnosis" label="先做 AI 居住诊断" variant="primary" />
              <CTA href="/tools/quote-check" label="已有报价，先初筛" variant="secondary" />
              <CTA href="#pricing" label="直接看服务" variant="secondary" />
            </div>
          </div>
        </Container>
      </section>

      <Container size="layout" className="py-section">
        <section className="mb-14 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">服务定义</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">服务现在分三段：居住需求洞察、报价风险快审、签约前深度判断。</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="border border-border bg-surface p-5">
              <h3 className="text-base font-semibold text-ink">适合</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-muted">
                <li>还没定方案，但想先看清生活方式和空间优先级的人。</li>
                <li>攒了很多灵感图，却说不清长期审美偏好的人。</li>
                <li>已经拿到装修报价，准备继续谈或签约的人。</li>
                <li>看不懂报价里的漏项、暂估、按实结算的人。</li>
                <li>担心口头承诺、付款节点和材料边界没有写进合同的人。</li>
              </ul>
            </div>
            <div className="border border-border bg-surface p-5">
              <h3 className="text-base font-semibold text-ink">不适合</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-muted">
                <li>只想要效果图、施工图或材料清单的人。</li>
                <li>希望别人替你砍价的人。</li>
                <li>希望我替你决定签哪家公司的人。</li>
                <li>已经开工并进入施工纠纷处理阶段的人。</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-14">
          <div className="mb-6 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">选择路径</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">先看报价材料完整到哪一步，再决定要不要人工判断。</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">四项服务</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">前期先看需求，后期再看报价和合同。</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              不是把服务做复杂，而是把入口讲清楚：需求没想清先做洞察报告，重点报价先初查，完整报价做快审，快签约再把合同和付款节点一起看。
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
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
              <h2 className="mt-3 text-xl font-semibold text-ink">还没想清怎么住，先诊断；已经有报价，先初筛。</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
                如果诊断显示需求还没定型，先做居住需求洞察；如果报价初筛显示高风险，再进入对应人工服务。这样不会一上来买错，也能先把真正该问的问题找出来。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <CTA href="/living-diagnosis" label="先做 AI 居住诊断" variant="primary" />
              <CTA href="/tools/quote-check" label="已有报价，先初筛" variant="secondary" />
              <CTA href="/risk-dictionary" label="查风险词典" variant="secondary" />
            </div>
          </div>
        </section>
      </Container>
    </>
  )
}
