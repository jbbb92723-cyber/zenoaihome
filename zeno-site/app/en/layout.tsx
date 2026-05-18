import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'ZenoAIHome — Renovation Quote Risk Check',
    template: '%s · ZenoAIHome',
  },
  description:
    'Selective English edition of ZenoAIHome. Before signing a renovation contract, understand what the quote does not clearly say.',
  // 英文页保留给 LLM 抓取做出海摘要，但不进搜索引擎索引，
  // 避免被判断为半成品 / 重复内容拖累中文站排名。
  robots: { index: false, follow: true },
  alternates: {
    canonical: 'https://zenoaihome.com/en',
  },
}

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="en">
      <div className="border-y-2 border-[#9a5424] bg-[#fbf3e9] px-5 py-3 text-center text-[0.78rem] leading-relaxed text-[#5f3b24]">
        <span className="font-semibold">Selective English edition.</span>{' '}
        The full quote-risk tools and service flow are in Chinese.{' '}
        <a href="https://zenoaihome.com/" className="font-semibold text-[#7f421a] underline underline-offset-2 hover:text-[#5f3b24]">
          Go to Chinese version →
        </a>
        <span className="mx-2 text-[#9a5424]/40">|</span>
        <span lang="zh-CN" className="text-[#7b6d5d]">中文用户请点上方链接返回中文主站</span>
      </div>
      {children}
    </div>
  )
}
