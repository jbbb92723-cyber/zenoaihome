# ZenoAIHome — 共享记忆

> 手机 Hermes 不翻代码也能知道的上下文。每条写清：改了哪个文件 + 为什么改。

## 2026-08-18 | Codex | 第二轮 SEO、性能与移动端基础优化

- `app/layout.tsx`、`app/page.tsx`、核心页面与文章 metadata：根布局不再把首页 OG 信息错误继承给子页；首页、资料库、培训、清单、博客/札记详情补齐页面级 canonical、OG/Twitter 和稳定摘要。中文文章标题由根模板统一追加品牌，已含“赞诺/Zeno”的标题不再重复。
- `app/blog/[slug]/page.tsx`、`app/notes/[slug]/page.tsx`：新增可见面包屑及同源 `BreadcrumbList`；文章社交图使用封面或品牌头像兜底；Markdown 表格在移动端可横向滚动。
- `app/sitemap.ts` 与 robots layouts：英文预览树继续 `noindex`，因此从 sitemap/hreflang 移除；后台、账户、认证、订单和个性化结果页补 `noindex`；`/tools/publish` 不再进入 sitemap。
- `app/blog/*`、`app/en/blog/*`、`ArticleEngagement.tsx`：列表客户端只接收文章摘要，英文列表不再打包全文；二维码库改为打开分享面板后动态加载；全局 `SessionProvider` 缩到实际需要的账户和讨论区。
- `app/layout.tsx`、`tailwind.config.ts`、`next.config.mjs`：移除构建时 Google 字体下载，改用系统中文字体栈；恢复生产压缩并启用 Next AVIF/WebP 图片优化。构建产物 WOFF2 从 202 个约 10 MB 降为 0。
- `PasswordInput.tsx`、Header 及主题/语言按钮：首页 320px 标题不再溢出，移动触控目标统一到至少 44px，密码显隐恢复键盘访问。
- 生产构建生成 255/255 页面：首页 First Load JS 从 173 KB 降到 102 KB，共享 JS 从 132 KB 降到 87.4 KB；`/en/blog` 页面代码从 85.2 KB 降到 1.95 KB。TypeScript、生产构建通过；Lint 仅保留后台项目照片一个既有 `<img>` warning。

证据边界：`/cases` 当前明确是方法示例，不是客户案例；唯一项目记录尚无可公开的完整结果与授权，风险词典的“我见过”也尚未逐条挂证据。因此本轮没有新增“真实案例”内链，只把 `/renovation` 的不准确表述改为“相关文章和实践复盘”。

---

## 2026-08-15 | Codex | 收拢公开判断与付费服务路径

- `lib/navigation.ts`：将「公开实践」与「装修判断」拆为独立主导航入口；装修路径集中指向 `/renovation`、免费工具、资料库和报价审核。
- `components/features/home/HomePageBrandHub.tsx`：首页首屏改为按处境分流，进入装修、AI 项目或公开实践；装修实践入口改为 `/renovation`。
- `app/resources/page.tsx`：修正“看三档人工服务”错误指向 AI 项目页的问题，改为装修判断路径。
- `app/renovation/page.tsx`：补齐免费工具 → 报价审核的可见路径，显示服务价格与交付边界入口。
- `components/features/quote-check/QuoteCheckClient.tsx`、`data/tools/budget-risk.ts`、`data/tools/toolSeoAssets.ts` 及相关风险/清单页面：将装修上下文中的失效 `/services` 锚点统一到报价审核或节点顾问页面。
- `data/services/products.ts`：未接通交付链路的 ¥49 自查工具包暂不激活；星火者商品保持可售。

商业原则：文章、方法和基础工具公开；针对用户具体材料承担判断责任时收费。强退款承诺、上传材料处理和生产支付配置仍需按真实交付能力单独核对。

---

## 2026-07-27 OPC 课程体系 v3.0 七视角终极评审 + 网站部署

