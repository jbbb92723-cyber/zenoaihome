# Vercel 最终部署检查清单

更新时间：2026-04-23

---

## Vercel 项目设置

| 配置项 | 正确值 | 说明 |
|--------|--------|------|
| Root Directory | `zeno-site` | 代码在仓库 `/zeno-site` 子目录 |
| Build Command | `next build`（默认） | 无需自定义 |
| Install Command | `npm install`（默认） | 无需自定义 |
| Output Directory | 默认（`.next`） | 不需要改 |
| Production Branch | `main` | 推送 main 分支触发生产部署 |
| Node.js Version | 18.x 或 20.x | 与 next.config.mjs 一致 |

---

## 必须配置的环境变量

进入：Vercel → Project → Settings → **Environment Variables**

### Auth（登录系统必需）

```
AUTH_SECRET=           # 必须：随机密钥，用 openssl rand -base64 32 生成
AUTH_URL=              # 必须：生产为 https://zenoaihome.com
NEXT_PUBLIC_SITE_URL=  # 必须：https://zenoaihome.com
```

### IDC Flare 登录（配置后即可真实登录）

```
IDCFLARE_CLIENT_ID=
IDCFLARE_CLIENT_SECRET=
IDCFLARE_AUTHORIZATION_URL=
IDCFLARE_TOKEN_URL=
IDCFLARE_USERINFO_URL=
IDCFLARE_ISSUER=
```

### 管理员识别（不配置则无人有管理员权限）

```
ADMIN_EMAILS=          # 你的邮箱，如 abc@qq.com
```

### md2wechat 排版 API（不配置则排版功能仅显示外部链接）

```
MD2WECHAT_API_KEY=
MD2WECHAT_BASE_URL=    # 例如 https://md2wechat.cn
```

### 火山引擎图片生成（不配置则图片生成功能不可用）

```
VOLCENGINE_ARK_API_KEY=
VOLCENGINE_IMAGE_MODEL=Doubao-Seedream-5.0-lite
VOLCENGINE_IMAGE_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
VOLCENGINE_IMAGE_PRICE_PER_IMAGE=0.22
```

### 微信公众号草稿箱（不配置则草稿推送不可用）

```
WECHAT_APPID=
WECHAT_APP_SECRET=
WECHAT_DEFAULT_AUTHOR=Zeno
WECHAT_DEFAULT_COVER_MEDIA_ID=
```

---

## 重要操作须知

1. **改完环境变量必须 Redeploy**  
   修改 env var 后，点 Vercel → Deployments → 最新一条 → `...` → **Redeploy**，或重新 `git push`

2. **Build 失败时线上不变**  
   如果本次 build 失败，Vercel 会继续显示上一次成功部署的版本，网站不会宕机，但内容不会更新

3. **Production 不能被暂停**  
   检查 GitHub 仓库右侧栏「生产」状态，如果显示「暂停」需要到 Vercel 设置里恢复

4. **Root Directory 必须正确**  
   如果 Root Directory 设置错误，build 会失败（找不到 package.json）

---

## 部署后检查地址

| 地址 | 检查内容 |
|------|----------|
| https://zenoaihome.com | 首页正常加载 |
| https://zenoaihome.com/resources | 5 份资料展示 |
| https://zenoaihome.com/services | 4 项服务展示 |
| https://zenoaihome.com/tools/md2wechat | 排版工具页 |
| https://zenoaihome.com/tools/md2wechat/status | API 配置状态 |
| https://zenoaihome.com/login | 登录页 4 种方式 |
| https://zenoaihome.com/account | 个人中心 |
| https://zeno-aihome.vercel.app | Vercel 子域备用地址 |
