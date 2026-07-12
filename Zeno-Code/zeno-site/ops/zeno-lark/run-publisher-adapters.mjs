import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(cwd, "manifest.json"), "utf8"));
const baseToken = manifest.baseToken;

const ids = {
  drafts: "tblWRTJDAXMYoj2y",
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

function renderPackage(job, draft) {
  const platform = job["平台"] || draft["平台"] || "unknown";
  const title = draft["标题"] || draft.content_id;
  const body = draft["正文"] || "";
  const lines = [
    "---",
    `publish_id: ${job.publish_id}`,
    `content_id: ${draft.content_id}`,
    `platform: ${platform}`,
    `adapter_id: ${job.adapter_id || ""}`,
    `mode: ${job["发布方式"] || "只进草稿"}`,
    `generated_at: ${new Date().toISOString()}`,
    "---",
    "",
    `# ${title}`,
    "",
  ];

  if (platform === "wechat_oa") {
    lines.push(
      "## 公众号草稿箱素材",
      "",
      "- 这份文件用于复制到公众号草稿箱或后续接入微信草稿 API。",
      "- 当前动作不会自动群发。",
      "- 发布前需要确认封面图、摘要、原文链接和排版。",
      "",
      "## 标题",
      "",
      title,
      "",
      "## 摘要建议",
      "",
      "报价单上的“基础部分总合计”通常不是最终闭口价。签约前要先确认未包含项目、按实结算规则、税费、管理费和垃圾外运边界。",
      "",
      "## 正文",
      "",
      body
    );
  } else if (platform === "website") {
    lines.push(
      "## 网站草稿",
      "",
      "- 这份文件用于写入网站草稿区或代码仓库内容目录。",
      "- 当前动作不会自动部署上线。",
      "",
      "## SEO/GEO 字段建议",
      "",
      "- slug: zhuangxiu-baojia-jichu-zongheji-bushi-zuizhongjia",
      "- meta_title: 装修报价里的“基础部分总合计”，为什么不是最终价",
      "- meta_description: 装修报价单写“基础部分总合计”，通常不等于最终闭口价。签约前要确认未包含项目、按实结算、税费、管理费和垃圾外运等风险边界。",
      "",
      "## 正文",
      "",
      body
    );
  } else {
    lines.push("## 发布素材", "", body);
  }

  return `${lines.join("\n")}\n`;
}

const now = Date.now();
const drafts = recordsAsObjects(recordList(ids.drafts));
const jobs = recordsAsObjects(recordList(ids.publishJobs));
const pendingJobs = jobs.filter((job) => selectValue(job["发布状态"]) === "pending");
const outDir = path.join(cwd, "publisher-outbox");
fs.mkdirSync(outDir, { recursive: true });

const created = [];
const failed = [];

for (const job of pendingJobs) {
  const draft = drafts.find((item) => item.content_id === job.content_id);
  if (!draft) {
    failed.push({ publish_id: job.publish_id, error: `Missing draft for ${job.content_id}` });
    continue;
  }

  const jobDir = path.join(outDir, job.publish_id);
  fs.mkdirSync(jobDir, { recursive: true });
  const filePath = path.join(jobDir, `${job["平台"] || draft["平台"] || "platform"}-draft-package.md`);
  fs.writeFileSync(filePath, renderPackage(job, draft), "utf8");
  batchUpdate(
    ids.publishJobs,
    [job._record_id],
    {
      "发布状态": "scheduled",
      "回执证据": filePath,
      "外部链接": "",
      "实际发布时间": now,
    },
    `publisher-job-${job.publish_id}`
  );
  created.push({ publish_id: job.publish_id, content_id: job.content_id, file: filePath });
}

const result = {
  pending_jobs: pendingJobs.length,
  created_packages: created,
  failed,
};

result.taskRun = batchCreate(
  ids.taskRuns,
  ["run_id", "任务类型", "触发来源", "输入", "输出", "状态", "错误信息", "执行时间", "skill_id", "skill_chain", "调用方式", "人工确认"],
  [[
    `run_${now}`,
    "run_publisher_adapters",
    "Codex CLI",
    "publish_jobs where 发布状态=pending",
    `pending=${pendingJobs.length}; packages=${created.length}; failed=${failed.length}`,
    failed.length ? "failed" : "success",
    failed.map((item) => `${item.publish_id}: ${item.error}`).join("\n"),
    now,
    "automation_workflows",
    "publish_job_pending -> adapter_package -> scheduled",
    "Hermes/CLI",
    "必须",
  ]],
  "task-run-publisher-adapters-execute"
);

fs.writeFileSync(path.join(cwd, "run-publisher-adapters-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
