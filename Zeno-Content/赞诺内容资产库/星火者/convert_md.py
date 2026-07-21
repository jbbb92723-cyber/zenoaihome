import re, os

MD = 'G:/Zenoaihome.com/Zeno-Content/赞诺内容资产库/星火者/星火者运营手册V2.0.md'
HTML = 'G:/Zenoaihome.com/Zeno-Content/赞诺内容资产库/星火者/星火者运营手册V2.0.html'

with open(MD, 'r', encoding='utf-8') as f:
    md = f.read()

# Simple markdown conversion
lines = md.split('\n')
out = []

i = 0
while i < len(lines):
    line = lines[i]
    
    # Code blocks
    if line.strip().startswith('```'):
        if i + 1 < len(lines):
            end = i + 1
            while end < len(lines) and not lines[end].strip().startswith('```'):
                end += 1
            code_lines = lines[i+1:end]
            out.append('<pre><code>')
            for cl in code_lines:
                out.append(cl)
                out.append('\n')
            out.append('</code></pre>')
            i = end + 1
            continue
    
    # Headers
    m = re.match(r'^(#{1,4})\s+(.+)$', line)
    if m:
        level = len(m.group(1))
        out.append(f'<h{level}>{m.group(2)}</h{level}>')
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
        out.append(f'<blockquote>{m.group(1)}</blockquote>')
        i += 1
        continue
    
    # Table
    if line.strip().startswith('|') and '|' in line.strip()[1:]:
        table_lines = []
        while i < len(lines) and lines[i].strip().startswith('|'):
            table_lines.append(lines[i])
            i += 1
        
        # Filter: keep only rows with actual content (not just separators)
        rows = []
        header_done = False
        for tl in table_lines:
            cells = [c.strip() for c in tl.strip().split('|')[1:-1]]
            # Skip separator rows like |---|---|
            if all(re.match(r'^[-: ]+$', c) for c in cells):
                continue
            rows.append(cells)
        
        if rows:
            out.append('<table>')
            if len(rows) >= 1:
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
    
    # Regular paragraph (process inline formatting)
    txt = line
    txt = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', txt)
    txt = re.sub(r'`([^`]+)`', r'<code>\1</code>', txt)
    out.append(f'<p>{txt}</p>')
    i += 1

body = '\n'.join(out)

css = """body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;font-size:11pt;line-height:1.8;color:#1a1a1a;max-width:800px;margin:0 auto;padding:40px 0}h1{font-size:20pt;margin:40px 0 20px;padding-bottom:10px;border-bottom:2px solid #f0a040;page-break-before:always}h2{font-size:15pt;margin:30px 0 14px;border-left:4px solid #f0a040;padding-left:12px}h3{font-size:13pt;margin:22px 0 10px;color:#555}h4{font-size:11pt;margin:18px 0 8px;color:#666}p{margin:8px 0}strong{color:#222}blockquote{margin:14px 0;padding:12px 20px;background:#fdf6ed;border-left:4px solid #f0a040}code{background:#f5f5f5;padding:2px 6px;border-radius:3px;font-size:10pt}pre{background:#f8f8f8;padding:14px 18px;border-radius:6px;margin:12px 0;border:1px solid #e8e8e8;white-space:pre-wrap;font-size:9.5pt}pre code{background:none;padding:0}table{width:100%;border-collapse:collapse;margin:14px 0;font-size:10pt}th{background:#faf5ed;padding:10px 12px;text-align:left;border-bottom:2px solid #f0a040}td{padding:8px 12px;border-bottom:1px solid #eee}tr:nth-child(even) td{background:#fafafa}hr{border:none;border-top:1px solid #e0d0b0;margin:30px 0}@media print{body{background:white}}"""

html = f"""<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>星火者 · 运营手册 V2.0</title><style>{css}</style></head><body>{body}</body></html>"""

with open(HTML, 'w', encoding='utf-8') as f:
    f.write(html)

size = os.path.getsize(HTML)
print(f'DONE: {HTML} ({size:,} bytes)')
