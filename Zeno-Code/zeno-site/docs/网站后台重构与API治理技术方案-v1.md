# ZenoAIHome 网站后台重构与 API 治理技术方案 v1.0

> 日期：2026-08-05
> 状态：建议方案，待按阶段实施
> 适用范围：`Zeno-Code/zeno-site/` 的管理后台、用户系统、业务 API、内部内容管道和第三方服务集成
> 决策依据：2026-08-05 网站后台代码审计

## 1. 执行结论

### 1.1 最佳推荐

不拉取一个完整的 GitHub 后台项目进行整体二创，也不从零重写全部能力。

采用以下混合路线：

> 保留现有 Next.js + Auth.js + Prisma + Supabase 业务底座，重构后台安全边界和业务服务层；只对认证、限流、可观测性、API 文档等通用能力选择性采用成熟组件。

这是当前最稳妥的路线，原因是：

1. 当前代码已经有用户、会员、订单、兑换码、服务申请、居住诊断、项目交付、内容草稿和知识库模型。
2. ZenoAIHome 的核心后台不是通用 CMS，而是“线索到成交、判断到交付、内容到回流”的定制业务流程。
3. 完整套用开源后台会形成第二套认证、权限、数据模型、迁移和部署体系，整合成本通常高于修复现有系统。
4. 当前主要问题集中在鉴权、迁移、事务、幂等和运维，不是缺少一个更漂亮的后台 UI。
5. 现有前后台同仓部署在 Vercel，保留单体架构更适合当前团队规模和业务阶段。

### 1.2 立即不做

- 不 fork 通用 SaaS Starter 后整体替换现有项目。
- 不引入 Kong、Apache APISIX、Tyk 等独立 API 网关。
- 不拆微服务，不上 Kubernetes，不建设消息总线。
- 不让 Directus、Strapi、Payload 等系统接管全部业务数据。
- 不继续用 `prisma db push` 作为正式生产迁移流程。
- 不再新增只有页面、没有权限和业务闭环的后台模块。

## 2. 当前系统判断

### 2.1 已经值得保留的部分

| 能力 | 当前实现 | 处理建议 |
| --- | --- | --- |
| Web 框架 | Next.js App Router | 保留，升级单独立项 |
| 用户认证 | Auth.js + Credentials + Google | 保留，统一管理员身份 |
| ORM | Prisma | 保留，修复迁移纪律 |
| 数据库 | Supabase PostgreSQL | 保留 |
| 参数校验 | Zod | 保留，覆盖所有写接口 |
| 部署 | Vercel | 保留 |
| 邮件 | Resend | 保留，增加调用治理 |
| AI | DeepSeek/兼容 OpenAI 协议 | 通过统一 Provider Adapter 管理 |
| 后台 UI | 自定义 Zeno OS | 保留视觉和导航，补真实业务闭环 |

### 2.2 当前必须改变的部分

- 管理员身份不能继续长期依赖一个共享 `ADMIN_PASSWORD` cookie。
- 每个 Route Handler 和 Server Action 必须自己执行权限校验，不能只依赖后台 layout。
- 所有数据库结构必须由可重放 migration 管理。
- 订单、兑换、权益、知识入库等操作必须事务化、幂等化。
- 外部 AI、邮件、飞书和公众号调用必须有统一额度、超时、审计和降级策略。
- Vercel 运行时不能依赖全局 CLI 或向项目目录写临时文件。
- 后台功能必须满足“能创建、能编辑、能回滚、能审计”，不能只展示数据。

## 3. 是否采用 GitHub 开源项目

### 3.1 路线对比

评分为 1-5 分，5 分最好。

| 路线 | 业务适配 | 安全可控 | 迁移成本 | 运维复杂度 | 长期可维护 | 综合判断 |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| 整套 fork SaaS Starter | 2 | 3 | 1 | 2 | 2 | 不推荐 |
| Directus/Strapi/Payload 全面接管 | 3 | 3 | 2 | 2 | 3 | 当前不推荐 |
| Refine/React Admin 重做后台前端 | 3 | 3 | 2 | 3 | 3 | 暂不需要 |
| 完全从零重写 | 4 | 4 | 1 | 3 | 3 | 成本过高 |
| 保留现有底座并选择性复用 | 5 | 4 | 4 | 4 | 5 | 推荐 |

### 3.2 可选择性参考或引入的开源能力

以下项目适合“用能力”，不适合“把整个仓库搬进来”：

