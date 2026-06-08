"use client"

import Link from 'next/link'
import { useRef, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ArrowRight,
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
    output: '长期审美、材质控制和维护边界',
    href: '/living-diagnosis',
  },
  {
    icon: Notebook,
    title: '个性化实现',
    question: '你攒下来的灵感图，背后真正稳定的偏好是什么？',
    output: '色彩、比例、材质、收纳和预算优先级',
    href: '/living-diagnosis',
  },
  {
    icon: Wrench,
    title: '空间赋能',
    question: '空间是在堆功能，还是让家务、收纳、工作、陪伴和社交更顺？',
    output: '空间冲突点和功能排序',
    href: '/cases',
  },
  {
    icon: UsersThree,
    title: '家庭关系与社交',
    question: '餐桌、客厅、厨房、书房和阳台，会怎样改变陪伴与边界？',
    output: '家庭场景和社交尺度',
    href: '/blog',
  },
  {
    icon: ShieldCheck,
    title: '情绪价值与心理需求',
    question: '这个家是否承接放松、独处、安全感、秩序感和恢复感？',
    output: '情绪场景和空间节奏',
    href: '/living-diagnosis',
  },
  {
    icon: MagnifyingGlass,
    title: '报价 / 合同 / 交付风险',
    question: '报价和合同能不能承接前面的生活目标、方案选择和预算边界？',
    output: '风险点、追问清单和签前边界',
    href: '/tools/quote-check',
  },
]

const releaseCards = [
  {
    title: '居住诊断',
    body: '先把家庭生活、审美偏好、空间优先级和预算边界说清。',
    meta: 'FREE TOOL',
    date: '入口一',
    href: '/living-diagnosis',
    cta: '开始诊断',
  },
  {
    title: '报价风险初筛',
    body: '已有报价时，先看材料、工艺、数量、付款节点和责任边界。',
    meta: 'RISK CONTROL',
    date: '入口二',
    href: '/tools/quote-check',
    cta: '做初筛',
  },
  {
    title: '居住方案综合判断',
    body: '把美学、生活、预算、报价、合同和交付风险放在一起看。',
    meta: 'SERVICE',
    date: '深服务',
    href: '/services#quote-deep',
    cta: '看服务',
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
    question: 'ZenoAIHome 会替我做最终决定吗？',
    answer: '不会。它帮助你看清风险和取舍，不替你选择施工方，不承诺最低价，也不代替法律审查。',
  },
]

