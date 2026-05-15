"use client"

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
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

/* ─── Types ─── */
type IconComponent = typeof FileText

type ActionLinkProps = {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'text'
}

/* ─── Framer Motion Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 20 },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 22 },
  },
}

/* ─── Data ─── */
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
    title: '预算取舍诊断',
    body: '还没到逐行看报价，但钱已经越算越乱，先判断哪些不能砍、哪些可以晚点买。',
    bullets: ['预算分配', '取舍顺序', '预留机动'],
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

/* ─── Reusable Components ─── */
function ActionLink({ href, children, variant = 'primary' }: ActionLinkProps) {
  const baseClass = 'inline-flex min-h-12 items-center justify-center gap-2 text-sm font-medium transition-all duration-200'
  const className = {
    primary: `${baseClass} bg-[#9a5424] px-5 py-3 text-white hover:bg-[#7f421a] active:scale-[0.98] active:-translate-y-px`,
    secondary: `${baseClass} border border-[#cdbfaf] bg-white/70 px-5 py-3 text-[#5f3b24] hover:bg-white hover:border-[#b9875d] active:scale-[0.98]`,
    text: `inline-flex items-center gap-2 text-sm font-medium text-[#7b4b2b] transition-all duration-200 hover:text-[#4b2b18] hover:gap-3`,
  }[variant]

  return (
    <Link href={href} className={className}>
      {children}
      <ArrowRight size={17} aria-hidden />
    </Link>
  )
}

