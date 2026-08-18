const INTERNAL_URL_BASE = 'https://zeno-internal.invalid'
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f-\u009f]/
const MAX_DECODE_PASSES = 8

function hasUnsafePathSyntax(value: string): boolean {
  return (
    value.length === 0
    || value !== value.trim()
    || !value.startsWith('/')
    || value.startsWith('//')
    || value.includes('\\')
    || CONTROL_CHARACTER_PATTERN.test(value)
  )
}

function isSafeInternalCallbackUrl(value: string): boolean {
  let decoded = value

  for (let pass = 0; pass < MAX_DECODE_PASSES; pass += 1) {
    if (hasUnsafePathSyntax(decoded)) return false

    let next: string
    try {
      next = decodeURIComponent(decoded)
    } catch {
      return false
    }

    if (next === decoded) {
      try {
        const resolved = new URL(value, INTERNAL_URL_BASE)
        return resolved.origin === INTERNAL_URL_BASE
          && resolved.username === ''
          && resolved.password === ''
      } catch {
        return false
      }
    }

    decoded = next
  }

  // Reject unusually deep encoding instead of guessing how a later layer decodes it.
  return false
}

export function normalizeInternalCallbackUrl(
  value: string | null | undefined,
  fallback = '/',
): string {
  const safeFallback = isSafeInternalCallbackUrl(fallback) ? fallback : '/'
  return value && isSafeInternalCallbackUrl(value) ? value : safeFallback
}
