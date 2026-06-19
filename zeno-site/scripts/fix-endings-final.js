const fs = require("fs");
const s = fs.readFileSync("g:/Zenoaihome.com/zeno-site/data/content/articles.ts", "utf-8");

const ENDINGS = {
  "真实居住": "我写这些，是让你在装修前看清楚——不是看风格，是看报价、看合同、看这个决定以后会不会让你后悔。\n\n如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。手里有报价单或合同草稿的，发给我帮你看看，简单的问题尽量免费。需要完整审核、合同把关或签约前综合判断，是我的付费服务。\n\n不急，觉得需要了再来。",
  "判断与生活": "我写这些，不是要教谁生活。我只是觉得居住这件事被低估了——它影响你的情绪、你的关系、你每天醒来第一个感觉。\n\n如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。简单的问题尽量免费帮你看，需要完整方案是我的付费服务。\n\n不急，觉得需要了再来。",
  "AI 实践": "AI不是魔法。它是一个工具——能帮你整理、对比、查漏，但不能替代你的判断、你的经验、你对人的理解。我写AI实战，不追热点，不讲颠覆，只讲传统行业的人怎么把AI用进真实工作里。\n\n如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。简单的问题尽量免费帮你看，需要完整方案是我的付费服务。\n\n不急，觉得需要了再来。",
  "一人公司": "我写这些，是因为我从零开始做过。不是理论派，是真金白银换来的经验。传统行业的人做IP，有独特的优势——你有真实经历，有判断力，有行业认知，这些东西AI写不出来。\n\n如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。简单的问题尽量免费帮你看，需要完整方案是我的付费服务。\n\n不急，觉得需要了再来。",
};

// Find all id: 'XX', and build article info
const idRe = /\n    id: '([^']+)',/g;
const ids = [];
let m;
while ((m = idRe.exec(s)) !== null) ids.push({ id: m[1], pos: m.index });

// Get category and content boundaries
const reps = [];
for (const a of ids) {
  const chunk = s.substring(a.pos, a.pos + 600);
  const catM = chunk.match(/\n    category:\s*'([^']+)'/);
  a.cat = catM ? catM[1] : "真实居住";

  const after = s.substring(a.pos);
  const coMatch = after.match(/\n    content: \x60/);
  if (!coMatch) { console.log(a.id, "no content"); continue; }
  const cs = a.pos + coMatch.index + coMatch[0].length;

  // Walk to closing `
  let pos = cs;
  let found = false;
  while (pos < s.length && !found) {
    if (s[pos] === "\\") { pos += 2; continue; }
    if (s[pos] === "\x60") {
      const af = s.substring(pos + 1).trimStart();
      if (af.startsWith(",") || af.startsWith("}")) {
        const content = s.substring(cs, pos);
        const ei = content.lastIndexOf("我写这些，");
        const ending = "\n\n---\n\n" + (ENDINGS[a.cat] || ENDINGS["真实居住"]);
        if (ei >= 0) {
          reps.push({ id: a.id, cat: a.cat, start: cs + ei, end: pos, ending });
        } else {
          reps.push({ id: a.id, cat: a.cat, start: pos, end: pos, ending });
        }
        found = true;
      }
    }
    pos++;
  }
  if (!found) console.log(a.id, "unclosed");
}

console.log("Replacements:", reps.length);

// Apply bottom-up
let res = s;
reps.sort((a, b) => b.start - a.start);
for (const r of reps) res = res.substring(0, r.start) + r.ending + res.substring(r.end);

// Verify
for (const vid of ["01", "02", "03", "04", "05"]) {
  const a = ids.find(x => x.id === vid);
  if (!a) { console.log(vid, "no info"); continue; }
  const after = res.substring(res.indexOf("\n    id: '" + vid + "',"));
  const coMatch = after.match(/\n    content: \x60/);
  if (!coMatch) { console.log(vid, "no content"); continue; }
  const cs = res.indexOf("\n    id: '" + vid + "',") + coMatch.index + coMatch[0].length;
  let p = cs;
  while (p < res.length) {
    if (res[p] === "\\") { p += 2; continue; }
    if (res[p] === "\x60") break;
    p++;
  }
  const ct = res.substring(cs, p);
  const ei = ct.lastIndexOf("我写这些，");
  if (ei < 0) { console.log(vid, "no ending"); continue; }
  const snip = ct.substring(ei, ei + 60);
  let et = "???";
  if (snip.includes("从零开始做过")) et = "一人公司";
  else if (snip.includes("不是要教谁生活")) et = "判断与生活";
  else if (snip.includes("让你在装修前看清楚")) et = "真实居住";
  else if (snip.includes("AI不是魔法")) et = "AI 实践";
  console.log(vid, "cat=" + a.cat, "ending=" + et, et === a.cat ? "OK" : "WRONG!");
}

fs.writeFileSync("g:/Zenoaihome.com/zeno-site/data/content/articles.ts", res, "utf-8");
console.log("Done. Length:", res.length);
