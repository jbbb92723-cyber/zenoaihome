from __future__ import annotations

from pathlib import Path
from xml.sax.saxutils import escape

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont


ROOT = Path(__file__).resolve().parent
FONT_MEDIUM = Path(r"C:\WINDOWS\Fonts\Noto Sans SC Medium (TrueType).otf")
FONT_BOLD = Path(r"C:\WINDOWS\Fonts\Noto Sans SC Bold (TrueType).otf")
FONT_REGULAR = Path(r"C:\WINDOWS\Fonts\Noto Sans SC (TrueType).otf")

INK = "#111111"
BONE = "#F4F1E8"
CINNABAR = "#9E2B25"
LEGAL_NAME = "广西赞诺数智科技有限公司"


def glyph_path(font: TTFont, char: str, transform: tuple[float, ...]) -> str:
    cmap = font.getBestCmap()
    glyph_name = cmap.get(ord(char))
    if glyph_name is None:
        raise ValueError(f"Font does not contain {char}")
    glyph_set = font.getGlyphSet()
    path_pen = SVGPathPen(glyph_set)
    transformed_pen = TransformPen(path_pen, transform)
    glyph_set[glyph_name].draw(transformed_pen)
    return path_pen.getCommands()


def text_paths(
    text: str,
    font_path: Path,
    start_x: float,
    baseline: float,
    scale: float,
    x_scale: float = 1,
    tracking: float = 0,
) -> tuple[list[str], float]:
    font = TTFont(font_path)
    cmap = font.getBestCmap()
    x = start_x
    paths: list[str] = []
    for index, char in enumerate(text):
        glyph_name = cmap[ord(char)]
        transform = (scale * x_scale, 0, 0, -scale, x, baseline)
        paths.append(glyph_path(font, char, transform))
        x += font["hmtx"][glyph_name][0] * scale * x_scale
        if index < len(text) - 1:
            x += tracking
    font.close()
    return paths, x


def polygon(points: tuple[tuple[float, float], ...], dx: float = 0, dy: float = 0) -> str:
    values = " ".join(f"{x + dx:.2f},{y + dy:.2f}" for x, y in points)
    return f"M{values.replace(' ', ' L')} Z"


O_CUT = ((600, 52), (614, 46), (639, 75), (624, 89))
O_INSERT = ((608, 59), (614, 56), (630, 74), (624, 79))


def wordmark_fragment(
    origin_x: float,
    origin_y: float,
    color: str,
    accent: str,
    mask_id: str,
    canvas_w: float,
    canvas_h: float,
) -> str:
    latin, latin_end = text_paths(
        "ZENO",
        FONT_BOLD,
        start_x=50 + origin_x,
        baseline=210 + origin_y,
        scale=0.205,
        tracking=13,
    )
    chinese, _ = text_paths(
        "赞诺",
        FONT_MEDIUM,
        start_x=latin_end + 24,
        baseline=207 + origin_y,
        scale=0.188,
        x_scale=0.94,
        tracking=7,
    )
    paths = "\n    ".join(f'<path d="{escape(d)}"/>' for d in (*latin, *chinese))
    cut = polygon(O_CUT, origin_x, origin_y)
    insert = polygon(O_INSERT, origin_x, origin_y)
    return f'''<defs>
    <mask id="{mask_id}" maskUnits="userSpaceOnUse" x="0" y="0" width="{canvas_w}" height="{canvas_h}">
      <rect width="{canvas_w}" height="{canvas_h}" fill="white"/>
      <path d="{cut}" fill="black"/>
    </mask>
  </defs>
  <g fill="{color}" mask="url(#{mask_id})">
    {paths}
  </g>
  <path d="{insert}" fill="{accent}"/>'''


def main_logo(filename: str, title: str, color: str, accent: str, viewbox: str = "0 0 1080 260") -> None:
    fragment = wordmark_fragment(0, 0, color, accent, "wordmark-cut", 1080, 260)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" role="img" aria-labelledby="title desc">
  <title id="title">{title}</title>
  <desc id="desc">ZENO赞诺企业母标。现代黑体字标，O 的开口由一枚朱砂判断笔画闭合。</desc>
  {fragment}
