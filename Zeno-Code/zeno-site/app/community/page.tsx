import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import StructuredData from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: '星火者共同体｜AI 时代 OPC 一人公司的实践与协作',
  description: '赞诺发起的申请制 90 天实践共同体。面向正在推进具体事情的一人公司、转型创业者和独立实践者，通过真实问题、案例复盘和有限连接验证协作。',
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
  { code: '01', title: '申请', body: '说明你正在做什么、90 天目标、能提供什么和希望连接谁。' },
  { code: '02', title: '面聊', body: '与发起人进行一次约 15 分钟交流，确认目标、投入和边界。' },
  { code: '03', title: '点火', body: '进入后 24 小时内完成自我介绍，让其他成员知道如何与你连接。' },
  { code: '04', title: '参与', body: '首周完成实践档案，之后带着真实问题参与工作会、回应和复盘。' },
]

const mechanisms = [
  { title: '真实问题工作会', status: '每月一次', body: '成员带来正在推进的具体问题。先补事实和约束，再形成一个能在会后执行的下一步。' },
  { title: '案例共读与复盘', status: '每月一次', body: '围绕成员案例或一份共同材料讨论，留下问题清单、判断过程和可复用的实践记录。' },
  { title: '有上下文的连接', status: '每人一次请求', body: '90 天内可提出一次连接请求。只有匹配度与双方意愿成立时才介绍，不交换通讯录，不保证形成合作。' },
  { title: '共燃项目机会', status: '机会权益', body: '有合适项目才启动，另行写清目标、角色、周期、责任和结算。共同体不保证项目数量、收入或结果。' },
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
          <p className="text-sm font-semibold text-white/55">AI 时代 OPC 一人公司的实践共同体</p>
          <h1 className="editorial-display mt-5 max-w-[13ch] text-[2.4rem] leading-[1.1] sm:text-[3.2rem]">星火者</h1>
          <div className="mt-10 grid gap-8 border-t border-white/20 pt-8 lg:grid-cols-[0.62fr_0.38fr]">
            <div>
              <p className="max-w-3xl text-xl leading-9 text-white sm:text-2xl sm:leading-10">独立经营，但不孤立。带着正在做的事进来，用 90 天验证一次真实推进。</p>
              <Link
                href="#join"
                className="motion-press mt-7 inline-flex min-h-11 items-center border border-white/35 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-ink"
              >
                查看首期招募
              </Link>
            </div>
            <p className="text-sm leading-7 text-white/65">面向 AI 时代的一人公司、转型创业者和独立实践者。不是围观群，也不是只靠发起人输出的课堂，而是围绕真实问题形成反馈、连接和复盘。</p>
          </div>
        </div>
      </section>

      <Container className="py-16 sm:py-20 lg:py-24">
        <section className="grid gap-12 lg:grid-cols-[0.34fr_0.66fr]">
          <div>
            <p className="text-sm font-semibold text-stone">为什么需要共同体</p>
            <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.2rem] lg:text-[2.6rem]">一个人可以开始，但很难独自形成闭环。</h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-ink-muted">
            <p>AI 降低了生产门槛，却没有自动解决方向、信用、客户、协作和持续行动。很多一人公司不是能力不够，而是长期缺少反馈、连接和共同完成真实项目的环境。</p>
            <p>星火者共同体想做的不是制造热闹，而是让成员逐渐说清三件事：我正在做什么、我能提供什么、下一步需要谁或什么帮助。</p>
            <p className="font-semibold text-ink">在 ZenoAIHome 中，公开内容负责把判断开放出来，项目服务对具体交付承担责任，星火者则用 90 天验证一群实践者能否形成有效反馈、连接和协作。</p>
          </div>
        </section>

        <section className="mt-20 border-y border-border py-12 sm:mt-24 sm:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-stone">共同体运行机制</p>
            <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.2rem] lg:text-[2.6rem]">先把真实问题推进，再判断能否一起做事。</h2>
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
            <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.2rem] lg:text-[2.6rem]">先判断彼此是否适合。</h2>
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
            <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.2rem] lg:text-[2.6rem]">有门槛，但不看漂亮简历。</h2>
            <p className="mt-5 text-sm leading-7 text-ink-muted">更看重真实行动、合作边界和可投入时间。首期 8-10 人，至少 6 人确认后启动。</p>
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

        <section id="join" className="mt-16 scroll-mt-24 border-2 border-stone bg-surface-warm p-7 sm:mt-20 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.58fr_0.42fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-stone">首期验证招募</p>
              <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.2rem] lg:text-[2.6rem]">8-10 位实践者，用 90 天验证一次真实推进。</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-2xl font-bold text-ink">¥1,499</p>
                  <p className="text-xs text-ink-muted mt-1">90 天 · 单一验证价</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-ink">8-10 人</p>
                  <p className="text-xs text-ink-muted mt-1">至少 6 人开营</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-ink">72h</p>
                  <p className="text-xs text-ink-muted mt-1">无条件退款</p>
                </div>
              </div>
              <p className="mt-5 max-w-xl text-sm leading-7 text-ink-muted">
                每月一次真实问题工作会、一次案例共读与复盘。每位成员建立实践档案，并可提出一次有上下文的连接请求。不做课，不卖资料，不承诺即时答疑。
              </p>
              <p className="mt-3 max-w-xl text-xs leading-6 text-ink-muted">共燃项目属于机会权益，不保证项目、客户、收入或合作结果；企业服务由广西赞诺数智科技有限公司另行报价、签约和结算。</p>
              <p className="mt-4 max-w-xl border-l-2 border-stone/40 pl-4 text-xs leading-6 text-ink-muted">
                发起人 Zeno 同时担任{' '}
                <a
                  href="https://www.opcquan.com/local#city-%E5%8D%97%E5%AE%81"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-ink underline decoration-border underline-offset-4 hover:decoration-stone"
                >
                  OPC 圈南宁城市主理人
                </a>
                ，持续连接南宁及全国的一人公司实践者与协作资源。
              </p>
            </div>
            <div className="lg:text-right">
              <p className="text-sm font-semibold text-ink mb-3">申请方式</p>
              <p className="text-sm leading-7 text-ink-muted mb-5">
                在线提交你正在做的事、能提供的能力和当前需要。初筛通过后再进行 15 分钟面聊，双向选择。
              </p>
              <Link href="/community/apply" className="motion-press inline-flex min-h-11 items-center rounded-[7px] bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-stone-deep">
                提交成员申请 →
              </Link>
            </div>
          </div>
        </section>
      </Container>
    </main>
  )
}
