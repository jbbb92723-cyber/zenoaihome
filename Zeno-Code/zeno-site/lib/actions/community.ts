'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { getProductById } from '@/data/services/products'
import { isAdminUser } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import {
  COMMUNITY_APPLICATION_STATUSES,
  SPARK_COMMUNITY_CAPACITY,
  SPARK_COMMUNITY_PLAN,
  SPARK_COMMUNITY_PRODUCT_ID,
  SPARK_COMMUNITY_SERVICE_TYPE,
  type CommunityApplicationStatus,
} from '@/lib/domains/community/constants'

const RESPONSE_COPY: Record<CommunityApplicationStatus, string> = {
  submitted: '申请已经收到，正在等待初筛。',
  reviewing: '申请已进入面聊阶段，请留意微信联系。',
  completed: '申请已通过，首期成员订单已经生成。完成付款并经确认后，将自动开通成员资格。',
  rejected: '本期暂未通过。共同体采用小规模双向选择，之后项目阶段变化时可以重新申请。',
}

async function requireAdmin() {
  if (!(await isAdminUser())) throw new Error('Unauthorized')
}

function generateOrderNo() {
  const now = new Date()
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  return `SPARK-${date}-${randomUUID().slice(0, 6).toUpperCase()}`
}

export async function updateCommunityApplicationStatus(
  applicationId: string,
  status: CommunityApplicationStatus,
) {
  await requireAdmin()
  if (!COMMUNITY_APPLICATION_STATUSES.includes(status)) throw new Error('Invalid status')

  const product = getProductById(SPARK_COMMUNITY_PRODUCT_ID)
  if (!product) throw new Error('Community product is unavailable')

  await prisma.$transaction(async (tx) => {
    const application = await tx.serviceRequest.findUnique({
      where: { id: applicationId },
      select: { id: true, userId: true, serviceType: true },
    })

    if (!application || application.serviceType !== SPARK_COMMUNITY_SERVICE_TYPE) {
      throw new Error('Community application not found')
    }

    await tx.serviceRequest.update({
      where: { id: application.id },
      data: {
        status,
        responseText: RESPONSE_COPY[status],
        reviewedAt: new Date(),
      },
    })

    let orderNo: string | null = null
    const source = `community:${application.id}`

    if (status === 'completed') {
      if (!application.userId) throw new Error('Applicant account is missing')

      const approvedCount = await tx.serviceRequest.count({
        where: {
          serviceType: SPARK_COMMUNITY_SERVICE_TYPE,
          status: 'completed',
          id: { not: application.id },
        },
      })
      if (approvedCount >= SPARK_COMMUNITY_CAPACITY) {
        throw new Error('首期星火者名额已满')
      }

      const activeMembership = await tx.membership.findFirst({
        where: {
          userId: application.userId,
          plan: SPARK_COMMUNITY_PLAN,
          status: 'active',
        },
        select: { id: true },
      })

      if (!activeMembership) {
        const existingOrder = await tx.order.findFirst({
          where: {
            userId: application.userId,
            source,
            status: { notIn: ['cancelled', 'refunded'] },
          },
          orderBy: { createdAt: 'desc' },
          select: { orderNo: true },
        })

        orderNo = existingOrder?.orderNo ?? generateOrderNo()
        if (!existingOrder) {
          await tx.order.create({
            data: {
              userId: application.userId,
              orderNo,
              productName: product.name,
              productType: product.type,
              amount: product.price,
              paidAmount: product.price,
              status: 'pending',
              paymentMethod: 'wechat',
              source,
              remark: product.value,
            },
          })
        }
      }
    }

    if (status === 'rejected') {
      await tx.order.updateMany({
        where: { source, status: { in: ['pending', 'pending_confirmation'] } },
        data: { status: 'cancelled' },
      })
    }

    await tx.adminLog.create({
      data: {
        action: 'update_community_application',
        target: application.id,
        detail: { status, orderNo },
      },
    })
  })

  revalidatePath('/admin/community')
  revalidatePath('/admin/services')
  revalidatePath('/admin/orders')
  revalidatePath('/community/apply')
  revalidatePath('/account')
}
