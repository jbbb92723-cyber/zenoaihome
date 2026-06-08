import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getServiceBySlug } from '@/data/services'
import PageHero from '@/components/ui/PageHero'
import Container from '@/components/ui/Container'
import CTA from '@/components/ui/CTA'
import ServiceCard from '@/components/features/services/ServiceCard'
import ServiceRequestForm from '@/components/features/services/ServiceRequestForm'
import StructuredData from '@/components/ui/StructuredData'
import CommercialLadder from '@/components/features/services/CommercialLadder'
import { serviceLadder } from '@/data/services/commercial-ladder'

export const metadata: Metadata = {
  title: '服务路径 | 居住决策支持、报价合同快审与综合判断',
  description:
    'ZenoAIHome 服务路径。按你当前最需要判断的层级选择：免费报价风险初筛、报价/合同快审、居住方案与报价合同交付风险综合判断。',
  alternates: {
    canonical: 'https://zenoaihome.com/services',
  },
}

const serviceRelatedArticles: Record<string, { label: string; href: string }[]> = {
  'living-insight-beta': [
    { label: 'AI 居住诊断', href: '/living-diagnosis' },
    { label: '方法与资料', href: '/resources' },
    { label: '案例复盘', href: '/cases' },
  ],
  'quote-entry': [
    { label: '装修报价风险词典', href: '/risk-dictionary' },
    { label: '签约前检查模板', href: '/checklists' },
    { label: '施工项目风险库', href: '/project-risks' },
  ],
  'quote-standard': [
    { label: '装修报价风险词典', href: '/risk-dictionary' },
    { label: '合同签约前检查模板', href: '/checklists/contract-pre-signing-check' },
    { label: '付款节点检查模板', href: '/checklists/payment-milestone-check' },
  ],
  'quote-deep': [
    { label: 'AI 居住诊断', href: '/living-diagnosis' },
    { label: '案例复盘', href: '/cases' },
    { label: '签约前检查模板', href: '/checklists' },
  ],
}

const coreServiceSlugs = ['living-insight-beta', 'quote-entry', 'quote-standard', 'quote-deep']
const quoteServiceSlugs = ['quote-entry', 'quote-standard', 'quote-deep']

const decisionTracks = [
  {
    label: '免费 / 还没定方向',
    title: '先用 AI 居住诊断和报价初筛，把问题缩小。',
    description: '适合还没想清生活方式、美学偏好、空间优先级，或刚拿到报价只想先看明显边界的人。',
    href: '/living-diagnosis',
    cta: '开始免费诊断',
    image: '/images/services/renovation-judgment-proof.svg',
  },
  {
    label: '轻服务 / 已经拿到材料',
    title: '报价 / 合同快审：看哪份更稳，哪些承诺必须落字。',
    description: '适合已经比较 2-3 家装修公司，有完整报价、合同草稿或付款节点，准备继续谈或签约的人。',
    href: '/services#quote-standard',
    cta: '看快审服务',
  },
  {
    label: '深服务 / 方案也要一起看',
    title: '居住方案综合判断：把美学、生活、预算、报价、合同和交付放在一起看。',
    description: '适合不只是怕被坑，还想判断方案是否适合家庭结构、生活方式、审美偏好、预算能力和长期居住的人。',
    href: '/services#quote-deep',
    cta: '看综合判断',
  },
]