function ActionLink({
  href,
  children,
  variant = 'primary',
}: {
  href: string
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'text'
}) {
  const baseClass = 'motion-press inline-flex min-h-11 items-center justify-center gap-2 text-sm font-semibold'
  const className = {
    primary: `${baseClass} rounded-[7px] bg-ink px-5 py-3 text-white hover:bg-stone-deep hover:shadow-[0_14px_32px_rgba(17,17,17,0.14)]`,
    secondary: `${baseClass} rounded-[7px] border border-border bg-surface px-5 py-3 text-ink hover:border-ink`,
    text: 'motion-press inline-flex items-center gap-2 text-sm font-semibold text-ink',
  }[variant]

  return (
    <Link href={href} className={className}>
      {children}
      <ArrowRight size={17} className="motion-arrow" aria-hidden />
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

function SpatialMap() {
  return (
    <svg viewBox="0 0 520 520" className="h-full w-full" role="img" aria-label="空间秩序判断图">
      <defs>
        <pattern id="zeno-map-noise" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M0 0h16v16H0z" fill="#111111" />
          <path d="M2 2h2v2H2zM8 4h1v1H8zM12 10h2v2h-2zM4 13h1v1H4z" fill="#DED2BE" opacity=".16" />
        </pattern>
      </defs>
      <rect x="36" y="56" width="452" height="410" fill="url(#zeno-map-noise)" opacity=".9" />
      {[
        'M48 112 118 72 184 104 228 72 292 98 348 66 440 112 474 190 430 268 462 354 386 440 288 420 208 462 132 400 66 356 88 264 46 196Z',
        'M118 72 104 164 172 210 184 104',
        'M184 104 172 210 250 236 292 98',
        'M292 98 250 236 336 244 348 66',
        'M348 66 336 244 430 268 440 112',
        'M88 264 172 210 208 322 132 400',
        'M172 210 250 236 288 420 208 322',
        'M250 236 336 244 386 440 288 420',
        'M336 244 430 268 462 354 386 440',
        'M46 196 104 164 88 264',
      ].map((d) => (
        <path key={d} d={d} fill="none" stroke="#F4F1E8" strokeWidth="4" strokeLinejoin="round" opacity=".94" />
      ))}
      {[
        [118, 72], [184, 104], [292, 98], [348, 66], [440, 112], [172, 210], [250, 236], [336, 244], [430, 268], [288, 420],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill="#DED2BE" />
      ))}
    </svg>
  )
}

function FeaturePanel({ fontClassName }: Props) {
  return (
    <section className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="anthropic-feature decision-scan grid overflow-hidden rounded-t-[8px] bg-[#111111] text-[#F4F1E8] lg:grid-cols-[0.48fr_0.52fr]"
      >
        <motion.div variants={staggerItem} className="flex min-h-[34rem] flex-col items-start justify-center px-7 py-14 text-center sm:px-12 lg:px-16">
          <p className="mx-auto text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#DED2BE] lg:mx-0">
            Living Decision System
          </p>
          <h2 className="editorial-display mx-auto mt-7 max-w-[28rem] text-[3.35rem] leading-[0.98] sm:text-[5rem] lg:mx-0 lg:text-left">
            生活到交付判断系统
          </h2>
          <p className="mx-auto mt-6 max-w-[18rem] text-base leading-7 text-[#DED2BE] lg:mx-0 lg:text-left">
            从想要的生活开始，向后核对空间、预算、报价合同和交付风险。
          </p>
          <div className="mt-7 w-full max-w-[28rem] space-y-2">
            {instrumentStages.map((stage, index) => (
              <div
                key={stage.code}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 border border-[#F4F1E8]/12 bg-[#F4F1E8]/[0.035] px-3 py-2.5 motion-surface"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <span className={`${fontClassName} text-[0.68rem] font-semibold text-[#DED2BE] tabular-nums`}>{stage.code}</span>
                <span>
                  <span className="block text-left text-sm font-semibold text-[#F4F1E8]">{stage.title}</span>
                  <span className="block text-left text-xs leading-5 text-[#DED2BE]">{stage.body}</span>
                </span>
                <span className="text-[0.68rem] font-semibold text-[#DED2BE] opacity-70 transition-opacity group-hover:opacity-100">{stage.status}</span>
              </div>
            ))}
          </div>
          <Link
            href="/living-diagnosis"
            className="motion-press mx-auto mt-8 inline-flex h-10 items-center rounded-[7px] bg-[#F4F1E8] px-4 text-sm font-semibold text-[#111111] hover:bg-[#DED2BE] lg:mx-0"
          >
            开始判断
          </Link>
        </motion.div>

        <motion.div variants={staggerItem} className="relative min-h-[32rem] overflow-hidden px-6 pb-12 lg:px-10 lg:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(222,210,190,0.18),transparent_44%)]" aria-hidden />
          <div className="relative mx-auto h-[26rem] max-w-[34rem] lg:h-full">
            <SpatialMap />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function SectionTitle({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string
  title: string
  body: string
}) {
  return (
    <div className="max-w-4xl">
      <p className="text-sm font-semibold tracking-[0.18em] text-ink">{eyebrow}</p>
      <h2 className="editorial-display mt-4 max-w-4xl text-[2.2rem] leading-[1.12] text-ink sm:text-[3.35rem]">
        {title}
      </h2>
      <p className="mt-5 max-w-2xl text-base leading-8 text-ink-muted">{body}</p>
    </div>
  )
}

type Props = {
  fontClassName: string
}

export default function HomePageGptSkill({ fontClassName }: Props) {
  return (
    <main className="bg-canvas text-ink">
      <section className="px-5 pb-12 pt-20 sm:px-8 sm:pb-16 sm:pt-28 lg:px-12 lg:pb-20 lg:pt-36">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.58fr_0.42fr] lg:items-end">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.h1
              variants={staggerItem}
              className="editorial-display max-w-[13ch] text-[3.05rem] leading-[1.06] text-ink sm:text-[5rem] lg:text-[5.9rem]"
            >
              <span className="headline-underline">居住判断</span>和工具，把<span className="headline-underline">理想生活</span>放到签约前。
            </motion.h1>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-[34rem] lg:pb-6">
            <motion.p variants={staggerItem} className="editorial-serif text-2xl leading-[1.18] text-ink sm:text-[2rem]">
              装修不是把房子装完，而是让美学、生活方式、空间秩序、预算边界和交付风险互相承接。
            </motion.p>
            <motion.div variants={staggerItem} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ActionLink href="/living-diagnosis">
                <HouseLine size={18} aria-hidden />
                开始居住诊断
              </ActionLink>
              <ActionLink href="/tools/quote-check" variant="secondary">
                <UploadSimple size={18} aria-hidden />
                已有报价先初筛
              </ActionLink>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <FeaturePanel fontClassName={fontClassName} />

      <AnimatedSection className="border-b border-border px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[1320px]">
          <h2 className="mb-6 text-xl font-semibold text-ink">判断入口</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {releaseCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group motion-surface flex min-h-[25rem] flex-col rounded-[8px] bg-surface-warm p-7 shadow-[inset_0_0_0_1px_rgba(17,17,17,0.06)]"
              >
                <h3 className="text-2xl font-semibold leading-tight text-ink">{card.title}</h3>
                <p className="mt-3 max-w-[26rem] text-base leading-7 text-ink">{card.body}</p>
                <div className="mt-auto border-t border-ink/10 pt-5">
                  <div className="grid grid-cols-[0.42fr_0.58fr] gap-4 border-b border-ink/10 pb-3 text-xs">
                    <span className="font-semibold uppercase tracking-[0.15em] text-ink">阶段</span>
                    <span className="text-right text-ink-muted">{card.date}</span>
                  </div>
                  <div className="grid grid-cols-[0.42fr_0.58fr] gap-4 border-b border-ink/10 py-3 text-xs">
                    <span className="font-semibold uppercase tracking-[0.15em] text-ink">类型</span>
                    <span className="text-right text-ink-muted">{card.meta}</span>
                  </div>
                  <span className="mt-5 inline-flex h-10 items-center rounded-[7px] bg-ink px-4 text-sm font-semibold text-white transition-colors group-hover:bg-stone-deep">
                    {card.cta}
                    <ArrowRight size={15} className="motion-arrow ml-2" aria-hidden />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="border-b border-border px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.42fr_0.58fr]">
          <SectionTitle
            eyebrow="判断维度"
            title="不先判断，装修就会变成一堆孤立选择。"
            body="风格、收纳、预算、报价和合同不是分开的。一个家的问题，往往是在这些选择彼此没有承接时出现。"
          />
          <div className="grid gap-px overflow-hidden rounded-[8px] border border-border bg-border">
            {dimensionRows.map((row, index) => {
              const Icon = row.icon
              return (
                <Link key={row.title} href={row.href} className="group motion-surface grid gap-4 bg-canvas p-5 hover:bg-surface sm:grid-cols-[auto_1fr_auto] sm:items-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-surface-warm text-ink">
                    <Icon size={25} weight="duotone" aria-hidden />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-3">
                      <span className={`${fontClassName} text-xs font-semibold text-ink-faint tabular-nums`}>{String(index + 1).padStart(2, '0')}</span>
                      <h3 className="text-lg font-semibold leading-tight text-ink">{row.title}</h3>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-ink-muted">{row.question}</p>
                    <p className="mt-1 text-xs font-semibold text-ink">{row.output}</p>
                  </div>
                  <ArrowRight size={18} className="motion-arrow hidden text-ink sm:block" aria-hidden />
                </Link>
              )
            })}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="border-b border-border bg-[#111111] px-5 py-16 text-[#F4F1E8] sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.44fr_0.56fr]">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-[#DED2BE]">签约前风险</p>
            <h2 className="editorial-display mt-4 max-w-xl text-[2.2rem] leading-[1.12] sm:text-[3.3rem]">
              报价风险，是理想生活落地时必须经过的关口。
            </h2>
            <p className="mt-5 max-w-md text-base leading-8 text-[#DED2BE]">
              风险不是用来制造焦虑的。它的价值，是把签约前需要写清楚、问清楚、确认清楚的地方提前列出来。
            </p>
          </div>
          <div className="grid gap-4">
            {riskSignals.map((item, index) => (
              <Link key={item.title} href={item.href} className="group motion-surface grid gap-4 rounded-[8px] border border-white/12 bg-white/[0.045] p-5 hover:bg-white/[0.075] sm:grid-cols-[auto_1fr_auto] sm:items-center">
                <span className={`${fontClassName} text-xs font-semibold text-[#DED2BE] tabular-nums`}>R{index + 1}</span>
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#DED2BE]">{item.body}</p>
                </div>
                <ArrowRight size={18} className="motion-arrow hidden text-[#F4F1E8] sm:block" aria-hidden />
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/tools/quote-check" className="motion-press inline-flex h-11 items-center justify-center rounded-[7px] bg-[#F4F1E8] px-5 text-sm font-semibold text-[#111111]">
                做免费报价初筛
              </Link>
              <Link href="/risk-dictionary" className="motion-press inline-flex h-11 items-center justify-center rounded-[7px] border border-[#F4F1E8]/25 px-5 text-sm font-semibold text-[#F4F1E8]">
                查看风险词典
              </Link>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="border-b border-border px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.4fr_0.6fr]">
          <SectionTitle
            eyebrow="服务路径"
            title="服务不是价格列表，而是判断深度。"
            body="从免费诊断到综合判断，每一层都对应你当前材料的完整度和签约风险。"
          />
          <div className="rounded-[8px] bg-surface-warm p-5 sm:p-7">
            <CommercialLadder variant="instrument" />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.42fr_0.58fr]">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-ink">边界</p>
            <h2 className="editorial-display mt-4 max-w-xl text-[2.2rem] leading-[1.12] text-ink sm:text-[3.3rem]">
              ZenoAIHome 只做一件事：把看不清的地方拆开。
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {homeFaqs.map((item) => (
              <div key={item.question} className="rounded-[8px] bg-surface p-5 shadow-[inset_0_0_0_1px_rgba(17,17,17,0.08)]">
                <h3 className="text-base font-semibold leading-snug text-ink">{item.question}</h3>
                <p className="mt-3 text-sm leading-7 text-ink-muted">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </main>
  )
}
