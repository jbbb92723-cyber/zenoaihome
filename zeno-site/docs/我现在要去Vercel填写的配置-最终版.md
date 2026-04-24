# Vercel 环境变量配置清单（最终版）

> 最后更新：2025-01  
> 对应项目：`zeno-site` (prj_JjvCABhVNTBikqNuXVMQVZKF0ZPJ)  
> 在 Vercel Dashboard → Settings → Environment Variables 中填写

---

## 必填项（核心功能）

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `AUTH_SECRET` | Auth.js v5 签名密钥 | 终端运行 `npx auth secret` 生成，或用 `openssl rand -base64 32` |
| `AUTH_URL` | 站点 URL | `https://zenoaihome.com`（生产）|
| `NEXT_PUBLIC_SITE_URL` | 公开站点 URL | 与 AUTH_URL 相同 |

## 登录系统（IDC Flare OAuth）

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `IDCFLARE_CLIENT_ID` | OAuth Client ID | IDC Flare 开发者后台 |
| `IDCFLARE_CLIENT_SECRET` | OAuth Client Secret | IDC Flare 开发者后台 |
| `IDCFLARE_ISSUER` | Issuer URL | IDC Flare 文档 |
| `IDCFLARE_AUTHORIZATION_URL` | 授权端点 | IDC Flare 文档 |
| `IDCFLARE_TOKEN_URL` | Token 端点 | IDC Flare 文档 |
| `IDCFLARE_USERINFO_URL` | 用户信息端点 | IDC Flare 文档 |

> ⚠️ 6 个变量全配齐才能启用 IDC Flare 登录。缺任何一个则该按钮不显示。

## 管理员权限

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `ADMIN_EMAILS` | 管理员邮箱，逗号分隔 | `admin@zenoaihome.com` |

> 管理员拥有：草稿推送、图片生成、状态页测试 等特权

## md2wechat（Markdown → 微信 HTML + 草稿）

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `MD2WECHAT_BASE_URL` | API 服务地址（不带末尾 `/`） | 例：`https://md2wechat.cn` |
| `MD2WECHAT_API_KEY` | API 密钥 | md2wechat.cn 控制台 |

**可选覆盖（留空使用默认值）：**

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `MD2WECHAT_CONVERT_ENDPOINT` | `/api/v1/convert` | Markdown 转换端点 |
| `MD2WECHAT_DRAFT_ENDPOINT` | `/article-draft` | 草稿创建端点 |
| `MD2WECHAT_UPLOAD_ENDPOINT` | （尚未接入） | 素材上传端点 |

## 微信公众号

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `WECHAT_APPID` | 公众号 AppID | 微信公众平台 → 设置与开发 → 基本配置 |
| `WECHAT_APP_SECRET` | 公众号 AppSecret | 同上 |
| `WECHAT_DEFAULT_AUTHOR` | 默认作者名 | 填 `Zeno` |
| `WECHAT_DEFAULT_COVER_MEDIA_ID` | 默认封面 media_id | 公众号素材库上传图片后获取 |

## 火山引擎豆包图片生成

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `VOLCENGINE_ARK_API_KEY` | ARK API Key | https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey |
| `VOLCENGINE_IMAGE_MODEL` | 模型 ID | 默认 `Doubao-Seedream-5.0-lite` |
| `VOLCENGINE_IMAGE_BASE_URL` | API 基础地址 | 默认 `https://ark.cn-beijing.volces.com/api/v3`（一般不需改） |
| `VOLCENGINE_IMAGE_PRICE_PER_IMAGE` | 单张预估成本（元） | 默认 `0.22`，仅前端显示用 |

## 数据库（暂不使用）

| 变量名 | 说明 |
|--------|------|
| `DATABASE_URL` | Supabase Postgres 连接串（当前未接入，可暂不填） |

## 旧版兼容（可选）

| 变量名 | 说明 |
|--------|------|
| `ADMIN_TOKEN` | 旧版 `/admin/publish` 页面的令牌（新版用 ADMIN_EMAILS 替代） |

---

## 配置顺序建议

1. **先配必填 3 项** → 站点可正常运行
2. **配 ADMIN_EMAILS** → 管理员可登录
3. **配 IDC Flare 6 项** → 启用 OAuth 登录
4. **配 md2wechat 2 项** → 启用 Markdown 转换
5. **配 WECHAT 4 项** → 启用公众号草稿推送
6. **配 VOLCENGINE 2 项** → 启用 AI 封面图生成

## 验证

配置完成后访问 `/tools/md2wechat/status` 页面检查所有配置项状态。
