# ZenoAIHome 改动日志

> 2026-07-12 会话 · 由 Hermes + Zeno 协作

---

## 网站 (zeno-site)

### 新增文件

| 文件 | 改动原因 |
|------|---------|
| `app/services/quote-standard/page.tsx` | ¥499 报价/合同快审独立产品页。之前只有 `/services#quote-standard` 锚点，免费工具的结果页引导到这里但点过去只是 services 页的一个卡片。现在有完整 Hormozi 式产品页：审查范围/赠品堆叠/风险逆转/FAQ/交叉引流 |
| `app/admin/(protected)/projects/page.tsx` | OA 后台「工地总览」——项目列表+状态+进度条+照片计数+KPI卡片 |
| `app/admin/(protected)/projects/[id]/page.tsx` | OA 后台「工地详情」——基本信息+7节点追踪+照片归档+沟通备注。新建自动创建7个默认节点(水电→防水→木工→贴砖→油漆→安装→竣工) |
| `app/admin/(protected)/ai-reply/page.tsx` | OA 后台「智能回复」入口页 |
| `app/api/admin/ai-draft/route.ts` | AI 回复 API。RAG 模式：先搜 knowledge_entries 关键词匹配 → 注入 DeepSeek prompt → 返回回复+匹配知识来源。无 API key 时降级为纯模板模式 |
| `app/api/admin/knowledge/seed/route.ts` | 一键预置 5 条种子知识(预算/效果/避坑/报价/合同审查) |
| `components/admin/ServiceDeskClient.tsx` | OA 服务待办工作台。四状态Tab(全部/待处理/处理中/已完成)+左侧列表+右侧详情面板。支持AI一键分类、AI生成回复、人工编辑保存| **「线索→成交」主流程**：之前服务页只是列表，现在是一台服务处理机器 |
| `app/api/admin/ai-classify/route.ts` | 服务智能分类 API。DeepSeek 将业主问题分6类(报价/合同/预算/施工/诊断/综合)，无key降级为关键词规则| 服务申请进来后自动分类，不用手动看 |
| `app/api/admin/services/update/route.ts` | 服务状态更新 API。支持更新 status/aiCategory/responseText，reviewedAt自动记录| 状态流转+回复保存需要后端支持 |
| `app/admin/(protected)/services/page.tsx` | 重写为 Server Component → 传递数据给 ServiceDeskClient | 改为客户端待办工作台模式 |
| `data/content/article-116-content.ts` | 文章 116 "你做的不是答疑，是帮人下定论" |

### 修改文件

| 文件 | 改了什么 | 为什么改 |
|------|---------|---------|
| `components/features/quote-check/QuoteCheckClient.tsx` | 底部服务路径区域：¥199/¥499/¥1,999 之前都标成"免费"→改为正确价格；结果页"查看报价/合同快审"链接从 `/services#quote-standard` 改为 `/services/quote-standard` | **Bug 修复**：免费工具页在教用户"人工服务不值钱"，商业自伤。链接更新是因为产品页已经独立 |
| `data/services/commercial-ladder.ts` | ¥499 快审的 href 从 `/services#quote-standard` 改为 `/services/quote-standard` | 产品页从页面锚点升级为独立页面 |
| `app/services/page.tsx` | 决策路径 code 03 的 href 同步更新 | 同上 |
| `app/sitemap.ts` | 添加 `/services/quote-standard` 到 static pages | SEO：新产品页需要被搜索引擎收录 |
| `components/admin/AdminSidebar.tsx` | 新增两个导航组：「项目交付」（工地总览）、「AI 工具」（智能回复） | OA 新增了这两个模块 |
| `lib/dashboard-stats.ts` | 接口加 `projects: { active: number; total: number }`，查询也加上了；三个 fallback 都更新了 | Dashboard 大屏要显示项目统计 |
| `app/admin/(protected)/dashboard/page.tsx` | 加 import Link，加项目交付统计卡片+快捷入口 | 大屏概览更完整 |
| `prisma/schema.prisma` | 新增 5 个模型：`Project`, `ProjectNode`, `ProjectPhoto`, `ProjectNote`, `KnowledgeEntry`；`ServiceRequest` 加 `aiCategory`/`responseText`/`reviewedAt`/`savedToKnowledge` 字段 | 支撑项目交付模块和 AI 知识库 |

---

## Hermes Skills

| Skill | 位置 | 为什么创建 |
|-------|------|-----------|
| `guo-chunlin-perspective` | Hermes skills + Obsidian vault | 蒸馏郭春林的认知操作系统。概念-逻辑-系统三层思辨框架、降维视角、企业家思想重构。Zeno 的第八个视角，用于战略诊断和认知升级 |
| `shengcaiyoushu-perspective` | Hermes skills + Obsidian vault | 蒸馏生财有术社群的实战赚钱框架。12个赚钱思维、龙珠激励机制、航海实战模型。Zeno 的第九个视角，用于项目评估和社群运营设计 |

---

## Obsidian 内容资产

| 文件 | 用途 |
|------|------|
| `02-方法卡/情绪的钱vs商业的钱-客户筛选二元法.md` | don哥方法吸收：把"赚情绪的钱 vs 赚商业的钱"二元分法迁移到 Zeno 的装修咨询场景 |
| `06-选题装配/2026-07-12_情绪的钱vs商业的钱.md` | 选题草稿 → 最终发行为 article 116 |

---

## 待部署/待操作

- [ ] Vercel build 成功后，在 Vercel 环境变量加 `DEEPSEEK_API_KEY`（AI 回复功能需要）
- [ ] Vercel 部署后进入 OA → 智能回复 → 点「预置知识库」
- [ ] 本机跑 `npx prisma db push`（新增 5 张表到 Supabase）
- [ ] ¥199 和 ¥1,999 产品页仍为空锚点（`/services#quote-entry` 和 `/services#quote-deep`），已决定砍掉 ¥199
- [ ] 飞书多维表格精简到 4 张：选题池、稿件状态、发布记录、SOP

---

## 关键决策记录

1. **¥199 砍掉，¥499 保留**：Zeno 决定自己接工地做案例后，¥199 的"3个风险点快扫"承诺太薄，没有存在价值。¥499 作为"比价入口"保留
2. **产品梯子变为"判断+交付一体化"**：免费工具→¥499快审→¥2,500全审→Zeno自己做工地→节点顾问。判断和交付不再分离
3. **改写规则**：所有他人内容必须完全变成 Zeno 自己的语言，不留痕迹——用自己的案例、自己的表达、自己的经历做论证。不引用原作者
4. **Zeno 发素材不提问，直接处理**：默认动作链=存档方法卡+提取机制+映射到Zeno业务+标记文章潜力
5. **OA 新模块 "项目交付"**：用 Prisma 模型管理工地+节点+照片+备注，Dashboard 卡片显示统计
6. **AI 回复采用 RAG 模式**：先搜知识库再调 DeepSeek，不是裸调。知识库是可维护的、Zeno 自己的专业知识
