"use client"

import Link from 'next/link'
import {
  ArrowRight,
  Calculator,
  CheckCircle,
  ClipboardText,
  FileText,
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
    href: '/tools/quote-check',
  },
  {
    icon: Calculator,
    title: '低价很诱人，但怕后面加钱',
    body: '便宜本身不是问题，真正要看的是哪些没写清，后面怎么变更。',
    href: '/pricing/baojia-guide',
  },
  {
    icon: ClipboardText,
    title: '合同快签了，但追问顺序乱',
    body: '哪些要写进合同，哪些要先拍照留证，哪些不能只听口头承诺。',
    href: '/services/renovation#qianyue-qian-juece-bao',
  },
  {
    icon: Notebook,
    title: '预算有数，但不知道怎么取舍',
    body: '钱不是越省越好，而是先分清底线、弹性和可以缓一缓的选择。',
    href: '/tools/budget-structure',
  },
  {
    icon: HouseLine,
    title: '想把家做好，但不想被风格带跑',
    body: '审美不是只选风格，而是把真实居住、预算和长期体验放在一起判断。',
    href: '/blog/02-jia-bu-shi-yangban-jian',
  },
]

const frameworkSteps: Array<{
  number: string
  icon: IconComponent
  title: string
  body: string
}> = [
  { number: '01', icon: MagnifyingGlass, title: '看完整性', body: '报价有没有拆到空间、工种、数量和单价。' },
  { number: '02', icon: Calculator, title: '看异常价', body: '低价项、模糊项和明显偏离常识的单价。' },
  { number: '03', icon: FileText, title: '看漏项', body: '哪些项目现在没写，后面最容易变成增项。' },
  { number: '04', icon: ClipboardText, title: '看边界', body: '材料、工艺、变更、验收和付款有没有说清。' },
  { number: '05', icon: Notebook, title: '看取舍', body: '预算有限时，哪些保底，哪些可以缓。' },
  { number: '06', icon: ShieldCheck, title: '给追问', body: '最后输出签约前应该问清的具体问题。' },
]

const quoteSignals = [
  { label: '漏项风险', value: '78%', note: '项目没写清，后面容易加钱', color: '#9a5424' },
  { label: '工艺边界', value: '64%', note: '口头承诺多，合同里少', color: '#3f6258' },
  { label: '付款节点', value: '52%', note: '节点和验收口径要补', color: '#31485c' },
]

const aiBuildRows = [
  ['经验', '16 年装修现场里的坑、细节和人性'],
  ['审美', '不是堆材料，而是长期住起来舒服'],
  ['工具', '把判断过程拆成表单、清单和报告'],
]

const nextStepLinks = [
  { label: '先做报价风险初筛', href: '/tools/quote-check' },
  { label: '领取签约前检查清单', href: '/resources#baojia-shenhe-qingdan' },
  { label: '已经有材料就看快审服务', href: '/services/renovation#baojia-shenhe' },
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
    icon: ClipboardText,
    title: '报价审核清单',
    body: '签约前按项目、工艺、材料、变更和付款逐项核对。',
    action: '领检查清单',
    href: '/resources#baojia-shenhe-qingdan',
  },
  {
    icon: Calculator,
    title: '预算分配工具',
    body: '先看总预算更像简约、舒适还是精致，再拆成几份钱。',
    action: '拆预算',
    href: '/tools/budget-structure',
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
    title: '居住场景服务',
    body: '适合南宁本地、重视长期居住体验的人，从怎么住开始判断。',
    bullets: ['生活场景', '审美取舍', '预算拆解', '南宁本地'],
    price: '¥9800 起',
    href: '/services/renovation#shi-zhu-pai-zhuangxiu',
  },
]

