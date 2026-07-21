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
  Buildings,
  ChatsCircle,
  Code,
  Database,
  GraduationCap,
  HouseLine,
  UsersThree,
  Wrench,
} from '@phosphor-icons/react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const proofPoints = [
  { value: '17年', label: '传统行业经营与项目经验' },
  { value: '20万+', label: '睡宝集团任职期间服务客户' },
  { value: '1万㎡+', label: '独立签下城堡装修总承包项目' },
  { value: '3000万+', label: '该项目装修合同金额' },
]

const services = [
  {
    id: '01',
    icon: GraduationCap,
    title: 'AI 培训与企业内训',
    body: '面向企业、商会和创业社群，从真实工作出发完成工具实操与工作流训练。',
    deliverable: '课程提纲、现场实操、操作资料与课后复盘',
    href: '/training',
  },
  {
    id: '02',
    icon: Wrench,
    title: 'AI 工具与工作流',
    body: '梳理重复工作，选择合适工具，把零散操作整理成团队能执行的流程。',
    deliverable: '场景清单、工具方案、基础工作流与使用说明',
    href: '/services#ai-workflow',
  },
  {
    id: '03',
    icon: Database,
    title: '企业 AI 知识库',
    body: '把分散在文档、聊天和个人经验里的资料，整理成可检索、可更新的知识入口。',
    deliverable: '资料盘点、知识结构、检索问答入口与更新规范',
    href: '/services#knowledge-base',
  },
  {
    id: '04',
    icon: Brain,
    title: 'AI 智能体',
    body: '围绕一个边界清楚的任务设计智能体，并通过真实样本测试后交接。',
    deliverable: '任务边界、提示与流程、测试记录和使用手册',
    href: '/services#ai-agent',
  },
  {
    id: '05',
    icon: Browser,
    title: '网站开发',
    body: '适合个人品牌和小型业务，从定位、内容结构到页面实现与上线一起完成。',
    deliverable: '信息架构、响应式页面、基础部署与交接文档',
    href: '/services#website',
  },
]

const experience = [
  {
    years: '2009—2017',
    role: '睡宝集团 · 南宁总经理',
    detail: '带团队做销售与经营管理。2014 年推动 iPad 销售端与仓库数据打通，累计服务南宁 20 万+客户。',
  },
  {
    years: '2017—2025',
    role: '家装行业 · 创始人',
    detail: '独立签下 1 万㎡+城堡装修总承包项目，合同金额 3000 万+，跑通洽谈、施工管理、审美判断与后端服务。',
  },
  {
    years: '现在',
    role: '传统行业 × AI 实践',
    detail: '自学内容生产、AI 工具和氛围编程，正在推进社群网站、智能体、AI 内容工厂、培训与项目交付。',
  },
]

