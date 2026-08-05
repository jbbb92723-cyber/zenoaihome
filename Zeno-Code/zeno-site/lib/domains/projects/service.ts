import { prisma } from '@/lib/prisma'
import type { AdminActor } from '@/lib/admin'

const CONSTRUCTION_NODES = [
  '水电验收',
  '防水验收',
  '木工验收',
  '贴砖验收',
  '油漆验收',
  '安装验收',
  '竣工验收',
]

export type ManualProjectInput = {
  name: string
  clientName: string | null
  clientPhone: string | null
  clientWechat: string | null
  city: string | null
  address: string | null
  area: number | null
  budget: number | null
  homeType: string | null
  style: string | null
  source: string | null
  startedAt: Date | null
}

export async function createManualConstructionProject(
  input: ManualProjectInput,
  actor: AdminActor,
) {
  return prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        ...input,
        projectType: 'renovation',
        nodes: {
          create: CONSTRUCTION_NODES.map((name, index) => ({
            name,
            sortOrder: index + 1,
          })),
        },
        activities: {
          create: {
            type: 'project_created',
            content: '管理员手动创建施工项目',
          },
        },
      },
    })

    await tx.adminLog.create({
      data: {
        action: 'create_manual_project',
        target: project.id,
        detail: { projectType: project.projectType, name: project.name },
        actorId: actor.id,
        actorEmail: actor.email,
      },
    })

    return project
  })
}
