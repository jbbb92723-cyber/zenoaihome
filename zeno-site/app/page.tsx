import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import StructuredData from '@/components/StructuredData'
import CTASection from '@/components/CTASection'
import { getRecentArticles } from '@/data/articles'

export const metadata: Metadata = {
  title: '签合同前，先把报价、预算和验收风险看清楚 | ZenoAIHome',
  description:
    '基于 16 年装修现场经验，帮普通业主在签字前看清报价单漏项、预算结构失控、合同条款风险和施工节点验收问题。AI 只做第二层辅助。',
  alternates: {
    canonical: 'https://zenoaihome.com/',
  },
}

/* ─────────────────────────────────────────
   数据：首屏风险标签
───────────────────────────────────────── */
const riskTags = [
  '漏项', '暂估价', '另计项', '按实结算',
  '单位异常', '重复收费', '主材未含', '增项预埋',
]

/* ─────────────────────────────────────────
   数据：四个核心入口
───────────────────────────────────────── */
const coreEntries = [
  {
    num: '01',
    label: '看报价',
    title: '报价单漏项、模糊项和另计项，先在签字前揪出来',
    scene: '柜体五金谁负责、水电按实怎么算、哪些位置后面最容易被补报价',
    href: '/resources#baojia-shenhe-qingdan',
    accent: true,
  },
  {
    num: '02',
    label: '控预算',
    title: '预算超支，往往不是钱不够，是顺序先乱了',
    scene: '硬装、采购、预备金先分区；别把家电和定制混成一笔糊涂账',
    href: '/tools/budget-risk',
    accent: false,
  },
  {
    num: '03',
    label: '审合同',
    title: '合同里最容易扯皮的，往往不是你以为的大条款',
    scene: '变更怎么确认、验收按什么算、尾款什么时候付、增项怎么落字',
    href: '/start',
    accent: false,
  },
  {
    num: '04',
    label: '做验收',
    title: '水电增项、防水验收、节点留证，别等竣工再回头翻',
    scene: '水电交底前先把点位问清、防水闭水要留全、竣工前先核对书面确认',
    href: '/resources#construction-checkpoints',
    accent: false,
  },
]

/* ─────────────────────────────────────────
   数据：现场证据占位
───────────────────────────────────────── */
const siteEvidenceSlots = [
  { id: 'evidence-1', alt: '水电改造现场——线管走向和点位标注', suggestion: '推荐拍水电开槽后的全景照，能看清线管走向和标记' },
  { id: 'evidence-2', alt: '防水验收现场——闭水试验 48 小时', suggestion: '推荐拍闭水满水后的照片，附时间水印' },
  { id: 'evidence-3', alt: '泥工铺贴现场——地砖平整度', suggestion: '推荐拍靠尺检测或阳角对缝的特写' },
  { id: 'evidence-4', alt: '吊顶接缝现场——石膏板接缝处理', suggestion: '推荐拍石膏板接缝贴绷带和找平的局部' },
  { id: 'evidence-5', alt: '竣工收口现场——门套和踢脚线收口', suggestion: '推荐拍踢脚线阴角或门套与墙面接缝特写' },
  { id: 'evidence-6', alt: '报价单局部——标注漏项和模糊项', suggestion: '推荐用脱敏报价单，标注红色风险行和备注' },
]

