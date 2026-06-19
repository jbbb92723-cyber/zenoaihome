/**
 * fix-endings-v4.js
 *
 * Correct approach:
 * 1. Normalize line endings
 * 2. Delete EVERY occurrence of the unified ending blocks
 * 3. Re-attach correct endings one-to-one by article id order
 *
 * Run: node "g:/Zenoaihome.com/zeno-site/scripts/fix-endings-v4.js"
 */
const fs = require("fs");
let s = fs.readFileSync("g:/Zenoaihome.com/zeno-site/data/content/articles.ts", "utf-8");

// Normalize
s = s.replace(/\r\n/g, "\n");

const ENDINGS = {
  "真实居住": "我写这些，是让你在装修前看清楚——不是看风格，是看报价、看合同、看这个决定以后会不会让你后悔。\n\n如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。手里有报价单或合同草稿的，发给我帮你看看，简单的问题尽量免费。需要完整审核、合同把关或签约前综合判断，是我的付费服务。\n\n不急，觉得需要了再来。",
  "判断与生活": "我写这些，不是要教谁生活。我只是觉得居住这件事被低估了——它影响你的情绪、你的关系、你每天醒来第一个感觉。\n\n如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。简单的问题尽量免费帮你看，需要完整方案是我的付费服务。\n\n不急，觉得需要了再来。",
  "AI 实践": "AI不是魔法。它是一个工具——能帮你整理、对比、查漏，但不能替代你的判断、你的经验、你对人的理解。我写AI实战，不追热点，不讲\"颠覆\"，只讲传统行业的人怎么把AI用进真实工作里。\n\n如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。简单的问题尽量免费帮你看，需要完整方案是我的付费服务。\n\n不急，觉得需要了再来。",
  "一人公司": "我写这些，是因为我从零开始做过。不是理论派，是真金白银换来的经验。传统行业的人做IP，有独特的优势——你有真实经历，有判断力，有行业认知，这些东西AI写不出来。\n\n如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。简单的问题尽量免费帮你看，需要完整方案是我的付费服务。\n\n不急，觉得需要了再来。",
};

// ── Step 1: Find all article id+category pairs ──────────────────
const idRe = /\n    id:\s*'([^']+)'/g;
const idMap = [];
let im;
while ((im = idRe.exec(s)) !== null) {
  const chunk = s.substring(im.index, im.index + 600);
  const catM = chunk.match(/\n    category:\s*'([^']+)'/);
  idMap.push({ id: im[1], cat: catM ? catM[1] : "真实居住", idPos: im.index });
}
console.log("IDs found:", idMap.length);

// ── Step 2: Remove ALL existing ending blocks ───────────────────
// An ending block is: optional "\n\n---\n\n" + "我写这些，..." + "觉得需要了再来。"
// We delete them ALL globally, then re-add.
const oldEndingRe = /\n\n(?:---\n\n)?我写这些，[\s\S]*?觉得需要了再来。\n?/g;
let cleaned = s.replace(oldEndingRe, "");
console.log("Cleaned, removed endings. Length before:", s.length, "after:", cleaned.length);

// ── Step 3: Find content closing markers in CLEANED text ────────
// Same approach: for each article, find its content: ` and track to closing ``
const contentClosePositions = [];
for (const art of idMap) {
  // Find the article in cleaned text by id
  const idSearch = `\n    id: '${art.id}'`;
  const idIdx = cleaned.indexOf(idSearch);
  if (idIdx < 0) {
    // Try search from approx position
    console.log("  ID", art.id, "not found by string search");
    continue;
  }

  // Find content: ` after this id
  const after = cleaned.substring(idIdx);
  const coMatch = after.match(/\n    content: `|`\s*,\n/g);
  if (!coMatch) { console.log("  ID", art.id, "no content match"); continue; }
  const coStart = idIdx + coMatch.index + coMatch[0].length;

  // Find closing backtick
  let pos = coStart;
  let found = false;
  while (pos < cleaned.length) {
    if (cleaned[pos] === "\\") { pos += 2; continue; }
    if (cleaned[pos] === "\x60") {
      // This backtick must be followed by `,\n` or `,\r\n` or `}\n` (not a backtick inside content)
      // Check that the backtick is NOT preceded by a space (it's the closing one)
      const before = cleaned[pos - 1];
      // Content can contain backticks, so verify this is the end-of-template-literal one
      const afterBT = cleaned.substring(pos + 1, pos + 10).replace(/^\s+/, "");
      if (afterBT.startsWith(",") || afterBT.startsWith("}")) {
        contentClosePositions.push({ id: art.id, cat: art.cat, closePos: pos });
        found = true;
        break;
      }
    }
    pos++;
  }
  if (!found) console.log("  ID", art.id, "unclosed content");
}

console.log("Content closes found:", contentClosePositions.length);

// ── Step 4: Append endings (bottom-up) ──────────────────────────
contentClosePositions.sort((a, b) => b.closePos - a.closePos);
let result = cleaned;
for (const cp of contentClosePositions) {
  const ending = ENDINGS[cp.cat] || ENDINGS["真实居住"];
  const endingBlock = "\n\n---\n\n" + ending;
  result = result.substring(0, cp.closePos) + endingBlock + result.substring(cp.closePos);
}

// ── Step 5: Verify ──────────────────────────────────────────────
const verify = ["01", "02", "03", "04", "05"];
for (const vid of verify) {
  const a = idMap.find(x => x.id === vid);
  if (!a) { console.log(vid, "not in idMap"); continue; }
  const idSearch = `\n    id: '${vid}'`;
  const idIdx = result.indexOf(idSearch);
  const after = result.substring(idIdx);
  const coMatch = after.match(/\n    content: `|`\s*,\n/g);
  if (!coMatch) { console.log(vid, "no content in result"); continue; }
  const cs = idIdx + coMatch.index + coMatch[0].length;
  let p = cs;
  while (p < result.length) {
    if (result[p] === "\\") { p += 2; continue; }
    if (result[p] === "\x60") { break; }
    p++;
  }
  const ct = result.substring(cs, p);
  const endingIdx = ct.lastIndexOf("我写这些，");
  if (endingIdx < 0) { console.log(vid, "NO ENDING"); continue; }
  const snippet = ct.substring(endingIdx, endingIdx + 60);
  let endingType = "???";
  if (snippet.includes("从零开始做过")) endingType = "一人公司";
  else if (snippet.includes("不是要教谁生活")) endingType = "判断与生活";
  else if (snippet.includes("让你在装修前看清楚")) endingType = "真实居住";
  else if (snippet.includes("AI不是魔法")) endingType = "AI 实践";
  console.log(vid, "cat=" + a.cat, "ending=" + endingType, endingType === a.cat ? "OK" : "WRONG!");
}

fs.writeFileSync("g:/Zenoaihome.com/zeno-site/data/content/articles.ts", result, "utf-8");
console.log("Done. Length:", result.length);
