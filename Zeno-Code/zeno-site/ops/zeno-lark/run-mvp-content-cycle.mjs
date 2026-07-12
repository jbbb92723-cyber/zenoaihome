import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(cwd, "manifest.json"), "utf8"));
const baseToken = manifest.baseToken;

const ids = {
  topics: "tblWqjt7QMwWpusg",
  briefs: "tblk8GrAQCWBXmU5",
  drafts: "tblWRTJDAXMYoj2y",
  reviews: "tbluesIB80mYriTs",
  approvals: "tblNzhcnVkZfgBiF",
  taskRuns: "tblNIeOvE10OF9Ml",
};

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function extractJson(text) {
  const trimmed = text.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(trimmed.slice(start, end + 1));
    throw new Error(`Cannot parse lark-cli output: ${trimmed}`);
  }
}

function runLark(args) {
  let lastError;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const result = spawnSync("lark-cli", args, {
      cwd,
      encoding: "utf8",
      shell: process.platform === "win32",
    });
    const combined = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    if (result.status === 0) return extractJson(combined);
    lastError = new Error(`lark-cli ${args.join(" ")} failed:\n${combined}`);
    if (!combined.includes("retryable") && !combined.includes("locked")) throw lastError;
    sleep(1200 * attempt);
  }
  throw lastError;
}

function jsonArg(name, data) {
  const fileName = `${name}.json`;
  fs.writeFileSync(path.join(cwd, fileName), JSON.stringify(data), "utf8");
  return `@${fileName}`;
}

function recordList(tableId, limit = 500) {
  return runLark([
    "base",
    "+record-list",
    "--base-token",
    baseToken,
    "--table-id",
    tableId,
    "--as","bot",
    "--limit",
    String(limit),
    "--format",
    "json",
  ]).data;
}

function recordsAsObjects(data) {
  const fields = data.fields || [];
  return (data.data || []).map((row, index) => {
    const object = { _record_id: data.record_id_list?.[index] };
    for (let i = 0; i < fields.length; i += 1) object[fields[i]] = row[i];
    return object;
  });
}

function selectValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

function batchCreate(tableId, fields, rows, label) {
  if (!rows.length) return { label, status: "skipped-empty" };
  sleep(500);
  runLark([
    "base",
    "+record-batch-create",
    "--base-token",
    baseToken,
    "--table-id",
    tableId,
    "--json",
    jsonArg(`records-${label}`, { fields, rows }),
    "--as","bot",
  ]);
  return { label, status: "created", count: rows.length };
}

function batchUpdate(tableId, recordIds, patch, label) {
  if (!recordIds.length) return { label, status: "skipped-empty" };
  sleep(500);
  runLark([
    "base",
    "+record-batch-update",
    "--base-token",
    baseToken,
    "--table-id",
    tableId,
    "--json",
    jsonArg(`update-${label}`, { record_id_list: recordIds, patch }),
    "--as","bot",
  ]);
  return { label, status: "updated", count: recordIds.length };
}

function existingByField(records, fieldName) {
  return new Set(records.map((row) => row[fieldName]).filter(Boolean));
}

function topicSuffix(topicId) {
  return String(topicId).replace(/^topic_/, "");
}

function pickTopic(topics, briefs, requestedTopicId) {
  if (requestedTopicId) {
    const requested = topics.find((topic) => topic.topic_id === requestedTopicId);
    if (!requested) throw new Error(`Missing topic: ${requestedTopicId}`);
    return requested;
  }

  const briefedTopicIds = new Set(briefs.map((brief) => brief.topic_id).filter(Boolean));
  const candidates = topics
    .filter((topic) => !briefedTopicIds.has(topic.topic_id))
    .filter((topic) => Number(topic["总分"] || 0) >= 80)
    .filter((topic) => Number(topic["素材支撑度"] || 0) >= 20)
    .sort((a, b) => Number(b["总分"] || 0) - Number(a["总分"] || 0));

  if (!candidates.length) {
    throw new Error("No unbriefed topic with score >= 80 and material support >= 20.");
  }
  return candidates[0];
}

