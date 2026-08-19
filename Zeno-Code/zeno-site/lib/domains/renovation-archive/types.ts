export type ArchiveLimits = {
  archives: number
  versionsPerArchive: number
  filesPerArchive: number
  maxFileBytes?: number
  totalBytesPerArchive: number
}

export type RenovationArchiveAsset = {
  id: string
  originalName: string
  mimeType: string
  sizeBytes: number
  sha256?: string | null
  kind: string
  status?: string
  createdAt?: string
  updatedAt?: string
}

export type RenovationQuoteItem = {
  id: string
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
  rawData?: unknown
  confidence: number
  isCustomerEdited: boolean
  customerNote: string | null
  createdAt: string
  updatedAt: string
}

export type RenovationQuoteVersion = {
  id: string
  versionNumber: number
  label: string | null
  status: 'draft' | 'confirmed'
  currency: string
  totalAmountCents: number
  customerConfirmedAt: string | null
  zenoReviewedAt: string | null
  createdAt: string
  updatedAt: string
  asset: Pick<
    RenovationArchiveAsset,
    'id' | 'originalName' | 'mimeType' | 'sizeBytes' | 'kind'
  >
  items: RenovationQuoteItem[]
}

export type RenovationArchive = {
  id: string
  title: string
  city: string | null
  address: string | null
  area: number | null
  homeType: string | null
  notes: string | null
  status: 'active' | 'archived'
  createdAt: string
  updatedAt: string
  quoteVersions: RenovationQuoteVersion[]
  assets: RenovationArchiveAsset[]
}

export type RenovationArchiveSummary = Omit<
  RenovationArchive,
  'quoteVersions' | 'assets'
> & {
  _count: { assets: number; quoteVersions: number }
  quoteVersions: Array<Pick<
    RenovationQuoteVersion,
    'id' | 'versionNumber' | 'status' | 'totalAmountCents' | 'zenoReviewedAt' | 'updatedAt'
  >>
}

export type RenovationArchiveResponse = {
  archive: RenovationArchive | null
  limits: ArchiveLimits
}

export type RenovationArchiveListResponse = {
  archives: RenovationArchiveSummary[]
  limits: ArchiveLimits
}

export type QuoteImportRow = {
  sourceRow: number
  stableKey?: string | null
  section?: string | null
  itemCode?: string | null
  itemName: string
  description?: string | null
  quantity?: number | null
  unit?: string | null
  unitPriceCents?: number | null
  amountCents?: number | null
  materialSpec?: string | null
  scope?: string | null
  rawData: Record<string, unknown>
  confidence: number
}

export type QuoteItemChanges = Partial<Pick<
  RenovationQuoteItem,
  | 'stableKey'
  | 'section'
  | 'itemCode'
  | 'itemName'
  | 'description'
  | 'quantity'
  | 'unit'
  | 'unitPriceCents'
  | 'amountCents'
  | 'materialSpec'
  | 'scope'
  | 'customerNote'
>>

export type QuoteFileMimeType =
  | 'text/csv'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

export type UploadTicket = {
  upload: {
    assetId: string
    path: string
    bucket: string
    signedUrl: string
    uploadToken: string
    expiresAt: string
  }
  request: {
    method: 'PUT'
    headers: Record<string, string>
  }
  asset: RenovationArchiveAsset
  usage: {
    files: number
    totalBytes: number
    versions: number
  }
  limits: ArchiveLimits
}
