import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import PageHero from '@/components/PageHero'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'AI 升级装修行业 | ZenoAIHome',
  description: '从 16 年装修现场经验出发，探索传统装修行业如何用 AI 做报价判断、客户沟通、内容系统和服务升级。',
  alternates: {
    canonical: 'https://zenoaihome.com/ai',
  },
}

const tracks = [
  {
    label: 'AI 工具',
    title: '先把一个真实任务跑通',
    desc: '报价追问、客户沟通、施工留痕、内容选题，先选一个高频任务，不要一上来做大系统。',
    href: '/tools/prompts',
    action: '打开 AI 场景生成器',
  },
  {
    label: '方法论',
    title: '传统行业用 AI，不是追工具，而是重排流程',
    desc: '先找到重复劳动，再写成可复用提示词和 SOP，最后才谈自动化。',
    href: '/blog/04-wei-shenme-wo-kaishi-renzheng-xue-ai',
    action: '看 AI 实践文章',
  },
  {
    label: '装修判断',
    title: '把工地经验变成可复用的判断力系统',
    desc: '报价、预算、合同、施工和验收，本质上都可以被拆成输入、判断规则和输出建议。',
    href: '/tools/quote-check',
    action: '试报价初筛工具',
  },
  {
    label: '服务升级',
    title: '当工具跑通后，再把经验整理成服务和产品',
    desc: '提示词、清单、课程、咨询和数字产品，都是把现场经验规模化的方式。',
    href: '/services/ai-workflow',
    action: '看 AI 工作流咨询',
  },
]

const roadmap = [
  ['第一步', '选一个真实场景', '不要先研究所有 AI 工具，先拿一个正在发生的任务。'],
  ['第二步', '写成可重复输入', '把客户问题、报价信息、施工节点或内容主题整理成稳定输入格式。'],
  ['第三步', '让 AI 产出草稿', '先让 AI 做分析、清单、追问、结构和初稿，不让它替你做最终判断。'],
  ['第四步', '用现场经验校准', '真正的价值在你校准结果，而不是复制一段看起来聪明的话。'],
  ['第五步', '沉淀成产品', '把可复用的流程做成工具、模板、课程、咨询或数字产品。'],
]

export default function AIPage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'AI 升级装修行业',
          url: 'https://zenoaihome.com/ai',
          description: '传统装修行业使用 AI 的工具、方法、经验和服务入口。',
          inLanguage: 'zh-CN',
        }}
      />

      <PageHero
        label="AI 升级"
        title="我不是离开装修去谈 AI，而是从装修现场长出 AI 判断力系统"
        subtitle="这里记录我怎么把 16 年装修经验，接进 AI 工具、内容系统、客户沟通、报价判断和数字产品。AI 不是噱头，是把经验变成可复用资产的方法。"
        note="先从真实任务开始：报价怎么看、客户怎么问、内容怎么写、服务怎么交付。"
        size="content"
      />

      <Container size="content" className="py-section">
        <section className="grid gap-4 md:grid-cols-2">
          {tracks.map((track) => (
            <Link key={track.title} href={track.href} className="group border border-border bg-surface p-6 transition-all duration-150 hover:-translate-y-1 hover:border-stone hover:bg-surface-warm hover:shadow-[0_18px_46px_rgba(42,39,35,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone">{track.label}</p>
              <h2 className="mt-3 text-lg font-semibold text-ink group-hover:text-stone">{track.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{track.desc}</p>
              <p className="mt-5 text-sm font-semibold text-stone">{track.action} -&gt;</p>
            </Link>
          ))}
        </section>

        <section className="mt-14 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">Roadmap</p>
          <h2 className="mt-3 text-xl font-semibold text-ink">传统装修行业用 AI 的五步路</h2>
          <div className="mt-7 grid gap-3">
            {roadmap.map(([step, title, desc]) => (
              <div key={step} className="grid gap-3 border border-border bg-canvas p-4 sm:grid-cols-[7rem_1fr]">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone">{step}</p>
                <div>
                  <h3 className="text-sm font-semibold text-ink">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-5 lg:grid-cols-[1fr_0.72fr]">
          <div className="border border-border bg-surface p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">What I Will Share</p>
            <h2 className="mt-3 text-lg font-semibold text-ink">这个板块会持续沉淀什么</h2>
            <div className="mt-5 grid gap-3 text-sm leading-relaxed text-ink-muted sm:grid-cols-2">
              <p>AI 工具真实使用体验，不做工具广告。</p>
              <p>装修行业客户沟通、报价判断、内容系统的提示词。</p>
              <p>把现场经验变成 SOP、清单和数字产品的方法。</p>
              <p>一人公司如何用 AI 放大交付，而不是制造虚假繁忙。</p>
            </div>
          </div>

          <div className="border border-border bg-stone text-white p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/65">Start</p>
            <h2 className="mt-3 text-lg font-semibold">先用一个工具跑起来</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/76">
              你不需要先理解所有 AI 概念。选一个具体场景，把你的真实情况填进去，生成第一版可执行提示词。
            </p>
            <Link href="/tools/prompts" className="mt-6 inline-flex h-10 items-center bg-white px-4 text-sm font-semibold text-stone hover:bg-white/90">
              打开 AI 场景生成器
            </Link>
          </div>
        </section>
      </Container>
    </>
  )
}
