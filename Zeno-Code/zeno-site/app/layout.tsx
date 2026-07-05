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
    default: '赞诺｜传统行业 × AI 实战',
    template: '%s · 赞诺',
  },
  description:
    '17年装修老兵，用AI把自己重做了一遍。装修我都翻得过来，你做的事应该也能。',
  keywords: ['赞诺', 'AI培训', '传统行业AI', 'AI实战', '装修判断', '一人公司', 'OPC社群'],
  authors: [{ name: '赞诺 Zeno' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://zenoaihome.com',
    siteName: '赞诺',
    title: '赞诺｜传统行业 × AI 实战',
    description:
      '17年装修老兵，用AI把自己重做了一遍。装修我都翻得过来，你做的事应该也能。',
    images: [
      {
        url: 'https://zenoaihome.com/images/og-default.png',
        width: 1200,
        height: 630,
        alt: '赞诺｜传统行业 × AI 实战',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '赞诺｜传统行业 × AI 实战',
    description:
      '17年装修老兵，用AI把自己重做了一遍。装修我都翻得过来，你做的事应该也能。',
    images: ['https://zenoaihome.com/images/og-default.png'],
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
