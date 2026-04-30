import type { Metadata } from 'next'
import Link from 'next/link'
import { getAdminNotes } from '@/lib/notes'
import AdminNoteDeleteButton from '@/components/admin/AdminNoteDeleteButton'
import AdminNoteQuickCreate from '@/components/admin/AdminNoteQuickCreate'

export const metadata: Metadata = { title: '笔记管理 · Admin' }

// 后台管理页强制动态渲染，防止构建时缓存数据
export const dynamic = 'force-dynamic'

const VISIBILITY_LABEL: Record<string, { label: string; color: string }> = {
  PUBLIC:  { label: '公开', color: 'text-green-400' },
  PRIVATE: { label: '私密', color: 'text-yellow-400' },
  DRAFT:   { label: '草稿', color: 'text-[#706860]' },
}

export default async function AdminNotesPage() {
  const notes = await getAdminNotes()

  const counts = {
    total:   notes.length,
    public:  notes.filter((n) => n.visibility === 'PUBLIC').length,
    private: notes.filter((n) => n.visibility === 'PRIVATE').length,
    draft:   notes.filter((n) => n.visibility === 'DRAFT').length,
  }

  return (
    <div className="max-w-5xl space-y-6">
      {/* ── 顶部标题栏 ── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[0.65rem] text-[#706860] uppercase tracking-widest font-semibold mb-1">Admin · 思考札记</p>
          <h1 className="text-xl font-semibold text-[#E8E2DA] tracking-tight">笔记管理</h1>
        </div>
        <Link
          href="/admin/notes/new"
          className="px-4 py-2 text-sm bg-[#C4A882]/15 text-[#C4A882] border border-[#C4A882]/30 hover:bg-[#C4A882]/20 transition-colors"
        >
          写完整笔记 →
        </Link>
      </div>

      {/* ── 统计卡 ── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: '全部',  value: counts.total,   color: 'text-[#E8E2DA]' },
          { label: '公开',  value: counts.public,  color: 'text-green-400' },
          { label: '私密',  value: counts.private, color: 'text-yellow-400' },
          { label: '草稿',  value: counts.draft,   color: 'text-[#706860]' },
        ].map((s) => (
          <div key={s.label} className="border border-[#3A3530] bg-[#252320] px-4 py-3">
            <p className="text-xs text-[#706860] mb-1">{s.label}</p>
            <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── 快速新建（inline 表单，最小操作路径） ── */}
      <AdminNoteQuickCreate />

      {/* ── 笔记列表 ── */}
      <div className="border border-[#3A3530] bg-[#252320] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#3A3530]">
              {['标题 / Slug', '分类', '标签', '状态', '时间', '操作'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs text-[#706860] uppercase tracking-widest font-semibold whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {notes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-[#706860] text-sm">
                  还没有笔记。用上方表单快速记录，或点击「写完整笔记」。
                </td>
              </tr>
            ) : (
              notes.map((note) => {
                const vis = VISIBILITY_LABEL[note.visibility] ?? VISIBILITY_LABEL.DRAFT
                const date = new Date(note.createdAt).toLocaleDateString('zh-CN', {
                  month: '2-digit',
                  day: '2-digit',
                })
                return (
                  <tr
                    key={note.id}
                    className="border-b border-[#3A3530] last:border-0 hover:bg-[#2A2825] transition-colors"
                  >
                    <td className="px-4 py-3 max-w-[220px]">
                      <p className="text-[#E8E2DA] truncate text-sm" title={note.title}>
                        {note.featured && <span className="text-[#C4A882] mr-1">★</span>}
                        {note.title}
                      </p>
                      <p className="text-xs text-[#504840] font-mono truncate mt-0.5">{note.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-[#A09890] text-xs whitespace-nowrap">
                      {note.category ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-[#504840] text-xs max-w-[100px] truncate">
                      {note.tags.length > 0 ? note.tags.slice(0, 2).join(' · ') : '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-xs font-medium ${vis.color}`}>{vis.label}</span>
                    </td>
                    <td className="px-4 py-3 text-[#706860] text-xs whitespace-nowrap">{date}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/notes/${note.id}/edit`}
                          className="text-xs text-[#C4A882] hover:underline"
                        >
                          编辑
                        </Link>
                        {note.visibility === 'PUBLIC' && (
                          <Link
                            href={`/notes/${note.slug}`}
                            target="_blank"
                            className="text-xs text-[#706860] hover:text-[#A09890] transition-colors"
                          >
                            预览↗
                          </Link>
                        )}
                        <AdminNoteDeleteButton id={note.id} title={note.title} />
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
