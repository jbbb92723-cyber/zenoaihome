"use client"

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ArrowRight,
  ChartLineUp,
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
    icon: HouseLine,
    title: '美学与生活怎么融合',
    body: '美学不是效果图好看，而是光线、比例、材质、秩序和生活习惯能长期成立。',
    href: '/living-diagnosis',
  },
  {
    icon: Notebook,
    title: '个性化怎么真正实现',
    body: '喜欢很多图不等于有方案。要把偏好翻译成色彩、材质、收纳、预算和施工边界。',
    href: '/living-diagnosis',
  },
  {
    icon: Wrench,
    title: '空间能不能赋能日常',
    body: '空间不是堆功能，而是让家务、收纳、陪伴、独处、工作和社交更顺。',
    href: '/cases',
  },
  {
    icon: UsersThree,
    title: '家庭关系和社交怎么发生',
    body: '餐桌、客厅、厨房、阳台和书房，最后都会影响陪伴、边界、亲友到访和沟通方式。',
    href: '/blog',
  },
  {
    icon: ShieldCheck,
    title: '情绪和心理需求有没有位置',
    body: '家也要承接放松、独处、安全感和秩序感。好看的设计，必须经得起日常生活。',
    href: '/living-diagnosis',
  },
  {
    icon: MagnifyingGlass,
    title: '报价合同能不能承接方案',
    body: '报价不是只看总价，而是看材料、工艺、边界和责任能不能承接你的生活目标。',
    href: '/tools/quote-check',
  },
]

const frameworkSteps: Array<{
  number: string
  icon: IconComponent
  title: string
  body: string
}> = [
  { number: '01', icon: HouseLine, title: '理想生活', body: '先说清这个家要支持怎样的一天。' },
  { number: '02', icon: Notebook, title: '美学取舍', body: '把风格偏好翻译成光线、比例、材质和秩序。' },
  { number: '03', icon: UsersThree, title: '家庭场景', body: '把家务、陪伴、独处和社交放进空间里。' },
  { number: '04', icon: Calculator, title: '装修决策', body: '判断预算先投哪里，哪些需求可以后置。' },
  { number: '05', icon: FileText, title: '签约边界', body: '报价、合同、付款节点要能承接方案。' },
  { number: '06', icon: ShieldCheck, title: '交付风险', body: '把施工、验收、售后和责任边界问清楚。' },
]

const quoteSignals = [
  { label: '美学与生活', value: '先翻译', width: '82%', note: '把“喜欢的感觉”翻译成光线、材质、比例、收纳和日常维护', color: '#3f6258' },
  { label: '空间与家庭', value: '再排序', width: '70%', note: '把家务、陪伴、独处、工作和社交排进空间优先级', color: '#31485c' },
  { label: '报价与交付', value: '最后核对', width: '76%', note: '报价、合同和施工边界要能承接前面的生活目标', color: '#66897b' },
]

const categoryDefinition = [
  ['不是装修知识站', '不靠泛知识堆流量，而是围绕装修前的关键判断组织内容。'],
  ['不是报价工具站', '报价初筛是入口之一，真正目标是看方案能不能被预算、合同和交付承接。'],
  ['不是设计师作品集', '重点不是展示“我做过什么”，而是帮你看清“你应该怎么判断”。'],
]

const decisionReportRows = [
  ['生活目标', '陪伴、独处、家务和亲友到访要同时成立'],
  ['审美取舍', '控制材质数量，让光线、比例和维护成本一致'],
  ['预算边界', '优先投给动线、收纳、灯光和长期接触面'],
  ['签约追问', '材料型号、工艺标准、增项确认和验收责任写清'],
]

