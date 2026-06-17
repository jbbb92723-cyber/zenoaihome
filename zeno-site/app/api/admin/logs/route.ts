/**
 * GET /api/admin/logs
 *
 * 返回最近 100 条管理操作日志（管理员专用）
 */

import { NextResponse } from 'next/server'
import { isAdminUser } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isAdminUser())) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  const logs = await prisma.adminLog.findMany({
    select: {
      id: true,
      action: true,
      target: true,
      detail: true,
      ip: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return NextResponse.json(logs)
}
