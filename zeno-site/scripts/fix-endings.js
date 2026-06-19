/**
 * fix-endings.ts
 *
 * Articles 02-05 have wrong endings due to offset misalignment in v4 rebuild.
 * This script re-attaches the correct ending by article category.
 *
 * Run: node "g:/Zenoaihome.com/zeno-site/scripts/fix-endings.js"
 */
const fs = require("fs");
const s = fs.readFileSync("g:/Zenoaihome.com/zeno-site/data/content/articles.ts", "utf-8");

const ENDINGS = {
  "真实居住": "我写这些，是让你在装修前看清楚——不是看风格，是看报价、看合同、看这个决定以后会不会让你后悔。\n\n如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。手里有报价单或合同草稿的，发给我帮你看看，简单的问题尽量免费。需要完整审核、合同把关或签约前综合判断，是我的付费服务。\n\n不急，觉得需要了再来。",
  "判断与生活": "我写这些，不是要教谁生活。我只是觉得居住这件事被低估了——它影响你的情绪、你的关系、你每天醒来第一个感觉。\n\n如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。简单的问题尽量免费帮你看，需要完整方案是我的付费服务。\n\n不急，觉得需要了再来。",
  "AI 实践": "AI不是魔法。它是一个工具——能帮你整理、对比、查漏，但不能替代你的判断、你的经验、你对人的理解。我写AI实战，不追热点，不讲\"颠覆\"，只讲传统行业的人怎么把AI用进真实工作里。\n\n如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。简单的问题尽量免费帮你看，需要完整方案是我的付费服务。\n\n不急，觉得需要了再来。",
  "一人公司": "我写这些，是因为我从零开始做过。不是理论派，是真金白银换来的经验。传统行业的人做IP，有独特的优势——你有真实经历，有判断力，有行业认知，这些东西AI写不出来。\n\n如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。简单的问题尽量免费帮你看，需要完整方案是我的付费服务。\n\n不急，觉得需要了再来。",
};

// Find all content blocks
const starts = [];
let m;
const re = /\n    content: \x60/g;
while ((m = re.exec(s)) !== null) starts.push(m.index + m[0].length);

const blocks = [];
for (const start of starts) {
  let pos = start;
  while (pos < s.length) {
    if (s[pos] === "\\") { pos += 2; continue; }
    if (s[pos] === "\x60") {
      const after = s.substring(pos + 1, pos + 5).trimStart();
      if (after.startsWith(",") || after.startsWith("}")) {
        blocks.push({ start, end: pos, content: s.substring(start, pos) });
        break;
      }
    }
    pos++;
  }
}

// Find category for each block
const catRe = /category:\s*'([^']+)'/;
for (const b of blocks) {
  const before = s.substring(Math.max(0, b.start - 2500), b.start);
  const cm = catRe.exec(before);
  b.category = cm ? cm[1] : "真实居住";
}

// Replace ALL endings (strip current ending, append correct one)
// The current ending always starts with "\n\n---\n\n我写这些" or "\n\n我写这些"
// (some endings lost their --- in the confusion)
const endingStartRe = /\n\n---\n\n我写这些[\s\S]*$/;
const endingStartRe2 = /\n\n我写这些[\s\S]*$/;

for (const b of blocks) {
  let c = b.content;
  // Strip current ending
  c = c.replace(endingStartRe, "");
  c = c.replace(endingStartRe2, "");
  c = c.trimEnd();
  // Append correct ending
  b.newContent = c + "\n\n---\n\n" + (ENDINGS[b.category] || ENDINGS["真实居住"]);
}

// Rebuild
blocks.sort((a, b) => b.start - a.start);
let result = s;
for (const b of blocks) {
  result = result.substring(0, b.start) + b.newContent + result.substring(b.end);
}

fs.writeFileSync("g:/Zenoaihome.com/zeno-site/data/content/articles.ts", result, "utf-8");
console.log("Done. Length:", result.length);
