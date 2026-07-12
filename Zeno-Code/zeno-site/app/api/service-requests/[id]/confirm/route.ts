/**
 * POST /api/service-requests/[id]/confirm
 * Zeno 确认回复文本 → 更新状态为 completed
 */

import { NextResponse } from 'next/server'
import { verifyApiRequest } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyApiRequest(req)) {
    return NextResponse.json({ ok: false, error: '未授权' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const { responseText, saveToKnowledge } = body as { responseText?: string; saveToKnowledge?: boolean }

  if (!responseText) {
    return NextResponse.json({ ok: false, error: '缺少回复文本' }, { status: 422 })
  }

  const request = await prisma.serviceRequest.findUnique({ where: { id } })
  if (!request) {
    return NextResponse.json({ ok: false, error: '申请不存在' }, { status: 404 })
  }

  const updated = await prisma.serviceRequest.update({
    where: { id },
    data: {
      responseText,
      status: 'completed',
      reviewedAt: new Date(),
      savedToKnowledge: saveToKnowledge ?? false,
    },
  })

  // 如果选择存入知识库，写入 AdminLog
  if (saveToKnowledge) {
    await prisma.adminLog.create({
      data: {
        action: 'save_service_reply_to_knowledge',
        target: id,
        detail: {
          category: request.aiCategory,
          serviceType: request.serviceType,
          name: request.name,
          responseLength: responseText.length,
        },
      },
    })
  }

  return NextResponse.json({
    ok: true,
    id: updated.id,
    status: updated.status,
    reviewedAt: updated.reviewedAt?.toISOString(),
    savedToKnowledge: updated.savedToKnowledge,
  })
}
