import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import Container from '@/components/ui/Container'
import CommunityApplicationClient from '@/components/features/community/CommunityApplicationClient'
import {
  SPARK_COMMUNITY_PLAN,
  SPARK_COMMUNITY_SERVICE_TYPE,
} from '@/lib/domains/community/constants'

export const metadata: Metadata = {
  title: '申请加入星火者共同体',
  description: '申请星火者 90 天实践共同体验证席，查看面聊、订单和成员资格进度。',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function CommunityApplyPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/community/apply')
  }

  const [application, membership] = await Promise.all([
    prisma.serviceRequest.findFirst({
      where: {
        userId: session.user.id,
        serviceType: SPARK_COMMUNITY_SERVICE_TYPE,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        responseText: true,
        createdAt: true,
      },
    }),
    prisma.membership.findFirst({
      where: {
        userId: session.user.id,
        plan: SPARK_COMMUNITY_PLAN,
      },
      select: { status: true, expiresAt: true },
    }),
  ])

  const order = application
    ? await prisma.order.findFirst({
        where: {
          userId: session.user.id,
          source: `community:${application.id}`,
        },
        orderBy: { createdAt: 'desc' },
        select: { orderNo: true, status: true },
      })
    : null

  return (
    <main className="bg-canvas text-ink">
      <section className="border-b border-white/10 bg-ink px-5 py-14 text-white sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-[920px]">
          <p className="text-sm font-semibold text-white/55">星火者 · 90 天实践共同体</p>
          <h1 className="editorial-display mt-4 text-[2.35rem] leading-tight sm:text-[3rem]">成员申请与进度</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65">首期 8-10 人。申请、面聊、付款和成员状态都在这里留痕。</p>
        </div>
      </section>

      <Container size="content" className="py-14 sm:py-16">
        <CommunityApplicationClient
          defaultName={session.user.name ?? ''}
          defaultEmail={session.user.email ?? ''}
          application={application ? {
            status: application.status,
            responseText: application.responseText,
            createdAt: application.createdAt.toISOString(),
          } : null}
          order={order}
          membership={membership ? {
            status: membership.status,
            expiresAt: membership.expiresAt?.toISOString() ?? null,
          } : null}
        />
      </Container>
    </main>
  )
}
