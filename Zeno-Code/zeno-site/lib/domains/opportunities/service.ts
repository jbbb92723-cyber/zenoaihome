import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import type { AdminActor } from '@/lib/admin'
import type {
  DeliverableStatus,
  OpportunityPriority,
  OpportunityStage,
  ProposalStatus,
} from './constants'

type OpportunityDetails = {
  stage: OpportunityStage
  priority: OpportunityPriority
  needSummary: string | null
  expectedAmount: number | null
  nextAction: string | null
  nextActionAt: Date | null
}

type ProposalInput = {
  title: string
  scope: string
  deliverables: string[]
  amount: number | null
  validUntil: Date | null
}

function auditActor(actor: AdminActor) {
  return {
    actorId: actor.id,
    actorEmail: actor.email,
  }
}

function projectTemplate(serviceType: string) {
  const normalized = serviceType.toLowerCase()

  if (normalized.includes('website')) {
    return {
      projectType: 'website',
      nodes: ['需求与边界', '信息架构', '视觉与原型', '开发与联调', '上线与交接'],
    }
  }

  if (normalized.includes('knowledge')) {
    return {
      projectType: 'knowledge',
      nodes: ['资料审计', '结构设计', '内容整理', '检索验证', '交接与维护'],
    }
  }

  if (
    normalized.includes('ai') ||
    normalized.includes('agent') ||
    normalized.includes('workflow') ||
    normalized.includes('training')
  ) {
    return {
      projectType: 'ai',
      nodes: ['需求与样本', '方案确认', '原型验证', '实施交付', '验收与交接'],
    }
  }

  if (
    normalized.includes('quote') ||
    normalized.includes('living') ||
    normalized.includes('budget') ||
    normalized.includes('装修')
  ) {
    return {
      projectType: 'renovation',
      nodes: ['材料接收', '初步判断', '人工复核', '报告交付', '沟通确认'],
    }
  }

  return {
    projectType: 'service',
    nodes: ['需求确认', '材料接收', '方案确认', '执行交付', '验收复盘'],
  }
}

function parseDeliverables(value: Prisma.JsonValue): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

export async function createOpportunityFromRequest(requestId: string, actor: AdminActor) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.opportunity.findUnique({ where: { serviceRequestId: requestId } })
    if (existing) return existing

    const request = await tx.serviceRequest.findUnique({ where: { id: requestId } })
    if (!request) throw new Error('服务申请不存在')

    const customerName = request.name?.trim() || request.email?.trim() || '未命名客户'
    const opportunity = await tx.opportunity.create({
      data: {
        serviceRequestId: request.id,
        customerUserId: request.userId,
        title: `${customerName} · ${request.serviceType}`,
        customerName: request.name,
        contactPhone: request.phone,
        contactWechat: request.wechat,
        contactEmail: request.email,
        serviceType: request.serviceType,
        source: 'website-service-request',
        needSummary: request.message,
        nextAction: '确认客户问题、材料和交付边界',
        activities: {
          create: {
            type: 'opportunity_created',
            content: '由服务申请转为商机',
            metadata: { serviceRequestId: request.id },
          },
        },
      },
    })

    await tx.serviceRequest.update({
      where: { id: request.id },
      data: { status: request.status === 'submitted' ? 'reviewing' : request.status },
    })

    await tx.adminLog.create({
      data: {
        action: 'create_opportunity_from_service_request',
        target: opportunity.id,
        detail: { serviceRequestId: request.id, serviceType: request.serviceType },
        ...auditActor(actor),
      },
    })

    return opportunity
  })
}

export async function updateOpportunityDetails(
  opportunityId: string,
  input: OpportunityDetails,
  actor: AdminActor,
) {
  return prisma.$transaction(async (tx) => {
    const current = await tx.opportunity.findUnique({ where: { id: opportunityId } })
    if (!current) throw new Error('商机不存在')

    const updated = await tx.opportunity.update({
      where: { id: opportunityId },
      data: {
        ...input,
        closedAt: ['won', 'lost'].includes(input.stage)
          ? current.closedAt ?? new Date()
          : null,
      },
    })

    await tx.businessActivity.create({
      data: {
        opportunityId,
        type: 'opportunity_updated',
        content: `商机状态更新为 ${input.stage}`,
        metadata: {
          previousStage: current.stage,
          stage: input.stage,
          priority: input.priority,
        },
      },
    })

    await tx.adminLog.create({
      data: {
        action: 'update_opportunity',
        target: opportunityId,
        detail: { previousStage: current.stage, stage: input.stage },
        ...auditActor(actor),
      },
    })

    return updated
  })
}

export async function createProposal(
  opportunityId: string,
  input: ProposalInput,
  actor: AdminActor,
) {
  return prisma.$transaction(async (tx) => {
    const opportunity = await tx.opportunity.findUnique({ where: { id: opportunityId } })
    if (!opportunity) throw new Error('商机不存在')

    const latest = await tx.proposal.findFirst({
      where: { opportunityId },
      orderBy: { version: 'desc' },
      select: { version: true },
    })

    const proposal = await tx.proposal.create({
      data: {
        opportunityId,
        version: (latest?.version ?? 0) + 1,
        title: input.title,
        scope: input.scope,
        deliverables: input.deliverables,
        amount: input.amount,
        validUntil: input.validUntil,
      },
    })

    await tx.opportunity.update({
      where: { id: opportunityId },
      data: { stage: 'proposed' },
    })

    await tx.businessActivity.create({
      data: {
        opportunityId,
        type: 'proposal_created',
        content: `创建方案 v${proposal.version}：${proposal.title}`,
        metadata: { proposalId: proposal.id, amount: proposal.amount },
      },
    })

    await tx.adminLog.create({
      data: {
        action: 'create_proposal',
        target: proposal.id,
        detail: { opportunityId, version: proposal.version, amount: proposal.amount },
        ...auditActor(actor),
      },
    })

    return proposal
  })
}

