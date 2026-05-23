"use client"

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ArrowRight,
  Calculator,
  ClipboardText,
  FileText,
  HouseLine,
  MagnifyingGlass,
  Notebook,
  ShieldCheck,
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
    title: '总价看起来低，但怕后面增项',
    body: '报价低不一定危险，真正要看哪些没包含、哪些暂估、哪些按实结算。',
    href: '/tools/quote-check',
  },
  {
    icon: Calculator,
    title: '材料写得模糊，不知道以后会不会被替换',
    body: '只写品牌、环保材料、同等档次，不写型号和规格，后期很容易扯皮。',
    href: '/risk-dictionary',
  },
  {
    icon: ClipboardText,
    title: '销售承诺很多，但合同里没写清',
    body: '口头说都包含，不等于合同里有保障。签约前要把关键承诺落到纸面。',
    href: '/checklists',
  },
  {
    icon: Notebook,
    title: '几家报价差很多，不知道怎么比',
    body: '不能只比总价，要看包含范围、漏项、付款节点和增项入口。',
    href: '/services/renovation#quote-standard',
  },
  {
    icon: HouseLine,
    title: '快签约了，想找人再看一遍',
    body: '报价、合同和付款节点都有了，就适合做一次签约前风险判断。',
    href: '/services/renovation#quote-deep',
  },
]

const frameworkSteps: Array<{
  number: string
  icon: IconComponent
  title: string
  body: string
}> = [
  { number: '01', icon: MagnifyingGlass, title: '看漏项', body: '识别哪些项目没写，后面容易变成增项。' },
  { number: '02', icon: Calculator, title: '看模糊项', body: '材料、工艺、数量和面积有没有说清。' },
  { number: '03', icon: FileText, title: '看风险词', body: '暂估、另计、按实结算和现场为准要重点追问。' },
  { number: '04', icon: ClipboardText, title: '看付款节点', body: '付款有没有和验收绑定，尾款是否留得住。' },
  { number: '05', icon: Notebook, title: '看合同边界', body: '口头承诺、替换规则、延期和质保有没有落字。' },
  { number: '06', icon: ShieldCheck, title: '给追问清单', body: '把签约前必须问清的问题整理成可发出去的话。' },
]

const quoteSignals = [
  { label: '常见漏项', value: '5 类', width: '72%', note: '水电、防水、找平、拆改、搬运——没写清就是增项入口', color: '#9a5424' },
  { label: '追问清单', value: '12 项', width: '88%', note: '签字前该逐项问清的具体条目', color: '#3f6258' },
  { label: '付款节点', value: '4 个', width: '56%', note: '开工、水电、泥木、竣工——每个都需要验收对齐', color: '#31485c' },
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
    title: '报价风险初筛',
    body: '先把报价里的漏项、模糊项、增项口子和付款风险筛一遍。',
    action: '免费生成追问清单',
    href: '/tools/quote-check',
  },
  {
    icon: FileText,
    title: '风险词典',
    body: '查按实结算、暂估、同档替换、最终以现场为准这些高频风险词。',
    action: '查风险词',
    href: '/risk-dictionary',
  },
  {
    icon: ClipboardText,
    title: '签约前检查模板',
    body: '报价、合同、付款节点、水电和老房翻新，都可以照着逐项问。',
    action: '看检查模板',
    href: '/checklists',
  },
  {
    icon: Wrench,
    title: '项目风险库',
    body: '按水电、防水、找平、拆除、瓷砖等项目，看签约前该写清什么。',
    action: '看项目风险',
    href: '/project-risks',
  },
]

const judgmentAssetCards: Array<{
  icon: IconComponent
  title: string
  body: string
  href: string
}> = [
  {
    icon: FileText,
    title: '按实结算',
    body: '看起来公平，实际容易把数量、范围和最终金额都留到施工后再算。',
    href: '/risk-dictionary/actual-settlement-change-order-risk',
  },
  {
    icon: ShieldCheck,
    title: '材料品牌型号缺失',
    body: '只写品牌或同档材料，不写型号规格，后期替换时很难判断是不是缩水。',
    href: '/risk-dictionary/missing-material-brand-model',
  },
  {
    icon: ClipboardText,
    title: '口头承诺未写入合同',
    body: '销售说过、群里聊过，都不等于合同有保障，关键承诺必须写成附件或备注。',
    href: '/risk-dictionary/oral-promise-not-written',
  },
  {
    icon: Wrench,
    title: '增项确认流程缺失',
    body: '没有书面确认、单价和业主同意流程，施工中的小变更很容易变成大账单。',
    href: '/risk-dictionary/change-order-confirmation-missing',
  },
]

