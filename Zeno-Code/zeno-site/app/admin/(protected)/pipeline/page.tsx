/**
 * app/admin/(protected)/pipeline/page.tsx
 * 内容管道 — Hermes 飞书管道操作界面
 */

import type { Metadata } from 'next'
import PipelineFunnel from '@/components/admin/PipelineFunnel'
import StatCard from '@/components/admin/StatCard'

export const metadata: Metadata = { title: '内容管道 · Admin' }
export const dynamic = 'force-dynamic'

// ─── API 调用辅助 ────────────────────────────────────────

async function fetchHermes<T>(path: string, init?: RequestInit): Promise<T> {
  // 服务端 fetch 走完整 URL
  const base = process.env.NEXT_PUBLIC_SITE_URL
    ? `https://${process.env.NEXT_PUBLIC_SITE_URL.replace(/^https?:\/\//, '')}`
    : 'http://localhost:3000'

  const url = `${base}/api/hermes/${path}`

  const res = await fetch(url, {
    headers: {
      // 传 admin cookie 用于认证
      ...(init?.headers ?? {}),
    },
    ...init,
    cache: 'no-store',
  })

  return res.json() as Promise<T>
}

// ─── 类型 ────────────────────────────────────────────────

interface PipelineData {
  ok: boolean
  error?: string
  generatedAt?: string
  funnel?: { stage: string; label: string; count: number }[]
  pendingApprovals?: number
  feishuConnected?: boolean
}

interface StatusData {
  ok: boolean
  error?: string
  generatedAt?: string
  counts?: Record<string, number>
  pendingApprovals?: number
  pipelineHealth?: string
}

// ─── 页面 ────────────────────────────────────────────────

