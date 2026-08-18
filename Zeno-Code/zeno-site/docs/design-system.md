# Zeno 赞诺官网设计系统说明

> 本次重构（2026-08-01）在原有 "Monastic Editorial" 基底上，按「东方美学 + 实用主义」方向演进。本文件记录实际使用的字体、色板、间距与动效参数。

## 一、字体栈

| 用途 | Tailwind 类 | 字体栈（优先级从高到低） | 说明 |
|------|------------|----------------------|------|
| 中文正文 | `font-sans` | `system-ui`, `PingFang SC`, `Microsoft YaHei`, sans-serif | 使用系统中文黑体，避免字体下载和构建时外部网络依赖 |
| 中文标题 / 编辑性文字 | `font-serif` / `.editorial-serif` / `.editorial-display` | `Songti SC`, `STSong`, `Noto Serif CJK SC`, `Source Han Serif SC`, `SimSun`, Georgia, serif | 使用系统中文衬线字体，标题保持 500-600 字重 |
| 等宽 | `font-mono` | `ui-monospace`, `SFMono-Regular`, monospace | 代码、数字标签 |

## 二、色板

所有颜色以 CSS 变量形式定义于 `styles/globals.css`，Tailwind 通过 `rgb(var(--color-xxx-rgb) / <alpha-value>)` 注册。

| Token | 亮色 Hex | 暗色 Hex | 护眼 Hex | 用途 |
|-------|---------|---------|---------|------|
| `canvas`（纸底） | `#F4F1E8` | `#111111` | `#F6F2E8` | 页面背景，模拟宣纸/牙白 |
| `surface`（纸面） | `#F8F5EC` | `#1C1C1B` | `#FAF7EF` | 卡片、面板背景 |
| `surface-warm`（暖沙） | `#DED2BE` | `#2B2721` | `#E2D6C2` | 强调区块背景、hover 底色 |
| `ink`（墨色） | `#111111` | `#F4F1E8` | `#181715` | 主文字、深色按钮 |
| `ink-muted`（淡墨） | `#444039` | `#CCC4B5` | `#4D4840` | 次级正文 |
| `ink-faint`（更淡） | `#7C7569` | `#968D7E` | `#80776A` | 说明、禁用态 |
| `border` | `#DBD3C4` | `#3C372F` | `#DAD0BE` | 分隔线、卡片边框 |
| `border-subtle` | `#E8E1D3` | `#2A2722` | `#E9E1D3` | 更淡的分隔 |
| `warm` | `#DED2BE` | `#DED2BE` | `#DED2BE` | 点缀下划线、温暖强调 |
| `copper`（铜色） | `#C4A67A` | `#D4BA8A` | `#C0A074` | 品牌点缀 |
| **cinnabar（朱砂）** | **#9E2B25** | **#C9504A** | **#94332C** | **唯一强调色：关键 CTA、当前导航态、印章式标签、链接 hover** |

### 使用纪律
- `cinnabar` 是唯一的「印章红」，只用于：主按钮、当前导航下划线、区块小标签（`.page-label`）、引用/笔记左侧边线。
- 图标、服务编号默认保持 `stone`（近墨色）；仅服务序号 `01-05` 使用 `cinnabar` 作为层级索引。

## 三、间距体系（8px 基线）

| Token | 值 | 用途 |
|-------|-----|------|
| `space-1` | 4px | 微间距 |
| `space-2` | 8px | 行内元素间隙 |
| `space-3` | 12px | 紧凑组件内边距 |
| `space-4` | 16px | 卡片 padding |
| `space-5` | 20px | 块级元素间距 |
| `space-6` | 24px | 表单组间距 |
| `space-8` | 32px | 中等区块间距 |
| `space-12` | 48px | 大区块内间距 |
| `space-16` | 64px | `section-sm` |
| `space-28` | 112px | `section`（奢侈留白，大区块上下） |

容器：`max-w-layout 1152px`，水平内边距 `px-5 sm:px-8 lg:px-10`。

## 四、圆角

| Token | 值 | 用途 |
|-------|-----|------|
| `rounded-card` | 4px | 卡片、面板 |
| `rounded-tag` | 2px | 标签、小徽章 |
| 按钮 | 3px（`rounded-[3px]`） | 主/次按钮统一 |

## 五、动效参数

CSS 变量定义于 `styles/globals.css`：

| 变量 | 值 | 用途 |
|------|-----|------|
| `--motion-fast` | 200ms | hover、聚焦反馈 |
| `--motion-base` | 220ms | 菜单、微交互 |
| `--motion-slow` | 420ms | 面板展开 |
| `--motion-enter` | 500ms | 滚动入场渐显 |
| `--motion-ease` | `cubic-bezier(.25, .1, .25, 1)` | 全站统一缓动 |

### Reveal 滚动入场
- 组件：`components/ui/Reveal.tsx`
- 触发：IntersectionObserver，`threshold: 0.1`，`rootMargin: '-60px'`
- 效果：`opacity 0 → 1`，`translateY(16px) → 0`
- 时长：500ms
- 降级：
  - `prefers-reduced-motion: reduce` 时直接显示，无动画。
  - `<noscript>` 时直接显示，保证无 JS 可读性。

### Hover 反馈
- 卡片：`.card-hover` — `translateY(-2px)` + `box-shadow: 0 10px 32px rgba(17,17,17,0.08)`，200ms。
- 按钮：主按钮 `bg-cinnabar` → `bg-cinnabar/92`，阴影柔和扩散。

## 六、外部资源

- **字体**：使用系统中文黑体与衬线字体栈，不下载 Web Font，也不依赖构建时外部网络。
- **图标**：@phosphor-icons/react（已存在于依赖）。
- **动画**：滚动 Reveal 使用原生 IntersectionObserver + CSS；当前前台不加载 framer-motion。

## 七、本次改动文件清单

- `app/layout.tsx`：设置全站 metadata、结构化数据和 `<noscript>` 动效兜底。
- `styles/globals.css`：新增 `cinnabar` 变量、Reveal 样式、`.page-label`/`.section-heading`、统一动效 ease、删除脉冲动画。
- `tailwind.config.ts`：注册 `cinnabar`、调整 `fontFamily` / `fontSize` / `borderRadius`。
- `components/ui/Reveal.tsx`（新）：IntersectionObserver 滚动渐显组件。
- `components/ui/CTA.tsx`、`components/ui/PageHero.tsx`：主按钮朱砂化、圆角 3px、引用边线朱砂。
- `components/layout/Header.tsx`：当前导航下划线/CTA 朱砂化、圆角 3px。
- `components/layout/AIChatWidget.tsx`：移除脉冲动画类。
- `components/features/home/HomePageBrandHub.tsx`：接入 Reveal、修复 `Buildings` 导入、标题/标签/按钮对齐设计系统。
- `app/knowledge/page.tsx`：修复 StructuredData 调用（SSG 构建报错）。

## 八、验证结果

- `npx tsc --noEmit`：通过（0 错误）。
- `npm run lint`：通过（0 错误，1 既有 warning 在 `app/admin/(protected)/projects/[id]/page.tsx`，未触碰）。
- `npx next build`：通过（需 `NODE_OPTIONS=--max-old-space-size=4096`，因项目较大）。
- 视觉抽查：桌面 1440px / 移动 375px 截图已保存于 `tmp/pdf-rebuild/zeno-screens/`。
