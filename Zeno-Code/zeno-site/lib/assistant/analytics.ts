import { track } from '@vercel/analytics'

export type AssistantAnalyticsEvent =
  | 'ai_chat_start'
  | 'ai_archive_click'
  | 'ai_service_click'
  | 'ai_spark_click'

type AssistantAnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined
>

/**
 * Assistant analytics must remain anonymous: never pass messages, replies,
 * contact details, order numbers, or other free-form user input here.
 */
export function trackAssistantEvent(
  event: AssistantAnalyticsEvent,
  properties?: AssistantAnalyticsProperties,
) {
  if (typeof window === 'undefined') return

  try {
    track(event, properties)
  } catch {
    // Analytics must never interrupt the assistant or navigation.
  }
}
