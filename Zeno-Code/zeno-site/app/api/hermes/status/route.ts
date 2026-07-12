/**
 * GET /api/hermes/status
 * 飞书内容中台全部核心表数据快照
 */

import { NextResponse } from 'next/server'
import { verifyApiRequest } from '@/lib/api-auth'
import { runLark } from '@/lib/hermes-client'
import fs from 'node:fs'
import path from 'node:path'

export const dynamic = 'force-dynamic'

const CORE_TABLES: Record<string, string> = {
  topics:    'tblWqjt7QMwWpusg',
  briefs:    'tblk8GrAQCWBXmU5',
  drafts:    'tblWRTJDAXMYoj2y',
  reviews:   'tbluesIB80mYriTs',
  approvals: 'tblNzhcnVkZfgBiF',
  publishJobs:'tblrsViHVTajQeVn',
  taskRuns:  'tblNIeOvE10OF9Ml',
}

function getBaseToken(): string {
  try {
    const manifestPath = path.resolve(process.cwd(), 'ops/zeno-lark/manifest.json')
    if (fs.existsSync(manifestPath)) {
      return JSON.parse(fs.readFileSync(manifestPath, 'utf8')).baseToken
    }
  } catch {}
  return process.env.FEISHU_BASE_TOKEN ?? ''
}

export async function GET(req: Request) {
  if (!verifyApiRequest(req)) {
    return NextResponse.json({ ok: false, error: '未授权' }, { status: 401 })
  }

  const baseToken = getBaseToken()
  if (!baseToken) {
    return NextResponse.json({ ok: false, error: '飞书未连接：缺少 manifest.json' })
  }

  const counts: Record<string, number> = {}

  for (const [key, tableId] of Object.entries(CORE_TABLES)) {
    const result = runLark<{ fields: string[]; data: unknown[][] }>([
      'base', '+record-list',
      '--base-token', baseToken,
      '--table-id', tableId,
      '--limit', '500',
      '--format', 'json',
    ])
    counts[key] = result.ok && result.data ? (result.data.data ?? []).length : -1
  }

  return NextResponse.json({
    ok: true,
    generatedAt: new Date().toISOString(),
    counts,
    pipelineHealth: counts.topics > 0 ? 'active' : 'idle',
  })
}
