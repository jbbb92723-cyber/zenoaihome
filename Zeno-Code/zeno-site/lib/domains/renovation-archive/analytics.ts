import { track } from '@vercel/analytics'

export type RenovationArchiveAnalyticsEvent =
  | 'renovation_archive_create'
  | 'renovation_archive_upload_complete'
  | 'renovation_archive_version_confirm'
  | 'renovation_archive_compare_view'
  | 'renovation_archive_review_click'

type AnonymousProperties = Record<
  string,
  string | number | boolean | null | undefined
>

/** Never include file names, archive titles, IDs, quote rows, or contact data. */
export function trackRenovationArchiveEvent(
  event: RenovationArchiveAnalyticsEvent,
  properties?: AnonymousProperties,
) {
  if (typeof window === 'undefined') return

  try {
    track(event, properties)
  } catch {
    // Analytics must never interrupt archive work.
  }
}
