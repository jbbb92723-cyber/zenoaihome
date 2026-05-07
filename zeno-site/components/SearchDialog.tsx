'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

type SearchType = 'article' | 'note' | 'resource' | 'page' | 'tool' | 'checklist' | 'service'

interface SearchResult {
  title: string
  href: string
  type: SearchType
  excerpt?: string
}

const recommendedZh: SearchResult[] = [
  { title: 'AI 升级装修行业', href: '/ai', type: 'page', excerpt: '从装修现场经验出发，探索 AI 工具、方法论和数字产品。' },
  { title: '报价单怎么看', href: '/tools/quote-check', type: 'tool', excerpt: '先上传报价单，做一轮风险类型初筛。' },
  { title: '预算为什么总超', href: '/blog/zhuangxiu-yusuan-weishenme-zongchao', type: 'article', excerpt: '先看超支背后的顺序问题。' },
  { title: '节点验收', href: '/resources#construction-checkpoints', type: 'checklist', excerpt: '每个节点该看什么、该拍什么、该确认什么。' },
  { title: '家不是样板间', href: '/blog/02-jia-bu-shi-yangban-jian', type: 'article', excerpt: '从真实居住倒推装修选择。' },
]

const recommendedEn: SearchResult[] = [
  { title: 'Quote review', href: '/en/tools', type: 'tool', excerpt: 'Start from quote risk screening.' },
  { title: 'Budget risk', href: '/en/tools', type: 'tool', excerpt: 'Find where the budget gets unstable.' },
  { title: 'Site checkpoints', href: '/en/resources', type: 'checklist', excerpt: 'What to check at each stage.' },
  { title: 'Home is not a showroom', href: '/en/articles/home-is-not-a-showroom', type: 'article', excerpt: 'Design from real living.' },
  { title: 'AI workflow', href: '/en/services', type: 'service', excerpt: 'Bring field experience into AI.' },
]

