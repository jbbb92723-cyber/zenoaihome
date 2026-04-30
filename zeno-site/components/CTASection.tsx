import Link from 'next/link'
import Container from '@/components/Container'
import { cn } from '@/lib/utils'

interface CTAItem {
  label: string
  href: string
  variant?: 'primary' | 'secondary' | 'ghost'
}

interface CTASectionProps {
  /** 主标题 */
  title: string
  /** 描述文案 */
  description?: string
  /** 按钮组 */
  actions: CTAItem[]
  /** 背景变体 */
  bg?: 'default' | 'warm' | 'stone'
  /** 容器宽度 */
  size?: 'layout' | 'wide' | 'content' | 'reading'
  className?: string
}

const variantStyles = {
  primary: 'text-sm font-medium text-paper bg-stone px-5 py-2.5 hover:bg-stone/85 transition-colors',
  secondary: 'text-sm font-medium text-stone border border-stone/40 px-5 py-2.5 hover:bg-stone-pale transition-colors',
  ghost: 'text-sm text-stone hover:underline underline-offset-2 decoration-stone-light',
}

export default function CTASection({
  title,
  description,
  actions,
  bg = 'default',
  size = 'content',
  className,
}: CTASectionProps) {
  const bgClasses = {
    default: 'border-t border-b border-border',
    warm: 'bg-surface-warm border-t border-b border-border',
    stone: 'bg-stone/5 border-t border-b border-stone/20',
  }

  return (
    <section className={cn('py-14 sm:py-16', bgClasses[bg], className)}>
      <Container size={size}>
        <div className="max-w-lg">
          <h2 className="text-lg sm:text-xl font-semibold text-ink mb-3">{title}</h2>
          {description && (
            <p className="text-sm text-ink-muted leading-relaxed mb-6">{description}</p>
          )}
          <div className="flex flex-wrap gap-3 items-center">
            {actions.map((action, i) => (
              <Link
                key={i}
                href={action.href}
                className={variantStyles[action.variant ?? (i === 0 ? 'primary' : 'secondary')]}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
