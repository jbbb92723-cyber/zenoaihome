import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import type { LivingDiagnosisResult } from '@/lib/living-diagnosis'

export const metadata: Metadata = { title: '居住诊断 · Admin' }

const STATUS_LABEL: Record<string, string> = {
  submitted:    '已提交',
  reviewing:    '审核中',
  report_draft: '报告草稿',
  completed:    '已完成',
  archived:     '已归档',
}

const STATUS_COLOR: Record<string, string> = {
  submitted:    'text-[#C4A882]',
  reviewing:    'text-[#C4A882]',
  report_draft: 'text-[#D4B892]',
  completed:    'text-green-400',
  archived:     'text-[#706860]',
}

function parseResult(value: unknown): Partial<LivingDiagnosisResult> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return value as Partial<LivingDiagnosisResult>
}

export default async function LivingDiagnosesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const statusFilter = params.status ?? ''

  const diagnoses = await prisma.livingDiagnosis.findMany({
    where: statusFilter ? { status: statusFilter } : {},
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { user: { select: { email: true, name: true } } },
  })

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-widest text-[#706860]">Admin</p>
          <h1 className="text-xl font-semibold text-[#E8E2DA]">居住诊断</h1>
        </div>
        <span className="text-sm text-[#706860]">{diagnoses.length} 条</span>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {[['', '全部'], ...Object.entries(STATUS_LABEL)].map(([value, label]) => (
          <Link
            key={value}
            href={value ? `/admin/living-diagnoses?status=${value}` : '/admin/living-diagnoses'}
            className={`border px-3 py-1.5 text-xs transition-colors ${
              statusFilter === value
                ? 'border-[#C4A882]/50 bg-[#C4A882]/10 text-[#C4A882]'
                : 'border-[#3A3530] text-[#706860] hover:text-[#E8E2DA]'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto border border-[#3A3530] bg-[#252320]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#3A3530]">
              {['提交时间', '类型', '状态', '城市/面积', '预算', '联系方式', '用户', '操作'].map((heading) => (
                <th key={heading} className="whitespace-nowrap px-3 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[#706860]">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3A3530]">
            {diagnoses.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-[#706860]">暂无诊断提交</td>
              </tr>
            )}
            {diagnoses.map((diagnosis) => {
              const result = parseResult(diagnosis.result)
              const contact = diagnosis.contactWechat || diagnosis.contactEmail || diagnosis.contactName || '未留'
              return (
                <tr key={diagnosis.id} className="transition-colors hover:bg-[#2A2825]">
                  <td className="whitespace-nowrap px-3 py-3 text-xs text-[#706860]">
                    {diagnosis.createdAt.toLocaleString('zh-CN')}
                  </td>
                  <td className="px-3 py-3">
                    <p className="max-w-[9rem] truncate text-sm font-medium text-[#E8E2DA]">
                      {result.primaryType ?? '待分析'}
                    </p>
                    <p className="mt-1 text-xs text-[#706860]">分数 {result.totalScore ?? '—'}</p>
                  </td>
                  <td className={`whitespace-nowrap px-3 py-3 text-xs font-medium ${STATUS_COLOR[diagnosis.status] ?? 'text-[#706860]'}`}>
                    {STATUS_LABEL[diagnosis.status] ?? diagnosis.status}
                  </td>
                  <td className="px-3 py-3 text-xs text-[#A09890]">
                    <p>{diagnosis.city || '—'}</p>
                    <p className="mt-1 text-[#706860]">{diagnosis.area || diagnosis.homeType || '未填'}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs text-[#A09890]">
                    {diagnosis.budgetRange || '—'}
                  </td>
                  <td className="max-w-[10rem] truncate px-3 py-3 text-xs text-[#A09890]">
                    {contact}
                  </td>
                  <td className="max-w-[10rem] truncate px-3 py-3 text-xs text-[#706860]">
                    {diagnosis.user?.email ?? '未登录'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <Link href={`/admin/living-diagnoses/${diagnosis.id}`} className="text-xs text-[#C4A882] hover:underline">
                      查看详情
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
