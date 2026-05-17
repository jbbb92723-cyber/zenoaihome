import type { Metadata } from 'next'
import Image from 'next/image'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import ServiceCard from '@/components/ServiceCard'
import StructuredData from '@/components/StructuredData'
import { services } from '@/data/services'

export const metadata: Metadata = {
  title: 'AI 延伸整理：先跑通一个真实场景，再谈系统',
  description:
    '给传统行业人的 AI 延伸整理入口。先看是否适合你，再决定要不要做一对一咨询。',
  alternates: {
    canonical: 'https://zenoaihome.com/services/ai-workflow',
  },
}

const aiService = services.find((service) => service.slug === 'ai-neirong-xitong-zixun')

const faqs = [
  {
    question: '什么样的传统行业人适合来做 AI 延伸整理？',
    answer:
      '你已经有真实业务场景，也愿意自己继续迭代，只是卡在不知道该从哪个环节切入，或者内容和流程一直跑不稳。',
  },
  {
    question: '这项服务是不是给我一套万能提示词？',
    answer:
      '不是。重点是先把你的真实任务拆清，再给出切入建议、流程框架和针对你场景的提示词骨架。',
  },
  {
    question: '如果我还没准备好做咨询，先看什么？',
    answer:
      '先去提示词体验场跑一个真实任务，再回头看 AI 工作流提示词包和相关文章，会比直接咨询更有效。',
  },
]

const manifestoIndustries = [
  '装修',
  '设计',
  '教育培训',
  '咨询服务',
  '实体门店',
  '本地生活',
  '家政维修',
  '财税法务',
  '健康管理',
  '制造加工',
]

const manifestoAssets = [
  '客户反复问过的问题',
  '你现场处理过的麻烦',
  '你总结出来的流程',
  '你踩过的坑和避坑经验',
  '你写过的方案、报价和交付说明',
  '你反复打磨过的沟通话术',
  '那些真正解决过问题的案例',
]

const manifestoParagraphs = [
  'AI 一人公司，不是让你从零编一个副业项目。',
  '真正适合普通人的路径，不是追热点、搬项目、天天换工具，而是从自己已经做过的行业、见过的客户、处理过的问题开始。',
  '只要你真正服务过客户、解决过问题，手里就已经有一批很宝贵的资产。过去，这些经验大多只能靠嘴讲，靠熟人介绍，靠一单一单服务客户。',
  '现在，你可以借助 AI，把它们整理成文章、图文、短视频脚本、课程、清单、咨询服务、行业资料包和工具产品。',
  '但这件事的重点，不是 AI 有多神。重点是你有没有真实经验，能不能把问题讲清楚，能不能持续整理，能不能把每一次服务都变成下一次可复用的资产。',
  '你不能控制平台算法，不能控制风口变化，也不能控制别人怎么包装。但你可以控制自己的经验整理、内容输出、服务流程、产品打磨和长期复盘。',
  'AI 一人公司，不是逃离原来的行业，而是把你在行业里积累的判断力，重新变成自己的长期资产。',
  '这套课程，就是讲清楚一个普通行业人，如何从真实经验出发，借助 AI 搭建自己的内容系统、产品系统和服务系统。',
  '不是一夜暴富，不是风口投机，不是凭空造项目。',
  '而是把你已经做过的事，重新整理一遍；把你真正懂的问题，讲给更多需要的人听；把过去靠时间换钱的经验，慢慢沉淀成一间属于自己的 AI 一人公司。',
]

