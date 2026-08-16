# Zeno Site — 运行说明

> Zeno 个人网站。技术栈：Next.js 14 + TypeScript + Tailwind CSS + Auth.js + Prisma + Supabase PostgreSQL。

---

## 1. 项目介绍

这是 Zeno（zenoaihome.com）的个人网站代码雏形。

**网站定位**：个人信任中枢 + 博客沉淀 + 资料领取入口 + 联系入口

**核心表达**：从装修出发，聊居住、美学、人性、成长与 AI 时代的长期主义。

**当前包含的页面**：

| 路径 | 说明 |
|---|---|
| `/` | 首页 |
| `/about` | 关于我 |
| `/blog` | 文章列表（支持分类筛选） |
| `/blog/[slug]` | 文章详情 |
| `/topics` | 专题页 |
| `/resources` | 资料库 |
| `/contact` | 联系页 |

---

## 2. 技术栈

- **框架**：Next.js 14（App Router，服务端运行时）
- **语言**：TypeScript
- **样式**：Tailwind CSS v3
- **Markdown 渲染**：react-markdown + remark-gfm
- **字体**：Noto Sans SC（中文）+ Inter（英文）via `next/font/google`
- **认证**：Auth.js v5（邮箱密码 / Google）
- **数据层**：Prisma + Supabase PostgreSQL；migration 是数据库结构的唯一来源
- **部署**：Vercel（需要服务端运行时）

---

## 3. 如何安装依赖

确保本地已安装 Node.js 18+，然后运行：

```bash
cd Zeno-Code/zeno-site
npm install
```

如果需要安装 Typography 插件（tailwind prose 样式）：

```bash
npm install @tailwindcss/typography
```

---

## 4. 如何本地运行

```bash
npm run dev
```

浏览器访问 `http://localhost:3000`，即可看到首页。

**常用命令**：

```bash
npm run dev      # 开发模式（热更新）
npm run build    # 构建 Next.js 生产版本
npm run start    # 本地预览生产构建（需先 build）
npm run lint     # 代码检查
```

---

## 5. 如何修改首页文案

首页入口是 `app/page.tsx`，主要页面内容在 `components/features/home/HomePageBrandHub.tsx`。结构化数据和页面 metadata 在入口文件维护，首页区块与文案在主组件维护。

---

## 6. 如何新增文章

1. 参考相邻文章，在 `data/content/` 新增 `article-XXX-content.ts` 正文文件。
2. 在 `data/content/articles.ts` 注册文章 metadata，并导入对应正文。
3. 运行 `npx tsc --noEmit`，确认文章编号、slug 和导入路径有效。

文章会自动出现在 `/blog` 列表页和对应分类筛选中。如果日期最新，也会出现在首页的"最近写的"模块。

---

## 7. 如何新增资料

打开 `data/content/resources.ts`，参考现有条目在 `resources` 数组末尾新增一项：

```typescript
{
  id: '06',
  slug: 'ziyuan-slug',
  title: '资料标题',
  subtitle: '一句话副标题',
  description: '资料简介（2-3句话）',
  forWho: '适合谁',
  solves: '解决什么问题',
  howToUse: ['步骤一', '步骤二', '步骤三'],
  howToGet: '关注公众号，回复"关键词"即可获取。',
  caveats: '注意事项',
  relatedArticleSlugs: ['文章slug'],  // 可以为空数组
  tag: '装修',  // 装修 | 居住 | AI
}
```

---

## 8. 如何部署到 Vercel

**方式一：通过 Vercel 网页（推荐）**

