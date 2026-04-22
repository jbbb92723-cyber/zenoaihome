/**
 * lib/wechat-official.ts
 *
 * 微信公众号 API 服务端封装（直连微信接口，不经过 md2wechat）
 *
 * 当前版本：预留结构，核心流程通过 md2wechat 的 article-draft 接口实现。
 * 此文件供未来直接对接微信 API 时使用。
 *
 * ⚠️ WECHAT_APP_SECRET 只能在服务端读取，绝不能暴露给前端。
 *
 * 环境变量：
 * - WECHAT_APPID
 * - WECHAT_APP_SECRET
 * - WECHAT_DEFAULT_AUTHOR
 * - WECHAT_DEFAULT_COVER_MEDIA_ID（素材 media_id，微信后台上传封面图后获取）
 */

// ─── access_token 缓存（内存级，适合单实例） ──────────────────────
// TODO：生产环境建议改用 Redis / KV 存储，避免多实例各自请求 access_token 超频限制
let cachedToken: { value: string; expiresAt: number } | null = null

/**
 * 获取微信公众号 access_token
 * 文档：https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html
 */
export async function getWechatAccessToken(): Promise<string> {
  // 检查缓存是否有效（提前 5 分钟刷新）
  if (cachedToken && Date.now() < cachedToken.expiresAt - 5 * 60 * 1000) {
    return cachedToken.value
  }

  const appid  = process.env.WECHAT_APPID
  const secret = process.env.WECHAT_APP_SECRET

  if (!appid || !secret) {
    throw new Error('WECHAT_APPID 或 WECHAT_APP_SECRET 未配置。')
  }

  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`获取微信 access_token 失败 (${res.status})`)
  }

  const json = await res.json()

  if (json.errcode) {
    throw new Error(`微信 access_token 错误 ${json.errcode}：${json.errmsg}`)
  }

  cachedToken = {
    value:     json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  }

  return cachedToken.value
}

// ─── 草稿相关（TODO：直连微信接口，当前通过 md2wechat 实现） ─────

export interface WechatDraftArticle {
  title:          string
  content:        string     // 微信格式 HTML
  author?:        string
  digest?:        string     // 摘要，不超过 120 字
  thumb_media_id: string     // 封面图 media_id（必填）
}

/**
 * 直接调用微信 API 新增草稿
 * 文档：https://developers.weixin.qq.com/doc/offiaccount/Draft_Box/Add_draft.html
 *
 * TODO：当前版本通过 md2wechat 代理实现草稿创建（见 lib/md2wechat.ts）。
 *       如需直连微信接口，取消此函数的 stub 并实现。
 */
export async function addWechatDraft(article: WechatDraftArticle): Promise<string> {
  const coverMediaId = article.thumb_media_id || process.env.WECHAT_DEFAULT_COVER_MEDIA_ID
  if (!coverMediaId) {
    throw new Error(
      '缺少封面图 media_id。请先在微信公众平台上传封面图，获取 media_id 后填入 WECHAT_DEFAULT_COVER_MEDIA_ID。',
    )
  }

  const token = await getWechatAccessToken()
  const url   = `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${token}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      articles: [
        {
          title:          article.title,
          content:        article.content,
          author:         article.author  ?? (process.env.WECHAT_DEFAULT_AUTHOR ?? 'Zeno'),
          digest:         article.digest  ?? '',
          thumb_media_id: coverMediaId,
          need_open_comment:       0,
          only_fans_can_comment:   0,
        },
      ],
    }),
  })

  if (!res.ok) {
    throw new Error(`微信草稿接口请求失败 (${res.status})`)
  }

  const json = await res.json()

  if (json.errcode && json.errcode !== 0) {
    throw new Error(`微信草稿接口错误 ${json.errcode}：${json.errmsg}`)
  }

  return json.media_id ?? ''
}

/**
 * 上传图片素材（预留）
 * TODO：实现图片上传到微信素材库，获取 media_id
 */
export async function uploadWechatImage(_imageData: Buffer, _filename: string): Promise<never> {
  throw new Error('uploadWechatImage 尚未实现。')
}

/**
 * 上传封面图素材（预留）
 * TODO：实现封面图上传，获取 thumb_media_id
 */
export async function uploadWechatCover(_imageData: Buffer, _filename: string): Promise<never> {
  throw new Error('uploadWechatCover 尚未实现。')
}
