/**
 * POST /api/service-requests/[id]/match-template
 * 根据 AI 分类匹配最佳回复模板 + 填充业主信息
 */

import { NextResponse } from 'next/server'
import { verifyApiRequest } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { matchTemplate, getTemplatesByCategory } from '@/lib/template-matcher'

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

  const category = request.aiCategory ?? 'general'
  const result = matchTemplate(category, {
    name: request.name ?? undefined,
    phone: request.phone ?? undefined,
    wechat: request.wechat ?? undefined,
    message: request.message ?? undefined,
    serviceType: request.serviceType,
  })

  // 同时返回同分类下所有可选模板
  const alternatives = getTemplatesByCategory(category)

  return NextResponse.json({
    ok: true,
    matched: result.template
      ? { id: result.template.id, title: result.template.title, scenario: result.template.scenario }
      : null,
    filledContent: result.filledContent,
    alternatives: alternatives.map((t) => ({ id: t.id, title: t.title, scenario: t.scenario })),
  })
}
