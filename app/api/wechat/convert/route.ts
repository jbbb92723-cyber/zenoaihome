import { NextRequest, NextResponse } from "next/server";

function requireAdmin(req: NextRequest) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return "服务端未配置 ADMIN_TOKEN";
  const actual = req.headers.get("x-admin-token");
  if (actual !== expected) return "后台口令错误";
  return null;
}

export async function POST(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return NextResponse.json({ error: authError }, { status: 401 });

  const apiKey = process.env.MD2WECHAT_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "未配置 MD2WECHAT_API_KEY" }, { status: 500 });

  const body = await req.json();
  const markdown = body.markdown;
  if (!markdown) return NextResponse.json({ error: "缺少 markdown 内容" }, { status: 400 });

  const resp = await fetch("https://md2wechat.com/api/v1/convert", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Md2wechat-API-Key": apiKey,
    },
    body: JSON.stringify({
      markdown,
      theme: body.theme || "default",
      fontSize: body.fontSize || "medium",
      convertVersion: body.convertVersion || "v1",
    }),
  });

  const text = await resp.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!resp.ok) {
    console.error("md2wechat convert error", data);
    return NextResponse.json({ error: "md2wechat 转换失败", detail: data }, { status: resp.status });
  }

  return NextResponse.json(data);
}
