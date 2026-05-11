"use client"

import Link from 'next/link'
import {
  ArrowRight,
  Calculator,
  CheckCircle,
  ClipboardText,
  FileText,
  HardHat,
  HouseLine,
  MagnifyingGlass,
  Notebook,
  ShieldCheck,
  Sparkle,
  UploadSimple,
  UsersThree,
  Wrench,
} from '@phosphor-icons/react'

type IconComponent = typeof FileText

type ActionLinkProps = {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'text'
}

const heroImage =
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=80'

const studioImage =
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80'

const pathCards: Array<{
  number: string
  icon: IconComponent
  title: string
  body: string
  href: string
}> = [
  {
    number: '01',
    icon: Sparkle,
    title: 'AI 转型实践',
    body: '不是追工具，而是把真实工作拆成 SOP，再接进内容、工具和交付。',
    href: '/ai',
  },
  {
    number: '02',
    icon: HardHat,
    title: '装修判断样板间',
    body: '用报价、预算、合同、施工和验收，把判断力做成能被验证的样板。',
    href: '/tools/quote-check',
  },
  {
    number: '03',
    icon: ClipboardText,
    title: '一人公司路径',
    body: '把经验沉淀成文章、清单、低价产品、咨询服务和可复用工具。',
    href: '/services',
  },
]

const problemCards: Array<{
  icon: IconComponent
  title: string
  body: string
  href: string
}> = [
  {
    icon: MagnifyingGlass,
    title: '报价看不懂，但快要签了',
    body: '总价能看见，漏项、单价、工艺和增项边界还没看清。',
    href: '/services/renovation#baojia-shenhe',
  },
  {
    icon: Calculator,
    title: '预算有数，但越算越乱',
    body: '钱不是不够，而是还没拆成底线、弹性和可以缓一缓的选择。',
    href: '/tools/budget-risk',
  },
  {
    icon: Sparkle,
    title: '同行想学 AI，但不想听空课',
    body: '你要看的不是工具演示，而是一个传统行业人怎么把 AI 用进真实业务。',
    href: '/ai',
  },
  {
    icon: Notebook,
    title: '有经验，但不会变成产品',
    body: '你知道很多事，但还没拆成清单、工具、课程、咨询和可交付结果。',
    href: '/services/ai-workflow',
  },
  {
    icon: ClipboardText,
    title: '内容想持续，但每次都重来',
    body: '选题、标题、结构和转化路径没有 SOP，写得久也很难沉淀资产。',
    href: '/tools/content-brain',
  },
]

const frameworkSteps: Array<{
  number: string
  icon: IconComponent
  title: string
  body: string
}> = [
  { number: '01', icon: MagnifyingGlass, title: '找真问题', body: '先从现场和客户问题里找高频卡点。' },
  { number: '02', icon: FileText, title: '拆成 SOP', body: '把经验拆成输入、判断规则和输出。' },
  { number: '03', icon: Sparkle, title: '接进 AI', body: '让 AI 产出草稿、清单、追问和结构。' },
  { number: '04', icon: ClipboardText, title: '做成工具', body: '把可重复的判断变成网页工具和模板。' },
  { number: '05', icon: Notebook, title: '沉淀内容', body: '把过程写成文章、案例和可复制教程。' },
  { number: '06', icon: HouseLine, title: '形成产品', body: '免费、低价、咨询和会员逐层承接。' },
]

const toolCards: Array<{
  icon: IconComponent
  title: string
  body: string
  action: string
  href: string
}> = [
  {
    icon: ShieldCheck,
    title: '报价初筛工具',
    body: '业主先把报价里的漏项、模糊项和增项口子筛一遍。',
    action: '先看报价风险',
    href: '/tools/quote-check',
  },
  {
    icon: Sparkle,
    title: 'AI 场景生成器',
    body: '同行把一个真实任务填进去，生成能继续修改的提示词。',
    action: '生成提示词',
    href: '/tools/prompts',
  },
  {
    icon: ClipboardText,
    title: '内容诊断大脑',
    body: '发布前检查选题、标题、表达效率和站内承接。',
    action: '诊断内容',
    href: '/tools/content-brain',
  },
  {
    icon: Notebook,
    title: '报价避坑指南',
    body: '用一份低价资料，把报价、预算、合同和增项先系统串起来。',
    action: '看 ¥39 指南',
    href: '/pricing/baojia-guide',
  },
]

