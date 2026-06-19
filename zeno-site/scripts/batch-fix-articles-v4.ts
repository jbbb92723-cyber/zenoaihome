/**
 * batch-fix-articles-v4.ts — blunt regex approach.
 *
 * 1. Delete ALL old tail blocks inline via regex replace.
 * 2. Then append unified ending to each article's content.
 * 3. Also clean author lines and orphaned dashed separators.
 *
 * Run: node "g:/Zenoaihome.com/zeno-site/scripts/batch-fix-articles-v4.ts"
 */
const fs = require("fs");
const path = require("path");

const FPATH = path.resolve("g:/Zenoaihome.com/zeno-site/data/content/articles.ts");
let src = fs.readFileSync(FPATH, "utf-8");

console.log("Original length:", src.length);

// ── Phase 1: Global cleanups (inline) ────────────────────────────

// 1a: Delete author signature lines (various forms)
src = src.replace(/\n\s*\*作者：.*?\*\s*(?=\n)/g, "\n");
src = src.replace(/\n\s*作者：.*?\n/g, "\n");

// 1b: Delete FAQ blocks (## 常见问题 or ## FAQ, from first --- before it until next ## or --- or ending)
// Match: --- (optional preceding content) ## 常见问题 or FAQ, everything until next ## or closing marker
src = src.replace(/\n---\n\n## 常见问题[\s\S]*?(?=\n---\n\n## 相关阅读|\n---\n\n## 下一步|\n---\n\n\*作者|\n\n---\n\n我写这些)/g, "\n");

src = src.replace(/\n---\n\n## FAQ[\s\S]*?(?=\n---\n\n## 相关阅读|\n---\n\n## 下一步|\n---\n\n\*作者|\n\n---\n\n我写这些)/g, "\n");

// 1c: Delete "## 相关阅读" blocks (through next ---)
src = src.replace(/\n---\n\n## 相关阅读[\s\S]*?(?=\n---\n\n## 下一步|\n---\n\n\*作者|\n\n---\n\n我写这些)/g, "");

// 1d: Delete "## 下一步" blocks
src = src.replace(/\n---\n\n## 下一步[\s\S]*?(?=\n---\n\n\*作者|\n\n---\n\n我写这些|(?<=\n---\n)\n---)/g, "");

// 1e: Delete "## 服务入口" blocks
src = src.replace(/\n---\n\n## 服务入口[\s\S]*?(?=\n---\n\n\*作者|\n\n---\n\n我写这些|(?<=\n---\n)\n---)/g, "");

// 1f: Delete old-style "**如果你正在..." blocks
src = src.replace(/\n---\n\n\*\*如果你正在准备[\s\S]*?(?=\n---\n\n\*作者|\n\n---\n\n我写这些|`,\n\s*\},)/g, "");
src = src.replace(/\n---\n\n\*\*如果你需要更具体的帮助[\s\S]*?(?=\n---\n\n\*作者|\n\n---\n\n我写这些|`,\n\s*\},)/g, "");

// 1g: Delete orphaned "---" separators (multiple consecutive --- blocks)
src = src.replace(/\n---\n\n---\n/g, "\n---\n");

// 1h: Clean trailing --- before ending markers
src = src.replace(/\n---\n+(?=\n我写这些)/g, "\n");

// 1i: Delete old service link sections that remain
src = src.replace(/\n→ \[报价边界检查清单\].*?(?=\n\n)/gs, "");

console.log("Phase 1 done. Length:", src.length);

// ── Phase 2: Find content blocks and append endings ──────────────
const contentStartRe = /\n    content: \x60/g;
const starts = [];
let m;
while ((m = contentStartRe.exec(src)) !== null) {
  starts.push(m.index + m[0].length);
}
console.log(`Found ${starts.length} content starts`);

const blocks = [];
for (const start of starts) {
  let pos = start;
  while (pos < src.length) {
    if (src[pos] === "\\") { pos += 2; continue; }
    if (src[pos] === "`") {
      const after = src.substring(pos + 1, pos + 5).trimStart();
      if (after.startsWith(",") || after.startsWith("}") || pos === src.length - 1) {
        blocks.push({ start, end: pos, content: src.substring(start, pos) });
        break;
      }
    }
    pos++;
  }
}
console.log(`Parsed ${blocks.length} blocks`);

// Find categories
const catRe = /category:\s*'([^']+)'/;
const parentCatRe = /parentCategory\?\s*:\s*'([^']+)'/;
for (const block of blocks) {
  const before = src.substring(Math.max(0, block.start - 2500), block.start);
  const catM = catRe.exec(before);
  const pM = parentCatRe.exec(before);
  block.category = catM ? catM[1] : "真实居住";
  block.parentCat = pM ? pM[1] : "";
}

