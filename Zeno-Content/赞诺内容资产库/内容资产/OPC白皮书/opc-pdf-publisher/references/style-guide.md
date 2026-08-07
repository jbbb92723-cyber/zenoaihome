# OPC PDF Publisher — Visual Style Guide

This guide documents the visual standards used by `build_pdf.py`. All generated PDFs follow these rules.

> **Design philosophy:** Magazine-editorial, not corporate-document. Serif headlines, cream-toned palette, deliberate contrast between tight/kerned type and open/airy labels.

---

## 1. Color Palette

### OPC Brand (default)

| Role | Hex | Usage |
|------|-----|-------|
| **Primary Orange** | `#FC723F` | Heading underlines, table headers, links, in-copy accent |
| **Primary Dark** | `#E05A2D` | Hover states (web only) |
| **Background Cream** | `#FFFBF5` | Page background |
| **Surface** | `#F2E8D9` | Callout boxes, blockquote background |
| **Highlight BG** | `#F7F3EC` | `highlight-box` component background |
| **Text** | `#2D2D2D` | Body text — NOT pure black |
| **Text Secondary** | `#8C7B6E` | Captions, metadata, dates, footer |
| **Accent Brown** | `#6B4C35` | Decorative elements, highlight-box text |
| **Line** | `#E8DDD0` | Table borders, horizontal rules |
| **Table Header** | `#FC723F` | Table header background |
| **Table Stripe** | `#FFF7F0` | Alternating table row background |

### Heibao KC Brand

| Role | Hex | Usage |
|------|-----|-------|
| **Primary Black** | `#1A1A1A` | Cover bar, heading text, table headers |
| **Accent Gold** | `#D4AF37` | Decorative line, emphasis, kpi numbers |
| **Background** | `#FFFFFF` | Page background |
| **Surface** | `#F5F5F5` | Blockquote, code block background |
| **Text** | `#1A1A1A` | Body text |
| **Text Secondary** | `#666666` | Captions, metadata |
| **Line** | `#E0E0E0` | Table borders, rules |

### Design rule

All "ink" colors are slightly warm — never pure `#000` (too sterile) or pure `#FFF` (too clinical). Backgrounds use cream/warm tones. This creates a tactile, print-publication feel.

---

## 2. Typography

### Font Stack

```
Heading:  Noto Serif SC → PingFang SC → Noto Sans SC → serif
Body:     Noto Sans SC → PingFang SC → sans-serif
Code:     SF Mono → Cascadia Code → monospace
KPI:      Space Mono → SF Mono → monospace
Tagline:  EB Garamond → Noto Serif SC → serif
```

### Why Serif headlines?

Serif headings (Noto Serif SC) evoke traditional publishing — reports, journals, white papers. Sans-serif body text (Noto Sans SC) keeps readability. The serif/sans contrast is a classic editorial technique that instantly elevates perceived quality.

### Size Scale

| Element | Size | Weight | Line Height | Letter Spacing | Notes |
|---------|------|--------|-------------|----------------|-------|
| Cover title | 48pt | 900 | 1.08 | -0.03em | Serif, tight |
| Cover subtitle | 18pt | 800 | 1.3 | normal | |
| Cover eyebrow | 11pt | 400 | 1.5 | 0.25em | Monospace, wide |
| Cover tagline | 20pt | 400 italic | 1.4 | normal | EB Garamond preferred |
| KPI number | 28pt | 700 | 1.2 | normal | Space Mono monospace |
| KPI label | 10pt | 400 | 1.4 | 0.15em | Uppercase |
| H1 | 24pt | 900 | 1.3 | -0.01em | Orange underline |
| H2 | 18pt | 700 | 1.3 | normal | |
| H3 | 14pt | 600 | 1.4 | 0.08em | Uppercase style (rust color) |
| Body | 10.5pt | 300 | 1.9 | normal | Light weight for elegance |
| Code | 9pt | 400 | 1.5 | normal | Monospace |
| Caption | 9pt | 400 | 1.4 | normal | Text secondary color |
| Table cell | 9.5pt | 400 | 1.4 | normal | |
| Table header | 9.5pt | 700 | 1.4 | normal | White on primary |
| Footer | 8pt | 400 | 1.3 | normal | Text secondary |

### Letter-spacing contrast principle

```
TIGHT ← ─ ─ ─ ─ ─ ─ ─ ─ ─ → LOOSE

Cover title (-0.03em)     H3 head (0.08em)     Eyebrow (0.25em)
                                                KPI label (0.15em)
```

The contrast between tightly-kerned display text and openly-spaced labels creates visual rhythm without relying on color alone.

### H1 Underline

