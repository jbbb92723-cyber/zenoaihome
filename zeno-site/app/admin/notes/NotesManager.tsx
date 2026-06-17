'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type NoteListItem = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  category: string | null
  tags: string[]
  visibility: 'PUBLIC' | 'PRIVATE' | 'DRAFT'
  featured: boolean
  createdAt: string
  updatedAt: string
}

const CATEGORIES = ['AI实践', '装修洞察', '商业判断', '方法论', '读书笔记', '生活观察']

/* 简单中文→拼音 slug：取标题首 6 个中文字转拼音首字母，不够就补时间 */
function slugFromTitle(title: string): string {
  const cleaned = title.trim().replace(/\s+/g, '-')
  if (/^[a-z0-9-]+$/i.test(cleaned) && cleaned.length >= 3) return cleaned.toLowerCase()
  // 中文标题 -> 用拼音首字母拼
  const cn = title.replace(/[^一-鿿]/g, '')
  if (cn.length === 0) return title.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40) || 'note'
  // 简化的拼音映射（常见字）
  const map: Record<string, string> = {
    装:'z',修:'x',报:'b',价:'j',单:'d',风:'f',险:'x',合:'h',同:'t',材:'c',料:'l',
    水:'s',电:'d',工:'g',验:'y',收:'s',付:'f',款:'k',增:'z',项:'x',漏:'l',补:'b',
    设:'s',计:'j',方:'f',案:'a',预:'y',算:'s',拆:'c',改:'g',防:'f',保:'b',
    空:'k',间:'j',居:'j',住:'z',生:'s',活:'h',美:'m',学:'x',家:'j',庭:'t',厨:'c',
    卫:'w',阳:'y',台:'t',卧:'w',室:'s',客:'k',厅:'t',餐:'c',书:'s',房:'f',
    判:'p',断:'d',笔:'b',记:'j',人:'r',一:'y',公:'g',司:'s',A:'a',I:'i',O:'o',P:'p',C:'c',
    我:'w',看:'k',只:'z',三:'s',行:'h',在:'z',南:'n',宁:'n',见:'j',过:'g',最:'z',坏:'h',
    上:'s',限:'x',没:'m',有:'y',那:'n',天:'t',从:'c',起:'q',每:'m',份:'f',先:'x',找:'z',
  }
  const initials = cn.split('').map(c => map[c] || 'x').join('')
  const timestamp = Date.now().toString(36).slice(-4)
  return initials.slice(0, 30) + '-' + timestamp
}

