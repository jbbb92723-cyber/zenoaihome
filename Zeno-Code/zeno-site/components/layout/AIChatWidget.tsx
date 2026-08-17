'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { usePathname } from 'next/navigation'
import {
  ArrowCounterClockwise,
  ArrowRight,
  Brain,
  ChatCircleDots,
  FileText,
  HouseLine,
  PaperPlaneTilt,
  WarningCircle,
  Wrench,
  X,
} from '@phosphor-icons/react'

type ChatActionKind = 'tool' | 'article' | 'resource' | 'service' | 'contact' | 'page'

interface ChatAction {
  label: string
  href: string
  kind: ChatActionKind
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  bullets?: string[]
  actions?: ChatAction[]
  followUps?: string[]
  source?: 'llm' | 'fallback'
}

interface ChatResponse {
  reply: string
  bullets?: string[]
  actions?: ChatAction[]
  followUps?: string[]
  source: 'llm' | 'fallback'
}

interface AssistantRequest {
  message: string
  followUpContext?: string
  history: Array<{ role: 'user' | 'assistant'; content: string }>
}

const SESSION_STORAGE_KEY = 'zeno-assistant-conversation-v1'

const actionKindLabels: Record<'zh' | 'en', Record<ChatActionKind, string>> = {
  zh: {
    tool: '工具',
    article: '文章',
    resource: '资料',
    service: '服务',
    contact: '联系',
    page: '入口',
  },
  en: {
    tool: 'Tool',
    article: 'Article',
    resource: 'Resource',
    service: 'Service',
    contact: 'Contact',
    page: 'Page',
  },
}

const quickEntriesZh = [
  {
    label: '生活与方案',
    description: '先把谁在住、怎么住和最重要的取舍说清楚。',
    prompt: '我还没定装修方案。请先从家庭成员、生活习惯、空间优先级和预算取舍里，问我一个最关键的问题。',
    icon: HouseLine,
  },
  {
    label: '报价与工程',
    description: '从范围、工艺、材料、变更和付款节点开始核对。',
    prompt: '我手上有一份装修报价单。请先问我目前有哪些材料，再判断第一步应该核对范围、工艺、材料、增项还是付款节点。',
    icon: FileText,
  },
  {
    label: 'AI 与工作',
    description: '拆清输入、验收标准，以及必须由人负责的部分。',
    prompt: '我在传统行业里有一项重复工作，想判断 AI 能不能帮我做。请先问我一个最关键的问题，再拆分 AI 可以做、必须由人负责和需要验证的部分。',
    icon: Wrench,
  },
]

const quickEntriesEn = [
  {
    label: 'Living and design',
    description: 'Clarify who lives there, how life works and the main tradeoff.',
    prompt: 'I have not fixed the renovation plan. Ask me the single most important question about household, routines, spatial priorities or budget tradeoffs.',
    icon: HouseLine,
  },
  {
    label: 'Quote and delivery',
    description: 'Check scope, process, materials, changes and payment milestones.',
    prompt: 'I have a renovation quote. First ask what materials I have, then decide whether scope, process, materials, change orders or payment milestones should be checked first.',
    icon: FileText,
  },
  {
    label: 'AI and real work',
    description: 'Separate inputs, acceptance criteria and human responsibility.',
    prompt: 'I have a repetitive task in a traditional industry. Ask me the single most important question, then separate what AI can do, what a person must own and what needs testing.',
    icon: Wrench,
  },
]

