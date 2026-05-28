import fs from "node:fs";
import path from "node:path";

const draftFile = process.argv[2];
const apiBase = process.env.ZENO_SITE_API_BASE || "http://localhost:3000";
const token = process.env.ZENO_INTERNAL_API_TOKEN;

if (!draftFile) {
  console.error("Usage: node scripts/push-website-draft.mjs <draft-package.json>");
  process.exit(1);
}

if (!token) {
  console.error("Missing ZENO_INTERNAL_API_TOKEN.");
  process.exit(1);
}

function parseFrontmatter(markdown) {
  if (!markdown.startsWith("---")) return { data: {}, body: markdown };
  const end = markdown.indexOf("\n---", 3);
  if (end < 0) return { data: {}, body: markdown };
  const raw = markdown.slice(3, end).trim();
  const body = markdown.slice(end + 4).trim();
  const data = {};
  for (const line of raw.split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }
  return { data, body };
}

function pickBody(body) {
  const marker = "## 正文";
  const idx = body.indexOf(marker);
  if (idx < 0) return body;
  return body.slice(idx + marker.length).trim();
}

const absolutePath = path.resolve(draftFile);
const markdown = fs.readFileSync(absolutePath, "utf8");
const { data, body } = parseFrontmatter(markdown);
const content = pickBody(body);

const payload = {
  contentId: data.content_id,
  briefId: data.brief_id || null,
  title: data.title ? JSON.parse(data.title) : data.content_id,
  slug: data.slug,
  excerpt: data.meta_description ? JSON.parse(data.meta_description) : null,
  content,
  platform: "website",
  status: "staged",
  approvalStatus: data.approval_status || "pending",
  reviewScore: data.review_score ? Number(data.review_score) : null,
  qualitySummary: null,
  source: "content_hub",
  adapterId: "website_local_draft_adapter",
  metaTitle: data.meta_title ? JSON.parse(data.meta_title) : null,
  metaDescription: data.meta_description ? JSON.parse(data.meta_description) : null,
  previewPath: absolutePath,
  payload: {
    localDraftFile: absolutePath,
    generatedAt: data.generated_at || null,
    autoPublish: false,
  },
};

const res = await fetch(`${apiBase.replace(/\/$/, "")}/api/internal/content/drafts`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(payload),
});

const json = await res.json().catch(() => ({}));
if (!res.ok) {
  console.error(JSON.stringify({ ok: false, status: res.status, response: json }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, status: res.status, response: json }, null, 2));
