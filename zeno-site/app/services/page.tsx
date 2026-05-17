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
  title: '服务价格 | 签约前报价判断三档',
  description:
    'ZenoAIHome 服务价格页。当前主线是装修签约前报价风险判断：免费初筛、¥99 体验版初查、¥299 标准版快审、¥699 深度版签约前判断。',
  alternates: {
    canonical: 'https://zenoaihome.com/services',
  },
}

const serviceRelatedArticles: Record<string, { label: string; href: string }[]> = {
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
  'shi-zhu-pai-zhuangxiu': [
    { label: '家不是样板间', href: '/blog/02-jia-bu-shi-yangban-jian' },
    { label: '我为什么不想只做一个教人装修的人', href: '/blog/01-wo-wei-shenme-bu-xiang-zhi-zuo-jiaoren-zhuangxiu' },
    { label: '长期主义不是忍耐', href: '/blog/05-changqi-zhuyi-bushi-rennai' },
  ],
}

const renovationSlugs = ['quote-entry', 'quote-standard', 'quote-deep']
const extensionRenovationSlugs = ['shi-zhu-pai-zhuangxiu']

const entryRoutes = [
  {
    label: '主线 / 装修签约前判断',
    title: '你买的不是咨询时长，是签字前少后悔',
    description: '先做免费初筛，再按材料完整度选择 ¥99 初查、¥299 快审或 ¥699 深度判断。',
    href: '/services/renovation',
    cta: '看装修签约前路径',
    image: '/images/services/renovation-judgment-proof.svg',
  },
]

const serviceFaqs = [
  {
    question: '为什么服务页只保留三档主服务？',
    answer:
      '当前网站只先打穿签约前报价判断。体验版、标准版、深度版分别对应“先看明显风险”“完整看报价”“快签前一起看合同和付款节点”。',
  },
  {
    question: '什么时候更适合先用工具，而不是直接找我？',
    answer:
      '还没有具体材料，或者只是感觉有问题但说不清——先用工具把问题缩小。带着清单来问，比空着手咨询更划算。',
  },
  {
    question: '为什么把价格写出来？',
    answer:
      '不写清楚，你不知道该买哪个，我也不知道哪个真有人要。按你现在的阶段选，别贪多。',
  },
  {
    question: 'AI、课程、会员现在是不是主线？',
    answer:
      '不是。AI 只是辅助整理信息和生成清单。当前主线仍然是业主签约前的报价、合同和付款节点判断。',
  },
]

