import type { Metadata } from 'next'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: '从这里开始',
  description:
    '别乱逛，先找到你的问题。报价、预算、施工、居住场景——哪个最急从哪个进。',
  alternates: {
    canonical: 'https://zenoaihome.com/start',
  },
}

const paths = [
  {
    id: 'quote',
    label: '签约前',
    title: '报价单拿到了，看不清风险',
    time: '10–20 分钟',
    description: '先用工具过一轮，再决定要不要人工判断。',
    nudge: '报价卡住了看快审，合同预算一起卡了看决策包。',
    tool: { label: '报价初筛工具', href: '/tools/quote-check' },
    checklist: { label: '报价审核清单', href: '/resources#baojia-shenhe-qingdan' },
    article: { label: '报价避坑指南（¥39）', href: '/pricing/baojia-guide' },
    service: { label: '签约前决策包', href: '/services/renovation#qianyue-qian-juece-bao' },
  },
  {
    id: 'budget',
    label: '预算分配',
    title: '总数有了，不知道怎么分',
    time: '5–8 分钟',
    description: '按取向拆钱，再查哪里容易超。',
    nudge: '分完还不知道砍哪里，进预算取舍诊断。',
    tool: { label: '预算分配工具', href: '/tools/budget-structure' },
    checklist: { label: '装修预算模板', href: '/resources#zhuangxiu-yusuan-moban' },
    article: { label: '超预算原因自测', href: '/tools/budget-risk' },
    service: { label: '预算取舍诊断', href: '/services/renovation#yusuan-zixun' },
  },
  {
    id: 'construction',
    label: '施工中',
    title: '开工了，不知道每个节点盯什么',
    time: '15 分钟',
    description: '水电、泥工、木作、油漆，每个阶段都有检查口。',
    nudge: '现场有争议，先拍照留痕，再决定要不要介入。',
    tool: { label: '施工节点入口', href: '/resources#construction-checkpoints' },
    checklist: { label: '留痕与验收清单', href: '/resources#yanshou-qingdan' },
    article: { label: '从工地看世界', href: '/blog/03-cong-gongdi-kan-shijie' },
    service: { label: '提交现场判断', href: '/services#service-form' },
  },
  {
    id: 'living',
    label: '居住场景',
    title: '怕的不是风格不像，是住进去不顺手',
    time: '20–30 分钟',
    description: '先写清真实需求，再回头看方案。',
    nudge: '风格和生活打架时，用居住场景重排优先级。',
    tool: { label: '居住场景自查表', href: '/resources#shizhu-pai-zijian-biao' },
    checklist: { label: '入住前后复盘表', href: '/resources#living-beyond-completion' },
    article: { label: '家不是样板间', href: '/blog/02-jia-bu-shi-yangban-jian' },
    service: { label: '居住场景装修服务', href: '/services/renovation#shi-zhu-pai-zhuangxiu' },
  },
  {
    id: 'ai',
    label: '传统行业 + AI',
    title: '想把 AI 接进业务，不想先陷进工具堆',
    time: '15 分钟',
    description: '拿一个真实任务跑一轮，再决定要不要做工作流。',
    nudge: '有稳定业务和真实任务，再谈流程和知识库。',
    tool: { label: '提示词体验场', href: '/tools/prompts' },
    checklist: { label: '内容资产 SOP', href: '/resources#content-system-sop' },
    article: { label: '为什么我开始认真学 AI', href: '/blog/04-wei-shenme-wo-kaishi-renzheng-xue-ai' },
    service: { label: 'AI 工作流咨询', href: '/services/ai-workflow' },
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
        title="别乱逛，先找到你的问题"
        subtitle="报价看不懂、预算分不清、开工了不知道盯什么——哪个最急，就从哪个进。"
        note="已经确定要人工判断的，直接去服务页。还没想清楚的，先往下看。"
        size="content"
      />

      <Container size="content" className="py-section">
        <div className="space-y-6">
          {paths.map((path, index) => (
            <section key={path.id} id={path.id} className="border border-border bg-surface overflow-hidden scroll-mt-24">
              <div className="px-6 py-5 border-b border-border flex items-start gap-4 bg-surface-warm">
                <span className="text-2xl font-light leading-none shrink-0 mt-0.5 text-stone/40">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest">{path.label}</p>
                    <span className="text-xs text-ink-faint">·</span>
                    <p className="text-xs text-ink-faint">{path.time}</p>
                  </div>
                  <h2 className="text-lg font-semibold text-ink leading-snug">{path.title}</h2>
                </div>
              </div>

              <div className="p-6 sm:p-7 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-start">
                <div className="space-y-3">
                  <p className="text-sm text-ink-muted leading-relaxed">{path.description}</p>
                  <p className="text-xs text-ink-faint leading-relaxed">{path.nudge}</p>
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
          <h2 className="text-lg font-semibold text-ink mb-3">还不确定——先去工具页跑一轮，再回来看要不要服务</h2>
          <p className="text-sm text-ink-muted leading-relaxed mb-5">
            工具把问题缩小，资料给你第一轮拓手。服务只在你已经知道“问题大概在哪”的时候再进。
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
