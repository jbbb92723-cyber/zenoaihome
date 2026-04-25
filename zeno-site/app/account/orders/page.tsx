/**
 * app/account/orders/page.tsx
 *
 * 我的订单页面
 * - 第一版：空状态，支付系统后续接入
 */

import type { Metadata } from 'next'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: '我的订单',
  robots: { index: false },
}

export default async function AccountOrdersPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/account/orders')
  }

  return (
    <Container size="content" className="py-section">
      <div className="max-w-xl mx-auto">

        {/* 导航 */}
        <nav className="flex items-center gap-2 mb-8 text-xs text-ink-muted">
          <Link href="/account" className="hover:text-stone transition-colors">用户中心</Link>
          <span>/</span>
          <span className="text-stone">我的订单</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-ink tracking-tight">我的订单</h1>
          <p className="text-sm text-ink-muted mt-2">
            查看付费内容和服务的购买记录。
          </p>
        </div>

        {/* 空状态 — 不暴露技术进度，只呈现当前可用状态 */}
        <div className="border border-border bg-surface p-10 text-center">
          <p className="text-sm font-medium text-ink mb-2">暂无订单记录</p>
          <p className="text-xs text-ink-faint leading-relaxed max-w-xs mx-auto">
            你的购买记录和服务订单会在这里显示。
          </p>
          <Link
            href="/services"
            className="inline-block mt-5 text-xs text-stone border border-stone/30 px-4 py-2 hover:bg-stone-pale/50 transition-colors"
          >
            了解服务 →
          </Link>
        </div>

      </div>
    </Container>
  )
}
