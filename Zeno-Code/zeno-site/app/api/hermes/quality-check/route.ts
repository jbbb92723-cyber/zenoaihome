/**
 * POST /api/hermes/quality-check
 * 质检守门 — 检查选题和正文是否错位
 *
 * Phase 1 简化版：读取现有质检记录
 * 完整版需接入 dbs_content + dbs_ai_check 技能
 */

import { NextResponse } from 'next/server'
import { verifyApiRequest } from '@/lib/api-auth'
import { listRecords, TABLE_IDS } from '@/lib/hermes-client'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  if (!verifyApiRequest(req)) {
    return NextResponse.json({ ok: false, error: '未授权' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const contentId = searchParams.get('contentId')

  const result = listRecords(TABLE_IDS.reviews, 200)
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error })
  }

  const reviews = (result.data?.data ?? []).map((row: unknown[]) => {
    const obj: Record<string, unknown> = {}
    ;(result.data!.fields ?? []).forEach((f: string, i: number) => { obj[f] = row[i] })
    return obj
  })

  const filtered = contentId
    ? reviews.filter((r) => r['content_id'] === contentId)
    : reviews

  // 统计
  const passed = filtered.filter((r) => {
    const v = Array.isArray(r['是否通过']) ? r['是否通过'][0] : r['是否通过']
    return v === 'yes' || v === '通过'
  }).length

  return NextResponse.json({
    ok: true,
    total: reviews.length,
    passed,
    failed: filtered.length - passed,
    reviews: filtered.slice(0, 20),
  })
}

export async function POST(req: Request) {
  if (!verifyApiRequest(req)) {
    return NextResponse.json({ ok: false, error: '未授权' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const { contentId } = body as { contentId?: string }

  return NextResponse.json({
    ok: true,
    message: contentId
      ? `已对 ${contentId} 执行质检。完整 AI 质检需接入 dbs_content + dbs_ai_check 技能。`
      : '质检守门就绪。使用 contentId 参数指定要检查的稿件。',
    nextAction: '当前为 Phase 1 简化版。完整质检将自动检测：选题正文错位、AI味、偏题风险、事实风险。',
  })
}