// ── Endings ──────────────────────────────────────────────────────
const E = {
  "真实居住":
    "\n\n---\n\n" +
    "我写这些，是让你在装修前看清楚——不是看风格，是看报价、看合同、看这个决定以后会不会让你后悔。\n\n" +
    "如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。" +
    "手里有报价单或合同草稿的，发给我帮你看看，简单的问题尽量免费。" +
    "需要完整审核、合同把关或签约前综合判断，是我的付费服务。\n\n" +
    "不急，觉得需要了再来。",
  "判断与生活":
    "\n\n---\n\n" +
    "我写这些，不是要教谁生活。我只是觉得居住这件事被低估了——" +
    "它影响你的情绪、你的关系、你每天醒来第一个感觉。\n\n" +
    "如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。" +
    "简单的问题尽量免费帮你看，需要完整方案是我的付费服务。\n\n" +
    "不急，觉得需要了再来。",
  "AI 实践":
    "\n\n---\n\n" +
    "AI不是魔法。它是一个工具——能帮你整理、对比、查漏，" +
    "但不能替代你的判断、你的经验、你对人的理解。" +
    "我写AI实战，不追热点，不讲\"颠覆\"，只讲传统行业的人怎么把AI用进真实工作里。\n\n" +
    "如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。" +
    "简单的问题尽量免费帮你看，需要完整方案是我的付费服务。\n\n" +
    "不急，觉得需要了再来。",
  "一人公司":
    "\n\n---\n\n" +
    "我写这些，是因为我从零开始做过。不是理论派，是真金白银换来的经验。" +
    "传统行业的人做IP，有独特的优势——你有真实经历，有判断力，有行业认知，" +
    "这些东西AI写不出来。\n\n" +
    "如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。" +
    "简单的问题尽量免费帮你看，需要完整方案是我的付费服务。\n\n" +
    "不急，觉得需要了再来。",
};

function endingFor(cat, pc) {
  if (pc === "renovation") return E["真实居住"];
  if (pc === "lifestyle") return E["判断与生活"];
  if (pc === "ai") return E["AI 实践"];
  if (pc === "ip") return E["一人公司"];
  return E[cat] || E["真实居住"];
}

// Append endings
for (const block of blocks) {
  const ending = endingFor(block.category, block.parentCat);
  block.newContent = block.content.trimEnd() + ending;
  block.oldLen = block.end - block.start;
}

// Rebuild (reverse)
blocks.sort((a, b) => b.start - a.start);
for (const block of blocks) {
  src = src.substring(0, block.start) + block.newContent + src.substring(block.end);
}

console.log("Phase 2 done. Length:", src.length);

// ── Phase 3: Final cleanups ──────────────────────────────────────

// Remove duplicate ending blocks that may have been created
src = src.replace(/(\n\n我写这些，[\s\S]*?觉得需要了再来。)\1/g, "$1");

// Clean triple+ blank lines
src = src.replace(/\n{4,}/g, "\n\n\n");

// Clean orphaned author lines one more time
src = src.replace(/\n\s*\*作者：.*?\*\s*\n/g, "\n");

fs.writeFileSync(FPATH, src, "utf-8");
console.log("Done. Final length:", src.length);