```css
h1::after {
  content: "";
  display: block;
  width: 60px;
  height: 3px;
  background: var(--primary);
  margin-top: 8px;
}
```

---

## 3. Cover Page Layout

### The Gradient Glow System

Instead of static SVG mountains or image-based covers, we use layered CSS `radial-gradient` + `blur()` to create organic light pools. This is the Honghub technique — zero images, pure light.

```css
.cover::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(42% 34% at 27% 79%, var(--glow1) 0%, var(--glow1) 28%, transparent 58%),
    radial-gradient(34% 24% at 72% 82%, var(--glow2) 0%, var(--glow2) 22%, transparent 52%),
    radial-gradient(26% 26% at 85% 88%, var(--glow3) 0%, var(--glow3) 16%, transparent 44%);
  filter: blur(18px) saturate(96%);
  opacity: 0.92;
  pointer-events: none;
  z-index: 0;
}
```

Each brand defines 4 glow colors, layered at different positions and percentages. The angular asymmetry mimics natural light — never dead center.

### Vertical Accent Line

```css
.cover::after {
  content: '';
  position: absolute;
  top: 0;
  right: -40px;
  width: 3px;
  height: 100%;
  background: var(--accent-line);
  opacity: 0.82;
  z-index: 1;
}
```

A 3px vertical line on the right edge of the cover. Simple, elegant, reminiscent of book spines and magazine edges. OPC brand uses this; Heibao KC does not (prefers the top bar).

### Cover Layout (OPC Brand — No Top Bar)

```
┌──────────────────────────────────────────┐
│                                          │  ← gradient glow pools
│              [LOGO]                      │
│                                          │
│           Document Title                 │  ← 48pt, serif, -0.03em spacing
│             Subtitle                     │  ← 18pt, serif
│           Author · Date                  │  ← 12pt, secondary
│                                          │
│    ┌─────────────────────────┐           │
│    │  01  关键发现      1200+ 数据点     │  ← kpi-findings row
│    │  02  深度案例      200+ 深入剖析    │     (optional)
│    │  03  定性访谈      100h+ 对话       │
│    └─────────────────────────┘           │
│                                          │
│   出版机构 · 2026 Q1                     │  ← cover-meta
│                                          │█ ← 3px vertical accent line
└──────────────────────────────────────────┘
```

### Cover Layout (Heibao KC — Top Bar)

```
┌──────────────────────────────────────────┐
│ ████████████████████████████████████████ │ ← 4mm black bar
│                                          │
│              [LOGO]                      │
│           Document Title                 │
│             Subtitle                     │
│           Author · Date                  │
│                                          │
│    Gold accent line                      │
└──────────────────────────────────────────┘
```

---

## 4. New Components (v2 — 2026-07-27)

### 4a. KPI Findings Row (`kpi-findings`)

A horizontal row of key findings at the bottom of the cover or after an intro. **Markdown syntax:**

```html
<div class="kpi-findings">
  <div class="kpi-findings-label">核心发现</div>
  <div class="kpi-row-grid">
    <div class="kpi-item">
      <span class="kpi-num">01</span>
      <span class="kpi-text">样本规模 1500+ 问卷数据</span>
    </div>
    <div class="kpi-item">
      <span class="kpi-num">02</span>
      <span class="kpi-text">深度案例 200+ 深入剖析</span>
    </div>
    <div class="kpi-item">
      <span class="kpi-num">03</span>
      <span class="kpi-text">定性访谈 100h+ 田野调查</span>
    </div>
  </div>
</div>
```

Renders as: bordered section with 2-3 columns of numbered findings.

### 4b. KPI Number Row (`kpi-row`)

A row of large standalone numbers with small labels. For "key metrics" sections.

```html
<div class="kpi-row">
  <div class="kpi-stat">
    <span class="kpi-number">0.014</span>
    <span class="kpi-label">HACR 人机成本比</span>
  </div>
  <div class="kpi-stat">
    <span class="kpi-number">72×</span>
    <span class="kpi-label">人机效能杠杆率</span>
  </div>
  <div class="kpi-stat">
    <span class="kpi-number">$39/月</span>
    <span class="kpi-label">中位 AI 月支出</span>
  </div>
</div>
```

Renders as: 3 columns, large monospace numbers in primary color, small uppercase labels below.

### 4c. Highlight Box (`highlight-box`)

A prominent callout for important findings, methodology notes, or key takeaways.

```html
<div class="highlight-box">
  <p><strong>首次提出 · 2026年基准值</strong></p>
  <p>HACR — Human-AI Cost Ratio（人机成本比）以代码编写作为锚点，构建可纵向追踪的效能基准。</p>
</div>
```

Renders as: left-colored border, tinted background, warm text color. Distinct from blockquote (which is for quoted material).

