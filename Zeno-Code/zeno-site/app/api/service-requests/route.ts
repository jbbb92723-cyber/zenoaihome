import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { SPARK_COMMUNITY_SERVICE_TYPE } from '@/lib/domains/community/constants'

const ServiceRequestSchema = z.object({
  serviceType: z.string().min(1).max(100),
  name:        z.string().min(1).max(50),
  phone:       z.string().max(20).optional().or(z.literal('')),
  wechat:      z.string().max(50).optional().or(z.literal('')),
  email:       z.string().email().optional().or(z.literal('')),
  message:     z.string().max(1000).optional().or(z.literal('')),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '请求格式错误' }, { status: 400 })
  }

  const parsed = ServiceRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: '参数校验失败', detail: parsed.error.flatten() }, { status: 422 })
  }

  const { serviceType, name, phone, wechat, email, message } = parsed.data

  if (serviceType === SPARK_COMMUNITY_SERVICE_TYPE) {
    const existing = await prisma.serviceRequest.findFirst({
      where: {
        userId: session.user.id,
        serviceType: SPARK_COMMUNITY_SERVICE_TYPE,
        status: { in: ['submitted', 'reviewing', 'completed'] },
      },
      orderBy: { createdAt: 'desc' },
      select: { id: true, status: true },
    })

    if (existing) {
      return NextResponse.json(
        { error: '你已有正在处理的星火者申请', serviceRequest: existing },
        { status: 409 },
      )
    }
  }

  const serviceRequest = await prisma.serviceRequest.create({
    data: {
      userId:      session.user.id,
      serviceType,
      name,
      phone:   phone   || null,
      wechat:  wechat  || null,
      email:   email   || null,
      message: message || null,
      status:  'submitted',
    },
  })

  return NextResponse.json({ ok: true, serviceRequest }, { status: 201 })
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 })
  }

  const requests = await prisma.serviceRequest.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ requests })
}
