import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import StructuredData from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: '赞诺·星火者共同体｜AI时代的一人公司协作网络',
  description: '赞诺发起、但能独立运转的成员共同体。面向AI时代的一人公司、转型创业者和独立实践者，围绕学习、分享、连接与真实项目建立协作。',
  alternates: { canonical: 'https://zenoaihome.com/community' },
}

const principles = [
  { word: '实干', body: '用做过的事说话。问题、过程和结果都可以不完美，但必须真实。' },
  { word: '利他', body: '愿意分享经验、回应问题，也愿意在合适的时候替两个人完成连接。' },
  { word: '极致', body: '不要求所有事都做大，只要求自己负责的那一段尽量做深、做透。' },
  { word: '同频', body: '尊重长期主义、真实合作和边界，不把共同体当流量池或收割场。' },
  { word: '连接', body: '知道自己能提供什么、需要什么，让能力、项目和关系真正流动。' },
]

const entrySteps = [
  { code: '01', title: '申请', body: '说明你是谁、在做什么、能提供什么、目前需要什么。' },
  { code: '02', title: '面聊', body: '与发起人或核心成员进行一次约 15 分钟交流，确认彼此预期。' },
  { code: '03', title: '点火', body: '进入后 24 小时内完成自我介绍，让其他成员知道如何与你连接。' },
  { code: '04', title: '参与', body: '首周完成一次分享、回应、读书会或项目交流，从旁观者变成参与者。' },
]

const mechanisms = [
  { title: '火种技能读书会', status: '首个固定机制', body: '不是泛读一本书，而是围绕一项能力共同学习。每期形成主题、实践任务、成员分享和可复用资料。' },
  { title: '火种分享', status: '成员轮值', body: '分享真实项目进展、踩坑复盘和可执行方法。人人都可以是分享者，也必须尊重失败经验。' },
  { title: '引火连接', status: '成员互助', body: '发现两个人可能彼此需要时，主动完成一次有上下文的介绍，而不是丢一个联系方式。' },
  { title: '共燃项目', status: '逐步验证', body: '项目启动前写清目标、角色、周期、交付和分配方式。先用小项目建立信用，再谈长期协作。' },
]

export default function CommunityPage() {
  return (
    <main className="bg-canvas text-ink">
      <StructuredData data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: '赞诺·星火者共同体',
        url: 'https://zenoaihome.com/community',
        description: metadata.description,
        founder: { '@type': 'Person', name: '赞诺', url: 'https://zenoaihome.com/about' },
        areaServed: '中国',
      }} />

      <section className="border-b border-white/10 bg-ink px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1320px]">
          <p className="text-sm font-semibold text-white/55">正在发起</p>
          <h1 className="editorial-display mt-5 max-w-[13ch] text-[3.3rem] leading-[1.02] sm:text-[5.2rem] lg:text-[6.2rem]">赞诺·星火者共同体</h1>
          <div className="mt-10 grid gap-8 border-t border-white/20 pt-8 lg:grid-cols-[0.62fr_0.38fr]">
            <p className="max-w-3xl text-xl leading-9 text-white sm:text-2xl sm:leading-10">赞诺发起，但要能独立运转的成员共同体。</p>
            <p className="text-sm leading-7 text-white/65">面向 AI 时代的一人公司、转型创业者和独立实践者。不是围观群，也不是只靠发起人输出的课堂。</p>
          </div>
        </div>
      </section>

      <Container className="py-16 sm:py-20 lg:py-24">
        <section className="grid gap-12 lg:grid-cols-[0.34fr_0.66fr]">
          <div>
            <p className="text-sm font-semibold text-stone">为什么需要共同体</p>
            <h2 className="editorial-display mt-4 text-[2.5rem] leading-[1.12] sm:text-[3.5rem]">一个人可以开始，但很难独自形成闭环。</h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-ink-muted">
            <p>AI 降低了生产门槛，却没有自动解决方向、信用、客户、协作和持续行动。很多一人公司不是能力不够，而是长期缺少反馈、连接和共同完成真实项目的环境。</p>
            <p>星火者共同体想做的不是制造热闹，而是让成员逐渐说清三件事：我能做什么、我需要什么、别人为什么愿意和我合作。</p>
            <p className="font-semibold text-ink">一人是星火，众人是燎原。共同体存在的价值，是让能力能够彼此点燃，而不是把所有注意力集中到发起人身上。</p>
          </div>
        </section>

        <section className="mt-20 border-y border-border py-12 sm:mt-24 sm:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-stone">共同体机制</p>
            <h2 className="editorial-display mt-4 text-[2.5rem] leading-[1.12] sm:text-[3.5rem]">从学习开始，走向连接和项目。</h2>
          </div>
          <div className="mt-10 grid sm:grid-cols-2">
            {mechanisms.map((item, index) => (
              <article key={item.title} className={`p-6 sm:p-8 ${index < 2 ? 'border-b border-border' : ''} ${index % 2 === 0 ? 'sm:border-r' : ''}`}>
                <p className="text-xs font-semibold text-stone">{item.status}</p>
                <h3 className="mt-3 text-xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-ink-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-12 sm:mt-24 lg:grid-cols-[0.3fr_0.7fr]">
          <div>
            <p className="text-sm font-semibold text-stone">共同信条</p>
            <h2 className="editorial-display mt-4 text-[2.5rem] leading-[1.12] sm:text-[3.5rem]">先判断彼此是否适合。</h2>
          </div>
          <div className="border-t border-border">
            {principles.map((item, index) => (
              <div key={item.word} className="grid gap-3 border-b border-border py-5 sm:grid-cols-[3rem_8rem_1fr] sm:items-baseline">
                <span className="text-xs font-semibold tabular-nums text-ink-faint">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="text-xl font-semibold text-ink">{item.word}</h3>
                <p className="text-sm leading-7 text-ink-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 bg-surface-warm p-7 sm:mt-24 sm:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-stone">如何进入</p>
            <h2 className="editorial-display mt-4 text-[2.5rem] leading-[1.12] sm:text-[3.5rem]">有门槛，但不看漂亮简历。</h2>
            <p className="mt-5 text-sm leading-7 text-ink-muted">更看重真实行动、合作边界和是否愿意贡献。当前处于发起阶段，采用小规模沟通与邀请。</p>
          </div>
          <div className="mt-10 grid border-y border-border sm:grid-cols-2 lg:grid-cols-4">
            {entrySteps.map((item, index) => (
              <div key={item.code} className={`py-6 sm:px-6 ${index < 3 ? 'border-b border-border sm:border-r lg:border-b-0' : ''} ${index === 1 ? 'sm:border-r-0 lg:border-r' : ''}`}>
                <p className="text-xs font-semibold tabular-nums text-stone">{item.code}</p>
                <h3 className="mt-4 text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-ink-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-8 border-y border-border py-10 sm:mt-20 lg:grid-cols-[0.62fr_0.38fr] lg:items-center">
          <div>
            <h2 className="editorial-display text-[2.4rem] leading-[1.12] sm:text-[3.3rem]">先介绍你自己，再谈加入。</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-muted">添加微信时备注“星火者”，并用几句话说明你目前在做什么、能提供什么、需要什么。共同体仍在筹备，是否进入以实际沟通为准。</p>
          </div>
          <div className="lg:text-right">
            <Link href="/contact" className="motion-press inline-flex min-h-11 items-center rounded-[7px] bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-stone-deep">查看联系方式</Link>
          </div>
        </section>
      </Container>
    </main>
  )
}
