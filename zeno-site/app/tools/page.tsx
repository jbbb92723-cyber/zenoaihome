import type { Metadata } from 'next'
import Image from 'next/image'
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

const ownerNeedCards = [
  {
    label: '手上有报价单',
    title: '先看报价有没有漏项和模糊口子',
    desc: '适合已经拿到报价、准备比较或快签约的人。',
    href: '/tools/quote-check',
    action: '做报价初筛',
  },
  {
    label: '只有总预算',
    title: '先拆成几份钱，不要只盯总数',
    desc: '适合预算有上限，但不知道简约、舒适、精致分别要怎么取舍的人。',
    href: '/tools/budget-structure',
    action: '拆预算分配',
  },
  {
    label: '怕越装越超',
    title: '先判断超支更像来自哪里',
    desc: '适合已经感觉钱会失控，但分不清是报价、流程还是需求太散的人。',
    href: '/tools/budget-risk',
    action: '查超预算原因',
  },
  {
    label: '快要签合同',
    title: '直接看签约前服务怎么选',
    desc: '适合报价、预算、合同和付款节点一起卡住的人。',
    href: '/services/renovation#choose',
    action: '看服务选择',
  },
]

const supportToolKeys = new Set(['单位换算工具', '瓷砖计算器', '乳胶漆计算器', '验收节点向导'])

const judgmentPath = [
  {
    price: '免费',
    title: '报价初筛',
    desc: '先知道报价里哪里没写清。',
    href: '/tools/quote-check',
  },
  {
    price: '¥39',
    title: '报价避坑指南',
    desc: '自己系统补一遍判断框架。',
    href: '/pricing/baojia-guide',
  },
  {
    price: '¥699',
    title: '报价风险快审',
    desc: '带着报价进入人工判断。',
    href: '/services/renovation#baojia-shenhe',
  },
  {
    price: '¥1499',
    title: '签约前决策包',
    desc: '报价、预算、合同一起看。',
    href: '/services/renovation#qianyue-qian-juece-bao',
  },
]