export default function NotesManager() {
  const [notes, setNotes] = useState<NoteListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<NoteListItem | null>(null)
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState('')
  const [previewTab, setPreviewTab] = useState<'edit' | 'preview' | 'split'>('split')

  // 表单
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE' | 'DRAFT'>('DRAFT')
  const [featured, setFeatured] = useState(false)

  const wordCount = useMemo(() => content.replace(/\s/g, '').length, [content])
  const readTime = useMemo(() => Math.max(1, Math.ceil(wordCount / 400)), [wordCount])

  const fetchNotes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/notes')
      if (res.ok) setNotes(await res.json())
    } catch { /* ignore */ } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchNotes() }, [fetchNotes])

  function resetForm() {
    setTitle(''); setSlug(''); setExcerpt(''); setContent('')
    setCategory(''); setTags(''); setVisibility('DRAFT'); setFeatured(false)
    setEditing(null); setCreating(false)
  }

  function startEdit(note: NoteListItem) {
    setEditing(note); setCreating(false)
    setTitle(note.title); setSlug(note.slug); setExcerpt(note.excerpt ?? '')
    setContent(note.content); setCategory(note.category ?? '')
    setTags(note.tags.join(', ')); setVisibility(note.visibility); setFeatured(note.featured)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function startCreate() {
    resetForm(); setCreating(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleTitleChange(value: string) {
    setTitle(value)
    // 只在新建时自动生成 slug（编辑时保留原有 slug）
    if (!editing) setSlug(slugFromTitle(value))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setMessage('')
    if (!title.trim() || !slug.trim() || !content.trim()) {
      setMessage('标题、slug 和正文为必填'); return
    }

    const body = {
      title: title.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      excerpt: excerpt.trim() || null,
      content: content.trim(),
      category: category || null,
      tags: tags.split(',').map(s => s.trim()).filter(Boolean),
      visibility,
      featured,
    }

    try {
      const url = editing ? `/api/admin/notes/${editing.id}` : '/api/admin/notes'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) { setMessage(data.error || '保存失败'); return }
      setMessage(editing ? '已更新' : '已创建')
      resetForm(); fetchNotes()
    } catch { setMessage('网络错误') }
  }

  async function handleDelete(id: string, t: string) {
    if (!confirm(`确定删除「${t}」？不可撤销。`)) return
    try {
      const res = await fetch(`/api/admin/notes/${id}`, { method: 'DELETE' })
      if (res.ok) { setMessage('已删除'); fetchNotes() }
    } catch { setMessage('删除失败') }
  }

  const showEditor = creating || editing

  return (
    <div className="space-y-8">
      {/* 顶栏 */}
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={startCreate} className="text-sm font-medium text-white bg-stone px-5 py-2.5 hover:bg-stone/85 transition-colors">
          + 新建笔记
        </button>
        <button onClick={fetchNotes} disabled={loading} className="text-sm text-ink-muted border border-border px-4 py-2 hover:border-stone transition-colors">
          刷新列表
        </button>
        {showEditor && (
          <span className="ml-auto text-xs text-ink-muted">
            正文 {wordCount} 字 · 约 {readTime} 分钟
          </span>
        )}
      </div>

      {message && (
        <div className={`px-4 py-3 text-sm ${
          message.includes('失败') || message.includes('错误') || message.includes('必填')
            ? 'border border-red-200 bg-red-50 text-red-700'
            : 'border border-green-200 bg-green-50 text-green-700'
        }`}>{message}</div>
      )}

      {/* 编辑器 */}
      {showEditor && (
        <form onSubmit={handleSubmit} className="border border-border bg-surface">
          {/* 元信息行 */}
          <div className="px-6 pt-6 grid gap-4 sm:grid-cols-[1fr_auto]">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1.5">标题</label>
              <input
                type="text" value={title}
                onChange={e => handleTitleChange(e.target.value)}
                className="w-full text-lg font-semibold text-ink bg-canvas border border-border px-3 py-2.5 focus:outline-none focus:border-stone"
                placeholder="这篇判断笔记叫什么？"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:w-56">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1.5">状态</label>
                <select value={visibility} onChange={e => setVisibility(e.target.value as 'PUBLIC' | 'PRIVATE' | 'DRAFT')}
                  className="w-full text-sm text-ink bg-canvas border border-border px-2 py-2.5 focus:outline-none focus:border-stone">
                  <option value="DRAFT">草稿</option>
                  <option value="PUBLIC">公开</option>
                  <option value="PRIVATE">私有</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1.5">分类</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full text-sm text-ink bg-canvas border border-border px-2 py-2.5 focus:outline-none focus:border-stone">
                  <option value="">无</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* slug + 标签 */}
          <div className="px-6 pt-4 grid gap-4 sm:grid-cols-[1fr_1fr_auto] items-end">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1.5">slug</label>
              <input type="text" value={slug} onChange={e => setSlug(e.target.value)}
                className="w-full text-sm font-mono text-ink-muted bg-canvas border border-border px-3 py-2 focus:outline-none focus:border-stone"
                placeholder="auto-generated" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1.5">标签（逗号分）</label>
              <input type="text" value={tags} onChange={e => setTags(e.target.value)}
                className="w-full text-sm text-ink bg-canvas border border-border px-3 py-2 focus:outline-none focus:border-stone"
                placeholder="装修, 报价, 水电, 判断" />
            </div>
            <label className="flex items-center gap-2 text-sm text-ink-muted cursor-pointer pb-2">
              <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="accent-stone" />
              精选
            </label>
          </div>

          {/* 摘要 */}
          <div className="px-6 pt-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1.5">摘要（列表展示用）</label>
            <input type="text" value={excerpt} onChange={e => setExcerpt(e.target.value)}
              className="w-full text-sm text-ink bg-canvas border border-border px-3 py-2 focus:outline-none focus:border-stone"
              placeholder="一句话说清这篇笔记在判断什么" />
          </div>

          {/* 双栏编辑区 */}
          <div className="px-6 pt-6 pb-2 flex items-center gap-4 border-b border-border">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone">正文</span>
            <div className="flex gap-1 bg-stone-pale rounded p-0.5">
              {(['edit', 'split', 'preview'] as const).map(tab => (
                <button key={tab} type="button"
                  onClick={() => setPreviewTab(tab)}
                  className={`px-3 py-1 text-xs transition-colors ${
                    previewTab === tab ? 'bg-canvas text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
                  }`}>
                  {tab === 'edit' ? '编辑' : tab === 'split' ? '双栏' : '预览'}
                </button>
              ))}
            </div>
          </div>

          <div className={`grid ${previewTab === 'split' ? 'grid-cols-2' : 'grid-cols-1'} divide-x divide-border min-h-[32rem]`}>
            {/* 编辑区 */}
            {(previewTab === 'edit' || previewTab === 'split') && (
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full min-h-[32rem] text-sm text-ink bg-canvas px-6 py-4 focus:outline-none font-mono leading-relaxed resize-y"
                placeholder="今天又看了一份报价..."
              />
            )}
            {/* 预览区 */}
            {(previewTab === 'preview' || previewTab === 'split') && (
              <div className="min-h-[32rem] bg-canvas px-6 py-4 overflow-auto">
                {content.trim() ? (
                  <div className="prose prose-sm prose-stone max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm text-ink-faint italic">预览会在这里显示。开始写正文。</p>
                )}
              </div>
            )}
          </div>

          {/* 底部操作栏 */}
          <div className="px-6 py-4 border-t border-border flex flex-wrap gap-3 items-center">
            <button type="submit"
              className="text-sm font-medium text-white bg-stone px-6 py-2.5 hover:bg-stone/85 transition-colors">
              {editing ? '保存修改' : '创建并发布'}
            </button>
            <button type="button" onClick={resetForm}
              className="text-sm text-ink-muted border border-border px-4 py-2 hover:border-stone transition-colors">
              取消
            </button>
            {editing && (
              <button type="button" onClick={() => handleDelete(editing.id, editing.title)}
                className="text-sm text-red-600 border border-red-200 px-4 py-2 hover:bg-red-50 transition-colors ml-auto">
                删除这篇
              </button>
            )}
            <span className="text-xs text-ink-faint ml-auto">
              {wordCount} 字 · {readTime} 分钟 · 写完后看一眼：有没有 AI 写不出来的真东西？
            </span>
          </div>
        </form>
      )}

      {/* 笔记列表 */}
      <div className="border border-border">
        <div className="px-5 py-3 border-b border-border bg-surface-warm flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">全部笔记（{notes.length} 篇）</p>
          {notes.length > 0 && (
            <span className="text-[0.6rem] text-ink-faint">
              公开 {notes.filter(n => n.visibility === 'PUBLIC').length} · 草稿 {notes.filter(n => n.visibility === 'DRAFT').length} · 私有 {notes.filter(n => n.visibility === 'PRIVATE').length}
            </span>
          )}
        </div>
        {loading ? (
          <div className="px-5 py-12 text-center text-sm text-ink-muted">加载中...</div>
        ) : notes.length === 0 ? (
          <div className="px-5 py-12 text-center space-y-3">
            <p className="text-sm text-ink-muted">还没有笔记。</p>
            <p className="text-xs text-ink-faint">点击「+ 新建笔记」发布你的第一篇判断笔记。</p>
            <p className="text-xs text-ink-faint">建议第一篇：我看报价单只看三行 —— 700 字，四层读者自己在了。</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notes.map(note => (
              <div key={note.id} className="px-5 py-4 flex items-start justify-between gap-4 hover:bg-surface-warm/50 transition-colors group">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-ink truncate">{note.title}</h3>
                    <span className={`text-[0.6rem] font-semibold uppercase tracking-wider px-1.5 py-0.5 ${
                      note.visibility === 'PUBLIC' ? 'text-green-700 bg-green-50 border border-green-200' :
                      note.visibility === 'PRIVATE' ? 'text-amber-700 bg-amber-50 border border-amber-200' :
                      'text-stone/60 bg-stone-pale border border-stone/20'
                    }`}>
                      {note.visibility === 'PUBLIC' ? '公开' : note.visibility === 'PRIVATE' ? '私有' : '草稿'}
                    </span>
                    {note.featured && <span className="text-[0.6rem] font-semibold text-ink bg-ink/5 px-1.5 py-0.5">精选</span>}
                  </div>
                  {note.excerpt && <p className="text-xs text-ink-muted truncate mt-1">{note.excerpt}</p>}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {note.category && <span className="text-[0.6rem] text-stone bg-stone-pale px-1.5 py-0.5">{note.category}</span>}
                    <span className="text-[0.6rem] text-ink-faint">{new Date(note.createdAt).toLocaleDateString('zh-CN')}</span>
                    <span className="text-[0.6rem] text-ink-faint font-mono">/{note.slug}</span>
                  </div>
                </div>
                <button onClick={() => startEdit(note)}
                  className="shrink-0 text-xs text-stone border border-stone/30 px-3 py-1.5 hover:bg-stone-pale/50 transition-colors opacity-0 group-hover:opacity-100">
                  编辑
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
