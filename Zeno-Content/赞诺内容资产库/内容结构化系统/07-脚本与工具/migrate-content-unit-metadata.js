#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { resolveSystemRoot } = require("./_system-root");

const root = resolveSystemRoot();
const unitRoot = path.join(root, "02-内容单元库");
const migrationDate = "2026-08-14";

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(full));
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(full);
  }
  return files;
}

function list(values) {
  return values.map((value) => `  - ${value}`).join("\n");
}

function relationships(values) {
  if (values.length === 0) return "relationships: []";
  return [
    "relationships:",
    ...values.flatMap((value) => [
      `  - type: ${value.type}`,
      `    target: ${value.target}`,
      `    note: ${value.note}`,
    ]),
  ].join("\n");
}

const standardMetadata = {
  "CON-20260726-001": {
    type: "概念单元",
    title: "清醒地选择——AI时代个人竞争力的核心定义",
    sourceDocuments: ["SRC-MISC-076"],
    sourceAuthors: ["Zeno（陈国赞）"],
    themes: ["AI 与个体升级", "判断力", "个人成长"],
    keywords: ["清醒地选择", "AI 时代", "判断力", "取舍", "OPC"],
    status: "待验证",
    version: 1,
    createdAt: "2026-07-26",
    conceptDefinition: "在信息爆炸、答案泛滥的环境里，依然知道什么值得做、什么应该放弃的能力。",
    conceptFunction: "为 AI 工具选择、内容方向和 OPC 聚焦提供取舍标准。",
    relationshipValues: [
      { type: "解释", target: "OPI-20260726-001", note: "概念解释 AI 时代判断力观点" },
    ],
  },
  "CON-20260726-002": {
    type: "概念单元",
    title: "初心（Beginner's Mind）——铃木俊隆《禅者的初心》",
    sourceDocuments: ["SRC-MISC-076"],
    sourceAuthors: ["Zeno（陈国赞）"],
    themes: ["AI 与个体升级", "开放性判断", "初心与选择"],
    keywords: ["初心", "Beginner's Mind", "预设答案", "AI 协作", "未知可能"],
    status: "待验证",
    version: 1,
    createdAt: "2026-07-26",
    conceptDefinition: "放下成见、不急着证明自己、不被过去的经验和眼前的结果绑住，重新看见事情本来的样子。",
    conceptFunction: "在使用 AI、做个人定位和探索新方向时，保留开放提问与重新判断的能力。",
    relationshipValues: [
      { type: "解释", target: "OPI-20260726-002", note: "概念解释 AI 与初心观点" },
      { type: "解释", target: "OPI-20260726-003", note: "概念解释初心与未知可能观点" },
    ],
  },
  "OPI-20260726-001": {
    type: "观点单元",
    title: "AI时代，真正拉开差距的不是工具使用量，而是判断力",
    sourceDocuments: ["SRC-MISC-076"],
    sourceAuthors: ["Zeno（陈国赞）"],
    themes: ["AI 与个体升级", "判断力", "OPC"],
    keywords: ["AI 时代", "判断力", "工具使用", "选择", "取舍"],
    status: "待验证",
    version: 1,
    createdAt: "2026-07-26",
    coreClaim: "AI 把能力变成了水和电，谁都能用。真正拉开人与人差距的，不是谁使用了更多工具，而是谁知道什么值得做、什么应该放弃。",
    claimScope: "AI 工具选择、内容创作、一人公司与传统行业经验资产化；不否定专业能力和执行能力的基础作用。",
    whyItMatters: "当执行能力越来越容易获得时，帮助个人把有限的时间、注意力和心力投入真正值得做的事。",
    relationshipValues: [],
  },
  "OPI-20260726-002": {
    type: "观点单元",
    title: "AI的未来是佛学——不是让机器成佛，而是人不再把自己活成机器",
    sourceDocuments: ["SRC-MISC-076"],
    sourceAuthors: ["Zeno（陈国赞）"],
    themes: ["AI 与个体升级", "人性与判断", "初心"],
    keywords: ["AI", "佛学", "初心", "人性", "判断力", "不被工具异化"],
    status: "待验证",
    version: 1,
    createdAt: "2026-07-26",
    coreClaim: "当机器越来越像人，人真正需要学习的不是如何更好地使用机器，而是不要把自己活成一台机器。",
    claimScope: "AI 深度介入写作、决策、创意等认知劳动时；不把佛学隐喻当作技术结论。",
    whyItMatters: "提醒使用者把 AI 保持在工具位置，保留人的判断、初心和选择，而不是把决策权一并外包。",
    relationshipValues: [],
  },
  "OPI-20260726-003": {
    type: "观点单元",
    title: "AI是过去世界的总结，初心是走向未知世界的可能",
    sourceDocuments: ["SRC-MISC-076"],
    sourceAuthors: ["Zeno（陈国赞）"],
    themes: ["AI 与个体升级", "创新与选择", "初心"],
    keywords: ["AI", "过去数据", "未知可能", "开放性", "创新", "判断力"],
    status: "待验证",
    version: 1,
    createdAt: "2026-07-26",
    coreClaim: "AI 给你的，是基于已有数据的推断；初心给你的，是放下已知、重新看见的能力。两者不是对立的，但方向相反——AI 向后看，初心向前看。",
    claimScope: "个人定位、品牌差异化、战略选择和创新探索；在检索、标准化执行和已有最佳实践场景，AI 基于过去的总结仍然更有优势。",
    whyItMatters: "为 OPC 和个人 IP 保留试探未知的空间，避免把已有数据、行业惯例或 AI 答案误当成唯一道路。",
    relationshipValues: [],
  },
};

