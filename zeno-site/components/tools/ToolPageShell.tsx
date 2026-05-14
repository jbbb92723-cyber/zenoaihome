import Link from 'next/link'
import type { ReactNode } from 'react'

interface ToolPageShellProps {
  label: string
  title: string
  subtitle: string
  time: string
  bestFor: string
  prepare: string[]
  children: ReactNode
}

export function ToolPageShell({ label, title, subtitle, time, bestFor, prepare, children }: ToolPageShellProps) {
  return (
    <main className="min-h-screen bg-canvas">
      <section className="border-b border-border bg-surface-warm">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">{label}</p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-ink sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">{subtitle}</p>
          <div className="mt-7 grid gap-3 text-sm sm:grid-cols-3">
            <InfoChip title="适合谁" body={bestFor} />
            <InfoChip title="预计耗时" body={time} />
            <InfoChip title="需要准备" body={prepare.join(' / ')} />
          </div>
        </div>
      </section>
      {children}
    </main>
  )
}

export function InfoChip({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-border bg-surface px-4 py-3">
      <p className="text-[0.68rem] font-semibold uppercase tracking-widest text-stone">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-ink-muted">{body}</p>
    </div>
  )
}

function cleanNumericInput(raw: string) {
  const normalized = raw.replace(/[,，\s]/g, '')
  const chars = normalized.replace(/[^\d.]/g, '').split('')
  let dotUsed = false

  return chars.filter((char) => {
    if (char !== '.') return true
    if (dotUsed) return false
    dotUsed = true
    return true
  }).join('')
}

export function NumberInput({
  label,
  unit,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string
  unit: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  hint?: string
}) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      <div className="mt-2 flex border border-border bg-canvas focus-within:border-stone">
        <input
          value={value}
          onChange={(event) => onChange(cleanNumericInput(event.target.value))}
          inputMode="decimal"
          placeholder={placeholder}
          className="min-h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums outline-none placeholder:text-ink-faint"
        />
        <span className="flex min-w-14 items-center justify-center border-l border-border px-3 text-xs text-ink-muted">{unit}</span>
      </div>
      {hint && <span className="mt-1.5 block text-xs leading-relaxed text-ink-faint">{hint}</span>}
    </label>
  )
}

export function ResultPanel({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="border border-border bg-surface-warm p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-stone">计算结果</p>
      <h2 className="mt-2 text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-4 text-sm leading-relaxed text-ink-muted">{children}</div>
      {actions && <div className="mt-5 flex flex-wrap gap-3">{actions}</div>}
    </section>
  )
}

export function BridgePanel({ items }: { items: Array<{ label: string; href: string; desc: string }> }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-faint">下一步可以接着看</p>
      <div className="grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <Link key={item.href + item.label} href={item.href} className="border border-border bg-surface p-5 transition-colors hover:border-stone hover:bg-surface-warm">
            <p className="text-sm font-semibold text-ink">{item.label}</p>
            <p className="mt-2 text-xs leading-relaxed text-ink-muted">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