const trustItems: Array<{ icon: IconComponent; title: string; body: string }> = [
  { icon: ShieldCheck, title: '不做泛装修百科', body: '我们只聚焦报价、合同和增项这些签约前最容易出问题的地方。' },
  { icon: Wrench, title: '不替装修公司背书', body: '我们不判断哪家公司一定靠谱，只帮你看清报价和合同里的风险点。' },
  { icon: UsersThree, title: '不制造焦虑', body: '每个风险都要落到可追问的问题上，而不是吓你不要装修。' },
]

const homeFaqs = [
  {
    question: '装修报价风险初筛是什么？',
    answer: '装修报价风险初筛是签约前对报价单进行初步检查，重点看有没有漏项、模糊项、暂估、按实结算、材料型号不清和后期增项风险。',
  },
  {
    question: '装修报价只看总价可以吗？',
    answer: '不建议只看总价。装修报价真正容易出问题的地方，往往不是总价，而是包含范围、计价方式、材料说明、施工工艺和变更规则。',
  },
  {
    question: '什么情况下需要人工复核报价？',
    answer: '如果你已经准备签约，报价里出现按实结算、暂估、另计、以现场为准、材料型号不清，或者几家报价差异很大，就建议做人工复核。',
  },
  {
    question: 'ZenoAIHome 会替我判断哪家公司靠谱吗？',
    answer: '不会。ZenoAIHome 不替装修公司背书，也不替你做最终签约决定，只帮你看清报价、合同和付款节点里的风险点。',
  },
  {
    question: '报价风险初筛和完整报价审核有什么区别？',
    answer: '初筛主要发现明显风险和追问方向，完整人工复核会进一步看漏项、模糊项、材料边界、付款节点和合同承诺。',
  },
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
              <span className="block">签约前，先看懂</span>
              <span className="block">装修报价里的风险</span>
            </motion.h1>

            <motion.p variants={staggerItem} className="mt-7 max-w-[22rem] text-base leading-8 text-ink-muted sm:max-w-2xl sm:text-lg">
              ZenoAIHome 帮你识别报价漏项、材料模糊、合同口头承诺和后期增项风险，让你在签字前多一层判断。
            </motion.p>

            <motion.div variants={staggerItem} className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ActionLink href="/tools/quote-check">
                <UploadSimple size={18} aria-hidden />
                免费做报价风险初筛
              </ActionLink>
              <ActionLink href="/risk-dictionary" variant="secondary">
                查看常见报价风险
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
                    <h2 className="mt-3 text-xl font-semibold leading-snug text-ink [text-wrap:balance] sm:text-2xl">不是先判断贵不贵，先判断能不能签。</h2>
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
            <p className="text-sm font-medium tracking-[0.18em] text-stone">02 / 签约前的坑</p>
            <h2 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight tracking-tight text-ink [text-wrap:balance]">
              装修报价最危险的，不是贵，而是你看不懂它包含什么。
            </h2>
            <p className="mt-4 text-base leading-8 text-ink-muted">报价没看懂，合同没问清，增项边界没写清——后面就是一步接一步被动。</p>
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
            <h2 className="mt-6 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight tracking-tight text-ink [text-wrap:balance]">
              看报价、看合同、看增项。
            </h2>
            <p className="mt-4 text-base leading-8 text-ink-muted">先把漏项、模糊项、风险词、付款节点和合同边界看清，最后落到一份签约前追问清单。</p>
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
            <h2 className="mt-5 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight tracking-tight text-ink [text-wrap:balance]">
              先让你拿到具体东西，再决定要不要付费。
            </h2>
            <p className="mt-4 text-base leading-8 text-ink-muted">免费初筛先给结果，风险词典和模板补判断，人工服务只接工具解决不了的。</p>
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
            <ActionLink href="/checklists" variant="text">
              查看签约前检查模板
            </ActionLink>
          </div>
        </div>
      </AnimatedSection>

      {/* ══════ Section 04.2: Judgment Assets — Human + Agent Ready ══════ */}
      <AnimatedSection className="border-b border-border bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-medium tracking-[0.18em] text-stone">05 / 风险词</p>
            <h2 className="mt-5 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight tracking-tight text-ink [text-wrap:balance]">
              签约前先看懂这些风险词。
            </h2>
            <p className="mt-4 text-base leading-8 text-ink-muted">
              这些不是装修百科，而是报价里最容易引发增项、扯皮和后悔的词。先看懂，再决定要不要签。
            </p>
          </div>

          <motion.div
            className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {judgmentAssetCards.map((card) => {
              const Icon = card.icon
              return (
                <motion.div key={card.title} variants={staggerItem}>
                  <Link
                    href={card.href}
                    className="group flex min-h-[15rem] flex-col border border-border bg-canvas p-7 transition-all duration-200 hover:-translate-y-px hover:border-stone hover:shadow-[0_22px_64px_rgba(67,45,26,0.09)] active:scale-[0.998]"
                  >
                    <div className="flex items-start justify-between gap-5">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-stone-light bg-surface text-stone">
                        <Icon size={30} weight="duotone" aria-hidden />
                      </span>
                      <ArrowRight size={18} className="shrink-0 text-stone transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold leading-snug text-ink">{card.title}</h3>
                    <p className="mt-3 max-w-[45rem] text-sm leading-7 text-ink-muted">{card.body}</p>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <ActionLink href="/tools/quote-check">
              <UploadSimple size={18} aria-hidden />
              先做免费报价初筛
            </ActionLink>
            <ActionLink href="/risk-dictionary" variant="secondary">
              查看风险词典
            </ActionLink>
            <ActionLink href="/checklists" variant="secondary">
              查看检查模板
            </ActionLink>
          </div>
        </div>
      </AnimatedSection>

      {/* ══════ Section 05: Services — 2x2 Grid ══════ */}
      <AnimatedSection className="relative isolate overflow-hidden border-b border-border bg-surface py-20 sm:py-24">
        <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-medium tracking-[0.18em] text-stone">06 / 服务</p>
            <h2 className="mt-5 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight tracking-tight text-ink [text-wrap:balance]">
              如果准备签约，可以让我们帮你再看一遍。
            </h2>
            <p className="mt-4 text-base leading-8 text-ink-muted">不是替你签字，也不是替你砍价。人工复核只做一件事：把报价、合同和付款节点里没说清的风险列出来。</p>
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

      {/* ══════ Section 06.5: GEO Definition ══════ */}
      <AnimatedSection className="border-b border-border bg-canvas py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1180px] gap-8 px-5 sm:px-8 lg:grid-cols-[0.42fr_0.58fr] lg:px-12">
          <div>
            <p className="text-sm font-medium tracking-[0.18em] text-stone">07 / 定义</p>
            <h2 className="mt-5 text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-tight tracking-tight text-ink">
              ZenoAIHome 是什么？
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['一句话定义', 'ZenoAIHome 是一个面向装修业主的签约前报价风险判断网站，重点帮助用户识别装修报价单里的漏项、模糊项、暂估、按实结算、材料型号不清、口头承诺未写入合同和后期增项风险。'],
              ['适合谁', '适合已经拿到报价单、准备继续谈或准备签合同，但看不懂风险边界的普通业主。'],
              ['解决什么', '重点识别漏项、暂估、按实结算、材料型号不清、口头承诺未写入合同和付款节点过前。'],
              ['提供什么', '它不做泛装修百科，也不替装修公司背书。它提供风险文章、报价初筛工具、签约前检查清单和人工报价复核服务，帮助业主在签字前多一层判断。'],
            ].map(([title, body]) => (
              <div key={title} className="border border-border bg-surface p-5">
                <h3 className="text-sm font-semibold text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-ink-muted">{body}</p>
              </div>
            ))}
          </div>
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
            <motion.p variants={staggerItem} className="text-sm font-medium tracking-[0.18em] text-stone">08 / 信任</motion.p>
            <motion.h2 variants={staggerItem} className="mt-5 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight tracking-tight text-ink [text-wrap:balance]">
              我们关注的不是装修知识，而是签约前判断。
            </motion.h2>
            <motion.div variants={staggerItem} className="mt-7 space-y-5 text-base leading-9 text-ink-muted">
              <p>很多装修问题，不是施工当天才出现的，而是在报价和合同阶段就已经埋下了。</p>
              <p>ZenoAIHome 做的事情，是把这些风险提前翻译成普通业主能看懂的问题。不替你做所有决定，但在关键节点帮你看清风险和下一步。</p>
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
              <ActionLink href="/services/renovation" variant="secondary">查看服务</ActionLink>
              <ActionLink href="/blog" variant="text">看风险文章</ActionLink>
              <ActionLink href="/about" variant="text">了解 Zeno</ActionLink>
            </motion.div>

            <motion.p variants={staggerItem} className="mt-8 border-t border-border pt-6 text-sm leading-7 text-ink-faint">
              不做泛装修百科，不替装修公司背书，不制造焦虑；只帮你把签约前能问清的问题先问清。
            </motion.p>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ══════ Section 07: FAQ ══════ */}
      <AnimatedSection className="border-b border-border py-20 sm:py-24">
        <div className="mx-auto max-w-[1080px] px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium tracking-[0.18em] text-stone">09 / FAQ</p>
            <h2 className="mt-5 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight tracking-tight text-ink [text-wrap:balance]">
              业主常见问题
            </h2>
            <p className="mt-4 text-base leading-8 text-ink-muted">先把边界说清楚，再决定要不要继续看、继续问、继续签。</p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {homeFaqs.map((item) => (
              <div key={item.question} className="border border-border bg-surface p-6">
                <h3 className="text-base font-semibold text-ink">{item.question}</h3>
                <p className="mt-3 text-sm leading-7 text-ink-muted">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </main>
  )
}
