import Link from 'next/link'

interface CTAProps {
  href: string
  label: string
  variant?: 'primary' | 'secondary' | 'ghost'
  external?: boolean
}

export default function CTA({ href, label, variant = 'primary', external = false }: CTAProps) {
  const base = 'motion-press inline-flex min-h-10 items-center justify-center rounded-[7px] text-sm font-semibold'

  const variants = {
    primary:
      'bg-ink px-5 py-2.5 text-white hover:bg-ink/88 hover:shadow-[0_14px_32px_rgba(17,17,17,0.14)]',
    secondary:
      'border border-ink/18 bg-surface px-5 py-2.5 text-ink hover:border-ink/40 hover:bg-surface-warm/70',
    ghost:
      'text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink px-0 py-0',
  }

  const className = `${base} ${variants[variant]}`

  if (external) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  )
}

interface CTAGroupProps {
  items: CTAProps[]
  layout?: 'row' | 'col'
}

export function CTAGroup({ items, layout = 'row' }: CTAGroupProps) {
  return (
    <div className={`flex ${layout === 'col' ? 'flex-col items-start' : 'flex-wrap items-center'} gap-3`}>
      {items.map((item, i) => (
        <CTA key={i} {...item} />
      ))}
    </div>
  )
}
