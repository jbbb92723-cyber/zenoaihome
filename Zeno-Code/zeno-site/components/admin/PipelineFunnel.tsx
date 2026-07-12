'use client'

/**
 * components/admin/PipelineFunnel.tsx
 * 内容管道漏斗图 — 选题→Brief→初稿→质检→审批 各阶段可视化
 */

interface FunnelStage {
  stage: string
  label: string
  count: number
}

interface Props {
  funnel: FunnelStage[]
  pendingApprovals: number
}

const STAGE_COLORS: Record<string, string> = {
  topics:    '#C4A882',
  briefs:    '#68aeb0',
  drafts:    '#78b57b',
  reviews:   '#d2846f',
  approvals: '#C4A882',
}

export default function PipelineFunnel({ funnel, pendingApprovals }: Props) {
  if (!funnel.length) {
    return <p className="text-sm text-[#706860] py-4 text-center">暂无管道数据</p>
  }

  const maxCount = Math.max(1, ...funnel.map((s) => s.count))

  return (
    <div>
      <div className="space-y-1.5">
        {funnel.map((stage, index) => {
          const width = Math.max(2, Math.round((stage.count / maxCount) * 100))
          const color = STAGE_COLORS[stage.stage] ?? '#706860'
          return (
            <div key={stage.stage} className="flex items-center gap-3">
              <span className="text-xs text-[#A09890] w-16 shrink-0 text-right">
                {stage.label}
              </span>
              <div className="flex-1 h-7 bg-[#141410] border border-[#2A2825] rounded relative overflow-hidden">
                <div
                  className="h-full rounded-sm transition-all flex items-center justify-end pr-2"
                  style={{ width: `${width}%`, backgroundColor: color }}
                >
                  <span className="text-xs font-mono font-semibold text-[#1C1A17]">
                    {stage.count}
                  </span>
                </div>
              </div>
              {/* 阶段间箭头 */}
              {index < funnel.length - 1 && (
                <div className="absolute opacity-0">→</div>
              )}
            </div>
          )
        })}
      </div>
      {/* 待审批标记 */}
      {pendingApprovals > 0 && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-[#d2846f] inline-block" />
          <span className="text-[#d2846f]">{pendingApprovals} 条待人工审批</span>
        </div>
      )}
    </div>
  )
}
