'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Check, LinkSimple, ShareNetwork, ThumbsUp } from '@phosphor-icons/react'

interface Props {
  articleSlug: string
  articleTitle: string
  locale?: 'zh' | 'en'
}

type EngagementState = {
  helpful: number
  comments: number
  hasReacted: boolean
  available?: boolean
}

export default function ArticleEngagement({ articleSlug, articleTitle, locale = 'zh' }: Props) {
  const isEnglish = locale === 'en'
  const [state, setState] = useState<EngagementState>({ helpful: 0, comments: 0, hasReacted: false })
  const [loading, setLoading] = useState(true)
  const [available, setAvailable] = useState(true)
  const [sharing, setSharing] = useState(false)
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'shared' | 'error'>('idle')

  useEffect(() => {
    let active = true
    fetch(`/api/articles/${encodeURIComponent(articleSlug)}/engagement`, { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((data: EngagementState | null) => {
        if (!data) {
          if (active) setAvailable(false)
          return
        }
        if (active) {
          setState(data)
          if (data.available === false) setAvailable(false)
        }
      })
      .catch(() => {
        if (active) setAvailable(false)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [articleSlug])

  async function reactHelpful() {
    const response = await fetch(`/api/articles/${encodeURIComponent(articleSlug)}/engagement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'helpful' }),
    })
    if (response.ok) {
      const data = await response.json() as EngagementState
      setState(data)
      setAvailable(data.available !== false)
    }
  }

  async function trackShare(method: string) {
    await fetch(`/api/articles/${encodeURIComponent(articleSlug)}/engagement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'share', method }),
    }).catch(() => undefined)
  }

  async function copyLink(url: string) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url)
      return
    }

    const input = document.createElement('textarea')
    input.value = url
    input.setAttribute('readonly', '')
    input.style.position = 'fixed'
    input.style.opacity = '0'
    document.body.appendChild(input)
    input.select()
    const copied = document.execCommand('copy')
    input.remove()
    if (!copied) throw new Error('copy failed')
  }

  async function shareArticle() {
    if (sharing) return
    setSharing(true)
    const url = window.location.href
    let usedNativeShare = false
    try {
      if (navigator.share) {
        usedNativeShare = true
        await navigator.share({ title: articleTitle, text: isEnglish ? 'This perspective is worth a look.' : '这篇判断值得你看看。', url })
        setShareState('shared')
        await trackShare('native')
      } else {
        await copyLink(url)
        setShareState('copied')
        await trackShare('copy')
      }
      window.setTimeout(() => setShareState('idle'), 1800)
    } catch {
      // 用户取消系统分享时不显示错误；复制失败时给出可见反馈。
      if (!usedNativeShare) {
        setShareState('error')
        window.setTimeout(() => setShareState('idle'), 1800)
      }
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className="mt-10 border-y border-border py-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          type="button"
          onClick={reactHelpful}
          disabled={loading || !available}
          aria-pressed={state.hasReacted}
          className={`inline-flex items-center gap-1.5 border px-3 py-2 transition-colors ${state.hasReacted ? 'border-stone bg-stone/10 text-stone' : 'border-border text-ink-muted hover:border-stone hover:text-stone'}`}
        >
          {state.hasReacted ? <Check size={15} weight="bold" /> : <ThumbsUp size={15} />}
          <span>{state.hasReacted ? (isEnglish ? 'Marked helpful' : '已标记有帮助') : (isEnglish ? 'Helpful' : '对我有帮助')}</span>
          {available && !loading && <span className="tabular-nums text-ink-faint">{state.helpful}</span>}
        </button>
        <button
          type="button"
          onClick={shareArticle}
          disabled={sharing}
          className="inline-flex items-center gap-1.5 border border-border px-3 py-2 text-ink-muted transition-colors hover:border-stone hover:text-stone disabled:opacity-50"
          title="分享这篇文章"
        >
          {shareState === 'copied' ? <LinkSimple size={15} /> : shareState === 'shared' ? <Check size={15} weight="bold" /> : <ShareNetwork size={15} />}
          <span>{shareState === 'copied' ? (isEnglish ? 'Link copied' : '链接已复制') : shareState === 'shared' ? (isEnglish ? 'Shared' : '已分享') : shareState === 'error' ? (isEnglish ? 'Copy failed' : '复制失败') : (isEnglish ? 'Share' : '分享')}</span>
        </button>
        <Link
          href="#article-discussion"
          className="inline-flex items-center gap-1.5 border border-border px-3 py-2 text-ink-muted transition-colors hover:border-stone hover:text-stone"
        >
          <span>{isEnglish ? 'Discussion' : '评论'}</span>
          {available && !loading && <span className="tabular-nums text-ink-faint">{state.comments}</span>}
        </Link>
        <span className="ml-auto text-ink-faint">{available ? (isEnglish ? 'Public work, not a popularity contest' : '公开内容，不以热度定义价值') : (isEnglish ? 'Engagement is temporarily unavailable' : '互动暂时不可用，文章仍可正常阅读')}</span>
      </div>
    </div>
  )
}
