/**
 * 结果页：单个维度的卡片
 *
 * 输入：维度 label、等级 low/mid/high、一句话解释、是否高亮（主导维度）
 * 输出：直角卡片，等级用颜色而非数字表达
 */

import type { RiskLevel } from '@/app/tools/budget-risk/scoring'

interface Props {
  label: string
  level: RiskLevel
  description: string
  emphasized?: boolean
}

const LEVEL_LABEL: Record<RiskLevel, string> = {
  low: '低',
  mid: '中',
  high: '高',
}

const LEVEL_COLOR: Record<RiskLevel, string> = {
  // 用克制的色阶，不用红黄绿这种警告色
  low: 'text-ink-muted border-border',
  mid: 'text-stone border-stone/40',
  high: 'text-stone border-stone bg-stone/5',
}

export default function RiskDimensionCard({ label, level, description, emphasized }: Props) {
  return (
    <div
      className={`border p-5 sm:p-6 ${LEVEL_COLOR[level]} ${
        emphasized ? 'sm:col-span-2' : ''
      }`}
    >
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className={`text-[0.65rem] uppercase tracking-widest ${
          level === 'high' ? 'text-stone font-semibold' : 'text-ink-faint'
        }`}>
          {LEVEL_LABEL[level]}
        </p>
      </div>
      <p className="text-sm text-ink-muted leading-relaxed">{description}</p>
    </div>
  )
}
