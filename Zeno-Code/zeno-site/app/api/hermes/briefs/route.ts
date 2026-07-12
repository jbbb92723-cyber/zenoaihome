/**
 * POST /api/hermes/briefs
 * 为指定选题创建生产单（Brief）
 *
 * Phase 1 简化版：直接在飞书 briefs_生产单 表中创建记录
 */

import { NextResponse } from 'next/server'
import { verifyApiRequest } from '@/lib/api-auth'
import { runLark, listRecords, TABLE_IDS } from '@/lib/hermes-client'
import fs from 'node:fs'
import path from 'node:path'

export const dynamic = 'force-dynamic'

function getBaseToken(): string {
  try {
    const manifestPath = path.join(process.cwd(), 'ops/zeno-lark/manifest.json')
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
    return NextResponse.json({ ok: false, error: '飞书未连接' })
  }

  const { searchParams } = new URL(req.url)
  const topicId = searchParams.get('topicId')

  const result = listRecords(TABLE_IDS.briefs, 200)
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error })
  }

  const briefs = (result.data?.data ?? []).map((row: unknown[]) => {
    const obj: Record<string, unknown> = {}
    ;(result.data!.fields ?? []).forEach((f: string, i: number) => { obj[f] = row[i] })
    return obj
  })

  const filtered = topicId ? briefs.filter((b) => b['topic_id'] === topicId) : briefs

  return NextResponse.json({
    ok: true,
    total: briefs.length,
    briefs: filtered.slice(0, 20),
  })
}

export async function POST(req: Request) {
  if (!verifyApiRequest(req)) {
    return NextResponse.json({ ok: false, error: '未授权' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const { topicId, coreJudgment, targetReader, readerProblem, outputs } = body as {
    topicId?: string
    coreJudgment?: string
    targetReader?: string
    readerProblem?: string
    outputs?: string
  }

  if (!topicId) {
    return NextResponse.json({ ok: false, error: '缺少 topicId' }, { status: 422 })
  }

  const baseToken = getBaseToken()
  if (!baseToken) {
    return NextResponse.json({ ok: false, error: '飞书未连接' })
  }

  const now = Date.now()
  const briefId = `brief_${Date.now()}`

  // 创建 Brief 记录
  const createResult = runLark([
    'base', '+record-create',
    '--base-token', baseToken,
    '--table-id', TABLE_IDS.briefs,
    '--json', `@-`,
  ])

  // lark-cli 的 @- 从 stdin 读取，改用动态 JSON 文件
  const tmpFile = path.join(process.cwd(), '.tmp-brief-create.json')
  fs.writeFileSync(tmpFile, JSON.stringify({
    fields: ['brief_id', 'topic_id', '目标读者', '用户问题', '核心判断', '输出渠道', '状态', '创建时间'],
    rows: [[
      briefId,
      topicId,
      targetReader ?? '准备签装修合同的业主',
      readerProblem ?? '',
      coreJudgment ?? '待补充核心判断',
      outputs ?? 'website_draft,wechat_draft',
      'briefed',
      now,
    ]],
  }), 'utf8')

  const result = runLark([
    'base', '+record-batch-create',
    '--base-token', baseToken,
    '--table-id', TABLE_IDS.briefs,
    '--json', `@${tmpFile}`,
  ])

  try { fs.unlinkSync(tmpFile) } catch {}

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error })
  }

  return NextResponse.json({
    ok: true,
    briefId,
    topicId,
    status: 'briefed',
    nextAction: '可调用 POST /api/hermes/drafts 生成初稿',
  })
}
