import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { markdownComponents } from '@/components/features/content/markdown-components'
import Container from '@/components/ui/Container'
import CopyLinkButton from '@/components/ui/CopyLinkButton'
import StructuredData from '@/components/ui/StructuredData'
import { getPublicNoteBySlug } from '@/lib/notes'

interface Props {
  // Next.js 15: params 是 Promise，必须 await
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  // 只为 PUBLIC 笔记生成 metadata，其余返回空对象（不泄露 PRIVATE/DRAFT 标题）
  const note = await getPublicNoteBySlug(slug)
  if (!note) return {}
  const noteUrl = `https://zenoaihome.com/notes/${note.slug}`
  const description = note.excerpt?.trim()
    || `赞诺关于「${note.title}」的思考札记，记录装修、AI、商业与长期实践中的观察和判断。`
  const image = 'https://zenoaihome.com/images/brand/zeno-portrait.jpg'

  return {
    title: `${note.title}｜思考札记`,
    description,
    openGraph: {
      title: note.title,
      description,
      type: 'article',
      locale: 'zh_CN',
      url: noteUrl,
      publishedTime: note.createdAt.toISOString(),
      modifiedTime: note.updatedAt.toISOString(),
      images: [{ url: image, width: 940, height: 940, alt: '赞诺 Zeno' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: note.title,
      description,
      images: [image],
    },
    alternates: {
      canonical: noteUrl,
    },
  }
}

export default async function NoteDetailPage({ params }: Props) {
  const { slug } = await params
  // getPublicNoteBySlug 已对 PRIVATE/DRAFT 返回 null，保证前台不泄露内容
  const note = await getPublicNoteBySlug(slug)
  if (!note) notFound()

  const formattedDate = new Date(note.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const noteUrl = `https://zenoaihome.com/notes/${note.slug}`

  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: '首页',
              item: 'https://zenoaihome.com/',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: '思考札记',
              item: 'https://zenoaihome.com/notes',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: note.title,
              item: noteUrl,
            },
          ],
        }}
      />
      {/* ───── 文章头部 ───── */}
      <div className="pt-12 sm:pt-16 pb-10 sm:pb-12 border-b border-border">
        <Container size="reading">
          {/* 面包屑 */}
          <nav aria-label="面包屑" className="mb-6 flex min-w-0 items-center gap-2 text-xs text-ink-muted">
            <Link href="/" className="shrink-0 transition-colors hover:text-stone">首页</Link>
            <span aria-hidden>/</span>
            <Link href="/notes" className="shrink-0 transition-colors hover:text-stone">思考札记</Link>
            <span aria-hidden>/</span>
            <span className="truncate text-stone" aria-current="page">{note.title}</span>
          </nav>

          <h1 className="page-title mb-5">{note.title}</h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
            <time>{formattedDate}</time>
            {note.category && (
              <>
                <span className="text-border">·</span>
                <span className="text-stone">{note.category}</span>
              </>
            )}
            {note.tags.length > 0 && (
              <>
                <span className="text-border">·</span>
                <span>{note.tags.join(' · ')}</span>
              </>
            )}
          </div>
        </Container>
      </div>

      {/* ───── 正文（Markdown） ───── */}
      <Container size="reading" className="py-12 sm:py-16">
        {/* excerpt 摘要区域，与正文隔开 */}
        {note.excerpt && (
          <p className="text-base text-ink-muted leading-relaxed border-l-2 border-stone/30 pl-4 mb-10 italic">
            {note.excerpt}
          </p>
        )}

        <div className="article-prose prose prose-stone prose-sm sm:prose-base max-w-none
          prose-headings:font-semibold prose-headings:tracking-tight
          prose-a:text-stone prose-a:underline-offset-2
          prose-blockquote:border-l-stone/40 prose-blockquote:text-ink-muted
          prose-code:text-stone prose-code:bg-surface prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-surface prose-pre:border prose-pre:border-border
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {note.content}
          </ReactMarkdown>
        </div>

        {/* ───── 底部操作栏 ───── */}
        <div className="mt-12 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/notes"
            className="text-sm text-ink-muted hover:text-stone transition-colors"
          >
            ← 返回思考札记
          </Link>
          <CopyLinkButton />
        </div>
      </Container>
    </>
  )
}
