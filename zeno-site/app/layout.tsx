import type { Metadata } from 'next'
import { Inter, Noto_Sans_SC } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SessionProvider } from 'next-auth/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-noto',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Zeno 赞诺｜Zeno AI Home — 从熟悉行业出发，用 AI、产品和内容搭建个人事业系统',
    template: '%s · Zeno 赞诺',
  },
  description:
    '我是 Zeno。装修行业 16 年，现在用 AI、开发、内容和产品化能力，把真实经验逐步沉淀成可复用、可交易、可持续的个人资产。',
  keywords: ['装修', '居住', 'AI 实践', '一人公司', '数字产品', '工具', '内容资产', '长期主义'],
  authors: [{ name: 'Zeno' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://zenoaihome.com',
    siteName: 'Zeno 赞诺',
    title: 'Zeno 赞诺 — 从熟悉行业出发，用 AI、产品和内容搭建个人事业系统',
    description:
      '我是 Zeno。装修行业 16 年，现在用 AI、开发、内容和产品化能力，把真实经验逐步沉淀成可复用、可交易、可持续的个人资产。',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zeno 赞诺 — 从熟悉行业出发，用 AI、产品和内容搭建个人事业系统',
    description:
      '装修是入口，不是终局。用 AI、内容、工具和产品化，搭建更自由的个人事业系统。',
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
    <html lang="zh-CN" className={`${inter.variable} ${notoSansSC.variable}`} suppressHydrationWarning>
      <body className="bg-canvas text-ink font-sans antialiased">
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} themes={['light', 'eye', 'dark']}>
            <Header />
            <main className="min-h-[calc(100vh-56px)]">{children}</main>
            <Footer />
          </ThemeProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
