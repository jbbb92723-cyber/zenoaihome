export const VERIFICATION_CODE_TTL_MS = 30 * 60_000
export const VERIFICATION_CODE_MAX_ATTEMPTS = 5
export const VERIFICATION_CODE_RESEND_COOLDOWN_MS = 60_000

export function getVerificationCodeExpiresAt(now = Date.now()): Date {
  return new Date(now + VERIFICATION_CODE_TTL_MS)
}
