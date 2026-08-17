import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '工作流任务拆解｜把任务变成可执行、可检查的步骤',
  description:
    '选择预设方法模板，把专业工作拆成可执行、可检查的步骤和完成标准。当前版本不调用模型，也不会替你自动完成任务。',
  alternates: {
    canonical: 'https://zenoaihome.com/ai-tools/task-planner',
  },
}

export default function TaskPlannerLayout({ children }: { children: React.ReactNode }) {
  return children
}
