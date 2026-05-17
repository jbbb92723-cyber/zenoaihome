import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: '签约前装修判断工具工作台 | ZenoAIHome',
  description:
    'ZenoAIHome 的签约前装修判断工具工作台：先做报价初筛，再按需要使用预算分配、超预算原因自测、材料计算和验收清单。',
  alternates: {
    canonical: 'https://zenoaihome.com/tools',
  },
}

const primaryTool = {
  title: '签约前报价风险初筛',
  status: '主入口',
  price: '免费',
  time: '8-15 分钟',
  href: '/tools/quote-check',
  cta: '开始报价初筛',
  problem: '你已经拿到报价单，准备签约，但看不出漏项、模糊项、后期增项口子和付款风险。',
  gain: '先拿到风险等级、重点追问清单和下一步建议。它不替你做决定，只帮你先看清哪些地方还没说清。',
}

const quickRoutes = [
  { situation: '手上有报价单', action: '先做报价初筛', href: '/tools/quote-check', primary: true },
  { situation: '只有总预算', action: '先看钱怎么分', href: '/tools/budget-structure' },
  { situation: '担心后面超预算', action: '查超预算原因', href: '/tools/budget-risk' },
  { situation: '快要签合同', action: '看签约前清单', href: '/start/contract' },
  { situation: '准备买材料', action: '算材料数量', href: '/tools/tile-calculator' },
  { situation: '准备验收', action: '生成节点清单', href: '/tools/inspection-guide' },
]

const decisionTools = [
  {
    title: '预算分配工具',
    status: '辅助判断',
    price: '免费',
    time: '5-8 分钟',
    href: '/tools/budget-structure',
    cta: '看钱怎么分',
    problem: '你知道总预算，但不知道自己更接近简约够住、舒适耐用，还是精致改善。',
    freeGain: '按三种说人话的装修取向，拆出基础施工、主材、柜子、设备、软装和预留机动钱。',
    nextStep: '预算只是辅助。临近签约时，还是要回到报价单，看项目边界有没有写清。',
  },
  {
    title: '超预算原因自测',
    status: '辅助判断',
    price: '免费',
    time: '5-8 分钟',
    href: '/tools/budget-risk',
    cta: '查超预算原因',
    problem: '你感觉钱可能失控，但分不清问题来自报价没写清、需求太散，还是施工过程没留余地。',
    freeGain: '先判断最值得优先处理的一类问题，再去看对应工具、文章或服务。',
    nextStep: '如果最高风险指向报价，先回报价初筛；如果指向取舍，再看预算诊断。',
  },
  {
    title: '¥39 报价自查指南',
    status: '低价指南',
    price: '¥39',
    time: '自学 1-2 小时',
    href: '/pricing/baojia-guide',
    cta: '看 ¥39 指南',
    problem: '你想自己系统检查报价、合同、增项、付款节点和质保条款。',
    freeGain: '用清单把该问的问题问完整，把口头承诺尽量落到文字里。',
    nextStep: '看完仍然拿不准，再进入人工快审或签约前决策包。',
  },
]

