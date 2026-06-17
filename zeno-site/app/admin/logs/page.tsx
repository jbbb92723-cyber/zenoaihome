/**
 * app/admin/logs/page.tsx
 *
 * 操作日志查看页 — 管理员专用
 */

import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { isAdminUser } from '@/lib/admin'
import AdminLayout from '@/components/layout/AdminLayout'

const LogViewer = dynamic(() => import('./LogViewer'), { ssr: false })

export const metadata: Metadata = {
  title: '操作日志',
  robots: { index: false, follow: false },
}

export default async function AdminLogsPage() {
  const isAdmin = await isAdminUser()

  if (!isAdmin) {
    return (
      <AdminLayout currentPath="/admin/logs">
        <div className="max-w-xl mx-auto mt-20 border border-border bg-surface p-8 text-center space-y-4">
          <p className="text-sm text-ink-muted">请先登录管理后台。</p>
          <a href="/admin/login" className="inline-block text-sm text-stone border border-stone/30 px-4 py-2 hover:bg-stone-pale/50 transition-colors">
            管理员登录
          </a>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout currentPath="/admin/logs">
      <div className="p-8">
        <div className="mb-8">
          <p className="page-label mb-2">后台 · 操作日志</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">操作日志</h1>
          <p className="mt-2 text-sm text-ink-muted">最近 100 条管理操作记录。后台做了什么事，这里全留痕。</p>
        </div>
        <LogViewer />
      </div>
    </AdminLayout>
  )
}
