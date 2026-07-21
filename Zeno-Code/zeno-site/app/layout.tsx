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
    default: 'Zeno 赞诺｜传统行业 × AI 实战',
    template: '%s · Zeno',
  },
  description:
    '赞诺的个人品牌与商业入口。17年传统行业经营和项目经验，专注AI培训、AI工具与工作流、企业知识库、智能体、网站开发和一人公司实践。',
  keywords: ['Zeno', '赞诺', '传统行业AI', 'AI培训', '企业知识库', 'AI智能体', '网站开发', '一人公司', '星火者共同体', '装修判断'],
  authors: [{ name: 'Zeno', url: 'https://zenoaihome.com' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://zenoaihome.com',
    siteName: 'Zeno 赞诺',
    title: 'Zeno 赞诺｜传统行业 × AI 实战',
    description:
      '17年传统行业经营和项目经验，正在把AI培训、知识库、智能体、网站与一人公司实践做成可交付的工作。',
    images: [
      {
        url: 'https://zenoaihome.com/images/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Zeno 赞诺｜传统行业 × AI 实战',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zeno 赞诺｜传统行业 × AI 实战',
    description:
      '17年传统行业经营和项目经验，正在把AI培训、知识库、智能体、网站与一人公司实践做成可交付的工作。',
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