const practiceAssets = [
  {
    icon: HouseLine,
    label: '装修判断系统',
    title: '把 17 年经验做成公开工具',
    body: '居住诊断、报价初筛、风险词典和判断样张继续保留，作为最完整的垂直实践。',
    href: '/tools',
  },
  {
    icon: Code,
    label: '独立开发',
    title: 'ZenoAIHome 本身就是案例',
    body: '这个网站不是外包展示页，而是赞诺学习 AI、内容系统和网站开发的持续实践。',
    href: '/about',
  },
  {
    icon: BookOpenText,
    label: '公开内容',
    title: '把转型过程写下来',
    body: '记录 AI 落地、传统行业判断、一人公司和真实项目复盘，不把结果包装成神话。',
    href: '/blog',
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
            <motion.p variants={fadeUp} className="text-sm font-semibold text-white/75">Zeno 赞诺</motion.p>
            <motion.h1 variants={fadeUp} className="editorial-display mt-5 max-w-[12ch] text-[3.25rem] leading-[1.02] sm:text-[5rem] lg:text-[6.3rem]">
              从传统行业走出来的 AI 实践者
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 max-w-[42rem] text-base leading-8 text-white/82 sm:text-lg">
              17 年经营、销售与大型项目经验。现在把 AI 用到培训、知识库、智能体、网站和一人公司的真实工作里。
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ActionLink href="/services"><Briefcase size={18} aria-hidden />查看可合作服务</ActionLink>
              <ActionLink href="/about" secondary>认识赞诺</ActionLink>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-border bg-surface-warm">
        <div className="mx-auto grid max-w-[1320px] grid-cols-2 px-5 sm:px-8 lg:grid-cols-4 lg:px-12">
          {proofPoints.map((item, index) => (
            <div key={item.value} className={`py-7 sm:py-9 ${index % 2 ? 'pl-5' : 'pr-5'} lg:border-r lg:border-border lg:px-6 first:lg:pl-0 last:lg:border-r-0 last:lg:pr-0`}>
              <p className="editorial-display text-3xl text-ink sm:text-4xl">{item.value}</p>
              <p className="mt-2 max-w-[15rem] text-xs leading-5 text-ink-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-border px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.34fr_0.66fr]">
          <div>
            <p className="text-sm font-semibold text-stone">目前可合作</p>
            <h2 className="editorial-display mt-4 text-[2.5rem] leading-[1.12] sm:text-[3.6rem]">不卖“AI 能力”，只交付具体工作。</h2>
            <p className="mt-5 max-w-md text-base leading-8 text-ink-muted">
              先说清对象、材料、任务边界和验收方式。尚未标准化的项目不挂虚构价格，确认范围后再报价。
            </p>
          </div>
          <div className="border-t border-border">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Link key={service.id} href={service.href} className="group grid gap-4 border-b border-border py-6 sm:grid-cols-[3rem_1fr_1fr_auto] sm:items-center">
                  <span className="text-xs font-semibold tabular-nums text-ink-faint">{service.id}</span>
                  <div>
                    <Icon size={22} weight="duotone" className="mb-3 text-stone" aria-hidden />
                    <h3 className="text-lg font-semibold text-ink">{service.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-ink-muted">{service.body}</p>
                  </div>
                  <p className="text-sm leading-7 text-ink-muted"><span className="font-semibold text-ink">交付：</span>{service.deliverable}</p>
                  <ArrowRight size={19} className="text-ink-faint transition-transform group-hover:translate-x-1 group-hover:text-ink" aria-hidden />
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface-warm px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.38fr_0.62fr]">
          <div>
            <Buildings size={30} weight="duotone" className="text-stone" aria-hidden />
            <h2 className="editorial-display mt-5 text-[2.4rem] leading-[1.12] sm:text-[3.4rem]">AI 是新工具，传统行业是我的底盘。</h2>
            <p className="mt-5 max-w-md text-base leading-8 text-ink-muted">我不是从教程里理解经营，而是在团队、客户、合同和项目现场里长出来的。</p>
          </div>
          <div className="border-l border-border pl-6 sm:pl-10">
            {experience.map((item) => (
              <div key={item.years} className="relative border-b border-border py-6 first:pt-0 last:border-b-0 last:pb-0">
                <span className="absolute -left-[1.72rem] top-2 h-2 w-2 bg-stone sm:-left-[2.72rem]" aria-hidden />
                <p className="text-xs font-semibold text-stone">{item.years}</p>
                <h3 className="mt-2 text-xl font-semibold text-ink">{item.role}</h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-muted">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1320px]">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-stone">可验证的实践</p>
            <h2 className="editorial-display mt-4 text-[2.4rem] leading-[1.12] sm:text-[3.5rem]">先看我做过什么，再判断要不要合作。</h2>
          </div>
          <div className="mt-10 grid border-y border-border lg:grid-cols-3">
            {practiceAssets.map((item, index) => {
              const Icon = item.icon
              return (
                <Link key={item.title} href={item.href} className={`group py-7 lg:px-7 ${index < 2 ? 'border-b border-border lg:border-b-0 lg:border-r' : ''}`}>
                  <Icon size={25} weight="duotone" className="text-stone" aria-hidden />
                  <p className="mt-6 text-xs font-semibold text-ink-faint">{item.label}</p>
                  <h3 className="mt-2 text-xl font-semibold text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-ink-muted">{item.body}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink">查看 <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden /></span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-ink px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.58fr_0.42fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3 text-white/65"><UsersThree size={24} aria-hidden /><span className="text-sm font-semibold">赞诺·星火者共同体</span></div>
            <h2 className="editorial-display mt-5 max-w-[15ch] text-[2.7rem] leading-[1.1] sm:text-[4rem]">赞诺发起，但要能独立运转。</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70">面向 AI 时代的一人公司与转型创业者。不是围观群，而是围绕学习、分享、连接和真实项目形成协作。</p>
          </div>
          <div className="lg:text-right">
            <Link href="/community" className="motion-press inline-flex min-h-11 items-center gap-2 rounded-[7px] bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-[#DED2BE]">
              <ChatsCircle size={18} aria-hidden />了解共同体<ArrowRight size={17} aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
