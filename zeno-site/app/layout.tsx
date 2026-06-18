import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { SessionProvider } from 'next-auth/react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SearchDialog from '@/components/layout/SearchDialog'
import ConditionalAIWidget from '@/components/layout/ConditionalAIWidget'
import HashScrollHandler from '@/components/layout/HashScrollHandler'
import '@/styles/globals.css'


export const metadata: Metadata = {
  title: {
    default: 'ZenoAIHome | 16年床垫与装修老兵，只说真话的家居避坑指南',
    template: '%s · ZenoAIHome',
  },
  description:
    '16年床垫与装修老兵赞诺的个人网站。装修避坑、床垫干货、生活方式、IP方法论、AI实战、OPC社群——只说真话，不卖货。',
  keywords: ['装修避坑', '床垫干货', '家居避坑', '装修合同', '床垫选购', '生活方式', 'AI实战', '一人公司', '赞诺', 'Zeno'],
  authors: [{ name: 'Zeno · 赞诺' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://zenoaihome.com',
    siteName: 'ZenoAIHome',
    title: 'ZenoAIHome | 16年床垫与装修老兵，只说真话的家居避坑指南',
    description:
      '装修避坑、床垫干货、生活方式、IP方法论、AI实战、OPC社群——16年行业老兵赞诺，把真金白银换来的经验全部公开。',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZenoAIHome | 16年床垫与装修老兵，只说真话的家居避坑指南',
    description:
      '装修避坑、床垫干货、生活方式、IP方法论、AI实战、OPC社群——16年行业老兵赞诺的私人自留地。',
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
