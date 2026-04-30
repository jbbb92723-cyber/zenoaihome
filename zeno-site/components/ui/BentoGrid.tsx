import { cn } from '@/lib/utils'

interface BentoGridProps {
  children: React.ReactNode
  /** 列数配置：默认响应式 1→2→3 */
  cols?: 2 | 3 | 4
  /** 间距 */
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

const gapMap = {
  sm: 'gap-3',
  md: 'gap-5',
  lg: 'gap-6',
}

const colsMap = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

export default function BentoGrid({
  children,
  cols = 3,
  gap = 'md',
  className,
}: BentoGridProps) {
  return (
    <div className={cn('grid', colsMap[cols], gapMap[gap], className)}>
      {children}
    </div>
  )
}
