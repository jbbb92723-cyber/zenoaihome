'use client'

/**
 * AdminNoteQuickCreate
 *
 * 嵌入在 /admin/notes 列表页顶部的快速记录表单。
 * 适用场景：在工地/会谈中快速把想法写下来，只填标题+正文，
 * 默认以 DRAFT 状态保存，之后再进完整编辑页补充细节。
 *
 * 比跳转到 /admin/notes/new 的完整表单少至少 2 步操作。
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { NOTE_CATEGORIES } from '@/lib/notes'

export default function AdminNoteQuickCreate() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const [title,      setTitle]      = useState('')
  const [content,    setContent]    = useState('')
  const [category,   setCategory]   = useState('')
  const [visibility, setVisibility] = useState('DRAFT')
  const [saving,     setSaving]     = useState(false)
  const [error,      setError]      = useState('')

  // 将标题转为 slug（去除中文/特殊字符，英文 kebab-case）
  function titleToSlug(t: string) {
    return (
      t
        .toLowerCase()
        .replace(/[\u4e00-\u9fff]+/g, (m) => `-${m.length}-`)  // 中文块转长度标记
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        || `note-${Date.now()}`
    )
  }

  function handleClose() {
    setOpen(false)
    setTitle('')
    setContent('')
    setCategory('')
    setVisibility('DRAFT')
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!title.trim() || !content.trim()) {
      setError('标题和正文不能为空')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title:      title.trim(),
          slug:       titleToSlug(title.trim()),
          content:    content.trim(),
          excerpt:    null,
          category:   category || null,
          tags:       [],
          visibility,
          featured:   false,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        // slug 冲突时自动追加时间戳重试
        if (res.status === 409) {
          const retryRes = await fetch('/api/admin/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title:      title.trim(),
              slug:       `${titleToSlug(title.trim())}-${Date.now()}`,
              content:    content.trim(),
              excerpt:    null,
              category:   category || null,
              tags:       [],
              visibility,
              featured:   false,
            }),
          })
          if (!retryRes.ok) {
            setError('保存失败，请使用完整编辑页')
            return
          }
        } else {
          setError(data.error ?? '保存失败，请重试')
          return
        }
      }

      handleClose()
      router.refresh()
    } catch {
      setError('网络错误，请重试')
    } finally {
      setSaving(false)
    }
  }

  // ── 折叠状态：只显示一个按钮 ──
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full border border-dashed border-[#3A3530] bg-[#1C1A17] text-[#706860] hover:text-[#C4A882] hover:border-[#C4A882]/40 transition-colors py-3 text-sm text-left px-4"
      >
        + 快速记录一条思考…
      </button>
    )
  }

  // ── 展开状态：内联输入表单 ──
  return (
    <form
      onSubmit={handleSubmit}
      className="border border-[#C4A882]/30 bg-[#252320] p-5 space-y-4"
    >
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-[#C4A882] uppercase tracking-widest font-semibold">快速记录</p>
        <button
          type="button"
          onClick={handleClose}
          className="text-xs text-[#706860] hover:text-[#A09890] transition-colors"
        >
          收起
        </button>
      </div>

      {/* 标题 */}
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="标题（必填）"
        required
        className="w-full bg-[#1C1A17] border border-[#3A3530] text-[#E8E2DA] placeholder-[#504840] text-sm px-3 py-2 focus:outline-none focus:border-[#C4A882]"
      />

      {/* 正文 */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        required
        placeholder="正文（支持 Markdown）…"
        className="w-full bg-[#1C1A17] border border-[#3A3530] text-[#E8E2DA] placeholder-[#504840] text-sm px-3 py-2 focus:outline-none focus:border-[#C4A882] font-mono resize-y"
      />

      {/* 分类 + 状态 */}
      <div className="flex flex-wrap gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-[#1C1A17] border border-[#3A3530] text-[#A09890] text-xs px-2 py-1.5 focus:outline-none focus:border-[#C4A882]"
        >
          <option value="">— 分类 —</option>
          {NOTE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="bg-[#1C1A17] border border-[#3A3530] text-[#A09890] text-xs px-2 py-1.5 focus:outline-none focus:border-[#C4A882]"
        >
          <option value="DRAFT">草稿</option>
          <option value="PRIVATE">私密</option>
          <option value="PUBLIC">公开</option>
        </select>

        <p className="text-xs text-[#504840] self-center">Slug 自动生成，保存后可在编辑页修改</p>
      </div>

      {/* 错误提示 */}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      {/* 提交 */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 text-sm bg-[#C4A882]/15 text-[#C4A882] border border-[#C4A882]/30 hover:bg-[#C4A882]/20 transition-colors disabled:opacity-50"
        >
          {saving ? '保存中…' : '保存'}
        </button>
        <button
          type="button"
          onClick={handleClose}
          className="text-sm text-[#706860] hover:text-[#A09890] transition-colors"
        >
          取消
        </button>
      </div>
    </form>
  )
}
