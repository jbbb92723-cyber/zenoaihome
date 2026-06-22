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
    default: '赞诺｜装修判断·居住决策',
    template: '%s · 赞诺',
  },
  description:
    '从装修和床垫出发，用AI把16年经验变成判断、内容和一人公司模式。装修避坑、床垫选购、报价审核、合同把关——只说真话。',
  keywords: ['赞诺', '装修避坑', '床垫干货', '报价审核', '合同把关', 'AI实战', '一人公司', 'IP方法论', '生活方式'],
  authors: [{ name: '赞诺 Zeno' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://zenoaihome.com',
    siteName: '赞诺',
    title: '赞诺｜装修判断·居住决策',
    description:
      '从装修和床垫出发，用AI把16年经验变成判断、内容和一人公司模式。装修判断、床垫选购、报价审核——16年经验只说真话。',
    images: [
      {
        url: 'https://zenoaihome.com/images/og-default.png',
        width: 1200,
        height: 630,
        alt: '赞诺｜装修判断·居住决策',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '赞诺｜装修判断·居住决策',
    description:
      '从装修和床垫出发，用AI把16年经验变成判断、内容和一人公司模式。',
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
