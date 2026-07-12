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

function lineOrNone(items, render) {
  if (!items.length) return "- 无";
  return items.map(render).join("\n");
}

const now = Date.now();
const nowIso = new Date(now).toISOString();

const data = {
  topics: recordsAsObjects(recordList(ids.topics)),
  briefs: recordsAsObjects(recordList(ids.briefs)),
  drafts: recordsAsObjects(recordList(ids.drafts)),
  reviews: recordsAsObjects(recordList(ids.reviews)),
  approvals: recordsAsObjects(recordList(ids.approvals)),
  publishJobs: recordsAsObjects(recordList(ids.publishJobs)),
  metrics: recordsAsObjects(recordList(ids.metrics)),
  taskRuns: recordsAsObjects(recordList(ids.taskRuns)),
};

const pendingApprovals = data.approvals.filter((item) => selectValue(item["审批结果"]) === "pending");
const approvedApprovals = data.approvals.filter((item) => selectValue(item["审批结果"]) === "approved");
const pendingPublishJobs = data.publishJobs.filter((item) => ["pending", "scheduled"].includes(selectValue(item["发布状态"])));
const dryRunJobs = data.publishJobs.filter((item) => selectValue(item["发布状态"]) === "skipped" && item["发布方式"] === "dry_run_only");
const reviewedDrafts = data.drafts.filter((item) => selectValue(item["当前状态"]) === "reviewed");
const stagedDrafts = data.drafts.filter((item) => String(item["草稿状态"] || "").startsWith("staged_"));
const websiteStagedDrafts = stagedDrafts.filter((item) => item["平台"] === "website");
const wechatStagedDrafts = stagedDrafts.filter((item) => item["平台"] === "wechat_oa");
const highScoreTopics = data.topics
  .filter((item) => Number(item["总分"] || 0) >= 80)
  .sort((a, b) => Number(b["总分"] || 0) - Number(a["总分"] || 0));

const dashboard = [
  "# Zeno 内容中台 v0.1 运营看板",
  "",
  `生成时间：${nowIso}`,
  "",
  `飞书中台：${manifest.baseUrl}`,
  "",
  "## 当前结论",
  "",
  pendingPublishJobs.length === 0
    ? "系统已跑通到发布前一刻，真实发布闸门关闭，当前没有真实待发布任务。"
    : "存在真实待发布任务，请先核对是否已经人工审批通过。",
  "",
  "## 核心数量",
  "",
  `- 选题：${data.topics.length}`,
  `- Brief：${data.briefs.length}`,
  `- 稿件：${data.drafts.length}`,
  `- 已质检稿件：${reviewedDrafts.length}`,
  `- 质检记录：${data.reviews.length}`,
  `- 待人工审批：${pendingApprovals.length}`,
  `- 已人工通过：${approvedApprovals.length}`,
  `- 已进入本地草稿区：${stagedDrafts.length}`,
  `- 网站本地草稿：${websiteStagedDrafts.length}`,
  `- 公众号本地草稿：${wechatStagedDrafts.length}`,
  `- dry-run 发布记录：${dryRunJobs.length}`,
  `- 真实待发布任务：${pendingPublishJobs.length}`,
  `- 数据回流记录：${data.metrics.length}`,
  `- 执行日志：${data.taskRuns.length}`,
  "",
  "## 本地草稿区",
  "",
  lineOrNone(
    stagedDrafts,
    (item) => `- ${item.content_id} / ${item["平台"]} / ${item["草稿状态"]} / ${item["草稿区路径"] || ""}`
  ),
  "",
  "## 待审批清单",
  "",
  lineOrNone(
    pendingApprovals,
    (item) => `- ${item.approval_id} / ${item.content_id}：${item["审批意见"] || "等待人工确认"}`
  ),
  "",
  "## 已跑通内容",
  "",
  lineOrNone(
    data.briefs,
    (item) => `- ${item.brief_id} / ${item.topic_id}：${item["核心判断"] || ""}`
  ),
  "",
  "## 高分选题池",
  "",
  lineOrNone(
    highScoreTopics,
    (item) => `- ${item.topic_id} / ${item["标题"]} / 总分 ${item["总分"]} / 下一步：${item["下一步动作"] || "待判断"}`
  ),
  "",
  "## 不可自动化边界",
  "",
  "- 不自动把审批改成 approved",
  "- 不自动发布网站",
  "- 不自动写入公众号草稿箱",
  "- 不自动写入 Obsidian 源库",
  "- 不自动群发任何平台内容",
  "",
  "## 下一步执行顺序",
  "",
  "1. 人工审 4 篇已生成内容，确认事实、脱敏、语气和服务入口。",
  "2. 配置飞书智能体指令到 Hermes/CLI 的触发方式。",
  "3. 提供网站项目路径或后台 API，把本地网站草稿区替换成真实网站草稿区。",
  "4. 提供公众号草稿 API 权限后，把本地公众号中转包替换成公众号草稿箱 adapter。",
  "5. 等真实发布后，再接数据回流和 GEO 复盘。",
  "",
].join("\n");

const dashboardPath = path.join(cwd, "operator-dashboard.md");
fs.writeFileSync(dashboardPath, dashboard, "utf8");

const result = {
  generated_at: nowIso,
  dashboard: dashboardPath,
  counts: {
    topics: data.topics.length,
    briefs: data.briefs.length,
    drafts: data.drafts.length,
    reviews: data.reviews.length,
    pending_approvals: pendingApprovals.length,
    pending_publish_jobs: pendingPublishJobs.length,
    dry_run_publish_jobs: dryRunJobs.length,
    staged_drafts: stagedDrafts.length,
  },
};

result.taskRun = batchCreate(
  ids.taskRuns,
  ["run_id", "任务类型", "触发来源", "输入", "输出", "状态", "错误信息", "执行时间", "skill_id", "skill_chain", "调用方式", "人工确认"],
  [[
    `run_${now}`,
    "generate_operator_dashboard",
    "Codex CLI",
    "all core tables",
    `dashboard=${dashboardPath}; pending_approvals=${pendingApprovals.length}; pending_publish_jobs=${pendingPublishJobs.length}`,
    "success",
    "",
    now,
    "automation_workflows",
    "core_tables -> operator_dashboard -> next_actions",
    "Hermes/CLI",
    "不需要",
  ]],
  "task-run-generate-operator-dashboard"
);

fs.writeFileSync(path.join(cwd, "operator-dashboard-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