| 领域 | 建议 | 用法 |
| --- | --- | --- |
| 身份认证 | Auth.js | 继续使用，统一普通用户与管理员会话 |
| 数据访问 | Prisma | 继续使用，migration 成为唯一结构来源 |
| 校验 | Zod | 请求、环境变量、领域命令统一校验 |
| 分布式限流 | 托管 Redis 兼容限流器 | 只保存计数，不保存客户正文 |
| 错误监控 | Sentry 或等价平台 | 捕获服务端异常、请求 ID 和版本 |
| 追踪标准 | OpenTelemetry | 业务增长后接入，不作为首期阻塞项 |
| API 文档 | Zod 到 OpenAPI 的生成工具 | 从校验 Schema 生成接口规范 |
| 通用数据管理 | Directus | 仅在未来需要大量通用 CRUD 时作为独立评估项 |

引入任何开源依赖前必须检查：许可证、维护活跃度、最近安全公告、Node/Next 版本兼容性、迁移退出成本。

## 4. 目标架构

```text
前台用户 / 后台管理员 / 内部自动化
                |
                v
        Next.js Route Handler / Server Action
                |
                v
     统一请求守卫 Request Guard
     - 身份认证
     - 权限/Scope
     - Origin/CSRF
     - 限流
     - Request ID
     - 输入校验
                |
                v
          领域服务 Domain Service
     - users / content / services
     - projects / commerce / knowledge
                |
        +-------+--------+
        |                |
        v                v
 Prisma Repository   Provider Adapter
        |            AI/邮件/飞书/公众号
        v                |
 Supabase Postgres       v
                  外部服务与用量日志
```

### 4.1 保持模块化单体

当前不拆独立后端服务。建议按业务域整理服务层：

```text
lib/
  auth/
    admin.ts
    api-key.ts
    permissions.ts
  api/
    errors.ts
    guard.ts
    response.ts
    request-id.ts
  domains/
    services/
    projects/
    commerce/
    knowledge/
    content/
  integrations/
    ai/
    email/
    feishu/
    wechat/
```

这是目标归属，不要求第一阶段先批量搬文件。优先修行为，再按触达文件渐进整理。

### 4.2 Route Handler 只承担五件事

1. 认证和权限。
2. 解析与校验请求。
3. 调用领域服务。
4. 映射标准响应。
5. 写入必要的请求审计信息。

数据库事务、状态机、第三方调用和业务判断不得散落在页面组件中。

## 5. 管理员身份与权限方案

### 5.1 推荐方案

将管理员纳入 Auth.js 用户体系，在数据库中保存角色或权限：

```text
User.role = USER | OPERATOR | ADMIN
```

当前只有 Zeno 一人，也应至少区分：

| 角色 | 权限 |
| --- | --- |
| USER | 账户、订单、资料、自己的服务申请 |
| OPERATOR | 内容、服务申请、项目交付，不可改支付和系统配置 |
| ADMIN | 全部后台权限 |

首个管理员通过一次性部署配置或数据库脚本授予，不能通过公开注册接口申请。

### 5.2 权限执行规则

- 后台 layout 只负责页面体验，不作为唯一安全边界。
- 每个 API 和 Server Action 都调用 `requirePermission()`。
- 所有写操作同时校验动作和资源归属。
- 管理员高风险动作记录 actor、target、before、after、requestId、IP 和时间。
- 管理员会话建议 8-12 小时，支付、密钥等高风险操作可要求重新验证。
- 后续出现多人协作时再增加细粒度权限，不先建设复杂 RBAC 平台。

### 5.3 迁移期间

现有 `ADMIN_PASSWORD` 只作为短期应急入口：

1. 先修复 timing-safe 比较和限流。
2. 增加独立 `ADMIN_SESSION_SECRET`，禁止回退到管理员密码。
3. 新 Auth.js 管理员登录验证完成后，下线旧 cookie。
4. 不允许两套管理员身份长期并存。

## 6. API 管理方案

### 6.1 现阶段不需要独立 API 网关

当前 API 的消费者主要是同一个网站前端、后台浏览器和少量内部自动化。独立网关会增加部署、证书、路由、日志和权限维护成本，但不能替代应用内鉴权和事务。

当前采用三层治理即可：

1. Vercel/边缘层：基础 WAF、请求大小和粗粒度频率限制。
2. 应用层：身份、Scope、Zod、幂等、领域状态机。
3. 数据层：唯一约束、条件更新、事务和审计。

出现以下任一条件时，再评估 Kong/APISIX/Cloudflare API 管理：

