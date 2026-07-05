from __future__ import annotations

from pathlib import Path
import json

import fitz


BOOKS = [
    Path(r"I:\赞诺【电子书】\装修电子书库 B\七日掌握设计配色基础.pdf"),
    Path(r"I:\赞诺【电子书】\装修电子书库 B\色彩搭配的黄金法则.pdf"),
    Path(r"I:\赞诺【电子书】\装修电子书库 B\色彩的性格.pdf"),
    Path(r"I:\赞诺【电子书】\装修电子书库 B\国之色中国传统色彩搭配图鉴.pdf"),
]


def inspect_book(path: Path) -> dict:
    doc = fitz.open(str(path))
    toc = doc.get_toc(simple=True)
    samples = []
    for idx in [0, 1, 2, 3, 4, 5, 8, 10, 20, 30, 50, 80, 120, 180, 240]:
        if idx >= doc.page_count:
            continue
        page = doc.load_page(idx)
        text = page.get_text("text").strip().replace("\x0c", "")
        images = len(page.get_images(full=True))
        if text or images:
            samples.append(
                {
                    "page": idx + 1,
                    "chars": len(text),
                    "images": images,
                    "text": text[:1400],
                }
            )
    result = {
        "file": str(path),
        "name": path.name,
        "exists": path.exists(),
        "pages": doc.page_count,
        "toc_count": len(toc),
        "toc_sample": toc[:100],
        "samples": samples,
    }
    doc.close()
    return result


def main() -> None:
    out_dir = Path("tmp/color-design-inspect")
    out_dir.mkdir(parents=True, exist_ok=True)
    results = [inspect_book(path) for path in BOOKS]
    (out_dir / "inspect.json").write_text(
        json.dumps(results, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    for item in results:
        print(f"\n### {item['name']}")
        print(f"exists={item['exists']} pages={item['pages']} toc={item['toc_count']}")
        if item["toc_sample"]:
            print("toc_sample:")
            for row in item["toc_sample"][:40]:
                print(row)
        print("samples:")
        for sample in item["samples"][:8]:
            text = sample["text"].replace("\n", " / ")
            print(
                f"p{sample['page']} chars={sample['chars']} images={sample['images']} "
                f"{text[:240]}"
            )
    print(f"\nwrote {out_dir / 'inspect.json'}")


if __name__ == "__main__":
    main()
