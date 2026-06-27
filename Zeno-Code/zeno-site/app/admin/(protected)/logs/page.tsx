/**
 * app/admin/(protected)/logs/page.tsx
 * 操作日志查看页
 */

import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = { title: '操作日志 · Admin' }

export const dynamic = 'force-dynamic'

const ACTION_LABELS: Record<string, string> = {
  create_note: '创建笔记',
  update_note: '更新笔记',
  delete_note: '删除笔记',
  update_order_status: '更新订单状态',
  grant_membership: '开通会员',
  revoke_membership: '取消会员',
  update_service_status: '更新服务状态',
  update_living_diagnosis_status: '更新居住诊断状态',
  create_redeem_code: '创建兑换码',
  batch_create_redeem_codes: '批量创建兑换码',
  create_coupon: '创建优惠券',
  confirm_payment: '确认付款',
}

export default async function AdminLogsPage() {
  const logs = await prisma.adminLog.findMany({
    select: { id: true, action: true, target: true, detail: true, ip: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <p className="text-[0.65rem] text-[#706860] uppercase tracking-widest font-semibold mb-1">Admin</p>
        <h1 className="text-xl font-semibold text-[#E8E2DA] tracking-tight">操作日志</h1>
        <p className="text-xs text-[#706860] mt-2">最近 100 条管理操作。每次创建/编辑/删除笔记、改订单、开会员都留痕。</p>
      </div>

      {logs.length === 0 ? (
        <p className="text-sm text-[#706860] py-8">暂无操作记录。</p>
      ) : (
        <div className="border border-[#3A3530] bg-[#252320] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#3A3530]">
                <th className="px-4 py-3 text-left text-xs text-[#706860] uppercase tracking-widest font-semibold w-40">时间</th>
                <th className="px-4 py-3 text-left text-xs text-[#706860] uppercase tracking-widest font-semibold w-32">操作</th>
                <th className="px-4 py-3 text-left text-xs text-[#706860] uppercase tracking-widest font-semibold">目标</th>
                <th className="px-4 py-3 text-left text-xs text-[#706860] uppercase tracking-widest font-semibold">详情</th>
                <th className="px-4 py-3 text-left text-xs text-[#706860] uppercase tracking-widest font-semibold w-36">IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="border-b border-[#3A3530] last:border-0 hover:bg-[#2A2825] transition-colors">
                  <td className="px-4 py-3 text-xs text-[#706860] font-mono whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('zh-CN')}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-[#C4A882] bg-[#C4A882]/10 px-2 py-0.5">
                      {ACTION_LABELS[log.action] ?? log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#A09890] font-mono max-w-[14rem] truncate">
                    {log.target ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#706860] max-w-[16rem] truncate">
                    {log.detail ? (typeof log.detail === 'string' ? log.detail : JSON.stringify(log.detail)) : '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#504840] font-mono">
                    {log.ip ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
