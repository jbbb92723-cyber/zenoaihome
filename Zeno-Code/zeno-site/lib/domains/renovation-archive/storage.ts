import crypto from 'node:crypto'
import { z } from 'zod'
import {
  ARCHIVE_ALLOWED_MIME_TYPES,
  ARCHIVE_ASSET_KINDS,
  ARCHIVE_MIME_EXTENSIONS,
  ARCHIVE_UPLOAD_TOKEN_TTL_SECONDS,
  FREE_RENOVATION_ARCHIVE_LIMITS,
  type ArchiveAllowedMimeType,
  type ArchiveAssetKind,
} from './constants'
import type { UploadAssetMetadata } from './validation'

type StorageErrorCode =
  | 'CONFIGURATION_MISSING'
  | 'UPSTREAM_FAILED'
  | 'INVALID_RESPONSE'
  | 'OBJECT_NOT_FOUND'
  | 'INVALID_UPLOAD_TOKEN'

export class ArchiveStorageError extends Error {
  constructor(
    public readonly code: StorageErrorCode,
    message: string,
    public readonly upstreamStatus?: number,
  ) {
    super(message)
    this.name = 'ArchiveStorageError'
  }
}

type StorageConfig = {
  baseUrl: string
  serviceRoleKey: string
  bucket: string
  allowedBuckets: Set<string>
  uploadSecret: string
}

let verifiedBucketPolicy: { key: string; expiresAt: number } | null = null

export type ArchiveStorageObjectRef = {
  bucket: string
  path: string
}

const uploadIntentSchema = z.object({
  v: z.literal(1),
  userId: z.string().min(1).max(200),
  archiveId: z.string().cuid(),
  bucket: z.string().min(2).max(63),
  path: z.string().min(1).max(800),
  originalName: z.string().min(1).max(255),
  mimeType: z.enum(ARCHIVE_ALLOWED_MIME_TYPES),
  sizeBytes: z.number().int().positive(),
  sha256: z.string().regex(/^[a-f0-9]{64}$/i).optional(),
  kind: z.enum(ARCHIVE_ASSET_KINDS),
  idempotencyKey: z.string().uuid().optional(),
  exp: z.number().int().positive(),
  nonce: z.string().uuid(),
}).strict()

export type ArchiveUploadIntent = z.infer<typeof uploadIntentSchema>

export type SignedArchiveUpload = {
  path: string
  bucket: string
  signedUrl: string
  uploadToken: string
  expiresAt: string
}

export type PreparedArchiveUpload = Omit<SignedArchiveUpload, 'signedUrl'> & {
  intent: ArchiveUploadIntent
}

export type ArchiveStorageObjectMetadata = {
  sizeBytes: number
  mimeType: string
  etag: string | null
}

