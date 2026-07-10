# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

This repository is a structured content system for local content assets.

The project stores raw content copies and converts them into reusable content units that can later be recombined into new topics, scripts, and articles.

## Read First

Before locating files, resolving conflicts, or deciding whether a source has already been processed, read `SOURCE_OF_TRUTH.md`.

## Core Rules

- Treat `01-原始素材区/` as immutable source copies
- Create structured outputs only under `02-内容单元库/`
- Update process tracking files under `03-处理状态/` when new sources are processed
- Follow the rules in `00-规则与索引/`

## Content Unit Types

Phase 1 supports only:

- 问题单元
- 概念单元
- 观点单元
- 案例单元
- 方案单元

Evidence is embedded inside viewpoint units or case units rather than stored as an independent type.

## Naming Rules

- Content unit file name: `ID_标题.md`
- Source IDs use the `SRC-*` pattern
- Content unit IDs use type prefixes such as `QST`、`CON`、`OPI`、`CAS`、`SOL`

## Website Sync Convention

Every article published to the website MUST have a `published_as` field in its YAML frontmatter:

```yaml
---
published_as: article-XX
---
```

Where `XX` is the corresponding article ID in `Zeno-Code/zeno-site/data/content/articles.ts`.

**To sync all marked articles to the website, run:**
```bash
node 07-脚本与工具/sync-to-website.js
```

**To preview changes without writing:**
```bash
node 07-脚本与工具/sync-to-website.js --dry-run
```

**When creating a new article that will go to the website:**
1. Write the article in `06-选题装配/`
2. Assign a new article ID or map to an existing one
3. Add `published_as: article-XX` to the frontmatter
4. Run the sync script

**Sync behavior:**
- External content files (IDs 54+): Overwrites `article-XX-content.ts`
- Previously inline articles (IDs 1-53): Migrates to external `article-XX-content.ts` + updates import in `articles.ts`
- `[[wikilink]]` references are converted to plain text
- Knowledge card reference blocks (`> **本文调用的知识卡片**`) are preserved
