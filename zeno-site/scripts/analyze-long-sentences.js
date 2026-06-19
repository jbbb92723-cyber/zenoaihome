/**
 * analyze-long-sentences.ts - Find sentences > 50 chars in articles.ts
 * Run: node g:/Zenoaihome.com/zeno-site/scripts/analyze-long-sentences.ts
 */
const fs = require("fs");
const s = fs.readFileSync("g:/Zenoaihome.com/zeno-site/data/content/articles.ts", "utf-8");

// Find all content blocks
const starts = [];
const re = /\n    content: \x60/g;
let m;
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

console.log("Total blocks:", blocks.length);

let totalLong = 0;
let totalSentences = 0;
const longExamples = [];

for (let i = 0; i < blocks.length; i++) {
  const b = blocks[i];
  // Split into sentences by Chinese punctuation
  const sentences = b.content.split(/[。！？\n]/).filter(Boolean);
  for (const sen of sentences) {
    const clean = sen.trim();
    if (clean.length > 50) {
      totalLong++;
      if (longExamples.length < 30) {
        longExamples.push({ block: i + 1, len: clean.length, text: clean.substring(0, 120) });
      }
    }
    totalSentences++;
  }
}

console.log("Total sentences:", totalSentences);
console.log("Long (>50 chars):", totalLong);
console.log("Percentage:", ((totalLong / totalSentences) * 100).toFixed(1) + "%");
console.log("\n-- Longest examples --");
for (const ex of longExamples.slice(0, 30)) {
  console.log("  B" + ex.block + " (" + ex.len + "c): " + ex.text + "...");
}
