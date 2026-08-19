import { Prisma } from '@prisma/client'
import { prisma, DatabaseUnavailableError } from '@/lib/prisma'
import {
  FREE_RENOVATION_ARCHIVE_LIMITS,
  ARCHIVE_STORAGE_CLEANUP_DELAY_MS,
  ARCHIVE_MATERIAL_ATTESTATION_VERSION,
  ARCHIVE_ASSET_CLEANING_STATUS,
  MAX_MONEY_CENTS,
  MAX_RAW_DATA_BYTES_PER_ITEM,
  MAX_TOTAL_RAW_DATA_BYTES,
} from './constants'
import type {
  CreateArchiveInput,
  CreateQuoteVersionInput,
  PatchQuoteVersionInput,
  UpdateArchiveInput,
} from './validation'
import type { ArchiveStorageObjectMetadata, ArchiveUploadIntent } from './storage'

export type RenovationArchiveErrorCode =
  | 'NOT_FOUND'
  | 'QUOTA_EXCEEDED'
  | 'CONFLICT'
  | 'VERSION_LOCKED'
  | 'INVALID_UPLOAD'
  | 'DATABASE_UNAVAILABLE'

export class RenovationArchiveError extends Error {
  constructor(
    public readonly code: RenovationArchiveErrorCode,
    message: string,
    public readonly status: number,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message)
    this.name = 'RenovationArchiveError'
  }
}

const DATABASE_ERROR_CODES = new Set([
  'P1000',
  'P1001',
  'P1002',
  'P1008',
  'P1017',
  'P2021',
  'P2022',
  'P2024',
  'P2037',
])

function databaseUnavailable(cause?: unknown): RenovationArchiveError {
  const error = new RenovationArchiveError(
    'DATABASE_UNAVAILABLE',
    '装修档案暂时无法连接，请稍后重试',
    503,
  )
  if (cause instanceof Error) error.cause = cause
  return error
}

function isSerializableConflict(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError
    && (error.code === 'P2034' || error.code === 'P2002')
}

function normalizeDatabaseError(error: unknown): never {
  if (error instanceof RenovationArchiveError) throw error
  if (error instanceof DatabaseUnavailableError) throw databaseUnavailable(error)
  if (error instanceof Prisma.PrismaClientInitializationError) throw databaseUnavailable(error)
  if (error instanceof Prisma.PrismaClientRustPanicError) throw databaseUnavailable(error)
  if (
    error instanceof Prisma.PrismaClientKnownRequestError
    && DATABASE_ERROR_CODES.has(error.code)
  ) {
    throw databaseUnavailable(error)
  }
  throw error
}

async function strictTransaction<T>(
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
  serializable = false,
): Promise<T> {
  if (!process.env.DATABASE_URL) throw databaseUnavailable()

  const attempts = serializable ? 3 : 1
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await prisma.$transaction(
        operation,
        serializable
          ? { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
          : undefined,
      )
    } catch (error) {
      if (serializable && isSerializableConflict(error) && attempt < attempts - 1) continue
      if (isSerializableConflict(error)) {
        throw new RenovationArchiveError('CONFLICT', '数据正在更新，请重试', 409)
      }
      normalizeDatabaseError(error)
    }
  }
  throw new RenovationArchiveError('CONFLICT', '数据正在更新，请重试', 409)
}

function valueOrNull(value: string | null | undefined): string | null {
  return value?.trim() || null
}

function archiveData(input: CreateArchiveInput | UpdateArchiveInput) {
  return {
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.city !== undefined ? { city: valueOrNull(input.city) } : {}),
    ...(input.address !== undefined ? { address: valueOrNull(input.address) } : {}),
    ...(input.area !== undefined ? { area: input.area } : {}),
    ...(input.homeType !== undefined ? { homeType: valueOrNull(input.homeType) } : {}),
    ...(input.notes !== undefined ? { notes: valueOrNull(input.notes) } : {}),
    ...('status' in input && input.status !== undefined ? { status: input.status } : {}),
  }
}

function quotaError(message: string, details: Record<string, unknown>): RenovationArchiveError {
  return new RenovationArchiveError('QUOTA_EXCEEDED', message, 409, {
    limits: FREE_RENOVATION_ARCHIVE_LIMITS,
    ...details,
  })
}

async function findOwnedArchive(tx: Prisma.TransactionClient, userId: string, archiveId: string) {
  const archive = await tx.renovationArchive.findFirst({
    where: { id: archiveId, userId },
  })
  if (!archive) {
    throw new RenovationArchiveError('NOT_FOUND', '装修档案不存在', 404)
  }
  return archive
}

const quoteVersionWithItemsInclude = {
  asset: {
    select: {
      id: true,
      originalName: true,
      mimeType: true,
      sizeBytes: true,
      kind: true,
    },
  },
  items: { orderBy: { position: 'asc' as const } },
} as const

