import type { Metadata } from 'next'
import Container from '@/components/ui/Container'

export const metadata: Metadata = {
  title: '装修报价自检清单｜签约前自己先查一遍',
  description:
    '17 年工地经验浓缩成一份自检清单。30 个必查项，覆盖暂估陷阱、漏项、材料边界、付款节点——签约前花 20 分钟自己过一遍，省的可能不止 2 万。',
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
          <p className="page-label mb-4">付费工具</p>
          <div className="max-w-2xl">
            <h1 className="page-title mb-4">
              装修报价自检清单
            </h1>
            <p className="text-xl font-semibold text-ink mb-4">
              ¥99
            </p>
            <p className="text-base leading-relaxed text-ink-muted sm:text-lg">
              签约前花 20 分钟自己过一遍。<br />
              30 个必查项——17 年工地经验踩过的坑，都在这张清单里。
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
              大多数人签装修合同时，手上只有一份报价单——价格、项目名称、备注。
              没有人告诉你哪些地方会漏项、哪些措辞是空白支票、哪个付款节点一过你就失去了主动权。
            </p>
            <p>
              2018 年我在南宁签了一份水电「暂估 1.2 万按实结算」的合同。四个月后结算 3.7 万——多了 2.5 万，其中
              4000 块是一根本来就在原户型里的排水管。
            </p>
            <p>
              从那天起，我变了。每一份报价单我不再看金额，先看「上限」两个字，再看「计量规则」，最后才看金额。
              这套检查习惯，我用了 7 年，帮业主审过的报价累计节省超过
              200 万。
            </p>
            <p>
              现在我把这 7 年的检查习惯浓缩成一份自检清单——<strong className="text-ink">30 个必查项，分 6 个类别</strong>。不需要专业知识，拿着清单逐条对报价单，不会看的地方我标了怎么看。
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
                AI 自动扫描报价单，快速标记可疑项。适合第一次拿到报价，想看大概哪里有问题。
              </p>
            </div>
            <div>
              <p className="font-semibold text-ink mb-2">付费自检清单（¥99）</p>
              <p className="text-ink-muted leading-relaxed">
                人工整理的系统性检查框架。逐项看懂、逐项判断、逐项和施工方确认。适合签约前最后一遍彻底排查。
              </p>
            </div>
          </div>
        </section>

        {/* 买到什么 */}
        <section className="mb-14 max-w-2xl">
          <h2 className="section-heading mb-4">¥99 你拿到什么</h2>
          <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
            <p>一份 PDF 清单文件——30 个必查项，6 个分类。每个检查项附简短说明：怎么看、哪里容易出问题。</p>
            <p>不是模板。不是网上能搜到的通用版。是我 17 年里一份一份报价单审出来的判断。</p>
            <p className="text-xs text-stone">* 付款后微信发文件，24 小时内交付。不含一对一咨询服务。</p>
          </div>
        </section>

        {/* CTA */}
        <section className="border border-border bg-surface p-6 sm:p-8 text-center">
          <h2 className="text-xl font-semibold text-ink mb-3">买这份清单</h2>
          <p className="mb-5 text-sm leading-relaxed text-ink-muted max-w-lg mx-auto">
            加微信，备注「清单」。付款后 24 小时内发 PDF 给你。签合同之前，花 20 分钟逐条对一遍——省的可能不止 2 万。
          </p>
          <p className="text-base text-ink">
            微信：<span className="font-semibold">zanxiansheng2025</span>
          </p>
          <p className="mt-1 text-sm text-ink-muted">备注「清单」</p>
        </section>
      </Container>
    </>
  )
}
