import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getResourceBySlug, resources, type Resource } from '@/data/resources'
import PageHero from '@/components/PageHero'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: '资源页：按问题拿对应资料、清单和入口',
  description:
    '别再把所有资源摊开让你自己猜。这里按签约前、施工中、真实居住和传统行业 AI 四类问题给入口。',
  alternates: {
    canonical: 'https://zenoaihome.com/resources',
  },
}

const tagColors: Record<string, string> = {
  装修: 'bg-stone-pale text-stone border border-stone/20',
  居住: 'bg-stone-pale/60 text-stone border border-stone/20',
  AI:   'bg-[#EAE8F0] text-[#5B4E8A] border border-[#5B4E8A]/20',
}

type ActionItem = {
  href: string
  label: string
  variant: 'primary' | 'secondary' | 'ghost'
}

const problemEntryCards = [
  {
    label: '签约前',
    title: '报价和预算还没理顺，先从这里开始',
    description: '如果你还没签合同，最重要的是先把报价风险和预算结构分开看。',
    href: '#sign-before-contract',
  },
  {
    label: '施工中',
    title: '已经开工了，每个节点到底盯什么',
    description: '验收不是竣工时一次性做的事，而是每个施工阶段都要有检查口。',
    href: '#construction-checkpoints',
  },
  {
    label: '真实居住',
    title: '住进去后不顺手，回到需求本身',
    description: '很多“风格问题”其实是需求没说清，或者顺序从一开始就反了。',
    href: '#living-beyond-completion',
  },
  {
    label: '传统行业 + AI',
    title: '想用 AI，但不想先掉进工具堆',
    description: '先拿一个真实任务来，再决定提示词、流程骨架和服务哪个更适合你。',
    href: '#traditional-industry-ai',
  },
]

const sampleMediaCards = [
  {
    title: '报价审核清单示意',
    description: '你会先看到风险点长什么样，再决定要不要进入人工判断。',
    href: '#baojia-shenhe-qingdan',
    image: '/images/resources/quote-checklist-preview.svg',
    imageAlt: '报价审核清单示意图',
  },
  {
    title: '施工节点验收示意',
    description: '不是“完工后统一看”，而是每个节点都有对应检查口。',
    href: '#construction-checkpoints',
    image: '/images/resources/acceptance-checkpoints.svg',
    imageAlt: '施工节点验收示意图',
  },
  {
    title: 'AI 工作流骨架示意',
    description: '先拆任务，再接工具，而不是上来就问哪个 AI 最强。',
    href: '#traditional-industry-ai',
    image: '/images/resources/explainer-storyboard.svg',
    imageAlt: 'AI 工作流骨架示意图',
  },
]

const resourceFaqs = [
  {
    question: '为什么这里不再把全部资源一股脑渲染出来？',
    answer:
      '因为资源页不是仓库列表，而是分流页。你现在在哪个阶段、手里有什么材料，决定你应该先看哪一张清单、哪一个模板，而不是把所有下载项从头刷到尾。',
  },
  {
    question: '真实居住为什么单独成一段？',
    answer:
      '因为真实居住不是装修的附属标签。它对应的是需求判断和生活方式排序，如果继续和全部资源混在一起，入口会失真。',
  },
  {
    question: '传统行业人来这页，应该先拿资料还是先找服务？',
    answer:
      '如果你还没跑过真实任务，先用提示词体验场和工作流提示词包。如果你已经知道卡在哪个环节，再去看 AI 工作流咨询。',
  },
]

const resourceActions: Record<string, ActionItem[]> = {
  'zhuangxiu-yusuan-moban': [
    { href: '/services/renovation#yusuan-zixun', label: '预算还是理不清，直接看预算咨询', variant: 'secondary' },
    { href: '/blog/zhuangxiu-yusuan-weishenme-zongchao', label: '先看预算为什么总超', variant: 'ghost' },
  ],
  'baojia-shenhe-qingdan': [
    { href: '/services/renovation#baojia-shenhe', label: '已经临近签约，直接看报价审核', variant: 'secondary' },
    { href: '/blog/03-cong-gongdi-kan-shijie', label: '先看工地里的判断逻辑', variant: 'ghost' },
  ],
  'yanshou-qingdan': [
    { href: '/blog/03-cong-gongdi-kan-shijie', label: '先看工地节点为什么会出问题', variant: 'secondary' },
    { href: '/services/renovation', label: '需要有人帮你判断时机，再看装修服务', variant: 'ghost' },
  ],
  'shizhu-pai-zijian-biao': [
    { href: '/services/renovation#shi-zhu-pai-zhuangxiu', label: '需求没理顺，直接看真实居住服务', variant: 'secondary' },
    { href: '/blog/02-jia-bu-shi-yangban-jian', label: '先看家不是样板间', variant: 'ghost' },
  ],
  'ai-neirong-gongzuoliu-tishici-bao': [
    { href: '/services/ai-workflow', label: '已经有真实场景，直接看 AI 工作流咨询', variant: 'secondary' },
    { href: '/tools/prompts', label: '先去提示词体验场跑一轮', variant: 'ghost' },
  ],
}

