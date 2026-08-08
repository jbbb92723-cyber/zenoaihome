import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { Noto_Sans_SC, Noto_Serif_SC } from 'next/font/google'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { SessionProvider } from 'next-auth/react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SearchDialog from '@/components/layout/SearchDialog'
import ConditionalAIWidget from '@/components/layout/ConditionalAIWidget'
import HashScrollHandler from '@/components/layout/HashScrollHandler'
import '@/styles/globals.css'

// ── 字体：正文思源黑体 + 标题思源宋体（next/font 自托管，构建时下载）──
const notoSans = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const notoSerif = Noto_Serif_SC({
  weight: ['500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Zeno 赞诺｜传统行业、AI 实践与一人公司',
    template: '%s · Zeno',
  },
  description:
    '赞诺的个人博客与公开实践。记录17年传统行业经验如何进入AI知识库、工作流、智能体、内容系统与一人公司，并公开可直接使用的文章和工具。',
  keywords: ['Zeno', '赞诺', '陈国赞', '传统行业AI', 'AI落地', '企业知识库', 'AI智能体', '一人公司', 'OPC', '星火者共同体'],
  authors: [{ name: 'Zeno', url: 'https://zenoaihome.com' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://zenoaihome.com',
    siteName: 'Zeno 赞诺',
    title: 'Zeno 赞诺｜传统行业、AI 实践与一人公司',
    description:
      '一个传统行业人的个人博客。公开记录AI知识库、工作流、智能体、内容系统与一人公司的真实实践。',
    images: [
      {
        url: 'https://zenoaihome.com/images/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Zeno 赞诺｜传统行业、AI 实践与一人公司',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zeno 赞诺｜传统行业、AI 实践与一人公司',
    description:
      '一个传统行业人的个人博客。公开记录AI知识库、工作流、智能体、内容系统与一人公司的真实实践。',
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
      <body className={`${notoSans.variable} ${notoSerif.variable} bg-canvas text-ink font-sans antialiased`}>
        <noscript>
          <style>{`.reveal { opacity: 1 !important; transform: none !important; transition: none !important; }`}</style>
        </noscript>
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