async function getQuoteVersionWithItems(
  tx: Prisma.TransactionClient,
  versionId: string,
) {
  return tx.quoteVersion.findUnique({
    where: { id: versionId },
    include: quoteVersionWithItemsInclude,
  })
}

function assertArchiveWritable(archive: { status: string }) {
  if (archive.status === 'deleting') {
    throw new RenovationArchiveError(
      'CONFLICT',
      '装修档案正在删除，不能继续修改',
      409,
    )
  }
}

async function getArchiveUsage(tx: Prisma.TransactionClient, archiveId: string) {
  const [assetUsage, versionCount] = await Promise.all([
    tx.archiveAsset.findMany({
      // Pending/deleted/cleaning reservations are charged at the maximum file
      // size. A direct-to-Storage client cannot be trusted to keep the declared
      // byte count equal to the actual request body.
      where: {
        archiveId,
        status: { in: ['pending', 'ready', 'deleted', ARCHIVE_ASSET_CLEANING_STATUS] },
      },
      select: { status: true, sizeBytes: true },
    }),
    tx.quoteVersion.count({ where: { archiveId } }),
  ])

  const totalBytes = assetUsage.reduce((total, asset) => (
    total + (
      asset.status === 'pending'
      || asset.status === 'deleted'
      || asset.status === ARCHIVE_ASSET_CLEANING_STATUS
        ? FREE_RENOVATION_ARCHIVE_LIMITS.maxFileBytes
        : asset.sizeBytes
    )
  ), 0)

  return {
    files: assetUsage.length,
    totalBytes,
    versions: versionCount,
  }
}

function assertFileQuota(usage: Awaited<ReturnType<typeof getArchiveUsage>>, nextSizeBytes: number) {
  if (usage.files >= FREE_RENOVATION_ARCHIVE_LIMITS.filesPerArchive) {
    throw quotaError('免费档案最多保存 10 个文件', { usage })
  }
  if (usage.totalBytes + nextSizeBytes > FREE_RENOVATION_ARCHIVE_LIMITS.totalBytesPerArchive) {
    throw quotaError('免费档案文件总量不能超过 50MB', { usage, nextSizeBytes })
  }
}

export async function listOwnedRenovationArchives(userId: string) {
  return strictTransaction((tx) => tx.renovationArchive.findMany({
    where: { userId, status: { not: 'deleting' } },
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: {
        select: {
          assets: { where: { status: { in: ['pending', 'ready'] } } },
          quoteVersions: true,
        },
      },
          quoteVersions: {
            orderBy: { versionNumber: 'desc' },
            take: 1,
            select: {
              id: true,
              versionNumber: true,
              status: true,
              totalAmountCents: true,
              zenoReviewedAt: true,
              updatedAt: true,
            },
      },
    },
  }))
}

