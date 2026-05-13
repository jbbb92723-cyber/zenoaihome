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
  title: '服务路径 | 装修判断优先',
  description:
    'ZenoAIHome 服务页。当前主线是装修签约前报价风险初筛，AI 工作流作为延伸入口。先用免费工具和低价资料把问题缩小，再决定是否进入人工服务。',
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

const renovationSlugs = ['baojia-shenhe', 'qianyue-qian-juece-bao', 'yusuan-zixun', 'shi-zhu-pai-zhuangxiu']
const industrySlugs = ['ai-neirong-xitong-zixun']

const renovationLadder = [
  {
    label: '免费',
    title: '报价初筛 + 审核清单',
    description: '先把漏项、模糊项、付款节点和追问顺序筛一轮。',
    href: '/tools/quote-check',
    action: '先做初筛',
  },
  {
    label: '¥39',
    title: '报价避坑指南',
    description: '把报价、预算、合同和增项四件事先系统看一遍。',
    href: '/pricing/baojia-guide',
    action: '看低价指南',
  },
  {
    label: '¥399',
    title: '预算取舍诊断',
    description: '预算总数有了，但钱该怎么分、哪里该留缓冲还不清楚。',
    href: '/services/renovation#yusuan-zixun',
    action: '看取舍诊断',
  },
  {
    label: '¥699',
    title: '报价风险快审',
    description: '已经拿到报价单，想尽快知道最该追问什么。',
    href: '/services/renovation#baojia-shenhe',
    action: '看报价快审',
  },
  {
    label: '¥1499',
    title: '签约前决策包',
    description: '报价、预算、合同和关键追问一起看，适合临近签约。',
    href: '/services/renovation#qianyue-qian-juece-bao',
    action: '看决策包',
  },
]

const aiLadder = [
  {
    label: '免费',
    title: 'AI 场景生成器',
    description: '拿一个真实任务，生成可复制的提示词和执行清单。',
    href: '/tools/prompts',
    action: '生成一个场景',
  },
  {
    label: '免费',
    title: '内容诊断大脑',
    description: '发布前检查选题、标题、证据、表达和站内承接。',
    href: '/tools/content-brain',
    action: '诊断一篇内容',
  },
  {
    label: '¥199',
    title: '传统装修行业 AI 工作流小课',
    description: '用 5 个装修行业场景，先学会把现场经验接进 AI。',
    href: '/pricing',
    action: '看小课',
  },
  {
    label: '¥199 / 年',
    title: '内容资产会员年卡',
    description: '长期更新选题、提示词和内容模板，适合持续经营个人 IP。',
    href: '/pricing',
    action: '看会员权益',
  },
  {
    label: '¥1999 起',
    title: 'AI 工作流咨询',
    description: '针对你的具体工作场景，找一个能落地的 AI 切入口。',
    href: '/services/ai-workflow#ai-neirong-xitong-zixun',
    action: '看咨询卡',
  },
]

const nextStageProducts = [
  {
    label: '下一阶段',
    title: 'AI 内容诊断',
    price: '建议 ¥399',
    desc: '适合已经持续发内容，但不知道哪里不承接、不转化的人。先用内容诊断工具生成材料，再决定是否做人工诊断。',
    href: '/tools/content-brain',
    action: '先用免费诊断',
  },
  {
    label: '下一阶段',
    title: '行业经验产品化体验版',
    price: '建议 ¥999',
    desc: '把一个 SOP 拆成资料包、工具或小课雏形。现在先用 AI 工作流咨询承接，不急着单独开卖。',
    href: '/services/ai-workflow#ai-neirong-xitong-zixun',
    action: '先看咨询路径',
  },
  {
    label: '下一阶段',
    title: '课程 / 会员 / 陪跑',
    price: '先用 ¥199 年卡验证',
    desc: '等内容资产、工具结果和用户问题稳定后，再扩成课程、会员区和陪跑服务。',
    href: '/pricing',
    action: '先看现有产品',
  },
]

const entryRoutes = [
  {
    label: '主线 / 装修签约前判断',
    title: '你买的不是咨询时长，是签字前少后悔',
    description: '给普通装修业主的主入口。先用免费工具和 ¥39 指南缩小问题，再看 ¥399、¥699、¥1499 的人工判断。',
    href: '/services/renovation',
    cta: '看装修签约前路径',
    image: '/images/services/renovation-judgment-proof.svg',
  },
  {
    label: '延伸 / AI 工作流判断',
    title: '你买的不是提示词，是一个能跑起来的真实场景',
    description: '给传统行业人、同行和内容创作者的入口。先用免费工具跑一个任务，再看小课、会员或一对一咨询。',
    href: '/services/ai-workflow',
    cta: '看 AI 工作流路径',
    image: '/images/services/ai-workflow-proof.svg',
  },
]

