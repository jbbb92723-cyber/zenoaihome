# ZenoAIHome 文件归属清单

日期：2026-06-08

目标：先建立文件归属，不移动文件。后续整理必须以这份清单为依据，避免为了“看起来整齐”而做无效搬家。

## 归属标签

| 标签 | 含义 | 判断标准 |
| --- | --- | --- |
| 官网前台 | 用户直接理解品牌、定位、服务、案例的页面和组件 | 影响普通业主第一路径 |
| 内容库 | 文章、专题、资料、笔记、英文文章 | 影响内容生产、SEO、知识沉淀 |
| 风险控制 | 报价、合同、检查模板、施工项目风险、风险词典 | 影响签约前判断能力 |
| 工具系统 | 诊断、报价初筛、预算/单位/瓷砖/涂料/验收工具 | 影响用户自助判断 |
| 商业转化 | 服务、产品、订单、资源领取、权益 | 影响付款、线索、交付 |
| 用户系统 | 登录、注册、账户、安全、订单页 | 影响会员/用户状态 |
| 后台管理 | admin 页面、管理 API、内部内容/订单/资源管理 | 只给管理员使用 |
| 内部运营 | 公众号发布、图片生成、微信草稿、md2wechat | 内部工作流，不是 C 端主路径 |
| 基础设施 | 布局、主题、导航、搜索、i18n、数据库、邮件、工具函数 | 跨域共享 |
| 旧入口 | 已下线但需要保留 301 的 URL | 保护旧链接和 SEO |

## app/ 路由归属

### 官网前台

| 当前文件 | 归属 | 后续建议 |
| --- | --- | --- |
| `app/page.tsx` | 官网前台 | 可进入 `app/(site)/page.tsx`，URL 不变 |
| `app/about/page.tsx` | 官网前台 | 可进入 `app/(site)/about/page.tsx` |
| `app/contact/page.tsx` | 官网前台 | 可进入 `app/(site)/contact/page.tsx` |
| `app/cases/page.tsx` | 官网前台 / 内容库 | 可进入 `app/(site)/cases/page.tsx` 或 `app/(content)/cases/page.tsx` |
| `app/services/page.tsx` | 官网前台 / 商业转化 | 可进入 `app/(site)/services/page.tsx` |
| `app/living-diagnosis/page.tsx` | 官网前台 / 工具系统 | 可进入 `app/(site)/living-diagnosis/page.tsx`，组件归 `features/living-diagnosis` |

### 内容库

| 当前文件 | 归属 | 后续建议 |
| --- | --- | --- |
| `app/blog/page.tsx` | 内容库 | 可进入 `app/(content)/blog/page.tsx` |
| `app/blog/[slug]/page.tsx` | 内容库 | 可进入 `app/(content)/blog/[slug]/page.tsx` |
| `app/resources/page.tsx` | 内容库 / 风险控制 | 可进入 `app/(content)/resources/page.tsx` |
| `app/topics/page.tsx` | 内容库 | 可进入 `app/(content)/topics/page.tsx` |
| `app/notes/page.tsx` | 内容库 / 用户系统 | 暂不动，依赖用户与笔记数据 |
| `app/notes/[slug]/page.tsx` | 内容库 / 用户系统 | 暂不动 |

### 风险控制

| 当前文件 | 归属 | 后续建议 |
| --- | --- | --- |
| `app/risk-dictionary/page.tsx` | 风险控制 | 可进入 `app/(content)/risk-dictionary/page.tsx` |
| `app/risk-dictionary/[slug]/page.tsx` | 风险控制 | 可进入 `app/(content)/risk-dictionary/[slug]/page.tsx` |
| `app/checklists/page.tsx` | 风险控制 | 可进入 `app/(content)/checklists/page.tsx` |
| `app/checklists/[slug]/page.tsx` | 风险控制 | 可进入 `app/(content)/checklists/[slug]/page.tsx` |
| `app/project-risks/page.tsx` | 风险控制 | 可进入 `app/(content)/project-risks/page.tsx` |
| `app/project-risks/[slug]/page.tsx` | 风险控制 | 可进入 `app/(content)/project-risks/[slug]/page.tsx` |

### 装修判断阶段内容

