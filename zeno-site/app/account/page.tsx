/**
 * app/account/page.tsx
 *
 * 个人中心 — 最小可用版
 * 显示登录身份信息，方便配置 ADMIN_EMAILS / ADMIN_USER_IDS
 */

import type { Metadata } from 'next'
import { auth, signOut } from '@/auth'
import { isAdminUser } from '@/lib/admin'
import Link from 'next/link'
import Avatar from '@/components/Avatar'
import Container from '@/components/Container'
import CopyButton from '@/components/CopyButton'

export const metadata: Metadata = {
  title: '个人中心',
  description: '查看登录状态、资料领取记录和服务申请记录。',
  robots: { index: false },
}

export default async function AccountPage() {
  const session = await auth()

  // 未登录
  if (!session?.user) {
    return (
      <Container size="content" className="py-section">
        <div className="max-w-md mx-auto">
          <div className="mb-10">
            <p className="page-label mb-3">个人中心</p>
            <h1 className="text-2xl font-semibold text-ink tracking-tight">个人中心</h1>
          </div>
          <p className="text-sm text-ink-muted leading-relaxed mb-4">
            这里未来用于查看你的资料领取记录、报价单审核申请、评论记录和登录状态。
          </p>
          <p className="text-sm text-ink-muted leading-relaxed mb-8">
            当前登录体系还在配置中，公开内容可以直接阅读，不需要登录。
          </p>
          <Link
            href="/login"
            className="inline-block text-sm font-medium text-paper bg-stone px-4 py-2 hover:bg-stone/85 transition-colors"
          >
            去登录
          </Link>
        </div>
      </Container>
    )
  }

  const user = session.user
  const isAdmin = await isAdminUser()

  return (
    <Container size="content" className="py-section">
      <div className="max-w-xl mx-auto">

        {/* 页面标题 */}
        <div className="mb-10">
          <p className="page-label mb-3">个人中心</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">个人中心</h1>
        </div>

        {/* 基本信息卡片 */}
        <div className="border border-border bg-surface p-6 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Avatar
              src={user.image ?? ''}
              alt={user.name ?? 'User'}
              fallback={(user.name?.[0] ?? 'U').toUpperCase()}
              size={48}
            />
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-ink leading-tight">
                {user.name ?? '用户'}
              </p>
              <p className="text-sm text-ink-muted mt-1">
                {isAdmin ? (
                  <span className="text-stone font-semibold">管理员</span>
                ) : (
                  <span className="text-ink-faint">已登录</span>
                )}
              </p>
            </div>
          </div>

          {/* 详细信息表 */}
          <div className="space-y-0 border border-border">
            {/* 当前登录邮箱 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="text-xs text-ink-faint w-24 shrink-0">登录邮箱</p>
              <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                <p className="text-sm text-ink font-mono break-all text-right">
                  {user.email ?? '—'}
                </p>
                {user.email && <CopyButton text={user.email} />}
              </div>
            </div>

            {/* 用户 ID */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="text-xs text-ink-faint w-24 shrink-0">用户 ID</p>
              <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                <p className="text-sm text-ink font-mono break-all text-right">
                  {user.id ?? '—'}
                </p>
                {user.id && <CopyButton text={user.id} />}
              </div>
            </div>

            {/* 登录方式 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="text-xs text-ink-faint w-24 shrink-0">登录方式</p>
              <p className="text-sm text-ink-muted">
                {user.provider ? user.provider : 'OAuth'}
              </p>
            </div>

            {/* 是否管理员 */}
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-xs text-ink-faint w-24 shrink-0">管理员</p>
              <p className={`text-sm font-medium ${isAdmin ? 'text-stone' : 'text-ink-faint'}`}>
                {isAdmin ? '是' : '否'}
              </p>
            </div>
          </div>

          {/* 管理员配置提示 */}
          {!isAdmin && (
            <p className="text-xs text-ink-faint mt-4 leading-relaxed">
              如需开启管理员权限，请将上方邮箱或用户 ID 填入 Vercel 环境变量{' '}
              <span className="font-mono">ADMIN_EMAILS</span> 或{' '}
              <span className="font-mono">ADMIN_USER_IDS</span>，
              然后 Redeploy。
            </p>
          )}
        </div>

        {/* 功能入口（占位） */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="border border-border bg-surface p-5">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">
              资料领取记录
            </p>
            <p className="text-sm text-ink-muted">待接入</p>
          </div>

          <div className="border border-border bg-surface p-5">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">
              报价单审核记录
            </p>
            <p className="text-sm text-ink-muted">待接入</p>
          </div>

          <div className="border border-border bg-surface p-5">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">
              评论记录
            </p>
            <p className="text-sm text-ink-muted">待接入</p>
          </div>

          <div className="border border-border bg-surface p-5">
            <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest mb-2">
              登录方式
            </p>
            <p className="text-sm text-ink-muted">
              {user.provider ? user.provider : 'IDC Flare / OAuth'}
            </p>
          </div>
        </div>

        {/* 退出登录 */}
        <div className="pt-6 border-t border-border">
          <form
            action={async () => {
              'use server'
              await signOut({ redirectTo: '/' })
            }}
          >
            <button
              type="submit"
              className="text-sm text-ink-faint hover:text-ink transition-colors underline underline-offset-2 decoration-border"
            >
              退出登录
            </button>
          </form>
        </div>

      </div>
    </Container>
  )
}
