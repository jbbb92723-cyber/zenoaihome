import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import {
  isRenovationArchiveEnabled,
  RENOVATION_ARCHIVE_DISABLED_BODY,
} from '@/lib/domains/renovation-archive/feature'
import { renovationArchiveHttpError } from '@/lib/domains/renovation-archive/http'
import {
  completeOwnedPendingAssetCancellation,
  prepareOwnedPendingAssetCancellation,
} from '@/lib/domains/renovation-archive/service'
import {
  ArchiveStorageError,
  deleteArchiveStorageObjects,
} from '@/lib/domains/renovation-archive/storage'
import {
  archiveAssetIdSchema,
  archiveIdSchema,
} from '@/lib/domains/renovation-archive/validation'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ archiveId: string; assetId: string }> },
) {
  if (!isRenovationArchiveEnabled()) {
    return NextResponse.json(RENOVATION_ARCHIVE_DISABLED_BODY, { status: 404 })
  }
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '请先登录', code: 'UNAUTHORIZED' }, { status: 401 })
  }

  const parsedIds = z.object({
    archiveId: archiveIdSchema,
    assetId: archiveAssetIdSchema,
  }).safeParse(await params)
  if (!parsedIds.success) {
    return NextResponse.json({ error: '文件预留编号无效', code: 'INVALID_INPUT' }, { status: 422 })
  }

  try {
    const pending = await prepareOwnedPendingAssetCancellation(
      session.user.id,
      parsedIds.data.archiveId,
      parsedIds.data.assetId,
    )
    const storageCleaned = await deleteArchiveStorageObjects([pending])
    if (!storageCleaned) {
      throw new ArchiveStorageError(
        'UPSTREAM_FAILED',
        '上传文件暂时无法清理，请稍后重试',
      )
    }
    await completeOwnedPendingAssetCancellation(
      session.user.id,
      parsedIds.data.archiveId,
      parsedIds.data.assetId,
    )
    return NextResponse.json({ cancelled: true, assetId: parsedIds.data.assetId })
  } catch (error) {
    const response = renovationArchiveHttpError(error)
    return NextResponse.json(response.body, { status: response.status })
  }
}
