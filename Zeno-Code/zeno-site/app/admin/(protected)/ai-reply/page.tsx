import type { Metadata } from 'next'
import AiReplyClient from '@/components/admin/AiReplyClient'

export const metadata: Metadata = { title: 'AI 智能回复 · Admin' }
export const dynamic = 'force-dynamic'

export default function AiReplyPage() {
  return (
    <div className="max-w-[1400px]">
      <div className="mb-5">
        <p className="text-[0.65rem] text-[#706860] uppercase tracking-widest font-semibold mb-1">
          AI Tools · 智能工具
        </p>
        <h1 className="text-xl font-semibold text-[#E8E2DA] tracking-tight">智能回复</h1>
        <p className="text-xs text-[#706860] mt-2">模板库 + AI 草稿，快速回复业主常见问题</p>
      </div>
      <AiReplyClient />
    </div>
  )
}
