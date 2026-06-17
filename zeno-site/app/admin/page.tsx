import type { Metadata } from 'next'
import { isAdminUser } from '@/lib/admin'
import Link from 'next/link'
import AdminLayout from '@/components/layout/AdminLayout'

export const metadata: Metadata = {
  title: '管理后台',
  robots: { index: false, follow: false },
}

const adminCards = [
  { label: '判断笔记', desc: '写笔记、发笔记、管笔记——你最常用的入口', href: '/admin/notes' },
  { label: '操作日志', desc: '谁在什么时候做了什么，全留痕', href: '/admin/logs' },
  { label: '内容草稿', desc: '从飞书推送过来的内容草稿', href: '/admin/content' },
  { label: '公众号工作台', desc: '公众号发布工具', href: '/tools/publish' },
]

export default async function AdminPage() {
  const isAdmin = await isAdminUser()

  if (!isAdmin) {
    return (
      <AdminLayout currentPath="/admin">
        <div className="max-w-xl mx-auto mt-20 border border-border bg-surface p-8 text-center space-y-4">
          <p className="text-sm text-ink-muted">请先登录管理后台。</p>
          <Link href="/admin/login" className="inline-block text-sm text-stone border border-stone/30 px-4 py-2 hover:bg-stone-pale/50 transition-colors">
            管理员登录
          </Link>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout currentPath="/admin">
      <div className="p-8">
        <div className="mb-8">
          <p className="page-label mb-2">后台</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">管理后台</h1>
          <p className="mt-2 text-sm text-ink-muted">你好，管理员。以下功能仅供内部使用。</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {adminCards.map(card => (
            <Link
              key={card.href}
              href={card.href}
              className="block border border-border bg-surface p-6 hover:bg-surface-warm transition-colors group"
            >
              <h2 className="text-base font-semibold text-ink group-hover:text-stone transition-colors">
                {card.label}
              </h2>
              <p className="mt-2 text-sm text-ink-muted">{card.desc}</p>
              <span className="inline-block mt-4 text-xs text-stone">进入 →</span>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
