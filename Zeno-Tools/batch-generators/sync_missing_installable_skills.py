from __future__ import annotations

import re
import shutil
import subprocess
import sys
from pathlib import Path


AMMO_ROOT = Path(r"E:\zeno skill 弹药库")
INSTALLABLE_ROOT = AMMO_ROOT / "installable"
DIST_ROOT = AMMO_ROOT / "dist"
VALIDATOR = Path(r"C:\Users\WG\.agents\skills\skill-creator-0.1.0\scripts\quick_validate.py")
PACKAGER = Path(r"C:\Users\WG\.agents\skills\skill-creator-0.1.0\scripts\package_skill.py")


def rewrite_machine_heading(skill_md: Path, slug: str) -> None:
    text = skill_md.read_text(encoding="utf-8")
    match = re.search(r"(?m)^# .+$", text)
    if match:
        text = text[: match.start()] + f"# {slug}" + text[match.end() :]
    else:
        text = text.rstrip() + f"\n\n# {slug}\n"
    skill_md.write_text(text, encoding="utf-8")


def run_checked(args: list[str]) -> None:
    result = subprocess.run(args, text=True, encoding="utf-8", capture_output=True)
    if result.returncode != 0:
        print(result.stdout)
        print(result.stderr, file=sys.stderr)
        raise SystemExit(result.returncode)


def main() -> None:
    if not AMMO_ROOT.exists():
        raise SystemExit(f"Ammo root not found: {AMMO_ROOT}")
    if not VALIDATOR.exists() or not PACKAGER.exists():
        raise SystemExit("skill-creator validation or packaging script not found")

    INSTALLABLE_ROOT.mkdir(parents=True, exist_ok=True)
    DIST_ROOT.mkdir(parents=True, exist_ok=True)

    root_slugs = sorted(p.name for p in AMMO_ROOT.iterdir() if p.is_dir() and p.name.startswith("zeno-"))
    installable_slugs = {
        p.name for p in INSTALLABLE_ROOT.iterdir() if p.is_dir() and p.name.startswith("zeno-")
    }
    missing = [slug for slug in root_slugs if slug not in installable_slugs]

    print(f"root skills: {len(root_slugs)}")
    print(f"existing installable: {len(installable_slugs)}")
    print(f"missing installable: {len(missing)}")

    for slug in missing:
        source = AMMO_ROOT / slug
        target = INSTALLABLE_ROOT / slug
        if target.exists():
            print(f"skip existing: {slug}")
            continue

        shutil.copytree(source, target)
        rewrite_machine_heading(target / "SKILL.md", slug)

        run_checked([sys.executable, "-X", "utf8", str(VALIDATOR), str(target)])
        run_checked([sys.executable, "-X", "utf8", str(PACKAGER), str(target), str(DIST_ROOT)])
        print(f"synced and packaged: {slug}")

    final_installable = [
        p.name for p in INSTALLABLE_ROOT.iterdir() if p.is_dir() and p.name.startswith("zeno-")
    ]
    packages = list(DIST_ROOT.glob("*.skill"))
    print(f"final installable: {len(final_installable)}")
    print(f"final packages: {len(packages)}")


if __name__ == "__main__":
    main()
