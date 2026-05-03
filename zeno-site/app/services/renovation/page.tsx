import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import ServiceCard from '@/components/ServiceCard'
import StructuredData from '@/components/StructuredData'
import { services } from '@/data/services'

export const metadata: Metadata = {
  title: '装修判断服务：报价、预算和真实居住怎么选',
  description:
    '针对普通装修业主的判断服务入口。先分清你是报价风险、预算失控，还是居住需求没厘清，再决定要不要找 Zeno。',
  alternates: {
    canonical: 'https://zenoaihome.com/services/renovation',
  },
}

const renovationSlugs = ['baojia-shenhe', 'yusuan-zixun', 'shi-zhu-pai-zhuangxiu']

const relatedArticles: Record<string, { label: string; href: string }[]> = {
  'baojia-shenhe': [
    { label: '装修预算为什么总超？', href: '/blog/zhuangxiu-yusuan-weishenme-zongchao' },
    { label: '从工地看世界', href: '/blog/03-cong-gongdi-kan-shijie' },
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
    question: '预算咨询和报价审核有什么区别？',
    answer:
      '报价审核是在你拿到具体报价单之后，帮你看漏项、模糊项和风险边界。预算咨询是在报价前或报价混乱时，先把钱按结构拆清。',
  },
  {
    question: '真实居住派装修服务适合什么人？',
    answer:
      '它更适合已经明确要从真实生活出发做决策、预算和城市范围也匹配的人，不适合只想照着网图快速还原的项目。',
  },
]

export default function RenovationServicesPage() {
  const renovationServices = services.filter((service) => renovationSlugs.includes(service.slug))

  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: '装修判断服务',
            url: 'https://zenoaihome.com/services/renovation',
            description: '先分清你是报价、预算还是真实居住的问题，再决定下一步。',
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
        title="先判断，再决定这笔装修钱值不值得花"
        subtitle="这条入口只给普通装修业主。先分清你现在是报价风险、预算结构问题，还是居住需求没厘清，再决定要不要找我。"
        note="如果你只是想先自己判断，先拿清单和模板，把问题缩小到一张报价、一份预算或一个施工节点。"
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
              ['服务范围', '报价审核、预算结构、真实居住判断。'],
              ['交付方式', '微信沟通 + 书面建议，不做模糊口头答复。'],
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
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">先自己判断</p>
          <h2 className="text-lg font-semibold text-ink mb-3">还没到付费阶段，先走这三步</h2>
          <div className="flex flex-wrap gap-3">
            <CTA href="/resources#sign-before-contract" label="先走签约前入口" variant="primary" />
            <CTA href="/resources#baojia-shenhe-qingdan" label="先拿报价审核清单" variant="secondary" />
            <CTA href="/resources#construction-checkpoints" label="先看施工节点入口" variant="ghost" />
          </div>
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
            <h2 className="text-lg font-semibold text-ink mb-3">如果你已经知道自己是哪类问题</h2>
            <p className="text-sm text-ink-muted leading-relaxed mb-5">
              你可以直接跳到对应服务卡片；如果还不确定，就先回问题路径页，不要急着把所有内容都看完。
            </p>
            <div className="flex flex-wrap gap-3">
              <CTA href="/services/renovation#baojia-shenhe" label="直接看报价审核" variant="primary" />
              <CTA href="/services/renovation#yusuan-zixun" label="直接看预算咨询" variant="secondary" />
              <CTA href="/start" label="回问题入口页" variant="ghost" />
            </div>
          </div>
        </section>
      </Container>
    </>
  )
}