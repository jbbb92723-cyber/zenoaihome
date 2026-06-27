'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  id: string
  title: string
}

export default function AdminNoteDeleteButton({ id, title }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`确定删除笔记「${title}」？此操作不可撤销。`)) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/notes/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        alert(data.error ?? '删除失败，请重试')
        return
      }
      // 刷新当前页
      router.refresh()
    } catch {
      alert('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs text-red-400/70 hover:text-red-400 transition-colors disabled:opacity-50"
    >
      {loading ? '删除中…' : '删除'}
    </button>
  )
}
