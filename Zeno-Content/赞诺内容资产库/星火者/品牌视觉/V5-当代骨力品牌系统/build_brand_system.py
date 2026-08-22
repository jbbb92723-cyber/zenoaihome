from __future__ import annotations

from pathlib import Path
from xml.sax.saxutils import escape

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont


ROOT = Path(__file__).resolve().parent
FONT_MEDIUM = Path(r"C:\WINDOWS\Fonts\Noto Sans SC Medium (TrueType).otf")
FONT_REGULAR = Path(r"C:\WINDOWS\Fonts\Noto Sans SC (TrueType).otf")

INK = "#111111"
BONE = "#F4F1E8"
CINNABAR = "#9E2B25"
MUTED = "#444039"


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


def wordmark_paths() -> list[str]:
    font = TTFont(FONT_MEDIUM)
    upm = font["head"].unitsPerEm
    x = 68.0
    paths: list[str] = []
    scales = (0.955, 0.925, 0.965)
    tracking = (7, 5)
    y_offsets = (0, -2, 0)
    for index, char in enumerate("星火者"):
        x_scale = 0.278 * scales[index]
        transform = (x_scale, 0, 0, -0.278, x, 260 + y_offsets[index])
        paths.append(glyph_path(font, char, transform))
        x += upm * x_scale
        if index < 2:
            x += tracking[index]
    font.close()
    return paths


def red_axis(dx: float = 0, dy: float = 0, color: str = CINNABAR) -> str:
    path = f"M{456 + dx:.2f} {14 + dy:.2f} L{481 + dx:.2f} {10 + dy:.2f} V{33 + dy:.2f} H{456 + dx:.2f} Z"
    return f'<path d="{path}" fill="{color}"/>'


def wordmark_fragment(color: str, accent: str) -> str:
    paths = "\n    ".join(f'<path d="{escape(d)}"/>' for d in wordmark_paths())
    return f'''<g fill="{color}">
    {paths}
  </g>
  {red_axis(color=accent)}'''


def write_main(filename: str, title: str, color: str, accent: str) -> None:
    fragment = wordmark_fragment(color, accent)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="50 0 830 305" role="img" aria-labelledby="title desc">
  <title id="title">{title}</title>
  <desc id="desc">星火者当代骨力字标。火字中轴向上延伸，以唯一朱砂笔画形成行动记忆点。</desc>
  {fragment}
</svg>
'''
    (ROOT / filename).write_text(svg, encoding="utf-8")


def centered_support_text(text: str, baseline: float, scale: float, tracking: float, color: str) -> str:
    paths, end = text_paths(text, FONT_REGULAR, 0, baseline, scale, 0.95, tracking)
    width = end
    paths, _ = text_paths(text, FONT_REGULAR, (960 - width) / 2, baseline, scale, 0.95, tracking)
    joined = "\n    ".join(f'<path d="{escape(d)}"/>' for d in paths)
    return f'<g fill="{color}">\n    {joined}\n  </g>'


def write_lockup(
    filename: str,
    title: str,
    color: str,
    accent: str,
    support_color: str,
    endorsed: bool = False,
) -> None:
    fragment = wordmark_fragment(color, accent)
    descriptor = centered_support_text("创业实践共同体", 368, 0.050, 13, support_color)
    endorsement = ""
    height = 430
    if endorsed:
        endorsement = centered_support_text("ZENO赞诺发起", 426, 0.034, 6, support_color)
        height = 475
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 {height}" role="img" aria-labelledby="title desc">
  <title id="title">{title}</title>
  <desc id="desc">星火者主标与创业实践共同体描述组合。{('下方注明 ZENO赞诺发起。' if endorsed else '')}</desc>
  {fragment}
  {descriptor}
  {endorsement}
</svg>
'''
    (ROOT / filename).write_text(svg, encoding="utf-8")


def fire_mark_fragment(color: str, accent: str, start_x: float, baseline: float, scale: float) -> str:
    font = TTFont(FONT_MEDIUM)
    fire = glyph_path(font, "火", (scale * 0.925, 0, 0, -scale, start_x, baseline))
    font.close()
    unit_x = scale * 0.925
    cap_left = start_x + 451 * unit_x
    cap_right = start_x + 548 * unit_x
    glyph_top = baseline - 829 * scale
    cap = (
        f"M{cap_left:.2f} {glyph_top - 21:.2f} "
        f"L{cap_right:.2f} {glyph_top - 25:.2f} "
        f"V{glyph_top + 2:.2f} H{cap_left:.2f} Z"
    )
    return f'<path d="{escape(fire)}" fill="{color}"/>\n  <path d="{cap}" fill="{accent}"/>'