const serviceFaqs = [
  {
    question: '为什么服务页不只讲报价？',
    answer:
      '因为很多装修后悔不是报价阶段才出现的，而是在美学取舍、生活方式、空间场景和预算边界还没说清时就埋下了。报价风险重要，但它应该承接前面的生活目标。',
  },
  {
    question: '报价风险判断还保留吗？',
    answer:
      '保留，而且仍然是临近签约用户的关键入口。新主线不是放弃报价风险，而是把它放回正确位置：判断报价、合同和交付边界能不能承接这套生活方案。',
  },
  {
    question: '什么时候更适合先用工具，而不是直接找我？',
    answer:
      '还没有完整材料，或者只是感觉有问题但说不清时，先用 AI 居住诊断或报价初筛把问题缩小。带着诊断结果、报价截图或合同草稿来问，比空着手咨询更有效。',
  },
  {
    question: 'AI 会不会替我做最终决定？',
    answer:
      '不会。AI 用来整理信息、提出追问和生成初步判断，最终风格、预算投入、施工方选择和签约决定必须由你自己决定，必要时由人工复核辅助。',
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
            name: '居住决策支持、报价合同快审与综合判断服务路径',
            url: 'https://zenoaihome.com/services',
            description: '围绕装修前美学与生活方式、空间方案、预算边界、报价合同和交付风险判断的服务路径。',
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
        label="服务路径"
        title="你现在最需要判断的是哪一层？"
        subtitle="ZenoAIHome 把服务分成三层：免费工具先帮你缩小问题；轻服务看报价、合同和预算边界；深服务把居住方案、报价、合同和交付风险放在一起判断。"
        note="不急着买服务，先看清你卡在哪一层。"
        size="content"
      />

      <Container size="content" className="py-section">
        <section className="mb-14 grid gap-5 lg:grid-cols-[1.18fr_0.82fr]">
          <div className="overflow-hidden border border-border bg-surface">
            <div className="relative aspect-[16/10] border-b border-border bg-stone-pale/30">
              <Image
                src={decisionTracks[0].image ?? '/images/services/renovation-judgment-proof.svg'}
                alt="居住决策支持服务示意图"
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
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-faint">居住决策支持路径</p>
          <h2 className="mb-3 text-lg font-semibold text-ink">这不是一串报价服务，而是从生活目标到签约交付的判断路径。</h2>
          <p className="mb-6 max-w-3xl text-sm leading-relaxed text-ink-muted">
            免费 AI 居住诊断和报价初筛负责先分流；399-599 元居住需求洞察报告负责把美学、生活方式、空间优先级和预算取舍整理清楚；报价 / 合同快审负责签约前边界；居住方案综合判断负责把方案、预算、报价、合同和交付风险放在一起看。
          </p>

          <div className="grid gap-8 lg:grid-cols-[2fr_0.9fr]">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone">核心付费服务</p>
              <CommercialLadder variant="full" rungs={serviceLadder} />
              <div className="mt-4 border border-border bg-surface p-4 text-sm leading-relaxed text-ink-muted">
                如果还没定方案，优先看居住需求洞察报告；如果已经临近签约，再按报价、合同、付款节点和方案材料完整度选择快审或综合判断。
              </div>
            </div>

            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone">怎么选</p>
              <div className="grid gap-3">
                {[
                  [
                    livingInsightService ? `${livingInsightService.price} ${livingInsightService.title}` : '399-599 元 居住需求洞察报告',
                    '还没定方案，先把生活方式、空间优先级、审美偏好和预算边界说清。',
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
          <p className="mb-6 text-sm leading-relaxed text-ink-muted">以下是脱敏样张。居住判断会输出需求和取舍清单；报价合同服务会基于你真实材料生成风险、追问和沟通文件。</p>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            {[
              { src: '/images/services/sample-risk-report.svg', label: '判断报告', desc: '方案适配 + 报价边界 + 合同交付风险' },
              { src: '/images/services/sample-followup-checklist.svg', label: '追问清单', desc: '逐项列出签约前该问清的具体问题' },
              { src: '/images/services/sample-communication-script.svg', label: '沟通文字', desc: '可以发给设计师、装修公司或施工方的确认文字' },
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
              ['服务交付', '美学取舍、居住需求、预算边界、报价风险、合同追问和交付提醒，最后都要落到一份能执行的清单。'],
              ['AI 辅助边界', 'AI 可以整理信息和生成清单，但不替你决定风格、施工方或能不能签。'],
              ['工作方式', '先看材料，再给书面建议；复杂情况再配微信或语音解读。'],
              ['明确不做', '不代砍价、不代施工、不做法律审查，不制造业主与装修公司的对立，也不替你做最终签约决定。'],
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
