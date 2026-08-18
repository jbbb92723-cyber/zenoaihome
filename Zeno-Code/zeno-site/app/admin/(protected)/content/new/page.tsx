import type { Metadata } from 'next'
import ContentAssistantForm from '@/components/admin/ContentAssistantForm'

export const metadata: Metadata = { title: '新建内容草稿 · Admin' }

export default function AdminContentNewPage() {
  return (
    <div className="max-w-5xl space-y-6">
      <header>
        <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-widest text-[#706860]">
          Admin · Shadow Zeno
        </p>
        <h1 className="text-xl font-semibold tracking-tight text-[#E8E2DA]">新建内容草稿</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#706860]">
          把现场记录、照片观察文字或已有语音转写整理为“现象—风险—判断—对策”候选稿。生成结果只进入现有草稿库，等待人工核对。
        </p>
      </header>

      <ContentAssistantForm />
    </div>
  )
}
