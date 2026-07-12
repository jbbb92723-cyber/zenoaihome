# ZenoAIHome — 共享记忆

> 手机 Hermes 不翻代码也能知道的上下文。每条写清：改了哪个文件 + 为什么改。

---

## 2026-07-12 本轮改动

### 产品页面：¥499 快审页 + 价格 bug 修

**改了什么**：
- `app/services/quote-standard/page.tsx` — **新建**，¥499 报价/合同快审产品页。完整 Hormozi 式页面：Hero/审查范围/vs旗舰对比/赠品/保证/算账/FAQ/交叉引流。保证：找不出3个问题全额退款。
- `data/services/commercial-ladder.ts` — ¥499 条目的 href 从 `/services#quote-standard`（锚点）改为 `/services/quote-standard`（独立页）
- `app/services/page.tsx` — 决策路径 code 03 的 href 同步改为 `/services/quote-standard`
- `app/sitemap.ts` — 新增 `/services/quote-standard` 的 SEO 条目
- `components/features/quote-check/QuoteCheckClient.tsx` — **两处修改**：①底部"服务路径"区域把 ¥199/¥499/¥1,999 的"免费"改成实际价格（bug 修复）②结果页"查看报价/合同快审"链接从锚点改为 `/services/quote-standard`

**为什么改**：免费工具结果页引导用户到中间层产品，但 ¥199/¥499/¥1,999 只有页面锚点没有独立产品页——转化链条断了。¥499 是免费初筛结果页的主推路径，所以先建它。

---

### 文章发布：article 116

**改了什么**：
- `data/content/article-116-content.ts` — **新建**，文章「你做的不是答疑，是帮人下定论」
- `data/content/articles.ts` — 在 115 之后注册 article 116 元数据，category=OPC·同行有你，parentCategory=opc
- `06-选题装配/2026-07-12_情绪的钱vs商业的钱.md` — Obsidian 草稿存档

**为什么改**：栋哥的"情绪的钱 vs 商业的钱"方法论吸收后，用 Zeno 自己的装修行业经验重写。核心洞察：多数业主提问不是要答案，是等你说"你确实做不了"来获得不行动的许可。筛掉"要许可证的人"，留下"要行动方案的人"。

---

### OA 后台：项目交付模块

**改了什么**：
- `prisma/schema.prisma` — 新增 4 个模型：`Project`(工地)、`ProjectNode`(7个验收节点)、`ProjectPhoto`(照片)、`ProjectNote`(备注)
- `components/admin/AdminSidebar.tsx` — **两处新增**：①「项目交付」→ 工地总览 ②「AI 工具」→ 智能回复
- `app/admin/(protected)/projects/page.tsx` — **新建**，工地列表页（状态/进度条/照片计数）
- `app/admin/(protected)/projects/[id]/page.tsx` — **新建**，工地详情页（7节点追踪 + 照片归档 + 备注）。新建工地自动创建水电→防水→木工→贴砖→油漆→安装→竣工7个默认节点
- `app/admin/(protected)/dashboard/page.tsx` — 大屏新增在施工地统计卡片
- `lib/dashboard-stats.ts` — 新增 `projects.active/total` 统计查询

**为什么改**：OA 有用户运营/内容/营销/系统，但缺了"服务交付过程"的追踪。Zeno 自己接工地做案例，需要记录每个项目的节点进度和照片。这是从"纯顾问"到"顾问+交付"的关键基建。

---

### OA 后台：AI 智能回复（RAG 模式）

**改了什么**：
- `prisma/schema.prisma` — 新增 `KnowledgeEntry` 模型（title/category/tags/priority/content）
- `app/api/admin/ai-draft/route.ts` — **升级为 RAG**：先关键词匹配知识库（取 top 3），注入 DeepSeek prompt 再生成回复。返回 `matchedKnowledge` 数组给前端展示。无 API key 时降级为纯知识库匹配模式。
- `app/api/admin/knowledge/seed/route.ts` — **新建**，一键预置 5 条种子知识（预算区间/效果对应/避坑清单/报价检查/合同审查）
- `app/admin/(protected)/ai-reply/page.tsx` — 智能回复页面（服务器端 shell）
- `components/admin/AiReplyClient.tsx` — **新建**，两栏布局：左=10个模板（效果/预算/避坑/报价/合同/施工/微信开场）+ 分类筛选 + 一键复制；右=AI 草稿生成 + 知识库匹配展示（带置信度高/中/低）+ 「预置知识库」按钮

**为什么改**：之前 AI 回复是纯 DeepSeek 调参，回复质量取决于 prompt 好不好。RAG 模式让回复有知识依据——先搜 Zeno 的经验库，再让 AI 按 Zeno 风格表达。种子数据是 Zeno 真实经验的浓缩版。这样业主问"我这个预算够不够"，AI 能先匹配到 Zeno 的预算参考区间，再生成口语化回复。

---

### 飞书定位精简

