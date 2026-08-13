'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Props {
  orderNo: string
  status:  string
  paymentAvailable: boolean
}

export default function OrderActions({ orderNo, status, paymentAvailable }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [done, setDone]       = useState(false)

  async function handleNotify() {
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/orders/${orderNo}/notify`, { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? '提交失败，请稍后再试')
        return
      }

      setDone(true)
      router.refresh()
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'completed') {
    return (
      <div className="space-y-3">
        <div className="border border-stone-light bg-stone-pale/70 px-4 py-3 text-sm text-ink">
          权益已开通，感谢支持！
        </div>
        <Link
          href="/account"
          className="block w-full text-center text-sm font-medium text-white bg-stone px-4 py-2.5 hover:bg-stone/85 transition-colors"
        >
          前往个人中心
        </Link>
      </div>
    )
  }

  if (status === 'pending_confirmation' || done) {
    return (
      <div className="space-y-3">
        <div className="border border-stone-light bg-stone-pale/70 px-4 py-3 text-sm text-ink">
          已收到付款通知，将在 24 小时内人工确认并开通权益。
        </div>
        <Link
          href="/account"
          className="block w-full text-center text-sm font-medium border border-border text-ink-muted px-4 py-2.5 hover:text-ink transition-colors"
        >
          返回个人中心
        </Link>
      </div>
    )
  }

  if (status === 'cancelled' || status === 'refunded') {
    return (
      <div className="px-4 py-3 border border-border text-sm text-ink-muted">
        该订单已{status === 'cancelled' ? '取消' : '退款'}
      </div>
    )
  }

  if (status === 'paid' || status === 'processing') {
    return (
      <div className="space-y-3">
        <div className="border border-stone-light bg-stone-pale/70 px-4 py-3 text-sm text-ink">
          付款已确认，相关权益正在处理中。
        </div>
        <Link
          href="/account"
          className="block w-full text-center text-sm font-medium border border-border text-ink-muted px-4 py-2.5 hover:text-ink transition-colors"
        >
          返回个人中心
        </Link>
      </div>
    )
  }

  if (!paymentAvailable) {
    return (
      <div className="space-y-3">
        <div className="border border-border bg-surface-warm px-4 py-3 text-sm leading-7 text-ink-muted">
          收款方式尚未配置，暂时不能提交付款通知。请不要向任何未核实的账户转账。
        </div>
        <Link
          href="/contact"
          className="block w-full text-center text-sm font-medium border border-border text-ink-muted px-4 py-2.5 hover:text-ink transition-colors"
        >
          联系赞诺
        </Link>
      </div>
    )
  }

  // pending — 只有收款配置存在时才显示通知按钮
  return (
    <div className="space-y-2">
      {error && (
        <p className="border border-ink/25 bg-stone-pale/70 px-3 py-2 text-xs text-ink">{error}</p>
      )}
      <button
        onClick={handleNotify}
        disabled={loading}
        className="w-full text-sm font-medium text-white bg-stone px-4 py-2.5 hover:bg-stone/85 disabled:opacity-50 transition-colors"
      >
        {loading ? '提交中…' : '我已完成付款，等待确认'}
      </button>
      <Link
        href="/services"
        className="block w-full text-center text-xs text-ink-faint hover:text-ink-muted py-1"
      >
        返回服务路径
      </Link>
    </div>
  )
}
