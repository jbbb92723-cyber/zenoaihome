/**
 * polish-articles.ts
 *
 * Global text polish on articles.ts content blocks:
 * 1. Replace formal/corporate phrases with plain speech
 * 2. Add inline plain-language explanations for technical terms
 * 3. Break the longest sentences at natural split points
 *
 * Run: node g:/Zenoaihome.com/zeno-site/scripts/polish-articles.ts
 */
const fs = require("fs");
const FPATH = "g:/Zenoaihome.com/zeno-site/data/content/articles.ts";
let src = fs.readFileSync(FPATH, "utf-8");

// ── Find all content blocks ──────────────────────────────────────
const starts = [];
let m;
const re = /\n    content: \x60/g;
while ((m = re.exec(src)) !== null) starts.push(m.index + m[0].length);

const blocks = [];
for (const start of starts) {
  let pos = start;
  while (pos < src.length) {
    if (src[pos] === "\\") { pos += 2; continue; }
    if (src[pos] === "\x60") {
      const after = src.substring(pos + 1, pos + 5).trimStart();
      if (after.startsWith(",") || after.startsWith("}")) {
        blocks.push({ start, end: pos, content: src.substring(start, pos) });
        break;
      }
    }
    pos++;
  }
}

console.log("Blocks:", blocks.length);

// ── Polish rules ─────────────────────────────────────────────────

// Phase A: Term explanations (add inline after first occurrence in each block)
const TERM_EXPLANATIONS = [
  {
    term: "闭水试验",
    explain: "（在卫生间堵住地漏放水，放24到48小时，看楼下漏不漏水）",
    once: true,
  },
  {
    term: "打压试验",
    explain: "（给水管加压到规定数值，保持一段时间看压力掉不掉，检查水管有没有漏点）",
    once: true,
  },
  {
    term: "空鼓",
    explain: "（瓷砖或墙面底下空了，敲起来声音发空）",
    once: true,
  },
  {
    term: "沉锚效应",
    explain: "（人会不自觉地被第一个看到的数字或选择“锚住”，后面做的决定都会围着这个“锚”打转）",
    once: true,
  },
  {
    term: "ENF",
    explain: "（ENF是目前板材环保等级里最高的标准，甲醛释放量极低）",
    once: false,
  },
  {
    term: "E0",
    explain: "（E0是板材甲醛释放量的一个环保等级，比ENF稍低一档）",
    once: false,
  },
  {
    term: "VOC",
    explain: "（涂料里挥发的有害气体，越低越安全）",
    once: false,
  },
  {
    term: "GB 50327",
    explain: "（住宅装饰装修工程施工的国家标准编号）",
    once: false,
  },
  {
    term: "GB50209",
    explain: "（建筑地面工程施工质量验收的国家标准编号）",
    once: false,
  },
];

// Phase B: Phrase replacements (formal → plain)
const REPLACEMENTS = [
  // Corporate jargon
  [/\b赋能\b/g, "帮"],
  [/\b抓手\b/g, "工具"],
  [/\b倒逼\b/g, "推动"],
  [/\b心智模型\b/g, "判断方式"],
  [/\b系统性地\b/g, ""],
  [/\b结构性(的|地)?\b/g, ""],
  [/\b底层逻辑\b/g, "根本原因"],
  [/\b方法论\b/g, "方法"],
  [/\b闭环\b/g, "完整流程"],
  [/\b颗粒度\b/g, "细节程度"],

  // Written-style phrases that add no meaning
  [/\b从某种意义上说[,，]?\s*/g, ""],
  [/\b换言之\b/g, "就是说"],
  [/\b毋庸置疑\b/g, ""],
  [/\b不可否认\b/g, ""],
  [/\b由此可见\b/g, "所以"],
  [/\b众所周知\b/g, "大家都知道"],

  // Over-formal connectors
  [/\b基于此\b/g, "所以"],
  [/\b因此\b/g, "所以"],
  [/\b故而\b/g, "所以"],
  [/\b进而\b/g, "然后"],
  [/\b从而\b/g, "来"],
  [/\b以便\b/g, "好"],
  [/\b倘若\b/g, "如果"],
  [/\b即便\b/g, "就算"],
  [/\b然而\b/g, "但"],
  [/\b此外\b/g, "还有"],
  [/\b首先\b/g, "先"],
  [/\b其次\b/g, "然后"],
  [/\b最后\b/g, "最后"],

  // Puffy adjectives
  [/\b非常(\S{2,4})的\b/g, "很$1的"],
  [/\b极为(\S{2,4})\b/g, "很$1"],
  [/\b充分(\S{2,4})\b/g, "$1"],
  [/\b极其\b/g, "很"],

  // Overused phrases
  [/\b在这个维度[上中]?\b/g, "这方面"],
  [/\b重新定义了?\b/g, "改变了"],
  [/\b信息差\b/g, "信息不对称"],

  // "一个" cleanup (often unnecessary in Chinese)
  // Keep as-is — can be stylistic
];

