import type { Metadata } from 'next'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function OrderLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ orderNo: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) {
    const { orderNo } = await params
    redirect(`/login?callbackUrl=${encodeURIComponent(`/order/${orderNo}`)}`)
  }
  return <>{children}</>
}
