CREATE TABLE "article_reactions" (
    "id" TEXT NOT NULL,
    "articleSlug" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'helpful',
    "visitorId" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_reactions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "article_reactions_articleSlug_kind_visitorId_key"
ON "article_reactions"("articleSlug", "kind", "visitorId");
CREATE INDEX "article_reactions_articleSlug_kind_idx"
ON "article_reactions"("articleSlug", "kind");
CREATE INDEX "article_reactions_userId_idx"
ON "article_reactions"("userId");

ALTER TABLE "article_reactions"
ADD CONSTRAINT "article_reactions_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "articleSlug" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "moderatorId" TEXT,
    "moderationNote" TEXT,
    "moderatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "comments_articleSlug_status_createdAt_idx"
ON "comments"("articleSlug", "status", "createdAt");
CREATE INDEX "comments_userId_createdAt_idx"
ON "comments"("userId", "createdAt");

ALTER TABLE "comments"
ADD CONSTRAINT "comments_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "comments"
ADD CONSTRAINT "comments_moderatorId_fkey"
FOREIGN KEY ("moderatorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