const trustItems: Array<{ icon: IconComponent; title: string; body: string }> = [
  { icon: ShieldCheck, title: '现场验证', body: '装修判断来自真实报价、预算和施工问题。' },
  { icon: Wrench, title: '工具沉淀', body: '不靠感觉吓人，把判断拆成清单和步骤。' },
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

        <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-5 py-14 sm:px-8 lg:min-h-[calc(88dvh-3.5rem)] lg:grid-cols-[minmax(0,0.95fr)_minmax(560px,1.05fr)] lg:px-12 lg:py-16">
          <div className="flex min-w-0 max-w-3xl flex-col justify-center">
            <p className="mb-7 flex items-center gap-3 text-sm font-medium text-[#a65a2c]">
              <span className="h-px w-6 bg-[#d96f38]" />
              装修判断力 / 签约前报价风险初筛
            </p>
            <h1 className="max-w-[22rem] text-[2.1rem] font-semibold leading-[1.16] tracking-normal text-[#24211e] sm:max-w-4xl sm:text-[4.25rem] xl:text-[5.25rem]">
              <span className="block">装修签约前，</span>
              <span className="block">先看懂报价里的风险。</span>
            </h1>
            <p className="mt-7 max-w-[22rem] text-base leading-8 text-[#5f5952] sm:max-w-2xl sm:text-lg">
              我帮助业主在装修前建立判断力，识别报价风险，少花冤枉钱。先不替你做决定，而是帮你看清该看什么、该问什么、该防什么。
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ActionLink href="/tools/quote-check">
                <UploadSimple size={18} aria-hidden />
                上传报价单，做一次风险初筛
              </ActionLink>
              <ActionLink href="/resources#baojia-shenhe-qingdan" variant="secondary">
                查看签约前自查清单
              </ActionLink>
            </div>
            <div className="mt-6">
              <ActionLink href="/about" variant="text">
                了解 Zeno 的经验、审美和工具方法
              </ActionLink>
            </div>

            <div className="mt-10 grid max-w-3xl grid-cols-2 gap-px border border-[#e8ddd1] bg-[#e8ddd1] sm:grid-cols-4">
              {['16 年\n装修现场', '5 个\n判断维度', '免费\n初筛入口', '边界\n先说清'].map((item) => {
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

          <div className="grid min-w-0 content-center gap-4 lg:pl-2">
            <div className="grid min-w-0 gap-4 xl:grid-cols-[1.04fr_0.96fr]">
              <div className="min-w-0 border border-white/70 bg-white/86 p-7 shadow-[0_22px_70px_rgba(80,55,32,0.12)] backdrop-blur-sm">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-[#a65a2c]">QUOTE RISK</p>
                    <h2 className="mt-3 break-all text-xl font-semibold leading-snug text-[#2a2520] sm:break-normal sm:text-2xl">不是先判断贵不贵，先判断能不能签。</h2>
                  </div>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#f4eee7] text-[#a15b2f]">
                    <ShieldCheck size={26} weight="duotone" aria-hidden />
                  </span>
                </div>

                <div className="mt-8 space-y-5">
                  {quoteSignals.map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <p className="text-sm font-semibold text-[#322d28]">{item.label}</p>
                        <p className={`${fontClassName} text-lg font-semibold text-[#8b4d27]`}>{item.value}</p>
                      </div>
                      <div className="h-2 bg-[#efe5da]">
                        <div className="h-full" style={{ width: item.value, backgroundColor: item.color }} />
                      </div>
                      <p className="mt-2 text-xs leading-5 text-[#766c63]">{item.note}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-t border-[#e6d9cc] pt-6">
                  <p className="text-sm font-semibold text-[#332d27]">初筛会输出什么</p>
                  <div className="mt-4 grid gap-2 text-sm text-[#5f5952] sm:grid-cols-2">
                    {['风险等级', '漏项提醒', '追问清单', '下一步建议'].map((item) => (
                      <span key={item} className="border border-[#ead9c7] bg-[#fbf8f4] px-3 py-2">{item}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="min-w-0 border border-white/70 bg-[#2b261f] p-7 text-white shadow-[0_22px_70px_rgba(80,55,32,0.15)]">
                  <p className="text-xs font-semibold tracking-[0.18em] text-[#d9b98f]">BRAND AXIS</p>
                  <h2 className="mt-3 break-all text-xl font-semibold leading-snug sm:break-normal sm:text-2xl">用经验、审美和工具，帮人把家的决策做对。</h2>
                  <div className="mt-7 space-y-3">
                    {aiBuildRows.map(([label, body]) => (
                      <div key={label} className="grid grid-cols-[4.5rem_1fr] gap-3 border border-white/12 bg-white/6 px-4 py-3">
                        <p className="text-sm font-semibold text-[#e6c9a5]">{label}</p>
                        <p className="text-sm leading-6 text-white/76">{body}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-white/70 bg-white/84 p-5 shadow-[0_18px_50px_rgba(80,55,32,0.10)] backdrop-blur-sm">
                  <p className="text-sm font-semibold text-[#332d27]">现在从哪一步开始</p>
                  <div className="mt-3 grid gap-2">
                    {nextStepLinks.map((item) => (
                      <Link key={item.label} href={item.href} className="group flex items-center justify-between gap-4 border border-[#ead9c7] bg-[#fbf8f4] px-4 py-3 text-sm font-medium text-[#6b4125] transition-colors hover:border-[#b9875d] hover:bg-white">
                        {item.label}
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e7ded3] py-20 sm:py-24">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium text-[#a65a2c]">02</p>
            <h2 className="mt-3 text-[clamp(2rem,4vw,3.8rem)] font-semibold leading-tight tracking-normal text-[#25221f]">
              很多装修后悔，不是发生在施工后。
            </h2>
            <p className="mt-4 text-base leading-8 text-[#756c63]">报价没看懂，合同没问清，预算没拆透，后面就容易一步步被动。签约前先把判断做清楚。</p>
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
              03 / 判断方法
              <span className="h-px w-28 bg-[#dfc5ac]" />
            </p>
            <h2 className="mt-6 text-[clamp(2.6rem,5vw,5rem)] font-semibold leading-tight tracking-normal text-[#25221f]">
              我先看五件事，不先制造焦虑。
            </h2>
            <p className="mt-4 text-base leading-8 text-[#686159]">项目完整性、价格异常、漏项风险、边界说明、预算取舍。看完这些，再决定要不要继续谈、怎么追问。</p>
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
              先让你拿到具体东西，再决定要不要付费。
            </h2>
            <p className="mt-4 text-base leading-8 text-[#6f675f]">免费初筛负责缩小问题，低价资料负责补判断，人工服务只处理工具看不明白、临近签约的部分。</p>
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
              服务不从高客单开始，从低门槛信任入口开始。
            </h2>
            <p className="mt-4 text-base leading-8 text-[#6f675f]">内容建立信任，工具筛选真实需求，咨询处理关键判断。没有材料、不临近决策，就先回到免费工具和清单。</p>
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
              我不是泛装修博主，也不想吓唬你。
            </h2>
            <div className="mt-7 space-y-5 text-base leading-9 text-[#504a44]">
              <p>我做装修 16 年，见过很多后悔不是来自审美，而是来自签约前没问清、预算里没留边界、施工中没有留痕。</p>
              <p>我想做的是装修判断力和生活方式审美的内容型个人品牌。不是替你做所有决定，而是在关键节点上帮你看清楚风险、关键点和下一步。</p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-px border border-[#e6d9cc] bg-[#e6d9cc] sm:grid-cols-3">
              {['经验\n真实现场', '审美\n长期居住', '工具\n可复用判断'].map((item) => {
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
              <ActionLink href="/tools/quote-check">先做报价初筛</ActionLink>
              <ActionLink href="/services/renovation#baojia-shenhe" variant="secondary">看报价快审边界</ActionLink>
            </div>

            <p className="mt-8 border-t border-[#e6d9cc] pt-6 text-sm leading-7 text-[#716961]">
              起点一定要窄。越具体，越容易被信任；越能解决一个真实问题，越容易形成长期资产。
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
