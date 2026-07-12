#!/usr/bin/env python3
"""Remove content imports and content: fields from articles.ts — fixes OOM build."""

import re

path = "G:/Zenoaihome.com/Zeno-Code/zeno-site/data/content/articles.ts"

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

out = []
skip_imports = False
# Remove lines that import articleXXContent
# Remove 'content: articleXXContent,' from article entries

import_pattern = re.compile(r"^import \{ article\d+Content \} from")

new_lines = []
for line in lines:
    # Remove content imports
    if import_pattern.match(line.strip()):
        continue
    # Remove semicolon-only variations
    if line.strip().startswith("import { article") and "Content" in line:
        continue
    # Remove 'content: articleXXContent,' from entries
    if re.search(r"content:\s*article\d+Content", line):
        continue
    new_lines.append(line)

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"Cleaned. {len(lines) - len(new_lines)} lines removed. {len(new_lines)} lines remain.")
