'use client'

/**
 * 自测表单题渲染组件
 *
 * 受控组件：自身不持有答案状态，只把变化往上抛。
 * 同时支持 single（单选）和 multi（多选，受 maxSelect 限制）。
 */

import type { Question } from '@/app/tools/budget-risk/questions'

interface Props {
  question: Question
  /** 当前题号（1-based），仅用于展示 */
  index: number
  total: number
  value: string | string[] | undefined
  onChange: (value: string | string[]) => void
}

export default function QuestionCard({ question, index, total, value, onChange }: Props) {
  const isMulti = question.type === 'multi'
  const selected: string[] = Array.isArray(value) ? value : value ? [value] : []

  function toggle(optValue: string) {
    if (!isMulti) {
      onChange(optValue)
      return
    }
    // 多选：达到 maxSelect 时，新选项替换最早选的那个
    const max = question.maxSelect ?? Infinity
    if (selected.includes(optValue)) {
      onChange(selected.filter((v) => v !== optValue))
    } else if (selected.length < max) {
      onChange([...selected, optValue])
    } else {
      onChange([...selected.slice(1), optValue])
    }
  }

  return (
    <div className="border border-border bg-surface px-6 py-7 sm:px-8 sm:py-8">
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-[0.65rem] font-mono text-stone tracking-widest">
          {String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        {isMulti && (
          <span className="text-[0.65rem] text-ink-faint">最多选 {question.maxSelect ?? '多'} 项</span>
        )}
      </div>
      <h2 className="text-base sm:text-lg font-semibold text-ink leading-snug">{question.prompt}</h2>
      {question.hint && (
        <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">{question.hint}</p>
      )}

      <div className="mt-5 space-y-2">
        {question.options.map((opt) => {
          const checked = selected.includes(opt.value)
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={`w-full text-left text-sm px-4 py-3 border transition-colors ${
                checked
                  ? 'border-stone bg-stone/5 text-ink'
                  : 'border-border bg-canvas text-ink-muted hover:border-stone/40 hover:text-ink'
              }`}
            >
              <span className="inline-flex items-center gap-3">
                <span
                  className={`inline-block w-3 h-3 shrink-0 ${
                    isMulti ? '' : 'rounded-full'
                  } border ${checked ? 'border-stone bg-stone' : 'border-ink-faint'}`}
                />
                {opt.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
