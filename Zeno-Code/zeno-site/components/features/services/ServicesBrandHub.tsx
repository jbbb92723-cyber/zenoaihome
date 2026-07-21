'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Brain,
  Browser,
  CheckCircle,
  Database,
  GraduationCap,
  Wrench,
} from '@phosphor-icons/react'

const services = [
  {
    id: 'training',
    code: '01',
    icon: GraduationCap,
    title: 'AI 培训与企业内训',
    forWho: '企业团队、商会、创业社群，以及希望让成员真正开始使用 AI 的组织。',
    input: '团队背景、人数、现有工具基础、希望解决的工作场景。',
    outputs: ['定制课程提纲', '现场或线上实操', '操作资料与模板', '课后复盘建议'],
    boundary: '不讲脱离业务的工具大全，不承诺一场培训解决所有转型问题。',
    href: '/training',
    cta: '查看培训方案',
  },
  {
    id: 'ai-workflow',
    code: '02',
    icon: Wrench,
    title: 'AI 工具与工作流',
    forWho: '已经有明确重复任务，但团队仍靠手工复制、查找和反复沟通的业务。',
    input: '一项真实任务、现有操作步骤、常用资料和期望结果样本。',
    outputs: ['工作场景拆解', '工具选择建议', '基础工作流', '操作说明与交接'],
    boundary: '先做一条能跑通的流程，不一开始就搭庞大自动化系统。',
    href: '/contact',
    cta: '说明你的场景',
  },
  {
    id: 'knowledge-base',
    code: '03',
    icon: Database,
    title: '企业 AI 知识库',
    forWho: '资料分散、经验依赖个人、同类问题反复回答的企业或小型团队。',
    input: '现有文档、表格、常见问答、业务规则和可使用权限。',
    outputs: ['资料盘点与清理', '知识分类结构', '检索问答入口', '更新规范与使用手册'],
    boundary: '知识库质量取决于原始资料和维护机制，不承诺用 AI 自动补齐缺失事实。',
    href: '/contact',
    cta: '提交资料情况',
  },
  {
    id: 'ai-agent',
    code: '04',
    icon: Brain,
    title: 'AI 智能体',
    forWho: '任务目标、输入和验收标准相对清楚，希望减少重复判断与整理工作的团队。',
    input: '任务说明、真实输入样本、合格输出样本、不可触碰的业务边界。',
    outputs: ['任务边界定义', '提示与工作流程', '样本测试记录', '部署入口与使用手册'],
    boundary: '不把高风险决策完全交给 AI，关键结果必须保留人工复核。',
    href: '/contact',
    cta: '描述智能体任务',
  },
  {
    id: 'website',
    code: '05',
    icon: Browser,
    title: '网站开发',
    forWho: '需要个人品牌站、服务型官网或小型业务入口，但还没有清晰信息架构的人。',
    input: '业务定位、目标用户、现有内容、功能范围、参考网站和上线时间。',
    outputs: ['定位与信息架构', '响应式页面开发', '基础 SEO 与部署', '交接文档'],
    boundary: '不接受需求无限扩张；支付、会员和复杂后台需单独评估。',
    href: '/contact',
    cta: '说明网站需求',
  },
]

const process = [
  { code: '01', title: '先说问题', body: '用一个真实场景说明现在怎么做、卡在哪里，不从“想做一个 AI”开始。' },
  { code: '02', title: '再看材料', body: '确认现有资料、样本、工具和人员条件，判断这件事是否适合交给 AI。' },
  { code: '03', title: '写清边界', body: '确定范围、交付物、验收方法、周期和费用，双方确认后再启动。' },
  { code: '04', title: '交付并交接', body: '用真实样本验证结果，附操作说明，让项目离开开发者也能继续使用。' },
]

