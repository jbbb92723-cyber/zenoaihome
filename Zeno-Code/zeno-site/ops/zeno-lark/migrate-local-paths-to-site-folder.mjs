import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(cwd, "manifest.json"), "utf8"));
const baseToken = manifest.baseToken;

const oldRoot = "D:\\golutra_windows_x86_64.msi\\.codex\\zeno-lark";
const newRoot = "G:\\Zenoaihome.com\\Zeno-Code\\zeno-site\\ops\\zeno-lark";

const tables = {
  drafts: "tblWRTJDAXMYoj2y",
  publishJobs: "tblrsViHVTajQeVn",
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
    "--as",
    "user",
  ]);
  return { label, status: "updated", count: recordIds.length };
}

function replacePath(value) {
  if (typeof value !== "string") return value;
  return value.includes(oldRoot) ? value.split(oldRoot).join(newRoot) : value;
}

function patchRows(tableId, records, fields, labelPrefix) {
  const updates = [];
  for (const record of records) {
    const patch = {};
    for (const field of fields) {
      const next = replacePath(record[field]);
      if (next !== record[field]) patch[field] = next;
    }
    if (Object.keys(patch).length) {
      updates.push(batchUpdate(tableId, [record._record_id], patch, `${labelPrefix}-${record._record_id}`));
    }
  }
  return updates;
}

const drafts = recordsAsObjects(recordList(tables.drafts));
const publishJobs = recordsAsObjects(recordList(tables.publishJobs));

const result = {
  migrated_at: new Date().toISOString(),
  old_root: oldRoot,
  new_root: newRoot,
  drafts: patchRows(tables.drafts, drafts, ["草稿区路径", "初稿链接"], "migrate-draft-path"),
  publish_jobs: patchRows(tables.publishJobs, publishJobs, ["回执证据"], "migrate-publish-evidence"),
  safeguards: ["path_only_update", "no_approval_change", "no_publish"],
};

fs.writeFileSync(path.join(cwd, "migrate-local-paths-to-site-folder-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
