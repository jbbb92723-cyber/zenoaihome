from __future__ import annotations

import re
from pathlib import Path

import markdown
from weasyprint import HTML


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "南宁OPC创新黑客松城市决赛合作方案V1.md"
OUTPUT = Path(r"G:\Zenoaihome.com\output\pdf\南宁OPC创新黑客松城市决赛合作方案-V1.pdf")


def strip_front_matter(text: str) -> str:
    return re.sub(r"\A---\s*\n.*?\n---\s*\n", "", text, count=1, flags=re.S)


def split_cover(text: str) -> tuple[str, list[str]]:
    text = strip_front_matter(text)
    text = re.sub(
        r"\A# 南宁 OPC 创新黑客松城市决赛\s*\n\s*## AI\+东盟场景与传统产业微创新验证站\s*\n?",
        "",
        text,
        count=1,
    )
    headings = re.findall(r"^# (.+)$", text, flags=re.M)
    return text, headings


def make_toc(headings: list[str]) -> str:
    return "".join(f'<li><span>{heading}</span></li>' for heading in headings)


def build_html() -> str:
    source_text = SOURCE.read_text(encoding="utf-8")
    body_text, headings = split_cover(source_text)
    body_html = markdown.markdown(
        body_text,
        extensions=["tables", "fenced_code", "sane_lists", "toc"],
        output_format="html5",
    )
    font_path = Path(r"C:\Windows\Fonts\Deng.ttf").as_uri()
    bold_font_path = Path(r"C:\Windows\Fonts\Dengb.ttf").as_uri()
    toc_html = make_toc(headings)
    return f"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <title>南宁 OPC 创新黑客松城市决赛合作方案</title>
  <style>
    @font-face {{
      font-family: "Noto Sans SC Local";
      src: url("{font_path}");
      font-weight: 400;
    }}
    @font-face {{
      font-family: "Noto Sans SC Local";
      src: url("{bold_font_path}");
      font-weight: 700;
    }}
    @page {{
      size: A4;
      margin: 17mm 16mm 16mm 17mm;
      @top-left {{
        content: "南宁 OPC 创新黑客松城市决赛";
        color: #87919a;
        font-size: 8pt;
      }}
      @top-right {{
        content: "AI+东盟场景与传统产业微创新验证站";
        color: #87919a;
        font-size: 8pt;
      }}
      @bottom-left {{
        content: "广西赞诺数智科技有限公司 · 讨论稿";
        color: #87919a;
        font-size: 8pt;
      }}
      @bottom-right {{
        content: counter(page);
        color: #87919a;
        font-size: 8pt;
      }}
    }}
    @page cover {{
      size: A4;
      margin: 0;
      @top-left {{ content: none; }}
      @top-right {{ content: none; }}
      @bottom-left {{ content: none; }}
      @bottom-right {{ content: none; }}
    }}
    * {{ box-sizing: border-box; }}
    html, body {{
      margin: 0;
      padding: 0;
      color: #18232e;
      background: #ffffff;
      font-family: "Noto Sans SC Local", "Microsoft YaHei", sans-serif;
      font-size: 9.7pt;
      line-height: 1.72;
      letter-spacing: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }}
    .cover {{
      page: cover;
      height: 297mm;
      min-height: 297mm;
      padding: 25mm 21mm 20mm;
      background: #102033;
      color: #ffffff;
      position: relative;
      overflow: hidden;
    }}
    .cover::after {{
      content: "";
      position: absolute;
      left: 21mm;
      right: 21mm;
      bottom: 21mm;
      height: 2px;
      background: #e66f43;
    }}
    .cover-kicker {{
      display: inline-block;
      padding: 3mm 5mm;
      border: 1px solid rgba(255,255,255,.32);
      color: #f3c0aa;
      font-size: 9pt;
      letter-spacing: .04em;
    }}
    .cover h1 {{
      margin: 40mm 0 7mm;
      max-width: 158mm;
      font-size: 32pt;
      line-height: 1.22;
      font-weight: 700;
      color: #ffffff;
    }}
    .cover-subtitle {{
      max-width: 150mm;
      color: #f1c7b8;
      font-size: 17pt;
      line-height: 1.5;
      font-weight: 700;
    }}
    .cover-statement {{
      max-width: 144mm;
      margin-top: 17mm;
      color: rgba(255,255,255,.78);
      font-size: 12pt;
      line-height: 1.9;
    }}
    .cover-meta {{
      position: absolute;
      left: 21mm;
      bottom: 31mm;
      display: grid;
      gap: 2mm;
      color: rgba(255,255,255,.68);
      font-size: 8.7pt;
      line-height: 1.5;
    }}
    .cover-meta strong {{ color: #ffffff; font-weight: 700; }}
    .toc-page {{ page-break-after: always; min-height: 257mm; }}
    .toc-page h1 {{
      margin: 0 0 10mm;
      padding-bottom: 4mm;
      border-bottom: 3px solid #e66f43;
      color: #102033;
      font-size: 24pt;
      line-height: 1.3;
    }}
    .toc-page ol {{
      margin: 0;
      padding-left: 7mm;
      columns: 2;
      column-gap: 12mm;
    }}
    .toc-page li {{
      break-inside: avoid;
      margin: 0 0 4mm;
      padding-left: 2mm;
      color: #40515d;
      font-size: 10pt;
    }}
    .toc-page li::marker {{ color: #e66f43; font-weight: 700; }}
    .body {{ max-width: 178mm; }}
    h1, h2, h3, h4, p, ul, ol, table, blockquote {{ margin-top: 0; }}
    h1 {{
      break-before: auto;
      break-after: avoid;
      margin: 0 0 7mm;
      padding: 3mm 0 3mm 5mm;
      border-left: 4px solid #e66f43;
      color: #102033;
      font-size: 20pt;
      line-height: 1.35;
      font-weight: 700;
    }}
    h2 {{
      break-after: avoid;
      margin: 8mm 0 3mm;
      color: #205d58;
      font-size: 13.5pt;
      line-height: 1.4;
      font-weight: 700;
    }}
    h3 {{
      break-after: avoid;
      margin: 5mm 0 2mm;
      color: #102033;
      font-size: 11.2pt;
      line-height: 1.45;
      font-weight: 700;
    }}
    p {{ margin-bottom: 3mm; }}
    strong {{ color: #102033; font-weight: 700; }}
    blockquote {{
      margin: 5mm 0;
      padding: 4mm 5mm;
      border-left: 4px solid #e66f43;
      background: #fff4ee;
      color: #5d4035;
      break-inside: avoid;
    }}
    ul, ol {{ margin-bottom: 4mm; padding-left: 7mm; }}
    li {{ margin-bottom: 1.4mm; }}
    table {{
      width: 100%;
      margin: 4mm 0 6mm;
      border-collapse: collapse;
      font-size: 8.35pt;
      line-height: 1.52;
      break-inside: auto;
    }}
    thead {{ display: table-header-group; }}
    tr {{ break-inside: avoid; }}
    th {{
      padding: 2.4mm 2.2mm;
      border: 1px solid #d8e0e2;
      background: #102033;
      color: #ffffff;
      text-align: left;
      font-weight: 700;
    }}
    td {{
      padding: 2.2mm;
      border: 1px solid #d8e0e2;
      vertical-align: top;
    }}
    tbody tr:nth-child(even) td {{ background: #f4f8f7; }}
    tbody tr:nth-child(odd) td {{ background: #ffffff; }}
    code {{
      padding: .3mm 1mm;
      background: #eef1f2;
      color: #b24d2b;
      font-family: monospace;
      font-size: .9em;
    }}
    pre {{
      padding: 4mm;
      overflow-wrap: anywhere;
      background: #f2f5f5;
      border: 1px solid #d8e0e2;
      break-inside: avoid;
    }}
    hr {{
      height: 1px;
      margin: 8mm 0;
      border: 0;
      background: #d8e0e2;
    }}
    a {{ color: #b24d2b; text-decoration: none; }}
    .notice {{
      margin: 5mm 0;
      padding: 4mm 5mm;
      border: 1px solid #d6c99e;
      background: #fffbea;
      color: #60542e;
      break-inside: avoid;
    }}
    .end-note {{
      margin-top: 10mm;
      padding-top: 5mm;
      border-top: 2px solid #e66f43;
      color: #65737d;
      font-size: 8.7pt;
    }}
  </style>
</head>
<body>
  <section class="cover">
    <div class="cover-kicker">城市合作方案 · 讨论稿 · V1.0</div>
    <h1>南宁 OPC 创新黑客松<br>城市决赛</h1>
    <div class="cover-subtitle">AI+东盟场景与传统产业微创新验证站</div>
    <p class="cover-statement">把全国赛事的项目发现机制，转译成南宁企业、园区、社区、高校和创业者可以共同参与的场景验证机制。</p>
    <div class="cover-meta">
      <div><strong>合作提案方</strong>　广西赞诺数智科技有限公司</div>
      <div><strong>本地协作载体</strong>　南A中心东盟谷 OPC 社区</div>
      <div><strong>实践者网络</strong>　星火者共同体</div>
      <div><strong>日期</strong>　2026 年 8 月 21 日</div>
      <div>OPC 圈赛事 IP、合作品牌、赛程和数据以书面确认为准</div>
    </div>
  </section>
  <section class="toc-page">
    <h1>目录</h1>
    <ol>{toc_html}</ol>
  </section>
  <main class="body">{body_html}</main>
</body>
</html>"""


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    html = build_html()
    HTML(string=html, base_url=str(ROOT)).write_pdf(str(OUTPUT), zoom=1)
    print(OUTPUT)


if __name__ == "__main__":
    main()
