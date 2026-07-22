'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpenText,
  Brain,
  Briefcase,
  Browser,
  ChatsCircle,
  Database,
  GraduationCap,
  HouseLine,
  UsersThree,
  Wrench,
  Compass,
  Lightning,
  PenNib,
} from '@phosphor-icons/react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const proofPoints = [
  { value: '17年', label: '传统行业经营与项目经验' },
  { value: '20万+', label: '睡宝集团任职期间服务客户' },
  { value: '3000万+', label: '城堡装修总承包项目合同金额' },
  { value: '南宁', label: 'OPC 圈主理人 · 星火者发起人' },
]

/* ── AI 工具（免费引流） ── */
const freeTools = [
  {
    icon: Compass,
    title: '一人公司诊断',
    desc: '10 个问题，5 分钟。看看你现在卡在哪一步——产品、获客、还是交付。拿一份你自己的一人公司体检报告。',
    href: '/ai-tools#opc',
  },
  {
    icon: PenNib,
    title: '内容策略生成',
    desc: '输入你的行业和擅长的事，生成 3 个内容方向 + 选题。不是 AI 写稿——是帮你找到什么值得写。',
    href: '/ai-tools#content',
  },
  {
    icon: HouseLine,
    title: '装修判断工具',
    desc: '居住诊断、报价初筛、风险词典——17 年工地经验做成的公开工具。自己先用，拿不准再来找我。',
    href: '/tools',
  },
]

/* ── AI 服务（轻交付变现） ── */
const services = [
  {
    id: '01',
    icon: GraduationCap,
    title: 'AI 实战工作坊',
    body: '面向企业团队的线下实操。不讲概念，现场完成一次真实操作。',
    href: '/training',
  },
  {
    id: '02',
    icon: Wrench,
    title: 'AI 工具与工作流',
    body: '梳理你的重复工作，选择合适的工具，搭成团队能执行的流程。',
    href: '/services#ai-workflow',
  },
  {
    id: '03',
    icon: Database,
    title: '企业 AI 知识库',
    body: '把分散的文档、经验、规则整理成可检索、可更新的知识入口。',
    href: '/services#knowledge-base',
  },
  {
    id: '04',
    icon: Brain,
    title: 'AI 智能体',
    body: '围绕一个边界清楚的任务设计智能体，用真实样本测试后交接。',
    href: '/services#ai-agent',
  },
  {
    id: '05',
    icon: Browser,
    title: '网站开发',
    body: '个人品牌站、服务型官网。从信息架构到上线交接一起完成。',
    href: '/services#website',
  },
]

function ActionLink({ href, children, secondary = false }: { href: string; children: ReactNode; secondary?: boolean }) {
  return (
    <Link
      href={href}
      className={`motion-press inline-flex min-h-11 items-center justify-center gap-2 rounded-[7px] px-5 py-3 text-sm font-semibold transition-colors ${
        secondary
          ? 'border border-white/45 bg-transparent text-white hover:border-white hover:bg-white/10'
          : 'bg-white text-ink hover:bg-[#DED2BE]'
      }`}
    >
      {children}
      <ArrowRight size={17} aria-hidden />
    </Link>
  )
}

