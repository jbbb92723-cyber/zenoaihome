'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface SearchResult {
  title: string
  href: string
  type: 'article' | 'note' | 'resource' | 'page'
  excerpt?: string
}

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

  // Keyboard shortcut: Ctrl/Cmd + K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setResults([])
      setSelectedIndex(0)
    }
  }, [open])

  // Search on query change (debounced)
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data.results ?? [])
        }
      } catch {
        // Silent fail
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleSelect = useCallback((result: SearchResult) => {
    setOpen(false)
    router.push(result.href)
  }, [router])

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex])
    }
  }

  const typeLabels: Record<string, string> = isEn
    ? { article: 'Article', note: 'Note', resource: 'Resource', page: 'Page' }
    : { article: '文章', note: '札记', resource: '资料', page: '页面' }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setOpen(false)} />

      {/* Dialog */}
      <div className="relative w-full max-w-lg mx-4 bg-canvas border border-border shadow-xl">
        {/* Input */}
        <div className="flex items-center border-b border-border px-4 py-3">
          <svg className="w-4 h-4 text-ink-muted shrink-0 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0) }}
            onKeyDown={handleKeyDown}
            placeholder={isEn ? 'Search articles, notes, resources...' : '搜索文章、札记、资料...'}
            className="flex-1 bg-transparent text-sm text-ink placeholder-ink-faint outline-none"
          />
          <kbd className="hidden sm:inline-flex text-[0.6rem] text-ink-faint border border-border px-1.5 py-0.5 ml-2">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto">
          {loading && (
            <div className="px-4 py-6 text-center text-sm text-ink-muted">
              {isEn ? 'Searching...' : '搜索中...'}
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-ink-muted">
              {isEn ? 'No results found.' : '没有找到相关内容。'}
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul className="py-2">
              {results.map((result, i) => (
                <li key={result.href}>
                  <button
                    onClick={() => handleSelect(result)}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                      i === selectedIndex ? 'bg-surface-warm' : 'hover:bg-surface-warm/50'
                    }`}
                  >
                    <span className="text-[0.6rem] text-stone font-semibold uppercase tracking-widest mt-1 shrink-0 w-10">
                      {typeLabels[result.type]}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{result.title}</p>
                      {result.excerpt && (
                        <p className="text-xs text-ink-muted mt-0.5 line-clamp-1">{result.excerpt}</p>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!query && (
            <div className="px-4 py-6 text-center text-xs text-ink-faint">
              {isEn ? 'Type to search across all content' : '输入关键词搜索全站内容'}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t border-border px-4 py-2 flex items-center justify-between text-[0.6rem] text-ink-faint">
          <span>↑↓ {isEn ? 'navigate' : '导航'}  ↵ {isEn ? 'select' : '选择'}</span>
          <span>ESC {isEn ? 'close' : '关闭'}</span>
        </div>
      </div>
    </div>
  )
}

/** Trigger button for Header */
export function SearchTrigger() {
  const pathname = usePathname()
  const isEn = pathname.startsWith('/en')

  function openSearch() {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
  }

  return (
    <button
      onClick={openSearch}
      className="flex items-center gap-1.5 text-[0.8125rem] text-ink-muted hover:text-ink transition-colors"
      aria-label={isEn ? 'Search' : '搜索'}
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span className="hidden sm:inline text-xs text-ink-faint">⌘K</span>
    </button>
  )
}
