'use client'

/**
 * app/admin/(protected)/pipeline/actions.tsx
 * 管道操作按钮 — 客户端组件，调用 Hermes API 并显示结果
 */

import { useState } from 'react'

interface ActionButtonProps {
  endpoint: string
  method: 'GET' | 'POST'
  disabled?: boolean
  needTopic?: boolean
  needBrief?: boolean
}

export function ActionButton({
  endpoint,
  method,
  disabled = false,
  needTopic,
  needBrief,
}: ActionButtonProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setLoading(true)
    setResult(null)
    setError(null)

    // 如果操作需要额外参数，提示用户
    let body: Record<string, string> | undefined
    if (needTopic) {
      const topicId = prompt('输入 topic_id：')
      if (!topicId) { setLoading(false); return }
      body = { topicId }
    }
    if (needBrief) {
      const briefId = prompt('输入 brief_id：')
      if (!briefId) { setLoading(false); return }
      body = { ...body, briefId }
    }

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        ...(body ? { body: JSON.stringify(body) } : {}),
      })
      const data = await res.json()
      if (data.ok) {
        setResult(data.message ?? data.status ?? '操作成功')
      } else {
        setError(data.error ?? '操作失败')
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={disabled || loading}
        className="text-xs font-medium text-[#1C1A17] bg-[#C4A882] px-3 py-1.5 hover:bg-[#C4A882]/85 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? '执行中...' : method === 'GET' ? '查询' : '执行'}
      </button>
      {result && (
        <p className="text-[0.6rem] text-green-400 mt-1">{result}</p>
      )}
      {error && (
        <p className="text-[0.6rem] text-[#d2846f] mt-1">{error}</p>
      )}
    </div>
  )
}