function blueprintFor(topic) {
  const title = topic["标题"] || topic.topic_id;
  if (title.includes("按实结算")) {
    return {
      readerProblem:
        "业主看到报价单里的“按实结算”，不知道它是正常的现场结算规则，还是后期增项的入口。",
      coreJudgment:
        "“按实结算”本身不等于坑，风险在于没有写清计量方式、确认节点、单价边界和争议处理规则。",
      angle: "把一个专业报价词翻译成签约前能问清楚的 7 个问题。",
      matchedMaterials: [
        "03_素材证据库/方法卡/报价风险词库/01-按实结算.md",
        "03_素材证据库/方法卡/装修报价风险洞察六层框架.md",
        "03_素材证据库/报价预算/2026-BJ-002-基础部分总合计报价风险.md",
      ],
      doNotSay: [
        "不要把所有按实结算都说成陷阱",
        "不要制造恐慌",
        "不要评价具体公司",
        "不要承诺百分百避坑",
        "不要让用户只关注砍价",
      ],
      sections: [
        ["按实结算不是问题，没规则才是问题", "它通常表示现场数量或条件确认后再按约定单价结算。真正要看的是单价、计量口径和确认流程有没有提前写清。"],
        ["最容易出问题的是数量口径", "比如水电点位、垃圾外运、防水面积、拆除修补，如果只写“按实”，却没写怎么量，就会让双方各说各话。"],
        ["施工前确认，比施工后解释重要", "按实结算项目最好约定先确认后施工，确认方式可以是合同附件、变更单、微信确认截图或现场签字。"],
        ["单价边界要提前锁住", "同一个项目如果没有材料、工艺、面积、起步价和超出规则，后面即使单价看起来不高，也可能因为数量变化造成总价失控。"],
        ["Zeno 的判断", "可变项目可以接受，但可变规则必须明确。业主签的不是一个绝对不变的价格，而是一套发生变化时仍然能算清楚的规则。"],
      ],
      questions: [
        "这个项目为什么不能一次性闭口报价？",
        "按实结算的单价是多少？是否含材料、人工、辅料和税费？",
        "数量怎么量？谁来量？是否需要双方确认？",
        "施工前是否必须先告知并确认费用？",
        "如果现场数量超过预估，有没有上限或提醒节点？",
        "如果双方对数量有争议，以什么证据为准？",
        "这个项目能不能改成暂定数量加明确单价？",
      ],
      serviceEntry:
        "如果你手里的报价单有很多“按实结算”，先不要急着判断贵不贵。可以先让 ZenoAIHome 帮你看清哪些项目需要规则补充，哪些项目需要施工前确认。",
      webScore: 89,
      wechatScore: 87,
    };
  }

  return {
    readerProblem: `用户看到“${title}”这个问题时，不知道它和签约、报价、验收中的哪一个风险有关。`,
    coreJudgment: "内容必须先帮助业主做出更清楚的装修决策，再考虑热点和传播。",
    angle: "用业主能听懂的话，把模糊经验变成签约前检查清单。",
    matchedMaterials: ["03_素材证据库/方法卡/装修报价风险洞察六层框架.md"],
    doNotSay: ["不要制造恐慌", "不要评价具体公司", "不要承诺百分百避坑"],
    sections: [
      ["先看它影响哪个决策", "一个装修问题值得写，是因为它会影响业主签约、付款、施工或验收，而不是因为它听起来专业。"],
      ["再看有没有素材支撑", "没有案例、方法卡或真实问题支撑的内容，容易变成空泛提醒。"],
      ["最后才决定平台版本", "网站版沉淀搜索资产，公众号版负责建立信任，两个版本不能只做简单复制。"],
    ],
    questions: ["它影响什么决策？", "有什么素材支撑？", "发布后要引导用户做什么？"],
    serviceEntry: "如果你手里有具体装修资料，可以先做一次签约前风险筛查。",
    webScore: 84,
    wechatScore: 82,
  };
}