function readStorageConfig(): StorageConfig {
  const baseUrlValue = process.env.SUPABASE_URL?.trim()
    || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  const bucket = process.env.SUPABASE_RENOVATION_ARCHIVE_BUCKET?.trim()
    || 'renovation-archives'
  const historicalBuckets = (process.env.SUPABASE_RENOVATION_ARCHIVE_ALLOWED_BUCKETS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
  const uploadSecret = process.env.RENOVATION_ARCHIVE_UPLOAD_SECRET?.trim()

  if (!baseUrlValue || !serviceRoleKey || !uploadSecret || uploadSecret.length < 32) {
    throw new ArchiveStorageError(
      'CONFIGURATION_MISSING',
      '装修档案私有存储尚未配置',
    )
  }

  let url: URL
  try {
    url = new URL(baseUrlValue)
  } catch {
    throw new ArchiveStorageError('CONFIGURATION_MISSING', 'SUPABASE_URL 格式无效')
  }
  const localHttp = url.protocol === 'http:'
    && ['localhost', '127.0.0.1'].includes(url.hostname)
  if ((url.protocol !== 'https:' && !localHttp) || url.username || url.password) {
    throw new ArchiveStorageError('CONFIGURATION_MISSING', 'SUPABASE_URL 必须使用 HTTPS（本地开发除外）')
  }
  const allowedBuckets = new Set([bucket, ...historicalBuckets])
  if (Array.from(allowedBuckets).some((value) => !/^[a-z0-9][a-z0-9_-]{1,62}$/i.test(value))) {
    throw new ArchiveStorageError('CONFIGURATION_MISSING', '装修档案 Storage bucket 名称无效')
  }

  return {
    baseUrl: url.toString().replace(/\/$/, ''),
    serviceRoleKey,
    bucket,
    allowedBuckets,
    uploadSecret,
  }
}

function assertAllowedStorageBucket(config: StorageConfig, bucket: string) {
  if (!config.allowedBuckets.has(bucket)) {
    throw new ArchiveStorageError(
      'CONFIGURATION_MISSING',
      '历史装修档案 Storage bucket 尚未加入允许列表',
    )
  }
}

export function isArchiveStorageConfigured(): boolean {
  try {
    readStorageConfig()
    return true
  } catch {
    return false
  }
}

function encodeStoragePath(path: string): string {
  return path.split('/').map(encodeURIComponent).join('/')
}

function storageHeaders(config: StorageConfig): HeadersInit {
  return {
    apikey: config.serviceRoleKey,
    Authorization: `Bearer ${config.serviceRoleKey}`,
  }
}

async function assertArchiveStoragePolicy(config: StorageConfig) {
  const cacheKey = `${config.baseUrl}|${config.bucket}`
  if (verifiedBucketPolicy?.key === cacheKey && verifiedBucketPolicy.expiresAt > Date.now()) {
    return
  }

  let response: Response
  try {
    response = await fetch(
      `${config.baseUrl}/storage/v1/bucket/${encodeURIComponent(config.bucket)}`,
      {
        headers: storageHeaders(config),
        signal: AbortSignal.timeout(8_000),
      },
    )
  } catch {
    throw new ArchiveStorageError('UPSTREAM_FAILED', '暂时无法核验装修档案存储策略')
  }
  if (!response.ok) {
    throw new ArchiveStorageError(
      'UPSTREAM_FAILED',
      'Supabase Storage bucket 暂时无法核验',
      response.status,
    )
  }

  const bucket = await response.json().catch(() => null) as null | {
    public?: boolean
    file_size_limit?: number | string | null
    allowed_mime_types?: string[] | null
  }
  const fileSizeLimit = Number(bucket?.file_size_limit)
  const allowedMimeTypes = Array.isArray(bucket?.allowed_mime_types)
    ? new Set(bucket.allowed_mime_types.map((value) => value.toLowerCase()))
    : null
  const expectedMimeTypes = new Set<string>(ARCHIVE_ALLOWED_MIME_TYPES)
  const mimePolicyMatches = allowedMimeTypes !== null
    && allowedMimeTypes.size === expectedMimeTypes.size
    && Array.from(expectedMimeTypes).every((value) => allowedMimeTypes.has(value))

  if (
    bucket?.public !== false
    || !Number.isSafeInteger(fileSizeLimit)
    || fileSizeLimit <= 0
    || fileSizeLimit > FREE_RENOVATION_ARCHIVE_LIMITS.maxFileBytes
    || !mimePolicyMatches
  ) {
    throw new ArchiveStorageError(
      'CONFIGURATION_MISSING',
      '装修档案 bucket 必须为私有、单文件不超过 10MB，且只允许 CSV/XLSX',
    )
  }

  verifiedBucketPolicy = { key: cacheKey, expiresAt: Date.now() + 5 * 60_000 }
}

function uploadIntentToken(payload: ArchiveUploadIntent, secret: string): string {
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  const signature = crypto.createHmac('sha256', secret).update(encoded).digest('base64url')
  return `${encoded}.${signature}`
}

export function verifyArchiveUploadToken(
  token: string,
  { allowExpired = false }: { allowExpired?: boolean } = {},
): ArchiveUploadIntent {
  const config = readStorageConfig()
  const [encoded, suppliedSignature, extra] = token.split('.')
  if (!encoded || !suppliedSignature || extra) {
    throw new ArchiveStorageError('INVALID_UPLOAD_TOKEN', '上传凭证格式无效')
  }

  const expectedSignature = crypto
    .createHmac('sha256', config.uploadSecret)
    .update(encoded)
    .digest('base64url')
  const suppliedBuffer = Buffer.from(suppliedSignature)
  const expectedBuffer = Buffer.from(expectedSignature)
  if (
    suppliedBuffer.length !== expectedBuffer.length
    || !crypto.timingSafeEqual(suppliedBuffer, expectedBuffer)
  ) {
    throw new ArchiveStorageError('INVALID_UPLOAD_TOKEN', '上传凭证签名无效')
  }

  let decoded: unknown
  try {
    decoded = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'))
  } catch {
    throw new ArchiveStorageError('INVALID_UPLOAD_TOKEN', '上传凭证内容无效')
  }
  const parsed = uploadIntentSchema.safeParse(decoded)
  if (!parsed.success) {
    throw new ArchiveStorageError('INVALID_UPLOAD_TOKEN', '上传凭证内容无效')
  }
  if (!allowExpired && parsed.data.exp < Math.floor(Date.now() / 1000)) {
    throw new ArchiveStorageError('INVALID_UPLOAD_TOKEN', '上传凭证已失效')
  }
  return parsed.data
}

export function assertUploadIntentMatches(
  intent: ArchiveUploadIntent,
  expected: UploadAssetMetadata & {
    userId: string
    archiveId: string
    bucket: string
    path: string
  },
) {
  const matches = intent.userId === expected.userId
    && intent.archiveId === expected.archiveId
    && intent.bucket === expected.bucket
    && intent.path === expected.path
    && intent.originalName === expected.originalName
    && intent.mimeType === expected.mimeType
    && intent.sizeBytes === expected.sizeBytes
    && intent.kind === expected.kind
    && (intent.sha256 ?? null) === (expected.sha256 ?? null)

  if (!matches) {
    throw new ArchiveStorageError('INVALID_UPLOAD_TOKEN', '上传凭证与文件信息不一致')
  }
}

export async function prepareArchiveUpload({
  userId,
  archiveId,
  metadata,
  idempotencyKey,
}: {
  userId: string
  archiveId: string
  metadata: UploadAssetMetadata
  idempotencyKey?: string
}): Promise<PreparedArchiveUpload> {
  const config = readStorageConfig()
  await assertArchiveStoragePolicy(config)
  const extension = ARCHIVE_MIME_EXTENSIONS[metadata.mimeType as ArchiveAllowedMimeType]
  const requestDigest = idempotencyKey
    ? crypto.createHash('sha256').update(`${userId}:${archiveId}:${idempotencyKey}`).digest('hex')
    : null
  // The stable path is intentionally independent of the file extension. Reusing
  // a key with different metadata therefore reaches the existing reservation
  // and is rejected as a conflict instead of creating a second quota entry.
  const path = requestDigest
    ? `users/${userId}/archives/${archiveId}/requests/${requestDigest}.upload`
    : `users/${userId}/archives/${archiveId}/${crypto.randomUUID()}${extension}`
  const expiresAtSeconds = Math.floor(Date.now() / 1000) + ARCHIVE_UPLOAD_TOKEN_TTL_SECONDS
  const intent: ArchiveUploadIntent = {
    v: 1,
    userId,
    archiveId,
    bucket: config.bucket,
    path,
    originalName: metadata.originalName,
    mimeType: metadata.mimeType,
    sizeBytes: metadata.sizeBytes,
    sha256: metadata.sha256,
    kind: metadata.kind as ArchiveAssetKind,
    ...(idempotencyKey ? { idempotencyKey } : {}),
    exp: expiresAtSeconds,
    nonce: crypto.randomUUID(),
  }

  return {
    intent,
    path,
    bucket: config.bucket,
    uploadToken: uploadIntentToken(intent, config.uploadSecret),
    expiresAt: new Date(expiresAtSeconds * 1000).toISOString(),
  }
}

export async function createSignedArchiveUpload(
  prepared: PreparedArchiveUpload,
): Promise<SignedArchiveUpload> {
  const config = readStorageConfig()
  await assertArchiveStoragePolicy(config)
  if (
    prepared.intent.bucket !== config.bucket
    || prepared.bucket !== config.bucket
    || prepared.path !== prepared.intent.path
  ) {
    throw new ArchiveStorageError('INVALID_UPLOAD_TOKEN', '上传预留与当前 Storage 配置不一致')
  }

  let response: Response
  try {
    response = await fetch(
      `${config.baseUrl}/storage/v1/object/upload/sign/${encodeURIComponent(config.bucket)}/${encodeStoragePath(prepared.path)}`,
      {
        method: 'POST',
        headers: {
          ...storageHeaders(config),
          'Content-Type': 'application/json',
          'x-upsert': 'false',
        },
        body: JSON.stringify({}),
        signal: AbortSignal.timeout(10_000),
      },
    )
  } catch {
    throw new ArchiveStorageError('UPSTREAM_FAILED', '暂时无法签发上传地址')
  }

  if (!response.ok) {
    throw new ArchiveStorageError(
      'UPSTREAM_FAILED',
      'Supabase Storage 拒绝签发上传地址',
      response.status,
    )
  }

  const data = await response.json().catch(() => null) as null | {
    url?: string
    signedURL?: string
    signedUrl?: string
    token?: string
  }
  const storageToken = typeof data?.token === 'string' ? data.token : null
  const returnedUrl = data?.signedUrl ?? data?.signedURL ?? data?.url
  let signedUrl: string
  if (typeof returnedUrl === 'string' && returnedUrl.startsWith('http')) {
    signedUrl = returnedUrl
  } else if (typeof returnedUrl === 'string' && returnedUrl.startsWith('/')) {
    signedUrl = `${config.baseUrl}/storage/v1${returnedUrl}`
  } else if (storageToken) {
    signedUrl = `${config.baseUrl}/storage/v1/object/upload/sign/${encodeURIComponent(config.bucket)}/${encodeStoragePath(prepared.path)}?token=${encodeURIComponent(storageToken)}`
  } else {
    throw new ArchiveStorageError('INVALID_RESPONSE', 'Supabase Storage 返回了无效上传地址')
  }

  return {
    path: prepared.path,
    bucket: prepared.bucket,
    signedUrl,
    uploadToken: prepared.uploadToken,
    expiresAt: prepared.expiresAt,
  }
}

function objectSizeFromHeaders(headers: Headers): number | null {
  const contentRange = headers.get('content-range')
  const rangeTotal = contentRange?.match(/\/(\d+)$/)?.[1]
  const value = rangeTotal ?? headers.get('content-length')
  if (!value) return null
  const size = Number(value)
  return Number.isSafeInteger(size) && size >= 0 ? size : null
}

export async function getArchiveStorageObjectMetadata(
  path: string,
  bucket?: string,
): Promise<ArchiveStorageObjectMetadata> {
  const config = readStorageConfig()
  const targetBucket = bucket ?? config.bucket
  assertAllowedStorageBucket(config, targetBucket)
  const url = `${config.baseUrl}/storage/v1/object/authenticated/${encodeURIComponent(targetBucket)}/${encodeStoragePath(path)}`

  let response: Response
  try {
    response = await fetch(url, {
      method: 'HEAD',
      headers: storageHeaders(config),
      signal: AbortSignal.timeout(10_000),
    })
    if (response.status === 405) {
      response = await fetch(url, {
        method: 'GET',
        headers: { ...storageHeaders(config), Range: 'bytes=0-0' },
        signal: AbortSignal.timeout(10_000),
      })
    }
  } catch {
    throw new ArchiveStorageError('UPSTREAM_FAILED', '暂时无法核对已上传文件')
  }

  if (response.status === 404) {
    throw new ArchiveStorageError('OBJECT_NOT_FOUND', '未找到已上传文件', 404)
  }
  if (!response.ok) {
    throw new ArchiveStorageError('UPSTREAM_FAILED', '无法读取已上传文件元数据', response.status)
  }

  const sizeBytes = objectSizeFromHeaders(response.headers)
  const mimeType = response.headers.get('content-type')?.split(';')[0].trim().toLowerCase()
  if (sizeBytes === null || !mimeType) {
    throw new ArchiveStorageError('INVALID_RESPONSE', '已上传文件缺少大小或 MIME 元数据')
  }

  if (response.body) await response.body.cancel().catch(() => undefined)
  return {
    sizeBytes,
    mimeType,
    etag: response.headers.get('etag'),
  }
}

export async function deleteArchiveStorageObjects(
  objects: ArchiveStorageObjectRef[],
): Promise<boolean> {
  if (objects.length === 0) return true
  const config = readStorageConfig()

  const pathsByBucket = new Map<string, string[]>()
  for (const object of objects) {
    assertAllowedStorageBucket(config, object.bucket)
    const paths = pathsByBucket.get(object.bucket) ?? []
    paths.push(object.path)
    pathsByBucket.set(object.bucket, paths)
  }

  for (const [bucket, paths] of Array.from(pathsByBucket.entries())) {
    try {
      const response = await fetch(
        `${config.baseUrl}/storage/v1/object/${encodeURIComponent(bucket)}`,
        {
          method: 'DELETE',
          headers: { ...storageHeaders(config), 'Content-Type': 'application/json' },
          body: JSON.stringify({ prefixes: paths }),
          signal: AbortSignal.timeout(12_000),
        },
      )
      if (!response.ok) return false
    } catch {
      return false
    }
  }
  return true
}

export function getArchiveStorageBucket(): string {
  return readStorageConfig().bucket
}
