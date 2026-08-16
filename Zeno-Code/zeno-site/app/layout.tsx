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
    default: 'Zeno 赞诺｜传统行业 × AI 的公开实践',
    template: '%s · Zeno',
  },
  description:
    '赞诺的个人博客与公开实践档案。记录 17 年传统行业经营与项目经验如何进入 AI、知识库、工作流、智能体、内容系统和一人公司，并公开实验、结果与方法修订。',
  keywords: ['Zeno', '赞诺', '陈国赞', '经验资产化', '传统行业AI', '装修判断', '企业知识库', 'AI工作流', '一人公司', 'OPC', '星火者共同体'],
  authors: [{ name: 'Zeno', url: 'https://zenoaihome.com' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://zenoaihome.com',
    siteName: 'Zeno 赞诺',
    title: 'Zeno 赞诺｜传统行业 × AI 的公开实践',
    description:
      '赞诺记录人与 AI 如何把传统行业经验变成可检查、可使用、可修订的判断、内容、工具和服务。',
    images: [
      {
        url: 'https://zenoaihome.com/images/brand/zeno-portrait.jpg',
        width: 940,
        height: 940,
        alt: '赞诺 Zeno，陈国赞',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zeno 赞诺｜传统行业 × AI 的公开实践',
    description:
      '人先判断，AI 参与质疑，再用真实交付和反馈修订方法。',
    images: ['https://zenoaihome.com/images/brand/zeno-portrait.jpg'],
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
