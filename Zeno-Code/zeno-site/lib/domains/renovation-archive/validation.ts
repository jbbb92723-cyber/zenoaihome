import { z } from 'zod'
import {
  ARCHIVE_ALLOWED_MIME_TYPES,
  ARCHIVE_ASSET_KINDS,
  ARCHIVE_STATUSES,
  FREE_RENOVATION_ARCHIVE_LIMITS,
  MAX_MONEY_CENTS,
  MAX_QUOTE_ITEMS_PER_VERSION,
} from './constants'

const optionalTrimmedString = (max: number) => z.string().trim().max(max).optional().nullable()
const nullableMoney = z.number().int().min(-MAX_MONEY_CENTS).max(MAX_MONEY_CENTS).optional().nullable()

export const archiveIdSchema = z.string().cuid()
export const archiveAssetIdSchema = z.string().cuid()

export const createArchiveSchema = z.object({
  title: z.string().trim().min(2).max(120),
  city: optionalTrimmedString(80),
  address: optionalTrimmedString(300),
  area: z.number().positive().max(100_000).optional().nullable(),
  homeType: optionalTrimmedString(80),
  notes: optionalTrimmedString(2000),
}).strict()

export const updateArchiveSchema = z.object({
  title: z.string().trim().min(2).max(120).optional(),
  city: optionalTrimmedString(80),
  address: optionalTrimmedString(300),
  area: z.number().positive().max(100_000).optional().nullable(),
  homeType: optionalTrimmedString(80),
  notes: optionalTrimmedString(2000),
  status: z.enum(ARCHIVE_STATUSES).optional(),
}).strict().refine(
  (value) => Object.keys(value).length > 0,
  { message: '至少提供一个需要更新的字段' },
)

const safeOriginalNameSchema = z.string()
  .trim()
  .min(1)
  .max(255)
  .refine((value) => !/[\\/\u0000-\u001f\u007f]/.test(value), '文件名包含不允许的字符')

export const uploadAssetMetadataSchema = z.object({
  originalName: safeOriginalNameSchema,
  mimeType: z.enum(ARCHIVE_ALLOWED_MIME_TYPES),
  sizeBytes: z.number().int().positive().max(FREE_RENOVATION_ARCHIVE_LIMITS.maxFileBytes),
  sha256: z.string().regex(/^[a-f0-9]{64}$/i).optional(),
  kind: z.enum(ARCHIVE_ASSET_KINDS).default('quote'),
}).strict()

export const requestArchiveUploadSchema = uploadAssetMetadataSchema.extend({
  materialConsent: z.literal(true),
  // The client keeps this key for the whole import attempt. A lost response
  // can then reuse the same DB reservation instead of consuming another slot.
  idempotencyKey: z.string().uuid().optional(),
}).strict()

const quoteItemSchema = z.object({
  sourceRow: z.number().int().min(1).max(1_000_000),
  stableKey: optionalTrimmedString(200),
  section: optionalTrimmedString(200),
  itemCode: optionalTrimmedString(100),
  itemName: z.string().trim().min(1).max(300),
  description: optionalTrimmedString(2000),
  quantity: z.number().finite().min(0).max(1_000_000_000).optional().nullable(),
  unit: optionalTrimmedString(50),
  unitPriceCents: nullableMoney,
  amountCents: nullableMoney,
  materialSpec: optionalTrimmedString(1000),
  scope: optionalTrimmedString(1000),
  rawData: z.record(z.string().max(120), z.unknown()),
  confidence: z.number().finite().min(0).max(1),
}).strict()

export const createQuoteVersionSchema = z.object({
  label: optionalTrimmedString(100),
  assetId: z.string().cuid(),
  uploadToken: z.string().trim().min(40).max(8000),
  rows: z.array(quoteItemSchema).min(1).max(MAX_QUOTE_ITEMS_PER_VERSION),
}).strict()

const quoteItemPatchSchema = z.object({
  stableKey: optionalTrimmedString(200),
  section: optionalTrimmedString(200),
  itemCode: optionalTrimmedString(100),
  itemName: z.string().trim().min(1).max(300).optional(),
  description: optionalTrimmedString(2000),
  quantity: z.number().finite().min(0).max(1_000_000_000).optional().nullable(),
  unit: optionalTrimmedString(50),
  unitPriceCents: nullableMoney,
  amountCents: nullableMoney,
  materialSpec: optionalTrimmedString(1000),
  scope: optionalTrimmedString(1000),
  customerNote: optionalTrimmedString(1000),
}).strict().refine(
  (value) => Object.keys(value).length > 0,
  { message: '至少提供一个需要更新的报价字段' },
)

export const patchQuoteVersionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('update-item'),
    itemId: z.string().cuid(),
    patch: quoteItemPatchSchema,
  }).strict(),
  z.object({
    action: z.literal('confirm-version'),
    confirmed: z.literal(true),
  }).strict(),
])

export type CreateArchiveInput = z.infer<typeof createArchiveSchema>
export type UpdateArchiveInput = z.infer<typeof updateArchiveSchema>
export type UploadAssetMetadata = z.infer<typeof uploadAssetMetadataSchema>
export type CreateQuoteVersionInput = z.infer<typeof createQuoteVersionSchema>
export type PatchQuoteVersionInput = z.infer<typeof patchQuoteVersionSchema>
