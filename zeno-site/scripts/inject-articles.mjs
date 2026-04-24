/**
 * 将 articles-additional.ts 的内容直接注入 articles.ts 的 articles 数组
 * 不使用 import（避免循环依赖）
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const articlesPath = path.resolve(__dirname, '../data/articles.ts')
const additionalPath = path.resolve(__dirname, '../data/articles-additional.ts')

// Read articles.ts
let articlesContent = fs.readFileSync(articlesPath, 'utf-8')

// Check if already merged
if (articlesContent.includes('AUTO-MERGED')) {
  console.log('Already merged, skipping.')
  process.exit(0)
}

// Read articles-additional.ts
const additionalContent = fs.readFileSync(additionalPath, 'utf-8')

// Extract entries: everything between the [ and ] of the array  
// Match from `export const additionalArticles: Article[] = [` to the closing `]`
const arrMatch = additionalContent.match(/export const additionalArticles[^=]*=\s*\[([\s\S]*)\]\s*$/)
if (!arrMatch) {
  console.error('Could not parse additionalArticles array')
  process.exit(1)
}

const newEntries = arrMatch[1].trim()
console.log(`Extracted ${(newEntries.match(/id:/g) || []).length} entries to merge`)

// Find the closing of the articles array in articles.ts
// The array ends with: `  },\n]` (last article closing + array bracket)
const insertPoint = articlesContent.lastIndexOf('\n]')
if (insertPoint === -1) {
  console.error('Could not find closing ] in articles.ts')
  process.exit(1)
}

// Insert new entries before the closing ]
const merged = 
  articlesContent.slice(0, insertPoint) + 
  '\n\n  // AUTO-MERGED: 47 additional articles from 09_网站母站/网站文章/\n' +
  newEntries + '\n' +
  articlesContent.slice(insertPoint)

fs.writeFileSync(articlesPath, merged, 'utf-8')

console.log(`\n✓ 已将 ${(newEntries.match(/id:/g) || []).length} 篇文章注入 data/articles.ts`)
console.log(`  文件大小: ${(merged.length / 1024).toFixed(1)} KB`)
