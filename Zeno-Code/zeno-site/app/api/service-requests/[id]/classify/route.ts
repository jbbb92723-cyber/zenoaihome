/**
 * POST /api/service-requests/[id]/classify
 * AI 分类业主需求 → 更新 ServiceRequest.aiCategory
 */

import { NextResponse } from 'next/server'
import { verifyApiRequest } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { classify, suggestArticles } from '@/lib/classifier'

export const dynamic = 'force-dynamic'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyApiRequest(req)) {
    return NextResponse.json({ ok: false, error: '未授权' }, { status: 401 })
  }

  const { id } = await params

  const request = await prisma.serviceRequest.findUnique({ where: { id } })
  if (!request) {
    return NextResponse.json({ ok: false, error: '申请不存在' }, { status: 404 })
  }

  const result = classify(request.serviceType, request.message ?? '')

  // 更新数据库
  await prisma.serviceRequest.update({
    where: { id },
    data: { aiCategory: result.category },
  })

  return NextResponse.json({
    ok: true,
    classification: result,
    suggestedArticles: suggestArticles(result.category).map((articleId) => ({
      id: articleId,
      title: `文章 #${articleId}`,
    })),
  })
}
