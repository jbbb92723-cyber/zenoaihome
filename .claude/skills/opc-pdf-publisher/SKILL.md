---
name: "opc-pdf-publisher"
description: "Generate brand-consistent OPC PDFs from Markdown. Dual-engine: Chrome+Paged.js or weasyprint fallback. For 30+ city managers."
status: proposal
version: "v1"
date: "2026-07-27T03:28:13.868Z"
---

# OPC PDF Publisher

Markdown → brand-consistent PDF with one command.

## Who is this for

30+ OPC city managers (城市主理人) and OPC核心团队。They write content in Markdown. This skill turns it into a professional, visually consistent PDF using the OPC brand system.

## Quick start

```bash
# 1. Create a project directory with meta.json + markdown files
# 2. Run:
python3 scripts/build_pdf.py my-report/ --output my-report.pdf
```

No Python knowledge needed. Only meta.json needs editing.

## Project directory structure

```
my-report/
  meta.json              ← REQUIRED: document config
  01_开头.md             ← Markdown chapters (sorted by filename)
  02_正文.md
  03_结尾.md
  cover.jpg              ← Optional: custom cover image
  images/                ← Optional: inline images referenced in markdown
    chart.png
```

## meta.json reference

```json
{
  "type": "report",
  "brand": "opc",
  "title": "Document Title",
  "subtitle": "Subtitle or date range",
  "author": "Author Name",
  "author_title": "City Manager / Role",
  "date": "2026-07-27",
  "chapters": ["01_动态.md", "02_数据.md"],
  "cover": {
    "style": "default",
    "image": ""
  },
  "page_size": "A4",
  "toc": true,
  "watermark": "",
  "footer_text": "OPC圈 © 2026"
}
```

### Field descriptions

- **type** (required): `report` | `guide` | `proposal` | `simple`. Controls cover style + chapter heading design.
  - `report`: Full cover page with title/author/date. Chapters have numbered headings.
  - `guide`: Cover with city photo. Designed for city guides.
  - `proposal`: Clean business document style. Cover with logo + receiver info.
  - `simple`: Minimal. No cover page. Title-only header. For quick exports.
- **brand** (optional): `opc` (default) | `heibaokc`. Controls color palette and logo.
- **chapters** (optional): Explicit chapter order. If omitted, all `*.md` files in directory sorted alphabetically.
- **cover.style** (optional): `default` | `image` | `minimal`. When `image`, use `cover.image` path.
- **cover.image** (optional): Path to cover image (relative to project dir). Recommended 800×500px.
- **toc** (optional): Include auto-generated table of contents. Default `true` for report/guide.
- **watermark** (optional): Diagonal watermark text on every page. E.g., "内部资料".
- **footer_text** (optional): Custom footer. Default "OPC圈 © 2026".

### Markdown syntax supported

- Headings (`#` through `####`) — all chapter/section headings
- Bold, italic, inline code
- Ordered and unordered lists
- Tables (GFM)
- Blockquotes
- Code blocks (fenced)
- Horizontal rules (`---`) — forces page break
- Images: `![alt](images/filename.png)` — image paths relative to project dir
- Links: `[text](url)`

## Brand system

### opc (default)

| Element | Value |
|---------|-------|
| Primary color | `#FC723F` (OPC Orange) |
| Background | `#FFFBF5` (Warm Cream) |
| Text | `#2D2D2D` |
| Secondary text | `#8C7B6E` (Warm Gray) |
| Accent | `#6B4C35` (Brown) |
| Font (headings) | PingFang SC, 900 weight |
| Font (body) | PingFang SC, 400 weight |
| Code font | SF Mono, 400 weight |
| Logo | `assets/logo-wordmark.png` |
| Cover element | Three-layer mountain SVG curves |

### heibaokc

| Element | Value |
|---------|-------|
| Primary color | `#1A1A1A` (Black) |
| Accent | `#D4AF37` (Gold) |
| Background | `#FFFFFF` |
| Font | PingFang SC |
| Logo | `assets/heibaokc-logo.png` |

### Adding new brands

Edit `references/brand-specs.json` to add brand definitions. Brand config overrides any default value.

## Document type layouts

### Report

- Full cover page: logo + title (36pt) + author + date
- Auto TOC on page 2
- Chapters start on new page
- H1: 24pt, orange underline
- H2: 18pt
- Tables: striped rows, orange header

### Guide

- Cover with optional city photo
- Chapters continuous (no forced page breaks)
- Special "community card" table style
- Footer with page numbers

### Proposal

- Cover: logo + title + recipient info
- Compact layout, minimal whitespace
- H1: 20pt, no underline
- Tables: clean lines, no fill

