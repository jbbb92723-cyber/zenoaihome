import { NextRequest, NextResponse } from 'next/server'
import { requireAdminActor } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import { getClientIp } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

const COMMENT_STATUSES = ['pending', 'approved', 'rejected', 'spam'] as const
type CommentStatus = typeof COMMENT_STATUSES[number]

function isCommentStatus(value: unknown): value is CommentStatus {
  return typeof value === 'string' && COMMENT_STATUSES.includes(value as CommentStatus)
}

async function getActor() {
  try {
    return await requireAdminActor()
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  if (!(await getActor())) return NextResponse.json({ message: '未授权' }, { status: 401 })

  const status = new URL(request.url).searchParams.get('status')
  const comments = await prisma.comment.findMany({
    where: isCommentStatus(status) ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: {
      user: { select: { id: true, name: true, email: true } },
      moderator: { select: { name: true, email: true } },
    },
  })

  return NextResponse.json({
    comments: comments.map((comment) => ({
      ...comment,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
      moderatedAt: comment.moderatedAt?.toISOString() ?? null,
    })),
  })
}

export async function PATCH(request: NextRequest) {
  const actor = await getActor()
  if (!actor) return NextResponse.json({ message: '未授权' }, { status: 401 })

  const body = await request.json().catch(() => null) as {
    id?: unknown
    status?: unknown
    moderationNote?: unknown
  } | null

  if (typeof body?.id !== 'string' || !body.id.trim() || !isCommentStatus(body.status)) {
    return NextResponse.json({ message: '评论 ID 或审核状态无效' }, { status: 400 })
  }

  const moderationNote = typeof body.moderationNote === 'string'
    ? body.moderationNote.trim().slice(0, 500) || null
    : null

  try {
    const comment = await prisma.comment.update({
      where: { id: body.id },
      data: {
        status: body.status,
        moderationNote,
        moderatorId: actor.id,
        moderatedAt: new Date(),
      },
      select: { id: true, status: true, moderationNote: true, moderatedAt: true },
    })

    await prisma.adminLog.create({
      data: {
        action: `moderate_comment_${body.status}`,
        target: body.id,
        detail: { status: body.status, moderationNote },
        ip: getClientIp(request),
        actorId: actor.id,
        actorEmail: actor.email,
      },
    })

    return NextResponse.json({ comment })
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ message: '评论不存在或已被删除' }, { status: 404 })
    }
    console.error('[API] admin comments PATCH error:', error)
    return NextResponse.json({ message: '审核操作失败，请稍后重试' }, { status: 500 })
  }
}
