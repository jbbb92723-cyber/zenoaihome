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

const briefId = process.argv[2] || "brief_20260527_005";
const now = Date.now();
const nowIso = new Date(now).toISOString();

const briefs = recordsAsObjects(recordList(ids.briefs));
const drafts = recordsAsObjects(recordList(ids.drafts)).filter((draft) => draft.brief_id === briefId);
const reviews = recordsAsObjects(recordList(ids.reviews));
const approvals = recordsAsObjects(recordList(ids.approvals));
const brief = briefs.find((item) => item.brief_id === briefId);

if (!brief) throw new Error(`Missing brief: ${briefId}`);
if (!drafts.length) throw new Error(`No drafts found for brief: ${briefId}`);

const outDir = path.join(cwd, "outbox", briefId);
fs.mkdirSync(outDir, { recursive: true });

const packageFiles = [];

function fileSafePlatform(platform) {
  return String(platform || "unknown").replace(/[^\w.-]+/g, "_");
}

for (const draft of drafts) {
  const platform = draft["平台"] || "unknown";
  const contentId = draft.content_id;
  const review = reviews.find((item) => item.content_id === contentId);
  const approval = approvals.find((item) => item.content_id === contentId);
  const approvalStatus = selectValue(approval?.["审批结果"]) || "none";
  const fileName = `${fileSafePlatform(platform)}-${contentId}.md`;
  const filePath = path.join(outDir, fileName);
  const body = [
    "---",
    `content_id: ${contentId}`,
    `brief_id: ${briefId}`,
    `platform: ${platform}`,
    `status: ${selectValue(draft["当前状态"]) || ""}`,
    `approval_status: ${approvalStatus}`,
    `exported_at: ${nowIso}`,
    "---",
    "",
    `# ${draft["标题"] || contentId}`,
    "",
    "## 人工审批提醒",
    "",
    "- 发布前必须核对事实、脱敏和服务入口。",
    "- 当前文件是待审素材包，不代表已经发布。",
    "- 公众号只进草稿箱，网站只进草稿区，不自动上线。",
    "",
    "## 质检摘要",
    "",
    draft["质检摘要"] || review?.["修改建议"] || "无",
    "",
    "## 正文",
    "",
    draft["正文"] || "",
    "",
    "## 对应质检记录",
    "",
    review
      ? [
          `- review_id: ${review.review_id}`,
          `- 总分: ${review["总分"]}`,
          `- 是否通过: ${selectValue(review["是否通过"])}`,
          `- AI味: ${review["AI味"] || ""}`,
          `- 事实风险: ${review["事实风险"] || ""}`,
          `- 修改建议: ${review["修改建议"] || ""}`,
        ].join("\n")
      : "未找到质检记录",
    "",
    "## 对应审批记录",
    "",
    approval
      ? [
          `- approval_id: ${approval.approval_id}`,
          `- 审批结果: ${approvalStatus}`,
          `- 审批意见: ${approval["审批意见"] || ""}`,
        ].join("\n")
      : "未找到审批记录",
    "",
  ].join("\n");
  fs.writeFileSync(filePath, body, "utf8");
  packageFiles.push({ platform, content_id: contentId, file: filePath, approval_status: approvalStatus });
}

const checklist = [
  `# ${briefId} 人工审批清单`,
  "",
  "## 当前结论",
  "",
  "这批文件已经完成 AI 初稿和 AI 质检，但还没有人工审批通过。",
  "",
  "## 必查项",
  "",
  "- [ ] 是否继续脱敏，不出现具体客户姓名、完整地址、具体公司评价",
  "- [ ] 案例金额、垃圾外运、管理费、税点是否与原始报价截图一致",
  "- [ ] 是否没有恐吓式表达",
  "- [ ] 是否没有承诺百分百避坑",
  "- [ ] 服务入口是否低压、自然",
  "- [ ] 网站版是否适合沉淀 SEO/GEO",
  "- [ ] 公众号版是否适合直接进入草稿箱",
  "",
  "## 审批后动作",
  "",
  "1. 在 `approvals_审批记录` 把对应记录改为 `approved` 或 `returned`。",
  "2. 运行 `node create-publish-jobs-from-approved.mjs`。",
  "3. 只会生成发布任务，不会自动发布。",
  "",
  "## 导出文件",
  "",
  ...packageFiles.map((item) => `- ${item.platform}: ${item.file}`),
  "",
].join("\n");

const checklistPath = path.join(outDir, "manual-approval-checklist.md");
fs.writeFileSync(checklistPath, checklist, "utf8");

const packageManifest = {
  brief_id: briefId,
  exported_at: nowIso,
  base_url: manifest.baseUrl,
  status: "pending_manual_approval",
  files: packageFiles,
  checklist: checklistPath,
};
const packageManifestPath = path.join(outDir, "package-manifest.json");
fs.writeFileSync(packageManifestPath, `${JSON.stringify(packageManifest, null, 2)}\n`, "utf8");

const result = {
  brief_id: briefId,
  out_dir: outDir,
  files: packageFiles,
  checklist: checklistPath,
  manifest: packageManifestPath,
};

result.taskRun = batchCreate(
  ids.taskRuns,
  ["run_id", "任务类型", "触发来源", "输入", "输出", "状态", "错误信息", "执行时间", "skill_id", "skill_chain", "调用方式", "人工确认"],
  [[
    `run_${now}`,
    "export_review_packages",
    "Codex CLI",
    `brief_id=${briefId}`,
    `files=${packageFiles.length}; outbox=${outDir}`,
    "success",
    "",
    now,
    "automation_workflows",
    "drafts_reviewed -> local_review_package -> manual_approval",
    "Hermes/CLI",
    "必须",
  ]],
  "task-run-export-review-packages"
);

fs.writeFileSync(path.join(cwd, "export-review-packages-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
