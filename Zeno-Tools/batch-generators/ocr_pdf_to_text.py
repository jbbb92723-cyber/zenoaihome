from pathlib import Path
import json
import sys
import time

import fitz
from rapidocr_onnxruntime import RapidOCR


def ocr_pdf(pdf_path: Path, output_dir: Path, scale: float = 1.45) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    text_path = output_dir / "ocr_text.txt"
    meta_path = output_dir / "ocr_metadata.json"
    image_dir = output_dir / "_images"
    image_dir.mkdir(parents=True, exist_ok=True)

    ocr = RapidOCR()
    doc = fitz.open(str(pdf_path))
    started = time.time()
    page_records = []

    with text_path.open("w", encoding="utf-8") as out:
        out.write(f"# OCR extraction: {pdf_path.name}\n\n")
        for idx in range(len(doc)):
            page_no = idx + 1
            page = doc.load_page(idx)
            pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
            image_path = image_dir / f"page-{page_no:04d}.png"
            pix.save(str(image_path))

            page_started = time.time()
            ocr_result, _ = ocr(str(image_path))
            elapsed = time.time() - page_started

            texts = []
            if ocr_result:
                for item in ocr_result:
                    if len(item) >= 2:
                        texts.append(str(item[1]).strip())

            page_text = "\n".join(t for t in texts if t)
            out.write(f"\n\n===== PAGE {page_no} =====\n\n")
            out.write(page_text)
            out.write("\n")
            page_records.append({"page": page_no, "chars": len(page_text), "elapsed_sec": round(elapsed, 2)})

            if page_no % 10 == 0 or page_no == len(doc):
                print(f"{pdf_path.name}: OCR {page_no}/{len(doc)} pages")

    doc.close()
    metadata = {
        "source_file": str(pdf_path),
        "output_text": str(text_path),
        "pages": len(page_records),
        "chars": sum(item["chars"] for item in page_records),
        "elapsed_sec": round(time.time() - started, 2),
        "page_records": page_records,
    }
    meta_path.write_text(json.dumps(metadata, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(metadata, ensure_ascii=False, indent=2)[:1000])


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: ocr_pdf_to_text.py <pdf_path> <output_dir>")
        return 2
    ocr_pdf(Path(sys.argv[1]), Path(sys.argv[2]))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
