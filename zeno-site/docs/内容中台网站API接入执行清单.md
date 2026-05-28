# 内容中台网站 API 接入执行清单

本文件只处理一件事：让飞书内容中台 / Hermes / CLI 生成的网站草稿，进入 `zenoaihome.com` 的后台草稿区。它不会自动发布文章。

## 当前边界

- 内容中台是主控，网站后台只接收草稿。
- `app/api/internal/content/drafts` 是内部草稿接收 API。
- `website_content_drafts` 是网站后台草稿表。
- `/admin/content` 是人工查看草稿的位置。
- `approvalStatus=approved` 和 `status=published` 必须由人工确认后的流程产生，不能由中台自动改。

## 第 1 步：检查环境

在 `G:\Zenoaihome.com\zeno-site` 运行：

```powershell
npm run content:env-check
```

完成标准：

- `schemaValid=true`
- `directDbReachable=true`
- `appDbReachable=true`
- `internalTokenConfigured=true`
- `readyForMigration=true`
- `readyForLocalApiPush=true`

如果 `directDbReachable=false`，说明 Prisma 迁移不能连上 Supabase 直连库。

如果 `appDbReachable=false`，说明网站 API 运行时不能连上 Supabase 运行库。

如果 `internalTokenConfigured=false`，说明还没有配置 `ZENO_INTERNAL_API_TOKEN`，中台不能推送到网站 API。

## 第 2 步：修正 Supabase 连接

在 Supabase 项目后台复制新的连接串，更新 `.env.local`：

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
ZENO_INTERNAL_API_TOKEN="一串足够长的随机密钥"
```

推荐规则：

- `DATABASE_URL` 用于网站运行时查询。
- `DIRECT_URL` 用于 Prisma migration。
- 两个连接都必须能通过 `npm run content:env-check`。
- 不要把 `ZENO_INTERNAL_API_TOKEN` 提交到 Git。

## 第 3 步：执行数据库迁移

环境检查通过后运行：

```powershell
npx prisma migrate deploy
npm run prisma:generate
```

完成标准：

- Supabase 里出现 `website_content_drafts` 表。
- `npx prisma migrate status` 不再报连接错误。

## 第 4 步：启动本地网站后台

```powershell
npm run dev
```

访问：

```text
http://localhost:3000/admin/content
```

完成标准：

- 后台能打开。
- 没有数据库连接错误。
- 初始状态可以为空列表。

## 第 5 步：从内容中台推送网站草稿

在内容中台脚本目录运行：

```powershell
cd D:\golutra_windows_x86_64.msi\.codex\zeno-lark
$env:ZENO_SITE_API_BASE="http://localhost:3000"
$env:ZENO_INTERNAL_API_TOKEN="和网站 .env.local 一致的密钥"
node zeno-command-router.mjs /推送网站API
```

完成标准：

- 返回 `pushed=2, failed=0`。
- 飞书稿件表写入“网站后台状态/回执/同步时间”。
- 网站后台 `/admin/content` 能看到 2 条 staged + pending 的内容草稿。

## 第 6 步：生产环境配置

在 Vercel 项目环境变量里配置：

- `DATABASE_URL`
- `DIRECT_URL`
- `ZENO_INTERNAL_API_TOKEN`

然后部署网站。

生产推送时把中台环境变量改成：

```powershell
$env:ZENO_SITE_API_BASE="https://zenoaihome.com"
$env:ZENO_INTERNAL_API_TOKEN="和 Vercel 一致的密钥"
node zeno-command-router.mjs /推送网站API
```

完成标准：

- 线上 `/admin/content` 能看到中台推送的草稿。
- 草稿仍然是 `pending`，不自动发布。

## 当前诊断

截至当前本机检查：

- Prisma schema 有效。
- `DIRECT_URL` 无法连接 Supabase 直连库。
- `DATABASE_URL` 返回 Supabase pooler 项目/用户不匹配。
- `ZENO_INTERNAL_API_TOKEN` 尚未配置。

因此下一步不是继续写更多接口，而是先修正 Supabase 连接和内部 token。连接修好后，再执行迁移和真实推送。
