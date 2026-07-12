'use client'

/**
 * components/admin/ReviewPanel.tsx
 * 八人评审团面板 — 一键展开八个视角的审查清单
 */

import { useState } from 'react'
import type { Reviewer } from '@/lib/review-panel'

const CATEGORY_LABELS: Record<string, string> = {
  system: '系统',
  content: '内容',
  business: '商业',
  prompt: '实战',
}

const CATEGORY_COLORS: Record<string, string> = {
  system: 'border-l-[#68aeb0]',
  content: 'border-l-[#C4A882]',
  business: 'border-l-green-400',
  prompt: 'border-l-[#d2846f]',
}

export default function ReviewPanel({ reviewers }: { reviewers: Reviewer[] }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    const next = new Set(expanded)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setExpanded(next)
  }

  if (!reviewers.length) {
    return <p className="text-xs text-[#706860]">评审团数据加载中...</p>
  }

  return (
    <div className="space-y-2">
      {reviewers.map((r) => {
        const isOpen = expanded.has(r.id)
        return (
          <div
            key={r.id}
            className={`border border-[#3A3530] bg-[#252320] border-l-2 ${CATEGORY_COLORS[r.category] ?? 'border-l-[#706860]'} transition-colors`}
          >
            <button
              onClick={() => toggle(r.id)}
              className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-[#2A2825] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-sm font-semibold text-[#E8E2DA] shrink-0">
                  {r.name}
                </span>
                <span className="text-[0.6rem] text-[#706860] bg-[#1f1d1a] px-1.5 py-0.5 rounded shrink-0">
                  {CATEGORY_LABELS[r.category] ?? r.category}
                </span>
                <span className="text-xs text-[#A09890] truncate hidden sm:inline">
                  {r.lens}
                </span>
              </div>
              <span className={`text-xs shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`}>
                ▶
              </span>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 pt-1 border-t border-[#3A3530] space-y-2">
                <p className="text-xs text-[#d2846f] font-medium">
                  核心问题：{r.question}
                </p>
                <ul className="space-y-1">
                  {r.checks.map((check, i) => (
                    <li key={i} className="text-xs text-[#A09890] flex items-start gap-2">
                      <span className="text-[#504840] shrink-0 mt-0.5">{i + 1}.</span>
                      <span>{check}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[0.65rem] text-[#68aeb0] pt-1 border-t border-[#2A2825]">
                  判断：{r.verdict}
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