- 三个以上独立应用共同调用 API。
- 对外开放合作伙伴 API。
- API Client 超过五个且需要独立配额和计费。
- 月请求量进入百万级并出现跨区域需求。
- 必须做复杂流量切分、版本灰度或协议转换。

### 6.2 API 分区

| 分区 | 示例 | 认证方式 |
| --- | --- | --- |
| Public | `/api/v1/public/living-diagnoses` | 匿名 + 限流 |
| User | `/api/v1/me/orders` | Auth.js 用户会话 |
| Admin | `/api/v1/admin/projects` | Auth.js + Permission |
| Internal | `/api/v1/internal/content/drafts` | Scoped API Key |
| Webhook | `/api/v1/webhooks/payment` | Provider 签名 |

Auth.js 自身回调路径可以保持原路径，不强制套 `/v1`。

### 6.3 标准请求守卫

所有受保护接口统一执行：

```text
requestId
-> body size
-> rate limit
-> authentication
-> permission/scope
-> origin check
-> Zod validation
-> domain service
-> audit/error mapping
```

任何名为 `/api/admin/*` 的接口都不得省略管理员权限校验。

### 6.4 标准响应

成功：

```json
{
  "ok": true,
  "data": {},
  "requestId": "req_xxx"
}
```

失败：

```json
{
  "ok": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "无权限执行此操作"
  },
  "requestId": "req_xxx"
}
```

生产响应不返回数据库连接错误、堆栈、密钥名称或上游完整响应。

### 6.5 内部 API Key

不要继续让所有自动化共用一个永久 Bearer Token。建议新增：

```text
ApiClient
- id
- name
- keyPrefix
- keyHash
- scopes[]
- status
- expiresAt
- lastUsedAt
- createdAt
```

规则：

- 数据库只保存 key hash 和可识别前缀，不保存明文。
- 一个调用方一个 key，可独立撤销和轮换。
- Scope 示例：`content:draft:write`、`pipeline:read`、`ai:generate`。
- 日志不记录 Authorization header 和完整请求正文。
- 支持旧 token 的短期双读迁移，完成后删除旧环境变量。

### 6.6 限流分级

| 接口类型 | 建议初始限制 |
| --- | --- |
| 管理员登录 | IP + 账号双维度，5 次/15 分钟 |
| 邮箱验证码 | IP、邮箱双维度，3 次/分钟、10 次/小时 |
| AI 生成 | 管理员 20 次/小时，公共工具 5 次/小时/IP |
| 公开诊断/表单 | 10 次/小时/IP |
| 内部管道 | API Client 60 次/分钟 |
| Webhook | 不按普通 IP 限流，以签名、事件 ID 幂等为主 |

限流存储必须跨 Vercel 实例共享。模块级 `Map` 只能作为本地开发降级方案。

## 7. 第三方 API 与 AI 管理

### 7.1 统一 Provider Adapter

DeepSeek、通用 LLM、Resend、飞书、md2wechat、火山引擎和微信接口应统一具备：

- 服务端密钥读取。
- 超时和取消。
- 最大输入、输出长度。
- 失败重试策略，仅重试可重试错误。
- 用量、成本和延迟记录。
- 故障降级。
- 内容脱敏策略。

业务代码不得直接散落 `fetch('https://provider...')`。

### 7.2 建议增加调用记录

```text
ProviderUsage
- id
- provider
- operation
- actorId/API clientId
- requestId
- inputUnits
- outputUnits
- estimatedCost
- latencyMs
- status
- errorCode
- createdAt
```

不默认保存完整客户问题。需要调试时只保存脱敏摘要，并设置保留期限。

### 7.3 AI 安全边界

- RAG 知识库只能通过管理员接口访问。
- 用户输入与知识上下文在提示词中明确分隔。
- 防止“输出全部知识库”等提示注入。
- AI 结果永远是草稿，涉及报价、合同和交付结论必须人工确认。
- 设置每日调用预算和异常熔断。
- 知识库种子操作改为幂等 upsert，禁止公开 `deleteMany()`。

## 8. 数据库与迁移方案

### 8.1 唯一原则

> `prisma/migrations/` 是正式数据库结构的唯一可重放来源；`schema.prisma` 是当前模型声明。历史 `full-schema.sql` 已清理，不再作为结构来源。

禁止直接在生产环境用 `prisma db push` 修结构。

### 8.2 首次对账步骤

