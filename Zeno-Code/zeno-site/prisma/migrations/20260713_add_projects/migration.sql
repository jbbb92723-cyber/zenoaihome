-- CreateTable
CREATE TABLE IF NOT EXISTS "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clientName" TEXT,
    "clientPhone" TEXT,
    "clientWechat" TEXT,
    "city" TEXT,
    "address" TEXT,
    "area" DOUBLE PRECISION,
    "budget" INTEGER,
    "homeType" TEXT,
    "style" TEXT,
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "project_nodes" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "scheduledAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "zenoFeedback" TEXT,
    "result" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "project_photos" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "nodeId" TEXT,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "takenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "project_notes" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'general',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "projects_status_idx" ON "projects"("status");
CREATE INDEX IF NOT EXISTS "projects_createdAt_idx" ON "projects"("createdAt");
CREATE INDEX IF NOT EXISTS "project_nodes_projectId_idx" ON "project_nodes"("projectId");
CREATE INDEX IF NOT EXISTS "project_nodes_status_idx" ON "project_nodes"("status");
CREATE INDEX IF NOT EXISTS "project_photos_projectId_idx" ON "project_photos"("projectId");
CREATE INDEX IF NOT EXISTS "project_photos_nodeId_idx" ON "project_photos"("nodeId");
CREATE INDEX IF NOT EXISTS "project_notes_projectId_idx" ON "project_notes"("projectId");
CREATE INDEX IF NOT EXISTS "project_notes_createdAt_idx" ON "project_notes"("createdAt");

-- AddForeignKey
ALTER TABLE "project_nodes" ADD CONSTRAINT "project_nodes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "project_photos" ADD CONSTRAINT "project_photos_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "project_photos" ADD CONSTRAINT "project_photos_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "project_nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "project_notes" ADD CONSTRAINT "project_notes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
