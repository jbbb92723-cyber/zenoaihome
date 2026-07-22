# ZenoAIHome — 共享记忆

> 手机 Hermes 不翻代码也能知道的上下文。每条写清：改了哪个文件 + 为什么改。

---

## 2026-07-22 本轮改动

### 网站优化：装修判断入口页 + 残留文案修复 + 交叉引流

**改了什么**：
- `app/renovation/page.tsx` — **新建**，装修判断统一入口页。展示完整产品梯子（免费→¥2,500→¥2,000→¥299），按决策阶段分四步走。从 commercial-ladder.ts 读取数据。含 Hero/判断路径/产品卡片/为什么找Zeno/免费入口/微信CTA。
- `app/tools/page.tsx` — **三处修复**：①"必要时快审"改为"必要时付费判断"（旧产品已砍）②底部文案"报价/合同快审或居住方案综合判断"改为"报价审查或节点顾问" ③CTA从/services改为/renovation（引流到新产品入口页）
- `app/services/quote-review/page.tsx` — **新增**「签完合同要开工？」section，交叉引流到节点顾问+完整判断路径
- `app/services/node-advisor/page.tsx` — **新增**「装完入住？」section，交叉引流到床垫+完整判断路径
- `app/mattress/page.tsx` — CTA次动作从/blog改为/renovation（引导到完整判断路径）
- `app/sitemap.ts` — 新增 /renovation，priority 0.9
- `lib/navigation.ts` — **三处更新**：①「装修判断」mega menu新增「判断服务」子项→/renovation ②CN_TO_EN映射 ③knownCn数组

**为什么改**：
1. 装修产品线散落在四个独立页面（/living-diagnosis, /services/quote-review, /services/node-advisor, /mattress），没有统一入口。访客找不到完整产品梯子。建 /renovation 作为产品线中枢。
2. /tools 页有残留文案指向已砍的¥499快审和¥1,999综合判断，误导用户。
3. 产品页之间缺少互推——看完审查的人不知道有节点顾问，看完节点的人不知道有床垫。加上交叉引流形成闭环。
4. 导航和sitemap未覆盖新产品入口页。

---

### 上线前全站审查 + P0修复

**审查发现6个P0问题，全部修复：**
- `components/features/content/ArticleCTA.tsx` — RENO_CTA次动作 ¥499快审→¥2,500旗舰；MATTRESS_CTA主动作 /consulting→/mattress
- `app/page.tsx` — StructuredData 移除"不卖货"文案（现在自有床垫直销）
- `app/consulting/page.tsx` — "你不是卖床垫的吧"FAQ改为"你卖床垫吗"，对齐新策略
- `app/sitemap.ts` — 移除已砍 /services/quote-standard，新增 /mattress (priority 0.9)

### 文章117：装修公司上AI搞错了顺序

**改了什么**：
- `data/content/article-117-content.ts` — **新建**，文章正本。从外部视频"AI原生组织"提取底层机制（串行等待→节点消失），完全用装修行业场景重写。
- `data/content/articles.ts` — 新增 id=117 条目，slug=`zhuangxiu-gongsi-shang-ai-gaocuole-shunxu`，分类 OPC·同行有你。

**为什么改**：Zeno投喂的外部素材（AI原生组织变革视频逐字稿），经内容工厂处理后生成选题和文章。核心论点"减少等待比AI工具更重要"迁移到装修行业，面向装修公司老板。全文不引原作者，全用Zeno自己的17年装修经验和OPC实操。

**关联Obsidian资产**：
- 方法卡：`内容结构化系统/02-方法卡/AI原生组织-四阶段变革模型.md`
- 灵感卡：`内容结构化系统/01-原始素材区/外部素材/2026-07-13_AI原生组织变革-视频逐字稿.md`
- 选题草稿：`内容结构化系统/06-选题装配/2026-07-13_装修公司上AI搞错了顺序-文章草稿.md`

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

---

## 2026-07-12 会话 2：AI 回复系统 RAG 升级 + 知识库

### API：`/api/admin/ai-draft` → RAG 模式
**改了什么**：`app/api/admin/ai-draft/route.ts` — 完全重写
**为什么改**：原来的 AI 回复只调 DeepSeek，没有专业内容支撑。现在先搜 knowledge_entries 表（关键词匹配打分），把 top 3 匹配内容注入 DeepSeek prompt。无 API key 时降级为纯知识库匹配模式，不依赖外部服务也能用。
**关键设计**：
- 关键词匹配算法：标签命中 +3 分，标题命中 +2 分，内容匹配 +1 分
- 取 top 3，得分≥5 标记"高"相关，≥3"中"，否则"低"
- 返回 matchedKnowledge 数组供前端展示来源

### 知识库预置接口：`/api/admin/knowledge/seed`
**改了什么**：新建 `app/api/admin/knowledge/seed/route.ts`
**为什么改**：知识库初始为空，点一下按钮就能灌 5 条核心知识，不用手动录入。
**5 条种子**：预算区间/效果对应/避坑清单/报价检查/合同审查（全是 Zeno 真实经验，不是通用 AI 生成）

### Prisma：KnowledgeEntry 模型
**改了什么**：`prisma/schema.prisma` — 新增 KnowledgeEntry 模型
**字段**：title, category, content, tags[], priority, isActive
**分类**：budget | effect | pitfall | quote | contract | process | material | other

### AI 回复前端：知识库匹配展示
**改了什么**：`components/admin/AiReplyClient.tsx`
**为什么改**：AI 回复不能是"黑箱"——Zeno 需要看到 AI 引用了哪条知识。现在生成回复后，底部显示匹配的知识条目 + 相关度标签（高/中/低）
**新增**：「预置知识库」按钮

### AdminSidebar：新增 AI 工具组
**改了什么**：`components/admin/AdminSidebar.tsx`
**新增**：「AI 工具」→ 智能回复

### OA 后台架构总结（本次会话完整改造）
```
📊 数字大屏      — 新增转化漏斗/在施工地/速览面板/操作日志面板
👥 用户运营      — 用户/会员/订单（已成熟）
📝 内容与服务    — 草稿/笔记/诊断/申请/资料（已成熟）
🏗️ 项目交付      — 工地总览/详情/节点追踪/照片/备注（全新）
🤖 AI 工具      — 智能回复（模板库+RAG AI草稿）（全新）
🎯 营销工具      — 兑换码/优惠券（已成熟）
⚙️ 系统         — 日志/事件/内容管道（已成熟）
```

### API 清单
| 路径 | 方法 | 功能 | 状态 |
|------|------|------|------|
| `/api/admin/ai-draft` | POST | RAG 模式 AI 生成回复 | ✅ |
| `/api/admin/knowledge/seed` | POST | 预置知识库种子数据 | ✅ |
| `/api/admin/services/[id]` | PATCH | 更新服务申请状态/分类/回复 | ✅ |
| `/api/admin/stats/conversion` | GET | 转化漏斗统计数据 | ✅ |

### 商业模式决策
- ¥199 风险初查已砍——和 ¥2,500 之间信任断层太大
- ¥1,999 综合判断已砍——产品定位模糊
- 核心产品线只有 3 个：免费工具 → ¥499 快审 → ¥2,500 全审
- Zeno 确认接工地做施工案例——"顾问+交付"战略转型
- 每个工地 = 内容生产线
- 新 OA 结构已确认：5 大模块（数字大屏/用户运营/内容服务/项目交付/AI工具/营销/系统）
