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
import CommercialLadder from '@/components/CommercialLadder'

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
    transition: { type: 'spring' as const, stiffness: 120, damping: 20 },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 100, damping: 22 },
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
  { label: '常见漏项', value: '5 类', width: '72%', note: '水电、防水、找平、拆改、搬运——没写清就是增项入口', color: '#9a5424' },
  { label: '追问清单', value: '12 项', width: '88%', note: '签字前该逐项问清的具体条目', color: '#3f6258' },
  { label: '付款节点', value: '4 个', width: '56%', note: '开工、水电、泥木、竣工——每个都需要验收对齐', color: '#31485c' },
]

const caseStudies = [
  {
    tag: '低价陷阱',
    title: '报价便宜 3 万，为什么我反而建议先别签',
    summary: '总价 8.2 万看起来很有竞争力，但水电按实结、防水面积未写、垃圾外运不含——三项加起来预计增项 2.8–4.1 万。签约前追问 6 个点后，业主决定先让对方补齐再比较。',
    result: '补齐后实际报价 11.7 万，高于另一家的 10.9 万。',
  },
  {
    tag: '增项风险',
    title: '合同写了按实际结算，签完多花了 4.2 万',
    summary: '合同里水电改造写"按实际发生量结算"，没有封顶、没有预估、没有单价明细。施工到一半业主才知道每米线管单价比市场高 40%，但已经开槽无法更换。',
    result: '后续协商扣回 0.8 万，其余 3.4 万只能认。',
  },
  {
    tag: '付款节点',
    title: '付款 70% 才到贴砖阶段，验收时已经没有筹码',
    summary: '合同约定开工 40%、水电 30%、泥木 20%、竣工 10%。泥木验收发现墙砖空鼓率超标，但业主只剩 10% 尾款，施工方态度强硬不愿返工。',
    result: '建议的节点比例是 30/25/25/20，验收前始终保留 ≥20% 作为谈判空间。',
  },
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

const trustItems: Array<{ icon: IconComponent; title: string; body: string }> = [
  { icon: ShieldCheck, title: '现场验证', body: '装修判断来自真实报价、预算和施工问题。' },
  { icon: Wrench, title: '工具沉淀', body: '不靠感觉吓人，把判断拆成清单和步骤。' },
  { icon: UsersThree, title: '说清边界', body: '能帮什么、不能帮什么先讲明白。' },
]

/* ─── Reusable Components ─── */
function ActionLink({ href, children, variant = 'primary' }: ActionLinkProps) {
  const baseClass = 'inline-flex min-h-12 items-center justify-center gap-2 text-sm font-medium transition-all duration-200'
  const className = {
    primary: `${baseClass} bg-stone px-5 py-3 text-white hover:bg-stone-deep active:scale-[0.98] active:-translate-y-px`,
    secondary: `${baseClass} border border-border bg-surface/70 px-5 py-3 text-stone-deep hover:bg-surface hover:border-stone active:scale-[0.98]`,
    text: `inline-flex items-center gap-2 text-sm font-medium text-stone transition-all duration-200 hover:text-ink hover:gap-3`,
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
    <main className="bg-canvas text-ink">
      {/* ══════ HERO — Asymmetric Split Layout ══════ */}
      <section className="relative isolate overflow-hidden border-b border-border">
        {/* Background abstract pattern — no stock photos */}
        <div className="absolute inset-y-0 right-0 hidden w-[56%] opacity-60 lg:block" aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-canvas/60 to-canvas" />
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

        <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 py-14 sm:px-8 lg:min-h-[100dvh] lg:grid-cols-[minmax(0,1.2fr)_minmax(380px,0.8fr)] lg:px-12 lg:py-16">
          {/* Left: Text Block */}
          <motion.div
            className="flex min-w-0 max-w-3xl flex-col justify-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1
              variants={staggerItem}
              className="max-w-[22rem] text-[2.1rem] font-semibold leading-[1.16] tracking-tight text-ink sm:max-w-4xl sm:text-[4.25rem] xl:text-[5.25rem]"
            >
              <span className="block">\u62ff\u5230\u88c5\u4fee\u62a5\u4ef7\u5355\uff0c</span>
              <span className="block">不知道能不能签？</span>
            </motion.h1>

            <motion.p variants={staggerItem} className="mt-7 max-w-[22rem] text-base leading-8 text-ink-muted sm:max-w-2xl sm:text-lg">
              上传或对照报价单，先查 8 个签约前风险。
            </motion.p>

            <motion.div variants={staggerItem} className="mt-9">
              <ActionLink href="/tools/quote-check">
                <UploadSimple size={18} aria-hidden />
                免费生成报价追问清单
              </ActionLink>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="mt-10 grid max-w-3xl grid-cols-2 gap-px border border-border bg-[#e8ddd1] sm:grid-cols-4"
            >
              {['16 年\n装修现场', '5 个\n判断维度', '免费\n初筛入口', '边界\n先说清'].map((item) => {
                const [title, body] = item.split('\n')
                return (
                  <div key={item} className="bg-surface/76 px-4 py-4">
                    <p className="text-sm font-semibold leading-5 text-ink">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-ink-faint">{body}</p>
                  </div>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Right: Quote Risk Card — single focused element */}
          <motion.div
            className="grid min-w-0 content-center gap-4 lg:pl-2"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <div className="grid min-w-0 gap-4">
              {/* Quote Risk Card — Liquid Glass refraction */}
              <motion.div
                variants={scaleIn}
                className="min-w-0 border border-surface/70 bg-surface/86 p-7 backdrop-blur-sm"
                style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 22px 70px rgba(80,55,32,0.12)' }}
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-stone">QUOTE RISK</p>
                    <h2 className="mt-3 break-all text-xl font-semibold leading-snug text-ink sm:break-normal sm:text-2xl">不是先判断贵不贵，先判断能不能签。</h2>
                  </div>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-surface-warm text-stone">
                    <ShieldCheck size={26} weight="duotone" aria-hidden />
                  </span>
                </div>

                <div className="mt-8 space-y-5">
                  {quoteSignals.map((item, idx) => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <p className="text-sm font-semibold text-ink">{item.label}</p>
                        <p className={`${fontClassName} text-lg font-semibold tabular-nums text-stone`}>{item.value}</p>
                      </div>
                      <div className="h-2 overflow-hidden bg-stone-pale">
                        <motion.div
                          className="h-full origin-left"
                          style={{ backgroundColor: item.color, width: item.width }}
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ type: 'spring', stiffness: 60, damping: 18, delay: 0.4 + idx * 0.12 }}
                        />
                      </div>
                      <p className="mt-2 text-xs leading-5 text-ink-faint">{item.note}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-t border-border pt-6">
                  <p className="text-sm font-semibold text-ink">初筛会输出什么</p>
                  <div className="mt-4 grid gap-2 text-sm text-ink-muted sm:grid-cols-2">
                    {['风险等级', '漏项提醒', '追问清单', '下一步建议'].map((item) => (
                      <span key={item} className="border border-border bg-canvas px-3 py-2">{item}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════ Section 02: Pain Points — Asymmetric 2+3 Grid ══════ */}
      <AnimatedSection className="border-b border-border py-20 sm:py-24">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium text-stone">02</p>
            <h2 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight tracking-tight text-ink">
              很多装修后悔，不是发生在施工后。
            </h2>
            <p className="mt-4 text-base leading-8 text-ink-muted">报价没看懂，合同没问清，预算没拆透，后面就容易一步步被动。签约前先把判断做清楚。</p>
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
                    className="group flex min-h-[16rem] flex-col border border-border bg-surface p-8 transition-all duration-200 hover:-translate-y-px hover:shadow-[0_24px_70px_rgba(67,45,26,0.1)] active:scale-[0.995]"
                    style={{ boxShadow: '0 18px 60px rgba(67,45,26,0.06)' }}
                  >
                    <span className="flex h-14 w-14 items-center justify-center border border-stone-light text-stone">
                      <Icon size={30} weight="duotone" aria-hidden />
                    </span>
                    <h3 className="mt-6 text-xl font-semibold leading-8 text-ink">{card.title}</h3>
                    <p className="mt-3 max-w-[45ch] text-sm leading-7 text-ink-muted">{card.body}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-stone transition-all duration-200 group-hover:gap-3">
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
                    className="group flex min-h-[16rem] flex-col border border-border bg-surface p-8 transition-all duration-200 hover:-translate-y-px hover:shadow-[0_24px_70px_rgba(67,45,26,0.1)] active:scale-[0.995]"
                    style={{ boxShadow: '0 18px 60px rgba(67,45,26,0.06)' }}
                  >
                    <span className="flex h-14 w-14 items-center justify-center border border-stone-light text-stone">
                      <Icon size={30} weight="duotone" aria-hidden />
                    </span>
                    <h3 className="mt-6 text-xl font-semibold leading-8 text-ink">{card.title}</h3>
                    <p className="mt-3 max-w-[45ch] text-sm leading-7 text-ink-muted">{card.body}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-stone transition-all duration-200 group-hover:gap-3">
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
      <AnimatedSection className="border-b border-border bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <p className="flex items-center justify-center gap-4 text-sm font-medium tracking-[0.18em] text-stone">
              <span className="h-px w-28 bg-[#dfc5ac]" />
              03 / 判断方法
              <span className="h-px w-28 bg-[#dfc5ac]" />
            </p>
            <h2 className="mt-6 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight tracking-tight text-ink">
              我先看五件事，不先制造焦虑。
            </h2>
            <p className="mt-4 text-base leading-8 text-ink-muted">项目完整性、价格异常、漏项风险、边界说明、预算取舍。看完这些，再决定要不要继续谈、怎么追问。</p>
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
                  <div className="mx-auto flex h-28 w-28 items-center justify-center border border-border bg-canvas">
                    <Icon size={42} weight="duotone" className="text-stone" aria-hidden />
                  </div>
                  <span className={`${fontClassName} -mt-4 inline-flex h-9 min-w-9 items-center justify-center bg-stone px-3 text-sm font-semibold tabular-nums text-white`}>
                    {step.number}
                  </span>
                  <h3 className="mt-6 text-xl font-semibold text-ink">{step.title}</h3>
                  <p className="mx-auto mt-3 max-w-[11rem] text-sm leading-7 text-ink-muted">{step.body}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ══════ Section 04: Tools — Asymmetric 1+3 Layout ══════ */}
      <AnimatedSection className="border-b border-border py-20 sm:py-24">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-medium tracking-[0.18em] text-stone">04 / 免费入口</p>
            <h2 className="mt-5 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight tracking-tight text-ink">
              先让你拿到具体东西，再决定要不要付费。
            </h2>
            <p className="mt-4 text-base leading-8 text-ink-muted">免费初筛负责缩小问题，低价资料负责补判断，人工服务只处理工具看不明白、临近签约的部分。</p>
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
                className="group flex h-full flex-col border border-border bg-surface p-10 transition-all duration-200 hover:-translate-y-px hover:shadow-[0_26px_80px_rgba(67,45,26,0.11)] active:scale-[0.998]"
                style={{ boxShadow: '0 18px 60px rgba(67,45,26,0.07)' }}
              >
                <ShieldCheck size={56} weight="duotone" className="text-stone" aria-hidden />
                <h3 className="mt-7 text-2xl font-semibold text-ink">{toolCards[0].title}</h3>
                <p className="mt-4 max-w-[40ch] text-base leading-8 text-ink-muted">{toolCards[0].body}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-medium text-stone transition-all duration-200 group-hover:gap-3">
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
                      className="group flex items-center gap-6 border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-px hover:shadow-[0_18px_50px_rgba(67,45,26,0.09)] active:scale-[0.998]"
                      style={{ boxShadow: '0 12px 40px rgba(67,45,26,0.05)' }}
                    >
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-border bg-canvas text-stone">
                        <Icon size={28} weight="duotone" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-ink">{card.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-ink-muted">{card.body}</p>
                      </div>
                      <ArrowRight size={18} className="shrink-0 text-stone transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
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

      {/* ══════ Section 04.5: Sample Deliverables — Social Proof ══════ */}
      <AnimatedSection className="border-b border-border bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium tracking-[0.18em] text-stone">04.5 / 你会拿到什么</p>
            <h2 className="mt-5 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight tracking-tight text-ink">
              不只是建议，是可以拿去用的文件。
            </h2>
            <p className="mt-4 text-base leading-8 text-ink-muted">以下是脱敏样张。付费服务交付的是基于你真实报价单生成的完整版。</p>
          </div>

          <motion.div
            className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {[
              {
                src: '/images/services/sample-risk-report.svg',
                alt: '报价风险报告脱敏样张',
                label: '报价风险报告',
                desc: '风险等级 + 漏项 + 模糊项 + 异常单价，一页看清。',
              },
              {
                src: '/images/services/sample-followup-checklist.svg',
                alt: '追问清单脱敏样张',
                label: '签约前追问清单',
                desc: '逐项列出该问施工方的具体问题，对应风险编号。',
              },
              {
                src: '/images/services/sample-communication-script.svg',
                alt: '话术示例脱敏样张',
                label: '话术示例',
                desc: '可以直接发给装修公司的追问话术，不暴露来源。',
              },
            ].map((item) => (
              <motion.div key={item.label} variants={staggerItem} className="overflow-hidden border border-border bg-white">
                <div className="relative aspect-[4/3] border-b border-border bg-canvas">
                  <img src={item.src} alt={item.alt} className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-stone">{item.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-10 text-center">
            <ActionLink href="/tools/quote-check">
              <UploadSimple size={18} aria-hidden />
              先做免费报价初筛，看完再决定
            </ActionLink>
          </div>
        </div>
      </AnimatedSection>

      {/* ══════ Section 04.8: Case Studies — Trust through real examples ══════ */}
      <AnimatedSection className="border-b border-border py-20 sm:py-24">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium tracking-[0.18em] text-stone">04.8 / 真实案例</p>
            <h2 className="mt-5 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight tracking-tight text-ink">
              这些问题，都是签约前能避开的。
            </h2>
            <p className="mt-4 text-base leading-8 text-ink-muted">以下是脱敏后的真实判断案例。细节已做匿名处理，风险类型和金额区间保持原样。</p>
          </div>

          <motion.div
            className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {caseStudies.map((item) => (
              <motion.div
                key={item.title}
                variants={staggerItem}
                className="flex flex-col border border-border bg-surface p-7"
                style={{ boxShadow: '0 12px 40px rgba(67,45,26,0.05)' }}
              >
                <p className="inline-flex w-fit border border-stone-light bg-surface-warm px-3 py-1 text-xs font-semibold text-stone">{item.tag}</p>
                <h3 className="mt-4 text-lg font-semibold leading-snug text-ink">{item.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-7 text-ink-muted">{item.summary}</p>
                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-stone">结果</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.result}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-10 text-center">
            <ActionLink href="/services/renovation" variant="secondary">
              看我的判断服务边界
            </ActionLink>
          </div>
        </div>
      </AnimatedSection>

      {/* ══════ Section 05: Services — 2x2 Grid ══════ */}
      <AnimatedSection className="relative isolate overflow-hidden border-b border-border bg-surface py-20 sm:py-24">
        <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <p className="text-sm font-semibold text-stone">05 / 付费产品</p>
          <div className="mt-8 text-center">
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight tracking-tight text-ink">
              不是越贵越好，看你卡在哪一步。
            </h2>
            <p className="mt-4 text-base leading-8 text-ink-muted">从免费报价初筛到 ¥9800 起的居住场景服务，按你现在临近什么决策来选——不要先看价格，先看适合谁。</p>
          </div>

          {/* 统一商业梯子：data/commercial-ladder.ts 是单一真源 */}
          <motion.div
            className="mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
          >
            <CommercialLadder variant="compact" />
          </motion.div>

          {/* Trust Bar */}
          <motion.div
            className="mt-8 grid grid-cols-1 border border-border bg-surface/82 sm:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.2 }}
          >
            {trustItems.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="flex items-center gap-4 border-b border-border px-6 py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                  <Icon size={32} weight="duotone" className="shrink-0 text-stone" aria-hidden />
                  <div>
                    <p className="font-semibold text-ink">{item.title}</p>
                    <p className="text-sm leading-6 text-ink-faint">{item.body}</p>
                  </div>
                </div>
              )
            })}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ══════ Section 06: About — Split Screen ══════ */}
      <AnimatedSection className="grid min-h-[80dvh] grid-cols-1 border-b border-border bg-surface lg:grid-cols-[0.52fr_0.48fr]">
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-light/80">Since 2010</p>
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
            <motion.p variants={staggerItem} className="text-sm font-medium tracking-[0.18em] text-stone">06</motion.p>
            <motion.h2 variants={staggerItem} className="mt-5 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight tracking-tight text-ink">
              我不是泛装修博主，也不想吓唬你。
            </motion.h2>
            <motion.div variants={staggerItem} className="mt-7 space-y-5 text-base leading-9 text-ink-muted">
              <p>我做装修 16 年，见过很多后悔不是来自审美，而是来自签约前没问清、预算里没留边界、施工中没有留痕。</p>
              <p>我想帮你解决的，就是签约前的判断问题。不是替你做所有决定，而是在关键节点上帮你看清楚风险、关键点和下一步。</p>
            </motion.div>

            <motion.div variants={staggerItem} className="mt-10 grid grid-cols-1 gap-px border border-border bg-[#e6d9cc] sm:grid-cols-3">
              {['经验\n真实现场', '审美\n长期居住', '工具\n可复用判断'].map((item) => {
                const [title, body] = item.split('\n')
                return (
                  <div key={item} className="bg-canvas px-5 py-5">
                    <p className={`${fontClassName} text-3xl font-medium tabular-nums text-stone`}>{title}</p>
                    <p className="mt-1 text-sm text-ink-muted">{body}</p>
                  </div>
                )
              })}
            </motion.div>

            <motion.div variants={staggerItem} className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ActionLink href="/tools/quote-check">先做报价初筛</ActionLink>
              <ActionLink href="/services/renovation#baojia-shenhe" variant="secondary">看报价快审边界</ActionLink>
            </motion.div>

            <motion.p variants={staggerItem} className="mt-8 border-t border-border pt-6 text-sm leading-7 text-ink-faint">
              起点一定要窄。越具体，越容易被信任；越能解决一个真实问题，越容易形成长期资产。
            </motion.p>
          </motion.div>
        </div>
      </AnimatedSection>
    </main>
  )
}
