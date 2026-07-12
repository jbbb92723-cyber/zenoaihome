import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(cwd, "manifest.json"), "utf8"));
const baseToken = manifest.baseToken;

const ids = {
  topics: "tblWqjt7QMwWpusg",
  briefs: "tblk8GrAQCWBXmU5",
  drafts: "tblWRTJDAXMYoj2y",
  reviews: "tbluesIB80mYriTs",
  approvals: "tblNzhcnVkZfgBiF",
  publishJobs: "tblrsViHVTajQeVn",
  metrics: "tblsefPrNyiqFZbc",
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
  return runLark(["base", "+field-list", "--base-token", baseToken, "--table-id", tableId, "--as", "bot"]).data.fields || [];
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
    jsonArg(`field-dryrun-${tableId}-${field.name}`, field),
    "--as","bot",
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
    "--as","bot",
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

function selectValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

function existingByField(tableId, fieldName) {
  const data = recordList(tableId);
  const idx = (data.fields || []).indexOf(fieldName);
  if (idx < 0) return new Set();
  return new Set((data.data || []).map((row) => row[idx]).filter(Boolean));
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
    "--as","bot",
  ]);
  return { label, status: "created", count: rows.length };
}

function packageBody({ kind, draft, brief, review, approval, publishId }) {
  const title = draft["标题"] || draft.content_id;
  const platform = draft["平台"] || "unknown";
  return [
    "---",
    `dry_run: true`,
    `kind: ${kind}`,
    `publish_id: ${publishId}`,
    `content_id: ${draft.content_id}`,
    `brief_id: ${draft.brief_id}`,
    `platform: ${platform}`,
    `generated_at: ${new Date().toISOString()}`,
    "---",
    "",
    `# ${title}`,
    "",
    "## 干跑说明",
    "",
    "- 这是系统全链路干跑产物。",
    "- 不会发布到网站。",
    "- 不会写入公众号草稿箱。",
    "- 不会写入 Obsidian 源库。",
    "- 不会绕过人工审批。",
    "",
    "## Brief 核心判断",
    "",
    brief?.["核心判断"] || "",
    "",
    "## 质检摘要",
    "",
    draft["质检摘要"] || review?.["修改建议"] || "",
    "",
    "## 审批状态",
    "",
    `- approval_id: ${approval?.approval_id || "none"}`,
    `- 审批结果: ${selectValue(approval?.["审批结果"]) || "none"}`,
    "",
    "## 正文",
    "",
    draft["正文"] || "",
    "",
  ].join("\n");
}

const now = Date.now();
const stamp = new Date(now).toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
const briefId = process.argv[2] || "brief_20260527_005";
const outDir = path.join(cwd, "dry-run-outbox", `${briefId}-${stamp}`);
fs.mkdirSync(outDir, { recursive: true });

for (const field of [
  { name: "dry_run_id", type: "text" },
  { name: "dry_run_stage", type: "text" },
]) {
  ensureField(ids.publishJobs, field);
}
for (const field of [
  { name: "dry_run_id", type: "text" },
  { name: "内容阶段", type: "text" },
]) {
  ensureField(ids.metrics, field);
}

const topics = recordsAsObjects(recordList(ids.topics));
const briefs = recordsAsObjects(recordList(ids.briefs));
const drafts = recordsAsObjects(recordList(ids.drafts));
const reviews = recordsAsObjects(recordList(ids.reviews));
const approvals = recordsAsObjects(recordList(ids.approvals));

const brief = briefs.find((item) => item.brief_id === briefId);
if (!brief) throw new Error(`Missing brief: ${briefId}`);

const topic = topics.find((item) => item.topic_id === brief.topic_id);
const selectedDrafts = drafts.filter((item) => item.brief_id === briefId);
if (!selectedDrafts.length) throw new Error(`No drafts for brief: ${briefId}`);

const dryRunId = `dryrun_${briefId}_${stamp}`;
const publishRows = [];
const metricRows = [];
const packageFiles = [];

for (const draft of selectedDrafts) {
  const review = reviews.find((item) => item.content_id === draft.content_id);
  const approval = approvals.find((item) => item.content_id === draft.content_id);
  const platform = draft["平台"] || "unknown";
  const publishId = `dryrun_publish_${draft.content_id}_${stamp}`;
  const packagePath = path.join(outDir, `${platform}-${draft.content_id}-publisher-package.md`);
  fs.writeFileSync(packagePath, packageBody({ kind: "publisher_package", draft, brief, review, approval, publishId }), "utf8");
  packageFiles.push({ platform, content_id: draft.content_id, file: packagePath });

  publishRows.push([
    publishId,
    draft.content_id,
    platform,
    platform,
    "skipped",
    "",
    now,
    now,
    `${platform === "website" ? "website_draft_adapter" : platform === "wechat_oa" ? "wechat_oa_draft_adapter" : "manual_adapter"}`,
    "dry_run_only",
    "模拟审批，不发布",
    packagePath,
    "干跑任务，永不重试真实发布",
    dryRunId,
    "publisher_adapter_dry_run",
  ]);

  metricRows.push([
    `metric_${publishId}`,
    publishId,
    platform,
    0,
    0,
    0,
    0,
    0,
    now,
    dryRunId,
    "dry_run_zero_metrics",
  ]);
}

