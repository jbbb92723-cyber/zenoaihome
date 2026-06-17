'use client'

import { useState, useEffect, useCallback } from 'react'

type LogEntry = {
  id: string
  action: string
  target: string | null
  detail: unknown
  ip: string | null
  createdAt: string
}

const ACTION_LABELS: Record<string, string> = {
  create_note: '创建笔记',
  update_note: '更新笔记',
  delete_note: '删除笔记',
  update_order_status: '更新订单状态',
  grant_membership: '开通会员',
  revoke_membership: '取消会员',
  update_service_status: '更新服务状态',
  update_living_diagnosis_status: '更新居住诊断状态',
  create_redeem_code: '创建兑换码',
  batch_create_redeem_codes: '批量创建兑换码',
  create_coupon: '创建优惠券',
  confirm_payment: '确认付款',
}

export default function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/logs')
      if (res.ok) setLogs(await res.json())
    } catch { /* ignore */ } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  return (
    <div className="space-y-3">
      <button onClick={fetchLogs} disabled={loading} className="text-xs text-ink-muted border border-border px-3 py-1.5 hover:border-stone transition-colors mb-4">
        刷新
      </button>

      {loading ? (
        <p className="text-sm text-ink-muted py-8">加载中...</p>
      ) : logs.length === 0 ? (
        <p className="text-sm text-ink-muted py-8">暂无操作记录。你做的每一次管理操作都会出现在这里。</p>
      ) : (
        logs.map(log => (
          <div key={log.id} className="border border-border bg-surface px-5 py-3.5 flex items-start gap-4 text-sm">
            <span className="shrink-0 text-xs font-mono text-ink-faint mt-0.5 w-36">
              {new Date(log.createdAt).toLocaleString('zh-CN')}
            </span>
            <span className="shrink-0 text-xs font-medium text-stone bg-stone-pale px-2 py-0.5 min-w-[5rem] text-center">
              {ACTION_LABELS[log.action] ?? log.action}
            </span>
            {log.target && (
              <span className="text-xs font-mono text-ink-muted truncate max-w-[12rem]">{log.target}</span>
            )}
            <span className="text-xs text-ink-faint truncate max-w-[16rem]">
              {log.detail ? (typeof log.detail === 'string' ? log.detail : JSON.stringify(log.detail)) : ''}
            </span>
            {log.ip && (
              <span className="text-xs text-ink-faint ml-auto shrink-0">{log.ip}</span>
            )}
          </div>
        ))
      )}
    </div>
  )
}
