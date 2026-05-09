import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getServiceBySlug, services } from '@/data/services'
import PageHero from '@/components/PageHero'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import ServiceCard from '@/components/ServiceCard'
import ServiceRequestForm from '@/components/services/ServiceRequestForm'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: '工具看不明白的地方，可以找我帮你判断',
  description:
    'ZenoAIHome 服务页。当前主线先看装修签约前判断：免费资料、低价指南、报价快审和签约前决策包。AI 工作流咨询单独走另一条线。',
  alternates: {
    canonical: 'https://zenoaihome.com/services',
  },
}

const serviceRelatedArticles: Record<string, { label: string; href: string }[]> = {
  'baojia-shenhe': [
    { label: '装修预算为什么总超？', href: '/blog/zhuangxiu-yusuan-weishenme-zongchao' },
    { label: '家不是样板间', href: '/blog/02-jia-bu-shi-yangban-jian' },
    { label: '从工地看世界', href: '/blog/03-cong-gongdi-kan-shijie' },
  ],
  'qianyue-qian-juece-bao': [
    { label: '装修预算为什么总超？', href: '/blog/zhuangxiu-yusuan-weishenme-zongchao' },
    { label: '报价避坑完整指南', href: '/pricing/baojia-guide' },
    { label: '家不是样板间', href: '/blog/02-jia-bu-shi-yangban-jian' },
  ],
  'yusuan-zixun': [
    { label: '装修预算为什么总超？', href: '/blog/zhuangxiu-yusuan-weishenme-zongchao' },
    { label: '从工地看世界', href: '/blog/03-cong-gongdi-kan-shijie' },
    { label: '长期主义不是忍耐', href: '/blog/05-changqi-zhuyi-bushi-rennai' },
  ],
  'shi-zhu-pai-zhuangxiu': [
    { label: '家不是样板间', href: '/blog/02-jia-bu-shi-yangban-jian' },
    { label: '我为什么不想只做一个教人装修的人', href: '/blog/01-wo-wei-shenme-bu-xiang-zhi-zuo-jiaoren-zhuangxiu' },
    { label: '长期主义不是忍耐', href: '/blog/05-changqi-zhuyi-bushi-rennai' },
  ],
  'ai-neirong-xitong-zixun': [
    { label: '为什么我开始认真学 AI', href: '/blog/04-wei-shenme-wo-kaishi-renzheng-xue-ai' },
    { label: '我为什么不想只做一个教人装修的人', href: '/blog/01-wo-wei-shenme-bu-xiang-zhi-zuo-jiaoren-zhuangxiu' },
    { label: '先看 AI 实践专题', href: '/topics#chuantong-hangyeren-zenme-yong-ai' },
  ],
}

// 装修用户服务 slugs
const renovationSlugs = ['baojia-shenhe', 'qianyue-qian-juece-bao', 'yusuan-zixun', 'shi-zhu-pai-zhuangxiu']
// AI / 传统行业服务 slugs
const industrySlugs = ['ai-neirong-xitong-zixun']

const judgmentLadder = [
  {
    label: '免费',
    title: '报价审核清单',
    description: '先把报价里的漏项、模糊项和工艺边界筛一轮。',
    href: '/resources#baojia-shenhe-qingdan',
  },
  {
    label: '¥39',
    title: '报价避坑指南',
    description: '把报价、预算、合同和增项四件事先系统串起来。',
    href: '/pricing/baojia-guide',
  },
  {
    label: '¥699',
    title: '报价风险快审',
    description: '只看报价重点风险，适合想尽快知道该追问什么的人。',
    href: '/services/renovation#baojia-shenhe',
  },
  {
    label: '¥1499',
    title: '签约前决策包',
    description: '把报价、预算、合同和关键追问一次看全，适合临近签约的人。',
    href: '/services/renovation#qianyue-qian-juece-bao',
  },
]

// 面向轻交付咨询——暂无完整数据，用描述卡展示
const industryExtras = [
  {
    title: '个人网站 / 内容系统规划',
    desc: '帮你理清网站定位、内容结构和用户路径。从"有个网站"到"网站能帮你持续获客"。',
  },
  {
    title: 'AI 工作流咨询',
    desc: '不是教你用哪个 AI 产品，而是帮你把具体业务流程拆解清楚，找到 AI 真正能替代的环节，降低试错成本。',
  },
  {
    title: '数字产品设计咨询',
    desc: '帮你把经验、方法、流程打包成可销售的数字产品——从产品形态、定价到交付方式。',
  },
]

