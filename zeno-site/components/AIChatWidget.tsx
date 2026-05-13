'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

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
}

interface ChatResponse {
  reply: string
  bullets?: string[]
  actions?: ChatAction[]
  followUps?: string[]
  source: 'llm' | 'fallback'
}

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
    label: '我想用 AI 升级装修业务',
    prompt: '我想探索传统装修行业怎么用 AI 升级，请先帮我分流：哪些工作流最值得先改，哪些工具适合试，第一步怎么落地？',
    links: [
      { label: 'AI 升级路线', href: '/ai' },
      { label: 'AI 提示词工具', href: '/tools/prompts' },
      { label: 'AI 工作流咨询', href: '/services/ai-workflow' },
    ],
  },
  {
    label: '我在看报价单',
    prompt: '我正在看装修报价单，请先帮我分流：我应该先看哪些风险、用哪个工具、拿哪份清单，什么时候看报价快审，什么时候看签约前决策包？',
    links: [
      { label: '报价初筛工具', href: '/tools/quote-check' },
      { label: '报价审核清单', href: '/resources#baojia-shenhe-qingdan' },
      { label: '签约前决策包', href: '/services/renovation#qianyue-qian-juece-bao' },
    ],
  },
  {
    label: '我怕超预算',
    prompt: '我担心装修超预算，请先帮我判断：我应该先拆预算分配，还是先查报价漏项、施工流程和需求顺序的问题。',
    links: [
      { label: '预算分配工具', href: '/tools/budget-structure' },
      { label: '超预算原因自测', href: '/tools/budget-risk' },
      { label: '预算模板', href: '/resources#zhuangxiu-yusuan-moban' },
    ],
  },
  {
    label: '我已经开工了',
    prompt: '我已经开工了，请帮我按施工节点分流：现在该看什么、拍什么、确认什么，哪些问题需要留痕。',
    links: [
      { label: '验收节点向导', href: '/tools/inspection-guide' },
      { label: '瓷砖计算器', href: '/tools/tile-calculator' },
      { label: '验收清单', href: '/resources#yanshou-qingdan' },
    ],
  },
  {
    label: '我想按居住场景做选择',
    prompt: '我不想只按效果图装修，请帮我从家庭成员、做饭、收纳、清洁和长期使用这些居住场景分流下一步。',
    links: [
      { label: '家不是样板间', href: '/blog/02-jia-bu-shi-yangban-jian' },
      { label: '居住场景自查表', href: '/resources#shizhu-pai-zijian-biao' },
      { label: '居住场景服务', href: '/services/renovation#shi-zhu-pai-zhuangxiu' },
    ],
  },
]

const quickEntriesEn = [
  {
    label: 'I am checking a quote',
    prompt: 'I am checking a renovation quote. Help me route to the right risks, tools, checklists and service if needed.',
    links: [
      { label: 'Tools', href: '/en/tools' },
      { label: 'Resources', href: '/en/resources' },
      { label: 'Services', href: '/en/services' },
    ],
  },
  {
    label: 'I worry about budget overrun',
    prompt: 'I worry about budget overrun. Help me identify whether it is a quote, budget structure, process or needs issue.',
    links: [
      { label: 'Tools', href: '/en/tools' },
      { label: 'Resources', href: '/en/resources' },
      { label: 'Services', href: '/en/services' },
    ],
  },
  {
    label: 'The project has started',
    prompt: 'My renovation has started. Help me route by construction checkpoints and evidence keeping.',
    links: [
      { label: 'Resources', href: '/en/resources' },
      { label: 'Writing', href: '/en/blog' },
    ],
  },
  {
    label: 'I design for real living',
    prompt: 'I want to design from real living, not just showroom images. Help me route next steps.',
    links: [
      { label: 'Article', href: '/en/articles/home-is-not-a-showroom' },
      { label: 'Resources', href: '/en/resources' },
    ],
  },
]

