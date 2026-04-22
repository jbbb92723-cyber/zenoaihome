/**
 * app/account/page.tsx
 *
 * 个人中心 — 未登录引导登录，已登录显示用户信息
 */

import type { Metadata } from 'next'
import { auth, signOut } from '@/auth'
import Link from 'next/link'
import Avatar from '@/components/Avatar'
import Container from '@/components/Container'

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

  const roleLabels: Record<string, string> = {
    user:     '已注册',
    member:   '免费会员',
    customer: '付费会员',
    admin:    '管理员',
    visitor:  '未登录',
  }
  const roleLabel = roleLabels[user.role ?? 'user'] ?? '已注册'

  const roleStyles: Record<string, string> = {
    user:     'text-ink-muted',
    member:   'text-amber-700',
    customer: 'text-purple-700',
    admin:    'text-stone font-semibold',
  }
  const roleStyle = roleStyles[user.role ?? 'user'] ?? 'text-ink-muted'

  return (
    <Container size="content" className="py-section">
      <div className="max-w-xl mx-auto">

        {/* 页面标题 */}
        <div className="mb-10">
          <p className="page-label mb-3">个人中心</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">个人中心</h1>
        </div>

        {/* 用户信息卡片 */}
        <div className="border border-border bg-surface p-6 mb-8">
          <div className="flex items-start gap-4">
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
              <p className="text-sm text-ink-muted mt-0.5 truncate">
                {user.email ?? ''}
              </p>
              <p className={`text-xs mt-2 ${roleStyle}`}>
                {roleLabel}
              </p>
            </div>
          </div>
        </div>

        {/* 功能入口 */}
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
              {user.email ? '邮箱 / OAuth' : '待接入'}
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
