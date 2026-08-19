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
  assertOwnedPendingArchiveAsset,
  createOwnedQuoteVersion,
  findOwnedQuoteVersionForUploadRetry,
  RenovationArchiveError,
} from '@/lib/domains/renovation-archive/service'
import {
  getArchiveStorageObjectMetadata,
  verifyArchiveUploadToken,
} from '@/lib/domains/renovation-archive/storage'
import {
  archiveIdSchema,
  createQuoteVersionSchema,
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
    body = await readJsonBodyWithLimit(request, 3 * 1024 * 1024)
  } catch (error) {
    const response = renovationArchiveHttpError(error)
    return NextResponse.json(response.body, { status: response.status })
  }
  const parsed = createQuoteVersionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: '报价版本格式无效', code: 'INVALID_INPUT', details: parsed.error.flatten() },
      { status: 422 },
    )
  }

  try {
    // Decode the signed intent before checking expiry so a delayed network
    // retry can still return the already-created version. Expired intents may
    // only replay an existing, matching version; they can never create one.
    const intent = verifyArchiveUploadToken(parsed.data.uploadToken, { allowExpired: true })
    if (intent.kind !== 'quote') {
      throw new RenovationArchiveError(
        'INVALID_UPLOAD',
        '报价版本只能绑定 quote 类型文件',
        422,
      )
    }
    const existingQuoteVersion = await findOwnedQuoteVersionForUploadRetry(
      session.user.id,
      parsedId.data,
      parsed.data.assetId,
      intent,
      parsed.data,
    )
    if (existingQuoteVersion) {
      return NextResponse.json({
        quoteVersion: existingQuoteVersion,
        limits: FREE_RENOVATION_ARCHIVE_LIMITS,
        idempotentReplay: true,
      })
    }
    if (intent.exp < Math.floor(Date.now() / 1000)) {
      throw new RenovationArchiveError('INVALID_UPLOAD', '上传凭证已失效', 422)
    }
    await assertOwnedPendingArchiveAsset(
      session.user.id,
      parsedId.data,
      parsed.data.assetId,
      intent,
    )
    const objectMetadata = await getArchiveStorageObjectMetadata(intent.path, intent.bucket)
    const quoteVersion = await createOwnedQuoteVersion({
      userId: session.user.id,
      archiveId: parsedId.data,
      input: parsed.data,
      intent,
      objectMetadata,
    })
    return NextResponse.json(
      { quoteVersion, limits: FREE_RENOVATION_ARCHIVE_LIMITS },
      { status: 201 },
    )
  } catch (error) {
    const response = renovationArchiveHttpError(error)
    return NextResponse.json(response.body, { status: response.status })
  }
}
