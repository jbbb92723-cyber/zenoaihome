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

// 首页“三件事”（原“四条主线”）
// 设计取舍：从“价值观上的主线”改成“用户现在能得到什么”。
// 每条都严格对应站内一个真实可点的页面。
const pillars = [
  {
    label: '01',
    title: '看你的报价单',
    desc: '把你那张让你头大的 Excel 发我，我用一份模板逐项标出风险。',
    href: '/services#baojia-shenhe',
    cta: '看报价审核服务',
  },
  {
    label: '02',
    title: '算清楚你的预算',
    desc: '先做一次 10 分钟自测，再用我整理过的预算结构看看自己缺哪一块。',
    href: '/tools/budget-risk',
    cta: '开始预算自测',
  },
  {
    label: '03',
    title: '把 AI 接进你的真实工作',
    desc: '不是教你用哪个 AI 产品，是帮你拆出哪一步真的值得自动化。',
    href: '/services#ai-neirong-xitong-zixun',
    cta: '看 AI 工作流咨询',
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
      {/* ───── Hero：价值主张 + 转化入口 ───── */}
      <section className="py-14 sm:py-20 border-b border-border">
        <Container size="content">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-12">
            {/* 左侧：用户价值主张 */}
            <div className="flex-1 max-w-xl">
              <p className="text-[0.7rem] font-semibold tracking-[0.1em] uppercase text-stone mb-5">Zeno · 装修 16 年，现在用 AI 把判断变成工具</p>
              <h1 className="text-[1.625rem] sm:text-[1.875rem] md:text-[2.25rem] font-semibold leading-[1.3] tracking-[-0.02em] text-ink mb-5">
                你拿到的那张报价单，<br />
                很可能藏着三类容易被忽略的钱。
              </h1>
              <p className="text-[0.9375rem] text-ink-muted leading-[1.85] mb-3">
                我做了 16 年装修，看过上千张报价单。最常见的三个坑不是材料贵，
                是漏项、模糊描述、和签了字才出现的增项。
              </p>
              <p className="text-sm text-ink-muted/80 leading-relaxed mb-3">
                这个网站的目的，是让你在掉第一笔钱之前，自己就能识别出来。
              </p>
              <p className="text-sm text-stone/80 italic mb-8 h-6">
                <HeroTagline />
              </p>
              <div className="flex flex-wrap gap-3 items-center">
                <Link
                  href="/tools/budget-risk"
                  className="text-sm font-medium text-paper bg-stone px-5 py-2.5 hover:bg-stone/85 transition-colors"
                >
                  用 10 分钟做一次预算风险自测
                </Link>
                <Link
                  href="/pricing/baojia-guide"
                  className="text-sm font-medium text-stone hover:underline underline-offset-2"
                >
                  或者领取《报价避坑指南》 →
                </Link>
              </div>
            </div>

            {/* 右侧：信任凭证卡片 */}
            <div className="shrink-0 w-full md:w-[280px] border border-border bg-surface p-6">
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-4">三件可验证的事</p>
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 bg-surface-warm px-4 py-3">
                  <p className="text-xl font-semibold text-stone shrink-0">16年</p>
                  <p className="text-xs text-ink-muted">从工地学徒到独立审报价</p>
                </div>
                <div className="flex items-center gap-3 bg-surface-warm px-4 py-3">
                  <p className="text-xl font-semibold text-stone shrink-0">本地</p>
                  <p className="text-xs text-ink-muted">南宁可上门，其他城市远程</p>
                </div>
                <div className="flex items-center gap-3 bg-surface-warm px-4 py-3">
                  <p className="text-xl font-semibold text-stone shrink-0">独立</p>
                  <p className="text-xs text-ink-muted">不卖建材，不接装修公司返点</p>
                </div>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                从工地走出来的人，帮你少踩一些本可避免的坑。
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ───── 我现在能帮你做的三件事 ───── */}
      <section className="py-16 sm:py-20 border-b border-border">
        <Container>
          <SectionHeader
            label="现在能帮的"
            title="我现在能帮你做的三件事"
            subtitle="每一件都对应一个你现在就能点开、就能用的页面。不是愿景清单，是可以开始的入口。"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pillars.map((p, idx) => (
              <Link
                key={p.title}
                href={p.href}
                className={`group border p-6 sm:p-7 card-hover flex flex-col ${
                  idx === 0
                    ? 'border-stone/30 bg-stone/5'
                    : 'border-border bg-surface'
                }`}
              >
                <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-3">{p.label}</p>
                <h3 className="card-title mb-3 group-hover:text-stone transition-colors">{p.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed flex-1">{p.desc}</p>
                <span className="text-xs text-stone mt-5 group-hover:underline underline-offset-2">
                  {p.cta} →
                </span>
              </Link>
            ))}
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

      {/* ───── 装修判断工具（转化中枢入口） ───── */}
      <section className="py-16 sm:py-20 border-b border-border">
        <Container size="content">
          <SectionHeader
            label="判断工具"
            title="签合同前，先帮自己做一次体检"
            subtitle="三个现在就能用的入口。从免费自测，到 39 元指南，再到你可以直接那过来问我的问题。"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 明星产品：报价避坑指南 */}
            <Link
              href="/pricing/baojia-guide"
              className="group sm:col-span-2 border border-stone/30 bg-stone/5 p-7 sm:p-9 hover:bg-stone/10 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-2">付费 · ¥39 · 6 张检查表</p>
                  <p className="text-lg font-semibold text-ink group-hover:text-stone transition-colors">
                    《装修报价避坑完整指南》
                  </p>
                  <p className="text-sm text-ink-muted mt-2 leading-relaxed max-w-lg">
                    覆盖报价漏项、模糊描述、增项陷阱、合同条款、水电报价六张检查表。签合同前对照看一遍。
                  </p>
                </div>
                <span className="text-stone text-xl shrink-0 mt-1 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>

            <Link
              href="/tools/budget-risk"
              className="group border border-stone/30 bg-stone/5 p-5 sm:p-6 card-hover"
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-2">免费 · 10 分钟 · 不需注册</p>
              <p className="text-sm font-semibold text-ink group-hover:text-stone transition-colors">
                装修预算风险自测
              </p>
              <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
                回答 10 个问题，看看你这次装修最可能在哪里超支。
              </p>
              <p className="text-xs text-stone mt-3">开始自测 →</p>
            </Link>

            <Link
              href="/services#baojia-shenhe"
              className="group border border-border bg-surface p-5 sm:p-6 card-hover"
            >
              <p className="text-sm font-semibold text-ink group-hover:text-stone transition-colors">
                报价单审核服务
              </p>
              <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
                报价单看不明白？发我，我逐项标出风险。¥699 / 份。
              </p>
              <p className="text-xs text-stone mt-3">了解服务 →</p>
            </Link>

            <Link
              href="/blog/baojia-dan-zenme-kan"
              className="group border border-border bg-surface p-5 sm:p-6 card-hover"
            >
              <p className="text-sm font-semibold text-ink group-hover:text-stone transition-colors">
                读：报价单真正该怎么看
              </p>
              <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
                报价单里最容易被忽略的几个位置，我拆了一遍。
              </p>
              <p className="text-xs text-stone mt-3">看文章 →</p>
            </Link>

            <Link
              href="/tools/prompts"
              className="group border border-border bg-surface p-5 sm:p-6 card-hover"
            >
              <p className="text-sm font-semibold text-ink group-hover:text-stone transition-colors">
                AI 提示词体验场
              </p>
              <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
                选场景、填情况，一键生成可直接用的提示词。
              </p>
              <p className="text-xs text-stone mt-3">免费体验 →</p>
            </Link>
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
              装修只是我最熟悉的起点。我现在更关心的是：一个普通传统行业出身的人，
              能不能借助 AI、开发、内容和产品化能力，逐步摆脱重交付，帮到更多人。
            </p>
            <p className="text-sm text-ink-muted leading-relaxed mb-6">
              我的使命很简单：让装修这个行业变得更透明一点，
              让普通人在装修这件事上少踩点坑、少花点冤柉钱、住得更舒展。
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

      {/* ───── 底部转化 CTA ───── */}
      <CTASection
        title="装修前最该做的一件事：看懂你的报价单"
        description="先用 10 分钟做一次预算自测，再对照报价单过一遍。这可能是整个装修过程中性价比最高的一个晚上。"
        actions={[
          { label: '开始预算风险自测', href: '/tools/budget-risk', variant: 'primary' },
          { label: '领取报价避坑指南', href: '/pricing/baojia-guide', variant: 'secondary' },
          { label: '看看 Zeno 能帮什么', href: '/services', variant: 'ghost' },
        ]}
        bg="warm"
      />
    </>
  )
}
