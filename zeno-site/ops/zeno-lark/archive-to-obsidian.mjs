import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(cwd, "manifest.json"), "utf8"));
const baseToken = manifest.baseToken;

const ids = {
  briefs: "tblk8GrAQCWBXmU5",
  drafts: "tblWRTJDAXMYoj2y",
  reviews: "tbluesIB80mYriTs",
  approvals: "tblNzhcnVkZfgBiF",
  publishJobs: "tblrsViHVTajQeVn",
  taskRuns: "tblNIeOvE10OF9Ml",
};

const vaultRoot = "G:/Zenoaihome.com/赞诺内容资产库";

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

const target = process.argv[2] || "brief_20260527_005";
const execute = process.argv.includes("--execute");
const now = Date.now();
const nowIso = new Date(now).toISOString();

const briefs = recordsAsObjects(recordList(ids.briefs));
const drafts = recordsAsObjects(recordList(ids.drafts));
const reviews = recordsAsObjects(recordList(ids.reviews));
const approvals = recordsAsObjects(recordList(ids.approvals));
const publishJobs = recordsAsObjects(recordList(ids.publishJobs));

const brief = briefs.find((item) => item.brief_id === target);
const selectedDrafts = brief
  ? drafts.filter((item) => item.brief_id === brief.brief_id)
  : drafts.filter((item) => item.content_id === target);

if (!selectedDrafts.length) throw new Error(`No drafts found for target: ${target}`);

const allApproved = selectedDrafts.every((draft) => {
  const approval = approvals.find((item) => item.content_id === draft.content_id);
  return selectValue(approval?.["审批结果"]) === "approved";
});

const archiveTitle = brief?.brief_id || selectedDrafts[0]?.content_id || target;
const safeName = archiveTitle.replace(/[\\/:*?"<>|]/g, "_");
const outboxDir = path.join(cwd, "outbox", archiveTitle);
fs.mkdirSync(outboxDir, { recursive: true });

const archiveMarkdown = [
  "---",
  `archive_id: ${archiveTitle}`,
  `exported_at: ${nowIso}`,
  `source: Zeno 内容中台 v0.1`,
  `approval_required: true`,
  `all_approved: ${allApproved}`,
  "---",
  "",
  `# ${archiveTitle} 中台回流包`,
  "",
  "## 回流状态",
  "",
  `- 是否实际写入 Obsidian：${execute ? "是" : "否，仅预演"}`,
  `- 是否全部人工审批通过：${allApproved ? "是" : "否"}`,
  "",
  "## Brief",
  "",
  brief
    ? [
        `- brief_id: ${brief.brief_id}`,
        `- topic_id: ${brief.topic_id}`,
        `- 状态: ${selectValue(brief["状态"])}`,
        `- 目标读者: ${brief["目标读者"]}`,
        `- 用户问题: ${brief["用户问题"]}`,
        `- 核心判断: ${brief["核心判断"]}`,
        "",
        "### 匹配素材",
        "",
        brief["匹配素材"] || "",
      ].join("\n")
    : "未找到 brief，仅按 content_id 回流。",
  "",
  "## 稿件与质检",
  "",
  ...selectedDrafts.flatMap((draft) => {
    const review = reviews.find((item) => item.content_id === draft.content_id);
    const approval = approvals.find((item) => item.content_id === draft.content_id);
    const job = publishJobs.find((item) => item.content_id === draft.content_id);
    return [
      `### ${draft.content_id}`,
      "",
      `- 平台: ${draft["平台"]}`,
      `- 标题: ${draft["标题"]}`,
      `- 当前状态: ${selectValue(draft["当前状态"])}`,
      `- 审批结果: ${selectValue(approval?.["审批结果"]) || "none"}`,
      `- 发布任务: ${job?.publish_id || "none"}`,
      "",
      "#### 质检摘要",
      "",
      draft["质检摘要"] || review?.["修改建议"] || "",
      "",
      "#### AI 味与事实风险",
      "",
      review ? `${review["AI味"] || ""}\n\n${review["事实风险"] || ""}` : "未找到质检记录",
      "",
      "#### 正文",
      "",
      draft["正文"] || "",
      "",
    ];
  }),
].join("\n");

const previewPath = path.join(outboxDir, "obsidian-archive-preview.md");
fs.writeFileSync(previewPath, archiveMarkdown, "utf8");

let obsidianPath = null;
let status = "success";
let error = "";

if (execute) {
  if (!allApproved) {
    status = "skipped";
    error = "Not all selected drafts are approved; archive write blocked.";
  } else {
    const targetDir = path.join(vaultRoot, "04_内容资产单元", safeName);
    fs.mkdirSync(targetDir, { recursive: true });
    obsidianPath = path.join(targetDir, "中台回流包.md");
    fs.writeFileSync(obsidianPath, archiveMarkdown, "utf8");
  }
}

const result = {
  target,
  execute,
  all_approved: allApproved,
  preview_path: previewPath,
  obsidian_path: obsidianPath,
  status,
  error,
};

result.taskRun = batchCreate(
  ids.taskRuns,
  ["run_id", "任务类型", "触发来源", "输入", "输出", "状态", "错误信息", "执行时间", "skill_id", "skill_chain", "调用方式", "人工确认"],
  [[
    `run_${now}`,
    "archive_to_obsidian",
    "Codex CLI",
    target,
    `preview=${previewPath}; execute=${execute}; obsidian=${obsidianPath || ""}`,
    status,
    error,
    now,
    "automation_workflows",
    "approved_content -> obsidian_archive_preview -> optional_execute",
    "Hermes/CLI",
    "必须",
  ]],
  "task-run-archive-to-obsidian"
);

fs.writeFileSync(path.join(cwd, "archive-to-obsidian-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
