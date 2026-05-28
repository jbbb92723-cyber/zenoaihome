import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const manifestPath = path.join(cwd, "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
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
    sleep(1500 * attempt);
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

function tableId(name) {
  const found = manifest.tables.find((item) => item.name === name);
  if (!found) throw new Error(`Missing table in manifest: ${name}`);
  return found.id;
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
  const fields = listFields(tableId);
  const found = fields.find((item) => item.name === field.name);
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
    jsonArg(`field-source-${tableId}-${field.name}`, field),
    "--as",
    "user",
  ]);
  return { name: field.name, status: "created" };
}

function updateSelectField(tableId, fieldName, options) {
  const field = listFields(tableId).find((item) => item.name === fieldName);
  if (!field) return { fieldName, status: "missing" };
  if (field.type === "select") return { fieldName, status: "existing-select" };
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
    jsonArg(`select-${tableId}-${fieldName}`, {
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
  const created = runLark([
    "base",
    "+view-create",
    "--base-token",
    baseToken,
    "--table-id",
    tableId,
    "--json",
    jsonArg(`view-source-${tableId}-${name}`, { name, type: "grid" }),
    "--as",
    "user",
  ]);
  return { name, id: created?.data?.view?.id || null, status: "created" };
}

function setFilter(tableId, viewName, conditions) {
  const view = listViews(tableId).find((item) => item.name === viewName);
  if (!view) return { viewName, status: "missing-view" };
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
    jsonArg(`filter-source-${tableId}-${view.id}`, { logic: "and", conditions }),
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

function batchCreate(tableId, fields, rows, label) {
  if (!rows.length) return { label, status: "skipped-empty" };
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

function existingByField(tableId, fieldName) {
  const data = recordList(tableId);
  const idx = (data.fields || []).indexOf(fieldName);
  if (idx < 0) return new Set();
  return new Set((data.data || []).map((row) => row[idx]).filter(Boolean));
}

const result = { table: null, fields: [], views: [], filters: [], topicsFields: [], seeds: [] };
const sourceTable = ensureTable("topic_sources_来源配置");
result.table = sourceTable;

const sourceFields = [
  { name: "source_id", type: "text" },
  { name: "来源名称", type: "text" },
  { name: "来源类型", type: "text" },
  { name: "获取方式", type: "text" },
  { name: "入口关键词", type: "text" },
  { name: "采集频率", type: "text" },
  { name: "采集智能体", type: "text" },
  { name: "入池规则", type: "text" },
  { name: "权重", type: "number" },
  { name: "状态", type: "text" },
  { name: "最后采集时间", type: "datetime" },
  { name: "备注", type: "text" },
];

for (const field of sourceFields) result.fields.push(ensureField(sourceTable.id, field));
result.fields.push(updateSelectField(sourceTable.id, "状态", ["active", "testing", "paused", "disabled"]));

if (!manifest.tables.find((item) => item.name === "topic_sources_来源配置")) {
  manifest.tables.push({
    name: "topic_sources_来源配置",
    id: sourceTable.id,
    status: sourceTable.status,
    fields: sourceFields.map((field) => ({ ...field, status: "created" })),
  });
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

for (const viewName of ["全部来源", "启用来源", "内部资产", "搜索需求", "外部热点", "用户问题"]) {
  result.views.push(createView(sourceTable.id, viewName));
}

const sourceFieldIds = new Map(listFields(sourceTable.id).map((field) => [field.name, field.id]));
result.filters.push(setFilter(sourceTable.id, "启用来源", [[sourceFieldIds.get("状态"), "==", "active"]]));
result.filters.push(setFilter(sourceTable.id, "内部资产", [[sourceFieldIds.get("来源类型"), "==", "内部资产"]]));
result.filters.push(setFilter(sourceTable.id, "搜索需求", [[sourceFieldIds.get("来源类型"), "==", "搜索需求"]]));
result.filters.push(setFilter(sourceTable.id, "外部热点", [[sourceFieldIds.get("来源类型"), "==", "外部热点"]]));
result.filters.push(setFilter(sourceTable.id, "用户问题", [[sourceFieldIds.get("来源类型"), "==", "用户问题"]]));

const topicsTable = tableId("topics_选题池");
for (const field of [
  { name: "source_id", type: "text" },
  { name: "来源类型", type: "text" },
  { name: "采集批次", type: "text" },
  { name: "入池理由", type: "text" },
  { name: "匹配素材数", type: "number" },
  { name: "下一步动作", type: "text" },
]) {
  result.topicsFields.push(ensureField(topicsTable, field));
}

const now = Date.now();
const sourceRows = [
  ["obsidian_materials", "Obsidian 素材证据库", "内部资产", "本地 Markdown 扫描", "03_素材证据库;04_内容资产单元", "每日/手动", "Hermes CLI", "必须能支撑装修报价、签约、验收、业主决策中的一个具体判断", 100, "active", now, "第一优先级，先用已有判断库出题"],
  ["obsidian_questions", "Obsidian 灵感与选题地图", "内部资产", "本地 Markdown 扫描", "01_灵感收集箱;02_选题地图", "每日/手动", "Hermes CLI", "必须能转成用户可理解的问题句", 95, "active", now, "用于补充非热点的长期选题"],
  ["search_geo", "SEO/GEO 搜索需求", "搜索需求", "关键词/问答地图", "08_搜索资产", "每周", "SEO/GEO Agent", "有搜索意图，并能自然连接网站资料库或服务页", 90, "active", now, "网站是主阵地，搜索需求要长期沉淀"],
  ["customer_voice", "用户问题与评论区", "用户问题", "人工录入/评论采集", "咨询问题;私信;评论;社群提问", "每周", "飞书素材匹配智能体", "真实用户重复提问，且能帮助业主做判断", 95, "active", now, "后续最值得产品化的来源"],
  ["feishu_hotspot", "飞书热点雷达", "外部热点", "飞书智能体搜索", "装修新闻;交付维权;报价纠纷;AI Agent;个人IP", "每日 09:00", "热点雷达智能体", "热点 × Zeno 素材 × 业务相关同时成立才入池", 80, "active", now, "只做机会发现，不直接决定生产"],
  ["competitor_content", "对标账号与竞品内容", "对标拆解", "人工/搜索", "装修避坑;报价审核;设计咨询;AI内容系统", "每周", "选题评审智能体", "对方有需求信号，但 Zeno 必须有差异化判断", 70, "testing", now, "只学结构，不抄观点"],
  ["publish_review", "发布数据回流", "数据反馈", "中台 metrics", "高阅读;高转化;高停留;高收藏", "每周", "Hermes 数据分析", "数据证明值得扩写、改写或系列化", 90, "active", now, "成熟后形成复利选题"],
  ["platform_window", "平台热榜与内容窗口", "外部热点", "手动/飞书智能体", "小红书;抖音;公众号;知识星球", "每日/每周", "热点雷达智能体", "不娱乐化、不恐吓、不偏离装修决策主线", 60, "testing", now, "第一阶段只做参考，不做主来源"],
];

const existingSources = existingByField(sourceTable.id, "source_id");
const newSourceRows = sourceRows.filter((row) => !existingSources.has(row[0]));
result.seeds.push(
  batchCreate(
    sourceTable.id,
    ["source_id", "来源名称", "来源类型", "获取方式", "入口关键词", "采集频率", "采集智能体", "入池规则", "权重", "状态", "最后采集时间", "备注"],
    newSourceRows,
    "topic-sources"
  )
);

const starterTopics = [
  ["topic_20260527_001", "装修报价单里的“按实结算”到底意味着什么", "inbox", "Obsidian 素材证据库", "", "准备签装修合同的业主", 24, 24, 18, 90, now, "报价风险词库已有方法卡支撑", "obsidian_materials", "内部资产", "seed_20260527", "素材支撑强，能直接帮助业主识别增项边界", 3, "生成 Brief"],
  ["topic_20260527_002", "报价里的“暂估”和“另计”，哪一种更容易后期扯皮", "inbox", "Obsidian 素材证据库", "", "看不懂报价边界的业主", 23, 23, 17, 87, now, "报价风险词库已有暂估/另计素材", "obsidian_materials", "内部资产", "seed_20260527", "可用对比方式讲清楚两个高频风险词", 2, "生成 Brief"],
  ["topic_20260527_003", "签合同前，哪些口头承诺必须写进合同", "inbox", "Obsidian 内容资产单元", "", "准备签约但不确定合同细节的业主", 25, 22, 18, 88, now, "已有合同口头承诺类内容资产", "obsidian_materials", "内部资产", "seed_20260527", "决策相关度高，适合公众号和网站同步", 2, "生成 Brief"],
  ["topic_20260527_004", "装修材料只写品牌为什么不够，型号和替换规则也要写清楚", "inbox", "Obsidian 内容资产单元", "", "担心材料被替换的业主", 24, 23, 18, 89, now, "已有材料型号/替换规则文章资产", "obsidian_materials", "内部资产", "seed_20260527", "能落到报价审核服务和签约前检查", 2, "生成 Brief"],
  ["topic_20260527_005", "装修报价里的基础部分总合计，为什么不是最终价", "inbox", "Obsidian 素材证据库", "", "第一次看装修报价单的业主", 25, 24, 19, 92, now, "已有案例 2026-BJ-002 和完整稿", "obsidian_materials", "内部资产", "seed_20260527", "案例、方法和产品转化都齐", 4, "生成 Brief"],
  ["topic_20260527_006", "装修验收签字前，先把哪 5 件事写清楚", "inbox", "Obsidian 内容资产单元", "", "准备验收或即将付款的业主", 23, 21, 16, 84, now, "已有验收类内容资产", "obsidian_materials", "内部资产", "seed_20260527", "用户决策明确，适合做检查清单", 2, "生成 Brief"],
  ["topic_20260527_007", "装修付款节点怎么写，才不容易让业主被动", "inbox", "Obsidian 内容资产单元", "", "准备签约和付款的业主", 24, 21, 18, 86, now, "已有付款节点内容资产", "obsidian_materials", "内部资产", "seed_20260527", "转化到报价审核/签约前咨询自然", 2, "生成 Brief"],
  ["topic_20260527_008", "工期只写多少天为什么不够，顺延和延期责任也要写清楚", "inbox", "Obsidian 内容资产单元", "", "担心装修延期的业主", 22, 20, 16, 82, now, "已有工期类内容资产", "obsidian_materials", "内部资产", "seed_20260527", "适合做合同条款判断清单", 2, "生成 Brief"],
  ["topic_20260527_009", "AI 智能体救不了一个模糊的问题，传统行业人要先把经验变成系统", "inbox", "Obsidian 方法卡", "", "传统行业个体创业者", 20, 22, 14, 80, now, "已有 AI 与内容资产方法卡", "obsidian_materials", "内部资产", "seed_20260527", "适合作为 Zeno 方法论内容，不优先做服务转化", 3, "暂缓，等装修主线跑通后写"],
  ["topic_20260527_010", "为什么网站是内容根据地，公众号和小红书只是宣传窗口", "inbox", "SEO/GEO 搜索需求", "", "想用内容获客的传统行业人", 19, 20, 13, 78, now, "已有网站母站和内容系统资产", "search_geo", "搜索需求", "seed_20260527", "适合品牌方法论，但低于80先不生产", 2, "暂不写，收进素材库"],
];

const existingTopics = existingByField(topicsTable, "topic_id");
const newTopicRows = starterTopics.filter((row) => !existingTopics.has(row[0]));
result.seeds.push(
  batchCreate(
    topicsTable,
    ["topic_id", "标题", "状态", "来源", "热点链接", "目标用户", "用户决策相关度", "素材支撑度", "产品服务转化度", "总分", "创建时间", "备注", "source_id", "来源类型", "采集批次", "入池理由", "匹配素材数", "下一步动作"],
    newTopicRows,
    "starter-topics"
  )
);

const taskRunsTable = tableId("task_runs_执行日志");
batchCreate(
  taskRunsTable,
  ["run_id", "任务类型", "触发来源", "输入", "输出", "状态", "错误信息", "执行时间"],
  [[`run_${Date.now()}`, "topic_source_setup", "Codex CLI", "创建来源配置表并导入种子选题", `sources=${newSourceRows.length}; topics=${newTopicRows.length}`, "success", "", now]],
  "task-run-topic-source-setup"
);

fs.writeFileSync(path.join(cwd, "topic-source-setup-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