/* ─────────────────────────────────────────
   数据：产品路径
───────────────────────────────────────── */
const productPath = [
  {
    step: '免费',
    title: '文章、清单、预算风险自测',
    desc: '先把问题缩到能判断的范围，再决定下一步。',
    href: '/start',
    cta: '按问题进入',
  },
  {
    step: '39 元',
    title: '签约前不踩坑指南',
    desc: '把报价、预算、合同、增项这四件事先串起来看一遍。',
    href: null,
    cta: null,
  },
  {
    step: '399 元',
    title: '预算咨询',
    desc: '预算结构没拆清时用。不猜总价，先把钱按结构理顺。',
    href: '/services/renovation',
    cta: '看服务说明',
  },
  {
    step: '699 元',
    title: '报价审核',
    desc: '手里已经有具体报价单时用。不帮你砍价，帮你看清自己到底在为什么付钱。',
    href: '/services/renovation',
    cta: '看服务说明',
  },
  {
    step: '1499 元',
    title: '签约前决策包',
    desc: '内测中 / 可预约沟通。适合临签约时想把报价、合同、预算和关键追问一起梳理的人。',
    href: '/contact',
    cta: '预约沟通',
    badge: '内测中',
  },
  {
    step: '本地',
    title: '只给高度匹配且本地范围内的人',
    desc: '不是首页第一目标，前面几步走到位后才开放。',
    href: '/services/renovation',
    cta: '先看是否匹配',
  },
]

/* ─────────────────────────────────────────
   数据：AI 辅助能力
───────────────────────────────────────── */
const aiCapabilities = [
  'AI 辅助整理报价单结构和风险点',
  'AI 辅助梳理预算分区和预备金',
  'AI 辅助生成节点验收清单',
  'AI 辅助整理工地照片和沟通记录',
  'AI 辅助把现场经验沉淀成文章和工具',
]

/* ─────────────────────────────────────────
   数据：FAQ
───────────────────────────────────────── */
const faqItems = [
  {
    q: '这是装修公司官网吗？',
    a: '不是。这里先帮你看懂报价、预算、合同和施工节点风险，不做施工和材料交付。',
  },
  {
    q: '能直接给我一个万能判断吗？',
    a: '不能。不同城市价格不同，不同工艺、合同约定和现场条件都会影响结论。这里先帮你找到风险重心。',
  },
  {
    q: 'AI 在这里是什么角色？',
    a: 'AI 只做第二层辅助：帮整理信息、生成清单、梳理结构，但不替代现场判断和人工经验。',
  },
  {
    q: '你以后会卖产品吗？',
    a: '可能会。如果出现工具、课程或精选推荐，会说明推荐理由、适用场景和商业关系，不做隐形利益绑定。',
  },
]