1. 对 Supabase 生产库做可恢复备份。
2. 获取生产库真实结构，只读比对 `schema.prisma` 和现有 migrations。
3. 为已有基础表建立 baseline。
4. 为缺失字段和约束生成 reconciliation migration。
5. 在独立 staging 数据库执行完整 migrate 和回滚演练。
6. 备份后在生产执行 `prisma migrate deploy`。
7. 校验表、索引、外键、默认值和关键数据条数。
8. 将 `db push` 从部署说明和 SOP 中移除。

### 8.3 必须补的数据约束

- 业务状态改为 Prisma enum 或数据库 CHECK。
- 兑换码剩余次数使用条件更新，防止并发超发。
- 订单确认和权益发放使用同一事务及幂等事件 ID。
- 资源领取增加 `(userId, resourceId)` 唯一约束。
- Payment `transactionId` 按支付渠道建立唯一约束。
- 关键记录使用软删除或归档，不直接物理删除。
- 金额全部使用整数分，禁止浮点金额。

## 9. 业务模块改进

### 9.1 服务申请

- 合并两套重复的更新接口。
- 明确状态机：`submitted -> reviewing -> completed/rejected`。
- 状态变化必须记录操作者和前后值。
- “存入知识库”必须真实创建 KnowledgeEntry，并保留来源引用。
- AI 分类和回复只生成建议，不自动完成服务申请。

### 9.2 项目交付

- 新建项目改为 POST 或受保护 Server Action，GET 不写数据库。
- 新增项目表单，不先创建空记录再编辑。
- 补齐基本信息编辑、节点状态、反馈、照片上传、备注和归档。
- 照片使用对象存储，数据库只保存受控 URL 和元数据。
- 节点更新增加乐观锁或 `updatedAt` 冲突检查。

### 9.3 订单、优惠券和权益

- 优惠券校验、折扣计算、占用和订单创建放在同一事务。
- 支付回调必须验证原始请求签名。
- 以支付平台事件 ID 做幂等，不得对未验签请求返回业务成功。
- 人工确认付款使用条件更新，防止重复发权益。
- 永久会员按 `expiresAt = null OR expiresAt > now` 判断。
- 订单状态和支付状态分离，禁止用一个字符串混合表达。

### 9.4 内容管道

- 生产环境不调用全局 `lark-cli`。
- 优先通过飞书开放 API 或独立受控 worker 调用。
- 临时文件写入系统临时目录并使用随机文件名；能不用文件则不用。
- 后台页面服务端读取管道状态时显式携带内部凭证，或直接调用服务层。
- 耗时任务异步化，接口返回 jobId，后台轮询任务状态。

## 10. 安全基线

上线前至少满足：

- 所有管理员 API 和 Server Action 有独立权限测试。
- 密钥只存在于环境变量或密钥管理服务。
- 管理员、内部 API、Webhook 使用三种不同认证机制。
- 设置 CSP、HSTS、X-Content-Type-Options、Referrer-Policy 和 frame 限制。
- 敏感响应使用 `Cache-Control: no-store`。
- 健康检查拆为公开 liveness 和受保护 readiness。
- 日志对邮箱、电话、微信、地址和请求正文脱敏。
- 数据库备份、恢复和迁移有演练记录。
- 高风险删除需要二次确认，知识库和项目数据支持恢复。
- 依赖漏洞检查进入 CI，严重漏洞阻断部署。

## 11. 测试与发布门禁

### 11.1 最小测试集

| 类型 | 必测内容 |
| --- | --- |
| 单元测试 | 权限、状态机、折扣、兑换、会员有效期 |
| API 集成测试 | 未登录、越权、参数错误、成功、重复请求 |
| 数据库测试 | migration、唯一约束、事务、并发兑换 |
| E2E | 管理员登录、服务处理、项目创建、付款确认 |
| 安全测试 | 公开扫描 `/api/admin/*`、伪造 cookie、提示注入 |

### 11.2 CI 门禁

每次合并和部署前必须通过：

```bash
npx prisma validate
npx prisma generate
npx tsc --noEmit
npm run lint
npm test
npx next build
npm audit --omit=dev --audit-level=high
```

数据库 migration 在 staging 自动执行，生产执行需要人工确认和备份确认。

## 12. 分阶段实施计划

### Phase 0：止血，0.5-1 天

- 为所有 `/api/admin/*` 增加统一管理员守卫。
- 暂停或保护知识库 seed 接口。
- 为 AI、md2wechat、chat 增加认证或共享限流。
- 修复 timing-safe 长度异常。
- 收敛公开 health 输出。

