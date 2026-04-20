import { NextRequest, NextResponse } from "next/server";

function requireAdmin(req: NextRequest) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return "服务端未配置 ADMIN_TOKEN";
  const actual = req.headers.get("x-admin-token");
  if (actual !== expected) return "后台口令错误";
  return null;
}

function extractImageUrl(data: any): string | null {
  return (
    data?.data?.[0]?.url ||
    data?.data?.[0]?.image_url ||
    data?.data?.[0]?.b64_json ||
    data?.url ||
    data?.image_url ||
    null
  );
}

export async function POST(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return NextResponse.json({ error: authError }, { status: 401 });

  const apiKey = process.env.ARK_API_KEY;
  const model = process.env.ARK_IMAGE_MODEL;
  const baseUrl = process.env.ARK_BASE_URL || "https://ark.cn-beijing.volces.com/api/v3";

  if (!apiKey || !model) {
    return NextResponse.json(
      { error: "缺少 ARK_API_KEY 或 ARK_IMAGE_MODEL 环境变量" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const prompt = body.prompt;
  if (!prompt) return NextResponse.json({ error: "缺少 prompt" }, { status: 400 });

  const resp = await fetch(`${baseUrl.replace(/\/$/, "")}/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      prompt,
      size: body.size || "1024x1024",
      response_format: body.response_format || "url",
    }),
  });

  const text = await resp.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!resp.ok) {
    console.error("ark image generation error", data);
    return NextResponse.json({ error: "豆包/火山方舟生图失败", detail: data }, { status: resp.status });
  }

  const imageUrl = extractImageUrl(data);
  return NextResponse.json({ ok: true, imageUrl, data });
}
