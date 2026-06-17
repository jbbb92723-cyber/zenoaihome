/**
 * app/admin/notes/page.tsx
 *
 * 判断笔记管理后台 — 创建/编辑/发布笔记
 * 独立于普通用户系统，通过 ADMIN_PASSWORD cookie 鉴权
 */

import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { isAdminUser } from '@/lib/admin'
import AdminLayout from '@/components/layout/AdminLayout'

const NotesManager = dynamic(() => import('./NotesManager'), { ssr: false })

export const metadata: Metadata = {
  title: '判断笔记管理',
  robots: { index: false, follow: false },
}

export default async function AdminNotesPage() {
  const isAdmin = await isAdminUser()

  if (!isAdmin) {
    return (
      <AdminLayout currentPath="/admin/notes">
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
    <AdminLayout currentPath="/admin/notes">
      <div className="p-8">
        <div className="mb-8">
          <p className="page-label mb-2">后台 · 判断笔记</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">判断笔记管理</h1>
          <p className="mt-2 text-sm text-ink-muted">
            创建、编辑和发布判断笔记。笔记是你最轻量的全息内容——比文章快，比朋友圈深。
          </p>
        </div>
        <NotesManager />
      </div>
    </AdminLayout>
  )
}
