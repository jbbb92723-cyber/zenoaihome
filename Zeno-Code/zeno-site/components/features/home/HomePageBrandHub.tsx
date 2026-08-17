'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import Reveal from '@/components/ui/Reveal'
import { currentPractice, humanAiProtocol } from '@/data/practice/experiments'
import {
  ArrowRight,
  BookOpenText,
  Brain,
  Briefcase,
  Browser,
  Database,
  HouseLine,
  Lightning,
  Path,
  PenNib,
  UsersThree,
  Wrench,
} from '@phosphor-icons/react'

const proofPoints = [
  { value: '17年', label: '传统行业经营与项目经验' },
  { value: '1项', label: '当前只推进一项 30 天验证' },
  { value: '4个', label: '从公开判断到共同实践的入口' },
  { value: '4步', label: '人先判断、AI 质疑、交付、复盘' },
]

const practicePaths = [
  {
    icon: BookOpenText,
    audience: '想先看依据的人',
    title: '先看实践和证据，再决定是否使用工具。',
    body: '文章、案例、实验和方法修订公开记录正在发生什么，也明确哪些结论还没有被验证。',
    href: '/practice',
    action: '查看实践与证据',
  },
  {
    icon: HouseLine,
    audience: '正在装修的业主',
    title: '签约前，先把报价、责任和付款顺序看懂。',
    body: '装修是我最深的垂直实践。这里有报价初筛、风险词典、检查清单和真实判断样张。',
    href: '/renovation',
    action: '进入装修判断',
  },
  {
    icon: Path,
    audience: '有真实经验的实践者',
    title: '不再只说“我做过”，把经验变成别人能使用的资产。',
    body: '我以 OPC 一人公司为起点，公开记录经验如何变成案例、内容、判断方法、AI 协作和最小服务。',
    href: '/opc-knowledge',
    action: '进入经验资产化',
  },
  {
    icon: UsersThree,
    audience: '愿意长期实践的人',
    title: '把一次阅读，带进真实项目和可信关系。',
    body: '星火者是申请制实践俱乐部。成员分享、试用、复盘并完成有上下文的连接，不靠热闹证明价值。',
    href: '/community',
    action: '了解星火者共同体',
  },
]

const writingTracks = [
  {
    icon: Lightning,
    title: '传统行业 × AI',
    body: 'AI 怎样进入真实任务，以及哪些判断不能交给 AI。',
    href: '/blog?category=ai',
  },
  {
    icon: UsersThree,
    title: 'OPC 一人公司',
    body: '产品、内容、交付、协作和现金流，以及一个传统行业人如何把自己重新组织起来。',
    href: '/blog?category=opc',
  },
  {
    icon: HouseLine,
    title: '装修判断',
    body: '从报价、合同、付款和现场问题中提炼判断方法，也检验经验能否真正被他人使用。',
    href: '/blog?category=renovation',
  },
]

const services = [
  { icon: Database, title: '企业知识库', body: '把分散资料和隐性经验整理成可检索、可更新的知识入口。', href: '/services#knowledge-base' },
  { icon: Wrench, title: 'AI 协作流程', body: '从一项重复任务开始，搭成团队能够执行和验收的协作流程。', href: '/services#ai-workflow' },
  { icon: Brain, title: '任务型智能体', body: '围绕边界清楚的任务设计、测试并交接，不把它包装成“数字员工”。', href: '/services#ai-agent' },
  { icon: Browser, title: '网站与内容系统', body: '把定位、内容、工具和业务入口组织成可以持续生长的系统。', href: '/services#website' },
]

function ActionLink({ href, children, secondary = false }: { href: string; children: ReactNode; secondary?: boolean }) {
  return (
    <Link
      href={href}
      className={`motion-press inline-flex min-h-11 items-center justify-center gap-2 rounded-[3px] px-5 py-3 text-sm font-semibold transition-colors ${
        secondary
          ? 'border border-white/45 bg-transparent text-white hover:border-white hover:bg-white/10'
          : 'bg-cinnabar text-white hover:bg-cinnabar/92'
      }`}
    >
      {children}
      <ArrowRight size={17} aria-hidden />
    </Link>
  )
}

