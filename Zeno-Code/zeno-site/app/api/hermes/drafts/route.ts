/**
 * POST /api/hermes/drafts
 * 从 Brief 生成初稿 — 网站版 + 公众号版
 *
 * Phase 1 简化版：创建占位草稿，标记为待 AI 生成
 * 完整版需接入 dbs_content 技能进行 AI 写作
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

  const { searchParams } = new URL(req.url)
  const briefId = searchParams.get('briefId')
  const platform = searchParams.get('platform')

  const result = listRecords(TABLE_IDS.drafts, 200)
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error })
  }

  const drafts = (result.data?.data ?? []).map((row: unknown[]) => {
    const obj: Record<string, unknown> = {}
    ;(result.data!.fields ?? []).forEach((f: string, i: number) => { obj[f] = row[i] })
    return obj
  })

  let filtered = drafts
  if (briefId) filtered = filtered.filter((d) => d['brief_id'] === briefId)
  if (platform) filtered = filtered.filter((d) => d['平台'] === platform)

  return NextResponse.json({
    ok: true,
    total: drafts.length,
    drafts: filtered.slice(0, 20),
  })
}

export async function POST(req: Request) {
  if (!verifyApiRequest(req)) {
    return NextResponse.json({ ok: false, error: '未授权' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const { briefId, topicTitle } = body as { briefId?: string; topicTitle?: string }

  if (!briefId) {
    return NextResponse.json({ ok: false, error: '缺少 briefId' }, { status: 422 })
  }

  const baseToken = getBaseToken()
  if (!baseToken) {
    return NextResponse.json({ ok: false, error: '飞书未连接' })
  }

  const now = Date.now()
  const suffix = String(briefId).replace(/^brief_/, '')
  const title = topicTitle ?? briefId

  // 创建网站版 + 公众号版两篇草稿
  const contentIds = [
    `content_${suffix}_web`,
    `content_${suffix}_wechat`,
  ]

  const tmpFile = path.join(process.cwd(), '.tmp-draft-create.json')

  fs.writeFileSync(tmpFile, JSON.stringify({
    fields: ['content_id', 'brief_id', '标题', '版本号', '当前状态', '负责人', '更新时间', '平台', '正文', '质检摘要', 'skill_chain', '人工确认'],
    rows: [
      [
        contentIds[0], briefId, title, 1, 'draft', 'Zeno', now,
        'website', '（待 AI 生成网站版初稿）', '', 'hermes_api', '必须',
      ],
      [
        contentIds[1], briefId, title, 1, 'draft', 'Zeno', now,
        'wechat_oa', '（待 AI 生成公众号版初稿）', '', 'hermes_api', '必须',
      ],
    ],
  }), 'utf8')

  const result = runLark([
    'base', '+record-batch-create',
    '--base-token', baseToken,
    '--table-id', TABLE_IDS.drafts,
    '--json', `@${tmpFile}`,
  ])

  try { fs.unlinkSync(tmpFile) } catch {}

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error })
  }

  return NextResponse.json({
    ok: true,
    briefId,
    contentIds,
    status: 'drafted',
    nextAction: '初稿已创建，需运行 /api/hermes/quality-check 进行质检',
  })
}