| 当前文件 | 归属 | 后续建议 |
| --- | --- | --- |
| `app/start/page.tsx` | 内容库 / 风险控制 | 可进入 `app/(content)/start/page.tsx` |
| `app/start/people/page.tsx` | 内容库 / 风险控制 | 可进入 `app/(content)/start/people/page.tsx` |
| `app/start/budget/page.tsx` | 内容库 / 风险控制 | 可进入 `app/(content)/start/budget/page.tsx` |
| `app/start/contract/page.tsx` | 内容库 / 风险控制 | 可进入 `app/(content)/start/contract/page.tsx` |
| `app/start/build/page.tsx` | 内容库 / 风险控制 | 可进入 `app/(content)/start/build/page.tsx` |
| `app/start/inspect/page.tsx` | 内容库 / 风险控制 | 可进入 `app/(content)/start/inspect/page.tsx` |
| `app/start/living/page.tsx` | 内容库 / 居住判断 | 可进入 `app/(content)/start/living/page.tsx` |

### 工具系统

| 当前文件 | 归属 | 后续建议 |
| --- | --- | --- |
| `app/tools/page.tsx` | 工具系统 | 可进入 `app/(tools)/tools/page.tsx`，URL 不变 |
| `app/tools/quote-check/page.tsx` | 工具系统 / 风险控制 | 可进入 `app/(tools)/tools/quote-check/page.tsx` |
| `app/tools/budget-risk/page.tsx` | 工具系统 | 可进入 `app/(tools)/tools/budget-risk/page.tsx` |
| `app/tools/budget-risk/result/page.tsx` | 工具系统 | 可进入 `app/(tools)/tools/budget-risk/result/page.tsx` |
| `app/tools/budget-structure/page.tsx` | 工具系统 | 可进入 `app/(tools)/tools/budget-structure/page.tsx` |
| `app/tools/inspection-guide/page.tsx` | 工具系统 / 风险控制 | 可进入 `app/(tools)/tools/inspection-guide/page.tsx` |
| `app/tools/unit-converter/page.tsx` | 工具系统 | 可进入 `app/(tools)/tools/unit-converter/page.tsx` |
| `app/tools/tile-calculator/page.tsx` | 工具系统 | 可进入 `app/(tools)/tools/tile-calculator/page.tsx` |
| `app/tools/paint-calculator/page.tsx` | 工具系统 | 可进入 `app/(tools)/tools/paint-calculator/page.tsx` |
| `app/tools/publish/page.tsx` | 内部运营 | 建议后续迁到 `app/admin/(protected)/publish/page.tsx` 或 `app/(internal)/tools/publish/page.tsx` |

### 用户系统与商业转化

| 当前文件 | 归属 | 后续建议 |
| --- | --- | --- |
| `app/login/page.tsx` | 用户系统 | 可进入 `app/(account)/login/page.tsx` |
| `app/register/page.tsx` | 用户系统 | 可进入 `app/(account)/register/page.tsx` |
| `app/forgot-password/page.tsx` | 用户系统 | 可进入 `app/(account)/forgot-password/page.tsx` |
| `app/reset-password/page.tsx` | 用户系统 | 可进入 `app/(account)/reset-password/page.tsx` |
| `app/account/page.tsx` | 用户系统 | 可进入 `app/(account)/account/page.tsx` |
| `app/account/orders/page.tsx` | 用户系统 / 商业转化 | 可进入 `app/(account)/account/orders/page.tsx` |
| `app/account/redeem/page.tsx` | 用户系统 / 商业转化 | 可进入 `app/(account)/account/redeem/page.tsx` |
| `app/account/resources/page.tsx` | 用户系统 / 内容库 | 可进入 `app/(account)/account/resources/page.tsx` |
| `app/account/security/page.tsx` | 用户系统 | 可进入 `app/(account)/account/security/page.tsx` |
| `app/order/[orderNo]/page.tsx` | 商业转化 | 可进入 `app/(account)/order/[orderNo]/page.tsx` |

### 后台管理

| 当前文件 | 归属 | 后续建议 |
| --- | --- | --- |
| `app/admin/page.tsx` | 后台管理 | 保持在 `app/admin` |
| `app/admin/login/page.tsx` | 后台管理 | 保持在 `app/admin` |
| `app/admin/(protected)/**/page.tsx` | 后台管理 | 保持现状，已有 route group |

### 英文站

| 当前文件 | 归属 | 后续建议 |
| --- | --- | --- |
| `app/en/page.tsx` | 英文站 / 官网前台 | 暂不动 |
| `app/en/about/page.tsx` | 英文站 / 官网前台 | 暂不动 |
| `app/en/services/page.tsx` | 英文站 / 官网前台 | 暂不动 |
| `app/en/tools/page.tsx` | 英文站 / 工具入口 | 暂不动 |
| `app/en/blog/page.tsx` | 英文站 / 内容库 | 暂不动 |
| `app/en/blog/[slug]/page.tsx` | 英文站 / 内容库 | 暂不动 |
| `app/en/articles/**/page.tsx` | 英文站 / 静态文章 | 暂不动，后续可并入英文内容数据 |
| `app/en/login/page.tsx` | 英文站 / 用户系统 | 暂不动 |
| `app/en/register/page.tsx` | 英文站 / 用户系统 | 暂不动 |
| `app/en/notes/page.tsx` | 英文站 / 内容库 | 暂不动 |

