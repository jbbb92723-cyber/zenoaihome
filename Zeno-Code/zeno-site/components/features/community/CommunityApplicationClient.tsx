'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SPARK_COMMUNITY_SERVICE_TYPE } from '@/lib/domains/community/constants'

interface ApplicationSummary {
  status: string
  createdAt: string
  responseText: string | null
}

interface OrderSummary {
  orderNo: string
  status: string
}

interface MembershipSummary {
  status: string
  expiresAt: string | null
}

interface Props {
  defaultName: string
  defaultEmail: string
  application: ApplicationSummary | null
  order: OrderSummary | null
  membership: MembershipSummary | null
}

const STATUS_COPY: Record<string, { label: string; title: string; body: string }> = {
  submitted: {
    label: '待初筛',
    title: '申请已经收到',
    body: '我会先看你正在做的事、能提供的能力和当前需要，再决定是否进入面聊。',
  },
  reviewing: {
    label: '待面聊',
    title: '进入双向了解',
    body: '请留意你填写的微信。面聊只确认目标、边界与彼此是否适合，不做销售施压。',
  },
  completed: {
    label: '已通过',
    title: '欢迎成为本期星火者',
    body: '你的首期成员订单已经生成。完成付款并经后台确认后，系统会自动开通 6 个月成员资格。',
  },
  rejected: {
    label: '本期未通过',
    title: '这一次暂时不进入',
    body: '共同体采用小规模双向选择。这不代表能力判断，之后项目阶段变化时可以重新申请。',
  },
}

const ORDER_COPY: Record<string, string> = {
  pending: '待付款',
  pending_confirmation: '款项待确认',
  paid: '已付款',
  processing: '开通处理中',
  completed: '已完成',
  cancelled: '已取消',
  refunded: '已退款',
}

export default function CommunityApplicationClient({
  defaultName,
  defaultEmail,
  application,
  order,
  membership,
}: Props) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const activeMember = membership?.status === 'active'
  const canApply = !application || application.status === 'rejected'
  const statusCopy = application ? STATUS_COPY[application.status] : null

  async function submitApplication(formData: FormData) {
    setSubmitting(true)
    setError('')

    const currentWork = String(formData.get('currentWork') ?? '').trim()
    const canOffer = String(formData.get('canOffer') ?? '').trim()
    const needs = String(formData.get('needs') ?? '').trim()
    const reason = String(formData.get('reason') ?? '').trim()
    const message = [
      `正在做：${currentWork}`,
      `能提供：${canOffer}`,
      `正在寻找：${needs}`,
      `加入原因：${reason}`,
    ].join('\n')

    try {
      const response = await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: SPARK_COMMUNITY_SERVICE_TYPE,
          name: String(formData.get('name') ?? ''),
          wechat: String(formData.get('wechat') ?? ''),
          email: defaultEmail,
          message,
        }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok && response.status !== 409) {
        setError(data.error || '提交失败，请稍后重试')
        return
      }

      router.refresh()
    } catch {
      setError('网络错误，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  if (activeMember) {
    return (
      <section className="border-y border-border py-10">
        <p className="text-sm font-semibold text-stone">成员状态</p>
        <h2 className="editorial-display mt-4 text-[2rem] leading-tight text-ink">你已经是星火者成员</h2>
        <p className="mt-4 text-sm leading-7 text-ink-muted">
          当前资格有效
          {membership.expiresAt ? `至 ${new Date(membership.expiresAt).toLocaleDateString('zh-CN')}` : ''}。
        </p>
        <Link href="/account" className="mt-7 inline-flex min-h-11 items-center bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-stone-deep">
          查看我的账户
        </Link>
      </section>
    )
  }

  return (
    <div className="space-y-12">
      {application && statusCopy && (
        <section className="border-y border-border py-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-stone">申请进度</p>
            <span className="border border-border px-3 py-1 text-xs font-semibold text-ink-muted">{statusCopy.label}</span>
          </div>
          <h2 className="editorial-display mt-4 text-[2rem] leading-tight text-ink">{statusCopy.title}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-muted">{application.responseText || statusCopy.body}</p>
          <p className="mt-5 text-xs text-ink-faint">申请时间：{new Date(application.createdAt).toLocaleDateString('zh-CN')}</p>

          {order && (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
              <div>
                <p className="text-sm font-semibold text-ink">首期成员订单</p>
                <p className="mt-1 text-xs text-ink-muted">{order.orderNo} · {ORDER_COPY[order.status] ?? order.status}</p>
              </div>
              <Link href={`/order/${order.orderNo}`} className="inline-flex min-h-11 items-center bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-stone-deep">
                查看订单
              </Link>
            </div>
          )}
        </section>
      )}

      {canApply && (
        <section>
          <p className="text-sm font-semibold text-stone">成员申请</p>
          <h2 className="editorial-display mt-4 text-[2rem] leading-tight text-ink">把你正在做的事说清楚</h2>

          <form action={submitApplication} className="mt-8 space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold text-ink">
                你的名字
                <input name="name" defaultValue={defaultName} required maxLength={50} className="mt-2 w-full border border-border bg-surface px-4 py-3 text-sm font-normal text-ink outline-none focus:border-stone" />
              </label>
              <label className="text-sm font-semibold text-ink">
                微信号
                <input name="wechat" required maxLength={50} className="mt-2 w-full border border-border bg-surface px-4 py-3 text-sm font-normal text-ink outline-none focus:border-stone" />
              </label>
            </div>

            <label className="block text-sm font-semibold text-ink">
              你现在具体在做什么
              <textarea name="currentWork" required maxLength={220} rows={3} className="mt-2 w-full resize-y border border-border bg-surface px-4 py-3 text-sm font-normal leading-6 text-ink outline-none focus:border-stone" />
            </label>
            <label className="block text-sm font-semibold text-ink">
              你能为其他成员提供什么
              <textarea name="canOffer" required maxLength={220} rows={3} className="mt-2 w-full resize-y border border-border bg-surface px-4 py-3 text-sm font-normal leading-6 text-ink outline-none focus:border-stone" />
            </label>
            <label className="block text-sm font-semibold text-ink">
              你现在最需要什么
              <textarea name="needs" required maxLength={220} rows={3} className="mt-2 w-full resize-y border border-border bg-surface px-4 py-3 text-sm font-normal leading-6 text-ink outline-none focus:border-stone" />
            </label>
            <label className="block text-sm font-semibold text-ink">
              为什么想加入星火者
              <textarea name="reason" required maxLength={300} rows={4} className="mt-2 w-full resize-y border border-border bg-surface px-4 py-3 text-sm font-normal leading-6 text-ink outline-none focus:border-stone" />
            </label>

            {error && <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            <button type="submit" disabled={submitting} className="inline-flex min-h-11 items-center bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-stone-deep disabled:opacity-50">
              {submitting ? '提交中...' : '提交成员申请'}
            </button>
          </form>
        </section>
      )}
    </div>
  )
}
