import type { Metadata } from 'next'
import Container from '@/components/ui/Container'
import CTA from '@/components/ui/CTA'

export const metadata: Metadata = {
  title: '装修报价自检清单｜签约前自己先查一遍',
  description:
    '基于长期传统行业经营与装修项目实践整理的 26 个报价核对项，覆盖暂估、漏项、材料边界、付款节点和合同条款。',
  alternates: {
    canonical: 'https://zenoaihome.com/tools/quote-checklist',
  },
}

const checklistItems = [
  { category: '暂估与计量', items: ['水电暂估有没有写上限金额', '面积计算方式是否明确（建筑面积/套内/实测）', '柜体、吊顶等定制项的计量单位是否统一', '拆除、修补等杂项是否按实结算、有无封顶'] },
  { category: '材料边界', items: ['主材品牌、型号、规格是否全部写明', '辅材有没有模糊标注（"品牌同档次"等措辞）', '瓷砖铺贴方式（正铺/斜铺/拼花）有无对应单价', '涂料遍数、防水高度等工艺参数是否量化'] },
  { category: '漏项排查', items: ['垃圾清运费、材料搬运费是否包含', '成品保护费用是否单独列出', '开关面板、灯具安装费是否写明', '美缝、打胶等收口工艺是否遗漏', '保洁费用有无说明'] },
  { category: '付款节点', items: ['首付款比例是否超过 50%', '每个付款节点对应的工作内容是否明确', '尾款（质保金）是否预留、比例多少', '增项确认流程是否有书面约定'] },
  { category: '合同条款', items: ['工期延误的违约责任是否明确', '材料更换的确认流程是否约定', '验收标准和验收方法是否写入', '质保期限和质保范围是否清楚', '争议解决方式是否对等'] },
  { category: '施工管控', items: ['项目经理是否固定、中途更换条件', '工地巡检频率是否承诺', '关键节点的验收要求是否写明', '图纸与报价是否一一对应'] },
]

export default function QuoteChecklistPage() {
  return (
    <>
      <section className="border-b border-border bg-surface-warm">
        <Container size="content" className="py-14 sm:py-16">
          <p className="page-label mb-4">免费工具</p>
          <div className="max-w-2xl">
            <h1 className="page-title mb-4">
              装修报价自检清单
            </h1>
            <p className="text-xl font-semibold text-ink mb-4">
              免费
            </p>
            <p className="text-base leading-relaxed text-ink-muted sm:text-lg">
              签约前花 20 分钟自己过一遍。<br />
              26 个核对项，覆盖报价、材料、付款和合同中需要继续确认的地方。
            </p>
          </div>
        </Container>
      </section>

      <Container size="content" className="py-14 sm:py-16">
        {/* 为什么需要 */}
        <section className="mb-14 max-w-2xl">
          <h2 className="section-heading mb-4">为什么你需要这份清单</h2>
          <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
            <p>
              报价单不只有总价，还同时写着项目范围、材料规格、计量方式、变更流程和付款节点。任何一处没有写清，都值得在签约前继续追问。
            </p>
            <p>
              这份清单把常见问题按六类排好：先看暂估与计量，再核对材料、漏项、付款、合同和施工管控。你可以直接对着手上的报价与合同逐项确认。
            </p>
            <p>
              它提供的是核对起点，不是审价结论，也不能证明某个价格一定合理。涉及当地单价、工程量、施工现场或法律责任时，还需要对应专业人员结合原始材料判断。
            </p>
          </div>
        </section>

        {/* 清单概览 */}
        <section className="mb-14">
          <h2 className="section-heading mb-5">清单里有什么</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {checklistItems.map((group) => (
              <div key={group.category} className="border border-border bg-surface p-5">
                <h3 className="text-base font-semibold text-ink mb-2">{group.category}</h3>
                <ul className="space-y-1.5">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-ink-muted leading-relaxed">
                      <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-stone" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* vs 免费工具 */}
        <section className="mb-14 border border-border bg-surface-warm p-6 sm:p-8 max-w-2xl">
          <h2 className="text-xl font-semibold text-ink mb-3">和免费报价初筛的区别</h2>
          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <p className="font-semibold text-ink mb-2">免费报价初筛</p>
              <p className="text-ink-muted leading-relaxed">
                通过勾选已写清的项目形成规则初筛；粘贴的文本只在浏览器本地匹配高频风险词。它不会自动读取或理解上传文件。
              </p>
            </div>
            <div>
              <p className="font-semibold text-ink mb-2">自检清单（免费）</p>
              <p className="text-ink-muted leading-relaxed">
                当前网页列出 26 个核对问题，适合拿着报价和合同逐项记录，再把没有写清的部分交给施工方确认。
              </p>
            </div>
          </div>
        </section>

        {/* 如何使用 */}
        <section className="mb-14 max-w-2xl">
          <h2 className="section-heading mb-4">如何使用</h2>
          <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
            <p>本页就是完整清单，不需要付款或领取文件。打开报价单和合同，对照六个分类逐项记录「已写清 / 待确认 / 不适用」。</p>
            <p>发现模糊项时，先让对方把范围、规格、计量方式和变更流程写回原文件。不要只保留口头说明或聊天承诺。</p>
            <p className="text-xs text-stone">* 清单不能覆盖所有户型、工艺和合同情形，也不替代造价、监理或法律意见。</p>
          </div>
        </section>

        {/* CTA */}
        <section className="border border-border bg-surface p-6 sm:p-8 text-center">
          <h2 className="text-xl font-semibold text-ink mb-3">下一步看你的材料状态</h2>
          <p className="mb-5 text-sm leading-relaxed text-ink-muted max-w-lg mx-auto">
            还没开始核对，就从本页第一项往下走；已经拿到电子报价，可以用免费初筛整理待确认项；材料复杂且临近签约，再了解人工审查范围。
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <CTA href="/tools/quote-check" label="打开免费报价初筛" variant="primary" />
            <CTA href="/services/quote-review" label="了解人工审查" variant="secondary" />
          </div>
        </section>
      </Container>
    </>
  )
}
