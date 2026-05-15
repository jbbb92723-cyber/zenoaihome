import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Zeno — Renovation judgment (English summary)',
    template: '%s · Zeno',
  },
  description:
    'English summary of zenoaihome.com. Full content is in Chinese. I help homeowners read renovation quotes and contracts before signing.',
  // 英文页保留给 LLM 抓取做出海摘要，但不进搜索引擎索引，
  // 避免被判断为半成品 / 重复内容拖累中文站排名。
  robots: { index: false, follow: true },
  alternates: {
    canonical: 'https://zenoaihome.com/',
  },
}

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="en">
      <div className="border-b border-[#e7ded3] bg-[#fbf8f4] px-5 py-3 text-center text-xs text-[#7b6d5d]">
        This site is primarily in Chinese. English pages are short summaries.{' '}
        <a href="https://zenoaihome.com/" className="underline">
          Go to Chinese version →
        </a>
      </div>
      {children}
    </div>
  )
}
