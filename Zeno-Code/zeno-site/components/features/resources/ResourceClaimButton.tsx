'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ResourceClaimButton({ resourceId, resourceTitle }: { resourceId: string; resourceTitle: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'claimed' | 'login' | 'error'>('idle')

  async function claim() {
    setStatus('loading')
    try {
      const response = await fetch('/api/resource-claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId, resourceTitle, resourceUrl: '' }),
      })

      if (response.status === 401) {
        setStatus('login')
        return
      }

      if (!response.ok) {
        setStatus('error')
        return
      }

      setStatus('claimed')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'login') {
    return (
      <Link href="/login" className="inline-flex h-9 items-center bg-stone px-4 text-xs font-semibold text-white hover:bg-stone/90">
        登录后领取
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={claim}
      disabled={status === 'loading' || status === 'claimed'}
      className="inline-flex h-9 items-center bg-stone px-4 text-xs font-semibold text-white transition-colors hover:bg-stone/90 disabled:bg-stone/35"
    >
      {status === 'loading' && '领取中...'}
      {status === 'claimed' && '已加入用户中心'}
      {status === 'error' && '稍后重试'}
      {status === 'idle' && '网页端领取'}
    </button>
  )
}
