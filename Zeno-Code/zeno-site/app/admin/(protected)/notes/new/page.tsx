import type { Metadata } from 'next'
import NoteForm from '@/components/admin/NoteForm'

export const metadata: Metadata = { title: '新建笔记 · Admin' }

export default function AdminNotesNewPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="text-[0.65rem] text-[#706860] uppercase tracking-widest font-semibold mb-1">Admin · 思考札记</p>
        <h1 className="text-xl font-semibold text-[#E8E2DA] tracking-tight">新建笔记</h1>
      </div>
      <NoteForm mode="create" />
    </div>
  )
}
