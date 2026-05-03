/**
 * GET  /api/admin/notes        — 获取全部笔记（管理员专用）
 * POST /api/admin/notes        — 创建新笔记（管理员专用）
 *
 * 所有操作均需管理员身份校验，非管理员一律返回 401。
 */

import { NextResponse } from 'next/server'
import { isAdminUser } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import type { NoteVisibility } from '@prisma/client'

export const dynamic = 'force-dynamic'

// ─── GET /api/admin/notes ─────────────────────────────────────
export async function GET() {
  if (!(await isAdminUser())) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  const notes = await prisma.note.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      category: true,
      tags: true,
      visibility: true,
      featured: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(notes)
}

// ─── POST /api/admin/notes ────────────────────────────────────
export async function POST(req: Request) {
  if (!(await isAdminUser())) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: '请求体无效' }, { status: 400 })

  const { title, slug, excerpt, content, category, tags, visibility, featured } = body

  if (!title || !slug || !content) {
    return NextResponse.json({ error: '标题、slug 和正文为必填项' }, { status: 400 })
  }

  // 校验 visibility 值
  const validVisibilities: NoteVisibility[] = ['PUBLIC', 'PRIVATE', 'DRAFT']
  const vis: NoteVisibility = validVisibilities.includes(visibility) ? visibility : 'DRAFT'

  try {
    const note = await prisma.note.create({
      data: {
        title: String(title).trim(),
        slug: String(slug).trim().toLowerCase(),
        excerpt: excerpt ? String(excerpt).trim() : null,
        content: String(content),
        category: category ? String(category).trim() : null,
        tags: Array.isArray(tags) ? tags.map(String) : [],
        visibility: vis,
        featured: Boolean(featured),
      },
    })
    return NextResponse.json(note, { status: 201 })
  } catch (err: unknown) {
    // Prisma unique constraint 违反（slug 重复）
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: string }).code === 'P2002'
    ) {
      return NextResponse.json({ error: 'slug 已存在，请更换' }, { status: 409 })
    }
    console.error('[API] notes POST error:', err)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}