def write_fire_mark() -> None:
    fragment = fire_mark_fragment(INK, CINNABAR, 20, 225, 0.23)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 260" role="img" aria-labelledby="title desc">
  <title id="title">星火者火字辅助印记</title>
  <desc id="desc">从星火者主标直接提取的火字印记，保留向上延伸的朱砂中轴。</desc>
  {fragment}
</svg>
'''
    (ROOT / "星火者-火字印记.svg").write_text(svg, encoding="utf-8")


def write_avatar() -> None:
    fragment = fire_mark_fragment(INK, CINNABAR, 70, 405, 0.38)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-labelledby="title desc">
  <title id="title">星火者头像版</title>
  <desc id="desc">骨纸背景上的星火者火字辅助印记。</desc>
  <rect width="512" height="512" fill="{BONE}"/>
  {fragment}
</svg>
'''
    (ROOT / "星火者-头像版.svg").write_text(svg, encoding="utf-8")


def preview_html() -> None:
    html = '''<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>星火者当代骨力品牌系统</title>
  <style>
    *{box-sizing:border-box}html,body{margin:0;background:#d7d3c9;color:#111;font-family:system-ui,"Microsoft YaHei",sans-serif}
    main{width:1600px;margin:0 auto;background:#f4f1e8}
    header{height:142px;display:flex;justify-content:space-between;align-items:flex-end;padding:40px 64px 28px;border-bottom:1px solid #dbd3c4}
    h1{margin:0;font-size:27px;line-height:1.2;letter-spacing:0}header p{margin:9px 0 0;color:#625d55;font-size:13px}.meta{text-align:right;color:#6d675e;font-size:11px;line-height:1.8}
    .hero{height:340px;display:grid;place-items:center;padding:48px 140px;background:#f8f5ec}.hero img{width:800px;height:auto;display:block}
    .lockups{height:300px;display:grid;grid-template-columns:1.08fr .92fr;border-block:1px solid #dbd3c4}.standard,.reverse{display:grid;place-items:center;padding:42px 62px}.standard{background:#fff;border-right:1px solid #dbd3c4}.standard img{width:590px}.reverse{background:#111}.reverse img{width:520px}
    .applications{height:280px;display:grid;grid-template-columns:.72fr 1.28fr;border-bottom:1px solid #dbd3c4}
    .identity{display:grid;grid-template-columns:180px 1fr;gap:28px;align-items:center;padding:38px 54px;border-right:1px solid #dbd3c4;background:#e7dfcf}.avatar{width:156px;height:156px;display:block;border:1px solid #cfc5b4}.identity h2{margin:0 0 10px;font-size:21px}.identity p{margin:0;color:#5d574f;font-size:13px;line-height:1.8}.identity b{color:#9e2b25;font-weight:700}
    .practice{display:grid;grid-template-rows:56px 1fr;background:#f8f5ec}.practice-head{display:flex;align-items:center;justify-content:space-between;padding:0 32px;border-bottom:1px solid #dbd3c4}.practice-head img{width:126px}.practice-head span{font-size:11px;color:#6f685f}.practice-body{display:grid;grid-template-columns:1fr 1fr;gap:38px;padding:28px 34px}.work h3{margin:0 0 8px;font-size:20px}.work p{margin:0;color:#625d55;font-size:12px;line-height:1.8}.facts{display:grid;grid-template-columns:repeat(3,1fr);border-left:1px solid #dbd3c4}.fact{display:grid;place-items:center;text-align:center;border-right:1px solid #dbd3c4}.fact strong{display:block;font-size:20px}.fact span{display:block;margin-top:5px;color:#756e63;font-size:10px}
    .bottom{height:220px;display:grid;grid-template-columns:1.3fr .7fr}.sizes{padding:32px 64px 36px;border-right:1px solid #dbd3c4}.label{margin-bottom:13px;color:#756e63;font-size:11px;font-weight:700;letter-spacing:.12em}.size-row{height:104px;display:flex;align-items:center;justify-content:space-between;padding:16px 26px;background:#f8f5ec;border:1px solid #dbd3c4}.size-row img{display:block;height:auto}
    .principle{padding:32px 46px}.principle blockquote{margin:22px 0 0;padding-left:18px;border-left:3px solid #9e2b25;font-size:20px;line-height:1.5}.principle p{margin:10px 0 0;color:#625d55;font-size:12px;line-height:1.7}
    footer{height:68px;display:flex;align-items:center;justify-content:space-between;padding:0 64px;background:#111;color:#bdb6aa;font-size:11px}footer strong{color:#f4f1e8}
  </style>
</head>
<body>
  <main>
    <header><div><h1>星火者｜当代骨力</h1><p>不是画一团火，而是让“正在行动的人”成为第一识别。</p></div><div class="meta">PRACTICE COMMUNITY<br>IDENTITY SYSTEM / 2026.08</div></header>
    <section class="hero"><img src="星火者-主标-彩色.svg" alt="星火者主标"></section>
    <section class="lockups"><div class="standard"><img src="星火者-标准组合-彩色.svg" alt="标准组合"></div><div class="reverse"><img src="星火者-ZENO赞诺背书-反白.svg" alt="ZENO赞诺背书反白版"></div></section>
    <section class="applications">
      <div class="identity"><img class="avatar" src="星火者-头像版.svg" alt="星火者头像"><div><h2>从字标里长出来的印记</h2><p>头像只保留定制“火”字与朱砂中轴。它是辅助识别，<b>不替代完整的“星火者”名称</b>。</p></div></div>
      <div class="practice"><div class="practice-head"><img src="星火者-主标-彩色.svg" alt=""><span>成员实践档案 / 01</span></div><div class="practice-body"><div class="work"><h3>带着正在做的事来。</h3><p>真实问题 · 行动复盘 · 有限连接<br>不以群消息和身份感证明价值。</p></div><div class="facts"><div class="fact"><div><strong>8-10</strong><span>首期人数</span></div></div><div class="fact"><div><strong>90</strong><span>实践天数</span></div></div><div class="fact"><div><strong>1</strong><span>具体推进</span></div></div></div></div></div>
    </section>
    <section class="bottom"><div class="sizes"><div class="label">WORDMARK / SMALL SIZE</div><div class="size-row"><img src="星火者-主标-小尺寸.svg" style="width:230px" alt=""><img src="星火者-主标-小尺寸.svg" style="width:160px" alt=""><img src="星火者-主标-小尺寸.svg" style="width:96px" alt=""></div></div><div class="principle"><div class="label">BRAND PRINCIPLE</div><blockquote>独立行动，<br>有边界地连接。</blockquote><p>朱砂只出现一次，用于火字中轴；其余依靠字形、比例和留白建立力量。</p></div></section>
    <footer><span><strong>星火者</strong> · 创业实践共同体</span><span>由 ZENO赞诺 发起</span><span>#111111 · #F4F1E8 · #9E2B25</span></footer>
  </main>
</body>
</html>'''
    (ROOT / "preview.html").write_text(html, encoding="utf-8")


