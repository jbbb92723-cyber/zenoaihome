import Link from 'next/link'
import Container from '@/components/Container'
import CTA from '@/components/CTA'

export interface StageNavItem {
  label: string
  href: string
}

export interface StageResource {
  label: string
  href: string
  desc?: string
}

export interface StageLayoutProps {
  stageIndex: number
  stageTotal: number
  stageLabel: string
  title: string
  subtitle: string
  /** 这个阶段的核心矛盾，1-2 段 */
  coreProblem: React.ReactNode
  /** 最容易踩的坑 */
  pitfalls: { title: string; body: string }[]
  /** 怎么判断 / 判断标准 */
  criteria: { title: string; body: string }[]
  /** 工具 / 清单 / 文章入口（建议 2-4 个） */
  tools: StageResource[]
  /** 直接服务入口（1-2 个） */
  services: StageResource[]
  /** 上一步 / 下一步导航 */
  prev?: StageNavItem
  next?: StageNavItem
}

const stageColorMap = ['#a8a29e', '#a8a29e', '#a8a29e', '#a8a29e', '#a8a29e', '#a8a29e']

export default function StageLayout({
  stageIndex,
  stageTotal,
  stageLabel,
  title,
  subtitle,
  coreProblem,
  pitfalls,
  criteria,
  tools,
  services,
  prev,
  next,
}: StageLayoutProps) {
  return (
    <>
      {/* Hero */}
      <div className="pt-12 sm:pt-16 pb-10 sm:pb-12 border-b border-border bg-surface-warm">
        <Container size="content">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-ink-faint">
              装修判断 · 第 {String(stageIndex).padStart(2, '0')} / {String(stageTotal).padStart(2, '0')} 步
            </span>
            <span className="text-xs text-ink-faint">·</span>
            <span className="text-xs text-ink-faint">{stageLabel}</span>
          </div>
          <h1 className="page-title mb-5">{title}</h1>
          <p className="text-base sm:text-lg text-ink-muted leading-[1.7] max-w-2xl">
            {subtitle}
          </p>
        </Container>
      </div>

      {/* 进度条 */}
      <div className="border-b border-border bg-surface">
        <Container size="content" className="py-4">
          <ol className="flex items-center gap-1.5 text-[11px] sm:text-xs">
            {Array.from({ length: stageTotal }).map((_, i) => {
              const n = i + 1
              const isCurrent = n === stageIndex
              const isPast = n < stageIndex
              return (
                <li key={n} className="flex-1 flex flex-col items-center gap-1.5">
                  <span
                    className={`h-1 w-full ${
                      isCurrent
                        ? 'bg-stone'
                        : isPast
                        ? 'bg-stone/40'
                        : 'bg-border'
                    }`}
                  />
                  <span
                    className={`${
                      isCurrent
                        ? 'text-ink font-semibold'
                        : isPast
                        ? 'text-ink-faint'
                        : 'text-ink-faint/60'
                    }`}
                  >
                    {n}
                  </span>
                </li>
              )
            })}
          </ol>
        </Container>
      </div>

      <Container size="content" className="py-section space-y-16">
        {/* 核心问题 */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-4">
            这个阶段在解决什么
          </h2>
          <div className="prose-stage space-y-4 text-base text-ink-muted leading-[1.8]">
            {coreProblem}
          </div>
        </section>

        {/* 最容易踩的坑 */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-5">
            最容易踩的坑
          </h2>
          <div className="grid sm:grid-cols-2 gap-px bg-border border border-border">
            {pitfalls.map((item, i) => (
              <div key={i} className="bg-surface p-5 sm:p-6">
                <p className="text-[11px] text-ink-faint font-semibold mb-2">
                  坑 {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="text-base font-semibold text-ink mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 怎么判断 */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-5">
            怎么判断
          </h2>
          <div className="border border-border bg-surface divide-y divide-border">
            {criteria.map((item, i) => (
              <div key={i} className="p-5 sm:p-6 flex items-start gap-4">
                <span className="text-stone/40 text-xl font-light shrink-0 leading-none mt-0.5">
                  ·
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink mb-1.5">{item.title}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 工具 + 服务 */}
        <section className="border border-border bg-surface-warm">
          <div className="p-6 sm:p-7 border-b border-border">
            <p className="text-[11px] text-ink-faint font-semibold uppercase tracking-widest mb-2">
              你可以这样动手
            </p>
            <h2 className="text-lg font-semibold text-ink">从自己能做的开始，卡住了再交给我</h2>
          </div>

          {tools.length > 0 && (
            <div className="px-6 sm:px-7 py-5 border-b border-border">
              <p className="text-xs text-ink-faint mb-3">自己先跑一轮（免费 / 低价）</p>
              <div className="flex flex-wrap gap-3">
                {tools.map((t, i) => (
                  <CTA key={i} href={t.href} label={t.label} variant={i === 0 ? 'primary' : 'secondary'} />
                ))}
              </div>
            </div>
          )}

          {services.length > 0 && (
            <div className="px-6 sm:px-7 py-5">
              <p className="text-xs text-ink-faint mb-3">需要人工判断时（付费服务）</p>
              <div className="flex flex-wrap gap-3">
                {services.map((s, i) => (
                  <CTA key={i} href={s.href} label={s.label} variant="ghost" />
                ))}
              </div>
            </div>
          )}
        </section>
      </Container>

      {/* 上一步 / 下一步 */}
      <div className="border-t border-border bg-surface">
        <Container size="content" className="py-8 grid grid-cols-2 gap-4">
          <div>
            {prev && (
              <Link
                href={prev.href}
                className="group block border border-border bg-surface p-5 hover:border-stone transition-colors"
              >
                <p className="text-[11px] text-ink-faint mb-1">← 上一步</p>
                <p className="text-sm font-semibold text-ink group-hover:text-stone">{prev.label}</p>
              </Link>
            )}
          </div>
          <div>
            {next && (
              <Link
                href={next.href}
                className="group block border border-border bg-surface p-5 hover:border-stone transition-colors text-right"
              >
                <p className="text-[11px] text-ink-faint mb-1">下一步 →</p>
                <p className="text-sm font-semibold text-ink group-hover:text-stone">{next.label}</p>
              </Link>
            )}
          </div>
        </Container>
      </div>
    </>
  )
}