### API 路由

| 当前文件 | 归属 | 后续建议 |
| --- | --- | --- |
| `app/api/auth/**/route.ts` | 用户系统 | 暂不动 |
| `app/api/admin/**/route.ts` | 后台管理 | 暂不动 |
| `app/api/orders/**/route.ts` | 商业转化 | 暂不动 |
| `app/api/payments/webhook/route.ts` | 商业转化 | 暂不动 |
| `app/api/resource-claims/route.ts` | 商业转化 / 内容库 | 暂不动 |
| `app/api/redeem/route.ts` | 商业转化 | 暂不动 |
| `app/api/service-requests/route.ts` | 商业转化 | 暂不动 |
| `app/api/living-diagnosis/route.ts` | 工具系统 / 诊断 | 暂不动 |
| `app/api/chat/route.ts` | 工具系统 / 导航分流 | 暂不动 |
| `app/api/search/route.ts` | 内容库 / 搜索 | 暂不动 |
| `app/api/images/generate/route.ts` | 内部运营 | 后续可归 `app/api/internal/images/generate`，需确认调用路径 |
| `app/api/md2wechat/convert/route.ts` | 内部运营 | 暂不动 |
| `app/api/publish/wechat-draft/route.ts` | 内部运营 | 暂不动 |
| `app/api/internal/content/drafts/route.ts` | 内部运营 | 暂不动 |
| `app/api/comments/route.ts` | 内容库 / 用户系统 | 暂不动 |
| `app/api/track/route.ts` | 基础设施 | 暂不动 |
| `app/api/health/route.ts` | 基础设施 | 暂不动 |

## components/ 归属

### 未来应进入 `components/ui/`

| 当前文件 | 当前归属 | 说明 |
| --- | --- | --- |
| `components/Avatar.tsx` | 基础 UI | 头像组件 |
| `components/CTA.tsx` | 基础 UI | 通用 CTA |
| `components/Container.tsx` | 基础 UI | 通用容器 |
| `components/CopyLinkButton.tsx` | 基础 UI | 通用复制按钮 |
| `components/PageHero.tsx` | 基础 UI / 页面骨架 | 作为页面首屏模板 |
| `components/PasswordInput.tsx` | 基础 UI / 用户系统 | 可放 UI，也可放 account feature |
| `components/SectionHeader.tsx` | 基础 UI | 区块标题 |
| `components/StructuredData.tsx` | 基础 UI / SEO | 结构化数据组件 |
| `components/ThemeToggle.tsx` | 基础 UI | 主题切换 |
| `components/LanguageToggle.tsx` | 基础 UI | 语言切换 |

### 未来应进入 `components/layout/`

| 当前文件 | 当前归属 | 说明 |
| --- | --- | --- |
| `components/Header.tsx` | 基础设施 / 布局 | 主导航 |
| `components/Footer.tsx` | 基础设施 / 布局 | 页脚 |
| `components/SearchDialog.tsx` | 基础设施 / 搜索 | 全站搜索 |
| `components/ThemeProvider.tsx` | 基础设施 / 布局 | 全站主题 |
| `components/HashScrollHandler.tsx` | 基础设施 / 路由体验 | hash 滚动 |
| `components/ConditionalAIWidget.tsx` | 基础设施 / 工具入口 | 全站浮窗条件控制 |
| `components/AIChatWidget.tsx` | 工具系统 / 导航分流 | 可后续移到 `features/assistant` |

### 未来应进入 `components/features/`

