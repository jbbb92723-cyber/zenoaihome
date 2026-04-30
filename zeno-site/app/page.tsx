import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'
import NoteCard from '@/components/NoteCard'
import Container from '@/components/Container'
import HeroTagline from '@/components/HeroTagline'
import SectionHeader from '@/components/SectionHeader'
import CTASection from '@/components/CTASection'
import { getArticleBySlug } from '@/data/articles'
import { getLatestPublicNotes } from '@/lib/notes'

// 首页手动推荐文章（覆盖五大板块，按方向编排，不按时间排序）
// 顺序：一人公司 → 一人公司 → AI 实践 → 一人公司 → 工具与产品 → 真实居住 → 真实居住 → 判断与生活
const featuredSlugs = [
  '01-wo-wei-shenme-bu-xiang-zhi-zuo-jiaoren-zhuangxiu', // 我为什么不想只做一个教人装修的人
  'zeno-from-renovation-to-opc',                          // 从装修现场到一人公司
  '04-wei-shenme-wo-kaishi-renzheng-xue-ai',              // 为什么我开始认真学 AI
  'article-05-09',                                        // 网站母站：为什么你需要一个自己的阵地
  'article-05-02',                                        // 内容资产，才是传统行业人的第二生产线
  'zhuangxiu-yusuan-weishenme-zongchao',                  // 装修预算为什么总超？
  'baojia-dan-zenme-kan',                                 // 报价单真正该怎么看
  '05-changqi-zhuyi-bushi-rennai',                        // 长期主义不是忍耐
]

// 四条主线：真实居住 / AI 实践 / 工具与产品 / 一人公司实验
const pillars = [
  {
    label: '真实居住',
    title: '装修是入口，不是终局',
    desc: '从预算、报价、材料、施工和真实居住出发，先把一个复杂传统行业的问题拆清楚。',
    href: '/topics#shi-zhu-pai-zhuangxiu',
    cta: '看真实居住专题',
  },
  {
    label: 'AI 实践',
    title: '把 AI 接进真实工作流',
    desc: '不是追热点，而是用 AI 辅助内容生产、资料整理、工具开发、客户沟通和个人系统搭建。',
    href: '/topics#chuantong-hangyeren-zenme-yong-ai',
    cta: '了解 AI 实践',
  },
  {
    label: '工具与产品',
    title: '把经验做成可复用资产',
    desc: '预算表、报价清单、提示词、在线工具、数字产品——把过去只能靠人讲的经验，变成可以使用和交易的东西。',
    href: '/resources',
    cta: '查看工具与资料',
  },
  {
    label: '一人公司实验',
    title: '用更少人力，建立更自由的事业',
    desc: '我正在验证：一个传统行业出身的人，如何用 AI、开发、内容和自动化，逐步摆脱重交付。',
    href: '/topics#changqi-zhuyi-shenghuo',
    cta: '了解一人公司实验',
  },
]

// 正在做的四个项目（带状态）
const nowProjects = [
  {
    title: 'Zeno AI Home 网站系统',
    desc: '把内容、资料、工具、服务和用户路径连接起来。',
    status: '持续迭代中',
    highlight: true,
  },
  {
    title: 'AI 内容与提示词系统',
    desc: '用 AI 辅助选题、写作、排版、复盘和多平台分发。',
    status: '已上线',
    highlight: false,
  },
  {
    title: '工具与资料库',
    desc: '从预算模板、报价清单，到在线工具和数字产品。',
    status: '持续更新',
    highlight: false,
  },
  {
    title: '一人公司实践',
    desc: '记录如何用 AI、开发和自动化，把个人经验变成长期资产。',
    status: '进行中',
    highlight: true,
  },
]

// 首页包含数据库查询（最近思考模块），必须动态渲染
// 若设为 static，Vercel 构建时会在构建环境尝试连接数据库，可能因网络限制失败
export const dynamic = 'force-dynamic'

