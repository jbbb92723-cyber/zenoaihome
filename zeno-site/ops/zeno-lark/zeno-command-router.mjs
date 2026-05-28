import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();

function runNode(script, args = []) {
  const result = spawnSync("node", [script, ...args], {
    cwd,
    encoding: "utf8",
  });
  const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
  if (result.status !== 0) {
    throw new Error(`node ${script} ${args.join(" ")} failed:\n${output}`);
  }
  return output;
}

function parseCommand(argv) {
  const raw = argv.join(" ").trim();
  if (!raw) return { command: "/帮助", args: [] };
  const parts = raw.split(/\s+/).filter(Boolean);
  return { command: parts[0], args: parts.slice(1), raw };
}

function readJsonResult(fileName) {
  const filePath = path.join(cwd, fileName);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function help() {
  return [
    "# Zeno 指令路由器",
    "",
    "可用指令：",
    "",
    "- `/帮助`：查看指令",
    "- `/中台看板`：生成运营看板",
    "- `/查状态 [brief_id|topic_id|content_id]`：读取中台状态",
    "- `/导出审稿包 brief_id`：导出人工审稿包",
    "- `/本地草稿 brief_id`：生成网站和公众号本地草稿区中转包",
    "- `/预检网站API [brief_id|content_id]`：dry-run 检查本地网站草稿能否转成网站 API payload",
    "- `/推送网站API [brief_id|content_id]`：把本地网站草稿推送到 zeno-site internal API",
    "- `/全链路干跑 brief_id`：跑发布前全链路 dry-run",
    "- `/跑MVP [topic_id]`：从选题到待审批跑一轮 MVP 内容生产",
    "- `/质检守门 [brief_id|content_id]`：检查选题和正文是否错位，不改审批、不发布",
    "- `/可视化大屏`：生成本地 HTML 运营大屏",
    "",
    "安全边界：本路由器不审批、不发布、不部署、不写 Obsidian 源库。",
  ].join("\n");
}

function route(command, args) {
  if (["/帮助", "help", "--help"].includes(command)) {
    return { ok: true, type: "help", message: help() };
  }

  if (command === "/中台看板") {
    runNode("generate-operator-dashboard.mjs");
    const result = readJsonResult("operator-dashboard-result.json");
    return { ok: true, type: "dashboard", result };
  }

  if (command === "/查状态") {
    const target = args[0] || "";
    const output = runNode("status-report.mjs", target ? [target] : []);
    const result = readJsonResult("status-report-result.json");
    return { ok: true, type: "status", target: target || "all", result, output_tail: output.slice(-2000) };
  }

  if (command === "/导出审稿包") {
    const briefId = args[0];
    if (!briefId) throw new Error("缺少 brief_id，例如：/导出审稿包 brief_20260527_001");
    runNode("export-review-packages.mjs", [briefId]);
    runNode("archive-to-obsidian.mjs", [briefId]);
    const result = readJsonResult("export-review-packages-result.json");
    const archive = readJsonResult("archive-to-obsidian-result.json");
    return { ok: true, type: "review_package", brief_id: briefId, result, archive };
  }

  if (command === "/本地草稿") {
    const briefId = args[0];
    if (!briefId) throw new Error("缺少 brief_id，例如：/本地草稿 brief_20260527_001");
    runNode("stage-website-drafts.mjs", [briefId]);
    const website = readJsonResult("stage-website-drafts-result.json");
    runNode("stage-wechat-drafts.mjs", [briefId]);
    const wechat = readJsonResult("stage-wechat-drafts-result.json");
    runNode("generate-operator-dashboard.mjs");
    const dashboard = readJsonResult("operator-dashboard-result.json");
    return { ok: true, type: "local_draft_stage", brief_id: briefId, website, wechat, dashboard };
  }

  if (command === "/预检网站API") {
    const target = args[0] || "";
    runNode("push-website-stage-to-site-api.mjs", target ? [target, "--dry-run"] : ["--dry-run"]);
    const result = readJsonResult("push-website-stage-to-site-api-result.json");
    return { ok: true, type: "website_api_dry_run", target: target || "all", result };
  }

  if (command === "/推送网站API") {
    const target = args[0] || "";
    runNode("push-website-stage-to-site-api.mjs", target ? [target] : []);
    const result = readJsonResult("push-website-stage-to-site-api-result.json");
    return { ok: true, type: "website_api_push", target: target || "all", result };
  }

  if (command === "/全链路干跑") {
    const briefId = args[0];
    if (!briefId) throw new Error("缺少 brief_id，例如：/全链路干跑 brief_20260527_001");
    runNode("run-full-system-dry-run.mjs", [briefId]);
    runNode("generate-operator-dashboard.mjs");
    const result = readJsonResult("full-system-dry-run-result.json");
    const dashboard = readJsonResult("operator-dashboard-result.json");
    return { ok: true, type: "full_dry_run", brief_id: briefId, result, dashboard };
  }

  if (command === "/跑MVP") {
    const topicId = args[0];
    runNode("run-mvp-content-cycle.mjs", topicId ? [topicId] : []);
    const cycle = readJsonResult("mvp-content-cycle-result.json");
    const briefId = cycle?.brief_id;
    if (briefId) {
      runNode("export-review-packages.mjs", [briefId]);
      runNode("archive-to-obsidian.mjs", [briefId]);
      runNode("run-full-system-dry-run.mjs", [briefId]);
      runNode("stage-website-drafts.mjs", [briefId]);
      runNode("stage-wechat-drafts.mjs", [briefId]);
    }
    runNode("generate-operator-dashboard.mjs");
    const dashboard = readJsonResult("operator-dashboard-result.json");
    return { ok: true, type: "mvp_cycle", topic_id: topicId || cycle?.topic_id, brief_id: briefId, cycle, dashboard };
  }

  if (command === "/质检守门") {
    const target = args[0] || "";
    runNode("content-quality-guard.mjs", target ? [target] : []);
    const result = readJsonResult("content-quality-guard-result.json");
    return { ok: true, type: "content_quality_guard", target: target || "all", result };
  }

  if (command === "/可视化大屏") {
    runNode("generate-visual-dashboard.mjs");
    const result = readJsonResult("visual-dashboard-result.json");
    return { ok: true, type: "visual_dashboard", result };
  }

  throw new Error(`未知指令：${command}。输入 /帮助 查看可用指令。`);
}

const { command, args, raw } = parseCommand(process.argv.slice(2));
const now = new Date().toISOString();

try {
  const result = route(command, args);
  const wrapped = {
    ok: true,
    routed_at: now,
    raw_command: raw || command,
    command,
    args,
    ...result,
    safeguards: ["no_approval_change", "no_real_publish", "no_deploy", "no_obsidian_source_write"],
  };
  fs.writeFileSync(path.join(cwd, "zeno-command-router-result.json"), `${JSON.stringify(wrapped, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(wrapped, null, 2));
} catch (error) {
  const failed = {
    ok: false,
    routed_at: now,
    raw_command: raw || command,
    command,
    args,
    error: error.message,
    safeguards: ["no_approval_change", "no_real_publish", "no_deploy", "no_obsidian_source_write"],
  };
  fs.writeFileSync(path.join(cwd, "zeno-command-router-result.json"), `${JSON.stringify(failed, null, 2)}\n`, "utf8");
  console.error(JSON.stringify(failed, null, 2));
  process.exitCode = 1;
}
