import { auth } from '@/auth'
import { redirect } from 'next/navigation'

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