const supportSections = [
  {
    title: '施工和材料辅助',
    label: '后置工具',
    desc: '这些工具只帮你把数量、口径和现场节点问清楚，不判断这份报价能不能签。',
    stageHref: '/start/build',
    stageLabel: '看施工阶段',
    tools: [
      {
        title: '单位换算工具',
        status: '已上线',
        price: '免费',
        time: '1-3 分钟',
        href: '/tools/unit-converter',
        cta: '换算单位',
        problem: '报价里 ㎡、米、延米、坪、单方混在一起，越看越乱。',
        freeGain: '先把单位口径对齐，再回报价单看工程量和单价。',
      },
      {
        title: '瓷砖计算器',
        status: '已上线',
        price: '免费',
        time: '3-5 分钟',
        href: '/tools/tile-calculator',
        cta: '算瓷砖',
        problem: '准备买砖，但不知道片数、箱数和损耗该怎么估。',
        freeGain: '拿结果去问商家同批次、补货、退换和损耗规则。',
      },
      {
        title: '乳胶漆计算器',
        status: '已上线',
        price: '免费',
        time: '3-5 分钟',
        href: '/tools/paint-calculator',
        cta: '算乳胶漆',
        problem: '墙面面积、涂布率和桶数对不上，担心买少或买多。',
        freeGain: '先估底漆、面漆用量，再看基层处理和产品说明有没有写清。',
      },
      {
        title: '验收节点向导',
        status: '已上线',
        price: '免费',
        time: '5-10 分钟',
        href: '/tools/inspection-guide',
        cta: '生成清单',
        problem: '快到水电、防水、泥工或安装节点，不知道该看什么、拍什么。',
        freeGain: '生成检查项、拍照点和可复制清单，现场看完再付下一笔款。',
      },
    ],
  },
  {
    title: 'AI 和内容延伸',
    label: '非主路径',
    desc: '这部分主要给同行和内容创作者。AI 是辅助层，用来整理信息和提高效率，不抢装修判断的主线。',
    stageHref: '/ai',
    stageLabel: '看 AI 实践',
    tools: [
      {
        title: 'AI 场景生成器',
        status: '已上线',
        price: '免费',
        time: '3-10 分钟',
        href: '/tools/prompts',
        cta: '生成场景',
        problem: '想用 AI，但不知道先从客户沟通、资料整理还是内容选题开始。',
        freeGain: '拿到一段可复制的提示词和一份执行清单。',
      },
      {
        title: '内容诊断大脑',
        status: '已上线',
        price: '免费',
        time: '6-12 分钟',
        href: '/tools/content-brain',
        cta: '诊断内容',
        problem: '内容写完了，但不确定选题、标题和后续产品入口是否清楚。',
        freeGain: '得到五维诊断、标题方向和分发拆条建议。',
      },
      {
        title: '创作工作台 (md → 公众号)',
        status: '已上线',
        price: '免费',
        time: '按文章长度',
        href: '/tools/md2wechat',
        cta: '打开工作台',
        problem: 'Markdown 写完了，但发公众号前还要反复处理排版。',
        freeGain: '生成可复制到公众号后台的排版结果。',
      },
    ],
  },
]

const allTools = [primaryTool, ...decisionTools, ...supportSections.flatMap((section) => section.tools)]