**共识**：飞书只做内容审批中控台（选题审批 + 稿件状态追踪 + 团队协作），不做 Obsidian 替代品、不做网站编辑器、不做自动同步。4 张表够用：选题池、稿件状态、发布记录、SOP。

---

### OA 后台审计与修复（dbs 问诊结果执行）

**审计发现**：后台 8 个系统分散在 7 张表和 4 个文件中，用户数据无法关联、服务流转无追踪。

**改了什么**：

- `app/admin/(protected)/dashboard/page.tsx` — **新建转化漏斗面板**：在 3 个 KPI 行都已存在的情况下，新增了第三行"转化漏斗"卡片，展示 用户→诊断→提交→付费 四个阶段的数值和转化率。也新增了第四行"速览面板"（最近3条诊断 + 最近3条服务申请）。新增"最近操作日志"独立卡片取代旧的分散展示。所有面板统一用 `border-[#3A3530] bg-[#1f1d1a]` 暗色主题。

- `prisma/schema.prisma` — 扩展 `ServiceRequest` 模型：新增 5 个字段——`aiCategory`（AI分类）、`assignedTo`（分配人）、`priority`（优先级 urgent/high/medium/low）、`responseType`（回复类型）、`tags`（标签数组）。扩展 `User` 模型：新增 `totalSpent`（累计消费/分）、`serviceCount`（服务次数）、`tags`（标签数组）、`source`（获客渠道）字段。扩展 `LivingDiagnosis` 模型：新增 `priority`、`tags`、`adminReviewed` 字段。

- `app/admin/(protected)/services/page.tsx` — **增强状态筛选**：新增按 AI 分类（`aiCategory`）筛选；新增按优先级（`priority`）排序和彩色标记；新增"添加备注"弹窗（直接在列表页备注 + 修改状态/优先级/分配人）；新增 CSV 导出按钮（导出当前筛选结果）。

- `app/admin/(protected)/living-diagnoses/page.tsx` — **增强诊断管理**：新增按状态（`status`）标签筛选；新增按签约阶段（`stage`）筛选；新增优先级和标签可视化展示；新增"添加备注"弹窗（修改状态/优先级/添加备注）；新增 CSV 导出按钮。

- `components/admin/AdminSidebar.tsx` — **两处新增**：①「内容与服务」导航新增"转化漏斗"入口（`/admin/conversion`）；②导航组更名为更清晰的命名。

**为什么改**：
1. 转化漏斗面板——Zeno 的核心问题是"免费用户怎么变成付费客户"，之前大屏只有静态 KPI 数字，看不到流转。漏斗面板让每一层转化可视化。
2. 模型扩展——用户画像和服务记录原来完全无法关联。现在能在用户详情页看到累计消费和所有服务记录，能按标签筛选高价值客户。
3. 服务管理增强——原来所有服务请求只有"submitted/reviewing/completed/rejected"四个状态，无法区分紧急程度、无法分配负责人、无法标记客户类型。现在有完整的工作流。
4. CSV 导出——Zeno 有时需要用微信跟进客户，之前需要手动翻后台页面找信息。现在可以导出筛选结果后在微信里用。

---

### 商业模式澄清（dbs 问诊的决策确定）

**核心发现**：Zeno 不是"装修咨询公司"，是"居住判断支持系统"。产品形态不是按价格分级，是按判断深度分级。

**确认的产品架构**：
```
判断工具（免费，帮人自己看）
├── 报价初筛 → /tools/quote-check
├── 预算风险评估 → /tools/budget-risk
└── 居住诊断 → /living-diagnosis

判断服务（付费，替人看）
├── ¥2,500 零加价保障审查 → /services/quote-review（旗舰）
├── ¥499 报价/合同快审 → /services/quote-standard（主推）
└── ¥2,000起 施工节点顾问 → /services/node-advisor（进阶）

知识资产（系统沉淀）
├── 风险词典 → /risk-dictionary
├── 检查清单 → /checklists
└── 项目风险库 → /project-risks
```

**关键决策**：
- ¥199 风险初查已被砍掉——太轻，和 ¥2,500 之间的信任断层太大。¥199 只有锚点页面，没有独立产品页
- ¥1,999 居住方案综合判断也被砍掉——产品定位模糊，和 ¥2,500 重叠度高
- 核心产品线现在只有 3 个：免费工具 → ¥499 快审 → ¥2,500 全审
- Zeno 确认接工地做施工案例——这是从"纯顾问"到"顾问+交付"的战略转型。每个工地 = 一个活的内容生产线

---

## 已部署待迁移

### Prisma 新表（需要本地跑一下）
```
npx prisma db push
```
5 张新表：projects / project_nodes / project_photos / project_notes / knowledge_entries

### 种子数据（部署后在 OA → AI 工具 → 点「预置知识库」）
5 条种子：预算区间 / 效果对应 / 避坑清单 / 报价检查 / 合同审查

### 转化漏斗面板
访问 `/admin/dashboard` 查看新的转化漏斗 + 速览面板 + 操作日志面板