export default function HomePageBrandHub() {
  return (
    <main className="bg-canvas text-ink">
      <section className="relative isolate min-h-[calc(82dvh-3.5rem)] overflow-hidden bg-ink">
        <Image
          src="/images/brand/zeno-portrait.jpg"
          alt="赞诺 Zeno"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[52%_34%] blur-[1px] brightness-[0.46] contrast-[0.96] saturate-[0.88] sm:object-[60%_35%]"
        />
        <div className="absolute inset-0 bg-ink/45" aria-hidden />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,17,0.88)_0%,rgba(17,17,17,0.58)_56%,rgba(17,17,17,0.22)_88%)]" aria-hidden />
        <div className="relative mx-auto flex min-h-[calc(82dvh-3.5rem)] max-w-[1320px] items-end px-5 pb-12 pt-24 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
          <div className="max-w-[52rem] text-white">
            <p className="flex items-center gap-2.5 text-sm font-semibold text-white/75">
              <span className="inline-block h-2 w-2 shrink-0 bg-cinnabar" aria-hidden />
              赞诺个人 IP × 公开判断 × 人机协作
            </p>
            <h1 className="editorial-display mt-5 text-[2.45rem] leading-[1.12] tracking-[0] sm:text-[3.25rem] lg:text-[4rem]">
              <span className="block">传统行业人的</span>
              <span className="block whitespace-nowrap">AI 胜任力实践</span>
            </h1>
            <p className="mt-5 max-w-[36rem] text-base font-medium leading-7 text-white/90 sm:text-xl sm:leading-8">
              把真实经验，变成可检查、可使用、会修订的判断资产。
            </p>
            <p className="mt-6 max-w-[43rem] text-base leading-8 text-white/75 sm:text-lg">
              我是赞诺。人先提出判断和验收标准，AI 负责质疑、比较和整理，真实使用结果决定下一版。文章、工具、服务和星火者共同体，都从这套实践长出来。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ActionLink href="#current-practice"><Lightning size={18} aria-hidden />看当前实验</ActionLink>
              <ActionLink href="/blog" secondary><BookOpenText size={18} aria-hidden />读公开实践</ActionLink>
              <Link href="/about" className="motion-press inline-flex min-h-11 items-center justify-center gap-2 px-3 py-3 text-sm font-semibold text-white/80 transition-colors hover:text-white">
                <PenNib size={18} aria-hidden />认识赞诺
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface-warm">
        <Reveal className="mx-auto grid max-w-[1320px] grid-cols-2 px-5 sm:px-8 lg:grid-cols-4 lg:px-12">
          {proofPoints.map((item, index) => (
            <div key={item.value} className={`py-7 sm:py-9 ${index % 2 ? 'pl-5' : 'pr-5'} lg:border-r lg:border-border lg:px-6 first:lg:pl-0 last:lg:border-r-0 last:lg:pr-0`}>
              <p className="editorial-display text-[1.8rem] text-ink sm:text-[2.2rem]">{item.value}</p>
              <p className="mt-2 max-w-[15rem] text-xs leading-5 text-ink-muted">{item.label}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section id="current-practice" className="scroll-mt-20 border-b border-border px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <Reveal className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.43fr_0.57fr] lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="page-label">当前实践</p>
              <span className="border border-cinnabar/30 bg-cinnabar/5 px-2.5 py-1 text-xs font-semibold text-cinnabar">{currentPractice.status}</span>
              <span className="border border-border px-2.5 py-1 text-xs font-semibold text-ink-muted">{currentPractice.evidenceStatus}</span>
            </div>
            <h2 className="editorial-display mt-5 max-w-[18ch] text-[1.8rem] leading-[1.15] sm:text-[2.2rem] lg:text-[2.6rem]">{currentPractice.title}</h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-ink-muted">{currentPractice.question}</p>
            <p className="mt-4 max-w-xl border-l-2 border-stone pl-4 text-sm leading-7 text-ink-muted">目标：{currentPractice.goal}</p>
            <div className="mt-7 flex flex-wrap gap-4">
              <Link href="/blog/zeno-from-renovation-to-opc" className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-stone">
                阅读实践起点 <ArrowRight size={16} aria-hidden />
              </Link>
              <Link href="/cases" className="inline-flex items-center gap-2 text-sm font-semibold text-stone hover:text-ink">
                查看方法示例 <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </div>
          <div className="report-sheet p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
              <div>
                <p className="system-label">30-DAY PRACTICE / 01</p>
                <h3 className="mt-3 text-xl font-semibold text-ink">公开进度</h3>
              </div>
              <p className="text-xs text-ink-faint">更新于 {currentPractice.updatedAt}</p>
            </div>
            <div className="mt-6 grid gap-px border border-border bg-border sm:grid-cols-2">
              {currentPractice.metrics.map((metric) => (
                <div key={metric.label} className="min-h-28 bg-surface p-4">
                  <p className="text-xs font-semibold text-ink-faint">{metric.label}</p>
                  <p className="mt-3 text-2xl font-semibold tabular-nums text-ink">
                    {metric.current}<span className="mx-1 text-sm font-normal text-ink-faint">/</span>{metric.target}<span className="ml-1 text-sm font-normal text-ink-muted">{metric.unit}</span>
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 border-l-2 border-cinnabar pl-4">
              <p className="text-xs font-semibold text-ink-faint">下一步</p>
              <p className="mt-2 text-sm leading-7 text-ink-muted">{currentPractice.nextAction}</p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-b border-border px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <Reveal className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.4fr_0.6fr] lg:items-start">
          <div>
            <p className="page-label">创作与 AI 的立场</p>
            <h2 className="editorial-display mt-4 max-w-[16ch] text-[1.8rem] leading-[1.15] sm:text-[2.2rem] lg:text-[2.6rem]">不把真实处境写成一条获客漏斗。</h2>
          </div>
          <div className="border-l-2 border-cinnabar pl-6">
            <p className="text-base leading-8 text-ink-muted">我不反对让真正需要这件事的人找到我。我反对先画一张静态画像，再用固定话术替代具体经验、独立判断和交付证据。</p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              <li className="border-t border-border pt-4 text-sm leading-7 text-ink-muted"><span className="font-semibold text-ink">从处境开始</span><br />先看真实问题，不先给人贴标签。</li>
              <li className="border-t border-border pt-4 text-sm leading-7 text-ink-muted"><span className="font-semibold text-ink">让 AI 参与判断</span><br />让它整理、质疑和查漏，不替人作主。</li>
              <li className="border-t border-border pt-4 text-sm leading-7 text-ink-muted"><span className="font-semibold text-ink">用证据承接合作</span><br />把输入、交付和边界写清，不用结果幻觉成交。</li>
            </ul>
            <Link href="/blog/wo-bu-xiang-ba-ai-zuo-cheng-huoke-jiqi" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-stone">
              读这条立场的完整实践 <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="border-b border-border px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <Reveal className="mx-auto max-w-[1320px]">
          <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:items-end">
            <div>
              <p className="page-label">一套判断，四个入口</p>
              <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.2rem] lg:text-[2.6rem]">从你手里的真问题开始。</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-ink-muted lg:justify-self-end">
              你可以先阅读判断依据，也可以进入装修、经验资产化或星火者。入口不同，但都回到同一件事：把真实问题说清楚，再用行动和反馈修订方法。
            </p>
          </div>
          <div className="mt-10 grid border-y border-border lg:grid-cols-2">
            {practicePaths.map((path, index) => {
              const Icon = path.icon
              return (
                <Link
                  key={path.audience}
                  href={path.href}
                  className={`group flex min-h-[22rem] flex-col p-7 hover:bg-surface-warm sm:p-9 ${index < practicePaths.length - 1 ? 'border-b border-border' : ''} ${index >= 2 ? 'lg:border-b-0' : ''} ${index % 2 === 0 ? 'lg:border-r' : ''}`}
                >
                  <div className="flex items-center gap-3 text-stone">
                    <Icon size={24} weight="duotone" aria-hidden />
                    <p className="text-sm font-semibold">{path.audience}</p>
                  </div>
                  <h3 className="editorial-display mt-7 max-w-[19ch] text-[1.65rem] leading-[1.25] text-ink sm:text-[1.9rem]">{path.title}</h3>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-ink-muted">{path.body}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-stone group-hover:text-ink">
                    {path.action} <ArrowRight size={16} aria-hidden />
                  </span>
                </Link>
              )
            })}
          </div>
        </Reveal>
      </section>

      <section className="border-b border-border bg-ink px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <Reveal className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.38fr_0.62fr]">
          <div>
            <p className="text-sm font-semibold text-white/55">人机协作协议</p>
            <h2 className="editorial-display mt-4 max-w-[16ch] text-[1.8rem] leading-[1.15] sm:text-[2.2rem] lg:text-[2.6rem]">AI 不替我判断，它负责让我看得更清楚。</h2>
            <p className="mt-5 max-w-md text-base leading-8 text-white/65">速度不是唯一目标。原始判断、责任边界和最终决定仍然由人保留。</p>
            <Link href="/blog/04-wei-shenme-wo-kaishi-renzheng-xue-ai" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-white/70">
              阅读这套协议的实践起点 <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <ol className="border-t border-white/15">
            {humanAiProtocol.map((stage) => (
              <li key={stage.code} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-white/15 py-6 sm:grid-cols-[3rem_10rem_1fr] sm:items-start">
                <span className="text-xs font-semibold tabular-nums text-cinnabar">{stage.code}</span>
                <h3 className="text-base font-semibold text-white">{stage.title}</h3>
                <p className="col-start-2 text-sm leading-7 text-white/60 sm:col-start-3">{stage.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section className="border-b border-border px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <Reveal className="mx-auto max-w-[1320px]">
          <div className="max-w-3xl">
            <p className="page-label">公开写作</p>
            <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.2rem] lg:text-[2.6rem]">我长期写的三件事。</h2>
            <p className="mt-5 text-base leading-8 text-ink-muted">这里首先是一个个人博客。写做过的事、犯过的错，以及还在验证中的判断。</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {writingTracks.map((track) => {
              const Icon = track.icon
              return (
                <Link key={track.title} href={track.href} className="group card-hover border border-border bg-surface p-6">
                  <Icon size={24} weight="duotone" className="text-stone" aria-hidden />
                  <h3 className="mt-5 text-lg font-semibold text-ink">{track.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-ink-muted">{track.body}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-stone group-hover:text-ink">继续阅读 <ArrowRight size={15} aria-hidden /></span>
                </Link>
              )
            })}
          </div>
          <Link href="/blog" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-stone">
            查看全部文章 <ArrowRight size={16} aria-hidden />
          </Link>
        </Reveal>
      </section>

      <section className="border-b border-border bg-surface-warm px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <Reveal className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.34fr_0.66fr]">
          <div>
            <p className="page-label">项目合作</p>
            <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.2rem] lg:text-[2.6rem]">需要落地时，再一起做具体工作。</h2>
            <p className="mt-5 max-w-md text-base leading-8 text-ink-muted">服务是公开实践的延伸，不是这个网站存在的唯一目的。先确认问题、材料和验收边界，再决定是否合作。</p>
            <Link href="/services" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-stone">查看合作方式 <ArrowRight size={16} aria-hidden /></Link>
          </div>
          <div className="grid gap-px border border-border bg-border sm:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Link key={service.title} href={service.href} className="group bg-surface p-6 hover:bg-canvas">
                  <Icon size={22} weight="duotone" className="text-stone" aria-hidden />
                  <h3 className="mt-4 text-base font-semibold text-ink">{service.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-ink-muted">{service.body}</p>
                </Link>
              )
            })}
          </div>
        </Reveal>
      </section>

      <section className="border-b border-border px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <Reveal className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-center">
          <div>
            <p className="page-label">星火者</p>
            <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.2rem] lg:text-[2.6rem]">一个人可以开始，但不必一直独自走。</h2>
          </div>
          <div className="border-l-2 border-cinnabar pl-6">
            <p className="text-base leading-8 text-ink-muted">星火者是申请制实践俱乐部。成员从自己的真实角色出发，完成行动、试用和复盘，留下案例、工具与可信的协作记录；它不是围观群，也不是只靠发起人输出的课堂。</p>
            <Link href="/community" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-stone">了解星火者 <ArrowRight size={16} aria-hidden /></Link>
          </div>
        </Reveal>
      </section>

      <section className="bg-surface-warm px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <Reveal className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.58fr_0.42fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3 text-stone"><PenNib size={24} aria-hidden /><span className="text-sm font-semibold">先给价值</span></div>
            <h2 className="editorial-display mt-5 max-w-[18ch] text-[2rem] leading-[1.12] sm:text-[2.5rem] lg:text-[2.8rem]">把能公开的先公开，把需要负责的再做成服务。</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-ink-muted">文章、工具和样张都可以独立使用。它们不要求你先购买，也不让你因为免费得到过什么而感到亏欠。</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link href="/blog" className="motion-press inline-flex min-h-11 items-center justify-center gap-2 rounded-[3px] bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-stone-deep"><BookOpenText size={18} aria-hidden />读文章</Link>
            <Link href="/ai-tools" className="motion-press inline-flex min-h-11 items-center justify-center gap-2 rounded-[3px] border border-border px-5 py-3 text-sm font-semibold text-ink hover:border-stone"><Briefcase size={18} aria-hidden />用工具</Link>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
