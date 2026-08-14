#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { resolveSystemRoot } = require("./_system-root");

const root = resolveSystemRoot();
const unitRoot = path.join(root, "02-内容单元库");
const stateRoot = path.join(root, "03-处理状态");
const registryFile = path.join(stateRoot, "来源注册表.csv");
const reportFile = path.join(stateRoot, "内容单元严格审计.md");
const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

const commonFields = [
  "id",
  "type",
  "title",
  "source_documents",
  "source_authors",
  "themes",
  "keywords",
  "status",
  "canonical",
  "version",
  "created_at",
  "updated_at",
  "relationships",
];

const typeFields = {
  问题单元: ["question_text", "question_type", "user_stage", "applicable_topics"],
  概念单元: ["concept_definition", "concept_function"],
  观点单元: ["core_claim", "claim_scope", "why_it_matters"],
  案例单元: ["case_subject", "case_summary", "case_process", "case_result"],
  方案单元: ["target_problem", "solution_summary", "action_steps", "expected_result"],
};

const allowedRelationshipTypes = new Set(["回应", "解释", "证明", "冲突"]);
const placeholderPattern = /^(?:待补|待补充|待核实|待人工判断|待人工补全|YYYY(?:-MM-DD)?|SRC-\*)$/;

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(full));
    else if (entry.isFile() && path.extname(entry.name).toLowerCase() === ".md") files.push(full);
  }
  return files;
}

function extractFrontmatter(content) {
  const normalized = content.replace(/^\uFEFF/, "");
  const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  return match ? match[1] : "";
}

function getScalar(frontmatter, field) {
  const escaped = field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = frontmatter.match(new RegExp(`^${escaped}:\\s*(.*)$`, "m"));
  return match ? match[1].trim() : "";
}

function getList(frontmatter, field) {
  const lines = frontmatter.split(/\r?\n/);
  const values = [];
  let collecting = false;
  for (const line of lines) {
    if (line.startsWith(`${field}:`)) {
      collecting = true;
      if (/\[\s*\]/.test(line)) return [];
      continue;
    }
    if (!collecting) continue;
    if (/^  - /.test(line)) values.push(line.slice(4).trim());
    else if (/^\S/.test(line)) break;
  }
  return values;
}

function getRelationships(frontmatter) {
  if (/^relationships:\s*\[\s*\]\s*$/m.test(frontmatter)) return [];
  const lines = frontmatter.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === "relationships:");
  if (start === -1) return [];
  const relationships = [];
  let current = null;
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.startsWith("  ")) break;
    const trimmed = line.trim();
    if (trimmed.startsWith("- type:")) {
      if (current) relationships.push(current);
      current = {
        type: trimmed.slice("- type:".length).trim(),
        target: "",
        note: "",
      };
      continue;
    }
    if (!current) continue;
    if (trimmed.startsWith("target:")) current.target = trimmed.slice("target:".length).trim();
    if (trimmed.startsWith("note:")) current.note = trimmed.slice("note:".length).trim();
  }
  if (current) relationships.push(current);
  return relationships;
}

function parseCsvLine(line) {
  const values = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      values.push(value);
      value = "";
    } else {
      value += char;
    }
  }
  values.push(value);
  return values;
}

function readRegisteredSourceIds() {
  if (!fs.existsSync(registryFile)) return new Set();
  const lines = fs.readFileSync(registryFile, "utf8").replace(/^\uFEFF/, "").split(/\r?\n/);
  const ids = new Set();
  for (const line of lines.slice(1)) {
    if (!line.trim()) continue;
    const [id] = parseCsvLine(line);
    if (id) ids.add(id);
  }
  return ids;
}

function isPlaceholder(value) {
  return placeholderPattern.test(String(value || "").trim());
}

function issue(severity, code, message) {
  return { severity, code, message };
}

const files = walkFiles(unitRoot).sort();
const registeredSourceIds = readRegisteredSourceIds();
const units = [];
const idOwners = new Map();

