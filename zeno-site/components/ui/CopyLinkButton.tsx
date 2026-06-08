'use client'

import { useState } from 'react'

export default function CopyLinkButton({ label = '复制链接', copiedLabel = '已复制' }: { label?: string; copiedLabel?: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      className="text-xs text-ink-muted border border-border px-3 py-1.5 hover:border-stone hover:text-stone transition-colors"
      onClick={() => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href)
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        }
      }}
    >
      {copied ? copiedLabel : label}
    </button>
  )
}
