import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(cwd, "manifest.json"), "utf8"));
const baseToken = manifest.baseToken;

const ids = {
  drafts: "tblWRTJDAXMYoj2y",
  taskRuns: "tblNIeOvE10OF9Ml",
};

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function extractJson(text) {
  const trimmed = text.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(trimmed.slice(start, end + 1));
    throw new Error(`Cannot parse lark-cli output: ${trimmed}`);
  }
}

function runLark(args) {
  let lastError;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const result = spawnSync("lark-cli", args, {
      cwd,
      encoding: "utf8",
      shell: process.platform === "win32",
    });
    const combined = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    if (result.status === 0) return extractJson(combined);
    lastError = new Error(`lark-cli ${args.join(" ")} failed:\n${combined}`);
    if (!combined.includes("retryable") && !combined.includes("locked")) throw lastError;
    sleep(1200 * attempt);
  }
  throw lastError;
}

function jsonArg(name, data) {
  const fileName = `${name}.json`;
  fs.writeFileSync(path.join(cwd, fileName), JSON.stringify(data), "utf8");
  return `@${fileName}`;
}

function listFields(tableId) {
  return runLark(["base", "+field-list", "--base-token", baseToken, "--table-id", tableId, "--as", "user"]).data.fields || [];
}

function ensureField(tableId, field) {
  const found = listFields(tableId).find((item) => item.name === field.name);
  if (found) return { name: field.name, status: "existing" };
  sleep(400);
  runLark([
    "base",
    "+field-create",
    "--base-token",
    baseToken,
    "--table-id",
    tableId,
    "--json",
    jsonArg(`field-site-api-${field.name}`, field),
    "--as",
    "user",
  ]);
  return { name: field.name, status: "created" };
}

function recordList(tableId, limit = 500) {
  return runLark([
    "base",
    "+record-list",
    "--base-token",
    baseToken,
    "--table-id",
    tableId,
    "--as",
    "user",
    "--limit",
    String(limit),
    "--format",
    "json",
  ]).data;
}

function recordsAsObjects(data) {
  const fields = data.fields || [];
  return (data.data || []).map((row, index) => {
    const object = { _record_id: data.record_id_list?.[index] };
    for (let i = 0; i < fields.length; i += 1) object[fields[i]] = row[i];
    return object;
  });
}

function batchUpdate(tableId, recordIds, patch, label) {
  if (!recordIds.length) return { label, status: "skipped-empty" };
  sleep(500);
  runLark([
    "base",
    "+record-batch-update",
    "--base-token",
    baseToken,
    "--table-id",
    tableId,
    "--json",
    jsonArg(`update-${label}`, { record_id_list: recordIds, patch }),
    "--as",
    "user",
  ]);
  return { label, status: "updated", count: recordIds.length };
}

function batchCreate(tableId, fields, rows, label) {
  if (!rows.length) return { label, status: "skipped-empty" };
  sleep(500);
  runLark([
    "base",
    "+record-batch-create",
    "--base-token",
    baseToken,
    "--table-id",
    tableId,
    "--json",
    jsonArg(`records-${label}`, { fields, rows }),
    "--as",
    "user",
  ]);
  return { label, status: "created", count: rows.length };
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
    try {
      if (value.startsWith('"') || value.startsWith("{") || value.startsWith("[")) value = JSON.parse(value);
    } catch {
      // Keep the raw value.
    }
    data[key] = value;
  }
  return { data, body };
}

function pickBody(body) {
  const marker = "## 正文";
  const idx = body.indexOf(marker);
  if (idx < 0) return body.trim();
  return body.slice(idx + marker.length).trim();
}

function findDraftFiles(target) {
  const stageRoot = path.join(cwd, "website-draft-stage");
  if (!fs.existsSync(stageRoot)) return [];
  const dirs = fs.readdirSync(stageRoot, { withFileTypes: true }).filter((item) => item.isDirectory());
  const files = [];
  for (const dir of dirs) {
    const draftPath = path.join(stageRoot, dir.name, "index.md");
    const manifestPath = path.join(stageRoot, dir.name, "draft-manifest.json");
    if (!fs.existsSync(draftPath) || !fs.existsSync(manifestPath)) continue;
    const draftManifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    if (target && ![draftManifest.brief_id, draftManifest.content_id, draftManifest.slug].includes(target)) continue;
    files.push({ draftPath, manifestPath, draftManifest });
  }
  return files;
}

