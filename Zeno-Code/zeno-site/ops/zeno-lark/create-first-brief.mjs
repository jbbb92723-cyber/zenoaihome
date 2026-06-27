import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(cwd, "manifest.json"), "utf8"));
const baseToken = manifest.baseToken;

const ids = {
  topics: "tblWqjt7QMwWpusg",
  briefs: "tblk8GrAQCWBXmU5",
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

function recordList(tableId, limit = 200) {
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

function batchCreate(tableId, fields, rows, label) {
  if (!rows.length) return { label, status: "skipped-empty" };
  sleep(500);
  return runLark([
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
}

function batchUpdate(tableId, recordIds, patch, label) {
  if (!recordIds.length) return { label, status: "skipped-empty" };
  sleep(500);
  return runLark([
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
}

function recordsAsObjects(data) {
  const fields = data.fields || [];
  return (data.data || []).map((row, index) => {
    const object = { _record_id: data.record_id_list?.[index] };
    for (let i = 0; i < fields.length; i += 1) object[fields[i]] = row[i];
    return object;
  });
}

const now = Date.now();
const briefId = "brief_20260527_005";
const topicId = "topic_20260527_005";

const brief = {
  brief_id: briefId,
  topic_id: topicId,
  "目标读者": "第一次看装修报价单、准备签装修合同、担心后期增项的业主",
  "用户问题":
    "看到报价单最后一行总价或“基础部分总合计”，误以为这是最终闭口价，不知道哪些未包含、按实结算、税费/管理费/垃圾外运会影响最终价格。",
  "核心判断":
    "报价单写“基础部分总合计”，通常不是最终闭口价，而是当前已列基础项目的阶段性合计；签约前真正要确认的是包含什么、不包含什么、哪些情况会按规则增减。",
  "匹配素材": [
    "03_素材证据库/报价预算/2026-BJ-002-基础部分总合计报价风险.md",
    "04_内容资产单元/装修报价单里的基础部分总合计为什么不是最终价/生产单.md",
    "04_内容资产单元/装修报价单里的基础部分总合计为什么不是最终价/网站版-完整稿.md",
    "03_素材证据库/方法卡/报价风险词库/01-按实结算.md",
    "03_素材证据库/方法卡/装修报价风险洞察六层框架.md",
  ].join("\n"),
  "不要说什么": [
    "不要评价具体公司",
    "不要制造恐慌",
    "不要承诺百分百避坑",
    "不要把所有装修公司都说成不可信",
    "案例公开时继续脱敏",
  ].join("\n"),
  "输出渠道": "website_draft,wechat_draft",
  "状态": "briefed",
  "创建时间": now,
};

const result = {
  brief_id: briefId,
  topic_id: topicId,
  createdBrief: null,
  updatedTopic: null,
  taskRun: null,
  verification: {},
};

const existingBriefs = recordsAsObjects(recordList(ids.briefs));
const existingBrief = existingBriefs.find((item) => item.brief_id === briefId);
if (existingBrief) {
  result.createdBrief = { status: "existing", record_id: existingBrief._record_id };
} else {
  batchCreate(
    ids.briefs,
    ["brief_id", "topic_id", "目标读者", "用户问题", "核心判断", "匹配素材", "不要说什么", "输出渠道", "状态", "创建时间"],
    [[
      brief.brief_id,
      brief.topic_id,
      brief["目标读者"],
      brief["用户问题"],
      brief["核心判断"],
      brief["匹配素材"],
      brief["不要说什么"],
      brief["输出渠道"],
      brief["状态"],
      brief["创建时间"],
    ]],
    "first-brief"
  );
  result.createdBrief = { status: "created", count: 1 };
}

const topics = recordsAsObjects(recordList(ids.topics));
const topic = topics.find((item) => item.topic_id === topicId);
if (!topic) throw new Error(`Missing topic: ${topicId}`);
batchUpdate(ids.topics, [topic._record_id], { "状态": "briefed", "下一步动作": "生成初稿" }, "first-topic-to-briefed");
result.updatedTopic = { status: "updated", record_id: topic._record_id, patch: { "状态": "briefed", "下一步动作": "生成初稿" } };

batchCreate(
  ids.taskRuns,
  ["run_id", "任务类型", "触发来源", "输入", "输出", "状态", "错误信息", "执行时间"],
  [[
    `run_${now}`,
    "create_first_brief",
    "Codex CLI",
    `topic_id=${topicId}`,
    `brief_id=${briefId}; status=briefed; next=生成初稿`,
    "success",
    "",
    now,
  ]],
  "task-run-create-first-brief"
);
result.taskRun = { status: "created", run_id: `run_${now}` };

result.verification.briefs = recordsAsObjects(recordList(ids.briefs)).filter((item) => item.brief_id === briefId);
result.verification.topic = recordsAsObjects(recordList(ids.topics)).filter((item) => item.topic_id === topicId);

fs.writeFileSync(path.join(cwd, "first-brief-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
