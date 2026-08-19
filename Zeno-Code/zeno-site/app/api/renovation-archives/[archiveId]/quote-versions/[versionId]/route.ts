import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import {
  isRenovationArchiveEnabled,
  RENOVATION_ARCHIVE_DISABLED_BODY,
} from '@/lib/domains/renovation-archive/feature'
import {
  readJsonBodyWithLimit,
  renovationArchiveHttpError,
} from '@/lib/domains/renovation-archive/http'
import { patchOwnedQuoteVersion } from '@/lib/domains/renovation-archive/service'
import {
  archiveIdSchema,
  patchQuoteVersionSchema,
} from '@/lib/domains/renovation-archive/validation'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const versionIdSchema = z.string().cuid()

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ archiveId: string; versionId: string }> },
) {
  if (!isRenovationArchiveEnabled()) {
    return NextResponse.json(RENOVATION_ARCHIVE_DISABLED_BODY, { status: 404 })
  }
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '请先登录', code: 'UNAUTHORIZED' }, { status: 401 })
  }
  const { archiveId, versionId } = await params
  const parsedIds = z.object({
    archiveId: archiveIdSchema,
    versionId: versionIdSchema,
  }).safeParse({ archiveId, versionId })
  if (!parsedIds.success) {
    return NextResponse.json({ error: '报价版本编号无效', code: 'INVALID_INPUT' }, { status: 422 })
  }
  let body: unknown
  try {
    body = await readJsonBodyWithLimit(request, 64 * 1024)
  } catch (error) {
    const response = renovationArchiveHttpError(error)
    return NextResponse.json(response.body, { status: response.status })
  }
  const parsed = patchQuoteVersionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: '报价更新格式无效', code: 'INVALID_INPUT', details: parsed.error.flatten() },
      { status: 422 },
    )
  }

  try {
    const result = await patchOwnedQuoteVersion(
      session.user.id,
      parsedIds.data.archiveId,
      parsedIds.data.versionId,
      parsed.data,
    )
    return parsed.data.action === 'update-item'
      ? NextResponse.json({ quoteItem: result, quoteVersionId: parsedIds.data.versionId })
      : NextResponse.json({ quoteVersion: result })
  } catch (error) {
    const response = renovationArchiveHttpError(error)
    return NextResponse.json(response.body, { status: response.status })
  }
}
