import crypto from 'node:crypto'
import { NextResponse } from 'next/server'
import {
  claimExpiredArchiveAssetStorageCleanup,
  claimExpiredRenovationArchiveDeletion,
  completeExpiredArchiveAssetCleanup,
  completeOwnedRenovationArchiveDeletion,
  listExpiredArchiveStorageCleanupTargets,
} from '@/lib/domains/renovation-archive/service'
import { deleteArchiveStorageObjects } from '@/lib/domains/renovation-archive/storage'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim()
  const authorization = request.headers.get('authorization')
  if (!secret || secret.length < 32 || !authorization?.startsWith('Bearer ')) return false

  const supplied = Buffer.from(authorization.slice('Bearer '.length))
  const expected = Buffer.from(secret)
  return supplied.length === expected.length && crypto.timingSafeEqual(supplied, expected)
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: '未授权' }, { status: 401 })
  }
  try {
    const targets = await listExpiredArchiveStorageCleanupTargets(8)
    let assetsCompleted = 0
    let archivesCompleted = 0
    let failed = 0

    await Promise.all(targets.assets.map(async (asset) => {
      try {
        const claimed = await claimExpiredArchiveAssetStorageCleanup(asset.id, targets.cutoff)
        if (!claimed) return
        const storageCleaned = await deleteArchiveStorageObjects([{
          bucket: asset.storageBucket,
          path: asset.storagePath,
        }])
        if (!storageCleaned) {
          failed += 1
          return
        }
        const result = await completeExpiredArchiveAssetCleanup(asset.id)
        assetsCompleted += result.count
      } catch (error) {
        console.error('[renovation-archive] asset cleanup failed', {
          assetId: asset.id,
          error,
        })
        failed += 1
      }
    }))

    await Promise.all(targets.archives.map(async (archive) => {
      try {
        const claimed = await claimExpiredRenovationArchiveDeletion(
          archive.userId,
          archive.id,
          targets.cutoff,
        )
        if (!claimed) return
        const storageCleaned = await deleteArchiveStorageObjects(
          archive.assets.map((asset) => ({
            bucket: asset.storageBucket,
            path: asset.storagePath,
          })),
        )
        if (!storageCleaned) {
          failed += 1
          return
        }
        const result = await completeOwnedRenovationArchiveDeletion(archive.userId, archive.id)
        archivesCompleted += result.count
      } catch (error) {
        console.error('[renovation-archive] archive cleanup failed', {
          archiveId: archive.id,
          error,
        })
        failed += 1
      }
    }))

    return NextResponse.json({
      ok: failed === 0,
      assetsCompleted,
      archivesCompleted,
      failed,
    }, { status: failed === 0 ? 200 : 502 })
  } catch (error) {
    console.error('[renovation-archive] scheduled cleanup failed', error)
    return NextResponse.json({ ok: false, error: '清理任务失败' }, { status: 500 })
  }
}