const toolGroups = [
  {
    title: '签约前判断工具',
    desc: '给普通业主用。先处理报价，再补预算、材料数量和验收节点。每个工具都要产出一个可执行结果。',
    tools: [
      {
        title: '报价初筛工具',
        status: '已上线',
        price: '免费',
        time: '8-15 分钟',
        problem: '拿到报价单后，看不出漏项、模糊项、增项口子和付款风险。',
        freeGain: '风险等级、重点追问清单、下一步服务入口。',
        nextStep: '如果结果里高风险项很多，再看报价快审或签约前决策包。',
        href: '/tools/quote-check',
        cta: '开始初筛',
      },
      {
        title: '预算分配工具',
        status: '已上线',
        price: '免费',
        time: '5-8 分钟',
        problem: '你有总预算，但不知道这个钱更像简约够住、舒适耐用，还是精致改善。',
        freeGain: '参考单方区间、预算取向判断、可复制的分配清单。',
        nextStep: '如果预算越拆越乱，再进入预算取舍诊断。',
        href: '/tools/budget-structure',
        cta: '拆预算',
      },
      {
        title: '超预算原因自测',
        status: '已上线',
        price: '免费',
        time: '5-8 分钟',
        problem: '你感觉钱会失控，但分不清到底是报价没说清、流程没控住，还是需求太散。',
        freeGain: '四类风险排序、对应文章、资料和服务建议。',
        nextStep: '按最高风险项回到报价、预算取舍或签约前服务。',
        href: '/tools/budget-risk',
        cta: '查原因',
      },
      {
        title: '单位换算工具',
        status: '已上线',
        price: '免费',
        time: '1-3 分钟',
        problem: '报价里的㎡、米、延米、坪和单方混在一起，越看越晕。',
        freeGain: '常用单位换算结果和报价理解提醒。',
        nextStep: '换算后再回报价单，看数量和单价是否说得清。',
        href: '/tools/unit-converter',
        cta: '换算单位',
      },
      {
        title: '瓷砖计算器',
        status: '已上线',
        price: '免费',
        time: '3-5 分钟',
        problem: '准备买砖，但不知道片数、箱数和损耗该怎么估。',
        freeGain: '建议购买片数、箱数、损耗说明。',
        nextStep: '拿结果去和商家报价核对，别只听一个总价。',
        href: '/tools/tile-calculator',
        cta: '算瓷砖',
      },
      {
        title: '乳胶漆计算器',
        status: '已上线',
        price: '免费',
        time: '3-5 分钟',
        problem: '墙面面积、涂布率和桶数对不上，担心买少或买多。',
        freeGain: '底漆、面漆升数、桶数和采购提醒。',
        nextStep: '拿结果对照施工方和商家的用量说明。',
        href: '/tools/paint-calculator',
        cta: '算乳胶漆',
      },
      {
        title: '验收节点向导',
        status: '已上线',
        price: '免费',
        time: '5-10 分钟',
        problem: '快到水电、防水、泥工或安装节点，不知道该看什么、拍什么。',
        freeGain: '检查项、拍照点、高风险信号、可复制清单。',
        nextStep: '把清单发给家人或施工方，现场按节点留证。',
        href: '/tools/inspection-guide',
        cta: '生成清单',
      },
    ],
  },
  {
    title: 'AI 实践工具',
    desc: '给传统行业人、同行和内容创作者用。它是延伸能力，不抢装修判断这条主线。',
    tools: [
      {
        title: 'AI 场景生成器',
        status: '已上线',
        price: '免费',
        time: '3-10 分钟',
        problem: '你知道 AI 有用，但不知道该从客户沟通、资料整理还是内容选题切入。',
        freeGain: '可直接复制到 Claude / ChatGPT 的提示词和执行清单。',
        nextStep: '跑完一个真实场景后，再看 AI 工作流咨询。',
        href: '/tools/prompts',
        cta: '生成场景',
      },
      {
        title: '内容诊断大脑',
        status: '已上线',
        price: '免费',
        time: '6-12 分钟',
        problem: '你准备发内容，但不知道选题、标题、表达和站内承接有没有问题。',
        freeGain: '五维诊断、标题方向、分发拆条、站内产品或资料承接入口。',
        nextStep: '如果内容要变成产品线索，再进入 AI 内容诊断或咨询。',
        href: '/tools/content-brain',
        cta: '诊断内容',
      },
      {
        title: '创作工作台',
        status: '已上线',
        price: '免费',
        time: '按文章长度',
        problem: 'Markdown 写完了，但发公众号前还要反复处理排版。',
        freeGain: '可复制粘贴到公众号后台的排版结果。',
        nextStep: '把文章沉淀成资料、案例或低价产品。',
        href: '/tools/md2wechat',
        cta: '打开工作台',
      },
    ],
  },
]

