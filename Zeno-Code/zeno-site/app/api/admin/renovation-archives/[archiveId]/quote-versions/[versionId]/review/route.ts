import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getClientIp } from '@/lib/rateLimit'
import {
  isRenovationArchiveEnabled,
  RENOVATION_ARCHIVE_DISABLED_BODY,
} from '@/lib/domains/renovation-archive/feature'
import {
  markQuoteVersionZenoReviewed,
  RenovationArchiveError,
} from '@/lib/domains/renovation-archive/service'
import { renovationArchiveHttpError } from '@/lib/domains/renovation-archive/http'
import { readJsonBodyWithLimit } from '@/lib/domains/renovation-archive/http'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const paramsSchema = z.object({
  archiveId: z.string().cuid(),
  versionId: z.string().cuid(),
})

const bodySchema = z.object({ confirmed: z.literal(true) }).strict()

function isConfiguredZenoReviewer(user: { id: string; email?: string | null }) {
  const configuredId = process.env.ZENO_REVIEWER_USER_ID?.trim()
  const configuredEmail = process.env.ZENO_REVIEWER_EMAIL?.trim().toLowerCase()
  if (!configuredId && !configuredEmail) return null
  return Boolean(
    (configuredId && configuredId === user.id)
    || (configuredEmail && configuredEmail === user.email?.trim().toLowerCase()),
  )
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ archiveId: string; versionId: string }> },
) {
  if (!isRenovationArchiveEnabled()) {
    return NextResponse.json(RENOVATION_ARCHIVE_DISABLED_BODY, { status: 404 })
  }

  const session = await auth()
  const sessionUser = session?.user
  if (!sessionUser?.id || sessionUser.role?.toUpperCase() !== 'ADMIN') {
    return NextResponse.json({ error: '仅 Zeno 管理员可以记录人工审核', code: 'UNAUTHORIZED' }, { status: 403 })
  }

  const configured = isConfiguredZenoReviewer({
    id: sessionUser.id,
    email: sessionUser.email,
  })
  if (configured === null) {
    return NextResponse.json({ error: '尚未配置 Zeno 审核身份', code: 'REVIEWER_NOT_CONFIGURED' }, { status: 503 })
  }
  if (!configured) {
    return NextResponse.json({ error: '当前账号不是配置的 Zeno 审核身份', code: 'FORBIDDEN' }, { status: 403 })
  }

  const parsedParams = paramsSchema.safeParse(await params)
  if (!parsedParams.success) {
    return NextResponse.json({ error: '审核目标编号无效', code: 'INVALID_INPUT' }, { status: 422 })
  }
  let body: unknown
  try {
    body = await readJsonBodyWithLimit(request, 16 * 1024)
  } catch (error) {
    const response = renovationArchiveHttpError(error)
    return NextResponse.json(response.body, { status: response.status })
  }
  if (!bodySchema.safeParse(body).success) {
    return NextResponse.json({ error: '请明确确认已经完成这版材料的人工审核', code: 'INVALID_INPUT' }, { status: 422 })
  }

  try {
    const databaseUser = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { id: true, email: true, role: true },
    })
    if (!databaseUser || databaseUser.role !== 'ADMIN') {
      return NextResponse.json({ error: '当前账号没有有效的 Zeno 管理员权限', code: 'FORBIDDEN' }, { status: 403 })
    }

    const version = await markQuoteVersionZenoReviewed({
      reviewerUserId: databaseUser.id,
      archiveId: parsedParams.data.archiveId,
      versionId: parsedParams.data.versionId,
      ip: getClientIp(request),
    })
    return NextResponse.json({ quoteVersion: version })
  } catch (error) {
    if (error instanceof RenovationArchiveError) {
      const response = renovationArchiveHttpError(error)
      return NextResponse.json(response.body, { status: response.status })
    }
    console.error('[renovation-archive] mark Zeno review failed', error)
    return NextResponse.json({ error: '人工审核状态没有保存，请稍后重试', code: 'INTERNAL_ERROR' }, { status: 500 })
  }
}
