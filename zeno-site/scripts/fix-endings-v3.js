/**
 * fix-endings-v3.js
 *
 * Approach: Find each article by its `id:` field, extract category,
 * locate its content closing ``, strip any old ending, attach correct one.
 *
 * Run: node "g:/Zenoaihome.com/zeno-site/scripts/fix-endings-v3.js"
 */
const fs = require("fs");
const s = fs.readFileSync("g:/Zenoaihome.com/zeno-site/data/content/articles.ts", "utf-8");

const ENDINGS = {
  "真实居住": "我写这些，是让你在装修前看清楚——不是看风格，是看报价、看合同、看这个决定以后会不会让你后悔。\n\n如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。手里有报价单或合同草稿的，发给我帮你看看，简单的问题尽量免费。需要完整审核、合同把关或签约前综合判断，是我的付费服务。\n\n不急，觉得需要了再来。",
  "判断与生活": "我写这些，不是要教谁生活。我只是觉得居住这件事被低估了——它影响你的情绪、你的关系、你每天醒来第一个感觉。\n\n如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。简单的问题尽量免费帮你看，需要完整方案是我的付费服务。\n\n不急，觉得需要了再来。",
  "AI 实践": "AI不是魔法。它是一个工具——能帮你整理、对比、查漏，但不能替代你的判断、你的经验、你对人的理解。我写AI实战，不追热点，不讲\"颠覆\"，只讲传统行业的人怎么把AI用进真实工作里。\n\n如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。简单的问题尽量免费帮你看，需要完整方案是我的付费服务。\n\n不急，觉得需要了再来。",
  "一人公司": "我写这些，是因为我从零开始做过。不是理论派，是真金白银换来的经验。传统行业的人做IP，有独特的优势——你有真实经历，有判断力，有行业认知，这些东西AI写不出来。\n\n如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。简单的问题尽量免费帮你看，需要完整方案是我的付费服务。\n\n不急，觉得需要了再来。",
};

// Step 1: Find all article blocks
// Each starts with `{\n    id:` and has `content: \`...\`,`
// We locate id → category → content opening → content closing

const idRe = /\{\n    id:\s*'([^']+)'/g;
const articles = [];
let im;
while ((im = idRe.exec(s)) !== null) {
  const articleStart = im.index;
  const id = im[1];

  // Find category within ~500 chars after id
  const chunk = s.substring(im.index, im.index + 500);
  const catM = chunk.match(/category:\s*'([^']+)'/);
  const category = catM ? catM[1] : "真实居住";

  // Find content opening
  const contentOpenRe = /\n    content: `|`\s*,\n/g;

  // Find the content closing — look for backtick followed by comma+newline+field
  // Actually, let's find the content: ` marker and then track to its close.
  // But regex can't easily find this across arbitrary content.

  // Better: from articleStart, find `content: \x60` then track closing backtick
  const afterArticle = s.substring(im.index);
  const coMatch = afterArticle.match(/\n    content: \x60/);
  if (!coMatch) continue;
  const coAbsPos = im.index + coMatch.index + coMatch[0].length;

  // Find closing backtick
  let pos = coAbsPos;
  while (pos < s.length) {
    if (s[pos] === "\\") { pos += 2; continue; }
    if (s[pos] === "\x60") {
      const after = s.substring(pos + 1, pos + 8).trimStart();
      if (after.startsWith(",") || after.startsWith("}")) {
        articles.push({
          id,
          category,
          contentStart: coAbsPos,
          contentEnd: pos,
        });
        break;
      }
    }
    pos++;
  }
}

console.log("Articles found:", articles.length);

// Step 2: For each article, find the position of the last "我写这些，" in its content
// and replace everything from there to contentEnd with the correct ending.
const fixes = [];
for (const art of articles) {
  const content = s.substring(art.contentStart, art.contentEnd);
  const endingIdx = content.lastIndexOf("我写这些，");
  if (endingIdx < 0) {
    console.log("  Article", art.id, ": NO ending found in content");
    continue;
  }
  const absEndingPos = art.contentStart + endingIdx;
  const correctEnding = "\n\n---\n\n" + (ENDINGS[art.category] || ENDINGS["真实居住"]);
  fixes.push({ id: art.id, cat: art.category, start: absEndingPos, end: art.contentEnd, newEnding: correctEnding });
}

console.log("Fixes:", fixes.length);

// Apply bottom-up
let result = s;
fixes.sort((a, b) => b.start - a.start);
for (const f of fixes) {
  result = result.substring(0, f.start) + f.newEnding + result.substring(f.end);
}

// Verify
const verifyIds = ["01", "02", "03", "04", "05"];
for (const aid of verifyIds) {
  const a = articles.find(x => x.id === aid);
  if (!a) continue;
  // Re-find in result
  const idx = result.indexOf("我写这些，", Math.max(0, a.contentStart - 500));
  if (idx < 0) continue;
  const snippet = result.substring(idx, idx + 60);
  let endingType = "???";
  if (snippet.includes("从零开始做过")) endingType = "一人公司";
  else if (snippet.includes("不是要教谁生活")) endingType = "判断与生活";
  else if (snippet.includes("让你在装修前看清楚")) endingType = "真实居住";
  else if (snippet.includes("AI不是魔法")) endingType = "AI 实践";
  console.log("  Verify", aid, "cat=" + a.category, "ending=" + endingType, endingType === a.category ? "OK" : "WRONG");
}

fs.writeFileSync("g:/Zenoaihome.com/zeno-site/data/content/articles.ts", result, "utf-8");
console.log("Done. Length before:", s.length, "after:", result.length);
