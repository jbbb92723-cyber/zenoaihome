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
    default: 'ZenoAIHome — 美学与生活结合后的装修判断系统',
    template: '%s · ZenoAIHome',
  },
  description:
    'ZenoAIHome 帮业主把理想生活翻译成可落地的空间方案、装修决策、预算边界、合同约定和交付风险控制。先看生活与美学，再看报价合同能不能承接。',
  keywords: ['居住判断', '装修决策', '美学与生活', '装修报价', '装修预算', '装修合同', '报价风险', '签约前判断'],
  authors: [{ name: 'Zeno' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://zenoaihome.com',
    siteName: 'ZenoAIHome',
    title: 'ZenoAIHome — 美学与生活结合后的装修判断系统',
    description:
      '把生活方式、审美取舍、空间方案、预算边界、报价合同和交付风险放在一起判断。',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZenoAIHome — 美学与生活结合后的装修判断系统',
    description:
      '从想要的生活开始，判断空间方案、装修决策、预算报价、合同约定和交付风险能不能真正落地。',
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
