# SHARED MEMORY · ZenoAIHome 改动日志

> 每条记录写清楚：改了什么文件、为什么改、当前状态。
> 手机上的 Hermes 不用翻代码就能知道上下文。

---

## 2026-07-13 · Claude 会话

- 2026-07-13 | Claude | 统一模板库 `lib/templates.ts` — Claude 的8条 + Hermes 的12条合并为17条，双轨分类(UI+系统)
- 2026-07-13 | Claude | `AiReplyClient.tsx` 不再硬编码模板，改为从 `lib/templates.ts` 导入
- 2026-07-13 | Claude | `template-matcher.ts` 改为从 `lib/templates.ts` 匹配，保留变量填充
- 2026-07-13 | Claude | 确认 `lib/review-panel.ts`(八人评审团) 和 `.hermes/skills/` 两份评审团不冲突
- 2026-07-13 | Claude | Supabase 数据库已修复！新项目 mvpbqkdqsziwxrkhgvzq，29张表全部建好。DATABASE_URL 用 Pooler(6543)，直连5432被墙。**所有后台功能现在有真实数据库了。**

---

## 2026-07-13 · Hermes Desktop 会话

### 1. 修复 QuoteCheckClient 底部服务路径价格 bug
- **文件**：`components/features/quote-check/QuoteCheckClient.tsx`
- **改动**：第 769-774 行，将服务路径卡片中 ¥199/¥499/¥1,999 的价格从"免费"改为正确价格
- **原因**：旧代码把三个付费服务全标成了"免费"，损害定价感知
- **已部署**：✅

### 2. 新增 ¥499 报价/合同快审产品页
- **文件**：`app/services/quote-standard/page.tsx`（新建）
- **改动**：完整的 Hormozi 式产品页——Hero/审查范围/快审vs全审对比/赠品/退款保证/ROI计算/FAQ/交叉引流
- **原因**：之前 commercial-ladder.ts 里 ¥499 只有页面锚点，没有独立产品页，转化链路断裂
- **已部署**：✅

### 3. 更新 commercial-ladder.ts、services页、sitemap
- **文件**：
  - `data/services/commercial-ladder.ts` — ¥499 href 从 `/services#quote-standard` 改为 `/services/quote-standard`
  - `app/services/page.tsx` — 决策路径"准备继续谈或签约"跳转同步更新
  - `app/sitemap.ts` — 新增 `/services/quote-standard` URL
- **原因**：让新页面的导航、SEO、梯子数据全部对齐
- **已部署**：✅

### 4. 发布文章 #116「你做的不是答疑，是帮人下定论」
- **文件**：
  - `data/content/article-116-content.ts`（新建）
  - `data/content/articles.ts`（注册 id='116'）
- **内容**：OPC 一人公司类文章，讲客户筛选——情绪的钱 vs 商业的钱
- **原因**：Zeno 从 don哥方法论吸收后用自己的装修语言重写
- **已部署**：✅

### 5. 蒸馏郭春林 → perspective skill
- **文件**：
  - `G:/Hermes智能体/.hermes/skills/guo-chunlin-perspective/SKILL.md`（新建）
  - `Zeno-Content/赞诺内容资产库/perspective-skills/guo-chunlin-perspective-SKILL.md`（备份）
- **核心框架**：概念→逻辑→系统、降维视角、思想重构、人生十智
- **原因**：第八个视角 skill，补充"概念清晰+系统思维"维度
- **状态**：✅ 可用

### 6. 蒸馏生财有术 → perspective skill
- **文件**：
  - `G:/Hermes智能体/.hermes/skills/shengcaiyoushu-perspective/SKILL.md`（新建）
  - `Zeno-Content/赞诺内容资产库/perspective-skills/shengcaiyoushu-perspective-SKILL.md`（备份）
- **核心框架**：多方受益、龙珠激励、航海实战、12个赚钱思维
- **原因**：第九个视角，主题型 skill（社群运营+赚钱方法论）
- **状态**：✅ 可用

### 7. OA 后台新增「项目交付」模块
- **文件**：
  - `prisma/schema.prisma` — 新增 Project/ProjectNode/ProjectPhoto/ProjectNote 四模型
  - `components/admin/AdminSidebar.tsx` — 新增"项目交付"导航组
  - `app/admin/(protected)/projects/page.tsx`（新建）— 工地总览列表页
  - `app/admin/(protected)/projects/[id]/page.tsx`（新建）— 工地详情页
  - `app/admin/(protected)/dashboard/page.tsx` — 大屏加项目统计卡片
  - `lib/dashboard-stats.ts` — 新增 projects.active/total 查询
- **功能**：工地管理（7节点追踪/照片归档/沟通备注）、大屏统计
- **原因**：Zeno 要接工地做案例，OA 缺少项目管理模块
- **状态**：⚠️ 代码已 push，但 Prisma migrate 需要手动跑（本机连不上 Supabase）

### 8. OA 新增「智能回复」系统
- **文件**：
  - `app/admin/(protected)/ai-reply/page.tsx`（新建）
  - `components/admin/AiReplyClient.tsx`（新建）
  - `components/admin/AdminSidebar.tsx` — 新增"AI 工具"导航组
- **功能**：10个预设回复模板（效果/预算/避坑/报价/合同/施工/微信开场）、分类筛选、一键复制
- **原因**：Zeno 在微信上回复业主问题，需要快速调用标准回复
- **已部署**：✅

### 9. AI 回复升级 RAG 模式
- **文件**：
  - `app/api/admin/ai-draft/route.ts`（重写）— RAG: 先搜 knowledge_entries → 注入 prompt → DeepSeek 生成
  - `prisma/schema.prisma` — 新增 KnowledgeEntry 模型
  - `app/api/admin/knowledge/seed/route.ts`（新建）— 一键预置5条种子知识
  - `components/admin/AiReplyClient.tsx` — 显示匹配知识+置信度、预置按钮
- **种子知识**：预算区间参考、效果对应、避坑清单、报价检查、合同审查
- **原因**：AI 回复不能只靠模型幻觉，需要 Zeno 自己的专业知识做「判断」层
- **状态**：⚠️ 代码已 push，需要：① `npx prisma db push` 建表 ② POST `/api/admin/knowledge/seed` 预置 ③ Vercel 环境变量加 `DEEPSEEK_API_KEY`

### 10. 飞书定位讨论
- **结论**：飞书只做内容审批中控台（选题审批+稿件状态+团队协作）
- **不做**：Obsidian 替代品、网站编辑器、git 替代、双向同步
- **精简建议**：15张表 → 4张（选题池/稿件状态/发布记录/SOP）

---

## ⚠️ 待处理

1. **Prisma migrate**：本机 Windows 连不上 Supabase（5432 端口被墙，6543 池化认证失败）。Project/ProjectNode/ProjectPhoto/ProjectNote/KnowledgeEntry 五张新表需要手动 migrate。建议：Zeno 在本地能连 Supabase 的电脑上跑 `npx prisma db push`

2. **DEEPSEEK_API_KEY**：Vercel 环境变量未配置。部署后 AI 回复可用模板，但不能生成新回复。需要 key

3. **¥199 产品页**：评审团建议砍掉 ¥199。Zeno 未最终决定。¥499 页面已上线

4. **¥1,999 综合判断**：缺少独立产品页，href 仍是 `/services#quote-deep` 锚点

5. **飞书精简**：15 张表待精简到 4 张核心表