export async function setProposalStatus(
  proposalId: string,
  status: ProposalStatus,
  actor: AdminActor,
) {
  return prisma.$transaction(async (tx) => {
    const current = await tx.proposal.findUnique({
      where: { id: proposalId },
      include: { opportunity: true },
    })
    if (!current) throw new Error('方案不存在')

    const now = new Date()
    const proposal = await tx.proposal.update({
      where: { id: proposalId },
      data: {
        status,
        sentAt: status === 'sent' ? current.sentAt ?? now : current.sentAt,
        acceptedAt: status === 'accepted' ? current.acceptedAt ?? now : current.acceptedAt,
      },
    })

    if (status === 'accepted') {
      await tx.agreement.upsert({
        where: { opportunityId: current.opportunityId },
        create: {
          opportunityId: current.opportunityId,
          proposalId: current.id,
          title: `${current.title} · 合作协议`,
          amount: current.amount,
          scope: current.scope,
          terms: { deliverables: parseDeliverables(current.deliverables) },
        },
        update: {
          proposalId: current.id,
          title: `${current.title} · 合作协议`,
          amount: current.amount,
          scope: current.scope,
          terms: { deliverables: parseDeliverables(current.deliverables) },
          status: 'draft',
          signedAt: null,
        },
      })
    }

    await tx.businessActivity.create({
      data: {
        opportunityId: current.opportunityId,
        type: 'proposal_status_changed',
        content: `方案 v${current.version} 状态更新为 ${status}`,
        metadata: { proposalId, previousStatus: current.status, status },
      },
    })

    await tx.adminLog.create({
      data: {
        action: 'update_proposal_status',
        target: proposalId,
        detail: { opportunityId: current.opportunityId, previousStatus: current.status, status },
        ...auditActor(actor),
      },
    })

    return proposal
  })
}

export async function signAgreementAndCreateProject(opportunityId: string, actor: AdminActor) {
  return prisma.$transaction(async (tx) => {
    const opportunity = await tx.opportunity.findUnique({
      where: { id: opportunityId },
      include: {
        agreement: { include: { proposal: true } },
        project: true,
      },
    })
    if (!opportunity) throw new Error('商机不存在')
    if (!opportunity.agreement?.proposal) throw new Error('请先接受一个方案并生成协议')
    if (opportunity.project) return opportunity.project

    const now = new Date()
    const template = projectTemplate(opportunity.serviceType)
    const deliverables = parseDeliverables(opportunity.agreement.proposal.deliverables)

    const project = await tx.project.create({
      data: {
        opportunityId,
        projectType: template.projectType,
        name: opportunity.title,
        clientName: opportunity.customerName,
        clientPhone: opportunity.contactPhone,
        clientWechat: opportunity.contactWechat,
        source: opportunity.source,
        startedAt: now,
        nodes: {
          create: template.nodes.map((name, index) => ({ name, sortOrder: index + 1 })),
        },
        deliverables: {
          create: deliverables.map((title, index) => ({ title, sortOrder: index + 1 })),
        },
        activities: {
          create: {
            type: 'project_created',
            content: '协议签署后自动创建交付项目',
            metadata: { opportunityId, agreementId: opportunity.agreement.id },
          },
        },
      },
    })

    await tx.agreement.update({
      where: { id: opportunity.agreement.id },
      data: { status: 'signed', signedAt: opportunity.agreement.signedAt ?? now },
    })

    await tx.opportunity.update({
      where: { id: opportunityId },
      data: { stage: 'won', closedAt: opportunity.closedAt ?? now },
    })

    await tx.businessActivity.create({
      data: {
        opportunityId,
        projectId: project.id,
        type: 'agreement_signed',
        content: '协议已签署，商机转为交付项目',
        metadata: { agreementId: opportunity.agreement.id },
      },
    })

    await tx.adminLog.create({
      data: {
        action: 'sign_agreement_and_create_project',
        target: project.id,
        detail: { opportunityId, agreementId: opportunity.agreement.id },
        ...auditActor(actor),
      },
    })

    return project
  })
}

export async function updateDeliverableStatus(
  deliverableId: string,
  status: DeliverableStatus,
  acceptanceNote: string | null,
  actor: AdminActor,
) {
  return prisma.$transaction(async (tx) => {
    const current = await tx.projectDeliverable.findUnique({ where: { id: deliverableId } })
    if (!current) throw new Error('交付物不存在')

    const now = new Date()
    const deliverable = await tx.projectDeliverable.update({
      where: { id: deliverableId },
      data: {
        status,
        acceptanceNote,
        submittedAt: status === 'submitted' ? current.submittedAt ?? now : current.submittedAt,
        acceptedAt: status === 'accepted' ? current.acceptedAt ?? now : null,
      },
    })

    await tx.businessActivity.create({
      data: {
        projectId: current.projectId,
        type: 'deliverable_status_changed',
        content: `交付物“${current.title}”状态更新为 ${status}`,
        metadata: { deliverableId, previousStatus: current.status, status },
      },
    })

    await tx.adminLog.create({
      data: {
        action: 'update_deliverable_status',
        target: deliverableId,
        detail: { projectId: current.projectId, previousStatus: current.status, status },
        ...auditActor(actor),
      },
    })

    return deliverable
  })
}
