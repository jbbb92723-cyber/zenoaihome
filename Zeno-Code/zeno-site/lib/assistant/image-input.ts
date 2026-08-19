const MAX_ASSISTANT_IMAGE_BYTES = 2 * 1024 * 1024

type SupportedImageMime = 'image/jpeg' | 'image/png' | 'image/webp'

export type AssistantImageInput = {
  dataUrl: string
  name?: string
}

export type ParsedAssistantImage = {
  dataUrl: string
  mime: SupportedImageMime
  name: string
  byteLength: number
}

export class AssistantImageInputError extends Error {
  constructor(public readonly code: 'INVALID_IMAGE' | 'IMAGE_TOO_LARGE') {
    super(code)
    this.name = 'AssistantImageInputError'
  }
}

function hasExpectedSignature(buffer: Buffer, mime: SupportedImageMime) {
  if (mime === 'image/jpeg') {
    return buffer.length >= 3
      && buffer[0] === 0xff
      && buffer[1] === 0xd8
      && buffer[2] === 0xff
  }

  if (mime === 'image/png') {
    const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
    return buffer.length >= signature.length
      && signature.every((value, index) => buffer[index] === value)
  }

  return buffer.length >= 12
    && buffer.subarray(0, 4).toString('ascii') === 'RIFF'
    && buffer.subarray(8, 12).toString('ascii') === 'WEBP'
}

export function parseAssistantImage(input: AssistantImageInput): ParsedAssistantImage {
  const match = input.dataUrl.match(
    /^data:(image\/jpeg|image\/png|image\/webp);base64,([A-Za-z0-9+/]+={0,2})$/,
  )
  if (!match || match[2].length % 4 !== 0) {
    throw new AssistantImageInputError('INVALID_IMAGE')
  }

  const mime = match[1] as SupportedImageMime
  const encoded = match[2]
  const buffer = Buffer.from(encoded, 'base64')

  if (buffer.length === 0 || buffer.length > MAX_ASSISTANT_IMAGE_BYTES) {
    throw new AssistantImageInputError(
      buffer.length > MAX_ASSISTANT_IMAGE_BYTES ? 'IMAGE_TOO_LARGE' : 'INVALID_IMAGE',
    )
  }
  if (buffer.toString('base64') !== encoded || !hasExpectedSignature(buffer, mime)) {
    throw new AssistantImageInputError('INVALID_IMAGE')
  }

  const safeName = (input.name ?? 'image')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim()
    .slice(0, 100) || 'image'

  return {
    dataUrl: `data:${mime};base64,${encoded}`,
    mime,
    name: safeName,
    byteLength: buffer.length,
  }
}