function ResourceDetailCard({ resource }: { resource: Resource }) {
  const actions = resourceActions[resource.slug] ?? []

  return (
    <article id={resource.slug} className="border border-border bg-surface scroll-mt-24 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative aspect-[16/10] border-b border-border lg:border-b-0 lg:border-r border-border bg-stone-pale/20">
          {resource.previewImage ? (
            <Image
              src={resource.previewImage}
              alt={resource.previewAlt || resource.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 360px"
            />
          ) : null}
        </div>
        <div className="p-6 sm:p-7">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`text-xs px-2 py-0.5 font-medium ${tagColors[resource.tag] ?? 'bg-stone-pale text-stone border border-stone/20'}`}>
              {resource.tag}
            </span>
            <span className="text-xs text-ink-faint uppercase tracking-widest">对应一个具体问题</span>
          </div>
          <h3 className="text-xl font-semibold text-ink mb-2 leading-snug">{resource.title}</h3>
          <p className="text-sm text-stone mb-4">{resource.subtitle}</p>
          <p className="text-sm text-ink-muted leading-relaxed mb-5">{resource.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">适合谁</p>
              <p className="text-sm text-ink leading-relaxed">{resource.forWho}</p>
            </div>
            <div>
              <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">它解决什么</p>
              <p className="text-sm text-ink leading-relaxed">{resource.solves}</p>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">怎么用</p>
            <ol className="space-y-2">
              {resource.howToUse.map((step, index) => (
                <li key={step} className="flex items-start gap-2">
                  <span className="text-stone text-xs font-semibold shrink-0 mt-0.5 w-4">{index + 1}.</span>
                  <span className="text-sm text-ink-muted leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="border border-border bg-surface-warm px-4 py-3 mb-5">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-1">领取方式</p>
            <p className="text-sm text-ink-muted leading-relaxed">{resource.howToGet}</p>
          </div>

          <div className="border-t border-border pt-4 flex flex-wrap gap-3 items-center">
            {actions.map((action) => (
              <CTA key={action.label} href={action.href} label={action.label} variant={action.variant} />
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

export default function ResourcesPage() {
  const preContractResources = ['baojia-shenhe-qingdan', 'zhuangxiu-yusuan-moban']
    .map((slug) => getResourceBySlug(slug))
    .filter((resource): resource is Resource => Boolean(resource))

  const acceptanceResource = getResourceBySlug('yanshou-qingdan')
  const livingResource = getResourceBySlug('shizhu-pai-zijian-biao')
  const aiResource = getResourceBySlug('ai-neirong-gongzuoliu-tishici-bao')

  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: '资源页',
            url: 'https://zenoaihome.com/resources',
            description: '按问题分流的资料与工具入口页。',
            inLanguage: 'zh-CN',
            hasPart: resources.map((resource) => ({
              '@type': 'CreativeWork',
              name: resource.title,
              description: resource.description,
            })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: '资源页问题入口',
            itemListElement: problemEntryCards.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.title,
              url: `https://zenoaihome.com/resources${item.href}`,
            })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: resourceFaqs.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          },
        ]}
      />

      <PageHero
        label="资源页"
        title="按你现在的问题，拿对应的清单、模板和入口"
        subtitle="这页不再把所有资源摊开给你自己猜。先分清你是签约前、施工中、真实居住，还是传统行业里想把 AI 接进工作，再看对应入口。"
        note="资料是辅助判断，不是代替判断。真正有效的顺序，是先找到问题，再拿对一张清单或一个模板。"
        size="content"
      />

      <Container size="content" className="py-section">
        <section className="mb-14">
          <div className="mb-6">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">先看可验证样例</p>
            <h2 className="text-lg font-semibold text-ink">你会先看到什么</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {sampleMediaCards.map((item) => (
              <Link key={item.title} href={item.href} className="group border border-border bg-surface overflow-hidden card-hover">
                <div className="relative aspect-[16/10] border-b border-border bg-stone-pale/20">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 320px"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-ink mb-2 group-hover:text-stone transition-colors">{item.title}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <div className="mb-6">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">按问题走</p>
            <h2 className="text-lg font-semibold text-ink">先确认你在哪个阶段</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {problemEntryCards.map((item) => (
              <Link key={item.title} href={item.href} className="group border border-border bg-surface p-5 card-hover">
                <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-3">{item.label}</p>
                <h3 className="text-base font-semibold text-ink mb-2 group-hover:text-stone transition-colors">{item.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section id="sign-before-contract" className="mb-14 scroll-mt-24">
          <div className="mb-6 max-w-2xl">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">阶段一</p>
            <h2 className="text-lg font-semibold text-ink">还没签合同，先看什么？</h2>
            <p className="text-sm text-ink-muted mt-2 leading-relaxed">
              先分成两件事看。报价风险是报价风险，预算结构是预算结构。混在一起，问题只会越看越乱。
            </p>
          </div>
          <div className="space-y-6">
            {preContractResources.map((resource) => (
              <ResourceDetailCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>

        <section id="construction-checkpoints" className="mb-14 scroll-mt-24">
          <div className="mb-6 max-w-2xl">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">阶段二</p>
            <h2 className="text-lg font-semibold text-ink">已经开工了，先盯哪几个节点？</h2>
            <p className="text-sm text-ink-muted mt-2 leading-relaxed">
              这里不再放静态说明块。你现在就能点进去拿验收清单，也能先看一篇工地观察文章，把“为什么要现在看”理解清楚。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
            <Link href="#yanshou-qingdan" className="group border border-border bg-surface p-5 card-hover">
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-3">明确入口一</p>
              <h3 className="text-base font-semibold text-ink mb-2 group-hover:text-stone transition-colors">直接拿施工节点验收清单</h3>
              <p className="text-sm text-ink-muted leading-relaxed">适合已经进入水电、泥工、木作、油漆任一阶段的人。每个节点都该当场留证据。</p>
            </Link>
            <Link href="/blog/03-cong-gongdi-kan-shijie" className="group border border-border bg-surface p-5 card-hover">
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-3">明确入口二</p>
              <h3 className="text-base font-semibold text-ink mb-2 group-hover:text-stone transition-colors">先看工地里的判断逻辑</h3>
              <p className="text-sm text-ink-muted leading-relaxed">如果你还不明白为什么节点要前置检查，先看这篇，再回头用清单会更有感觉。</p>
            </Link>
          </div>

          {acceptanceResource ? <ResourceDetailCard resource={acceptanceResource} /> : null}
        </section>

        <section id="living-beyond-completion" className="mb-14 scroll-mt-24">
          <div className="mb-6 max-w-2xl">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">阶段三</p>
            <h2 className="text-lg font-semibold text-ink">已经开始想“住进去到底顺不顺手”</h2>
            <p className="text-sm text-ink-muted mt-2 leading-relaxed">
              这一段只保留真实居住相关内容，不再把全部资源都堆进来。因为这里讨论的是需求、生活习惯和长期使用，不是所有下载项的大杂烩。
            </p>
          </div>
          <div className="space-y-6">
            {livingResource ? <ResourceDetailCard resource={livingResource} /> : null}
            <div className="border border-border bg-surface-warm p-6 sm:p-7">
              <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">继续往前</p>
              <h3 className="text-base font-semibold text-ink mb-2">如果你发现问题不是“不会装”，而是“需求顺序反了”</h3>
              <p className="text-sm text-ink-muted leading-relaxed mb-4">
                先看真实居住相关文章，再决定要不要进入装修判断服务。很多风格争论，本质上都是生活方式排序没说清。
              </p>
              <div className="flex flex-wrap gap-3">
                <CTA href="/blog/02-jia-bu-shi-yangban-jian" label="先看家不是样板间" variant="secondary" />
                <CTA href="/services/renovation#shi-zhu-pai-zhuangxiu" label="直接看真实居住服务" variant="ghost" />
              </div>
            </div>
          </div>
        </section>

        <section id="traditional-industry-ai" className="mb-14 scroll-mt-24">
          <div className="mb-6 max-w-2xl">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">阶段四</p>
            <h2 className="text-lg font-semibold text-ink">传统行业人，怎么先把 AI 接进真实工作？</h2>
            <p className="text-sm text-ink-muted mt-2 leading-relaxed">
              先跑一个真实场景，再决定用工具、拿提示词包还是做咨询。不要一上来就把自己扔进一堆产品对比里。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
            <Link href="/tools/prompts" className="group border border-border bg-surface p-5 card-hover">
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-3">先跑一轮</p>
              <h3 className="text-base font-semibold text-ink mb-2 group-hover:text-stone transition-colors">AI 提示词体验场</h3>
              <p className="text-sm text-ink-muted leading-relaxed">适合还在试探阶段的人。先拿一个真实任务试，不要先讨论抽象方法论。</p>
            </Link>
            <Link href="/services/ai-workflow" className="group border border-border bg-surface p-5 card-hover">
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-3">准备好了再进</p>
              <h3 className="text-base font-semibold text-ink mb-2 group-hover:text-stone transition-colors">AI 工作流咨询</h3>
              <p className="text-sm text-ink-muted leading-relaxed">适合已经知道自己卡在内容、沟通、整理或轻交付某一环的人。</p>
            </Link>
          </div>

          {aiResource ? <ResourceDetailCard resource={aiResource} /> : null}
        </section>

        <section className="border border-border bg-surface-warm p-6 sm:p-8 mb-14">
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">常见问题</p>
          <div className="space-y-5">
            {resourceFaqs.map((item) => (
              <div key={item.question}>
                <h2 className="text-base font-semibold text-ink mb-2">{item.question}</h2>
                <p className="text-sm text-ink-muted leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="pt-8 border-t border-border flex flex-wrap gap-3">
          <p className="w-full text-sm text-ink-muted mb-2 leading-relaxed">
            如果你已经知道自己属于哪类问题，就别继续横向刷完整页了。直接进对应资料、文章或服务，效率更高。
          </p>
          <CTA href="/services" label="看总服务页" variant="secondary" />
          <CTA href="/topics" label="看专题" variant="ghost" />
          <CTA href="/blog" label="看文章" variant="ghost" />
        </div>
      </Container>
    </>
  )
}
