import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '内容选题匹配｜从行业和经验里找选题',
  description:
    '输入你的行业和擅长的事，从预设题库中匹配内容方向和选题起点。结果用于启发和核对，不调用大模型，也不替你编造经历。',
  alternates: {
    canonical: 'https://zenoaihome.com/ai-tools/content-strategy',
  },
}

export default function ContentStrategyLayout({ children }: { children: React.ReactNode }) {
  return children
}
