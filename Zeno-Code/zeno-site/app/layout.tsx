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
    default: 'Zeno · 家装不该靠运气',
    template: '%s · Zeno',
  },
  description:
    '17年装修老兵转型AI全栈。家装平权实践者——C端打破信息不对称，B端为好工长连接好业主。家装不该靠运气。',
  keywords: ['Zeno', '赞诺', '家装平权', '装修判断', 'AI装修', '装修报价审核', '传统行业AI', '一人公司', 'OPC社群'],
  authors: [{ name: 'Zeno', url: 'https://zenoaihome.com' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://zenoaihome.com',
    siteName: 'Zeno',
    title: 'Zeno · 家装不该靠运气',
    description:
      '17年装修老兵转型AI全栈。家装平权实践者——C端打破信息不对称，B端为好工长连接好业主。家装不该靠运气。',
    images: [
      {
        url: 'https://zenoaihome.com/images/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Zeno · 家装不该靠运气',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zeno · 家装不该靠运气',
    description:
      '17年装修老兵转型AI全栈。家装平权实践者——C端打破信息不对称，B端为好工长连接好业主。家装不该靠运气。',
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
