/**
 * 人工收款配置。
 *
 * 收款码是公开资源，所以使用 NEXT_PUBLIC_*；没有配置时，订单流程必须明确
 * 处于不可付款状态，不能用空图片或默认路径冒充真实收款入口。
 */

export type PaymentMethod = 'wechat' | 'alipay'

export interface PaymentOption {
  method: PaymentMethod
  label: string
  qrUrl: string
}

function readPublicUrl(value: string | undefined): string | null {
  const normalized = value?.trim()
  if (!normalized) return null

  if (normalized.startsWith('/')) return normalized

  try {
    const url = new URL(normalized)
    return url.protocol === 'http:' || url.protocol === 'https:' ? normalized : null
  } catch {
    return null
  }
}

export function getPaymentOptions(): PaymentOption[] {
  const options: PaymentOption[] = []
  const wechatQrUrl = readPublicUrl(process.env.NEXT_PUBLIC_WECHAT_PAYMENT_QR_URL)
  const alipayQrUrl = readPublicUrl(process.env.NEXT_PUBLIC_ALIPAY_PAYMENT_QR_URL)

  if (wechatQrUrl) options.push({ method: 'wechat', label: '微信', qrUrl: wechatQrUrl })
  if (alipayQrUrl) options.push({ method: 'alipay', label: '支付宝', qrUrl: alipayQrUrl })

  return options
}

export function isPaymentMethodConfigured(method: string | null | undefined): boolean {
  return getPaymentOptions().some((option) => option.method === method)
}

export function hasPaymentConfiguration(): boolean {
  return getPaymentOptions().length > 0
}