/* ─── Animated Section Wrapper ─── */
function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeUp}
      transition={{ type: 'spring', stiffness: 80, damping: 20, delay }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

/* ─── Props ─── */
type Props = {
  fontClassName: string
}

/* ═══════════════════════════════════════════
   Main Page Component
═══════════════════════════════════════════ */
export default function HomePageGptSkill({ fontClassName }: Props) {
  return (
    <main className="bg-[#fbf8f4] text-[#272421]">
      {/* ══════ HERO — Asymmetric Split Layout ══════ */}
      <section className="relative isolate overflow-hidden border-b border-[#e7ded3]">
        {/* Background abstract pattern — no stock photos */}
        <div className="absolute inset-y-0 right-0 hidden w-[56%] opacity-60 lg:block" aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#fbf8f4]/60 to-[#fbf8f4]" />
          <svg className="h-full w-full opacity-20" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="hero-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d4a574" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8b7355" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <rect width="800" height="800" fill="url(#hero-grad)" />
            <circle cx="400" cy="300" r="200" fill="none" stroke="#c4a882" strokeWidth="0.5" opacity="0.4" />
            <circle cx="500" cy="450" r="320" fill="none" stroke="#8b7355" strokeWidth="0.3" opacity="0.3" />
            <circle cx="300" cy="500" r="150" fill="none" stroke="#d4a574" strokeWidth="0.4" opacity="0.25" />
            <line x1="100" y1="200" x2="700" y2="600" stroke="#c4a882" strokeWidth="0.3" opacity="0.15" />
            <line x1="200" y1="100" x2="600" y2="700" stroke="#8b7355" strokeWidth="0.3" opacity="0.12" />
          </svg>
        </div>

        <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 py-14 sm:px-8 lg:min-h-[100dvh] lg:grid-cols-[minmax(0,1fr)_minmax(520px,1fr)] lg:px-12 lg:py-16">
          {/* Left: Text Block */}
          <motion.div
            className="flex min-w-0 max-w-3xl flex-col justify-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.p variants={staggerItem} className="mb-7 flex items-center gap-3 text-sm font-medium text-[#a65a2c]">
              <span className="h-px w-6 bg-[#d96f38]" />
              装修判断力 / 签约前报价风险初筛
            </motion.p>

            <motion.h1
              variants={staggerItem}
              className="max-w-[22rem] text-[2.1rem] font-semibold leading-[1.16] tracking-tight text-[#24211e] sm:max-w-4xl sm:text-[4.25rem] xl:text-[5.25rem]"
            >
              <span className="block">装修报价拿到手，</span>
              <span className="block">先别急着签。</span>
            </motion.h1>

            <motion.p variants={staggerItem} className="mt-7 max-w-[22rem] text-base leading-8 text-[#5f5952] sm:max-w-2xl sm:text-lg">
              适合已经拿到装修报价、准备比较或快签约的人。先把漏项、模糊项、付款节点和追问顺序看清楚，再决定要不要继续谈。
            </motion.p>

            <motion.div variants={staggerItem} className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ActionLink href="/tools/quote-check">
                <UploadSimple size={18} aria-hidden />
                开始免费报价初筛
              </ActionLink>
              <ActionLink href="/resources#baojia-shenhe-qingdan" variant="secondary">
                查看签约前自查清单
              </ActionLink>
            </motion.div>

            <motion.div variants={staggerItem} className="mt-6">
              <ActionLink href="/about" variant="text">
                了解 Zeno 的装修经验和判断方法
              </ActionLink>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="mt-10 grid max-w-3xl grid-cols-2 gap-px border border-[#e8ddd1] bg-[#e8ddd1] sm:grid-cols-4"
            >
              {['16 年\n装修现场', '5 个\n判断维度', '免费\n初筛入口', '边界\n先说清'].map((item) => {
                const [title, body] = item.split('\n')
                return (
                  <div key={item} className="bg-white/76 px-4 py-4">
                    <p className="text-sm font-semibold leading-5 text-[#3a332e]">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-[#7c7168]">{body}</p>
                  </div>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Right: Info Cards with scale-in */}
          <motion.div
            className="grid min-w-0 content-center gap-4 lg:pl-2"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <div className="grid min-w-0 gap-4 xl:grid-cols-[1.04fr_0.96fr]">
              {/* Quote Risk Card — Liquid Glass refraction */}
              <motion.div
                variants={scaleIn}
                className="min-w-0 border border-white/70 bg-white/86 p-7 backdrop-blur-sm"
                style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 22px 70px rgba(80,55,32,0.12)' }}
              >
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
                  {quoteSignals.map((item, idx) => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <p className="text-sm font-semibold text-[#322d28]">{item.label}</p>
                        <p className={`${fontClassName} text-lg font-semibold tabular-nums text-[#8b4d27]`}>{item.value}</p>
                      </div>
                      <div className="h-2 overflow-hidden bg-[#efe5da]">
                        <motion.div
                          className="h-full origin-left"
                          style={{ backgroundColor: item.color, width: item.value }}
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ type: 'spring', stiffness: 60, damping: 18, delay: 0.4 + idx * 0.12 }}
                        />
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
              </motion.div>

              {/* Right Column Stack */}
              <div className="grid gap-4">
                {/* Brand Axis Card */}
                <motion.div
                  variants={scaleIn}
                  className="min-w-0 bg-[#2b261f] p-7 text-white"
                  style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 22px 70px rgba(80,55,32,0.15)' }}
                >
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
                </motion.div>

                {/* Next Steps Card — Liquid Glass */}
                <motion.div
                  variants={scaleIn}
                  className="bg-white/84 p-5 backdrop-blur-sm"
                  style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 18px 50px rgba(80,55,32,0.10)' }}
                >
                  <p className="text-sm font-semibold text-[#332d27]">现在从哪一步开始</p>
                  <div className="mt-3 grid gap-2">
                    {nextStepLinks.map((item) => (
                      <Link key={item.label} href={item.href} className="group flex items-center justify-between gap-4 border border-[#ead9c7] bg-[#fbf8f4] px-4 py-3 text-sm font-medium text-[#6b4125] transition-all duration-200 hover:border-[#b9875d] hover:bg-white active:scale-[0.99]">
                        {item.label}
                        <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════ Section 02: Pain Points — Asymmetric 2+3 Grid ══════ */}
      <AnimatedSection className="border-b border-[#e7ded3] py-20 sm:py-24">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium text-[#a65a2c]">02</p>
            <h2 className="mt-3 text-[clamp(2rem,4vw,3.8rem)] font-semibold leading-tight tracking-tight text-[#25221f]">
              很多装修后悔，不是发生在施工后。
            </h2>
            <p className="mt-4 text-base leading-8 text-[#756c63]">报价没看懂，合同没问清，预算没拆透，后面就容易一步步被动。签约前先把判断做清楚。</p>
          </div>

          {/* Asymmetric: Row 1 → 2 cols (wider), Row 2 → 3 cols (narrower) */}
          <motion.div
            className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {problemCards.slice(0, 2).map((card) => {
              const Icon = card.icon
              return (
                <motion.div key={card.title} variants={staggerItem}>
                  <Link
                    href={card.href}
                    className="group flex min-h-[16rem] flex-col border border-[#e4d8cb] bg-white p-8 transition-all duration-200 hover:-translate-y-px hover:shadow-[0_24px_70px_rgba(67,45,26,0.1)] active:scale-[0.995]"
                    style={{ boxShadow: '0 18px 60px rgba(67,45,26,0.06)' }}
                  >
                    <span className="flex h-14 w-14 items-center justify-center border border-[#c09a77] text-[#a15b2f]">
                      <Icon size={30} weight="duotone" aria-hidden />
                    </span>
                    <h3 className="mt-6 text-xl font-semibold leading-8 text-[#2c2824]">{card.title}</h3>
                    <p className="mt-3 max-w-[45ch] text-sm leading-7 text-[#6f675f]">{card.body}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-[#7b4b2b] transition-all duration-200 group-hover:gap-3">
                      进入这条线
                      <ArrowRight size={16} aria-hidden />
                    </span>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.div
            className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {problemCards.slice(2).map((card) => {
              const Icon = card.icon
              return (
                <motion.div key={card.title} variants={staggerItem}>
                  <Link
                    href={card.href}
                    className="group flex min-h-[16rem] flex-col border border-[#e4d8cb] bg-white p-8 transition-all duration-200 hover:-translate-y-px hover:shadow-[0_24px_70px_rgba(67,45,26,0.1)] active:scale-[0.995]"
                    style={{ boxShadow: '0 18px 60px rgba(67,45,26,0.06)' }}
                  >
                    <span className="flex h-14 w-14 items-center justify-center border border-[#c09a77] text-[#a15b2f]">
                      <Icon size={30} weight="duotone" aria-hidden />
                    </span>
                    <h3 className="mt-6 text-xl font-semibold leading-8 text-[#2c2824]">{card.title}</h3>
                    <p className="mt-3 max-w-[45ch] text-sm leading-7 text-[#6f675f]">{card.body}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-[#7b4b2b] transition-all duration-200 group-hover:gap-3">
                      进入这条线
                      <ArrowRight size={16} aria-hidden />
                    </span>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ══════ Section 03: Framework — Horizontal Flow Steps ══════ */}
      <AnimatedSection className="border-b border-[#e7ded3] bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <p className="flex items-center justify-center gap-4 text-sm font-medium tracking-[0.18em] text-[#a65a2c]">
              <span className="h-px w-28 bg-[#dfc5ac]" />
              03 / 判断方法
              <span className="h-px w-28 bg-[#dfc5ac]" />
            </p>
            <h2 className="mt-6 text-[clamp(2.6rem,5vw,5rem)] font-semibold leading-tight tracking-tight text-[#25221f]">
              我先看五件事，不先制造焦虑。
            </h2>
            <p className="mt-4 text-base leading-8 text-[#686159]">项目完整性、价格异常、漏项风险、边界说明、预算取舍。看完这些，再决定要不要继续谈、怎么追问。</p>
          </div>

          <motion.div
            className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {frameworkSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div key={step.number} variants={staggerItem} className="relative text-center">
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
                  <span className={`${fontClassName} -mt-4 inline-flex h-9 min-w-9 items-center justify-center bg-[#b48d67] px-3 text-sm font-semibold tabular-nums text-white`}>
                    {step.number}
                  </span>
                  <h3 className="mt-6 text-xl font-semibold text-[#2c2824]">{step.title}</h3>
                  <p className="mx-auto mt-3 max-w-[11rem] text-sm leading-7 text-[#6f675f]">{step.body}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ══════ Section 04: Tools — Asymmetric 1+3 Layout ══════ */}
      <AnimatedSection className="border-b border-[#e7ded3] py-20 sm:py-24">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-medium tracking-[0.18em] text-[#a65a2c]">04 / 免费入口</p>
            <h2 className="mt-5 text-[clamp(2rem,4.4vw,4.25rem)] font-semibold leading-tight tracking-tight text-[#25221f]">
              先让你拿到具体东西，再决定要不要付费。
            </h2>
            <p className="mt-4 text-base leading-8 text-[#6f675f]">免费初筛负责缩小问题，低价资料负责补判断，人工服务只处理工具看不明白、临近签约的部分。</p>
          </div>

          {/* Asymmetric: 1 featured + 3 stacked — NOT generic 4-equal cards */}
          <motion.div
            className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_1fr]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {/* Featured tool — larger */}
            <motion.div variants={staggerItem}>
              <Link
                href={toolCards[0].href}
                className="group flex h-full flex-col border border-[#e4d8cb] bg-white p-10 transition-all duration-200 hover:-translate-y-px hover:shadow-[0_26px_80px_rgba(67,45,26,0.11)] active:scale-[0.998]"
                style={{ boxShadow: '0 18px 60px rgba(67,45,26,0.07)' }}
              >
                <ShieldCheck size={56} weight="duotone" className="text-[#a15b2f]" aria-hidden />
                <h3 className="mt-7 text-2xl font-semibold text-[#2b2723]">{toolCards[0].title}</h3>
                <p className="mt-4 max-w-[40ch] text-base leading-8 text-[#6f675f]">{toolCards[0].body}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-medium text-[#7b4b2b] transition-all duration-200 group-hover:gap-3">
                  {toolCards[0].action}
                  <ArrowRight size={16} aria-hidden />
                </span>
              </Link>
            </motion.div>

            {/* 3 tools stacked */}
            <div className="grid gap-4">
              {toolCards.slice(1).map((card) => {
                const Icon = card.icon
                return (
                  <motion.div key={card.title} variants={staggerItem}>
                    <Link
                      href={card.href}
                      className="group flex items-center gap-6 border border-[#e4d8cb] bg-white p-6 transition-all duration-200 hover:-translate-y-px hover:shadow-[0_18px_50px_rgba(67,45,26,0.09)] active:scale-[0.998]"
                      style={{ boxShadow: '0 12px 40px rgba(67,45,26,0.05)' }}
                    >
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-[#ead9c7] bg-[#fbf8f4] text-[#a15b2f]">
                        <Icon size={28} weight="duotone" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-[#2b2723]">{card.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-[#6f675f]">{card.body}</p>
                      </div>
                      <ArrowRight size={18} className="shrink-0 text-[#7b4b2b] transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          <div className="mt-10 text-center">
            <ActionLink href="/resources" variant="text">
              进入资料与清单
            </ActionLink>
          </div>
        </div>
      </AnimatedSection>

      {/* ══════ Section 05: Services — 2x2 Grid ══════ */}
      <AnimatedSection className="relative isolate overflow-hidden border-b border-[#e7ded3] bg-white py-20 sm:py-24">
        <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <p className="text-sm font-semibold text-[#8b4d27]">05 / 付费产品</p>
          <div className="mt-8 text-center">
            <h2 className="text-[clamp(2rem,4.2vw,4.1rem)] font-semibold leading-tight tracking-tight text-[#25221f]">
              服务不从高客单开始，从低门槛信任入口开始。
            </h2>
            <p className="mt-4 text-base leading-8 text-[#6f675f]">内容建立信任，工具筛选真实需求，咨询处理关键判断。没有材料、不临近决策，就先回到免费工具和清单。</p>
          </div>

          {/* 2x2 grid — avoid generic 4-equal-col */}
          <motion.div
            className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {serviceCards.map((card) => {
              const Icon = card.icon
              return (
                <motion.div key={card.title} variants={staggerItem}>
                  <Link
                    href={card.href}
                    className="group flex min-h-[22rem] flex-col border border-[#e4d8cb] bg-white/90 p-8 transition-all duration-200 hover:-translate-y-px hover:shadow-[0_26px_80px_rgba(67,45,26,0.12)] active:scale-[0.998]"
                    style={{ boxShadow: '0 18px 70px rgba(67,45,26,0.08)' }}
                  >
                    <div className="flex items-start gap-5">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-[#ead9c7] bg-[#fbf8f4] text-[#a15b2f]">
                        <Icon size={30} weight="duotone" aria-hidden />
                      </span>
                      <div>
                        <h3 className="text-xl font-semibold leading-snug text-[#2b2723]">{card.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-[#6f675f]">{card.body}</p>
                      </div>
                    </div>
                    <div className="my-6 h-px bg-[#e6d9cc]" />
                    <ul className="space-y-3">
                      {card.bullets.map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm text-[#514b45]">
                          <CheckCircle size={18} weight="duotone" className="shrink-0 text-[#a15b2f]" aria-hidden />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex items-end justify-between gap-4 pt-8">
                      <p className={`${fontClassName} text-2xl font-medium tabular-nums text-[#8b4d27]`}>{card.price}</p>
                      <span className="inline-flex items-center gap-2 bg-[#9a5424] px-5 py-2 text-sm font-medium text-white transition-all duration-200 group-hover:bg-[#7f421a] active:scale-[0.97]">
                        看服务边界
                        <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Trust Bar */}
          <motion.div
            className="mt-8 grid grid-cols-1 border border-[#e8ddd1] bg-white/82 sm:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.2 }}
          >
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
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ══════ Section 06: About — Split Screen ══════ */}
      <AnimatedSection className="grid min-h-[100dvh] grid-cols-1 border-b border-[#e7ded3] bg-white lg:grid-cols-[0.52fr_0.48fr]">
        {/* Left: Abstract visual — no stock photos */}
        <div className="relative min-h-[24rem] overflow-hidden bg-[#2b261f] lg:min-h-full" aria-hidden>
          <div className="absolute inset-0 opacity-30">
            <svg className="h-full w-full" viewBox="0 0 600 900" preserveAspectRatio="xMidYMid slice">
              <defs>
                <radialGradient id="about-grad" cx="40%" cy="50%" r="60%">
                  <stop offset="0%" stopColor="#c4a882" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#2b261f" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="600" height="900" fill="url(#about-grad)" />
              <circle cx="200" cy="350" r="180" fill="none" stroke="#c4a882" strokeWidth="0.5" opacity="0.5" />
              <circle cx="350" cy="550" r="240" fill="none" stroke="#8b7355" strokeWidth="0.4" opacity="0.3" />
              <circle cx="150" cy="650" r="100" fill="none" stroke="#d4a574" strokeWidth="0.3" opacity="0.25" />
              <path d="M50 200 Q200 400 100 700" fill="none" stroke="#c4a882" strokeWidth="0.6" opacity="0.2" />
              <path d="M400 100 Q350 450 500 800" fill="none" stroke="#8b7355" strokeWidth="0.4" opacity="0.15" />
            </svg>
          </div>
          <div className="absolute bottom-12 left-8 max-w-[280px]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c4a882]/80">Since 2010</p>
            <p className="mt-2 text-lg font-medium leading-relaxed text-white/60">16 年装修现场，走过的坑比讲的多。</p>
          </div>
        </div>

        {/* Right: Text Content */}
        <div className="flex items-center px-5 py-16 sm:px-10 lg:px-16">
          <motion.div
            className="max-w-2xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.p variants={staggerItem} className="text-sm font-medium tracking-[0.18em] text-[#a65a2c]">06</motion.p>
            <motion.h2 variants={staggerItem} className="mt-5 text-[clamp(2.5rem,5vw,4.75rem)] font-semibold leading-tight tracking-tight text-[#25221f]">
              我不是泛装修博主，也不想吓唬你。
            </motion.h2>
            <motion.div variants={staggerItem} className="mt-7 space-y-5 text-base leading-9 text-[#504a44]">
              <p>我做装修 16 年，见过很多后悔不是来自审美，而是来自签约前没问清、预算里没留边界、施工中没有留痕。</p>
              <p>我想做的是装修判断力和生活方式审美的内容型个人品牌。不是替你做所有决定，而是在关键节点上帮你看清楚风险、关键点和下一步。</p>
            </motion.div>

            <motion.div variants={staggerItem} className="mt-10 grid grid-cols-1 gap-px border border-[#e6d9cc] bg-[#e6d9cc] sm:grid-cols-3">
              {['经验\n真实现场', '审美\n长期居住', '工具\n可复用判断'].map((item) => {
                const [title, body] = item.split('\n')
                return (
                  <div key={item} className="bg-[#fbf8f4] px-5 py-5">
                    <p className={`${fontClassName} text-3xl font-medium tabular-nums text-[#8b4d27]`}>{title}</p>
                    <p className="mt-1 text-sm text-[#6f675f]">{body}</p>
                  </div>
                )
              })}
            </motion.div>

            <motion.div variants={staggerItem} className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ActionLink href="/tools/quote-check">先做报价初筛</ActionLink>
              <ActionLink href="/services/renovation#baojia-shenhe" variant="secondary">看报价快审边界</ActionLink>
            </motion.div>

            <motion.p variants={staggerItem} className="mt-8 border-t border-[#e6d9cc] pt-6 text-sm leading-7 text-[#716961]">
              起点一定要窄。越具体，越容易被信任；越能解决一个真实问题，越容易形成长期资产。
            </motion.p>
          </motion.div>
        </div>
      </AnimatedSection>
    </main>
  )
}
