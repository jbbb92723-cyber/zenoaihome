#!/usr/bin/env python3
"""Batch-add CTA footer to all articles missing one."""

import re, glob, os

CTA = r"""

---

**下一步**：如果你正在装修，手上有一份报价单拿不准——把报价单拍照发给我。24小时内，我逐项告诉你哪里可能有问题。¥199一次。审不出关键问题，全额退款。

→ [把报价单发给我，24小时内出结果](/services/quote-review)
→ 微信：zanxiansheng2025 · 备注「报价快审」"""

# Files to skip (already have strong CTA or are special)
skip_ids = {62, 76, 90, 91, 98, 99, 100, 105, 106, 107, 108, 109, 110, 111, 112, 113}

content_dir = "G:/Zenoaihome.com/Zeno-Code/zeno-site/data/content"
files = sorted(glob.glob(f"{content_dir}/article-*-content.ts"))

updated = 0
for fp in files:
    # Extract article ID
    m = re.search(r'article-(\d+)-content\.ts', fp)
    if not m: continue
    aid = int(m.group(1))
    if aid in skip_ids: continue
    
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the last backtick that closes the template literal
    # Pattern: `\n at very end. Insert CTA before that last `
    if content.rstrip().endswith('`'):
        # Find position of last backtick before trailing newlines
        last_bt = content.rstrip().rfind('`')
        new_content = content[:last_bt] + CTA + content[last_bt:]
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(new_content)
        updated += 1
        print(f"✅ article-{aid}")
    else:
        print(f"⚠️  article-{aid} - can't find closing backtick")

print(f"\nDone. Updated {updated} articles.")
