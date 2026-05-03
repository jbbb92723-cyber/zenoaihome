import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import NoteForm from '@/components/admin/NoteForm'
import { getAdminNoteById } from '@/lib/notes'

export const metadata: Metadata = { title: '编辑笔记 · Admin' }

// 强制动态渲染（每次编辑都从数据库读取最新数据）
export const dynamic = 'force-dynamic'

interface Props {
  // Next.js 15: params 是 Promise，必须 await
  params: Promise<{ id: string }>
}

export default async function AdminNoteEditPage({ params }: Props) {
  const { id } = await params
  const note = await getAdminNoteById(id)
  if (!note) notFound()

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="text-[0.65rem] text-[#706860] uppercase tracking-widest font-semibold mb-1">Admin · 思考札记</p>
        <h1 className="text-xl font-semibold text-[#E8E2DA] tracking-tight">编辑笔记</h1>
        <p className="text-xs text-[#706860] mt-1 font-mono">{note.slug}</p>
      </div>
      <NoteForm mode="edit" id={note.id} defaultValues={note} />
    </div>
  )
}
