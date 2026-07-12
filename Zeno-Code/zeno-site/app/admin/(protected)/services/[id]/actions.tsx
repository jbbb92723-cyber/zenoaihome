'use client'

/**
 * app/admin/(protected)/services/[id]/actions.tsx
 * 回复编辑器 + 确认按钮
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  requestId: string
  initialText: string
  isCompleted: boolean
}

export function ActionPanel({ requestId, initialText, isCompleted }: Props) {
  const [text, setText] = useState(initialText)
  const [saveKnowledge, setSaveKnowledge] = useState(true)
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const router = useRouter()

  async function handleConfirm() {
    if (!text.trim()) return
    setSaving(true)
    setResult(null)

    try {
      const res = await fetch(`/api/service-requests/${requestId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responseText: text, saveToKnowledge: saveKnowledge }),
      })
      const data = await res.json()
      if (data.ok) {
        setResult('已确认，状态更新为已完成')
        router.refresh()
      } else {
        setResult(`失败：${data.error}`)
      }
    } catch {
      setResult('请求失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={16}
        disabled={isCompleted}
        className="w-full bg-[#252320] border border-[#3A3530] text-[#E8E2DA] text-sm p-4 rounded-sm resize-y focus:outline-none focus:border-[#C4A882] disabled:opacity-50 disabled:cursor-not-allowed font-sans leading-relaxed"
        placeholder="AI 生成的回复会显示在这里..."
      />

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <label className="flex items-center gap-2 text-xs text-[#706860] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={saveKnowledge}
            onChange={(e) => setSaveKnowledge(e.target.checked)}
            disabled={isCompleted}
            className="accent-[#C4A882]"
          />
          自动存入知识库
        </label>

        <div className="flex items-center gap-3">
          {result && (
            <span className={`text-xs ${result.includes('失败') ? 'text-[#d2846f]' : 'text-green-400'}`}>
              {result}
            </span>
          )}
          <button
            onClick={handleConfirm}
            disabled={isCompleted || saving || !text.trim()}
            className="px-6 py-2.5 bg-[#C4A882] text-[#1C1A17] text-sm font-semibold rounded-sm hover:bg-[#C4A882]/85 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isCompleted ? '已完成' : saving ? '保存中...' : '确认发出'}
          </button>
        </div>
      </div>
    </div>
  )
}
