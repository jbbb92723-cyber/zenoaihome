import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SessionProvider } from 'next-auth/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SearchDialog from '@/components/SearchDialog'
import ConditionalAIWidget from '@/components/ConditionalAIWidget'
import HashScrollHandler from '@/components/HashScrollHandler'
import '@/styles/globals.css'


export const metadata: Metadata = {
  title: {
    default: 'ZenoAIHome — 装修签约前，先把报价风险看清楚',
    template: '%s · ZenoAIHome',
  },
  description:
    'ZenoAIHome 帮业主在签约前看懂装修报价、合同和增项风险。先做免费初筛，再按材料进入 ¥99 报价风险初查、¥299 标准报价快审或 ¥699 深度版签约前判断。',
  keywords: ['装修报价', '装修签约', '报价风险', '装修预算', '装修合同', '报价审核', '签约前判断'],
  authors: [{ name: 'Zeno' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://zenoaihome.com',
    siteName: 'ZenoAIHome',
    title: 'ZenoAIHome — 装修签约前，先把报价风险看清楚',
    description:
      'ZenoAIHome 帮业主在签约前看懂装修报价、合同和增项风险。先做免费初筛，再按材料进入 ¥99 初查、¥299 快审或 ¥699 深度判断。',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZenoAIHome — 装修签约前，先把报价风险看清楚',
    description:
      '帮业主在签约前看懂报价漏项、合同边界和付款节点。免费初筛后，再按情况选择 ¥99 初查、¥299 快审或 ¥699 深度判断。',
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
            <ConditionalAIWidget />
          </ThemeProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
