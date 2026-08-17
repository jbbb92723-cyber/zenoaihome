import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getPaymentOptions } from '@/lib/payment-config'
import Container from '@/components/ui/Container'
import { formatYuan } from '@/data/services/products'
import OrderActions from './OrderActions'

export const metadata: Metadata = { title: '订单支付' }

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:               { label: '待付款', color: 'text-ink' },
  pending_confirmation:  { label: '待人工确认', color: 'text-stone' },
  paid:                  { label: '已付款', color: 'text-stone' },
  processing:            { label: '处理中', color: 'text-stone' },
  completed:             { label: '已完成', color: 'text-stone' },
  cancelled:             { label: '已取消', color: 'text-ink-muted' },
  refunded:              { label: '已退款', color: 'text-ink-muted' },
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderNo: string }>
}) {
  const { orderNo } = await params
  const session     = await auth()
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/order/${orderNo}`)}`)
  }

  const order = await prisma.order.findFirst({
    where: { orderNo, userId: session.user.id },
  })

  if (!order) notFound()

  const status = STATUS_LABEL[order.status] ?? { label: order.status, color: 'text-ink-muted' }
  const isPending = order.status === 'pending'
  const paymentOptions = getPaymentOptions().filter(
    (option) => option.method === order.paymentMethod,
  )
  const paymentAvailable = paymentOptions.length > 0

  return (
    <Container size="content" className="py-section">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="page-label mb-2">订单详情</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">完成付款</h1>
        </div>

        {/* Order Card */}
        <div className="border border-border bg-surface p-6 mb-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-ink">{order.productName}</p>
              <p className="text-xs text-ink-faint mt-0.5">{order.orderNo}</p>
            </div>
            <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
          </div>

          <div className="border-t border-border pt-4 flex items-baseline gap-1.5">
            <span className="text-sm text-ink-muted">应付金额</span>
            <span className="text-2xl font-bold text-ink ml-auto">
              {formatYuan(order.paidAmount)}
            </span>
          </div>

          <p className="text-xs text-ink-faint">
            下单时间：{order.createdAt.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
          </p>
        </div>

        {/* 只有至少配置一张真实收款码时，才展示可执行的付款步骤。 */}
        {isPending && paymentAvailable && (
          <div className="border border-border bg-surface p-6 mb-6">
            <h2 className="text-sm font-semibold text-ink mb-4">付款步骤</h2>

            <div className="space-y-5">
              {/* Step 1 */}
              <div className="flex gap-3">
                <span className="shrink-0 w-5 h-5 bg-stone text-white text-xs flex items-center justify-center font-bold">1</span>
                <div>
                  <p className="text-sm font-medium text-ink mb-0.5">扫码付款</p>
                  <p className="text-xs text-ink-muted">使用下方收款码转账 <strong className="text-ink">{formatYuan(order.paidAmount)}</strong></p>
                </div>
              </div>

              {/* 收款码由环境变量配置，不能使用不存在的默认图片。 */}
              <div className={`grid gap-4 ${paymentOptions.length > 1 ? 'grid-cols-2' : 'grid-cols-1 max-w-[13rem]'}`}>
                {paymentOptions.map((option) => (
                  <div key={option.method} className="text-center">
                    <div className="border border-border bg-canvas p-3 mb-2 flex items-center justify-center aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={option.qrUrl}
                        alt={`${option.label}收款码`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-xs text-ink-muted">{option.label}</p>
                  </div>
                ))}
              </div>

              {/* Step 2 */}
              <div className="flex gap-3">
                <span className="shrink-0 w-5 h-5 bg-stone text-white text-xs flex items-center justify-center font-bold">2</span>
                <div>
                  <p className="text-sm font-medium text-ink mb-0.5">付款备注</p>
                  <p className="text-xs text-ink-muted">
                    转账时备注订单号 <strong className="text-ink font-mono">{order.orderNo}</strong>，方便快速核对
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-3">
                <span className="shrink-0 w-5 h-5 bg-stone text-white text-xs flex items-center justify-center font-bold">3</span>
                <div>
                  <p className="text-sm font-medium text-ink mb-0.5">通知我已付款</p>
                  <p className="text-xs text-ink-muted">点击下方按钮，我会在 24 小时内确认并开通权益</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isPending && !paymentAvailable && (
          <div className="border border-border bg-surface-warm p-5 mb-6">
            <h2 className="text-sm font-semibold text-ink">付款暂未开放</h2>
            <p className="mt-2 text-sm leading-7 text-ink-muted">
              当前订单还没有配置可用的收款方式。请先不要转账，待付款入口开放后再继续。
            </p>
            <a href="/contact" className="mt-4 inline-block text-sm font-semibold text-stone underline underline-offset-4 hover:text-ink">
              联系赞诺确认
            </a>
          </div>
        )}

        {/* Actions（客户端组件） */}
        <OrderActions
          orderNo={order.orderNo}
          status={order.status}
          paymentAvailable={paymentAvailable}
        />

        {/* 说明 */}
        {((paymentAvailable && isPending) || order.status === 'pending_confirmation') && (
          <p className="mt-4 text-xs text-ink-faint text-center leading-relaxed">
            如超过 24 小时未开通，请通过<a href="/contact" className="underline underline-offset-2 hover:text-ink-muted">联系页</a>联系我核实
          </p>
        )}

      </div>
    </Container>
  )
}
