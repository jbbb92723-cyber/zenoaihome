import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyInternalApiRequest } from '@/lib/internal-api'
import type { Prisma } from '@prisma/client'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const DraftSchema = z.object({
  contentId:       z.string().min(1).max(120),
  briefId:         z.string().max(120).optional().nullable(),
  topicId:         z.string().max(120).optional().nullable(),
  title:           z.string().min(1).max(200),
  slug:            z.string().min(1).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt:         z.string().max(500).optional().nullable(),
  content:         z.string().min(1),
  platform:        z.string().max(40).default('website'),
  status:          z.enum(['draft', 'staged', 'approved', 'returned', 'published', 'archived']).default('draft'),
  approvalStatus:  z.enum(['pending', 'approved', 'returned']).default('pending'),
  reviewScore:     z.number().int().min(0).max(100).optional().nullable(),
  qualitySummary:  z.string().max(2000).optional().nullable(),
  source:          z.string().max(80).default('content_hub'),
  adapterId:       z.string().max(120).optional().nullable(),
  metaTitle:       z.string().max(200).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
  canonicalUrl:    z.string().url().optional().nullable(),
  previewPath:     z.string().max(500).optional().nullable(),
  publishedUrl:    z.string().url().optional().nullable(),
  payload:         z.record(z.string(), z.unknown()).optional().nullable(),
})

function toNullable(value: string | null | undefined) {
  return value && value.trim() ? value.trim() : null
}

function toJsonPayload(value: Record<string, unknown> | null | undefined): Prisma.InputJsonObject | undefined {
  return value ? (value as Prisma.InputJsonObject) : undefined
}

export async function POST(req: Request) {
  if (!verifyInternalApiRequest(req)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = DraftSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: '参数校验失败', detail: parsed.error.flatten() }, { status: 422 })
  }

  const data = parsed.data
  const now = new Date()

  const draft = await prisma.websiteContentDraft.upsert({
    where: { contentId: data.contentId },
    create: {
      contentId:       data.contentId,
      briefId:         toNullable(data.briefId),
      topicId:         toNullable(data.topicId),
      title:           data.title.trim(),
      slug:            data.slug.trim().toLowerCase(),
      excerpt:         toNullable(data.excerpt),
      content:         data.content,
      platform:        data.platform,
      status:          data.status,
      approvalStatus:  data.approvalStatus,
      reviewScore:     data.reviewScore ?? null,
      qualitySummary:  toNullable(data.qualitySummary),
      source:          data.source,
      adapterId:       toNullable(data.adapterId),
      metaTitle:       toNullable(data.metaTitle),
      metaDescription: toNullable(data.metaDescription),
      canonicalUrl:    toNullable(data.canonicalUrl),
      previewPath:     toNullable(data.previewPath),
      publishedUrl:    toNullable(data.publishedUrl),
      payload:         toJsonPayload(data.payload),
      stagedAt:        data.status === 'staged' ? now : null,
      approvedAt:      data.approvalStatus === 'approved' ? now : null,
      publishedAt:     data.status === 'published' ? now : null,
    },
    update: {
      briefId:         toNullable(data.briefId),
      topicId:         toNullable(data.topicId),
      title:           data.title.trim(),
      slug:            data.slug.trim().toLowerCase(),
      excerpt:         toNullable(data.excerpt),
      content:         data.content,
      platform:        data.platform,
      status:          data.status,
      approvalStatus:  data.approvalStatus,
      reviewScore:     data.reviewScore ?? null,
      qualitySummary:  toNullable(data.qualitySummary),
      source:          data.source,
      adapterId:       toNullable(data.adapterId),
      metaTitle:       toNullable(data.metaTitle),
      metaDescription: toNullable(data.metaDescription),
      canonicalUrl:    toNullable(data.canonicalUrl),
      previewPath:     toNullable(data.previewPath),
      publishedUrl:    toNullable(data.publishedUrl),
      payload:         toJsonPayload(data.payload),
      stagedAt:        data.status === 'staged' ? now : undefined,
      approvedAt:      data.approvalStatus === 'approved' ? now : undefined,
      publishedAt:     data.status === 'published' ? now : undefined,
    },
    select: {
      id:             true,
      contentId:      true,
      briefId:        true,
      title:          true,
      slug:           true,
      status:         true,
      approvalStatus: true,
      updatedAt:      true,
    },
  })

  await prisma.adminLog.create({
    data: {
      action: 'internal_upsert_website_content_draft',
      target: draft.contentId,
      detail: {
        draftId: draft.id,
        briefId: draft.briefId,
        status: draft.status,
        approvalStatus: draft.approvalStatus,
        source: data.source,
        adapterId: data.adapterId,
      },
    },
  })

  return NextResponse.json({ ok: true, draft }, { status: 201 })
}

export async function GET(req: Request) {
  if (!verifyInternalApiRequest(req)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || undefined
  const approvalStatus = searchParams.get('approvalStatus') || undefined

  const drafts = await prisma.websiteContentDraft.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(approvalStatus ? { approvalStatus } : {}),
    },
    orderBy: { updatedAt: 'desc' },
    take: 100,
    select: {
      id:              true,
      contentId:       true,
      briefId:         true,
      title:           true,
      slug:            true,
      status:          true,
      approvalStatus:  true,
      reviewScore:     true,
      metaDescription: true,
      updatedAt:       true,
    },
  })

  return NextResponse.json({ ok: true, drafts })
}
