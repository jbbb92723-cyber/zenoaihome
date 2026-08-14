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

2026-07-26 | Codex | 整理本次待推送改动：官网协作规则更新与内容资产库结构化新增/索引更新分组提交；提交前修正 GROW 方案单元关联列表格式。

2026-08-01 | Kimi Code | 官网 zeno-site 完成「东方美学 + 实用主义」重构：接入 next/font 思源宋体/黑体；新增 cinnabar 朱砂强调色；圆角统一为 2-4px；共享 CTA/Header/PageHero 对齐新 token；新增 Reveal 滚动渐显组件；首页 HomePageBrandHub 接入新字体与动效；修复 knowledge 页与 CommercialLadder 的 TS/构建错误；tsc/lint/build 全通过；已 push。
2026-08-02 | Kimi | zeno-site：统一全站标题层级（H1 2.4/3.2rem、H2 1.8/2.2/2.6rem，11 个文件）；community 大标题去「赞诺·」前缀；Hero 人像 blur 2px + brightness .42 + 遮罩 48%。tsc/lint/build 通过，已 push（23cc0e4）。移动端「横向溢出」系 Chrome CLI 截图伪影，playwright 实测无溢出。
2026-08-02 | Kimi | zeno-site Hero 主标题从焦虑型改为赋能型：「传统行业从业者，也可以在 AI 时代把自己重做一遍」，副文案「不是被替代，而是用判断力、工具和同行者，把经验换成新的交付方式」。已 push（456cb36）。注意：dev server 运行中不要跑 next build，会互相污染 .next 导致页面挂起。
2026-08-08 | Codex | 将官网主定位校正为“赞诺的个人博客与公开实践档案”，以传统行业 × AI、一人公司和装修垂直实践为三条内容主线；首页、导航、关于、AI 工具与项目合作页同步调整，并以克制方式落地“差一点、预拥有、身份痒、神秘痒、亏欠痒”；修复内嵌正文文章可能被渲染为空白的问题。已通过 TypeScript、lint 与 Next.js 构建，未提交、未推送。
2026-08-12 | Codex | 修复“16 年/17 年”身份口径冲突：当前权威口径统一为“截至 2026 年，17 年传统行业经营与项目经验，长期涉及家居与装修实践”；同步更新知识库品牌资料、网站 AI 助手、作者简介、产品说明和当前公开文章，明确归档提示词保留历史原文。
2026-08-13 | Codex | 将品牌架构升级为“赞诺个人 IP 与信任主体 → 经验资产化 → 角色经营知识体系/Zeno OS → 星火者验证共同体”，明确装修为最深垂直验证场，并将业主装修判断与传统行业实践者经验资产化拆成两条承接路径；同步更新知识库定位真源、网站架构、首页、About、OPC 页面、文章结构化数据与 llms.txt。因缺少原始凭证，移除网站公开的 20 万+客户、3000 万+合同金额、认证专家和注册建造师声明。tsc、lint 通过；build 因本机无法解析 fonts.googleapis.com 下载 next/font 失败，非代码错误。已按用户明确要求准备推送。
2026-08-14 | Codex | 继续治理赞诺内容资产库：新增内容单元严格审计与历史元数据迁移脚本；补齐 32 个旧单元的必填字段，5 个 2026-07-26 单元统一登记来源 `SRC-MISC-076` 并保持「待验证」；将 `SRC-EXT-MDL-001` 至 `008` 以本地 OCR 定位副本登记到唯一来源表，状态为「已登记，待原件复核」。重建台账、关系、去重、Obsidian 链接和系统总览；当前 50 个内容单元错误 0、警告 3，关系 21 条且目标缺失 0，去重候选 19 条，来源注册表 89 条。未提交、未推送；下一主动作仍是收集 3 份真实签约前报价问题并完成 1 次最小审核。
2026-08-14 | Codex | 完成全站文章第一轮发布层清理：对 92 篇已注册文章删除 37 个旧 ¥199 报价入口、46 处通用服务尾注、35 处内部知识卡片尾注，并清理重复/尾部 `---`；未改标题、摘要、正文论点，未处理未注册的 article-93 至 article-113。修正 `ArticleCTA` 旧中文分类映射，复扫 `stale_offer`、`knowledge_card_footer`、`generic_service_footer` 均为 0；未提交、未推送。下一步再逐篇处理标题/摘要/正文的模板化表达。
2026-08-14 | Codex | 将强信号文章 54 重构为《从装修现场出发，我开始搭一人公司的工作系统》：正文从约 4,874 字符/102 段压缩为约 2,613 字符/44 段，“不是 X，是 Y”由 23 处降至 6 处；保留报价比较、项目沟通记录和 AI 整理流程，新增网站/公众号/短视频分工、OPC 与星火者验证边界；同步标题、摘要、封面说明及 `parentCategory: opc`、`subcategory: solo-method`。tsc 通过，lint 0 error/1 条既有 `<img>` warning，文章页本地返回 200；未提交、未推送。
