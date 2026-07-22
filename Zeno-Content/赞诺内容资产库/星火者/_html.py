"""Convert 星火者V2.1完整版 MD → HTML (print-ready PDF via browser)"""
import re, os

base = r"G:\Zenoaihome.com\Zeno-Content\赞诺内容资产库\星火者"
md_path = os.path.join(base, "星火者运营手册V2.1-完整版.md")

with open(md_path, 'r', encoding='utf-8') as f:
    md = f.read()

# === Markdown → HTML ===
lines = md.split('\n')
out = []
i = 0

while i < len(lines):
    line = lines[i]
    
    # Skip \newpage (handle with page-break-before in CSS)
    if line.strip() == '\\newpage':
        i += 1
        continue
    
    # Code blocks
    if line.strip().startswith('```'):
        end = i + 1
        while end < len(lines) and not lines[end].strip().startswith('```'):
            end += 1
        code_text = '\n'.join(lines[i+1:end])
        # Escape HTML
        code_text = code_text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        out.append(f'<pre><code>{code_text}</code></pre>')
        i = end + 1
        continue
    
    # Headers
    m = re.match(r'^(#{1,4})\s+(.+)$', line)
    if m:
        level = len(m.group(1))
        h_text = m.group(2)
        # Bold inside headers
        h_text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', h_text)
        out.append(f'<h{level}>{h_text}</h{level}>')
        i += 1
        continue
    
    # Horizontal rule
    if line.strip() == '---':
        out.append('<hr>')
        i += 1
        continue
    
    # Blockquote
    m = re.match(r'^>\s*(.*)$', line)
    if m:
        bq = m.group(1)
        bq = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', bq)
        bq = re.sub(r'`([^`]+)`', r'<code>\1</code>', bq)
        out.append(f'<blockquote>{bq}</blockquote>')
        i += 1
        continue
    
    # Table
    if line.strip().startswith('|') and '|' in line.strip()[1:]:
        table_lines = []
        while i < len(lines) and lines[i].strip().startswith('|'):
            table_lines.append(lines[i])
            i += 1
        
        rows = []
        for tl in table_lines:
            cells = [c.strip() for c in tl.strip().split('|')[1:-1]]
            if all(re.match(r'^[-: ]+$', c) for c in cells):
                continue
            rows.append(cells)
        
        if rows:
            out.append('<table>')
            if rows:
                out.append('<thead><tr>')
                for c in rows[0]:
                    out.append(f'<th>{c}</th>')
                out.append('</tr></thead>')
            if len(rows) > 1:
                out.append('<tbody>')
                for row in rows[1:]:
                    out.append('<tr>')
                    for c in row:
                        out.append(f'<td>{c}</td>')
                    out.append('</tr>')
                out.append('</tbody>')
            out.append('</table>')
        continue
    
    # Empty line
    if not line.strip():
        i += 1
        continue
    
    # Regular paragraph
    txt = line
    txt = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', txt)
    txt = re.sub(r'`([^`]+)`', r'<code>\1</code>', txt)
    out.append(f'<p>{txt}</p>')
    i += 1

body = '\n'.join(out)

# === CSS ===
css = """
@page { size: A4; margin: 2cm 2.5cm; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
    font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
    font-size: 11pt; line-height: 1.85; color: #1a1a1a;
    max-width: 820px; margin: 0 auto; padding: 40px 0;
}
h1 {
    font-size: 20pt; margin: 50px 0 24px; padding-bottom: 12px;
    border-bottom: 2px solid #f0a040; page-break-before: always;
}
h1:first-of-type { page-break-before: avoid; }
h2 {
    font-size: 15pt; margin: 32px 0 14px;
    border-left: 4px solid #f0a040; padding-left: 12px;
}
h3 { font-size: 13pt; margin: 24px 0 10px; color: #444; }
h4 { font-size: 11pt; margin: 18px 0 8px; color: #555; }
p { margin: 8px 0; }
strong { color: #222; }
blockquote {
    margin: 14px 0; padding: 12px 20px;
    background: #fdf6ed; border-left: 4px solid #f0a040;
}
code {
    background: #f5f5f5; padding: 2px 6px;
    border-radius: 3px; font-size: 10pt;
}
pre {
    background: #fafafa; padding: 14px 18px; border-radius: 6px;
    margin: 12px 0; border: 1px solid #e8e8e8;
    white-space: pre-wrap; font-size: 9.5pt; line-height: 1.5;
}
pre code { background: none; padding: 0; }
table {
    width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 10pt;
}
th {
    background: #faf5ed; padding: 10px 12px; text-align: left;
    border-bottom: 2px solid #f0a040; font-weight: 600;
}
td { padding: 8px 12px; border-bottom: 1px solid #eee; vertical-align: top; }
tr:nth-child(even) td { background: #fafafa; }
ul, ol { margin: 8px 0 8px 24px; }
li { margin: 4px 0; }
hr { border: none; border-top: 1px solid #e0d0b0; margin: 30px 0; }
@media print { body { background: white; -webkit-print-color-adjust: exact; } }
"""

html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>星火者 · 运营手册 V2.1 完整版</title>
<style>{css}</style>
</head>
<body>
{body}
</body>
</html>"""

html_path = os.path.join(base, "星火者运营手册V2.1-完整版.html")
with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

import subprocess
subprocess.run(['start', '', html_path], shell=True)

size_kb = os.path.getsize(html_path) / 1024
print(f"✓ {html_path}")
print(f"  Size: {size_kb:.1f} KB")
print(f"  Browser opened — Ctrl+P to print as PDF")
