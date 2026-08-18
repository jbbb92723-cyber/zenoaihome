'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import Reveal from '@/components/ui/Reveal'
import { humanAiProtocol } from '@/data/practice/experiments'
import {
  ArrowRight,
  BookOpenText,
  Briefcase,
  HouseLine,
  Lightning,
  Path,
  PenNib,
  UsersThree,
} from '@phosphor-icons/react'

const practicePaths = [
  {
    icon: HouseLine,
    audience: '准备装修的人',
    title: '签约前，先把报价、合同和付款安排看清楚。',
    body: '从居住需求、总预算和报价单位开始，再检查容易遗漏的项目、模糊约定和责任边界。',
    href: '/renovation',
    action: '进入装修判断',
  },
  {
    icon: Lightning,
    audience: '正在转型的传统行业人',
    title: '看看 AI 怎样进入一项真实工作。',
    body: '我公开记录 AI 如何参与资料整理、版本比较和查漏，也写清哪些判断与责任必须留在人手里。',
    href: '/blog?category=ai',
    action: '看传统行业 AI 实践',
  },
  {
    icon: Briefcase,
    audience: '正在经营一人公司的人',
    title: '把经验、产品和交付重新组织起来。',
    body: '从已有能力和真实任务出发，继续验证内容、工具、服务与协作怎样组成一套可持续的工作方式。',
    href: '/opc-knowledge',
    action: '看一人公司实践',
  },
  {
    icon: UsersThree,
    audience: '想一起实践和协作的人',
    title: '带着自己的项目来，也认识值得合作的人。',
    body: '星火者从小规模付费实践共同体开始，让成员分享、试用、复盘并通过具体行动建立信用。',
    href: '/community',
    action: '了解星火者',
  },
]

