export const FREE_RENOVATION_ARCHIVE_LIMITS = {
  archives: 1,
  versionsPerArchive: 2,
  filesPerArchive: 10,
  maxFileBytes: 10 * 1024 * 1024,
  totalBytesPerArchive: 50 * 1024 * 1024,
} as const

export const ARCHIVE_UPLOAD_TOKEN_TTL_SECONDS = 15 * 60
export const ARCHIVE_STORAGE_CLEANUP_DELAY_MS = 3 * 60 * 60 * 1000
export const ARCHIVE_MATERIAL_ATTESTATION_VERSION = '2026-08-19-v1'
// A claimed asset is hidden from the customer while Storage cleanup is in
// flight. Keeping the state in the existing string column avoids a second
// cleanup worker deleting an object that a customer is still uploading.
export const ARCHIVE_ASSET_CLEANING_STATUS = 'cleaning'
export const MAX_QUOTE_ITEMS_PER_VERSION = 1000
export const MAX_RAW_DATA_BYTES_PER_ITEM = 4 * 1024
export const MAX_TOTAL_RAW_DATA_BYTES = 1024 * 1024
export const MAX_MONEY_CENTS = 2_000_000_000

export const ARCHIVE_ASSET_KINDS = [
  'quote',
] as const

export const ARCHIVE_STATUSES = ['active', 'archived'] as const

export const ARCHIVE_ALLOWED_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
] as const

export type ArchiveAssetKind = (typeof ARCHIVE_ASSET_KINDS)[number]
export type ArchiveAllowedMimeType = (typeof ARCHIVE_ALLOWED_MIME_TYPES)[number]

export const ARCHIVE_MIME_EXTENSIONS: Record<ArchiveAllowedMimeType, string> = {
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'text/csv': '.csv',
}