| 当前文件 | 建议归属 | 说明 |
| --- | --- | --- |
| `components/home/HomePageGptSkill.tsx` | `features/home` | 首页主组件 |
| `components/living-diagnosis/LivingDiagnosisClient.tsx` | `features/living-diagnosis` | 居住诊断 |
| `components/quote-check/QuoteCheckClient.tsx` | `features/quote-check` | 报价初筛 |
| `components/budget-risk/BudgetRiskQuiz.tsx` | `features/tools/budget-risk` | 超预算自测 |
| `components/budget-risk/RiskDimensionCard.tsx` | `features/tools/budget-risk` | 超预算结果卡 |
| `components/tools/ToolPageShell.tsx` | `features/tools` | 工具页壳 |
| `components/tools/ToolSeoAssetSection.tsx` | `features/tools` | 工具 SEO 内容区 |
| `components/CommercialLadder.tsx` | `features/services` | 商业梯子 |
| `components/ServiceCard.tsx` | `features/services` | 服务卡 |
| `components/services/ServiceRequestForm.tsx` | `features/services` | 服务表单 |
| `components/ArticleCard.tsx` | `features/content` | 文章卡 |
| `components/ArticleCTA.tsx` | `features/content` | 文章 CTA |
| `components/NoteCard.tsx` | `features/content` | 笔记卡 |
| `components/StageLayout.tsx` | `features/start` | 装修判断阶段页布局 |
| `components/resources/ResourceClaimButton.tsx` | `features/resources` | 资料领取 |
| `components/admin/**` | `features/admin` 或保持 `components/admin` | 后台组件 |

## data/ 归属

### 内容库

| 当前文件 | 归属 | 后续建议 |
| --- | --- | --- |
| `data/articles.ts` | 内容库 | 最大复杂度来源；后续拆成 `data/content/articles/index.ts` + `data/content/articles/items/*` |
| `data/article-54-content.ts` 到 `data/article-70-content.ts` | 内容库 / 增量文章 | 先确认是否仍由 `articles.ts` 引用；可迁到 `data/content/articles/items/` |
| `data/topics.ts` | 内容库 | 迁到 `data/content/topics.ts` |
| `lib/i18n/articles.ts` | 英文内容映射 | 可保留在 `lib/i18n`，或迁到 `data/content/en/articles.ts` |

### 风险控制

| 当前文件 | 归属 | 后续建议 |
| --- | --- | --- |
| `data/quote-risk.ts` | 风险控制 | 迁到 `data/risk-control/quote-risk.ts` |
| `data/quote-risk-rules.ts` | 风险控制 | 迁到 `data/risk-control/quote-risk-rules.ts` |
| `data/renovation-project-risks.ts` | 风险控制 | 迁到 `data/risk-control/project-risks.ts` |
| `data/checklist-templates.ts` | 风险控制 | 迁到 `data/risk-control/checklist-templates.ts` |

### 工具系统与诊断

| 当前文件 | 归属 | 后续建议 |
| --- | --- | --- |
| `data/living-diagnosis.ts` | 诊断 | 迁到 `data/diagnosis/living-diagnosis.ts` |
| `data/budget-risk.ts` | 工具系统 | 迁到 `data/tools/budget-risk.ts` |
| `data/toolSeoAssets.ts` | 工具系统 / SEO | 迁到 `data/tools/seo-assets.ts` |

### 服务、商业与资源

| 当前文件 | 归属 | 后续建议 |
| --- | --- | --- |
| `data/services.ts` | 商业转化 | 迁到 `data/services/services.ts` |
| `data/commercial-ladder.ts` | 商业转化 | 迁到 `data/services/commercial-ladder.ts` |
| `data/products.ts` | 商业转化 / 支付 | 迁到 `data/commerce/products.ts` |
| `data/resources.ts` | 内容库 / 商业转化 | 迁到 `data/resources/resources.ts` |

## lib/ 归属

| 当前文件 | 归属 | 后续建议 |
| --- | --- | --- |
| `lib/admin.ts` | 后台管理 | 可迁到 `lib/admin/auth.ts` |
| `lib/actions/admin.ts` | 后台管理 | 可保持或迁到 `lib/admin/actions.ts` |
| `lib/prisma.ts` | 基础设施 | 保持 |
| `lib/rateLimit.ts` | 基础设施 | 保持 |
| `lib/utils.ts` | 基础设施 | 保持 |
| `lib/validations.ts` | 基础设施 | 后续可按域拆分 |
| `lib/navigation.ts` | 基础设施 / 信息架构 | 保持，后续可迁到 `lib/site/navigation.ts` |
| `lib/track.ts` | 基础设施 / 分析 | 保持 |
| `lib/i18n/**` | 基础设施 / 英文站 | 保持 |
| `lib/living-diagnosis.ts` | 诊断逻辑 | 迁到 `lib/diagnosis/living-diagnosis.ts`，避免和 `data/living-diagnosis.ts` 混淆 |
| `lib/notes.ts` | 内容库 / 用户系统 | 可迁到 `lib/content/notes.ts` |
| `lib/entitlements.ts` | 商业转化 | 可迁到 `lib/commerce/entitlements.ts` |
| `lib/permissions.ts` | 用户系统 / 权限 | 可迁到 `lib/auth/permissions.ts` |
| `lib/email.ts` | 基础设施 / 集成 | 可迁到 `lib/integrations/email.ts` |
| `lib/md2wechat.ts` | 内部运营 / 集成 | 可迁到 `lib/integrations/md2wechat.ts` |
| `lib/wechat-official.ts` | 内部运营 / 集成 | 可迁到 `lib/integrations/wechat-official.ts` |
| `lib/volcengine-image.ts` | 内部运营 / 集成 | 可迁到 `lib/integrations/volcengine-image.ts` |
| `lib/internal-api.ts` | 内部运营 / API | 可迁到 `lib/internal/api.ts` |

