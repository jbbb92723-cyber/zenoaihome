import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import ServiceCard from '@/components/ServiceCard'
import StructuredData from '@/components/StructuredData'
import { getServiceBySlug } from '@/data/services'

export const metadata: Metadata = {
  title: '装修判断服务：报价快审、签约前决策包和预算结构怎么选',
  description:
    '针对普通装修业主的判断服务入口。先看清签约前路径：免费资料、低价指南、报价快审、签约前决策包，再决定是否进入更深的人工判断。',
  alternates: {
    canonical: 'https://zenoaihome.com/services/renovation',
  },
}

const renovationSlugs = ['baojia-shenhe', 'qianyue-qian-juece-bao', 'yusuan-zixun', 'shi-zhu-pai-zhuangxiu']

const signBeforeFlow = [
  {
    label: '先自己看',
    price: '免费',
    title: '报价审核清单',
    description: '还没确定问题在哪时，先把漏项、模糊项和工艺边界过一轮。',
    href: '/resources#baojia-shenhe-qingdan',
  },
  {
    label: '低价判断',
    price: '¥39',
    title: '报价避坑指南',
    description: '把报价、预算、合同和增项四件事先系统串起来。',
    href: '/pricing/baojia-guide',
  },
  {
    label: '人工快审',
    price: '¥699',
    title: '报价风险快审',
    description: '适合已经有报价单，想快速知道最该追问什么的人。',
    href: '/services/renovation#baojia-shenhe',
  },
  {
    label: '一次看全',
    price: '¥1499',
    title: '签约前决策包',
    description: '报价、预算、合同和关键追问一起看，适合临近签约的人。',
    href: '/services/renovation#qianyue-qian-juece-bao',
  },
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
    question: '预算结构诊断和报价风险快审有什么区别？',
    answer:
      '报价风险快审是在你拿到具体报价单之后，帮你看漏项、模糊项和风险边界。预算结构诊断是在报价前或报价混乱时，先把钱按结构拆清。',
  },
  {
    question: '报价风险快审和签约前决策包有什么区别？',
    answer:
      '快审更适合“我手里已经有报价单，想尽快知道关键风险”。决策包适合“我快要签了，想把报价、预算、合同和追问顺序一次理清”。',
  },
  {
    question: '居住场景装修服务适合什么人？',
    answer:
      '它更适合已经明确要从家庭生活场景出发做决策、预算和城市范围也匹配的人，不适合只想照着网图快速还原的项目。',
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
            name: '装修判断服务',
            url: 'https://zenoaihome.com/services/renovation',
            description: '先分清你是报价、预算还是居住场景的问题，再决定下一步。',
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

      <PageHero
        label="装修判断服务"
        title="先把签约前风险看清，再决定这笔装修钱值不值得花"
        subtitle="这条入口只给普通装修业主。主线先围绕签约前判断：免费清单、低价指南、报价快审、签约前决策包。预算结构和居住场景服务放在后面，不再混在一起卖。"
        note="如果你还没有具体报价或合同材料，先去资料页和低价指南；真正临近签约，再进入人工判断。"
        size="content"
      />

      <Container size="content" className="py-section">
        <section className="mb-14 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
          <div className="border border-border bg-surface overflow-hidden">
            <div className="relative aspect-[16/10] border-b border-border bg-stone-pale/40">
              <Image
                src="/images/services/renovation-judgment-proof.svg"
                alt="报价审核与装修判断服务示意图"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
            </div>
            <div className="p-6">
              <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">先看证据，不先听口号</p>
              <p className="text-sm text-ink-muted leading-relaxed">
                这类服务的重点不是“我懂很多”，而是你能不能看清：要提供什么、我会看什么、最后会交付什么、哪些事情我明确不做。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ['服务范围', '报价快审、签约前决策包、预算结构诊断、居住场景判断。'],
              ['交付方式', '先看材料，再给书面建议；复杂情况再配微信或语音解读。'],
              ['你先准备', '城市、材料、报价或预算截图，越具体越快。'],
              ['明确不做', '不代砍价、不代施工、不接品牌推荐单。'],
            ].map(([title, desc]) => (
              <div key={title} className="border border-border bg-surface-warm p-5">
                <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">{title}</p>
                <p className="text-sm text-ink leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">当前主线</p>
          <h2 className="text-lg font-semibold text-ink mb-3">签约前判断，按这个顺序走</h2>
          <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-3xl">
            不要一上来就选最高客单。先用清单和指南把问题缩小，再决定是做报价快审，还是直接用决策包把报价、预算、合同一次看全。
          </p>
          <div className="grid gap-4 lg:grid-cols-4">
            {signBeforeFlow.map((item) => (
              <Link key={item.title} href={item.href} className="border border-border bg-surface p-5 hover:border-stone transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone">{item.label}</p>
                  <span className="text-xs text-stone border border-stone/30 px-2 py-0.5">{item.price}</span>
                </div>
                <h2 className="mt-3 text-base font-semibold text-ink">{item.title}</h2>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{item.description}</p>
              </Link>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <CTA href="/resources#baojia-shenhe-qingdan" label="先拿报价审核清单" variant="secondary" />
            <CTA href="/pricing/baojia-guide" label="先看 ¥39 指南" variant="ghost" />
            <CTA href="/services/renovation#qianyue-qian-juece-bao" label="直接看决策包" variant="primary" />
          </div>
          <p className="mt-4 text-xs text-ink-muted leading-relaxed">
            如果你现在还没有具体报价，只是预算结构混乱，先看预算结构诊断，不要硬把自己塞进报价服务。
          </p>
        </section>

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

        <section className="mt-14 grid grid-cols-1 lg:grid-cols-[1fr_0.95fr] gap-6">
          <div className="border border-border bg-surface p-6 sm:p-8">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">常见问题</p>
            <div className="space-y-5">
              {faqs.map((item) => (
                <div key={item.question}>
                  <h2 className="text-base font-semibold text-ink mb-2">{item.question}</h2>
                  <p className="text-sm text-ink-muted leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-border bg-surface-warm p-6 sm:p-8">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">下一步</p>
            <h2 className="text-lg font-semibold text-ink mb-3">如果你已经接近签约</h2>
            <p className="text-sm text-ink-muted leading-relaxed mb-5">
              先决定你是只需要“看清报价风险”，还是要把报价、预算、合同和追问顺序一起梳理。如果还不确定，就先回问题路径页，不要急着把所有内容都看完。
            </p>
            <div className="flex flex-wrap gap-3">
              <CTA href="/services/renovation#baojia-shenhe" label="直接看报价快审" variant="primary" />
              <CTA href="/services/renovation#qianyue-qian-juece-bao" label="直接看签约前决策包" variant="secondary" />
              <CTA href="/start" label="回问题入口页" variant="ghost" />
            </div>
          </div>
        </section>
      </Container>
    </>
  )
}