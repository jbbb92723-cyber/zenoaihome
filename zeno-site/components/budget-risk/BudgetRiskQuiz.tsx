'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  answerOptions,
  budgetRiskQuestions,
  scoreAnswers,
  type BudgetRiskAnswers,
} from '@/data/budget-risk'

export default function BudgetRiskQuiz() {
  const router = useRouter()
  const [answers, setAnswers] = useState<BudgetRiskAnswers>({})

  const answeredCount = Object.keys(answers).length
  const isComplete = answeredCount === budgetRiskQuestions.length

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: value,
    }))
  }

  const handleReset = () => {
    setAnswers({})
  }

  const handleSubmit = () => {
    if (!isComplete) return

    const result = scoreAnswers(answers)
    const params = new URLSearchParams({
      dominant: result.dominant,
      r1: String(result.scores.R1),
      r2: String(result.scores.R2),
      r3: String(result.scores.R3),
      r4: String(result.scores.R4),
    })

    router.push(`/tools/budget-risk/result?${params.toString()}`)
  }

  return (
    <div className="space-y-8">
      {budgetRiskQuestions.map((question, index) => (
        <section key={question.id} className="border border-border bg-surface p-6 sm:p-7">
          <div className="mb-5">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">
              问题 {index + 1}
            </p>
            <h2 className="text-base sm:text-lg font-semibold text-ink mb-2">{question.title}</h2>
            <p className="text-sm text-ink-muted leading-relaxed">{question.detail}</p>
          </div>

          <div className="space-y-2.5">
            {answerOptions.map((option) => {
              const isActive = answers[question.id] === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleAnswerChange(question.id, option.value)}
                  className={`w-full text-left border px-4 py-3 transition-colors ${
                    isActive
                      ? 'border-stone bg-stone/5'
                      : 'border-border bg-surface hover:border-stone/40 hover:bg-surface-warm'
                  }`}
                >
                  <span className="block text-sm font-medium text-ink">{option.label}</span>
                  <span className="block text-xs text-ink-muted mt-1 leading-relaxed">{option.help}</span>
                </button>
              )
            })}
          </div>
        </section>
      ))}

      <div className="border border-border bg-surface-warm p-6 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-ink">已完成 {answeredCount} / {budgetRiskQuestions.length}</p>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">
              这个工具不会给你一个“最终答案”，只负责帮你先分清哪类风险更值得先处理。
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isComplete}
              className={`inline-flex items-center px-5 py-2.5 text-sm font-medium transition-colors ${
                isComplete
                  ? 'bg-stone text-white hover:bg-stone/90'
                  : 'bg-stone/35 text-white cursor-not-allowed'
              }`}
            >
              查看结果
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center border border-stone px-5 py-2.5 text-sm font-medium text-stone hover:bg-stone-pale transition-colors"
            >
              清空重来
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}