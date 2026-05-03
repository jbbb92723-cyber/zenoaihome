import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import StructuredData from '@/components/StructuredData'
import { getArticleBySlug } from '@/data/articles'

type StartPath = {
  slug: string
  title: string
  kicker: string
  problems: string[]
  articleSlugs: string[]
  tool: { label: string; href: string; note: string }
  pack: { label: string; href: string; note: string }
  whenToContact: string[]
  service: { label: string; href: string }
  cta: { label: string; href: string }
}

export const metadata: Metadata = {
  title: '第一次来，不知道看哪里？从这里开始',
  description:
    '第一次来 zenoaihome.com，不用先研究栏目。按你当前的问题选择路径：看报价单、控预算、盯验收、真实居住，或把 AI 接进传统工作。',
  alternates: {
    canonical: 'https://zenoaihome.com/start',
  },
}

const paths: StartPath[] = [
  {
    slug: 'quote',
    title: '我正在看报价单',
    kicker: '先把没写清楚的地方揪出来，再决定签不签。',
    problems: [
      '总价差不多，但不知道差在哪。',
      '担心漏项、模糊描述和后续增项。',
      '一周内可能要签合同，没时间自己反复比对。',
    ],
    articleSlugs: ['baojia-dan-zenme-kan', 'zhuangxiu-yusuan-weishenme-zongchao', 'article-03-04'],
    tool: {
      label: '先做预算风险自测',
      href: '/tools/budget-risk',
      note: '先定位你是漏项风险、增项风险还是预算结构风险，再回头看报价会更快。',
    },
    pack: {
      label: '《装修报价避坑完整指南》',
      href: '/pricing/baojia-guide',
      note: '如果你想先自己过一遍清单，再决定要不要找我，这一份最合适。',
    },
    whenToContact: [
      '你一周内就要签约。',
      '两份以上报价都像“差不多”，但你分不清风险差异。',
      '你已经看出几处不对劲，但不会追问和改条款。',
    ],
    service: { label: '报价单审核服务', href: '/services#baojia-shenhe' },
    cta: { label: '先走报价单这条路', href: '/blog/baojia-dan-zenme-kan' },
  },
  {
    slug: 'budget',
    title: '我怕装修超预算',
    kicker: '先把钱按结构拆开，再谈总数够不够。',
    problems: [
      '有一个总预算，但不知道怎么分。',
      '担心开工后一路加钱，最后只能硬扛。',
      '家里人意见不一致，不知道先保什么。',
    ],
    articleSlugs: ['zhuangxiu-yusuan-weishenme-zongchao', 'shuidian-gongcheng-zongchao-yusuan', 'baojia-dan-zenme-kan'],
    tool: {
      label: '先做预算风险自测',
      href: '/tools/budget-risk',
      note: '10 分钟先看你属于哪类超支风险，再决定下一步是补资料还是找我。',
    },
    pack: {
      label: '先看 39 元报价避坑指南',
      href: '/pricing/baojia-guide',
      note: '如果你已经开始收报价，这份资料能帮你把预算口子先堵一轮。',
    },
    whenToContact: [
      '预算改了三轮，还是越改越乱。',
      '你和家人对哪些该省、哪些不能省，分歧很大。',
      '你已经拿到报价，但看不出后面会不会失控。',
    ],
    service: { label: '装修预算咨询', href: '/services#yusuan-zixun' },
    cta: { label: '先把预算结构理清', href: '/blog/zhuangxiu-yusuan-weishenme-zongchao' },
  },
  {
    slug: 'construction',
    title: '我已经开工了',
    kicker: '别等竣工才总验，节点验收比事后返工便宜得多。',
    problems: [
      '工地已经在跑，但你不知道每个节点该看什么。',
      '担心“做完才发现问题”，又怕自己不会留证据。',
      '现场都是口头沟通，后面容易扯皮。',
    ],
    articleSlugs: ['zhuangxiu-hou-hue-de-wu-jian', '03-cong-gongdi-kan-shijie', 'article-03-02'],
    tool: {
      label: '先去工具库找验收清单',
      href: '/resources#yanshou-qingdan',
      note: '先按施工节点做一轮自查，不要等全部做完再回头看。',
    },
    pack: {
      label: '更适合先领验收清单',
      href: '/resources#yanshou-qingdan',
      note: '如果你已经开工，当前最有用的不是再看概念，而是把节点检查跑起来。',
    },
    whenToContact: [
      '你已经碰到连续增项，但判断不了是否合理。',
      '关键节点返工风险高，现场沟通已经卡住。',
      '你想让第三方视角帮你理顺下一步顺序。',
    ],
    service: { label: '先看服务边界', href: '/services' },
    cta: { label: '先按节点盯施工', href: '/resources#yanshou-qingdan' },
  },
  {
    slug: 'living',
    title: '我想住得舒服，不想装成样板间',
    kicker: '先把真实生活排在前面，再谈风格表达。',
    problems: [
      '方案看着好看，但总觉得不像自己会住的家。',
      '怕被网图和样板间审美带偏。',
      '预算有限，不知道该把钱保在什么地方。',
    ],
    articleSlugs: ['02-jia-bu-shi-yangban-jian', 'article-01-03', 'article-01-07'],
    tool: {
      label: '先去拿实住派自查表',
      href: '/resources#shizhu-pai-zijian-biao',
      note: '先把你真正的生活需求写清，再谈效果图和风格参考。',
    },
    pack: {
      label: '如果已到签约阶段，再配报价指南',
      href: '/pricing/baojia-guide',
      note: '把实住需求落进预算和条款里，比只看灵感图更有用。',
    },
    whenToContact: [
      '方案越来越像样板间，但越来越不像你。',
      '你在美观、维护和预算之间反复拉扯。',
      '你需要把居住优先级变成可执行选择。',
    ],
    service: { label: '真实居住派装修服务', href: '/services#shi-zhu-pai-zhuangxiu' },
    cta: { label: '先按真实生活做决定', href: '/topics#shi-zhu-pai-zhuangxiu' },
  },
  {
    slug: 'ai',
    title: '我是传统行业人，想用 AI 把经验变成内容和工具',
    kicker: '不是先学花活，是先把一个真实场景跑通。',
    problems: [
      '会跟 AI 聊，但落不到每天工作里。',
      '内容产出靠状态，不稳定。',
      '经验很多，但没有沉淀成模板、工具和长期资产。',
    ],
    articleSlugs: ['04-wei-shenme-wo-kaishi-renzheng-xue-ai', 'article-05-06', 'article-05-02'],
    tool: {
      label: '先去提示词体验场',
      href: '/tools/prompts',
      note: '先把一个真实任务跑通，再决定要不要搭系统。',
    },
    pack: {
      label: '先去工具库看 AI 工作流提示词包',
      href: '/resources#ai-neirong-gongzuoliu-tishici-bao',
      note: '如果你已经在写、在发、在复盘，这包会比通用提示词更有用。',
    },
    whenToContact: [
      '你已经在做内容，但三周内仍跑不出稳定流程。',
      '你想把经验沉淀成模板、工具或服务路径。',
      '你需要一条从内容到资产的可执行路线。',
    ],
    service: { label: 'AI 内容系统咨询', href: '/services#ai-neirong-xitong-zixun' },
    cta: { label: '先跑通一个 AI 场景', href: '/topics#chuantong-hangyeren-zenme-yong-ai' },
  },
]

