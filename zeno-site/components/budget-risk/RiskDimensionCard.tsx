import type { RiskSummary } from '@/data/budget-risk'

interface RiskDimensionCardProps {
  summary: RiskSummary
  score: number
  maxScore: number
  isDominant?: boolean
}

export default function RiskDimensionCard({
  summary,
  score,
  maxScore,
  isDominant = false,
}: RiskDimensionCardProps) {
  const ratio = maxScore > 0 ? Math.min(score / maxScore, 1) : 0

  return (
    <article className={`border p-5 ${isDominant ? 'border-stone bg-stone/5' : 'border-border bg-surface'}`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">{summary.name}</p>
          <h2 className="text-base font-semibold text-ink">{summary.shortName}</h2>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-semibold text-ink">{score}</p>
          <p className="text-xs text-ink-faint">/ {maxScore}</p>
        </div>
      </div>

      <div className="h-2 bg-stone-pale mb-4 overflow-hidden">
        <div className="h-full bg-stone" style={{ width: `${ratio * 100}%` }} />
      </div>

      <p className="text-sm text-ink-muted leading-relaxed">{summary.description}</p>
    </article>
  )
}