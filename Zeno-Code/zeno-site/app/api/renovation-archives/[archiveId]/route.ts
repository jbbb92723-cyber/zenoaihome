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
  getOwnedRenovationArchive,
  prepareOwnedRenovationArchiveDeletion,
  updateOwnedRenovationArchive,
} from '@/lib/domains/renovation-archive/service'
import { deleteArchiveStorageObjects } from '@/lib/domains/renovation-archive/storage'
import {
  archiveIdSchema,
  updateArchiveSchema,
} from '@/lib/domains/renovation-archive/validation'

export const dynamic = 'force-dynamic'

type RouteContext = { params: Promise<{ archiveId: string }> }

async function validatedArchiveId(context: RouteContext) {
  const { archiveId } = await context.params
  return archiveIdSchema.safeParse(archiveId)
}

export async function GET(_request: Request, context: RouteContext) {
  if (!isRenovationArchiveEnabled()) {
    return NextResponse.json(RENOVATION_ARCHIVE_DISABLED_BODY, { status: 404 })
  }
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '请先登录', code: 'UNAUTHORIZED' }, { status: 401 })
  }
  const parsedId = await validatedArchiveId(context)
  if (!parsedId.success) {
    return NextResponse.json({ error: '档案编号无效', code: 'INVALID_INPUT' }, { status: 422 })
  }

  try {
    const archive = await getOwnedRenovationArchive(session.user.id, parsedId.data)
    return NextResponse.json({ archive, limits: FREE_RENOVATION_ARCHIVE_LIMITS })
  } catch (error) {
    const response = renovationArchiveHttpError(error)
    return NextResponse.json(response.body, { status: response.status })
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!isRenovationArchiveEnabled()) {
    return NextResponse.json(RENOVATION_ARCHIVE_DISABLED_BODY, { status: 404 })
  }
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '请先登录', code: 'UNAUTHORIZED' }, { status: 401 })
  }
  const parsedId = await validatedArchiveId(context)
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
  const parsed = updateArchiveSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: '档案信息格式无效', code: 'INVALID_INPUT', details: parsed.error.flatten() },
      { status: 422 },
    )
  }

  try {
    const archive = await updateOwnedRenovationArchive(
      session.user.id,
      parsedId.data,
      parsed.data,
    )
    return NextResponse.json({ archive })
  } catch (error) {
    const response = renovationArchiveHttpError(error)
    return NextResponse.json(response.body, { status: response.status })
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!isRenovationArchiveEnabled()) {
    return NextResponse.json(RENOVATION_ARCHIVE_DISABLED_BODY, { status: 404 })
  }
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '请先登录', code: 'UNAUTHORIZED' }, { status: 401 })
  }
  const parsedId = await validatedArchiveId(context)
  if (!parsedId.success) {
    return NextResponse.json({ error: '档案编号无效', code: 'INVALID_INPUT' }, { status: 422 })
  }

  try {
    const objects = await prepareOwnedRenovationArchiveDeletion(session.user.id, parsedId.data)
    let storageCleaned = false
    try {
      storageCleaned = await deleteArchiveStorageObjects(objects)
    } catch (error) {
      console.error('[renovation-archive] immediate archive storage cleanup deferred', error)
    }
    return NextResponse.json({
      deletionRequested: true,
      deletionPending: true,
      archiveId: parsedId.data,
      storageCleanup: objects.length === 0
        ? 'not-needed'
        : storageCleaned
          ? 'completed'
          : 'pending-retry',
    }, { status: 202 })
  } catch (error) {
    const response = renovationArchiveHttpError(error)
    return NextResponse.json(response.body, { status: response.status })
  }
}
