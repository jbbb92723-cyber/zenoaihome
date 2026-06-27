#!/usr/bin/env python3
"""Zeno 本地发布中台同步脚本模板。

安全原则：
- 默认 dry-run，不直接发布到任何平台；
- 只复制 status 为 approved / ready 的发布包；
- 输出到 _synced 作为“待人工发布副本”；
- 如需接公众号草稿箱、飞书多维表格、网站 importer，可在 sync_package() 后扩展。
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import shutil
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
CENTER_DIR = SCRIPT_DIR.parent
CONFIG_PATH = CENTER_DIR / "_config" / "publish-sync.config.json"
LOG_PATH = CENTER_DIR / "_logs" / "sync-log.md"


def load_config() -> dict:
    return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))


def parse_simple_yaml(path: Path) -> dict:
    """Parse the small publish.yaml subset used here without external deps."""
    data: dict[str, object] = {}
    current_key: str | None = None
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.rstrip()
        if not line or line.lstrip().startswith("#"):
            continue
        if re.match(r"^[A-Za-z_][\w-]*:\s*", line):
            key, value = line.split(":", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if value == "":
                data[key] = []
                current_key = key
            else:
                data[key] = value.split(" #", 1)[0].strip()
                current_key = None
        elif current_key and line.strip().startswith("-"):
            value = line.strip()[1:].strip().strip('"').strip("'")
            if isinstance(data.get(current_key), list):
                data[current_key].append(value)
    return data


def safe_name(text: str) -> str:
    text = text.strip().replace(" ", "-")
    text = re.sub(r"[\\/:*?\"<>|]+", "-", text)
    return text[:90] or "untitled"


def discover_packages(config: dict) -> list[tuple[Path, dict]]:
    approved = set(config.get("approved_status", ["approved", "ready"]))
    packages: list[tuple[Path, dict]] = []
    for rel in config.get("scan_dirs", []):
        scan_root = CENTER_DIR / rel
        if not scan_root.exists():
            continue
        for meta_path in scan_root.rglob("publish.yaml"):
            meta = parse_simple_yaml(meta_path)
            if str(meta.get("status", "")).strip() in approved:
                packages.append((meta_path.parent, meta))
    return packages


def copytree_merge(src: Path, dst: Path, overwrite: bool) -> list[str]:
    copied: list[str] = []
    for item in src.rglob("*"):
        if item.is_dir():
            continue
        rel = item.relative_to(src)
        target = dst / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.exists() and not overwrite:
            copied.append(f"SKIP exists: {target}")
            continue
        shutil.copy2(item, target)
        copied.append(f"COPY {item} -> {target}")
    return copied


def sync_package(pkg: Path, meta: dict, config: dict, apply: bool) -> list[str]:
    title = str(meta.get("title", pkg.name))
    slug = str(meta.get("slug", pkg.name))
    platforms = meta.get("platforms") or []
    if isinstance(platforms, str):
        platforms = [platforms]
    outputs = config.get("platform_outputs", {})
    overwrite = bool(config.get("rules", {}).get("overwrite_existing", False))

    actions: list[str] = []
    for platform in platforms:
        out_rel = outputs.get(platform)
        if not out_rel:
            actions.append(f"WARN no output configured for platform={platform}")
            continue
        dst = CENTER_DIR / out_rel / safe_name(slug or title)
        actions.append(f"[{platform}] {pkg} -> {dst}")
        if apply:
            actions.extend(copytree_merge(pkg, dst, overwrite=overwrite))
    return actions


def append_log(lines: list[str], apply: bool) -> None:
    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    stamp = dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    mode = "APPLY" if apply else "DRY-RUN"
    block = [f"\n## {stamp} | {mode}", ""] + [f"- {line}" for line in lines] + [""]
    LOG_PATH.write_text((LOG_PATH.read_text(encoding="utf-8") if LOG_PATH.exists() else "# Zeno 发布中台同步日志\n") + "\n".join(block), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Zeno local publish-center sync template")
    parser.add_argument("--apply", action="store_true", help="actually copy files into _synced outputs")
    parser.add_argument("--dry-run", action="store_true", help="preview actions only; default")
    args = parser.parse_args()

    config = load_config()
    apply = bool(args.apply)
    packages = discover_packages(config)
    lines: list[str] = [f"found approved packages: {len(packages)}"]
    for pkg, meta in packages:
        lines.extend(sync_package(pkg, meta, config, apply=apply))
    append_log(lines, apply=apply)
    print("\n".join(lines))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
