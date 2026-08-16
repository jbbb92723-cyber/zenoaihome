import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import CommentModerationList, { type ModerationComment } from '@/components/admin/CommentModerationList'

export const metadata: Metadata = { title: '文章评论 · Admin' }
export const dynamic = 'force-dynamic'

const STATUSES = [
  { value: 'pending', label: '待审核' },
  { value: 'approved', label: '已公开' },
  { value: 'rejected', label: '已拒绝' },
  { value: 'spam', label: '垃圾评论' },
]

export default async function AdminCommentsPage({ searchParams }: { searchParams: { status?: string } }) {
  const status = STATUSES.some((item) => item.value === searchParams.status) ? searchParams.status : undefined
  const comments = await prisma.comment.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: {
      user: { select: { id: true, name: true, email: true } },
      moderator: { select: { name: true, email: true } },
    },
  })

  const serialized: ModerationComment[] = comments.map((comment) => ({
    id: comment.id,
    articleSlug: comment.articleSlug,
    content: comment.content,
    status: comment.status,
    moderationNote: comment.moderationNote,
    createdAt: comment.createdAt.toISOString(),
    moderatedAt: comment.moderatedAt?.toISOString() ?? null,
    user: comment.user,
    moderator: comment.moderator,
  }))

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-widest text-[#706860]">Content Operations</p><h1 className="text-xl font-semibold tracking-tight text-[#E8E2DA]">文章评论</h1><p className="mt-2 max-w-2xl text-xs leading-5 text-[#706860]">只公开真实、有信息量的讨论。评论是问题采集入口，不是公开热度榜。</p></div>
        <Link href="/blog" target="_blank" className="border border-[#3A3530] px-4 py-2 text-xs text-[#A09890] hover:text-[#E8E2DA]">查看文章页</Link>
      </div>
      <nav className="flex flex-wrap gap-2" aria-label="评论状态筛选">
        <FilterLink href="/admin/comments" active={!status} label="全部" />
        {STATUSES.map((item) => <FilterLink key={item.value} href={`/admin/comments?status=${item.value}`} active={status === item.value} label={item.label} />)}
      </nav>
      <CommentModerationList comments={serialized} />
      <p className="text-xs leading-5 text-[#706860]">当前列表最多显示最近 200 条。评论是否值得成为文章、工具或服务的输入，仍由人工判断。</p>
    </div>
  )
}

function FilterLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return <Link href={href} className={`border px-3 py-1.5 text-xs transition-colors ${active ? 'border-[#C4A882]/40 bg-[#C4A882]/10 text-[#C4A882]' : 'border-[#3A3530] text-[#706860] hover:text-[#E8E2DA]'}`}>{label}</Link>
}