// Phase C: Sentence breakers — split long sentences at natural points
// Applied per block on sentences > 50 chars
function breakLongSentences(text) {
  const sentences = text.split(/(?<=[。！？])/);
  const result = [];
  for (const sen of sentences) {
    if (sen.length <= 60) {
      result.push(sen);
      continue;
    }
    // Try splitting at ； ;
    const parts = sen.split(/(?<=[；;])/);
    if (parts.length > 1 && parts.every(p => p.length < 55)) {
      result.push(...parts);
      continue;
    }
    // Try splitting at ，
    const commaParts = sen.split(/(?<=[，,])/);
    if (commaParts.length > 1) {
      // Only break if the parts are reasonably balanced
      const maxPart = Math.max(...commaParts.map(p => p.length));
      if (maxPart < 55) {
        result.push(...commaParts);
        continue;
      }
    }
    result.push(sen); // can't break cleanly
  }
  return result.join("");
}

// ── Apply to each block ──────────────────────────────────────────
for (const block of blocks) {
  let c = block.content;

  // Phase B: Replacements
  for (const [re, repl] of REPLACEMENTS) {
    c = c.replace(re, repl);
  }

  // Phase A: Term explanations (first occurrence per block)
  for (const { term, explain, once } of TERM_EXPLANATIONS) {
    if (once) {
      // Only replace first occurrence in this block
      const idx = c.indexOf(term);
      if (idx >= 0) {
        // Check it's not inside an existing explanation
        const before = c.substring(Math.max(0, idx - 2), idx);
        if (before !== "（") {
          c = c.substring(0, idx + term.length) + explain + c.substring(idx + term.length);
        }
      }
    } else {
      // Replace all occurrences
      const reAll = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "g");
      c = c.replace(reAll, term + explain);
    }
  }

  // Phase C: Break long sentences
  // Only apply to prose paragraphs, skip markdown headers/lists
  const paragraphs = c.split(/\n\n/);
  const polished = paragraphs.map(para => {
    // Skip obvious non-prose
    if (para.startsWith("#") || para.startsWith("-") || para.startsWith("→") ||
        para.startsWith("**Q：") || para.startsWith("1.") || para.startsWith("2.") ||
        para.startsWith("3.") || para.startsWith("4.") || para.startsWith("5.") ||
        para.match(/^\*\*/)) {
      return para;
    }
    return breakLongSentences(para);
  });
  c = polished.join("\n\n");

  block.newContent = c;
}

// ── Rebuild file (reverse order) ─────────────────────────────────
blocks.sort((a, b) => b.start - a.start);
for (const block of blocks) {
  src = src.substring(0, block.start) + block.newContent + src.substring(block.end);
}

// Clean excess blank lines
src = src.replace(/\n{4,}/g, "\n\n\n");

fs.writeFileSync(FPATH, src, "utf-8");
console.log("Done. Final length:", src.length);
