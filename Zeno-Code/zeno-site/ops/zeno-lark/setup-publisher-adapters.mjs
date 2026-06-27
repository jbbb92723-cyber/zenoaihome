import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const manifestPath = path.join(cwd, "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const baseToken = manifest.baseToken;

const publishJobsTable = "tblrsViHVTajQeVn";
const taskRunsTable = "tblNIeOvE10OF9Ml";

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

function listTables() {
  return runLark(["base", "+table-list", "--base-token", baseToken, "--as", "user"]).data.tables || [];
}

function listFields(tableId) {
  return runLark(["base", "+field-list", "--base-token", baseToken, "--table-id", tableId, "--as", "user"]).data.fields || [];
}

function listViews(tableId) {
  return runLark(["base", "+view-list", "--base-token", baseToken, "--table-id", tableId, "--as", "user"]).data.views || [];
}

function ensureTable(name) {
  let found = listTables().find((item) => item.name === name);
  if (found) return { id: found.id, status: "existing" };
  const created = runLark(["base", "+table-create", "--base-token", baseToken, "--name", name, "--as", "user"]);
  found = created?.data?.table || {};
  const id = found.id || found.table_id || listTables().find((item) => item.name === name)?.id;
  if (!id) throw new Error(`Could not create table: ${name}`);
  return { id, status: "created" };
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
    jsonArg(`field-publisher-${tableId}-${field.name}`, field),
    "--as",
    "user",
  ]);
  return { name: field.name, status: "created" };
}

function updateSelectField(tableId, fieldName, options) {
  const field = listFields(tableId).find((item) => item.name === fieldName);
  if (!field) return { fieldName, status: "missing" };
  if (field.type === "select") return { fieldName, status: "existing-select" };
  sleep(500);
  runLark([
    "base",
    "+field-update",
    "--base-token",
    baseToken,
    "--table-id",
    tableId,
    "--field-id",
    field.id,
    "--json",
    jsonArg(`select-publisher-${tableId}-${fieldName}`, {
      name: fieldName,
      type: "select",
      multiple: false,
      options: options.map((name) => ({ name })),
    }),
    "--yes",
    "--as",
    "user",
  ]);
  return { fieldName, status: "updated-select" };
}

function createView(tableId, name) {
  const found = listViews(tableId).find((item) => item.name === name);
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
    jsonArg(`view-publisher-${tableId}-${name}`, { name, type: "grid" }),
    "--as",
    "user",
  ]);
  return { name, id: created?.data?.view?.id || null, status: "created" };
}

function setFilter(tableId, viewName, conditions) {
  const view = listViews(tableId).find((item) => item.name === viewName);
  if (!view) return { viewName, status: "missing-view" };
  sleep(300);
  runLark([
    "base",
    "+view-set-filter",
    "--base-token",
    baseToken,
    "--table-id",
    tableId,
    "--view-id",
    view.id,
    "--json",
    jsonArg(`filter-publisher-${tableId}-${view.id}`, { logic: "and", conditions }),
    "--as",
    "user",
  ]);
  return { viewName, status: "filter-set" };
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

function existingByField(tableId, fieldName) {
  const data = recordList(tableId);
  const idx = (data.fields || []).indexOf(fieldName);
  if (idx < 0) return new Set();
  return new Set((data.data || []).map((row) => row[idx]).filter(Boolean));
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
    "--as",
    "user",
  ]);
  return { label, status: "created", count: rows.length };
}

const tableName = "publisher_adapters_发布适配器";
const adapterTable = ensureTable(tableName);
const result = { table: adapterTable, fields: [], publishJobFields: [], views: [], filters: [], seeds: [] };

const adapterFields = [
  { name: "adapter_id", type: "text" },
  { name: "适配器名称", type: "text" },
  { name: "平台", type: "text" },
  { name: "职责", type: "text" },
  { name: "输入", type: "text" },
  { name: "输出", type: "text" },
  { name: "执行方式", type: "text" },
  { name: "凭证位置", type: "text" },
  { name: "是否自动发布", type: "text" },
  { name: "人工确认", type: "text" },
  { name: "状态", type: "text" },
  { name: "备注", type: "text" },
  { name: "创建时间", type: "datetime" },
];

for (const field of adapterFields) result.fields.push(ensureField(adapterTable.id, field));
result.fields.push(updateSelectField(adapterTable.id, "状态", ["active", "testing", "paused", "disabled"]));
result.fields.push(updateSelectField(adapterTable.id, "是否自动发布", ["否", "只进草稿", "半自动", "自动"]));
result.fields.push(updateSelectField(adapterTable.id, "人工确认", ["必须", "看风险等级", "不需要"]));

