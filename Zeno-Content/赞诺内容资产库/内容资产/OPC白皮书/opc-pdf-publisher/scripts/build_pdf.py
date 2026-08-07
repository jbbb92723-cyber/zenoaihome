#!/usr/bin/env python3
"""
OPC PDF Publisher — Markdown → Brand-Consistent PDF

Usage:
  python3 build_pdf.py <project_dir> --output <output.pdf>
  python3 build_pdf.py nanning-july/ --output nanning-july-report.pdf

Project dir must contain meta.json + markdown chapters.
See SKILL.md for full meta.json reference.

Dual-engine:
  1. Chrome + Paged.js (default) — best typography, running headers, dynamic TOC
  2. weasyprint (fallback) — zero deps, simpler output

Author: OPC圈
"""

import os, sys, json, re, time, base64, subprocess, shutil, argparse, textwrap
from pathlib import Path
from datetime import datetime

# ── Constants ─────────────────────────────────────────────────
SKILL_DIR = Path(os.environ.get(
    "OPC_PDF_SKILL_DIR",
    os.path.expanduser("~/.openclaw/skills/opc-pdf-publisher")
))
ASSETS_DIR = SKILL_DIR / "assets"
BRAND_SPECS_PATH = SKILL_DIR / "references" / "brand-specs.json"
LOGO_NAME = "logo-wordmark.png"

# Chrome paths per platform
CHROME_PATHS = {
    "darwin": [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/Applications/Chromium.app/Contents/MacOS/Chromium",
    ],
    "linux": [
        "google-chrome", "google-chrome-stable", "chromium", "chromium-browser",
    ],
    "win32": [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    ],
}


# ── Helpers ───────────────────────────────────────────────────

def load_meta(project_dir):
    """Load and validate meta.json from project directory. Returns dict or exits."""
    meta_path = Path(project_dir) / "meta.json"
    if not meta_path.exists():
        print(f"❌ meta.json not found in {project_dir}")
        print("   Create a meta.json with at minimum: {\"type\": \"report\", \"title\": \"...\"}")
        print("   See SKILL.md for full reference.")
        sys.exit(1)

    meta = json.loads(meta_path.read_text(encoding="utf-8"))

    required = ["type", "title"]
    missing = [k for k in required if k not in meta]
    if missing:
        print(f"❌ meta.json missing required fields: {', '.join(missing)}")
        sys.exit(1)

    valid_types = ["report", "guide", "proposal", "simple"]
    if meta["type"] not in valid_types:
        print(f"❌ Unknown type '{meta['type']}'. Must be one of: {', '.join(valid_types)}")
        sys.exit(1)

    # Defaults
    meta.setdefault("brand", "opc")
    meta.setdefault("subtitle", "")
    meta.setdefault("author", "")
    meta.setdefault("author_title", "")
    meta.setdefault("date", "")
    meta.setdefault("chapters", [])
    meta.setdefault("cover", {"style": "default", "image": ""})
    meta.setdefault("page_size", "A4")
    meta.setdefault("toc", meta["type"] in ("report", "guide"))
    meta.setdefault("watermark", "")
    meta.setdefault("footer_text", "OPC圈 © 2026")

    # Resolve chapters: explicit list or auto-discover *.md files
    if not meta["chapters"]:
        md_files = sorted(
            f for f in os.listdir(project_dir)
            if f.endswith(".md") and f != "meta.json"
        )
        meta["chapters"] = md_files

    return meta


def load_brand_specs():
    """Load brand specifications. Normalize flat JSON into nested dict structure."""
    try:
        raw = json.loads(BRAND_SPECS_PATH.read_text(encoding="utf-8"))
        return raw
    except Exception:
        # Built-in fallback
        return {
            "opc": {
                "name": "OPC圈",
                "colors": {
                    "primary": "#FC723F", "primary_dark": "#E05A2D",
                    "background": "#FFFBF5", "surface": "#F2E8D9",
                    "text": "#2D2D2D", "text_secondary": "#8C7B6E",
                    "accent": "#6B4C35", "line": "#E8DDD0",
                    "table_header": "#FC723F", "table_stripe": "#FFF7F0",
                },
                "typography": {
                    "heading_family": "PingFang SC, sans-serif",
                    "body_family": "PingFang SC, sans-serif",
                    "code_family": "SF Mono, monospace",
                    "sizes": {
                        "cover_title": "36pt", "cover_subtitle": "18pt",
                        "h1": "24pt", "h2": "18pt", "h3": "14pt",
                        "body": "10.5pt", "code": "9pt", "caption": "9pt",
                    },
                },
                "logo": f"assets/{LOGO_NAME}", "logo_height_cm": "1.2",
                "cover": {
                    "top_bar_height": "2mm", "top_bar_color": "#FC723F",
                    "background": "#FFFBF5", "decoration": "mountain_svg",
                },
                "page": {
                    "running_header": True,
                    "running_header_text": "OPC圈 © {year}",
                },
            }
        }


def find_chrome():
    """Find Chrome executable. Returns path or None."""
    system = sys.platform
    # Check CHROME_PATH env var first
    env_path = os.environ.get("CHROME_PATH")
    if env_path and Path(env_path).exists():
        return env_path
    # Check known paths
    for path in CHROME_PATHS.get(system, []):
        if shutil.which(path) or Path(path).exists():
            return path
    # Try which
    for name in ["google-chrome", "chrome", "chromium", "chromium-browser"]:
        found = shutil.which(name)
        if found:
            return found
    return None


def resolve_chapter_paths(project_dir, chapters):
    """Return list of absolute paths to chapter markdown files."""
    base = Path(project_dir)
    paths = []
    for ch in chapters:
        p = base / ch
        if p.exists():
            paths.append(p)
        else:
            print(f"  ⚠ Skipping missing chapter: {ch}")
    return paths


def logo_to_data_uri(brand_spec):
    """Convert brand logo to base64 data URI. Returns '' on failure."""
    logo_rel = brand_spec.get("logo", "")
    if not logo_rel:
        return ""
    logo_path = SKILL_DIR / logo_rel
    if not logo_path.exists():
        return ""
    ext = logo_path.suffix.lower()
    mime_map = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml"}
    mime = mime_map.get(ext, "image/png")
    data = base64.b64encode(logo_path.read_bytes()).decode()
    return f"data:{mime};base64,{data}"


# ── Markdown → HTML ──────────────────────────────────────────

def _hex_to_rgb(hex_color):
    """Convert #RRGGBB to 'R, G, B' string for CSS rgba()."""
    h = hex_color.lstrip('#')
    if len(h) == 3:
        h = ''.join(c * 2 for c in h)
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    return f"{r}, {g}, {b}"


def _parse_custom_blocks(md_text):
    """Pre-process custom ::: blocks before Markdown rendering.

    Supported syntax:

    ::: section-header 01 | 章节标题 | 副标题说明
    ::: pull-quote | 引用文字 | — 来源姓名
    ::: stat-wall | 数字1 | 说明1 || 数字2 | 说明2 || ...
    ::: two-col
    **左栏标题**\n内容
    ---
    **右栏标题**\n内容
    :::
    ::: progress | 项目名称 | 75
    ::: eyebrow | 标签文字
    """
    import re

    lines = md_text.split('\n')
    out = []
    i = 0
    while i < len(lines):
        line = lines[i]

        # section-header: ::: section-header 01 | 标题 | 副标题
        m = re.match(r'^:::[ \t]+section-header[ \t]+([^|]+)\|([^|]+)(?:\|(.*))?$', line.strip())
        if m:
            num   = m.group(1).strip()
            title = m.group(2).strip()
            sub   = (m.group(3) or '').strip()
            html  = (
                f'<div class="section-header">'
                f'<span class="sh-eyebrow">Chapter {num}</span>'
                f'<div class="sh-title">{title}</div>'
            )
            if sub:
                html += f'<div class="sh-subtitle">{sub}</div>'
            html += '</div>'
            out.append(html)
            i += 1
            continue

        # pull-quote: ::: pull-quote | 文字 | 来源
        m = re.match(r'^:::[ \t]+pull-quote[ \t]+\|(.+?)(?:\|(.*))?$', line.strip())
        if m:
            text   = m.group(1).strip()
            source = (m.group(2) or '').strip()
            html   = (
                f'<div class="pull-quote">'
                f'<div class="pq-text">{text}</div>'
            )
            if source:
                html += f'<div class="pq-source">{source}</div>'
            html += '</div>'
            out.append(html)
            i += 1
            continue

        # stat-wall: ::: stat-wall | 3.4亿 | 注册用户 || 120+ | 城市 || ...
        m = re.match(r'^:::[ \t]+stat-wall[ \t]+\|(.+)$', line.strip())
        if m:
            items_raw = m.group(1).split('||')
            items_html = ''
            for item in items_raw:
                parts = [p.strip() for p in item.split('|')]
                num   = parts[0] if len(parts) > 0 else ''
                label = parts[1] if len(parts) > 1 else ''
                sub   = parts[2] if len(parts) > 2 else ''
                items_html += (
                    f'<div class="sw-item">'
                    f'<span class="sw-num">{num}</span>'
                    f'<span class="sw-label">{label}</span>'
                )
                if sub:
                    items_html += f'<span class="sw-sub">{sub}</span>'
                items_html += '</div>'
            out.append(f'<div class="stat-wall">{items_html}</div>')
            i += 1
            continue

        # progress: ::: progress | 名称 | 75
        m = re.match(r'^:::[ \t]+progress[ \t]*\|[ \t]*([^|]+?)\|[ \t]*([\d.]+)(?:\|(.*))?$', line.strip())
        if m:
            name = m.group(1).strip()
            pct  = m.group(2).strip()
            sub  = (m.group(3) or '').strip()
            out.append(
                f'<div class="progress-item">'
                f'<div class="pi-label">'
                f'<span class="pi-name">{name}</span>'
                f'<span class="pi-pct">{pct}%</span>'
                f'</div>'
                f'<div class="pi-track"><div class="pi-fill" style="width:{pct}%"></div></div>'
                f'</div>'
            )
            i += 1
            continue

        # eyebrow: ::: eyebrow | 标签文字
        m = re.match(r'^:::[ \t]+eyebrow[ \t]+\|(.+)$', line.strip())
        if m:
            out.append(f'<span class="eyebrow">{m.group(1).strip()}</span>')
            i += 1
            continue

        # two-col block: ::: two-col ... :::
        if re.match(r'^:::[ \t]+two-col', line.strip()):
            col_lines = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith(':::'):
                col_lines.append(lines[i])
                i += 1
            i += 1  # skip closing :::
            # split on ---
            separator = '---'
            combined  = '\n'.join(col_lines)
            parts     = combined.split('\n' + separator + '\n')
            if len(parts) == 2:
                left_md, right_md = parts
                # parse card title + body
                def _parse_card(text):
                    lines2 = text.strip().split('\n')
                    title_line = lines2[0].strip().lstrip('#').strip().strip('*').strip()
                    body = '\n'.join(lines2[1:]).strip()
                    return title_line, body
                lt, lb = _parse_card(left_md)
                rt, rb = _parse_card(right_md)
                out.append(
                    f'<div class="two-col">'
                    f'<div class="col-card"><div class="cc-title">{lt}</div><div class="cc-body">{lb}</div></div>'
                    f'<div class="col-card"><div class="cc-title">{rt}</div><div class="cc-body">{rb}</div></div>'
                    f'</div>'
                )
            else:
                # fallback: just wrap in two-col with equal cards
                out.append('<div class="two-col">')
                for part in parts:
                    lt, lb = _parse_card(part) if part.strip() else ('', '')
                    out.append(
                        f'<div class="col-card"><div class="cc-title">{lt}</div>'
                        f'<div class="cc-body">{lb}</div></div>'
                    )
                out.append('</div>')
            continue

        out.append(line)
        i += 1

    return '\n'.join(out)