const serviceCards = [
  {
    icon: FileText,
    title: '报价风险快审',
    body: '签约前，把漏项、异常单价、模糊工艺和增项口子先看出来。',
    bullets: ['漏项和模糊项', '异常单价', '工艺边界', '追问清单'],
    price: '¥699 / 份',
    href: '/services/renovation#baojia-shenhe',
  },
  {
    icon: Calculator,
    title: '预算结构诊断',
    body: '还没到逐行看报价，但钱已经越算越乱，先把预算结构拆清。',
    bullets: ['预算结构', '优先级', '缓冲空间'],
    price: '¥399 / 次',
    href: '/services/renovation#yusuan-zixun',
  },
  {
    icon: ClipboardText,
    title: '签约前决策包',
    body: '如果报价、预算、合同和付款节点一起乱，用这一项一次看全。',
    bullets: ['报价 + 预算 + 合同', '关键追问顺序', '付款节点边界', '一次讲清'],
    price: '¥1499 / 次',
    href: '/services/renovation#qianyue-qian-juece-bao',
  },
  {
    icon: Sparkle,
    title: 'AI 工作流咨询',
    body: '给传统行业人，把一个真实业务场景拆成 AI 能参与的流程。',
    bullets: ['真实场景', '流程拆解', '提示词框架', '内容系统'],
    price: '¥1999 起',
    href: '/services/ai-workflow',
  },
]

const trustItems: Array<{ icon: IconComponent; title: string; body: string }> = [
  { icon: ShieldCheck, title: '现场验证', body: '装修判断来自真实报价、预算和施工问题。' },
  { icon: Wrench, title: 'AI 实战', body: '不讲工具热闹，只看它能不能进入工作。' },
  { icon: UsersThree, title: '说清边界', body: '能帮什么、不能帮什么先讲明白。' },
]

function ActionLink({ href, children, variant = 'primary' }: ActionLinkProps) {
  const className = {
    primary:
      'inline-flex min-h-12 items-center justify-center gap-2 bg-[#9a5424] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#7f421a]',
    secondary:
      'inline-flex min-h-12 items-center justify-center gap-2 border border-[#cdbfaf] bg-white/70 px-5 py-3 text-sm font-medium text-[#5f3b24] transition-colors hover:bg-white',
    text:
      'inline-flex items-center gap-2 text-sm font-medium text-[#7b4b2b] transition-colors hover:text-[#4b2b18]',
  }[variant]

  return (
    <Link href={href} className={className}>
      {children}
      <ArrowRight size={17} aria-hidden />
    </Link>
  )
}

type Props = {
  fontClassName: string
}