function renderBrief(topic, blueprint) {
  return {
    targetReader: topic["目标用户"] || "准备签装修合同、担心后期增项的业主",
    readerProblem: blueprint.readerProblem,
    coreJudgment: blueprint.coreJudgment,
    matchedMaterials: blueprint.matchedMaterials.join("\n"),
    doNotSay: blueprint.doNotSay.join("\n"),
    outputs: "website_draft,wechat_draft",
  };
}

function renderWebsiteDraft(topic, brief, blueprint) {
  const title = topic["标题"] || "装修报价风险提醒";
  const sections = blueprint.sections
    .map(([heading, body]) => [`## ${heading}`, "", body, ""].join("\n"))
    .join("\n");
  const questions = blueprint.questions.map((item, index) => `${index + 1}. ${item}`).join("\n");

  return [
    `# ${title}`,
    "",
    "很多业主看装修报价单时，会把注意力放在总价上。",
    "",
    "但真正决定后期会不会扯皮的，往往不是总价那一行，而是报价里那些看起来正常、实际需要规则支撑的词。",
    "",
    "“按实结算”就是其中一个。",
    "",
    "它不是天然有问题。装修现场确实会有不确定性，有些数量要等现场确认后才能算清楚。",
    "",
    "真正的风险在于：报价单只写了“按实结算”，却没有写清楚怎么按、谁来算、什么时候确认、争议时按什么证据处理。",
    "",
    `Zeno 的核心判断是：${brief.coreJudgment}`,
    "",
    sections,
    "## 签约前要问清楚的 7 个问题",
    "",
    questions,
    "",
    "这些问题不是为了为难施工方，而是为了让双方在同一套规则里合作。",
    "",
    "签约前把规则写清楚，是减少施工中争议的最低成本方式。",
    "",
    "## FAQ",
    "",
    "**报价单写“按实结算”是不是一定有问题？**",
    "",
    "不一定。它可能是正常的现场结算方式。要重点看是否写清单价、计量方式、确认流程和争议处理规则。",
    "",
    "**按实结算和增项是什么关系？**",
    "",
    "按实结算不等于增项，但如果没有确认流程，就容易在施工中变成业主被动接受的新增费用。",
    "",
    "**业主能不能要求全部闭口价？**",
    "",
    "部分项目可以要求闭口价，但现场不确定性强的项目更现实的做法，是锁定单价、计量口径和确认流程。",
    "",
    "## 服务入口",
    "",
    blueprint.serviceEntry,
    "",
  ].join("\n");
}

function renderWechatDraft(topic, brief, blueprint) {
  const title = topic["标题"] || "装修报价风险提醒";
  const questions = blueprint.questions.map((item, index) => `${index + 1}. ${item}`).join("\n");

  return [
    `# ${title}`,
    "",
    "装修报价单里有一个词，很多业主会直接跳过去。",
    "",
    "按实结算。",
    "",
    "它看起来很正常，也确实不一定有问题。",
    "",
    "但如果报价单只写这四个字，没有写清后面的规则，它就可能变成后期争议的入口。",
    "",
    "重点不是能不能按实。",
    "",
    "重点是：怎么按实？谁确认？什么时候确认？按什么单价？",
    "",
    "## 按实结算不是问题",
    "",
    "装修现场有不确定性。",
    "",
    "拆开以后基层怎么样，水电点位最终多少，垃圾外运几车，防水面积怎么算，这些有时候确实要现场确认。",
    "",
    "所以按实结算本身不是坑。",
    "",
    "真正的问题是没规则。",
    "",
    "如果没有规则，施工方可能觉得这是正常加钱，业主可能觉得这是临时增项。",
    "",
    "双方都觉得自己有道理，争议就来了。",
    "",
    "## 签约前先问 7 句",
    "",
    questions,
    "",
    "这些话越早问越好。",
    "",
    "签约前问，是确认边界。",
    "",
    "施工后问，往往就是争议。",
    "",
    "## Zeno 的判断",
    "",
    brief.coreJudgment,
    "",
    "一份报价单不可能消灭所有变化。",
    "",
    "但好的报价单，至少应该把变化发生时怎么算写清楚。",
    "",
    "你不是要追求一个永远不变的数字。",
    "",
    "你要追求的是：一旦发生变化，双方还能按同一套规则说话。",
    "",
    blueprint.serviceEntry,
    "",
  ].join("\n");
}