export default function HomePageBrandHub() {
  return (
    <main className="bg-canvas text-ink">
      {/* ── Hero ── */}
      <section className="relative isolate min-h-[calc(82dvh-3.5rem)] overflow-hidden bg-ink">
        <Image
          src="/images/brand/zeno-portrait.jpg"
          alt="赞诺"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[52%_34%] sm:object-[60%_35%]"
        />
        <div className="absolute inset-0 bg-[#111111]/60" aria-hidden />
        <div className="relative mx-auto flex min-h-[calc(82dvh-3.5rem)] max-w-[1320px] items-end px-5 pb-12 pt-24 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }} className="max-w-[52rem] text-white">
            <motion.p variants={fadeUp} className="text-sm font-semibold text-white/75">
              传统行业转型一人公司 · OPC 圈南宁主理人
            </motion.p>
            <motion.h1 variants={fadeUp} className="editorial-display mt-5 max-w-[14ch] text-[3.25rem] leading-[1.02] sm:text-[5rem] lg:text-[6.3rem]">
              花了二十年，才搞清楚怎么把经验变成可交付的东西。
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 max-w-[42rem] text-base leading-8 text-white/82 sm:text-lg">
              从工地到 AI。从一个人到一群人。现在把这条路——怎么学、怎么做内容、怎么搭系统、怎么找到一起走的人——摊开来给你看。
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ActionLink href="/ai-tools"><Lightning size={18} aria-hidden />先试试免费工具</ActionLink>
              <ActionLink href="/community" secondary><UsersThree size={18} aria-hidden />了解星火者</ActionLink>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 证明点 ── */}
      <section className="border-b border-border bg-surface-warm">
        <div className="mx-auto grid max-w-[1320px] grid-cols-2 px-5 sm:px-8 lg:grid-cols-4 lg:px-12">
          {proofPoints.map((item, index) => (
            <div key={item.value} className={`py-7 sm:py-9 ${index % 2 ? 'pl-5' : 'pr-5'} lg:border-r lg:border-border lg:px-6 first:lg:pl-0 last:lg:border-r-0 last:lg:pr-0`}>
              <p className="editorial-display text-[1.8rem] text-ink sm:text-[2.2rem]">{item.value}</p>
              <p className="mt-2 max-w-[15rem] text-xs leading-5 text-ink-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 免费工具 ── */}
      <section className="border-b border-border px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.34fr_0.66fr]">
          <div>
            <p className="text-sm font-semibold text-stone">AI 工具</p>
            <h2 className="editorial-display mt-4 text-[2.5rem] leading-[1.12] sm:text-[3.6rem]">不花钱。先自己试试。</h2>
            <p className="mt-5 max-w-md text-base leading-8 text-ink-muted">
              三个免费工具，自己能用、能分享、能帮你搞清楚下一步该做什么。不给结果——给方向。
            </p>
            <Link href="/ai-tools" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-stone hover:text-ink">
              看全部工具 <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {freeTools.map((tool) => {
              const Icon = tool.icon
              return (
                <Link key={tool.title} href={tool.href} className="group border border-border bg-surface p-5 transition-colors hover:border-stone">
                  <Icon size={22} weight="duotone" className="text-stone" aria-hidden />
                  <h3 className="mt-4 text-sm font-semibold text-ink">{tool.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink-muted">{tool.desc}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── AI 服务 ── */}
      <section className="border-b border-border bg-surface-warm px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.34fr_0.66fr]">
          <div>
            <p className="text-sm font-semibold text-stone">AI 服务</p>
            <h2 className="editorial-display mt-4 text-[2.5rem] leading-[1.12] sm:text-[3.6rem]">不卖课。只交付具体工作。</h2>
            <p className="mt-5 max-w-md text-base leading-8 text-ink-muted">
              培训、工作流、知识库、智能体、网站。先说清对象、材料和验收边界，确认能交付了再报价。
            </p>
            <Link href="/services" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-stone hover:text-ink">
              看全部服务 <ArrowRight size={16} />
            </Link>
          </div>
          <div className="border-t border-border">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Link key={service.id} href={service.href} className="group grid gap-4 border-b border-border py-5 sm:grid-cols-[3rem_1fr_auto] sm:items-center">
                  <span className="text-xs font-semibold tabular-nums text-ink-faint">{service.id}</span>
                  <div>
                    <Icon size={20} weight="duotone" className="mb-2 text-stone" aria-hidden />
                    <h3 className="text-base font-semibold text-ink">{service.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-ink-muted">{service.body}</p>
                  </div>
                  <ArrowRight size={17} className="text-ink-faint transition-transform group-hover:translate-x-1 group-hover:text-ink" aria-hidden />
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 星火者 ── */}
      <section className="border-b border-border px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.34fr_0.66fr]">
          <div>
            <p className="text-sm font-semibold text-stone">星火者</p>
            <h2 className="editorial-display mt-4 text-[2.5rem] leading-[1.12] sm:text-[3.6rem]">一个人可以开始，但很难独自走远。</h2>
            <p className="mt-5 max-w-md text-base leading-8 text-ink-muted">
              OPC 协作共同体。不是围观群——每个进来的人都在做事。隔周一次火种读书会，日常有回应。有合适的项目一起做。
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/community" className="motion-press inline-flex min-h-11 items-center gap-2 rounded-[7px] bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-stone-deep">
                了解星火者 <ArrowRight size={17} aria-hidden />
              </Link>
              <span className="text-xs text-ink-muted">20 人 · ¥1,499 · 试运行招募中</span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-border bg-surface p-5">
              <h3 className="text-sm font-semibold text-ink">火种读书会</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">隔周一次。单周成员分享正在做的项目，双周围绕一份材料共读。不是泛读——是带着真实问题来。</p>
            </div>
            <div className="border border-border bg-surface p-5">
              <h3 className="text-sm font-semibold text-ink">引火连接</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">两个星火者可能彼此需要时，有人牵线。不是丢一个联系方式——是带着上下文介绍。</p>
            </div>
            <div className="border border-border bg-surface p-5">
              <h3 className="text-sm font-semibold text-ink">共燃项目</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">有合适的项目一起做。发起人说清做什么、需要谁、怎么分钱。双向选择，边界写清楚再启动。</p>
            </div>
            <div className="border border-border bg-surface p-5">
              <h3 className="text-sm font-semibold text-ink">知识星球</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">所有活动记录、案例复盘、项目档案沉淀于此。不是资料堆——是正在生长的实践档案。</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 装修视野 ── */}
      <section className="border-b border-border bg-surface-warm px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.45fr_0.55fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-stone">装修视野</p>
            <h2 className="editorial-display mt-4 text-[2.4rem] leading-[1.12] sm:text-[3.4rem]">17 年工地里长出来的判断。</h2>
            <p className="mt-5 max-w-md text-base leading-8 text-ink-muted">
              不是教程——是怎么看报价、怎么判断施工质量、怎么在入住前避开大多数人都踩过的坑。免费工具自己用，拿不准的来聊。
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="/renovation" className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                看装修方法 <ArrowRight size={16} aria-hidden />
              </Link>
              <Link href="/tools" className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                免费工具 <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </div>
          <div className="border-l-2 border-stone pl-6">
            <p className="text-base leading-8 text-ink-muted">
              装修是重决策——不标价，不接急单。如果你的情况需要深度对接，先看看这些免费工具和文章，建立自己的判断。需要找人帮你判断时，再找我聊。
            </p>
          </div>
        </div>
      </section>

      {/* ── 内容与实践 ── */}
      <section className="border-b border-border px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.38fr_0.62fr]">
          <div>
            <Buildings size={30} weight="duotone" className="text-stone" aria-hidden />
            <h2 className="editorial-display mt-5 text-[2.4rem] leading-[1.12] sm:text-[3.4rem]">不是教程里学来的——是从经营、团队、客户和工地里长出来的。</h2>
            <p className="mt-5 max-w-md text-base leading-8 text-ink-muted">
              把转型过程写下来。不包装成神话——写真实的问题、失败和偶尔的突破。
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link href="/blog?category=ai" className="group border border-border bg-surface p-5 transition-colors hover:border-stone">
              <Lightning size={22} weight="duotone" className="text-stone" />
              <h3 className="mt-4 text-sm font-semibold text-ink">传统行业 × AI</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">工具、工作流、内容系统、真实复盘</p>
            </Link>
            <Link href="/blog?category=renovation" className="group border border-border bg-surface p-5 transition-colors hover:border-stone">
              <HouseLine size={22} weight="duotone" className="text-stone" />
              <h3 className="mt-4 text-sm font-semibold text-ink">装修实践</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">17 年一线经验的判断</p>
            </Link>
            <Link href="/blog?category=opc" className="group border border-border bg-surface p-5 transition-colors hover:border-stone">
              <UsersThree size={22} weight="duotone" className="text-stone" />
              <h3 className="mt-4 text-sm font-semibold text-ink">一人公司</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">转型、产品、协作与共同体</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 底部 CTA ── */}
      <section className="bg-ink px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.58fr_0.42fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3 text-white/65"><UsersThree size={24} aria-hidden /><span className="text-sm font-semibold">星火者</span></div>
            <h2 className="editorial-display mt-5 max-w-[15ch] text-[2.7rem] leading-[1.1] sm:text-[4rem]">找一群正在做事的人，一起走。</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70">
              不是围观。是分享真实项目、认识同路人、在边界清楚的前提下一起协作。首期 20 人，试运行 6 个月。
            </p>
          </div>
          <div className="lg:text-right">
            <Link href="/community" className="motion-press inline-flex min-h-11 items-center gap-2 rounded-[7px] bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-[#DED2BE]">
              <ChatsCircle size={18} aria-hidden />了解星火者<ArrowRight size={17} aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