export default function StartPage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: '从这里开始',
          url: 'https://zenoaihome.com/start',
          description: '第一次来 zenoaihome.com 的问题导向路径页。',
          inLanguage: 'zh-CN',
        }}
      />

      <PageHero
        label="从这里开始"
        title="第一次来，不知道看哪里？从这里开始"
        subtitle="你不用先研究栏目。先选你现在最卡的那个问题，我给你一条从文章、工具、资料到服务的最短路径。"
        note="先自己判断，再决定要不要花钱。能先自己走通的，不急着找我。"
        size="content"
      />

      <Container size="content" className="py-section">
        <section className="mb-14 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="page-label mb-3">怎么用这页</p>
          <ol className="space-y-2 text-sm text-ink-muted leading-relaxed">
            <li>1. 先选你现在最像的那条路径。</li>
            <li>2. 先读 3 篇，再用 1 个免费工具。</li>
            <li>3. 做完还拿不准，再看资料或找我。</li>
          </ol>
        </section>

        <div className="space-y-8">
          {paths.map((path) => {
            const articles = path.articleSlugs
              .map((slug) => getArticleBySlug(slug))
              .filter((article): article is NonNullable<typeof article> => Boolean(article))

            return (
              <section key={path.slug} id={path.slug} className="border border-border overflow-hidden scroll-mt-20">
                <div className="border-b border-border bg-surface-warm px-6 py-5 sm:px-8 sm:py-6">
                  <p className="text-[0.7rem] font-semibold tracking-[0.12em] uppercase text-stone mb-2">路径 {path.slug}</p>
                  <h2 className="section-heading mb-2">{path.title}</h2>
                  <p className="text-sm text-ink-muted leading-relaxed max-w-2xl">{path.kicker}</p>
                </div>

                <div className="px-6 py-6 sm:px-8 sm:py-8 space-y-8">
                  <div>
                    <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">你现在大概率卡在这几件事</p>
                    <ul className="space-y-2">
                      {path.problems.map((problem) => (
                        <li key={problem} className="flex items-start gap-2 text-sm text-ink leading-relaxed">
                          <span className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-stone-light" />
                          <span>{problem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                    <div className="border border-border bg-surface p-5 sm:p-6">
                      <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">先读这 3 篇</p>
                      <div className="space-y-2">
                        {articles.map((article, index) => (
                          <Link
                            key={article.id}
                            href={`/blog/${article.slug}`}
                            className="group flex items-start justify-between gap-3 border-b border-border pb-2 last:border-0 last:pb-0"
                          >
                            <div>
                              <p className="text-[0.7rem] uppercase tracking-widest text-ink-faint mb-1">{String(index + 1).padStart(2, '0')}</p>
                              <p className="text-sm text-ink group-hover:text-stone transition-colors">{article.title}</p>
                            </div>
                            <span className="text-stone text-xs shrink-0 mt-1">→</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="border border-stone/30 bg-stone/5 p-5 sm:p-6">
                        <p className="text-xs text-stone font-semibold uppercase tracking-widest mb-2">先用这个免费入口</p>
                        <p className="text-base font-semibold text-ink mb-2">{path.tool.label}</p>
                        <p className="text-sm text-ink-muted leading-relaxed mb-4">{path.tool.note}</p>
                        <CTA href={path.tool.href} label="先做这个" variant="primary" />
                      </div>

                      <div className="border border-border bg-surface p-5 sm:p-6">
                        <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">更适合的资料</p>
                        <p className="text-sm font-semibold text-ink mb-2">{path.pack.label}</p>
                        <p className="text-sm text-ink-muted leading-relaxed mb-4">{path.pack.note}</p>
                        <CTA href={path.pack.href} label="去看资料" variant="secondary" />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
                    <div>
                      <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-3">什么情况下可以直接找我</p>
                      <ul className="space-y-2">
                        {path.whenToContact.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-ink-muted leading-relaxed">
                            <span className="text-stone shrink-0 mt-1">+</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border border-border bg-surface-warm p-5 sm:p-6 lg:w-[280px]">
                      <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">对应服务</p>
                      <p className="text-sm font-semibold text-ink mb-4">{path.service.label}</p>
                      <div className="flex flex-col gap-3">
                        <CTA href={path.service.href} label="查看服务" variant="secondary" />
                        <Link href={path.cta.href} className="text-sm text-stone hover:underline underline-offset-2">
                          {path.cta.label} →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )
          })}
        </div>

        <section className="mt-14 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="page-label mb-3">如果你还拿不准</p>
          <h2 className="section-heading mb-3">先做一次免费自测，再回来选路</h2>
          <p className="text-sm text-ink-muted leading-relaxed max-w-2xl mb-5">
            预算风险自测现在是最完整的工具入口。做完结果页会把你往文章、资料和人工服务继续分流，适合作为第一次来的起点。
          </p>
          <div className="flex flex-wrap gap-3">
            <CTA href="/tools/budget-risk" label="免费做预算风险自测" variant="primary" />
            <CTA href="/tools" label="按问题找工具" variant="secondary" />
            <CTA href="/services" label="先看服务边界" variant="ghost" />
          </div>
        </section>
      </Container>
    </>
  )
}