export default function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  const isEn = pathname.startsWith('/en')
  const recommended = isEn ? recommendedEn : recommendedZh
  const visibleResults = query.trim() ? results : recommended

  const typeLabels: Record<SearchType, string> = isEn
    ? { article: 'Article', note: 'Note', resource: 'Resource', page: 'Page', tool: 'Tool', checklist: 'Checklist', service: 'Service' }
    : { article: '文章', note: '札记', resource: '资料', page: '页面', tool: '工具', checklist: '清单', service: '服务' }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen(true)
      }
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => inputRef.current?.focus(), 80)
    } else {
      document.body.style.overflow = ''
      setQuery('')
      setResults([])
      setSelectedIndex(0)
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setSelectedIndex(0)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data.results ?? [])
          setSelectedIndex(0)
        }
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 220)

    return () => clearTimeout(timer)
  }, [query])

  const handleSelect = useCallback((result: SearchResult) => {
    setOpen(false)
    router.push(result.href)
  }, [router])

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setSelectedIndex((index) => Math.min(index + 1, visibleResults.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setSelectedIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter' && visibleResults[selectedIndex]) {
      event.preventDefault()
      handleSelect(visibleResults[selectedIndex])
    }
  }

  const shortcutLabel = useMemo(() => {
    if (typeof navigator === 'undefined') return 'Ctrl K'
    return navigator.platform.toLowerCase().includes('mac') ? 'Cmd K' : 'Ctrl K'
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-canvas/96 backdrop-blur-md animate-surface-in">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={() => setOpen(false)}
        aria-label={isEn ? 'Close search' : '关闭搜索'}
      />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">
              {isEn ? 'Search ZenoAIHome' : '搜索 ZenoAIHome'}
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              {isEn ? 'Pages, tools, checklists, services and articles.' : '页面、工具、清单、服务和文章，从这里进入。'}
            </p>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="text-sm text-ink-muted hover:text-ink">
            ESC
          </button>
        </div>

        <div className="border-b border-border pb-5">
          <div className="flex items-center gap-4">
            <svg className="h-6 w-6 shrink-0 text-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder={isEn ? 'Search quote, budget, checklist, service...' : '搜索报价、预算、验收、服务...'}
              className="w-full bg-transparent text-2xl font-medium text-ink outline-none placeholder:text-ink-faint sm:text-4xl"
            />
            <kbd className="hidden shrink-0 border border-border px-2 py-1 text-xs text-ink-faint sm:inline-flex">
              {shortcutLabel}
            </kbd>
          </div>
        </div>

        <div className="mt-8 grid flex-1 grid-cols-1 gap-8 lg:grid-cols-[0.72fr_0.28fr]">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">
                {query.trim() ? (isEn ? 'Results' : '搜索结果') : (isEn ? 'Recommended' : '推荐入口')}
              </h2>
              {loading && <span className="text-xs text-ink-muted">{isEn ? 'Searching...' : '搜索中...'}</span>}
            </div>

            <div className="space-y-2">
              {!loading && query.trim() && visibleResults.length === 0 && (
                <div className="border border-border bg-surface p-6 text-sm text-ink-muted">
                  {isEn ? 'No result found. Try quote, budget or service.' : '没有找到结果。可以试试“报价”“预算”“验收”“服务”。'}
                </div>
              )}

              {visibleResults.map((result, index) => (
                <button
                  key={`${result.href}-${result.title}`}
                  type="button"
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`group flex w-full items-start gap-4 border px-4 py-4 text-left transition-all duration-150 ${
                    index === selectedIndex
                      ? 'border-stone bg-surface-warm shadow-[0_12px_30px_rgba(42,39,35,0.06)]'
                      : 'border-border bg-surface hover:border-stone/40 hover:bg-surface-warm'
                  }`}
                >
                  <span className="mt-0.5 min-w-14 text-[0.65rem] font-semibold uppercase tracking-widest text-stone">
                    {typeLabels[result.type]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold text-ink group-hover:text-stone">{result.title}</span>
                    {result.excerpt && <span className="mt-1 block text-sm leading-relaxed text-ink-muted">{result.excerpt}</span>}
                  </span>
                  <span className="mt-1 text-sm text-stone transition-transform group-hover:translate-x-1">-&gt;</span>
                </button>
              ))}
            </div>
          </section>

          <aside className="border border-border bg-surface-warm p-5 self-start">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">
              {isEn ? 'Shortcut' : '快捷动作'}
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <button type="button" onClick={() => handleSelect({ title: '报价初筛工具', href: '/tools/quote-check', type: 'tool' })} className="block w-full text-left text-ink-muted hover:text-ink">
                {isEn ? 'Upload a quote' : '上传报价单'}
              </button>
              <button type="button" onClick={() => handleSelect({ title: '预算风险自测', href: '/tools/budget-risk', type: 'tool' })} className="block w-full text-left text-ink-muted hover:text-ink">
                {isEn ? 'Budget risk quiz' : '做预算风险自测'}
              </button>
              <button type="button" onClick={() => handleSelect({ title: 'AI 升级', href: '/ai', type: 'page' })} className="block w-full text-left text-ink-muted hover:text-ink">
                {isEn ? 'AI upgrade route' : '看 AI 升级路线'}
              </button>
              <button type="button" onClick={() => handleSelect({ title: '服务提交', href: '/services#service-form', type: 'service' })} className="block w-full text-left text-ink-muted hover:text-ink">
                {isEn ? 'Submit service request' : '提交服务需求'}
              </button>
              <button type="button" onClick={() => handleSelect({ title: '资料库', href: '/resources', type: 'resource' })} className="block w-full text-left text-ink-muted hover:text-ink">
                {isEn ? 'Open resources' : '打开资料库'}
              </button>
            </div>
            <p className="mt-6 border-t border-border pt-4 text-xs leading-relaxed text-ink-muted">
              {isEn ? 'Use arrow keys to move, Enter to open.' : '支持方向键选择，Enter 打开。'}
            </p>
          </aside>
        </div>
      </div>
    </div>
  )
}

export function SearchTrigger() {
  const pathname = usePathname()
  const isEn = pathname.startsWith('/en')

  function triggerSearch() {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
  }

  return (
    <button
      type="button"
      onClick={triggerSearch}
      className="inline-flex items-center gap-1.5 text-[0.8125rem] text-ink-muted transition-colors hover:text-ink"
      aria-label={isEn ? 'Search' : '搜索'}
    >
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span className="hidden text-xs text-ink-faint sm:inline">Cmd/Ctrl K</span>
    </button>
  )
}
