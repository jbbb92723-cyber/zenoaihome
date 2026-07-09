"""
PDF文字提取脚本 —— 处理思想模型扫描版PDF
策略：先用 PyMuPDF 尝试提取文字层，失败则用 rapidocr 做 OCR
输出：每页的文字内容保存到对应txt文件
"""
import fitz  # PyMuPDF
import os
import sys
from pathlib import Path

PDF_DIR = Path(r"G:\Zenoaihome.com\待归类文件夹\思想模型")
OUTPUT_DIR = Path(r"G:\Zenoaihome.com\Zeno-Content\赞诺内容资产库\内容结构化系统\01-原始素材区\外部知识\_pdf提取文本")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def has_text_layer(doc, sample_pages=3):
    """抽样检查PDF是否有可提取的文字层"""
    total = min(sample_pages, len(doc))
    chars = 0
    for i in range(total):
        text = doc[i].get_text().strip()
        chars += len(text)
    return chars > 100  # 至少100个字符才算有文字层

def extract_with_fitz(pdf_path):
    """用PyMuPDF直接提取文字（适用于有文字层的PDF）"""
    doc = fitz.open(str(pdf_path))
    all_text = []
    for i, page in enumerate(doc):
        text = page.get_text().strip()
        all_text.append(f"--- 第{i+1}页 ---\n{text}")
    doc.close()
    return "\n\n".join(all_text)

def extract_with_rapidocr(pdf_path):
    """用rapidocr做OCR（适用于扫描版PDF），每10页重建引擎防内存泄漏"""
    import os
    os.environ["ORT_PROVIDER"] = "CPU"  # 强制CPU模式，避免GPU显存溢出

    from rapidocr import RapidOCR
    from PIL import Image
    import io
    import gc

    doc = fitz.open(str(pdf_path))
    all_text = []
    total = len(doc)
    engine = RapidOCR()

    for i, page in enumerate(doc):
        # 每5页重建引擎，释放ONNX累积内存
        if i > 0 and i % 5 == 0:
            del engine
            gc.collect()
            engine = RapidOCR()

        # 渲染页面为图片
        pix = page.get_pixmap(dpi=120)
        img_bytes = pix.tobytes("png")

        # 缩放防止 ONNX 内存溢出（限制长边 ≤ 1800px）
        img = Image.open(io.BytesIO(img_bytes))
        w, h = img.size
        max_dim = 800
        if max(w, h) > max_dim:
            scale = max_dim / max(w, h)
            img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
            buf = io.BytesIO()
            img.save(buf, format="PNG")
            img_bytes = buf.getvalue()

        # OCR识别（rapidocr 3.x 返回 RapidOCROutput 对象）
        result = engine(img_bytes)

        if result and result.txts:
            lines = []
            for text, score in zip(result.txts, result.scores):
                if score and score > 0.5:  # 过滤低置信度
                    lines.append(text)
            page_text = " ".join(lines)
        else:
            page_text = ""

        all_text.append(f"--- 第{i+1}页 ---\n{page_text}")

        if (i + 1) % 5 == 0:
            print(f"  OCR进度: {i+1}/{total} 页")

    doc.close()
    return "\n\n".join(all_text)

def process_pdf(pdf_path):
    """处理单个PDF，自动选择提取方式"""
    name = pdf_path.stem
    print(f"\n{'='*60}")
    print(f"处理: {name}")
    print(f"{'='*60}")

    doc = fitz.open(str(pdf_path))
    total_pages = len(doc)
    print(f"总页数: {total_pages}")

    if has_text_layer(doc):
        print("检测到文字层 → 使用 PyMuPDF 直接提取")
        text = extract_with_fitz(pdf_path)
    else:
        print("无文字层（扫描版）→ 使用 rapidocr OCR（较慢，请耐心等待）")
        text = extract_with_rapidocr(pdf_path)

    doc.close()

    # 保存
    out_path = OUTPUT_DIR / f"{name}.txt"
    out_path.write_text(text, encoding="utf-8")
    print(f"已保存: {out_path} ({len(text):,} 字符)")

def main():
    pdfs = sorted(PDF_DIR.glob("*.pdf"))
    if not pdfs:
        print(f"错误: {PDF_DIR} 下未找到PDF文件")
        sys.exit(1)

    print(f"找到 {len(pdfs)} 个PDF文件")
    print(f"输出目录: {OUTPUT_DIR}")

    # 让用户选择处理哪个
    if len(sys.argv) > 1:
        # 命令行指定了文件名关键词
        keyword = sys.argv[1]
        pdfs = [p for p in pdfs if keyword in p.stem]
        if not pdfs:
            print(f"未找到包含 '{keyword}' 的PDF")
            sys.exit(1)

    for pdf in pdfs:
        try:
            process_pdf(pdf)
        except Exception as e:
            print(f"错误: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    main()
