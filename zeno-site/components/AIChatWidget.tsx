'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

// 建议问题：尽量贴近用户实际会问的，不用营销化措辞
const SUGGESTIONS_ZH = [
  '我的报价单要怎么看出有没有坑？',
  '装修预算 buffer 一般留多少？',
  '水电"按实际发生计算"是不是坑？',
  'Zeno 现在能帮我做什么？',
]

const SUGGESTIONS_EN = [
  'How do I spot risks in my renovation quote?',
  'How much buffer should I keep in the budget?',
  'What can Zeno actually help me with?',
  'Where do I start with AI in my work?',
]

export default function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const isEn = pathname.startsWith('/en')
  const suggestions = isEn ? SUGGESTIONS_EN : SUGGESTIONS_ZH

  // Hide on admin pages
  if (pathname.startsWith('/admin')) return null

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  async function handleSend(text?: string) {
    const msg = text ?? input.trim()
    if (!msg) return

    const userMessage: Message = { role: 'user', content: msg }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // 把最近的对话历史一起传给后端，让 LLM 有上下文
      const history = messages.map((m) => ({ role: m.role, content: m.content }))
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, locale: isEn ? 'en' : 'zh', history }),
      })

      if (res.ok) {
        const data = await res.json()
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
      } else {
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: isEn
            ? 'Sorry, I couldn\'t process that. Please try again or contact Zeno directly.'
            : '抱歉，暂时无法回复。你可以直接联系 Zeno，或稍后再试。',
        }])
      }
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: isEn
          ? 'Network error. Please try again.'
          : '网络错误，请稍后重试。',
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-stone text-paper flex items-center justify-center shadow-lg hover:bg-stone/90 transition-colors"
          aria-label={isEn ? 'Ask Zeno AI' : '问问 Zeno AI'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-canvas border border-border shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-stone-pale flex items-center justify-center text-stone text-xs font-semibold">Z</div>
              <div>
                <p className="text-xs font-semibold text-ink">Zeno AI 助手</p>
                <p className="text-[0.6rem] text-ink-faint">
                  {isEn ? 'Built to help, not to upsell' : '帮你看清，不是推你买东西'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-ink-muted hover:text-ink transition-colors p-1"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-xs text-ink-muted leading-relaxed mb-4">
                  {isEn
                    ? 'I am the AI assistant on Zeno\'s site. I will not pretend to be Zeno, and I will not push you to buy. Ask me about renovation quotes, budgets, AI use, or what is on this site.'
                    : '我是 Zeno 网站的 AI 助手，不会冒充 Zeno 本人，也不会推你买东西。可以问我报价、预算、AI 使用或网站上的内容。'}
                </p>
                <div className="space-y-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="w-full text-left text-xs text-ink-muted border border-border px-3 py-2 hover:border-stone hover:text-stone transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-stone text-paper'
                    : 'bg-surface border border-border text-ink'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-surface border border-border px-3 py-2 text-sm text-ink-muted">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce">·</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>·</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>·</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border px-3 py-3 shrink-0">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend() }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isEn ? 'Type your question...' : '输入你的问题...'}
                className="flex-1 bg-transparent text-sm text-ink placeholder-ink-faint outline-none"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="text-stone hover:text-stone/80 disabled:text-ink-faint transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
