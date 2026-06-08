"use client"

import Link from 'next/link'
import { useRef, type ReactNode } from 'react'
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
import CommercialLadder from '@/components/features/services/CommercialLadder'

type IconComponent = typeof FileText

type ActionLinkProps = {
  href: string
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'text'
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
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

const instrumentStages = [
  { code: '01', title: '理想生活', body: '这个家要支持怎样的一天', status: '先说清' },
  { code: '02', title: '空间秩序', body: '动线、收纳、陪伴、独处如何共存', status: '待排序' },
  { code: '03', title: '预算边界', body: '钱应该先投给哪些长期体验', status: '要取舍' },
  { code: '04', title: '报价合同', body: '材料、工艺、数量和责任是否落字', status: '需追问' },
  { code: '05', title: '交付风险', body: '验收、延期、售后和变更怎么确认', status: '签前看' },
]

const dimensionRows: Array<{
  icon: IconComponent
  title: string
  question: string
  output: string
  href: string
}> = [
  {
    icon: HouseLine,
    title: '美学与生活融合',
    question: '效果图好看，日常光线、材质维护和生活习惯能不能长期成立？',
    output: '输出长期审美、材质控制和维护边界',
    href: '/living-diagnosis',
  },
  {
    icon: Notebook,
    title: '个性化实现',
    question: '你攒下来的灵感图，背后真正稳定的偏好是什么？',
    output: '输出色彩、比例、材质、收纳和预算优先级',
    href: '/living-diagnosis',
  },
  {
    icon: Wrench,
    title: '空间赋能',
    question: '空间是在堆功能，还是让家务、收纳、工作、陪伴和社交更顺？',
    output: '输出空间冲突点和功能排序',
    href: '/cases',
  },
  {
    icon: UsersThree,
    title: '家庭关系与社交',
    question: '餐桌、客厅、厨房、书房和阳台，会怎样改变陪伴与边界？',
    output: '输出家庭场景和社交尺度',
    href: '/blog',
  },
  {
    icon: ShieldCheck,
    title: '情绪价值与心理需求',
    question: '这个家是否承接放松、独处、安全感、秩序感和恢复感？',
    output: '输出情绪场景和空间节奏',
    href: '/living-diagnosis',
  },
  {
    icon: MagnifyingGlass,
    title: '报价 / 合同 / 交付风险',
    question: '报价和合同能不能承接前面的生活目标、方案选择和预算边界？',
    output: '输出风险点、追问清单和签前边界',
    href: '/tools/quote-check',
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
    icon: HouseLine,
    title: 'AI 居住诊断',
    body: '还没定方案时，先把生活方式、审美偏好、家庭场景和预算边界说清。',
    action: '开始诊断',
    href: '/living-diagnosis',
  },
  {
    icon: UploadSimple,
    title: '报价风险初筛',
    body: '已经拿到报价时，先看材料、工艺、数量、付款节点和责任边界。',
    action: '做初筛',
    href: '/tools/quote-check',
  },
  {
    icon: FileText,
    title: '风险词典',
    body: '查按实结算、暂估、同档替换、最终以现场为准这些常见风险词。',
    action: '查风险词',
    href: '/risk-dictionary',
  },
  {
    icon: ClipboardText,
    title: '签约前检查模板',
    body: '报价、合同、付款节点、水电和老房翻新，都可以照着逐项问。',
    action: '看模板',
    href: '/checklists',
  },
]

const riskSignals = [
  {
    title: '按实结算',
    body: '它不一定有问题，但数量、范围和最终金额不能留到施工后才说。',
    href: '/risk-dictionary/actual-settlement-change-order-risk',
  },
  {
    title: '材料品牌型号缺失',
    body: '只写品牌或同档材料，不写型号规格，后期替换时很难判断是否缩水。',
    href: '/risk-dictionary/missing-material-brand-model',
  },
  {
    title: '口头承诺未写入合同',
    body: '销售说过、群里聊过，都不等于合同有保障，关键承诺要落成附件。',
    href: '/risk-dictionary/oral-promise-not-written',
  },
  {
    title: '增项确认流程缺失',
    body: '没有书面确认、单价和业主同意流程，小变更很容易变成大账单。',
    href: '/risk-dictionary/change-order-confirmation-missing',
  },
]

const trustItems: Array<{ icon: IconComponent; title: string; body: string }> = [
  { icon: HouseLine, title: '不做泛装修百科', body: '内容只围绕装修前真正影响决策的判断。' },
  { icon: Wrench, title: '不替装修公司背书', body: '只帮你看清需求、方案、报价和合同边界。' },
  { icon: UsersThree, title: '不制造焦虑', body: '每个风险点都要落到可追问、可确认的动作。' },
]

const homeFaqs = [
  {
    question: 'AI 居住诊断是什么？',
    answer: '它不是风格测试，而是把生活方式、审美偏好、家庭场景、空间优先级、预算取舍和签约风险放在一起做初步判断。',
  },
  {
    question: '为什么报价风险不是首页唯一入口？',
    answer: '因为报价应该承接前面的生活目标和空间选择。只看报价，容易错过更早埋下的方案、预算和交付问题。',
  },
  {
    question: '已经快签约了，应该先看什么？',
    answer: '先做报价风险初筛。如果材料完整，再进入报价 / 合同快审或居住方案综合判断。',
  },
  {
    question: 'ZenoAIHome 会替我做最终决定吗？',
    answer: '不会。它帮助你看清风险和取舍，不替你选择施工方，不承诺最低价，也不代替法律审查。',
  },
]

function ActionLink({ href, children, variant = 'primary' }: ActionLinkProps) {
  const baseClass = 'inline-flex min-h-12 items-center justify-center gap-2 text-sm font-semibold transition-all duration-200'
  const className = {
    primary: `${baseClass} bg-ink px-5 py-3 text-white hover:bg-stone-deep active:scale-[0.98]`,
    secondary: `${baseClass} border border-border bg-surface/80 px-5 py-3 text-ink hover:border-stone hover:bg-surface active:scale-[0.98]`,
    text: 'inline-flex items-center gap-2 text-sm font-semibold text-stone transition-all duration-200 hover:gap-3 hover:text-ink',
  }[variant]

  return (
    <Link href={href} className={className}>
      {children}
      <ArrowRight size={17} aria-hidden />
    </Link>
  )
}

function AnimatedSection({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeUp}
      transition={{ type: 'spring', stiffness: 80, damping: 20 }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

function LivingDecisionInstrument() {
  return (
    <motion.div variants={staggerItem} className="judgment-instrument p-4 sm:p-5">
      <div className="relative z-10 border border-white/12 bg-[#17221f]/92 p-4 text-white shadow-[0_28px_90px_rgba(15,22,20,0.28)] sm:p-6">
        <div className="flex items-start justify-between gap-4 border-b border-white/12 pb-4">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#b7cbbc]">Living To Delivery</p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight">生活到交付判断仪</h2>
          </div>
          <div className="border border-[#b7cbbc]/40 px-3 py-2 text-right">
            <p className="text-[0.62rem] uppercase tracking-[0.18em] text-[#b7cbbc]">status</p>
            <p className="text-sm font-semibold text-[#f0d095]">待签前复核</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="relative min-h-[19rem] overflow-hidden border border-white/12 bg-[#0f1815] p-5">
            <div className="judgment-orbit" aria-hidden />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#b7cbbc]">core question</p>
                <p className="mt-3 max-w-[18rem] text-3xl font-semibold leading-tight">这套家，能不能长期承接你的生活？</p>
              </div>
              <div className="grid grid-cols-2 gap-px border border-white/12 bg-white/12">
                {['审美', '秩序', '预算', '交付'].map((item) => (
                  <div key={item} className="bg-[#17221f] px-3 py-3">
                    <p className="text-[0.65rem] uppercase tracking-[0.18em] text-[#b7cbbc]">{item}</p>
                    <p className="mt-1 text-xs text-white/68">需要被验证</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            {instrumentStages.map((stage, index) => (
              <div
                key={stage.code}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border border-white/12 bg-white/[0.045] p-3"
              >
                <span className="flex h-8 w-8 items-center justify-center bg-[#d8b36a] text-xs font-bold text-[#14211d]">
                  {stage.code}
                </span>
                <div>
                  <p className="text-sm font-semibold">{stage.title}</p>
                  <p className="text-xs leading-5 text-white/62">{stage.body}</p>
                </div>
                <span className="hidden border border-[#b7cbbc]/30 px-2 py-1 text-[0.65rem] font-semibold text-[#b7cbbc] sm:block">
                  {stage.status}
                </span>
                {index < instrumentStages.length - 1 && (
                  <span className="absolute" aria-hidden />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-2 border-t border-white/12 pt-4 sm:grid-cols-3">
          {[
            ['输入', '户型 / 灵感图 / 报价 / 家庭场景'],
            ['判断', '美学、生活、预算、合同一起看'],
            ['输出', '取舍清单、追问清单、签前边界'],
          ].map(([title, body]) => (
            <div key={title} className="border border-white/12 bg-white/[0.035] p-3">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#f0d095]">{title}</p>
              <p className="mt-2 text-xs leading-5 text-white/70">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function SectionIntro({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string
  title: string
  body: string
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold tracking-[0.18em] text-stone">{eyebrow}</p>
      <h2 className="mt-4 text-[2rem] font-semibold leading-tight tracking-tight text-ink [text-wrap:balance] sm:text-[2.75rem] lg:text-[3.2rem]">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-ink-muted">{body}</p>
    </div>
  )
}

type Props = {
  fontClassName: string
}

export default function HomePageGptSkill({ fontClassName }: Props) {
  return (
    <main className="bg-canvas text-ink">
      <section className="relative isolate overflow-hidden border-b border-border bg-canvas system-grid">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(216,179,106,0.22),transparent_30%),radial-gradient(circle_at_88%_10%,rgba(63,98,88,0.2),transparent_34%),linear-gradient(120deg,rgba(255,255,252,0.9),rgba(247,247,243,0.74))]" aria-hidden />
        <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-9 px-5 py-14 sm:px-8 lg:min-h-[calc(100dvh-64px)] lg:grid-cols-[minmax(0,0.92fr)_minmax(460px,1.08fr)] lg:px-12 lg:py-16">
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
              className="mt-5 max-w-[25rem] text-[2.7rem] font-semibold leading-[1.03] tracking-tight text-ink sm:max-w-5xl sm:text-[4.7rem] xl:text-[5.75rem]"
            >
              让理想生活，落到真正能住好的家。
            </motion.h1>
            <motion.p variants={staggerItem} className="mt-7 max-w-[46rem] text-base leading-8 text-ink-muted sm:text-lg">
              ZenoAIHome 把美学取舍、生活方式、空间秩序、预算边界、报价合同和交付风险放在一起判断。装修不是把房子装完，而是把你想要的生活翻译成能签约、能施工、能长期居住的决策。
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
              <ActionLink href="/services" variant="text">
                查看服务路径
              </ActionLink>
            </motion.div>

            <motion.div variants={staggerItem} className="mt-10 grid max-w-4xl gap-px border border-border bg-border sm:grid-cols-3">
              {[
                ['不是装修百科', '不靠泛知识堆流量，只围绕签约前真正影响决策的问题。'],
                ['不是报价单点工具', '报价初筛仍保留，但它是生活方案能否落地的一个关口。'],
                ['不是作品展示站', '重点不是证明我做过什么，而是帮你建立判断能力。'],
              ].map(([title, body]) => (
                <div key={title} className="bg-surface/92 p-4">
                  <p className="text-sm font-semibold text-ink">{title}</p>
                  <p className="mt-2 text-xs leading-5 text-ink-muted">{body}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="grid min-w-0 content-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <LivingDecisionInstrument />
          </motion.div>
        </div>
      </section>

      <AnimatedSection className="border-b border-border py-20 sm:py-24">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
            <SectionIntro
              eyebrow="02 / 六个判断域"
              title="不先判断，装修就会变成一堆孤立选择。"
              body="风格、收纳、预算、报价和合同不是分开的。一个家的问题，往往是在这些选择彼此没有承接时出现。"
            />
            <motion.div
              className="grid gap-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={staggerContainer}
            >
              {dimensionRows.map((row, index) => {
                const Icon = row.icon
                return (
                  <motion.div key={row.title} variants={staggerItem}>
                    <Link
                      href={row.href}
                      className="group grid gap-4 border border-border bg-surface p-4 transition-all hover:border-stone hover:bg-surface-warm sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-5"
                    >
                      <span className="flex h-12 w-12 items-center justify-center border border-stone-light bg-canvas text-stone">
                        <Icon size={26} weight="duotone" aria-hidden />
                      </span>
                      <div>
                        <div className="flex flex-wrap items-baseline gap-3">
                          <span className={`${fontClassName} text-xs font-semibold text-ink-faint tabular-nums`}>{String(index + 1).padStart(2, '0')}</span>
                          <h3 className="text-lg font-semibold leading-tight text-ink">{row.title}</h3>
                        </div>
                        <p className="mt-2 text-sm leading-7 text-ink-muted">{row.question}</p>
                        <p className="mt-1 text-xs font-semibold text-stone">{row.output}</p>
                      </div>
                      <ArrowRight size={18} className="hidden text-stone transition-transform group-hover:translate-x-1 sm:block" aria-hidden />
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="border-b border-border bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <SectionIntro
            eyebrow="03 / 判断链路"
            title="从生活方式，到预算、合同和交付。"
            body="每一步都不是抽象概念，而是签约前必须问清的问题。越早把取舍说清，后面越少返工、扯皮和临时加钱。"
          />

          <div className="mt-12 grid gap-3 lg:grid-cols-5">
            {instrumentStages.map((step, index) => (
              <div key={step.code} className="decision-band relative border border-border bg-canvas p-5">
                <p className={`${fontClassName} text-4xl font-semibold leading-none text-stone/30 tabular-nums`}>{step.code}</p>
                <h3 className="mt-5 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-ink-muted">{step.body}</p>
                <p className="mt-5 inline-flex border border-stone-light px-2 py-1 text-xs font-semibold text-stone">{step.status}</p>
                {index < instrumentStages.length - 1 && (
                  <ArrowRight size={20} className="absolute -right-3 top-1/2 hidden -translate-y-1/2 bg-surface text-stone lg:block" aria-hidden />
                )}
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="border-b border-border py-20 sm:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.54fr_0.46fr] lg:px-12">
          <div>
            <SectionIntro
              eyebrow="04 / 免费入口"
              title="先把问题缩小，再决定是否需要人工判断。"
              body="不急着买服务。先用工具把生活目标、报价风险和签约问题拆开，带着具体材料进入下一步，效率会高很多。"
            />
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {toolCards.map((card) => {
                const Icon = card.icon
                return (
                  <Link key={card.title} href={card.href} className="group border border-border bg-surface p-5 transition-colors hover:border-stone hover:bg-surface-warm">
                    <div className="flex items-start justify-between gap-4">
                      <Icon size={30} weight="duotone" className="text-stone" aria-hidden />
                      <ArrowRight size={17} className="text-stone transition-transform group-hover:translate-x-1" aria-hidden />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-ink">{card.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-ink-muted">{card.body}</p>
                    <p className="mt-5 text-xs font-semibold text-stone">{card.action}</p>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="service-route-console p-4 sm:p-5">
            <div className="border border-border bg-surface/92 p-5 sm:p-6">
              <p className="system-label">Service Route</p>
              <h2 className="mt-3 text-2xl font-semibold leading-tight text-ink">服务不是价格列表，而是判断深度。</h2>
              <p className="mt-3 text-sm leading-7 text-ink-muted">
                从免费诊断到综合判断，每一层都对应你当前材料的完整度和签约风险。
              </p>
              <CommercialLadder variant="instrument" className="mt-6" />
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="border-b border-border bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[0.38fr_0.62fr]">
            <SectionIntro
              eyebrow="05 / 风险关口"
              title="报价风险，是理想生活落地时必须经过的关口。"
              body="风险不是用来制造焦虑的。它的价值，是把签约前需要写清楚、问清楚、确认清楚的地方提前列出来。"
            />
            <div className="grid gap-3">
              {riskSignals.map((item, index) => (
                <Link key={item.title} href={item.href} className="group grid gap-4 border border-border bg-canvas p-5 transition-colors hover:border-stone hover:bg-surface sm:grid-cols-[auto_1fr_auto] sm:items-center">
                  <span className={`${fontClassName} text-xs font-semibold text-ink-faint tabular-nums`}>R{index + 1}</span>
                  <div>
                    <h3 className="text-base font-semibold text-ink">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-ink-muted">{item.body}</p>
                  </div>
                  <ArrowRight size={17} className="hidden text-stone transition-transform group-hover:translate-x-1 sm:block" aria-hidden />
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <ActionLink href="/tools/quote-check">
                  <UploadSimple size={18} aria-hidden />
                  先做免费报价初筛
                </ActionLink>
                <ActionLink href="/risk-dictionary" variant="secondary">
                  查看风险词典
                </ActionLink>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
            {trustItems.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="bg-surface p-6">
                  <Icon size={30} weight="duotone" className="text-stone" aria-hidden />
                  <p className="mt-4 font-semibold text-ink">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-ink-muted">{item.body}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[0.42fr_0.58fr]">
            <div>
              <p className="system-label">Boundary</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-ink">ZenoAIHome 只做一件事：把看不清的地方拆开。</h2>
              <p className="mt-4 text-sm leading-7 text-ink-muted">
                不代替业主签约，不承诺最低价，不制造业主与装修公司的对立。真正的目标，是让美学、生活、预算和交付边界能互相承接。
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {homeFaqs.map((item) => (
                <div key={item.question} className="border border-border bg-surface p-5">
                  <h3 className="text-base font-semibold leading-snug text-ink">{item.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-ink-muted">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>
    </main>
  )
}
