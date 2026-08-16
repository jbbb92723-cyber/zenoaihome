import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getArticleBySlug } from '@/data/content/articles'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  // ─── 认证检查 ────────────────────────────────────────────────
  const session = await auth()
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
    typeof (body as Record<string, unknown>).content !== 'string'
  ) {
    return NextResponse.json({ message: '缺少必要字段。' }, { status: 400 })
  }

  const { articleSlug, content } = body as { articleSlug: string; content: string }

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

  if (!getArticleBySlug(articleSlug)) {
    return NextResponse.json({ message: '文章不存在。' }, { status: 404 })
  }

  const limit = checkRateLimit(`comment:${session.user.id}:${articleSlug}`, 3, 60 * 60 * 1000)
  if (!limit.allowed) {
    return NextResponse.json({ message: '评论提交过于频繁，请稍后再试。' }, { status: 429 })
  }

  const comment = await prisma.comment.create({
    data: {
      userId: session.user.id,
      articleSlug,
      content: trimmedContent,
      status: 'pending',
    },
    select: { id: true, status: true, createdAt: true },
  })

  return NextResponse.json(
    {
      message: '评论已提交，审核通过后将公开显示。',
      comment,
    },
    { status: 201 },
  )
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