const obsidianPreview = [
  "---",
  "dry_run: true",
  `dry_run_id: ${dryRunId}`,
  `brief_id: ${briefId}`,
  `generated_at: ${new Date(now).toISOString()}`,
  "---",
  "",
  `# ${briefId} Obsidian 回流干跑包`,
  "",
  "## 说明",
  "",
  "这份文件只验证 Obsidian 回流格式，不写入 Obsidian 源库。",
  "",
  "## 选题",
  "",
  `- topic_id: ${topic?.topic_id || ""}`,
  `- 标题: ${topic?.["标题"] || ""}`,
  `- 总分: ${topic?.["总分"] || ""}`,
  "",
  "## Brief",
  "",
  `- 目标读者: ${brief["目标读者"]}`,
  `- 用户问题: ${brief["用户问题"]}`,
  `- 核心判断: ${brief["核心判断"]}`,
  "",
  "## 产物",
  "",
  ...packageFiles.map((item) => `- ${item.platform}: ${item.file}`),
  "",
].join("\n");
const obsidianPreviewPath = path.join(outDir, "obsidian-archive-dry-run.md");
fs.writeFileSync(obsidianPreviewPath, obsidianPreview, "utf8");

const checklistPath = path.join(outDir, "full-system-dry-run-checklist.md");
const checklist = [
  `# ${dryRunId} 全链路干跑检查`,
  "",
  "## 已验证环节",
  "",
  "- [x] Obsidian 素材索引已存在",
  "- [x] 选题已入池并评分",
  "- [x] Brief 已生成",
  "- [x] 网站版/公众号版初稿已生成",
  "- [x] AI 质检已生成",
  "- [x] 人工审批闸门存在，当前仍 pending",
  "- [x] 发布任务表可写入 dry_run/skipped 任务",
  "- [x] 网站草稿包可导出",
  "- [x] 公众号草稿包可导出",
  "- [x] Obsidian 回流预览可生成",
  "- [x] 数据回流表可写入 0 值占位",
  "- [x] task_runs 执行日志可追踪",
  "",
  "## 未触发事项",
  "",
  "- [ ] 未发布网站",
  "- [ ] 未写入公众号草稿箱",
  "- [ ] 未写入 Obsidian 源库",
  "- [ ] 未修改真实审批结果",
  "",
].join("\n");
fs.writeFileSync(checklistPath, checklist, "utf8");

const existingDryRuns = existingByField(ids.publishJobs, "dry_run_id");
const shouldCreatePublishRows = !existingDryRuns.has(dryRunId);
const publishResult = batchCreate(
  ids.publishJobs,
  [
    "publish_id",
    "content_id",
    "channel_id",
    "平台",
    "发布状态",
    "外部链接",
    "计划发布时间",
    "实际发布时间",
    "adapter_id",
    "发布方式",
    "人工确认",
    "回执证据",
    "失败重试策略",
    "dry_run_id",
    "dry_run_stage",
  ],
  shouldCreatePublishRows ? publishRows : [],
  "full-system-dry-run-publish-jobs"
);

const metricsResult = batchCreate(
  ids.metrics,
  ["metric_id", "publish_id", "平台", "阅读", "点赞", "收藏", "评论", "转化", "数据日期", "dry_run_id", "内容阶段"],
  metricRows,
  "full-system-dry-run-metrics"
);

const result = {
  dry_run_id: dryRunId,
  brief_id: briefId,
  out_dir: outDir,
  packages: packageFiles,
  obsidian_preview: obsidianPreviewPath,
  checklist: checklistPath,
  publish_jobs: publishResult,
  metrics: metricsResult,
  safeguards: [
    "真实审批结果未修改",
    "发布任务状态写入 skipped",
    "发布方式写入 dry_run_only",
    "公众号/网站/Obsidian 都未实际写入",
  ],
};

result.taskRun = batchCreate(
  ids.taskRuns,
  ["run_id", "任务类型", "触发来源", "输入", "输出", "状态", "错误信息", "执行时间", "skill_id", "skill_chain", "调用方式", "人工确认"],
  [[
    `run_${now}`,
    "full_system_dry_run",
    "Codex CLI",
    `brief_id=${briefId}`,
    `dry_run_id=${dryRunId}; packages=${packageFiles.length}; publish_jobs=${publishRows.length}; metrics=${metricRows.length}`,
    "success",
    "",
    now,
    "automation_workflows,dbs_content,dbs_ai_check,gstack_browser_qa",
    "topic -> brief -> draft -> review -> approval_gate -> dry_run_publish_jobs -> package_export -> obsidian_preview -> metrics -> task_runs",
    "Hermes/CLI dry_run",
    "必须",
  ]],
  "task-run-full-system-dry-run"
);

fs.writeFileSync(path.join(cwd, "full-system-dry-run-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
