# ZenoAIHome English Localization Guide

This is not a literal translation guide. It is the working standard for keeping the Chinese site and English edition aligned without turning the English site into stiff translated copy.

## 1. Brand Voice In English

ZenoAIHome's English voice is:

- Direct: say what you mean, skip the filler.
- Grounded: always connected to real renovation experience.
- Restrained: confident without sounding loud.
- Practical: useful before a homeowner signs, not abstract education.
- Anti-hype: especially when writing about AI, pricing, or renovation risk.

Think: a field-tested renovation practitioner helping a homeowner clarify the quote before signing. Not a marketer, not a lawyer, not a generic renovation blogger.

## 2. English Positioning

Core English positioning:

> Pre-signing renovation quote risk check for homeowners.

Core English promise:

> Before you sign a renovation contract, understand what the quote does not clearly say.

Core phrase for "先说清":

> Clarify before you sign.

Do not over-center AI in English. AI is an assisting layer for organizing information. The brand narrative is practical judgment before signing.

## 3. Translation Principles

### Never Do Literal Translation

Chinese and English have different rhetorical structures. A sentence that reads naturally in Chinese often sounds stiff in English when translated word for word.

Translate the job-to-be-done, not the sentence. If a Chinese section exists to reassure a nervous homeowner, the English section should reassure in natural English rather than mirror the Chinese structure.

### Transcreation Over Translation

Every English page should:

1. Preserve the core business intent of the Chinese original.
2. Restructure paragraphs for English reading rhythm.
3. Remove Chinese-only platform context unless it matters.
4. Use natural English product language.
5. Cut repetition that works in Chinese but feels redundant in English.

Tone calibration:

| Chinese tone | English equivalent |
|---|---|
| 朴素真实 | Understated, matter-of-fact |
| 克制表达 | Restrained, let the reader connect the dots |
| 经验之谈 | Practitioner credibility, "I've seen this play out" |
| 不贩卖焦虑 | Describe practical risk clearly; never manufacture urgency |

## 4. Core Terminology

| 中文 | English | Notes |
|---|---|---|
| 装修 | renovation / home renovation | Never "decoration" |
| 业主 | homeowner | Avoid "owner" unless context is legal ownership |
| 装修报价 / 报价单 | renovation quote / contractor estimate | "Quote" is the default UI term |
| 报价初筛 | Quote Risk Check | Use as product name |
| 签约前 | before signing / pre-signing | Use "pre-signing" in headings |
| 先说清 | clarify before you sign | Do not force "boundary" everywhere |
| 边界不清 | unclear scope | Usually better than "unclear boundary" |
| 漏项 | missing scope items | |
| 模糊项 | unclear wording / unclear scope | Context-dependent |
| 增项 | change orders / add-on costs | "Scope creep" only in explanatory prose |
| 按实结算 | actual settlement / billed by actual quantity | Explain it; direct phrase is not enough |
| 暂估 | temporary estimate / provisional estimate | |
| 主材 / 辅材 | main materials / accessory materials | Use only when needed |
| 材料品牌型号 | material brand and model | |
| 工艺标准 | workmanship standard / process standard | "Workmanship" often reads more natural |
| 付款节点 | payment milestones | |
| 口头承诺 | verbal promises | |
| 验收标准 | acceptance standards / inspection standards | |
| 质保 | warranty scope | |
| 人工快审 | expert quote review | Avoid "manual audit" |
| 签约前深度判断 | deep pre-signing review | |
| 装修公司 / 施工方 | contractor / renovation contractor | |
| 工地 | renovation site / job site | Residential context |
| 水电 | plumbing and electrical | |
| 隐蔽工程 | concealed works | |
| 交底 | pre-construction walkthrough | |
| 收口 | finishing details / edge finishing | |
| 成品保护 | finished-product protection | |

## 5. Terms To Avoid

| Avoid | Use Instead |
|---|---|
| decoration | renovation / home renovation |
| owner | homeowner |
| boundary clarification | scope clarification / clarify scope |
| real settlement | actual settlement / billed by actual quantity |
| manual audit | expert review |
| renovation encyclopedia | risk library / practical guide |
| reduce anxiety | help you see the risk clearly |
| can sign or not | whether this quote is ready to sign |

## 6. Structural Guidelines

### Headings

- English headings should be concise and active.
- Prefer job language: "Before you sign..." / "What the quote does not clearly say".
- Avoid poetic slogans unless the page already has clear functional context.

### Paragraphs

- Break long Chinese paragraphs into shorter English paragraphs.
- Lead with the point, then support it.
- Remove repetition that feels natural in Chinese but heavy in English.

### Lists

- English readers scan product pages. Use clear bullet lists for what is checked, what is delivered, and what is not included.

### Cultural Adaptation

- WeChat, Xiaohongshu, and local payment details can be kept on Chinese pages.
- English pages should describe the service plainly and link back to Chinese pages for the full transaction flow.
- Keep RMB pricing where the service is China-based; do not invent USD equivalents.

## 7. Chinese-English Sync Rules

Chinese remains the source of truth for the full product and data library. English is a selective edition until full localization is intentionally funded.

When the Chinese site changes:

1. If the change affects positioning, update `/en`, `/en/tools`, `/en/services`, and this guide.
2. If a new Chinese data asset is added, do not machine-translate it automatically.
3. Add English fields only when the English copy has been transcreated:
   - `nameEn`
   - `oneLineEn`
   - `plainExplanationEn`
   - `preSigningQuestionsEn`
   - `contractSuggestionEn`
4. English pages should hide untranslated data or summarize it, not expose raw machine translation.
5. Keep English `noindex` until the English edition has enough original/localized value to stand on its own.
6. Canonical URLs should point to the same-language page. Hreflang should connect Chinese and English equivalents where available.

## 8. SEO For English Pages

- Every English page needs its own title and meta description.
- Use natural keyword variations: "renovation quote", "contractor estimate", "before signing", "payment milestones".
- Avoid thin translated pages. A selective noindex English edition is better than many weak translated pages.
- Alt text for images should be in English on English pages.
