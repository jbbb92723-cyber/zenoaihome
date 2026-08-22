import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { updateCommunityApplicationStatus } from '@/lib/actions/community'
import {
  SPARK_COMMUNITY_PLAN,
  SPARK_COMMUNITY_SERVICE_TYPE,
  type CommunityApplicationStatus,
} from '@/lib/domains/community/constants'

export const metadata: Metadata = { title: '星火者共同体 · Admin' }
export const dynamic = 'force-dynamic'

const STATUS_LABEL: Record<string, string> = {
  submitted: '待初筛',
  reviewing: '待面聊',
  completed: '已通过',
  rejected: '未通过',
}

const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: '待付款',
  pending_confirmation: '待确认',
  paid: '已付款',
  processing: '处理中',
  completed: '已开通',
  cancelled: '已取消',
  refunded: '已退款',
}

export default async function AdminCommunityPage() {
  const [applications, orders, members] = await Promise.all([
    prisma.serviceRequest.findMany({
      where: { serviceType: SPARK_COMMUNITY_SERVICE_TYPE },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { user: { select: { email: true, name: true } } },
    }),
    prisma.order.findMany({
      where: { source: { startsWith: 'community:' } },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: { orderNo: true, source: true, status: true, paidAmount: true },
    }),
    prisma.membership.findMany({
      where: { plan: SPARK_COMMUNITY_PLAN },
      orderBy: { startedAt: 'desc' },
      include: { user: { select: { email: true, name: true } } },
    }),
  ])

  const orderByApplication = new Map<string, typeof orders[number]>()
  for (const order of orders) {
    const applicationId = order.source?.replace('community:', '')
    if (applicationId && !orderByApplication.has(applicationId)) {
      orderByApplication.set(applicationId, order)
    }
  }

  const submitted = applications.filter(item => item.status === 'submitted').length
  const interviewing = applications.filter(item => item.status === 'reviewing').length
  const approved = applications.filter(item => item.status === 'completed').length
  const activeMembers = members.filter(item => item.status === 'active').length

  async function setStatus(applicationId: string, status: CommunityApplicationStatus) {
    'use server'
    await updateCommunityApplicationStatus(applicationId, status)
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-widest text-[#706860]">Community Operations</p>
          <h1 className="text-xl font-semibold text-[#E8E2DA]">星火者共同体</h1>
          <p className="mt-2 text-xs text-[#706860]">申请 → 面聊 → 通过 → 付款 → 入营</p>
        </div>
        <Link href="/community" className="border border-[#3A3530] px-4 py-2 text-xs text-[#A09890] hover:text-[#E8E2DA]">查看招募页</Link>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: '待初筛', value: submitted, color: 'text-[#E8E2DA]' },
          { label: '待面聊', value: interviewing, color: 'text-[#C4A882]' },
          { label: '已通过', value: approved, color: 'text-[#C4A882]' },
          { label: '有效成员', value: activeMembers, color: 'text-green-400' },
        ].map(item => (
          <div key={item.label} className="border border-[#3A3530] bg-[#252320] p-4">
            <p className="text-xs text-[#706860]">{item.label}</p>
            <p className={`mt-1 text-2xl font-semibold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-[#E8E2DA]">成员申请</h2>
        <div className="overflow-x-auto border border-[#3A3530] bg-[#252320]">
          <table className="w-full min-w-[920px] text-sm">
            <thead>
              <tr className="border-b border-[#3A3530]">
                {['申请人', '申请内容', '状态', '订单', '申请时间', '操作'].map(label => (
                  <th key={label} className="px-4 py-3 text-left text-xs font-semibold text-[#706860]">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A3530]">
              {applications.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-[#706860]">暂无星火者申请</td></tr>
              )}
              {applications.map(application => {
                const order = orderByApplication.get(application.id)
                return (
                  <tr key={application.id} className="align-top hover:bg-[#2A2825]">
                    <td className="px-4 py-4">
                      <p className="font-medium text-[#E8E2DA]">{application.name || application.user?.name || '未填写'}</p>
                      <p className="mt-1 max-w-[180px] truncate text-xs text-[#706860]">{application.wechat || application.user?.email || application.email || '无联系方式'}</p>
                    </td>
                    <td className="max-w-[360px] whitespace-pre-line px-4 py-4 text-xs leading-6 text-[#A09890]">{application.message || '未填写'}</td>
                    <td className="px-4 py-4 text-xs font-semibold text-[#C4A882]">{STATUS_LABEL[application.status] ?? application.status}</td>
                    <td className="px-4 py-4 text-xs text-[#A09890]">
                      {order ? (
                        <Link href={`/admin/orders?q=${order.orderNo}`} className="hover:text-[#C4A882]">
                          {ORDER_STATUS_LABEL[order.status] ?? order.status}<br />
                          <span className="font-mono text-[0.65rem] text-[#706860]">{order.orderNo}</span>
                        </Link>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-4 text-xs text-[#706860]">{application.createdAt.toLocaleDateString('zh-CN')}</td>
                    <td className="px-4 py-4">
                      <div className="flex max-w-[180px] flex-wrap gap-2">
                        {application.status === 'submitted' && (
                          <form action={setStatus.bind(null, application.id, 'reviewing')}>
                            <button className="border border-[#C4A882]/30 px-3 py-1.5 text-xs text-[#C4A882] hover:bg-[#C4A882]/10">进入面聊</button>
                          </form>
                        )}
                        {application.status === 'reviewing' && (
                          <form action={setStatus.bind(null, application.id, 'completed')}>
                            <button className="bg-[#C4A882] px-3 py-1.5 text-xs font-semibold text-[#1C1A17] hover:bg-[#D4B892]">通过并生成订单</button>
                          </form>
                        )}
                        {application.status !== 'rejected' && application.status !== 'completed' && (
                          <form action={setStatus.bind(null, application.id, 'rejected')}>
                            <button className="border border-[#3A3530] px-3 py-1.5 text-xs text-[#706860] hover:text-red-400">本期不通过</button>
                          </form>
                        )}
                        {application.status === 'rejected' && (
                          <form action={setStatus.bind(null, application.id, 'reviewing')}>
                            <button className="border border-[#3A3530] px-3 py-1.5 text-xs text-[#A09890]">重新面聊</button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#E8E2DA]">星火者成员</h2>
          <Link href="/admin/members" className="text-xs text-[#706860] hover:text-[#C4A882]">全部会员</Link>
        </div>
        <div className="overflow-x-auto border border-[#3A3530] bg-[#252320]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#3A3530]">
                {['成员', '状态', '入营时间', '到期时间'].map(label => (
                  <th key={label} className="px-4 py-3 text-left text-xs font-semibold text-[#706860]">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A3530]">
              {members.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-[#706860]">暂无已开通成员</td></tr>
              )}
              {members.map(member => (
                <tr key={member.id}>
                  <td className="px-4 py-3">
                    <p className="text-[#E8E2DA]">{member.user.name || '未填写'}</p>
                    <p className="mt-1 text-xs text-[#706860]">{member.user.email}</p>
                  </td>
                  <td className={`px-4 py-3 text-xs ${member.status === 'active' ? 'text-green-400' : 'text-[#706860]'}`}>{member.status === 'active' ? '有效' : member.status}</td>
                  <td className="px-4 py-3 text-xs text-[#706860]">{member.startedAt.toLocaleDateString('zh-CN')}</td>
                  <td className="px-4 py-3 text-xs text-[#706860]">{member.expiresAt?.toLocaleDateString('zh-CN') || '长期'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
