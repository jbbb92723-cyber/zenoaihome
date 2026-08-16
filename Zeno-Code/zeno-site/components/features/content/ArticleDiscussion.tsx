'use client'

import Link from 'next/link'
import { FormEvent, useCallback, useEffect, useState } from 'react'
import { ChatCircleDots, PaperPlaneTilt } from '@phosphor-icons/react'
import { useSession } from 'next-auth/react'

interface Props {
  articleSlug: string
  locale?: 'zh' | 'en'
  articlePathSlug?: string
}

type CommentItem = {
  id: string
  content: string
  createdAt: string
  authorName: string
}

export default function ArticleDiscussion({ articleSlug, locale = 'zh', articlePathSlug = articleSlug }: Props) {
  const isEnglish = locale === 'en'
  const { data: session, status: sessionStatus } = useSession()
  const [comments, setComments] = useState<CommentItem[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const loadComments = useCallback(async () => {
    const response = await fetch(`/api/comments?slug=${encodeURIComponent(articleSlug)}`, { cache: 'no-store' })
    if (response.ok) {
      const data = await response.json() as { comments: CommentItem[] }
      setComments(data.comments)
    }
    setLoading(false)
  }, [articleSlug])

  useEffect(() => {
    loadComments().catch(() => setLoading(false))
  }, [loadComments])

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!content.trim() || submitting) return
    setSubmitting(true)
    setMessage('')
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleSlug, content }),
      })
      const data = await response.json().catch(() => ({})) as { message?: string }
      if (!response.ok) {
        setMessage(data.message ?? (isEnglish ? 'Comment submission failed. Please try again.' : '评论提交失败，请稍后重试。'))
        return
      }
      setContent('')
      setMessage(isEnglish ? 'Received. It will appear here after moderation.' : '已收到。评论通过审核后会显示在这里。')
    } catch {
      setMessage(isEnglish ? 'Network error. Please try again.' : '网络错误，请稍后重试。')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="article-discussion" className="max-w-reading mx-auto px-5 sm:px-8 py-12 border-t border-border scroll-mt-20">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-stone font-medium uppercase tracking-widest mb-2">{isEnglish ? 'Discussion' : '讨论'}</p>
          <h2 className="text-lg font-semibold text-ink">{isEnglish ? 'Leave a concrete question' : '把你的具体问题留下来'}</h2>
          <p className="text-sm text-ink-muted mt-2 leading-relaxed">{isEnglish ? 'Comments are moderated first. Real questions help shape future work.' : '评论先经过审核。真实问题会成为后续判断内容的来源。'}</p>
        </div>
        <ChatCircleDots size={22} className="text-stone shrink-0" aria-hidden />
      </div>

      {loading ? (
        <p className="text-sm text-ink-faint">{isEnglish ? 'Loading discussion...' : '正在读取讨论…'}</p>
      ) : comments.length > 0 ? (
        <div className="border-y border-border mb-7">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-border last:border-0 py-4">
              <div className="flex items-center justify-between gap-3 text-xs text-ink-faint">
                <span className="text-ink-muted">{comment.authorName}</span>
                <time>{new Date(comment.createdAt).toLocaleDateString('zh-CN')}</time>
              </div>
              <p className="text-sm text-ink leading-relaxed mt-2 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-ink-faint border-y border-border py-5 mb-7">{isEnglish ? 'No public discussion yet. Start with the first concrete question.' : '还没有公开讨论。第一个具体问题可以从这里开始。'}</p>
      )}

      {sessionStatus === 'loading' ? null : session?.user ? (
        <form onSubmit={submitComment} className="space-y-3">
          <label htmlFor={`comment-${articleSlug}`} className="sr-only">{isEnglish ? 'Write a comment' : '写下你的评论'}</label>
          <textarea
            id={`comment-${articleSlug}`}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            maxLength={2000}
            rows={4}
            placeholder={isEnglish ? 'What concrete question or unclear step are you working through?' : '说说你遇到的具体问题，或哪一步仍然不清楚。'}
            className="w-full resize-y border border-border bg-surface px-3 py-3 text-sm leading-relaxed text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-stone"
          />
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-ink-faint">{content.length} / 2000</span>
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="inline-flex items-center gap-2 bg-stone px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-stone/85 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PaperPlaneTilt size={14} />
              {submitting ? (isEnglish ? 'Submitting...' : '提交中…') : (isEnglish ? 'Submit comment' : '提交评论')}
            </button>
          </div>
          {message && <p className="text-xs text-ink-muted">{message}</p>}
        </form>
      ) : (
        <div className="border border-border bg-surface-warm px-4 py-4 text-sm text-ink-muted">
          <Link href={`/${isEnglish ? 'en/' : ''}login?callbackUrl=${encodeURIComponent(`/${isEnglish ? 'en/' : ''}blog/${articlePathSlug}#article-discussion`)}`} className="text-stone hover:underline">
            {isEnglish ? 'Sign in to join the discussion' : '登录后参与讨论'}
          </Link>
          <span>{isEnglish ? '. Reading is open without sign-in.' : '。公开阅读不需要登录。'}</span>
        </div>
      )}
    </section>
  )
}
