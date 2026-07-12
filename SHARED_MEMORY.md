# Shared Memory — Claude · Hermes · Codex

> 一句话一条。任何 Agent 做完实质性变更后在这里追加。读取时从上往下扫，最新在最上面。
> 格式：`YYYY-MM-DD | Agent | 事实`

---

## 2026-07-12 | 最新状态

- 2026-07-12 | Claude | Zeno OS 数字资产大屏已上线 `/admin/dashboard`，覆盖网站文章/Obsidian/商业/代码/Git/管道 6 个维度
- 2026-07-12 | Claude | Hermes 飞书管道已恢复，所有脚本 `--as user` 改为 `--as bot`，manifest.json 已创建
- 2026-07-12 | Claude | Zeno OS API 体系 Phase 1 完成：`/api/hermes/status` `/pipeline` `/topics/scan` `/briefs` `/drafts` `/quality-check` 6 个端点
- 2026-07-12 | Claude | 业主 AI 分类系统上线：`lib/classifier.ts`(规则引擎) + `lib/template-matcher.ts`(8条回复模板) + `/admin/services/[id]` 详情页
- 2026-07-12 | Claude | Prisma 全局容错代理已加，数据库不可用时所有后台页面不崩溃，静默返回空数据
- 2026-07-12 | Claude | 八人评审团蒸馏完成：`lib/review-panel.ts` — don哥/毛泽东/Dan Koe/Justin Welsh/Alex Hormozi/安先生/郭春林/生财有术
- 2026-07-12 | Claude | 侧边栏当前结构：概览(大屏+管道) / 用户运营 / 内容与服务 / 项目交付(工地) / 营销工具 / 系统
- 2026-07-12 | Claude | 后台骨架屏 loading.tsx 已加，点侧边栏瞬间有反馈

## 架构事实

- 网站是 Next.js 14 + Prisma + Supabase PostgreSQL，部署在 Vercel
- 内容资产源是 Obsidian 本地 vault：`Zeno-Content/赞诺内容资产库/内容结构化系统/`
- 飞书 Base Token：`MZEybml1aaBX4zsIUPwcVUHcnHc`，15 张表，bot 身份可读写
- Hermes 脚本在 `Zeno-Code/zeno-site/ops/zeno-lark/`，通过 `lark-cli` 调用飞书
- 网站零运行时飞书依赖，内容发布路径：Obsidian → git → build → 上线
- 数据库 Supabase 项目 `postgres.qnoujcvfpgegbfhajzmn` 当前不可用（ENOTFOUND），Prisma 容错代理兜底
- `manifest.json` 在 `ops/zeno-lark/` 本地，被 `.gitignore` 排除，含 baseToken 和 15 张表 ID
- `ADMIN_PASSWORD=your_admin_password_here` 在 `.env.local`

## 当前数据

- 网站文章：90 篇，7 个分类
- Obsidian：906 个 .md 文件，166 份原始素材，53 个内容单元，57 篇选题装配
- 飞书选题池：10 个选题，3 个 Brief，6 篇稿件，6 条审批（6 条待审批）
- Git：250 次提交（2026年），43 个活跃日
- 代码：67 页面，36 组件，26 API 路由，24 Prisma 模型

## 待解决

- Supabase 数据库需重建或恢复（当前 ENOTFOUND）
- lark-cli 版本 1.0.41，最新 1.0.68，建议升级
- `/admin/projects` 工地页面 Prisma 模型已建但数据库迁移未执行（Supabase 不可用）
- 服务申请 API 需登录才能提交（`/api/service-requests` 要求 auth session）