def main() -> None:
    write_main("星火者-主标-彩色.svg", "星火者当代骨力主标彩色版", INK, CINNABAR)
    write_main("星火者-主标-小尺寸.svg", "星火者当代骨力主标小尺寸版", INK, CINNABAR)
    write_main("星火者-主标-单色.svg", "星火者当代骨力主标单色版", INK, INK)
    write_main("星火者-主标-反白.svg", "星火者当代骨力主标反白版", BONE, BONE)
    write_lockup("星火者-标准组合-彩色.svg", "星火者创业实践共同体标准组合", INK, CINNABAR, MUTED)
    write_lockup("星火者-标准组合-单色.svg", "星火者创业实践共同体标准单色组合", INK, INK, INK)
    write_lockup("星火者-标准组合-反白.svg", "星火者创业实践共同体标准反白组合", BONE, BONE, BONE)
    write_lockup("星火者-ZENO赞诺背书-彩色.svg", "星火者 ZENO赞诺发起背书版", INK, CINNABAR, MUTED, True)
    write_lockup("星火者-ZENO赞诺背书-反白.svg", "星火者 ZENO赞诺发起背书反白版", BONE, BONE, BONE, True)
    write_fire_mark()
    write_avatar()
    preview_html()


if __name__ == "__main__":
    main()