const featuredArticles = [
  {
    label: '网站与方向',
    title: 'AI 越强，传统行业的经验越需要被重新整理',
    body: '我为什么从装修行业出发，把 AI、一人公司、网站和星火者放进同一条实践路径。',
    href: '/blog/ai-yue-qiang-chuantong-hangye-jingyan-yue-xuyao-zhengli',
  },
  {
    label: '真实起点',
    title: '四版报价单和几百条聊天记录，让我开始认真用 AI',
    body: 'AI 先整理和比较，判断、追问与最终责任仍然由我承担。',
    href: '/blog/04-wei-shenme-wo-kaishi-renzheng-xue-ai',
  },
  {
    label: '一人公司',
    title: '从装修现场出发，我开始搭一人公司的工作系统',
    body: '不急着离开原来的行业，先把真实项目里的判断整理成内容、工具与最小交付。',
    href: '/blog/zeno-from-renovation-to-opc',
  },
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
              面向 AGI 时代的个人实践
            </p>
            <h1 className="editorial-display mt-5 text-[2.45rem] leading-[1.12] tracking-[0] sm:text-[3.25rem] lg:text-[4rem]">
              <span className="block whitespace-nowrap">我的 AI 转型，</span>
              <span className="block whitespace-nowrap">从传统行业开始。</span>
            </h1>
            <p className="mt-6 max-w-[43rem] text-base font-medium leading-8 text-white/85 sm:text-lg">
              我先在自己熟悉的传统行业里检验 AI，把工作中的判断写成文章、做成工具，并放进真实服务。你可以先阅读和使用，也可以带着问题一起实践。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ActionLink href="/blog/ai-yue-qiang-chuantong-hangye-jingyan-yue-xuyao-zhengli"><BookOpenText size={18} aria-hidden />读我想做的事</ActionLink>
              <ActionLink href="#start-here" secondary><Path size={18} aria-hidden />按你的问题进入</ActionLink>
              <Link href="/about" className="motion-press inline-flex min-h-11 items-center justify-center gap-2 px-3 py-3 text-sm font-semibold text-white/80 transition-colors hover:text-white">
                <PenNib size={18} aria-hidden />认识赞诺
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="start-here" className="scroll-mt-20 border-b border-border px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <Reveal className="mx-auto max-w-[1320px]">
          <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:items-end">
            <div>
              <p className="page-label">从这里开始</p>
              <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.2rem] lg:text-[2.6rem]">先找到和你有关的问题。</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-ink-muted lg:justify-self-end">
              准备装修、传统行业 AI 转型、一人公司和星火者，入口不同。选择你现在面对的问题，不需要先读懂整个网站。
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

      <section className="border-b border-border px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <Reveal className="mx-auto max-w-[1320px]">
          <div className="max-w-3xl">
            <p className="page-label">代表文章</p>
            <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.2rem] lg:text-[2.6rem]">先从这三篇开始。</h2>
            <p className="mt-5 text-base leading-8 text-ink-muted">它们分别说明我想做什么、为什么开始使用 AI，以及怎样从装修现场走向一人公司。</p>
          </div>
          <div className="mt-10 grid border-y border-border sm:grid-cols-3">
            {featuredArticles.map((article, index) => (
              <Link
                key={article.href}
                href={article.href}
                className={`group flex min-h-[19rem] flex-col py-7 sm:p-7 ${index < featuredArticles.length - 1 ? 'border-b border-border sm:border-b-0 sm:border-r' : ''}`}
              >
                <p className="text-xs font-semibold text-stone">{article.label}</p>
                <h3 className="mt-5 text-xl font-semibold leading-8 text-ink">{article.title}</h3>
                <p className="mt-4 text-sm leading-7 text-ink-muted">{article.body}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-semibold text-stone group-hover:text-ink">阅读全文 <ArrowRight size={15} aria-hidden /></span>
              </Link>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-stone">查看全部文章 <ArrowRight size={16} aria-hidden /></Link>
            <Link href="/ai-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-stone hover:text-ink">使用公开工具 <ArrowRight size={16} aria-hidden /></Link>
          </div>
        </Reveal>
      </section>

      <section className="border-b border-border bg-ink px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <Reveal className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.38fr_0.62fr]">
          <div>
            <p className="text-sm font-semibold text-white/55">我怎么和 AI 一起工作</p>
            <h2 className="editorial-display mt-4 max-w-[16ch] text-[1.8rem] leading-[1.15] sm:text-[2.2rem] lg:text-[2.6rem]">我先判断，AI 帮我整理和质疑。</h2>
            <p className="mt-5 max-w-md text-base leading-8 text-white/65">AI 可以加快整理、比较和查漏。最后的取舍、表达与责任仍然由我承担。</p>
            <Link href="/practice" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-white/70">
              查看实践与证据 <ArrowRight size={16} aria-hidden />
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

      <section className="bg-surface-warm px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <Reveal className="mx-auto max-w-[1320px]">
          <div className="max-w-3xl">
            <p className="page-label">继续往前</p>
            <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.2rem] lg:text-[2.6rem]">需要更多投入时，有两种方式。</h2>
          </div>
          <div className="mt-10 grid border-y border-border lg:grid-cols-2">
            <div className="border-b border-border py-8 lg:border-b-0 lg:border-r lg:pr-10">
              <p className="text-sm font-semibold text-stone">项目合作</p>
              <h3 className="editorial-display mt-4 text-[1.65rem] leading-[1.2] sm:text-[1.9rem]">一起完成一项具体工作。</h3>
              <p className="mt-5 max-w-xl text-sm leading-7 text-ink-muted">如果你已有明确问题和材料，可以围绕知识库、AI 协作流程、任务型智能体或网站与内容系统，先写清范围、交付和验收。</p>
              <Link href="/services" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-stone">查看合作方式 <ArrowRight size={16} aria-hidden /></Link>
            </div>
            <div className="py-8 lg:pl-10">
              <p className="text-sm font-semibold text-stone">星火者</p>
              <h3 className="editorial-display mt-4 text-[1.65rem] leading-[1.2] sm:text-[1.9rem]">在长期实践中建立连接。</h3>
              <p className="mt-5 max-w-xl text-sm leading-7 text-ink-muted">星火者当前是小规模付费实践共同体，成员带着真实角色和项目参与；长期方向是 AI 时代 OPC 一人公司的分布式协作网络。</p>
              <Link href="/community" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-stone">了解星火者 <ArrowRight size={16} aria-hidden /></Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