export default function ServicesPage() {
  const renovationServices = renovationSlugs
    .map((slug) => getServiceBySlug(slug))
    .filter((service): service is NonNullable<ReturnType<typeof getServiceBySlug>> => Boolean(service))
  const extensionRenovationServices = extensionRenovationSlugs
    .map((slug) => getServiceBySlug(slug))
    .filter((service): service is NonNullable<ReturnType<typeof getServiceBySlug>> => Boolean(service))

  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: '签约前报价判断服务价格',
            url: 'https://zenoaihome.com/services',
            description: '围绕签约前报价、合同和付款节点风险判断的三档人工服务。',
            inLanguage: 'zh-CN',
            hasPart: renovationServices.map((service) => ({
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
        title="签约前报价判断，只保留三档。"
        subtitle="如果你是准备签约的业主，先看报价有没有说清，再决定用 ¥99 初查、¥299 快审，还是 ¥699 深度判断。"
        note="还没有完整报价材料时，先用免费初筛，不要急着买人工服务。"
        size="content"
      />

      <Container size="content" className="py-section">
        <section className="mb-14 grid gap-5 lg:grid-cols-[1.18fr_0.82fr]">
          <div className="overflow-hidden border border-border bg-surface">
            <div className="relative aspect-[16/10] border-b border-border bg-stone-pale/30">
              <Image
                src="/images/services/renovation-judgment-proof.svg"
                alt="装修签约前判断服务示意图"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 720px"
              />
            </div>
            <div className="p-6 sm:p-7">
              <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-widest text-stone">{entryRoutes[0].label}</p>
              <h2 className="mb-3 max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-ink">{entryRoutes[0].title}</h2>
              <p className="mb-5 max-w-2xl text-sm leading-relaxed text-ink-muted">{entryRoutes[0].description}</p>
              <CTA href={entryRoutes[0].href} label={entryRoutes[0].cta} variant="primary" />
            </div>
          </div>

          <div className="grid gap-5">
            {[
              ['先做免费初筛', '把报价里没写清的地方先标出来。', '/tools/quote-check', '去初筛'],
              ['再用风险资料补问题', '风险词典、项目风险库和检查模板，帮你把问题问具体。', '/risk-dictionary', '看风险词典'],
              ['最后选三档服务', '体验版初查、标准版快审、深度版判断，按材料和阶段选。', '/services/renovation', '看怎么选'],
            ].map(([title, desc, href, action], index) => (
              <Link key={title} href={href} className="group border border-border bg-surface p-6 transition-colors hover:border-stone hover:bg-surface-warm">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone">0{index + 1}</p>
                <h3 className="mt-3 text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{desc}</p>
                <p className="mt-5 text-xs font-semibold text-stone">{action} -&gt;</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-14 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-faint">主价格路径</p>
          <h2 className="mb-3 text-lg font-semibold text-ink">报价看不懂，先从这条路走。</h2>
          <p className="mb-6 max-w-3xl text-sm leading-relaxed text-ink-muted">
            免费初筛负责先找方向，¥99 初查看明显风险，¥299 快审看完整报价，¥699 深度版把报价、合同和付款节点一起看。
          </p>

          <div className="grid gap-8 lg:grid-cols-[2fr_0.9fr]">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone">三档人工服务</p>
              <CommercialLadder variant="full" rungs={serviceLadder} />
              <div className="mt-4 border border-border bg-surface p-4 text-sm leading-relaxed text-ink-muted">
                真正进入人工服务前，你应该已经有报价材料；深度版还需要合同草稿或付款节点。
              </div>
            </div>

            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone">怎么选</p>
              <div className="grid gap-3">
                {[
                  ['体验版报价风险初查', '只想先看这份报价有没有明显问题，适合 10 行以内重点报价。'],
                  ['标准版报价风险快审', '手里已有完整报价，最想知道漏项、模糊项和增项口子在哪里。'],
                  ['深度版签约前判断', '报价、合同和付款节点一起卡住，已经接近签字。'],
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
          <p className="mb-6 text-sm leading-relaxed text-ink-muted">以下是脱敏样张。装修线付费服务交付的是基于你真实报价单生成的完整版文件。</p>
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
              ['装修线交付', '报价风险、合同追问和付款节点提醒，最后落到一份能执行的清单。'],
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
          {renovationServices.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              relatedArticles={serviceRelatedArticles[service.slug]}
            />
          ))}
        </div>

        {extensionRenovationServices.length > 0 && (
          <>
            <div className="mb-6 mt-16">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-faint">A+</p>
              <h2 className="text-lg font-semibold text-ink">延伸服务：居住场景</h2>
              <p className="mt-1 text-sm text-ink-muted">
                这不是签约前报价风险判断的主入口，只适合南宁本地且需要更深居住判断的用户。
              </p>
            </div>

            <div className="space-y-10">
              {extensionRenovationServices.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={index}
                  relatedArticles={serviceRelatedArticles[service.slug]}
                />
              ))}
            </div>
          </>
        )}

        <section id="service-form" className="mt-16 scroll-mt-24">
          <div className="mb-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-faint">提交资料</p>
            <h2 className="text-lg font-semibold text-ink">先把材料和问题说清楚，再决定是否适合进入服务</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
              这里是站内服务申请入口。暂不做站内文件上传，你可以先放网盘链接、报价单说明、户型信息；提交后会进入你的用户记录。
            </p>
          </div>
          <ServiceRequestForm services={[...renovationServices, ...extensionRenovationServices]} />
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
            <p className="text-sm font-medium text-ink">还没想好？先从免费初筛和检查模板开始。</p>
            <p className="mt-1 max-w-md text-xs text-ink-muted">
              报价初筛、风险词典、检查模板和验收清单都可以先用。先建立判断，再决定是否需要服务。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CTA href="/tools/quote-check" label="去报价初筛" variant="primary" />
            <CTA href="/checklists" label="去检查模板" variant="secondary" />
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
