/**
 * lib/notes.ts
 *
 * 思考札记 (Notes) 数据查询工具。
 *
 * 安全边界：
 *   - 前台查询函数（getPublicNotes / getPublicNoteBySlug）只返回 visibility = PUBLIC 的内容。
 *   - 后台查询函数（getAdminNotes / getAdminNoteById）返回全部内容，调用方须已验证管理员身份。
 *   - PRIVATE / DRAFT 内容绝对不会出现在任何前台接口中。
 */

import { prisma } from '@/lib/prisma'
import type { NoteVisibility } from '@prisma/client'

// ─── 公共类型 ─────────────────────────────────────────────────

export type NoteListItem = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  category: string | null
  tags: string[]
  visibility: NoteVisibility
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export type NoteDetail = NoteListItem & {
  content: string
}

// ─── 前台查询（只返回 PUBLIC） ────────────────────────────────

/** 获取所有公开笔记，按时间降序 */
export async function getPublicNotes(): Promise<NoteListItem[]> {
  try {
    return await prisma.note.findMany({
      where: { visibility: 'PUBLIC' },
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
  } catch (err) {
    console.error('[notes] getPublicNotes error:', err)
    return []
  }
}

/** 获取最新 N 条公开笔记（首页展示用） */
export async function getLatestPublicNotes(limit = 3): Promise<NoteListItem[]> {
  try {
    return await prisma.note.findMany({
      where: { visibility: 'PUBLIC' },
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
      take: limit,
    })
  } catch (err) {
    console.error('[notes] getLatestPublicNotes error:', err)
    return []
  }
}

/**
 * 根据 slug 获取公开笔记详情。
 * 若笔记不存在或 visibility 不是 PUBLIC，返回 null。
 * 前台路由据此 404，绝不泄露 PRIVATE/DRAFT 内容。
 */
export async function getPublicNoteBySlug(slug: string): Promise<NoteDetail | null> {
  try {
    const note = await prisma.note.findUnique({ where: { slug } })
    if (!note || note.visibility !== 'PUBLIC') return null
    return note
  } catch (err) {
    console.error('[notes] getPublicNoteBySlug error:', err)
    return null
  }
}

// ─── 后台查询（管理员专用，调用前须验证身份） ────────────────

/** 获取全部笔记（包含 PUBLIC / PRIVATE / DRAFT） */
export async function getAdminNotes(): Promise<NoteListItem[]> {
  try {
    return await prisma.note.findMany({
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
  } catch (err) {
    console.error('[notes] getAdminNotes error:', err)
    return []
  }
}

/** 根据 id 获取笔记详情（后台编辑用） */
export async function getAdminNoteById(id: string): Promise<NoteDetail | null> {
  try {
    return await prisma.note.findUnique({ where: { id } })
  } catch (err) {
    console.error('[notes] getAdminNoteById error:', err)
    return null
  }
}

// ─── 默认分类列表 ─────────────────────────────────────────────
export const NOTE_CATEGORIES = [
  'AI实践',
  '装修洞察',
  '商业判断',
  '方法论',
  '读书笔记',
  '生活观察',
] as const
