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
  return runLark(["base", "+table-list", "--base-token", baseToken, "--as", "bot"]).data.tables || [];
}

function listFields(tableId) {
  return runLark(["base", "+field-list", "--base-token", baseToken, "--table-id", tableId, "--as", "bot"]).data.fields || [];
}

function listViews(tableId) {
  return runLark(["base", "+view-list", "--base-token", baseToken, "--table-id", tableId, "--as", "bot"]).data.views || [];
}

function ensureTable(name) {
  let found = listTables().find((item) => item.name === name);
  if (found) return { id: found.id, status: "existing" };
  const created = runLark(["base", "+table-create", "--base-token", baseToken, "--name", name, "--as", "bot"]);
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
    jsonArg(`field-skill-${tableId}-${field.name}`, field),
    "--as","bot",
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
    jsonArg(`select-skill-${tableId}-${fieldName}`, {
      name: fieldName,
      type: "select",
      multiple: false,
      options: options.map((name) => ({ name })),
    }),
    "--yes",
    "--as","bot",
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
    jsonArg(`view-skill-${tableId}-${name}`, { name, type: "grid" }),
    "--as","bot",
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
    jsonArg(`filter-skill-${tableId}-${view.id}`, { logic: "and", conditions }),
    "--as","bot",
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
    "--as","bot",
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
    "--as","bot",
  ]);
  return { label, status: "created", count: rows.length };
}

const tableName = "skills_技能配置";
const skillTable = ensureTable(tableName);
const result = { table: skillTable, fields: [], views: [], filters: [], taskRunFields: [], seeds: [] };

const fields = [
  { name: "skill_id", type: "text" },
  { name: "技能名称", type: "text" },
  { name: "技能来源", type: "text" },
  { name: "本地路径", type: "text" },
  { name: "适用环节", type: "text" },
  { name: "职责", type: "text" },
  { name: "输入", type: "text" },
  { name: "输出", type: "text" },
  { name: "触发方式", type: "text" },
  { name: "是否需人工确认", type: "text" },
  { name: "调用方式", type: "text" },
  { name: "状态", type: "text" },
  { name: "备注", type: "text" },
  { name: "创建时间", type: "datetime" },
];

for (const field of fields) result.fields.push(ensureField(skillTable.id, field));
result.fields.push(updateSelectField(skillTable.id, "状态", ["active", "testing", "paused", "disabled"]));
result.fields.push(updateSelectField(skillTable.id, "是否需人工确认", ["是", "否", "看风险等级"]));