export default function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const isEn = pathname.startsWith('/en')
  const quickEntries = isEn ? quickEntriesEn : quickEntriesZh
  const locale = isEn ? 'en' : 'zh'

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  if (pathname.startsWith('/admin')) return null

  function resetConversation() {
    setMessages([])
    setInput('')
  }

  async function handleSend(text?: string) {
    const msg = text ?? input.trim()
    if (!msg) return

    const userMessage: Message = { role: 'user', content: msg }
    setMessages((previous) => [...previous, userMessage])
    setInput('')
    setLoading(true)

    try {
      const history = messages.map((message) => ({ role: message.role, content: message.content }))
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, locale, history }),
      })

      if (response.ok) {
        const data: ChatResponse = await response.json()
        setMessages((previous) => [...previous, {
          role: 'assistant',
          content: data.reply,
          bullets: data.bullets,
          actions: data.actions,
          followUps: data.followUps,
        }])
      } else {
        setMessages((previous) => [...previous, {
          role: 'assistant',
          content: isEn
            ? 'I could not process that. You can still use the route links above.'
            : '暂时无法回复。你可以先用上面的分流入口继续往下走。',
        }])
      }
    } catch {
      setMessages((previous) => [...previous, {
        role: 'assistant',
        content: isEn ? 'Network error. Please try again.' : '网络错误，请稍后重试。',
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="hidden sm:block">
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-[75] inline-flex h-12 w-12 items-center justify-center border border-white/25 bg-stone p-0 text-left text-white shadow-[0_18px_48px_rgba(42,39,35,0.26)] transition-all duration-200 hover:-translate-y-1 hover:bg-stone/95 hover:shadow-[0_24px_70px_rgba(42,39,35,0.32)] sm:bottom-7 sm:right-7 sm:h-auto sm:w-auto sm:min-h-[4.5rem] sm:gap-3 sm:px-6 sm:py-3 animate-zeno-pulse-once"
          aria-label={isEn ? 'Ask Zeno' : '问 Zeno'}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-white/12 ring-1 ring-white/20 sm:h-10 sm:w-10">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </span>
          <span className="hidden sm:block">
            <span className="block text-base font-semibold leading-none sm:text-lg">{isEn ? 'Ask Zeno' : '问 Zeno'}</span>
            <span className="mt-1 block text-xs font-medium text-white/75">{isEn ? 'AI renovation routing' : 'AI 装修判断助手'}</span>
          </span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-4 right-4 z-[80] flex h-[min(680px,calc(100vh-2rem))] w-[min(460px,calc(100vw-2rem))] flex-col border border-border bg-canvas shadow-[0_28px_90px_rgba(42,39,35,0.26)] animate-surface-in sm:bottom-6 sm:right-6">
          <div className="flex shrink-0 items-center justify-between border-b border-border bg-surface-warm px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center bg-stone-pale text-xs font-semibold text-stone">Z</div>
              <div>
                <p className="text-sm font-semibold text-ink">{isEn ? 'Ask Zeno' : '问 Zeno'}</p>
                <p className="text-[0.7rem] text-ink-faint">
                  {isEn ? 'Route the question first' : '先分流，再解决问题'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={resetConversation}
                  className="text-[0.7rem] font-medium text-ink-faint transition-colors hover:text-ink"
                >
                  {isEn ? 'New chat' : '重新开始'}
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)} className="p-1 text-ink-muted transition-colors hover:text-ink" aria-label="Close">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.length === 0 && (
              <div>
                <p className="text-sm leading-relaxed text-ink-muted">
                  {isEn
                    ? 'Choose the closest situation. I will route you to the right article, tool, checklist or service.'
                    : '先选最接近你当前处境的一项。我会把你导向对应文章、工具、清单、AI 方法或服务。'}
                </p>

                <div className="mt-3 border border-border bg-surface px-3 py-3">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ink-faint">
                    {isEn ? 'You can also ask like this' : '也可以直接这样问'}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink">
                    {isEn
                      ? '“89 sqm, budget 200k, half-package quote already at 160k. What should I check first?”'
                      : '“套内 89 平，预算 20 万，半包报价已经 16 万了，我先看哪里？”'}
                  </p>
                </div>

                <div className="mt-4 grid gap-3">
                  {quickEntries.map((entry) => (
                    <div key={entry.label} className="border border-border bg-surface p-3">
                      <button type="button" onClick={() => handleSend(entry.prompt)} className="block w-full text-left text-sm font-semibold text-ink hover:text-stone">
                        {entry.label}
                      </button>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {entry.links.map((link) => (
                          <Link key={link.href + link.label} href={link.href} className="text-xs text-stone underline decoration-stone-light underline-offset-2 hover:decoration-stone">
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] px-3 py-2 text-sm leading-relaxed ${
                  message.role === 'user'
                    ? 'bg-stone text-white'
                    : 'border border-border bg-surface text-ink shadow-[0_12px_30px_rgba(42,39,35,0.06)]'
                }`}>
                  <div className="whitespace-pre-wrap">{message.content}</div>

                  {message.role === 'assistant' && message.bullets && message.bullets.length > 0 && (
                    <ul className="mt-3 space-y-2 border-t border-border/70 pt-3 text-[0.92rem] text-ink-muted">
                      {message.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2">
                          <span className="mt-[0.15rem] text-stone">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {message.role === 'assistant' && message.actions && message.actions.length > 0 && (
                    <div className="mt-3 border-t border-border/70 pt-3">
                      <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ink-faint">
                        {isEn ? 'Next step' : '下一步'}
                      </p>
                      <div className="grid gap-2">
                        {message.actions.map((action) => (
                          <Link
                            key={`${action.href}-${action.label}`}
                            href={action.href}
                            className="group flex items-center justify-between border border-border bg-canvas px-3 py-2 transition-colors hover:border-stone hover:bg-stone-pale/45"
                          >
                            <div>
                              <span className="block text-sm font-semibold text-ink group-hover:text-stone">{action.label}</span>
                              <span className="mt-1 block text-[0.72rem] uppercase tracking-[0.16em] text-ink-faint">
                                {actionKindLabels[locale][action.kind]}
                              </span>
                            </div>
                            <span className="text-sm text-stone">→</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {message.role === 'assistant' && message.followUps && message.followUps.length > 0 && (
                    <div className="mt-3 border-t border-border/70 pt-3">
                      <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ink-faint">
                        {isEn ? 'Continue here' : '继续追问'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {message.followUps.map((followUp) => (
                          <button
                            key={followUp}
                            type="button"
                            onClick={() => handleSend(followUp)}
                            disabled={loading}
                            className="border border-border bg-canvas px-2.5 py-1.5 text-left text-xs text-ink-muted transition-colors hover:border-stone hover:text-stone disabled:cursor-not-allowed disabled:opacity-50"
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
              <div className="flex justify-start">
                <div className="border border-border bg-surface px-3 py-2 text-sm text-ink-muted">
                  {isEn ? 'Thinking...' : '正在整理路径...'}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="shrink-0 border-t border-border px-3 py-3">
            <form
              onSubmit={(event) => { event.preventDefault(); handleSend() }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={isEn ? 'Tell me your stage, budget or quote...' : '直接说阶段、预算或你手上的报价单'}
                className="min-h-10 flex-1 bg-transparent px-2 text-sm text-ink outline-none placeholder:text-ink-faint"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="inline-flex h-10 items-center bg-stone px-3 text-sm font-medium text-white transition-colors hover:bg-stone/90 disabled:bg-stone/35"
              >
                {isEn ? 'Send' : '发送'}
              </button>
            </form>
            <p className="mt-2 text-[0.72rem] leading-relaxed text-ink-faint">
              {isEn
                ? 'This assistant helps you identify the right path first. For case-by-case judgment, use the contact page.'
                : '这个助手先帮你分清路径，不替你直接拍板。涉及具体个案，再进入联系页。'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
