import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(cwd, "manifest.json"), "utf8"));
const baseToken = manifest.baseToken;
const tableId = "tblgNXTc99FzMop3";

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

function recordList(limit = 500) {
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

function batchCreate(fields, rows, label) {
  if (!rows.length) return { label, status: "skipped-existing", count: 0 };
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
const records = recordsAsObjects(recordList());
const exists = records.some((item) => item.command_id === "cmd_quality_guard");

const result = {
  command_id: "cmd_quality_guard",
  exists,
  action: exists ? "skipped" : "created",
};

result.write = batchCreate(
  ["command_id", "飞书指令", "使用场景", "输入格式", "输出动作", "写入表", "触发脚本", "调用技能", "人工确认", "状态", "示例", "创建时间"],
  exists
    ? []
    : [[
        "cmd_quality_guard",
        "/质检守门",
        "发布前质量守门",
        "brief_id / content_id / 空",
        "检查选题和正文是否错位，输出风险项；不改审批、不发布。",
        "task_runs_执行日志",
        "content-quality-guard.mjs",
        "dbs_ai_check",
        "必须",
        "active",
        "/质检守门 brief_20260527_004",
        now,
      ]],
  "sop-quality-guard-command"
);

fs.writeFileSync(path.join(cwd, "register-quality-guard-command-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