def md_to_html(md_text):
    """Convert Markdown to HTML with custom component blocks support."""
    # Pre-process custom ::: blocks
    md_text = _parse_custom_blocks(md_text)

    try:
        import markdown as md_lib
    except ImportError:
        print("  ⚠ python-markdown not installed. Installing...")
        subprocess.run([sys.executable, "-m", "pip", "install", "markdown", "--quiet"])
        import markdown as md_lib

    return md_lib.markdown(
        md_text,
        extensions=["tables", "fenced_code", "nl2br", "codehilite"],
        extension_configs={
            "codehilite": {"use_pygments": False},
        },
        output_format="html",
    )


def make_toc_html(chapters_meta):
    """Generate table of contents HTML. chapters_meta: list of {title, level, page}."""
    if not chapters_meta:
        return ""

    items = []
    for ch in chapters_meta:
        indent = "toc-indent" if ch["level"] == 2 else ""
        items.append(
            f'<li class="toc-item {indent}">'
            f'<span class="toc-title">{ch["title"]}</span>'
            f'<span class="toc-dots"></span>'
            f'<span class="toc-page">{ch["page"]}</span>'
            f'</li>'
        )

    return (
        '<div class="toc-page">\n'
        '<h2 class="toc-heading">目录</h2>\n'
        f'<ul class="toc-list">\n' + "\n".join(items) + "\n</ul>\n"
        '</div>\n'
    )


