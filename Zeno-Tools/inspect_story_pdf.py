from __future__ import annotations

from pathlib import Path

import fitz


ROOT = Path("I:/赞诺【电子书】")


def main() -> None:
    matches = list(ROOT.rglob("*故事*麦基*.pdf")) + list(ROOT.rglob("*故事*罗伯特*.pdf"))
    seen: set[Path] = set()
    files: list[Path] = []
    for path in matches:
        if path not in seen:
            seen.add(path)
            files.append(path)

    print(f"matches={len(files)}")
    for path in files:
        print(f"path={path}")
        doc = fitz.open(str(path))
        print(f"pages={doc.page_count}")
        for idx in [0, 1, 2, 3, 4, 10, 20, 50, 100, 200, 300]:
            if idx >= doc.page_count:
                continue
            page = doc[idx]
            text = page.get_text().strip()
            images = page.get_images(full=True)
            print(
                f"page={idx + 1} text_len={len(text)} images={len(images)} "
                f"sample={text[:120]!r}"
            )

        out_dir = Path("G:/Zenoaihome.com/tmp/story-ocr-samples")
        out_dir.mkdir(parents=True, exist_ok=True)
        for idx in [10, 20, 50]:
            if idx >= doc.page_count:
                continue
            pix = doc[idx].get_pixmap(matrix=fitz.Matrix(1.8, 1.8), alpha=False)
            out = out_dir / f"story-page-{idx + 1}.png"
            pix.save(str(out))
            print(f"rendered={out} bytes={out.stat().st_size}")


if __name__ == "__main__":
    main()