const toolCards: Array<{
  icon: IconComponent
  title: string
  body: string
  action: string
  href: string
}> = [
  {
    icon: HouseLine,
    title: 'AI 居住诊断',
    body: '先判断生活目标、美学偏好、家庭场景、空间优先级和预算边界。',
    action: '免费开始诊断',
    href: '/living-diagnosis',
  },
  {
    icon: ShieldCheck,
    title: '报价风险初筛',
    body: '已经拿到报价时，先看它有没有承接材料、工艺、边界和责任。',
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
  { icon: HouseLine, title: '不做泛装修百科', body: '我们聚焦美学、生活方式、空间场景、装修决策和签约风险之间的关系。' },
  { icon: Wrench, title: '不替装修公司背书', body: '我们不判断哪家公司一定靠谱，只帮你看清需求、方案、报价和合同里的边界。' },
  { icon: UsersThree, title: '不制造焦虑', body: '每个判断都要落到下一步动作上，而不是用术语吓你赶紧付费。' },
]

const homeFaqs = [
  {
    question: 'AI 居住诊断是什么？',
    answer: 'AI 居住诊断不是风格测试，而是把生活方式、美学偏好、家庭场景、空间优先级、预算取舍和签约风险放在一起做初步判断。',
  },
  {
    question: '为什么装修前要先看美学和生活？',
    answer: '因为风格、预算和施工方案都应该服务真实生活。先看清光线、材质、家庭关系、家务动线和情绪需求，后面才不容易反复推翻。',
  },
  {
    question: '已有报价时还需要居住诊断吗？',
    answer: '需要，但顺序会变。临近签约时，要把居住需求、方案边界、预算取舍、报价边界和合同条款放在一起看，而不是继续只讨论风格。',
  },
  {
    question: 'ZenoAIHome 会替我判断哪家公司靠谱吗？',
    answer: '不会。ZenoAIHome 不替装修公司背书，也不替你做最终签约决定，只帮你看清报价、合同和付款节点里的风险点。',
  },
  {
    question: '报价风险初筛还保留吗？',
    answer: '保留。报价风险初筛仍然是临近签约用户的重要入口，用来检查漏项、模糊项、材料边界、付款节点和合同承诺。',
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
      {/* Hero: Category Definition + Report Preview */}
      <section className="relative isolate overflow-hidden border-b border-border bg-canvas system-grid">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(63,98,88,0.16),transparent_34%),linear-gradient(120deg,rgba(255,255,252,0.92),rgba(247,247,243,0.76))]" aria-hidden />
        <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-5 py-14 sm:px-8 lg:min-h-[calc(100dvh-64px)] lg:grid-cols-[minmax(0,1.04fr)_minmax(420px,0.96fr)] lg:px-12 lg:py-16">
          <motion.div
            className="flex min-w-0 max-w-4xl flex-col justify-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.p variants={staggerItem} className="system-label">
              Living Decision System / ZenoAIHome
            </motion.p>
            <motion.h1
              variants={staggerItem}
              className="mt-5 max-w-[25rem] text-[2.55rem] font-semibold leading-[1.05] tracking-tight text-ink sm:max-w-5xl sm:text-[4.75rem] xl:text-[5.8rem]"
            >
              装修前，先判断这套家能不能承接你的生活。
            </motion.h1>

            <motion.p variants={staggerItem} className="mt-7 max-w-[46rem] text-base leading-8 text-ink-muted sm:text-lg">
              ZenoAIHome 不是装修知识站，也不是报价工具站。它把美学取舍、家庭场景、空间秩序、预算边界、合同约定和交付风险放在一起，帮你把想要的生活翻译成能签约、能施工、能长期居住的装修决策。
            </motion.p>

            <motion.div variants={staggerItem} className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ActionLink href="/living-diagnosis">
                <HouseLine size={18} aria-hidden />
                开始 AI 居住诊断
              </ActionLink>
              <ActionLink href="/tools/quote-check" variant="secondary">
                <UploadSimple size={18} aria-hidden />
                已有报价，先做风险初筛
              </ActionLink>
              <ActionLink href="/cases" variant="text">
                看判断样张
              </ActionLink>
            </motion.div>

            <motion.div variants={staggerItem} className="mt-10 grid max-w-4xl gap-3 sm:grid-cols-3">
              {categoryDefinition.map(([title, body]) => (
                <div key={title} className="decision-card bg-surface/86 p-4">
                  <p className="text-sm font-semibold text-ink">{title}</p>
                  <p className="mt-2 text-xs leading-5 text-ink-muted">{body}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="grid min-w-0 content-center gap-5 lg:pl-2"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={scaleIn} className="blueprint-panel p-5 sm:p-7">
              <div className="relative">
                <div className="flex items-start justify-between gap-5 border-b border-border pb-5">
                  <div>
                    <p className="system-label">Sample Judgment Report</p>
                    <h2 className="mt-3 text-2xl font-semibold leading-tight text-ink">居住判断摘要</h2>
                    <p className="mt-2 text-sm leading-6 text-ink-muted">从生活目标开始，向后核对空间、预算、报价和交付。</p>
                  </div>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-border bg-canvas text-stone">
                    <ChartLineUp size={27} weight="duotone" aria-hidden />
                  </span>
                </div>

                <div className="mt-6 grid gap-3">
                  {decisionReportRows.map(([title, body], index) => (
                    <div key={title} className="grid grid-cols-[auto_1fr] gap-4 border border-border bg-surface/88 p-4">
                      <span className="flex h-8 w-8 items-center justify-center bg-stone text-xs font-semibold text-white">0{index + 1}</span>
                      <div>
                        <p className="text-sm font-semibold text-ink">{title}</p>
                        <p className="mt-1 text-xs leading-5 text-ink-muted">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 border-t border-border pt-5 sm:grid-cols-3">
                  {quoteSignals.map((item, idx) => (
                    <div key={item.label} className="border border-border bg-canvas p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-ink">{item.label}</p>
                        <p className="text-xs font-semibold text-stone">{item.value}</p>
                      </div>
                      <div className="mt-3 h-1.5 bg-stone-pale">
                        <motion.div
                          className="h-full origin-left"
                          style={{ backgroundColor: item.color, width: item.width }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ type: 'spring', stiffness: 60, damping: 18, delay: 0.35 + idx * 0.12 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border border-stone-light bg-stone-pale/45 p-4">
                  <p className="text-sm font-semibold text-ink">签约前提醒</p>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">好看的方案，必须被材料型号、工艺标准、预算边界、付款节点和验收责任真正承接。</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════ Section 02: Six Decision Dimensions ══════ */}
      <AnimatedSection className="border-b border-border py-20 sm:py-24">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium tracking-[0.18em] text-stone">02 / 六个判断维度</p>
            <h2 className="mt-3 text-[2rem] font-semibold leading-tight tracking-tight text-ink [text-wrap:balance] sm:text-[2.75rem] lg:text-[3.2rem]">
              用户真正想买的不是装修，而是更好的生活。
            </h2>
            <p className="mt-4 text-base leading-8 text-ink-muted">装修决策不能只看效果图，也不能只看报价。先把美学、生活、空间、家庭关系、情绪需求和风险边界拆开，后面才知道怎么装、花多少、能不能签。</p>
          </div>

          <motion.div
            className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {problemCards.slice(0, 3).map((card) => {
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
            {problemCards.slice(3).map((card) => {
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
              <span className="h-px w-28 bg-stone-light" />
              03 / 判断方法
              <span className="h-px w-28 bg-stone-light" />
            </p>
            <h2 className="mt-6 text-[2rem] font-semibold leading-tight tracking-tight text-ink [text-wrap:balance] sm:text-[2.75rem] lg:text-[3.2rem]">
              从理想生活，到能签约、能交付、能长期居住的装修决策。
            </h2>
            <p className="mt-4 text-base leading-8 text-ink-muted">先把美学与生活方式说清，再进入空间方案、装修决策、预算边界、报价合同和交付风险。每一步都要能落到具体问题。</p>
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
                      className="absolute right-[-1.15rem] top-12 hidden text-stone lg:block"
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
            <h2 className="mt-5 text-[2rem] font-semibold leading-tight tracking-tight text-ink [text-wrap:balance] sm:text-[2.75rem] lg:text-[3.2rem]">
              先用免费诊断和工具看清方向，再决定要不要进入人工判断。
            </h2>
            <p className="mt-4 text-base leading-8 text-ink-muted">居住诊断负责前端判断，报价初筛负责签约边界，风险词典和模板补充可复用的追问依据。不急着购买服务，先把问题缩小。</p>
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
                <HouseLine size={56} weight="duotone" className="text-stone" aria-hidden />
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
            <h2 className="mt-5 text-[2rem] font-semibold leading-tight tracking-tight text-ink [text-wrap:balance] sm:text-[2.75rem] lg:text-[3.2rem]">
              报价、合同和交付风险，是理想生活落地时必须经过的关口。
            </h2>
            <p className="mt-4 text-base leading-8 text-ink-muted">
              这些不是装修百科，而是报价里最容易影响预算、材料、施工责任和售后边界的词。先看懂，再判断这套方案能不能放心往下走。
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
            <h2 className="mt-5 text-[2rem] font-semibold leading-tight tracking-tight text-ink [text-wrap:balance] sm:text-[2.75rem] lg:text-[3.2rem]">
              从免费工具、轻服务，到居住方案综合判断。
            </h2>
            <p className="mt-4 text-base leading-8 text-ink-muted">还没定方案，先梳理美学、生活方式和空间优先级；已经临近签约，再把报价、合同、施工和交付边界里没说清的地方列出来。</p>
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
            <h2 className="mt-5 text-[1.8rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2.25rem] lg:text-[2.6rem]">
              ZenoAIHome 是什么？
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['一句话定义', 'ZenoAIHome 是一个美学与生活结合后的装修判断系统，帮助业主把理想生活翻译成空间方案、预算边界、合同约定和交付风险控制。'],
              ['适合谁', '适合不只想避坑，也想重新理解生活质量、家庭关系、空间秩序、长期审美和签约底气的家庭。'],
              ['解决什么', '把模糊的“想要温馨、实用、好看、不乱”，翻译成空间优先级、预算取舍、报价边界和下一步清单。'],
              ['提供什么', '它提供 AI 居住诊断、方法文章、报价初筛工具、签约前检查清单和人工复核服务，先帮你看清生活，再看清合同。'],
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
        <div className="relative min-h-[24rem] overflow-hidden bg-[#16231f] lg:min-h-full" aria-hidden>
          <div className="absolute inset-0 opacity-30">
            <svg className="h-full w-full" viewBox="0 0 600 900" preserveAspectRatio="xMidYMid slice">
              <defs>
                <radialGradient id="about-grad" cx="40%" cy="50%" r="60%">
                  <stop offset="0%" stopColor="#8ea99b" stopOpacity="0.42" />
                  <stop offset="100%" stopColor="#16231f" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="600" height="900" fill="url(#about-grad)" />
              <circle cx="200" cy="350" r="180" fill="none" stroke="#9fb8ad" strokeWidth="0.5" opacity="0.5" />
              <circle cx="350" cy="550" r="240" fill="none" stroke="#66897b" strokeWidth="0.4" opacity="0.32" />
              <circle cx="150" cy="650" r="100" fill="none" stroke="#d2dfd8" strokeWidth="0.3" opacity="0.26" />
              <path d="M50 200 Q200 400 100 700" fill="none" stroke="#9fb8ad" strokeWidth="0.6" opacity="0.22" />
              <path d="M400 100 Q350 450 500 800" fill="none" stroke="#66897b" strokeWidth="0.4" opacity="0.18" />
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
            <motion.h2 variants={staggerItem} className="mt-5 text-[2rem] font-semibold leading-tight tracking-tight text-ink [text-wrap:balance] sm:text-[2.75rem] lg:text-[3.2rem]">
              我们关注的不是装修知识，而是美学与生活结合后的装修判断。
            </motion.h2>
            <motion.div variants={staggerItem} className="mt-7 space-y-5 text-base leading-9 text-ink-muted">
              <p>很多装修问题，不是施工当天才出现的，而是在“我到底想怎样生活、什么样的美能长期住、预算该为哪些体验服务”还没说清时就已经埋下了。</p>
              <p>ZenoAIHome 做的事情，是把模糊需求、美学取舍、预算边界和签约风险提前翻译成普通家庭能看懂的问题。不替你做所有决定，但在关键节点帮你看清下一步。</p>
            </motion.div>

            <motion.div variants={staggerItem} className="mt-10 grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-3">
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
              <ActionLink href="/living-diagnosis">先做居住诊断</ActionLink>
              <ActionLink href="/services" variant="secondary">查看服务</ActionLink>
              <ActionLink href="/blog" variant="text">看方法文章</ActionLink>
              <ActionLink href="/about" variant="text">了解 Zeno</ActionLink>
            </motion.div>

            <motion.p variants={staggerItem} className="mt-8 border-t border-border pt-6 text-sm leading-7 text-ink-faint">
              不做泛装修百科，不替装修公司背书，不制造焦虑；只帮你把美学、生活需求、预算取舍和签约前能问清的问题先问清。
            </motion.p>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ══════ Section 07: FAQ ══════ */}
      <AnimatedSection className="border-b border-border py-20 sm:py-24">
        <div className="mx-auto max-w-[1080px] px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium tracking-[0.18em] text-stone">09 / FAQ</p>
            <h2 className="mt-5 text-[2rem] font-semibold leading-tight tracking-tight text-ink [text-wrap:balance] sm:text-[2.75rem] lg:text-[3.2rem]">
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
