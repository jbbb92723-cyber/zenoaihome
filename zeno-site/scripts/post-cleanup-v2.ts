/**
 * post-cleanup-v2.ts
 * Removes residual tail blocks that sit between real body content
 * and the "我写这些" ending. Works on the current state of articles.ts.
 *
 * Run: node "g:/Zenoaihome.com/zeno-site/scripts/post-cleanup-v2.ts"
 */
const fs = require("fs");
const path = require("path");
const FPATH = path.resolve("g:/Zenoaihome.com/zeno-site/data/content/articles.ts");
let s = fs.readFileSync(FPATH, "utf-8");
console.log("Before:", s.length);

// Remove everything between a known real-body ending and the unified ending.
// The unified ending always starts with "\n\n---\n\n我写这些".
// Before it there may be residual "## 相关阅读", "## 下一步", "## 服务入口",
// "## 常见问题" blocks and their content.

// Strategy: any occurrence of these markers that is followed eventually by
// "\n---\n\n我写这些" (within the same article) gets deleted.

const markers = [
  "## 常见问题",
  "## FAQ",
  "## 相关阅读",
  "## 下一步",
  "## 服务入口",
];

for (const marker of markers) {
  // Match the marker and everything after it until the unified ending
  // The pattern: marker line, then everything (including newlines) until the ending
  const re = new RegExp(
    "(\\n\\n)?" +                           // optional leading blank lines
    "---\\n\\n" + marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +   // ## 常见问题 etc
    "[\\s\\S]*?" +                          // everything until...
    "(?=\\n---\\n\\n我写这些)",              // ...the unified ending (lookahead)
    "g"
  );
  s = s.replace(re, "");
}

// Remove any remaining "关注公众号" lines
s = s.replace(/\n关注公众号「[^」]+」[^\n]*/g, "");

// Remove "→ [...]" link lines
s = s.replace(/\n→ \[[^\]]+\]\([^)]+\)[^\n:]*:?[^\n]*/g, "");

// Remove "进入 [资料库]..." lines
s = s.replace(/\n进入 \[资料库\]\([^)]+\)[^\n]*/g, "");

// Remove orphaned bold CTAs like "**如果你正在准备..."
s = s.replace(/\n\*\*如果你.*?\*\*\n?/g, "");

// Clean up orphaned --- followed by another ---
s = s.replace(/\n---\n\n---\n/g, "\n---\n");

// Clean multiple consecutive blank lines
s = s.replace(/\n{4,}/g, "\n\n\n");

// Clean any trailing --- before the ending
s = s.replace(/\n---\n+(?=\n我写这些)/g, "\n");

// Ensure the ending is preceded by exactly \n\n (not more)
s = s.replace(/\n{3,}(?=\n---\n\n我写这些)/g, "\n\n");

// Remove any blank line between \n---\n and \n我写这些
s = s.replace(/\n---\n\n+(?=\n我写这些)/g, "\n---\n\n");

// Clean duplicate start of endings
s = s.replace(/(\n---\n\n我写这些，[\s\S]*?觉得需要了再来。)\1/g, "$1");

console.log("After:", s.length);
fs.writeFileSync(FPATH, s, "utf-8");
console.log("Done.");