## public/images/ 归属

| 当前文件 | 归属 | 状态 |
| --- | --- | --- |
| `images/resources/budget-template-preview.svg` | 资源资料 | 已引用 |
| `images/resources/quote-checklist-preview.svg` | 资源资料 | 已引用 |
| `images/resources/acceptance-checkpoints.svg` | 资源资料 | 已引用 |
| `images/resources/living-needs-map.svg` | 资源资料 | 已引用 |
| `images/resources/ai-prompt-pack.svg` | AI 内容资源 | 已引用，但不服务 C 端主路径；第四步判断是否清理 |
| `images/resources/explainer-storyboard.svg` | 未明确归属 | 当前未引用；可删候选 |
| `images/services/ai-workflow-proof.svg` | 服务页视觉 | 已引用，但命名偏旧 AI 叙事；可后续更名 |
| `images/services/renovation-judgment-proof.svg` | 服务页视觉候选 | 当前未引用；可删候选 |
| `images/services/sample-communication-script.svg` | 服务样张 | 已引用 |
| `images/services/sample-followup-checklist.svg` | 服务样张 | 已引用 |
| `images/services/sample-risk-report.svg` | 服务样张 | 已引用 |
| `images/articles/.gitkeep` 等 `.gitkeep` | 空目录占位 | 可保留，不算冗余 |

## next.config.mjs 归属

`next.config.mjs` 当前负责：

1. Next 图片设置。
2. build 时跳过 lint。
3. 旧入口 301 重定向。

必须保留的 301：

| 旧入口 | 新入口 | 原因 |
| --- | --- | --- |
| `/ai` | `/living-diagnosis` | 旧 AI 入口 |
| `/services/ai-workflow` | `/services` | 旧 AI 服务入口 |
| `/services/renovation` | `/services` | 旧装修服务页 |
| `/pricing` | `/services` | 旧价格页 |
| `/pricing/baojia-guide` | `/services` | 旧报价指南页 |
| `/tools/content-brain` | `/tools/quote-check` | 旧内容工具入口 |
| `/tools/prompts` | `/tools/quote-check` | 旧提示词入口 |
| `/en/tools/prompts` | `/en/tools` | 英文旧提示词入口 |
| `/en/resources` | `/en/tools` | 英文旧资源空壳 |
| `/en/topics` | `/en/tools` | 英文旧专题空壳 |
| `/en/pricing` | `/en/services` | 英文旧价格页 |
| `/en/pricing/baojia-guide` | `/en/services` | 英文旧报价指南页 |

## 第一轮判断

### 可直接清理候选

这些不是本次执行项，只是归属判断：

- `public/images/resources/explainer-storyboard.svg`
- `public/images/services/renovation-judgment-proof.svg`

### 第四步重点清理候选

- `data/resources.ts` 里的 `AI 内容工作流提示词包`
- `public/images/resources/ai-prompt-pack.svg`
- `app/tools/publish/page.tsx` 作为公开工具区页面的归属
- `app/api/images/generate/route.ts`、`app/api/md2wechat/convert/route.ts`、`app/api/publish/wechat-draft/route.ts` 的内部运营归属
- `data/articles.ts` 中仍面向 AI 提示词、AI 内容工作流、报价审核单点定位的旧 CTA

### 暂不建议动

- `app/admin/**`
- `app/api/auth/**`
- `app/api/orders/**`
- `app/en/**`
- `next.config.mjs` 里的旧入口 301
- 所有用户系统和支付相关文件

## 后续执行顺序

1. `components/` 先分出 `ui/`、`layout/`、`features/`，每批迁移后跑 `npx tsc --noEmit`。
2. `data/` 建立新分层目录，但先用 barrel export 保持旧 import 可用，再逐步替换。
3. 清理 AI 内容和旧报价单点定位残留。
4. 最后再考虑 `app/` route groups，因为路由层改动虽然不改 URL，但文件移动面最大。

