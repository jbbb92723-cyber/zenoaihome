# AGENTS.md｜ZenoAIHome 工作区协作规则

> 本文件给 Codex、Claude、Hermes 以及其他 Agent 读取。它定义 `G:/Zenoaihome.com` 工作区的边界、写入规则、验证规则和提交纪律。

## 1. 工作区定位

本工作区同时包含：

- `Zeno-Code/zeno-site/`：ZenoAIHome 官网代码。
- `Zeno-Code/`：正式代码整理区，官网代码已迁入其中。
- `Zeno-Content/`：内容资产、阶段方案、审计记录、架构文档。
- `Zeno-Tools/`：脚本、Agent 协作配置、工具链、辅助工具。
- `Zeno-Content/赞诺内容资产库/`：Zeno 的内容资产、Obsidian 知识库、内容结构化系统。

不要把内容资产库当成网站源码。不要把网站临时设计预览当成线上资产。不要把本地运行日志当成项目内容。

## 2. 优先级

如果规则冲突，按以下顺序执行：

1. 用户当前明确指令。
2. 当前目录最近的 `AGENTS.md`。
3. 当前目录最近的 `CLAUDE.md`。
4. 本文件。
5. 通用工程习惯。

`AGENTS.md` 管跨 Agent 的边界和纪律；`CLAUDE.md` 管 Claude Code 的具体协作方式。二者冲突时，`AGENTS.md` 优先。

## 3. 目录边界

### `Zeno-Code/zeno-site/`

官网 Next.js 项目。只在任务明确涉及官网、页面、组件、数据、样式、构建、部署时修改。

### `Zeno-Code/`

代码整理与官网承载区。正式官网在 `Zeno-Code/zeno-site/`。

### `Zeno-Content/`

内容资产与工作文档区。优先放文案、素材、项目文档、审计记录和阶段性方案。

### `Zeno-Tools/`

脚本、自动化、Agent 配置、技能和辅助工具区。适合放本地工具脚本与协作配置。

### `Zeno-Content/赞诺内容资产库/`

内容资产与知识结构系统。处理原则是保留来源、结构化沉淀、可追溯、可重组。不得把这里的素材当成可以随意清理的临时文件。

### `Zeno-Code/zeno-site/public/design-previews/`

设计预览资产。未被线上页面引用时，默认不提交、不部署、不当作生产资源。

### 本地日志

`hs_err_*.log`、`replay_*.log`、`.next/`、`node_modules/`、临时缓存默认不提交。

## 4. 文件权限

### 可以直接修改

- 用户明确点名的文件。
- 与当前任务直接相关的官网页面、组件、数据、文档。
- 新增或更新协作规则文件。

### 必须先审计再修改

- 网站信息架构、导航、路由、服务体系。
- `app/`、`components/`、`data/`、`lib/` 的跨目录整理。
- 内容资产库的目录结构、来源登记、处理状态、内容单元规则。
- 批量删除、批量迁移、批量重命名。

### 默认不得修改

- `.git/`
- `node_modules/`
- `.next/`
- `.env.local`
- `.obsidian/`
- 原始素材副本
- 用户未说明的归档文件

## 5. 执行规则

- 单文件小修可以直接执行。
- 多文件、多系统、架构调整必须先给计划。
- 不要凭空新建平行结构，先搜索现有入口。
- 不要重构无关代码。
- 不要删除用户未明确确认的文件；确需清理时先列出清单。
- 遇到 dirty worktree，必须只提交任务相关文件，不回滚用户改动。

## 6. 官网验证规则

修改 `Zeno-Code/zeno-site/` 代码后，优先运行：

```bash
npx.cmd tsc --noEmit
npm.cmd run lint
npx.cmd next build
```

如果 `npm run build` 卡在 `prisma generate` 的 Windows DLL rename 权限问题，要区分本机锁文件和代码错误，不要误报为 TypeScript 或页面构建失败。

## 7. Git 规则

- 用户明确说 `push` 或「可以提交并 push」时，才提交并推送。
- 提交前先看 `git status`，只暂存任务相关文件。
- 网站提交不得混入内容资产库删除记录、crash log、未引用设计预览。
- 内容资产库提交不得混入网站构建产物。
- commit message 要说明真实变更，不写空泛描述。

## 8. ZenoAIHome 当前主线

ZenoAIHome 不是普通装修公司官网，也不是单点报价避坑工具。

它的核心定位是：

> 帮助业主把理想生活翻译成可落地的空间方案、装修决策、预算边界、合同约定和交付风险控制。

任何网站、内容、工具、后台设计，都要通过这个判断：

> 这是否帮助业主把想要的生活，翻译成能落地、能签约、能交付、能长期居住的装修决策？