function buildPayload(file) {
  const markdown = fs.readFileSync(file.draftPath, "utf8");
  const { data, body } = parseFrontmatter(markdown);
  return {
    contentId: data.content_id || file.draftManifest.content_id,
    briefId: data.brief_id || file.draftManifest.brief_id || null,
    title: data.title || file.draftManifest.title || data.content_id,
    slug: data.slug || file.draftManifest.slug,
    excerpt: data.meta_description || null,
    content: pickBody(body),
    platform: "website",
    status: "staged",
    approvalStatus: data.approval_status || file.draftManifest.approval_status || "pending",
    reviewScore: data.review_score ? Number(data.review_score) : null,
    qualitySummary: null,
    source: "content_hub",
    adapterId: "website_internal_api_adapter",
    metaTitle: data.meta_title || data.title || file.draftManifest.title || null,
    metaDescription: data.meta_description || null,
    previewPath: file.draftPath,
    payload: {
      localDraftFile: file.draftPath,
      localManifestFile: file.manifestPath,
      contentHubBaseUrl: manifest.baseUrl,
      generatedAt: data.generated_at || file.draftManifest.generated_at || null,
      autoPublish: false,
    },
  };
}

async function pushPayload(apiBase, token, payload) {
  const res = await fetch(`${apiBase.replace(/\/$/, "")}/api/internal/content/drafts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const response = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, response };
}

const now = Date.now();
const target = process.argv.find((arg) => arg.startsWith("brief_") || arg.startsWith("content_") || arg.startsWith("zhuangxiu-")) || "";
const dryRun = process.argv.includes("--dry-run");
const apiBase = process.env.ZENO_SITE_API_BASE || "http://localhost:3000";
const token = process.env.ZENO_INTERNAL_API_TOKEN || "";

for (const field of [
  { name: "网站后台状态", type: "text" },
  { name: "网站后台回执", type: "text" },
  { name: "网站后台同步时间", type: "datetime" },
]) {
  ensureField(ids.drafts, field);
}

const files = findDraftFiles(target);
const drafts = recordsAsObjects(recordList(ids.drafts));
const results = [];

if (!dryRun && !token) {
  throw new Error("Missing ZENO_INTERNAL_API_TOKEN. Use --dry-run to validate payloads without pushing.");
}

for (const file of files) {
  const payload = buildPayload(file);
  const draftRecord = drafts.find((item) => item.content_id === payload.contentId);
  const result = dryRun
    ? { ok: true, status: "dry_run", response: { message: "Payload validated locally" } }
    : await pushPayload(apiBase, token, payload);

  if (draftRecord && result.ok) {
    batchUpdate(
      ids.drafts,
      [draftRecord._record_id],
      {
        "网站后台状态": dryRun ? "dry_run_validated" : "pushed_to_website_api",
        "网站后台回执": dryRun ? JSON.stringify({ dry_run: true, contentId: payload.contentId }) : JSON.stringify(result.response),
        "网站后台同步时间": now,
      },
      `website-api-${payload.contentId}`
    );
  }

  results.push({
    content_id: payload.contentId,
    brief_id: payload.briefId,
    slug: payload.slug,
    dry_run: dryRun,
    api_base: apiBase,
    ok: result.ok,
    status: result.status,
    response: result.response,
  });
}

const summary = {
  target: target || "all_website_stage",
  dry_run: dryRun,
  api_base: apiBase,
  count: files.length,
  pushed: results.filter((item) => item.ok).length,
  failed: results.filter((item) => !item.ok).length,
  results,
};

summary.taskRun = batchCreate(
  ids.taskRuns,
  ["run_id", "任务类型", "触发来源", "输入", "输出", "状态", "错误信息", "执行时间", "skill_id", "skill_chain", "调用方式", "人工确认"],
  [[
    `run_${now}`,
    "push_website_stage_to_site_api",
    "Codex CLI",
    target || "all website staged drafts",
    `dry_run=${dryRun}; count=${files.length}; pushed=${summary.pushed}; failed=${summary.failed}`,
    summary.failed ? "failed" : "success",
    results.filter((item) => !item.ok).map((item) => `${item.content_id}: ${item.status}`).join("\n"),
    now,
    "automation_workflows",
    "website_stage -> zeno_site_internal_api -> drafts_receipt",
    "Hermes/CLI website API adapter",
    "真实发布前必须",
  ]],
  "task-run-push-website-stage-to-site-api"
);

fs.writeFileSync(path.join(cwd, "push-website-stage-to-site-api-result.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify(summary, null, 2));
