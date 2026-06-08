import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { commercialLadder, type LadderRung } from '@/data/commercial-ladder'

/**
 * 全站统一商业梯子渲染。三种 variant：
 * - compact：横向紧凑卡片，用于首页 CTA 区
 * - full  ：竖向完整卡片，用于服务页"装修签约前判断阶梯"
 *
 * 数据源：data/commercial-ladder.ts。不要在调用处重复写价格和档位。
 */

type Variant = 'compact' | 'full'

type Props = {
  variant?: Variant
  /** 可选：限定展示的档位（按 tier 过滤）。不传则展示完整主路径 */
  rungs?: LadderRung[]
  className?: string
}

const tierAccent: Record<LadderRung['tier'], string> = {
  free: 'bg-stone text-white',
  'paid-low': 'bg-stone-pale text-stone-deep',
  'paid-mid': 'bg-stone-deep text-white',
  'paid-high': 'bg-[#31485c] text-white',
  'paid-flagship': 'bg-ink text-white',
}

export default function CommercialLadder({
  variant = 'full',
  rungs,
  className = '',
}: Props) {
  const items = rungs ?? commercialLadder

  if (variant === 'compact') {
    return (
      <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
        {items.map((r) => (
          <Link
            key={r.title}
            href={r.href}
            className="group decision-card relative flex h-full flex-col p-5 transition-all hover:-translate-y-px hover:border-stone hover:bg-surface"
          >
            {r.badge && (
              <span className="absolute -top-2 left-4 bg-ink px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-widest text-white">
                {r.badge}
              </span>
            )}
            <div className="mb-3 flex items-baseline justify-between">
              <span
                className={`px-2 py-0.5 text-xs font-semibold ${tierAccent[r.tier]}`}
              >
                {r.price}
              </span>
              <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-ink-faint">
                {r.source === 'tool'
                  ? '工具'
                  : r.source === 'product'
                    ? '资料'
                    : '人工服务'}
              </span>
            </div>
            <h3 className="text-base font-semibold leading-snug text-ink">
              {r.title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-ink-muted">
              {r.whoFor}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-stone-deep">
              {r.delivers}
            </p>
            <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-medium text-stone group-hover:gap-2 group-hover:text-stone-deep">
              {r.cta}
              <ArrowRight size={14} aria-hidden />
            </span>
          </Link>
        ))}
      </div>
    )
  }

  // full（默认）：服务页用，每条带"适合谁 / 给你什么 / CTA"
  return (
    <ol className={`space-y-3 ${className}`}>
      {items.map((r, idx) => (
        <li
          key={r.title}
          className="grid gap-4 border border-border bg-surface/88 p-5 transition-colors hover:border-stone sm:grid-cols-[auto_1fr_auto] sm:items-center"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-ink-faint">
              0{idx + 1}
            </span>
            <span
              className={`px-2 py-1 text-sm font-semibold ${tierAccent[r.tier]}`}
            >
              {r.price}
            </span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-ink">
                {r.title}
              </h3>
              {r.badge && (
                <span className="bg-stone-pale px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-widest text-stone-deep">
                  {r.badge}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-ink-faint">适合：{r.whoFor}</p>
            <p className="mt-1 text-sm text-stone-deep">{r.delivers}</p>
          </div>
          <Link
            href={r.href}
            className="inline-flex items-center justify-center gap-1 border border-stone px-4 py-2 text-xs font-semibold text-stone transition-colors hover:bg-stone hover:text-white sm:justify-self-end"
          >
            {r.cta}
            <ArrowRight size={14} aria-hidden />
          </Link>
        </li>
      ))}
    </ol>
  )
}
