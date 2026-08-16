import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getArticleBySlug } from '@/data/content/articles'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

const VISITOR_COOKIE = 'zeno_visitor_id'
const REACTION_KIND = 'helpful'

function getOrCreateVisitorId(request: NextRequest) {
  return request.cookies.get(VISITOR_COOKIE)?.value || randomUUID()
}

async function getCounts(slug: string, visitorId: string) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const [helpful, comments, currentReaction] = await Promise.all([
        prisma.articleReaction.count({ where: { articleSlug: slug, kind: REACTION_KIND } }),
        prisma.comment.count({ where: { articleSlug: slug, status: 'approved' } }),
        prisma.articleReaction.findUnique({
          where: {
            articleSlug_kind_visitorId: {
              articleSlug: slug,
              kind: REACTION_KIND,
              visitorId,
            },
          },
          select: { id: true },
        }),
      ])

      return { helpful, comments, hasReacted: Boolean(currentReaction), available: Boolean(process.env.DATABASE_URL) }
    } catch (error) {
      if (attempt === 1) throw error
      await new Promise((resolve) => setTimeout(resolve, 300))
    }
  }
  return { helpful: 0, comments: 0, hasReacted: false, available: false }
}

function withVisitorCookie(response: NextResponse, visitorId: string, request: NextRequest) {
  if (!request.cookies.get(VISITOR_COOKIE)) {
    response.cookies.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    })
  }
  return response
}

async function handleGet(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  if (!getArticleBySlug(params.slug)) {
    return NextResponse.json({ message: '文章不存在。' }, { status: 404 })
  }

  const visitorId = getOrCreateVisitorId(request)
  const response = NextResponse.json(await getCounts(params.slug, visitorId))
  return withVisitorCookie(response, visitorId, request)
}

async function handlePost(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  if (!getArticleBySlug(params.slug)) {
    return NextResponse.json({ message: '文章不存在。' }, { status: 404 })
  }

  const body = await request.json().catch(() => null) as { kind?: string; method?: string } | null
  const visitorId = getOrCreateVisitorId(request)
  let sessionUserId: string | null = null
  try {
    const session = await auth()
    sessionUserId = session?.user?.id ?? null
  } catch {
    // 分享和“有帮助”不依赖登录；Auth.js 配置异常时仍允许匿名互动。
  }

  if (body?.kind === 'share') {
    const limit = checkRateLimit(`article-share:${visitorId}`, 60, 60 * 60 * 1000)
    if (!limit.allowed) return NextResponse.json({ message: '分享操作过于频繁，请稍后再试。' }, { status: 429 })
    await prisma.analyticsEvent.create({
      data: {
        userId: sessionUserId,
        event: 'article_share',
        path: `/blog/${params.slug}`,
        metadata: { articleSlug: params.slug, method: body.method || 'unknown' },
      },
    })
    return withVisitorCookie(NextResponse.json({ ok: true }), visitorId, request)
  }

  if (body?.kind !== REACTION_KIND) {
    return NextResponse.json({ message: '不支持的互动类型。' }, { status: 400 })
  }

  const limit = checkRateLimit(`article-reaction:${visitorId}`, 30, 24 * 60 * 60 * 1000)
  if (!limit.allowed) return NextResponse.json({ message: '操作过于频繁，请明天再试。' }, { status: 429 })

  const reactionWhere = {
    articleSlug: params.slug,
    kind: REACTION_KIND,
    visitorId,
  }

  const deleted = await prisma.articleReaction.deleteMany({
    where: {
      ...reactionWhere,
    },
  })

  const hasReacted = deleted.count === 0
  if (hasReacted) {
    await prisma.articleReaction.create({
      data: {
        ...reactionWhere,
        userId: sessionUserId,
      },
    })
  }

  const counts = await getCounts(params.slug, visitorId).catch((error) => {
    console.error('[API] engagement count after mutation error:', error)
    return { helpful: 0, comments: 0, hasReacted, available: false }
  })
  const response = NextResponse.json({ ok: true, ...counts, hasReacted })
  return withVisitorCookie(response, visitorId, request)
}

export async function GET(
  request: NextRequest,
  context: { params: { slug: string } },
) {
  try {
    return await handleGet(request, context)
  } catch (error) {
    console.error('[API] engagement GET error:', error)
    return NextResponse.json({ message: '互动数据正在重新连接，请稍后再试。' }, { status: 503 })
  }
}

export async function POST(
  request: NextRequest,
  context: { params: { slug: string } },
) {
  try {
    return await handlePost(request, context)
  } catch (error) {
    console.error('[API] engagement POST error:', error)
    return NextResponse.json({ message: '互动暂时无法提交，请稍后再试。' }, { status: 503 })
  }
}
