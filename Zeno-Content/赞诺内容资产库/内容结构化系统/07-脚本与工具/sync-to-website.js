/**
 * sync-to-website.js
 *
 * 从 Obsidian 内容资产库同步长文到 ZenoAIHome 网站
 *
 * 用法：node sync-to-website.js [--dry-run]
 *
 * 工作方式：
 * 1. 扫描 06-选题装配/ 下所有 .md 文件
 * 2. 读取 frontmatter 中的 published_as 标记
 * 3. 将 Markdown 内容转换为网站 TypeScript 模板字符串
 * 4. 写入对应的 article-XX-content.ts 或 articles.ts
 *
 * 约定（写入 CLAUDE.md 后生效）：
 * - 每篇 Obsidian 长文头部加 published_as: article-XX
 * - [[wikilink]] 在同步时自动转为纯文本
 * - 知识卡片引用块（> **本文调用的知识卡片**）保留在正文末尾
 */

const fs = require('fs');
const path = require('path');

// ─── 路径配置 ───
const OBSIDIAN_DIR = path.resolve(__dirname, '..', '06-选题装配');
const WEBSITE_CONTENT_DIR = path.resolve(__dirname, '..', '..', '..', '..', 'Zeno-Code', 'zeno-site', 'data', 'content');
const ARTICLES_TS = path.join(WEBSITE_CONTENT_DIR, 'articles.ts');

const DRY_RUN = process.argv.includes('--dry-run');

// ─── 映射表：Obsidian 文件名 → 网站 article ID ───
const MAPPING = {
  // P0 报价风险系列 (IDs 56-70)
  '2026-07-09_基础部分总合计不是最终价.md': 56,
  '2026-07-09_水电15个那个字到底指什么.md': 57,
  '2026-07-09_按实际结算七个字背后的规则.md': 58,
  '2026-07-09_防水只写品牌只是七分之一.md': 59,
  '2026-07-09_封窗报价专业感不等于完整性.md': 60,
  '2026-07-09_垃圾外运前后冲突试纸.md': 61,
  '2026-07-09_报价单不是价格表是责任边界表_总纲.md': 62,
  '2026-07-09_另计甲供暂估三个词.md': 63,
  '2026-07-09_口头承诺白纸黑字五类.md': 64,
  '2026-07-09_低价报价六个位置排查.md': 65,
  '2026-07-09_传统行业人用AI不是转型是系统化.md': 66,
  '2026-07-09_付款节点主动权安排.md': 67,
  '2026-07-09_验收不是签个字是闭个环.md': 68,
  '2026-07-09_材料只写品牌不够要型号.md': 69,
  '2026-07-09_工期60天不只是个数字.md': 70,

  // P1 判断力系列 (IDs 26-34)
  '2026-07-09_信息差最隐蔽的成本.md': 26,
  '2026-07-09_判断力是最稀缺的装修能力.md': 27,
  '2026-07-09_便宜报价往往最贵.md': 28,
  '2026-07-09_直觉在装修上不可靠.md': 31,
  '2026-07-09_决策焦虑选不出来不是选项的问题.md': 34,

  // P1 居住哲学系列 (IDs 02-22)
  '2026-07-09_家不是样板间.md': 2,
  '2026-07-09_实住派装修反对什么.md': 8,
  '2026-07-09_审美不是摆拍出来的.md': 16,
  '2026-07-09_放弃网红风审美成熟.md': 21,
  '2026-07-09_留白不是空是呼吸.md': 22,

  // P1 成长系列 (IDs 01-43)
  '2026-07-09_不只是教人装修.md': 1,
  '2026-07-09_长期主义不是忍耐.md': 5,
  '2026-07-09_经验是护城河不是负担.md': 40,
  '2026-07-09_克制不是委屈是排序.md': 35,
  '2026-07-09_坚持还是换方向.md': 43,

  // P1 实操智慧系列 (IDs 03-33)
  '2026-07-09_从工地看世界.md': 3,
  '2026-07-09_装修完最后悔的五件事.md': 11,
  '2026-07-09_耐住十年的装修优先级.md': 12,
  '2026-07-09_沟通失真比技术更贵.md': 15,
  '2026-07-09_装修里的责任真空.md': 33,

  // 已发布新ID（保留，内容也同步回旧ID保持一致性）
  '2026-07-09_越不懂越敢砍价_达克效应.md': 107,
  'ART-20260710_我是谁_身份长文.md': 108,
};

// 已通过新 ID 发布的文章（109-113），与旧 ID 的对应关系
const NEW_ID_OVERLAP = {
  62: 109,  // 报价总纲
  28: 110,  // 便宜最贵
  58: 111,  // 按实结算
  67: 112,  // 付款节点
  26: 113,  // 信息差
};

// ─── 工具函数 ───

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { frontmatter: {}, body: content };

  const fm = {};
  match[1].split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const val = line.slice(colonIdx + 1).trim();
      fm[key] = val;
    }
  });

  return { frontmatter: fm, body: content.slice(match[0].length) };
}

