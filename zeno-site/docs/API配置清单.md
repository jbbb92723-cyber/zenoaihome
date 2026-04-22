# API 配置清单

> 此文件用于记录需要填写的环境变量和配置项。敏感信息只填到 Vercel 环境变量里，不要写入代码。

---

## 一、md2wechat（必填，功能才能用）

| 项目 | 说明 | Vercel 环境变量名 | 状态 |
|------|------|------------------|------|
| API Key | 购买统一版（¥129）后在 md2wechat.cn 控制台获取 | `MD2WECHAT_API_KEY` | ⬜ 待填 |
| Base URL | API 服务地址，例如 `https://md2wechat.cn` 或 `https://md2wechat.app` | `MD2WECHAT_BASE_URL` | ⬜ 待填 |

**convert 接口：**
- URL：`{MD2WECHAT_BASE_URL}/api/v1/convert`
- 请求头：`Md2wechat-API-Key`
- 请求体：`{ markdown, theme, fontSize, backgroundType }`
- 返回：`{ code: 0, data: { html, theme, fontSize, wordCount, estimatedReadTime } }`

**article-draft 接口：**
- URL：`{MD2WECHAT_BASE_URL}/article-draft`
- 请求头：`Md2wechat-API-Key` + `Wechat-Appid` + `Wechat-App-Secret`
- 请求体：`{ markdown, theme, fontSize, coverImageUrl }`
- 返回：`{ code: 0, data: { draft_id, html, theme, fontSize, wordCount } }`
- 注意：`coverImageUrl` 必须是 HTTPS 公网链接

---

## 二、微信公众号（草稿接口必填）

| 项目 | 说明 | Vercel 环境变量名 | 状态 |
|------|------|------------------|------|
| AppID | 微信公众平台 → 设置与开发 → 基本配置 | `WECHAT_APPID` | ⬜ 待填 |
| AppSecret | 同上，点击「重置」或「查看」获取 | `WECHAT_APP_SECRET` | ⬜ 待填 |
| 默认作者 | 草稿作者名，默认 Zeno | `WECHAT_DEFAULT_AUTHOR` | ✅ 已有默认值 |
| 默认封面 media_id | 在微信素材库上传图片后获取 | `WECHAT_DEFAULT_COVER_MEDIA_ID` | ⬜ 待填 |

**IP 白名单：**
- 微信公众号后台 → 设置与开发 → 安全中心 → IP 白名单
- 需要添加 md2wechat 服务器 IP（联系 md2wechat 获取）
- 未配置白名单会报错：`40164 - IP 未在白名单中`

**公众号需要的接口权限：**
- 草稿箱（图文消息草稿管理）

---

## 三、火山引擎豆包图片生成（管理员生成封面图）

| 项目 | 说明 | Vercel 环境变量名 | 状态 |
|------|------|------------------|------|
| API Key | 火山控制台 → 方舟 → API Key 管理 | `VOLCENGINE_ARK_API_KEY` | ⬜ 待填 |
| 模型 ID | 从控制台确认，例如 `doubao-seedream-3-0-t2i-250415` | `VOLCENGINE_IMAGE_MODEL` | ⬜ 待填 |
| Base URL | 默认 `https://ark.cn-beijing.volces.com/api/v3`，通常不用改 | `VOLCENGINE_IMAGE_BASE_URL` | ✅ 有默认值 |
| 单张成本 | 约 ¥0.22，用于前端显示，不影响实际计费 | `VOLCENGINE_IMAGE_PRICE_PER_IMAGE` | ✅ 有默认值 |

**请求格式（OpenAI 兼容）：**
```
POST {VOLCENGINE_IMAGE_BASE_URL}/images/generations
Authorization: Bearer {VOLCENGINE_ARK_API_KEY}
{
  "model": "{VOLCENGINE_IMAGE_MODEL}",
  "prompt": "...",
  "n": 1,
  "size": "1024x1024",
  "response_format": "url"
}
```

**返回格式：**
```json
{
  "data": [{ "url": "https://..." }]
}
```

**注意：**
- 图片 URL 有时效性，需要及时下载或转存到自己的对象存储
- TODO：生产环境补充将图片转存到 OSS/R2 的逻辑

---

## 四、管理员配置

| 项目 | 说明 | Vercel 环境变量名 | 状态 |
|------|------|------------------|------|
| 管理员邮箱 | 逗号分隔，拥有图片生成和草稿推送权限 | `ADMIN_EMAILS` | ⬜ 待填 |
| 管理 Token（旧版） | 保护 /admin/publish 旧页面 | `ADMIN_TOKEN` | ⬜ 可选 |

**管理员判断逻辑：**
1. 用户必须已通过 IDC Flare OAuth 登录
2. 登录邮箱必须在 `ADMIN_EMAILS` 中
3. 两个条件缺一不可

**当前状态：**
- `ADMIN_EMAILS` 未配置 → 管理员功能不可用
- IDC Flare OAuth 未配置 → 无法登录 → 管理员功能不可用

---

## 五、快速验证步骤

1. 填入 `MD2WECHAT_BASE_URL` 和 `MD2WECHAT_API_KEY`
2. 访问 `/tools/md2wechat`，输入任意 Markdown，点击「转换」
3. 如果看到排版后的 HTML 预览，说明 md2wechat 配置正确

4. 填入 `ADMIN_EMAILS`，用对应邮箱登录
5. 访问 `/tools/md2wechat`，管理员区应该出现
6. 如果 `VOLCENGINE_ARK_API_KEY` 已填，可以测试图片生成（约 ¥0.22/次）

7. 填入 `WECHAT_APPID` 和 `WECHAT_APP_SECRET`，配置 IP 白名单
8. 测试「推送草稿」，前往微信公众号后台草稿箱确认
