/**
 * final-cleanup.ts — handles the one remaining FAQ block directly plus any edge cases.
 */
const fs = require("fs");
const path = require("path");
const FPATH = path.resolve("g:/Zenoaihome.com/zeno-site/data/content/articles.ts");
let s = fs.readFileSync(FPATH, "utf-8");
console.log("Before:", s.length);

// This specific block: \n\n---\n\n## 常见问题 ... (everything up to the last real body text before the unified ending)
// The unified ending always starts with "\r\n\r\n---\r\n\r\n我写这些" or "\n\n---\n\n我写这些"

// Remove the FAQ block from article 06 (id='06', budget article)
// It spans from "\n\n---\n\n## 常见问题" to just before "\n\n---\n\n我写这些"
s = s.replace(/\r?\n---\r?\n\r?\n## 常见问题[\s\S]*?(?=\r?\n---\r?\n\r?\n我写这些，)/g, "");

// Remove any other residual blocks of ## 相关阅读, ## 下一步, ## 服务入口 that are
// still before the unified ending
s = s.replace(/\r?\n---\r?\n\r?\n## 相关阅读[\s\S]*?(?=\r?\n---\r?\n\r?\n我写这些，)/g, "");
s = s.replace(/\r?\n---\r?\n\r?\n## 下一步[\s\S]*?(?=\r?\n---\r?\n\r?\n我写这些，)/g, "");
s = s.replace(/\r?\n---\r?\n\r?\n## 服务入口[\s\S]*?(?=\r?\n---\r?\n\r?\n我写这些，)/g, "");

// Clean orphaned --- triplets
s = s.replace(/\n---\n\n---\n/g, "\n---\n");

// Clean excess blank lines
s = s.replace(/\n{4,}/g, "\n\n\n");

console.log("After:", s.length);
fs.writeFileSync(FPATH, s, "utf-8");
console.log("Done.");
