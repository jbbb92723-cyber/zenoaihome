/**
 * POST /api/hermes/topics/scan
 * 触发热点扫描 — 搜索外部热点 + 匹配 Obsidian 素材 → 写入选题池
 *
 * 当前为 Phase 1 简化版：返回现有选题池状态 + 手动触发的提示
 * 完整版需接入 gstack_scrape + dbs_good_question 技能
 */

import { NextResponse } from 'next/server'
import { verifyApiRequest } from '@/lib/api-auth'
import { listRecords, TABLE_IDS } from '@/lib/hermes-client'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  if (!verifyApiRequest(req)) {
    return NextResponse.json({ ok: false, error: '未授权' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const { keywords, sourceId } = body as { keywords?: string; sourceId?: string }

  // Phase 1: 先返回选题池现状 + 扫描说明
  const result = listRecords(TABLE_IDS.topics, 200)

  if (!result.ok) {
    return NextResponse.json({
      ok: false,
      error: '读取选题池失败',
      detail: result.error,
    })
  }

  const data = result.data!
  const topics = (data.data ?? []).map((row: unknown[]) => {
    const obj: Record<string, unknown> = {}
    ;(data.fields ?? []).forEach((f: string, i: number) => { obj[f] = row[i] })
    return obj
  })

  return NextResponse.json({
    ok: true,
    message: keywords
      ? `选题扫描已触发（关键词：${keywords}）。完整热度分析需接入 gstack_scrape 技能。`
      : '选题池当前状态。使用 keywords 参数可触发定向扫描。',
    existingTopics: topics.length,
    topics: topics.slice(0, 10),
    nextAction: '如需新增选题，可通过 /api/hermes/briefs 直接为现有选题创建生产单',
  })
}