function buildFrontmatter(id, metadata) {
  const lines = [
    `id: ${id}`,
    `type: ${metadata.type}`,
    `title: ${metadata.title}`,
    "source_documents:",
    list(metadata.sourceDocuments),
    "source_authors:",
    list(metadata.sourceAuthors),
    "themes:",
    list(metadata.themes),
    "keywords:",
    list(metadata.keywords),
    `status: ${metadata.status}`,
    "canonical: true",
    `version: ${metadata.version}`,
    `created_at: ${metadata.createdAt}`,
    `updated_at: ${migrationDate}`,
  ];
  if (metadata.type === "概念单元") {
    lines.push(`concept_definition: ${metadata.conceptDefinition}`);
    lines.push(`concept_function: ${metadata.conceptFunction}`);
  } else {
    lines.push(`core_claim: ${metadata.coreClaim}`);
    lines.push(`claim_scope: ${metadata.claimScope}`);
    lines.push(`why_it_matters: ${metadata.whyItMatters}`);
  }
  lines.push(relationships(metadata.relationshipValues));
  return lines.join("\n");
}

function replaceFrontmatter(content, nextFrontmatter) {
  const hasBom = content.startsWith("\uFEFF");
  const normalized = hasBom ? content.slice(1) : content;
  const match = normalized.match(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error("内容单元缺少可替换的 frontmatter");
  const body = normalized.slice(match[0].length);
  return `${hasBom ? "\uFEFF" : ""}---\n${nextFrontmatter}\n---\n${body}`;
}

function addMissingMetadata(content) {
  const hasBom = content.startsWith("\uFEFF");
  const normalized = hasBom ? content.slice(1) : content;
  const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error("内容单元缺少 frontmatter");
  let frontmatter = match[1];
  if (!/^updated_at:/m.test(frontmatter)) {
    frontmatter = frontmatter.replace(/^(created_at:[^\n]*\n)/m, `$1updated_at: ${migrationDate}\n`);
  }
  if (!/^relationships:/m.test(frontmatter)) frontmatter += "\nrelationships: []";
  return replaceFrontmatter(content, frontmatter);
}

let changed = 0;
const changedIds = [];
for (const file of walkFiles(unitRoot).sort()) {
  const original = fs.readFileSync(file, "utf8");
  const idMatch = original.match(/^---\r?\nid:\s*([^\r\n]+)/m);
  const id = idMatch ? idMatch[1].trim() : "";
  let next = standardMetadata[id] ? replaceFrontmatter(original, buildFrontmatter(id, standardMetadata[id])) : addMissingMetadata(original);
  if (next !== original) {
    fs.writeFileSync(file, next, "utf8");
    changed += 1;
    changedIds.push(id || path.basename(file));
  }
}

console.log(JSON.stringify({ migrationDate, changed, changedIds }, null, 2));
