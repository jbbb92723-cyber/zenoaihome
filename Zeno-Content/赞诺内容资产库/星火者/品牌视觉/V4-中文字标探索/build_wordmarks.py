from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from xml.sax.saxutils import escape

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont


ROOT = Path(__file__).resolve().parent
CANVAS_W = 960
CANVAS_H = 320
TEXT = "星火者"


@dataclass(frozen=True)
class Concept:
    filename: str
    title: str
    description: str
    font_path: Path
    scale: float
    x_scales: tuple[float, float, float]
    tracking: tuple[float, float]
    baseline: float
    y_offsets: tuple[float, float, float]
    start_x: float
    mask_cut: str = ""
    additions: str = ""


CONCEPTS = (
    Concept(
        filename="01-当代骨力.svg",
        title="01 当代骨力",
        description="结构稳定、字面清楚，以克制的横向比例和向前收笔表达行动感。",
        font_path=Path(r"C:\WINDOWS\Fonts\Noto Sans SC Medium (TrueType).otf"),
        scale=0.278,
        x_scales=(0.955, 0.925, 0.965),
        tracking=(7, 5),
        baseline=260,
        y_offsets=(0, -2, 0),
        start_x=68,
        # 延长火字中轴，让三个字在不增加符号的前提下拥有更明确的骨力。
        additions='<path d="M455 14 H482 V32 H455 Z"/>',
    ),
    Concept(
        filename="02-文人克制.svg",
        title="02 文人克制",
        description="以现代宋体骨架、舒展字距和不完全齐平的光学基线建立东方文化感。",
        font_path=Path(r"C:\WINDOWS\Fonts\Source Han Serif SC Heavy (TrueType).ttf"),
        scale=0.267,
        x_scales=(0.91, 0.885, 0.92),
        tracking=(28, 24),
        baseline=263,
        y_offsets=(0, -4, 0),
        start_x=65,
    ),
    Concept(
        filename="03-行动切口.svg",
        title="03 行动切口",
        description="紧凑粗黑字面，在火字右下行动笔画留下唯一斜切记忆点。",
        font_path=Path(r"C:\WINDOWS\Fonts\Noto Sans SC Bold (TrueType).otf"),
        scale=0.276,
        x_scales=(0.945, 0.93, 0.955),
        tracking=(2, -1),
        baseline=261,
        y_offsets=(0, -1, 0),
        start_x=72,
        mask_cut='<path d="M500 239 L509 252 L552 222 L543 209 Z" fill="black"/>',
    ),
)


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


def make_paths(concept: Concept) -> list[str]:
    font = TTFont(concept.font_path)
    upm = font["head"].unitsPerEm
    paths: list[str] = []
    x = concept.start_x
    for index, char in enumerate(TEXT):
        x_scale = concept.scale * concept.x_scales[index]
        y_scale = concept.scale
        transform = (
            x_scale,
            0,
            0,
            -y_scale,
            x,
            concept.baseline + concept.y_offsets[index],
        )
        d = glyph_path(font, char, transform)
        paths.append(f'<path d="{escape(d)}"/>')
        x += upm * x_scale
        if index < len(concept.tracking):
            x += concept.tracking[index]
    font.close()
    return paths


def svg_for(concept: Concept) -> str:
    paths = "\n    ".join(make_paths(concept))
    mask = ""
    mask_attr = ""
    if concept.mask_cut:
        mask = (
            "\n  <defs>\n"
            '    <mask id="letterform-mask">\n'
            f'      <rect width="{CANVAS_W}" height="{CANVAS_H}" fill="white"/>\n'
            f"      {concept.mask_cut}\n"
            "    </mask>\n"
            "  </defs>"
        )
        mask_attr = ' mask="url(#letterform-mask)"'
    additions = f"\n    {concept.additions}" if concept.additions else ""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {CANVAS_W} {CANVAS_H}" role="img" aria-labelledby="title desc">
  <title id="title">{concept.title}</title>
  <desc id="desc">{concept.description}</desc>{mask}
  <g fill="#111111"{mask_attr}>
    {paths}{additions}
  </g>
</svg>
'''


def preview_html() -> str:
    cards = []
    for index, concept in enumerate(CONCEPTS, start=1):
        cards.append(
            f'''<article>
        <div class="number">0{index}</div>
        <h2>{concept.title.split(" ", 1)[1]}</h2>
        <div class="stage light"><img src="{concept.filename}" alt="{concept.title}"></div>
        <div class="stage dark"><img src="{concept.filename}" alt="{concept.title}反白"></div>
        <div class="sizes" aria-label="小尺寸对比">
          <img src="{concept.filename}" style="width:184px" alt="">
          <img src="{concept.filename}" style="width:112px" alt="">
          <img src="{concept.filename}" style="width:64px" alt="">
        </div>
      </article>'''
        )
    return f'''<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>星火者中文字标探索 V4</title>
  <style>
    *{{box-sizing:border-box}}html,body{{margin:0;background:#d9d9d5;color:#111;font-family:"Noto Sans SC","Microsoft YaHei",sans-serif}}
    main{{width:1600px;margin:0 auto;padding:72px 64px 80px}}
    header{{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:32px}}
    h1{{margin:0;font-size:26px;font-weight:600;letter-spacing:0}}header p{{margin:8px 0 0;color:#5b5b57;font-size:13px;letter-spacing:0}}
    .edition{{font-size:12px;color:#6a6a66;text-align:right;line-height:1.7}}
    .grid{{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}}
    article{{position:relative;background:#f7f7f3;border-top:3px solid #111;padding:28px 24px 24px}}
    .number{{position:absolute;right:24px;top:25px;color:#8b8b85;font-size:12px}}h2{{font-size:18px;margin:0 0 22px;font-weight:600;letter-spacing:0}}
    .stage{{height:226px;display:flex;align-items:center;justify-content:center;padding:34px 22px;border:1px solid #d7d7d1}}
    .stage img{{display:block;width:100%;height:auto}}.light{{background:#fff}}.dark{{margin-top:10px;background:#111;border-color:#111}}
    .dark img{{filter:invert(1)}}
    .sizes{{height:86px;margin-top:10px;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px;background:#ecece7;border:1px solid #d7d7d1}}
    .sizes img{{display:block;height:auto;max-width:100%}}
    footer{{display:flex;justify-content:space-between;margin-top:22px;padding-top:16px;border-top:1px solid #aaa9a3;color:#5f5f5a;font-size:12px}}
  </style>
</head>
<body>
  <main>
    <header><div><h1>星火者｜中文字标探索</h1><p>只看字形、比例、留白与识别，不看图标和应用效果。</p></div><div class="edition">BLACK / WHITE<br>V4 · 2026.08</div></header>
    <section class="grid">{"".join(cards)}</section>
    <footer><span>第一眼：星火者</span><span>第二眼：骨力 · 克制 · 行动</span><span>下一轮：只深化一个方向</span></footer>
  </main>
</body>
</html>
'''


def main() -> None:
    for concept in CONCEPTS:
        (ROOT / concept.filename).write_text(svg_for(concept), encoding="utf-8")
    (ROOT / "preview.html").write_text(preview_html(), encoding="utf-8")


if __name__ == "__main__":
    main()
