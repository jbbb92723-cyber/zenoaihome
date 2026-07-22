# write_combined.py - 合并四份文档为 2.1 完整版
import os

base = "G:/Zenoaihome.com/Zeno-Content/赞诺内容资产库/星火者"

files = [
    ("星火者共同体说明书.md", "卷一"),
    ("星火者成员公约.md", "卷二"),
    ("星火者运营SOP.md", "卷三"),
    ("星火者项目合作规则.md", "卷四"),
]

# Read all, strip YAML frontmatter
parts = []
for fname, juan in files:
    path = os.path.join(base, fname)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    # Strip YAML frontmatter
    if content.startswith('---'):
        idx = content.index('---', 3)
        content = content[idx+3:].strip()
    parts.append((juan, fname.replace('.md', ''), content))

# Build combined markdown
combined = []
combined.append("# 星火者·运营手册 V2.1（完整版）\n")
combined.append("> **版本状态**：试运行版（2026-07-21）")
combined.append("> **编制**：赞诺")
combined.append("> **说明**：本完整版包含四卷——共同体说明书、成员公约、运营SOP、项目合作规则。各卷可独立使用。\n")

toc = ["## 目录\n"]
for juan, title, _ in parts:
    toc.append(f"- **{juan}**：《{title}》")
combined.append("\n".join(toc))
combined.append("\n---\n")

for juan, title, body in parts:
    combined.append(f"\\newpage")
    combined.append(body)
    combined.append("\n")

output = "\n\n".join(combined)

out_path = os.path.join(base, "星火者运营手册V2.1-完整版.md")
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(output)

print(f"Written: {out_path} ({len(output):,} chars)")