export default function ServicesBrandHub() {
  return (
    <main className="bg-canvas text-ink">
      <section className="border-b border-border bg-ink px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.62fr_0.38fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-white/60">服务合作</p>
            <h1 className="editorial-display mt-5 max-w-[13ch] text-[3.2rem] leading-[1.03] sm:text-[5rem]">把 AI 变成能交付的工作</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
              培训、工作流、知识库、智能体和网站开发。先从一个真实问题开始，再决定要不要使用 AI、用到哪一步。
            </p>
          </div>
          <div className="lg:text-right">
            <p className="text-sm leading-7 text-white/60">当前采用项目制合作。未标准化的服务不挂统一价格，确认范围与验收方式后报价。</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link href="/training" className="motion-press inline-flex min-h-11 items-center justify-center gap-2 rounded-[7px] bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-[#DED2BE]">
                看培训方案 <ArrowRight size={17} aria-hidden />
              </Link>
              <Link href="/contact" className="motion-press inline-flex min-h-11 items-center justify-center gap-2 rounded-[7px] border border-white/40 px-5 py-3 text-sm font-semibold text-white hover:border-white hover:bg-white/10">
                发起项目沟通 <ArrowRight size={17} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.3fr_0.7fr]">
          <div>
            <p className="text-sm font-semibold text-stone">五类合作</p>
            <h2 className="editorial-display mt-4 text-[2.5rem] leading-[1.12] sm:text-[3.5rem]">每一项都要能验收。</h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-ink-muted">服务名称不是产品。输入、交付物和边界写清楚以后，合作才真正成立。</p>
          </div>

          <div className="border-t border-border">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <article key={service.id} id={service.id} className="scroll-mt-24 border-b border-border py-8">
                  <div className="grid gap-6 sm:grid-cols-[3rem_1fr] lg:grid-cols-[3rem_0.82fr_1.18fr]">
                    <span className="text-xs font-semibold tabular-nums text-ink-faint">{service.code}</span>
                    <div>
                      <Icon size={25} weight="duotone" className="text-stone" aria-hidden />
                      <h3 className="mt-4 text-2xl font-semibold text-ink">{service.title}</h3>
                      <p className="mt-4 text-sm leading-7 text-ink-muted"><span className="font-semibold text-ink">适合：</span>{service.forWho}</p>
                      <p className="mt-3 text-sm leading-7 text-ink-muted"><span className="font-semibold text-ink">你需要提供：</span>{service.input}</p>
                    </div>
                    <div className="lg:border-l lg:border-border lg:pl-7">
                      <p className="text-xs font-semibold text-stone">交付物</p>
                      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                        {service.outputs.map((output) => (
                          <li key={output} className="flex items-start gap-2 text-sm leading-6 text-ink-muted">
                            <CheckCircle size={17} weight="fill" className="mt-1 shrink-0 text-stone" aria-hidden />
                            <span>{output}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-5 border-l-2 border-stone-light pl-4 text-xs leading-6 text-ink-muted"><span className="font-semibold text-ink">边界：</span>{service.boundary}</p>
                      <Link href={service.href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-stone">
                        {service.cta} <ArrowRight size={16} aria-hidden />
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface-warm px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1320px]">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-stone">合作流程</p>
            <h2 className="editorial-display mt-4 text-[2.5rem] leading-[1.12] sm:text-[3.5rem]">先缩小问题，再开始做。</h2>
          </div>
          <div className="mt-10 grid border-y border-border sm:grid-cols-2 lg:grid-cols-4">
            {process.map((item, index) => (
              <div key={item.code} className={`py-7 sm:px-6 ${index < 3 ? 'border-b border-border sm:border-r lg:border-b-0' : ''} ${index === 1 ? 'sm:border-r-0 lg:border-r' : ''}`}>
                <p className="text-xs font-semibold tabular-nums text-stone">{item.code}</p>
                <h3 className="mt-4 text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-ink-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.45fr_0.55fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-stone">为什么可以从传统行业讲 AI</p>
            <h2 className="editorial-display mt-4 text-[2.4rem] leading-[1.12] sm:text-[3.4rem]">我先在自己的业务里做了一遍。</h2>
          </div>
          <div className="border-l-2 border-stone pl-6">
            <p className="text-base leading-8 text-ink-muted">
              ZenoAIHome 的内容系统、装修判断工具、知识库和后台，是赞诺学习 AI 与网站开发的持续实践。装修板块不会消失，它从网站主定位退回到最有说服力的垂直样本。
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="/tools" className="inline-flex items-center gap-2 text-sm font-semibold text-ink">查看装修判断工具 <ArrowRight size={16} aria-hidden /></Link>
              <Link href="/cases" className="inline-flex items-center gap-2 text-sm font-semibold text-ink">查看判断样张 <ArrowRight size={16} aria-hidden /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-8 border-y border-border py-10 lg:grid-cols-[0.62fr_0.38fr] lg:items-center">
          <div>
            <h2 className="editorial-display text-[2.4rem] leading-[1.12] sm:text-[3.3rem]">把你的真实问题发来。</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-muted">说明你是谁、现在怎么做、最想解决哪一步。能做，我会先把范围说清；不适合用 AI，也会直接说明。</p>
          </div>
          <div className="lg:text-right">
            <Link href="/contact" className="motion-press inline-flex min-h-11 items-center gap-2 rounded-[7px] bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-stone-deep">
              查看联系方式 <ArrowRight size={17} aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
