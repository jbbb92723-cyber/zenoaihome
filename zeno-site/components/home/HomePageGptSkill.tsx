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
    icon: FileText,
    title: '看清报价和预算',
    body: '不急着谈贵不贵，先知道钱花在哪、哪些没写、后面哪里容易加钱。',
    href: '/services/renovation#baojia-shenhe',
  },
  {
    number: '02',
    icon: HardHat,
    title: '守住施工和验收',
    body: '关键节点先确认，变更要留痕，不把所有问题都拖到竣工以后。',
    href: '/resources#construction-checkpoints',
  },
  {
    number: '03',
    icon: HouseLine,
    title: '回到居住场景',
    body: '风格最后要落到做饭、收纳、清洁、作息和十年后的使用感里。',
    href: '/topics#shi-zhu-pai-zhuangxiu',
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
    icon: Notebook,
    title: '合同快签，担心话没写死',
    body: '口头说得都好，真正能保护你的只有写清楚的条款和确认方式。',
    href: '/resources#sign-before-contract',
  },
  {
    icon: HardHat,
    title: '已经开工，现场全靠感觉盯',
    body: '节点、照片、变更和验收没有节奏，问题容易堆到最后。',
    href: '/resources#construction-checkpoints',
  },
  {
    icon: HouseLine,
    title: '不想只为效果图买单',
    body: '好看要回到居住场景里，经得起做饭、收纳、清洁和十年使用。',
    href: '/blog/02-jia-bu-shi-yangban-jian',
  },
]

const frameworkSteps: Array<{
  number: string
  icon: IconComponent
  title: string
  body: string
}> = [
  { number: '01', icon: FileText, title: '看报价', body: '先问清楚钱花在哪，哪些还没写。' },
  { number: '02', icon: Calculator, title: '拆预算', body: '把总价拆成底线、弹性和缓冲。' },
  { number: '03', icon: Notebook, title: '定合同', body: '把口头承诺变成能追溯的文字。' },
  { number: '04', icon: ClipboardText, title: '盯节点', body: '在关键节点确认，不等完工补救。' },
  { number: '05', icon: MagnifyingGlass, title: '做验收', body: '用照片、清单和标准留下依据。' },
  { number: '06', icon: HouseLine, title: '回到居住', body: '所有选择最终都要服务真实生活。' },
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
    title: '预算风险自测',
    body: '先分清你当前最大的风险，是报价、预算、流程，还是需求顺序。',
    action: '做一次自测',
    href: '/tools/budget-risk',
  },
  {
    icon: FileText,
    title: '报价审核清单',
    body: '按漏项、单价、工艺和增项边界，把报价先过一轮。',
    action: '拿清单自查',
    href: '/resources#baojia-shenhe-qingdan',
  },
  {
    icon: ClipboardText,
    title: '验收节点清单',
    body: '把每个施工节点该看什么、该拍什么、该确认什么列出来。',
    action: '看节点清单',
    href: '/resources#construction-checkpoints',
  },
  {
    icon: Notebook,
    title: '装修准备表',
    body: '把家庭需求、预算边界和签约前问题先写清楚。',
    action: '做准备清单',
    href: '/resources#living-needs-map',
  },
]

const serviceCards = [
  {
    icon: FileText,
    title: '报价单审核',
    body: '签约前，把漏项、异常单价、模糊工艺和增项口子先看出来。',
    bullets: ['漏项和模糊项', '异常单价', '工艺边界', '追问清单'],
    price: '¥699 / 份',
    href: '/services/renovation#baojia-shenhe',
  },
  {
    icon: Calculator,
    title: '预算结构诊断',
    body: '开工前，把总预算拆成底线、弹性、缓冲和容易失控的选择。',
    bullets: ['预算结构', '优先级', '缓冲空间', '超支风险'],
    price: '¥1299 / 次起',
    href: '/services/renovation#yusuan-zixun',
  },
  {
    icon: Sparkle,
    title: 'AI 工作流整理',
    body: '给传统行业人，把真实经验、客户问题和内容流程接进 AI。',
    bullets: ['真实场景', '内容流程', '提示词骨架'],
    price: '¥1999 / 起',
    href: '/services/ai-workflow',
  },
]