const splitCards = [
  {
    label: '装修签约前判断',
    title: '先把签约前风险看清，再决定要不要进入人工判断',
    description: '给普通装修业主的主入口。免费资料、低价指南、报价快审、签约前决策包都从这里进入。',
    href: '/services/renovation',
    image: '/images/services/renovation-judgment-proof.svg',
  },
  {
    label: 'AI 工作流咨询',
    title: '先跑通一个真实场景，再决定要不要整理系统',
    description: '给传统行业从业者的入口。不是追工具，而是把已有工作接进 AI。',
    href: '/services/ai-workflow',
    image: '/images/services/ai-workflow-proof.svg',
  },
]

const serviceFaqs = [
  {
    question: '为什么总服务页要先分两条入口？',
    answer:
      '因为装修判断和 AI 工作流不是一类问题，读者的目标、材料准备和咨询时机都不同。先分入口，后面每一页的路径才不会混。',
  },
  {
    question: '什么时候更适合先用工具和资料，而不是直接找我？',
    answer:
      '如果你还在摸清问题阶段，或者手里没有具体材料，先用工具和资料把问题缩小，再拿清单和模板，通常比直接咨询更划算。',
  },
  {
    question: '为什么现在要把签约前决策包单独提出来？',
    answer:
      '因为很多人真正卡住的不是单份报价，而是“报价、预算、合同和追问顺序一起乱”。把这个中层产品单独写清，服务梯子才不会塌。',
  },
  {
    question: '这个页最想帮你避免什么？',
    answer:
      '避免一上来就把装修业主送进 AI 服务，也避免把传统行业人直接送到泛泛的“服务与合作”页面里。',
  },
]

