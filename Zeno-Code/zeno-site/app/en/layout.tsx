import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Zeno | Renovation · Mattress · AI · Solo Business',
    template: '%s · Zeno',
  },
  description:
    '16 years in renovation and mattresses. Turning experience into judgment, content, and a one-person company with AI.',
  robots: { index: false, follow: true },
  alternates: {
    canonical: 'https://zenoaihome.com/en',
  },
}

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="en">
      <div className="border-y-2 border-stone bg-stone-pale px-5 py-3 text-center text-[0.78rem] leading-relaxed text-ink-muted">
        <span className="font-semibold">Selective English edition.</span>{' '}
        The full tools and service flow are still in Chinese; this edition explains the core judgment system in English.{' '}
        <a href="https://zenoaihome.com/" className="font-semibold text-stone underline underline-offset-2 hover:text-stone-deep">
          Go to Chinese version →
        </a>
        <span className="mx-2 text-stone-light">|</span>
        <span lang="zh-CN" className="text-ink-faint">中文用户请点上方链接返回中文主站</span>
      </div>
      {children}
    </div>
  )
}
