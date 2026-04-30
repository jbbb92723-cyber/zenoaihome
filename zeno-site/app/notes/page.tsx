import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import NoteCard from '@/components/NoteCard'
import PageHero from '@/components/PageHero'
import { getPublicNotes, NOTE_CATEGORIES } from '@/lib/notes'

export const metadata: Metadata = {
  title: '思考札记 · Zeno',
  description:
    '记录我在装修、AI、商业、学习和长期主义中的真实思考。这里不是正式文章库，而是一些正在生长的方法论、判断和现场笔记。',
}

// 强制动态渲染，内容来自数据库，不应构建时缓存
export const dynamic = 'force-dynamic'

export default async function NotesPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const notes = await getPublicNotes()

  const activeCategory = searchParams.category ?? '全部'
  const filtered =
    activeCategory === '全部'
      ? notes
      : notes.filter((n) => n.category === activeCategory)

  const allCategories = ['全部', ...NOTE_CATEGORIES]

  return (
    <>
      <PageHero
        label="思考札记"
        title="思考札记"
        subtitle="记录我在装修、AI、商业、学习和长期主义中的真实思考。这里不是正式文章库，而是一些正在生长的方法论、判断和现场笔记。"
      />

      <Container size="content" className="py-12 sm:py-16">
        {/* 分类筛选 */}
        <div className="flex flex-wrap gap-2 mb-10">
          {allCategories.map((cat) => (
            <Link
              key={cat}
              href={cat === '全部' ? '/notes' : `/notes?category=${encodeURIComponent(cat)}`}
              className={`text-sm px-4 py-1.5 border transition-colors ${
                activeCategory === cat
                  ? 'border-stone bg-stone text-white'
                  : 'border-border text-ink-muted hover:border-stone hover:text-stone'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* 笔记列表 */}
        <div>
          {filtered.length === 0 ? (
            <p className="text-sm text-ink-muted py-8">该分类暂无内容。</p>
          ) : (
            filtered.map((note) => <NoteCard key={note.id} note={note} />)
          )}
        </div>
      </Container>
    </>
  )
}
