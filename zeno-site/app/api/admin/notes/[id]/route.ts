/**
 * GET    /api/admin/notes/[id] — 获取单条笔记（管理员专用）
 * PUT    /api/admin/notes/[id] — 更新笔记（管理员专用）
 * DELETE /api/admin/notes/[id] — 删除笔记（管理员专用）
 */

import { NextResponse } from 'next/server'
import { isAdminUser } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import type { NoteVisibility } from '@prisma/client'

export const dynamic = 'force-dynamic'

interface Ctx {
  params: { id: string }
}

// ─── GET /api/admin/notes/[id] ───────────────────────────────
export async function GET(_req: Request, { params }: Ctx) {
  if (!(await isAdminUser())) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  const note = await prisma.note.findUnique({ where: { id: params.id } })
  if (!note) return NextResponse.json({ error: '笔记不存在' }, { status: 404 })

  return NextResponse.json(note)
}

// ─── PUT /api/admin/notes/[id] ───────────────────────────────
export async function PUT(req: Request, { params }: Ctx) {
  if (!(await isAdminUser())) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: '请求体无效' }, { status: 400 })

  const { title, slug, excerpt, content, category, tags, visibility, featured } = body

  if (!title || !slug || !content) {
    return NextResponse.json({ error: '标题、slug 和正文为必填项' }, { status: 400 })
  }

  const validVisibilities: NoteVisibility[] = ['PUBLIC', 'PRIVATE', 'DRAFT']
  const vis: NoteVisibility = validVisibilities.includes(visibility) ? visibility : 'DRAFT'

  try {
    const note = await prisma.note.update({
      where: { id: params.id },
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
    return NextResponse.json(note)
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: string }).code === 'P2002'
    ) {
      return NextResponse.json({ error: 'slug 已存在，请更换' }, { status: 409 })
    }
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: string }).code === 'P2025'
    ) {
      return NextResponse.json({ error: '笔记不存在' }, { status: 404 })
    }
    console.error('[API] notes PUT error:', err)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

// ─── DELETE /api/admin/notes/[id] ────────────────────────────
export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await isAdminUser())) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    await prisma.note.delete({ where: { id: params.id } })
    return NextResponse.json({ message: '已删除' })
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: string }).code === 'P2025'
    ) {
      return NextResponse.json({ error: '笔记不存在' }, { status: 404 })
    }
    console.error('[API] notes DELETE error:', err)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}
