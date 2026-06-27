import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();

function runNode(script, args = []) {
  const result = spawnSync("node", [script, ...args], {
    cwd,
    encoding: "utf8",
  });
  return {
    ok: result.status === 0,
    status: result.status,
    output: [result.stdout, result.stderr].filter(Boolean).join("\n").trim(),
  };
}

function readJson(fileName, fallback = null) {
  const filePath = path.join(cwd, fileName);
  if (!fs.existsSync(filePath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatTime(value) {
  if (!value) return "未记录";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function metric(label, value, tone = "neutral", sub = "") {
  return `
    <section class="metric metric-${tone}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      ${sub ? `<small>${escapeHtml(sub)}</small>` : ""}
    </section>
  `;
}

function bar(label, value, max, tone = "gold") {
  const safeMax = Math.max(1, Number(max) || 1);
  const safeValue = Math.max(0, Number(value) || 0);
  const width = Math.min(100, Math.round((safeValue / safeMax) * 100));
  return `
    <div class="bar-row">
      <div class="bar-meta"><span>${escapeHtml(label)}</span><b>${safeValue}</b></div>
      <div class="bar-track"><i class="bar-${tone}" style="width:${width}%"></i></div>
    </div>
  `;
}

function statusPill(label, ok) {
  return `<span class="pill ${ok ? "pill-ok" : "pill-warn"}">${escapeHtml(label)}</span>`;
}

function listItems(items, emptyLabel = "暂无") {
  if (!items?.length) return `<li class="muted">${escapeHtml(emptyLabel)}</li>`;
  return items.map((item) => `<li>${item}</li>`).join("");
}

runNode("generate-operator-dashboard.mjs");
const guardRun = runNode("content-quality-guard.mjs");

const dashboard = readJson("operator-dashboard-result.json", {});
const guard = readJson("content-quality-guard-result.json", {});
const apiDryRun = readJson("push-website-stage-to-site-api-result.json", {});
const websiteStage = readJson("stage-website-drafts-result.json", {});
const wechatStage = readJson("stage-wechat-drafts-result.json", {});
const latestCycle = readJson("mvp-content-cycle-result.json", {});
const repair = readJson("repair-topic-004-drafts-result.json", {});
const register = readJson("register-quality-guard-command-result.json", {});

const counts = dashboard.counts || {};
const guardChecks = guard.checks || [];
const failedChecks = guardChecks.filter((item) => !item.pass);
const apiResults = apiDryRun.results || [];
const latestTopic = latestCycle.topic_title || latestCycle.topic_id || "暂无新选题";
const latestBrief = latestCycle.brief_id || "暂无";
const generatedAt = new Date().toISOString();
const baseUrl = "https://fcnq0trbpwz3.feishu.cn/base/MZEybml1aaBX4zsIUPwcVUHcnHc";

const blockers = [
  ["Supabase DIRECT_URL", false, "数据库迁移连接待人工配置"],
  ["Supabase DATABASE_URL", false, "网站运行库连接待人工配置"],
  ["ZENO_INTERNAL_API_TOKEN", false, "内部 API token 待人工配置"],
  ["微信公众号草稿箱 API", false, "凭证和素材接口待人工配置"],
  ["Vercel 环境变量", false, "生产环境变量待人工配置"],
];

const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Zeno 内容中台大屏</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #151513;
      --panel: #20201d;
      --panel-2: #282720;
      --line: #3a3932;
      --text: #eee8dd;
      --muted: #9d978b;
      --soft: #6f6a61;
      --gold: #c7a35f;
      --green: #78b57b;
      --teal: #68aeb0;
      --coral: #d2846f;
      --red: #d36f65;
    }

    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background: var(--bg);
      color: var(--text);
      font-family: Inter, "Noto Sans SC", "Microsoft YaHei", system-ui, sans-serif;
      letter-spacing: 0;
    }

    main {
      width: min(1440px, calc(100% - 40px));
      margin: 0 auto;
      padding: 28px 0 36px;
    }

    header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 20px;
      align-items: end;
      padding-bottom: 18px;
      border-bottom: 1px solid var(--line);
    }

    h1, h2, h3, p { margin: 0; }
    h1 {
      font-size: 28px;
      line-height: 1.15;
      font-weight: 720;
    }

    h2 {
      font-size: 15px;
      font-weight: 680;
      margin-bottom: 14px;
    }

    .eyebrow {
      color: var(--gold);
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .timestamp {
      color: var(--muted);
      font-size: 12px;
      text-align: right;
      line-height: 1.8;
    }

    .timestamp a {
      color: var(--teal);
      text-decoration: none;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 14px;
      margin-top: 16px;
    }

    .metric {
      grid-column: span 3;
      min-height: 108px;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 16px;
      display: grid;
      align-content: space-between;
    }

    .metric span, .metric small {
      color: var(--muted);
      font-size: 12px;
      line-height: 1.45;
    }

    .metric strong {
      font-size: 34px;
      line-height: 1;
      font-weight: 760;
    }

    .metric-gold strong { color: var(--gold); }
    .metric-green strong { color: var(--green); }
    .metric-teal strong { color: var(--teal); }
    .metric-coral strong { color: var(--coral); }
    .metric-red strong { color: var(--red); }

    .panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 16px;
      min-width: 0;
    }

    .span-8 { grid-column: span 8; }
    .span-6 { grid-column: span 6; }
    .span-4 { grid-column: span 4; }
    .span-12 { grid-column: span 12; }

    .bar-row + .bar-row { margin-top: 14px; }
    .bar-meta {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      color: var(--muted);
      font-size: 12px;
      margin-bottom: 7px;
    }
    .bar-meta b { color: var(--text); }
    .bar-track {
      height: 9px;
      background: #141410;
      border: 1px solid #333128;
      border-radius: 999px;
      overflow: hidden;
    }
    .bar-track i {
      display: block;
      height: 100%;
      min-width: 2px;
    }
    .bar-gold { background: var(--gold); }
    .bar-green { background: var(--green); }
    .bar-teal { background: var(--teal); }
    .bar-coral { background: var(--coral); }

    .pills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .pill {
      display: inline-flex;
      align-items: center;
      min-height: 30px;
      padding: 0 10px;
      border-radius: 999px;
      border: 1px solid var(--line);
      font-size: 12px;
      color: var(--muted);
      background: #191916;
      white-space: nowrap;
    }
    .pill-ok { color: var(--green); border-color: rgba(120, 181, 123, .45); }
    .pill-warn { color: var(--coral); border-color: rgba(210, 132, 111, .45); }

    .latest {
      display: grid;
      gap: 10px;
    }
    .latest strong {
      font-size: 18px;
      line-height: 1.35;
    }
    .latest span, .muted {
      color: var(--muted);
      font-size: 12px;
      line-height: 1.55;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 9px;
    }
    li {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid rgba(58, 57, 50, .65);
      color: var(--text);
      font-size: 13px;
      line-height: 1.4;
    }
    li:last-child { border-bottom: 0; }
    li em {
      color: var(--muted);
      font-style: normal;
      text-align: right;
      flex: 0 0 auto;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    .table th, .table td {
      border-bottom: 1px solid rgba(58, 57, 50, .75);
      padding: 10px 8px;
      text-align: left;
      vertical-align: top;
    }
    .table th {
      color: var(--soft);
      font-weight: 680;
      white-space: nowrap;
    }
    .table td {
      color: var(--text);
      word-break: break-word;
    }

    .foot {
      color: var(--soft);
      font-size: 12px;
      margin-top: 18px;
      border-top: 1px solid var(--line);
      padding-top: 14px;
    }

    @media (max-width: 980px) {
      main { width: min(100% - 24px, 720px); padding-top: 18px; }
      header { grid-template-columns: 1fr; align-items: start; }
      .timestamp { text-align: left; }
      .metric, .span-4, .span-6, .span-8, .span-12 { grid-column: span 12; }
      h1 { font-size: 24px; }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <div>
        <p class="eyebrow">Zeno Content Control Room</p>
        <h1>Zeno 内容中台大屏</h1>
      </div>
      <div class="timestamp">
        <div>刷新 ${escapeHtml(formatTime(generatedAt))}</div>
        <a href="${baseUrl}">飞书内容中台</a>
      </div>
    </header>

    <section class="grid">
      ${metric("选题池", counts.topics ?? 0, "gold", "机会来源")}
      ${metric("生产单", counts.briefs ?? 0, "teal", "Brief")}
      ${metric("稿件", counts.drafts ?? 0, "green", "网站 + 公众号")}
      ${metric("待人工审批", counts.pending_approvals ?? 0, "coral", "最终闸门")}
      ${metric("质检通过", `${guard.passed ?? 0}/${guard.checked ?? 0}`, failedChecks.length ? "red" : "green", failedChecks.length ? "存在错位风险" : "选题正文一致")}
      ${metric("本地草稿区", counts.staged_drafts ?? 0, "teal", "发布前暂存")}
      ${metric("干跑发布", counts.dry_run_publish_jobs ?? 0, "gold", "不真实发布")}
      ${metric("真实待发布", counts.pending_publish_jobs ?? 0, counts.pending_publish_jobs ? "red" : "green", "当前保持关闭")}
    </section>

    <section class="grid">
      <section class="panel span-8">
        <h2>生产漏斗</h2>
        ${bar("选题", counts.topics ?? 0, counts.topics ?? 1, "gold")}
        ${bar("Brief", counts.briefs ?? 0, counts.topics ?? 1, "teal")}
        ${bar("稿件", counts.drafts ?? 0, Math.max(1, (counts.briefs ?? 0) * 2), "green")}
        ${bar("质检记录", counts.reviews ?? 0, Math.max(1, counts.drafts ?? 1), "coral")}
        ${bar("待人工审批", counts.pending_approvals ?? 0, Math.max(1, counts.drafts ?? 1), "gold")}
      </section>

      <section class="panel span-4 latest">
        <h2>最新生产单</h2>
        <strong>${escapeHtml(latestTopic)}</strong>
        <span>${escapeHtml(latestBrief)}</span>
        <div class="pills">
          ${statusPill("审批保持 pending", true)}
          ${statusPill("真实发布关闭", true)}
          ${statusPill("Obsidian 源库未写入", true)}
        </div>
      </section>

      <section class="panel span-6">
        <h2>质量守门</h2>
        <ul>
          ${listItems(
            failedChecks.map((item) => `<span>${escapeHtml(item.title)}</span><em>${escapeHtml(item.issues.join("；"))}</em>`),
            "全部通过",
          )}
        </ul>
      </section>

      <section class="panel span-6">
        <h2>渠道预检</h2>
        <ul>
          <li><span>网站本地草稿</span><em>${escapeHtml(websiteStage.staged_count ?? 0)} 条</em></li>
          <li><span>公众号本地草稿</span><em>${escapeHtml(wechatStage.staged_count ?? 0)} 条</em></li>
          <li><span>网站 API dry-run</span><em>${escapeHtml(apiDryRun.pushed ?? 0)} 成功 / ${escapeHtml(apiDryRun.failed ?? 0)} 失败</em></li>
          <li><span>质量修复记录</span><em>${escapeHtml(repair.repaired?.length ?? 0)} 项</em></li>
        </ul>
      </section>

      <section class="panel span-8">
        <h2>网站 API Payload</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Content ID</th>
              <th>Brief</th>
              <th>Slug</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            ${
              apiResults.length
                ? apiResults.map((item) => `
                  <tr>
                    <td>${escapeHtml(item.content_id)}</td>
                    <td>${escapeHtml(item.brief_id)}</td>
                    <td>${escapeHtml(item.slug)}</td>
                    <td>${item.ok ? "dry-run ok" : "failed"}</td>
                  </tr>
                `).join("")
                : `<tr><td colspan="4" class="muted">暂无 API 预检记录</td></tr>`
            }
          </tbody>
        </table>
      </section>

      <section class="panel span-4">
        <h2>人工连接点</h2>
        <ul>
          ${blockers.map(([name, ok, note]) => `<li><span>${escapeHtml(name)}</span><em>${ok ? "已连接" : escapeHtml(note)}</em></li>`).join("")}
        </ul>
      </section>

      <section class="panel span-12">
        <h2>SOP 能力</h2>
        <div class="pills">
          ${statusPill("/跑MVP", true)}
          ${statusPill("/质检守门", register.action === "created" || register.exists)}
          ${statusPill("/本地草稿", true)}
          ${statusPill("/预检网站API", true)}
          ${statusPill("/中台看板", true)}
          ${statusPill("公众号 API 待连接", false)}
          ${statusPill("网站真实 API 待连接", false)}
        </div>
      </section>
    </section>

    <p class="foot">所有数据来自本地中台执行结果与飞书中台同步记录。当前大屏只显示生产状态，不提供审批通过或真实发布入口。</p>
  </main>
</body>
</html>`;

const dashboardPath = path.join(cwd, "visual-dashboard.html");
const result = {
  ok: true,
  generated_at: generatedAt,
  dashboard: dashboardPath,
  counts,
  quality_guard: {
    ok: guardRun.ok,
    checked: guard.checked ?? 0,
    failed: guard.failed ?? 0,
  },
  api_dry_run: {
    count: apiDryRun.count ?? 0,
    pushed: apiDryRun.pushed ?? 0,
    failed: apiDryRun.failed ?? 0,
  },
};

fs.writeFileSync(dashboardPath, html, "utf8");
fs.writeFileSync(path.join(cwd, "visual-dashboard-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
