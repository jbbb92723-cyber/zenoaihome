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
    jsonArg(`field-website-stage-${field.name}`, field),
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

function slugFor(draft) {
  const title = draft["标题"] || "";
  if (title.includes("按实结算")) return "zhuangxiu-baojia-anshi-jiesuan";
  if (title.includes("基础部分总合计")) return "zhuangxiu-baojia-jichu-zongheji-bushi-zuizhongjia";
  if (title.includes("材料") && title.includes("品牌")) return "zhuangxiu-cailiao-pinpaixinghao-tihuan-guize";
  return String(draft.content_id || "draft").replace(/^content_/, "").replace(/_/g, "-");
}

function metaDescriptionFor(draft) {
  const title = draft["标题"] || "";
  if (title.includes("按实结算")) {
    return "装修报价单里的“按实结算”不一定是坑，关键要看单价、计量方式、确认流程和争议处理规则是否写清楚。";
  }
  if (title.includes("基础部分总合计")) {
    return "装修报价单写“基础部分总合计”，通常不等于最终闭口价。签约前要确认未包含项目、按实结算、税费、管理费和垃圾外运等风险边界。";
  }
  return "ZenoAIHome 装修报价风险分析，帮助业主在签约前看清报价边界、增项规则和服务转化入口。";
}

function renderWebsiteDraft(draft, review, approval) {
  const title = draft["标题"] || draft.content_id;
  const slug = slugFor(draft);
  const approvalStatus = selectValue(approval?.["审批结果"]) || "none";
  const reviewScore = review?.["总分"] || "";

  return [
    "---",
    `content_id: ${draft.content_id}`,
    `brief_id: ${draft.brief_id}`,
    `slug: ${slug}`,
    `title: ${JSON.stringify(title)}`,
    `meta_title: ${JSON.stringify(title)}`,
    `meta_description: ${JSON.stringify(metaDescriptionFor(draft))}`,
    "status: draft",
    "stage: local_website_draft",
    `approval_status: ${approvalStatus}`,
    `review_score: ${reviewScore}`,
    `generated_at: ${new Date().toISOString()}`,
    "auto_publish: false",
    "---",
    "",
    "# 网站草稿说明",
    "",
    "- 这是网站草稿 adapter 生成的本地草稿文件。",
    "- 当前不会部署、不会上线、不会写入正式网站数据库。",
    "- 进入真实网站草稿区前，仍需要人工审批通过。",
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
  ensureField(ids.drafts, { name: "网站Slug", type: "text" }),
];

const drafts = recordsAsObjects(recordList(ids.drafts));
const reviews = recordsAsObjects(recordList(ids.reviews));
const approvals = recordsAsObjects(recordList(ids.approvals));

let candidates = drafts.filter((draft) => draft["平台"] === "website" && selectValue(draft["当前状态"]) === "reviewed");
if (target.startsWith("brief_")) candidates = candidates.filter((draft) => draft.brief_id === target);
if (target.startsWith("content_")) candidates = candidates.filter((draft) => draft.content_id === target);
if (approvedOnly) {
  candidates = candidates.filter((draft) => {
    const approval = approvals.find((item) => item.content_id === draft.content_id);
    return selectValue(approval?.["审批结果"]) === "approved";
  });
}

const stageRoot = path.join(cwd, "website-draft-stage");
fs.mkdirSync(stageRoot, { recursive: true });

const staged = [];
for (const draft of candidates) {
  const review = reviews.find((item) => item.content_id === draft.content_id);
  const approval = approvals.find((item) => item.content_id === draft.content_id);
  const approvalStatus = selectValue(approval?.["审批结果"]) || "none";
  const slug = slugFor(draft);
  const draftDir = path.join(stageRoot, slug);
  fs.mkdirSync(draftDir, { recursive: true });
  const draftPath = path.join(draftDir, "index.md");
  const manifestPath = path.join(draftDir, "draft-manifest.json");

  fs.writeFileSync(draftPath, renderWebsiteDraft(draft, review, approval), "utf8");
  fs.writeFileSync(
    manifestPath,
    `${JSON.stringify(
      {
        content_id: draft.content_id,
        brief_id: draft.brief_id,
        title: draft["标题"],
        slug,
        stage: "local_website_draft",
        approval_status: approvalStatus,
        approved_for_publish: approvalStatus === "approved",
        auto_publish: false,
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
      "草稿适配器": "website_local_draft_adapter",
      "草稿生成时间": now,
      "网站Slug": slug,
      "初稿链接": draftPath,
    },
    `website-draft-${draft.content_id}`
  );
  staged.push({ content_id: draft.content_id, brief_id: draft.brief_id, title: draft["标题"], approval_status: approvalStatus, slug, draft_file: draftPath, manifest: manifestPath });
}

const reportPath = path.join(stageRoot, "website-draft-stage-report.md");
const report = [
  "# 网站草稿 Adapter 执行报告",
  "",
  `生成时间：${new Date(now).toISOString()}`,
  "",
  "## 执行边界",
  "",
  "- 不发布网站",
  "- 不触发部署",
  "- 不修改审批结果",
  "- 不写公众号",
  "- 不写 Obsidian 源库",
  "",
  "## 本次处理",
  "",
  staged.length
    ? staged.map((item) => `- ${item.content_id} / ${item.title} / ${item.approval_status} / ${item.draft_file}`).join("\n")
    : "- 无符合条件的网站稿",
  "",
].join("\n");
fs.writeFileSync(reportPath, report, "utf8");

const result = {
  target: target || "all_reviewed_website_drafts",
  approved_only: approvedOnly,
  ensured_fields: ensuredFields,
  staged_count: staged.length,
  staged,
  report: reportPath,
  safeguards: ["no_publish", "no_deploy", "approval_unchanged", "local_stage_only"],
};

result.taskRun = batchCreate(
  ids.taskRuns,
  ["run_id", "任务类型", "触发来源", "输入", "输出", "状态", "错误信息", "执行时间", "skill_id", "skill_chain", "调用方式", "人工确认"],
  [[
    `run_${now}`,
    "stage_website_drafts",
    "Codex CLI",
    target || "all reviewed website drafts",
    `staged=${staged.length}; report=${reportPath}`,
    "success",
    "",
    now,
    "automation_workflows",
    "reviewed_website_draft -> local_website_stage -> drafts_receipt",
    "Hermes/CLI draft-only",
    "进入真实发布前必须",
  ]],
  "task-run-stage-website-drafts"
);

fs.writeFileSync(path.join(cwd, "stage-website-drafts-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
