"""
分批OCR脚本 —— 每N页重启Python进程彻底释放内存
适用：超大扫描版PDF（200MB+）
用法：python extract-pdf-batch.py "PDF文件名关键词"
"""
import subprocess
import sys
import os
from pathlib import Path

PDF_DIR = Path(r"G:\Zenoaihome.com\待归类文件夹\思想模型")
OUTPUT_DIR = Path(r"G:\Zenoaihome.com\Zeno-Content\赞诺内容资产库\内容结构化系统\01-原始素材区\外部知识\_pdf提取文本")
WORKER = Path(__file__).parent / "ocr_worker.py"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

BATCH_SIZE = 2   # 每批2页，极度保守
DPI = 100
MAX_DIM = 800

def main():
    keyword = sys.argv[1] if len(sys.argv) > 1 else None
    pdfs = sorted(PDF_DIR.glob("*.pdf"))
    if keyword:
        pdfs = [p for p in pdfs if keyword in p.stem]
    if not pdfs:
        print("No PDFs found")
        sys.exit(1)

    pdf_path = str(pdfs[0])
    name = pdfs[0].stem
    out_path = OUTPUT_DIR / f"{name}.txt"

    import fitz
    doc = fitz.open(pdf_path)
    total = len(doc)
    doc.close()

    print(f"PDF: {name} ({total} pages, batch={BATCH_SIZE})")
    print(f"Output: {out_path}")

    all_text = []
    for start in range(0, total, BATCH_SIZE):
        end = min(start + BATCH_SIZE, total)

        result = subprocess.run(
            [sys.executable, str(WORKER), pdf_path, str(start), str(end), str(DPI), str(MAX_DIM)],
            capture_output=True, text=True, timeout=300
        )

        if result.returncode != 0:
            print(f"  [{start+1}-{end}] ERROR: {result.stderr[:200]}")
            for i in range(start, end):
                all_text.append(f"--- 第{i+1}页 ---\n[OCR失败]")
        else:
            # Parse PAGE_START/PAGE_END markers
            lines = result.stdout.split("\n")
            i = 0
            while i < len(lines):
                if lines[i].startswith("PAGE_START_"):
                    page_num = lines[i].split("_")[-1]
                    i += 1
                    text_lines = []
                    while i < len(lines) and not lines[i].startswith("PAGE_END"):
                        text_lines.append(lines[i])
                        i += 1
                    all_text.append(f"--- 第{page_num}页 ---\n" + "\n".join(text_lines))
                i += 1

        pct = end * 100 // total
        print(f"  [{end}/{total}] {pct}%")

    # Write output
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n\n".join(all_text))

    size = os.path.getsize(out_path)
    chars = sum(len(t) for t in all_text)
    print(f"\nDone! {len(all_text)} pages, ~{chars:,} chars, {size:,} bytes")
    print(f"Saved to: {out_path}")

if __name__ == "__main__":
    main()
