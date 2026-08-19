import type {
  QuoteFileMimeType,
  QuoteImportRow,
  QuoteItemChanges,
  RenovationArchive,
  RenovationArchiveListResponse,
  RenovationArchiveResponse,
  UploadTicket,
} from './types'

class RenovationArchiveApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'RenovationArchiveApiError'
    this.status = status
  }
}

async function readJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => null) as ({ error?: string; message?: string } & T) | null
  if (!response.ok) {
    throw new RenovationArchiveApiError(
      payload?.error || payload?.message || '请求没有完成，请稍后重试。',
      response.status,
    )
  }
  return payload as T
}

async function request<T>(url: string, init?: RequestInit) {
  return readJson<T>(await fetch(url, {
    ...init,
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  }))
}

export async function getRenovationArchive(): Promise<RenovationArchiveResponse> {
  const list = await request<RenovationArchiveListResponse>(
    '/api/renovation-archives',
    { cache: 'no-store' },
  )
  const archiveId = list.archives[0]?.id
  if (!archiveId) return { archive: null, limits: list.limits }

  const detail = await request<RenovationArchiveResponse>(
    `/api/renovation-archives/${archiveId}`,
    { cache: 'no-store' },
  )
  return { archive: detail.archive, limits: detail.limits ?? list.limits }
}

export async function createRenovationArchive(title: string): Promise<RenovationArchiveResponse> {
  const payload = await request<{
    archive: Omit<RenovationArchive, 'assets' | 'quoteVersions'>
    limits: RenovationArchiveResponse['limits']
  }>(
    '/api/renovation-archives',
    { method: 'POST', body: JSON.stringify({ title }) },
  )
  return {
    archive: { ...payload.archive, assets: [], quoteVersions: [] },
    limits: payload.limits,
  }
}

export async function deleteRenovationArchive(archiveId: string) {
  return request<{
    deletionRequested: true
    deletionPending: true
    archiveId: string
    storageCleanup: 'not-needed' | 'completed' | 'pending-retry'
  }>(`/api/renovation-archives/${archiveId}`, { method: 'DELETE' })
}

export function quoteFileMimeType(file: File): QuoteFileMimeType {
  if (file.name.toLowerCase().endsWith('.csv')) return 'text/csv'
  if (file.name.toLowerCase().endsWith('.xlsx')) {
    return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }
  throw new Error('目前只支持 CSV 和 XLSX 文件。')
}

export async function requestArchiveUpload({
  archiveId,
  file,
  idempotencyKey,
}: {
  archiveId: string
  file: File
  idempotencyKey: string
}): Promise<UploadTicket> {
  const init = {
    method: 'POST',
    body: JSON.stringify({
      originalName: file.name,
      mimeType: quoteFileMimeType(file),
      sizeBytes: file.size,
      kind: 'quote',
      materialConsent: true,
      idempotencyKey,
    }),
  }
  try {
    return await request<UploadTicket>(`/api/renovation-archives/${archiveId}/uploads`, init)
  } catch (error) {
    // A response can be lost after the DB reservation is committed. Reusing
    // the same key lets the server return that reservation instead of creating
    // another one.
    if (!(error instanceof TypeError)) throw error
    return request<UploadTicket>(`/api/renovation-archives/${archiveId}/uploads`, init)
  }
}

export async function uploadArchiveFile(file: File, ticket: UploadTicket) {
  // Match Supabase storage-js uploadToSignedUrl for browser File/Blob values.
  // Storage parses the multipart body and persists the file part itself.
  const body = new FormData()
  body.append('cacheControl', '3600')
  body.append('', file, file.name)
  const headers = new Headers(ticket.request.headers)
  headers.delete('Content-Type')
  const response = await fetch(ticket.upload.signedUrl, {
    method: ticket.request.method,
    headers,
    body,
  })
  if (!response.ok) throw new Error('原文件上传失败，请重试。')
}

export async function cancelArchiveUpload(archiveId: string, assetId: string) {
  return request<{
    cancelled: true
    assetId: string
  }>(`/api/renovation-archives/${archiveId}/uploads/${assetId}`, {
    method: 'DELETE',
  })
}

export async function createQuoteVersion({
  archiveId,
  ticket,
  label,
  rows,
}: {
  archiveId: string
  ticket: UploadTicket
  label: string
  rows: QuoteImportRow[]
}) {
  const url = `/api/renovation-archives/${archiveId}/quote-versions`
  const init = {
    method: 'POST',
    body: JSON.stringify({
      label,
      assetId: ticket.upload.assetId,
      uploadToken: ticket.upload.uploadToken,
      rows,
    }),
  }
  try {
    return await request<{ quoteVersion: RenovationArchive['quoteVersions'][number] }>(url, init)
  } catch (error) {
    // A disconnected response can arrive after the transaction committed. One
    // retry with the same asset lets the server return the existing version.
    if (!(error instanceof TypeError)) throw error
    return request<{ quoteVersion: RenovationArchive['quoteVersions'][number] }>(url, init)
  }
}

export async function confirmQuoteVersion(archiveId: string, versionId: string) {
  return request<{ quoteVersion: RenovationArchive['quoteVersions'][number] }>(
    `/api/renovation-archives/${archiveId}/quote-versions/${versionId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ action: 'confirm-version', confirmed: true }),
    },
  )
}

export async function updateQuoteItem({
  archiveId,
  versionId,
  itemId,
  changes,
}: {
  archiveId: string
  versionId: string
  itemId: string
  changes: QuoteItemChanges
}) {
  return request<{ quoteItem: RenovationArchive['quoteVersions'][number]['items'][number] }>(
    `/api/renovation-archives/${archiveId}/quote-versions/${versionId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ action: 'update-item', itemId, patch: changes }),
    },
  )
}
