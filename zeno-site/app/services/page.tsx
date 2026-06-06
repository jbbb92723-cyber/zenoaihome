import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getServiceBySlug } from '@/data/services'
import PageHero from '@/components/PageHero'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import ServiceCard from '@/components/ServiceCard'
import ServiceRequestForm from '@/components/services/ServiceRequestForm'
import StructuredData from '@/components/StructuredData'
import CommercialLadder from '@/components/CommercialLadder'
import { serviceLadder } from '@/data/commercial-ladder'

export const metadata: Metadata = {
  title: '服务价格 | AI 居住判断与签约前风险审查',
  description:
    'ZenoAIHome 服务价格页。先用 AI 居住诊断看清生活方式、空间秩序、审美偏好和预算取舍，再在临近签约时审查报价、合同和付款节点风险。',
  alternates: {
    canonical: 'https://zenoaihome.com/services',
  },
}

const serviceRelatedArticles: Record<string, { label: string; href: string }[]> = {
  'living-insight-beta': [
    { label: 'AI 居住诊断', href: '/living-diagnosis' },
    { label: '居住需求地图', href: '/resources' },
    { label: '案例复盘', href: '/cases' },
  ],
  'quote-entry': [
    { label: '装修报价风险词典', href: '/risk-dictionary' },
    { label: '签约前检查模板', href: '/checklists' },
    { label: '施工项目风险库', href: '/project-risks' },
  ],
  'quote-standard': [
    { label: '装修报价风险词典', href: '/risk-dictionary' },
    { label: '报价单初查模板', href: '/checklists/quote-initial-check' },
    { label: '水电报价风险', href: '/project-risks/water-electric-renovation' },
  ],
  'quote-deep': [
    { label: '合同签约前检查模板', href: '/checklists/contract-pre-signing-check' },
    { label: '付款节点检查模板', href: '/checklists/payment-milestone-check' },
    { label: '付款节点过前', href: '/risk-dictionary/payment-milestone-too-early' },
  ],
}

const coreServiceSlugs = ['living-insight-beta', 'quote-entry', 'quote-standard', 'quote-deep']
const quoteServiceSlugs = ['quote-entry', 'quote-standard', 'quote-deep']

const decisionTracks = [
  {
    label: '路径 A / 还没定方案',
    title: '先做 AI 居住诊断，再选择 399-599 元的居住需求洞察报告。',
    description: '适合已经开始认真规划，但生活方式、空间优先级、审美偏好和预算取舍还没说清的家庭。',
    href: '/living-diagnosis',
    cta: '开始诊断',
    image: '/images/services/ai-workflow-proof.svg',
  },
  {
    label: '路径 B / 已经拿到报价',
    title: '先用免费报价初筛，把漏项、模糊项和增项口子找出来。',
    description: '适合已经有报价材料，但还没判断报价边界、材料写法和付款节点是否清楚的人。',
    href: '/tools/quote-check',
    cta: '做报价初筛',
  },
  {
    label: '路径 C / 快要签约',
    title: '按材料完整度选择 ¥99 初查、¥299 快审或 ¥699 深度判断。',
    description: '适合报价、合同草稿或付款节点都已经在手，需要在签字前把关键风险问清的人。',
    href: '/services#quote-entry',
    cta: '看风险服务',
  },
]

const serviceFaqs = [
  {
    question: '为什么新增居住需求洞察报告？',
    answer:
      '因为很多装修后悔不是报价阶段才出现的，而是在生活方式、空间秩序、审美偏好和预算取舍还没说清时就埋下了。报告先帮你建立判断，再进入方案、报价或签约。',
  },
  {
    question: '报价风险判断还保留吗？',
    answer:
      '保留，而且仍然是临近签约用户的关键入口。新主线不是放弃报价风险，而是把它放回正确位置：先判断怎么住，再判断报价和合同能不能承接这个家。',
  },
  {
    question: '什么时候更适合先用工具，而不是直接找我？',
    answer:
      '还没有完整材料，或者只是感觉有问题但说不清时，先用 AI 居住诊断或报价初筛把问题缩小。带着判断结果来问，比空着手咨询更划算。',
  },
  {
    question: 'AI 会不会替我做最终决定？',
    answer:
      '不会。AI 用来整理信息、提出追问和生成初步判断，最终风格、预算投入、施工方选择和签约决定必须由你和人工复核一起完成。',
  },
]

