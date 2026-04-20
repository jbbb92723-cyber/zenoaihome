"use client";

import { useState } from "react";

type ApiResult = Record<string, unknown> | string | null;

export default function PublishPage() {
  const [adminToken, setAdminToken] = useState("");
  const [title, setTitle] = useState("装修预算为什么总超？");
  const [markdown, setMarkdown] = useState("# 装修预算为什么总超？\n\n这里粘贴公众号版 Markdown 内容。");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [theme, setTheme] = useState("default");
  const [result, setResult] = useState<ApiResult>(null);
  const [loading, setLoading] = useState(false);

  async function callApi(path: string, body: Record<string, unknown>) {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken,
        },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      let data: ApiResult;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
      setResult(data);
    } catch (error) {
      setResult(error instanceof Error ? error.message : "请求失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <div className="kicker">内部工具 / 不要公开分享</div>
      <h1>公众号草稿发布台</h1>
      <p>
        用法：粘贴公众号版 Markdown，先预览排版，再创建微信公众号草稿。API Key 只放在 Vercel 环境变量里，不会出现在前端。
      </p>

      <div className="card">
        <label>后台口令 ADMIN_TOKEN</label>
        <input value={adminToken} onChange={(e) => setAdminToken(e.target.value)} placeholder="输入你在 Vercel 设置的 ADMIN_TOKEN" />

        <label>文章标题</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>封面图 URL</label>
        <input value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="先填远程图片 URL，豆包生图接口后续接入" />

        <label>md2wechat 主题</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="default">default</option>
          <option value="bytedance">bytedance</option>
          <option value="apple">apple</option>
          <option value="chinese">chinese</option>
          <option value="sports">sports</option>
        </select>

        <label>Markdown 内容</label>
        <textarea value={markdown} onChange={(e) => setMarkdown(e.target.value)} />

        <p>
          <button disabled={loading} onClick={() => callApi("/api/wechat/convert", { markdown, theme, fontSize: "medium" })}>
            预览公众号排版
          </button>
          <button disabled={loading} onClick={() => callApi("/api/wechat/draft", { title, markdown, coverImageUrl, theme, fontSize: "medium" })}>
            创建公众号草稿
          </button>
        </p>
        <p className="small">豆包生图接口因为不同模型参数差异较大，先保留封面图 URL 手动填入。后续确认模型 ID 和接口返回格式后再接。</p>
      </div>

      <h2>返回结果</h2>
      <pre>{loading ? "处理中..." : result ? JSON.stringify(result, null, 2) : "暂无结果"}</pre>
    </main>
  );
}
