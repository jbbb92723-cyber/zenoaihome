'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Prohibit, Trash } from '@phosphor-icons/react'

export type ModerationComment = {
  id: string
  articleSlug: string
  content: string
  status: string
  moderationNote: string | null
  createdAt: string
  moderatedAt: string | null
  user: { id: string; name: string | null; email: string }
  moderator: { name: string | null; email: string } | null
}

const STATUS_LABEL: Record<string, string> = {
  pending: '待审核', approved: '已公开', rejected: '已拒绝', spam: '垃圾评论',
}

const STATUS_COLOR: Record<string, string> = {
  pending: 'text-[#C4A882]', approved: 'text-green-400', rejected: 'text-[#A09890]', spam: 'text-red-400',
}

const ACTIONS = [
  { status: 'approved', label: '通过', icon: Check, className: 'border-green-400/30 text-green-400 hover:bg-green-400/10' },
  { status: 'rejected', label: '拒绝', icon: Prohibit, className: 'border-[#3A3530] text-[#A09890] hover:text-[#E8E2DA]' },
  { status: 'spam', label: '垃圾', icon: Trash, className: 'border-red-400/30 text-red-400 hover:bg-red-400/10' },
]

export default function CommentModerationList({ comments }: { comments: ModerationComment[] }) {
  const router = useRouter()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [notice, setNotice] = useState('')

  async function moderate(id: string, status: string) {
    if (busyId) return
    setBusyId(id)
    setNotice('')
    try {
      const response = await fetch('/api/admin/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      const data = await response.json().catch(() => ({})) as { message?: string }
      if (!response.ok) {
        setNotice(data.message ?? '操作失败，请稍后重试。')
        return
      }
      router.refresh()
    } catch {
      setNotice('网络错误，请稍后重试。')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-3">
      {notice && <p className="border border-red-400/30 bg-red-400/5 px-4 py-3 text-xs text-red-300">{notice}</p>}
      <div className="overflow-x-auto border border-[#3A3530] bg-[#252320]">
        <table className="w-full min-w-[920px] text-sm">
          <thead><tr className="border-b border-[#3A3530]">
            {['评论 / 文章', '读者', '状态', '时间', '操作'].map((label) => (
              <th key={label} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[#706860]">{label}</th>
            ))}
          </tr></thead>
          <tbody className="divide-y divide-[#3A3530]">
            {comments.map((comment) => (
              <tr key={comment.id} className="align-top hover:bg-[#2A2825]">
                <td className="max-w-[460px] px-4 py-4">
                  <p className="whitespace-pre-wrap leading-6 text-[#E8E2DA]">{comment.content}</p>
                  <p className="mt-2 truncate font-mono text-[0.65rem] text-[#706860]">/blog/{comment.articleSlug}</p>
                  {comment.moderationNote && <p className="mt-2 text-xs text-[#A09890]">备注：{comment.moderationNote}</p>}
                </td>
                <td className="px-4 py-4"><p className="text-xs text-[#E8E2DA]">{comment.user.name || '未填写'}</p><p className="mt-1 max-w-[180px] truncate text-xs text-[#706860]">{comment.user.email}</p></td>
                <td className={`px-4 py-4 text-xs font-semibold ${STATUS_COLOR[comment.status] ?? 'text-[#A09890]'}`}>{STATUS_LABEL[comment.status] ?? comment.status}</td>
                <td className="whitespace-nowrap px-4 py-4 text-xs text-[#706860]">{new Date(comment.createdAt).toLocaleString('zh-CN')}</td>
                <td className="px-4 py-4"><div className="flex flex-wrap gap-2">
                  {ACTIONS.filter((action) => action.status !== comment.status).map((action) => {
                    const Icon = action.icon
                    return <button key={action.status} type="button" onClick={() => moderate(comment.id, action.status)} disabled={busyId === comment.id} className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs transition-colors disabled:opacity-50 ${action.className}`}><Icon size={14} weight="bold" />{action.label}</button>
                  })}
                </div></td>
              </tr>
            ))}
            {comments.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-[#706860]">这个状态下暂无评论。</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[#706860]">审核动作会写入操作日志，评论通过后才会出现在文章页。</p>
    </div>
  )
}