// 首页需要查询数据库，必须是 async server component
export default async function HomePage() {
  const recentArticles = featuredSlugs
    .map((slug) => getArticleBySlug(slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))

  // 最近 3 条公开笔记，数据库查询失败时降级为空数组（不影响首页其他内容）
  const recentNotes = await getLatestPublicNotes(3).catch(() => [])

  return (
    <>
      {/* ───── Hero：战略定位表达 ───── */}
      <section className="py-14 sm:py-20 border-b border-border">
        <Container size="content">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-12">
            {/* 左侧：核心叙事 */}
            <div className="flex-1 max-w-xl">
              <p className="text-[0.7rem] font-semibold tracking-[0.1em] uppercase text-stone mb-5">Zeno · 赞诺</p>
              <h1 className="text-[1.625rem] sm:text-[1.875rem] md:text-[2.25rem] font-semibold leading-[1.3] tracking-[-0.02em] text-ink mb-5">
                从熟悉的行业出发，<br />
                用 AI、产品和内容，搭建更自由的个人事业系统。
              </h1>
              <p className="text-[0.9375rem] text-ink-muted leading-[1.85] mb-3">
                装修是我进入 AI 时代的现实入口。
                我正在把一线经验、内容创作、工具开发和数字产品，逐步沉淀成可复用、可交易、可持续的个人资产。
              </p>
              <p className="text-sm text-ink-muted/80 leading-relaxed mb-3">
                不追概念，不做空谈。先从真实问题开始，把经验变成工具，把内容变成资产，把服务变成系统。
              </p>
              <p className="text-sm text-stone/80 italic mb-8 h-6">
                <HeroTagline />
              </p>
              <div className="flex flex-wrap gap-3 items-center">
                <Link
                  href="#now"
                  className="text-sm font-medium text-paper bg-stone px-5 py-2.5 hover:bg-stone/85 transition-colors"
                >
                  看我正在做什么
                </Link>
                <Link
                  href="/resources"
                  className="text-sm font-medium text-stone border border-stone/40 px-5 py-2.5 hover:bg-stone-pale transition-colors"
                >
                  进入工具与资料库
                </Link>
              </div>
            </div>

            {/* 右侧：人格化信息卡片 */}
            <div className="shrink-0 w-full md:w-[260px] border border-border bg-surface p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-stone-pale flex items-center justify-center text-stone font-semibold text-lg">
                  Z
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">Zeno · 赞诺</p>
                  <p className="text-xs text-ink-muted">现实派生活建造者</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-surface-warm px-3 py-2">
                  <p className="text-lg font-semibold text-stone">16</p>
                  <p className="text-[0.65rem] text-ink-muted">年行业经验</p>
                </div>
                <div className="bg-surface-warm px-3 py-2">
                  <p className="text-lg font-semibold text-stone">30+</p>
                  <p className="text-[0.65rem] text-ink-muted">篇深度文章</p>
                </div>
                <div className="bg-surface-warm px-3 py-2">
                  <p className="text-lg font-semibold text-stone">5</p>
                  <p className="text-[0.65rem] text-ink-muted">大内容板块</p>
                </div>
                <div className="bg-surface-warm px-3 py-2">
                  <p className="text-lg font-semibold text-stone">∞</p>
                  <p className="text-[0.65rem] text-ink-muted">长期主义</p>
                </div>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                从工地和客户沟通中走出来，现在用 AI 和产品化能力，把经验做成可复用的资产。
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ───── 四条主线（Bento Grid） ───── */}
      <section className="py-16 sm:py-20 border-b border-border">
        <Container>
          <SectionHeader
            label="四条主线"
            title="从真实经验出发，指向更自由的事业系统"
            subtitle="装修是入口，AI 是工具，产品是载体，自由是方向。"
          />
          {/* Bento: 第一行 1大+1中，第二行 2中 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 主卡片：真实居住 - 占 2 列 */}
            <Link
              href={pillars[0].href}
              className="group sm:col-span-2 lg:col-span-2 border border-stone/30 bg-stone/5 p-7 sm:p-9 card-hover flex flex-col"
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-3">{pillars[0].label}</p>
              <h3 className="text-lg sm:text-xl font-semibold text-ink mb-3 group-hover:text-stone transition-colors">{pillars[0].title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed flex-1 max-w-lg">{pillars[0].desc}</p>
              <span className="text-xs text-stone mt-5 group-hover:underline underline-offset-2">
                {pillars[0].cta} →
              </span>
            </Link>

            {/* AI 实践 */}
            <Link
              href={pillars[1].href}
              className="group border border-border bg-surface p-6 sm:p-7 card-hover flex flex-col"
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-3">{pillars[1].label}</p>
              <h3 className="card-title mb-3 group-hover:text-stone transition-colors">{pillars[1].title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed flex-1">{pillars[1].desc}</p>
              <span className="text-xs text-stone mt-5 group-hover:underline underline-offset-2">
                {pillars[1].cta} →
              </span>
            </Link>

            {/* 工具与产品 */}
            <Link
              href={pillars[2].href}
              className="group border border-border bg-surface p-6 sm:p-7 card-hover flex flex-col"
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-3">{pillars[2].label}</p>
              <h3 className="card-title mb-3 group-hover:text-stone transition-colors">{pillars[2].title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed flex-1">{pillars[2].desc}</p>
              <span className="text-xs text-stone mt-5 group-hover:underline underline-offset-2">
                {pillars[2].cta} →
              </span>
            </Link>

            {/* 一人公司实验 - 占 2 列 */}
            <Link
              href={pillars[3].href}
              className="group sm:col-span-2 border border-border bg-surface-warm p-6 sm:p-7 card-hover flex flex-col"
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-3">{pillars[3].label}</p>
              <h3 className="card-title mb-3 group-hover:text-stone transition-colors">{pillars[3].title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed flex-1 max-w-lg">{pillars[3].desc}</p>
              <span className="text-xs text-stone mt-5 group-hover:underline underline-offset-2">
                {pillars[3].cta} →
              </span>
            </Link>
          </div>
        </Container>
      </section>

      {/* ───── 我现在正在做什么 ───── */}
      <section id="now" className="py-16 sm:py-20 bg-surface-warm border-b border-border scroll-mt-14">
        <Container>
          <SectionHeader
            label="正在做"
            title="我现在正在做什么"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {nowProjects.map((p) => (
              <div
                key={p.title}
                className={`border bg-surface p-6 sm:p-7 flex flex-col ${
                  p.highlight ? 'border-stone/30' : 'border-border'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-block w-2 h-2 rounded-full ${
                    p.highlight ? 'bg-stone animate-pulse' : 'bg-ink-faint'
                  }`} />
                  <span className="text-[0.65rem] font-medium uppercase tracking-widest text-ink-faint">
                    {p.status}
                  </span>
                </div>
                <h3 className="card-title mb-3">{p.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed flex-1">{p.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ───── 为什么从装修出发 ───── */}
      <section className="py-16 sm:py-20 border-b border-border">
        <Container size="content">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-start">
            <div>
              <p className="page-label mb-3">为什么从装修出发</p>
              <h2 className="section-heading mb-5">装修行业是我的现实支点</h2>
              <div className="space-y-4 text-base text-ink leading-[1.85]">
                <p>
                  一个谈 AI、谈一人公司、谈长期主义的人，为什么入口是装修行业？
                </p>
                <p>
                  因为这是我真正待了 16 年的地方。我盯过工地、审过报价、处理过无数客户分歧。
                  传统行业的信息差、信任问题和低效协作，我不是旁观者——我是亲历者。
                </p>
                <p className="text-ink-muted text-sm">
                  所有方法论如果不从真实场景出发，都是空话。装修行业只是起点，但它让每一句话都有地基。
                </p>
              </div>
            </div>
            {/* 侧边数据条 */}
            <div className="hidden md:flex flex-col gap-3 w-[180px]">
              <div className="border border-border bg-surface-warm p-4">
                <p className="text-2xl font-semibold text-stone">16年</p>
                <p className="text-xs text-ink-muted mt-1">全流程装修实战</p>
              </div>
              <div className="border border-border bg-surface-warm p-4">
                <p className="text-2xl font-semibold text-stone">1000+</p>
                <p className="text-xs text-ink-muted mt-1">现场沟通经验</p>
              </div>
              <div className="border border-border bg-surface-warm p-4">
                <p className="text-2xl font-semibold text-stone">真实</p>
                <p className="text-xs text-ink-muted mt-1">不编造，不猜测</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ───── 最近写的 ───── */}
      <section className="py-16 sm:py-20 border-b border-border">
        <Container size="content">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="page-label mb-3">推荐阅读</p>
              <h2 className="section-heading">这几篇帮你快速了解 Zeno 在做什么</h2>
              <p className="text-sm text-ink-muted mt-2">覆盖五个方向，不按流量排序，按价值编排。</p>
            </div>
            <Link href="/blog" className="text-sm text-stone hover:underline underline-offset-2 shrink-0 ml-4 pb-1">
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

      {/* ───── 最近思考 ───── */}
      {recentNotes.length > 0 && (
        <section className="py-16 sm:py-20 bg-surface-warm border-b border-border">
          <Container size="content">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="page-label mb-3">思想资产库</p>
                <h2 className="section-heading">正在生长的判断、方法论和现场笔记</h2>
                <p className="text-sm text-ink-muted mt-2">不是鸡汤，是带着现场温度的真实思考。</p>
              </div>
              <Link href="/notes" className="text-sm text-stone hover:underline underline-offset-2 shrink-0 ml-4 pb-1">
                全部札记 →
              </Link>
            </div>
            <div>
              {recentNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ───── 为什么认真用 AI ───── */}
      <section className="py-16 sm:py-20 border-b border-border">
        <Container size="content">
          <p className="page-label mb-3">为什么认真用 AI</p>
          <h2 className="section-heading mb-5">AI 不是噱头，是让经验走得更远的工具</h2>
          <div className="space-y-4 text-base text-ink leading-[1.85]">
            <p>
              我不是技术出身的人。我从装修现场、客户沟通、报价审核和项目管理里走出来。
              传统行业真正痛的不是"不努力"，而是信息太散、沟通太慢、经验太难沉淀。
            </p>
            <p>
              所以我用 AI 编程、大模型工具和自动化工作流，不是为了炫技，
              而是把客户问题、报价判断、施工经验、内容创作和服务流程，
              整理成普通人也能使用的系统。
            </p>
          </div>
          <div className="mt-6">
            <Link href="/topics#chuantong-hangyeren-zenme-yong-ai" className="text-sm text-stone hover:underline underline-offset-2">
              看 AI 实践专题 →
            </Link>
          </div>
        </Container>
      </section>

      {/* ───── 工具与资料入口 ───── */}
      <section className="py-16 sm:py-20 border-b border-border">
        <Container size="content">
          <SectionHeader
            label="工具与资料"
            title="把经验产品化的第一批资产"
            subtitle="我只放自己用过或验证过的内容。每一个工具都在解决一个具体问题。"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: '装修预算模板', desc: '把"感觉花钱"变成"有结构地花钱"', icon: '📊' },
              { label: '报价审核清单', desc: '识别报价单里的常见模糊项和风险项', icon: '✓' },
              { label: 'AI 内容工作流提示词包', desc: '先建立方法，再让工具放大效率', icon: '⚡' },
            ].map((item) => (
              <Link
                key={item.label}
                href="/resources"
                className="group border border-border bg-surface p-5 card-hover"
              >
                <div className="text-2xl mb-3 opacity-60">{item.icon}</div>
                <p className="text-sm font-semibold text-ink group-hover:text-stone transition-colors">
                  {item.label}
                </p>
                <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">{item.desc}</p>
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/resources" className="text-sm text-stone hover:underline underline-offset-2">
              查看全部工具与资料 →
            </Link>
          </div>
        </Container>
      </section>

      {/* ───── 关于 Zeno ───── */}
      <section className="py-16 sm:py-20 border-b border-border">
        <Container size="content">
          <div className="border border-border bg-surface p-7 sm:p-9">
            <p className="page-label mb-4">关于 Zeno</p>
            <p className="text-base text-ink leading-relaxed mb-4">
              我不想把自己固定成某一种身份。装修只是我最熟悉的起点。
              我现在更关心的是：一个普通传统行业从业者，能不能借助 AI、开发、内容和产品化能力，
              逐步摆脱重交付，建立更自由、更有创造力的事业系统。
            </p>
            <p className="text-sm text-ink-muted leading-relaxed mb-6">
              所以这个网站不是装修公司官网，也不是单纯的个人博客。
              它是我把经验变成工具、把内容变成资产、把服务变成产品的长期实验场。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/about"
                className="text-sm text-stone hover:underline underline-offset-2 decoration-stone-light"
              >
                了解更多关于 Zeno →
              </Link>
              <Link
                href="/blog/zeno-from-renovation-to-opc"
                className="text-sm text-ink-muted hover:text-stone transition-colors"
              >
                从装修到一人公司 →
              </Link>
              <Link
                href="/services"
                className="text-sm text-ink-muted hover:text-stone transition-colors"
              >
                查看服务
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ───── 底部问题收集 CTA ───── */}
      <CTASection
        title="你现在最困惑的一个问题是什么？"
        description="无论是装修决策、AI 工具选择，还是一人公司的起步，欢迎告诉我。真实的问题会变成未来的内容。"
        actions={[
          { label: '联系 Zeno', href: '/contact', variant: 'primary' },
          { label: '看服务与合作', href: '/services', variant: 'secondary' },
          { label: '先看文章', href: '/blog', variant: 'ghost' },
        ]}
        bg="warm"
      />
    </>
  )
}
