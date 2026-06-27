import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getServiceBySlug } from '@/data/services'
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

const decisionLevels = [
  {
    code: '00',
    label: '还没定方向',
    title: '先判断生活方式、审美偏好和空间优先级',
    body: '适合刚开始认真规划装修，还没有完整方案、报价或合同的人。',
    output: 'AI 居住诊断 / 居住需求洞察报告',
    href: '/living-diagnosis',
    cta: '先做免费诊断',
  },
  {
    code: '01',
    label: '已经有初步方案',
    title: '看方案是否承接家庭结构、长期审美和预算边界',
    body: '适合有户型、灵感图或初步平面方案，但不确定取舍是否合理的人。',
    output: '居住需求洞察报告',
    href: '/services#living-insight-beta',
    cta: '看洞察报告',
  },
  {
    code: '02',
    label: '刚拿到报价',
    title: '先查明显漏项、模糊项和增项入口',
    body: '适合材料还不完整，但想快速知道这份报价是否值得继续谈的人。',
    output: '报价风险初筛 / 报价风险初查',
    href: '/tools/quote-check',
    cta: '先做报价初筛',
  },
  {
    code: '03',
    label: '准备继续谈或签约',
    title: '把报价、合同草稿和付款节点放在一起看',
    body: '适合已经比较 2-3 家，想知道哪份更稳、哪些承诺必须落字的人。',
    output: '报价 / 合同快审',
    href: '/services#quote-standard',
    cta: '看快审服务',
  },
  {
    code: '04',
    label: '方案也要一起判断',
    title: '把美学、生活、预算、报价、合同和交付风险合并判断',
    body: '适合临近签约，不只是想看风险，也想知道这套方案是否适合长期居住的人。',
    output: '居住方案综合判断',
    href: '/services#quote-deep',
    cta: '看综合判断',
  },
]

const deliverableSamples = [
  {
    src: '/images/services/sample-risk-report.svg',
    label: '判断报告',
    desc: '方案适配、报价边界、合同与交付风险放在同一份报告里。',
  },
  {
    src: '/images/services/sample-followup-checklist.svg',
    label: '追问清单',
    desc: '逐项列出签约前需要向设计师、装修公司或施工方确认的问题。',
  },
  {
    src: '/images/services/sample-communication-script.svg',
    label: '沟通文字',
    desc: '把难开口的问题整理成可以直接发送或复制调整的确认文字。',
  },
]

