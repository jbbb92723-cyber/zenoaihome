import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = { title: '工地总览 · Admin' }
export const dynamic = 'force-dynamic'

const NODE_LABELS = ['水电验收', '防水验收', '木工验收', '贴砖验收', '油漆验收', '安装验收', '竣工验收']

function statusBadge(status: string) {
  const map: Record<string, string> = {
    active: 'bg-green-400/15 text-green-400 border-green-400/30',
    completed: 'bg-[#C4A882]/15 text-[#C4A882] border-[#C4A882]/30',
    paused: 'bg-yellow-400/15 text-yellow-400 border-yellow-400/30',
    cancelled: 'bg-[#d2846f]/15 text-[#d2846f] border-[#d2846f]/30',
  }
  const label: Record<string, string> = {
    active: '施工中', completed: '已竣工', paused: '暂停', cancelled: '已取消',
  }
  return (
    <span className={`text-[0.6rem] px-2 py-0.5 border rounded-sm font-semibold ${map[status] || map.active}`}>
      {label[status] || status}
    </span>
  )
}

function nodeStatusDot(status: string) {
  const map: Record<string, string> = {
    pending: 'bg-[#504840]',
    in_progress: 'bg-yellow-400',
    submitted: 'bg-blue-400',
    reviewed: 'bg-[#C4A882]',
    passed: 'bg-green-400',
    failed: 'bg-[#d2846f]',
  }
  return <span className={`inline-block w-2 h-2 rounded-full ${map[status] || map.pending}`} />
}

function progressPercent(nodes: Array<{ status: string }>) {
  if (!nodes.length) return 0
  const done = nodes.filter(n => ['passed', 'reviewed'].includes(n.status)).length
  return Math.round((done / nodes.length) * 100)
}

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: { nodes: { orderBy: { sortOrder: 'asc' } }, _count: { select: { photos: true, notes: true } } },
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
  })

  const activeCount = projects.filter(p => p.status === 'active').length
  const completedCount = projects.filter(p => p.status === 'completed').length

  return (
    <div className="max-w-[1400px] space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[0.65rem] text-[#706860] uppercase tracking-widest font-semibold mb-1">
            Project Delivery · 项目交付
          </p>
          <h1 className="text-xl font-semibold text-[#E8E2DA] tracking-tight">工地总览</h1>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C4A882] text-[#1C1A17] text-sm font-semibold rounded-sm hover:bg-[#C4A882]/85 transition-colors"
        >
          + 新建工地
        </Link>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '施工中', value: activeCount, tone: 'text-green-400' },
          { label: '已竣工', value: completedCount, tone: 'text-[#C4A882]' },
          { label: '总工地数', value: projects.length, tone: 'text-[#E8E2DA]' },
          { label: '总节点数', value: projects.reduce((s, p) => s + p.nodes.length, 0), tone: 'text-[#68aeb0]' },
        ].map(kpi => (
          <div key={kpi.label} className="border border-[#3A3530] bg-[#1f1d1a] p-4">
            <p className={`text-2xl font-semibold ${kpi.tone}`}>{kpi.value}</p>
            <p className="text-xs text-[#706860] mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* 项目列表 */}
      <div className="border border-[#3A3530] bg-[#1f1d1a]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#3A3530]">
                <th className="px-4 py-3 text-left text-xs text-[#706860] uppercase tracking-widest font-semibold">项目</th>
                <th className="px-4 py-3 text-left text-xs text-[#706860] uppercase tracking-widest font-semibold">业主</th>
                <th className="px-4 py-3 text-left text-xs text-[#706860] uppercase tracking-widest font-semibold hidden md:table-cell">城市/面积</th>
                <th className="px-4 py-3 text-left text-xs text-[#706860] uppercase tracking-widest font-semibold">状态</th>
                <th className="px-4 py-3 text-left text-xs text-[#706860] uppercase tracking-widest font-semibold hidden sm:table-cell">节点进度</th>
                <th className="px-4 py-3 text-right text-xs text-[#706860] uppercase tracking-widest font-semibold hidden sm:table-cell">照片/备注</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-[#706860]">
                    暂无工地项目。点击「新建工地」开始记录你的第一个项目。
                  </td>
                </tr>
              ) : (
                projects.map(project => {
                  const pct = progressPercent(project.nodes)
                  return (
                    <tr key={project.id} className="border-b border-[#3A3530] last:border-0 hover:bg-[#252320] transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/admin/projects/${project.id}`} className="text-[#E8E2DA] hover:text-[#C4A882] transition-colors font-medium">
                          {project.name || '未命名项目'}
                        </Link>
                        {project.source && (
                          <p className="text-[0.6rem] text-[#706860] mt-0.5">{project.source}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[#A09890] text-xs">
                        {project.clientName || '-'}
                        {project.clientPhone && <p className="text-[0.6rem] text-[#504840]">{project.clientPhone}</p>}
                      </td>
                      <td className="px-4 py-3 text-[#A09890] text-xs hidden md:table-cell">
                        {[project.city, project.area ? `${project.area}㎡` : null].filter(Boolean).join(' · ') || '-'}
                      </td>
                      <td className="px-4 py-3">{statusBadge(project.status)}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {project.nodes.map(n => (
                              <span key={n.id} title={`${n.name}: ${n.status}`}>{nodeStatusDot(n.status)}</span>
                            ))}
                          </div>
                          <span className="text-xs text-[#706860]">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-[#706860] hidden sm:table-cell">
                        {project._count.photos > 0 && <span>📷 {project._count.photos}</span>}
                        {project._count.notes > 0 && <span className="ml-2">📝 {project._count.notes}</span>}
                        {project._count.photos === 0 && project._count.notes === 0 && '-'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
