import Container from '@/components/Container'

interface PageHeroProps {
  /** 页面小标签，例如「关于我」「文章」 */
  label: string
  /** H1 大标题 */
  title: string
  /** 副标题说明 */
  subtitle: string
  /** 可选补充文案 */
  note?: string
  /** 容器宽度，默认 content (max-w-4xl) */
  size?: 'layout' | 'wide' | 'content' | 'reading'
}

export default function PageHero({
  label,
  title,
  subtitle,
  note,
  size = 'content',
}: PageHeroProps) {
  return (
    <div className="relative overflow-hidden border-b border-border bg-canvas system-grid">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,252,0.94),rgba(247,247,243,0.82)),radial-gradient(circle_at_82%_18%,rgba(63,98,88,0.12),transparent_34%)]" aria-hidden />
      <Container size={size} className="relative py-12 sm:py-16">
        <p className="system-label mb-4">{label}</p>
        <h1 className="page-title mb-5 max-w-3xl">{title}</h1>
        <p className="max-w-2xl text-base leading-[1.7] text-ink-muted sm:text-lg">
          {subtitle}
        </p>
        {note && (
          <p className="mt-4 max-w-xl border-l-2 border-stone/40 pl-4 text-sm leading-relaxed text-ink-faint">{note}</p>
        )}
      </Container>
    </div>
  )
}
