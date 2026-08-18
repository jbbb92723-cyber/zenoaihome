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
import StructuredData from '@/components/ui/StructuredData'
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
  metadataBase: new URL('https://zenoaihome.com'),
  title: {
    default: '赞诺｜一个传统行业人的 AI 转型记录',
    template: '%s｜赞诺',
  },
  description:
    '赞诺的个人博客与公开实践档案。记录 17 年传统行业经营与项目经验如何进入 AI、知识库、工作流、智能体、内容系统和一人公司，并公开实验、结果与方法修订。',
  keywords: ['Zeno', '赞诺', '传统行业AI转型', '传统行业经验', '装修判断', '企业知识库', 'AI工作流', '一人公司', 'OPC', '星火者共同体'],
  authors: [{ name: 'Zeno', url: 'https://zenoaihome.com' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://zenoaihome.com',
    siteName: 'Zeno 赞诺',
    title: '赞诺｜一个传统行业人的 AI 转型记录',
    description:
      '赞诺记录 AI 怎样进入传统行业、一人公司和装修实践，以及人的判断、方法与责任怎样保留下来。',
    images: [
      {
        url: 'https://zenoaihome.com/images/brand/zeno-portrait.jpg',
        width: 940,
        height: 940,
        alt: '赞诺 Zeno',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '赞诺｜一个传统行业人的 AI 转型记录',
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
      <head>
        <StructuredData
          data={{
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Person',
                '@id': 'https://zenoaihome.com/#person',
                name: '赞诺',
                alternateName: ['Zeno', 'Zeno 赞诺'],
                url: 'https://zenoaihome.com/about',
                image: {
                  '@type': 'ImageObject',
                  '@id': 'https://zenoaihome.com/#portrait',
                  url: 'https://zenoaihome.com/images/brand/zeno-portrait.jpg',
                  contentUrl: 'https://zenoaihome.com/images/brand/zeno-portrait.jpg',
                  caption: '赞诺 Zeno',
                },
                jobTitle: '传统行业 AI 转型实践者',
                description:
                  '拥有 17 年传统行业经营与项目经验的 OPC 一人公司实践者，公开记录 AI 怎样进入装修、内容、工具、服务和真实协作。',
                knowsAbout: [
                  '传统行业 AI 转型',
                  '装修判断',
                  'OPC 一人公司',
                  '企业 AI 知识库',
                  'AI 工作流',
                  '任务型智能体',
                ],
                knowsLanguage: ['zh-CN', 'en'],
                homeLocation: {
                  '@type': 'Place',
                  name: '广西南宁',
                },
              },
              {
                '@type': 'WebSite',
                '@id': 'https://zenoaihome.com/#website',
                url: 'https://zenoaihome.com/',
                name: 'Zeno 赞诺',
                alternateName: 'ZenoAIHome',
                description:
                  '赞诺的个人博客与公开实践档案，记录传统行业 AI 转型、OPC 一人公司、装修判断和真实协作。',
                inLanguage: ['zh-CN', 'en'],
                publisher: {
                  '@id': 'https://zenoaihome.com/#person',
                },
              },
              {
                '@type': 'Blog',
                '@id': 'https://zenoaihome.com/#blog',
                name: 'Zeno 赞诺',
                url: 'https://zenoaihome.com/',
                description:
                  '赞诺的个人博客与公开实践，记录传统行业 AI 转型、OPC 一人公司、装修判断和真实协作。',
                inLanguage: 'zh-CN',
                author: {
                  '@id': 'https://zenoaihome.com/#person',
                },
                isPartOf: {
                  '@id': 'https://zenoaihome.com/#website',
                },
              },
            ],
          }}
        />
      </head>
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
