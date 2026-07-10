#!/usr/bin/env python3
"""
ZenoAIHome 内容发布辅助脚本
从 Obsidian 选题装配 → 生成网站 .ts 数据文件 + 统计发布状态

用法：
  uv run python scripts/publish.py <选题文件名>

示例：
  uv run python scripts/publish.py "2026-07-09_报价单不是价格表是责任边界表_总纲"
"""

import sys
import re
import json
from pathlib import Path
from datetime import datetime

CONTENT_HOME = Path("G:/Zenoaihome.com/Zeno-Content/赞诺内容资产库/内容结构化系统")
SITE_DATA = Path("G:/Zenoaihome.com/Zeno-Code/zeno-site/data/content")

# ── 工具函数 ──

def find_article(name: str) -> Path | None:
    """在选题装配目录中查找文章"""
    assembly = CONTENT_HOME / "06-选题装配"
    for f in assembly.glob("*.md"):
        if name in f.name:
            return f
    return None

def parse_frontmatter(text: str) -> dict:
    """解析 YAML frontmatter"""
    if not text.startswith("---"):
        return {}
    end = text.find("---", 3)
    if end == -1:
        return {}
    fm = {}
    for line in text[3:end].strip().split("\n"):
        if ":" in line:
            key, _, val = line.partition(":")
            fm[key.strip()] = val.strip()
    return fm

def extract_title(text: str) -> str:
    """提取标题（第一个 # 行）"""
    for line in text.split("\n"):
        if line.startswith("# "):
            return line[2:].strip()
    return "未命名"

def generate_ts_slug(filename: str) -> str:
    """生成英文slug"""
    name = Path(filename).stem
    # 提取中文名后面的英文/拼音部分
    parts = name.split("_")
    # 简单处理：取最后一个非数字部分
    for p in reversed(parts):
        if not p[0].isdigit():
            return p.lower().replace(" ", "-")
    return name.lower().replace(" ", "-")

def count_spokes(name: str) -> int:
    """统计Spoke内容数量"""
    spoke_file = CONTENT_HOME / "06-选题装配" / f"{Path(name).stem}_Spoke拆解.md"
    if spoke_file.exists():
        text = spoke_file.read_text(encoding="utf-8")
        return len(re.findall(r"## Spoke \d", text))
    return 0

def check_cta(text: str) -> bool:
    """检查是否有CTA"""
    cta_patterns = [
        "你的下一步", "如果你正准备", "如果你手里有", "把你的报价单",
        "用免费筛查", "加微信", "审报价", "了解更多", "→",
        "如果这篇文章", "不确定要不要"
    ]
    return any(p in text for p in cta_patterns)

# ── 主流程 ──

def publish_status(name: str) -> dict:
    """生成发布状态报告"""
    article = find_article(name)
    if not article:
        return {"error": f"未找到选题: {name}"}

    text = article.read_text(encoding="utf-8")
    fm = parse_frontmatter(text)
    title = extract_title(text)

    # 统计字数
    body = text[text.find("---", 3)+3:] if text.startswith("---") else text
    word_count = len(body.replace("\n", "").replace(" ", ""))

    spokes = count_spokes(name)
    has_cta = check_cta(text)

    return {
        "文件": article.name,
        "标题": title,
        "字数": word_count,
        "状态": fm.get("status", "未知"),
        "Spoke数": spokes,
        "有CTA": "✓" if has_cta else "✗ 缺少！",
        "路径": str(article.relative_to(CONTENT_HOME.parent.parent)),
    }

def list_publishable() -> list[dict]:
    """列出所有可发布但缺CTA的文章"""
    assembly = CONTENT_HOME / "06-选题装配"
    results = []
    for f in sorted(assembly.glob("*.md")):
        if "_生产单" in f.name or "_Spoke" in f.name:
            continue
        text = f.read_text(encoding="utf-8")
        if not check_cta(text):
            title = extract_title(text)
            results.append({"文件": f.name, "标题": title, "问题": "缺少CTA"})
    return results

# ── CLI ──

if __name__ == "__main__":
    if len(sys.argv) < 2:
        # 无参数：列出所有缺CTA的文章
        print("=== 需要补充CTA的文章 ===\n")
        for item in list_publishable():
            print(f"  ✗ [{item['文件']}] {item['标题']}")
        print(f"\n共 {len(list_publishable())} 篇缺少CTA")
        print("\n用法: uv run python scripts/publish.py <文件名片段>")
        sys.exit(0)

    name = sys.argv[1]
    status = publish_status(name)
    print(json.dumps(status, ensure_ascii=False, indent=2))
