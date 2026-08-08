'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Reveal from '@/components/ui/Reveal'
import {
  ArrowRight,
  BookOpenText,
  Brain,
  Briefcase,
  Browser,
  CheckCircle,
  Compass,
  Database,
  HouseLine,
  Lightning,
  PenNib,
  UsersThree,
  Wrench,
} from '@phosphor-icons/react'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
}

const proofPoints = [
  { value: '17年', label: '传统行业经营与项目经验' },
  { value: '20万+', label: '睡宝集团任职期间服务客户' },
  { value: '3000万+', label: '大型装修项目合同金额' },
  { value: '南宁', label: 'OPC 圈城市主理人' },
]

const landingStages = [
  { code: '01', title: '找场景', body: '先找到一个每天重复、资料可得、结果能判断的真实任务。' },
  { code: '02', title: '理经验', body: '把散在文档、聊天和人脑里的经验，整理成规则与样本。' },
  { code: '03', title: '跑流程', body: '让 AI 在一条小流程里工作，用真实输入反复测试。' },
  { code: '04', title: '做交付', body: '写清边界、验收和维护方式，让结果离开个人也能继续用。' },
]

const writingTracks = [
  {
    icon: Lightning,
    title: '传统行业 × AI',
    body: '不追工具清单，记录知识库、工作流、智能体和网站怎样进入真实业务。',
    href: '/blog?category=ai',
  },
  {
    icon: UsersThree,
    title: '一人公司',
    body: '产品、获客、交付、协作，以及一个传统行业人如何把自己重新组织起来。',
    href: '/blog?category=opc',
  },
  {
    icon: HouseLine,
    title: '装修实践',
    body: '17 年一线经验留下的判断方法，也是我把隐性经验结构化的长期样本。',
    href: '/blog?category=renovation',
  },
]

