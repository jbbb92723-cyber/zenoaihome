import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import StructuredData from '@/components/StructuredData'
import { getRecentArticles } from '@/data/articles'

export const metadata: Metadata = {
  title: '看懂报价、预算、合同和施工节点',
  description:
    'ZenoAIHome 先帮普通装修业主分清报价、预算、合同、施工节点和居住场景问题，再决定看文章、拿清单、做自测还是找人一起看。AI 只作为第二层辅助叙事出现。',
  alternates: {
    canonical: 'https://zenoaihome.com/',
  },
}

const problemCards = [
  {
    label: '报价单',
    title: '先看漏项、模糊项和另计项',
    description: '报价贵不贵不是第一问题，有没有说清才是。先把后面要追问的地方揪出来。',
    href: '/resources#baojia-shenhe-qingdan',
  },
  {
    label: '预算表',
    title: '先把总数拆成能追踪的结构',
    description: '装修超预算，不只是钱的问题，往往是顺序的问题。先把硬装、采购和预备金分开。',
    href: '/tools/budget-risk',
  },
  {
    label: '合同',
    title: '先盯后面最容易扯皮的话',
    description: '增项怎么确认、验收标准怎么落字、尾款条件怎么卡住，都别等签完再想。',
    href: '/start',
  },
  {
    label: '施工节点',
    title: '已经开工了，就按节点留证',
    description: '水电、防水、泥工、木作、油漆和竣工验收，每一步都先看什么、拍什么、留什么。',
    href: '/resources#construction-checkpoints',
  },
]

const heroMetrics = [
  {
    value: '16',
    label: '年现场经验',
  },
  {
    value: '4',
    label: '个主问题入口',
  },
  {
    value: '3',
    label: '种第一步抓手',
  },
]

const grabberCards = [
  {
    label: '先看文章',
    title: '把一个问题看透，再决定要不要找人',
    description: '最近更新优先放能代表判断力的文章，不按流量排序。',
    href: '/blog',
  },
  {
    label: '先拿清单',
    title: '拿当前最痛的那份资料，不要一次全拿',
    description: '报价审核清单、预算模板、节点验收资料，先挑能立刻对照的那一个。',
    href: '/resources',
  },
  {
    label: '先做自测',
    title: '已经乱成一团，就先把风险分型',
    description: '预算风险自测会先帮你分清，是报价没说清、预算失控、流程没控住，还是居住需求没厘清。',
    href: '/tools/budget-risk',
  },
]

const proofCards = [
  {
    title: '报价不是一句“贵不贵”',
    description: '报价单里一行没写清的另计项，后面就可能变成增项。先看证据，不先听口号。',
    href: '/resources#baojia-shenhe-qingdan',
  },
  {
    title: '节点不是做完再看',
    description: '水电、防水、泥工、木作、油漆、竣工验收，每一步都先留照片和书面确认。',
    href: '/resources#construction-checkpoints',
  },
  {
    title: '家不是样板间',
    description: '入住后的使用习惯、做饭频率、收纳和动线，会反过来决定你前面怎么选。',
    href: '/topics',
  },
]

const productStages = [
  {
    label: '免费入口',
    title: '文章、清单、自测',
    description: '先看清自己卡在哪，再决定下一步。',
    href: '/start',
    ctaLabel: '先按问题进入',
  },
  {
    label: '39 元',
    title: '签约前不踩坑指南',
    description: '低价入门产品，把报价、预算、合同、增项这四件事先串起来。',
    note: '产品说明页后续补齐，这一轮先把它保留在首页主路径里。',
  },
  {
    label: '399 元',
    title: '预算咨询',
    description: '预算结构没拆清时用，不是继续猜总价，而是先把钱按结构理顺。',
    href: '/services/renovation',
    ctaLabel: '看服务说明',
  },
  {
    label: '699 元',
    title: '报价审核',
    description: '手里已经有具体报价单时用。不是帮你砍价，是帮你看懂自己到底在为什么付钱。',
    href: '/services/renovation',
    ctaLabel: '看服务说明',
  },
  {
    label: '1499 元',
    title: '签约前决策包',
    description: '规划中 / 内测中。适合临近签约、想把报价、合同、预算和关键追问一起看的人。',
    href: '/contact',
    ctaLabel: '可预约沟通',
    status: '规划中 / 内测中',
  },
  {
    label: '本地服务',
    title: '只给高度匹配且本地范围内的人',
    description: '它不是首页第一目标，而是前面几步都走到位以后，才开放的深度帮法。',
    href: '/services/renovation',
    ctaLabel: '先看是否匹配',
  },
]

