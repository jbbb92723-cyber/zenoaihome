'use client'

/**
 * NoteForm — 新建 / 编辑笔记的共用表单
 *
 * 新建：传入 defaultValues = undefined，mode = 'create'
 * 编辑：传入已有 note 数据，mode = 'edit'，id = noteId
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { NOTE_CATEGORIES } from '@/lib/notes'
import type { NoteDetail } from '@/lib/notes'

interface Props {
  mode: 'create' | 'edit'
  id?: string
  defaultValues?: Partial<NoteDetail>
}

const VISIBILITY_OPTIONS = [
  { value: 'DRAFT',   label: '草稿（仅后台可见）' },
  { value: 'PRIVATE', label: '私密（仅管理员登录可见）' },
  { value: 'PUBLIC',  label: '公开（所有访客可见）' },
] as const

export default function NoteForm({ mode, id, defaultValues }: Props) {
  const router = useRouter()

  const [title,      setTitle]      = useState(defaultValues?.title      ?? '')
  const [slug,       setSlug]       = useState(defaultValues?.slug       ?? '')
  const [excerpt,    setExcerpt]    = useState(defaultValues?.excerpt    ?? '')
  const [content,    setContent]    = useState(defaultValues?.content    ?? '')
  const [category,   setCategory]   = useState(defaultValues?.category   ?? '')
  const [tags,       setTags]       = useState((defaultValues?.tags ?? []).join(', '))
  const [visibility, setVisibility] = useState<string>(defaultValues?.visibility ?? 'DRAFT')
  const [featured,   setFeatured]   = useState(defaultValues?.featured   ?? false)

  const [saving, setSaving]   = useState(false)
  const [error,  setError]    = useState('')

  // 根据标题自动生成 slug（仅新建模式下，用户未手动修改过时才触发）
  const [slugManual, setSlugManual] = useState(mode === 'edit')

  function handleTitleChange(v: string) {
    setTitle(v)
    if (!slugManual) {
      // 中文转拼音简化：将中文字符删除，英文单词 kebab-case
      const auto = v
        .toLowerCase()
        .replace(/[\u4e00-\u9fff]/g, '-')   // 中文 → 连字符（需用户手动完善）
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
      setSlug(auto)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!title.trim() || !slug.trim() || !content.trim()) {
      setError('标题、slug 和正文为必填项')
      return
    }

    setSaving(true)
    try {
      const payload = {
        title:      title.trim(),
        slug:       slug.trim().toLowerCase(),
        excerpt:    excerpt.trim() || null,
        content:    content,
        category:   category.trim() || null,
        tags:       tags.split(',').map((t) => t.trim()).filter(Boolean),
        visibility,
        featured,
      }

      const url    = mode === 'create' ? '/api/admin/notes' : `/api/admin/notes/${id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data.error ?? '保存失败，请重试')
        return
      }

      // 保存成功，跳回列表
      router.push('/admin/notes')
      router.refresh()
    } catch {
      setError('网络错误，请重试')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">

      {/* 标题 */}
      <div>
        <label className="block text-xs text-[#706860] uppercase tracking-widest mb-1.5">
          标题 *
        </label>
        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="笔记标题"
          required
          className="w-full bg-[#252320] border border-[#3A3530] text-[#E8E2DA] placeholder-[#706860] text-sm px-3 py-2.5 focus:outline-none focus:border-[#C4A882]"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-xs text-[#706860] uppercase tracking-widest mb-1.5">
          Slug * <span className="normal-case tracking-normal text-[#504840]">（URL 唯一标识，建议英文+连字符）</span>
        </label>
        <input
          value={slug}
          onChange={(e) => { setSlug(e.target.value); setSlugManual(true) }}
          placeholder="my-note-slug"
          required
          className="w-full bg-[#252320] border border-[#3A3530] text-[#E8E2DA] placeholder-[#706860] text-sm px-3 py-2.5 focus:outline-none focus:border-[#C4A882] font-mono"
        />
        {slug && (
          <p className="mt-1 text-xs text-[#504840]">
            前台地址：/notes/<span className="text-[#706860]">{slug}</span>
          </p>
        )}
      </div>

      {/* 摘要 */}
      <div>
        <label className="block text-xs text-[#706860] uppercase tracking-widest mb-1.5">
          摘要 <span className="normal-case tracking-normal text-[#504840]">（可选，出现在列表卡片和 SEO description）</span>
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          placeholder="一两句话概括这条笔记的核心…"
          className="w-full bg-[#252320] border border-[#3A3530] text-[#E8E2DA] placeholder-[#706860] text-sm px-3 py-2.5 focus:outline-none focus:border-[#C4A882] resize-none"
        />
      </div>

      {/* 正文（Markdown） */}
      <div>
        <label className="block text-xs text-[#706860] uppercase tracking-widest mb-1.5">
          正文 * <span className="normal-case tracking-normal text-[#504840]">（支持 Markdown）</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={18}
          required
          placeholder="在这里写 Markdown 正文…"
          className="w-full bg-[#252320] border border-[#3A3530] text-[#E8E2DA] placeholder-[#706860] text-sm px-3 py-2.5 focus:outline-none focus:border-[#C4A882] font-mono resize-y"
        />
      </div>

      {/* 分类 + 标签 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[#706860] uppercase tracking-widest mb-1.5">分类</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#252320] border border-[#3A3530] text-[#E8E2DA] text-sm px-3 py-2.5 focus:outline-none focus:border-[#C4A882]"
          >
            <option value="">— 不设分类 —</option>
            {NOTE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-[#706860] uppercase tracking-widest mb-1.5">
            标签 <span className="normal-case tracking-normal text-[#504840]">（逗号分隔）</span>
          </label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="标签A, 标签B, 标签C"
            className="w-full bg-[#252320] border border-[#3A3530] text-[#E8E2DA] placeholder-[#706860] text-sm px-3 py-2.5 focus:outline-none focus:border-[#C4A882]"
          />
        </div>
      </div>

      {/* 可见性 + 精选 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[#706860] uppercase tracking-widest mb-1.5">可见性</label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="w-full bg-[#252320] border border-[#3A3530] text-[#E8E2DA] text-sm px-3 py-2.5 focus:outline-none focus:border-[#C4A882]"
          >
            {VISIBILITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end pb-2.5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 accent-[#C4A882]"
            />
            <span className="text-sm text-[#A09890]">标为精选</span>
          </label>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 px-3 py-2">
          {error}
        </p>
      )}

      {/* 提交按钮 */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 text-sm bg-[#C4A882]/15 text-[#C4A882] border border-[#C4A882]/30 hover:bg-[#C4A882]/20 transition-colors disabled:opacity-50"
        >
          {saving ? '保存中…' : mode === 'create' ? '创建笔记' : '保存更改'}
        </button>
        <a
          href="/admin/notes"
          className="text-sm text-[#706860] hover:text-[#A09890] transition-colors"
        >
          取消
        </a>
      </div>
    </form>
  )
}