1. 把代码推送到 GitHub（`g:\Zenoaihome.com` 仓库）
2. 登录 [vercel.com](https://vercel.com)，点击 "New Project"
3. 选择对应 GitHub 仓库，**Root Directory 设置为 `Zeno-Code/zeno-site`**
4. Framework Preset 选择 **Next.js**
5. 点击 Deploy，等待构建完成

**方式二：通过 Vercel CLI**

```bash
npm install -g vercel
cd Zeno-Code/zeno-site
vercel --prod
```

**自定义域名**：在 Vercel 项目设置 → Domains → 添加 `zenoaihome.com`，然后按提示在 IDC Flare（Cloudflare）添加 DNS 记录。

---

## 9. 当前网站能力边界

网站已经使用服务端运行时。文章正文保持公开阅读，互动和服务数据进入数据库，但不把互动数据包装成公开热度排名。

文章页第一版互动包括：

- 无登录分享：系统分享或复制链接，并记录分享方式；
- 无登录“对我有帮助”：按访客 cookie 去重，用于判断哪些文章真正帮到读者；
- 登录后评论：评论先进入待审核，不公开邮箱，不开放匿名评论；
- 后台审核：管理员在 `/admin/comments` 通过、拒绝或标记垃圾，操作写入后台日志。

具体设计见 [`docs/文章互动与IP反馈系统方案.md`](docs/文章互动与IP反馈系统方案.md)。

以下旧版 V2/V3 路线只保留为历史记录，当前以本节和架构方案为准。

后续能力（按实际反馈决定）：

```
V2：反馈资产化
  ↓ 从评论和行为反馈中提炼问题库
  ↓ 接入邮件订阅（Resend）
  ↓ 接入全文搜索（Algolia 或 Fuse.js）

V3：个性化与会员
  ↓ 建立收藏、阅读历史和主题订阅
  ↓ 可选接入 OAuth（微信/Google）
  ↓ 内容权限分层（公开 / 留资可见 / 会员）
  ↓ 个人中心（收藏、阅读历史）
```

认证、数据库和服务端运行时已经接入，后续只根据真实反馈增加能力，不再重复迁移基础设施。

---

## 10. 当前 v1.0 不做什么

| 功能 | 状态 | 理由 |
|---|---|---|
| 用户登录 / OAuth | ✅ 已有 | 支撑评论和后续个性化能力 |
| 会员分层 | ⏸ 暂缓 | 先证明内容反馈和真实交付闭环 |
| 评论系统 | ✅ 第一版 | 登录评论、人工审核、问题回流 |
| 邮件订阅 | ❌ 不做 | V2 再接 |
| 数据库 | ✅ 已有 | 认证、服务、互动和运营数据共用 Prisma |
| 搜索功能 | ❌ 不做 | 文章少时意义不大 |
| 暗色模式 | ❌ 不做 | 保持专注，减少变量 |
| 多语言 | ❌ 不做 | 先做好中文版 |
| 付费内容 | ❌ 不做 | V3 再考虑 |

---

## 目录结构

```
Zeno-Code/zeno-site/
├── README.md                     # 本文件
├── package.json
├── next.config.mjs               # Next.js 配置
├── tsconfig.json
├── tailwind.config.ts            # 自定义色彩（暖白底+暖石accent）
├── postcss.config.js
├── styles/
│   └── globals.css               # 全局样式 + 中文阅读优化
├── data/
│   ├── articles.ts               # 5篇种子文章数据
│   ├── topics.ts                 # 4个专题数据
│   └── resources.ts              # 5份资料数据
├── components/
│   ├── Header.tsx                # 导航栏（含移动端折叠）
│   ├── Footer.tsx                # 底部
│   ├── ArticleCard.tsx           # 文章卡片（default + compact 两种）
│   └── CTA.tsx                   # 按钮组件（primary/secondary/ghost）
└── app/
    ├── layout.tsx                # 根布局 + SEO metadata + 字体
    ├── page.tsx                  # 首页
    ├── about/page.tsx            # 关于页
    ├── blog/page.tsx             # 文章列表（分类筛选）
    ├── blog/[slug]/page.tsx      # 文章详情（react-markdown）
    ├── topics/page.tsx           # 专题页
    ├── resources/page.tsx        # 资料库
    └── contact/page.tsx          # 联系页
```

---

## 部署后如何修改网站

### 部署不是锁死网站

网站上线之后，你依然可以随时修改任何内容。不需要重新配置，不需要联系技术人员，也不需要在 Vercel 后台乱点东西。

**修改的流程永远只有三步：**

```
本地修改文件 → git push 到 GitHub → Vercel 自动重新部署（1-3 分钟）
```

---

### 常见修改场景

**修改文章内容**

1. 正文在 `data/content/article-XX-content.ts` 修改。
2. 标题、摘要、分类和 slug 在 `data/content/articles.ts` 修改。
3. 保存，提交到 GitHub
4. Vercel 自动重新部署

**新增文章**

按第 6 节新增正文文件并注册 metadata。

**修改或新增图片**

1. 把图片（webp 格式，≤200KB）放到 `public/images/` 对应目录
2. 更新对应 data 文件里的 `coverImage` 字段
3. 提交到 GitHub
4. Vercel 自动重新部署

图片路径规则：
- 文章封面：`/images/articles/文章slug/cover.webp`
- 品牌头像：`/images/brand/avatar.webp`
- 资料预览：`/images/resources/资料slug-preview.webp`

**修改或新增视频**

当前网站没有启用站内视频模块。视频先发布到 B站 / 视频号 / YouTube；等需要在网站展示时，再新增对应的数据文件和前台组件。不要把大视频文件直接放进 `public/`。

**修改联系方式**

打开 `app/contact/page.tsx` 或 `components/layout/Footer.tsx`，找到微信号 / 邮箱等字段，直接修改文字。

**修改服务价格或描述**

打开 `data/services/products.ts`，找到对应产品，修改 `price`、`description`、`bestFor` 等字段。

---

### 不建议这样做

- ❌ 不要直接在 Vercel 后台的编辑器里改代码（没有版本管理，容易出错）
- ❌ 不要把大视频文件放进 `public/` 目录（会导致部署失败或网站变慢）
- ❌ 不要删除 `public/llms.txt`、`public/robots.txt`、`public/sitemap.xml`（这些对 SEO 和 AI 引用有用）

---

### 网站的唯一真相来源

**本地项目文件夹 `Zeno-Code/zeno-site/` + GitHub 仓库**

Vercel 只是运行网站，所有真实内容和代码都在本地和 GitHub。  
只要本地文件和 GitHub 仓库是完整的，网站随时可以重新部署到任何平台。

---

*v1.0 — 2026年4月 · zenoaihome.com*