if (!manifest.tables.find((item) => item.name === tableName)) {
  manifest.tables.push({
    name: tableName,
    id: skillTable.id,
    status: skillTable.status,
    fields: fields.map((field) => ({ ...field, status: "created" })),
  });
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

for (const viewName of ["全部技能", "启用技能", "内容质量", "网页采集与验收", "人工确认"]) {
  result.views.push(createView(skillTable.id, viewName));
}

const fieldIds = new Map(listFields(skillTable.id).map((field) => [field.name, field.id]));
result.filters.push(setFilter(skillTable.id, "启用技能", [[fieldIds.get("状态"), "==", "active"]]));
result.filters.push(setFilter(skillTable.id, "内容质量", [[fieldIds.get("适用环节"), "contains", "内容"]]));
result.filters.push(setFilter(skillTable.id, "网页采集与验收", [[fieldIds.get("适用环节"), "contains", "网页"]]));
result.filters.push(setFilter(skillTable.id, "人工确认", [[fieldIds.get("是否需人工确认"), "!=", "否"]]));

const taskRunsTable = "tblNIeOvE10OF9Ml";
for (const field of [
  { name: "skill_id", type: "text" },
  { name: "skill_chain", type: "text" },
  { name: "调用方式", type: "text" },
  { name: "人工确认", type: "text" },
]) {
  result.taskRunFields.push(ensureField(taskRunsTable, field));
}

const now = Date.now();
const skillRows = [
  [
    "dbs_router",
    "dbs 商业工具箱路由",
    "local_skill",
    "C:/Users/WG/.agents/skills/dbs/SKILL.md",
    "选题判断;Brief生产;内容质量;变现判断",
    "把模糊需求路由到正确的商业诊断、内容诊断、标题、AI味检测等子技能",
    "选题、Brief、草稿、商业问题、用户反馈",
    "推荐调用的子技能、诊断方向、质量风险、下一步动作",
    "飞书指令/Hermes任务/中台状态变化",
    "看风险等级",
    "Hermes Skill Adapter 读取本地 SKILL.md 后调用 GPT-5.5",
    "active",
    "dbs 本身是路由器，不直接代替人工做最终发布决策",
    now,
  ],
  [
    "dbs_good_question",
    "dbs-good-question 问题清晰化",
    "local_skill",
    "C:/Users/WG/.agents/skills/dbs-good-question/SKILL.md",
    "选题入池;Brief生产",
    "把模糊选题改写成 Agent 可推理、可验证、可执行的问题说明",
    "原始热点、用户问题、Obsidian片段",
    "可评分选题、入池理由、执行边界",
    "topic 状态为 inbox 或 matched",
    "是",
    "Hermes 调用 dbs 子技能，结果写回 topics_选题池",
    "active",
    "用于防止热点太散、问题太虚",
    now,
  ],
  [
    "dbs_content",
    "dbs-content 内容创作诊断",
    "local_skill",
    "C:/Users/WG/.agents/skills/dbs-content/SKILL.md",
    "Brief生产;初稿质检;公众号改写",
    "判断一个选题怎么做成好内容，检查角度、结构、颗粒度和转化入口",
    "Brief、初稿、目标读者、转化目标",
    "内容诊断、重写建议、是否可进入质检",
    "brief 状态为 briefed 或 draft 状态为 drafted",
    "是",
    "Hermes 调用后写入 reviews_质检记录",
    "active",
    "第一阶段最重要的质量提升技能",
    now,
  ],
  [
    "dbs_ai_check",
    "dbs-ai-check AI味检测",
    "local_skill",
    "C:/Users/WG/.agents/skills/dbs-ai-check/SKILL.md",
    "初稿质检;发布前检查",
    "识别 AI 生成痕迹，避免稿件过于工整、空泛、像知识博主",
    "网站版初稿、公众号版初稿、短视频脚本",
    "AI味风险、问题段落、修改方向",
    "draft 状态为 drafted 或 reviewed",
    "是",
    "Hermes 调用后写入 reviews_质检记录",
    "active",
    "只检测和建议，不自动发布",
    now,
  ],
  [
    "gstack_browser_qa",
    "gstack 浏览器验收",
    "local_skill",
    "C:/Users/WG/.agents/skills/gstack/SKILL.md",
    "网页采集与验收;网站发布检查;数据回流验证",
    "打开网页、截图、检查控制台、网络请求、响应式布局和关键页面状态",
    "URL、发布任务、验收清单",
    "截图、控制台错误、网络错误、页面可见性验证结果",
    "publish_jobs 状态为 scheduled/published 或人工发起验收",
    "看风险等级",
    "Hermes/CLI 调用 gstack browser 命令，证据写入 task_runs",
    "active",
    "用于网站发布后验收，不用于公众号后台重造",
    now,
  ],
  [
    "gstack_scrape",
    "gstack 网页采集",
    "local_skill",
    "C:/Users/WG/.agents/skills/gstack/SKILL.md",
    "选题来源采集;网页资料抽取",
    "合规抓取公开网页的标题、正文、链接、结构化数据，用于热点雷达和对标拆解",
    "公开URL、关键词、采集范围",
    "网页文本、链接、证据摘要、来源URL",
    "topic_sources 中外部来源触发",
    "否",
    "Hermes/CLI 调用 gstack text/links/data/screenshot",
    "testing",
    "只采公开内容；不绕过登录、付费墙或平台规则",
    now,
  ],
  [
    "gstack_review",
    "gstack 方案/实现验收",
    "local_skill",
    "C:/Users/WG/.agents/skills/gstack/SKILL.md",
    "中台改动验收;自动化任务验收",
    "对中台页面、自动化流程、发布流程做端到端检查并留下证据",
    "功能URL、变更说明、验收标准",
    "验收结论、风险、截图证据、下一步建议",
    "自动化脚本变更或中台模块上线前",
    "是",
    "Hermes 执行后记录 task_runs，必要时写 reviews",
    "testing",
    "成熟后可作为每次上线前的固定检查",
    now,
  ],
];

const existingSkills = existingByField(skillTable.id, "skill_id");
const newRows = skillRows.filter((row) => !existingSkills.has(row[0]));
result.seeds.push(
  batchCreate(
    skillTable.id,
    [
      "skill_id",
      "技能名称",
      "技能来源",
      "本地路径",
      "适用环节",
      "职责",
      "输入",
      "输出",
      "触发方式",
      "是否需人工确认",
      "调用方式",
      "状态",
      "备注",
      "创建时间",
    ],
    newRows,
    "skill-registry"
  )
);

result.seeds.push(
  batchCreate(
    taskRunsTable,
    ["run_id", "任务类型", "触发来源", "输入", "输出", "状态", "错误信息", "执行时间", "skill_id", "skill_chain", "调用方式", "人工确认"],
    [[
      `run_${now}`,
      "setup_skill_registry",
      "Codex CLI",
      "dbs,gstack",
      `skills=${newRows.length}; table=${tableName}`,
      "success",
      "",
      now,
      "dbs_router,gstack_browser_qa",
      "dbs_router -> dbs_content/dbs_ai_check; gstack -> browser_qa/scrape/review",
      "Hermes Skill Adapter",
      "看风险等级",
    ]],
    "task-run-skill-registry"
  )
);

fs.writeFileSync(path.join(cwd, "skill-registry-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
