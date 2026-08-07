# OPC PDF Publisher

**把任意内容变成高视觉质量的 OPC 品牌 PDF。**

给 Agent（闹闹虾等）用的 OpenClaw Skill。用户只需要说「帮我把这份内容做成 PDF」，Agent 读这份 Skill 就能完成全部工作。

---

## 效果预览

- 封面：渐变背景 + 山脉曲线 + 大标题 + 核心数据展示
- 目录：自动生成，带点线引导
- 正文：6 种高级组件（大数字墙、引用块、进度条、双栏对比等）
- 字体：Space Mono（等宽标注）+ EB Garamond（斜体引用）+ Noto Serif/Sans（中文）

---

## 安装（3 步）

```bash
# 1. 解压到 OpenClaw skills 目录
tar -xzf opc-pdf-publisher-v1.0.tar.gz -C ~/.openclaw/skills/
# 或直接把 opc-pdf-publisher/ 文件夹复制到 ~/.openclaw/skills/

# 2. 安装 Python 依赖
pip3 install markdown beautifulsoup4 requests PyPDF2

# 3. 确认已安装 Google Chrome
open /Applications/Google\ Chrome.app
```

**环境要求：**
- macOS（已测试）/ Linux（Chrome headless 同样支持）
- Python 3.9+
- Google Chrome（必须，PDF 渲染引擎）

---

## 快速测试

```bash
# 用自带示例跑一次，确认安装成功
python3 ~/.openclaw/skills/opc-pdf-publisher/scripts/build_pdf.py \
  ~/.openclaw/skills/opc-pdf-publisher/tests/examples/monthly-report/ \
  --output /tmp/opc-test.pdf

open /tmp/opc-test.pdf
# 应该看到 7 页 PDF，有封面、目录、正文
```

---

## 给 Agent 用

Agent 读 `SKILL.md` 即可上手。核心流程：

1. 从用户输入提取内容（Word/PDF/网页/图片/纯文字均支持）
2. 内容结构化：找核心数字 → stat-wall，找金句 → pull-quote，找对比 → two-col
3. 生成 meta.json + Markdown，调用脚本生成 PDF
4. 验证页数和文件大小，交付给用户

---

## 组件速查

| 语法 | 效果 |
|------|------|
| `::: stat-wall \| 3,000+ \| 用户 \|\| 30+ \| 城市` | 大数字横排数据墙 |
| `::: pull-quote \| 金句 \| — 来源` | 左橙线引用块 |
| `::: progress \| 技术背景 \| 42` | 百分比进度条 |
| `::: two-col` ... `---` ... `:::` | 双栏对比卡片 |
| `::: section-header 01 \| 标题 \| 副标题` | 大号章节起始标题 |
| `::: eyebrow \| 标签文字` | 等宽小标签 |

完整语法见 `SKILL.md`。

---

## 目录结构

```
opc-pdf-publisher/
  README.md                    ← 你在看的这个
  SKILL.md                     ← Agent 使用指引（核心）
  scripts/
    build_pdf.py               ← 主脚本，直接调用
  assets/
    logo-wordmark.png          ← OPC 品牌 logo
    fonts/                     ← 内置字体（无需网络）
  references/
    brand-specs.json           ← 品牌色彩/字体配置
    style-guide.md             ← 视觉规范说明
  tests/
    examples/monthly-report/   ← 可直接运行的示例
```

---

## 版本历史

- **v1.0**（2026-07-29）：初始发布。Chrome headless 三段分离渲染引擎，6 个新组件，字体内置。

