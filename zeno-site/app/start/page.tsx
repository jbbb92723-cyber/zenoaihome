import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: '装修判断｜从看人到看居住，6 个阶段的判断系统',
  description:
    '装修判断不是「选个公司」那么简单。从看人、看钱、看合同、看施工、看验收到看居住——6 个阶段，每一步都有判断标准。',
  alternates: { canonical: 'https://zenoaihome.com/start' },
}

const stages = [
  {
    n: '01',
    id: 'people',
    label: '先看人',
    title: '装修公司、设计师、工长、师傅怎么判断',
    core: '找谁做，决定了后面的报价能不能信、合同有没有用、工地能不能盯。',
    href: '/start/people',
  },
  {
    n: '02',
    id: 'budget',
    label: '再看钱',
    title: '装修预算和报价怎么定',
    core: '预算是你的底线，报价是对方的开口。两者之间的差，就是你要建立的判断力。',
    href: '/start/budget',
  },
  {
    n: '03',
    id: 'contract',
    label: '再看合同',
    title: '装修合同怎么审、口头承诺怎么落字',
    core: '签完合同你就失去主动权。所有口头承诺、付款节点、增项规则必须签前写进去。',
    href: '/start/contract',
  },
  {
    n: '04',
    id: 'build',
    label: '再看施工',
    title: '工地怎么盯、变更怎么留痕',
    core: '不是天天泡工地，是按节点去——水电、防水、瓦工、木油，每个节点知道看什么。',
    href: '/start/build',
  },
  {
    n: '05',
    id: 'inspect',
    label: '再看验收',
    title: '装修验收怎么做、质保怎么写',
    core: '验收前是甲方，签字后是乙方。把质保、整改、售后全部锁死再签字。',
    href: '/start/inspect',
  },
  {
    n: '06',
    id: 'living',
    label: '再看居住',
    title: '装修对居住体验的影响',
    core: '装修的终点不是交工，是住得顺手。先写真实生活场景，再回头看方案。',
    href: '/start/living',
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
            name: '装修判断',
            url: 'https://zenoaihome.com/start',
            description: '从看人到看居住的 6 阶段装修判断系统。',
            inLanguage: 'zh-CN',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: '装修判断 6 阶段',
            itemListElement: stages.map((s, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: s.title,
              url: `https://zenoaihome.com${s.href}`,
            })),
          },
        ]}
      />

      {/* Hero */}
      <div className="pt-14 sm:pt-20 pb-12 sm:pb-16 border-b border-border bg-surface-warm">
        <Container size="content">
          <p className="page-label mb-5">装修判断</p>
          <h1 className="page-title mb-6">
            在签约前看懂装修，<br className="hidden sm:block" />
            从这 6 步开始
          </h1>
          <p className="text-base sm:text-lg text-ink-muted leading-[1.8] max-w-2xl">
            装修不是「选个公司就完事」。它是一条决策链：先看人、再看钱、再看合同、再看施工、再看验收、最后看你能不能住得顺手。
            每一步都有判断标准——这套系统就是把这些标准一次性给你。
          </p>
          <p className="mt-5 text-sm text-ink-faint leading-relaxed max-w-xl">
            不需要按顺序看完。卡在哪一步，就从哪一步开始。
          </p>
        </Container>
      </div>

      {/* 决策时间线 */}
      <Container size="content" className="py-section">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-3">
            装修判断 · 6 个阶段
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-ink leading-tight">
            按用户视角排，不是按职业角色排
          </h2>
        </div>

        <ol className="relative border-l border-border ml-3 sm:ml-4 space-y-px">
          {stages.map((s) => (
            <li key={s.id} id={s.id} className="relative pl-8 sm:pl-10 scroll-mt-24">
              <span className="absolute left-0 top-7 -translate-x-1/2 w-3 h-3 bg-surface border-2 border-stone rounded-full" />

              <Link
                href={s.href}
                className="group block border border-border bg-surface hover:border-stone transition-colors p-6 sm:p-7 -ml-px mb-3"
              >
                <div className="flex items-start gap-5">
                  <span className="text-3xl sm:text-4xl font-light text-stone/30 leading-none shrink-0 mt-1 group-hover:text-stone/60 transition-colors">
                    {s.n}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">
                      {s.label}
                    </p>
                    <h3 className="text-lg sm:text-xl font-semibold text-ink leading-snug mb-3 group-hover:text-stone transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                      {s.core}
                    </p>
                    <p className="mt-4 text-xs text-stone font-semibold group-hover:underline">
                      进入这一步 →
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </Container>

      {/* 底部：AI 工具 + 服务 */}
      <div className="border-t border-border bg-surface-warm">
        <Container size="content" className="py-section">
          <div className="grid sm:grid-cols-2 gap-px bg-border border border-border">
            <div className="bg-surface p-6 sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-faint mb-3">
                方法层
              </p>
              <h3 className="text-lg font-semibold text-ink mb-3">AI 工具帮你更快看懂</h3>
              <p className="text-sm text-ink-muted leading-relaxed mb-5">
                报价初筛、预算分配、超预算自测、验收向导——把判断动作交给工具先跑一轮。
              </p>
              <CTA href="/tools" label="去 AI 工具" variant="secondary" />
            </div>
            <div className="bg-surface p-6 sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-faint mb-3">
                承接层
              </p>
              <h3 className="text-lg font-semibold text-ink mb-3">卡住了，我直接帮你判断</h3>
              <p className="text-sm text-ink-muted leading-relaxed mb-5">
                报价审、合同审、预算诊断、居住场景装修——人工服务只在你已经知道「问题大概在哪」时再用。
              </p>
              <CTA href="/services" label="看服务" variant="secondary" />
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}