const services = [
  { icon: Database, title: '企业知识库', body: '把分散资料和隐性经验整理成可检索、可更新的知识入口。', href: '/services#knowledge-base' },
  { icon: Wrench, title: '流程自动化', body: '从一项重复任务开始，搭成团队能够执行和验收的流程。', href: '/services#ai-workflow' },
  { icon: Brain, title: '智能体开发', body: '围绕边界清楚的任务设计、测试并交接智能体。', href: '/services#ai-agent' },
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
          alt="赞诺，陈国赞"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[52%_34%] blur-[1px] brightness-[0.46] contrast-[0.96] saturate-[0.88] sm:object-[60%_35%]"
        />
        <div className="absolute inset-0 bg-ink/45" aria-hidden />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,17,0.88)_0%,rgba(17,17,17,0.58)_56%,rgba(17,17,17,0.22)_88%)]" aria-hidden />
        <div className="relative mx-auto flex min-h-[calc(82dvh-3.5rem)] max-w-[1320px] items-end px-5 pb-12 pt-24 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }} className="max-w-[52rem] text-white">
            <motion.p variants={fadeUp} className="flex items-center gap-2.5 text-sm font-semibold text-white/75">
              <span className="inline-block h-2 w-2 shrink-0 bg-cinnabar" aria-hidden />
              传统行业 AI 落地实践者 · OPC 圈南宁城市主理人
            </motion.p>
            <motion.h1 variants={fadeUp} className="editorial-display mt-5 text-[2.6rem] leading-[1.08] sm:text-[3.4rem] lg:text-[4.2rem]">
              赞诺 Zeno
            </motion.h1>
            <motion.p variants={fadeUp} className="editorial-display mt-5 max-w-[18ch] text-[1.65rem] leading-[1.25] text-white/95 sm:text-[2rem]">
              一个从传统行业走进 AI 实践的人。
            </motion.p>
            <motion.p variants={fadeUp} className="mt-6 max-w-[43rem] text-base leading-8 text-white/75 sm:text-lg">
              我把 17 年经营、项目和装修经验带进 AI，持续公开知识库、工作流、智能体、内容系统与一人公司的真实实践。
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ActionLink href="/blog"><BookOpenText size={18} aria-hidden />读公开实践</ActionLink>
              <ActionLink href="/ai-tools" secondary><Compass size={18} aria-hidden />先找到 AI 切入点</ActionLink>
            </motion.div>
          </motion.div>
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

      <section className="border-b border-border px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <Reveal className="mx-auto max-w-[1320px]">
          <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:items-end">
            <div>
              <p className="page-label">差一点</p>
              <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.2rem] lg:text-[2.6rem]">你可能不是不会用 AI，只是还差一个落地点。</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-ink-muted lg:justify-self-end">
              很多项目停在“知道 AI 很重要”。真正往前走，需要依次把场景、经验、流程和交付说清。看看你现在停在哪一步。
            </p>
          </div>
          <ol className="mt-10 grid border-y border-border sm:grid-cols-2 lg:grid-cols-4">
            {landingStages.map((stage, index) => (
              <li key={stage.code} className={`relative p-6 ${index < landingStages.length - 1 ? 'border-b border-border sm:border-r lg:border-b-0' : ''} ${index === 1 ? 'sm:border-r-0 lg:border-r' : ''}`}>
                <p className="text-xs font-semibold tabular-nums text-cinnabar">{stage.code}</p>
                <h3 className="mt-4 text-lg font-semibold text-ink">{stage.title}</h3>
                <p className="mt-3 text-sm leading-7 text-ink-muted">{stage.body}</p>
              </li>
            ))}
          </ol>
          <Link href="/ai-tools/opc-diagnosis" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-stone">
            用 5 分钟看看自己卡在哪 <ArrowRight size={16} aria-hidden />
          </Link>
        </Reveal>
      </section>

      <section className="border-b border-border bg-surface-warm px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <Reveal className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-center">
          <div>
            <p className="page-label">预拥有</p>
            <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.2rem] lg:text-[2.6rem]">先看见一份属于自己的答案。</h2>
            <p className="mt-5 max-w-md text-base leading-8 text-ink-muted">
              免费诊断不会只给一个分数。你会先拿到当前阶段、主要缺口和下一步动作，再决定是否继续找工具、读文章或与人交流。
            </p>
            <Link href="/ai-tools/opc-diagnosis" className="motion-press mt-7 inline-flex min-h-11 items-center gap-2 rounded-[3px] bg-cinnabar px-5 py-3 text-sm font-semibold text-white hover:bg-cinnabar/92">
              生成我的体检报告 <ArrowRight size={17} aria-hidden />
            </Link>
          </div>
          <div className="report-sheet p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
              <div>
                <p className="system-label">OPC REPORT / PREVIEW</p>
                <h3 className="mt-3 text-2xl font-semibold text-ink">你的 AI 落地起点</h3>
              </div>
              <span className="border border-cinnabar/30 bg-cinnabar/5 px-3 py-1 text-xs font-semibold text-cinnabar">示例预览</span>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="border-l-2 border-cinnabar pl-4">
                <p className="text-xs font-semibold text-ink-faint">当前阶段</p>
                <p className="mt-2 text-base font-semibold text-ink">经验已经形成，流程还没跑通</p>
              </div>
              <div className="border-l-2 border-stone-light pl-4">
                <p className="text-xs font-semibold text-ink-faint">主要缺口</p>
                <p className="mt-2 text-base font-semibold text-ink">任务范围和验收标准不清</p>
              </div>
            </div>
            <div className="mt-6 border-t border-border pt-5">
              <p className="text-xs font-semibold text-ink-faint">建议下一步</p>
              <p className="mt-2 text-sm leading-7 text-ink-muted">先选一个每周重复两次以上的任务，收集 5 份真实输入与合格输出，再判断是否需要知识库或智能体。</p>
            </div>
          </div>
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

      <section className="border-b border-border bg-ink px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <Reveal className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.38fr_0.62fr]">
          <div>
            <p className="text-sm font-semibold text-white/55">神秘痒</p>
            <h2 className="editorial-display mt-4 text-[1.8rem] leading-[1.15] sm:text-[2.2rem] lg:text-[2.6rem]">真正让 AI 项目停下来的，往往不是技术。</h2>
            <p className="mt-5 max-w-md text-base leading-8 text-white/65">工具能不能用，很快就能试出来。难的是三个经常被跳过的问题。</p>
          </div>
          <div className="border-t border-white/15">
            {[
              ['01', '到底要替谁完成哪一项工作？'],
              ['02', '判断好坏的经验，现在写在哪里？'],
              ['03', '结果错了以后，谁复核、怎样修正？'],
            ].map(([code, question]) => (
              <div key={code} className="grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-white/15 py-6">
                <span className="text-xs font-semibold text-cinnabar">{code}</span>
                <p className="text-base font-semibold text-white">{question}</p>
                <CheckCircle size={19} className="text-white/35" aria-hidden />
              </div>
            ))}
            <Link href="/blog?category=ai" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-white/70">
              看我怎样拆这些问题 <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
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
            <p className="text-base leading-8 text-ink-muted">星火者是我发起的 OPC 协作共同体。分享真实项目，带着上下文连接，在边界清楚时一起做事。</p>
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