const routes = [
  { audience: '装修业主', situation: '手上有报价单', action: '先做报价初筛', href: '/tools/quote-check' },
  { audience: '装修业主', situation: '只有一个总预算', action: '先拆预算分配', href: '/tools/budget-structure' },
  { audience: '装修业主', situation: '怕越装越超', action: '先查超支原因', href: '/tools/budget-risk' },
  { audience: '装修业主', situation: '准备买材料', action: '先算数量和单位', href: '/tools/tile-calculator' },
  { audience: '装修业主', situation: '准备验收', action: '生成节点清单', href: '/tools/inspection-guide' },
]

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
            itemListElement: toolGroups.flatMap((group) => group.tools).map((tool, index) => ({
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
        title="先看报价风险，再补预算、材料和验收"
        subtitle="业主先处理签约前最容易后悔的点：报价有没有漏、预算有没有挤、后面会不会增项。AI 工具只在它能帮上忙的时候出现。"
        note="主线是装修签约前判断，延伸是 AI。先把当前问题看清，再决定下一步。"
        size="content"
      />

      <Container size="content" className="py-section">
        <section className="mb-12 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">签约前主路径</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">免费初筛 → ¥39 指南 → ¥699 快审 → ¥1499 决策包</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {judgmentPath.map((item) => (
              <Link key={item.title} href={item.href} className="border border-border bg-surface p-5 transition-colors hover:border-stone hover:bg-surface-warm">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone">{item.price}</p>
                <h3 className="mt-2 text-sm font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12 grid gap-6 lg:grid-cols-[0.42fr_0.58fr]">
          <div className="overflow-hidden border border-border bg-surface">
            <div className="relative aspect-[16/10] border-b border-border bg-stone-pale/30">
              <Image
                src="/images/resources/quote-checklist-preview.svg"
                alt="报价审核清单预览"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 440px"
              />
            </div>
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone">先看材料，不先看概念</p>
              <h2 className="mt-3 text-xl font-semibold leading-snug text-ink">这个页面只帮你决定下一步用哪个工具。</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                如果你已经有报价单，就别先刷文章。先把报价风险跑一遍，再根据结果进入清单、指南或人工服务。
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {ownerNeedCards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className="group flex min-h-[13rem] flex-col border border-border bg-surface p-5 transition-all duration-150 hover:-translate-y-1 hover:border-stone hover:bg-surface-warm hover:shadow-[0_16px_40px_rgba(42,39,35,0.08)]"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-stone">{card.label}</p>
                <h2 className="mt-3 text-lg font-semibold leading-snug text-ink">{card.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{card.desc}</p>
                <span className="mt-auto pt-5 text-sm font-semibold text-stone">{card.action} -&gt;</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">其他入口</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">如果你现在不是临近签约，而是预算、材料或施工节点问题，从这里切入。</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {routes.map((route) => (
              <Link
                key={`${route.audience}-${route.situation}`}
                href={route.href}
                className="group border border-border bg-surface p-5 transition-all duration-150 hover:-translate-y-1 hover:border-stone hover:bg-surface-warm hover:shadow-[0_16px_40px_rgba(42,39,35,0.08)]"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-stone">{route.audience}</p>
                <p className="mt-3 text-sm font-semibold leading-snug text-ink">{route.situation}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted group-hover:text-stone">{route.action}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12 border border-border bg-surface-warm p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.36fr_0.64fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone">为什么这样排</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">先处理签字前会后悔的点，再处理辅助计算。</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['业主先避错', '先看签字前会后悔的点：报价没写清、预算没缓冲、节点没留证。'],
                ['同行先验证', '先拿一个真实工作场景跑 AI，不从抽象课程和工具清单开始。'],
                ['看不懂再付费', '免费工具先给结果，付费服务只处理工具解决不了的判断。'],
              ].map(([title, body]) => (
                <div key={title} className="border border-border bg-canvas p-5">
                  <p className="text-sm font-semibold text-ink">{title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-ink-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="space-y-12">
          {toolGroups.map((group) => {
            const primaryTools = group.tools.filter((tool) => !supportToolKeys.has(tool.title))
            const supportTools = group.tools.filter((tool) => supportToolKeys.has(tool.title))

            return (
              <section key={group.title}>
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-stone">{group.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{group.desc}</p>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  {primaryTools.map((tool) => (
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
                          <dt className="font-semibold text-ink">免费先拿到</dt>
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

                {supportTools.length > 0 && (
                  <div className="mt-6 border border-border bg-surface-warm p-5 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-stone">辅助计算和施工节点</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">这些工具不负责决定签不签，只帮你把数量、单位和现场节点看清楚。</p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {supportTools.map((tool) => (
                        <Link key={tool.title} href={tool.href} className="border border-border bg-canvas p-4 transition-colors hover:border-stone hover:bg-surface">
                          <p className="text-sm font-semibold text-ink">{tool.title}</p>
                          <p className="mt-2 text-xs leading-relaxed text-ink-muted">{tool.problem}</p>
                          <p className="mt-3 text-xs font-semibold text-stone">{tool.cta} -&gt;</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )
          })}
        </div>

        <div className="mt-14 grid gap-5 border border-border bg-surface-warm p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">工具之后怎么走</p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
              业主看不懂报价或临近签约，去装修服务；同行已经跑过一个 AI 场景，去 AI 工作流咨询；还在摸问题，就先拿资料和低价指南。
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
