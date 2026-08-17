import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '一人公司阶段自检｜产品、客户、收入与交付',
  description:
    '通过预设问题回看一人公司的产品、付费反馈、客户、收入和交付状态，得到阶段提示和下一次验证方向。结果不是完整商业诊断。',
  alternates: {
    canonical: 'https://zenoaihome.com/ai-tools/opc-diagnosis',
  },
}

export default function OpcDiagnosisLayout({ children }: { children: React.ReactNode }) {
  return children
}
