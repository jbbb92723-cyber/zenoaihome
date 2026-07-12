import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ServiceDeskClient from '@/components/admin/ServiceDeskClient'

export const metadata: Metadata = { title: '服务待办 · Admin' }
export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
  const [requests, counts] = await Promise.all([
    prisma.serviceRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: { user: { select: { email: true, name: true } } },
    }),
    Promise.all([
      prisma.serviceRequest.count({ where: { status: 'submitted' } }),
      prisma.serviceRequest.count({ where: { status: 'reviewing' } }),
      prisma.serviceRequest.count({ where: { status: 'completed' } }),
      prisma.serviceRequest.count(),
    ]),
  ])

  return (
    <ServiceDeskClient
      initialRequests={JSON.parse(JSON.stringify(requests))}
      counts={{ submitted: counts[0], reviewing: counts[1], completed: counts[2], total: counts[3] }}
    />
  )
}
