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

function selectValue(value) {
  return Array.isArray(value) ? value[0] : value;
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

const now = Date.now();
const target = process.argv[2] || "";

const data = {
  topics: recordsAsObjects(recordList(ids.topics)),
  briefs: recordsAsObjects(recordList(ids.briefs)),
  drafts: recordsAsObjects(recordList(ids.drafts)),
  reviews: recordsAsObjects(recordList(ids.reviews)),
  approvals: recordsAsObjects(recordList(ids.approvals)),
  publishJobs: recordsAsObjects(recordList(ids.publishJobs)),
};

const pendingApprovals = data.approvals.filter((item) => selectValue(item["审批结果"]) === "pending");
const approvedApprovals = data.approvals.filter((item) => selectValue(item["审批结果"]) === "approved");
const pendingPublishJobs = data.publishJobs.filter((item) => ["pending", "scheduled"].includes(selectValue(item["发布状态"])));

let matched = {};
if (target) {
  const matchedBriefs = data.briefs.filter((item) => item.brief_id === target || item.topic_id === target);
  const matchedBriefIds = new Set(matchedBriefs.map((item) => item.brief_id));
  const matchedDrafts = data.drafts.filter(
    (item) =>
      item.content_id === target ||
      item.brief_id === target ||
      matchedBriefIds.has(item.brief_id) ||
      String(item["标题"] || "").includes(target)
  );
  const matchedContentIds = new Set(matchedDrafts.map((item) => item.content_id));
  matched = {
    topics: data.topics.filter((item) => item.topic_id === target || String(item["标题"] || "").includes(target)),
    briefs: matchedBriefs,
    drafts: matchedDrafts,
    reviews: data.reviews.filter((item) => item.content_id === target || item.review_id === target || matchedContentIds.has(item.content_id)),
    approvals: data.approvals.filter((item) => item.content_id === target || item.approval_id === target || matchedContentIds.has(item.content_id)),
    publishJobs: data.publishJobs.filter((item) => item.content_id === target || item.publish_id === target || matchedContentIds.has(item.content_id)),
  };
}

const report = {
  generated_at: new Date(now).toISOString(),
  base_url: manifest.baseUrl,
  target: target || null,
  counts: {
    topics: data.topics.length,
    briefs: data.briefs.length,
    drafts: data.drafts.length,
    reviews: data.reviews.length,
    approvals: data.approvals.length,
    publish_jobs: data.publishJobs.length,
    pending_approvals: pendingApprovals.length,
    approved_approvals: approvedApprovals.length,
    pending_publish_jobs: pendingPublishJobs.length,
  },
  pending_approvals: pendingApprovals.map((item) => ({
    approval_id: item.approval_id,
    content_id: item.content_id,
    opinion: item["审批意见"],
  })),
  pending_publish_jobs: pendingPublishJobs.map((item) => ({
    publish_id: item.publish_id,
    content_id: item.content_id,
    platform: item["平台"],
    adapter_id: item.adapter_id,
  })),
  matched,
};

const reportPath = path.join(cwd, "status-report-result.json");
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

batchCreate(
  ids.taskRuns,
  ["run_id", "任务类型", "触发来源", "输入", "输出", "状态", "错误信息", "执行时间", "skill_id", "skill_chain", "调用方式", "人工确认"],
  [[
    `run_${now}`,
    "status_report",
    "Codex CLI",
    target || "all",
    `pending_approvals=${pendingApprovals.length}; publish_jobs=${data.publishJobs.length}`,
    "success",
    "",
    now,
    "automation_workflows",
    "feishu_command_status -> read_core_tables -> report",
    "lark-cli",
    "不需要",
  ]],
  "task-run-status-report"
);

console.log(JSON.stringify(report, null, 2));
