from __future__ import annotations

from pathlib import Path
import json

import fitz


BOOKS = [
    Path(r"I:\赞诺【电子书】\装修电子书库 B\[专业书籍网络图书馆]-人体工程学图解.pdf"),
    Path(r"I:\赞诺【电子书】\装修电子书库 B\住宅设计解剖书.pdf"),
    Path(r"I:\赞诺【电子书】\装修电子书库 B\小户型改造攻略.pdf"),
    Path(r"I:\赞诺【电子书】\装修电子书库 B\照明设计终极圣经.pdf"),
    Path(r"I:\赞诺【电子书】\装修电子书库 B\装修，做好三件事就够了.pdf"),
]


def inspect_book(path: Path) -> dict:
    doc = fitz.open(str(path))
    toc = doc.get_toc(simple=True)
    samples = []
    for idx in [0, 1, 2, 3, 4, 5, 10, 20, 30, 50, 80, 120, 160, 220]:
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
                    "text": text[:1200],
                }
            )
    result = {
        "file": str(path),
        "name": path.name,
        "exists": path.exists(),
        "pages": doc.page_count,
        "toc_count": len(toc),
        "toc_sample": toc[:80],
        "samples": samples,
    }
    doc.close()
    return result


def main() -> None:
    out_dir = Path("tmp/renovation-design-inspect")
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
            for row in item["toc_sample"][:30]:
                print(row)
        print("samples:")
        for sample in item["samples"][:6]:
            text = sample["text"].replace("\n", " / ")
            print(
                f"p{sample['page']} chars={sample['chars']} images={sample['images']} "
                f"{text[:220]}"
            )
    print(f"\nwrote {out_dir / 'inspect.json'}")


if __name__ == "__main__":
    main()
