'use client'

import { useState } from 'react'

interface Props {
  text: string
  label?: string
}

/**
 * 点击复制到剪贴板的小按钮
 */
export default function CopyButton({ text, label = '复制' }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 降级：选中文本
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="text-[0.65rem] font-medium text-stone border border-stone/40 px-2 py-0.5 hover:bg-stone-pale transition-colors shrink-0"
      aria-label={`复制 ${text}`}
    >
      {copied ? '已复制 ✓' : label}
    </button>
  )
}
