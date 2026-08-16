'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
  Check,
  CopySimple,
  LinkSimple,
  QrCode as QrCodeIcon,
  ShareNetwork,
  ThumbsUp,
  WechatLogo,
  X,
} from '@phosphor-icons/react'
import QRCode from 'qrcode'

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

type ShareState = 'idle' | 'copied' | 'shared' | 'error'

const RETRY_DELAYS = [0, 500, 1400]

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

export default function ArticleEngagement({ articleSlug, articleTitle, locale = 'zh' }: Props) {
  const isEnglish = locale === 'en'
  const [state, setState] = useState<EngagementState>({ helpful: 0, comments: 0, hasReacted: false })
  const [loading, setLoading] = useState(true)
  const [available, setAvailable] = useState(true)
  const [reactionBusy, setReactionBusy] = useState(false)
  const [reactionMessage, setReactionMessage] = useState('')
  const [shareOpen, setShareOpen] = useState(false)
  const [shareState, setShareState] = useState<ShareState>('idle')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [qrVisible, setQrVisible] = useState(false)

  useEffect(() => {
    let active = true

    async function loadEngagement() {
      for (const delay of RETRY_DELAYS) {
        if (delay) await wait(delay)
        try {
          const response = await fetch(`/api/articles/${encodeURIComponent(articleSlug)}/engagement`, { cache: 'no-store' })
          if (!response.ok) continue
          const data = await response.json() as EngagementState
          if (active) {
            setState(data)
            setAvailable(data.available !== false)
          }
          return
        } catch {
          // A later attempt may land on a healthy serverless instance.
        }
      }
      if (active) setAvailable(false)
    }

    loadEngagement().finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [articleSlug])

  useEffect(() => {
    if (!shareOpen) return

    let active = true
    QRCode.toDataURL(window.location.href, {
      width: 224,
      margin: 1,
      color: { dark: '#2b2926', light: '#ffffff' },
    }).then((dataUrl) => {
      if (active) setQrDataUrl(dataUrl)
    }).catch(() => {
      if (active) setQrDataUrl('')
    })

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setShareOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      active = false
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [shareOpen])

  async function reactHelpful() {
    if (reactionBusy) return
    setReactionBusy(true)
    setReactionMessage('')
    try {
      const response = await fetch(`/api/articles/${encodeURIComponent(articleSlug)}/engagement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'helpful' }),
      })
      const data = await response.json().catch(() => null) as (EngagementState & { message?: string }) | null
      if (!response.ok || !data) {
        setReactionMessage(data?.message ?? (isEnglish ? 'Temporarily unavailable. Try again.' : '暂时无法提交，请再试一次。'))
        return
      }
      setState(data)
      setAvailable(data.available !== false)
    } catch {
      setReactionMessage(isEnglish ? 'Network error. Try again.' : '网络连接失败，请再试一次。')
    } finally {
      setReactionBusy(false)
    }
  }

  async function trackShare(method: string) {
    await fetch(`/api/articles/${encodeURIComponent(articleSlug)}/engagement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'share', method }),
    }).catch(() => undefined)
  }

  async function copyLink() {
    const url = window.location.href
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
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
      setShareState('copied')
      void trackShare('copy')
    } catch {
      setShareState('error')
    }
  }

  async function nativeShare() {
    try {
      if (!navigator.share) {
        await copyLink()
        return
      }
      await navigator.share({
        title: articleTitle,
        text: isEnglish ? 'This perspective is worth a look.' : '这篇判断值得你看看。',
        url: window.location.href,
      })
      setShareState('shared')
      void trackShare('native')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setShareState('error')
    }
  }

  function openWeibo() {
    const target = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(articleTitle)}`
    window.open(target, '_blank', 'noopener,noreferrer')
    void trackShare('weibo')
  }

  function showWechatQr() {
    setQrVisible(true)
    void trackShare('wechat_qr')
  }

  return (
    <>
      <div className="mt-10 border-y border-border py-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={reactHelpful}
            disabled={loading || reactionBusy}
            aria-pressed={state.hasReacted}
            className={`inline-flex items-center gap-1.5 border px-3 py-2 transition-colors disabled:opacity-50 ${state.hasReacted ? 'border-stone bg-stone/10 text-stone' : 'border-border text-ink-muted hover:border-stone hover:text-stone'}`}
          >
            {state.hasReacted ? <Check size={15} weight="bold" /> : <ThumbsUp size={15} />}
            <span>{state.hasReacted ? (isEnglish ? 'Marked helpful' : '已标记有帮助') : (isEnglish ? 'Helpful' : '对我有帮助')}</span>
            {available && !loading && <span className="tabular-nums text-ink-faint">{state.helpful}</span>}
          </button>
          <button
            type="button"
            onClick={() => { setShareOpen(true); setQrVisible(false); setShareState('idle') }}
            className="inline-flex items-center gap-1.5 border border-border px-3 py-2 text-ink-muted transition-colors hover:border-stone hover:text-stone"
            title={isEnglish ? 'Share this article' : '分享这篇文章'}
          >
            <ShareNetwork size={15} />
            <span>{isEnglish ? 'Share' : '分享'}</span>
          </button>
          <Link
            href="#article-discussion"
            className="inline-flex items-center gap-1.5 border border-border px-3 py-2 text-ink-muted transition-colors hover:border-stone hover:text-stone"
          >
            <span>{isEnglish ? 'Discussion' : '评论'}</span>
            {available && !loading && <span className="tabular-nums text-ink-faint">{state.comments}</span>}
          </Link>
          <span className="ml-auto text-ink-faint">{available ? (isEnglish ? 'Public work, not a popularity contest' : '公开内容，不以热度定义价值') : (isEnglish ? 'Counts are reconnecting' : '互动数据正在重新连接')}</span>
        </div>
        {reactionMessage && <p className="mt-2 text-xs text-stone" role="status">{reactionMessage}</p>}
      </div>

      {shareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4" role="dialog" aria-modal="true" aria-labelledby="article-share-title">
          <button type="button" className="absolute inset-0 cursor-default" onClick={() => setShareOpen(false)} aria-label={isEnglish ? 'Close share dialog' : '关闭分享窗口'} />
          <div className="relative z-10 w-full max-w-sm border border-border bg-canvas p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <h2 id="article-share-title" className="text-base font-semibold text-ink">{isEnglish ? 'Share article' : '分享文章'}</h2>
              <button type="button" onClick={() => setShareOpen(false)} className="grid h-8 w-8 place-items-center text-ink-muted hover:text-ink" title={isEnglish ? 'Close' : '关闭'}>
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button type="button" onClick={showWechatQr} className="inline-flex min-h-11 items-center justify-center gap-2 border border-border px-3 py-2 text-sm text-ink-muted hover:border-stone hover:text-stone">
                <WechatLogo size={19} />{isEnglish ? 'WeChat' : '微信'}
              </button>
              <button type="button" onClick={nativeShare} className="inline-flex min-h-11 items-center justify-center gap-2 border border-border px-3 py-2 text-sm text-ink-muted hover:border-stone hover:text-stone">
                <ShareNetwork size={18} />{isEnglish ? 'More apps' : '更多应用'}
              </button>
              <button type="button" onClick={openWeibo} className="inline-flex min-h-11 items-center justify-center gap-2 border border-border px-3 py-2 text-sm text-ink-muted hover:border-stone hover:text-stone">
                <LinkSimple size={18} />{isEnglish ? 'Weibo' : '微博'}
              </button>
              <button type="button" onClick={copyLink} className="inline-flex min-h-11 items-center justify-center gap-2 border border-border px-3 py-2 text-sm text-ink-muted hover:border-stone hover:text-stone">
                {shareState === 'copied' ? <Check size={18} weight="bold" /> : <CopySimple size={18} />}
                {shareState === 'copied' ? (isEnglish ? 'Copied' : '已复制') : (isEnglish ? 'Copy link' : '复制链接')}
              </button>
            </div>

            {qrVisible && (
              <div className="mt-5 border-t border-border pt-5 text-center">
                {qrDataUrl ? <Image src={qrDataUrl} alt={isEnglish ? 'Article QR code' : '文章微信分享二维码'} width={192} height={192} unoptimized className="mx-auto h-48 w-48" /> : <div className="mx-auto grid h-48 w-48 place-items-center bg-surface text-ink-faint"><QrCodeIcon size={32} /></div>}
                <p className="mt-3 text-xs text-ink-muted">{isEnglish ? 'Scan in WeChat' : '微信扫码打开'}</p>
              </div>
            )}
            {shareState === 'shared' && <p className="mt-4 text-center text-xs text-stone" role="status">{isEnglish ? 'Shared' : '已打开系统分享'}</p>}
            {shareState === 'error' && <p className="mt-4 text-center text-xs text-stone" role="status">{isEnglish ? 'Unable to share. Copy the link instead.' : '暂时无法分享，请复制链接。'}</p>}
          </div>
        </div>
      )}
    </>
  )
}