### Simple

- No cover page
- Title as H1 at top
- Continuous flow, minimal styling
- Suitable for 1-3 page quick exports

## PDF generation engine

### Engine 1: Chrome + Paged.js (default, best quality)

Requirements: Google Chrome installed (standard on macOS/Windows).

What happens:
1. Markdown → HTML with Paged.js CSS for pagination
2. Open in Chrome headless with `--virtual-time-budget=30000`
3. Paged.js renders: page numbers, running headers, TOC, float elements
4. Chrome `--print-to-pdf` captures final rendered output

Why `--virtual-time-budget`: Paged.js needs JavaScript execution time to layout pages. Without this flag, PDF captures at 2 pages (only cover+TOC before JS finishes).

Fallback triggers:
- Chrome not installed
- Chrome launch fails (3 retries)
- `--print-to-pdf` returns empty/corrupted output

### Engine 2: weasyprint (fallback, zero external deps)

Requirements: none (pure Python).

What happens:
1. Markdown → HTML with CSS `@page` rules for basic pagination
2. weasyprint renders directly
3. Output: clean but simpler PDF (no Paged.js running headers/footers, no dynamic TOC)

Limitations vs Chrome+Paged.js:
- No running headers/footers
- No dynamic TOC
- Table of contents becomes a static list
- Page breaks are less precise
- Overall: functional, not beautiful

## Error recovery

| Problem | Action |
|---------|--------|
| meta.json missing | Show help + required fields |
| Markdown file missing | Skip, warn, continue |
| Image not found | Placeholder rectangle with filename |
| Chrome not found | Auto-switch to weasyprint with message |
| Chrome crashes | Retry 3x, then fallback to weasyprint |
| weasyprint fails | Output HTML file + instructions to print manually |
| Output path unwritable | Show error with permission check |

Output message always tells user which engine was used and why:
- `✅ PDF generated with Chrome+Paged.js: 16 pages, 1.9 MB`
- `⚠️ PDF generated with weasyprint (Chrome not available): 12 pages, 800 KB`
- `❌ PDF generation failed. HTML saved at path/to/guide.html — open in Chrome and Cmd+P to print.`

## Resources

### scripts/build_pdf.py

Main entry point. Reads meta.json, converts markdown chapters to HTML, applies brand template, generates PDF via dual-engine.

### references/style-guide.md

Full visual specification: colors, typography, spacing, cover layouts, table styles, image handling.

### references/brand-specs.json

Brand configuration for opc, heibaokc, and future brands. Add new brands here.

### assets/

- `logo-wordmark.png` — OPC brand logo (orange wordmark, transparent bg)
- `heibaokc-logo.png` — Heibao KC brand logo (if needed)

## Usage examples

### City manager monthly report

```bash
mkdir nanning-july
cat > nanning-july/meta.json << 'EOF'
{
  "type": "report",
  "brand": "opc",
  "title": "南宁 OPC 社区 7 月月报",
  "author": "陈国赞",
  "author_title": "南宁城市主理人",
  "date": "2026-07-27",
  "toc": true,
  "watermark": "内部资料"
}
EOF
# Write markdown chapters...
python3 scripts/build_pdf.py nanning-july/ --output nanning-july-report.pdf
```

### Community introduction one-pager

```bash
cat > meta.json << 'EOF'
{
  "type": "simple",
  "brand": "opc",
  "title": "东盟人工智能概念验证中心 · 社区介绍",
  "author": "OPC圈编辑部",
  "date": "2026-07-27",
  "toc": false
}
EOF
python3 scripts/build_pdf.py . --output community-intro.pdf
```

### Multi-city guide

```bash
cat > meta.json << 'EOF'
{
  "type": "guide",
  "brand": "opc",
  "title": "南宁 OPC 创业全指南",
  "subtitle": "从入驻到变现的完整路径 · 2026",
  "author": "OPC圈",
  "date": "2026-07",
  "cover": {
    "style": "image",
    "image": "nanning-skyline.jpg"
  }
}
EOF
python3 scripts/build_pdf.py . --output nanning-guide.pdf
```

## Development notes

- Python 3.9+ required (standard on macOS)
- External deps: `markdown` (Python-Markdown), `beautifulsoup4`, `requests`. Installed automatically on first run.
- weasyprint: optional. `pip3 install weasyprint`
- Chrome: not bundled. Uses system Chrome at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.
- Windows Chrome path auto-detected via registry or `%LOCALAPPDATA%`.
- Test suite: `scripts/test_build.py` — tests all 4 document types with sample markdown.