export default async function PipelinePage() {
  let pipeline: PipelineData = { ok: false, error: '加载中...' }
  let status: StatusData = { ok: false, error: '加载中...' }

  try {
    ;[pipeline, status] = await Promise.all([
      fetchHermes<PipelineData>('pipeline'),
      fetchHermes<StatusData>('status'),
    ])
  } catch (error) {
    pipeline = { ok: false, error: `请求失败：${(error as Error).message}` }
    status = { ok: false, error: '请求失败' }
  }

  const funnel = pipeline.funnel ?? []
  const counts = status.counts ?? {}
  const feishuOk = pipeline.feishuConnected ?? false

  return (
    <div className="max-w-[1400px] space-y-5">
      {/* ── 标题栏 ────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[0.65rem] text-[#706860] uppercase tracking-widest font-semibold mb-1">
            Admin · Content Pipeline
          </p>
          <h1 className="text-xl font-semibold text-[#E8E2DA] tracking-tight">
            内容管道
          </h1>
          <p className="text-xs text-[#706860] mt-1.5">
            飞书状态：
            <span className={feishuOk ? 'text-green-400' : 'text-[#d2846f]'}>
              ● {feishuOk ? '已连接' : '离线'}
            </span>
            {pipeline.generatedAt && (
              <span className="ml-3">
                刷新：{new Date(pipeline.generatedAt).toLocaleTimeString('zh-CN')}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* ── 错误提示 ──────────────────────────── */}
      {!feishuOk && (
        <div className="border border-[#d2846f]/40 bg-[#d2846f]/5 px-5 py-3 text-sm text-[#d2846f]">
          飞书未连接。请在项目 ops/zeno-lark/ 目录下创建 manifest.json，或设置 FEISHU_BASE_TOKEN 环境变量。
        </div>
      )}

      {/* ── 管道漏斗 ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 border border-[#3A3530] bg-[#1f1d1a] p-5">
          <h2 className="text-sm font-semibold text-[#E8E2DA] mb-4">
            生产漏斗
          </h2>
          <PipelineFunnel
            funnel={funnel}
            pendingApprovals={pipeline.pendingApprovals ?? 0}
          />
        </div>

        {/* ── 操作区 ──────────────────────────── */}
        <div className="border border-[#3A3530] bg-[#1f1d1a] p-5">
          <h2 className="text-sm font-semibold text-[#E8E2DA] mb-4">
            管道操作
          </h2>
          <div className="space-y-3">
            <OperationButton
              label="扫描选题"
              desc="搜索热点 + 匹配素材 → 选题池"
              endpoint="/api/hermes/topics/scan"
              method="POST"
              disabled={!feishuOk}
            />
            <OperationButton
              label="生成 Brief"
              desc="为选题创建生产单"
              endpoint="/api/hermes/briefs"
              method="POST"
              disabled={!feishuOk}
              needTopic
            />
            <OperationButton
              label="生成初稿"
              desc="从 Brief 生成网站+公众号版"
              endpoint="/api/hermes/drafts"
              method="POST"
              disabled={!feishuOk}
              needBrief
            />
            <OperationButton
              label="质检守门"
              desc="选题-正文错位检查"
              endpoint="/api/hermes/quality-check"
              method="POST"
              disabled={!feishuOk}
            />
          </div>
          <p className="text-[0.6rem] text-[#504840] mt-4">
            Phase 1 简化版：操作按钮为功能演示。
            完整版将接入 AI 技能进行实际内容生成。
          </p>
        </div>
      </div>

      {/* ── 表数据快照 ────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { key: 'topics',    label: '选题池',   tone: 'gold' as const },
          { key: 'briefs',    label: '生产单',   tone: 'teal' as const },
          { key: 'drafts',    label: '稿件库',   tone: 'green' as const },
          { key: 'reviews',   label: '质检记录', tone: 'coral' as const },
          { key: 'approvals', label: '审批记录', tone: 'gold' as const },
          { key: 'publishJobs', label: '发布任务', tone: 'teal' as const },
          { key: 'taskRuns',  label: '执行日志', tone: 'neutral' as const },
        ].map((item) => (
          <StatCard
            key={item.key}
            label={item.label}
            value={counts[item.key] ?? '—'}
            tone={item.tone}
          />
        ))}
      </div>

      {/* ── 待审批清单 ────────────────────────── */}
      <div className="border border-[#3A3530] bg-[#1f1d1a] p-5">
        <h2 className="text-sm font-semibold text-[#E8E2DA] mb-3">
          管道健康
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex justify-between py-1.5 border-b border-[#2A2825]">
            <span className="text-[#706860]">飞书连接</span>
            <span className={feishuOk ? 'text-green-400' : 'text-[#d2846f]'}>
              {feishuOk ? '● 正常' : '● 断开'}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-[#2A2825]">
            <span className="text-[#706860]">管道状态</span>
            <span className="text-[#C4A882]">
              {status.pipelineHealth === 'active' ? '● 活跃' : '○ 空闲'}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-[#2A2825]">
            <span className="text-[#706860]">待审批</span>
            <span className={status.pendingApprovals ? 'text-[#d2846f]' : 'text-[#706860]'}>
              {status.pendingApprovals ?? 0} 条
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-[#2A2825]">
            <span className="text-[#706860]">数据刷新</span>
            <span className="text-[#706860]">
              {pipeline.generatedAt
                ? new Date(pipeline.generatedAt).toLocaleTimeString('zh-CN')
                : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── 操作按钮（客户端组件） ──────────────────────────────

import { ActionButton } from './actions'

function OperationButton({
  label,
  desc,
  endpoint,
  method,
  disabled,
  needTopic,
  needBrief,
}: {
  label: string
  desc: string
  endpoint: string
  method: 'GET' | 'POST'
  disabled: boolean
  needTopic?: boolean
  needBrief?: boolean
}) {
  return (
    <div className="border border-[#3A3530] bg-[#252320] px-4 py-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-[#E8E2DA]">{label}</span>
        <ActionButton
          endpoint={endpoint}
          method={method}
          disabled={disabled}
          needTopic={needTopic}
          needBrief={needBrief}
        />
      </div>
      <p className="text-[0.65rem] text-[#706860]">{desc}</p>
    </div>
  )
}