export default function HomePageGptSkill({ fontClassName }: Props) {
  return (
    <main className="bg-[#fbf8f4] text-[#272421]">
      <section className="relative isolate overflow-hidden border-b border-[#e7ded3]">
        <div
          className="absolute inset-y-0 right-0 hidden w-[56%] bg-cover bg-center opacity-80 lg:block"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(251,248,244,0.98) 0%, rgba(251,248,244,0.72) 36%, rgba(251,248,244,0.1) 100%), url(${heroImage})`,
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(247,241,234,0.82))]" aria-hidden />

        <div className="relative mx-auto grid min-h-[calc(100vh-3.5rem)] max-w-[1440px] grid-cols-1 gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(560px,1.05fr)] lg:px-12 lg:py-16">
          <div className="flex max-w-3xl flex-col justify-center">
            <p className="mb-7 flex items-center gap-3 text-sm font-medium text-[#a65a2c]">
              <span className="h-px w-6 bg-[#d96f38]" />
              从装修现场长出来的 AI 判断力系统
            </p>
            <h1 className="max-w-4xl text-[clamp(2.75rem,5vw,5.25rem)] font-semibold leading-[1.08] tracking-normal text-[#24211e]">
              装修是现场，AI 是方法，一人公司是结果。
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[#5f5952] sm:text-lg">
              我用 16 年装修现场经验做样板，把报价、预算、合同、施工和内容生产拆成判断 SOP，再用 AI 做成工具、资料和服务。业主可以先少踩坑，同行可以看传统经验怎么变成产品。
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ActionLink href="/services/renovation#baojia-shenhe">
                <UploadSimple size={18} aria-hidden />
                我手里有报价，想先看风险
              </ActionLink>
              <ActionLink href="/ai" variant="secondary">
                我是同行，想看 AI 怎么落地
              </ActionLink>
            </div>
            <div className="mt-6">
              <ActionLink href="/tools/content-brain" variant="text">
                我在做内容，先诊断选题和转化路径
              </ActionLink>
            </div>

            <div className="mt-10 grid max-w-3xl grid-cols-2 gap-px border border-[#e8ddd1] bg-[#e8ddd1] sm:grid-cols-4">
              {['16 年\n装修现场', '2 年\nAI 实践', '判断 SOP\n工具化', '一人公司\n公开样板'].map((item) => {
                const [title, body] = item.split('\n')
                return (
                  <div key={item} className="bg-white/76 px-4 py-4">
                    <p className="text-sm font-semibold leading-5 text-[#3a332e]">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-[#7c7168]">{body}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid content-center gap-4 lg:grid-cols-3 lg:pl-2">
            {pathCards.map((card) => {
              const Icon = card.icon
              return (
                <Link
                  key={card.number}
                  href={card.href}
                  className="group flex min-h-[22rem] flex-col justify-between border border-white/70 bg-white/74 p-7 shadow-[0_22px_70px_rgba(80,55,32,0.10)] backdrop-blur-sm transition-transform hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <span className={`${fontClassName} text-5xl font-light leading-none text-[#9a5424]`}>
                        {card.number}
                      </span>
                      <span className="flex h-11 w-11 items-center justify-center bg-[#f4eee7] text-[#a15b2f]">
                        <Icon size={22} weight="duotone" aria-hidden />
                      </span>
                    </div>
                    <h2 className="mt-10 text-2xl font-semibold leading-snug text-[#2a2520]">{card.title}</h2>
                    <p className="mt-5 text-sm leading-7 text-[#665f58]">{card.body}</p>
                  </div>
                  <ArrowRight className="mt-8 text-[#9a5424] transition-transform group-hover:translate-x-1" size={22} aria-hidden />
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-[#e7ded3] py-20 sm:py-24">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium text-[#a65a2c]">02</p>
            <h2 className="mt-3 text-[clamp(2rem,4vw,3.8rem)] font-semibold leading-tight tracking-normal text-[#25221f]">
              你从哪条线进入，下一步要很清楚。
            </h2>
            <p className="mt-4 text-base leading-8 text-[#756c63]">业主走装修判断，同行走 AI 实践。入口不同，底层都是把经验变成可执行判断。</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {problemCards.map((card) => {
              const Icon = card.icon
              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group flex min-h-[20rem] flex-col items-center border border-[#e4d8cb] bg-white px-6 py-8 text-center shadow-[0_18px_60px_rgba(67,45,26,0.06)] transition-transform hover:-translate-y-1"
                >
                  <span className="flex h-16 w-16 items-center justify-center border border-[#c09a77] text-[#a15b2f]">
                    <Icon size={34} weight="duotone" aria-hidden />
                  </span>
                  <h3 className="mt-7 text-xl font-semibold leading-8 text-[#2c2824]">{card.title}</h3>
                  <p className="mt-5 text-sm leading-7 text-[#6f675f]">{card.body}</p>
                  <span className="mt-auto inline-flex items-center gap-2 border border-[#e6d9cc] px-4 py-2 text-sm font-medium text-[#7b4b2b]">
                    进入这条线
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-[#e7ded3] bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <p className="flex items-center justify-center gap-4 text-sm font-medium tracking-[0.18em] text-[#a65a2c]">
              <span className="h-px w-28 bg-[#dfc5ac]" />
              03 / 双主线方法
              <span className="h-px w-28 bg-[#dfc5ac]" />
            </p>
            <h2 className="mt-6 text-[clamp(2.6rem,5vw,5rem)] font-semibold leading-tight tracking-normal text-[#25221f]">
              不是从 AI 概念开始，而是从真实问题开始。
            </h2>
            <p className="mt-4 text-base leading-8 text-[#686159]">装修提供真实问题，AI 提供放大方法。顺序错了，就会变成空课和空网站。</p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
            {frameworkSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="relative text-center">
                  {index < frameworkSteps.length - 1 && (
                    <ArrowRight
                      size={22}
                      className="absolute right-[-1.15rem] top-12 hidden text-[#b9875d] lg:block"
                      aria-hidden
                    />
                  )}
                  <div className="mx-auto flex h-28 w-28 items-center justify-center border border-[#ead9c7] bg-[#fbf8f4]">
                    <Icon size={42} weight="duotone" className="text-[#a15b2f]" aria-hidden />
                  </div>
                  <span className={`${fontClassName} -mt-4 inline-flex h-9 min-w-9 items-center justify-center bg-[#b48d67] px-3 text-sm font-semibold text-white`}>
                    {step.number}
                  </span>
                  <h3 className="mt-6 text-xl font-semibold text-[#2c2824]">{step.title}</h3>
                  <p className="mx-auto mt-3 max-w-[11rem] text-sm leading-7 text-[#6f675f]">{step.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-[#e7ded3] py-20 sm:py-24">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-medium tracking-[0.18em] text-[#a65a2c]">04 / 免费入口</p>
            <h2 className="mt-5 text-[clamp(2rem,4.4vw,4.25rem)] font-semibold leading-tight tracking-normal text-[#25221f]">
              先让你拿到东西，再决定要不要付费。
            </h2>
            <p className="mt-4 text-base leading-8 text-[#6f675f]">免费工具负责给结果，低价资料负责补判断，人工服务只处理工具看不明白的地方。</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {toolCards.map((card) => {
              const Icon = card.icon
              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group flex min-h-[19rem] flex-col items-center border border-[#e4d8cb] bg-white px-7 py-9 text-center shadow-[0_18px_60px_rgba(67,45,26,0.07)] transition-transform hover:-translate-y-1"
                >
                  <Icon size={52} weight="duotone" className="text-[#a15b2f]" aria-hidden />
                  <h3 className="mt-8 text-2xl font-semibold text-[#2b2723]">{card.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#6f675f]">{card.body}</p>
                  <span className="mt-auto inline-flex items-center gap-2 border border-[#e6d9cc] px-5 py-2 text-sm font-medium text-[#7b4b2b]">
                    {card.action}
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Link>
              )
            })}
          </div>

          <div className="mt-10 text-center">
            <ActionLink href="/resources" variant="text">
              进入资料与清单
            </ActionLink>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-b border-[#e7ded3] bg-white py-20 sm:py-24">
        <div
          className="absolute inset-y-0 right-0 hidden w-[38%] bg-cover bg-center opacity-45 lg:block"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.96), rgba(255,255,255,0.36)), url(${heroImage})`,
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
            <p className="text-sm font-semibold text-[#8b4d27]">05 / 付费产品</p>
          <div className="mt-8 text-center">
            <h2 className="text-[clamp(2rem,4.2vw,4.1rem)] font-semibold leading-tight tracking-normal text-[#25221f]">
              装修负责回血，AI 负责放大，但都从具体交付开始。
            </h2>
            <p className="mt-4 text-base leading-8 text-[#6f675f]">不卖模糊陪伴。装修服务看材料，AI 服务看场景；材料和场景说不清，就先回到免费工具。</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCards.map((card) => {
              const Icon = card.icon
              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group flex min-h-[24rem] flex-col border border-[#e4d8cb] bg-white/90 p-8 shadow-[0_18px_70px_rgba(67,45,26,0.08)] transition-transform hover:-translate-y-1"
                >
                  <div className="flex items-start gap-5">
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center border border-[#ead9c7] bg-[#fbf8f4] text-[#a15b2f]">
                      <Icon size={34} weight="duotone" aria-hidden />
                    </span>
                    <div>
                      <h3 className="text-2xl font-semibold leading-snug text-[#2b2723]">{card.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-[#6f675f]">{card.body}</p>
                    </div>
                  </div>
                  <div className="my-7 h-px bg-[#e6d9cc]" />
                  <ul className="space-y-3">
                    {card.bullets.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm text-[#514b45]">
                        <CheckCircle size={18} weight="duotone" className="text-[#a15b2f]" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex items-end justify-between gap-4 pt-8">
                    <p className={`${fontClassName} text-3xl font-medium text-[#8b4d27]`}>{card.price}</p>
                    <span className="inline-flex items-center gap-2 bg-[#9a5424] px-5 py-2 text-sm font-medium text-white">
                      看服务边界
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="mt-8 grid grid-cols-1 border border-[#e8ddd1] bg-white/82 sm:grid-cols-3">
            {trustItems.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="flex items-center gap-4 border-b border-[#e8ddd1] px-6 py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                  <Icon size={32} weight="duotone" className="shrink-0 text-[#8b4d27]" aria-hidden />
                  <div>
                    <p className="font-semibold text-[#2b2723]">{item.title}</p>
                    <p className="text-sm leading-6 text-[#716961]">{item.body}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="grid min-h-[calc(100vh-3.5rem)] grid-cols-1 border-b border-[#e7ded3] bg-white lg:grid-cols-[0.52fr_0.48fr]">
        <div
          className="min-h-[24rem] bg-cover bg-center lg:min-h-full"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(24,20,17,0.62), rgba(24,20,17,0.12)), url(${studioImage})`,
          }}
          aria-hidden
        />
        <div className="flex items-center px-5 py-16 sm:px-10 lg:px-16">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-[0.18em] text-[#a65a2c]">06</p>
            <h2 className="mt-5 text-[clamp(2.5rem,5vw,4.75rem)] font-semibold leading-tight tracking-normal text-[#25221f]">
              我把自己的网站当成样板间来改。
            </h2>
            <div className="mt-7 space-y-5 text-base leading-9 text-[#504a44]">
              <p>我做装修 16 年，见过很多后悔不是来自审美，而是来自签约前没问清、预算里没留边界、施工中没有留痕。</p>
              <p>这两年我每天把大量时间放在 AI 上，不是为了追热闹，而是想把真实经验做成网页、工具、内容、产品和服务。这个站本身就是公开样板间。</p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-px border border-[#e6d9cc] bg-[#e6d9cc] sm:grid-cols-3">
              {['装修\n真实现场', 'AI\n真实实践', '产品\n真实交付'].map((item) => {
                const [title, body] = item.split('\n')
                return (
                  <div key={item} className="bg-[#fbf8f4] px-5 py-5">
                    <p className={`${fontClassName} text-3xl font-medium text-[#8b4d27]`}>{title}</p>
                    <p className="mt-1 text-sm text-[#6f675f]">{body}</p>
                  </div>
                )
              })}
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ActionLink href="/ai">看 AI 实践路线</ActionLink>
              <ActionLink href="/services/renovation#baojia-shenhe" variant="secondary">先看报价把关</ActionLink>
            </div>

            <p className="mt-8 border-t border-[#e6d9cc] pt-6 text-sm leading-7 text-[#716961]">
              如果你是业主，先少踩坑。如果你是同行，先看一个传统行业人怎么把经验做成系统。
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
