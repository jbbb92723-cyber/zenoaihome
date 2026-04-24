/**
 * 合并 articles-new.ts 到 articles.ts
 * 过滤掉重复文章
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 要过滤的 slugs（已在 articles.ts 中存在的对应内容）
const DUPLICATE_SLUGS = [
  'jia-bu-shi-yangban-jian',   // already as 02-jia-bu-shi-yangban-jian
  'changqi-zhuyi-bushi-rennai', // already as 05-changqi-zhuyi-bushi-rennai
]

const newContent = fs.readFileSync(
  path.resolve(__dirname, '../data/articles-new.ts'),
  'utf-8'
)

// Extract the array content between [ and ]
const match = newContent.match(/export const additionalArticles = \[([\s\S]*)\]/)
if (!match) {
  console.error('Could not parse articles-new.ts')
  process.exit(1)
}

// Split into individual article blocks
// Each block starts with `  {` and ends with `  },`
let insideBlock = false
let braceDepth = 0
let currentBlock = []
const blocks = []

const lines = match[1].split('\n')
for (const line of lines) {
  const trimmed = line.trim()
  if (!insideBlock && trimmed === '{') {
    insideBlock = true
    braceDepth = 1
    currentBlock = [line]
  } else if (insideBlock) {
    currentBlock.push(line)
    for (const ch of line) {
      if (ch === '{') braceDepth++
      else if (ch === '}') braceDepth--
    }
    if (braceDepth === 0) {
      insideBlock = false
      blocks.push(currentBlock.join('\n'))
      currentBlock = []
    }
  }
}

console.log(`Total blocks parsed: ${blocks.length}`)

// Filter duplicates
const filteredBlocks = blocks.filter(block => {
  for (const slug of DUPLICATE_SLUGS) {
    if (block.includes(`slug: '${slug}'`)) {
      console.log(`FILTERED: ${slug}`)
      return false
    }
  }
  return true
})

console.log(`After filtering: ${filteredBlocks.length} articles`)

// Re-number IDs starting from 07
const renumberedBlocks = filteredBlocks.map((block, i) => {
  const newId = String(i + 7).padStart(2, '0')
  return block.replace(/id: '\d+',/, `id: '${newId}',`)
})

// Write clean articles-additional.ts
const additionalContent = `// AUTO-GENERATED - 49 additional articles from 09_网站母站/网站文章/
// DO NOT EDIT MANUALLY - regenerate with scripts/generate-articles.mjs

import type { Article } from './articles'

export const additionalArticles: Article[] = [
${renumberedBlocks.join('\n\n')}
]
`

fs.writeFileSync(
  path.resolve(__dirname, '../data/articles-additional.ts'),
  additionalContent,
  'utf-8'
)

console.log(`\n✓ 写入 data/articles-additional.ts (${filteredBlocks.length} articles)`)