def build_html(project_dir, meta, brand_spec):
    """Assemble complete HTML document from Markdown chapters and brand template."""
    brand_name = brand_spec.get("name", "OPC")
    colors = brand_spec.get("colors", {})
    typo = brand_spec.get("typography", {})
    sizes = typo.get("sizes", {})
    cover_cfg = brand_spec.get("cover", {})
    page_cfg = brand_spec.get("page", {})
    components = brand_spec.get("components", {})

    primary = colors.get("primary", "#FC723F")
    primary_dark = colors.get("primary_dark", "#E05A2D")
    bg = colors.get("background", "#FFFBF5")
    text = colors.get("text", "#2D2D2D")
    text_sec = colors.get("text_secondary", "#8C7B6E")
    accent = colors.get("accent", "#6B4C35")
    surface = colors.get("surface", "#F2E8D9")
    line_color = colors.get("line", "#E8DDD0")
    th_bg = colors.get("table_header", primary)
    tr_stripe = colors.get("table_stripe", "#FFF7F0")

    heading_family = typo.get("heading_family", "'Noto Serif SC', serif")
    heading_weight = typo.get("heading_weight", "900")
    body_family = typo.get("body_family", "'Noto Sans SC', sans-serif")
    body_weight = typo.get("body_weight", "300")
    code_family = typo.get("code_family", "SF Mono, monospace")
    cover_title_spacing = typo.get("cover_title_spacing", "-0.03em")
    eyebrow_spacing = typo.get("eyebrow_spacing", "0.25em")
    tagline_family = typo.get("tagline_family", heading_family)

    logo_data = logo_to_data_uri(brand_spec)
    logo_height = brand_spec.get("logo_height_cm", "1.2")

    doc_type = meta["type"]
    title = meta["title"]
    subtitle = meta.get("subtitle", "")
    author = meta.get("author", "")
    author_title = meta.get("author_title", "")
    date_str = meta.get("date", "")
    has_cover = doc_type != "simple"
    has_toc = meta.get("toc", False) and doc_type in ("report", "guide")
    watermark = meta.get("watermark", "")

    # Build byline
    byline_parts = []
    if author:
        byline_parts.append(author)
    if author_title:
        byline_parts.append(author_title)
    byline = " · ".join(byline_parts)
    if date_str:
        byline = f"{byline} · {date_str}" if byline else date_str

    # Logo tag
    logo_tag = ""
    if logo_data:
        logo_tag = f'<img class="cover-logo" src="{logo_data}" alt="{brand_name}">'

    # Cover decorative elements
    cover_bg = cover_cfg.get("background", "#FFFBF5")
    cover_bg_alt = colors.get("cover_bg_alt", "#F7F2E8")
    cv_g1 = colors.get("cover_gradient_1", "rgba(252,114,63,0.08)")
    cv_g2 = colors.get("cover_gradient_2", "rgba(252,114,63,0.05)")
    cv_g3 = colors.get("cover_gradient_3", "rgba(107,76,53,0.06)")
    cv_g4 = colors.get("cover_gradient_4", "rgba(252,114,63,0.03)")
    cv_accent = colors.get("cover_accent_line", "rgba(252,114,63,0.55)")
    cv_overlay = colors.get("cover_overlay_opacity", "0.92")
    deco_line = cover_cfg.get("deco_vertical_line", True)
    deco_w = cover_cfg.get("deco_line_width", "3px")
    deco_c = cover_cfg.get("deco_line_color", cv_accent)
    top_bar_visible = cover_cfg.get("top_bar_visible", False)
    top_bar_h = cover_cfg.get("top_bar_height", "2mm")
    top_bar_c = cover_cfg.get("top_bar_color", primary)

    # Mountain SVG (fallback, when decoration="mountain_svg")
    mountain_svg = ""
    if cover_cfg.get("decoration") == "mountain_svg":
        mountain_svg = f'''<svg viewBox="0 0 420 100" xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none" class="cover-mountains">
          <path d="M0,75 C30,55 70,40 110,52 C150,64 180,35 220,45 C260,55 300,30 340,42 C370,50 400,38 420,44 L420,100 L0,100 Z"
            fill="rgba({_hex_to_rgb(accent)},0.07)"/>
          <path d="M0,85 C25,68 55,50 90,62 C125,74 155,48 195,56 C235,64 270,44 310,55 C345,64 385,50 420,58 L420,100 L0,100 Z"
            fill="rgba({_hex_to_rgb(accent)},0.12)"/>
          <path d="M0,92 C20,78 45,62 75,72 C105,82 130,60 165,68 C200,76 230,56 268,66 C305,76 345,62 385,70 C402,74 415,68 420,72 L420,100 L0,100 Z"
            fill="rgba({_hex_to_rgb(accent)},0.17)"/>
          <path d="M0,92 C20,78 45,62 75,72 C105,82 130,60 165,68 C200,76 230,56 268,66 C305,76 345,62 385,70 C402,74 415,68 420,72"
            fill="none" stroke="rgba(252,114,63,0.4)" stroke-width="1.2"/>
        </svg>'''

    # Cover image (for guide type)
    cover_img_html = ""
    if meta["cover"].get("style") == "image" and meta["cover"].get("image"):
        img_path = Path(project_dir) / meta["cover"]["image"]
        if img_path.exists():
            img_data = base64.b64encode(img_path.read_bytes()).decode()
            ext = img_path.suffix.lower()
            mime = "image/jpeg" if ext in (".jpg", ".jpeg") else "image/png"
            cover_img_html = f'<img class="cover-image" src="data:{mime};base64,{img_data}" alt="">'

    # Running header logo
    running_logo = ""
    if logo_data:
        running_logo = f'<img class="running-logo" src="{logo_data}" alt="">'

    # Watermark div
    watermark_div = ""
    if watermark:
        watermark_div = f'<div class="watermark">{watermark}</div>'

    # Component configs
    table_card = components.get("table_card", {})
    highlight_box = components.get("highlight_box", {})
    kpi_row_cfg = components.get("kpi_row", {})

    tc_radius = table_card.get("border_radius", "20px")
    tc_pad = table_card.get("padding", "20px")
    tc_border = table_card.get("border", "1px solid rgba(232,221,208,0.8)")
    tc_shadow = table_card.get("box_shadow", "0 12px 40px rgba(26,21,18,0.04)")
    tc_bg = table_card.get("background", "#FBF8F3")

    hb_border = highlight_box.get("border_left", "4px solid " + primary)
    hb_bg = highlight_box.get("background", "#F7F3EC")
    hb_pad = highlight_box.get("padding", "16px 20px")
    hb_radius = highlight_box.get("border_radius", "6px")
    hb_text = highlight_box.get("text_color", accent)

    kr_gap = kpi_row_cfg.get("gap", "28px")
    kr_border = kpi_row_cfg.get("border", "1px solid rgba(232,221,208,0.6)")
    kr_pad = kpi_row_cfg.get("padding", "26px 0")
    kr_num_size = kpi_row_cfg.get("kpi_number_size", "28pt")
    kr_num_color = kpi_row_cfg.get("kpi_number_color", primary)
    kr_num_fam = kpi_row_cfg.get("kpi_number_family", "'Space Mono', monospace")
    kr_label_size = kpi_row_cfg.get("kpi_label_size", "10pt")
    kr_label_color = kpi_row_cfg.get("kpi_label_color", text_sec)
    kr_label_spacing = kpi_row_cfg.get("kpi_label_spacing", "0.15em")

    # ── Build HTML ──
    current_year = datetime.now().year
    header_text = page_cfg.get("running_header_text", f"{brand_name} © {{year}}")
    header_text = header_text.replace("{year}", str(current_year))
    footer_text = meta.get("footer_text", f"{brand_name} © {current_year}")

    html_parts = [
        '<!DOCTYPE html>',
        '<html lang="zh-CN">',
        '<head>',
        '<meta charset="utf-8">',
        f'<title>{title}</title>',
        '<meta name="author" content="' + (author or brand_name) + '">',
    ]

    if has_cover:
        # Skip Paged.js polyfill — use Chrome native @page + break-before
        html_parts.append('<meta http-equiv="Content-Style-Type" content="text/css">')

    # ── CSS v2: Honghub-inspired gradient cover, serif headings, new components ──
    html_parts.append('<style>')
    # Font paths relative to this script file (portable across installs)
    _fonts_dir = Path(__file__).parent.parent / 'assets' / 'fonts'
    html_parts.append(f'''@font-face {{
  font-family: 'Space Mono';
  font-style: normal;
  font-weight: 400;
  src: url('file://{_fonts_dir}/SpaceMono-Regular.woff2') format('woff2');
}}
@font-face {{
  font-family: 'Space Mono';
  font-style: normal;
  font-weight: 700;
  src: url('file://{_fonts_dir}/SpaceMono-Bold.woff2') format('woff2');
}}
@font-face {{
  font-family: 'EB Garamond';
  font-style: normal;
  font-weight: 400;
  src: url('file://{_fonts_dir}/EBGaramond-Regular.woff') format('woff');
}}
@font-face {{
  font-family: 'EB Garamond';
  font-style: italic;
  font-weight: 400;
  src: url('file://{_fonts_dir}/EBGaramond-Italic.woff') format('woff');
}}
''')
    html_parts.append(f'''
/* ── Reset & Base ── */
*, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{
  font-family: {body_family};
  font-size: {sizes.get("body", "10.5pt")};
  font-weight: {body_weight};
  line-height: 2.0;
  color: {text};
  background: {bg};
}}

/* ── Paged.js Page Setup ── */
@page {{
  size: A4;
  margin: 2cm 2cm 2.2cm 2cm;
  @bottom-left {{
    content: "{footer_text}";
    font-size: 8pt;
    color: {text_sec};
  }}
  @bottom-right {{
    content: counter(page);
    font-size: 9pt;
    color: {text_sec};
  }}
}}
@page:first {{
  @bottom-left {{ content: none; }}
  @bottom-right {{ content: none; }}
}}
@page cover {{
  margin: 0;
  @bottom-left {{ content: none; }}
  @bottom-right {{ content: none; }}
}}

/* ── Running Header ── */
.running-header {{
  position: running(runningHeader);
  font-size: 8pt;
  color: {text_sec};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 6px;
  border-bottom: 0.5px solid {line_color};
}}
.running-logo {{ height: 9mm; }}
@page {{
  @top-left {{
    content: "{brand_name}";
    font-size: 8pt;
    color: {text_sec};
  }}
}}

/* ═══════════════════════════════════════════════════════
   COVER PAGE — Gradient Glow (Honghub-inspired)
   Zero-image: radial-gradient light pools + vertical accent
   ═══════════════════════════════════════════════════════ */
.cover {{
  page: cover;
  page-break-after: always;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(175deg, {cover_bg} 0%, {cover_bg_alt} 100%);
  overflow: hidden;
  padding: 0;
  margin: 0;
}}
.cover::before {{
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(42% 34% at 27% 79%, {cv_g1} 0%, {cv_g1} 28%, transparent 58%),
    radial-gradient(34% 24% at 72% 82%, {cv_g2} 0%, {cv_g2} 22%, transparent 52%),
    radial-gradient(26% 26% at 85% 88%, {cv_g3} 0%, {cv_g3} 16%, transparent 44%),
    radial-gradient(60% 40% at 15% 20%, {cv_g4} 0%, {cv_g4} 30%, transparent 55%);
  filter: blur(18px) saturate(96%);
  opacity: {cv_overlay};
  pointer-events: none;
  z-index: 0;
}}
.cover::after {{
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 2px;
  height: 100%;
  background: {deco_c};
  opacity: 0.78;
  z-index: 1;
}}
.cover-top-bar {{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: {top_bar_h};
  background: {top_bar_c};
  z-index: 3;
}}
.cover-body {{
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3cm 3cm;
  max-width: 680px;
}}
.cover-logo {{
  height: {logo_height}cm;
  width: auto;
  margin-bottom: 2.4cm;
}}
.cover-title {{
  font-family: {heading_family};
  font-size: {sizes.get("cover_title", "48pt")};
  font-weight: {heading_weight};
  color: {text};
  line-height: 1.08;
  letter-spacing: {cover_title_spacing};
  margin-bottom: 0.5cm;
}}
.cover-subtitle {{
  font-family: {heading_family};
  font-size: {sizes.get("cover_subtitle", "18pt")};
  font-weight: 800;
  color: {accent};
  line-height: 1.3;
  margin-bottom: 1.2cm;
}}
.cover-byline {{
  font-family: {tagline_family};
  font-size: {sizes.get("cover_tagline", "20pt")};
  font-weight: 400;
  font-style: italic;
  color: {text_sec};
  line-height: 1.8;
  margin-bottom: 2cm;
}}
.cover-image {{
  max-width: 100%;
  max-height: 35vh;
  object-fit: contain;
  margin-bottom: 1.5cm;
  border-radius: 8px;
}}
.cover-mountains {{
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 28%;
  z-index: 1;
  opacity: 0.55;
}}

/* ── KPI Findings Row (cover-bottom) ── */
.kpi-findings {{
  width: 100%;
  border: 1px solid rgba({_hex_to_rgb(accent)}, 0.2);
  border-radius: 12px;
  padding: 22px 28px;
  background: rgba(255,255,255,0.5);
  backdrop-filter: blur(4px);
  margin-top: 1cm;
}}
.kpi-findings-label {{
  font-size: 10pt;
  font-weight: 600;
  color: {text_sec};
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 14px;
  text-align: center;
}}
.kpi-findings-row {{
  display: flex;
  gap: 24px;
  justify-content: center;
}}
.kpi-finding {{
  flex: 1;
  text-align: center;
}}
.kpi-finding-num {{
  font-family: {kr_num_fam};
  font-size: {kr_num_size};
  font-weight: 700;
  color: {primary};
  display: block;
  line-height: 1.1;
  margin-bottom: 4px;
}}
.kpi-finding-text {{
  font-size: {kr_label_size};
  color: {kr_label_color};
  letter-spacing: {kr_label_spacing};
}}

/* ── TOC ── */
/* TOC kept compact to fit on a single page.
   Multi-page TOC triggers Paged.js bug (pagedown#314): content after TOC disappears. */
.toc-page {{
  break-after: page;
  font-size: 8pt;
  line-height: 1.3;
}}
.toc-heading {{
  font-family: {heading_family};
  font-size: 16pt;
  font-weight: {heading_weight};
  text-align: center;
  margin-bottom: 0.6cm;
}}
.toc-heading::after {{
  content: "";
  display: block;
  width: 40px;
  height: 2px;
  background: {primary};
  margin: 6px auto 0;
}}
.toc-list {{
  list-style: none;
  padding: 0;
}}
.toc-item {{
  display: flex;
  align-items: baseline;
  padding: 2px 0;
  border-bottom: 1px dotted {line_color};
}}
.toc-indent {{
  padding-left: 1.2em;
}}
.toc-title {{ flex-shrink: 0; margin-right: 4px; }}
.toc-dots {{ flex: 1; min-width: 1em; }}
.toc-page {{ flex-shrink: 0; margin-left: 4px; color: {text_sec}; }}

/* ── Typography ── */
h1 {{
  font-family: {heading_family};
  font-size: {sizes.get("h1", "24pt")};
  font-weight: {heading_weight};
  color: {text};
  line-height: 1.3;
  letter-spacing: -0.01em;
  margin: 32px 0 16px;
}}
h1::after {{
  content: "";
  display: block;
  width: 60px;
  height: 3px;
  background: {primary};
  margin-top: 10px;
}}
h2 {{
  font-family: {heading_family};
  font-size: {sizes.get("h2", "18pt")};
  font-weight: 700;
  color: {text};
  line-height: 1.3;
  margin: 24px 0 12px;
}}
h3 {{
  font-family: {body_family};
  font-size: {sizes.get("h3", "14pt")};
  font-weight: 600;
  color: {accent};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  line-height: 1.4;
  margin: 16px 0 8px;
}}
p {{ margin: 0 0 8px; }}
strong {{ font-weight: 700; }}
em {{ font-style: italic; }}
a {{ color: {primary}; text-decoration: none; }}

/* ── Lists ── */
ul, ol {{ padding-left: 1.5em; margin: 4px 0 12px; }}
li {{ margin: 3px 0; line-height: 1.6; }}

/* ── Code ── */
code {{
  font-family: {code_family};
  font-size: {sizes.get("code", "9pt")};
  background: {surface};
  padding: 1px 6px;
  border-radius: 3px;
}}
pre {{
  background: #F8F8F8;
  border: 1px solid {line_color};
  border-radius: 6px;
  padding: 14px 18px;
  margin: 12px 0;
  overflow-x: auto;
  font-family: {code_family};
  font-size: {sizes.get("code", "9pt")};
  line-height: 1.5;
}}
pre code {{ background: none; padding: 0; border-radius: 0; }}

/* ═══════════════════════════════════════════════════════
   COMPONENT: Table Card
   ═══════════════════════════════════════════════════════ */
.table-card {{
  border-radius: {tc_radius};
  padding: {tc_pad};
  border: {tc_border};
  box-shadow: {tc_shadow};
  background: {tc_bg};
  margin: 20px 0;
  overflow: hidden;
}}
.table-card table {{
  margin: 0;
  width: 100%;
}}
.table-card thead th:first-child {{
  border-radius: 8px 0 0 0;
}}
.table-card thead th:last-child {{
  border-radius: 0 8px 0 0;
}}

/* ── Standard Tables (inside .table-card or standalone) ── */
table {{
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 9.5pt;
}}
thead th {{
  background: {th_bg};
  color: white;
  font-weight: 700;
  padding: 10px 14px;
  text-align: left;
}}
tbody td {{
  padding: 8px 14px;
  border-bottom: 1px solid {line_color};
  vertical-align: top;
}}
tbody tr:nth-child(even) {{
  background: {tr_stripe};
}}

/* ═══════════════════════════════════════════════════════
   COMPONENT: Highlight Box
   ═══════════════════════════════════════════════════════ */
.highlight-box {{
  border-left: {hb_border};
  background: {hb_bg};
  padding: {hb_pad};
  border-radius: {hb_radius};
  margin: 16px 0;
  color: {hb_text};
}}
.highlight-box p {{ margin: 4px 0; }}
.highlight-box strong {{ color: {text}; }}

/* ═══════════════════════════════════════════════════════
   COMPONENT: KPI Number Row
   ═══════════════════════════════════════════════════════ */
.kpi-row {{
  display: flex;
  gap: {kr_gap};
  border-top: {kr_border};
  border-bottom: {kr_border};
  padding: {kr_pad};
  margin: 16px 0;
  text-align: center;
  justify-content: center;
}}
.kpi-stat {{
  flex: 1;
}}
.kpi-number {{
  display: block;
  font-family: {kr_num_fam};
  font-size: {kr_num_size};
  font-weight: 700;
  color: {kr_num_color};
  line-height: 1.2;
  margin-bottom: 6px;
}}
.kpi-label {{
  display: block;
  font-size: {kr_label_size};
  font-weight: 500;
  color: {kr_label_color};
  letter-spacing: {kr_label_spacing};
  text-transform: uppercase;
}}

/* ── Blockquotes (for quoted/cited material) ── */
blockquote {{
  border-left: 4px solid {primary};
  margin: 14px 0;
  padding: 10px 18px;
  background: {surface};
  color: {accent};
  border-radius: 0 6px 6px 0;
}}
blockquote p {{ margin: 4px 0; }}

/* ── Horizontal Rules → Page Breaks ── */
hr {{
  border: none;
  page-break-after: always;
  visibility: hidden;
  margin: 0;
}}

/* ── Images ── */
img:not(.cover-logo):not(.running-logo):not(.cover-image):not(.cover-mountains) {{
  max-width: 100%;
  height: auto;
  display: block;
  margin: 16px auto;
  border-radius: 4px;
}}

/* ── Watermark ── */
.watermark {{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  font-size: 48pt;
  font-weight: 400;
  color: rgba({_hex_to_rgb(text_sec)}, 0.12);
  pointer-events: none;
  z-index: -1;
  white-space: nowrap;
}}

/* ── Chapter start ── */
.chapter {{ break-before: page; }}

/* ── Page max-width ── */
.page-content {{
  max-width: 820px;
  margin: 0 auto;
}}

/* ═══════════════════════════════════════════════════════════
   COMPONENT LIBRARY — Reusable content block styles
   Each component has a corresponding Markdown convention.
   ═══════════════════════════════════════════════════════════ */

/* ── icon-note-box: 标识引导块 ── */
.icon-note-box {{
  padding: 16px 20px;
  margin: 22px 0;
  border-radius: 6px;
  font-size: 10pt;
  line-height: 1.65;
  background: {cv_g1};
  border-left: 3px solid {primary};
}}
.icon-note-box .icon-note-emoji {{
  display: none;
}}
.icon-note-box .icon-note-body p {{
  margin: 0 0 6px 0;
}}
.icon-note-box .icon-note-body p:last-child {{
  margin-bottom: 0;
}}
/* All variants use unified accent */
.icon-note-policy {{ background: {cv_g1}; border-left: 3px solid {primary}; }}
.icon-note-author {{ background: {cv_g1}; border-left: 3px solid {primary}; }}
.icon-note-trend {{ background: {cv_g1}; border-left: 3px solid {primary}; }}
.icon-note-caution {{ background: {cv_g1}; border-left: 3px solid {primary}; }}
.icon-note-tip {{ background: {cv_g1}; border-left: 3px solid {primary}; }}

/* ── data-table: 二列数据对比表 ── */
.data-table {{
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 10pt;
}}
.data-table thead th {{
  background: {primary};
  color: #fff;
  padding: 10px 16px;
  text-align: left;
  font-weight: 700;
  font-size: 10pt;
}}
.data-table thead th:first-child {{ border-radius: 6px 0 0 0; }}
.data-table thead th:last-child {{ border-radius: 0 6px 0 0; }}
.data-table tbody td {{
  padding: 10px 16px;
  border-bottom: 1px solid {line_color};
  vertical-align: top;
}}
.data-table tbody tr:nth-child(even) td {{
  background: rgba({_hex_to_rgb(line_color)}, 0.15);
}}
.data-table tbody tr:last-child td:first-child {{ border-radius: 0 0 0 6px; }}
.data-table tbody tr:last-child td:last-child {{ border-radius: 0 0 6px 0; }}
.data-table .dim {{ font-weight: 600; color: {text}; min-width: 140px; }}
.data-table .val {{ color: {text_sec}; }}

/* ── phase-roadmap: 阶段地图三列表 ── */
.phase-roadmap {{
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 10pt;
}}
.phase-roadmap thead th {{
  background: {primary};
  color: #fff;
  padding: 10px 14px;
  text-align: left;
  font-weight: 700;
}}
.phase-roadmap thead th:first-child {{ border-radius: 6px 0 0 0; }}
.phase-roadmap thead th:last-child {{ border-radius: 0 6px 0 0; }}
.phase-roadmap tbody td {{
  padding: 10px 14px;
  border-bottom: 1px solid {line_color};
  vertical-align: top;
}}
.phase-roadmap tbody tr:nth-child(even) td {{
  background: rgba({_hex_to_rgb(line_color)}, 0.15);
}}
.phase-roadmap tbody tr:last-child td:first-child {{ border-radius: 0 0 0 6px; }}
.phase-roadmap tbody tr:last-child td:last-child {{ border-radius: 0 0 6px 0; }}
.phase-roadmap .phase-tag {{
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 8.5pt;
  font-weight: 700;
  color: #fff;
  text-align: center;
  min-width: 72px;
}}
.phase-tag-short {{ background: #4A90D9; }}
.phase-tag-mid {{ background: #7C3AED; }}
.phase-tag-long {{ background: #059669; }}

/* ── numbered-steps: 大号步骤卡片 ── */
.numbered-step {{
  display: flex;
  gap: 18px;
  margin: 20px 0;
  padding: 0;
  align-items: flex-start;
}}
.numbered-step .step-num {{
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: {primary};
  color: #fff;
  font-size: 18pt;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
}}
.numbered-step .step-body h4 {{
  margin: 4px 0 8px 0;
  font-size: 12pt;
  font-weight: 700;
  color: {text};
}}
.numbered-step .step-body p,
.numbered-step .step-body ul {{
  margin: 0 0 6px 0;
  font-size: 10pt;
  line-height: 1.6;
  color: {text_sec};
}}
.numbered-step .step-body ul {{ padding-left: 18px; }}

/* ── policy-card: 政策条款卡片 ── */
.policy-card {{
  border: 1px solid {line_color};
  border-radius: 8px;
  margin: 20px 0;
  overflow: hidden;
}}
.policy-card .policy-header {{
  background: rgba({_hex_to_rgb(primary)}, 0.08);
  padding: 12px 20px;
  border-bottom: 1px solid {line_color};
  display: flex;
  align-items: baseline;
  gap: 10px;
}}
.policy-card .policy-num {{
  font-size: 11pt;
  font-weight: 800;
  color: {primary};
  white-space: nowrap;
}}
.policy-card .policy-title {{
  font-size: 11pt;
  font-weight: 700;
  color: {text};
}}
.policy-card .policy-body {{
  padding: 14px 20px;
  font-size: 10pt;
  line-height: 1.65;
  color: {text_sec};
}}
.policy-card .policy-body .policy-quote {{
  background: #FFFBF5;
  border-left: 3px solid {primary};
  padding: 10px 14px;
  margin: 10px 0;
  font-size: 9.5pt;
  color: #6B4C35;
}}
.policy-card .policy-body .policy-howto {{
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px dashed {line_color};
}}
.policy-card .policy-body .policy-howto strong {{
  color: {primary};
}}

/* ── layer-card: 层级卡片（四列表） ── */
.layer-card {{
  border: 1px solid {line_color};
  border-radius: 10px;
  margin: 22px 0;
  overflow: hidden;
}}
.layer-card .layer-badge {{
  background: linear-gradient(135deg, {primary}, #E85D2C);
  color: #fff;
  padding: 8px 18px;
  font-size: 12pt;
  font-weight: 700;
}}
.layer-card .layer-desc {{
  padding: 8px 18px;
  font-size: 10pt;
  color: #555;
  border-bottom: 1px solid {line_color};
}}
.layer-card .layer-table {{
  width: 100%;
  border-collapse: collapse;
  font-size: 9.5pt;
}}
.layer-card .layer-table thead th {{
  background: rgba({_hex_to_rgb(line_color)}, 0.3);
  padding: 6px 12px;
  text-align: left;
  font-weight: 700;
  color: {text};
}}
.layer-card .layer-table tbody td {{
  padding: 6px 12px;
  border-bottom: 1px solid rgba({_hex_to_rgb(line_color)}, 0.5);
  vertical-align: top;
}}

/* ── week-plan: 四周计划卡片 ── */
.week-plan {{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
  margin: 20px 0;
}}
.week-plan .week-card {{
  border: 1px solid {line_color};
  border-radius: 8px;
  padding: 16px;
}}
.week-plan .week-card .week-num {{
  font-size: 9pt;
  font-weight: 700;
  color: {primary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}}
.week-plan .week-card .week-goal {{
  font-size: 11pt;
  font-weight: 700;
  color: {text};
  margin-bottom: 8px;
}}
.week-plan .week-card .week-detail {{
  font-size: 9pt;
  line-height: 1.55;
  color: {text_sec};
}}
.week-plan .week-card .week-detail p {{
  margin: 0 0 4px 0;
}}

/* ── month-timeline: 垂直时间线 ── */
.month-timeline {{
  position: relative;
  padding-left: 32px;
  margin: 20px 0;
}}
.month-timeline::before {{
  content: '';
  position: absolute;
  left: 14px;
  top: 6px;
  bottom: 6px;
  width: 2px;
  background: {primary};
  opacity: 0.25;
}}
.month-timeline .tl-item {{
  position: relative;
  margin-bottom: 16px;
}}
.month-timeline .tl-item::before {{
  content: '';
  position: absolute;
  left: -24px;
  top: 6px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: {primary};
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px {primary};
}}
.month-timeline .tl-period {{
  font-size: 9.5pt;
  font-weight: 700;
  color: {primary};
  margin-bottom: 4px;
}}
.month-timeline .tl-content {{
  font-size: 9.5pt;
  line-height: 1.6;
  color: {text_sec};
}}
.month-timeline .tl-content ul {{
  margin: 2px 0;
  padding-left: 16px;
}}

/* ── case-study: 案例框 ── */
.case-study {{
  background: rgba({_hex_to_rgb(line_color)}, 0.2);
  border: 1px solid {line_color};
  border-radius: 8px;
  padding: 20px 22px;
  margin: 22px 0;
}}
.case-study .case-num {{
  font-size: 9pt;
  font-weight: 700;
  color: {primary};
  letter-spacing: 0.04em;
  margin-bottom: 4px;
}}
.case-study .case-title {{
  font-size: 13pt;
  font-weight: 800;
  color: {text};
  margin-bottom: 10px;
}}
.case-study .case-meta {{
  font-size: 9pt;
  color: {text_sec};
  margin-bottom: 10px;
  font-style: italic;
}}
.case-study .case-body {{
  font-size: 10pt;
  line-height: 1.65;
  color: {text_sec};
}}

/* ── checklist: 操作核对清单 ── */
.checklist {{
  list-style: none;
  padding: 0;
  margin: 18px 0;
}}
.checklist li {{
  padding: 8px 0 8px 32px;
  position: relative;
  font-size: 10pt;
  line-height: 1.55;
  color: {text_sec};
  border-bottom: 1px dotted rgba({_hex_to_rgb(line_color)}, 0.5);
}}
.checklist li::before {{
  content: '';
  position: absolute;
  left: 0;
  top: 10px;
  width: 16px;
  height: 16px;
  border: 2px solid {primary};
  border-radius: 3px;
  background: rgba({_hex_to_rgb(primary)}, 0.06);
}}

/* ── faq-item: 问答对 ── */
.faq-item {{
  margin: 14px 0;
  padding: 14px 18px;
  border-radius: 6px;
  background: rgba({_hex_to_rgb(line_color)}, 0.15);
}}
.faq-item .faq-q {{
  font-size: 10.5pt;
  font-weight: 700;
  color: {text};
  margin-bottom: 6px;
}}
.faq-item .faq-a {{
  font-size: 10pt;
  line-height: 1.65;
  color: {text_sec};
}}

/* ── money-stat: 金额高亮 ── */
.money-inline {{ color: {primary}; font-weight: 700; }}
.money-card {{
  display: inline-block;
  padding: 4px 12px;
  background: rgba({_hex_to_rgb(primary)}, 0.08);
  border-radius: 4px;
  font-weight: 700;
  color: {primary};
  font-size: 10pt;
}}

/* ── community-grid: 社区网格表（五列+） ── */
.community-grid {{
  width: 100%;
  border-collapse: collapse;
  margin: 18px 0;
  font-size: 9pt;
}}
.community-grid thead th {{
  background: {primary};
  color: #fff;
  padding: 9px 10px;
  text-align: left;
  font-weight: 700;
  white-space: nowrap;
}}
.community-grid thead th:first-child {{ border-radius: 6px 0 0 0; }}
.community-grid thead th:last-child {{ border-radius: 0 6px 0 0; }}
.community-grid tbody td {{
  padding: 8px 10px;
  border-bottom: 1px solid {line_color};
  vertical-align: top;
  line-height: 1.5;
}}
.community-grid tbody tr:nth-child(even) td {{
  background: rgba({_hex_to_rgb(line_color)}, 0.15);
}}
.community-grid tbody tr:last-child td:first-child {{ border-radius: 0 0 0 6px; }}
.community-grid tbody tr:last-child td:last-child {{ border-radius: 0 0 6px 0; }}

/* ── highlight-box variants ── */
.highlight-box.policy {{ background: #FDF3EB; border-left-color: #FC723F; }}
.highlight-box.author {{ background: #F0F7FF; border-left-color: #4A90D9; }}
.highlight-box.trend {{ background: #F5F0FA; border-left-color: #7C3AED; }}
.highlight-box.caution {{ background: #FEF2F2; border-left-color: #DC2626; }}

/* ── kpi-row variants ── */
.kpi-row {{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin: 20px 0;
}}
.kpi-row .kpi-card {{
  background: rgba({_hex_to_rgb(primary)}, 0.06);
  border: 1px solid rgba({_hex_to_rgb(primary)}, 0.15);
  border-radius: 8px;
  padding: 14px 16px;
  text-align: center;
}}
.kpi-row .kpi-card .kpi-value {{
  font-size: 22pt;
  font-weight: 900;
  color: {primary};
  line-height: 1.15;
  margin-bottom: 4px;
}}
.kpi-row .kpi-card .kpi-label {{
  font-size: 8.5pt;
  color: {text_sec};
  line-height: 1.35;
}}
''''')
    html_parts.append('''
/* ══════════════════════════════════════════════════════
   NEW COMPONENTS (added 2026-07-29)
   ══════════════════════════════════════════════════════ */

/* ── section-header: 大号章节起始标题（01/02/03 编号）── */
.section-header {{
  padding: 32px 0 24px;
  border-bottom: 2px solid {text};
  margin-bottom: 36px;
  break-before: page;
}}
.section-header .sh-eyebrow {{
  font-family: 'Space Mono', 'Courier New', monospace;
  font-size: 9pt;
  font-weight: 400;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: {primary};
  display: block;
  margin-bottom: 10px;
}}
.section-header .sh-title {{
  font-family: '{serif}', '{cjk_serif}', serif;
  font-size: 34pt;
  font-weight: 900;
  line-height: 1.08;
  color: {text};
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}}
.section-header .sh-subtitle {{
  font-family: 'EB Garamond', 'Noto Serif SC', serif;
  font-size: 14pt;
  font-style: italic;
  color: {text_sec};
  line-height: 1.4;
}}

/* ── pull-quote: 引用块（大号引号 + 左侧色条）── */
.pull-quote {{
  margin: 28px 0;
  padding: 20px 24px 20px 28px;
  border-left: 4px solid {primary};
  background: {cv_g1};
  position: relative;
}}
.pull-quote::before {{
  content: '\u201c';
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 64pt;
  font-weight: 400;
  color: {primary};
  opacity: 0.25;
  position: absolute;
  top: -8px;
  left: 12px;
  line-height: 1;
}}
.pull-quote .pq-text {{
  font-family: 'EB Garamond', 'Noto Serif SC', serif;
  font-size: 14pt;
  font-style: italic;
  color: {text};
  line-height: 1.7;
  position: relative;
  z-index: 1;
  margin-bottom: 10px;
}}
.pull-quote .pq-source {{
  font-family: 'Space Mono', 'Courier New', monospace;
  font-size: 8pt;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: {text_sec};
}}

/* ── stat-wall: 数据墙（3-4个大数字横排）── */
.stat-wall {{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0;
  margin: 28px 0;
  border: 1px solid {line_color};
  border-radius: 8px;
  overflow: hidden;
}}
.stat-wall .sw-item {{
  padding: 22px 20px;
  text-align: center;
  border-right: 1px solid {line_color};
  background: {bg};
}}
.stat-wall .sw-item:last-child {{
  border-right: none;
}}
.stat-wall .sw-num {{
  font-family: 'Space Mono', 'Courier New', monospace;
  font-size: 30pt;
  font-weight: 700;
  color: {primary};
  line-height: 1.1;
  display: block;
  margin-bottom: 6px;
}}
.stat-wall .sw-label {{
  font-size: 8.5pt;
  color: {text_sec};
  line-height: 1.4;
}}
.stat-wall .sw-sub {{
  font-size: 7.5pt;
  color: {text_sec};
  opacity: 0.7;
  margin-top: 3px;
}}

/* ── two-col: 双栏网格布局 ── */
.two-col {{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 20px 0;
}}
.two-col-3 {{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin: 20px 0;
}}
.col-card {{
  padding: 18px 16px;
  background: {cv_g1};
  border-radius: 6px;
  border-top: 3px solid {primary};
}}
.col-card .cc-title {{
  font-size: 11pt;
  font-weight: 700;
  color: {text};
  margin-bottom: 8px;
  line-height: 1.3;
}}
.col-card .cc-body {{
  font-size: 9.5pt;
  color: {text_sec};
  line-height: 1.65;
}}

/* ── progress-bar: 进度条/占比条 ── */
.progress-list {{
  margin: 20px 0;
}}
.progress-item {{
  margin-bottom: 14px;
}}
.progress-item .pi-label {{
  display: flex;
  justify-content: space-between;
  font-size: 9.5pt;
  color: {text_sec};
  margin-bottom: 5px;
}}
.progress-item .pi-label .pi-name {{
  font-weight: 600;
  color: {text};
}}
.progress-item .pi-label .pi-pct {{
  font-family: 'Space Mono', 'Courier New', monospace;
  font-size: 8.5pt;
  color: {primary};
}}
.progress-item .pi-track {{
  height: 6px;
  background: {line_color};
  border-radius: 3px;
  overflow: hidden;
}}
.progress-item .pi-fill {{
  height: 100%;
  background: linear-gradient(90deg, {primary} 0%, {secondary} 100%);
  border-radius: 3px;
}}

/* ── eyebrow: 等宽小标签（章节、分类标注）── */
.eyebrow {{
  font-family: 'Space Mono', 'Courier New', monospace;
  font-size: 8pt;
  font-weight: 400;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: {primary};
  display: block;
  margin-bottom: 6px;
}}

''')
    html_parts.append('</style>')
    html_parts.append('</head>')
    html_parts.append('<body>')

    # Watermark
    if watermark:
        html_parts.append(watermark_div)

    # Running header
    if page_cfg.get("running_header", True):
        html_parts.append(
            f'<div class="running-header">'
            f'{running_logo}'
            f'<span>{header_text}</span>'
            f'<span></span>'
            f'</div>'
        )

    # ── Cover ──
    if has_cover:
        html_parts.append('<div class="cover">')
        if top_bar_visible:
            html_parts.append('<div class="cover-top-bar"></div>')
        html_parts.append('<div class="cover-body">')
        if logo_tag:
            html_parts.append(logo_tag)
        if cover_img_html:
            html_parts.append(cover_img_html)
        html_parts.append(f'<h1 class="cover-title">{title}</h1>')
        if subtitle:
            html_parts.append(f'<p class="cover-subtitle">{subtitle}</p>')
        if byline:
            html_parts.append(f'<p class="cover-byline">{byline}</p>')

        # KPI findings row (cover bottom) — from meta.cover.findings
        findings = meta.get("cover", {}).get("findings", [])
        if findings:
            html_parts.append('<div class="kpi-findings">')
            html_parts.append('<div class="kpi-findings-label">核心发现</div>')
            html_parts.append('<div class="kpi-findings-row">')
            for f in findings:
                html_parts.append(
                    f'<div class="kpi-finding">'
                    f'<span class="kpi-finding-num">{f.get("num", "")}</span>'
                    f'<span class="kpi-finding-text">{f.get("text", "")}</span>'
                    f'</div>'
                )
            html_parts.append('</div></div>')

        html_parts.append('</div>')  # cover-body
        if mountain_svg:
            html_parts.append(mountain_svg)
        html_parts.append('</div>')  # cover

    # TOC
    if has_toc:
        chapters = resolve_chapter_paths(project_dir, meta["chapters"])
        toc_entries = []
        for ch_path in chapters:
            text = ch_path.read_text(encoding="utf-8")
            for line in text.split("\n"):
                m = re.match(r'^(#{1,3})\s+(.+)$', line.strip())
                if m:
                    level = len(m.group(1))
                    # Only level-1 headings in TOC to keep it single-page.
                    # Multi-page TOC triggers Paged.js bug (pagedown#314): content
                    # after TOC disappears entirely.
                    if level >= 2:
                        continue
                    toc_entries.append({
                        "title": m.group(2).strip(),
                        "level": 1,
                        "page": "—",
                    })
        html_parts.append(make_toc_html(toc_entries))

    # Chapters — wrap in .page-content for max-width constraint
    chapter_html_parts = []
    chapters = resolve_chapter_paths(project_dir, meta["chapters"])
    first = True
    for ch_path in chapters:
        md_text = ch_path.read_text(encoding="utf-8")
        body = md_to_html(md_text)
        chapter_html_parts.append(f'<div class="chapter page-content">{body}</div>')

    html_parts.extend(chapter_html_parts)
    html_parts.append('</body>')
    html_parts.append('</html>')

    return "\n".join(html_parts)

