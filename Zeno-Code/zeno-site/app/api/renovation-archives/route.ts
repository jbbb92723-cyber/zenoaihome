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
  createOwnedRenovationArchive,
  listOwnedRenovationArchives,
} from '@/lib/domains/renovation-archive/service'
import { createArchiveSchema } from '@/lib/domains/renovation-archive/validation'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!isRenovationArchiveEnabled()) {
    return NextResponse.json(RENOVATION_ARCHIVE_DISABLED_BODY, { status: 404 })
  }
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '请先登录', code: 'UNAUTHORIZED' }, { status: 401 })
  }

  try {
    const archives = await listOwnedRenovationArchives(session.user.id)
    return NextResponse.json({ archives, limits: FREE_RENOVATION_ARCHIVE_LIMITS })
  } catch (error) {
    const response = renovationArchiveHttpError(error)
    return NextResponse.json(response.body, { status: response.status })
  }
}

export async function POST(request: Request) {
  if (!isRenovationArchiveEnabled()) {
    return NextResponse.json(RENOVATION_ARCHIVE_DISABLED_BODY, { status: 404 })
  }
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '请先登录', code: 'UNAUTHORIZED' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await readJsonBodyWithLimit(request, 64 * 1024)
  } catch (error) {
    const response = renovationArchiveHttpError(error)
    return NextResponse.json(response.body, { status: response.status })
  }
  const parsed = createArchiveSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: '档案信息格式无效', code: 'INVALID_INPUT', details: parsed.error.flatten() },
      { status: 422 },
    )
  }

  try {
    const archive = await createOwnedRenovationArchive(session.user.id, parsed.data)
    return NextResponse.json(
      { archive, limits: FREE_RENOVATION_ARCHIVE_LIMITS },
      { status: 201 },
    )
  } catch (error) {
    const response = renovationArchiveHttpError(error)
    return NextResponse.json(response.body, { status: response.status })
  }
}
