import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SessionProvider } from 'next-auth/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SearchDialog from '@/components/SearchDialog'
import AIChatWidget from '@/components/AIChatWidget'
import HashScrollHandler from '@/components/HashScrollHandler'
import '@/styles/globals.css'


export const metadata: Metadata = {
  title: {
    default: 'ZenoAIHome — 装修签约前，先把报价风险看清楚',
    template: '%s · ZenoAIHome',
  },
  description:
    '16 年装修现场经验，帮业主在签约前看懂报价漏项、预算取舍和合同边界。先用免费工具初筛，再决定是否进入人工服务。',
  keywords: ['装修报价', '装修签约', '报价避坑', '装修预算', '装修合同', '报价审核', '签约前判断'],
  authors: [{ name: 'Zeno' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://zenoaihome.com',
    siteName: 'ZenoAIHome',
    title: 'ZenoAIHome — 装修签约前，先把报价风险看清楚',
    description:
      '16 年装修现场经验，帮业主在签约前看懂报价漏项、预算取舍和合同边界。先用免费工具初筛，再决定是否进入人工服务。',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZenoAIHome — 装修签约前，先把报价风险看清楚',
    description:
      '帮业主在签约前看懂报价漏项、预算取舍和合同边界。免费初筛 → ¥39 指南 → 人工快审。',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    languages: {
      'zh-CN': 'https://zenoaihome.com',
      en: 'https://zenoaihome.com/en',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="bg-canvas text-ink font-sans antialiased">
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} themes={['light', 'eye', 'dark']}>
            <HashScrollHandler />
            <Header />
            <main className="min-h-[calc(100dvh-56px)]">{children}</main>
            <Footer />
            <SearchDialog />
            <AIChatWidget />
          </ThemeProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
