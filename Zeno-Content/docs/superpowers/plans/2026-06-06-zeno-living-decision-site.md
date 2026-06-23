# Zeno Living Decision Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align ZenoAIHome.com around the new category: an AI living decision system for self-growth-oriented families, while keeping quote-risk review as the signing-stage conversion path.

**Architecture:** Keep the existing Next.js App Router structure and avoid creating new backend surfaces in this pass. Use `zeno-site/data/commercial-ladder.ts` as the single source of truth for the full conversion ladder, `zeno-site/data/services.ts` for service-level detail, and `zeno-site/app/services/page.tsx` for the public service IA.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, existing `CommercialLadder`, `ServiceCard`, `PageHero`, `StructuredData`, and service request form components.

---

## File Structure

- Modify `zeno-site/data/commercial-ladder.ts`
  - Update the source-of-truth comment from “签约前报价风险判断” to “AI 居住判断 + 签约前报价风险判断”.
  - Insert the paid core product `AI 居住需求洞察报告` at `¥399-599`, linked to `/services#living-insight-beta`.
  - Keep quote-risk services after the core living report so the ladder becomes: free diagnosis -> paid living report -> quote tool -> quote review services.
  - Ensure `paidLadder` and `serviceLadder` include the new living report without hardcoding duplicate prices elsewhere.

- Modify `zeno-site/data/services.ts`
  - Rename `living-insight-beta` from Beta language to a clear paid product: `AI 居住需求洞察报告`.
  - Update its price to `399-599 元 / 份`.
  - Add concrete `checks` so the service card explains what gets reviewed: household rhythm, space priority, aesthetic preference, budget tradeoffs, next-step order.
  - Keep boundaries explicit: not design drawings, not construction quote, not final decision.

- Modify `zeno-site/app/services/page.tsx`
  - Update metadata from “签约前风险判断” to “AI 居住判断服务价格”.
  - Include `living-insight-beta` in rendered services before quote services.
  - Add related articles/tools for the living insight service.
  - Rewrite hero and service page sections around two tracks:
    - Track A: still early -> AI diagnosis -> paid living report.
    - Track B: already has quote/contract -> free quote check -> paid quote-risk review.
  - Update FAQ so it explains why quote-risk remains, but is no longer the only main line.

## Implementation Tasks

### Task 1: Commercial Ladder Repositioning

**Files:**
- Modify: `zeno-site/data/commercial-ladder.ts`

- [x] **Step 1: Replace the opening source-of-truth comment**

Use this meaning in the file header:

```ts
/**
 * 全站唯一的“AI 居住判断 + 签约前报价风险判断”商业梯子。
 * 主路径：AI 居住诊断 -> ¥399-599 居住需求洞察报告 -> 报价初筛 -> ¥99/¥299/¥699 签约前风险判断。
 */
```

- [x] **Step 2: Insert the core paid living report after the free diagnosis**

Add this rung directly after `AI 居住诊断`:

```ts
{
  tier: 'paid-mid',
  price: '¥399-599',
  priceNumeric: 399,
  title: 'AI 居住需求洞察报告',
  whoFor: '已经开始认真规划，但生活方式和空间优先级还没说清的人',
  delivers: '输出居住类型、空间优先级、审美偏好、预算取舍和下一步判断清单',
  href: '/services#living-insight-beta',
  cta: '看洞察报告',
  source: 'service',
  badge: '核心产品',
},
```

- [x] **Step 3: Run type/build validation for changed data**

Run:

```bash
npm.cmd run lint
```

Expected: lint completes without TypeScript or ESLint errors caused by this file.

### Task 2: Core Service Detail

**Files:**
- Modify: `zeno-site/data/services.ts`

- [x] **Step 1: Update the `living-insight-beta` service copy**

Replace the current Beta-flavored content with this product-level intent:

```ts
title: 'AI 居住需求洞察报告',
tagline: '装修前，先把生活方式、空间优先级和预算取舍说清',
price: '399-599 元 / 份',
tag: '居住判断',
```

Use copy that says the report is for families who are still before final方案/签约 and need judgment, not merely style inspiration.

- [x] **Step 2: Add concrete `checks` to the service**

Add this field to `living-insight-beta`:

```ts
checks: [
  '家庭成员的一天如何在空间中发生',
  '动线、收纳、家务和家庭关系的冲突点',
  '灵感图背后的长期审美偏好',
  '预算应该优先投入哪些空间和体验',
  '下一步该先补方案、补报价还是补合同边界',
],
```

- [x] **Step 3: Keep the boundary sharp**

Ensure the boundary says:

```ts
boundary: '不是设计方案，不出施工图，不做装修报价，不替你决定最终风格和施工方。',
```

