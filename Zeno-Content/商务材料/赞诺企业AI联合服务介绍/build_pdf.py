from pathlib import Path

import fitz


ROOT = Path(r"G:\Zenoaihome.com")
SOURCE_PDF = Path(
    r"D:\xwechat_files\wxid_nxemy9axw6aq12_e7f7\msg\file\2026-08\ZygoteAI公司介绍v4.pdf"
)
CUSTOM_PDF = ROOT / "tmp" / "pdfs" / "zeno-enterprise-ai" / "custom-pages.pdf"
OUTPUT_PDF = ROOT / "output" / "pdf" / "赞诺企业AI应用服务-联合团队介绍.pdf"

DARK_SOURCE_PAGES = {1, 8, 16, 17}
DARK_FILL = (16 / 255, 32 / 255, 51 / 255)
WHITE_FILL = (1, 1, 1)
ORANGE = (230 / 255, 111 / 255, 67 / 255)
GRAY = (112 / 255, 124 / 255, 134 / 255)


def replace_legacy_brand(page: fitz.Page, source_index: int) -> None:
    is_dark = source_index in DARK_SOURCE_PAGES
    fill = DARK_FILL if is_dark else WHITE_FILL
    occurrences = page.search_for("ZygoteAI")
    replacements: list[tuple[fitz.Rect, bool]] = []

    if source_index == 1:
        heading_parts = [rect for rect in occurrences if rect.y0 < 120]
        heading_parts.extend(page.search_for("是做什么的"))
        if heading_parts:
            heading_cover = fitz.Rect(
                min(rect.x0 for rect in heading_parts) - 2,
                min(rect.y0 for rect in heading_parts) - 3,
                max(rect.x1 for rect in heading_parts) + 3,
                max(rect.y1 for rect in heading_parts) + 3,
            )
            page.add_redact_annot(heading_cover, fill=fill)
            replacements.append((heading_cover, True))
            occurrences = [rect for rect in occurrences if rect.y0 >= 120]

    for rect in occurrences:
        is_heading = False
        cover = fitz.Rect(rect.x0 - 1, rect.y0 - 1, rect.x1 + 66, rect.y1 + 1)
        page.add_redact_annot(cover, fill=fill)
        replacements.append((cover, is_heading))

    if replacements:
        page.apply_redactions()

    for rect, is_heading in replacements:
        if is_heading:
            page.insert_textbox(
                rect,
                "联合服务团队能做什么",
                fontname="china-s",
                fontsize=19,
                color=(1, 1, 1),
                align=fitz.TEXT_ALIGN_LEFT,
            )
        else:
            page.insert_textbox(
                rect,
                "ZENO / 联合服务团队",
                fontname="china-s",
                fontsize=6.2,
                color=(0.72, 0.76, 0.8) if is_dark else GRAY,
                align=fitz.TEXT_ALIGN_LEFT,
            )

    page.insert_textbox(
        fitz.Rect(710, 13, 930, 27),
        "联合服务团队既往能力与项目",
        fontname="china-s",
        fontsize=6.5,
        color=(0.76, 0.79, 0.83) if is_dark else GRAY,
        align=fitz.TEXT_ALIGN_RIGHT,
    )
    page.insert_textbox(
        fitz.Rect(345, 506, 760, 520),
        "案例与数据来自联合服务团队原材料，正式签约前复核授权、口径与适用边界",
        fontname="china-s",
        fontsize=5.4,
        color=(0.67, 0.71, 0.75) if is_dark else GRAY,
        align=fitz.TEXT_ALIGN_CENTER,
    )


def build() -> None:
    custom = fitz.open(CUSTOM_PDF)
    source = fitz.open(SOURCE_PDF)
    output = fitz.open()

    output.insert_pdf(custom, from_page=0, to_page=4)

    # Preserve the original team overview, services, training, FDE, cases,
    # team and representative projects. The source cover and contact page
    # are replaced by Zeno-owned pages.
    for source_index in range(1, 22):
        output.insert_pdf(source, from_page=source_index, to_page=source_index)
        replace_legacy_brand(output[-1], source_index)

    output.insert_pdf(custom, from_page=5, to_page=5)
    output.set_metadata(
        {
            "title": "赞诺企业AI应用服务｜联合团队介绍",
            "author": "广西赞诺数智科技有限公司",
            "subject": "企业AI培训、场景验证、工作流、知识库、智能体与系统交付",
            "keywords": "ZENO, 赞诺, 企业AI, FDE, AI培训, 知识库, 智能体",
            "creator": "ZENO 赞诺",
        }
    )

    OUTPUT_PDF.parent.mkdir(parents=True, exist_ok=True)
    if OUTPUT_PDF.exists():
        OUTPUT_PDF.unlink()
    output.save(OUTPUT_PDF, garbage=4, deflate=True, clean=True)
    output.close()
    source.close()
    custom.close()
    print(OUTPUT_PDF)


if __name__ == "__main__":
    build()
