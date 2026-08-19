export function isRenovationArchiveEnabled(): boolean {
  return process.env.RENOVATION_ARCHIVE_ENABLED?.trim().toLowerCase() === 'true'
}

export const RENOVATION_ARCHIVE_DISABLED_BODY = {
  error: '装修档案尚未开放',
  code: 'FEATURE_DISABLED',
} as const