验收：未登录调用所有管理员写接口均返回 401/403，且不访问数据库和第三方 API。

### Phase 1：身份与 API 基础，2-4 天

- 管理员并入 Auth.js。
- 建立 `requirePermission()`、标准错误和 requestId。
- 建立 Scoped API Client。
- 引入跨实例限流。
- 为现有写接口补 Zod。

验收：页面、API、Server Action 使用同一权限来源；旧管理员 cookie 可下线。

### Phase 2：数据库基线，2-4 天

- 生产结构盘点与备份。
- 建立 baseline 和 reconciliation migrations。
- 补知识库、权益、支付、资源唯一约束。
- staging 完整重建演练。

验收：空数据库只运行 migrations 即可得到可用结构。

### Phase 3：核心业务闭环，5-8 天

- 服务申请状态机与真实知识入库。
- 工地创建、编辑、节点、照片、备注。
- 优惠券、订单、付款确认和权益幂等。
- 关键操作审计和恢复策略。

验收：后台最常用的三条流程可以完整走通且可追溯。

### Phase 4：第三方 API 与内容管道，3-5 天

- Provider Adapter、调用记录、预算和熔断。
- 飞书 CLI 改为生产可运行的 API/worker。
- 内容任务异步化。
- OpenAPI 文档生成。

验收：Vercel 环境不依赖本机 CLI 和项目目录写入。

### Phase 5：质量门禁，2-4 天

- 补单元、集成和 E2E 测试。
- 接入错误监控和告警。
- CI 增加迁移、构建和依赖安全检查。
- 更新后台 SOP 和故障处理手册。

验收：无 P0/P1 审计项，关键流程有自动化回归。

### 预计投入

- 安全止血版：1-2 个工作日。
- 可稳定日常使用的核心后台：约 10-15 个工作日。
- 完整 API 治理、内容管道和质量门禁：约 3-5 周单人开发时间。

以上是工程量级，不是固定工期；最终取决于生产数据库现状、支付方式和飞书接口权限。

## 13. 优先级清单

### Must：上线前必须完成

1. 管理员 API 全量鉴权。
2. 数据库 baseline 和正式 migrations。
3. AI 调用认证、限流和预算。
4. 订单、兑换和权益幂等。
5. GET 请求禁止写数据。
6. 生产健康检查脱敏。
7. 核心权限和交易集成测试。

### Should：进入稳定运营后完成

1. Auth.js 统一管理员身份。
2. Scoped API Client 和轮换。
3. 工地管理完整写入闭环。
4. Provider Usage 与错误监控。
5. OpenAPI 和接口变更记录。

### Later：规模增长后再做

1. 多角色细粒度 RBAC。
2. 独立任务队列和 worker。
3. 独立 API Gateway。
4. 多租户、合作伙伴 API 和计费。
5. 通用数据后台或低代码平台。

## 14. 最终验收标准

后台达到“可生产运营”至少需要同时满足：

- 未登录或普通用户无法读取、修改任何后台数据。
- 所有外部 API 调用有身份、限额、超时、日志和失败降级。
- 数据库能从空库通过 migrations 重建。
- 服务、项目、订单三条主流程能完成创建、处理、归档和审计。
- 重复请求不会重复发权益、超发兑换码或创建重复项目。
- 管理员能看见失败原因，但生产响应不暴露内部信息。
- 关键流程有自动化测试，构建和严重依赖漏洞能阻断部署。
- 故障发生时有备份、恢复、密钥轮换和回滚步骤。

## 15. 决策记录

本方案建议确认以下技术决策：

1. 继续使用 Next.js、Auth.js、Prisma、Supabase 和 Vercel。
2. 不整体 fork GitHub 后台源代码。
3. 采用模块化单体，不拆微服务。
4. 管理员并入 Auth.js，权限在数据库中表达。
5. 应用内 API 治理优先，独立网关延后。
6. migrations 成为数据库结构唯一正式来源。
7. 通用能力选择性使用成熟开源或托管服务，业务流程保持自有实现。

这条路线既保留当前已经积累的业务资产，也能把后台从“页面原型”升级为真正可签约、可交付、可追溯的运营系统。

## 16. 2026-08-05 第一阶段实施记录

本轮已完成：