if (!manifest.tables.find((item) => item.name === tableName)) {
  manifest.tables.push({
    name: tableName,
    id: adapterTable.id,
    status: adapterTable.status,
    fields: adapterFields.map((field) => ({ ...field, status: "created" })),
  });
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

for (const viewName of ["全部适配器", "启用适配器", "只进草稿", "必须人工确认"]) {
  result.views.push(createView(adapterTable.id, viewName));
}

const adapterFieldIds = new Map(listFields(adapterTable.id).map((field) => [field.name, field.id]));
result.filters.push(setFilter(adapterTable.id, "启用适配器", [[adapterFieldIds.get("状态"), "==", "active"]]));
result.filters.push(setFilter(adapterTable.id, "只进草稿", [[adapterFieldIds.get("是否自动发布"), "==", "只进草稿"]]));
result.filters.push(setFilter(adapterTable.id, "必须人工确认", [[adapterFieldIds.get("人工确认"), "==", "必须"]]));

for (const field of [
  { name: "adapter_id", type: "text" },
  { name: "发布方式", type: "text" },
  { name: "人工确认", type: "text" },
  { name: "回执证据", type: "text" },
  { name: "失败重试策略", type: "text" },
]) {
  result.publishJobFields.push(ensureField(publishJobsTable, field));
}

const now = Date.now();
const adapterRows = [
  [
    "website_draft_adapter",
    "网站草稿适配器",
    "website",
    "把审批通过的网站版稿件写入网站内容草稿或代码仓库草稿区，不直接上线。",
    "content_id、正文、slug、meta、分类、标签、服务入口",
    "网站草稿链接、构建检查结果、待发布任务",
    "Hermes/CLI 调用网站后台 API 或写入仓库草稿文件",
    "ENV:WEBSITE_API / ENV:GIT_REMOTE",
    "只进草稿",
    "必须",
    "active",
    "第一阶段只生成草稿和发布任务，不自动部署。",
    now,
  ],
  [
    "wechat_oa_draft_adapter",
    "公众号草稿箱适配器",
    "wechat_oa",
    "把审批通过的公众号版稿件转换为微信图文草稿，写入公众号草稿箱，不自动群发。",
    "content_id、标题、正文、封面、摘要、作者、原文链接",
    "微信公众号草稿 media_id、草稿箱链接或回执",
    "publisher adapter 调用微信素材/草稿 API",
    "ENV:WECHAT_APP_ID / ENV:WECHAT_SECRET",
    "只进草稿",
    "必须",
    "testing",
    "不重造公众号后台，只对接草稿箱。",
    now,
  ],
  [
    "obsidian_archive_adapter",
    "Obsidian 归档适配器",
    "obsidian",
    "把通过审批的生产单、终稿、质检、发布结果回流到 Obsidian 内容资产单元。",
    "brief、draft、review、publish result",
    "归档路径、资产索引、复盘记录",
    "Hermes/CLI 写入本地 Markdown",
    "ENV:OBSIDIAN_VAULT_PATH",
    "半自动",
    "看风险等级",
    "active",
    "归档前保留人工确认，避免污染长期知识库。",
    now,
  ],
  [
    "feishu_notice_adapter",
    "飞书通知适配器",
    "feishu",
    "审批、发布任务、失败告警和数据回流时向飞书发送消息。",
    "任务状态、错误信息、链接、下一步动作",
    "飞书消息、任务提醒",
    "lark-cli / Feishu bot webhook",
    "lark-cli user-default / ENV:FEISHU_WEBHOOK",
    "自动",
    "不需要",
    "active",
    "只发通知，不做业务决策。",
    now,
  ],
  [
    "zhishixingqiu_manual_adapter",
    "知识星球手动发布适配器",
    "zhishixingqiu",
    "把适合社群的内容生成发布素材和人工发布清单。",
    "content_id、正文、摘要、配图建议",
    "手动发布清单、素材包",
    "中台生成清单，人工复制发布",
    "MANUAL",
    "否",
    "必须",
    "testing",
    "知识星球第一阶段不接自动发布，先做素材包。",
    now,
  ],
];

const existingAdapters = existingByField(adapterTable.id, "adapter_id");
result.seeds.push(
  batchCreate(
    adapterTable.id,
    ["adapter_id", "适配器名称", "平台", "职责", "输入", "输出", "执行方式", "凭证位置", "是否自动发布", "人工确认", "状态", "备注", "创建时间"],
    adapterRows.filter((row) => !existingAdapters.has(row[0])),
    "publisher-adapters"
  )
);

result.seeds.push(
  batchCreate(
    taskRunsTable,
    ["run_id", "任务类型", "触发来源", "输入", "输出", "状态", "错误信息", "执行时间", "skill_id", "skill_chain", "调用方式", "人工确认"],
    [[
      `run_${now}`,
      "setup_publisher_adapters",
      "Codex CLI",
      "approval -> publish_jobs",
      `adapters=${adapterRows.length}; publish_jobs_fields=5; no_auto_publish=true`,
      "success",
      "",
      now,
      "automation_workflows",
      "approval_approved -> publisher_adapter -> publish_job_pending",
      "Hermes/CLI",
      "必须",
    ]],
    "task-run-publisher-adapters"
  )
);

fs.writeFileSync(path.join(cwd, "publisher-adapters-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
