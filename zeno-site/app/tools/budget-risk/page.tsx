'use client'

/**
 * 装修预算风险自测 — 入口表单页
 *
 * 设计取舍：
 * 1. 不强制留资。做完直接出结果，邮箱留资降级为结果页可选动作。
 * 2. 答案通过 URL query string 传到结果页，使结果页可分享、可收藏，也方便用户对照修改。
 * 3. 客户端组件 + useState，10 题不需要 react-hook-form。
 */

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Container from '@/components/Container'
import PageHero from '@/components/PageHero'
import QuestionCard from '@/components/budget-risk/QuestionCard'
import { questions } from './questions'

type AnswerMap = Record<string, string | string[]>

export default function BudgetRiskPage() {
  const router = useRouter()
  const [answers, setAnswers] = useState<AnswerMap>({})

  const answeredCount = useMemo(() => {
    return questions.filter((q) => {
      const a = answers[q.id]
      if (!a) return false
      return Array.isArray(a) ? a.length > 0 : Boolean(a)
    }).length
  }, [answers])

  const allAnswered = answeredCount === questions.length

  function handleSubmit() {
    // 把答案编码进 URL query string
    // 多选用逗号拼接，单选直接写
    const params = new URLSearchParams()
    for (const q of questions) {
      const a = answers[q.id]
      if (!a) continue
      params.set(q.id, Array.isArray(a) ? a.join(',') : a)
    }
    router.push(`/tools/budget-risk/result?${params.toString()}`)
  }

  return (
    <>
      <PageHero
        label="判断工具"
        title="装修预算，10 分钟体检"
        subtitle="10 个问题，看看你这次装修最可能在哪里超支。不收集联系方式，不强制注册——做完直接出结果。"
        size="content"
      />

      <Container size="content" className="py-section">
        {/* 信任前置：告诉用户这表是怎么来的 */}
        <div className="mb-10 border-l-2 border-stone-light pl-4">
          <p className="text-sm text-ink leading-relaxed">
            这份自测来自我审过的上千份真实报价。我把"事后才看出问题"的那些点，提前做成了你现在就能回答的问题。
          </p>
          <p className="text-xs text-ink-muted leading-relaxed mt-2">
            ——Zeno，装修 16 年
          </p>
        </div>

        {/* 极简进度条：只是一根细线 */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-[0.65rem] text-ink-faint uppercase tracking-widest mb-2">
            <span>已回答</span>
            <span>{answeredCount} / {questions.length}</span>
          </div>
          <div className="h-px bg-border relative">
            <div
              className="absolute left-0 top-0 h-px bg-stone transition-all"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={i + 1}
              total={questions.length}
              value={answers[q.id]}
              onChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
            />
          ))}
        </div>

        {/* 提交区 */}
        <div className="mt-10 border-t border-border pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-ink">
                {allAnswered
                  ? '十题都答完了，可以看结果了。'
                  : '建议把十题都答完——任何一题空着，结果都会偏。'}
              </p>
              <p className="text-xs text-ink-muted mt-1">
                结果页只在你的浏览器里生成，不会上传任何答案。
              </p>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={answeredCount === 0}
              className="shrink-0 text-sm font-medium text-paper bg-stone px-6 py-3 hover:bg-stone/85 transition-colors disabled:bg-ink-faint disabled:cursor-not-allowed"
            >
              看看我的预算风险 →
            </button>
          </div>
        </div>
      </Container>
    </>
  )
}
