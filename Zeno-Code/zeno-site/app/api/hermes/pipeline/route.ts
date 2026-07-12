/**
 * GET /api/hermes/pipeline
 * 管道漏斗数据 — 选题→Brief→初稿→质检→审批 各阶段数量
 * 用于 Zeno OS 管道页面顶部漏斗图
 */

import { NextResponse } from 'next/server'
import { verifyApiRequest } from '@/lib/api-auth'
import { runLark } from '@/lib/hermes-client'
import fs from 'node:fs'
import path from 'node:path'

export const dynamic = 'force-dynamic'

function getBaseToken(): string {
  try {
    const manifestPath = path.resolve(process.cwd(), 'ops/zeno-lark/manifest.json')
    if (fs.existsSync(manifestPath)) {
      return JSON.parse(fs.readFileSync(manifestPath, 'utf8')).baseToken
    }
  } catch {}
  return process.env.FEISHU_BASE_TOKEN ?? ''
}

async function countTable(tableId: string): Promise<number> {
  const result = runLark<{ data: unknown[][] }>([
    'base', '+record-list',
    '--base-token', getBaseToken(),
    '--table-id', tableId,
    '--limit', '1',
    '--format', 'json',
  ])
  if (result.ok && result.data) {
    return (result.data as any).data?.length ?? (result.data as any).total ?? 0
  }
  return -1
}

export async function GET(req: Request) {
  if (!verifyApiRequest(req)) {
    return NextResponse.json({ ok: false, error: '未授权' }, { status: 401 })
  }

  const baseToken = getBaseToken()
  if (!baseToken) {
    return NextResponse.json({ ok: false, error: '飞书未连接' })
  }

  // 批量查询各表记录数
  const tables = {
    topics:    'tblWqjt7QMwWpusg',
    briefs:    'tblk8GrAQCWBXmU5',
    drafts:    'tblWRTJDAXMYoj2y',
    reviews:   'tbluesIB80mYriTs',
    approvals: 'tblNzhcnVkZfgBiF',
  }

  const funnel: { stage: string; label: string; count: number }[] = []
  let prevCount = 0

  for (const [stage, tableId] of Object.entries(tables)) {
    // 用 count 更高效
    const result = runLark<{ fields: string[]; data: unknown[][] }>([
      'base', '+record-list',
      '--base-token', baseToken,
      '--table-id', tableId,
      '--limit', '500',
      '--format', 'json',
    ])

    const count = result.ok && result.data ? (result.data.data?.length ?? 0) : 0
    const labels: Record<string, string> = {
      topics: '选题池', briefs: '生产单', drafts: '稿件库',
      reviews: '质检记录', approvals: '审批记录',
    }

    funnel.push({
      stage,
      label: labels[stage] ?? stage,
      count,
    })
    prevCount = count
  }

  // 读取待审批数量
  const approvalResult = runLark<{ fields: string[]; data: unknown[][] }>([
    'base', '+record-list',
    '--base-token', baseToken,
    '--table-id', 'tblNzhcnVkZfgBiF',
    '--limit', '500',
    '--format', 'json',
  ])

  let pendingApprovals = 0
  if (approvalResult.ok && approvalResult.data) {
    const { fields, data } = approvalResult.data
    const approvalIdx = fields.indexOf('审批结果')
    if (approvalIdx >= 0) {
      pendingApprovals = data.filter((row) => {
        const v = Array.isArray(row[approvalIdx]) ? row[approvalIdx][0] : row[approvalIdx]
        return v === 'pending'
      }).length
    }
  }

  return NextResponse.json({
    ok: true,
    generatedAt: new Date().toISOString(),
    funnel,
    pendingApprovals,
    feishuConnected: true,
  })
}