const secondaryTracks = [
  {
    label: '居住与判断',
    title: '家不是样板间，是人长期生活的容器',
    description: '旧首页里关于居住、美学、判断和长期使用的那部分不删，只是往第二层去，让装修问题继续站在前面。',
    href: '/topics',
  },
  {
    label: 'AI 第二层',
    title: 'AI 不是替你判断，是帮你把判断放大',
    description: '我会继续讲 AI 落地装修全流程，也会讲它怎么帮业主梳理预算、报价和验收问题，但这不是首页第一主角。',
    href: '/services/ai-workflow',
  },
]

const faqItems = [
  {
    question: '这是不是传统装修公司官网？',
    answer:
      '不是。这里先帮你看懂报价、预算、合同、施工节点和居住场景，再决定你要不要继续往服务走。',
  },
  {
    question: '看完首页能不能直接得到一个万能结论？',
    answer:
      '不能。不同城市价格不同，不同预算档位、工艺做法、现场条件和合同约定都不同。首页先帮你分清风险重心，具体判断还要看你手里的材料。',
  },
  {
    question: 'AI 在这里到底起什么作用？',
    answer:
      'AI 只做第二层辅助。它可以帮业主梳理预算、报价和验收问题，也可以帮传统行业人整理资料和流程，但不会替代现场判断和沟通责任。',
  },
  {
    question: '我现在第一步该去哪？',
    answer:
      '还没分清问题，就先去按问题进入；已经乱成一团，就先做预算风险自测；手里已经有具体材料，再去看服务路径。',
  },
]

