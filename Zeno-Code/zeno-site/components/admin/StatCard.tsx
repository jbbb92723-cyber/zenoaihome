/**
 * components/admin/StatCard.tsx
 * 可复用统计卡片 — 用于数字资产大屏
 *
 * tone: 'gold' | 'green' | 'teal' | 'coral' | 'neutral'
 */

import Link from 'next/link'

interface StatCardProps {
  label: string
  value: string | number
  subtitle?: string
  tone?: 'gold' | 'green' | 'teal' | 'coral' | 'neutral'
  href?: string
  span?: number // grid column span
}

const TONE_CLASSES: Record<string, { value: string; bg: string }> = {
  gold:    { value: 'text-[#C4A882]', bg: 'bg-[#C4A882]/10' },
  green:   { value: 'text-green-400', bg: 'bg-green-400/10' },
  teal:    { value: 'text-[#68aeb0]', bg: 'bg-[#68aeb0]/10' },
  coral:   { value: 'text-[#d2846f]', bg: 'bg-[#d2846f]/10' },
  neutral: { value: 'text-[#E8E2DA]', bg: 'bg-[#E8E2DA]/5' },
}

export default function StatCard({
  label,
  value,
  subtitle,
  tone = 'neutral',
  href,
}: StatCardProps) {
  const colors = TONE_CLASSES[tone] ?? TONE_CLASSES.neutral

  const card = (
    <div className="border border-[#3A3530] bg-[#252320] px-5 py-4 transition-colors hover:border-[#4A4540]">
      <p className="text-xs text-[#706860] mb-1">{label}</p>
      <p className={`text-2xl font-semibold ${colors.value}`}>{value}</p>
      {subtitle && (
        <p className="text-[0.65rem] text-[#504840] mt-1">{subtitle}</p>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {card}
      </Link>
    )
  }

  return card
}
