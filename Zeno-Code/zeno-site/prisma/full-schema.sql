-- ZenoAIHome 完整建表 SQL（29 张表）
-- 1. 打开 https://supabase.com/dashboard/project/mvpbqkdqsziwxrkhgvzq/sql/new
-- 2. 全部粘贴 → Run

-- ═══ 用户 ═══
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL, "email" TEXT NOT NULL UNIQUE, "name" TEXT,
    "image" TEXT, "passwordHash" TEXT, "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- ═══ OAuth ═══
CREATE TABLE IF NOT EXISTS "accounts" (
    "userId" TEXT NOT NULL, "type" TEXT NOT NULL, "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL, "refresh_token" TEXT, "access_token" TEXT,
    "expires_at" INTEGER, "token_type" TEXT, "scope" TEXT, "id_token" TEXT,
    "session_state" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "accounts_pkey" PRIMARY KEY ("provider", "providerAccountId")
);

CREATE TABLE IF NOT EXISTS "sessions" (
    "sessionToken" TEXT NOT NULL UNIQUE, "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "sessions_pkey" PRIMARY KEY ("sessionToken")
);

CREATE TABLE IF NOT EXISTS "verification_tokens" (
    "identifier" TEXT NOT NULL, "token" TEXT NOT NULL, "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("identifier", "token")
);

