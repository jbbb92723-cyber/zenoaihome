import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

const NODE_DEFAULTS = [
  { name: '水电验收', sortOrder: 1 },
  { name: '防水验收', sortOrder: 2 },
  { name: '木工验收', sortOrder: 3 },
  { name: '贴砖验收', sortOrder: 4 },
  { name: '油漆验收', sortOrder: 5 },
  { name: '安装验收', sortOrder: 6 },
  { name: '竣工验收', sortOrder: 7 },
]

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

function nodeStatusLabel(status: string) {
  const map: Record<string, string> = {
    pending: '待验收', in_progress: '进行中', submitted: '已提交',
    reviewed: '已审核', passed: '通过', failed: '未通过',
  }
  return map[status] || status
}

function nodeStatusColor(status: string) {
  const map: Record<string, string> = {
    pending: 'text-[#504840]', in_progress: 'text-yellow-400', submitted: 'text-blue-400',
    reviewed: 'text-[#C4A882]', passed: 'text-green-400', failed: 'text-[#d2846f]',
  }
  return map[status] || 'text-[#504840]'
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (id === 'new') {
    // 创建新项目
    const project = await prisma.project.create({
      data: {
        name: '新项目',
        nodes: { create: NODE_DEFAULTS },
      },
    })
    redirect(`/admin/projects/${project.id}`)
  }

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      nodes: { orderBy: { sortOrder: 'asc' } },
      photos: { orderBy: { createdAt: 'desc' }, take: 20 },
      notes: { orderBy: { createdAt: 'desc' } },
    },
  })
  if (!project) notFound()

  const doneNodes = project.nodes.filter(n => ['passed', 'reviewed'].includes(n.status)).length
  const pct = project.nodes.length > 0 ? Math.round((doneNodes / project.nodes.length) * 100) : 0

  return (
    <div className="max-w-[1400px] space-y-5">
      {/* 面包屑 */}
      <div className="flex items-center gap-2 text-xs text-[#706860]">
        <Link href="/admin/projects" className="hover:text-[#C4A882] transition-colors">← 工地总览</Link>
        <span>/</span>
        <span className="text-[#A09890]">{project.name}</span>
      </div>

      {/* 头部 */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-[#E8E2DA] tracking-tight">{project.name}</h1>
          <div className="flex items-center gap-3 mt-2 text-xs text-[#706860]">
            {project.clientName && <span>业主：{project.clientName}</span>}
            {project.city && <span>{project.city}</span>}
            {project.area && <span>{project.area}㎡</span>}
            {project.homeType && <span>{project.homeType}</span>}
          </div>
        </div>
        {statusBadge(project.status)}
      </div>

      {/* 基本信息 + 进度 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 工地信息 */}
        <div className="border border-[#3A3530] bg-[#1f1d1a] p-5 lg:col-span-1">
          <h2 className="text-sm font-semibold text-[#E8E2DA] mb-4">工地信息</h2>
          <div className="space-y-2 text-xs">
            {[
              ['业主', project.clientName],
              ['电话', project.clientPhone],
              ['微信', project.clientWechat],
              ['城市', project.city],
              ['地址', project.address],
              ['面积', project.area ? `${project.area}㎡` : null],
              ['预算', project.budget ? `¥${(project.budget / 100).toLocaleString()}` : null],
              ['户型', project.homeType],
              ['风格', project.style],
              ['来源', project.source],
              ['开工', project.startedAt ? new Date(project.startedAt).toLocaleDateString('zh-CN') : null],
              ['竣工', project.completedAt ? new Date(project.completedAt).toLocaleDateString('zh-CN') : null],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <span className="text-[#706860]">{label}</span>
                <span className="text-[#A09890]">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 节点追踪 */}
        <div className="border border-[#3A3530] bg-[#1f1d1a] p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#E8E2DA]">节点追踪</h2>
            <span className="text-xs text-[#706860]">
              {doneNodes}/{project.nodes.length} 完成 · {pct}%
            </span>
          </div>
          {/* 进度条 */}
          <div className="h-2 bg-[#141410] border border-[#2A2825] rounded-full overflow-hidden mb-5">
            <div className="h-full bg-[#C4A882] rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          {/* 节点列表 */}
          <div className="space-y-2">
            {project.nodes.map(node => (
              <div key={node.id} className={`border p-3 rounded-sm ${node.status === 'passed' ? 'border-green-400/20 bg-green-400/5' : node.status === 'failed' ? 'border-[#d2846f]/20 bg-[#d2846f]/5' : 'border-[#3A3530] bg-[#252320]'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#504840] font-mono w-4">{String(node.sortOrder).padStart(2, '0')}</span>
                    <span className="text-sm font-medium text-[#E8E2DA]">{node.name}</span>
                    <span className={`text-xs ${nodeStatusColor(node.status)}`}>{nodeStatusLabel(node.status)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[0.6rem] text-[#504840]">
                    {node.scheduledAt && <span>计划 {new Date(node.scheduledAt).toLocaleDateString('zh-CN')}</span>}
                    {node.submittedAt && <span>提交 {new Date(node.submittedAt).toLocaleDateString('zh-CN')}</span>}
                    {node.reviewedAt && <span>审核 {new Date(node.reviewedAt).toLocaleDateString('zh-CN')}</span>}
                  </div>
                </div>
                {node.zenoFeedback && (
                  <p className="mt-2 text-xs text-[#A09890] bg-[#141410] p-2 border border-[#2A2825]">
                    💬 {node.zenoFeedback}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 照片 + 备注 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="border border-[#3A3530] bg-[#1f1d1a] p-5">
          <h2 className="text-sm font-semibold text-[#E8E2DA] mb-4">
            照片归档
            {project.photos.length > 0 && <span className="text-xs text-[#706860] ml-2 font-normal">({project.photos.length})</span>}
          </h2>
          {project.photos.length === 0 ? (
            <p className="text-xs text-[#706860]">暂无照片</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {project.photos.map(photo => (
                <div key={photo.id} className="aspect-square bg-[#252320] border border-[#3A3530] overflow-hidden">
                  <img src={photo.url} alt={photo.caption || ''} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border border-[#3A3530] bg-[#1f1d1a] p-5">
          <h2 className="text-sm font-semibold text-[#E8E2DA] mb-4">
            沟通备注
            {project.notes.length > 0 && <span className="text-xs text-[#706860] ml-2 font-normal">({project.notes.length})</span>}
          </h2>
          {project.notes.length === 0 ? (
            <p className="text-xs text-[#706860]">暂无备注</p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {project.notes.map(note => (
                <div key={note.id} className="border border-[#3A3530] bg-[#252320] p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[0.6rem] text-[#706860] uppercase">{note.type === 'client_comm' ? '业主沟通' : note.type === 'change_order' ? '变更确认' : note.type === 'settlement' ? '结算记录' : '备注'}</span>
                    <span className="text-[0.6rem] text-[#504840]">{new Date(note.createdAt).toLocaleString('zh-CN')}</span>
                  </div>
                  <p className="text-xs text-[#A09890] leading-relaxed">{note.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
