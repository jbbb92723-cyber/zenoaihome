import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@/auth'
import RenovationArchiveWorkspace from '@/components/features/renovation-archive/RenovationArchiveWorkspace'
import { isRenovationArchiveEnabled } from '@/lib/domains/renovation-archive/feature'

export const metadata: Metadata = {
  title: '我的装修档案',
  robots: { index: false, follow: false },
}

export default async function RenovationArchivePage() {
  if (!isRenovationArchiveEnabled()) notFound()

  const session = await auth()
  if (!session?.user) {
    redirect('/login?callbackUrl=/account/renovation')
  }

  return <RenovationArchiveWorkspace />
}
