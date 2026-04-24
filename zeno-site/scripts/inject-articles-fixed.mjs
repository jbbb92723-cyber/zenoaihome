/**
 * 将 articles-additional.ts 的内容直接注入 articles.ts 的 articles 数组
 * 查找 articles 数组的正确结束位置（articles 数组的 ]，不是 categories 数组的 ] as const）
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

// Extract entries from additionalArticles array
const arrMatch = additionalContent.match(/export const additionalArticles[^=]*=\s*\[([\s\S]*)\]\s*$/)
if (!arrMatch) {
  console.error('Could not parse additionalArticles array')
  process.exit(1)
}

const newEntries = arrMatch[1].trim()
console.log(`Extracted ${(newEntries.match(/^\s+id:/gm) || []).length} entries to merge`)

// Find the END of the articles array specifically.
// The articles array is: `export const articles: Article[] = [`
// It ends with `]\n\nexport const categories`
// We need to find the `]` just before `\n\nexport const categories`

const categoriesIndex = articlesContent.indexOf('\nexport const categories')
if (categoriesIndex === -1) {
  console.error('Could not find categories export in articles.ts')
  process.exit(1)
}

// Find the last `]` before categories (this closes the articles array)
// Look backwards from categoriesIndex
let insertPoint = -1
for (let i = categoriesIndex - 1; i >= 0; i--) {
  if (articlesContent[i] === ']') {
    insertPoint = i
    break
  }
}

if (insertPoint === -1) {
  console.error('Could not find articles array closing bracket')
  process.exit(1)
}

console.log(`Found articles array closing ] at position ${insertPoint}`)
console.log(`Context: "${articlesContent.slice(Math.max(0, insertPoint - 20), insertPoint + 20).replace(/\n/g, '\\n')}"`)

// Verify this is the right position
const before = articlesContent.slice(insertPoint - 10, insertPoint)
console.log(`Before ]: "${before.replace(/\n/g, '\\n')}"`)

// Insert new entries before the closing ]
const merged = 
  articlesContent.slice(0, insertPoint) + 
  '\n\n  // AUTO-MERGED: 47 additional articles from 09_网站母站/网站文章/\n' +
  newEntries + '\n' +
  articlesContent.slice(insertPoint)

fs.writeFileSync(articlesPath, merged, 'utf-8')

const count = (merged.match(/^\s+id: '/gm) || []).length
console.log(`\n✓ 已将新文章注入 data/articles.ts`)
console.log(`  总文章数: ${count}`)
console.log(`  文件大小: ${(merged.length / 1024).toFixed(1)} KB`)
