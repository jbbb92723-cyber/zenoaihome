-- Migration: add_living_diagnosis
-- 保存 AI 居住诊断提交，并预留人工审核后的诊断报告草稿。

CREATE TABLE "living_diagnoses" (
    "id"             TEXT NOT NULL,
    "userId"         TEXT,
    "source"         TEXT NOT NULL DEFAULT 'living_diagnosis_page',
    "stage"          TEXT,
    "city"           TEXT,
    "homeType"       TEXT,
    "area"           TEXT,
    "budgetRange"    TEXT,
    "contactName"    TEXT,
    "contactWechat"  TEXT,
    "contactEmail"   TEXT,
    "answers"        JSONB NOT NULL,
    "result"         JSONB,
    "status"         TEXT NOT NULL DEFAULT 'submitted',
    "adminNote"      TEXT,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL,

    CONSTRAINT "living_diagnoses_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "diagnosis_reports" (
    "id"           TEXT NOT NULL,
    "diagnosisId"  TEXT NOT NULL,
    "title"        TEXT NOT NULL,
    "status"       TEXT NOT NULL DEFAULT 'draft',
    "aiSummary"    TEXT,
    "zenoReview"   TEXT,
    "report"       JSONB NOT NULL,
    "publicToken"  TEXT,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    "publishedAt"  TIMESTAMP(3),

    CONSTRAINT "diagnosis_reports_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "diagnosis_reports_diagnosisId_key" ON "diagnosis_reports"("diagnosisId");
CREATE UNIQUE INDEX "diagnosis_reports_publicToken_key" ON "diagnosis_reports"("publicToken");

CREATE INDEX "living_diagnoses_userId_idx" ON "living_diagnoses"("userId");
CREATE INDEX "living_diagnoses_status_idx" ON "living_diagnoses"("status");
CREATE INDEX "living_diagnoses_createdAt_idx" ON "living_diagnoses"("createdAt");
CREATE INDEX "diagnosis_reports_status_idx" ON "diagnosis_reports"("status");
CREATE INDEX "diagnosis_reports_createdAt_idx" ON "diagnosis_reports"("createdAt");

ALTER TABLE "living_diagnoses"
  ADD CONSTRAINT "living_diagnoses_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "diagnosis_reports"
  ADD CONSTRAINT "diagnosis_reports_diagnosisId_fkey"
  FOREIGN KEY ("diagnosisId") REFERENCES "living_diagnoses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
