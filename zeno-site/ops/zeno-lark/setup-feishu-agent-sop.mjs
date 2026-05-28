import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const manifestPath = path.join(cwd, "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const baseToken = manifest.baseToken;
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
  sleep(400);
  runLark([
    "base",
    "+field-create",
    "--base-token",
    baseToken,
    "--table-id",
    tableId,
    "--json",
    jsonArg(`field-sop-${tableId}-${field.name}`, field),
    "--as",
    "user",
  ]);
  return { name: field.name, status: "created" };
}

function updateSelectField(tableId, fieldName, options) {
  const field = listFields(tableId).find((item) => item.name === fieldName);
  if (!field) return { fieldName, status: "missing" };
  if (field.type === "select") return { fieldName, status: "existing-select" };
  sleep(400);
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
    jsonArg(`select-sop-${tableId}-${fieldName}`, {
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
  sleep(400);
  const created = runLark([
    "base",
    "+view-create",
    "--base-token",
    baseToken,
    "--table-id",
    tableId,
    "--json",
    jsonArg(`view-sop-${tableId}-${name}`, { name, type: "grid" }),
    "--as",
    "user",
  ]);
  return { name, id: created?.data?.view?.id || null, status: "created" };
}

function setFilter(tableId, viewName, conditions) {
  const view = listViews(tableId).find((item) => item.name === viewName);
  if (!view) return { viewName, status: "missing-view" };
  sleep(250);
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
    jsonArg(`filter-sop-${tableId}-${view.id}`, { logic: "and", conditions }),
    "--as",
    "user",
  ]);
  return { viewName, status: "filter-set" };
}

