import { ArchiveStorageError } from './storage'
import { RenovationArchiveError } from './service'

export class RequestBodyTooLargeError extends Error {
  constructor() {
    super('请求数据量超出支持范围')
    this.name = 'RequestBodyTooLargeError'
  }
}

export async function readJsonBodyWithLimit(
  request: Request,
  maxBytes: number,
): Promise<unknown> {
  const declaredLength = Number(request.headers.get('content-length'))
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new RequestBodyTooLargeError()
  }

  if (!request.body) return null
  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  let totalBytes = 0
  let text = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      totalBytes += value.byteLength
      if (totalBytes > maxBytes) {
        await reader.cancel().catch(() => undefined)
        throw new RequestBodyTooLargeError()
      }
      text += decoder.decode(value, { stream: true })
    }
    text += decoder.decode()
    return JSON.parse(text)
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) throw error
    return null
  } finally {
    reader.releaseLock()
  }
}

export function renovationArchiveHttpError(error: unknown): {
  status: number
  body: { error: string; code: string; details?: Record<string, unknown> }
} {
  if (error instanceof RequestBodyTooLargeError) {
    return {
      status: 413,
      body: { error: error.message, code: 'PAYLOAD_TOO_LARGE' },
    }
  }

  if (error instanceof RenovationArchiveError) {
    return {
      status: error.status,
      body: { error: error.message, code: error.code, details: error.details },
    }
  }

  if (error instanceof ArchiveStorageError) {
    const status = error.code === 'CONFIGURATION_MISSING'
      ? 503
      : error.code === 'OBJECT_NOT_FOUND'
        ? 422
        : error.code === 'INVALID_UPLOAD_TOKEN'
          ? 422
          : 502
    return {
      status,
      body: { error: error.message, code: error.code },
    }
  }

  console.error('[renovation-archive] unexpected error', error)
  return {
    status: 500,
    body: { error: '装修档案操作失败，请稍后重试', code: 'INTERNAL_ERROR' },
  }
}
