import { NextRequest, NextResponse } from 'next/server'
import { articles } from '@/data/articles'
import { prisma } from '@/lib/prisma'

interface SearchResult {
  title: string
  href: string
  type: 'article' | 'note' | 'resource' | 'page'
  excerpt?: string
}

// Static pages for search
const staticPages: SearchResult[] = [
  { title: '首页', href: '/', type: 'page' },
  { title: '工具与资料', href: '/resources', type: 'page' },
  { title: '服务与合作', href: '/services', type: 'page' },
  { title: '思考札记', href: '/notes', type: 'page' },
  { title: '关于 Zeno', href: '/about', type: 'page' },
  { title: '联系我', href: '/contact', type: 'page' },
  { title: 'AI 提示词体验场', href: '/tools/prompts', type: 'resource' },
  { title: 'Markdown 微信排版工具', href: '/tools/md2wechat', type: 'resource' },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim().toLowerCase()

  if (!q || q.length < 1) {
    return NextResponse.json({ results: [] })
  }

  const results: SearchResult[] = []

  // Search articles
  for (const article of articles) {
    const searchText = `${article.title} ${article.excerpt ?? ''} ${article.tags?.join(' ') ?? ''} ${article.category ?? ''}`.toLowerCase()
    if (searchText.includes(q)) {
      results.push({
        title: article.title,
        href: `/blog/${article.slug}`,
        type: 'article',
        excerpt: article.excerpt ?? undefined,
      })
    }
    if (results.length >= 10) break
  }

  // Search notes from database
  if (results.length < 10) {
    try {
      const notes = await prisma.note.findMany({
        where: {
          visibility: 'PUBLIC',
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { excerpt: { contains: q, mode: 'insensitive' } },
            { content: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { title: true, slug: true, excerpt: true },
        take: 5,
      })
      for (const note of notes) {
        results.push({
          title: note.title,
          href: `/notes/${note.slug}`,
          type: 'note',
          excerpt: note.excerpt ?? undefined,
        })
      }
    } catch {
      // DB unavailable, skip notes
    }
  }

  // Search static pages
  for (const page of staticPages) {
    if (page.title.toLowerCase().includes(q)) {
      results.push(page)
    }
  }

  return NextResponse.json({ results: results.slice(0, 12) })
}
