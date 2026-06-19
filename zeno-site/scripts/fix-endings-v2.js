/**
 * fix-endings-v2.js
 *
 * The content-block alignment is offset because ending replacement changes
 * block boundaries. This script takes a different approach:
 *
 * 1. Find each "id: 'XX'" article boundary
 * 2. Find its category
 * 3. Find the closing backtick of its content
 * 4. Greedily delete everything from the last "我写这些" to the backtick
 * 5. Append the correct ending
 *
 * Run: node "g:/Zenoaihome.com/zeno-site/scripts/fix-endings-v2.js"
 */
const fs = require("fs");
const s = fs.readFileSync("g:/Zenoaihome.com/zeno-site/data/content/articles.ts", "utf-8");

const ENDINGS = {
  "真实居住": "我写这些，是让你在装修前看清楚——不是看风格，是看报价、看合同、看这个决定以后会不会让你后悔。\n\n如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。手里有报价单或合同草稿的，发给我帮你看看，简单的问题尽量免费。需要完整审核、合同把关或签约前综合判断，是我的付费服务。\n\n不急，觉得需要了再来。",
  "判断与生活": "我写这些，不是要教谁生活。我只是觉得居住这件事被低估了——它影响你的情绪、你的关系、你每天醒来第一个感觉。\n\n如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。简单的问题尽量免费帮你看，需要完整方案是我的付费服务。\n\n不急，觉得需要了再来。",
  "AI 实践": "AI不是魔法。它是一个工具——能帮你整理、对比、查漏，但不能替代你的判断、你的经验、你对人的理解。我写AI实战，不追热点，不讲\"颠覆\"，只讲传统行业的人怎么把AI用进真实工作里。\n\n如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。简单的问题尽量免费帮你看，需要完整方案是我的付费服务。\n\n不急，觉得需要了再来。",
  "一人公司": "我写这些，是因为我从零开始做过。不是理论派，是真金白银换来的经验。传统行业的人做IP，有独特的优势——你有真实经历，有判断力，有行业认知，这些东西AI写不出来。\n\n如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。简单的问题尽量免费帮你看，需要完整方案是我的付费服务。\n\n不急，觉得需要了再来。",
};

const endingStart = "我写这些，";
const endingEnd = "觉得需要了再来。";

// Find all category lines
const catRe = /\n    category:\s*'([^']+)'/g;
const cats = [];
let m;
while ((m = catRe.exec(s)) !== null) cats.push({ idx: m.index, cat: m[1] });

// Find all content closing backtick positions (the backtick before the comma)
const closeRe = /\x60\s*,?\s*\n(?:\s*(?:coverImage|coverAlt|relatedImages|}\s*,?\s*\n?\s*\{|}\s*\n?\s*\]|}\)|\)\s*;))/g;
const closes = [];
while ((m = closeRe.exec(s)) !== null) closes.push({ idx: m.index, match: m[0].substring(0, 20) });

console.log("Categories:", cats.length, "Closes:", closes.length);

// Match each close to its nearest preceding category
if (closes.length !== cats.length) {
  console.log("MISMATCH: cats=" + cats.length + " closes=" + closes.length);
}

// Build replacements from bottom up
const replacements = [];
for (let i = 0; i < Math.min(cats.length, closes.length); i++) {
  const cat = cats[i].cat;
  const closeIdx = closes[i].idx;

  // Find the content start (`` before this close)
  // Search backwards from closeIdx for "我写这些" — that's the current ending start
  // We want to delete from "我写这些" to closeIdx
  const before = s.substring(Math.max(0, closeIdx - 800), closeIdx);
  const endingPos = before.lastIndexOf(endingStart);
  if (endingPos < 0) {
    console.log("  No ending found for cat line at", cats[i].idx, "close at", closeIdx);
    continue;
  }
  const absEndingPos = Math.max(0, closeIdx - 800) + endingPos;

  // Build the correct ending block
  const newEnding = "\n\n---\n\n" + (ENDINGS[cat] || ENDINGS["真实居住"]);

  replacements.push({
    start: absEndingPos,
    end: closeIdx,
    newEnding,
    cat,
  });
}

console.log("Replacements:", replacements.length);

// Apply from bottom up
let result = s;
replacements.sort((a, b) => b.start - a.start);
for (const r of replacements) {
  result = result.substring(0, r.start) + r.newEnding + result.substring(r.end);
}

fs.writeFileSync("g:/Zenoaihome.com/zeno-site/data/content/articles.ts", result, "utf-8");
console.log("Done. Length before:", s.length, "after:", result.length);