export default function ToolsPage() {
  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: '签约前装修判断工具工作台',
            url: 'https://zenoaihome.com/tools',
            description: '签约前报价、预算、材料和验收判断工具入口。',
            inLanguage: 'zh-CN',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: '工具列表',
            itemListElement: allTools.map((tool, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: tool.title,
              url: `https://zenoaihome.com${tool.href}`,
            })),
          },
        ]}
      />

      <PageHero
        label="签约前判断工具"
        title="先做报价初筛，再看预算和辅助工具"
        subtitle="工具页的主线不是大而全，而是帮准备签约的业主先看清报价边界。预算、算量、验收和 AI 都是辅助入口。"
        size="content"
      />

      <section className="bg-surface-warm">
        <Container size="content" className="py-8">
          <div className="grid gap-6 lg:grid-cols-[0.58fr_0.42fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone">主入口 / 签约前报价风险初筛</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">装修签字前，先确认报价有没有说清楚。</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">{primaryTool.problem}</p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">{primaryTool.gain}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <CTA href={primaryTool.href} label={primaryTool.cta} variant="primary" />
                <CTA href="/resources#sign-before-contract" label="先看签约前资料" variant="secondary" />
              </div>
            </div>
            <div className="border border-border bg-canvas p-5">
              <div className="flex flex-wrap gap-2 text-[0.68rem] font-semibold uppercase tracking-widest">
                <span className="text-stone">{primaryTool.status}</span>
                <span className="text-ink-faint">{primaryTool.price}</span>
                <span className="text-ink-faint">{primaryTool.time}</span>
              </div>
              <div className="mt-4 grid gap-3 text-sm">
                {[
                  ['先看', '漏项、模糊项、增项口子、付款节点。'],
                  ['再问', '把最该追问的问题整理成清单。'],
                  ['再决定', '需要自己继续看，还是进入人工快审。'],
                ].map(([title, body]) => (
                  <div key={title} className="border border-border bg-surface p-4">
                    <p className="font-semibold text-ink">{title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-muted">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container size="content" className="py-section">
        <section className="mb-12">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone">按你现在的情况进入</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickRoutes.map((route) => (
              <Link
                key={route.situation}
                href={route.href}
                className={`group flex flex-col border p-5 transition-colors duration-150 hover:border-stone hover:bg-surface-warm ${
                  route.primary ? 'border-stone bg-surface-warm' : 'border-border bg-surface'
                }`}
              >
                <p className="text-sm font-semibold leading-snug text-ink">{route.situation}</p>
                <p className="mt-2 text-sm text-stone">{route.action} →</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12 border border-border bg-surface-warm p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.36fr_0.64fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone">为什么这样排</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">先处理签约前会影响结果的判断，再处理辅助计算。</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['主线只有一条', '普通业主最先要看的，是这份报价现在能不能继续谈、还能不能签。'],
                ['预算是辅助', '简约够住、舒适耐用、精致改善，只是帮你先看钱怎么分。'],
                ['AI 不抢主叙事', 'AI 可以整理信息和生成清单，但最后仍然回到人的判断和边界。'],
              ].map(([title, body]) => (
                <div key={title} className="border border-border bg-canvas p-5">
                  <p className="text-sm font-semibold text-ink">{title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-ink-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-5 border-l-2 border-stone/40 pl-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">签约前辅助判断</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              这组工具解决“钱怎么分、为什么会超、哪些问题要写清”。它们服务报价判断，不替代报价判断。
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {decisionTools.map((tool) => (
              <article
                key={tool.title}
                className="flex flex-col border border-border bg-surface p-6 transition-all duration-150 hover:border-stone/70 hover:shadow-[0_18px_46px_rgba(42,39,35,0.07)]"
              >
                <div className="flex flex-wrap gap-2 text-[0.68rem] font-semibold uppercase tracking-widest">
                  <span className="text-stone">{tool.status}</span>
                  <span className="text-ink-faint">{tool.price}</span>
                  <span className="text-ink-faint">{tool.time}</span>
                </div>
                <h2 className="mt-3 text-lg font-semibold text-ink">{tool.title}</h2>
                <dl className="mt-4 grid gap-4 text-sm">
                  <div>
                    <dt className="font-semibold text-ink">你现在的问题</dt>
                    <dd className="mt-1 leading-relaxed text-ink-muted">{tool.problem}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-ink">先拿到什么</dt>
                    <dd className="mt-1 leading-relaxed text-ink-muted">{tool.freeGain}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-ink">下一步</dt>
                    <dd className="mt-1 leading-relaxed text-ink-muted">{tool.nextStep}</dd>
                  </div>
                </dl>
                <Link
                  href={tool.href}
                  className="mt-6 inline-flex h-10 w-fit items-center bg-stone px-4 text-sm font-semibold text-white transition-colors hover:bg-stone/90"
                >
                  {tool.cta}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <div className="space-y-12">
          {supportSections.map((section) => (
            <section key={section.title}>
              <div className="mb-5 flex flex-col gap-2 border-l-2 border-stone/40 pl-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-stone">{section.label}</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">{section.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{section.desc}</p>
                </div>
                <Link
                  href={section.stageHref}
                  className="shrink-0 text-xs font-semibold text-stone hover:underline underline-offset-2"
                >
                  {section.stageLabel} -&gt;
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {section.tools.map((tool) => (
                  <Link
                    key={tool.title}
                    href={tool.href}
                    className="border border-border bg-surface p-4 transition-colors hover:border-stone hover:bg-surface-warm"
                  >
                    <div className="flex flex-wrap gap-2 text-[0.65rem] font-semibold uppercase tracking-widest">
                      <span className="text-stone">{tool.status}</span>
                      <span className="text-ink-faint">{tool.price}</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-ink">{tool.title}</p>
                    <p className="mt-2 text-xs leading-relaxed text-ink-muted">{tool.problem}</p>
                    <p className="mt-3 text-xs leading-relaxed text-ink-faint">{tool.freeGain}</p>
                    <p className="mt-3 text-xs font-semibold text-stone">{tool.cta} -&gt;</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14 grid gap-5 border border-border bg-surface-warm p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">工具之后怎么走</p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
              报价看不懂、临近签约——去装修服务。跑过一个 AI 场景想深入——去工作流咨询。还在摸问题——先拿资料。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CTA href="/services/renovation" label="我是业主，看装修服务" variant="primary" />
            <CTA href="/services/ai-workflow" label="我是同行，看 AI 咨询" variant="secondary" />
            <CTA href="/resources" label="先拿免费资料" variant="ghost" />
            <CTA href="/pricing/baojia-guide" label="看 ¥39 指南" variant="ghost" />
          </div>
        </div>
      </Container>
    </>
  )
}
