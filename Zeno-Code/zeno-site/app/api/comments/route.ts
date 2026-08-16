import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getArticleBySlug } from '@/data/content/articles'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rateLimit'
import { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

function isTransientDatabaseError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return ['P1001', 'P1002', 'P1008', 'P1017', 'P2024', 'P2037'].includes(error.code)
  }
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return ['P1001', 'P1002', 'P1017'].includes(error.errorCode ?? '')
  }
  return false
}

function commentErrorResponse(error: unknown) {
  if (isTransientDatabaseError(error)) {
    return { message: '评论服务正在重新连接，请稍后再试。', status: 503 }
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
    return { message: '登录账号状态已失效，请退出后重新登录。', status: 409 }
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021') {
    return { message: '评论服务尚未完成数据库配置。', status: 503 }
  }
  return { message: '评论提交失败，请稍后再试。', status: 500 }
}

async function createCommentWithRetry(data: {
  id: string
  userId: string
  articleSlug: string
  content: string
}) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await prisma.comment.create({
        data: { ...data, status: 'pending' },
        select: { id: true, status: true, createdAt: true },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const existing = await prisma.comment.findUnique({
          where: { id: data.id },
          select: { id: true, status: true, createdAt: true },
        })
        if (existing) return existing
      }
      if (!isTransientDatabaseError(error) || attempt === 1) throw error
      await new Promise((resolve) => setTimeout(resolve, 350))
    }
  }
  throw new Error('Comment creation retry exhausted')
}

export async function POST(request: NextRequest) {
  let session
  try {
    session = await auth()
  } catch (error) {
    console.error('[API] comment authentication error:', error)
    return NextResponse.json({ message: '登录状态暂时无法确认，请稍后再试。' }, { status: 503 })
  }
  if (!session?.user) {
    return NextResponse.json(
      { message: '请先登录后再发表评论。' },
      { status: 401 },
    )
  }

  // ─── 解析请求体 ──────────────────────────────────────────────
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: '请求格式错误。' }, { status: 400 })
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    typeof (body as Record<string, unknown>).articleSlug !== 'string' ||
    typeof (body as Record<string, unknown>).content !== 'string' ||
    typeof (body as Record<string, unknown>).requestId !== 'string'
  ) {
    return NextResponse.json({ message: '缺少必要字段。' }, { status: 400 })
  }

  const { articleSlug, content, requestId } = body as { articleSlug: string; content: string; requestId: string }

  // ─── 内容校验 ────────────────────────────────────────────────
  const trimmedContent = content.trim()
  if (!trimmedContent) {
    return NextResponse.json({ message: '评论内容不能为空。' }, { status: 400 })
  }
  if (trimmedContent.length > 2000) {
    return NextResponse.json({ message: '评论内容不能超过 2000 字。' }, { status: 400 })
  }
  if (!articleSlug || articleSlug.length > 200) {
    return NextResponse.json({ message: '无效的文章标识。' }, { status: 400 })
  }
  if (!/^[0-9a-f-]{36}$/i.test(requestId)) {
    return NextResponse.json({ message: '无效的评论请求。' }, { status: 400 })
  }

  if (!getArticleBySlug(articleSlug)) {
    return NextResponse.json({ message: '文章不存在。' }, { status: 404 })
  }

  const limit = checkRateLimit(`comment:${session.user.id}:${articleSlug}`, 3, 60 * 60 * 1000)
  if (!limit.allowed) {
    return NextResponse.json({ message: '评论提交过于频繁，请稍后再试。' }, { status: 429 })
  }

  try {
    const comment = await createCommentWithRetry({
      id: requestId,
      userId: session.user.id,
      articleSlug,
      content: trimmedContent,
    })

    return NextResponse.json(
      {
        message: '评论已提交，审核通过后将公开显示。',
        comment,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('[API] comment creation error:', error)
    const response = commentErrorResponse(error)
    return NextResponse.json(
      { message: response.message },
      { status: response.status },
    )
  }
}

// GET 方法：获取某篇文章的已审核评论
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ message: '缺少 slug 参数。' }, { status: 400 })
  }

  if (!getArticleBySlug(slug)) {
    return NextResponse.json({ message: '文章不存在。' }, { status: 404 })
  }

  const comments = await prisma.comment.findMany({
    where: {
      articleSlug: slug,
      status: 'approved',
    },
    include: {
      user: { select: { name: true } },
    },
    orderBy: { createdAt: 'asc' },
    take: 100,
  })

  return NextResponse.json({
    comments: comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      authorName: comment.user.name || '读者',
    })),
  })
}
