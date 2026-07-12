import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(cwd, "manifest.json"), "utf8"));
const baseToken = manifest.baseToken;

const ids = {
  drafts: "tblWRTJDAXMYoj2y",
  reviews: "tbluesIB80mYriTs",
  approvals: "tblNzhcnVkZfgBiF",
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
  sleep(500);
  runLark([
    "base",
    "+field-create",
    "--base-token",
    baseToken,
    "--table-id",
    tableId,
    "--json",
    jsonArg(`field-wechat-stage-${field.name}`, field),
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
    "--as","bot",
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
    "--as","bot",
  ]);
  return { label, status: "created", count: rows.length };
}

function fileSlug(draft) {
  return String(draft.content_id || "wechat-draft").replace(/[^\w.-]+/g, "_");
}

function summaryFor(draft) {
  const title = draft["标题"] || "";
  if (title.includes("按实结算")) {
    return "报价单里的“按实结算”不一定是坑，关键是单价、计量方式、确认流程和争议规则有没有写清。";
  }
  if (title.includes("基础部分总合计")) {
    return "报价单写“基础部分总合计”，通常不是最终闭口价，签约前要先确认未包含项目和按实结算规则。";
  }
  return "一篇帮助业主在签约前看清装修报价边界和风险规则的 ZenoAIHome 内容。";
}

function renderWechatPackage(draft, review, approval) {
  const title = draft["标题"] || draft.content_id;
  const approvalStatus = selectValue(approval?.["审批结果"]) || "none";
  return [
    "---",
    `content_id: ${draft.content_id}`,
    `brief_id: ${draft.brief_id}`,
    "platform: wechat_oa",
    "stage: local_wechat_draft",
    "status: draft",
    `approval_status: ${approvalStatus}`,
    "auto_publish: false",
    `generated_at: ${new Date().toISOString()}`,
    "---",
    "",
    "# 公众号草稿箱中转包",
    "",
    "- 当前文件用于人工复制到公众号草稿箱，或后续接入微信草稿 API。",
    "- 当前不会调用微信 API，不会群发，不会改审批状态。",
    "- 发布前需要人工确认标题、封面图、摘要、排版和原文链接。",
    "",
    "## 标题",
    "",
    title,
    "",
    "## 摘要建议",
    "",
    summaryFor(draft),
    "",
    "## 封面图状态",
    "",
    "- 暂未生成封面图",
    "- 建议后续接入封面图模板或人工上传",
    "",
    "## 质检摘要",
    "",
    draft["质检摘要"] || review?.["修改建议"] || "无",
    "",
    "## 人工审批状态",
    "",
    approval
      ? [
          `- approval_id: ${approval.approval_id}`,
          `- 审批结果: ${approvalStatus}`,
          `- 审批意见: ${approval["审批意见"] || ""}`,
        ].join("\n")
      : "未找到审批记录",
    "",
    "## 正文",
    "",
    draft["正文"] || "",
    "",
    "## 人工发布前检查",
    "",
    "- [ ] 事实和案例已复核",
    "- [ ] 不含客户隐私、完整地址、具体公司评价",
    "- [ ] 没有恐吓式表达",
    "- [ ] 服务入口低压自然",
    "- [ ] 标题不夸张",
    "- [ ] 封面图和摘要已确认",
    "",
  ].join("\n");
}

const now = Date.now();
const target = process.argv.find((arg) => arg.startsWith("brief_") || arg.startsWith("content_")) || "";
const approvedOnly = process.argv.includes("--approved-only");

const ensuredFields = [
  ensureField(ids.drafts, { name: "草稿区路径", type: "text" }),
  ensureField(ids.drafts, { name: "草稿状态", type: "text" }),
  ensureField(ids.drafts, { name: "草稿适配器", type: "text" }),
  ensureField(ids.drafts, { name: "草稿生成时间", type: "datetime" }),
  ensureField(ids.drafts, { name: "公众号摘要建议", type: "text" }),
];

const drafts = recordsAsObjects(recordList(ids.drafts));
const reviews = recordsAsObjects(recordList(ids.reviews));
const approvals = recordsAsObjects(recordList(ids.approvals));