def engine_chrome_split(html_path, pdf_path, meta=None, brand_spec=None):
    """Generate PDF via 3-segment Chrome headless rendering + PyPDF2 merge.

    Architecture (validated 2026-07-29):
      Cover:   @page{margin:0} + body{padding:0}            + .cover{297mmx210mm}
      TOC:     @page{margin:0} + body{padding:1.5cm}        + no header/footer
      Content: @page{margin:0} + body{padding for HF space} + position:fixed HF divs

    Key: @page margin area is always white in Chrome headless.
    Solution: @page{margin:0} + body{padding} = full-bleed background.
    """
    import re as _re, base64 as _b64, time as _time, shutil as _shutil
    try:
        from PyPDF2 import PdfReader, PdfWriter
    except ImportError:
        return False, "PyPDF2 not installed. Run: pip3 install PyPDF2"

    chrome = find_chrome()
    if not chrome:
        return False, "Chrome not found"

    html = Path(html_path).read_text(encoding="utf-8")

    # Extract 3 segments
    cover_start   = html.find('<div class="cover">')
    toc_start     = html.find('<div class="toc-page">')
    chapter_start = html.find('<div class="chapter page-content"')
    if chapter_start == -1:
        chapter_start = html.find('<div class="chapter">')
    body_end = html.rfind('</body>')

    if cover_start == -1 or chapter_start == -1:
        return False, (
            f"HTML structure not found "
            f"(cover:{cover_start} chapter:{chapter_start}). "
            "Ensure HTML has .cover and .chapter divs."
        )

    # toc-page is optional — if absent, merge cover directly with content
    if toc_start == -1 or toc_start > chapter_start:
        cover_html   = html[cover_start:chapter_start].strip()
        toc_html     = ""
        content_html = html[chapter_start:body_end].strip()
    else:
        cover_html   = html[cover_start:toc_start].strip()
        toc_html     = html[toc_start:chapter_start].strip()
        content_html = html[chapter_start:body_end].strip()

    # base64 logo -> temp PNG (prevents Chrome decode timeout on large base64)
    b64_match = _re.search(
        r'src="(data:image/(?:png|jpeg|jpg);base64,[^"]+)"', cover_html
    )
    tmp_logo = None
    if b64_match:
        data_uri = b64_match.group(1)
        raw = _b64.b64decode(data_uri.split(',', 1)[1])
        tmp_logo = f"/tmp/opc_pdf_logo_{os.getpid()}.png"
        Path(tmp_logo).write_bytes(raw)
        cover_html = cover_html.replace(data_uri, f"file://{tmp_logo}")

    # Extract inline styles, strip old @page rules (each segment injects its own)
    raw_styles = '\n'.join(_re.findall(r'<style[^>]*>.*?</style>', html, _re.DOTALL))
    inline_styles = _re.sub(r'@page\s*[^{]*\{[^}]+\}', '', raw_styles)

    COMMON = (
        "html,body,*{"
        "-webkit-print-color-adjust:exact!important;"
        "print-color-adjust:exact!important;}"
    )

    bg    = (brand_spec or {}).get("colors", {}).get("bg", "#FFFBF5")
    site  = (meta or {}).get("brand_name", "opcquan.com")
    title = (meta or {}).get("title", "")

    COVER_CSS = (
        "@page{size:A4;margin:0;}"
        f"body{{margin:0;padding:0;background:{bg};}}"
        ".cover{width:210mm!important;height:297mm!important;"
        "margin:0!important;position:relative;}"
    )
    TOC_CSS = (
        "@page{size:A4;margin:0;}"
        f"body{{margin:0;padding:1.5cm;background:{bg};}}"
    )
    HF_CSS = (
        "@page{size:A4;margin:0;}"
        f"body{{margin:0;padding:1.0cm 1.5cm 0.75cm 1.5cm;background:{bg};}}"
        ".pdf-hdr{position:fixed;top:0;left:0;right:0;height:1.0cm;"
        f"background:{bg};border-bottom:1px solid #E8DDD0;"
        "display:flex;align-items:flex-end;justify-content:space-between;"
        "padding:0 1.5cm 4px;font-size:8pt;box-sizing:border-box;z-index:100;}"
        ".pdf-hdr .hs{color:#FC723F;font-weight:600;}"
        ".pdf-hdr .hb{color:#8C7B6E;}"
        ".pdf-ftr{position:fixed;bottom:0;left:0;right:0;height:0.75cm;"
        f"background:{bg};border-top:1px solid #E8DDD0;"
        "display:flex;align-items:center;justify-content:space-between;"
        "padding:0 1.5cm;font-size:7.5pt;color:#aaa;"
        "box-sizing:border-box;z-index:100;}"
    )
    HF_DIV = (
        f'<div class="pdf-hdr">'
        f'<span class="hs">{site}</span>'
        f'<span class="hb">OPC\u5708 \u00a9 2026</span>'
        f'</div>\n'
        f'<div class="pdf-ftr"><span>{title}</span><span></span></div>\n'
    )

    def _make_html(page_css, body_content):
        return (
            '<!DOCTYPE html><html><head><meta charset="UTF-8">'
            + inline_styles
            + f'<style>{COMMON}\n{page_css}</style>'
            + f'</head><body>{body_content}</body></html>'
        )

    def _make_cover_html(body):
        cover_rules = '\n'.join(
            _re.findall(r'\.cover[-\w\s:>]*\{[^}]+\}', html, _re.DOTALL)[:6]
        )
        return (
            '<!DOCTYPE html><html><head><meta charset="UTF-8">'
            f'<style>{COMMON}\n{COVER_CSS}\n{cover_rules}</style>'
            f'</head><body>{body}</body></html>'
        )

    def _run_chrome(html_str, out_pdf, wait=130):
        out_pdf.unlink(missing_ok=True)
        tmp_html = f"/tmp/opc_chunk_{out_pdf.stem}_{os.getpid()}.html"
        cdir     = f"/tmp/opc_cdir_{out_pdf.stem}_{os.getpid()}"
        Path(tmp_html).write_text(html_str, encoding="utf-8")
        Path(cdir).mkdir(parents=True, exist_ok=True)
        proc = subprocess.Popen(
            [chrome, "--headless", "--disable-gpu", "--no-sandbox",
             "--disable-dev-shm-usage", "--no-first-run", "--no-pdf-header-footer",
             f"--user-data-dir={cdir}", "--virtual-time-budget=10000",
             f"--print-to-pdf={out_pdf}", f"file://{tmp_html}"],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        t0 = _time.time()
        while _time.time() - t0 < wait:
            if out_pdf.exists() and out_pdf.stat().st_size > 100:
                proc.terminate()
                break
            _time.sleep(0.5)
        else:
            proc.kill()
        _shutil.rmtree(cdir, ignore_errors=True)
        try:
            os.unlink(tmp_html)
        except OSError:
            pass
        return out_pdf.exists() and out_pdf.stat().st_size > 100

    tmp_dir     = Path(f"/tmp/opc_split_{os.getpid()}")
    tmp_dir.mkdir(parents=True, exist_ok=True)
    cover_pdf   = tmp_dir / "cover.pdf"
    toc_pdf     = tmp_dir / "toc.pdf"
    content_pdf = tmp_dir / "content.pdf"

    try:
        print("   -> Rendering cover...", flush=True)
        if not _run_chrome(_make_cover_html(cover_html), cover_pdf):
            return False, "Cover PDF failed"

        if toc_html:
            print("   -> Rendering TOC...", flush=True)
            if not _run_chrome(_make_html(TOC_CSS, toc_html), toc_pdf):
                return False, "TOC PDF failed"
        else:
            print("   -> No TOC, skipping...", flush=True)

        print("   -> Rendering content...", flush=True)
        if not _run_chrome(_make_html(HF_CSS, HF_DIV + content_html), content_pdf, wait=180):
            return False, "Content PDF failed"

        writer = PdfWriter()
        total  = 0
        for p in [cover_pdf, toc_pdf, content_pdf]:
            if not p.exists() or p.stat().st_size < 100:
                continue
            r = PdfReader(p)
            for page in r.pages:
                writer.add_page(page)
            total += len(r.pages)

        with open(pdf_path, "wb") as f:
            writer.write(f)

        print(f"   -> Merged {total} pages", flush=True)
        return True, None

    except Exception as exc:
        return False, str(exc)

    finally:
        _shutil.rmtree(tmp_dir, ignore_errors=True)
        if tmp_logo:
            try:
                os.unlink(tmp_logo)
            except OSError:
                pass


def engine_chrome_pagedjs(html_path, pdf_path):
    """Generate PDF via Chrome headless with Paged.js rendering.

    Uses --virtual-time-budget to wait for Paged.js to finish layout.
    Without this, only 2 pages (cover+TOC) are captured.

    Uses --headless=new (not --headless) because the old headless mode
    hangs after printing on macOS 12 with Chrome 150+.
    """
    chrome = find_chrome()
    if not chrome:
        return False, "Chrome not found"

    try:
        abs_html = f"file://{os.path.abspath(html_path)}"
        temp_dir = f"/tmp/chrome-pdf-{os.getpid()}"
        Path(temp_dir).mkdir(parents=True, exist_ok=True)

        abs_pdf = os.path.abspath(pdf_path)
        result = subprocess.run(
            [
                chrome,
                "--headless",
                "--disable-gpu",
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-extensions",
                "--disable-sync",
                "--no-first-run",
                "--no-pdf-header-footer",
                "--disable-background-networking",
                f"--user-data-dir={temp_dir}",
                f"--virtual-time-budget=120000",
                f"--print-to-pdf={abs_pdf}",
                abs_html,
            ],
            capture_output=True,
            text=True,
            timeout=120,
        )

        # Kill all Chrome headless children spawned for this PDF generation
        try:
            subprocess.run(
                ["pkill", "-f", "--print-to-pdf"],
                capture_output=True, timeout=5
            )
        except Exception:
            pass
        try:
            shutil.rmtree(temp_dir)
        except Exception:
            pass

        if result.returncode != 0:
            return False, f"Chrome exit code {result.returncode}: {result.stderr[:200]}"

        if not os.path.exists(pdf_path) or os.path.getsize(pdf_path) < 1000:
            return False, "PDF output too small or missing"

        return True, None
    except subprocess.TimeoutExpired:
        # Chrome may have finished writing PDF but hang on exit.
        # Check if PDF was actually produced.
        try:
            subprocess.run(
                ["pkill", "-f", "--print-to-pdf"],
                capture_output=True, timeout=5
            )
        except Exception:
            pass
        try:
            shutil.rmtree(temp_dir)
        except Exception:
            pass
        if os.path.exists(pdf_path) and os.path.getsize(pdf_path) > 5000:
            return True, None
        return False, "Chrome timed out after 120s"
    except Exception as e:
        return False, str(e)


def engine_weasyprint(html_path, pdf_path):
    """Generate PDF via weasyprint (no JS, no Paged.js). Simpler but reliable."""
    try:
        from weasyprint import HTML
    except ImportError:
        return False, (
            "weasyprint not installed. Install: pip3 install weasyprint"
        )
    except OSError as e:
        # macOS: libpango / libcairo missing (not installed via brew)
        return False, (
            f"weasyprint cannot load system libraries ({e}). "
            "On macOS: brew install pango cairo. "
            "On Linux: apt-get install libpango-1.0-0 libcairo2."
        )
    except Exception as e:
        return False, f"weasyprint import failed: {e}"

    try:
        HTML(filename=html_path).write_pdf(pdf_path)
        if not os.path.exists(pdf_path) or os.path.getsize(pdf_path) < 1000:
            return False, "weasyprint produced empty/corrupted output"
        return True, None
    except Exception as e:
        return False, str(e)


def generate_pdf(html_path, pdf_path, meta=None, brand_spec=None):
    """Generate PDF: Chrome split-render first, weasyprint fallback."""
    print("\n📄 Generating PDF...")

    # Engine 1: Chrome split (cover / TOC / content rendered separately)
    ok, err = engine_chrome_split(html_path, pdf_path, meta=meta, brand_spec=brand_spec)
    if ok:
        size_kb = os.path.getsize(pdf_path) // 1024
        page_count = _count_pdf_pages(pdf_path)
        print(f"   ✅ PDF via Chrome split: ~{page_count} pages, {size_kb} KB")
        return pdf_path

    print(f"   ⚠ Chrome split failed: {err}")
    print("   → Trying weasyprint fallback...")

    # Engine 2: weasyprint
    ok, err = engine_weasyprint(html_path, pdf_path)
    if ok:
        size_kb = os.path.getsize(pdf_path) // 1024
        page_count = _count_pdf_pages(pdf_path)
        print(f"   ⚠ PDF via weasyprint (Chrome unavailable): ~{page_count} pages, {size_kb} KB")
        print(f"   Note: Simplified layout. For best results, install Google Chrome.")
        return pdf_path

    # Both failed
    print(f"   ❌ weasyprint also failed: {err}")
    print(f"   → HTML saved at: {html_path}")
    print(f"   → Open in Chrome and press Cmd+P to print manually.")
    return None


def generate_pdf_split(html_path, pdf_path, meta, brand_spec, project_dir):
    """Generate PDF with TOC split into two passes to work around Paged.js bug.
    
    Paged.js has a bug (pagedown#314): when TOC spans more than one page,
    all content after TOC disappears. Workaround: render chapters without TOC,
    render TOC separately, merge cover+TOC+chapters.
    """
    print("\n📄 Generating PDF (split-mode for TOC)...")
    
    # 1. Build chapters-only HTML (no TOC, but keep cover)
    meta_no_toc = dict(meta)
    meta_no_toc["toc"] = False
    html_no_toc = build_html(project_dir, meta_no_toc, brand_spec)
    tmp_no_toc_html = pdf_path.replace(".pdf", "") + "_chapters.tmp.html"
    Path(tmp_no_toc_html).write_text(html_no_toc, encoding="utf-8")
    
    tmp_chapters_pdf = pdf_path.replace(".pdf", "") + "_chapters.tmp.pdf"
    ok, err = engine_chrome_pagedjs(tmp_no_toc_html, tmp_chapters_pdf)
    if not ok:
        print(f"   ❌ Chapters PDF failed: {err}")
        return None
    
    chapters_pages = _count_pdf_pages(tmp_chapters_pdf)
    print(f"   ✅ Chapters (no TOC): ~{chapters_pages} pages")
    
    # 2. Build TOC-only HTML
    toc_html = _build_toc_only_html(meta, brand_spec, project_dir)
    tmp_toc_html = pdf_path.replace(".pdf", "") + "_toc.tmp.html"
    Path(tmp_toc_html).write_text(toc_html, encoding="utf-8")
    
    tmp_toc_pdf = pdf_path.replace(".pdf", "") + "_toc.tmp.pdf"
    ok, err = engine_chrome_pagedjs(tmp_toc_html, tmp_toc_pdf)
    if not ok:
        print(f"   ❌ TOC PDF failed: {err}")
        return None
    
    toc_pages = _count_pdf_pages(tmp_toc_pdf)
    print(f"   ✅ TOC only: ~{toc_pages} pages")
    
    # 3. Merge: cover page is Pg1 of chapters, TOC goes after cover
    from PyPDF2 import PdfReader, PdfWriter
    chapters_pdf = PdfReader(tmp_chapters_pdf)
    toc_pdf = PdfReader(tmp_toc_pdf)
    
    writer = PdfWriter()
    
    # Cover is page 1 of chapters PDF
    # But PyPDF2 is 0-indexed
    writer.add_page(chapters_pdf.pages[0])  # cover
    
    # TOC pages
    for i in range(len(toc_pdf.pages)):
        writer.add_page(toc_pdf.pages[i])
    
    # Chapters (skip cover, which is page 0)
    for i in range(1, len(chapters_pdf.pages)):
        writer.add_page(chapters_pdf.pages[i])
    
    with open(pdf_path, "wb") as f:
        writer.write(f)
    
    # Cleanup
    for tmp in [tmp_no_toc_html, tmp_chapters_pdf, tmp_toc_html, tmp_toc_pdf]:
        try:
            os.remove(tmp)
        except Exception:
            pass
    
    size_kb = os.path.getsize(pdf_path) // 1024
    total_pages = _count_pdf_pages(pdf_path)
    print(f"   ✅ Merged PDF: ~{total_pages} pages, {size_kb} KB")
    return pdf_path


def _build_toc_only_html(meta, brand_spec, project_dir):
    """Build a minimal HTML with just the TOC page (no cover, no chapters).
    Reuses build_html but strips cover and chapters, keeping only TOC."""
    html = build_html(project_dir, meta, brand_spec)
    
    # Extract TOC div: everything between toc-page open and first chapter
    toc_start = html.find('<div class="toc-page">')
    ch_start = html.find('<div class="chapter page-content"')
    if toc_start == -1 or ch_start == -1:
        # Fallback: return empty body
        return "<html><body></body></html>"
    
    toc_block = html[toc_start:ch_start]
    
    # Keep head (with CSS + polyfill) and body with just TOC + running header
    head_end = html.find('</head>')
    body_start = html.find('<body>')
    body_close = html.find('</body>')
    
    # Build: head + body with just TOC
    head = html[:head_end + 7]
    # Extract running-header if present
    rh_start = html.find('<div class="running-header"')
    rh_end = html.find('</div>', rh_start) + 6 if rh_start != -1 else 0
    rh_html = html[rh_start:rh_end] if rh_start != -1 else ""
    
    result = f"""{head}
<body>
{rh_html}
{toc_block}
</body>
</html>"""
    return result


def _count_pdf_pages(pdf_path):
    """Quick PDF page count by counting /Type /Page entries."""
    try:
        data = Path(pdf_path).read_bytes()
        return len(re.findall(rb'/Type\s*/Page[^s]', data))
    except Exception:
        return "?"


# ── Main ─────────────────────────────────────────────────────

def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(line_buffering=True)
    parser = argparse.ArgumentParser(
        description="OPC PDF Publisher — Generate brand-consistent PDF from Markdown",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=textwrap.dedent("""\
        Examples:
          python3 build_pdf.py my-report/ --output report.pdf
          python3 build_pdf.py nanning-july/ --output nanning-july-report.pdf
        """),
    )
    parser.add_argument("project_dir", help="Directory with meta.json + markdown chapters")
    parser.add_argument("--output", "-o", required=True, help="Output PDF path")
    parser.add_argument("--html-only", action="store_true", help="Stop after HTML generation (no PDF)")
    args = parser.parse_args()

    project_dir = args.project_dir
    output_pdf = args.output

    if not Path(project_dir).is_dir():
        print(f"❌ Project directory not found: {project_dir}")
        sys.exit(1)

    # 1. Load meta
    print("📋 Loading meta.json...")
    meta = load_meta(project_dir)

    doc_type = meta["type"]
    brand_name = meta["brand"]
    print(f"   Type: {doc_type} | Brand: {brand_name} | Chapters: {len(meta['chapters'])}")

    # 2. Load brand
    all_brands = load_brand_specs()
    brand_spec = all_brands.get(brand_name, all_brands.get("opc", {}))
    print(f"   Brand: {brand_spec.get('name', brand_name)}")

    # Validate brand exists
    if brand_name not in all_brands:
        print(f"   ⚠ Brand '{brand_name}' not found, using 'opc' as fallback")

    # 3. Build HTML
    print("📝 Building HTML...")
    html = build_html(project_dir, meta, brand_spec)

    # Write HTML alongside output (same dir, same basename)
    html_path = Path(output_pdf).with_suffix(".html")
    html_path.parent.mkdir(parents=True, exist_ok=True)
    html_path.write_text(html, encoding="utf-8")
    size_kb = len(html) // 1024
    print(f"   HTML: {html_path} ({size_kb} KB)")

    # Check chapter count
    chapters_found = len(resolve_chapter_paths(project_dir, meta["chapters"]))
    if chapters_found == 0:
        print("   ⚠ No markdown chapters found. Add .md files to project directory.")

    if args.html_only:
        print(f"\n✅ HTML generated (--html-only). Skipping PDF.")
        return 0

    # 4. Generate PDF
    result = generate_pdf(str(html_path), output_pdf, meta=meta, brand_spec=brand_spec)
    if result:
        print(f"\n✅ Done: {output_pdf}")
        return 0
    else:
        print(f"\n❌ PDF generation failed. HTML is at: {html_path}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
