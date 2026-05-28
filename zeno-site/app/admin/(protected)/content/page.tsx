import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = { title: '内容草稿 · Admin' }
export const dynamic = 'force-dynamic'

const STATUS_LABEL: Record<string, string> = {
  draft:     '草稿',
  staged:    '已入草稿区',
  approved:  '已审核',
  returned:  '已退回',
  published: '已发布',
  archived:  '已归档',
}

const APPROVAL_LABEL: Record<string, string> = {
  pending:  '待人工审批',
  approved: '人工通过',
  returned: '已退回',
}

const STATUS_COLOR: Record<string, string> = {
  draft:     'text-[#C4A882]',
  staged:    'text-[#C4A882]',
  approved:  'text-green-400',
  returned:  'text-yellow-400',
  published: 'text-green-400',
  archived:  'text-[#706860]',
}

function dateLabel(value: Date) {
  return value.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; approval?: string }>
}) {
  const params = await searchParams
  const statusFilter = params.status ?? ''
  const approvalFilter = params.approval ?? ''

  const where = {
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(approvalFilter ? { approvalStatus: approvalFilter } : {}),
  }

  const drafts = await prisma.websiteContentDraft.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    take: 100,
  })

  const counts = {
    total:     drafts.length,
    pending:   drafts.filter((d) => d.approvalStatus === 'pending').length,
    approved:  drafts.filter((d) => d.approvalStatus === 'approved').length,
    published: drafts.filter((d) => d.status === 'published').length,
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.65rem] text-[#706860] uppercase tracking-widest font-semibold mb-1">
            Admin · Content Hub
          </p>
          <h1 className="text-xl font-semibold text-[#E8E2DA] tracking-tight">内容草稿</h1>
          <p className="text-sm text-[#706860] mt-2">
            这里承接飞书内容中台 / Hermes / CLI 推送过来的网站草稿。进入真实发布前，仍需要人工审批。
          </p>
        </div>
        <Link
          href="/admin/dashboard"
          className="text-xs text-[#706860] hover:text-[#A09890] transition-colors"
        >
          返回看板
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: '当前列表', value: counts.total, color: 'text-[#E8E2DA]' },
          { label: '待审批', value: counts.pending, color: 'text-[#C4A882]' },
          { label: '人工通过', value: counts.approved, color: 'text-green-400' },
          { label: '已发布', value: counts.published, color: 'text-green-400' },
        ].map((item) => (
          <div key={item.label} className="border border-[#3A3530] bg-[#252320] px-4 py-3">
            <p className="text-xs text-[#706860] mb-1">{item.label}</p>
            <p className={`text-xl font-semibold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          ['', '全部状态'],
          ['draft', '草稿'],
          ['staged', '已入草稿区'],
          ['approved', '已审核'],
          ['returned', '已退回'],
          ['published', '已发布'],
        ].map(([value, label]) => (
          <Link
            key={value}
            href={value ? `/admin/content?status=${value}` : '/admin/content'}
            className={`text-xs px-3 py-1.5 border transition-colors ${
              statusFilter === value
                ? 'border-[#C4A882]/50 text-[#C4A882] bg-[#C4A882]/10'
                : 'border-[#3A3530] text-[#706860] hover:text-[#E8E2DA]'
            }`}
          >
            {label}
          </Link>
        ))}
        {[
          ['pending', '待人工审批'],
          ['approved', '人工通过'],
          ['returned', '已退回'],
        ].map(([value, label]) => (
          <Link
            key={value}
            href={`/admin/content?approval=${value}`}
            className={`text-xs px-3 py-1.5 border transition-colors ${
              approvalFilter === value
                ? 'border-[#C4A882]/50 text-[#C4A882] bg-[#C4A882]/10'
                : 'border-[#3A3530] text-[#706860] hover:text-[#E8E2DA]'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="border border-[#3A3530] bg-[#252320] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#3A3530]">
              {['标题 / Slug', '中台ID', '状态', '评分', 'SEO', '时间'].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-3 text-left text-xs text-[#706860] uppercase tracking-widest font-semibold whitespace-nowrap"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {drafts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-[#706860] text-sm">
                  还没有内容草稿。先让内容中台通过 internal API 推送一篇。
                </td>
              </tr>
            ) : (
              drafts.map((draft) => (
                <tr key={draft.id} className="border-b border-[#3A3530] last:border-0 hover:bg-[#2A2825] transition-colors align-top">
                  <td className="px-4 py-3 min-w-[280px] max-w-[360px]">
                    <p className="text-[#E8E2DA] truncate" title={draft.title}>
                      {draft.title}
                    </p>
                    <p className="text-xs text-[#504840] font-mono truncate mt-1">{draft.slug}</p>
                    {draft.qualitySummary && (
                      <p className="text-xs text-[#706860] leading-relaxed mt-2 line-clamp-2">
                        {draft.qualitySummary}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 min-w-[190px] text-xs">
                    <p className="text-[#A09890] font-mono">{draft.contentId}</p>
                    {draft.briefId && <p className="text-[#504840] font-mono mt-1">{draft.briefId}</p>}
                    {draft.adapterId && <p className="text-[#504840] mt-1">{draft.adapterId}</p>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs">
                    <p className={STATUS_COLOR[draft.status] ?? 'text-[#706860]'}>
                      {STATUS_LABEL[draft.status] ?? draft.status}
                    </p>
                    <p className="text-[#706860] mt-1">
                      {APPROVAL_LABEL[draft.approvalStatus] ?? draft.approvalStatus}
                    </p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#C4A882]">
                    {draft.reviewScore ?? '—'}
                  </td>
                  <td className="px-4 py-3 min-w-[260px] max-w-[340px]">
                    <p className="text-xs text-[#A09890] truncate">
                      {draft.metaTitle ?? draft.title}
                    </p>
                    <p className="text-xs text-[#504840] leading-relaxed mt-1 line-clamp-2">
                      {draft.metaDescription ?? draft.excerpt ?? '未填写 meta description'}
                    </p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-[#706860]">
                    <p>更新 {dateLabel(draft.updatedAt)}</p>
                    <p className="mt-1">创建 {dateLabel(draft.createdAt)}</p>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
