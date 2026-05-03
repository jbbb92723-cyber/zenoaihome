import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  /** 小标签（如"四条主线"） */
  label?: string
  /** 主标题 */
  title: string
  /** 副标题 */
  subtitle?: string
  /** 对齐 */
  align?: 'left' | 'center'
  className?: string
}

export default function SectionHeader({
  label,
  title,
  subtitle,
  align = 'left',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-10', align === 'center' && 'text-center', className)}>
      {label && (
        <p className="page-label mb-3">{label}</p>
      )}
      <h2 className="section-heading">{title}</h2>
      {subtitle && (
        <p className="text-sm text-ink-muted mt-2 max-w-xl">{subtitle}</p>
      )}
    </div>
  )
}
