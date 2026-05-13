# LLM Wiki Schema

## Domain

赞诺的 LLM Wiki 用来编译外部知识、视频、文章、工具方法和行业资料，服务于 ZenoAIHome 的装修判断力、内容资产系统、AI 工作流、SEO/GEO、网站母站建设。

它不是网站发布区，也不是公众号草稿区。它是资料室和知识编译层。

## Conventions

- Wiki 路径：`G:/Zenoaihome.com/赞诺内容资产系统/10_LLM_Wiki`
- 文件名：英文/拼音小写，用 `-` 连接；必要时可用中文标题，但页面 slug 仍建议英文/拼音。
- Raw sources 放在 `raw/`，原则上只新增，不修改。
- 结构化知识页放在 `entities/`、`concepts/`、`comparisons/`、`queries/`。
- 每个结构化页面必须有 YAML frontmatter。
- 每个结构化页面至少有 2 个 `[[wikilinks]]`，除非当前 wiki 还处于起步阶段。
- 每次新增、更新、归档，都要更新 `index.md` 和 `log.md`。
- 不直接把 `10_LLM_Wiki` 内容同步到网站。
- 若要发布，必须经过：`10_LLM_Wiki → 04_内容资产单元 → 09_网站母站 → zeno-site`。

## Frontmatter

```yaml
---
title: Page Title
created: YYYY-MM-DD
updated: YYYY-MM-DD
type: entity | concept | comparison | query | summary
tags: [from taxonomy below]
sources: [raw/videos/example.md]
confidence: high | medium | low
contested: false
---
```

## Raw Source Frontmatter

```yaml
---
source_url: https://example.com
ingested: YYYY-MM-DD
sha256: <body-sha256>
type: article | video | transcript | paper | paste
---
```

## Tag Taxonomy

### ZenoAIHome 主轴
- renovation-risk
- quote-risk
- living-judgment
- real-living
- aesthetics
- human-judgment
- long-termism

### 内容系统
- content-system
- content-production
- brand-positioning
- platform-writing
- xiaohongshu
- wechat-official
- video-content

### AI 工作流
- ai-workflow
- hermes
- obsidian
- llm-wiki
- mcp
- automation
- prompt-engineering

### 网站与搜索
- website
- seo
- geo
- llms-txt
- knowledge-base

### 来源类型
- video
- article
- paper
- tool
- case
- query

## Page Thresholds

Create a page when:
- 一个概念/工具会反复用于 ZenoAIHome 的内容、服务或工作流；
- 一个来源中有足够可复用的判断、方法或结构；
- 同一概念出现在 2 个以上来源；
- 用户明确要求沉淀为 wiki。

Do not create a page when:
- 只是一次性链接；
- 只有一句无上下文的观点；
- 明显不属于装修判断力、内容系统、AI 工作流、网站母站相关领域。

## Page Types

### entities/
人物、公司、工具、平台。

### concepts/
长期复用的概念、方法、框架。

### comparisons/
对比分析，例如 Obsidian vs Notion、RAG vs LLM Wiki。

### queries/
值得保留的问答、研究结论、决策备忘。

## Update Policy

当新信息和旧信息冲突：
1. 保留两种说法；
2. 标注来源和日期；
3. frontmatter 设置 `contested: true`；
4. 在 `log.md` 标记需要 Zeno 判断。

## Publishing Boundary

LLM Wiki 只能影响内容生产，不能直接进入网站发布。

```text
raw source
  → 10_LLM_Wiki 编译
  → 04_内容资产单元 转成赞诺表达
  → 09_网站母站 审核
  → zeno-site 发布
```
