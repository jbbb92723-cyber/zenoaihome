'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { requireAdminActor } from '@/lib/admin'
import {
  DELIVERABLE_STATUSES,
  OPPORTUNITY_PRIORITIES,
  OPPORTUNITY_STAGES,
  PROPOSAL_STATUSES,
} from '@/lib/domains/opportunities/constants'
import {
  createOpportunityFromRequest,
  createProposal,
  setProposalStatus,
  signAgreementAndCreateProject,
  updateDeliverableStatus,
  updateOpportunityDetails,
} from '@/lib/domains/opportunities/service'

const opportunitySchema = z.object({
  stage: z.enum(OPPORTUNITY_STAGES),
  priority: z.enum(OPPORTUNITY_PRIORITIES),
  needSummary: z.string().trim().max(5000).optional(),
  expectedAmountYuan: z.coerce.number().min(0).max(100_000_000).optional(),
  nextAction: z.string().trim().max(500).optional(),
  nextActionAt: z.string().trim().optional(),
})

const proposalSchema = z.object({
  title: z.string().trim().min(2).max(200),
  scope: z.string().trim().min(2).max(10000),
  deliverables: z.string().trim().min(2).max(10000),
  amountYuan: z.coerce.number().min(0).max(100_000_000).optional(),
  validUntil: z.string().trim().optional(),
})

function optionalDate(value?: string): Date | null {
  if (!value) return null
  const date = new Date(`${value}T12:00:00+08:00`)
  if (Number.isNaN(date.getTime())) throw new Error('日期格式无效')
  return date
}
function yuanToCents(value?: number): number | null {
  if (value === undefined || !Number.isFinite(value)) return null
  return Math.round(value * 100)
}

export async function createOpportunityFromRequestAction(requestId: string) {
  const actor = await requireAdminActor()
  const opportunity = await createOpportunityFromRequest(requestId, actor)
  revalidatePath('/admin/services')
  revalidatePath(`/admin/services/${requestId}`)
  revalidatePath('/admin/opportunities')
  redirect(`/admin/opportunities/${opportunity.id}`)
}

export async function updateOpportunityAction(opportunityId: string, formData: FormData) {
  const actor = await requireAdminActor()
  const parsed = opportunitySchema.parse({
    stage: formData.get('stage'),
    priority: formData.get('priority'),
    needSummary: formData.get('needSummary') || undefined,
    expectedAmountYuan: formData.get('expectedAmountYuan') || undefined,
    nextAction: formData.get('nextAction') || undefined,
    nextActionAt: formData.get('nextActionAt') || undefined,
  })

  await updateOpportunityDetails(
    opportunityId,
    {
      stage: parsed.stage,
      priority: parsed.priority,
      needSummary: parsed.needSummary || null,
      expectedAmount: yuanToCents(parsed.expectedAmountYuan),
      nextAction: parsed.nextAction || null,
      nextActionAt: optionalDate(parsed.nextActionAt),
    },
    actor,
  )

  revalidatePath('/admin/opportunities')
  revalidatePath(`/admin/opportunities/${opportunityId}`)
}

export async function createProposalAction(opportunityId: string, formData: FormData) {
  const actor = await requireAdminActor()
  const parsed = proposalSchema.parse({
    title: formData.get('title'),
    scope: formData.get('scope'),
    deliverables: formData.get('deliverables'),
    amountYuan: formData.get('amountYuan') || undefined,
    validUntil: formData.get('validUntil') || undefined,
  })

  const deliverables = parsed.deliverables
    .split('\n')
    .map((item) => item.trim().replace(/^[-*]\s*/, ''))
    .filter(Boolean)

  await createProposal(
    opportunityId,
    {
      title: parsed.title,
      scope: parsed.scope,
      deliverables,
      amount: yuanToCents(parsed.amountYuan),
      validUntil: optionalDate(parsed.validUntil),
    },
    actor,
  )

  revalidatePath('/admin/opportunities')
  revalidatePath(`/admin/opportunities/${opportunityId}`)
}

export async function setProposalStatusAction(
  opportunityId: string,
  proposalId: string,
  formData: FormData,
) {
  const actor = await requireAdminActor()
  const status = z.enum(PROPOSAL_STATUSES).parse(formData.get('status'))
  await setProposalStatus(proposalId, status, actor)
  revalidatePath('/admin/opportunities')
  revalidatePath(`/admin/opportunities/${opportunityId}`)
}

export async function signAgreementAction(opportunityId: string) {
  const actor = await requireAdminActor()
  const project = await signAgreementAndCreateProject(opportunityId, actor)
  revalidatePath('/admin/opportunities')
  revalidatePath(`/admin/opportunities/${opportunityId}`)
  revalidatePath('/admin/projects')
  redirect(`/admin/projects/${project.id}`)
}

export async function updateDeliverableAction(
  projectId: string,
  deliverableId: string,
  formData: FormData,
) {
  const actor = await requireAdminActor()
  const status = z.enum(DELIVERABLE_STATUSES).parse(formData.get('status'))
  const acceptanceNoteValue = formData.get('acceptanceNote')
  const acceptanceNote = typeof acceptanceNoteValue === 'string'
    ? acceptanceNoteValue.trim().slice(0, 2000) || null
    : null

  await updateDeliverableStatus(deliverableId, status, acceptanceNote, actor)
  revalidatePath(`/admin/projects/${projectId}`)
  revalidatePath(`/admin/opportunities`)
}