function recordList(tableId, limit = 300) {
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

const now = Date.now();
const result = { tables: {}, fields: [], views: [], filters: [], seeds: [] };

const agentTableName = "feishu_agents_智能体矩阵";
const commandTableName = "sop_commands_飞书指令";
const agentTable = ensureTable(agentTableName);
const commandTable = ensureTable(commandTableName);
result.tables[agentTableName] = agentTable;
result.tables[commandTableName] = commandTable;

const agentFields = [
  { name: "agent_id", type: "text" },
  { name: "智能体名称", type: "text" },
  { name: "角色定位", type: "text" },
  { name: "职责", type: "text" },
  { name: "输入", type: "text" },
  { name: "输出", type: "text" },
  { name: "触发指令", type: "text" },
  { name: "可调用技能", type: "text" },
  { name: "是否可执行CLI", type: "text" },
  { name: "是否需人工确认", type: "text" },
  { name: "SOP位置", type: "text" },
  { name: "状态", type: "text" },
  { name: "备注", type: "text" },
  { name: "创建时间", type: "datetime" },
];

const commandFields = [
  { name: "command_id", type: "text" },
  { name: "飞书指令", type: "text" },
  { name: "使用场景", type: "text" },
  { name: "输入格式", type: "text" },
  { name: "输出动作", type: "text" },
  { name: "写入表", type: "text" },
  { name: "触发脚本", type: "text" },
  { name: "调用技能", type: "text" },
  { name: "人工确认", type: "text" },
  { name: "状态", type: "text" },
  { name: "示例", type: "text" },
  { name: "创建时间", type: "datetime" },
];

for (const field of agentFields) result.fields.push({ table: agentTableName, ...ensureField(agentTable.id, field) });
for (const field of commandFields) result.fields.push({ table: commandTableName, ...ensureField(commandTable.id, field) });

result.fields.push({ table: agentTableName, ...updateSelectField(agentTable.id, "状态", ["active", "testing", "paused", "disabled"]) });
result.fields.push({ table: agentTableName, ...updateSelectField(agentTable.id, "是否可执行CLI", ["是", "否", "仅Hermes"]) });
result.fields.push({ table: agentTableName, ...updateSelectField(agentTable.id, "是否需人工确认", ["必须", "看风险等级", "不需要"]) });
result.fields.push({ table: commandTableName, ...updateSelectField(commandTable.id, "状态", ["active", "testing", "paused", "disabled"]) });
result.fields.push({ table: commandTableName, ...updateSelectField(commandTable.id, "人工确认", ["必须", "看风险等级", "不需要"]) });

for (const [table, tableName, views] of [
  [agentTable, agentTableName, ["全部智能体", "启用智能体", "内容生产", "审批发布", "需人工确认"]],
  [commandTable, commandTableName, ["全部指令", "启用指令", "选题生产", "审批发布", "需人工确认"]],
]) {
  for (const viewName of views) result.views.push({ table: tableName, ...createView(table.id, viewName) });
}

const agentFieldIds = new Map(listFields(agentTable.id).map((field) => [field.name, field.id]));
const commandFieldIds = new Map(listFields(commandTable.id).map((field) => [field.name, field.id]));
result.filters.push({ table: agentTableName, ...setFilter(agentTable.id, "启用智能体", [[agentFieldIds.get("状态"), "==", "active"]]) });
result.filters.push({ table: agentTableName, ...setFilter(agentTable.id, "内容生产", [[agentFieldIds.get("SOP位置"), "contains", "内容"]]) });
result.filters.push({ table: agentTableName, ...setFilter(agentTable.id, "审批发布", [[agentFieldIds.get("SOP位置"), "contains", "审批"]]) });
result.filters.push({ table: agentTableName, ...setFilter(agentTable.id, "需人工确认", [[agentFieldIds.get("是否需人工确认"), "!=", "不需要"]]) });
result.filters.push({ table: commandTableName, ...setFilter(commandTable.id, "启用指令", [[commandFieldIds.get("状态"), "==", "active"]]) });
result.filters.push({ table: commandTableName, ...setFilter(commandTable.id, "选题生产", [[commandFieldIds.get("使用场景"), "contains", "选题"]]) });
result.filters.push({ table: commandTableName, ...setFilter(commandTable.id, "审批发布", [[commandFieldIds.get("使用场景"), "contains", "发布"]]) });
result.filters.push({ table: commandTableName, ...setFilter(commandTable.id, "需人工确认", [[commandFieldIds.get("人工确认"), "!=", "不需要"]]) });

for (const [tableName, tableId, fields] of [
  [agentTableName, agentTable.id, agentFields],
  [commandTableName, commandTable.id, commandFields],
]) {
  if (!manifest.tables.find((item) => item.name === tableName)) {
    manifest.tables.push({
      name: tableName,
      id: tableId,
      status: "created",
      fields: fields.map((field) => ({ ...field, status: "created" })),
    });
  }
}
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

const agentRows = [
  ["agent_hotspot_radar", "热点雷达", "外部机会发现", "搜索装修新闻、用户热点、平台讨论和搜索需求，只做机会发现，不直接决定生产。", "关键词、链接、平台、时间范围", "候选选题、来源链接、入池理由", "/选题入池", "gstack_scrape;dbs_good_question", "仅Hermes", "看风险等级", "选题入池", "active", "热点必须经过素材匹配和评分。", now],
  ["agent_material_matcher", "素材匹配官", "内部素材判断", "把外部热点或用户问题与 Obsidian 素材、案例、方法卡匹配，判断有没有材料支撑。", "topic_id、关键词、Obsidian 索引", "匹配素材、素材支撑度、不可写原因", "/匹配素材", "dbs_good_question", "仅Hermes", "不需要", "选题匹配", "active", "没有素材支撑，不进入写作。", now],
  ["agent_brief_planner", "生产单策划官", "Brief 生产", "把高分选题整理成生产单，明确目标读者、用户问题、核心判断、不要说什么、输出渠道。", "topic_id、匹配素材、评分", "brief.json / briefs_生产单", "/生成Brief", "dbs_content", "是", "看风险等级", "Brief生产", "active", "Brief 是控制内容颗粒度的关键。", now],
  ["agent_draft_editor", "内容审稿官", "初稿和质检", "根据 Brief 生成网站版/公众号版初稿，并调用内容诊断和 AI 味检测。", "brief_id、平台、风格要求", "drafts_稿件库、reviews_质检记录", "/生成初稿;/质检", "dbs_content;dbs_ai_check", "是", "必须", "内容生产/质检", "active", "只生成稿件，不发布。", now],
  ["agent_approval_dispatcher", "审批调度台", "审批与状态", "查询待审批、状态流转、退回原因和下一步动作。", "content_id、approval_id、状态查询", "审批待办、状态摘要、执行日志", "/查状态;/待审批", "automation_workflows", "否", "不需要", "审批协作", "active", "不替你做通过/拒绝决定。", now],
  ["agent_publish_assistant", "发布助理", "发布任务生成", "在审批通过后生成网站草稿、公众号草稿箱、Obsidian 回流和飞书通知任务。", "approved approval、content_id、adapter_id", "publish_jobs_发布任务、回执证据", "/生成发布任务;/导出素材包;/回流Obsidian", "automation_workflows;gstack_browser_qa", "是", "必须", "审批发布", "active", "只进草稿或任务，不自动群发。", now],
];

const commandRows = [
  ["cmd_topic_inbox", "/选题入池", "选题采集", "主题/链接/关键词 + 可选说明", "写入 topics_选题池，状态 inbox，等待匹配评分。", "topics_选题池;task_runs_执行日志", "setup-topic-sources.mjs / 后续 topic-intake 脚本", "dbs_good_question;gstack_scrape", "看风险等级", "active", "/选题入池 装修报价 基础部分总合计", now],
  ["cmd_match_material", "/匹配素材", "选题匹配", "topic_id", "搜索 Obsidian 素材索引，写入匹配素材数和入池理由。", "topics_选题池;materials_素材索引", "import-obsidian-materials.mjs / matcher", "dbs_good_question", "不需要", "active", "/匹配素材 topic_20260527_005", now],
  ["cmd_create_brief", "/生成Brief", "Brief生产", "topic_id", "创建 briefs_生产单，并把选题推进到 briefed。", "briefs_生产单;topics_选题池;task_runs_执行日志", "create-first-brief.mjs", "dbs_content", "看风险等级", "active", "/生成Brief topic_20260527_005", now],
  ["cmd_generate_draft", "/生成初稿", "内容生产", "brief_id + 平台", "生成网站版/公众号版初稿，写入 drafts，并创建质检记录。", "drafts_稿件库;reviews_质检记录;approvals_审批记录", "generate-first-drafts-and-review.mjs", "dbs_content;dbs_ai_check", "必须", "active", "/生成初稿 brief_20260527_005 website,wechat_oa", now],
  ["cmd_check_status", "/查状态", "状态查询", "topic_id / brief_id / content_id / publish_id", "返回当前状态、下一步动作、相关记录。", "全部核心表", "status-report 脚本", "automation_workflows", "不需要", "testing", "/查状态 content_20260527_005_web", now],
  ["cmd_pending_approval", "/待审批", "审批协作", "无或平台", "列出 pending 审批和需要人工确认的原因。", "approvals_审批记录;drafts_稿件库", "status-report 脚本", "automation_workflows", "不需要", "active", "/待审批", now],
  ["cmd_create_publish_jobs", "/生成发布任务", "审批发布", "approved approval 或 content_id", "只读取 approved 审批，生成 publish_jobs，不自动发布。", "publish_jobs_发布任务;task_runs_执行日志", "create-publish-jobs-from-approved.mjs", "automation_workflows", "必须", "active", "/生成发布任务", now],
  ["cmd_export_package", "/导出素材包", "发布素材", "content_id / brief_id", "导出网站草稿、公众号素材包、人工发布清单。", "drafts_稿件库;publish_jobs_发布任务", "export-review-packages.mjs", "automation_workflows", "看风险等级", "testing", "/导出素材包 brief_20260527_005", now],
  ["cmd_archive_obsidian", "/回流Obsidian", "资产回流", "content_id / publish_id", "把生产单、稿件、质检、审批、发布结果回流到 Obsidian 资产包。", "Obsidian;task_runs_执行日志", "archive-to-obsidian.mjs", "automation_workflows", "必须", "testing", "/回流Obsidian content_20260527_005_web", now],
];

const existingAgents = existingByField(agentTable.id, "agent_id");
const existingCommands = existingByField(commandTable.id, "command_id");
result.seeds.push(
  batchCreate(
    agentTable.id,
    ["agent_id", "智能体名称", "角色定位", "职责", "输入", "输出", "触发指令", "可调用技能", "是否可执行CLI", "是否需人工确认", "SOP位置", "状态", "备注", "创建时间"],
    agentRows.filter((row) => !existingAgents.has(row[0])),
    "feishu-agents"
  )
);
result.seeds.push(
  batchCreate(
    commandTable.id,
    ["command_id", "飞书指令", "使用场景", "输入格式", "输出动作", "写入表", "触发脚本", "调用技能", "人工确认", "状态", "示例", "创建时间"],
    commandRows.filter((row) => !existingCommands.has(row[0])),
    "sop-commands"
  )
);
result.seeds.push(
  batchCreate(
    taskRunsTable,
    ["run_id", "任务类型", "触发来源", "输入", "输出", "状态", "错误信息", "执行时间", "skill_id", "skill_chain", "调用方式", "人工确认"],
    [[
      `run_${now}`,
      "setup_feishu_agent_sop",
      "Codex CLI",
      "feishu agents + sop commands",
      `agents=${agentRows.length}; commands=${commandRows.length}`,
      "success",
      "",
      now,
      "automation_workflows,dbs,gstack",
      "feishu_command -> content_hub -> hermes_cli -> task_runs",
      "lark-cli",
      "看风险等级",
    ]],
    "task-run-feishu-agent-sop"
  )
);

fs.writeFileSync(path.join(cwd, "feishu-agent-sop-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
