-- Migration: add_website_content_drafts
-- 承接 Feishu/Hermes/CLI 推送到网站后台的内容草稿。
-- 注意：该表只表示网站草稿，不等同于前台发布内容。

CREATE TABLE "website_content_drafts" (
    "id"                TEXT NOT NULL,
    "contentId"         TEXT NOT NULL,
    "briefId"           TEXT,
    "topicId"           TEXT,
    "title"             TEXT NOT NULL,
    "slug"              TEXT NOT NULL,
    "excerpt"           TEXT,
    "content"           TEXT NOT NULL,
    "platform"          TEXT NOT NULL DEFAULT 'website',
    "status"            TEXT NOT NULL DEFAULT 'draft',
    "approvalStatus"    TEXT NOT NULL DEFAULT 'pending',
    "reviewScore"       INTEGER,
    "qualitySummary"    TEXT,
    "source"            TEXT NOT NULL DEFAULT 'content_hub',
    "adapterId"         TEXT,
    "metaTitle"         TEXT,
    "metaDescription"   TEXT,
    "canonicalUrl"      TEXT,
    "previewPath"       TEXT,
    "publishedUrl"      TEXT,
    "payload"           JSONB,
    "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"         TIMESTAMP(3) NOT NULL,
    "stagedAt"          TIMESTAMP(3),
    "approvedAt"        TIMESTAMP(3),
    "publishedAt"       TIMESTAMP(3),

    CONSTRAINT "website_content_drafts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "website_content_drafts_contentId_key" ON "website_content_drafts"("contentId");
CREATE INDEX "website_content_drafts_briefId_idx" ON "website_content_drafts"("briefId");
CREATE INDEX "website_content_drafts_slug_idx" ON "website_content_drafts"("slug");
CREATE INDEX "website_content_drafts_status_idx" ON "website_content_drafts"("status");
CREATE INDEX "website_content_drafts_approvalStatus_idx" ON "website_content_drafts"("approvalStatus");
CREATE INDEX "website_content_drafts_createdAt_idx" ON "website_content_drafts"("createdAt");
