import type { Metadata } from 'next'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: '从这里开始',
  description:
    '如果你第一次来到站里，按你当前最具体的问题进入：报价、预算、施工、居住场景，或传统行业里的 AI 工作流。',
  alternates: {
    canonical: 'https://zenoaihome.com/start',
  },
}

const paths = [
  {
    id: 'quote',
    label: '签约前',
    title: '手上已经有报价单，但看不清哪里有风险',
    description: '先用工具、清单和低价指南过一轮，再决定是做报价快审，还是直接把报价、预算和合同一起看。',
    forWho: '适合已经拿到报价单、准备比较或快要签约的人。',
    time: '10-20 分钟完成第一轮初筛。',
    tool: { label: '报价初筛工具', href: '/tools/quote-check' },
    checklist: { label: '报价审核清单', href: '/resources#baojia-shenhe-qingdan' },
    article: { label: '报价避坑指南（¥39）', href: '/pricing/baojia-guide' },
    service: { label: '签约前决策包', href: '/services/renovation#qianyue-qian-juece-bao' },
    serviceAdvice: '如果你只是不确定报价本身，先看报价快审；如果合同、预算和付款节点一起卡住，直接看决策包。',
  },
  {
    id: 'budget',
    label: '预算结构',
    title: '总预算有个数，但不知道钱该怎么分',
    description: '先做一轮预算风险自测，看你当前更像是结构问题、流程问题还是需求问题。',
    forWho: '适合预算有上限，但总被报价、风格、材料和家人意见拉扯的人。',
    time: '8-12 分钟完成自测。',
    tool: { label: '预算风险自测', href: '/tools/budget-risk' },
    checklist: { label: '装修预算模板', href: '/resources#zhuangxiu-yusuan-moban' },
    article: { label: '装修预算为什么总超', href: '/blog/zhuangxiu-yusuan-weishenme-zongchao' },
    service: { label: '预算结构诊断', href: '/services/renovation#yusuan-zixun' },
    serviceAdvice: '如果你已经做了表格但越算越乱，说明需要先重排预算结构。',
  },
  {
    id: 'construction',
    label: '施工中',
    title: '已经开工了，不确定每个节点该盯什么',
    description: '不要等竣工。水电、泥工、木作、油漆都该各有自己的检查口和留痕方式。',
    forWho: '适合已经进场、每天被工地消息推着走的人。',
    time: '先用 15 分钟整理当前节点。',
    tool: { label: '施工节点入口', href: '/resources#construction-checkpoints' },
    checklist: { label: '留痕与验收清单', href: '/resources#yanshou-qingdan' },
    article: { label: '从工地看世界', href: '/blog/03-cong-gongdi-kan-shijie' },
    service: { label: '提交现场判断', href: '/services#service-form' },
    serviceAdvice: '如果现场争议已经出现，先保留照片、聊天记录和节点确认，再判断是否需要介入。',
  },
  {
    id: 'living',
    label: '居住场景',
    title: '最怕的是住进去不顺手，而不是风格不够像',
    description: '先把家庭成员、作息、收纳、做饭、办公这些真实需求写清，再回头判断方案。',
    forWho: '适合不想只照搬效果图、希望房子长期好住的人。',
    time: '20-30 分钟写完第一轮真实需求。',
    tool: { label: '居住场景自查表', href: '/resources#shizhu-pai-zijian-biao' },
    checklist: { label: '入住前后复盘表', href: '/resources#living-beyond-completion' },
    article: { label: '家不是样板间', href: '/blog/02-jia-bu-shi-yangban-jian' },
    service: { label: '居住场景装修服务', href: '/services/renovation#shi-zhu-pai-zhuangxiu' },
    serviceAdvice: '如果你在风格、预算和生活习惯之间摇摆，先用居住场景问题重排优先级。',
  },
  {
    id: 'ai',
    label: '传统行业 + AI',
    title: '想把 AI 用进业务，但不想先陷进工具堆',
    description: '先拿一个真实任务来，跑一轮提示词或流程骨架，再决定要不要做 AI 工作流咨询。',
    forWho: '适合有行业经验、有内容或服务流程，但不知道怎么接进 AI 的人。',
    time: '先用 15 分钟跑一个真实任务。',
    tool: { label: '提示词体验场', href: '/tools/prompts' },
    checklist: { label: '内容资产 SOP', href: '/resources#content-system-sop' },
    article: { label: '为什么我开始认真学 AI', href: '/blog/04-wei-shenme-wo-kaishi-renzheng-xue-ai' },
    service: { label: 'AI 工作流咨询', href: '/services/ai-workflow' },
    serviceAdvice: '如果你已经有稳定业务和真实任务，再谈流程、提示词库和知识库才有意义。',
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
              url: `https://zenoaihome.com${item.tool.href}`,
            })),
          },
        ]}
      />

      <PageHero
        label="从这里开始"
        title="先按问题进，不要一上来全站乱看"
        subtitle="这个页面只做一件事：帮你先确认当前最值得处理的是哪类问题。路径对了，后面的文章、资料和服务才不会混。"
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

              <div className="p-6 sm:p-7 grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-7 items-start">
                <div>
                  <p className="text-sm text-ink-muted leading-relaxed">{path.description}</p>
                  <dl className="mt-5 grid gap-3 text-sm">
                    <div>
                      <dt className="font-semibold text-ink">适合谁</dt>
                      <dd className="mt-1 text-ink-muted leading-relaxed">{path.forWho}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-ink">预计耗时</dt>
                      <dd className="mt-1 text-ink-muted leading-relaxed">{path.time}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-ink">什么时候进入服务</dt>
                      <dd className="mt-1 text-ink-muted leading-relaxed">{path.serviceAdvice}</dd>
                    </div>
                  </dl>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <CTA href={path.tool.href} label={path.tool.label} variant="primary" />
                  <CTA href={path.checklist.href} label={path.checklist.label} variant="secondary" />
                  <CTA href={path.article.href} label={path.article.label} variant="ghost" />
                  <CTA href={path.service.href} label={path.service.label} variant="ghost" />
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
            <CTA href="/services#service-form" label="提交服务需求" variant="ghost" />
          </div>
        </div>
      </Container>
    </>
  )
}
