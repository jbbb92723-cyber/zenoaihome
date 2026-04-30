import type { Metadata } from 'next'
import Link from 'next/link'
import { getAdminNotes } from '@/lib/notes'

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

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[0.65rem] text-[#706860] uppercase tracking-widest font-semibold mb-1">Admin</p>
          <h1 className="text-xl font-semibold text-[#E8E2DA]">思考札记管理</h1>
        </div>
        <Link
          href="/admin/notes/new"
          className="px-4 py-2 text-sm bg-[#C4A882]/15 text-[#C4A882] border border-[#C4A882]/30 hover:bg-[#C4A882]/20 transition-colors"
        >
          + 新建笔记
        </Link>
      </div>

      <div className="text-sm text-[#706860] mb-5">共 {notes.length} 条笔记</div>

      <div className="border border-[#3A3530] bg-[#252320] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#3A3530]">
              {['标题', '分类', '状态', '创建时间', '操作'].map((h) => (
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
                <td colSpan={5} className="px-4 py-8 text-center text-[#706860] text-sm">
                  暂无笔记，点击「新建笔记」开始写。
                </td>
              </tr>
            ) : (
              notes.map((note) => {
                const vis = VISIBILITY_LABEL[note.visibility] ?? VISIBILITY_LABEL.DRAFT
                const date = new Date(note.createdAt).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })
                return (
                  <tr
                    key={note.id}
                    className="border-b border-[#3A3530] last:border-0 hover:bg-[#2A2825] transition-colors"
                  >
                    <td className="px-4 py-3 text-[#E8E2DA] max-w-xs truncate">
                      <span title={note.title}>{note.title}</span>
                      <span className="block text-xs text-[#706860] mt-0.5">{note.slug}</span>
                    </td>
                    <td className="px-4 py-3 text-[#A09890] whitespace-nowrap">
                      {note.category ?? '—'}
                    </td>
                    <td className={`px-4 py-3 font-medium whitespace-nowrap ${vis.color}`}>
                      {vis.label}
                    </td>
                    <td className="px-4 py-3 text-[#706860] whitespace-nowrap">{date}</td>
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
                            预览 ↗
                          </Link>
                        )}
                        {/* 删除按钮：Client 组件处理，此处用链接跳转到带确认的操作 */}
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

// ─── 删除按钮（client island）────────────────────────────────
// 内联小型 client 组件，避免为此单独建立文件
import AdminNoteDeleteButton from '@/components/admin/AdminNoteDeleteButton'