const trustItems: Array<{ icon: IconComponent; title: string; body: string }> = [
  { icon: ShieldCheck, title: '不卖材料', body: '判断不靠材料差价和返点。' },
  { icon: Wrench, title: '先看材料', body: '没有具体材料，不做空泛建议。' },
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
              从工地现场出发的装修判断力系统
            </p>
            <h1 className="max-w-4xl text-[clamp(2.75rem,5vw,5.25rem)] font-semibold leading-[1.08] tracking-normal text-[#24211e]">
              先别急着装修，先把判断力建立起来。
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[#5f5952] sm:text-lg">
              我做了 16 年装修，见过太多问题不是因为业主不懂生活，而是签字前没人把报价、预算、合同、施工和验收讲清楚。这里不卖材料，不拿返点，只帮你在做决定前多一点清醒。
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ActionLink href="/services/renovation#baojia-shenhe">
                <UploadSimple size={18} aria-hidden />
                我手里有报价，想先看风险
              </ActionLink>
              <ActionLink href="/start" variant="secondary">
                我还没开始，先建立判断
              </ActionLink>
            </div>
            <div className="mt-6">
              <ActionLink href="/ai" variant="text">
                我是传统行业人，想把 AI 用进工作
              </ActionLink>
            </div>

            <div className="mt-10 grid max-w-3xl grid-cols-2 gap-px border border-[#e8ddd1] bg-[#e8ddd1] sm:grid-cols-4">
              {['不卖材料\n不拿返点', '16 年\n工地现场', '先讲边界\n再给建议', '站在业主\n这一边'].map((item) => {
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
              大多数装修后悔，开头都不是同一个问题。
            </h2>
            <p className="mt-4 text-base leading-8 text-[#756c63]">你不用把整站看完，先认出自己现在最像哪一种情况。</p>
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
                    看这一类问题
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
              03 / 判断框架
              <span className="h-px w-28 bg-[#dfc5ac]" />
            </p>
            <h2 className="mt-6 text-[clamp(2.6rem,5vw,5rem)] font-semibold leading-tight tracking-normal text-[#25221f]">
              装修不是一次审美选择，而是一串要负责任的判断。
            </h2>
            <p className="mt-4 text-base leading-8 text-[#686159]">先按这个顺序看，很多看起来复杂的问题会变得可追问、可核对、可决定。</p>
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
            <p className="text-sm font-medium tracking-[0.18em] text-[#a65a2c]">04 / 自助判断</p>
            <h2 className="mt-5 text-[clamp(2rem,4.4vw,4.25rem)] font-semibold leading-tight tracking-normal text-[#25221f]">
              能先自己看清的，就不要急着付费。
            </h2>
            <p className="mt-4 text-base leading-8 text-[#6f675f]">工具和清单不是为了让你变成专家，而是让你带着更清楚的问题去沟通。</p>
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
              进入工具与资料库
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
          <p className="text-sm font-semibold text-[#8b4d27]">05 / 人工判断</p>
          <div className="mt-8 text-center">
            <h2 className="text-[clamp(2rem,4.2vw,4.1rem)] font-semibold leading-tight tracking-normal text-[#25221f]">
              工具看不明白的地方，再找我判断。
            </h2>
            <p className="mt-4 text-base leading-8 text-[#6f675f]">我只接能看清材料、能说清边界的事。不替你冲动决定，也不把不确定性包装成催单理由。</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
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
              我的经验，应该变成你做决定前的清醒。
            </h2>
            <div className="mt-7 space-y-5 text-base leading-9 text-[#504a44]">
              <p>我做装修 16 年，见过很多后悔不是来自审美，而是来自签约前没问清、预算里没留边界、施工中没有留痕。</p>
              <p>我不需要把自己包装成什么都懂的人。这个网站只是把我在现场见过的真实问题，整理成普通业主能读、能查、能用的判断工具。</p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-px border border-[#e6d9cc] bg-[#e6d9cc] sm:grid-cols-3">
              {['16 年\n现场经验', '不卖材料\n不拿返点', '先讲边界\n再做判断'].map((item) => {
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
              <ActionLink href="/about">了解 Zeno</ActionLink>
              <ActionLink href="/blog" variant="secondary">看长期记录</ActionLink>
            </div>

            <p className="mt-8 border-t border-[#e6d9cc] pt-6 text-sm leading-7 text-[#716961]">
              愿你在装修前，多一点清醒，少一点事后才懂。
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}