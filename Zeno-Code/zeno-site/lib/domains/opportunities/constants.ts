export const OPPORTUNITY_STAGES = [
  'new',
  'qualifying',
  'scoped',
  'proposed',
  'won',
  'lost',
  'archived',
] as const

export const OPPORTUNITY_PRIORITIES = ['low', 'normal', 'high', 'urgent'] as const

export const PROPOSAL_STATUSES = ['draft', 'sent', 'accepted', 'rejected', 'expired'] as const

export const DELIVERABLE_STATUSES = [
  'pending',
  'in_progress',
  'submitted',
  'accepted',
  'rejected',
] as const

export const STAGE_LABELS: Record<(typeof OPPORTUNITY_STAGES)[number], string> = {
  new: '新商机',
  qualifying: '需求确认',
  scoped: '边界已明确',
  proposed: '方案沟通',
  won: '已成交',
  lost: '未成交',
  archived: '已归档',
}

export const PRIORITY_LABELS: Record<(typeof OPPORTUNITY_PRIORITIES)[number], string> = {
  low: '低',
  normal: '普通',
  high: '高',
  urgent: '紧急',
}

export const PROPOSAL_STATUS_LABELS: Record<(typeof PROPOSAL_STATUSES)[number], string> = {
  draft: '草稿',
  sent: '已发送',
  accepted: '已接受',
  rejected: '已拒绝',
  expired: '已过期',
}

export const DELIVERABLE_STATUS_LABELS: Record<(typeof DELIVERABLE_STATUSES)[number], string> = {
  pending: '待开始',
  in_progress: '进行中',
  submitted: '待验收',
  accepted: '已验收',
  rejected: '需返工',
}

export type OpportunityStage = (typeof OPPORTUNITY_STAGES)[number]
export type OpportunityPriority = (typeof OPPORTUNITY_PRIORITIES)[number]
export type ProposalStatus = (typeof PROPOSAL_STATUSES)[number]
export type DeliverableStatus = (typeof DELIVERABLE_STATUSES)[number]
