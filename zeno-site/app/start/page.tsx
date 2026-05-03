import type { Metadata } from 'next'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: '从这里开始',
  description:
    '如果你第一次来到站里，先别横着刷。按你现在最具体的问题进入：报价、预算、施工、真实居住，或传统行业里的 AI 工作流。',
  alternates: {
    canonical: 'https://zenoaihome.com/start',
  },
}

const paths = [
  {
    id: 'quote',
    label: '签约前',
    title: '手上已经有报价单，但看不清哪里有风险',
    description: '先把模糊项、漏项和追问清单理出来，再决定该不该签、该不该继续谈。',
    firstAction: { label: '先拿报价审核清单', href: '/resources#baojia-shenhe-qingdan' },
    secondAction: { label: '直接看报价单审核服务', href: '/services/renovation#baojia-shenhe' },
  },
  {
    id: 'budget',
    label: '预算结构',
    title: '总预算有个数，但不知道钱该怎么分',
    description: '先做一轮预算风险自测，看你当前更像是结构问题、流程问题还是需求问题，再决定拿模板还是直接咨询。',
    firstAction: { label: '先做预算风险自测', href: '/tools/budget-risk' },
    secondAction: { label: '先拿装修预算模板', href: '/resources#zhuangxiu-yusuan-moban' },
  },
  {
    id: 'construction',
    label: '施工中',
    title: '已经开工了，不确定每个节点该盯什么',
    description: '不要等竣工。水电、泥工、木作、油漆都该各有自己的检查口和留痕方式。',
    firstAction: { label: '先看施工节点入口', href: '/resources#construction-checkpoints' },
    secondAction: { label: '先看从工地看世界', href: '/blog/03-cong-gongdi-kan-shijie' },
  },
  {
    id: 'living',
    label: '真实居住',
    title: '最怕的是住进去不顺手，而不是风格不够像',
    description: '先把家庭成员、作息、收纳、做饭、办公这些真实需求写清，再回头判断方案。',
    firstAction: { label: '先看真实居住入口', href: '/resources#living-beyond-completion' },
    secondAction: { label: '先看家不是样板间', href: '/blog/02-jia-bu-shi-yangban-jian' },
  },
  {
    id: 'ai',
    label: '传统行业 + AI',
    title: '想把 AI 用进业务，但不想先陷进工具堆',
    description: '先拿一个真实任务来，跑一轮提示词或流程骨架，再决定要不要做 AI 工作流咨询。',
    firstAction: { label: '先去提示词体验场', href: '/tools/prompts' },
    secondAction: { label: '直接看 AI 工作流咨询', href: '/services/ai-workflow' },
  },
]

export default function StartPage() {
  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: '从这里开始',
            url: 'https://zenoaihome.com/start',
            description: '按具体问题分流的起点页。',
            inLanguage: 'zh-CN',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: '问题入口',
            itemListElement: paths.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.title,
              url: `https://zenoaihome.com${item.firstAction.href}`,
            })),
          },
        ]}
      />

      <PageHero
        label="从这里开始"
        title="先按问题进，不要一上来全站乱看"
        subtitle="这个页面只做一件事：帮你先确认当前最值得先处理的是哪类问题。路径对了，后面的文章、资料和服务才不会混。"
        note="如果你已经很明确自己要人工判断，可以直接去服务页；如果还在摸清问题阶段，就先走下面这些入口。"
        size="content"
      />

      <Container size="content" className="py-section">
        <div className="space-y-6">
          {paths.map((path, index) => (
            <section key={path.id} className="border border-border bg-surface overflow-hidden">
              <div className="px-6 py-5 border-b border-border flex items-start gap-4 bg-surface-warm">
                <span className="text-2xl font-light leading-none shrink-0 mt-0.5 text-stone/40">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">{path.label}</p>
                  <h2 className="text-lg font-semibold text-ink leading-snug">{path.title}</h2>
                </div>
              </div>

              <div className="p-6 sm:p-7 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 items-start">
                <p className="text-sm text-ink-muted leading-relaxed">{path.description}</p>

                <div className="flex flex-wrap gap-3">
                  <CTA href={path.firstAction.href} label={path.firstAction.label} variant="primary" />
                  <CTA href={path.secondAction.href} label={path.secondAction.label} variant="secondary" />
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">如果你还是不确定</p>
          <h2 className="text-lg font-semibold text-ink mb-3">先去工具页和资源页，再回来判断要不要服务</h2>
          <p className="text-sm text-ink-muted leading-relaxed mb-5">
            工具负责把问题缩小，资源负责给你第一轮抓手；服务只在你已经知道“问题大概在哪”，但还需要人直接判断时再进入。
          </p>
          <div className="flex flex-wrap gap-3">
            <CTA href="/tools" label="去工具页" variant="secondary" />
            <CTA href="/resources" label="去资源页" variant="ghost" />
          </div>
        </div>
      </Container>
    </>
  )
}