import crypto from 'crypto'

export function verifyInternalApiRequest(req: Request): boolean {
  const token = process.env.ZENO_INTERNAL_API_TOKEN
  if (!token) return false

  const authHeader = req.headers.get('authorization') ?? ''
  const incoming = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
  if (!incoming) return false

  const expected = Buffer.from(token)
  const received = Buffer.from(incoming)
  if (expected.length !== received.length) return false

  return crypto.timingSafeEqual(expected, received)
}