/* ═══════════════════════════════════════════
   页面主体
═══════════════════════════════════════════ */
export default function HomePage() {
  const recentArticles = getRecentArticles(3)

  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'ZenoAIHome',
            url: 'https://zenoaihome.com/',
            description: '帮普通装修业主在签字前看清报价单、预算、合同和验收风险。',
            inLanguage: 'zh-CN',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map((item) => ({
              '@type': 'Question',
              name: item.q,
              acceptedAnswer: { '@type': 'Answer', text: item.a },
            })),
          },
        ]}
      />

      {/* ───── 首屏：非对称左文案右风险卡 ───── */}
      <section className="relative overflow-hidden border-b border-border py-16 sm:py-24 lg:py-28">
        {/* 轻装饰线 */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-stone/20 to-transparent" />
        <div className="pointer-events-none absolute left-[6%] top-0 hidden h-full w-px bg-border/50 lg:block" />

        <Container size="layout">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:gap-14">
            {/* 左：承诺 */}
            <div className="lg:pt-6">
              <p className="page-label mb-5">ZenoAIHome · 装修判断入口</p>
              <h1 className="text-[clamp(1.85rem,4.8vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
                签合同前，
                <br className="hidden sm:block" />
                先把报价、预算和
                <br className="hidden sm:block" />
                验收风险看清楚。
              </h1>
              <p className="mt-6 max-w-xl text-[1.05rem] leading-[1.9] text-ink-muted">
                基于 16 年装修现场经验，帮普通业主在签字前看懂报价单、预算表、合同条款和施工节点风险。不讲大词，先帮你把最容易出事的地方拆开。
              </p>
              <p className="mt-4 max-w-xl text-sm leading-7 text-ink-faint">
                不同城市价格不同，不同预算档位、工艺做法、施工队和合同约定都会影响判断。这里不卖万能答案，只先帮你把风险重心看清。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CTA href="/tools/budget-risk" label="免费做预算风险自测" variant="primary" />
                <CTA href="/services/renovation" label="查看报价审核服务" variant="secondary" />
              </div>
            </div>

            {/* 右：风险体检卡 */}
            <div className="relative">
              <div className="border border-border bg-surface shadow-[0_24px_60px_rgba(30,25,20,0.07)]">
                <div className="border-b border-border bg-surface-warm px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-stone">签约前风险卡</p>
                      <h2 className="mt-1 text-lg font-semibold text-ink">报价单风险体检</h2>
                    </div>
                    <span className="text-[0.65rem] font-semibold tracking-wide text-ink-faint border border-border px-2 py-1">模拟展示</span>
                  </div>
                </div>
                <div className="p-6">
                  {/* 风险标签云 */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {riskTags.map((tag) => (
                      <span key={tag} className="border border-border bg-surface-warm px-3 py-1.5 text-xs font-medium text-ink-muted">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {/* 模拟报价条目 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-dashed border-border pb-2">
                      <span className="text-sm text-ink">水电改造 — 按实结算</span>
                      <span className="text-xs font-semibold text-stone bg-stone/10 px-2 py-0.5">⚠ 未封顶</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-dashed border-border pb-2">
                      <span className="text-sm text-ink">防水 — 暂估 ¥45/㎡</span>
                      <span className="text-xs font-semibold text-stone bg-stone/10 px-2 py-0.5">⚠ 面积待定</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-dashed border-border pb-2">
                      <span className="text-sm text-ink">吊顶 — 含石膏板</span>
                      <span className="text-xs font-semibold text-stone bg-stone/10 px-2 py-0.5">⚠ 五金另计</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-ink">墙面乳胶漆 — 含两底一面</span>
                      <span className="text-xs font-semibold text-stone bg-stone/10 px-2 py-0.5">⚠ 基层另计</span>
                    </div>
                  </div>
                  <div className="mt-5 border-t border-border pt-4">
                    <p className="text-xs leading-5 text-ink-faint">
                      以上仅为风险模拟展示，实际判断需结合你手里的报价单和合同约定。
                    </p>
                  </div>
                </div>
              </div>
              {/* 轻微偏移装饰 */}
              <div className="pointer-events-none absolute -bottom-3 -right-3 h-full w-full border border-border/40 -z-10 hidden lg:block" />
            </div>
          </div>
        </Container>
      </section>

      {/* ───── 四个核心入口 ───── */}
      <section className="border-b border-border py-16 sm:py-20 lg:py-24">
        <Container size="layout">
          <div className="mb-12 max-w-2xl">
            <p className="page-label mb-3">四个核心入口</p>
            <h2 className="section-heading">别把所有风险混在一起。报价、预算、合同、验收，先一类一类看。</h2>
            <p className="mt-3 text-sm leading-7 text-ink-muted">
              不是四张普通功能卡，是普通业主签约前、开工前、施工中最容易出事的四个真实场景。
            </p>
          </div>

          {/* 不等高拼贴布局 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[minmax(200px,auto)]">
            {coreEntries.map((entry) => (
              <Link
                key={entry.num}
                href={entry.href}
                className={`group relative flex flex-col justify-between border p-7 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(30,25,20,0.06)] ${
                  entry.accent
                    ? 'lg:col-span-5 lg:row-span-2 border-stone/30 bg-stone/[0.03]'
                    : entry.num === '04'
                    ? 'lg:col-span-12 border-border bg-surface'
                    : 'lg:col-span-7 border-border bg-surface'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-stone">{entry.label}</span>
                    <span className="text-[0.72rem] font-semibold tracking-wide text-ink-faint">{entry.num}</span>
                  </div>
                  <h3 className="text-[1.1rem] font-semibold leading-[1.4] text-ink group-hover:text-stone transition-colors">
                    {entry.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-ink-muted">{entry.scene}</p>
                </div>
                <span className="mt-6 text-sm font-medium text-stone opacity-0 group-hover:opacity-100 transition-opacity">
                  进入对应入口 →
                </span>
              </Link>
            ))}
          </div>

          {/* 居住场景补充 */}
          <div className="mt-6 border-l-2 border-stone/40 pl-5 max-w-3xl">
            <p className="text-sm leading-7 text-ink-muted">
              <span className="font-semibold text-ink">居住场景补充：</span>家不是样板间，是人长期生活的容器。做饭频率、收纳习惯、老人小孩和居家办公怎么分配，会反过来影响前面的报价和验收判断。
            </p>
          </div>
        </Container>
      </section>

      {/* ───── 现场证据模块 ───── */}
      <section className="border-b border-border bg-surface-warm py-16 sm:py-20 lg:py-24">
        <Container size="layout">
          <div className="mb-12 max-w-2xl">
            <p className="page-label mb-3">现场证据</p>
            <h2 className="section-heading">工地不是看热闹，是看风险点。</h2>
            <p className="mt-3 text-sm leading-7 text-ink-muted">
              这些位置预留给真实工地现场照片。不用效果图，不用 AI 生成图，只用能看清问题的真实现场。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {siteEvidenceSlots.map((slot) => (
              <div key={slot.id} className="group relative aspect-[4/3] border border-dashed border-border bg-surface flex flex-col items-center justify-center p-3 transition-colors hover:border-stone/40">
                <svg className="h-8 w-8 text-ink-faint/40 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
                <p className="text-[0.6rem] text-center leading-4 text-ink-faint">{slot.alt}</p>
                <div className="absolute inset-0 flex items-center justify-center bg-surface/95 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-[0.65rem] leading-4 text-ink-muted text-center">{slot.suggestion}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-ink-faint max-w-2xl">
            图片建议：使用自己工地现场照片或经授权的脱敏照片。重点突出施工细节和风险点位，不追求效果图美感。
          </p>
        </Container>
      </section>

      {/* ───── 信任说明 + 透明边界 ───── */}
      <section className="border-b border-border py-16 sm:py-20">
        <Container size="layout">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <p className="page-label mb-3">为什么值得继续看</p>
              <h2 className="section-heading mb-5">我不是把资料堆给你自己猜，是先把最容易踩坑的地方指出来。</h2>
              <div className="space-y-4 text-base leading-8 text-ink">
                <p>
                  这些判断来自真实工地：报价单里一行没写清的另计项，预算表里那笔没单独留出来的预备金，合同里一句以后最容易扯皮的话，水电、防水、泥工、吊顶、竣工验收每个节点该怎么留证。
                </p>
                <p className="text-sm text-ink-muted leading-7">
                  我不会给你一句万能答案。不同城市、不同预算、不同工艺、不同合同约定，判断都会变。但我会先把最容易出事的地方指出来，让你少走弯路。
                </p>
              </div>
            </div>

            <div className="border border-border bg-surface p-6 shadow-[0_12px_30px_rgba(30,25,20,0.04)]">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-stone mb-4">独立立场说明</p>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 bg-stone/60" />
                  <p className="text-sm leading-7 text-ink-muted">利益关系透明：现阶段不靠建材返点、装修公司导流和隐形利益绑定来做判断。</p>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 bg-stone/60" />
                  <p className="text-sm leading-7 text-ink-muted">不为了佣金、返点或合作关系误导业主判断。</p>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 bg-stone/60" />
                  <p className="text-sm leading-7 text-ink-muted">如果未来涉及工具、课程、精选产品或电商合作，会说明推荐理由、适用场景和商业关系。</p>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 bg-stone/60" />
                  <p className="text-sm leading-7 text-ink-muted">核心不是"永远不卖东西"，而是先帮业主建立判断力，再透明地提供产品和服务。</p>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ───── 产品路径 ───── */}
      <section className="border-b border-border bg-surface-warm py-16 sm:py-20 lg:py-24">
        <Container size="layout">
          <div className="mb-12 max-w-2xl">
            <p className="page-label mb-3">产品路径</p>
            <h2 className="section-heading">先建立判断力，再选择工具和服务。</h2>
            <p className="mt-3 text-sm leading-7 text-ink-muted">
              还在摸清问题就先免费；已经有材料就别再靠猜。路径顺了，钱才花得值。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {productPath.map((item) => (
              <div key={item.title} className="relative flex flex-col border border-border bg-surface p-6 shadow-[0_8px_20px_rgba(30,25,20,0.03)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-stone">{item.step}</span>
                  {item.badge ? (
                    <span className="text-[0.6rem] font-semibold tracking-wide text-ink-faint border border-border px-2 py-0.5">{item.badge}</span>
                  ) : null}
                </div>
                <h3 className="text-base font-semibold leading-snug text-ink mb-2">{item.title}</h3>
                <p className="text-sm leading-7 text-ink-muted flex-1">{item.desc}</p>
                {item.href ? (
                  <Link href={item.href} className="mt-4 text-sm font-medium text-stone hover:underline underline-offset-2">
                    {item.cta} →
                  </Link>
                ) : (
                  <span className="mt-4 text-sm text-ink-faint">产品说明页后续补齐</span>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ───── AI 第二层叙事 + 视频占位 ───── */}
      <section className="border-b border-border py-16 sm:py-20 lg:py-24">
        <Container size="layout">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <p className="page-label mb-3">AI 第二层</p>
              <h2 className="section-heading mb-5">AI 落地装修全流程——不是替你做决定，而是帮你把信息整理清楚。</h2>
              <ul className="space-y-3 mb-6">
                {aiCapabilities.map((cap) => (
                  <li key={cap} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-stone/70" />
                    <p className="text-sm leading-7 text-ink-muted">{cap}</p>
                  </li>
                ))}
              </ul>
              <p className="text-sm leading-7 text-ink-faint max-w-lg">
                最终判断仍要结合现场条件、合同约定和施工做法。工具可以提高效率，不能替代价值观。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <CTA href="/services/ai-workflow" label="看 AI 工作流入口" variant="secondary" />
                <CTA href="/blog" label="看 AI 相关文章" variant="ghost" />
              </div>
            </div>

            {/* 视频占位 */}
            <div className="relative aspect-video border border-dashed border-border bg-surface flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-surface-warm" />
              <div className="relative z-10 flex flex-col items-center gap-3 p-6">
                <svg className="h-12 w-12 text-stone/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
                <p className="text-sm font-medium text-ink-muted">演示视频占位</p>
                <p className="text-xs text-ink-faint text-center max-w-xs leading-5">
                  预留 15–30 秒屏幕录制或现场讲解视频。上线时使用 lazy load，配 poster 封面，不自动播放。
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ───── 最近文章 ───── */}
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
          <div className="border border-border bg-surface shadow-[0_10px_26px_rgba(30,25,20,0.04)]">
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="compact" />
            ))}
          </div>
        </Container>
      </section>

      {/* ───── FAQ ───── */}
      <section className="border-b border-border py-16 sm:py-20">
        <Container size="content">
          <div className="mb-10">
            <p className="page-label mb-3">常见问题</p>
            <h2 className="section-heading">你在首页最容易卡住的几件事</h2>
          </div>
          <div className="space-y-3">
            {faqItems.map((item) => (
              <div key={item.q} className="border border-border bg-surface px-6 py-5">
                <h3 className="text-base font-semibold text-ink mb-2">{item.q}</h3>
                <p className="text-sm leading-7 text-ink-muted">{item.a}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ───── 底部 CTA ───── */}
      <CTASection
        title="先做对下一步，不用一次看完整站"
        description="还不知道问题在哪，先做预算风险自测；已经有报价单，就直接看报价审核服务；想按问题分类走，就去问题入口。"
        actions={[
          { label: '免费做预算风险自测', href: '/tools/budget-risk', variant: 'primary' },
          { label: '按问题进入', href: '/start', variant: 'secondary' },
          { label: '查看报价审核服务', href: '/services/renovation', variant: 'ghost' },
        ]}
        bg="warm"
      />
    </>
  )
}