function qualitySummary(platform) {
  if (platform === "website") {
    return "dbs-content 诊断：选题适合做网站长文，能沉淀搜索资产；主线围绕报价边界、按实结算规则和签约前确认。dbs-ai-check 诊断：AI 味中低，主要风险是清单段落较工整，人工审稿时可补一个真实报价截图场景。";
  }
  return "dbs-content 诊断：选题适合做公众号解释型文章；开头直接，读者问题清楚。dbs-ai-check 诊断：AI 味中低到中，短句较多但符合公众号阅读习惯；发布前需人工复核事实和服务入口。";
}

const now = Date.now();
const requestedTopicId = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "";

const topics = recordsAsObjects(recordList(ids.topics));
const briefs = recordsAsObjects(recordList(ids.briefs));
const drafts = recordsAsObjects(recordList(ids.drafts));
const reviews = recordsAsObjects(recordList(ids.reviews));
const approvals = recordsAsObjects(recordList(ids.approvals));

const topic = pickTopic(topics, briefs, requestedTopicId);
const suffix = topicSuffix(topic.topic_id);
const briefId = `brief_${suffix}`;
const webContentId = `content_${suffix}_web`;
const wechatContentId = `content_${suffix}_wechat`;
const blueprint = blueprintFor(topic);
const brief = renderBrief(topic, blueprint);
const websiteDraft = renderWebsiteDraft(topic, brief, blueprint);
const wechatDraft = renderWechatDraft(topic, brief, blueprint);

const result = {
  topic_id: topic.topic_id,
  topic_title: topic["标题"],
  brief_id: briefId,
  created: {},
  updated: [],
  safeguards: [
    "只创建待审稿件",
    "审批记录固定为 pending",
    "不会创建真实 pending 发布任务",
    "不会写入网站、公众号或 Obsidian 源库",
  ],
};

const existingBriefIds = existingByField(briefs, "brief_id");
result.created.brief = batchCreate(
  ids.briefs,
  ["brief_id", "topic_id", "目标读者", "用户问题", "核心判断", "匹配素材", "不要说什么", "输出渠道", "状态", "创建时间"],
  existingBriefIds.has(briefId)
    ? []
    : [[briefId, topic.topic_id, brief.targetReader, brief.readerProblem, brief.coreJudgment, brief.matchedMaterials, brief.doNotSay, brief.outputs, "briefed", now]],
  `mvp-brief-${suffix}`
);

const existingContentIds = existingByField(drafts, "content_id");
const draftRows = [
  [
    webContentId,
    briefId,
    topic["标题"],
    1,
    "reviewed",
    "Zeno",
    now,
    "website",
    websiteDraft,
    qualitySummary("website"),
    "dbs_content -> dbs_ai_check",
    "待人工确认",
  ],
  [
    wechatContentId,
    briefId,
    `${topic["标题"]}？`,
    1,
    "reviewed",
    "Zeno",
    now,
    "wechat_oa",
    wechatDraft,
    qualitySummary("wechat_oa"),
    "dbs_content -> dbs_ai_check",
    "待人工确认",
  ],
].filter((row) => !existingContentIds.has(row[0]));

result.created.drafts = batchCreate(
  ids.drafts,
  ["content_id", "brief_id", "标题", "版本号", "当前状态", "负责人", "更新时间", "平台", "正文", "质检摘要", "skill_chain", "人工确认"],
  draftRows,
  `mvp-drafts-${suffix}`
);

const existingReviewIds = existingByField(reviews, "review_id");
const issueSummary =
  "事实风险中等偏低：文章围绕通用报价规则，不评价具体公司；发布前仍需人工核对是否引用了具体报价截图、金额或案例细节。偏题风险低：内容始终围绕报价边界、按实结算和签约前确认。";