1. 新增 `Opportunity`、`Proposal`、`Agreement`、`ProjectDeliverable`、`BusinessActivity`，连接现有 `ServiceRequest` 与 `Project`。
2. 打通“服务申请 → 商机 → 方案版本 → 协议 → 项目 → 交付物验收”内部路径。
3. 协议签署与项目创建使用数据库事务，`serviceRequestId` 和 `opportunityId` 唯一约束防止重复转换。
4. `User.role` 支持 `USER | OPERATOR | ADMIN`；Auth.js 管理员角色优先，旧共享密码 cookie 缩短为 12 小时并作为迁移兜底。
5. 管理员 AI 分类、AI 回复、服务更新和知识库预置接口补统一鉴权与输入限制。
6. 知识库预置从 `deleteMany()` 改为按标题增量更新，避免清空人工内容。
7. 新增正式 migration 和管理员授权脚本 `npm run admin:grant -- <email>`。

本轮尚未完成：

1. Scoped `ApiClient`、密钥轮换和 OpenAPI。
2. 跨 Vercel 实例的 Redis 限流。
3. Provider Adapter、模型配置、用量与成本记录。
4. 微信登录、支付、小程序客户端和腾讯云迁移。
5. 生产数据库 migration 执行、备份恢复演练和端到端测试。

生产部署前必须先完成 8.2 节的结构对账、baseline、reconciliation 和 staging 演练。确认生产库迁移历史一致后，再按“可恢复备份 → `npx prisma migrate deploy` → `npm run admin:grant -- <email>` → 退出并重新登录”的顺序执行，并验证旧数据、商机转换幂等和项目创建事务。

## 17. 2026-08-05 第二阶段实施记录

本轮已完成：

1. 新增统一 OpenAI-compatible AI Client，支持 `deepseek | openai | custom` 三类 Provider。
2. 客户聊天、后台回复草稿、服务申请分类可以分别选择 Provider 与模型，同时兼容原有 `LLM_*` 和 `DEEPSEEK_API_KEY`。
3. 所有文本模型调用统一处理 Base URL、密钥、模型、超时、上游错误、延迟和 token usage 返回。
4. 网站聊天、后台 AI、md2wechat 排版、图片生成和公众号草稿增加分级限流；输入长度和枚举参数由 Zod 校验。
5. 图片、排版和草稿上游调用增加超时，不再向客户端返回上游原始错误正文。
6. `/api/health` 改为不访问数据库的最小 liveness；详细配置和数据库 readiness 迁移到受管理员保护的 `/api/admin/readiness`。
7. 旧管理员 cookie 必须使用独立 `ADMIN_SESSION_SECRET`，不再回退使用 `ADMIN_PASSWORD` 作为签名密钥。

仍未完成：

1. 当前限流仍是单实例内存实现，部署到 Vercel 前应接 Redis 兼容的跨实例限流。
2. Provider 调用尚未持久化用量、成本、错误码和预算告警。
3. Provider 与模型目前通过环境变量管理，达到多人运营或频繁切换后再增加后台配置表。
4. Scoped API Client、密钥轮换、OpenAPI 和生产数据库 baseline 仍按原计划推进。

## 18. 2026-08-05 星火者社群闭环实施记录

本轮采用现有业务模型承载社群，不新增平行会员系统，也不增加数据库迁移：

```text
ServiceRequest(spark-community)
→ 初筛
→ 面聊
→ 通过
→ Order(membership, spark:180)
→ 确认收款
→ Membership(plan=spark)
→ 入营
```

已完成：

1. `/community` 的微信私信 CTA 改为登录后的 `/community/apply` 在线申请。
2. 申请内容记录正在做的事、可提供能力、当前需要和加入原因；同一用户存在待处理或已通过申请时禁止重复提交。
3. 新增 `/admin/community` 社群工作台，集中展示申请、面聊、订单和有效成员。
4. 管理员把申请标记为通过时，在同一事务中创建 `¥1,499 / 180 天` 待付款订单；重复操作不会重复创建有效订单。
5. 会员商品增加审批门槛，未通过申请的用户不能绕过申请直接创建订单。
6. 管理员确认收款后自动开通 `spark` 会员；权益兑现失败时订单保留可重试状态。
7. 首期通过人数在业务层限制为 20 人。
8. 星火者订单退款时，同时取消 `spark` 会员并关闭本期申请，避免退款后权益残留。
9. 个人中心、用户管理和会员管理能正确显示“星火者”身份。

当前边界：社群交流仍承载在微信等外部沟通渠道，网站负责申请、资格、订单和经营留痕，不在当前阶段自建聊天、动态或课程社区。
