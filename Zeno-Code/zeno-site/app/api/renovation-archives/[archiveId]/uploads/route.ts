import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { FREE_RENOVATION_ARCHIVE_LIMITS } from '@/lib/domains/renovation-archive/constants'
import {
  isRenovationArchiveEnabled,
  RENOVATION_ARCHIVE_DISABLED_BODY,
} from '@/lib/domains/renovation-archive/feature'
import {
  readJsonBodyWithLimit,
  renovationArchiveHttpError,
} from '@/lib/domains/renovation-archive/http'
import {
  markUncertainOwnedArchiveAssetReservation,
  reserveOwnedArchiveAsset,
} from '@/lib/domains/renovation-archive/service'
import {
  assertUploadIntentMatches,
  createSignedArchiveUpload,
  prepareArchiveUpload,
  verifyArchiveUploadToken,
} from '@/lib/domains/renovation-archive/storage'
import {
  archiveIdSchema,
  requestArchiveUploadSchema,
} from '@/lib/domains/renovation-archive/validation'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ archiveId: string }> },
) {
  if (!isRenovationArchiveEnabled()) {
    return NextResponse.json(RENOVATION_ARCHIVE_DISABLED_BODY, { status: 404 })
  }
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '请先登录', code: 'UNAUTHORIZED' }, { status: 401 })
  }
  const { archiveId } = await params
  const parsedId = archiveIdSchema.safeParse(archiveId)
  if (!parsedId.success) {
    return NextResponse.json({ error: '档案编号无效', code: 'INVALID_INPUT' }, { status: 422 })
  }
  let body: unknown
  try {
    body = await readJsonBodyWithLimit(request, 64 * 1024)
  } catch (error) {
    const response = renovationArchiveHttpError(error)
    return NextResponse.json(response.body, { status: response.status })
  }
  const parsed = requestArchiveUploadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: '文件信息格式无效', code: 'INVALID_INPUT', details: parsed.error.flatten() },
      { status: 422 },
    )
  }

  try {
    const preparedUpload = await prepareArchiveUpload({
      userId: session.user.id,
      archiveId: parsedId.data,
      metadata: parsed.data,
      idempotencyKey: parsed.data.idempotencyKey,
    })
    const intent = verifyArchiveUploadToken(preparedUpload.uploadToken)
    assertUploadIntentMatches(intent, {
      userId: session.user.id,
      archiveId: parsedId.data,
      bucket: preparedUpload.bucket,
      path: preparedUpload.path,
      ...parsed.data,
    })
    const reservation = await reserveOwnedArchiveAsset({
      userId: session.user.id,
      archiveId: parsedId.data,
      intent,
    })
    let upload
    try {
      upload = await createSignedArchiveUpload(preparedUpload)
    } catch (error) {
      if (!reservation.idempotentReplay) {
        await markUncertainOwnedArchiveAssetReservation(
          session.user.id,
          parsedId.data,
          reservation.asset.id,
        ).catch(() => undefined)
      }
      throw error
    }

    return NextResponse.json({
      upload: { ...upload, assetId: reservation.asset.id },
      asset: reservation.asset,
      request: {
        method: 'PUT',
        headers: { 'x-upsert': 'false' },
      },
      usage: reservation.usage,
      limits: FREE_RENOVATION_ARCHIVE_LIMITS,
    }, { status: 201 })
  } catch (error) {
    const response = renovationArchiveHttpError(error)
    return NextResponse.json(response.body, { status: response.status })
  }
}
