import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import {
  OPPORTUNITY_STAGES,
  PRIORITY_LABELS,
  STAGE_LABELS,
  type OpportunityStage,
} from '@/lib/domains/opportunities/constants'

export const metadata: Metadata = { title: '商机工作台 · Admin' }
export const dynamic = 'force-dynamic'

function money(value: number | null) {
  return value === null ? '待定' : `¥${(value / 100).toLocaleString('zh-CN')}`
}
function stageClass(stage: string) {
  if (stage === 'won') return 'border-green-400/30 bg-green-400/10 text-green-400'
  if (stage === 'lost') return 'border-[#d2846f]/30 bg-[#d2846f]/10 text-[#d2846f]'
  if (stage === 'proposed') return 'border-blue-400/30 bg-blue-400/10 text-blue-400'
  return 'border-[#C4A882]/30 bg-[#C4A882]/10 text-[#C4A882]'
}

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string }>
}) {
  const { stage: rawStage } = await searchParams
  const stage = OPPORTUNITY_STAGES.includes(rawStage as OpportunityStage)
    ? rawStage as OpportunityStage
    : null

  const [opportunities, grouped] = await Promise.all([
    prisma.opportunity.findMany({
      where: stage ? { stage } : undefined,
      orderBy: [{ nextActionAt: 'asc' }, { updatedAt: 'desc' }],
      take: 200,
      include: {
        serviceRequest: { select: { id: true } },
        proposals: { orderBy: { version: 'desc' }, take: 1 },
        project: { select: { id: true, status: true } },
      },
    }),
    prisma.opportunity.groupBy({ by: ['stage'], _count: { _all: true } }),
  ])

  const counts = new Map(grouped.map((item) => [item.stage, item._count._all]))
  const activeCount = ['new', 'qualifying', 'scoped', 'proposed']
    .reduce((sum, key) => sum + (counts.get(key) ?? 0), 0)
  const pipelineValue = opportunities
    .filter((item) => !['won', 'lost', 'archived'].includes(item.stage))
    .reduce((sum, item) => sum + (item.expectedAmount ?? 0), 0)
  const overdueCount = opportunities.filter(
    (item) => item.nextActionAt && item.nextActionAt < new Date() && !['won', 'lost', 'archived'].includes(item.stage),
  ).length

  return (
    <div className="max-w-[1600px] space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#706860]">Business Pipeline</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-[#E8E2DA]">商机工作台</h1>
        </div>
        <Link href="/admin/services" className="border border-[#3A3530] px-4 py-2 text-xs font-semibold text-[#A09890] hover:border-[#C4A882] hover:text-[#E8E2DA]">
          查看服务申请
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ['进行中', activeCount.toString()],
          ['待跟进逾期', overdueCount.toString()],
          ['预计金额', money(pipelineValue)],
          ['已成交', (counts.get('won') ?? 0).toString()],
        ].map(([label, value]) => (
          <div key={label} className="border border-[#3A3530] bg-[#1f1d1a] p-4">
            <p className="text-2xl font-semibold text-[#E8E2DA]">{value}</p>
            <p className="mt-1 text-xs text-[#706860]">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 border-b border-[#3A3530] pb-4">
        <Link href="/admin/opportunities" className={`px-3 py-1.5 text-xs ${!stage ? 'bg-[#C4A882] text-[#1C1A17]' : 'border border-[#3A3530] text-[#A09890]'}`}>
          全部 {Array.from(counts.values()).reduce((sum, value) => sum + value, 0)}
        </Link>
        {OPPORTUNITY_STAGES.map((key) => (
          <Link key={key} href={`/admin/opportunities?stage=${key}`} className={`px-3 py-1.5 text-xs ${stage === key ? 'bg-[#C4A882] text-[#1C1A17]' : 'border border-[#3A3530] text-[#A09890]'}`}>
            {STAGE_LABELS[key]} {counts.get(key) ?? 0}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto border border-[#3A3530] bg-[#1f1d1a]">
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr className="border-b border-[#3A3530] text-left">
              {['商机', '客户', '阶段', '优先级', '预计金额', '下一动作', '方案 / 项目'].map((label) => (
                <th key={label} className="px-4 py-3 text-[0.65rem] font-semibold uppercase tracking-widest text-[#706860]">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {opportunities.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-[#706860]">暂无商机</td></tr>
            ) : opportunities.map((opportunity) => {
              const stageKey = opportunity.stage as OpportunityStage
              const nextActionOverdue = opportunity.nextActionAt
                && opportunity.nextActionAt < new Date()
                && !['won', 'lost', 'archived'].includes(opportunity.stage)
              const latestProposal = opportunity.proposals[0]

              return (
                <tr key={opportunity.id} className="border-b border-[#3A3530] last:border-0 hover:bg-[#252320]">
                  <td className="px-4 py-3">
                    <Link href={`/admin/opportunities/${opportunity.id}`} className="font-medium text-[#E8E2DA] hover:text-[#C4A882]">
                      {opportunity.title}
                    </Link>
                    <p className="mt-1 text-[0.65rem] text-[#706860]">{opportunity.serviceType}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#A09890]">
                    {opportunity.customerName || '未命名'}
                    <p className="mt-1 text-[0.65rem] text-[#504840]">{opportunity.contactWechat || opportunity.contactPhone || opportunity.contactEmail || '无联系方式'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex border px-2 py-1 text-[0.65rem] font-semibold ${stageClass(opportunity.stage)}`}>
                      {STAGE_LABELS[stageKey] ?? opportunity.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#A09890]">
                    {PRIORITY_LABELS[opportunity.priority as keyof typeof PRIORITY_LABELS] ?? opportunity.priority}
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-[#E8E2DA]">{money(opportunity.expectedAmount)}</td>
                  <td className="max-w-[260px] px-4 py-3 text-xs">
                    <p className={nextActionOverdue ? 'text-[#d2846f]' : 'text-[#A09890]'}>{opportunity.nextAction || '待设置'}</p>
                    {opportunity.nextActionAt && <p className="mt-1 text-[0.65rem] text-[#504840]">{opportunity.nextActionAt.toLocaleDateString('zh-CN')}</p>}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#706860]">
                    {latestProposal ? `方案 v${latestProposal.version} · ${latestProposal.status}` : '暂无方案'}
                    {opportunity.project && <Link href={`/admin/projects/${opportunity.project.id}`} className="mt-1 block text-[#C4A882]">查看项目</Link>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
