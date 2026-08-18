'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'

type ContentType = 'risk' | 'case'

type GeneratedDraft = {
  id: string
  contentId: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  status: string
  approvalStatus: string
  qualitySummary: string | null
  metaTitle: string | null
  metaDescription: string | null
  canonicalUrl: string | null
  createdAt: string
}

type ContentAssistantResponse = {
  ok?: boolean
  error?: string
  draft?: GeneratedDraft
  jsonLd?: unknown[]
  targetPath?: string
}

const inputClassName = 'w-full border border-[#3A3530] bg-[#252320] px-3 py-2.5 text-sm text-[#E8E2DA] placeholder-[#706860] focus:border-[#C4A882] focus:outline-none'
const labelClassName = 'mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#706860]'

export default function ContentAssistantForm() {
  const [contentType, setContentType] = useState<ContentType>('risk')
  const [workingTitle, setWorkingTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [rawNotes, setRawNotes] = useState('')
  const [photoObservations, setPhotoObservations] = useState('')
  const [voiceTranscript, setVoiceTranscript] = useState('')
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<ContentAssistantResponse | null>(null)
  const [editableMarkdown, setEditableMarkdown] = useState('')
  const [copied, setCopied] = useState<'markdown' | 'jsonld' | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const plannedPath = contentType === 'risk'
    ? `/risk-dictionary/${slug || 'your-slug'}`
    : `/blog/${slug || 'your-slug'}`

  async function copyText(kind: 'markdown' | 'jsonld', value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(kind)
      window.setTimeout(() => setCopied(null), 1600)
    } catch {
      setError('浏览器未允许复制，请在文本框中手动选择内容。')
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setResult(null)
    setCopied(null)
    setSaved(false)
    setGenerating(true)

    try {
      const response = await fetch('/api/admin/content-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType,
          workingTitle: workingTitle.trim(),
          slug: slug.trim().toLowerCase(),
          rawNotes: rawNotes.trim(),
          photoObservations: photoObservations.trim() || undefined,
          voiceTranscript: voiceTranscript.trim() || undefined,
        }),
      })
      const data = await response.json().catch(() => ({})) as ContentAssistantResponse

      if (!response.ok || !data.draft || !data.jsonLd) {
        setError(data.error ?? '草稿生成失败，请稍后重试。')
        return
      }

      setResult(data)
      setEditableMarkdown(data.draft.content)
    } catch {
      setError('网络连接中断，草稿没有创建。请重试。')
    } finally {
      setGenerating(false)
    }
  }

  async function saveMarkdown() {
    if (!result?.draft || saving || editableMarkdown === result.draft.content) return

    setError('')
    setSaved(false)
    setSaving(true)

    try {
      const response = await fetch('/api/admin/content-assistant', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftId: result.draft.id,
          content: editableMarkdown,
        }),
      })
      const data = await response.json().catch(() => ({})) as ContentAssistantResponse

      if (!response.ok) {
        setError(data.error ?? '草稿保存失败，请稍后重试。')
        return
      }

      setResult((previous) => previous?.draft
        ? {
            ...previous,
            draft: { ...previous.draft, content: editableMarkdown },
          }
        : previous)
      setSaved(true)
    } catch {
      setError('网络连接中断，校对内容尚未保存。请重试。')
    } finally {
      setSaving(false)
    }
  }

  const jsonLdText = result?.jsonLd ? JSON.stringify(result.jsonLd, null, 2) : ''

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6 border border-[#3A3530] bg-[#252320] p-5 sm:p-6">
        <div className="border-l-2 border-[#C4A882] pl-4">
          <p className="text-sm font-semibold text-[#E8E2DA]">影子 Zeno 只整理你提供的事实</p>
          <p className="mt-1 text-xs leading-6 text-[#A09890]">
            输出会直接保存为待人工审批草稿，不会发布到网站、公众号或其他渠道。信息不足处应标记为 [待核对]。
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="content-type" className={labelClassName}>内容类型 *</label>
            <select
              id="content-type"
              value={contentType}
              onChange={(event) => setContentType(event.target.value as ContentType)}
              className={inputClassName}
            >
              <option value="risk">风险判断</option>
              <option value="case">案例复盘</option>
            </select>
          </div>

          <div>
            <label htmlFor="working-title" className={labelClassName}>工作标题 *</label>
            <input
              id="working-title"
              value={workingTitle}
              onChange={(event) => setWorkingTitle(event.target.value)}
              maxLength={160}
              required
              placeholder="例如：报价里的按实结算为什么要先问清"
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <label htmlFor="slug" className={labelClassName}>Slug *</label>
          <input
            id="slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value.toLowerCase())}
            maxLength={160}
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            required
            placeholder="actual-settlement-risk"
            className={`${inputClassName} font-mono`}
          />
          <p className="mt-1.5 text-xs text-[#706860]">
            仅使用小写字母、数字和连字符。计划路径：<span className="font-mono text-[#A09890]">{plannedPath}</span>
          </p>
        </div>

        <div>
          <label htmlFor="raw-notes" className={labelClassName}>原始素材 *</label>
          <textarea
            id="raw-notes"
            value={rawNotes}
            onChange={(event) => setRawNotes(event.target.value)}
            rows={12}
            maxLength={30_000}
            minLength={10}
            required
            placeholder="粘贴现场记录、报价原文、当时的判断依据和仍不确定的地方。不要为了完整而补写事实。"
            className={`${inputClassName} resize-y font-mono leading-6`}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label htmlFor="photo-observations" className={labelClassName}>照片观察（可选）</label>
            <textarea
              id="photo-observations"
              value={photoObservations}
              onChange={(event) => setPhotoObservations(event.target.value)}
              rows={7}
              maxLength={10_000}
              placeholder="粘贴你对照片的文字观察，例如可见位置、状态和无法确认之处。"
              className={`${inputClassName} resize-y leading-6`}
            />
            <p className="mt-1.5 text-xs leading-5 text-[#706860]">
              这里不上传或识别图片，AI 只能读取你粘贴的文字。
            </p>
          </div>

          <div>
            <label htmlFor="voice-transcript" className={labelClassName}>语音转写（可选）</label>
            <textarea
              id="voice-transcript"
              value={voiceTranscript}
              onChange={(event) => setVoiceTranscript(event.target.value)}
              rows={7}
              maxLength={20_000}
              placeholder="粘贴已经完成的语音转写；口误、听不清和待确认内容请保留标记。"
              className={`${inputClassName} resize-y leading-6`}
            />
            <p className="mt-1.5 text-xs leading-5 text-[#706860]">
              这里不录音，也不提供语音转写，只接收已有的文字转写。
            </p>
          </div>
        </div>

        {error && !result && (
          <p role="alert" className="border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 border-t border-[#3A3530] pt-5">
          <button
            type="submit"
            disabled={generating}
            className="border border-[#C4A882]/40 bg-[#C4A882]/15 px-5 py-2.5 text-sm font-semibold text-[#C4A882] transition-colors hover:bg-[#C4A882]/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generating ? '正在整理并保存…' : '生成待审批草稿'}
          </button>
          <Link href="/admin/content" className="text-sm text-[#706860] transition-colors hover:text-[#A09890]">
            返回内容草稿
          </Link>
        </div>
      </form>

      {result?.draft && result.jsonLd && (
        <section className="space-y-6 border border-[#3A3530] bg-[#252320] p-5 sm:p-6" aria-live="polite">
          <div className="flex flex-col gap-3 border-b border-[#3A3530] pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#C4A882]">已保存 · 待人工审批</p>
              <h2 className="mt-2 text-lg font-semibold text-[#E8E2DA]">{result.draft.title}</h2>
              <p className="mt-1 font-mono text-xs text-[#706860]">{result.draft.contentId}</p>
            </div>
            <Link
              href="/admin/content"
              className="inline-flex min-h-10 items-center border border-[#3A3530] px-4 text-sm text-[#A09890] transition-colors hover:border-[#C4A882]/50 hover:text-[#E8E2DA]"
            >
              查看草稿列表
            </Link>
          </div>

          {error && (
            <p role="alert" className="border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <dl className="grid gap-px border border-[#3A3530] bg-[#3A3530] sm:grid-cols-2">
            {[
              ['状态', `${result.draft.status} / ${result.draft.approvalStatus}`],
              ['计划路径', result.targetPath ?? '—'],
              ['Meta title', result.draft.metaTitle ?? '—'],
              ['Canonical', result.draft.canonicalUrl ?? '—'],
            ].map(([label, value]) => (
              <div key={label} className="min-w-0 bg-[#1C1A17] p-4">
                <dt className="text-xs text-[#706860]">{label}</dt>
                <dd className="mt-1 break-words text-sm text-[#A09890]">{value}</dd>
              </div>
            ))}
          </dl>

          {result.draft.qualitySummary && (
            <p className="border-l-2 border-[#C4A882] pl-4 text-sm leading-6 text-[#A09890]">
              {result.draft.qualitySummary}
            </p>
          )}

          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-[#E8E2DA]">Markdown 草稿</h3>
                <p className="mt-1 text-xs text-[#706860]">校对后保存，修改会继续留在同一份待审批草稿中。</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {saved && <span className="text-xs text-green-400">校对已保存</span>}
                <button
                  type="button"
                  onClick={saveMarkdown}
                  disabled={saving || editableMarkdown.trim().length < 10 || editableMarkdown === result.draft.content}
                  className="min-h-9 border border-[#C4A882]/40 px-3 text-xs font-semibold text-[#C4A882] transition-colors hover:bg-[#C4A882]/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {saving ? '保存中…' : '保存校对'}
                </button>
                <button
                  type="button"
                  onClick={() => copyText('markdown', editableMarkdown)}
                  className="min-h-9 border border-[#3A3530] px-3 text-xs text-[#A09890] transition-colors hover:border-[#C4A882]/50 hover:text-[#E8E2DA]"
                >
                  {copied === 'markdown' ? '已复制' : '复制 Markdown'}
                </button>
              </div>
            </div>
            <textarea
              value={editableMarkdown}
              onChange={(event) => {
                setEditableMarkdown(event.target.value)
                setSaved(false)
              }}
              maxLength={60_000}
              rows={24}
              className={`${inputClassName} resize-y font-mono leading-6`}
            />
          </div>

          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-[#E8E2DA]">JSON-LD 候选数据</h3>
                <p className="mt-1 text-xs text-[#706860]">由服务器按标题、类型和 slug 确定性构建，正式发布时仍需核对。</p>
              </div>
              <button
                type="button"
                onClick={() => copyText('jsonld', jsonLdText)}
                className="min-h-9 border border-[#3A3530] px-3 text-xs text-[#A09890] transition-colors hover:border-[#C4A882]/50 hover:text-[#E8E2DA]"
              >
                {copied === 'jsonld' ? '已复制' : '复制 JSON-LD'}
              </button>
            </div>
            <textarea
              value={jsonLdText}
              readOnly
              rows={18}
              className={`${inputClassName} resize-y font-mono leading-6 text-[#A09890]`}
            />
          </div>
        </section>
      )}
    </div>
  )
}
