"""OCR worker - called by extract-pdf-batch.py for each page batch"""
import sys, os, io
os.environ["ORT_PROVIDER"] = "CPU"

import fitz
from rapidocr import RapidOCR
from PIL import Image

pdf_path = sys.argv[1]
start_page = int(sys.argv[2])
end_page = int(sys.argv[3])
dpi = int(sys.argv[4])
max_dim = int(sys.argv[5])

doc = fitz.open(pdf_path)
engine = RapidOCR()

for i in range(start_page, min(end_page, len(doc))):
    page = doc[i]
    pix = page.get_pixmap(dpi=dpi)
    img_bytes = pix.tobytes("png")

    img = Image.open(io.BytesIO(img_bytes))
    w, h = img.size
    if max(w, h) > max_dim:
        scale = max_dim / max(w, h)
        img = img.resize((int(w*scale), int(h*scale)), Image.LANCZOS)
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        img_bytes = buf.getvalue()

    result = engine(img_bytes)
    if result and result.txts:
        lines = [t for t, s in zip(result.txts, result.scores) if s > 0.5]
        page_text = " ".join(lines)
    else:
        page_text = ""

    # Use a special delimiter so parent can parse
    print(f"PAGE_START_{i+1}")
    print(page_text)
    print("PAGE_END")

doc.close()
