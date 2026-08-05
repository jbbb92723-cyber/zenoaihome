import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyApiRequest } from '@/lib/api-auth'
import { getClientIp } from '@/lib/rateLimit'

const updateSchema = z.object({
  id: z.string().min(1).max(100),
  status: z.enum(['submitted', 'reviewing', 'completed', 'rejected']).optional(),
  aiCategory: z.enum([
    'quote_review',
    'contract_review',
    'budget',
    'construction',
    'living_diagnosis',
    'general',
  ]).optional(),
  responseText: z.string().max(10000).optional(),
}).refine(
  (value) => value.status !== undefined || value.aiCategory !== undefined || value.responseText !== undefined,
  { message: '至少提供一个更新字段' },
)

export async function POST(request: Request) {
  if (!(await verifyApiRequest(request))) {
    return NextResponse.json({ ok: false, error: '未授权' }, { status: 401 })
  }

  try {
    const body = await request.json().catch(() => null)
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: '请求参数无效' }, { status: 422 })
    }

    const { id, status, aiCategory, responseText } = parsed.data

    const data: Record<string, unknown> = {}
    if (status !== undefined) data.status = status
    if (aiCategory !== undefined) data.aiCategory = aiCategory
    if (responseText !== undefined) {
      data.responseText = responseText
      data.reviewedAt = new Date()
    }

    await prisma.$transaction([
      prisma.serviceRequest.update({ where: { id }, data }),
      prisma.adminLog.create({
        data: {
          action: 'update_service_request',
          target: id,
          detail: { status, aiCategory, responseUpdated: responseText !== undefined },
          ip: getClientIp(request),
        },
      }),
    ])
    return NextResponse.json({ ok: true, success: true })
  } catch (error) {
    console.error('Service update error:', error)
    return NextResponse.json({ ok: false, error: '更新失败' }, { status: 500 })
  }
}
