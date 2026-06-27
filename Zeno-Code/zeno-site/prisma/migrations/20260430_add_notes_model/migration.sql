-- Migration: add_notes_model
-- 新增「思考札记」功能所需的枚举类型和数据表

-- NoteVisibility 枚举
CREATE TYPE "NoteVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'DRAFT');

-- Note 表
CREATE TABLE "notes" (
    "id"         TEXT NOT NULL,
    "title"      TEXT NOT NULL,
    "slug"       TEXT NOT NULL,
    "excerpt"    TEXT,
    "content"    TEXT NOT NULL,
    "category"   TEXT,
    "tags"       TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "visibility" "NoteVisibility" NOT NULL DEFAULT 'DRAFT',
    "featured"   BOOLEAN NOT NULL DEFAULT false,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- slug 唯一索引
CREATE UNIQUE INDEX "notes_slug_key" ON "notes"("slug");

-- 查询常用索引
CREATE INDEX "notes_visibility_idx" ON "notes"("visibility");
CREATE INDEX "notes_createdAt_idx" ON "notes"("createdAt");