function convertForTsTemplate(content) {
  // 去掉 frontmatter
  const { body } = extractFrontmatter(content);

  // 去掉 published_as 行（如果出现在 body 第一行）
  let text = body.replace(/^published_as:.*\n?/m, '');

  // 清理多余空白行
  text = text.replace(/\n{4,}/g, '\n\n\n');

  // 转义 TypeScript 模板字符串特殊字符
  text = text.replace(/\\/g, '\\\\');   // 反斜杠
  text = text.replace(/`/g, '\\`');      // 反引号
  text = text.replace(/\$\{/g, '\\${');  // 模板插值

  // 转换 [[wikilink]] → 纯文本
  text = text.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2');  // [[id|显示文本]]
  text = text.replace(/\[\[([^\]]+)\]\]/g, '$1');               // [[id]]

  // 去掉末尾多余空行
  text = text.trimEnd() + '\n';

  return text;
}

function padId(id) {
  return String(id).padStart(2, '0');
}

function getTargetFile(articleId) {
  const idStr = padId(articleId);

  // IDs 1-53: 内联在 articles.ts 中
  if (articleId <= 53) {
    return { type: 'inline', path: ARTICLES_TS, id: articleId, idStr };
  }

  // IDs 54+: 独立的 article-XX-content.ts 文件
  const filename = `article-${idStr}-content.ts`;
  const filepath = path.join(WEBSITE_CONTENT_DIR, filename);

  // 如果文件不存在，创建它
  return { type: 'external', path: filepath, id: articleId, idStr, filename };
}

function writeExternalContentFile(filepath, content, articleId) {
  const idStr = padId(articleId);
  const tsContent = `// Article ${idStr}: Auto-synced from Obsidian
export const article${idStr}Content = \`${content}\`;
`;

  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would write ${filepath}`);
    return true;
  }

  fs.writeFileSync(filepath, tsContent, 'utf-8');
  return true;
}

function updateInlineArticle(articlesTsPath, articleId, content) {
  // 为内联文章（IDs 1-53）创建外部 content 文件，
  // 更新 articles.ts 用 import 引用，与 IDs 54+ 统一。

  const idStr = String(articleId).padStart(2, '0');
  const contentPath = path.join(WEBSITE_CONTENT_DIR, `article-${idStr}-content.ts`);

  // 1. 写入外部 content 文件
  const tsExport = `// Article ${idStr}: Auto-synced from Obsidian\nexport const article${idStr}Content = \`${content}\`;\n`;

  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would create ${contentPath} and update articles.ts import`);
    return true;
  }

  fs.writeFileSync(contentPath, tsExport, 'utf-8');

  // 2. 更新 articles.ts：内联 content → import 引用
  let articlesContent = fs.readFileSync(articlesTsPath, 'utf-8');
  const importName = `article${idStr}Content`;
  const importPath = `./article-${idStr}-content`;

  // 添加 import（如果不存在）
  if (!articlesContent.includes(`import { ${importName} }`)) {
    const lastImport = articlesContent.lastIndexOf('import { article');
    const endOfLine = articlesContent.indexOf('\n', lastImport);
    articlesContent =
      articlesContent.slice(0, endOfLine + 1) +
      `import { ${importName} } from '${importPath}';\n` +
      articlesContent.slice(endOfLine + 1);
  }

  // 替换 inline content 为 import 引用
  const idNum = String(articleId);
  const idPad = String(articleId).padStart(2, '0');
  const entryPattern = new RegExp(
    `(id:\\s*['"](${idNum}|${idPad})['"][\\s\\S]*?)content:\\s*` + '`[\\s\\S]*?`\\s*(,\\n\\s*\\},)',
    'm'
  );

  articlesContent = articlesContent.replace(entryPattern, `$1content: ${importName}$3`);
  fs.writeFileSync(articlesTsPath, articlesContent, 'utf-8');
  return true;
}

// ─── 主流程 ───

console.log('🔄 Zeno Content → Website Sync');
console.log(`   Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'LIVE'}`);
console.log('');

const results = { synced: [], skipped: [], failed: [] };

// 1. 扫描 Obsidian 文章并同步
for (const [filename, articleId] of Object.entries(MAPPING)) {
  const mdPath = path.join(OBSIDIAN_DIR, filename);

  if (!fs.existsSync(mdPath)) {
    results.skipped.push({ filename, articleId, reason: 'File not found' });
    console.log(`⚠️  SKIP: ${filename} → article-${padId(articleId)} (file not found)`);
    continue;
  }

  const mdContent = fs.readFileSync(mdPath, 'utf-8');
  const tsContent = convertForTsTemplate(mdContent);

  // 检查是否已有 published_as frontmatter，没有则提示
  const { frontmatter } = extractFrontmatter(mdContent);
  if (!frontmatter.published_as && !DRY_RUN) {
    console.log(`   📝 Adding published_as frontmatter to ${filename}`);
    const newFrontmatter = `---\npublished_as: article-${padId(articleId)}\n---\n\n`;
    fs.writeFileSync(mdPath, newFrontmatter + mdContent, 'utf-8');
  }

  const target = getTargetFile(articleId);

  try {
    if (target.type === 'external') {
      writeExternalContentFile(target.path, tsContent, articleId);
    } else {
      updateInlineArticle(ARTICLES_TS, articleId, tsContent);
    }

    results.synced.push({ filename, articleId, targetType: target.type });
    console.log(`✅ SYNC: ${filename} → article-${padId(articleId)} (${target.type})`);
  } catch (err) {
    results.failed.push({ filename, articleId, error: err.message });
    console.log(`❌ FAIL: ${filename} → article-${padId(articleId)}: ${err.message}`);
  }
}

console.log('');
console.log('─'.repeat(50));
console.log(`📊 Sync complete: ${results.synced.length} synced, ${results.skipped.length} skipped, ${results.failed.length} failed`);
console.log('');

// 2. 提醒需要手动更新的部分
if (!DRY_RUN) {
  console.log('📋 Post-sync checklist:');
  console.log('   1. Check articles.ts for any import errors');
  console.log('   2. Verify external content files exist for IDs 54+');
  console.log('   3. Run `git diff` to review changes');
  console.log('   4. New IDs 109-113 already synced; old IDs 26/28/58/62/67 now have same content');
  console.log('   5. Build site to verify no compilation errors');
}