</svg>
'''
    (ROOT / filename).write_text(svg, encoding="utf-8")


def organization_logo(filename: str, title: str, color: str, accent: str, legal_color: str) -> None:
    fragment = wordmark_fragment(60, 12, color, accent, "organization-cut", 1200, 360)
    legal_paths, legal_end = text_paths(
        LEGAL_NAME,
        FONT_REGULAR,
        start_x=0,
        baseline=326,
        scale=0.044,
        x_scale=0.95,
        tracking=5,
    )
    legal_width = legal_end
    legal_x = (1200 - legal_width) / 2
    legal_paths, _ = text_paths(
        LEGAL_NAME,
        FONT_REGULAR,
        start_x=legal_x,
        baseline=326,
        scale=0.044,
        x_scale=0.95,
        tracking=5,
    )
    legal = "\n    ".join(f'<path d="{escape(d)}"/>' for d in legal_paths)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 360" role="img" aria-labelledby="title desc">
  <title id="title">{title}</title>
  <desc id="desc">ZENO赞诺企业母标，下方为法定名称广西赞诺数智科技有限公司，用于赛事协办单位与正式机构署名。</desc>
  {fragment}
  <g fill="{legal_color}">
    {legal}
  </g>
</svg>
'''
    (ROOT / filename).write_text(svg, encoding="utf-8")


def o_mark() -> None:
    font = TTFont(FONT_BOLD)
    o_path = glyph_path(font, "O", (0.25, 0, 0, -0.25, 22, 210))
    font.close()
    cut = polygon(((171, 18), (184, 13), (208, 41), (195, 54)))
    insert = polygon(((179, 25), (184, 23), (199, 41), (194, 45)))
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" role="img" aria-labelledby="title desc">
  <title id="title">ZENO赞诺 O 印记</title>
  <desc id="desc">从企业母标 O 提炼的辅助印记，只用于头像、网站图标和极小尺寸场景。</desc>
  <defs>
    <mask id="o-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="240" height="240">
      <rect width="240" height="240" fill="white"/>
      <path d="{cut}" fill="black"/>
    </mask>
  </defs>
  <path d="{escape(o_path)}" fill="{INK}" mask="url(#o-cut)"/>
  <path d="{insert}" fill="{CINNABAR}"/>
