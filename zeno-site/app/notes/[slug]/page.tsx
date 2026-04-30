import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Container from '@/components/Container'
import CopyLinkButton from '@/components/CopyLinkButton'
import { getPublicNoteBySlug } from '@/lib/notes'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 只为 PUBLIC 笔记生成 metadata，其余返回空对象（不泄露 PRIVATE/DRAFT 标题）
  const note = await getPublicNoteBySlug(params.slug)
  if (!note) return {}
  return {
    title: `${note.title} · 思考札记 · Zeno`,
    description: note.excerpt ?? undefined,
    openGraph: {
      title: note.title,
      description: note.excerpt ?? undefined,
      type: 'article',
      locale: 'zh_CN',
      publishedTime: note.createdAt.toISOString(),
    },
    alternates: {
      canonical: `https://zenoaihome.com/notes/${note.slug}`,
    },
  }
}

export default async function NoteDetailPage({ params }: Props) {
  // getPublicNoteBySlug 已对 PRIVATE/DRAFT 返回 null，保证前台不泄露内容
  const note = await getPublicNoteBySlug(params.slug)
  if (!note) notFound()

  const formattedDate = new Date(note.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      {/* ───── 文章头部 ───── */}
      <div className="pt-12 sm:pt-16 pb-10 sm:pb-12 border-b border-border">
        <Container size="reading">
          {/* 面包屑 */}
          <div className="flex items-center gap-2 text-xs text-ink-muted mb-6">
            <Link href="/" className="hover:text-stone transition-colors">首页</Link>
            <span>·</span>
            <Link href="/notes" className="hover:text-stone transition-colors">思考札记</Link>
            {note.category && (
              <>
                <span>·</span>
                <Link
                  href={`/notes?category=${encodeURIComponent(note.category)}`}
                  className="hover:text-stone transition-colors"
                >
                  {note.category}
                </Link>
              </>
            )}
          </div>

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

        <div className="prose prose-stone prose-sm sm:prose-base max-w-none
          prose-headings:font-semibold prose-headings:tracking-tight
          prose-a:text-stone prose-a:underline-offset-2
          prose-blockquote:border-l-stone/40 prose-blockquote:text-ink-muted
          prose-code:text-stone prose-code:bg-surface prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-surface prose-pre:border prose-pre:border-border
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
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
