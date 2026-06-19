const fs = require("fs");
const s = fs.readFileSync("g:/Zenoaihome.com/zeno-site/data/content/articles.ts", "utf-8");

// Just check first article
const idx = s.indexOf("content: \x60");
console.log("content: ` at", idx);

let pos = idx + 10;
while (pos < s.length && pos < idx + 5000) {
  const ch = s[pos];
  if (ch === "\\") { pos += 2; continue; }
  if (ch === "\x60") {
    const after = s.substring(pos + 1).trimStart();
    if (after.startsWith(",")) {
      console.log("Closing ` at", pos, "followed by:", JSON.stringify(after.substring(0, 30)));
      break;
    }
  }
  pos++;
}
if (pos >= idx + 5000) console.log("Never found closing");