const boundaryItems = [
  ['服务交付', '美学取舍、居住需求、预算边界、报价风险、合同追问和交付提醒，最后都要落到一份能执行的清单。'],
  ['AI 辅助边界', 'AI 可以整理信息、提出追问和生成初稿，但复杂判断必须由人工复核。'],
  ['工作方式', '先看材料，再给书面建议；复杂情况再配微信或语音解读。'],
  ['明确不做', '不代砍价、不代施工、不做法律审查，不制造业主与装修公司的对立，也不替你做最终签约决定。'],
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

      <section className="relative isolate overflow-hidden border-b border-border bg-canvas system-grid">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(222,210,190,0.34),transparent_30%),linear-gradient(120deg,rgba(244,241,232,0.96),rgba(244,241,232,0.78))]" aria-hidden />
        <div className="relative mx-auto grid max-w-[1320px] gap-10 px-5 py-14 sm:px-8 lg:min-h-[calc(82dvh-64px)] lg:grid-cols-[0.92fr_1.08fr] lg:px-12 lg:py-16">
          <div className="flex flex-col justify-center">
            <p className="system-label">Service Decision Console</p>
            <h1 className="editorial-display mt-5 max-w-4xl text-[2.6rem] leading-[1.12] text-ink sm:text-[4.3rem] lg:text-[5rem]">
              你现在最需要判断的是哪一层？
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
              服务不是一串报价项目，而是按你的材料和决策阶段逐层判断：先看生活目标，再看空间和预算，最后看报价、合同和交付边界。
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <CTA href="/living-diagnosis" label="先做免费居住诊断" variant="primary" />
              <CTA href="/tools/quote-check" label="已有报价，先做初筛" variant="secondary" />
            </div>
            <p className="mt-6 max-w-xl text-sm leading-7 text-ink-faint">
              不急着购买服务。先确认你卡在方向、方案、报价、合同，还是交付风险。
            </p>
          </div>

          <div className="service-route-console p-4 sm:p-5">
            <div className="border border-border bg-surface/94 p-5 shadow-[0_28px_90px_rgba(17,17,17,0.1)] sm:p-6">
              <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-stone">Judgment Depth</p>
                  <h2 className="mt-2 text-2xl font-semibold text-ink">服务分层控制台</h2>
                </div>
                <div className="border border-stone-light px-3 py-2 text-right">
                  <p className="text-[0.62rem] uppercase tracking-[0.16em] text-ink-faint">mode</p>
                  <p className="text-sm font-semibold text-stone">签约前判断</p>
                </div>
              </div>

              <div className="mt-5 grid gap-2">
                {decisionLevels.map((level) => (
                  <Link
                    key={level.code}
                    href={level.href}
                    className="group grid gap-3 border border-border bg-canvas/84 p-4 transition-colors hover:border-stone hover:bg-surface sm:grid-cols-[auto_1fr_auto] sm:items-center"
                  >
                    <span className="flex h-9 w-9 items-center justify-center bg-ink text-xs font-semibold text-white">{level.code}</span>
                    <div>
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-stone">{level.label}</p>
                      <h3 className="mt-1 text-sm font-semibold leading-snug text-ink">{level.title}</h3>
                      <p className="mt-1 text-xs leading-5 text-ink-muted">{level.output}</p>
                    </div>
                    <span className="text-xs font-semibold text-stone transition-all group-hover:translate-x-1">{level.cta}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Container size="content" className="py-section">
        <section className="mb-16 grid gap-10 lg:grid-cols-[0.42fr_0.58fr]">
          <div>
            <p className="system-label">Layer Finder</p>
            <h2 className="editorial-display mt-4 text-3xl leading-[1.2] text-ink sm:text-4xl">
              先判断你卡在哪一层，再选服务。
            </h2>
            <p className="mt-4 text-sm leading-7 text-ink-muted">
              不是所有人都需要深服务。材料越少，越应该先用工具和低成本判断把问题缩小；材料越完整，越适合进入人工复核。
            </p>
          </div>

          <div className="grid gap-3">
            {decisionLevels.map((level) => (
              <Link
                key={level.code}
                href={level.href}
                className="group grid gap-4 border border-border bg-surface p-5 transition-colors hover:border-stone hover:bg-surface-warm sm:grid-cols-[auto_1fr_auto] sm:items-center"
              >
                <span className="text-xs font-semibold text-ink-faint">{level.code}</span>
                <div>
                  <p className="text-xs font-semibold tracking-[0.16em] text-stone">{level.label}</p>
                  <h3 className="mt-2 text-lg font-semibold leading-tight text-ink">{level.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-ink-muted">{level.body}</p>
                  <p className="mt-2 text-xs font-semibold text-stone">{level.output}</p>
                </div>
                <span className="text-xs font-semibold text-stone transition-all group-hover:translate-x-1">{level.cta}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-16 service-route-console p-4 sm:p-5">
          <div className="grid gap-8 border border-border bg-surface/94 p-5 sm:p-7 lg:grid-cols-[1.5fr_0.9fr]">
            <div>
              <p className="system-label">Core Services</p>
              <h2 className="editorial-display mt-3 text-2xl leading-tight text-ink">核心服务，是判断深度的递进。</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-muted">
                居住需求洞察报告负责把生活方式、空间优先级、审美偏好和预算边界说清；报价 / 合同服务负责签约前边界；综合判断负责把方案、预算、报价、合同和交付风险放在一起看。全部免费。
              </p>
              <CommercialLadder variant="instrument" rungs={serviceLadder} className="mt-6" />
            </div>

            <div className="border border-border bg-canvas p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone">提交服务前，请先准备</p>
              <div className="mt-5 grid gap-3">
                {[
                  ['生活材料', '家庭成员、日常场景、审美参考、预算范围'],
                  ['方案材料', '户型图、平面方案、核心设计说明'],
                  ['签约材料', '报价单、合同草稿、付款节点和销售承诺'],
                  ['你的问题', '最担心的 3 个问题，比“帮我看看”更有效'],
                ].map(([title, desc]) => (
                  <div key={title} className="border-l-2 border-stone-light pl-4">
                    <h3 className="text-sm font-semibold text-ink">{title}</h3>
                    <p className="mt-1 text-xs leading-5 text-ink-muted">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16 border border-border bg-surface-warm p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr]">
            <div>
              <p className="system-label">Deliverables</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-ink">交付物必须能拿去沟通，而不是停留在建议。</h2>
              <p className="mt-4 text-sm leading-7 text-ink-muted">
                居住判断会输出需求和取舍清单；报价合同服务会基于你真实材料生成风险、追问和沟通文件。
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {deliverableSamples.map((item) => (
                <div key={item.label} className="overflow-hidden border border-border bg-surface">
                  <Image src={item.src} alt={`${item.label}脱敏样张`} width={340} height={255} className="w-full object-cover" />
                  <div className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-stone">{item.label}</p>
                    <p className="mt-2 text-xs leading-relaxed text-ink-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {boundaryItems.map(([title, desc]) => (
              <div key={title} className="border border-border bg-surface p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-faint">{title}</p>
                <p className="text-sm leading-relaxed text-ink">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="mb-7 max-w-3xl">
            <p className="system-label">Service Details</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-ink">每项服务的适用场景、输入材料和边界。</h2>
            <p className="mt-4 text-sm leading-7 text-ink-muted">
              下面保留完整服务卡，把”适合谁、不适合谁、需要提供什么、不会做什么”说清楚。
            </p>
          </div>

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
        </section>

        <section id="service-form" className="scroll-mt-24">
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
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
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
