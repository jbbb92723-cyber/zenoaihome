import type { Metadata } from 'next'
import Image from 'next/image'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import ServiceCard from '@/components/ServiceCard'
import StructuredData from '@/components/StructuredData'
import { services } from '@/data/services'

export const metadata: Metadata = {
  title: 'AI 工作流咨询：先跑通一个真实场景，再谈系统',
  description:
    '给传统行业人的 AI 工作流与内容系统入口。先看是否适合你，再决定要不要做一对一咨询。',
  alternates: {
    canonical: 'https://zenoaihome.com/services/ai-workflow',
  },
}

const aiService = services.find((service) => service.slug === 'ai-neirong-xitong-zixun')

const faqs = [
  {
    question: '什么样的传统行业人适合来做 AI 工作流咨询？',
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

export default function AIWorkflowPage() {
  if (!aiService) return null

  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'AI 工作流咨询',
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
        label="AI 工作流咨询"
        title="先跑通一个真实场景，再谈系统"
        subtitle="这条入口只给传统行业从业者。重点不是追一个新工具，而是把你已经在做的工作、内容和服务流程接进 AI。"
        note="如果你还在试探阶段，先去体验场；如果你已经在反复试错，才值得做一对一判断。"
        size="content"
      />

      <Container size="content" className="py-section">
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
                这项咨询不是卖一个术语，也不是帮你搭全套自动化。它解决的是：你现在这条业务链里，AI 应该先接哪里，怎么从一个环节开始跑通。
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
          relatedArticles={[
            { label: '为什么我开始认真学 AI', href: '/blog/04-wei-shenme-wo-kaishi-renzheng-xue-ai' },
            { label: '我为什么不想只做一个教人装修的人', href: '/blog/01-wo-wei-shenme-bu-xiang-zhi-zuo-jiaoren-zhuangxiu' },
            { label: '先看 AI 实践专题', href: '/topics#chuantong-hangyeren-zenme-yong-ai' },
          ]}
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
              <CTA href="/services/ai-workflow#ai-neirong-xitong-zixun" label="直接看咨询卡" variant="primary" />
              <CTA href="/contact" label="先看联系方式" variant="secondary" />
              <CTA href="/services" label="回总服务页" variant="ghost" />
            </div>
          </div>
        </section>
      </Container>
    </>
  )
}