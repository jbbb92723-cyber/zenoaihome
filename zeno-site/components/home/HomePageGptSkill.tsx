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
    title: '报价与预算判断',
    body: '看清价格构成，识别漏项、模糊项和后期容易增项的地方。',
    href: '/services/renovation#baojia-shenhe',
  },
  {
    number: '02',
    icon: HardHat,
    title: '施工与验收判断',
    body: '了解施工流程、工艺边界和关键节点，不把问题拖到竣工后。',
    href: '/resources#construction-checkpoints',
  },
  {
    number: '03',
    icon: HouseLine,
    title: '真实居住与长期选择',
    body: '从真实生活出发，看清哪些选择会影响长期使用，而不只看效果图。',
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
    title: '正在看报价单，不知道贵不贵',
    body: '担心被坑，也想知道报价是不是合理、透明、可追问。',
    href: '/services/renovation#baojia-shenhe',
  },
  {
    icon: Calculator,
    title: '预算越算越乱，怕后期增项',
    body: '总价看着差不多，但中途可能不断加钱。',
    href: '/tools/budget-risk',
  },
  {
    icon: Notebook,
    title: '合同快签了，担心条款没写清',
    body: '怕有隐藏条款、模糊表述，后面扯皮没有凭据。',
    href: '/resources#sign-before-contract',
  },
  {
    icon: HardHat,
    title: '已经开工了，不知道哪些节点要验收',
    body: '担心施工质量，也不清楚该怎么盯进度和留证。',
    href: '/resources#construction-checkpoints',
  },
  {
    icon: HouseLine,
    title: '不想装成样板间，想按真实生活做选择',
    body: '希望空间好用、耐看、长期住着舒服。',
    href: '/blog/02-jia-bu-shi-yangban-jian',
  },
]

const frameworkSteps: Array<{
  number: string
  icon: IconComponent
  title: string
  body: string
}> = [
  { number: '01', icon: FileText, title: '看报价', body: '先看漏项、模糊项和异常单价。' },
  { number: '02', icon: Calculator, title: '控预算', body: '预算不是总价表，而是决策边界。' },
  { number: '03', icon: Notebook, title: '定合同', body: '把容易扯皮的地方提前写清楚。' },
  { number: '04', icon: ClipboardText, title: '盯节点', body: '不要等完工后才发现问题。' },
  { number: '05', icon: MagnifyingGlass, title: '做验收', body: '照片、清单、标准，缺一不可。' },
  { number: '06', icon: HouseLine, title: '真实居住', body: '最终不是为了好看，而是为了长期舒服。' },
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
    body: '10 分钟识别你的预算可能存在哪些超支风险。',
    action: '开始自测',
    href: '/tools/budget-risk',
  },
  {
    icon: FileText,
    title: '报价审核清单',
    body: '按漏项、单价、工艺和增项边界逐项检查。',
    action: '查看清单',
    href: '/resources#baojia-shenhe-qingdan',
  },
  {
    icon: ClipboardText,
    title: '验收节点清单',
    body: '按施工节点自查关键验收事项，不把问题留到最后。',
    action: '查看节点',
    href: '/resources#construction-checkpoints',
  },
  {
    icon: Notebook,
    title: '装修准备表',
    body: '从设计到入住，先把必须准备的资料和问题列出来。',
    action: '查看准备表',
    href: '/resources#living-needs-map',
  },
]

const serviceCards = [
  {
    icon: FileText,
    title: '报价单审核',
    body: '识别漏项、异常单价、模糊工艺和后期增项风险。',
    bullets: ['识别漏项', '异常单价', '模糊工艺', '增项风险'],
    price: '¥699 / 份',
    href: '/services/renovation#baojia-shenhe',
  },
  {
    icon: Calculator,
    title: '预算结构诊断',
    body: '帮你看清预算是否合理，哪些地方该花，哪些地方容易被带偏。',
    bullets: ['预算是否合理', '哪些地方该花', '哪些地方能缓', '哪些选择会超支'],
    price: '¥1299 / 次起',
    href: '/services/renovation#yusuan-zixun',
  },
  {
    icon: Sparkle,
    title: 'AI 工作流整理',
    body: '帮传统行业从业者把经验沉淀为内容、工具和流程。',
    bullets: ['个人经验沉淀', '内容与工具梳理', '工作流整理'],
    price: '¥1999 / 起',
    href: '/services/ai-workflow',
  },
]