---

## 5. Table Card Wrapper

Tables are now wrapped in a `.table-card` for visual elevation:

```html
<div class="table-card">
  <table>...</table>
</div>
```

```css
.table-card {
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(232,221,208,0.8);
  box-shadow: 0 12px 40px rgba(26,21,18,0.04);
  background: #FBF8F3;
  margin: 20px 0;
}
.table-card table {
  margin: 0;
}
.table-card thead th:first-child {
  border-radius: 8px 0 0 0;
}
.table-card thead th:last-child {
  border-radius: 0 8px 0 0;
}
```

The card gives tables a polished, "data panel" feel — not raw grids.

---

## 6. Page Layout

### Running Header

```
┌──────────────────────────────────────┐
│ Logo  Title · Year           Page N  │ ← 8pt, text_secondary
│ ──────────────────────────────────── │ ← Hairline rule
│                                      │
│         Content area                 │
│                                      │
│ ──────────────────────────────────── │ ← Hairline rule
│ OPC圈 © 2026                 Page N  │ ← Footer
└──────────────────────────────────────┘
```

### Max width

```css
.page { max-width: 820px; margin: 0 auto; }
```

Content is constrained to ~820px on A4 (2cm margins yield ~820px text area). This matches print best practices.

---

## 7. Table of Contents

Auto-generated when `toc: true` in meta.json.

```
目录

  1. 第一章标题 ............................. 3
  2. 第二章标题 ............................. 5
    2.1 子标题 .............................. 6
  3. 第三章标题 ............................. 9
```

- Title: "目录", 24pt, centered, orange underline
- Chapter entries: 12pt, bold, serif
- Section entries: 10.5pt, regular, indented
- Dot leaders between title and page number
- TOC appears on page 2 (after cover)

---

## 8. Tables (Standard, inside .table-card)

```css
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 9.5pt;
}
thead th {
  background: var(--primary);
  color: white;
  font-weight: 700;
  padding: 8px 12px;
  text-align: left;
}
tbody td {
  padding: 6px 12px;
  border-bottom: 1px solid var(--line);
  vertical-align: top;
}
tbody tr:nth-child(even) {
  background: var(--table-stripe);
}
```

---

## 9. Blockquotes

```css
blockquote {
  border-left: 4px solid var(--primary);
  margin: 12px 0;
  padding: 8px 16px;
  background: var(--surface);
  color: var(--accent);
}
```

Distinct from `.highlight-box` — blockquote is for quoted/cited material.

---

## 10. Code Blocks

```css
pre {
  background: #F8F8F8;
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 12px 16px;
  font-family: var(--code-family);
  font-size: 9pt;
  line-height: 1.5;
  overflow-x: auto;
}
code {
  font-family: var(--code-family);
  font-size: 9pt;
  background: var(--surface);
  padding: 1px 4px;
  border-radius: 2px;
}
```

---

## 11. Horizontal Rules → Page Breaks

`---` in Markdown forces a page break.

```css
hr {
  border: none;
  page-break-after: always;
  visibility: hidden;
}
```

---

## 12. Images

- Inline images: `![alt](path)` → max-width 100%, centered
- Cover image: `cover.image` in meta.json → full-width, contained
- Missing images: placeholder with filename

```css
img:not(.cover-logo):not(.running-logo):not(.cover-image) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 16px auto;
}
```

---

## 13. Lists

```css
ul, ol { padding-left: 1.5em; margin: 4px 0 12px; }
li { margin: 3px 0; line-height: 1.6; }
```

---

## 14. Watermark

When `watermark` is set in meta.json:

- Diagonal text (45° rotation), centered on every content page
- 12% opacity of secondary text color
- Not shown on cover page

```css
.watermark {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  font-size: 48pt;
  font-weight: 400;
  color: rgba(140, 123, 110, 0.12);
  pointer-events: none;
  z-index: -1;
}
```

---

## 15. Spacing

| Element | Margin Top | Margin Bottom |
|---------|------------|---------------|
| H1 | 32px | 16px |
| H2 | 24px | 12px |
| H3 | 16px | 8px |
| Paragraph | 0 | 8px |
| List | 4px | 12px |
| Table (.table-card) | 20px | 20px |
| Blockquote | 12px | 12px |
| Highlight box | 12px | 12px |
| KPI row | 16px | 16px |
| Code block | 12px | 12px |
| Image | 16px | 16px |

---

## 16. Brand Variants

To use Heibao KC brand, set `"brand": "heibaokc"` in meta.json. Colors, typography, and decorations all switch automatically.

To add a new brand, add a top-level key to `brand-specs.json`. All values are required (build script uses fallbacks for missing fields, but full specs ensure design consistency).