const serviceFaqs = [
  {
    question: '为什么总服务页要先分两条入口？',
    answer:
      '因为装修业主和传统行业人的购买理由不同。业主想在签字前少后悔，同行想把已有经验接进 AI。先分清入口，后面的工具、产品和服务才不会混。',
  },
  {
    question: '什么时候更适合先用工具和资料，而不是直接找我？',
    answer:
      '如果你还没有具体材料，或者只是感觉有问题但说不清，先用工具和资料把问题缩小。带着清单来问，比空着手咨询更划算。',
  },
  {
    question: '为什么要把价格梯子写出来？',
    answer:
      '因为零收入阶段最怕什么都想卖，最后用户也不知道该买什么。价格梯子写清楚，用户能按自己的阶段选择，你也能看出哪个产品真正有人要。',
  },
  {
    question: '课程、会员和陪跑现在是不是主线？',
    answer:
      '不是。它们是后面的放大方式。当前先把免费工具、低价产品和两条人工服务跑通，再根据真实问题扩展。',
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
            name: '装修与 AI 服务路径',
            url: 'https://zenoaihome.com/services',
            description: '先分清你要买的是装修签约前判断，还是 AI 工作流判断。',
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
        title="先分清你要买的是哪种判断"
        subtitle="装修业主先看签约前报价风险，传统行业人再看 AI 场景能不能跑起来。当前主线是前者，后者是延伸入口。这里先把路径分开，再给你对应的免费入口、低价产品和人工服务。"
        note="还说不清问题时，先用工具；已经有材料和明确时间点，再进入服务。"
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
            <div className="overflow-hidden border border-border bg-surface">
              <div className="relative aspect-[16/9] border-b border-border bg-[#f5f4fb]">
                <Image
                  src="/images/services/ai-workflow-proof.svg"
                  alt="AI 工作流咨询路径示意图"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 520px"
                />
              </div>
              <div className="p-6 sm:p-7">
                <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-widest text-stone">{entryRoutes[1].label}</p>
                <h2 className="mb-3 text-lg font-semibold leading-snug text-ink">{entryRoutes[1].title}</h2>
                <p className="mb-5 text-sm leading-relaxed text-ink-muted">{entryRoutes[1].description}</p>
                <CTA href={entryRoutes[1].href} label={entryRoutes[1].cta} variant="secondary" />
              </div>
            </div>

            <div className="border border-border bg-surface-warm p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint">先从主线开始</p>
              <h3 className="mt-3 text-lg font-semibold text-ink">如果你是装修业主，先去报价初筛。</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                先知道自己卡在哪一步，再决定要不要进入人工服务。第二条路可以晚一点看，不要抢第一条路的注意力。
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <CTA href="/tools/quote-check" label="先做免费报价初筛" variant="primary" />
                <CTA href="/services/renovation" label="看装修签约前路径" variant="secondary" />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-14 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-faint">两条价格路径</p>
          <h2 className="mb-3 text-lg font-semibold text-ink">不是越贵越好，是看你现在卡在哪一步</h2>
          <p className="mb-6 max-w-3xl text-sm leading-relaxed text-ink-muted">
            网站当前要验证的是一条主线和一条延伸线：装修签约前判断优先，AI 工作流作为背景能力。每一档都要让用户知道自己会拿到什么，以及下一步该点哪里。
          </p>

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone">主线 / 装修业主</p>
              <div className="grid gap-3">
                {renovationLadder.map((item) => (
                  <Link key={item.title} href={item.href} className="group border border-border bg-surface p-5 transition-colors hover:border-stone">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone">{item.label}</p>
                        <h3 className="mt-2 text-base font-semibold text-ink">{item.title}</h3>
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-ink-muted group-hover:text-stone">{item.action}</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone">延伸 / 传统行业人</p>
              <div className="grid gap-3">
                {aiLadder.map((item) => (
                  <Link key={item.title} href={item.href} className="group border border-border bg-surface p-5 transition-colors hover:border-stone">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone">{item.label}</p>
                        <h3 className="mt-2 text-base font-semibold text-ink">{item.title}</h3>
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-ink-muted group-hover:text-stone">{item.action}</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-14 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-faint">可验证的交付</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['装修线交付', '报价风险、预算取舍、合同追问和验收节点，最后落到一份能执行的清单。'],
              ['AI 线交付', '场景切入建议、工作流骨架、提示词框架和内容承接建议。'],
              ['工作方式', '先看材料，再给书面建议；复杂情况再配微信或语音解读。'],
              ['明确不做', '不代砍价、不代施工、不代开发程序，也不承诺一次解决所有流程。'],
            ].map(([title, desc]) => (
              <div key={title} className="border border-border bg-surface p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-faint">{title}</p>
                <p className="text-sm leading-relaxed text-ink">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-faint">A</p>
          <h2 className="text-lg font-semibold text-ink">装修判断服务</h2>
          <p className="mt-1 text-sm text-ink-muted">先处理普通装修业主最常见的四类进入方式：报价快审、签约前决策包、预算取舍和居住场景选择。</p>
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

        <div className="mb-6 mt-16">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-faint">B</p>
          <h2 className="text-lg font-semibold text-ink">AI 工作流与内容系统</h2>
          <p className="mt-1 text-sm text-ink-muted">先处理传统行业人最常见的问题：怎么把一个真实场景接进 AI，而不是一直停在演示层。</p>
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

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {nextStageProducts.map((item) => (
            <Link key={item.title} href={item.href} className="border border-border bg-surface p-6 transition-colors hover:border-stone">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone">{item.label}</p>
                <span className="text-xs text-stone">{item.price}</span>
              </div>
              <h3 className="mb-3 text-sm font-semibold text-ink">{item.title}</h3>
              <p className="mb-4 text-xs leading-relaxed text-ink-muted">{item.desc}</p>
              <span className="text-xs font-semibold text-stone">{item.action}</span>
            </Link>
          ))}
        </div>

        <section id="service-form" className="mt-16 scroll-mt-24">
          <div className="mb-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-faint">提交资料</p>
            <h2 className="text-lg font-semibold text-ink">先把材料和问题说清楚，再决定是否适合进入服务</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
              这里是站内服务申请入口。暂不做站内文件上传，你可以先放网盘链接、报价单说明、户型信息或 AI 场景描述；提交后会进入你的用户记录。
            </p>
          </div>
          <ServiceRequestForm services={services} />
        </section>

        {renovationServices
          .filter((s) => s.slug === 'shi-zhu-pai-zhuangxiu')
          .map((service) => (
            <div key={service.id} className="mt-6 border border-stone/30 bg-stone/5 p-5">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-stone">限量开放</p>
              <p className="text-sm leading-relaxed text-ink-muted">
                居住场景装修服务主要面向南宁本地和高度匹配用户。这不是网站当前最容易规模化的主线，而是基于真实项目经验的深度服务。
              </p>
            </div>
          ))}

        <div className="mb-6 mt-16">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-faint">C</p>
          <h2 className="text-lg font-semibold text-ink">合作方向先不抢主线</h2>
        </div>
        <div className="border border-border p-6 sm:p-8">
          <p className="mb-3 text-sm leading-relaxed text-ink">
            如果你是传统行业从业者、小老板、内容创作者、工具开发者或品牌方，想一起做 AI 工具、内容产品、数字资料和轻交付服务，可以联系我。
          </p>
          <p className="mb-6 text-sm leading-relaxed text-ink-muted">
            但这部分现在不放在网站主购买路径里。当前优先验证的，仍然是装修签约前判断和传统行业 AI 工作流两条可付费路径。
          </p>
          <CTA href="/contact" label="查看联系方式" variant="secondary" />
        </div>

        <div className="mt-12 border border-border p-6 sm:p-8">
          <p className="mb-3 text-sm leading-relaxed text-ink">我不接所有咨询，只接我能真正帮到的。</p>
          <p className="mb-6 text-sm leading-relaxed text-ink-muted">
            如果你的需求不在范围内，或读完之后觉得匹配度不高，不用勉强，文章和资料页对你可能更有用。
            如果读完觉得“好像说的就是我的问题”，可以发一条简短的背景说明，我会评估是否能帮到你。
          </p>
          <CTA href="/contact" label="查看联系方式" variant="secondary" />
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-5 border border-border bg-surface-warm p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="text-sm font-medium text-ink">还没想好？先从免费工具和资料开始。</p>
            <p className="mt-1 max-w-md text-xs text-ink-muted">
              报价初筛、预算分配、验收清单、AI 场景生成器和内容诊断都可以先用。先建立判断，再决定是否需要服务。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CTA href="/tools" label="去工具工作台" variant="primary" />
            <CTA href="/resources" label="去资料与清单" variant="secondary" />
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
