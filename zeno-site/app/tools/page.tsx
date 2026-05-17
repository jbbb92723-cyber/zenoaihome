import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: '报价初筛与签约前判断工具 | ZenoAIHome',
  description:
    'ZenoAIHome 工具入口已收窄为装修签约前报价风险判断：先做报价初筛，再查看风险词典、检查模板和施工项目风险库。',
  alternates: {
    canonical: 'https://zenoaihome.com/tools',
  },
}

const mainEntries = [
  {
    title: '报价初筛工具',
    href: '/tools/quote-check',
    label: '主入口',
    desc: '拿到报价单后，先判断哪些边界没写清、哪些地方需要签约前追问。',
    action: '开始免费初筛',
  },
  {
    title: '装修报价风险词典',
    href: '/risk-dictionary',
    label: '风险资产',
    desc: '把按实结算、品牌型号缺失、付款节点过前等风险词讲成人话。',
    action: '查风险词典',
  },
  {
    title: '签约前检查模板',
    href: '/checklists',
    label: '可复制清单',
    desc: '报价、合同、付款节点、水电和老房翻新，拿到材料后逐项对照。',
    action: '看检查模板',
  },
  {
    title: '施工项目风险库',
    href: '/project-risks',
    label: '项目核对',
    desc: '按拆除、水电、防水、找平、瓷砖等项目，看报价里应该写清什么。',
    action: '看项目风险',
  },
]

const auxiliaryTools = [
  { title: '预算分配工具', href: '/tools/budget-structure', desc: '只用于前期看钱大致怎么分，不替代报价判断。' },
  { title: '超预算原因自测', href: '/tools/budget-risk', desc: '只用于判断超支更像来自报价、流程还是需求。' },
  { title: '单位换算工具', href: '/tools/unit-converter', desc: '只用于辅助核对面积、长度、延米和单方。' },
  { title: '瓷砖计算器', href: '/tools/tile-calculator', desc: '只用于估算瓷砖片数、箱数和损耗。' },
  { title: '乳胶漆计算器', href: '/tools/paint-calculator', desc: '只用于估算底漆、面漆用量。' },
  { title: '验收节点向导', href: '/tools/inspection-guide', desc: '只用于开工后的节点验收提醒。' },
]

export default function ToolsPage() {
  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: '报价初筛与签约前判断工具',
            url: 'https://zenoaihome.com/tools',
            description: '围绕装修签约前报价风险判断的工具和结构化资产入口。',
            inLanguage: 'zh-CN',
            hasPart: mainEntries.map((item) => ({
              '@type': 'WebPage',
              name: item.title,
              description: item.desc,
              url: `https://zenoaihome.com${item.href}`,
            })),
          },
        ]}
      />

      <PageHero
        label="报价初筛工具"
        title="工具页只保留一条主线：先看报价能不能签。"
        subtitle="如果你已经拿到装修报价单，先做免费初筛。预算、计算器和验收工具只是辅助，不再作为主路径。"
        size="content"
      />

      <Container size="content" className="pt-8">
        <div className="flex flex-wrap gap-3">
          <CTA href="/tools/quote-check" label="开始免费报价初筛" variant="primary" />
          <CTA href="/risk-dictionary" label="查看风险词典" variant="secondary" />
        </div>
      </Container>

      <Container size="layout" className="py-section">
        <section className="mb-14 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Link
            href="/tools/quote-check"
            className="group flex min-h-[22rem] flex-col border border-stone bg-stone p-7 text-white transition-colors hover:bg-stone/90 sm:p-9"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-white/65">主入口</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              拿到报价单，先生成一份签约前追问清单。
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/78">
              初筛不替你拍板，也不自动审文件。它只做第一步：把报价里没写清的材料、工艺、数量、增项和付款节点先标出来。
            </p>
            <span className="mt-auto pt-8 text-sm font-semibold">开始免费初筛 -&gt;</span>
          </Link>

          <div className="grid gap-4">
            {mainEntries.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group border border-border bg-surface p-5 transition-colors hover:border-stone hover:bg-surface-warm"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-stone">{item.label}</p>
                <h3 className="mt-2 text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.desc}</p>
                <p className="mt-4 text-xs font-semibold text-stone">{item.action} -&gt;</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-14 border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">怎么走</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">不要从工具堆里挑，按签约前顺序走。</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              ['1. 先初筛', '用报价初筛找出没写清的边界。'],
              ['2. 查词典', '看风险词是什么意思，为什么危险。'],
              ['3. 套模板', '把问题整理成可复制的追问清单。'],
              ['4. 必要时快审', '临近签约、材料复杂时进入三档人工判断。'],
            ].map(([title, desc]) => (
              <div key={title} className="border border-border bg-surface p-5">
                <h3 className="text-sm font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <div className="mb-5 border-l-2 border-stone/40 pl-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">辅助工具</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              这些页面先保留给历史用户和长尾搜索，但不再作为网站主路径。签约前判断仍以报价初筛为入口。
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {auxiliaryTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="border border-border bg-surface p-4 transition-colors hover:border-stone hover:bg-surface-warm"
              >
                <h3 className="text-sm font-semibold text-ink">{tool.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="border border-border bg-surface-warm p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">下一步</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">工具看完，回到你的报价单。</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
            如果初筛结果显示高风险，先要求施工方把缺失边界补齐；如果仍然看不明白，再进入 ¥299 标准版报价快审。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <CTA href="/tools/quote-check" label="做免费报价初筛" variant="primary" />
            <CTA href="/services/renovation#quote-standard" label="看 ¥299 标准版快审" variant="secondary" />
          </div>
        </section>
      </Container>
    </>
  )
}
