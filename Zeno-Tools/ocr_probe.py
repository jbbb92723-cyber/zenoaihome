from pathlib import Path
import json
import sys
import time

import fitz
from rapidocr_onnxruntime import RapidOCR


def main() -> int:
    if len(sys.argv) < 3:
        print("Usage: ocr_probe.py <output_dir> <pdf> [<pdf>...]")
        return 2

    out = Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    ocr = RapidOCR()

    for raw_path in sys.argv[2:]:
        path = Path(raw_path)
        doc = fitz.open(str(path))
        page_count = len(doc)
        pages = [0, min(5, page_count - 1), min(10, page_count - 1)] if page_count else []
        seen = []
        result = {"file": str(path), "pages": page_count, "samples": []}

        for page_no in pages:
            if page_no in seen:
                continue
            seen.append(page_no)

            page = doc.load_page(page_no)
            pix = page.get_pixmap(matrix=fitz.Matrix(1.5, 1.5), alpha=False)
            image_path = out / f"{path.stem[:20]}-p{page_no + 1}.png"
            pix.save(str(image_path))

            start = time.time()
            ocr_result, _ = ocr(str(image_path))
            elapsed = time.time() - start

            texts = []
            if ocr_result:
                for item in ocr_result:
                    if len(item) >= 2:
                        texts.append(str(item[1]))

            sample = "\n".join(texts[:80])
            result["samples"].append(
                {
                    "page": page_no + 1,
                    "elapsed_sec": round(elapsed, 2),
                    "chars": len(sample),
                    "text": sample[:2000],
                }
            )

        doc.close()
        output_file = out / (path.stem[:40] + ".json")
        output_file.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
        print(json.dumps(result, ensure_ascii=False, indent=2)[:3000])

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
