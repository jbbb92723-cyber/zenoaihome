import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import StructuredData from '@/components/StructuredData'

type ToolRoute = {
  slug: string
  title: string
  problem: string
  primary: { label: string; href: string }
  secondary: { label: string; href: string }
  fallback: { label: string; href: string }
}

export const metadata: Metadata = {
  title: '按问题找工具，不用先研究栏目',
  description:
    '从报价单、预算、施工验收到真实居住和 AI 工作流，按你当前的问题找到最合适的工具、清单和资料。',
  alternates: {
    canonical: 'https://zenoaihome.com/tools',
  },
}

const toolRoutes: ToolRoute[] = [
  {
    slug: 'quote',
    title: '我正在看报价单',
    problem: '先把没写清楚的地方标出来，再决定签不签。',
    primary: { label: '预算风险自测', href: '/tools/budget-risk' },
    secondary: { label: '报价审核清单', href: '/resources#baojia-shenhe-qingdan' },
    fallback: { label: '报价单审核服务', href: '/services#baojia-shenhe' },
  },
  {
    slug: 'budget',
    title: '我怕装修超预算',
    problem: '先判断你最容易失控的是哪一块，再谈要不要缩减。',
    primary: { label: '预算风险自测', href: '/tools/budget-risk' },
    secondary: { label: '装修预算模板', href: '/resources#zhuangxiu-yusuan-moban' },
    fallback: { label: '装修预算咨询', href: '/services#yusuan-zixun' },
  },
  {
    slug: 'construction',
    title: '我已经开工，不知道怎么验收',
    problem: '节点验收比竣工总验更关键，先把该拍和该记的跑起来。',
    primary: { label: '验收清单', href: '/resources#yanshou-qingdan' },
    secondary: { label: '施工判断专题', href: '/topics#shi-zhu-pai-zhuangxiu' },
    fallback: { label: '先看服务边界', href: '/services' },
  },
  {
    slug: 'living',
    title: '我不想把家装成样板间',
    problem: '先把真实生活需求写清，再谈风格参考和预算分配。',
    primary: { label: '实住派自查表', href: '/resources#shizhu-pai-zijian-biao' },
    secondary: { label: '真实居住专题', href: '/topics#shi-zhu-pai-zhuangxiu' },
    fallback: { label: '真实居住派装修服务', href: '/services#shi-zhu-pai-zhuangxiu' },
  },
  {
    slug: 'ai',
    title: '我是传统行业人，想用 AI',
    problem: '先把一个真实任务跑通，再谈系统化和资产化。',
    primary: { label: 'AI 提示词体验场', href: '/tools/prompts' },
    secondary: { label: 'AI 工作流提示词包', href: '/resources#ai-neirong-gongzuoliu-tishici-bao' },
    fallback: { label: 'AI 内容系统咨询', href: '/services#ai-neirong-xitong-zixun' },
  },
]

export default function ToolsPage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: '按问题找工具',
          url: 'https://zenoaihome.com/tools',
          description: '按问题组织的工具、清单和资料入口页。',
          inLanguage: 'zh-CN',
        }}
      />

      <PageHero
        label="工具总入口"
        title="按问题找工具，不用先研究栏目"
        subtitle="你现在卡在哪，就先从那一格开始。这里不按站长栏目分，而是按你眼下要解决的问题分。"
        note="先用工具和清单建立判断，再决定要不要买资料、要不要找我。"
        size="content"
      />

      <Container size="content" className="py-section">
        <div className="grid gap-5 lg:grid-cols-2">
          {toolRoutes.map((route) => (
            <section key={route.slug} id={route.slug} className="border border-border bg-surface overflow-hidden scroll-mt-20">
              <div className="border-b border-border bg-surface-warm px-6 py-5">
                <h2 className="text-lg font-semibold text-ink mb-2">{route.title}</h2>
                <p className="text-sm text-ink-muted leading-relaxed">{route.problem}</p>
              </div>
              <div className="px-6 py-6 space-y-4">
                <div>
                  <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">先做这个</p>
                  <CTA href={route.primary.href} label={route.primary.label} variant="primary" />
                </div>
                <div>
                  <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">再补这一份</p>
                  <CTA href={route.secondary.href} label={route.secondary.label} variant="secondary" />
                </div>
                <div>
                  <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">工具还不够时</p>
                  <Link href={route.fallback.href} className="text-sm text-stone hover:underline underline-offset-2">
                    {route.fallback.label} →
                  </Link>
                </div>
              </div>
            </section>
          ))}
        </div>

        <section className="mt-14 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="page-label mb-3">继续往下</p>
          <h2 className="section-heading mb-3">想看更完整的工具和资料，再进资料库</h2>
          <p className="text-sm text-ink-muted leading-relaxed max-w-2xl mb-5">
            这个页面先帮你决定“先点哪里”。如果你已经知道自己要找预算模板、验收清单、实住自查表或 AI 工作流包，可以直接进入完整资料库。
          </p>
          <div className="flex flex-wrap gap-3">
            <CTA href="/resources" label="进入完整资料库" variant="primary" />
            <CTA href="/start" label="回到从这里开始" variant="secondary" />
            <CTA href="/cases" label="看案例复盘" variant="ghost" />
          </div>
        </section>
      </Container>
    </>
  )
}