export async function getOwnedRenovationArchive(userId: string, archiveId: string) {
  return strictTransaction(async (tx) => {
    const archive = await tx.renovationArchive.findFirst({
      where: { id: archiveId, userId, status: { not: 'deleting' } },
      include: {
        assets: {
          where: { status: { in: ['pending', 'ready'] } },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            originalName: true,
            mimeType: true,
            sizeBytes: true,
            sha256: true,
            kind: true,
            status: true,
            createdAt: true,
          },
        },
        quoteVersions: {
          orderBy: { versionNumber: 'desc' },
          select: {
            id: true,
            versionNumber: true,
            label: true,
            status: true,
            currency: true,
            totalAmountCents: true,
            customerConfirmedAt: true,
            zenoReviewedAt: true,
            createdAt: true,
            updatedAt: true,
            asset: {
              select: {
                id: true,
                originalName: true,
                mimeType: true,
                sizeBytes: true,
                kind: true,
              },
            },
            items: {
              orderBy: { position: 'asc' },
              // The original file is already retained privately. Do not echo
              // every unmapped spreadsheet column through the normal API.
              select: {
                id: true,
                position: true,
                sourceRow: true,
                stableKey: true,
                section: true,
                itemCode: true,
                itemName: true,
                description: true,
                quantity: true,
                unit: true,
                unitPriceCents: true,
                amountCents: true,
                materialSpec: true,
                scope: true,
                confidence: true,
                isCustomerEdited: true,
                customerNote: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    })
    if (!archive) throw new RenovationArchiveError('NOT_FOUND', '装修档案不存在', 404)
    return archive
  })
}

export async function createOwnedRenovationArchive(userId: string, input: CreateArchiveInput) {
  return strictTransaction(async (tx) => {
    const count = await tx.renovationArchive.count({ where: { userId } })
    if (count >= FREE_RENOVATION_ARCHIVE_LIMITS.archives) {
      throw quotaError(
        '免费账户只能保留 1 个装修档案；如果刚申请删除，请等待安全清理完成后再创建',
        { archives: count },
      )
    }
    return tx.renovationArchive.create({
      data: { userId, ...archiveData(input), title: input.title },
    })
  }, true)
}

export async function updateOwnedRenovationArchive(
  userId: string,
  archiveId: string,
  input: UpdateArchiveInput,
) {
  return strictTransaction(async (tx) => {
    const archive = await findOwnedArchive(tx, userId, archiveId)
    assertArchiveWritable(archive)
    const updated = await tx.renovationArchive.updateMany({
      // Keep a concurrent delete authoritative. Without this predicate a
      // PATCH that started before DELETE could resurrect a hidden archive.
      where: { id: archiveId, userId, status: { not: 'deleting' } },
      data: archiveData(input),
    })
    if (updated.count === 0) {
      throw new RenovationArchiveError('NOT_FOUND', '装修档案不存在', 404)
    }
    return tx.renovationArchive.findUniqueOrThrow({ where: { id: archiveId } })
  }, true)
}

type PendingAssetIdentity = {
  id: string
  archiveId: string
  storageBucket: string
  storagePath: string
  originalName: string
  mimeType: string
  sizeBytes: number
  sha256: string | null
  kind: string
  status: string
}

function assertPendingAssetMatchesIntent(
  asset: PendingAssetIdentity,
  intent: ArchiveUploadIntent,
) {
  const matches = asset.archiveId === intent.archiveId
    && asset.storageBucket === intent.bucket
    && asset.storagePath === intent.path
    && asset.originalName === intent.originalName
    && asset.mimeType === intent.mimeType
    && asset.sizeBytes === intent.sizeBytes
    && asset.kind === intent.kind
    && (asset.sha256 ?? null) === (intent.sha256 ?? null)

  if (!matches || asset.status !== 'pending') {
    throw new RenovationArchiveError(
      'INVALID_UPLOAD',
      '文件预留与上传凭证不一致',
      422,
    )
  }
}

function assertAssetIdentityMatchesIntent(
  asset: PendingAssetIdentity,
  intent: ArchiveUploadIntent,
) {
  const matches = asset.archiveId === intent.archiveId
    && asset.storageBucket === intent.bucket
    && asset.storagePath === intent.path
    && asset.originalName === intent.originalName
    && asset.mimeType === intent.mimeType
    && asset.sizeBytes === intent.sizeBytes
    && asset.kind === intent.kind
    && (asset.sha256 ?? null) === (intent.sha256 ?? null)
  if (!matches) {
    throw new RenovationArchiveError(
      'INVALID_UPLOAD',
      '文件预留与上传凭证不一致',
      422,
    )
  }
}

export async function reserveOwnedArchiveAsset({
  userId,
  archiveId,
  intent,
}: {
  userId: string
  archiveId: string
  intent: ArchiveUploadIntent
}) {
  return strictTransaction(async (tx) => {
    const archive = await findOwnedArchive(tx, userId, archiveId)
    assertArchiveWritable(archive)
    if (intent.userId !== userId || intent.archiveId !== archiveId) {
      throw new RenovationArchiveError('INVALID_UPLOAD', '上传凭证归属无效', 422)
    }

    // A deterministic request path makes a lost response safe to retry. The
    // unique storagePath constraint also serializes two first attempts with
    // the same client idempotency key; the serializable transaction retries and
    // then reaches this replay branch.
    const existing = await tx.archiveAsset.findFirst({
      where: {
        archiveId,
        storagePath: intent.path,
        archive: { userId },
      },
      include: { quoteVersion: { select: { id: true } } },
    })
    if (existing) {
      assertAssetIdentityMatchesIntent(existing, intent)
      if (existing.status === 'pending') {
        const usage = await getArchiveUsage(tx, archiveId)
        return {
          asset: {
            id: existing.id,
            originalName: existing.originalName,
            mimeType: existing.mimeType,
            sizeBytes: existing.sizeBytes,
            sha256: existing.sha256,
            kind: existing.kind,
            status: existing.status,
            createdAt: existing.createdAt,
          },
          usage,
          idempotentReplay: true,
        }
      }
      if (existing.status === 'ready' && existing.quoteVersion) {
        throw new RenovationArchiveError(
          'CONFLICT',
          '该上传请求已经完成，请刷新装修档案后继续',
          409,
        )
      }
      throw new RenovationArchiveError(
        'CONFLICT',
        '该上传请求已经取消，请重新选择文件后再试',
        409,
      )
    }

    const usage = await getArchiveUsage(tx, archiveId)
    assertFileQuota(usage, FREE_RENOVATION_ARCHIVE_LIMITS.maxFileBytes)
    const asset = await tx.archiveAsset.create({
      data: {
        archiveId,
        storageBucket: intent.bucket,
        storagePath: intent.path,
        originalName: intent.originalName,
        mimeType: intent.mimeType,
        sizeBytes: intent.sizeBytes,
        sha256: intent.sha256 ?? null,
        kind: intent.kind,
        status: 'pending',
        materialConsentAt: new Date(),
        materialConsentVersion: ARCHIVE_MATERIAL_ATTESTATION_VERSION,
      },
      select: {
        id: true,
        originalName: true,
        mimeType: true,
        sizeBytes: true,
        sha256: true,
        kind: true,
        status: true,
        createdAt: true,
      },
    })

    return {
      asset,
      usage: {
        ...usage,
        files: usage.files + 1,
        totalBytes: usage.totalBytes + FREE_RENOVATION_ARCHIVE_LIMITS.maxFileBytes,
      },
      idempotentReplay: false,
    }
  }, true)
}

export async function markUncertainOwnedArchiveAssetReservation(
  userId: string,
  archiveId: string,
  assetId: string,
) {
  // A timeout from the Storage signing endpoint does not prove that no signed
  // URL was issued. Keep a tombstone until the token safety window has passed
  // instead of deleting the row and leaving an untracked object behind.
  return strictTransaction((tx) => tx.archiveAsset.updateMany({
    where: {
      id: assetId,
      archiveId,
      status: 'pending',
      archive: { userId },
    },
    data: { status: 'deleted' },
  }), true)
}

export async function assertOwnedPendingArchiveAsset(
  userId: string,
  archiveId: string,
  assetId: string,
  intent: ArchiveUploadIntent,
) {
  return strictTransaction(async (tx) => {
    const archive = await findOwnedArchive(tx, userId, archiveId)
    assertArchiveWritable(archive)
    const asset = await tx.archiveAsset.findFirst({
      where: { id: assetId, archiveId },
    })
    if (!asset) throw new RenovationArchiveError('NOT_FOUND', '文件预留不存在', 404)
    if (intent.userId !== userId) {
      throw new RenovationArchiveError('INVALID_UPLOAD', '上传凭证归属无效', 422)
    }
    assertPendingAssetMatchesIntent(asset, intent)
    return asset
  })
}

export async function findOwnedQuoteVersionForUploadRetry(
  userId: string,
  archiveId: string,
  assetId: string,
  intent: ArchiveUploadIntent,
  input: CreateQuoteVersionInput,
) {
  const { prepared, totalAmountCents } = prepareQuoteRows(input.rows)
  return strictTransaction(async (tx) => {
    const asset = await tx.archiveAsset.findFirst({
      where: {
        id: assetId,
        archiveId,
        archive: { userId, status: { not: 'deleting' } },
      },
      include: {
        quoteVersion: {
          include: {
            asset: {
              select: {
                id: true,
                originalName: true,
                mimeType: true,
                sizeBytes: true,
                kind: true,
              },
            },
            items: { orderBy: { position: 'asc' } },
          },
        },
      },
    })
    if (!asset) throw new RenovationArchiveError('NOT_FOUND', '文件预留不存在', 404)
    if (intent.userId !== userId || intent.archiveId !== archiveId) {
      throw new RenovationArchiveError('INVALID_UPLOAD', '上传凭证归属无效', 422)
    }
    assertAssetIdentityMatchesIntent(asset, intent)
    if (asset.status === 'pending' && !asset.quoteVersion) return null
    if (asset.status === 'ready' && asset.quoteVersion) {
      assertQuoteReplayMatches(asset.quoteVersion, input, prepared, totalAmountCents)
      return asset.quoteVersion
    }
    throw new RenovationArchiveError('INVALID_UPLOAD', '文件预留状态与报价版本不一致', 422)
  })
}

export async function prepareOwnedPendingAssetCancellation(
  userId: string,
  archiveId: string,
  assetId: string,
) {
  return strictTransaction(async (tx) => {
    const archive = await findOwnedArchive(tx, userId, archiveId)
    assertArchiveWritable(archive)
    const asset = await tx.archiveAsset.findFirst({
      where: { id: assetId, archiveId },
      select: {
        id: true,
        status: true,
        storageBucket: true,
        storagePath: true,
      },
    })
    if (!asset) throw new RenovationArchiveError('NOT_FOUND', '文件预留不存在', 404)
    if (asset.status === 'ready') {
      throw new RenovationArchiveError('CONFLICT', '已入库文件不能通过取消上传删除', 409)
    }
    if (asset.status !== 'pending' && asset.status !== 'deleted') {
      throw new RenovationArchiveError('CONFLICT', '当前文件状态不能取消', 409)
    }
    if (asset.status === 'pending') {
      await tx.archiveAsset.update({
        where: { id: asset.id },
        data: { status: 'deleted' },
      })
    }
    return { bucket: asset.storageBucket, path: asset.storagePath }
  }, true)
}

export async function completeOwnedPendingAssetCancellation(
  userId: string,
  archiveId: string,
  assetId: string,
) {
  return strictTransaction(async (tx) => {
    // Do not delete this row yet. Supabase's signed upload URL can outlive the
    // browser request and be replayed after the first Storage deletion. The
    // tombstone remains chargeable until the three-hour cleanup window, when
    // Cron deletes the path again and only then removes the DB row.
    const tombstone = await tx.archiveAsset.findFirst({
      where: {
        id: assetId,
        archiveId,
        status: 'deleted',
        archive: { userId },
      },
      select: { id: true },
    })
    if (!tombstone) {
      throw new RenovationArchiveError('CONFLICT', '文件预留状态已变化，请刷新后重试', 409)
    }
  }, true)
}

function normalizedStableKey(row: CreateQuoteVersionInput['rows'][number]): string {
  if (row.stableKey) return row.stableKey
  return [row.section, row.itemCode, row.itemName, row.unit]
    .map((value) => value?.trim().toLowerCase().replace(/\s+/g, ' ') ?? '')
    .join('|')
    .slice(0, 200)
}

function normalizeRawData(value: Record<string, unknown>): Prisma.InputJsonValue {
  const serialized = JSON.stringify(value)
  if (Buffer.byteLength(serialized, 'utf8') > MAX_RAW_DATA_BYTES_PER_ITEM) {
    throw new RenovationArchiveError(
      'INVALID_UPLOAD',
      `单行原始数据不能超过 ${MAX_RAW_DATA_BYTES_PER_ITEM} 字节`,
      422,
    )
  }
  return JSON.parse(serialized) as Prisma.InputJsonValue
}

function prepareQuoteRows(rows: CreateQuoteVersionInput['rows']) {
  let totalRawBytes = 0
  let totalAmountCents = 0

  const prepared = rows.map((row, position) => {
    const rawData = normalizeRawData(row.rawData)
    totalRawBytes += Buffer.byteLength(JSON.stringify(rawData), 'utf8')
    if (row.amountCents !== null && row.amountCents !== undefined) {
      totalAmountCents += row.amountCents
      if (!Number.isSafeInteger(totalAmountCents) || Math.abs(totalAmountCents) > MAX_MONEY_CENTS) {
        throw new RenovationArchiveError('INVALID_UPLOAD', '报价总金额超出支持范围', 422)
      }
    }

    return {
      position: position + 1,
      sourceRow: row.sourceRow,
      stableKey: normalizedStableKey(row),
      section: valueOrNull(row.section),
      itemCode: valueOrNull(row.itemCode),
      itemName: row.itemName,
      description: valueOrNull(row.description),
      quantity: row.quantity,
      unit: valueOrNull(row.unit),
      unitPriceCents: row.unitPriceCents,
      amountCents: row.amountCents,
      materialSpec: valueOrNull(row.materialSpec),
      scope: valueOrNull(row.scope),
      rawData,
      confidence: row.confidence,
    }
  })

  if (totalRawBytes > MAX_TOTAL_RAW_DATA_BYTES) {
    throw new RenovationArchiveError(
      'INVALID_UPLOAD',
      `本次原始数据总量不能超过 ${MAX_TOTAL_RAW_DATA_BYTES} 字节`,
      422,
    )
  }
  return { prepared, totalAmountCents }
}

type ReplayQuoteVersion = {
  label: string | null
  totalAmountCents: number
  items: Array<{
    position: number
    sourceRow: number
    stableKey: string | null
    section: string | null
    itemCode: string | null
    itemName: string
    description: string | null
    quantity: number | null
    unit: string | null
    unitPriceCents: number | null
    amountCents: number | null
    materialSpec: string | null
    scope: string | null
    rawData: Prisma.JsonValue
    confidence: number
  }>
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(',')}]`
  }
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, nested]) => `${JSON.stringify(key)}:${canonicalJson(nested)}`)
    return `{${entries.join(',')}}`
  }
  return JSON.stringify(value) ?? 'null'
}

function assertQuoteReplayMatches(
  version: ReplayQuoteVersion,
  input: CreateQuoteVersionInput,
  prepared: ReturnType<typeof prepareQuoteRows>['prepared'],
  totalAmountCents: number,
) {
  const sameRows = version.items.length === prepared.length
    && prepared.every((row, index) => {
      const item = version.items[index]
      return item.position === row.position
        && item.sourceRow === row.sourceRow
        && item.stableKey === row.stableKey
        && item.section === row.section
        && item.itemCode === row.itemCode
        && item.itemName === row.itemName
        && item.description === row.description
        && item.quantity === row.quantity
        && item.unit === row.unit
        && item.unitPriceCents === row.unitPriceCents
        && item.amountCents === row.amountCents
        && item.materialSpec === row.materialSpec
        && item.scope === row.scope
        && item.confidence === row.confidence
        && canonicalJson(item.rawData) === canonicalJson(row.rawData)
    })

  if (
    version.label !== valueOrNull(input.label)
    || version.totalAmountCents !== totalAmountCents
    || !sameRows
  ) {
    throw new RenovationArchiveError(
      'CONFLICT',
      '同一上传请求的数据与首次提交不一致，请重新选择文件后再试',
      409,
    )
  }
}

export async function createOwnedQuoteVersion({
  userId,
  archiveId,
  input,
  intent,
  objectMetadata,
}: {
  userId: string
  archiveId: string
  input: CreateQuoteVersionInput
  intent: ArchiveUploadIntent
  objectMetadata: ArchiveStorageObjectMetadata
}) {
  if (objectMetadata.sizeBytes !== intent.sizeBytes) {
    throw new RenovationArchiveError(
      'INVALID_UPLOAD',
      '已上传文件大小与申请上传时不一致',
      422,
    )
  }
  const objectMimeType = objectMetadata.mimeType.toLowerCase()
  if (objectMimeType !== intent.mimeType && objectMimeType !== 'application/octet-stream') {
    throw new RenovationArchiveError(
      'INVALID_UPLOAD',
      '已上传文件类型与申请上传时不一致',
      422,
    )
  }
  const { prepared, totalAmountCents } = prepareQuoteRows(input.rows)

  return strictTransaction(async (tx) => {
    const archive = await findOwnedArchive(tx, userId, archiveId)
    assertArchiveWritable(archive)
    if (intent.userId !== userId || intent.archiveId !== archiveId) {
      throw new RenovationArchiveError('INVALID_UPLOAD', '上传凭证归属无效', 422)
    }
    const asset = await tx.archiveAsset.findFirst({
      where: { id: input.assetId, archiveId },
      include: {
        quoteVersion: {
          include: {
            asset: {
              select: {
                id: true,
                originalName: true,
                mimeType: true,
                sizeBytes: true,
                kind: true,
              },
            },
            items: { orderBy: { position: 'asc' } },
          },
        },
      },
    })
    if (!asset) throw new RenovationArchiveError('NOT_FOUND', '文件预留不存在', 404)
    assertAssetIdentityMatchesIntent(asset, intent)
    if (asset.status === 'ready' && asset.quoteVersion) {
      assertQuoteReplayMatches(asset.quoteVersion, input, prepared, totalAmountCents)
      return asset.quoteVersion
    }
    assertPendingAssetMatchesIntent(asset, intent)

    const usage = await getArchiveUsage(tx, archiveId)
    if (usage.versions >= FREE_RENOVATION_ARCHIVE_LIMITS.versionsPerArchive) {
      throw quotaError('免费档案最多保存 2 个报价版本', { usage })
    }

    const latestVersion = await tx.quoteVersion.findFirst({
      where: { archiveId },
      orderBy: { versionNumber: 'desc' },
      select: { versionNumber: true },
    })
    const versionNumber = (latestVersion?.versionNumber ?? 0) + 1
    const version = await tx.quoteVersion.create({
      data: {
        archiveId,
        assetId: asset.id,
        versionNumber,
        label: valueOrNull(input.label),
        totalAmountCents,
        items: { create: prepared },
      },
      include: {
        asset: {
          select: {
            id: true,
            originalName: true,
            mimeType: true,
            sizeBytes: true,
            kind: true,
          },
        },
        items: { orderBy: { position: 'asc' } },
      },
    })
    await Promise.all([
      tx.archiveAsset.update({
        where: { id: asset.id },
        data: { status: 'ready', storageEtag: objectMetadata.etag },
      }),
      tx.renovationArchive.update({
        where: { id: archiveId },
        data: { updatedAt: new Date() },
      }),
    ])
    return version
  }, true)
}

export async function patchOwnedQuoteVersion(
  userId: string,
  archiveId: string,
  versionId: string,
  input: PatchQuoteVersionInput,
) {
  return strictTransaction(async (tx) => {
    const version = await tx.quoteVersion.findFirst({
      where: {
        id: versionId,
        archiveId,
        archive: { userId, status: { not: 'deleting' } },
      },
      include: { _count: { select: { items: true } } },
    })
    if (!version) throw new RenovationArchiveError('NOT_FOUND', '报价版本不存在', 404)

    if (input.action === 'confirm-version') {
      if (version.status === 'confirmed') {
        const confirmedVersion = await getQuoteVersionWithItems(tx, versionId)
        if (!confirmedVersion) throw new RenovationArchiveError('NOT_FOUND', '报价版本不存在', 404)
        return confirmedVersion
      }
      if (version._count.items === 0) {
        throw new RenovationArchiveError('CONFLICT', '空报价版本不能确认', 409)
      }
      await tx.quoteVersion.update({
        where: { id: versionId },
        data: { status: 'confirmed', customerConfirmedAt: new Date() },
      })
      await tx.renovationArchive.update({
        where: { id: archiveId },
        data: { updatedAt: new Date() },
      })
      const confirmedVersion = await getQuoteVersionWithItems(tx, versionId)
      if (!confirmedVersion) throw new RenovationArchiveError('NOT_FOUND', '报价版本不存在', 404)
      return confirmedVersion
    }

    if (version.status === 'confirmed') {
      throw new RenovationArchiveError('VERSION_LOCKED', '已确认的报价版本不能继续编辑', 409)
    }
    const existingItem = await tx.quoteItem.findFirst({
      where: { id: input.itemId, quoteVersionId: versionId },
    })
    if (!existingItem) throw new RenovationArchiveError('NOT_FOUND', '报价行不存在', 404)

    const patch = input.patch
    const updatedItem = await tx.quoteItem.update({
      where: { id: existingItem.id },
      data: {
        ...(patch.stableKey !== undefined ? { stableKey: valueOrNull(patch.stableKey) } : {}),
        ...(patch.section !== undefined ? { section: valueOrNull(patch.section) } : {}),
        ...(patch.itemCode !== undefined ? { itemCode: valueOrNull(patch.itemCode) } : {}),
        ...(patch.itemName !== undefined ? { itemName: patch.itemName } : {}),
        ...(patch.description !== undefined ? { description: valueOrNull(patch.description) } : {}),
        ...(patch.quantity !== undefined ? { quantity: patch.quantity } : {}),
        ...(patch.unit !== undefined ? { unit: valueOrNull(patch.unit) } : {}),
        ...(patch.unitPriceCents !== undefined ? { unitPriceCents: patch.unitPriceCents } : {}),
        ...(patch.amountCents !== undefined ? { amountCents: patch.amountCents } : {}),
        ...(patch.materialSpec !== undefined ? { materialSpec: valueOrNull(patch.materialSpec) } : {}),
        ...(patch.scope !== undefined ? { scope: valueOrNull(patch.scope) } : {}),
        ...(patch.customerNote !== undefined ? { customerNote: valueOrNull(patch.customerNote) } : {}),
        isCustomerEdited: true,
      },
    })

    const editableSnapshot = (item: typeof updatedItem): Prisma.InputJsonValue => ({
      stableKey: item.stableKey,
      section: item.section,
      itemCode: item.itemCode,
      itemName: item.itemName,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      unitPriceCents: item.unitPriceCents,
      amountCents: item.amountCents,
      materialSpec: item.materialSpec,
      scope: item.scope,
      customerNote: item.customerNote,
    })

    await tx.quoteItemRevision.create({
      data: {
        quoteItemId: existingItem.id,
        actorUserId: userId,
        beforeData: editableSnapshot(existingItem),
        afterData: editableSnapshot(updatedItem),
      },
    })

    const totals = await tx.quoteItem.aggregate({
      where: { quoteVersionId: versionId },
      _sum: { amountCents: true },
    })
    const totalAmountCents = totals._sum.amountCents ?? 0
    if (!Number.isSafeInteger(totalAmountCents) || Math.abs(totalAmountCents) > MAX_MONEY_CENTS) {
      throw new RenovationArchiveError('INVALID_UPLOAD', '报价总金额超出支持范围', 422)
    }
    await Promise.all([
      tx.quoteVersion.update({ where: { id: versionId }, data: { totalAmountCents } }),
      tx.renovationArchive.update({ where: { id: archiveId }, data: { updatedAt: new Date() } }),
    ])
    return updatedItem
  }, true)
}

export async function getOwnedArchiveAsset(
  userId: string,
  archiveId: string,
  assetId: string,
) {
  return strictTransaction(async (tx) => {
    const asset = await tx.archiveAsset.findFirst({
      where: {
        id: assetId,
        archiveId,
        status: 'ready',
        archive: { userId, status: { not: 'deleting' } },
      },
      select: {
        id: true,
        storageBucket: true,
        storagePath: true,
        originalName: true,
        mimeType: true,
        sizeBytes: true,
      },
    })
    if (!asset) throw new RenovationArchiveError('NOT_FOUND', '原始文件不存在', 404)
    return asset
  })
}

export async function markQuoteVersionZenoReviewed({
  reviewerUserId,
  archiveId,
  versionId,
  ip,
}: {
  reviewerUserId: string
  archiveId: string
  versionId: string
  ip?: string | null
}) {
  return strictTransaction(async (tx) => {
    const version = await tx.quoteVersion.findFirst({
      where: { id: versionId, archiveId },
      select: {
        id: true,
        status: true,
        customerConfirmedAt: true,
        zenoReviewedAt: true,
        zenoReviewedById: true,
      },
    })
    if (!version) throw new RenovationArchiveError('NOT_FOUND', '报价版本不存在', 404)
    if (version.status !== 'confirmed' || !version.customerConfirmedAt) {
      throw new RenovationArchiveError(
        'CONFLICT',
        '客户确认并锁定该版本后，才能记录 Zeno 人工审核',
        409,
      )
    }
    if (version.zenoReviewedAt) {
      if (version.zenoReviewedById !== reviewerUserId) {
        throw new RenovationArchiveError('CONFLICT', '该版本已经由其他审核身份标记', 409)
      }
      // Return the same scalar shape on an idempotent replay as on the first
      // write; callers should not have to branch on which request won.
      return tx.quoteVersion.findUniqueOrThrow({ where: { id: version.id } })
    }

    const reviewedAt = new Date()
    const [reviewed] = await Promise.all([
      tx.quoteVersion.update({
        where: { id: version.id },
        data: { zenoReviewedAt: reviewedAt, zenoReviewedById: reviewerUserId },
      }),
      tx.adminLog.create({
        data: {
          action: 'mark_quote_version_zeno_reviewed',
          target: version.id,
          actorId: reviewerUserId,
          ip: ip || null,
          detail: { archiveId, versionId, reviewedAt: reviewedAt.toISOString() },
        },
      }),
    ])
    return reviewed
  }, true)
}

export async function prepareOwnedRenovationArchiveDeletion(
  userId: string,
  archiveId: string,
) {
  return strictTransaction(async (tx) => {
    const archive = await tx.renovationArchive.findFirst({
      where: { id: archiveId, userId },
      include: {
        assets: { select: { storageBucket: true, storagePath: true } },
      },
    })
    if (!archive) throw new RenovationArchiveError('NOT_FOUND', '装修档案不存在', 404)
    if (archive.status !== 'deleting') {
      await tx.renovationArchive.update({
        where: { id: archiveId },
        data: { status: 'deleting', deletionRequestedAt: new Date() },
      })
    }
    return archive.assets.map((asset) => ({
      bucket: asset.storageBucket,
      path: asset.storagePath,
    }))
  }, true)
}

export async function completeOwnedRenovationArchiveDeletion(
  userId: string,
  archiveId: string,
) {
  return strictTransaction(async (tx) => {
    const deleted = await tx.renovationArchive.deleteMany({
      where: { id: archiveId, userId, status: 'deleting' },
    })
    return deleted
  }, true)
}

export async function listExpiredArchiveStorageCleanupTargets(limit = 100) {
  const cutoff = new Date(Date.now() - ARCHIVE_STORAGE_CLEANUP_DELAY_MS)
  return strictTransaction(async (tx) => {
    const [assets, archives] = await Promise.all([
      tx.archiveAsset.findMany({
        where: {
          status: { in: ['pending', 'deleted', ARCHIVE_ASSET_CLEANING_STATUS] },
          updatedAt: { lte: cutoff },
          archive: { status: { not: 'deleting' } },
        },
        orderBy: { updatedAt: 'asc' },
        take: limit,
        select: {
          id: true,
          storageBucket: true,
          storagePath: true,
          updatedAt: true,
        },
      }),
      tx.renovationArchive.findMany({
        where: { status: 'deleting', updatedAt: { lte: cutoff } },
        orderBy: { updatedAt: 'asc' },
        take: limit,
        select: {
          id: true,
          userId: true,
          updatedAt: true,
          assets: { select: { storageBucket: true, storagePath: true } },
        },
      }),
    ])
    return { cutoff, assets, archives }
  })
}

export async function claimExpiredArchiveAssetStorageCleanup(
  assetId: string,
  cutoff: Date,
) {
  return strictTransaction(async (tx) => {
    const claimed = await tx.archiveAsset.updateMany({
      where: {
        id: assetId,
        status: { in: ['pending', 'deleted', ARCHIVE_ASSET_CLEANING_STATUS] },
        updatedAt: { lte: cutoff },
        archive: { status: { not: 'deleting' } },
      },
      // Updating updatedAt creates a small retry backoff and makes the claim
      // atomic across concurrent Cron invocations. A failed target therefore
      // rotates behind newer targets instead of starving the queue.
      data: { status: ARCHIVE_ASSET_CLEANING_STATUS },
    })
    return claimed.count > 0
  }, true)
}

export async function claimExpiredRenovationArchiveDeletion(
  userId: string,
  archiveId: string,
  cutoff: Date,
) {
  return strictTransaction(async (tx) => {
    const claimed = await tx.renovationArchive.updateMany({
      where: {
        id: archiveId,
        userId,
        status: 'deleting',
        updatedAt: { lte: cutoff },
      },
      // The archive is already hidden. Touching updatedAt is the retry
      // backoff/claim marker without adding a migration-only worker column.
      data: { updatedAt: new Date() },
    })
    return claimed.count > 0
  }, true)
}

export async function completeExpiredArchiveAssetCleanup(
  assetId: string,
) {
  return strictTransaction((tx) => tx.archiveAsset.deleteMany({
    where: {
      id: assetId,
      status: ARCHIVE_ASSET_CLEANING_STATUS,
      archive: { status: { not: 'deleting' } },
    },
  }), true)
}
