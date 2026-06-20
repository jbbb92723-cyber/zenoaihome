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
  { code: '01', title: '想过什么日子', body: '家里几口人、每天怎么过，先写下来', status: '第一步' },
  { code: '02', title: '空间怎么用', body: '动线顺不顺、东西放哪、谁在哪待着', status: '排顺序' },
  { code: '03', title: '钱往哪花', body: '哪些地方不能省、哪些可以晚点买', status: '做取舍' },
  { code: '04', title: '报价看清楚', body: '材料写没写全、数量对不对、责任在谁', status: '逐条问' },
  { code: '05', title: '签之前确认', body: '验收怎么验、拖工期怎么办、售后谁管', status: '落纸上' },
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
    title: '好看能不能经得住日常',
    question: '效果图漂亮，住进去三个月以后呢？光线、材质、清洁、孩子和宠物——这些才是每天的考题。',
    output: '长期审美、材质和维护边界',
    href: '/living-diagnosis',
  },
  {
    icon: Notebook,
    title: '你真正喜欢的是什么',
    question: '攒了一堆灵感图。把那些图放一起看，反复出现的颜色、材质、空间感觉——那才是你真正想要的。',
    output: '色彩、比例、材质和预算优先级',
    href: '/living-diagnosis',
  },
  {
    icon: Wrench,
    title: '空间是助手还是阻碍',
    question: '厨房做饭顺不顺手、客厅能不能让人放松、阳台晾衣服方不方便——空间应该帮你省力，不是给你添麻烦。',
    output: '空间冲突点和功能排序',
    href: '/cases',
  },
  {
    icon: UsersThree,
    title: '家会怎么改变你们的关系',
    question: '餐桌不只是吃饭的地方，客厅不只是看电视的地方。这些空间每天在塑造你们怎么相处。',
    output: '家庭场景和社交尺度',
    href: '/blog',
  },
  {
    icon: ShieldCheck,
    title: '回到家能松下来吗',
    question: '有的人需要安静角落，有的人需要秩序感，有的人需要一个不被打扰的地方。你的家接得住这些吗？',
    output: '情绪场景和空间节奏',
    href: '/living-diagnosis',
  },
  {
    icon: MagnifyingGlass,
    title: '报价和合同能兜住前面的决定吗',
    question: '前面想清楚了生活怎么过，报价和合同能不能把这些想法接住？还是看完报价发现完全对不上？',
    output: '风险点、追问清单和签前边界',
    href: '/tools/quote-check',
  },
]

const releaseCards = [
  {
    title: '居住诊断',
    body: '还没想清楚要装成什么样？先别急着看图。把你的生活方式、审美偏好、空间需求和预算一起捋一遍。',
    meta: '免费工具',
    date: '起点',
    href: '/living-diagnosis',
    cta: '开始诊断',
  },
  {
    title: '报价风险初筛',
    body: '已经拿到报价了？先别急着签。发给我帮你看看材料、工艺、数量和付款方式有没有坑。',
    meta: '风险筛查',
    date: '签约前',
    href: '/tools/quote-check',
    cta: '做初筛',
  },
  {
    title: '居住方案综合判断',
    body: '想把生活方式、预算、报价、合同和交付这些事放在一起看？我来帮你做一份完整的方案和风险判断。',
    meta: '深度服务',
    date: '决策包',
    href: '/services#quote-deep',
    cta: '看服务',
  },
]

const riskSignals = [
  {
    title: '按实结算',
    body: '写"按实结算"本身不是问题。问题是数量、范围和最终金额不能等到施工做完了你才知道。',
    href: '/risk-dictionary/actual-settlement-change-order-risk',
  },
  {
    title: '材料只写了品牌没写型号',
    body: '"品牌乳胶漆"四个字不够。同一个品牌下面十几条产品线，价格能差好几倍。型号要写进合同。',
    href: '/risk-dictionary/missing-material-brand-model',
  },
  {
    title: '口头承诺没写进合同',
    body: '销售说的、微信聊的，都不等于合同里有。开工前把重要的承诺写成合同附件，双方签字。',
    href: '/risk-dictionary/oral-promise-not-written',
  },
]

const homeFaqs = [
  {
    question: '你这个居住诊断是干什么的？',
    answer: '不是风格测试。是把你的生活方式、审美偏好、家庭场景、空间优先级、预算底线放在一起看一遍，帮你在找装修公司之前先把方向搞清楚。',
  },
  {
    question: '为什么不直接把报价工具放最前面？',
    answer: '因为报价不是孤立的。它应该能接住你前面想清楚的生活方式。先想清楚自己要什么，再看报价，顺序反了容易踩坑。',
  },
  {
    question: '你能替我做最终决定吗？',
    answer: '不能。我不会替你选施工方，不承诺最低价，也不代替律师审合同。我帮你的是：把看不清的地方拆开，把风险提前标出来，把取舍说清楚。决定还是你做。',
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
            从生活到交付，五步看清楚
          </p>
          <h2 className="editorial-display mx-auto mt-7 max-w-[28rem] text-[3.35rem] leading-[0.98] sm:text-[5rem] lg:mx-0 lg:text-left">
            先判断，再装修
          </h2>
          <p className="mx-auto mt-6 max-w-[18rem] text-base leading-7 text-[#DED2BE] lg:mx-0 lg:text-left">
            从你想要的日常开始，一步步对到报价和合同。
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
              在<span className="headline-underline">签约之前</span>，把<span className="headline-underline">你的生活</span>想清楚。
            </motion.h1>
            <motion.p variants={staggerItem} className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-stone">
              今天在看的：南宁第 38 份水电没有上限的报价——和 2018 年第一份一样。
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-[34rem] lg:pb-6">
            <motion.p variants={staggerItem} className="editorial-serif text-2xl leading-[1.18] text-ink sm:text-[2rem]">
              装修做了16年，床垫卖了十几年。最深的体会：大部分坑不是施工做错了，是签合同之前该看清楚的东西没人帮你看。
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
          <h2 className="mb-6 text-xl font-semibold text-ink">从哪开始</h2>
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
            eyebrow="六个维度"
            title="装修不是一堆孤立的选择，它们之间互相关联。"
            body="风格、收纳、预算、报价和合同——单独看每件事可能都没问题，但放在一起，裂缝就出来了。"
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
            <p className="text-sm font-semibold tracking-[0.18em] text-[#DED2BE]">签约前必看</p>
            <h2 className="editorial-display mt-4 max-w-xl text-[2.2rem] leading-[1.12] sm:text-[3.3rem]">
              报价里的坑，签之前都能看出来。
            </h2>
            <p className="mt-5 max-w-md text-base leading-8 text-[#DED2BE]">
              不是吓你。做了16年，这三类问题几乎每份报价都会出现——看完再签，不迟。
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
            eyebrow="服务"
            title="从免费诊断到深度判断，按你的情况来。"
            body="不催你付费。先看看你现在手里有什么材料，缺什么，再看需要我帮你到哪一步。"
          />
          <div className="rounded-[8px] bg-surface-warm p-5 sm:p-7">
            <CommercialLadder variant="instrument" />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.42fr_0.58fr]">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-ink">说清楚</p>
            <h2 className="editorial-display mt-4 max-w-xl text-[2.2rem] leading-[1.12] text-ink sm:text-[3.3rem]">
              我只做一件事：把你看不清的地方拆开。
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
