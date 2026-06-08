import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: '居住诊断与报价初筛工具 | ZenoAIHome',
  description:
    'ZenoAIHome 工具入口按装修决策阶段组织：先用 AI 居住诊断看清生活方式、审美取舍和空间优先级；已经拿到报价时，再用报价初筛检查材料、工艺、范围、责任和交付边界。',
  alternates: {
    canonical: 'https://zenoaihome.com/tools',
  },
}

const mainEntries = [
  {
    title: 'AI 居住诊断',
    href: '/living-diagnosis',
    label: '第一入口',
    desc: '还没定方案时，先看生活方式、审美取舍、家庭场景、空间优先级和预算边界。',
    action: '开始居住诊断',
  },
  {
    title: '报价初筛工具',
    href: '/tools/quote-check',
    label: '签约前入口',
    desc: '拿到报价单后，判断它有没有承接方案的材料、工艺、范围、责任和交付边界。',
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
            name: '居住诊断与报价初筛工具',
            url: 'https://zenoaihome.com/tools',
            description: '围绕装修前居住判断、报价初筛、风险词典、检查模板和项目风险库的结构化工具入口。',
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
        label="工具 / 判断入口"
        title="先看这套家怎么住，再看报价能不能承接。"
        subtitle="还没定方向，先做 AI 居住诊断；已经拿到报价，再做免费报价初筛。预算、计算器和验收工具只是辅助，不作为主路径。"
        size="content"
      />

      <Container size="content" className="pt-8">
        <div className="flex flex-wrap gap-3">
          <CTA href="/living-diagnosis" label="开始 AI 居住诊断" variant="primary" />
          <CTA href="/tools/quote-check" label="已有报价，做初筛" variant="secondary" />
        </div>
      </Container>

      <Container size="layout" className="py-section">
        <section className="mb-14 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Link
            href="/living-diagnosis"
            className="group flex min-h-[22rem] flex-col border border-stone bg-stone p-7 text-white transition-colors hover:bg-stone/90 sm:p-9"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-white/65">第一入口</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              还没定方案，先把生活方式和空间优先级说清。
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/78">
              居住诊断不替你选风格。它先把家庭成员、日常动线、收纳家务、陪伴独处、审美偏好和预算取舍整理成下一步判断。
            </p>
            <span className="mt-auto pt-8 text-sm font-semibold">开始居住诊断 -&gt;</span>
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
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">不要从工具堆里挑，按装修决策阶段走。</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              ['1. 先看生活', '用居住诊断看清审美、家庭场景和空间优先级。'],
              ['2. 再看报价', '已有报价时，用初筛找出没写清的边界。'],
              ['3. 查词典和模板', '把风险词和追问问题整理成可沟通清单。'],
              ['4. 必要时快审', '方案或签约材料复杂时进入人工判断。'],
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
              这些页面保留给历史用户和长尾搜索，但不作为网站主路径。主线仍是：居住诊断、报价初筛、风险资料、必要时人工判断。
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
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">工具看完，回到你的真实材料。</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
            如果还没定方案，先补生活方式、空间优先级和预算取舍；如果初筛显示高风险，先要求施工方把缺失边界补齐。仍然看不明白时，再进入报价 / 合同快审或居住方案综合判断。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <CTA href="/living-diagnosis" label="做居住诊断" variant="primary" />
            <CTA href="/services" label="查看服务" variant="secondary" />
          </div>
        </section>
      </Container>
    </>
  )
}
