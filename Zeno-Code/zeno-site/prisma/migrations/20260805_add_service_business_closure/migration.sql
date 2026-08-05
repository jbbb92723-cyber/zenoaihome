-- Extend authenticated users and audit records for the admin migration.
ALTER TABLE "users" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'USER';

ALTER TABLE "admin_logs" ADD COLUMN "actorId" TEXT;
ALTER TABLE "admin_logs" ADD COLUMN "actorEmail" TEXT;
ALTER TABLE "admin_logs" ADD COLUMN "requestId" TEXT;

CREATE INDEX "admin_logs_actorId_idx" ON "admin_logs"("actorId");

ALTER TABLE "admin_logs"
ADD CONSTRAINT "admin_logs_actorId_fkey"
FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Commercial opportunity: one source request can become one opportunity.
CREATE TABLE "opportunities" (
    "id" TEXT NOT NULL,
    "serviceRequestId" TEXT,
    "customerUserId" TEXT,
    "title" TEXT NOT NULL,
    "customerName" TEXT,
    "contactPhone" TEXT,
    "contactWechat" TEXT,
    "contactEmail" TEXT,
    "serviceType" TEXT NOT NULL,
    "source" TEXT,
    "stage" TEXT NOT NULL DEFAULT 'new',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "needSummary" TEXT,
    "expectedAmount" INTEGER,
    "nextAction" TEXT,
    "nextActionAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "opportunities_serviceRequestId_key" ON "opportunities"("serviceRequestId");
CREATE INDEX "opportunities_customerUserId_idx" ON "opportunities"("customerUserId");
CREATE INDEX "opportunities_stage_idx" ON "opportunities"("stage");
CREATE INDEX "opportunities_nextActionAt_idx" ON "opportunities"("nextActionAt");
CREATE INDEX "opportunities_createdAt_idx" ON "opportunities"("createdAt");

ALTER TABLE "opportunities"
ADD CONSTRAINT "opportunities_serviceRequestId_fkey"
FOREIGN KEY ("serviceRequestId") REFERENCES "service_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "opportunities"
ADD CONSTRAINT "opportunities_customerUserId_fkey"
FOREIGN KEY ("customerUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Versioned proposals preserve what was offered at the time of sale.
CREATE TABLE "proposals" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "title" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "deliverables" JSONB NOT NULL,
    "amount" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "validUntil" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "proposals_opportunityId_version_key" ON "proposals"("opportunityId", "version");
CREATE INDEX "proposals_status_idx" ON "proposals"("status");

ALTER TABLE "proposals"
ADD CONSTRAINT "proposals_opportunityId_fkey"
FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Signed commercial boundary. One opportunity has at most one active agreement in v1.
CREATE TABLE "agreements" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "proposalId" TEXT,
    "title" TEXT NOT NULL,
    "amount" INTEGER,
    "scope" TEXT NOT NULL,
    "terms" JSONB,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "signedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agreements_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "agreements_opportunityId_key" ON "agreements"("opportunityId");
CREATE UNIQUE INDEX "agreements_proposalId_key" ON "agreements"("proposalId");
CREATE INDEX "agreements_status_idx" ON "agreements"("status");

ALTER TABLE "agreements"
ADD CONSTRAINT "agreements_opportunityId_fkey"
FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "agreements"
ADD CONSTRAINT "agreements_proposalId_fkey"
FOREIGN KEY ("proposalId") REFERENCES "proposals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Connect delivery projects to won opportunities and make project type explicit.
ALTER TABLE "projects" ADD COLUMN "opportunityId" TEXT;
ALTER TABLE "projects" ADD COLUMN "projectType" TEXT NOT NULL DEFAULT 'service';

CREATE UNIQUE INDEX "projects_opportunityId_key" ON "projects"("opportunityId");

ALTER TABLE "projects"
ADD CONSTRAINT "projects_opportunityId_fkey"
FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "project_deliverables" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "dueAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "acceptanceNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_deliverables_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "project_deliverables_projectId_idx" ON "project_deliverables"("projectId");
CREATE INDEX "project_deliverables_status_idx" ON "project_deliverables"("status");

ALTER TABLE "project_deliverables"
ADD CONSTRAINT "project_deliverables_projectId_fkey"
FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "business_activities" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT,
    "projectId" TEXT,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "business_activities_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "business_activities_opportunityId_idx" ON "business_activities"("opportunityId");
CREATE INDEX "business_activities_projectId_idx" ON "business_activities"("projectId");
CREATE INDEX "business_activities_createdAt_idx" ON "business_activities"("createdAt");

ALTER TABLE "business_activities"
ADD CONSTRAINT "business_activities_opportunityId_fkey"
FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "business_activities"
ADD CONSTRAINT "business_activities_projectId_fkey"
FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
