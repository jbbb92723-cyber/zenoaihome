import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(cwd, "manifest.json"), "utf8"));
const baseToken = manifest.baseToken;
const materialsTable = manifest.tables.find((item) => item.name === "materials_素材索引")?.id;
if (!materialsTable) throw new Error("materials_素材索引 not found in manifest");

const vaultPath =
  process.argv[2] ||
  process.env.OBSIDIAN_VAULT_PATH ||
  "G:/Zenoaihome.com/赞诺内容资产库";
const limit = Number(process.argv[3] || 30);

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

function walkMarkdown(root) {
  const result = [];
  const stack = [root];
  const ignored = new Set([".obsidian", ".git", ".claude", ".claudian", "99_旧系统归档"]);
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!ignored.has(entry.name)) stack.push(path.join(current, entry.name));
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        result.push(path.join(current, entry.name));
      }
    }
  }
  return result;
}

function classify(relativePath) {
  const normalized = relativePath.replaceAll("\\", "/");
  if (normalized.startsWith("03_素材证据库/")) return ["素材证据", 95, "案例/证据/判断支撑"];
  if (normalized.startsWith("04_内容资产单元/")) return ["内容资产", 88, "生产单/成稿/平台版本"];
  if (normalized.startsWith("05_产品转化/")) return ["产品转化", 90, "资料包/服务/社群转化"];
  if (normalized.startsWith("06_提示词库/")) return ["提示词", 86, "Brief/写作/质检/发布SOP"];
  if (normalized.startsWith("08_搜索资产/")) return ["搜索资产", 92, "SEO/GEO/关键词/结构化数据"];
  if (normalized.startsWith("09_网站母站/")) return ["网站资产", 84, "网站页面/文章/资料库"];
  if (normalized.startsWith("10_LLM_Wiki/")) return ["LLM资产", 82, "给AI读取的结构化知识"];
  if (normalized.startsWith("01_灵感收集箱/")) return ["灵感", 70, "待筛选外部输入"];
  if (normalized.startsWith("02_选题地图/")) return ["选题地图", 78, "内容选题方向"];
  return ["其他", 60, "暂未分类素材"];
}

function titleFromFile(file) {
  const content = fs.readFileSync(file, "utf8");
  const heading = content.split(/\r?\n/).find((line) => /^#\s+/.test(line));
  return (heading ? heading.replace(/^#\s+/, "") : path.basename(file, ".md")).trim().slice(0, 120);
}

function keywordsFor(relativePath, title) {
  const text = `${relativePath} ${title}`;
  const keywords = ["装修", "报价", "合同", "验收", "材料", "付款", "工期", "AI", "内容", "SEO", "GEO", "公众号", "网站", "提示词", "服务", "转化"].filter((word) =>
    text.includes(word)
  );
  return [...new Set(keywords)].join(",");
}

function priorityScore(relativePath) {
  const normalized = relativePath.replaceAll("\\", "/");
  const weights = [
    ["03_素材证据库/", 100],
    ["04_内容资产单元/", 95],
    ["08_搜索资产/", 90],
    ["05_产品转化/", 88],
    ["06_提示词库/", 82],
    ["09_网站母站/", 78],
    ["10_LLM_Wiki/", 72],
    ["02_选题地图/", 70],
    ["01_灵感收集箱/", 68],
  ];
  return weights.find(([prefix]) => normalized.startsWith(prefix))?.[1] || 50;
}

function existingMaterialIds() {
  const data = runLark([
    "base",
    "+record-list",
    "--base-token",
    baseToken,
    "--table-id",
    materialsTable,
    "--as",
    "user",
    "--limit",
    "200",
    "--format",
    "json",
  ]).data;
  const fieldIndex = (data.fields || []).indexOf("material_id");
  if (fieldIndex < 0) return new Set();
  const ids = (data.data || []).map((row) => row[fieldIndex]).filter(Boolean);
  return new Set(ids);
}

if (!fs.existsSync(vaultPath)) {
  throw new Error(`Obsidian vault not found: ${vaultPath}`);
}

const existing = existingMaterialIds();
const now = Date.now();
const files = walkMarkdown(vaultPath)
  .map((file) => {
    const relativePath = path.relative(vaultPath, file).replaceAll("\\", "/");
    return { file, relativePath, score: priorityScore(relativePath) };
  })
  .filter(({ relativePath }) => !relativePath.includes("/_模板/") && !relativePath.includes("_骨架.md"))
  .sort((a, b) => b.score - a.score || a.relativePath.localeCompare(b.relativePath, "zh-Hans-CN"));

const rows = [];
const preview = [];
for (const item of files) {
  if (rows.length >= limit) break;
  const id = `mat_${crypto.createHash("sha1").update(item.relativePath).digest("hex").slice(0, 12)}`;
  if (existing.has(id)) continue;
  const title = titleFromFile(item.file);
  const [type, confidence, scene] = classify(item.relativePath);
  rows.push([
    id,
    title,
    item.relativePath,
    type,
    keywordsFor(item.relativePath, title),
    scene,
    confidence,
    now,
  ]);
  preview.push({ id, title, path: item.relativePath, type, confidence });
}

if (rows.length) {
  runLark([
    "base",
    "+record-batch-create",
    "--base-token",
    baseToken,
    "--table-id",
    materialsTable,
    "--json",
    jsonArg("records-obsidian-materials", {
      fields: ["material_id", "标题", "Obsidian路径", "类型", "关键词", "适用场景", "可信度", "最后同步时间"],
      rows,
    }),
    "--as",
    "user",
  ]);
}

const result = { vaultPath, imported: rows.length, preview };
fs.writeFileSync(path.join(cwd, "obsidian-import-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