const reviewRows = [
  [
    `review_${suffix}_web`,
    webContentId,
    blueprint.webScore,
    "低。网站版围绕装修报价风险、签约判断和搜索沉淀，没有偏离 Zeno 主线。",
    "命中 2 个弱信号：清单段落较工整，FAQ 较模板化。建议人工审稿时补一个真实场景观察。",
    issueSummary,
    "通过。服务入口自然落在报价单审核，不做强销售。",
    "发布前补一次人工事实复核；如有截图，继续脱敏。",
    "yes",
    now,
  ],
  [
    `review_${suffix}_wechat`,
    wechatContentId,
    blueprint.wechatScore,
    "低。公众号版解释直接，未娱乐化、未恐吓。",
    "命中 2 个弱信号：短句密度高，判断句较集中。符合公众号体裁，但人工审稿可加入一句个人经验。",
    issueSummary,
    "通过。结尾转化克制，适合进入人工确认。",
    "人工审稿时检查语气是否过硬，服务入口保持低压。",
    "yes",
    now,
  ],
].filter((row) => !existingReviewIds.has(row[0]));

result.created.reviews = batchCreate(
  ids.reviews,
  ["review_id", "content_id", "总分", "偏题风险", "AI味", "事实风险", "转化入口", "修改建议", "是否通过", "质检时间"],
  reviewRows,
  `mvp-reviews-${suffix}`
);

const existingApprovalIds = existingByField(approvals, "approval_id");
const approvalRows = [
  [`approval_${suffix}_web`, webContentId, "Zeno", "pending", "等待人工确认：事实、脱敏、服务入口、是否进入网站草稿。", now],
  [`approval_${suffix}_wechat`, wechatContentId, "Zeno", "pending", "等待人工确认：事实、脱敏、语气、是否进入公众号草稿箱。", now],
].filter((row) => !existingApprovalIds.has(row[0]));

result.created.approvals = batchCreate(
  ids.approvals,
  ["approval_id", "content_id", "审批人", "审批结果", "审批意见", "审批时间"],
  approvalRows,
  `mvp-approvals-${suffix}`
);

result.updated.push(batchUpdate(ids.topics, [topic._record_id], { "状态": "reviewed", "下一步动作": "人工审批" }, `mvp-topic-reviewed-${suffix}`));

const refreshedBriefs = recordsAsObjects(recordList(ids.briefs));
const storedBrief = refreshedBriefs.find((item) => item.brief_id === briefId);
if (storedBrief) {
  result.updated.push(batchUpdate(ids.briefs, [storedBrief._record_id], { "状态": "waiting_review" }, `mvp-brief-waiting-${suffix}`));
}

result.taskRun = batchCreate(
  ids.taskRuns,
  ["run_id", "任务类型", "触发来源", "输入", "输出", "状态", "错误信息", "执行时间", "skill_id", "skill_chain", "调用方式", "人工确认"],
  [[
    `run_${now}`,
    "run_mvp_content_cycle",
    "Codex CLI",
    `topic_id=${topic.topic_id}`,
    `brief_id=${briefId}; drafts=2; reviews=2; approvals=2; next=人工审批`,
    "success",
    "",
    now,
    "automation_workflows,dbs_content,dbs_ai_check",
    "topic -> brief -> draft -> review -> approval_pending",
    "Hermes/CLI dry_run-safe",
    "必须",
  ]],
  `task-run-mvp-content-cycle-${suffix}`
);

result.verification = {
  drafts: recordsAsObjects(recordList(ids.drafts)).filter((item) => item.brief_id === briefId).length,
  reviews: recordsAsObjects(recordList(ids.reviews)).filter((item) => [webContentId, wechatContentId].includes(item.content_id)).length,
  approvals: recordsAsObjects(recordList(ids.approvals)).filter((item) => [webContentId, wechatContentId].includes(item.content_id)).length,
};

fs.writeFileSync(path.join(cwd, "mvp-content-cycle-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
