from pathlib import Path
import json
import os
import shutil
import subprocess
import sys


BOOKS = [
    ("zeno-modernity-ambivalence", r"E:\zeno skill 弹药库\现代性与矛盾性.pdf"),
    ("zeno-ries-trout-positioning", r"E:\zeno skill 弹药库\营销-杰克·特劳特 & 阿尔·里斯：定位.txt"),
    ("zeno-dalio-principles", r"E:\zeno skill 弹药库\原则+(瑞·达利欧).pdf"),
    ("zeno-intelligent-world-2035", r"E:\zeno skill 弹药库\智能世界2035.pdf"),
    ("zeno-chinese-culture-outlook", r"E:\zeno skill 弹药库\中国文化的展望.pdf"),
]

ROOT = Path(r"E:\zeno skill 弹药库")
WORK = ROOT / "_work"
EXTRACT = Path(r"C:\Users\WG\.agents\skills\book-to-skill\scripts\extract.py")


def main() -> int:
    summary = []
    for slug, source in BOOKS:
        source_path = Path(source)
        out = WORK / slug
        out.mkdir(parents=True, exist_ok=True)

        env = os.environ.copy()
        env["BOOK_SKILL_WORKDIR"] = str(out)
        env["PYTHONUTF8"] = "1"
        env["PYTHONIOENCODING"] = "utf-8"

        print(f"\n=== Extracting {slug}: {source_path.name} ===", flush=True)
        proc = subprocess.run(
            [sys.executable, str(EXTRACT), str(source_path), "--mode", "text", "--install-missing", "no"],
            env=env,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            encoding="utf-8",
            errors="replace",
        )
        (out / "extract.log").write_text(proc.stdout, encoding="utf-8")

        text_path = out / "full_text.txt"
        meta_path = out / "metadata.json"
        chars = text_path.stat().st_size if text_path.exists() else 0
        metadata = {}
        if meta_path.exists():
            try:
                metadata = json.loads(meta_path.read_text(encoding="utf-8"))
            except json.JSONDecodeError:
                metadata = {}
        summary.append(
            {
                "slug": slug,
                "source": str(source_path),
                "returncode": proc.returncode,
                "chars": chars,
                "metadata": metadata,
            }
        )
        print(f"return={proc.returncode} chars={chars}", flush=True)

    summary_path = WORK / "batch_extract_summary.json"
    summary_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nWrote {summary_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
