/**
 * components/admin/BarList.tsx
 * 可复用横向柱状列表 — 用于分类分布、资产明细等
 *
 * 零依赖，纯 CSS 实现
 */

interface BarListItem {
  label: string
  value: number
  max?: number
  tone?: 'gold' | 'green' | 'teal' | 'coral' | 'neutral'
  indent?: boolean // 子项缩进
}

interface BarListProps {
  items: BarListItem[]
  title?: string
  emptyLabel?: string
}

const BAR_COLORS: Record<string, string> = {
  gold:    'bg-[#C4A882]',
  green:   'bg-green-400',
  teal:    'bg-[#68aeb0]',
  coral:   'bg-[#d2846f]',
  neutral: 'bg-[#706860]',
}

export default function BarList({ items, title, emptyLabel = '暂无数据' }: BarListProps) {
  if (!items.length) {
    return (
      <div>
        {title && <h3 className="text-sm font-semibold text-[#E8E2DA] mb-3">{title}</h3>}
        <p className="text-sm text-[#706860] py-4">{emptyLabel}</p>
      </div>
    )
  }

  const globalMax = Math.max(1, ...items.map((item) => item.max ?? item.value))
  // 如果单个 max 超过 globalMax，则以其自身为满条；否则用全局最大值统一比例
  const effectiveMax = (item: BarListItem) => (item.max ? Math.max(globalMax, item.max) : globalMax)

  return (
    <div>
      {title && <h3 className="text-sm font-semibold text-[#E8E2DA] mb-3">{title}</h3>}
      <div className="space-y-2.5">
        {items.map((item, index) => {
          const max = effectiveMax(item)
          const width = Math.min(100, Math.round((item.value / max) * 100))
          const color = BAR_COLORS[item.tone ?? 'neutral'] ?? BAR_COLORS.neutral
          return (
            <div key={`${item.label}-${index}`} className={item.indent ? 'ml-4' : ''}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#A09890] truncate mr-2">{item.label}</span>
                <span className="text-[#E8E2DA] font-mono shrink-0">{item.value}</span>
              </div>
              <div className="h-2 bg-[#141410] border border-[#2A2825] rounded-full overflow-hidden">
                <div
                  className={`h-full min-w-[2px] rounded-full transition-all ${color}`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
