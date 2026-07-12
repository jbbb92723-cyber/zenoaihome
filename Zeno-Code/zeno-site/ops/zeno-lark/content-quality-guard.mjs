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

function count(text, term) {
  return (String(text || "").match(new RegExp(term, "g")) || []).length;
}

function includesAny(text, terms) {
  return terms.some((term) => String(text || "").includes(term));
}

function inspectDraft(draft) {
  const title = String(draft["标题"] || "");
  const body = String(draft["正文"] || "");
  const issues = [];

  if (!body.trim()) {
    issues.push("正文为空");
  }

  if (!title.includes("按实结算") && !title.includes("基础部分总合计") && count(body, "按实结算") >= 2) {
    issues.push("疑似混入“按实结算”旧主题");
  }

  if (title.includes("材料")) {
    if (!includesAny(body, ["型号", "规格", "替换", "验收"])) {
      issues.push("材料选题缺少型号/规格/替换/验收关键内容");
    }
    if (count(body, "按实结算") > 0) {
      issues.push("材料选题正文不应继续围绕按实结算");
    }
  }

  if (title.includes("基础部分总合计") && !includesAny(body, ["未包含", "最终价", "闭口价", "边界"])) {
    issues.push("基础部分总合计选题缺少未包含/最终价/闭口价/边界");
  }

  if (title.includes("品牌") && !includesAny(body, ["型号", "系列", "替换"])) {
    issues.push("品牌材料选题缺少型号/系列/替换规则");
  }

  return {
    content_id: draft.content_id,
    brief_id: draft.brief_id,
    platform: draft["平台"],
    title,
    pass: issues.length === 0,
    issues,
  };
}

const now = Date.now();
const target = process.argv[2] || "";
const drafts = recordsAsObjects(recordList(ids.drafts));
const candidates = drafts
  .filter((draft) => !target || [draft.content_id, draft.brief_id].includes(target))
  .filter((draft) => ["website", "wechat_oa"].includes(String(draft["平台"] || "")));

const checks = candidates.map(inspectDraft);
const failed = checks.filter((item) => !item.pass);

const result = {
  checked_at: new Date(now).toISOString(),
  target: target || "all_drafts",
  checked: checks.length,
  passed: checks.length - failed.length,
  failed: failed.length,
  checks,
  safeguards: ["read_only_content_guard", "no_approval_change", "no_publish"],
};

result.taskRun = batchCreate(
  ids.taskRuns,
  ["run_id", "任务类型", "触发来源", "输入", "输出", "状态", "错误信息", "执行时间", "skill_id", "skill_chain", "调用方式", "人工确认"],
  [[
    `run_${now}`,
    "content_quality_guard",
    "Codex CLI",
    target || "all drafts",
    `checked=${result.checked}; failed=${result.failed}`,
    failed.length ? "failed" : "success",
    failed.map((item) => `${item.content_id}: ${item.issues.join("; ")}`).join("\n"),
    now,
    "dbs_ai_check",
    "topic_title -> draft_body_alignment -> risk_flag",
    "Hermes/CLI read-only guard",
    "必须",
  ]],
  "task-run-content-quality-guard"
);

fs.writeFileSync(path.join(cwd, "content-quality-guard-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));

if (failed.length) {
  process.exitCode = 1;
}
