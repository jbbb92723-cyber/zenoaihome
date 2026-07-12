/**
 * lib/hermes-client.ts
 *
 * lark-cli 调用封装 — 所有 Hermes API 路由通过它访问飞书 Base
 *
 * 依赖：ops/zeno-lark/manifest.json（含 baseToken）
 *       lark-cli（全局安装的飞书 CLI）
 */

import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

// lark-cli 路径（Windows npm 全局安装位置 vs Unix）
const LARK_CLI = os.platform() === 'win32'
  ? path.join(os.homedir(), 'AppData', 'Roaming', 'npm', 'lark-cli')
  : 'lark-cli'

// ─── 类型 ────────────────────────────────────────────────

export interface LarkResult<T = unknown> {
  ok: boolean
  identity: 'bot' | 'user' | 'unknown'
  data: T
  error?: string
}

interface Manifest {
  baseToken: string
  baseUrl: string
  tables: { name: string; id: string }[]
}

// ─── 配置 ────────────────────────────────────────────────

function loadManifest(): Manifest | null {
  const manifestPath = path.resolve(
    process.cwd(),
    'ops/zeno-lark/manifest.json'
  )
  try {
    if (!fs.existsSync(manifestPath)) return null
    return JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  } catch {
    return null
  }
}

function getBaseToken(): string {
  const manifest = loadManifest()
  return manifest?.baseToken ?? process.env.FEISHU_BASE_TOKEN ?? ''
}

// ─── lark-cli 调用 ──────────────────────────────────────

function extractJson(text: string): unknown {
  const trimmed = text.trim()
  if (!trimmed) return null
  try {
    return JSON.parse(trimmed)
  } catch {
    const start = trimmed.indexOf('{')
    const end = trimmed.lastIndexOf('}')
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1))
    }
    throw new Error(`Cannot parse lark-cli output: ${trimmed.slice(0, 200)}`)
  }
}

/**
 * 调用 lark-cli（最多重试 3 次，bot 身份）
 */
export function runLark<T = unknown>(args: string[]): LarkResult<T> {
  // 如果调用者已经传了 --base-token，优先用调用者的
  const hasExplicitToken = args.includes('--base-token')
  if (!hasExplicitToken) {
    const baseToken = getBaseToken()
    if (!baseToken) {
      return { ok: false, identity: 'unknown', data: null as T, error: '飞书 Base Token 未配置' }
    }
    args = ['--base-token', baseToken, ...args]
  }

  // 确保使用 bot 身份
  const finalArgs = args.includes('--as') ? args : [...args, '--as', 'bot']

  let lastError: Error | null = null
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const result = spawnSync(`"${LARK_CLI}"`, finalArgs, {
      shell: true,
      encoding: 'utf8',
      timeout: 30_000,
    })

    const combined = [result.stdout, result.stderr].filter(Boolean).join('\n').trim()

    if (result.status === 0) {
      const data = extractJson(combined) as Record<string, unknown> | null
      if (data && data.ok !== false) {
        return {
          ok: true,
          identity: 'bot',
          data: (data.data ?? data) as T,
        }
      }
      // API 返回了 ok: false
      return {
        ok: false,
        identity: 'bot',
        data: null as T,
        error: (data as any)?.error?.message ?? (data as any)?.message ?? '未知错误',
      }
    }

    lastError = new Error(`lark-cli failed: ${combined.slice(0, 300)}`)
    if (!combined.includes('retryable') && !combined.includes('locked') && !combined.includes('ETIMEDOUT')) {
      break
    }
  }

  return {
    ok: false,
    identity: 'bot',
    data: null as T,
    error: lastError?.message ?? 'lark-cli 调用失败',
  }
}

/**
 * 读取飞书表记录列表
 */
export function listRecords(tableId: string, limit = 500): LarkResult<{
  fields: string[]
  data: unknown[][]
  record_id_list?: string[]
}> {
  const baseToken = getBaseToken()
  return runLark([
    'base', '+record-list',
    '--base-token', baseToken,
    '--table-id', tableId,
    '--limit', String(limit),
    '--format', 'json',
  ])
}

/**
 * 写入执行日志到 task_runs 表
 */
export function logTaskRun(params: {
  taskType: string
  input: string
  output: string
  status: 'success' | 'failed'
  error?: string
  skillChain?: string
  needsHuman?: string
}) {
  const baseToken = getBaseToken()
  const taskRunsTableId = 'tblNIeOvE10OF9Ml'
  const now = Date.now()

  return runLark([
    'base', '+record-create',
    '--base-token', baseToken,
    '--table-id', taskRunsTableId,
    '--json',
    `@-`,
  ])
}

// ─── 常用表 ID ──────────────────────────────────────────

export const TABLE_IDS = {
  topics:      'tblWqjt7QMwWpusg',
  materials:   'tbl5MJJZsbMc36m2',
  briefs:      'tblk8GrAQCWBXmU5',
  drafts:      'tblWRTJDAXMYoj2y',
  reviews:     'tbluesIB80mYriTs',
  approvals:   'tblNzhcnVkZfgBiF',
  publishJobs: 'tblrsViHVTajQeVn',
  metrics:     'tblsefPrNyiqFZbc',
  taskRuns:    'tblNIeOvE10OF9Ml',
  topicSources:'tblGCv7g24aKraN4',
  channels:    'tblYG8LyH7NA7Ewa',
  skills:      'tblo8HGxE8D4UTDS',
  adapters:    'tblWeAZwdIBBOXfX',
  agents:      'tblPlYiltKXTyBAH',
  commands:    'tblgNXTc99FzMop3',
} as const