### 评审与框架
- 七视角决策评审团（新增 Tiago Forte 知识架构师视角）对 OPC 课程体系进行深度交叉评审
- 8 轮辩论，七票同意零票反对，产出 v3.0 最终框架
- 核心产出：课程金字塔（三层三模块+18卡6+6+6归属）、PARA资产映射、CODE 90天路线图、7层定价阶梯（含渐进式总结深度L1-L5）、3+1层护城河（新增知识复利护城河）、Grand Slam Offer 5要素（新增升级钩子）
- 内部战略句：「在南宁，用17年的伤疤和AI的武器，带你建一个只有你能建的一人公司」
- Tiago Forte skill 蒸馏完成（575行/38KB），存为 perspective-skill

### 网站
- `app/opc-knowledge/page.tsx` — 升级为 v3.0：课程金字塔+18方法卡+定价阶梯+护城河+Grand Slam Offer
- 页面展示三模块（转型实战/城市落地/AI武器库）、18卡归属、7层定价（含L1-L5深度标注）、3+1护城河

### Obsidian
- v3.0 完整框架存为方法卡 `OPC-课程体系v3.0-七视角终极框架.md`
- Tiago Forte 蒸馏 skill 存为 `perspective-skills/tiago-forte-knowledge-architect.md`

**改了什么**：

### 审计 P0/P1 修复（4 处）
- `components/features/content/ArticleCTA.tsx:24` — RENO_CTA 次动作 ¥2,500旗舰→/renovation
- `components/features/quote-check/QuoteCheckClient.tsx:769-773` — 服务路径三档付费→免费初筛/装修视野/一对一
- `app/zeno-os/page.tsx:70,80` — 付费服务+FAQ 对齐新产品体系
- `app/tools/quote-checklist/page.tsx` — ¥99付费→免费，CTA「买」→「获取」

### OPC 知识体系三部曲
- `app/opc-knowledge/page.tsx` — **新建**，OPC 知识体系落地页。展示三部曲（理论法规卷/城市实操卷/方法工具卷）+ 9 个框架预览。CTA 引导到星火者。底部强调「入群即送完整三卷 PDF + 方法卡 + 诊断模板」
- `lib/navigation.ts` — 星火者 mega menu 新增「OPC 知识体系」子项（三处：items + CN_TO_EN + knownCn）
- `app/sitemap.ts` — 新增 /opc-knowledge (priority 0.85)
- Obsidian 内容资产库 — 三部曲 PDF 存入 `01-原始素材区/外部素材/`，注册 SRC-MISC-077/078/079
- Obsidian 方法卡 — 9 个 OPC 框架方法卡（放弃信号/状态诊断/技能匹配/生产力/定价产品化/获客引擎/AI杠杆/协作网络/增长飞轮）

### AGENTS.md 重构（前序）
- `AGENTS.md` — 从旧定位重写为 IP 枢纽+流量引擎，视觉方向升级为 Zeno Studio

**改了什么**：`AGENTS.md` — 从旧定位（装修判断系统）全面重写为当前定位（IP 枢纽 + 流量引擎）。

**具体改动**：
1. **定位更新**：从"美学×装修判断系统"→"Zeno 赞诺个人品牌与商业入口，IP 枢纽+流量引擎"
2. **品牌架构**：新增赞诺（母）→ AI服务/星火者/装修视野/内容 四象限
3. **导航对齐**：与 navigation.ts 一致的 7 项导航结构
4. **技术栈**：更新为实际使用的 Next.js 14 / Vercel / Prisma+Supabase / next-auth v5
5. **内容系统**：新增文章管道、实际分类体系（6 个 parentCategory + 真实篇数）、Obsidian 资产库路径
6. **产品体系**：新增三层产品架构（AI服务/装修/星火者）+ OA 管理后台 7 模块
7. **视觉方向**：从「Zeno Monastic Editorial」升级为「Zeno Studio（工坊）」，新增 spark 琥珀强调色，五条设计原则
8. **装修产品**：标注已从公开产品梯子移除（页面保留不主推）
9. **Hermes 关系**：新增第 11 节，明确四个角色（内容引擎/运营中枢/资产管理/上下文）