let candidates = drafts.filter((draft) => draft["平台"] === "wechat_oa" && selectValue(draft["当前状态"]) === "reviewed");
if (target.startsWith("brief_")) candidates = candidates.filter((draft) => draft.brief_id === target);
if (target.startsWith("content_")) candidates = candidates.filter((draft) => draft.content_id === target);
if (approvedOnly) {
  candidates = candidates.filter((draft) => {
    const approval = approvals.find((item) => item.content_id === draft.content_id);
    return selectValue(approval?.["审批结果"]) === "approved";
  });
}

const stageRoot = path.join(cwd, "wechat-draft-stage");
fs.mkdirSync(stageRoot, { recursive: true });

const staged = [];
for (const draft of candidates) {
  const review = reviews.find((item) => item.content_id === draft.content_id);
  const approval = approvals.find((item) => item.content_id === draft.content_id);
  const approvalStatus = selectValue(approval?.["审批结果"]) || "none";
  const slug = fileSlug(draft);
  const draftDir = path.join(stageRoot, slug);
  fs.mkdirSync(draftDir, { recursive: true });
  const draftPath = path.join(draftDir, "wechat-draft-package.md");
  const manifestPath = path.join(draftDir, "draft-manifest.json");
  const summary = summaryFor(draft);

  fs.writeFileSync(draftPath, renderWechatPackage(draft, review, approval), "utf8");
  fs.writeFileSync(
    manifestPath,
    `${JSON.stringify(
      {
        content_id: draft.content_id,
        brief_id: draft.brief_id,
        title: draft["标题"],
        platform: "wechat_oa",
        stage: "local_wechat_draft",
        approval_status: approvalStatus,
        approved_for_publish: approvalStatus === "approved",
        auto_publish: false,
        summary,
        draft_file: draftPath,
        generated_at: new Date(now).toISOString(),
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  const draftStatus = approvalStatus === "approved" ? "staged_approved_not_published" : "staged_pending_approval";
  batchUpdate(
    ids.drafts,
    [draft._record_id],
    {
      "草稿区路径": draftPath,
      "草稿状态": draftStatus,
      "草稿适配器": "wechat_local_draft_adapter",
      "草稿生成时间": now,
      "公众号摘要建议": summary,
      "初稿链接": draftPath,
    },
    `wechat-draft-${draft.content_id}`
  );
  staged.push({ content_id: draft.content_id, brief_id: draft.brief_id, title: draft["标题"], approval_status: approvalStatus, draft_file: draftPath, manifest: manifestPath });
}

const reportPath = path.join(stageRoot, "wechat-draft-stage-report.md");
const report = [
  "# 公众号草稿 Adapter 执行报告",
  "",
  `生成时间：${new Date(now).toISOString()}`,
  "",
  "## 执行边界",
  "",
  "- 不调用微信 API",
  "- 不写入公众号草稿箱",
  "- 不群发",
  "- 不修改审批结果",
  "- 不写网站或 Obsidian 源库",
  "",
  "## 本次处理",
  "",
  staged.length
    ? staged.map((item) => `- ${item.content_id} / ${item.title} / ${item.approval_status} / ${item.draft_file}`).join("\n")
    : "- 无符合条件的公众号稿",
  "",
].join("\n");
fs.writeFileSync(reportPath, report, "utf8");

const result = {
  target: target || "all_reviewed_wechat_drafts",
  approved_only: approvedOnly,
  ensured_fields: ensuredFields,
  staged_count: staged.length,
  staged,
  report: reportPath,
  safeguards: ["no_wechat_api", "no_publish", "approval_unchanged", "local_stage_only"],
};

result.taskRun = batchCreate(
  ids.taskRuns,
  ["run_id", "任务类型", "触发来源", "输入", "输出", "状态", "错误信息", "执行时间", "skill_id", "skill_chain", "调用方式", "人工确认"],
  [[
    `run_${now}`,
    "stage_wechat_drafts",
    "Codex CLI",
    target || "all reviewed wechat drafts",
    `staged=${staged.length}; report=${reportPath}`,
    "success",
    "",
    now,
    "automation_workflows",
    "reviewed_wechat_draft -> local_wechat_stage -> drafts_receipt",
    "Hermes/CLI draft-only",
    "进入真实草稿箱前必须",
  ]],
  "task-run-stage-wechat-drafts"
);

fs.writeFileSync(path.join(cwd, "stage-wechat-drafts-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
