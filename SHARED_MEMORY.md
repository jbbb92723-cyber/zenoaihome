# ZenoAIHome 改动日志

> 2026-07-12 ~ 2026-07-13 会话 · 由 Hermes + Zeno 协作

---

## 网站 (zeno-site)

### 新增文件

| 文件 | 改动原因 |
|------|---------|
| `app/services/quote-standard/page.tsx` | ¥499 报价/合同快审独立产品页。之后评审团决定砍掉 ¥499, 此页面保留但不再在梯子中展示 |
| `app/admin/(protected)/projects/page.tsx` | OA 后台「工地总览」——项目列表+状态+进度条+照片计数+KPI卡片 |
| `app/admin/(protected)/projects/[id]/page.tsx` | OA 后台「工地详情」——基本信息+7节点追踪+照片归档+沟通备注。新建自动创建7个默认节点 |
| `app/admin/(protected)/ai-reply/page.tsx` | OA 后台「智能回复」入口页 |
| `app/api/admin/ai-draft/route.ts` | AI 回复 API。RAG 模式：先搜 knowledge_entries → 注入 DeepSeek → 返回回复+匹配知识来源 |
| `app/api/admin/knowledge/seed/route.ts` | 一键预置 5 条种子知识 |
| `components/admin/ServiceDeskClient.tsx` | OA 服务待办工作台。四状态Tab+AI分类+AI回复。**「线索→成交」主流程** |
| `app/api/admin/ai-classify/route.ts` | 服务智能分类 API。DeepSeek 分6类（报价/合同/预算/施工/诊断/综合） |
| `app/api/admin/services/update/route.ts` | 服务状态更新 API。支持 status/aiCategory/responseText 更新 |
| `data/content/article-116-content.ts` | 文章 116 "你做的不是答疑，是帮人下定论" |

### 修改文件

| 文件 | 改了什么 | 为什么改 |
|------|---------|---------|
| `components/features/quote-check/QuoteCheckClient.tsx` | 底部服务路径：¥199/¥499/¥1,999 之前标"免费"→改正确价格；链接更新 | Bug修复：自伤商业 |
| `data/services/commercial-ladder.ts` | **全站唯一价格数据源**。2026-07-13 大精简：砍掉 ¥199/¥499/¥1,999；床垫从"选购建议"改为"严选床垫·自有产品·保50年"。最终梯子：免费诊断+初筛 → ¥2,500旗舰审查 → ¥2,000起节点顾问 → ¥299起床垫 | 评审团共识：中间层空转+价格倒挂。精简后只有4档，每条都有人走 |
| `app/services/page.tsx` | 决策路径链接同步更新 | 产品页锚点改为独立页面 |
| `app/sitemap.ts` | 添加 `/services/quote-standard` | SEO |
| `components/admin/AdminSidebar.tsx` | 新增「项目交付」「AI 工具」导航组 | OA 新增模块 |
| `lib/dashboard-stats.ts` | 加 projects 统计 | Dashboard 大屏 |
| `app/admin/(protected)/dashboard/page.tsx` | 加项目交付统计卡片 | 大屏完整 |
| `prisma/schema.prisma` | 新增 Project/ProjectNode/ProjectPhoto/ProjectNote/KnowledgeEntry；ServiceRequest 加 aiCategory/responseText/reviewedAt/savedToKnowledge | 项目交付+AI知识库+服务待办 |

---

## Hermes Skills

| Skill | 位置 | 为什么创建 |
|-------|------|-----------|
| `guo-chunlin-perspective` | Hermes skills + Obsidian vault | 蒸馏郭春林。概念-逻辑-系统三层思辨框架。第8个视角 |
| `shengcaiyoushu-perspective` | Hermes skills + Obsidian vault | 蒸馏生财有术。12个赚钱思维、龙珠机制、航海模型。第9个视角 |

---

## Obsidian 内容资产

| 文件 | 用途 |
|------|------|
| `02-方法卡/情绪的钱vs商业的钱-客户筛选二元法.md` | don哥方法迁移到装修场景 |
| `06-选题装配/2026-07-12_情绪的钱vs商业的钱.md` | → article 116 |

---

## 待部署/待操作

- [ ] Vercel 环境变量加 `DEEPSEEK_API_KEY`（AI 回复功能需要）
- [ ] Vercel 部署后 OA → 智能回复 → 点「预置知识库」
- [ ] 本机跑 `npx prisma db push`（新增表到 Supabase）
- [ ] 床垫独立产品页 `/mattress` 需要新建（商业模型从建议升级为直销）
- [ ] QuoteCheckClient 结果页链接清理——移除已砍产品的链接

---

## 关键决策记录

1. **产品梯子大精简**（2026-07-13）：砍掉 ¥199/¥499/¥1,999。评审团共识——中间层空转、价格倒挂、边界模糊。最终只有 free/¥2,500/¥2,000起 三档核心 + ¥299 床垫
2. **床垫改直销**：Zeno 计划直接卖床垫（自有选品），不只是建议。内部结构保50年。品牌从"选购建议"升级为"严选产品"
3. **¥499 页面保留但不展示**：`/services/quote-standard` 已建好，如果以后决定恢复 ¥499 快审可以直接启用
4. **改写规则**：他人内容必须完全变 Zeno 语言——自己的案例/表达/经历。不引用原作者
5. **Zeno 发素材不提问，直接处理**：存档方法卡+提取机制+映射到业务+标记文章潜力
6. **OA「项目交付」模块**：Prisma 模型管理工地+节点+照片+备注
7. **AI 回复采用 RAG 模式**：先搜知识库再调 DeepSeek
8. **OA「服务待办」工作台**：四状态Tab+AI分类+AI回复，是「线索→成交」的主流程引擎