- [x] **Step 4: Re-run lint after service data edits**

Run:

```bash
npm.cmd run lint
```

Expected: lint completes without TypeScript or ESLint errors caused by service data.

### Task 3: Services Page Information Architecture

**Files:**
- Modify: `zeno-site/app/services/page.tsx`

- [x] **Step 1: Update metadata**

Use:

```ts
title: '服务价格 | AI 居住判断与签约前风险审查',
description: 'ZenoAIHome 服务价格页。先用 AI 居住诊断看清生活方式、空间秩序、审美偏好和预算取舍，再在临近签约时审查报价、合同和付款节点风险。',
```

- [x] **Step 2: Render living insight before quote services**

Change service slug lists to:

```ts
const coreServiceSlugs = ['living-insight-beta', 'quote-entry', 'quote-standard', 'quote-deep']
const quoteServiceSlugs = ['quote-entry', 'quote-standard', 'quote-deep']
```

Use `coreServices` for structured data, service request form, and detailed `ServiceCard` rendering.

- [x] **Step 3: Add related links for the living insight service**

Add:

```ts
'living-insight-beta': [
  { label: 'AI 居住诊断', href: '/living-diagnosis' },
  { label: '居住需求地图', href: '/resources/living-needs-map' },
  { label: '案例复盘', href: '/cases' },
],
```

- [x] **Step 4: Rewrite page hero and track cards**

Hero should communicate:

```tsx
<PageHero
  label="服务价格"
  title="先做居住判断，再决定怎么装、花多少、能不能签。"
  subtitle="ZenoAIHome 把装修前的服务分成两条路：还没想清生活方式时，先做居住需求洞察；已经拿到报价合同后，再做签约前风险判断。"
  note="免费诊断先帮你分流，不急着买服务。"
  size="content"
/>
```

Track cards should include:

```ts
[
  ['还没定方案', '先做 AI 居住诊断，再选择 399-599 元的居住需求洞察报告。', '/living-diagnosis', '开始诊断'],
  ['已经拿到报价', '先用免费报价初筛，把漏项、模糊项和增项口子找出来。', '/tools/quote-check', '做报价初筛'],
  ['快要签约', '按材料完整度选择 ¥99 初查、¥299 快审或 ¥699 深度判断。', '/services#quote-entry', '看风险服务'],
]
```

- [x] **Step 5: Update the main ladder section copy**

Replace “报价看不懂，先从这条路走。” with a living-decision framing:

```tsx
<h2 className="mb-3 text-lg font-semibold text-ink">这不是一串报价服务，而是一条装修前判断路径。</h2>
```

The paragraph should explain free diagnosis, paid report, free quote check, and three paid quote review tiers.

- [x] **Step 6: Update FAQ answers**

FAQ must answer:

```ts
[
  '为什么新增居住需求洞察报告？',
  '报价风险判断还保留吗？',
  '什么时候更适合先用工具，而不是直接找我？',
  'AI 会不会替我做最终决定？',
]
```

- [x] **Step 7: Run lint/build**

Run:

```bash
npm.cmd run lint
npm.cmd run build
```

Expected: both commands complete successfully.

### Task 4: QA Smoke Test

**Files:**
- No source edits unless QA finds a functional bug in changed pages.

Execution note: local Playwright/gstack browser tooling was unavailable, so QA was executed as a production-build HTTP smoke test plus content/API assertions. See `zeno-site/.gstack/qa-reports/qa-report-localhost-2026-06-06.md`.

- [x] **Step 1: Start local app**

Run:

```bash
npm.cmd run dev
```

Expected: Next.js serves the app on `http://localhost:3000` or the next available port.

- [x] **Step 2: Smoke-test affected routes**

Visit:

```text
/
/living-diagnosis
/services
/tools/quote-check
/blog
```

Expected:
- Pages load without 500 errors.
- `/services` shows the new `AI 居住需求洞察报告` before quote-risk services.
- Homepage ladder contains `AI 居住需求洞察报告`.
- `/living-diagnosis` form can select all answers and submit; if database persistence fails locally, the result still renders via fallback response.

- [x] **Step 3: Fix high-severity issues only**

If a changed route has a 500, broken import, or non-submitting core form, fix it in the smallest relevant source file and re-run:

```bash
npm.cmd run lint
npm.cmd run build
```

Expected: validation passes after any fix.

## Self-Review

- Spec coverage: The plan implements the new category in the public conversion path, keeps quote-risk as the signing-stage path, and avoids backend overbuild in this pass.
- Placeholder scan: No `TBD`, `TODO`, or undefined task references are left in the task list.
- Type consistency: `coreServices`, `quoteServiceSlugs`, `commercialLadder`, `serviceLadder`, and `Service.checks` all use existing local types and components.
