#!/usr/bin/env node
/**
 * replace-article-content.mjs
 *
 * Purpose: Replace the content of 3 core articles in articles.ts with new 母文 versions.
 * Reads from 06_内容资产单元/.../03_重构母文.md and replaces the corresponding
 * content: ` ... ` template literal inside articles.ts.
 *
 * Usage: node scripts/replace-article-content.mjs
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const ARTICLES_TS = resolve(ROOT, 'data/content/articles.ts')

// Map of article slug → relative path to new 母文
const REPLACEMENTS = {
  'baojia-dan-zhenzheng-zenme-kan': {
    slug: 'baojia-dan-zhenzheng-zenme-kan',
    母文Path: resolve(ROOT, '../赞诺内容资产库/06_内容资产单元/2026-报价单真正该怎么看/03_重构母文.md'),
  },
  'zhuangxiu-yusuan-weishenme-zongchao': {
    slug: 'zhuangxiu-yusuan-weishenme-zongchao',
    母文Path: resolve(ROOT, '../赞诺内容资产库/06_内容资产单元/2026-装修预算为什么总超/03_重构母文.md'),
  },
  'article-01-03': {
    slug: 'article-01-03',
    母文Path: resolve(ROOT, '../赞诺内容资产库/06_内容资产单元/2026-实住派装修究竟反对什么/03_重构母文.md'),
  },
}

function extractBody(markdown) {
  // Remove the YAML frontmatter header (# header + metadata block + ---)
  // Find the first ## heading which marks the start of 母文正文
  const bodyStart = markdown.indexOf('## 母文正文')
  if (bodyStart === -1) return markdown

  let body = markdown.slice(bodyStart + '## 母文正文'.length)

  // Remove internal comment sections (## 核心金句, ## 内部注释)
  const internalStart = body.indexOf('\n## 核心金句')
  if (internalStart !== -1) {
    body = body.slice(0, internalStart)
  }

  // Clean up leading/trailing whitespace
  body = body.trim()

  // Escape backticks and template literal special chars for embedding in a TypeScript template literal
  body = body
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$')

  return body
}

function main() {
  console.log('Reading articles.ts...')
  let articlesSource = readFileSync(ARTICLES_TS, 'utf-8')

  for (const [slug, config] of Object.entries(REPLACEMENTS)) {
    console.log(`\nProcessing: ${slug}`)

    // Read the new 母文
    const 母文Raw = readFileSync(config.母文Path, 'utf-8')
    const newBody = extractBody(母文Raw)

    console.log(`  母文 body length: ${newBody.length} chars`)

    // Find the content field for this article in articles.ts
    // Pattern: slug: '<slug>', ... content: `...`,
    const slugPattern = new RegExp(
      `(slug:\\s*'${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}',[\\s\\S]*?)content:\\s*\`[\\s\\S]*?\`,\\s*\\n\\s*\\},`,
      'g'
    )

    const match = slugPattern.exec(articlesSource)
    if (!match) {
      console.error(`  ERROR: Could not find content field for slug '${slug}'`)
      continue
    }

    // Replace just the content body (between the backticks)
    const oldContent = match[0]
    const newContent = oldContent.replace(
      /(content:\s*`)[\s\S]*?(\`,\s*\n\s*\},)/,
      `$1${newBody}\n\n---\n\n$2`
    )

    articlesSource = articlesSource.replace(oldContent, newContent)
    console.log(`  ✅ Replaced ${slug}`)
  }

  // Write back
  writeFileSync(ARTICLES_TS, articlesSource, 'utf-8')
  console.log(`\n✅ Written to ${ARTICLES_TS}`)
  console.log('Run `npx tsc --noEmit` to verify.')
}

main()
