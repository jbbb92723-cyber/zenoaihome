import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(cwd, "manifest.json"), "utf8"));
const baseToken = manifest.baseToken;

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

function table(name) {
  const result = manifest.tables.find((item) => item.name === name);
  if (!result) throw new Error(`Missing table in manifest: ${name}`);
  return result.id;
}

function listViews(tableId) {
  return runLark(["base", "+view-list", "--base-token", baseToken, "--table-id", tableId, "--as", "bot"]).data.views || [];
}

function listFields(tableId) {
  return runLark(["base", "+field-list", "--base-token", baseToken, "--table-id", tableId, "--as", "bot"]).data.fields || [];
}

function createView(tableId, name, type = "grid") {
  const views = listViews(tableId);
  const found = views.find((view) => view.name === name);
  if (found) return { name, id: found.id, status: "existing" };
  sleep(500);
  const created = runLark([
    "base",
    "+view-create",
    "--base-token",
    baseToken,
    "--table-id",
    tableId,
    "--json",
    jsonArg(`view-${tableId}-${name}`, { name, type }),
    "--as","bot",
  ]);
  const view = created?.data?.view || created?.data?.views?.[0] || {};
  return { name, id: view.id || null, status: "created" };
}

function updateSelectField(tableId, fieldName, options) {
  const fields = listFields(tableId);
  const existing = fields.find((field) => field.name === fieldName);
  if (!existing) return { fieldName, status: "missing" };
  if (existing.type === "select") return { fieldName, status: "existing-select" };

  const payload = {
    name: fieldName,
    type: "select",
    multiple: false,
    options: options.map((name) => ({ name })),
  };

  try {
    sleep(500);
    runLark([
      "base",
      "+field-update",
      "--base-token",
      baseToken,
      "--table-id",
      tableId,
      "--field-id",
      existing.id,
      "--json",
      jsonArg(`field-update-${tableId}-${fieldName}`, payload),
      "--yes",
      "--as","bot",
    ]);
    return { fieldName, status: "updated-select" };
  } catch (error) {
    return { fieldName, status: "kept-text", error: error.message };
  }
}

function recordList(tableId, limit = 200) {
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

const viewPlan = [
  ["topics_选题池", ["全部选题", "待评分选题", "高分可写选题", "已归档选题"]],
  ["materials_素材索引", ["全部素材", "高可信素材", "报价风险素材", "搜索资产素材"]],
  ["briefs_生产单", ["全部生产单", "待写作", "待确认", "已完成"]],
  ["drafts_稿件库", ["全部稿件", "待质检", "待审批", "可发布"]],
  ["reviews_质检记录", ["全部质检", "未通过", "已通过"]],
  ["approvals_审批记录", ["全部审批", "待审批", "已同意", "已退回"]],
  ["publish_jobs_发布任务", ["全部发布任务", "待发布", "已发布", "发布失败"]],
  ["channels_渠道配置", ["全部渠道", "自动渠道", "人工渠道"]],
  ["metrics_数据回流", ["全部数据", "网站数据", "公众号数据", "转化数据"]],
  ["task_runs_执行日志", ["全部日志", "失败日志", "今日执行"]],
];

const statePlan = [
  ["topics_选题池", "状态", ["inbox", "matched", "scored", "briefed", "drafted", "reviewed", "approved", "published", "analyzed", "archived"]],
  ["briefs_生产单", "状态", ["briefed", "drafting", "waiting_review", "approved", "archived"]],
  ["drafts_稿件库", "当前状态", ["drafted", "reviewed", "revision_needed", "approved", "published", "archived"]],
  ["reviews_质检记录", "是否通过", ["yes", "no", "needs_revision"]],
  ["approvals_审批记录", "审批结果", ["pending", "approved", "rejected", "returned"]],
  ["publish_jobs_发布任务", "发布状态", ["pending", "scheduled", "published", "failed", "skipped"]],
  ["channels_渠道配置", "是否自动发布", ["是", "否", "半自动"]],
  ["channels_渠道配置", "状态", ["active", "paused", "testing", "disabled"]],
  ["task_runs_执行日志", "状态", ["success", "failed", "running", "skipped"]],
];

const seedChannels = [
  ["website", "Zeno 网站", "网站", "Zeno", "半自动", "ENV:WEBSITE", "主阵地，长文、SEO/GEO、资料库优先发布", "active"],
  ["wechat_oa", "微信公众号", "公众号", "Zeno", "半自动", "ENV:WEIXIN", "生成草稿箱，人工最终发布", "active"],
  ["feishu", "飞书协作台", "协作/审批", "Zeno", "否", "lark-cli profile cli_aa9c4cf91af89bdf", "热点入口、审批、状态查看", "active"],
  ["obsidian", "Obsidian 素材库", "知识库", "Zeno", "否", "ENV:OBSIDIAN_VAULT_PATH", "只读索引，原文留在本地", "active"],
  ["zhishixingqiu", "知识星球", "社群/变现", "Zeno", "否", "MANUAL", "第一阶段人工发布，后续看接口能力", "testing"],
  ["xiaohongshu", "小红书", "宣传窗口", "Zeno", "否", "MANUAL", "平台改写后人工发布", "testing"],
  ["douyin", "抖音", "宣传窗口", "Zeno", "否", "MANUAL", "口播/短视频脚本人工确认", "testing"],
  ["youtube", "YouTube", "宣传窗口", "Zeno", "否", "MANUAL/API", "成熟后接视频自动化", "paused"],
];

const result = { views: [], states: [], seeds: [] };

for (const [tableName, views] of viewPlan) {
  const tableId = table(tableName);
  for (const viewName of views) {
    result.views.push({ table: tableName, ...createView(tableId, viewName) });
  }
}

for (const [tableName, fieldName, options] of statePlan) {
  result.states.push({ table: tableName, ...updateSelectField(table(tableName), fieldName, options) });
}

const channelsTable = table("channels_渠道配置");
const channelRecords = recordList(channelsTable);
if ((channelRecords.record_id_list || []).length === 0) {
  result.seeds.push(
    batchCreate(
      channelsTable,
      ["channel_id", "渠道名", "类型", "负责人", "是否自动发布", "凭证位置", "发布策略", "状态"],
      seedChannels,
      "channels"
    )
  );
} else {
  result.seeds.push({ label: "channels", status: "existing-records", count: channelRecords.record_id_list.length });
}

fs.writeFileSync(path.join(cwd, "configure-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