const relatedArticles = [
  { label: '为什么我开始认真学 AI', href: '/blog/04-wei-shenme-wo-kaishi-renzheng-xue-ai' },
  { label: '我为什么不想只做一个教人装修的人', href: '/blog/01-wo-wei-shenme-bu-xiang-zhi-zuo-jiaoren-zhuangxiu' },
  { label: '先看 AI 实践专题', href: '/topics#chuantong-hangyeren-zenme-yong-ai' },
]
export default function AIWorkflowPage() {
  if (!aiService) return null

  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'AI 延伸整理',
            url: 'https://zenoaihome.com/services/ai-workflow',
            description: '传统行业人先跑通一个真实场景，再决定是否需要咨询。',
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
        label="AI 延伸整理"
        title="先跑通一个真实场景，再谈系统"
        subtitle="这条入口只给传统行业从业者。重点不是追一个新工具，而是把你已经在做的工作、内容和服务流程接进 AI。"
        note="如果你还在试探阶段，先去体验场；如果你已经在反复试错，才值得做一对一判断。"
        size="content"
      />

      <Container size="content" className="py-section">
        <section className="mb-14 border border-border bg-surface overflow-hidden">
          <div className="border-b border-border bg-surface-warm px-6 py-5 sm:px-8">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">AI 延伸整理</p>
            <h2 className="text-xl font-semibold text-ink">核心宣言</h2>
            <p className="text-sm text-ink-muted leading-relaxed mt-3 max-w-3xl">
              这不是一份教你追风口的承诺书，而是一条更慢、更稳、也更适合普通行业人的路径说明。
            </p>
          </div>

          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-wrap gap-2 mb-6">
              {manifestoIndustries.map((industry) => (
                <span key={industry} className="border border-border bg-surface-warm px-3 py-1 text-xs text-ink-muted">
                  {industry}
                </span>
              ))}
            </div>

            <div className="space-y-4 max-w-3xl">
              {manifestoParagraphs.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={index === 0 ? 'text-lg font-semibold leading-8 text-ink' : 'text-sm leading-8 text-ink-muted'}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8 border-l-2 border-stone/40 pl-5">
              <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">你手里已经有的资产</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {manifestoAssets.map((item) => (
                  <p key={item} className="text-sm leading-7 text-ink">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-14 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6 items-start">
          <div className="border border-border bg-surface overflow-hidden">
            <div className="relative aspect-[16/10] border-b border-border bg-[#F1EDF8]">
              <Image
                src="/images/services/ai-workflow-proof.svg"
                alt="AI 工作流咨询路径示意图"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
            </div>
            <div className="p-6">
              <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">先看你能不能落地</p>
              <p className="text-sm text-ink-muted leading-relaxed">
                这项整理不是卖一个术语，也不是帮你搭全套自动化。它解决的是：你现在这条业务链里，AI 应该先接哪里，怎么从一个环节开始跑通。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ['适合的人', '已经在做内容、沟通、销售、资料整理的人。'],
              ['先做什么', '先拿一个真实任务来，不从空想问题开始。'],
              ['交付形式', '一次深度判断 + 工作流骨架 + 提示词框架。'],
              ['明确不做', '不代开发、不承诺一次性自动化全流程。'],
            ].map(([title, desc]) => (
              <div key={title} className="border border-border bg-surface-warm p-5">
                <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">{title}</p>
                <p className="text-sm text-ink leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">先自己跑一轮</p>
          <h2 className="text-lg font-semibold text-ink mb-3">如果你还没到付费阶段，先用这两个入口</h2>
          <div className="flex flex-wrap gap-3">
            <CTA href="/tools/prompts" label="去提示词体验场" variant="primary" />
            <CTA href="/resources#ai-neirong-gongzuoliu-tishici-bao" label="先看 AI 工作流提示词包" variant="secondary" />
            <CTA href="/topics#chuantong-hangyeren-zenme-yong-ai" label="先看 AI 实践专题" variant="ghost" />
          </div>
        </section>

        <ServiceCard
          service={aiService}
          index={0}
          relatedArticles={relatedArticles}
        />

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
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">如果你已经准备好了</p>
            <h2 className="text-lg font-semibold text-ink mb-3">直接带一个真实场景来</h2>
            <p className="text-sm text-ink-muted leading-relaxed mb-5">
              最有效的沟通方式不是问“我能不能用 AI”，而是直接告诉我：你现在每天重复做的那件事是什么，它卡在哪里。
            </p>
            <div className="flex flex-wrap gap-3">
              <CTA href="/services/ai-workflow#ai-neirong-xitong-zixun" label="直接看延伸整理卡" variant="primary" />
              <CTA href="/contact" label="先看联系方式" variant="secondary" />
              <CTA href="/services" label="回总服务页" variant="ghost" />
            </div>
          </div>
        </section>
      </Container>
    </>
  )
}