</svg>
'''
    (ROOT / "ZENO赞诺-O印记.svg").write_text(svg, encoding="utf-8")


def preview_html() -> None:
    html = '''<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>ZENO赞诺企业母标</title>
  <style>
    *{box-sizing:border-box}html,body{margin:0;background:#d7d3c9;color:#111;font-family:system-ui,"Microsoft YaHei",sans-serif}
    main{width:1600px;margin:0 auto;background:#f4f1e8}
    header{height:152px;display:flex;justify-content:space-between;align-items:flex-end;padding:42px 64px 30px;border-bottom:1px solid #dbd3c4}
    h1{margin:0;font-size:28px;line-height:1.2;letter-spacing:0}header p{margin:10px 0 0;color:#625d55;font-size:13px}
    .meta{text-align:right;color:#6d675e;font-size:11px;line-height:1.8}
    .hero{height:360px;display:grid;place-items:center;padding:54px 120px;background:#f8f5ec}
    .hero img{width:900px;height:auto;display:block}
    .applications{display:grid;grid-template-columns:1.2fr .8fr;border-top:1px solid #dbd3c4;border-bottom:1px solid #dbd3c4}
    .event{height:310px;display:grid;place-items:center;padding:50px 70px;background:#fff;border-right:1px solid #dbd3c4}
    .event img{width:680px;height:auto;display:block}
    .dark{height:310px;display:grid;place-items:center;padding:56px;background:#111}
    .dark img{width:520px;height:auto;display:block}
    .website{padding:42px 64px 46px}
    .label{margin-bottom:14px;color:#756e63;font-size:11px;font-weight:700;letter-spacing:.12em}
    .nav{height:56px;display:flex;align-items:center;justify-content:space-between;padding:0 28px;background:#f4f1e8;border:1px solid #dbd3c4}
    .nav img{width:154px;height:auto;display:block}.links{display:flex;gap:28px;color:#49443d;font-size:12px}.links b{color:#111}
    .bottom{display:grid;grid-template-columns:1.35fr .65fr;border-top:1px solid #dbd3c4}
    .sizes{padding:36px 64px 44px;border-right:1px solid #dbd3c4}
    .scale-row{height:104px;display:flex;align-items:center;justify-content:space-between;padding:18px 26px;background:#f8f5ec;border:1px solid #dbd3c4}
    .scale-row img{display:block;height:auto}.mark{padding:36px 46px 44px}.mark-wrap{height:104px;display:flex;align-items:center;gap:24px}
    .mark-wrap img{width:88px;height:88px}.mark-copy{font-size:12px;color:#625d55;line-height:1.75}.mark-copy strong{display:block;color:#111;font-size:14px}
    footer{height:68px;display:flex;align-items:center;justify-content:space-between;padding:0 64px;background:#e7dfcf;color:#59534b;font-size:11px}
  </style>
</head>
<body>
  <main>
    <header><div><h1>ZENO赞诺｜企业母标</h1><p>个人 IP 是信任主体，公司是正式合作与交付主体。</p></div><div class="meta">CARBON INK · BONE PAPER · CINNABAR<br>MASTER IDENTITY / 2026.08</div></header>
    <section class="hero"><img src="ZENO赞诺-主标-彩色.svg" alt="ZENO赞诺企业母标"></section>
    <section class="applications">
      <div class="event"><img src="ZENO赞诺-协办单位-彩色.svg" alt="协办单位机构版"></div>
      <div class="dark"><img src="ZENO赞诺-主标-反白.svg" alt="反白版"></div>
    </section>
    <section class="website"><div class="label">WEBSITE HEADER / 56PX</div><div class="nav"><img src="ZENO赞诺-网站导航.svg" alt="网站导航版"><div class="links"><b>首页</b><span>公开实践</span><span>AI 工具</span><span>项目合作</span><span>关于</span></div></div></section>
    <section class="bottom">
      <div class="sizes"><div class="label">LOGO WALL / SMALL SIZE</div><div class="scale-row"><img src="ZENO赞诺-协办单位-彩色.svg" style="width:360px" alt=""><img src="ZENO赞诺-协办单位-彩色.svg" style="width:250px" alt=""><img src="ZENO赞诺-协办单位-彩色.svg" style="width:160px" alt=""></div></div>
      <div class="mark"><div class="label">AUXILIARY MARK</div><div class="mark-wrap"><img src="ZENO赞诺-O印记.svg" alt="O辅助印记"><div class="mark-copy"><strong>开放，但不失判断。</strong>只用于头像、favicon 与极小尺寸；正式机构署名仍使用完整字标。</div></div></div>
    </section>
    <footer><span>协办单位提交：机构横版，不内嵌网址</span><span>法定名称：广西赞诺数智科技有限公司</span><span>zenoaihome.com</span></footer>
  </main>
</body>
</html>'''
    (ROOT / "preview.html").write_text(html, encoding="utf-8")


def main() -> None:
    main_logo("ZENO赞诺-主标-彩色.svg", "ZENO赞诺企业母标彩色版", INK, CINNABAR)
    main_logo("ZENO赞诺-主标-单色.svg", "ZENO赞诺企业母标单色版", INK, INK)
    main_logo("ZENO赞诺-主标-反白.svg", "ZENO赞诺企业母标反白版", BONE, BONE)
    main_logo("ZENO赞诺-网站导航.svg", "ZENO赞诺网站导航版", INK, CINNABAR, "32 36 1016 194")
    organization_logo("ZENO赞诺-协办单位-彩色.svg", "ZENO赞诺协办单位机构版", INK, CINNABAR, "#444039")
    organization_logo("ZENO赞诺-协办单位-单色.svg", "ZENO赞诺协办单位机构单色版", INK, INK, INK)
    organization_logo("ZENO赞诺-协办单位-反白.svg", "ZENO赞诺协办单位机构反白版", BONE, BONE, BONE)
    o_mark()
    preview_html()


if __name__ == "__main__":
    main()