export default function ServicesPage() {
  const renovationServices = renovationSlugs
    .map((slug) => getServiceBySlug(slug))
    .filter((service): service is NonNullable<ReturnType<typeof getServiceBySlug>> => Boolean(service))
  const industryServices = industrySlugs
    .map((slug) => getServiceBySlug(slug))
    .filter((service): service is NonNullable<ReturnType<typeof getServiceBySlug>> => Boolean(service))

  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: '找我帮你判断',
            url: 'https://zenoaihome.com/services',
            description: '先分清你是装修判断，还是 AI 工作流需求。',
            inLanguage: 'zh-CN',
            hasPart: services.map((service) => ({
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
        label="找我帮你判断"
        title="工具看不明白的地方，可以找我帮你判断"
        subtitle="这里不做泛泛咨询。当前主线先处理装修签约前判断：免费资料、低价指南、报价快审、签约前决策包。AI 工作流单独走另一条线。"
        note="如果你还在摸问题阶段，先去资料页和低价指南，不急着付费。"
        size="content"
      />

      <Container size="content" className="py-section">

        <section className="mb-14 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {splitCards.map((card) => (
            <div key={card.label} className="border border-border bg-surface overflow-hidden">
              <div className="relative aspect-[16/10] border-b border-border bg-stone-pale/30">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 520px"
                />
              </div>
              <div className="p-6 sm:p-7">
                <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-3">{card.label}</p>
                <h2 className="text-lg font-semibold text-ink mb-3">{card.title}</h2>
                <p className="text-sm text-ink-muted leading-relaxed mb-5">{card.description}</p>
                <CTA href={card.href} label="进入对应入口" variant="primary" />
              </div>
            </div>
          ))}
        </section>

        <section className="mb-14 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">当前最该先看的</p>
          <h2 className="text-lg font-semibold text-ink mb-3">装修业主先走这条梯子，不要一上来就把所有服务看一遍</h2>
          <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-3xl">
            现在网站最核心的转化，不是“合作与共建”，也不是泛泛咨询，而是把签约前判断做成一条清楚、可升级、可理解的路径。
          </p>
          <div className="grid gap-4 lg:grid-cols-4">
            {judgmentLadder.map((item) => (
              <Link key={item.title} href={item.href} className="border border-border bg-surface p-5 hover:border-stone transition-colors">
                <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone">{item.label}</p>
                <h2 className="mt-3 text-base font-semibold text-ink">{item.title}</h2>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-14 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">可验证的证据</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              ['服务范围', '报价快审、签约前决策包、预算结构诊断、居住场景判断、AI 工作流整理。'],
              ['工作方式', '先看材料，再给书面建议；复杂情况再配微信或语音解读。'],
              ['交付样例', '风险说明、修改建议、流程骨架、提示词框架。'],
              ['哪些不做', '不代砍价、不代施工、不承诺一键自动化。'],
            ].map(([title, desc]) => (
              <div key={title} className="border border-border bg-surface p-5">
                <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">{title}</p>
                <p className="text-sm text-ink leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ───── A. 装修相关咨询 ───── */}
        <div className="mb-6">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">A</p>
          <h2 className="text-lg font-semibold text-ink">装修判断服务</h2>
          <p className="text-sm text-ink-muted mt-1">先处理普通装修业主最常见的四类进入方式：报价快审、签约前决策包、预算结构和居住场景选择。</p>
        </div>

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

        <div className="mt-16 mb-6">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">B</p>
          <h2 className="text-lg font-semibold text-ink">AI 工作流与内容系统</h2>
          <p className="text-sm text-ink-muted mt-1">先处理传统行业人最常见的问题：怎么把一个真实场景接进 AI，而不是一直停在演示层。</p>
        </div>

        <div className="space-y-10">
          {industryServices.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              relatedArticles={serviceRelatedArticles[service.slug]}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {industryExtras.map((item) => (
            <div key={item.title} className="border border-border bg-surface p-6">
              <h3 className="text-sm font-semibold text-ink mb-3">{item.title}</h3>
              <p className="text-xs text-ink-muted leading-relaxed mb-4">{item.desc}</p>
              <span className="text-[0.65rem] text-stone border border-stone/30 px-2 py-0.5 uppercase tracking-wider">下一阶段</span>
            </div>
          ))}
        </div>

        <section id="service-form" className="mt-16 scroll-mt-24">
          <div className="mb-6">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">提交资料</p>
            <h2 className="text-lg font-semibold text-ink">先把材料和问题说清楚，再决定是否适合进入服务</h2>
            <p className="text-sm text-ink-muted mt-2 leading-relaxed max-w-2xl">
              这里是站内服务申请入口。暂不做站内文件上传，你可以先放网盘链接、报价单说明或户型信息；提交后会进入你的用户记录。
            </p>
          </div>
          <ServiceRequestForm services={services} />
        </section>

        {/* ───── 装修服务限量说明 ───── */}
        {renovationServices
          .filter((s) => s.slug === 'shi-zhu-pai-zhuangxiu')
          .map((service) => (
            <div key={service.id} className="mt-6 border border-stone/30 bg-stone/5 p-5">
              <p className="text-xs text-stone font-semibold uppercase tracking-widest mb-1">限量开放</p>
              <p className="text-sm text-ink-muted leading-relaxed">
                居住场景装修服务主要面向南宁本地和高度匹配用户。
                这不是未来规模化主线，而是基于真实项目经验的深度服务。
              </p>
            </div>
          ))}

        {/* ───── C. 合作方向 ───── */}
        <div className="mt-16 mb-6">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">C</p>
          <h2 className="text-lg font-semibold text-ink">合作方向不是当前主线</h2>
        </div>
        <div className="border border-border p-6 sm:p-8">
          <p className="text-sm text-ink leading-relaxed mb-3">
            如果你是传统行业从业者、小老板、内容创作者、工具开发者或品牌方，想一起探索 AI 工具、内容产品、数字资料和轻交付服务，可以联系我。
          </p>
          <p className="text-sm text-ink-muted leading-relaxed mb-6">
            但这部分现在不放在网站主转化路径里。网站当前优先验证的，仍然是装修签约前判断和 B 端 AI 工作流两条可付费路径。
          </p>
          <CTA href="/contact" label="查看联系方式" variant="secondary" />
        </div>

        {/* 底部说明 */}
        <div className="mt-12 border border-border p-6 sm:p-8">
          <p className="text-sm text-ink leading-relaxed mb-3">
            我不接所有咨询，只接我能真正帮到的。
          </p>
          <p className="text-sm text-ink-muted leading-relaxed mb-6">
            如果你的需求不在范围内，或读完之后觉得匹配度不高，不用勉强——文章和资料页对你可能更有用。
            如果读完觉得“好像说的就是我的问题”，可以发一条简短的背景说明，我会评估是否能帮到你。
          </p>
          <CTA href="/contact" label="查看联系方式" variant="secondary" />
        </div>

        <div className="mt-6 border border-border bg-surface-warm p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
          <div>
            <p className="text-sm font-medium text-ink">还没想好？先从免费工具和资料开始。</p>
            <p className="text-xs text-ink-muted mt-1 max-w-md">
              报价审核清单、报价避坑指南、装修预算模板和 AI 提示词体验场都可以先用。先建立判断，再决定是否需要服务。
            </p>
          </div>
          <CTA href="/resources" label="去资料与清单" variant="secondary" />
        </div>

        {/* 关联内容入口 */}
        <div className="mt-10">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-4">
            常见问题
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {serviceFaqs.map((item) => (
              <div key={item.question} className="border border-border bg-surface p-5">
                <h2 className="text-sm font-semibold text-ink mb-2">{item.question}</h2>
                <p className="text-xs text-ink-muted leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

      </Container>
    </>
  )
}
