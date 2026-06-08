import Container from '@/components/ui/Container'

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
    <div className="relative overflow-hidden border-b border-border bg-canvas">
      <Container size={size} className="motion-hero relative py-14 sm:py-20">
        <p className="system-label mb-4">{label}</p>
        <h1 className="editorial-display mb-5 max-w-4xl text-[2.35rem] leading-[1.12] text-ink sm:text-[3.35rem]">
          {title}
        </h1>
        <p className="max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
          {subtitle}
        </p>
        {note && (
          <p className="mt-5 max-w-xl border-l border-ink/25 pl-4 text-sm leading-7 text-ink-faint">{note}</p>
        )}
      </Container>
    </div>
  )
}