**为什么改**：旧 AGENTS.md 会误导所有在该 repo 工作的 agent 按"装修判断系统"方向写代码，而不是"IP 枢纽"方向。

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

2026-08-05 | Codex | 新增 `docs/网站后台重构与API治理技术方案-v1.md`：推荐保留现有技术底座、拒绝整套后台 fork，按止血、统一身份、数据库 baseline、核心业务闭环、第三方 API 治理和质量门禁六阶段实施。

2026-08-05 | Codex | 后台第一阶段已落地 `ServiceRequest → Opportunity → Proposal → Agreement → Project → ProjectDeliverable`；新增商机工作台、交付验收、管理员角色和审计，修复后台 API 鉴权与知识库 seed 清空风险；手动施工项目改为表单提交，GET 不再写库。生产迁移未执行，必须先做 baseline 对账。

2026-08-05 | Codex | 新增 `lib/integrations/ai/` 统一 Provider/Model 层，迁移 public chat、admin draft、classification；新增管理员 `/api/admin/readiness`，公开 `/api/health` 不再暴露配置；AI、排版、图片和公众号草稿补输入校验、限流、超时与上游错误脱敏。Redis 跨实例限流和用量成本持久化尚未完成。

2026-08-05 | Codex | 新增星火者业务闭环：`/community/apply` 记录成员申请，`/admin/community` 管理初筛、面聊、通过、订单和成员；通过后自动生成 `spark:180` 会员订单，确认收款开通资格，退款回收资格；首期 20 人限制，无新增数据表。
2026-08-06 | Codex | 完成无用代码审计：删除未引用旧首页/服务组件、废弃服务数据、事件追踪接口、重复工具、旧数据库初始化脚本和 `full-schema.sql`；同步移除 `pg` 与 `@types/bcryptjs`，更新现行维护文档。文章正文、Ops 内容工具、已引用资源和旧 URL 重定向均保留。
2026-08-06 | Codex | 安全审计确认已删除的 `scripts/init-db.mjs`、`scripts/setup-db.ps1` 曾包含硬编码凭据且已进入 Git 历史；上线前必须轮换 Supabase 数据库密码、`AUTH_SECRET`、`ADMIN_SESSION_SECRET`，禁止直接改写共享历史。
2026-08-06 | Codex | 优化 `/admin/login`：改为管理员账号登录 + 应急密码双入口，新增管理员角色未授权提示，并同步后台日常操作说明。
2026-08-06 | Codex | 修复邮箱验证码体验：抽出 `lib/verification-code.ts` 统一时长/重试常量，将注册、重置密码、改密验证码有效期从 10 分钟延长到 30 分钟，并同步邮箱模板、注册/找回密码/账号安全页提示。
2026-08-06 | Codex | 补齐 Google 管理员登录：`/admin/login` 新增 Google 管理员账号入口，受保护后台在未授权时回到登录页并提示先授权 ADMIN/OPERATOR，避免 Google 用户被要求输入本站密码。
2026-08-13 | Codex | 完成网站前后台一体化架构体检与 v2 实施基线：保留 Next.js + Auth.js + Prisma + Supabase 的模块化单体；30 天优先修复付款/订单/权益闭环、数据库静默失败、旧产品承诺冲突和隐私边界；前台按角色场景收敛入口，后台从资产大屏转为今日行动台；每次交付必须回流为案例与角色知识。详见 `docs/网站前后台一体化优化架构方案-v2.md`。
2026-08-13 | Codex | 落地可信主链第一批止血修复：`lib/prisma.ts` 仅允许读查询降级，写入/事务/原始 SQL 保留失败；新增 `lib/payment-config.ts` 与 `.env.example` 收款码配置；订单页和付款通知接口在未配置真实收款码时统一拒绝付款动作；订单未登录回调改为当前订单 URL；占位支付 Webhook 改为 HTTP 501；`app/opc-knowledge/page.tsx` 移除未验证价格、收入/合伙承诺，改成公开实践验证路径；新增 `app/privacy/page.tsx` 并在 Footer 提供隐私入口。生产收款码和数据库迁移仍需单独配置/对账。
2026-08-13 | Codex | 补齐诊断写入边界：`app/api/living-diagnosis/route.ts` 将诊断记录与分析事件放入同一事务，数据库不可用时返回 `503/ok:false` 而不再假成功；前端仍展示已生成结果并明确提示未保存。`app/sitemap.ts` 加入 `/privacy`。类型检查、lint、生产构建均通过；lint 仅保留既有项目照片 `<img>` 优化 warning。
2026-08-14 | Codex | 优化文章 54 为《从装修现场出发，我开始搭一人公司的工作系统》：正文收敛到 5 个证据链章节，保留报价比较、项目沟通记录和 AI 四步整理流程，补清网站、公众号、短视频、OPC 与星火者的职责边界；同步摘要、封面说明和 OPC 分类元数据。文章从约 4,874 字符/102 段降至约 2,613 字符/44 段，模板翻转从 23 处降至 6 处。tsc 通过，lint 0 error/1 条既有 warning，本地文章页返回 200；未提交、未推送。
2026-08-14 | Codex | 优化文章 04 为《四版报价单和几百条聊天记录，让我开始认真用 AI》：正文改为跨三个月装修项目的证据叙事，增加资料去标识、五字段整理和四项验收条件；文章 54 只保留 OPC 总述并链接 04/86，文章 88继续承担使用阶段。同步英文注册表、英文精选入口和 Sitemap，旧英文独立页永久重定向；文章 86 补第三方 AI 隐私边界。未提交、未推送。
2026-08-14 | Codex | 完成剩余强信号文章集中治理：55 改为报价感觉→字段核验，65 改为同条件六项比价，90 改为交付/成本/责任定价，115 只使用已记录业主原问；17、37、92 标记 `retired` 并分别重定向到 35、03、83，118 因无源码证据退役且不设重定向。`articles` 公开导出由 92 降至 88，退役材料仍留在私有注册表；专题移除 17/37，审计报告、迁移表与 115 来源卡同步更新。四篇新正文“不是/而是”集中翻转命中 0，tsc、lint（0 error/1 既有 warning）、`git diff --check` 和无网络路由契约检查通过；HTTP curl 因审批服务过载未获权限，不能声明运行时状态码已验证。未提交、未推送。
2026-08-16 | Codex | 根据“反模板化创作、反一键获客、AI 不替人判断”的公开立场，调整首页、服务页、OPC 经验资产化页与 llms.txt；新增文章 119《我不想把 AI 做成一台获客机器》。生产构建生成 253 个静态页面，3004 预览验证四个关键路由 200，新文章正文正常渲染。未提交、未推送。
2026-08-16 | Codex | 按用户最新口径将网站与首页标题改为“传统行业人的 AI 胜任力实践”，保留 `Zeno 赞诺` 品牌写法；About 与公开身份 metadata 不再输出真名。tsc 单独通过，lint 0 errors/1 条既有 warning，Next 253 页构建通过，3004 预览关键路由 200。未提交、未推送。
2026-08-16 | Codex | 调整首页 Hero 标题排版：将“传统行业人的 / AI 胜任力实践”固定为长度均衡的两行，降低并加宽价值句以恢复标题层级；TypeScript、lint（0 error/1 条既有 warning）与 Next 253 页生产构建通过，Playwright 在 390px/1440px 确认价值句均为一行且无横向溢出。3014 预览可用，未提交、未推送。
2026-08-17 | Codex | 根据用户希望“简洁明了、中文友好”并采用“我先转型探索”的叙事，将首页 Hero 改为“我的 AI 转型，从传统行业开始”，副句改为“我先拿自己的工作和项目来试，边做边记录”；同步浏览器、Open Graph 和 Twitter 标题为“赞诺｜一个传统行业人的 AI 转型记录”。tsc、lint 通过，lint 仅 1 条既有 `<img>` warning；真实 390px viewport 标题完整且无横向溢出，未提交、未推送。