for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  const frontmatter = extractFrontmatter(content);
  const relPath = path.relative(root, file).replaceAll(path.sep, "/");
  const issues = [];

  if (!frontmatter) {
    units.push({ file, relPath, id: "", type: "", title: "", issues: [issue("error", "missing_frontmatter", "缺少 YAML frontmatter")] });
    continue;
  }

  const id = getScalar(frontmatter, "id");
  const type = getScalar(frontmatter, "type");
  const title = getScalar(frontmatter, "title");
  const fields = new Set([...frontmatter.matchAll(/^([A-Za-z_][A-Za-z0-9_]*):/gm)].map((match) => match[1]));
  const requiredFields = [...commonFields, ...(typeFields[type] || [])];

  for (const field of requiredFields) {
    if (!fields.has(field)) issues.push(issue("error", "missing_field", `缺少字段：${field}`));
  }
  if (!typeFields[type]) issues.push(issue("error", "unknown_type", `未知内容单元类型：${type || "（空）"}`));
  if (!id) issues.push(issue("error", "empty_id", "id 为空"));
  if (!title) issues.push(issue("error", "empty_title", "title 为空"));

  for (const field of requiredFields) {
    if (!fields.has(field)) continue;
    const value = ["source_documents", "source_authors", "themes", "keywords", "applicable_topics", "action_steps"].includes(field)
      ? getList(frontmatter, field)
      : getScalar(frontmatter, field);
    const empty = Array.isArray(value) ? value.length === 0 : !value;
    if (empty) issues.push(issue("error", "empty_field", `字段为空：${field}`));
    else if (Array.isArray(value) ? value.some(isPlaceholder) : isPlaceholder(value)) {
      issues.push(issue("warning", "placeholder_value", `字段含待补值：${field}`));
    }
  }

  const sourceDocuments = getList(frontmatter, "source_documents");
  for (const sourceId of sourceDocuments) {
    if (!registeredSourceIds.has(sourceId)) {
      issues.push(issue("error", "unregistered_source", `来源未登记：${sourceId}`));
    }
  }

  const relationships = getRelationships(frontmatter);
  for (const relationship of relationships) {
    if (!allowedRelationshipTypes.has(relationship.type)) {
      issues.push(issue("error", "invalid_relationship_type", `关系类型非法：${relationship.type}`));
    }
    if (!relationship.target) issues.push(issue("error", "empty_relationship_target", "关系缺少 target"));
  }

  units.push({ file, relPath, id, type, title, content, relationships, issues });
  if (id) {
    if (!idOwners.has(id)) idOwners.set(id, []);
    idOwners.get(id).push(relPath);
  }
}

for (const [id, owners] of idOwners) {
  if (owners.length < 2) continue;
  for (const unit of units.filter((candidate) => candidate.id === id)) {
    unit.issues.push(issue("error", "duplicate_id", `id 重复：${id}（${owners.length} 个文件）`));
  }
}

const unitsById = new Map(units.filter((unit) => unit.id).map((unit) => [unit.id, unit]));
for (const unit of units) {
  for (const relationship of unit.relationships || []) {
    const target = unitsById.get(relationship.target);
    if (!target) {
      unit.issues.push(issue("error", "missing_relationship_target", `关系目标不存在：${relationship.target}`));
      continue;
    }
    const targetBase = path.basename(target.file, ".md");
    const body = unit.content.slice(unit.content.indexOf("---", 4) + 3);
    if (!body.includes(`[[${targetBase}]]`)) {
      unit.issues.push(issue("warning", "missing_body_link", `正文未发现关系链接：[[${targetBase}]]`));
    }
  }
}

const errors = units.flatMap((unit) => unit.issues.filter((item) => item.severity === "error"));
const warnings = units.flatMap((unit) => unit.issues.filter((item) => item.severity === "warning"));
const lines = [
  "# 内容单元严格审计",
  "",
  `最后更新：${today}`,
  "",
  "## 统计",
  "",
  `- 内容单元：${units.length}`,
  `- 错误：${errors.length}`,
  `- 警告：${warnings.length}`,
  `- 已登记来源：${registeredSourceIds.size}`,
  "",
  "## 验收口径",
  "",
  "- 错误包括：缺少必填字段、必填字段为空、来源未登记、重复 ID、非法关系类型和缺失关系目标。",
  "- 警告包括：待补值和正文未覆盖 frontmatter 关系链接；警告不等于可发布或已验证。",
  "- `canonical: true` 只表示当前主版本，不能替代角色经营层的证据状态。",
  "",
  "## 问题明细",
  "",
];

const unitsWithIssues = units.filter((unit) => unit.issues.length > 0);
if (unitsWithIssues.length === 0) {
  lines.push("- 未发现字段、来源或关系问题。", "");
} else {
  for (const unit of unitsWithIssues) {
    lines.push(`### ${unit.id || "（无 ID）"}｜${unit.title || path.basename(unit.file)}`, "", `文件：\`${unit.relPath}\``, "");
    for (const item of unit.issues) lines.push(`- ${item.severity === "error" ? "错误" : "警告"}：${item.message}`);
    lines.push("");
  }
}

lines.push("## 权威位置", "", "- 字段规范：`00-规则与索引/内容单元字段规范.md`", "- 来源注册表：`03-处理状态/来源注册表.csv`", "- 本报告由 `07-脚本与工具/audit-content-units.js` 生成。", "");
fs.writeFileSync(reportFile, lines.join("\n"), "utf8");

const result = {
  reportFile,
  units: units.length,
  errors: errors.length,
  warnings: warnings.length,
  registeredSourceIds: registeredSourceIds.size,
};
console.log(JSON.stringify(result, null, 2));
if (process.argv.includes("--check") && errors.length > 0) process.exitCode = 1;