CREATE TABLE IF NOT EXISTS "verification_codes" (
    "id" TEXT NOT NULL, "email" TEXT NOT NULL, "codeHash" TEXT NOT NULL,
    "type" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL, "consumedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "verification_codes_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "verification_codes_email_type_idx" ON "verification_codes"("email", "type");

-- ═══ 会员 ═══
CREATE TABLE IF NOT EXISTS "memberships" (
    "id" TEXT NOT NULL, "userId" TEXT NOT NULL UNIQUE, "plan" TEXT NOT NULL DEFAULT 'free',
    "status" TEXT NOT NULL DEFAULT 'active', "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- ═══ 资源 ═══
CREATE TABLE IF NOT EXISTS "resource_claims" (
    "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "resourceId" TEXT NOT NULL,
    "resourceTitle" TEXT NOT NULL, "resourceUrl" TEXT, "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "resource_claims_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "resource_claims_userId_idx" ON "resource_claims"("userId");

-- ═══ 服务申请 ═══
CREATE TABLE IF NOT EXISTS "service_requests" (
    "id" TEXT NOT NULL, "userId" TEXT, "serviceType" TEXT NOT NULL,
    "name" TEXT, "phone" TEXT, "wechat" TEXT, "email" TEXT, "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'submitted', "aiCategory" TEXT,
    "responseText" TEXT, "reviewedAt" TIMESTAMP(3), "savedToKnowledge" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "service_requests_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "service_requests_userId_idx" ON "service_requests"("userId");

-- ═══ 商品 ═══
CREATE TABLE IF NOT EXISTS "products" (
    "id" TEXT NOT NULL, "name" TEXT NOT NULL, "type" TEXT NOT NULL,
    "price" INTEGER NOT NULL, "description" TEXT, "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- ═══ 订单 ═══
CREATE TABLE IF NOT EXISTS "orders" (
    "id" TEXT NOT NULL, "userId" TEXT, "orderNo" TEXT NOT NULL UNIQUE,
    "productId" TEXT, "productName" TEXT NOT NULL, "productType" TEXT NOT NULL,
    "amount" INTEGER NOT NULL, "discountAmount" INTEGER NOT NULL DEFAULT 0,
    "paidAmount" INTEGER NOT NULL, "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentMethod" TEXT, "couponId" TEXT, "redeemCodeId" TEXT,
    "source" TEXT, "remark" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL, "paidAt" TIMESTAMP(3), "completedAt" TIMESTAMP(3),
    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "orders_userId_idx" ON "orders"("userId");
CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders"("status");
CREATE INDEX IF NOT EXISTS "orders_createdAt_idx" ON "orders"("createdAt");

-- ═══ 支付 ═══
CREATE TABLE IF NOT EXISTS "payments" (
    "id" TEXT NOT NULL, "orderId" TEXT NOT NULL, "amount" INTEGER NOT NULL,
    "method" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT 'pending',
    "transactionId" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "payments_orderId_idx" ON "payments"("orderId");

-- ═══ 优惠券 ═══
CREATE TABLE IF NOT EXISTS "coupons" (
    "id" TEXT NOT NULL, "code" TEXT NOT NULL UNIQUE, "name" TEXT NOT NULL,
    "type" TEXT NOT NULL, "value" INTEGER NOT NULL, "minAmount" INTEGER NOT NULL DEFAULT 0,
    "maxUses" INTEGER, "usedCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true, "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "coupon_claims" (
    "id" TEXT NOT NULL, "couponId" TEXT NOT NULL, "userId" TEXT NOT NULL,
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "coupon_claims_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "coupon_claims_couponId_userId_key" ON "coupon_claims"("couponId", "userId");

CREATE TABLE IF NOT EXISTS "coupon_usages" (
    "id" TEXT NOT NULL, "couponId" TEXT NOT NULL, "userId" TEXT NOT NULL,
    "orderId" TEXT, "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "coupon_usages_pkey" PRIMARY KEY ("id")
);

-- ═══ 兑换码 ═══
CREATE TABLE IF NOT EXISTS "redeem_codes" (
    "id" TEXT NOT NULL, "code" TEXT NOT NULL UNIQUE, "type" TEXT NOT NULL,
    "value" TEXT, "maxUses" INTEGER NOT NULL DEFAULT 1,
    "usedCount" INTEGER NOT NULL DEFAULT 0, "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3), "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "redeem_codes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "redeem_code_usages" (
    "id" TEXT NOT NULL, "redeemCodeId" TEXT NOT NULL, "userId" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "redeem_code_usages_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "redeem_code_usages_redeemCodeId_userId_key" ON "redeem_code_usages"("redeemCodeId", "userId");

-- ═══ 分析 ═══
CREATE TABLE IF NOT EXISTS "analytics_events" (
    "id" TEXT NOT NULL, "userId" TEXT, "event" TEXT NOT NULL,
    "path" TEXT, "referrer" TEXT, "metadata" JSONB, "ip" TEXT, "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "analytics_events_event_idx" ON "analytics_events"("event");
CREATE INDEX IF NOT EXISTS "analytics_events_userId_idx" ON "analytics_events"("userId");
CREATE INDEX IF NOT EXISTS "analytics_events_createdAt_idx" ON "analytics_events"("createdAt");

CREATE TABLE IF NOT EXISTS "daily_metrics" (
    "id" TEXT NOT NULL, "date" TIMESTAMP(3) NOT NULL UNIQUE,
    "pageViews" INTEGER NOT NULL DEFAULT 0, "uniqueUsers" INTEGER NOT NULL DEFAULT 0,
    "newUsers" INTEGER NOT NULL DEFAULT 0, "logins" INTEGER NOT NULL DEFAULT 0,
    "resourceClaims" INTEGER NOT NULL DEFAULT 0, "serviceRequests" INTEGER NOT NULL DEFAULT 0,
    "orderCount" INTEGER NOT NULL DEFAULT 0, "orderRevenue" INTEGER NOT NULL DEFAULT 0,
    "memberCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "daily_metrics_pkey" PRIMARY KEY ("id")
);

-- ═══ 签到 ═══
CREATE TABLE IF NOT EXISTS "checkins" (
    "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT, "streak" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "checkins_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "checkins_userId_idx" ON "checkins"("userId");
CREATE INDEX IF NOT EXISTS "checkins_checkedAt_idx" ON "checkins"("checkedAt");

-- ═══ 笔记 ═══
CREATE TABLE IF NOT EXISTS "notes" (
    "id" TEXT NOT NULL, "title" TEXT NOT NULL, "slug" TEXT NOT NULL UNIQUE,
    "excerpt" TEXT, "content" TEXT NOT NULL, "category" TEXT, "tags" TEXT[],
    "visibility" TEXT NOT NULL DEFAULT 'DRAFT', "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "notes_visibility_idx" ON "notes"("visibility");
CREATE INDEX IF NOT EXISTS "notes_createdAt_idx" ON "notes"("createdAt");

-- ═══ 内容草稿 ═══
CREATE TABLE IF NOT EXISTS "website_content_drafts" (
    "id" TEXT NOT NULL, "contentId" TEXT NOT NULL UNIQUE, "briefId" TEXT,
    "topicId" TEXT, "title" TEXT NOT NULL, "slug" TEXT NOT NULL, "excerpt" TEXT,
    "content" TEXT NOT NULL, "platform" TEXT NOT NULL DEFAULT 'website',
    "status" TEXT NOT NULL DEFAULT 'draft', "approvalStatus" TEXT NOT NULL DEFAULT 'pending',
    "reviewScore" INTEGER, "qualitySummary" TEXT, "source" TEXT NOT NULL DEFAULT 'content_hub',
    "adapterId" TEXT, "metaTitle" TEXT, "metaDescription" TEXT, "canonicalUrl" TEXT,
    "previewPath" TEXT, "publishedUrl" TEXT, "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL, "stagedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3), "publishedAt" TIMESTAMP(3),
    CONSTRAINT "website_content_drafts_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "wcd_briefId_idx" ON "website_content_drafts"("briefId");
CREATE INDEX IF NOT EXISTS "wcd_slug_idx" ON "website_content_drafts"("slug");
CREATE INDEX IF NOT EXISTS "wcd_status_idx" ON "website_content_drafts"("status");
CREATE INDEX IF NOT EXISTS "wcd_approvalStatus_idx" ON "website_content_drafts"("approvalStatus");
CREATE INDEX IF NOT EXISTS "wcd_createdAt_idx" ON "website_content_drafts"("createdAt");

-- ═══ 居住诊断 ═══
CREATE TABLE IF NOT EXISTS "living_diagnoses" (
    "id" TEXT NOT NULL, "userId" TEXT, "source" TEXT NOT NULL DEFAULT 'living_diagnosis_page',
    "stage" TEXT, "city" TEXT, "homeType" TEXT, "area" TEXT, "budgetRange" TEXT,
    "contactName" TEXT, "contactWechat" TEXT, "contactEmail" TEXT,
    "answers" JSONB, "result" JSONB, "status" TEXT NOT NULL DEFAULT 'submitted',
    "adminNote" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "living_diagnoses_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ld_userId_idx" ON "living_diagnoses"("userId");
CREATE INDEX IF NOT EXISTS "ld_status_idx" ON "living_diagnoses"("status");
CREATE INDEX IF NOT EXISTS "ld_createdAt_idx" ON "living_diagnoses"("createdAt");

CREATE TABLE IF NOT EXISTS "diagnosis_reports" (
    "id" TEXT NOT NULL, "diagnosisId" TEXT NOT NULL UNIQUE, "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft', "aiSummary" TEXT, "zenoReview" TEXT,
    "report" JSONB, "publicToken" TEXT UNIQUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL, "publishedAt" TIMESTAMP(3),
    CONSTRAINT "diagnosis_reports_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "dr_status_idx" ON "diagnosis_reports"("status");
CREATE INDEX IF NOT EXISTS "dr_createdAt_idx" ON "diagnosis_reports"("createdAt");

-- ═══ 操作日志 ═══
CREATE TABLE IF NOT EXISTS "admin_logs" (
    "id" TEXT NOT NULL, "action" TEXT NOT NULL, "target" TEXT, "detail" JSONB,
    "ip" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "admin_logs_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "admin_logs_createdAt_idx" ON "admin_logs"("createdAt");

-- ═══ 工地项目 ═══
CREATE TABLE IF NOT EXISTS "projects" (
    "id" TEXT NOT NULL, "name" TEXT NOT NULL, "clientName" TEXT, "clientPhone" TEXT,
    "clientWechat" TEXT, "city" TEXT, "address" TEXT, "area" DOUBLE PRECISION,
    "budget" INTEGER, "homeType" TEXT, "style" TEXT, "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active', "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "projects_status_idx" ON "projects"("status");
CREATE INDEX IF NOT EXISTS "projects_createdAt_idx" ON "projects"("createdAt");

CREATE TABLE IF NOT EXISTS "project_nodes" (
    "id" TEXT NOT NULL, "projectId" TEXT NOT NULL, "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0, "status" TEXT NOT NULL DEFAULT 'pending',
    "scheduledAt" TIMESTAMP(3), "submittedAt" TIMESTAMP(3), "reviewedAt" TIMESTAMP(3),
    "zenoFeedback" TEXT, "result" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "project_nodes_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "pn_projectId_idx" ON "project_nodes"("projectId");
CREATE INDEX IF NOT EXISTS "pn_status_idx" ON "project_nodes"("status");

CREATE TABLE IF NOT EXISTS "project_photos" (
    "id" TEXT NOT NULL, "projectId" TEXT NOT NULL, "nodeId" TEXT,
    "url" TEXT NOT NULL, "caption" TEXT, "takenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "project_photos_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "pp_projectId_idx" ON "project_photos"("projectId");
CREATE INDEX IF NOT EXISTS "pp_nodeId_idx" ON "project_photos"("nodeId");

CREATE TABLE IF NOT EXISTS "project_notes" (
    "id" TEXT NOT NULL, "projectId" TEXT NOT NULL, "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'general',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "project_notes_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "pno_projectId_idx" ON "project_notes"("projectId");
CREATE INDEX IF NOT EXISTS "pno_createdAt_idx" ON "project_notes"("createdAt");

ALTER TABLE "project_nodes" ADD CONSTRAINT "pn_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE;
ALTER TABLE "project_photos" ADD CONSTRAINT "pp_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE;
ALTER TABLE "project_photos" ADD CONSTRAINT "pp_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "project_nodes"("id") ON DELETE SET NULL;
ALTER TABLE "project_notes" ADD CONSTRAINT "pno_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE;

-- ═══ AI 知识库 ═══
CREATE TABLE IF NOT EXISTS "knowledge_entries" (
    "id" TEXT NOT NULL, "title" TEXT NOT NULL, "category" TEXT NOT NULL,
    "content" TEXT NOT NULL, "source" TEXT, "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "knowledge_entries_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ke_category_idx" ON "knowledge_entries"("category");

-- ═══ 账户关联 ═══
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
