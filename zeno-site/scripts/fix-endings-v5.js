const fs = require("fs");
const s = fs.readFileSync("g:/Zenoaihome.com/zeno-site/data/content/articles.ts", "utf-8");

const ENDINGS = {
  "真实居住": "我写这些，是让你在装修前看清楚——不是看风格，是看报价、看合同、看这个决定以后会不会让你后悔。\n\n如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。手里有报价单或合同草稿的，发给我帮你看看，简单的问题尽量免费。需要完整审核、合同把关或签约前综合判断，是我的付费服务。\n\n不急，觉得需要了再来。",
  "判断与生活": "我写这些，不是要教谁生活。我只是觉得居住这件事被低估了——它影响你的情绪、你的关系、你每天醒来第一个感觉。\n\n如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。简单的问题尽量免费帮你看，需要完整方案是我的付费服务。\n\n不急，觉得需要了再来。",
  "AI 实践": "AI不是魔法。它是一个工具——能帮你整理、对比、查漏，但不能替代你的判断、你的经验、你对人的理解。我写AI实战，不追热点，不讲\"颠覆\"，只讲传统行业的人怎么把AI用进真实工作里。\n\n如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。简单的问题尽量免费帮你看，需要完整方案是我的付费服务。\n\n不急，觉得需要了再来。",
  "一人公司": "我写这些，是因为我从零开始做过。不是理论派，是真金白银换来的经验。传统行业的人做IP，有独特的优势——你有真实经历，有判断力，有行业认知，这些东西AI写不出来。\n\n如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。简单的问题尽量免费帮你看，需要完整方案是我的付费服务。\n\n不急，觉得需要了再来。",
};

const TARGET_IDS = ["01","02","03","04","05","06","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","46","47","52","53"];
// These are IDs with inline content (not imported from article-XX-content.ts)

// Step 1: Get category for each target ID
const idInfo = [];
for (const tid of TARGET_IDS) {
  const idSearch = `\n    id: '${tid}'\n`;
  const idIdx = s.indexOf(idSearch);
  if (idIdx < 0) { console.log(tid, "not found"); continue; }
  const chunk = s.substring(idIdx, idIdx + 600);
  const catM = chunk.match(/\n    category:\s*'([^']+)'/);
  idInfo.push({ id: tid, cat: catM ? catM[1] : "真实居住", idPos: idIdx });
}

// Step 2: For each target ID, find its content: ` and closing `
const replacements = [];
for (const info of idInfo) {
  const afterId = s.substring(info.idPos);
  const coMatch = afterId.match(/\n    content: `|`\s*,\n|\n    content: \x60/);
  if (!coMatch || coMatch[0] !== "\n    content: \x60") { console.log(info.id, "bad content match:", coMatch ? JSON.stringify(coMatch[0].substring(0,20)) : "null"); continue; }
  const coStart = info.idPos + coMatch.index + coMatch[0].length;

  // Walk to closing `
  let pos = coStart;
  let found = false;
  while (pos < s.length) {
    if (s[pos] === "\\") { pos += 2; continue; }
    if (s[pos] === "\x60") {
      const afterBT = s.substring(pos + 1).trimStart();
      if (afterBT.startsWith(",") || afterBT.startsWith("}")) {
        const content = s.substring(coStart, pos);
        // Find last "我写这些，" in content
        const endingIdx = content.lastIndexOf("我写这些，");
        if (endingIdx >= 0) {
          const absPos = coStart + endingIdx;
          const ending = ENDINGS[info.cat] || ENDINGS["真实居住"];
          replacements.push({ id: info.id, cat: info.cat, start: absPos, end: pos, ending: "\n\n---\n\n" + ending });
        } else {
          // No existing ending, just append
          const ending = ENDINGS[info.cat] || ENDINGS["真实居住"];
          replacements.push({ id: info.id, cat: info.cat, start: pos, end: pos, ending: "\n\n---\n\n" + ending });
        }
        found = true;
        break;
      }
    }
    pos++;
  }
  if (!found) console.log(info.id, "unclosed content");
}

console.log("Replacements:", replacements.length);

// Apply bottom-up
let result = s;
replacements.sort((a, b) => b.start - a.start);
for (const r of replacements) {
  result = result.substring(0, r.start) + r.ending + result.substring(r.end);
}

// Verify
for (const vid of ["01","02","03","04","05"]) {
  const info = idInfo.find(x => x.id === vid);
  if (!info) { console.log(vid, "no info"); continue; }
  const idSearch = `\n    id: '${vid}'\n`;
  const idIdx = result.indexOf(idSearch);
  const after = result.substring(idIdx);
  const coMatch = after.match(/\n    content: \x60/);
  if (!coMatch) { console.log(vid, "no content in result"); continue; }
  const cs = idIdx + coMatch.index + coMatch[0].length;
  let p = cs;
  while (p < result.length) {
    if (result[p] === "\\") { p += 2; continue; }
    if (result[p] === "\x60") { break; }
    p++;
  }
  const ct = result.substring(cs, p);
  const eIdx = ct.lastIndexOf("我写这些，");
  if (eIdx < 0) { console.log(vid, "no ending"); continue; }
  const snip = ct.substring(eIdx, eIdx + 60);
  let et = "???";
  if (snip.includes("从零开始做过")) et = "一人公司";
  else if (snip.includes("不是要教谁生活")) et = "判断与生活";
  else if (snip.includes("让你在装修前看清楚")) et = "真实居住";
  else if (snip.includes("AI不是魔法")) et = "AI 实践";
  console.log(vid, "cat=" + info.cat, "ending=" + et, et === info.cat ? "OK" : "WRONG!");
}

fs.writeFileSync("g:/Zenoaihome.com/zeno-site/data/content/articles.ts", result, "utf-8");
console.log("Done. Length:", result.length);
