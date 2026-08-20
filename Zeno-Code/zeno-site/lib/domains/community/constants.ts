export const SPARK_COMMUNITY_SERVICE_TYPE = 'spark-community'
export const SPARK_COMMUNITY_PLAN = 'spark'
export const SPARK_COMMUNITY_PRODUCT_ID = 'spark-community-90d'
export const SPARK_COMMUNITY_DURATION_DAYS = 90
export const SPARK_COMMUNITY_PRICE = 149_900
export const SPARK_COMMUNITY_CAPACITY = 10

export const COMMUNITY_APPLICATION_STATUSES = [
  'submitted',
  'reviewing',
  'completed',
  'rejected',
] as const

export type CommunityApplicationStatus = typeof COMMUNITY_APPLICATION_STATUSES[number]
