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

function tableId(name) {
  const table = manifest.tables.find((item) => item.name === name);
  if (!table) throw new Error(`Missing table: ${name}`);
  return table.id;
}

function listViews(tableId) {
  return runLark(["base", "+view-list", "--base-token", baseToken, "--table-id", tableId, "--as", "bot"]).data.views || [];
}

function listFields(tableId) {
  return runLark(["base", "+field-list", "--base-token", baseToken, "--table-id", tableId, "--as", "bot"]).data.fields || [];
}

function ids(tableName) {
  const tid = tableId(tableName);
  const views = new Map(listViews(tid).map((view) => [view.name, view.id]));
  const fields = new Map(listFields(tid).map((field) => [field.name, field.id]));
  return { tid, views, fields };
}

function setFilter(tableName, viewName, conditions) {
  const { tid, views } = ids(tableName);
  const viewId = views.get(viewName);
  if (!viewId) return { table: tableName, view: viewName, status: "missing-view" };
  runLark([
    "base",
    "+view-set-filter",
    "--base-token",
    baseToken,
    "--table-id",
    tid,
    "--view-id",
    viewId,
    "--json",
    jsonArg(`filter-${tid}-${viewId}`, { logic: "and", conditions }),
    "--as","bot",
  ]);
  return { table: tableName, view: viewName, status: "filter-set" };
}

function setSort(tableName, viewName, sortConfig) {
  const { tid, views } = ids(tableName);
  const viewId = views.get(viewName);
  if (!viewId) return { table: tableName, view: viewName, status: "missing-view" };
  runLark([
    "base",
    "+view-set-sort",
    "--base-token",
    baseToken,
    "--table-id",
    tid,
    "--view-id",
    viewId,
    "--json",
    jsonArg(`sort-${tid}-${viewId}`, { sort_config: sortConfig }),
    "--as","bot",
  ]);
  return { table: tableName, view: viewName, status: "sort-set" };
}

const result = { filters: [], sorts: [] };

{
  const { fields } = ids("topics_选题池");
  result.filters.push(setFilter("topics_选题池", "待评分选题", [[fields.get("状态"), "==", "inbox"]]));
  result.filters.push(setFilter("topics_选题池", "高分可写选题", [[fields.get("总分"), ">=", 80]]));
  result.filters.push(setFilter("topics_选题池", "已归档选题", [[fields.get("状态"), "==", "archived"]]));
  result.sorts.push(setSort("topics_选题池", "高分可写选题", [{ field: fields.get("总分"), desc: true }]));
}

{
  const { fields } = ids("materials_素材索引");
  result.filters.push(setFilter("materials_素材索引", "高可信素材", [[fields.get("可信度"), ">=", 90]]));
  result.filters.push(setFilter("materials_素材索引", "报价风险素材", [[fields.get("关键词"), "contains", "报价"]]));
  result.filters.push(setFilter("materials_素材索引", "搜索资产素材", [[fields.get("类型"), "==", "搜索资产"]]));
  result.sorts.push(setSort("materials_素材索引", "高可信素材", [{ field: fields.get("可信度"), desc: true }]));
}

{
  const { fields } = ids("publish_jobs_发布任务");
  result.filters.push(setFilter("publish_jobs_发布任务", "待发布", [[fields.get("发布状态"), "==", "pending"]]));
  result.filters.push(setFilter("publish_jobs_发布任务", "已发布", [[fields.get("发布状态"), "==", "published"]]));
  result.filters.push(setFilter("publish_jobs_发布任务", "发布失败", [[fields.get("发布状态"), "==", "failed"]]));
}

{
  const { fields } = ids("channels_渠道配置");
  result.filters.push(setFilter("channels_渠道配置", "自动渠道", [[fields.get("是否自动发布"), "==", "是"]]));
  result.filters.push(setFilter("channels_渠道配置", "人工渠道", [[fields.get("是否自动发布"), "==", "否"]]));
}

{
  const { fields } = ids("task_runs_执行日志");
  result.filters.push(setFilter("task_runs_执行日志", "失败日志", [[fields.get("状态"), "==", "failed"]]));
  result.sorts.push(setSort("task_runs_执行日志", "全部日志", [{ field: fields.get("执行时间"), desc: true }]));
}

fs.writeFileSync(path.join(cwd, "view-filter-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
