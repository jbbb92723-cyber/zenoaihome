import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { commercialLadder, type LadderRung } from '@/data/commercial-ladder'

/**
 * 全站统一商业梯子渲染。三种 variant：
 * - compact：横向紧凑卡片，用于首页 CTA 区
 * - full  ：竖向完整卡片，用于服务页"装修签约前判断阶梯"
 * - summary：价格页顶部"业主决策路径"导航
 *
 * 数据源：data/commercial-ladder.ts。不要在调用处重复写价格和档位。
 */

type Variant = 'compact' | 'full' | 'summary'

type Props = {
  variant?: Variant
  /** 可选：限定展示的档位（按 tier 过滤）。不传则展示完整主路径 */
  rungs?: LadderRung[]
  className?: string
}

const tierAccent: Record<LadderRung['tier'], string> = {
  free: 'bg-[#3f6258] text-white',
  'paid-low': 'bg-[#f0e6d8] text-[#5f3b24]',
  'paid-mid': 'bg-[#9a5424] text-white',
  'paid-high': 'bg-[#7f421a] text-white',
  'paid-flagship': 'bg-[#272421] text-white',
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
            className="group relative flex h-full flex-col border border-[#e7ded3] bg-white/80 p-5 transition-all hover:-translate-y-px hover:border-[#b9875d] hover:bg-white"
          >
            {r.badge && (
              <span className="absolute -top-2 left-4 bg-[#272421] px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-widest text-white">
                {r.badge}
              </span>
            )}
            <div className="mb-3 flex items-baseline justify-between">
              <span
                className={`px-2 py-0.5 text-xs font-semibold ${tierAccent[r.tier]}`}
              >
                {r.price}
              </span>
              <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#9a8472]">
                {r.source === 'tool'
                  ? '工具'
                  : r.source === 'product'
                    ? '资料'
                    : '人工服务'}
              </span>
            </div>
            <h3 className="text-base font-semibold leading-snug text-[#272421]">
              {r.title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#7b6d5d]">
              {r.whoFor}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-[#5f3b24]">
              {r.delivers}
            </p>
            <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-medium text-[#7b4b2b] group-hover:gap-2 group-hover:text-[#4b2b18]">
              {r.cta}
              <ArrowRight size={14} aria-hidden />
            </span>
          </Link>
        ))}
      </div>
    )
  }

  if (variant === 'summary') {
    // 价格页顶部用：横向滚动一行 6 个 chip，每个跳转到对应锚点/页面
    return (
      <div
        className={`flex flex-wrap items-stretch gap-3 ${className}`}
        aria-label="业主签约前判断梯子"
      >
        {items.map((r) => (
          <Link
            key={r.title}
            href={r.href}
            className="group flex min-w-[14rem] flex-1 items-center gap-3 border border-[#e7ded3] bg-white px-4 py-3 transition-colors hover:border-[#b9875d] hover:bg-[#fbf8f4]"
          >
            <span
              className={`shrink-0 px-2 py-0.5 text-xs font-semibold ${tierAccent[r.tier]}`}
            >
              {r.price}
            </span>
            <span className="flex flex-col text-left">
              <span className="text-sm font-medium leading-tight text-[#272421]">
                {r.title}
              </span>
              <span className="mt-0.5 text-[0.7rem] leading-tight text-[#9a8472]">
                {r.whoFor}
              </span>
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
          className="grid gap-4 border border-[#e7ded3] bg-white/70 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#9a8472]">
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
              <h3 className="text-base font-semibold text-[#272421]">
                {r.title}
              </h3>
              {r.badge && (
                <span className="bg-[#f0e6d8] px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-widest text-[#5f3b24]">
                  {r.badge}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-[#9a8472]">适合：{r.whoFor}</p>
            <p className="mt-1 text-sm text-[#5f3b24]">{r.delivers}</p>
          </div>
          <Link
            href={r.href}
            className="inline-flex items-center justify-center gap-1 border border-[#9a5424] px-4 py-2 text-xs font-semibold text-[#9a5424] transition-colors hover:bg-[#9a5424] hover:text-white sm:justify-self-end"
          >
            {r.cta}
            <ArrowRight size={14} aria-hidden />
          </Link>
        </li>
      ))}
    </ol>
  )
}