function toHistoryContent(message: Message) {
  const bullets = message.bullets?.map((item) => `- ${item}`) ?? []
  return [message.content, ...bullets].filter(Boolean).join('\n')
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [failedRequest, setFailedRequest] = useState<AssistantRequest | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const pathname = usePathname()

  const isEn = pathname.startsWith('/en')
  const quickEntries = isEn ? quickEntriesEn : quickEntriesZh
  const locale = isEn ? 'en' : 'zh'

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(SESSION_STORAGE_KEY)
      if (!saved) return
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) setMessages(parsed.slice(-24))
    } catch {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    try {
      if (messages.length === 0) {
        window.sessionStorage.removeItem(SESSION_STORAGE_KEY)
      } else {
        window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(messages.slice(-24)))
      }
    } catch {
      // The assistant still works when browser storage is unavailable.
    }
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, error])

  useEffect(() => {
    if (!open) return

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 120)

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', handleEscape)
    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  if (pathname.startsWith('/admin')) return null

  function resetConversation() {
    setMessages([])
    setInput('')
    setError(null)
    setFailedRequest(null)
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY)
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }

  async function requestAssistant(request: AssistantRequest, appendUser: boolean) {
    if (loading) return

    if (appendUser) {
      setMessages((previous) => [...previous, { role: 'user', content: request.message }])
    }

    setInput('')
    setLoading(true)
    setError(null)
    setFailedRequest(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: request.message,
          locale,
          history: request.history,
          followUpContext: request.followUpContext,
          pagePath: pathname,
        }),
      })

      if (!response.ok) {
        const message = response.status === 429
          ? (isEn ? 'Too many requests. Please wait a moment.' : '请求有点密集，请稍等片刻再试。')
          : (isEn ? 'The assistant could not complete this response.' : '这次没有完成回答，请重试。')
        setError(message)
        setFailedRequest(request)
        return
      }

      const data: ChatResponse = await response.json()
      setMessages((previous) => [...previous, {
        role: 'assistant',
        content: data.reply,
        bullets: data.bullets,
        actions: data.actions,
        followUps: data.followUps,
        source: data.source,
      }])
    } catch {
      setError(isEn ? 'The connection was interrupted. Please try again.' : '连接中断了，请再试一次。')
      setFailedRequest(request)
    } finally {
      setLoading(false)
    }
  }

  function handleSend(text?: string, followUpContext?: string) {
    const message = (text ?? input).trim()
    if (!message || loading) return

    const history = messages.slice(-12).map((item) => ({
      role: item.role,
      content: toHistoryContent(item),
    }))

    void requestAssistant({ message, followUpContext, history }, true)
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <div>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="motion-press fixed bottom-4 right-4 z-[75] inline-flex h-12 w-12 items-center justify-center border border-white/25 bg-stone p-0 text-left text-white shadow-[0_18px_48px_rgba(17,17,17,0.26)] transition-transform active:scale-[0.98] sm:bottom-7 sm:right-7 sm:h-auto sm:w-auto sm:min-h-[4.5rem] sm:gap-3 sm:px-5 sm:py-3"
          aria-label={isEn ? 'Open Zeno assistant' : '打开 ZENO 助手'}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-white/10 ring-1 ring-white/20 sm:h-10 sm:w-10">
            <ChatCircleDots size={21} weight="duotone" aria-hidden />
          </span>
          <span className="hidden sm:block">
            <span className="block text-base font-semibold leading-none">{isEn ? 'ZENO assistant' : 'ZENO 助手'}</span>
            <span className="mt-1.5 block text-xs font-medium text-white/72">{isEn ? 'Understand, judge, move forward' : '理解 · 判断 · 推进'}</span>
          </span>
        </button>
      )}

      {open && (
        <section
          className="fixed inset-0 z-[80] flex h-[100dvh] w-full flex-col bg-canvas text-ink shadow-[0_28px_90px_rgba(17,17,17,0.26)] animate-surface-in sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(720px,calc(100dvh-3rem))] sm:w-[min(500px,calc(100vw-3rem))] sm:border sm:border-border"
          aria-label={isEn ? 'ZENO assistant conversation' : 'ZENO 助手对话'}
        >
          <header className="flex min-h-[4.25rem] shrink-0 items-center justify-between border-b border-border bg-surface-warm px-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-ink text-xs font-semibold text-white">Z</div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{isEn ? 'ZENO assistant' : 'ZENO 助手'}</p>
                <p className="mt-0.5 truncate text-[0.72rem] text-ink-faint">
                  {isEn ? 'Judgment for real work' : '真实问题的协作判断'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={resetConversation}
                  className="inline-flex h-9 w-9 items-center justify-center text-ink-muted transition-colors hover:bg-surface hover:text-ink active:scale-[0.98]"
                  aria-label={isEn ? 'Start a new conversation' : '重新开始'}
                  title={isEn ? 'Start a new conversation' : '重新开始'}
                >
                  <ArrowCounterClockwise size={18} aria-hidden />
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center text-ink-muted transition-colors hover:bg-surface hover:text-ink active:scale-[0.98]"
                aria-label={isEn ? 'Close ZENO assistant' : '收起 ZENO 助手'}
                title={isEn ? 'Close ZENO assistant' : '收起 ZENO 助手'}
              >
                <X size={18} aria-hidden />
              </button>
            </div>
          </header>

          <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-5">
            {messages.length === 0 && (
              <div>
                <div className="border-l-2 border-stone pl-4">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-stone">
                    {isEn ? 'Start with the real situation' : '先说真实处境'}
                  </p>
                  <p className="mt-3 text-[0.95rem] leading-7 text-ink">
                    {isEn
                      ? 'You do not need to organize the problem first. Tell me what happened, what you have in hand and what you are worried about.'
                      : '不用先把问题整理好。告诉我发生了什么、手里已有些什么、你最担心哪一步。'}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    {isEn
                      ? 'I will clarify one key issue first, then give a judgment and a next action.'
                      : '我会先问清一个关键点，再给判断和下一步。'}
                  </p>
                </div>

                <div className="mt-7 border-t border-border">
                  {quickEntries.map((entry) => {
                    const Icon = entry.icon
                    return (
                      <button
                        key={entry.label}
                        type="button"
                        onClick={() => handleSend(entry.prompt)}
                        disabled={loading}
                        className="group grid w-full grid-cols-[2.25rem_1fr_auto] items-center gap-3 border-b border-border py-4 text-left transition-colors hover:bg-surface-warm/60 active:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span className="flex h-9 w-9 items-center justify-center bg-surface text-stone transition-colors group-hover:bg-stone-pale">
                          <Icon size={19} weight="duotone" aria-hidden />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-ink">{entry.label}</span>
                          <span className="mt-1 block text-xs leading-5 text-ink-muted">{entry.description}</span>
                        </span>
                        <ArrowRight size={16} className="text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-stone" aria-hidden />
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[92%] px-3.5 py-3 text-sm leading-7 sm:max-w-[88%] ${
                  message.role === 'user'
                    ? 'bg-stone text-white'
                    : 'border border-border bg-surface text-ink shadow-[0_12px_30px_rgba(17,17,17,0.05)]'
                }`}>
                  {message.role === 'assistant' && (
                    <div className="mb-2 flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-stone">
                      <Brain size={14} weight="duotone" aria-hidden />
                      <span>{message.source === 'fallback' ? (isEn ? 'Basic routing' : '基础分流') : (isEn ? 'ZENO judgment' : 'ZENO 判断')}</span>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap">{message.content}</div>

                  {message.role === 'assistant' && message.bullets && message.bullets.length > 0 && (
                    <ul className="mt-3 space-y-2 border-t border-border/70 pt-3 text-[0.9rem] text-ink-muted">
                      {message.bullets.map((bullet) => (
                        <li key={bullet} className="grid grid-cols-[0.7rem_1fr] gap-2">
                          <span className="mt-[0.7rem] h-1 w-1 bg-stone" aria-hidden />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {message.role === 'assistant' && message.actions && message.actions.length > 0 && (
                    <div className="mt-4 border-t border-border/70 pt-3">
                      <p className="mb-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                        {isEn ? 'Useful next step' : '可用的下一步'}
                      </p>
                      <div className="divide-y divide-border/70">
                        {message.actions.map((action) => (
                          <Link
                            key={`${action.href}-${action.label}`}
                            href={action.href}
                            onClick={() => setOpen(false)}
                            className="group flex min-h-11 items-center justify-between gap-3 py-2.5 text-ink transition-colors hover:text-stone"
                          >
                            <span>
                              <span className="block text-sm font-semibold">{action.label}</span>
                              <span className="mt-0.5 block text-[0.68rem] uppercase tracking-[0.1em] text-ink-faint">
                                {actionKindLabels[locale][action.kind]}
                              </span>
                            </span>
                            <ArrowRight size={16} className="shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {message.role === 'assistant' && message.followUps && message.followUps.length > 0 && (
                    <div className="mt-4 border-t border-border/70 pt-3">
                      <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                        {isEn ? 'Continue this judgment' : '沿着这个判断继续'}
                      </p>
                      <div className="grid gap-2">
                        {message.followUps.map((followUp) => (
                          <button
                            key={followUp}
                            type="button"
                            onClick={() => handleSend(followUp, toHistoryContent(message))}
                            disabled={loading}
                            className="min-h-10 border-l-2 border-border pl-3 text-left text-xs leading-5 text-ink-muted transition-colors hover:border-stone hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {followUp}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start" role="status" aria-live="polite">
                <div className="w-[min(82%,22rem)] border border-border bg-surface px-3.5 py-3">
                  <p className="text-xs font-medium text-stone">{isEn ? 'Understanding the situation' : '正在理解你的处境'}</p>
                  <div className="mt-3 space-y-2" aria-hidden>
                    <div className="h-2 w-full animate-pulse bg-stone-pale" />
                    <div className="h-2 w-[82%] animate-pulse bg-stone-pale [animation-delay:120ms]" />
                    <div className="h-2 w-[58%] animate-pulse bg-stone-pale [animation-delay:240ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <footer className="shrink-0 border-t border-border bg-canvas px-4 py-3 sm:px-5">
            {error && (
              <div className="mb-3 flex items-start justify-between gap-3 border-l-2 border-cinnabar bg-surface-warm px-3 py-2.5 text-xs leading-5 text-ink-muted" role="alert">
                <span className="flex items-start gap-2">
                  <WarningCircle size={16} className="mt-0.5 shrink-0 text-cinnabar" aria-hidden />
                  <span>{error}</span>
                </span>
                {failedRequest && (
                  <button
                    type="button"
                    onClick={() => void requestAssistant(failedRequest, false)}
                    className="shrink-0 font-semibold text-ink hover:text-stone"
                  >
                    {isEn ? 'Retry' : '重试'}
                  </button>
                )}
              </div>
            )}

            <label htmlFor="zeno-assistant-input" className="block text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
              {isEn ? 'Continue with context' : '继续描述'}
            </label>
            <div className="mt-2 grid grid-cols-[1fr_2.75rem] items-end gap-2 border border-border bg-surface px-3 py-2 focus-within:border-stone">
              <textarea
                ref={inputRef}
                id="zeno-assistant-input"
                rows={2}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={isEn ? 'Describe the situation, materials and concern...' : '说清处境、已有材料和最担心的事...'}
                className="max-h-28 min-h-12 w-full resize-none bg-transparent py-1 text-sm leading-6 text-ink outline-none placeholder:text-ink-faint"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="inline-flex h-10 w-10 items-center justify-center bg-stone text-white transition-transform hover:bg-stone-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-stone/35"
                aria-label={isEn ? 'Send message' : '发送'}
                title={isEn ? 'Send message' : '发送'}
              >
                <PaperPlaneTilt size={18} weight="fill" aria-hidden />
              </button>
            </div>
            <p className="mt-2 text-[0.68rem] leading-5 text-ink-faint">
              {isEn
                ? 'Context stays in this tab. Important decisions and project responsibility remain human.'
                : '上下文仅保留在本标签页。重要判断与项目责任仍由人确认。'}
            </p>
          </footer>
        </section>
      )}
    </div>
  )
}
