import Link from 'next/link'
import { cn } from '@/lib/utils'

interface BentoCardProps {
  /** 标题 */
  title: string
  /** 描述 */
  description?: string
  /** 标签/小分类 */
  label?: string
  /** 链接地址 */
  href?: string
  /** CTA 文案 */
  cta?: string
  /** 跨列数 */
  colSpan?: 1 | 2
  /** 跨行数 */
  rowSpan?: 1 | 2
  /** 自定义内容 */
  children?: React.ReactNode
  /** 卡片变体 */
  variant?: 'default' | 'featured' | 'subtle'
  className?: string
}

export default function BentoCard({
  title,
  description,
  label,
  href,
  cta,
  colSpan = 1,
  rowSpan = 1,
  children,
  variant = 'default',
  className,
}: BentoCardProps) {
  const spanClasses = cn(
    colSpan === 2 && 'sm:col-span-2',
    rowSpan === 2 && 'sm:row-span-2',
  )

  const variantClasses = {
    default: 'border border-border bg-surface',
    featured: 'border border-stone/30 bg-stone/5',
    subtle: 'border border-border bg-surface-warm',
  }

  const content = (
    <div
      className={cn(
        'group p-6 sm:p-7 flex flex-col h-full transition-all duration-150',
        variantClasses[variant],
        href && 'card-hover cursor-pointer',
        spanClasses,
        className,
      )}
    >
      {label && (
        <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-stone mb-3">
          {label}
        </p>
      )}
      <h3 className="card-title mb-3 group-hover:text-stone transition-colors">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-ink-muted leading-relaxed flex-1">
          {description}
        </p>
      )}
      {children}
      {cta && (
        <span className="text-xs text-stone mt-5 group-hover:underline underline-offset-2">
          {cta} →
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className={spanClasses}>
        {content}
      </Link>
    )
  }

  return <div className={spanClasses}>{content}</div>
}