export default function HomePage() {
  const recentArticles = getRecentArticles(3)

  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Zeno AI Home',
            url: 'https://zenoaihome.com/',
            description:
              '先帮普通装修业主分清报价、预算、合同、施工节点和居住场景问题，再决定看文章、拿清单、做自测还是找人一起看。',
            inLanguage: 'zh-CN',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: '首页问题入口',
            itemListElement: problemCards.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.title,
              url: `https://zenoaihome.com${item.href}`,
            })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map((item) => ({
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

      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface-warm via-surface to-surface py-14 sm:py-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(90deg,rgba(191,165,137,0.12),rgba(191,165,137,0))]" />
        <div className="pointer-events-none absolute inset-y-0 left-[8%] hidden w-px bg-border/70 lg:block" />
        <div className="pointer-events-none absolute right-0 top-10 hidden h-48 w-48 rounded-full bg-stone-pale/50 blur-3xl lg:block" />
        <Container size="layout">
          <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <p className="text-[0.7rem] font-semibold tracking-[0.1em] uppercase text-stone mb-5">ZenoAIHome</p>
              <h1 className="hero-title mb-5 max-w-3xl">
                报价单看不清，预算总怕超，
                <br className="hidden sm:block" />
                合同和施工节点不知道盯哪儿，这里先帮你把问题看清。
              </h1>
              <p className="text-base text-ink-muted leading-[1.85] max-w-2xl mb-4">
                我做了 16 年装修，见过报价漏项、预算失控、合同扯皮、节点返工，也见过住进去才发现家并不顺手。这里先不让你听大词，先帮你分清：你现在该看什么、先查什么、什么时候该自己判断，什么时候该找人一起看。
              </p>
              <p className="text-sm text-ink-muted leading-relaxed max-w-2xl mb-3">
                如果你是普通业主，先从报价、预算、合同、验收、居住场景这几件具体事进来。AI、内容系统和更长远的职业实验都在后面，它们不抢你现在最急的事。
              </p>
              <p className="text-sm text-ink-faint leading-relaxed max-w-2xl mb-8">
                不同城市价格不同，不同预算档位、工艺做法、现场条件和合同约定也不同。这里先帮你把风险重心找出来，不给你一句万能答案。
              </p>
              <div className="flex flex-wrap gap-3">
                <CTA href="/start" label="按问题进入" variant="primary" />
                <CTA href="/tools/budget-risk" label="先做预算风险自测" variant="secondary" />
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3 max-w-2xl">
                {heroMetrics.map((item) => (
                  <div key={item.label} className="border border-border bg-surface/90 px-4 py-4 shadow-[0_8px_24px_rgba(30,25,20,0.04)]">
                    <p className="text-[1.45rem] font-semibold leading-none text-ink mb-2">{item.value}</p>
                    <p className="text-[0.72rem] font-medium tracking-[0.05em] text-ink-muted">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-border bg-surface shadow-[0_16px_40px_rgba(30,25,20,0.06)] overflow-hidden">
              <div className="border-b border-border bg-surface-warm px-6 py-5">
                <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">先别急着全站乱看</p>
                <h2 className="text-lg font-semibold text-ink">先对上你手里最急的那类问题</h2>
              </div>
              <div className="p-6">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-stone mb-4">先看证据，不先听口号</p>
                <div className="space-y-3">
                  {problemCards.map((item, index) => (
                    <Link key={item.title} href={item.href} className="group flex items-start gap-4 border-b border-border pb-3 last:border-b-0 last:pb-0">
                      <span className="text-[0.78rem] font-semibold tracking-[0.08em] text-stone">0{index + 1}</span>
                      <div className="flex-1">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-ink-faint mb-1">{item.label}</p>
                        <p className="text-sm font-semibold text-ink mb-1 group-hover:text-stone transition-colors">{item.title}</p>
                        <p className="text-sm text-ink-muted leading-relaxed">{item.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-5 border border-dashed border-border bg-surface-warm/80 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-2">居住场景补充</p>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    住进去怕不顺手，就回到家里真正怎么住：做饭频率、收纳习惯、老人小孩、居家办公，通常比风格词更早决定结果。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="pathways" className="border-b border-border py-16 sm:py-20 scroll-mt-20">
        <Container size="layout">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:items-start">
            <div>
              <p className="page-label mb-3">按问题进入</p>
              <h2 className="section-heading">别把所有问题混在一起。装修最怕的不是麻烦，是顺序乱了。</h2>
              <p className="text-sm text-ink-muted mt-3 leading-relaxed">
                你先认清自己卡的是哪一类问题，后面每一步才不会白花钱。
              </p>
              <div className="mt-6 border-l-2 border-stone pl-4">
                <p className="text-sm text-ink leading-relaxed">
                  报价贵不贵不是第一问题，有没有说清才是。预算超不超，也常常不是钱不够，而是顺序先乱了。
                </p>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
                {problemCards.map((item, index) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={`group border border-border bg-surface p-5 card-hover flex flex-col shadow-[0_10px_28px_rgba(30,25,20,0.03)] ${index === 0 ? 'md:-translate-y-2' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone">{item.label}</p>
                      <span className="text-[0.7rem] font-semibold tracking-[0.08em] text-ink-faint">0{index + 1}</span>
                    </div>
                    <h3 className="text-base font-semibold text-ink mb-3 leading-snug group-hover:text-stone transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-ink-muted leading-relaxed flex-1">{item.description}</p>
                    <span className="text-xs text-stone mt-5">进入对应入口 →</span>
                  </Link>
                ))}
              </div>
              <div className="mt-4 border border-dashed border-border bg-surface-warm px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-2">第五类问题</p>
                <p className="text-sm text-ink-muted leading-relaxed">
                  如果你担心的是住进去以后不顺手，就先回到居住场景：家里真正怎么住、入住后的使用习惯、做饭和收纳频率、老人小孩和居家办公怎么分配。
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 sm:py-20 bg-surface-warm">
        <Container size="layout">
          <div className="mb-10 max-w-3xl">
            <p className="page-label mb-3">三个抓手</p>
            <h2 className="section-heading">先别急着找人，先拿一个抓手。</h2>
            <p className="text-sm text-ink-muted mt-2 leading-relaxed">
              先把问题缩小，后面每一步都省钱。
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {grabberCards.map((item, index) => (
              <Link
                key={item.title}
                href={item.href}
                className={`group border border-border bg-surface p-6 sm:p-7 card-hover shadow-[0_12px_32px_rgba(30,25,20,0.04)] ${index === 1 ? 'lg:translate-y-4' : ''} ${index === 2 ? 'lg:translate-y-8' : ''}`}
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone">{item.label}</p>
                  <span className="text-[0.72rem] font-semibold tracking-[0.08em] text-ink-faint">0{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-ink mb-3 leading-snug group-hover:text-stone transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">{item.description}</p>
                <span className="text-sm text-stone mt-5 inline-block">先走这一步 →</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <Container size="layout">
          <div className="mb-10 max-w-3xl">
            <p className="page-label mb-3">为什么值得继续看</p>
            <h2 className="section-heading">我不是给你讲概念，我是在把工地上见过的事，翻成你能用的判断。</h2>
            <p className="text-sm text-ink-muted mt-2 leading-relaxed">
              不是网上整合，也不是标准装修公司话术。这里先把最容易出事的地方指出来，再告诉你下一步怎么接上。
            </p>
          </div>
          <div className="mb-6 border border-border bg-surface-warm p-6 sm:p-7 shadow-[0_12px_28px_rgba(30,25,20,0.03)]">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-stone mb-3">现场判断卡</p>
            <p className="text-base text-ink leading-relaxed">
              这些判断来自真实现场：报价单里一行没写清的另计项，预算表里那笔没单独留出来的预备金，合同里一句以后最容易扯皮的话，水电、防水、泥工、吊顶、竣工验收每个节点该怎么留证。
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {proofCards.map((item) => (
              <Link key={item.title} href={item.href} className="group border border-border bg-surface p-6 card-hover shadow-[0_10px_24px_rgba(30,25,20,0.03)]">
                <h3 className="text-base font-semibold text-ink mb-3 group-hover:text-stone transition-colors">{item.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{item.description}</p>
                <span className="text-xs text-stone mt-5 inline-block">看对应内容 →</span>
              </Link>
            ))}
          </div>
          <div className="mt-8 max-w-4xl border-l-2 border-stone pl-5">
            <p className="text-sm text-ink-muted leading-relaxed">
              我不会给你一句万能答案。不同城市、不同预算、不同工艺、不同合同约定，判断都会变。但我会先把最容易出事的地方指出来，让你少走弯路。
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 sm:py-20 bg-surface-warm">
        <Container size="layout">
          <div className="mb-10 max-w-3xl">
            <p className="page-label mb-3">具体决策阶段</p>
            <h2 className="section-heading">问题成熟度不一样，抓手也不一样。</h2>
            <p className="text-sm text-ink-muted mt-2 leading-relaxed">
              还在摸清问题，就先免费；已经有材料，就别再靠猜。
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {productStages.map((item, index) => (
              <div
                key={item.title}
                className={`border p-5 flex flex-col shadow-[0_10px_24px_rgba(30,25,20,0.03)] ${item.status ? 'border-dashed border-stone bg-surface-warm/80' : 'border-border bg-surface'} ${index === 0 || index === 1 ? 'lg:-translate-y-1' : ''}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone">{item.label}</p>
                  {item.status ? (
                    <span className="text-[0.65rem] font-semibold tracking-[0.08em] uppercase text-ink-faint">{item.status}</span>
                  ) : null}
                </div>
                <h3 className="text-lg font-semibold text-ink mb-3 leading-snug">{item.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{item.description}</p>
                {item.note ? <p className="text-xs text-ink-faint leading-relaxed mt-3">{item.note}</p> : null}
                {item.href ? (
                  <Link href={item.href} className="text-sm text-stone mt-5 inline-block hover:underline underline-offset-2">
                    {item.ctaLabel}
                  </Link>
                ) : (
                  <span className="text-sm text-stone mt-5 inline-block">后续补正式说明页</span>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <Container size="layout">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <p className="page-label mb-3">第二层叙事</p>
              <h2 className="section-heading mb-4">这站不只讲装修，但装修永远在前面。</h2>
              <p className="text-base text-ink leading-relaxed mb-4">
                我不是来做一个标准官网的。旧首页里关于居住、美学、人性、长期主义和 AI 的那部分不删，只是往后放。
              </p>
              <p className="text-sm text-ink-muted leading-relaxed mb-4">
                先把报价、预算、合同、施工节点和居住场景这些前台问题拆开，再慢慢展开后面的判断、生活方式和 AI 工作流，这样主线才不会乱。
              </p>
              <p className="text-sm text-ink-muted leading-relaxed">
                工具可以提高效率，不能替代价值观。AI 不是替代你，是放大你的判断和经验。
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {secondaryTracks.map((item) => (
                <Link key={item.title} href={item.href} className="group border border-border bg-surface p-6 card-hover shadow-[0_10px_24px_rgba(30,25,20,0.03)]">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-3">{item.label}</p>
                  <h3 className="text-lg font-semibold text-ink mb-3 leading-snug group-hover:text-stone transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <Container size="content">
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <p className="page-label mb-3">最近写的</p>
              <h2 className="section-heading">先看几篇最能代表判断路径的文章</h2>
              <p className="text-sm text-ink-muted mt-2">优先放能代表判断力的文章，不按流量排序。</p>
            </div>
            <Link href="/blog" className="text-sm text-stone hover:underline underline-offset-2 shrink-0 pb-1">
              全部文章 →
            </Link>
          </div>
          <div>
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container size="layout">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.62fr_0.38fr] lg:items-start">
            <div>
              <div className="mb-10 max-w-3xl">
                <p className="page-label mb-3">FAQ</p>
                <h2 className="section-heading">你在首页最容易卡住的，是这几件事。</h2>
                <p className="text-sm text-ink-muted mt-2 leading-relaxed">
                  把问题先讲透，后面走文章、工具还是服务都更稳。
                </p>
              </div>
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={item.question} className="border border-border bg-surface p-6 shadow-[0_10px_24px_rgba(30,25,20,0.03)]">
                    <div className="flex items-start gap-4">
                      <span className="text-[0.7rem] font-semibold tracking-[0.08em] text-stone">0{index + 1}</span>
                      <div>
                        <h3 className="text-base font-semibold text-ink mb-3">{item.question}</h3>
                        <p className="text-sm text-ink-muted leading-relaxed">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-border bg-surface-warm p-7 sm:p-9 shadow-[0_16px_36px_rgba(30,25,20,0.05)] lg:sticky lg:top-24">
              <p className="page-label mb-3">下一步行动</p>
              <h2 className="section-heading mb-4">你现在最该做的，不是把所有东西都看一遍。</h2>
              <p className="text-base text-ink leading-relaxed mb-4">
                先确认自己在哪个阶段，再走一步。还没分清问题，就先回问题入口；已经乱成一团，就先做自测；手里已有材料，再去看服务路径。
              </p>
              <p className="text-sm text-ink-muted leading-relaxed mb-6">
                这里不是把所有资料摊给你自己猜，而是先帮你找入口。
              </p>
              <div className="space-y-3">
                <CTA href="/start" label="回问题入口" variant="primary" />
                <CTA href="/tools/budget-risk" label="先做预算风险自测" variant="secondary" />
                <CTA href="/services/renovation" label="看装修判断服务" variant="ghost" />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