export default function ServicesPage() {
  const coreServices = coreServiceSlugs
    .map((slug) => getServiceBySlug(slug))
    .filter((service): service is NonNullable<ReturnType<typeof getServiceBySlug>> => Boolean(service))
  const quoteServices = quoteServiceSlugs
    .map((slug) => getServiceBySlug(slug))
    .filter((service): service is NonNullable<ReturnType<typeof getServiceBySlug>> => Boolean(service))
  const livingInsightService = coreServices.find((service) => service.slug === 'living-insight-beta')

  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'AI 居住判断与签约前风险审查服务价格',
            url: 'https://zenoaihome.com/services',
            description: '围绕装修前居住需求洞察、报价、合同和付款节点风险判断的服务路径。',
            inLanguage: 'zh-CN',
            hasPart: coreServices.map((service) => ({
              '@type': 'Service',
              name: service.title,
              description: service.description,
              offers: {
                '@type': 'Offer',
                priceCurrency: 'CNY',
                price: service.price,
              },
              url: `https://zenoaihome.com/services#${service.slug}`,
            })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: serviceFaqs.map((item) => ({
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

      <PageHero
        label="服务价格"
        title="先做居住判断，再决定怎么装、花多少、能不能签。"
        subtitle="ZenoAIHome 把装修前的服务分成两条路：还没想清生活方式时，先做居住需求洞察；已经拿到报价合同后，再做签约前风险判断。"
        note="免费诊断先帮你分流，不急着买服务。"
        size="content"
      />

      <Container size="content" className="py-section">
        <section className="mb-14 grid gap-5 lg:grid-cols-[1.18fr_0.82fr]">
          <div className="overflow-hidden border border-border bg-surface">
            <div className="relative aspect-[16/10] border-b border-border bg-stone-pale/30">
              <Image
                src={decisionTracks[0].image ?? '/images/services/ai-workflow-proof.svg'}
                alt="AI 居住判断服务示意图"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 720px"
              />
            </div>
            <div className="p-6 sm:p-7">
              <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-widest text-stone">{decisionTracks[0].label}</p>
              <h2 className="mb-3 max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-ink">{decisionTracks[0].title}</h2>
              <p className="mb-5 max-w-2xl text-sm leading-relaxed text-ink-muted">{decisionTracks[0].description}</p>
              <CTA href={decisionTracks[0].href} label={decisionTracks[0].cta} variant="primary" />
            </div>
          </div>

          <div className="grid gap-5">
            {decisionTracks.slice(1).map((track, index) => (
              <Link key={track.title} href={track.href} className="group border border-border bg-surface p-6 transition-colors hover:border-stone hover:bg-surface-warm">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone">0{index + 1}</p>
                <h3 className="mt-3 text-lg font-semibold text-ink">{track.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{track.description}</p>
                <p className="mt-5 text-xs font-semibold text-stone">{track.cta} -&gt;</p>
              </Link>
            ))}
            <Link href="/risk-dictionary" className="group border border-border bg-surface p-6 transition-colors hover:border-stone hover:bg-surface-warm">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone">03</p>
              <h3 className="mt-3 text-lg font-semibold text-ink">先用风险资料补问题</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">风险词典、项目风险库和检查模板，帮你把要问施工方的问题变具体。</p>
              <p className="mt-5 text-xs font-semibold text-stone">看风险词典 -&gt;</p>
            </Link>
          </div>
        </section>

        <section className="mb-14 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-faint">主价格路径</p>
          <h2 className="mb-3 text-lg font-semibold text-ink">这不是一串报价服务，而是一条装修前判断路径。</h2>
          <p className="mb-6 max-w-3xl text-sm leading-relaxed text-ink-muted">
            免费 AI 居住诊断负责先分流；399-599 元居住需求洞察报告负责把生活方式、空间优先级、审美偏好和预算取舍整理清楚；已经拿到报价后，再用免费报价初筛和三档签约前风险判断看清报价、合同和付款节点。
          </p>

          <div className="grid gap-8 lg:grid-cols-[2fr_0.9fr]">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone">核心付费服务</p>
              <CommercialLadder variant="full" rungs={serviceLadder} />
              <div className="mt-4 border border-border bg-surface p-4 text-sm leading-relaxed text-ink-muted">
                如果还没定方案，优先选居住需求洞察报告；如果已经临近签约，再按报价、合同和付款节点材料完整度选择风险判断服务。
              </div>
            </div>

            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone">怎么选</p>
              <div className="grid gap-3">
                {[
                  [
                    livingInsightService ? `${livingInsightService.price} ${livingInsightService.title}` : '399-599 元 AI 居住需求洞察报告',
                    '还没定方案，先把生活方式、空间优先级、审美偏好和预算取舍说清。',
                  ],
                  ...quoteServices.map((service) => [`${service.price.replace(' 元 / 次', '').replace(' 元 / 份', '')} ${service.title}`, service.tagline] as const),
                ].map(([title, desc]) => (
                  <div key={title} className="border border-border bg-surface p-5">
                    <h3 className="text-base font-semibold text-ink">{title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-14 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-faint">可验证的交付</p>
          <p className="mb-6 text-sm leading-relaxed text-ink-muted">以下是脱敏样张。居住判断会输出需求和取舍清单；报价风险服务会基于你真实报价单生成完整版文件。</p>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            {[
              { src: '/images/services/sample-risk-report.svg', label: '报价风险报告', desc: '风险等级 + 漏项 + 模糊项 + 异常单价' },
              { src: '/images/services/sample-followup-checklist.svg', label: '追问清单', desc: '逐项列出签约前该问的具体问题' },
              { src: '/images/services/sample-communication-script.svg', label: '话术示例', desc: '可以直接发给施工方的追问话术' },
            ].map((item) => (
              <div key={item.label} className="overflow-hidden border border-border bg-surface">
                <Image src={item.src} alt={`${item.label}脱敏样张`} width={340} height={255} className="w-full object-cover" />
                <div className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-stone">{item.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['服务交付', '居住需求、预算取舍、报价风险、合同追问和付款节点提醒，最后都要落到一份能执行的清单。'],
              ['AI 辅助边界', 'AI 可以整理信息和生成清单，但不替你判断能不能签。'],
              ['工作方式', '先看材料，再给书面建议；复杂情况再配微信或语音解读。'],
              ['明确不做', '不代砍价、不代施工、不做法律审查，也不替你做最终签约决定。'],
            ].map(([title, desc]) => (
              <div key={title} className="border border-border bg-surface p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-faint">{title}</p>
                <p className="text-sm leading-relaxed text-ink">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-10">
          {coreServices.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              relatedArticles={serviceRelatedArticles[service.slug]}
            />
          ))}
        </div>

        <section id="service-form" className="mt-16 scroll-mt-24">
          <div className="mb-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-faint">提交资料</p>
            <h2 className="text-lg font-semibold text-ink">先把材料和问题说清楚，再决定是否适合进入服务</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
              这里是站内服务申请入口。暂不做站内文件上传，你可以先放网盘链接、报价单说明、户型信息；提交后会进入你的用户记录。
            </p>
          </div>
          <ServiceRequestForm services={coreServices} />
        </section>

        <div className="mt-12 border border-border p-6 sm:p-8">
          <p className="mb-3 text-sm leading-relaxed text-ink">我不接所有咨询，只接我能真正帮到的。</p>
          <p className="mb-6 text-sm leading-relaxed text-ink-muted">
            如果你的需求不在范围内，或读完之后觉得匹配度不高，不用勉强，风险词典和检查模板可能更适合你先用。
            如果读完觉得“好像说的就是我的问题”，可以发一条简短的背景说明，我会评估是否能帮到你。
          </p>
          <CTA href="/contact" label="查看联系方式" variant="secondary" />
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-5 border border-border bg-surface-warm p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="text-sm font-medium text-ink">还没想好？先从免费居住诊断和报价初筛开始。</p>
            <p className="mt-1 max-w-md text-xs text-ink-muted">
              AI 居住诊断、报价初筛、风险词典和检查模板都可以先用。先建立判断，再决定是否需要服务。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CTA href="/living-diagnosis" label="去居住诊断" variant="primary" />
            <CTA href="/tools/quote-check" label="去报价初筛" variant="secondary" />
          </div>
        </div>

        <div className="mt-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink-faint">常见问题</p>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {serviceFaqs.map((item) => (
              <div key={item.question} className="border border-border bg-surface p-5">
                <h2 className="mb-2 text-sm font-semibold text-ink">{item.question}</h2>
                <p className="text-xs leading-relaxed text-ink-muted">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  )
}
