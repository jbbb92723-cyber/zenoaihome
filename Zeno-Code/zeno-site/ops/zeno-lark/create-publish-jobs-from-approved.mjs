import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(cwd, "manifest.json"), "utf8"));
const baseToken = manifest.baseToken;

const ids = {
  drafts: "tblWRTJDAXMYoj2y",
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
const drafts = recordsAsObjects(recordList(ids.drafts));
const approvals = recordsAsObjects(recordList(ids.approvals));
const existingJobs = recordsAsObjects(recordList(ids.publishJobs));
const existingPublishIds = new Set(existingJobs.map((job) => job.publish_id).filter(Boolean));

const adapterByPlatform = {
  website: "website_draft_adapter",
  wechat_oa: "wechat_oa_draft_adapter",
  obsidian: "obsidian_archive_adapter",
  zhishixingqiu: "zhishixingqiu_manual_adapter",
};

const approved = approvals.filter((approval) => selectValue(approval["审批结果"]) === "approved");
const rows = [];

for (const approval of approved) {
  const contentId = approval.content_id;
  const draft = drafts.find((item) => item.content_id === contentId);
  if (!draft) continue;
  const platform = draft["平台"] || "unknown";
  const adapterId = adapterByPlatform[platform] || `${platform}_manual_adapter`;
  const publishId = `publish_${contentId}`;
  if (existingPublishIds.has(publishId)) continue;
  rows.push([
    publishId,
    contentId,
    platform,
    platform,
    "pending",
    "",
    now,
    "",
    adapterId,
    "只进草稿",
    "已审批",
    "",
    "失败写入 task_runs；同一 publish_id 不重复创建；人工确认后再重试",
  ]);
}

const result = {
  approvedCount: approved.length,
  publishJobs: batchCreate(
    ids.publishJobs,
    ["publish_id", "content_id", "channel_id", "平台", "发布状态", "外部链接", "计划发布时间", "实际发布时间", "adapter_id", "发布方式", "人工确认", "回执证据", "失败重试策略"],
    rows,
    "publish-jobs-from-approved"
  ),
  createdPublishIds: rows.map((row) => row[0]),
};

result.taskRun = batchCreate(
  ids.taskRuns,
  ["run_id", "任务类型", "触发来源", "输入", "输出", "状态", "错误信息", "执行时间", "skill_id", "skill_chain", "调用方式", "人工确认"],
  [[
    `run_${now}`,
    "create_publish_jobs_from_approved",
    "Codex CLI",
    "approvals_审批记录 where 审批结果=approved",
    `approved=${approved.length}; publish_jobs_created=${rows.length}`,
    "success",
    "",
    now,
    "automation_workflows",
    "approval_approved -> publish_job_pending",
    "Hermes/CLI",
    "必须",
  ]],
  "task-run-create-publish-jobs"
);

result.verification = recordsAsObjects(recordList(ids.publishJobs)).filter((job) => String(job.publish_id || "").includes("content_20260527_005"));

fs.writeFileSync(path.join(cwd, "publish-jobs-from-approved-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