const trustItems: Array<{ icon: IconComponent; title: string; body: string }> = [
  { icon: ShieldCheck, title: '不卖材料', body: '不靠材料差价和返点赚钱。' },
  { icon: Wrench, title: '16 年现场经验', body: '从报价、施工到验收都见过真实问题。' },
  { icon: UsersThree, title: '站在业主这一边', body: '不替施工方说话，也不替你冲动决定。' },
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
              真实问题，先于任何包装
            </p>
            <h1 className="max-w-4xl text-[clamp(2.75rem,5vw,5.25rem)] font-semibold leading-[1.08] tracking-normal text-[#24211e]">
              先别急着找人装修，先把报价、预算和验收的判断逻辑捋顺。
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[#5f5952] sm:text-lg">
              Zeno 深耕装修行业 16 年，不推材料，不拿返点。这里帮你看清报价里的坑、预算的偏差、合同的盲区、施工过程中的不确定性，以及真实居住后的长期体验。把复杂的问题讲清楚，把判断权交还给你。
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ActionLink href="/services/renovation#baojia-shenhe">
                <UploadSimple size={18} aria-hidden />
                发报价单给我判断风险
              </ActionLink>
              <ActionLink href="/start" variant="secondary">
                从装修判断入口开始
              </ActionLink>
            </div>
            <div className="mt-6">
              <ActionLink href="/services/ai-workflow" variant="text">
                我是传统行业人，想看 AI 工作流
              </ActionLink>
            </div>

            <div className="mt-10 grid max-w-3xl grid-cols-2 gap-px border border-[#e8ddd1] bg-[#e8ddd1] sm:grid-cols-4">
              {['不卖材料\n不拿返点', '16 年\n行业沉淀', '只讲事实\n不讲故事', '站在业主视角\n做判断'].map((item) => {
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
              你现在卡在哪？
            </h2>
            <p className="mt-4 text-base leading-8 text-[#756c63]">找到你的问题，走对应的判断路径。</p>
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
                    查看判断路径
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
              PATH 03
              <span className="h-px w-28 bg-[#dfc5ac]" />
            </p>
            <h2 className="mt-6 text-[clamp(2.6rem,5vw,5rem)] font-semibold leading-tight tracking-normal text-[#25221f]">
              Zeno 的装修判断框架
            </h2>
            <p className="mt-4 text-base leading-8 text-[#686159]">一套帮你少踩坑、少超支、少扯皮的底层逻辑。</p>
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
            <p className="text-sm font-medium tracking-[0.18em] text-[#a65a2c]">04</p>
            <h2 className="mt-5 text-[clamp(2rem,4.4vw,4.25rem)] font-semibold leading-tight tracking-normal text-[#25221f]">
              把复杂装修问题，拆成可以检查的清单和工具
            </h2>
            <p className="mt-4 text-base leading-8 text-[#6f675f]">先用工具和清单自查，再决定要不要继续找师傅、找设计或找我判断。</p>
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
              查看全部工具与清单
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
          <p className="text-sm font-semibold text-[#8b4d27]">05 / 服务转化区</p>
          <div className="mt-8 text-center">
            <h2 className="text-[clamp(2rem,4.2vw,4.1rem)] font-semibold leading-tight tracking-normal text-[#25221f]">
              工具看不明白的地方，可以找我帮你判断
            </h2>
            <p className="mt-4 text-base leading-8 text-[#6f675f]">只做三件事：帮你判断、帮你理清思路、把 AI 用起来的工作整理清楚。</p>
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
                      了解详情
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
              关于 Zeno
            </h2>
            <div className="mt-7 space-y-5 text-base leading-9 text-[#504a44]">
              <p>做了 16 年装修，我见过太多业主不是因为不舍得花钱吃亏，而是因为看不懂报价、问不清边界、签合同时没把关键问题写清楚。</p>
              <p>我不想把经验只留在工地和朋友圈，所以把它整理成文章、清单、工具和服务。希望更多人在装修前，先建立判断力。</p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-px border border-[#e6d9cc] bg-[#e6d9cc] sm:grid-cols-3">
              {['16 年\n现场经验', '不卖材料\n不拿返点', '只站业主\n这一边'].map((item) => {
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
              <ActionLink href="/about">了解我的故事</ActionLink>
              <ActionLink href="/blog" variant="secondary">看我的长期记录</ActionLink>
            </div>

            <p className="mt-8 border-t border-[#e6d9cc] pt-6 text-sm leading-7 text-[#716961]">
              感谢每一位愿意先把问题讲清楚的人。装修这件事，不该只靠运气。
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}