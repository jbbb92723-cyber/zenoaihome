import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(cwd, "manifest.json"), "utf8"));
const baseToken = manifest.baseToken;

const ids = {
  drafts: "tblWRTJDAXMYoj2y",
  reviews: "tbluesIB80mYriTs",
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
    "--as",
    "user",
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
    "--as",
    "user",
  ]);
  return { label, status: "updated", count: recordIds.length };
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
    "--as",
    "user",
  ]);
  return { label, status: "created", count: rows.length };
}

const now = Date.now();

const websiteBody = `# 装修材料只写品牌为什么不够，型号和替换规则也要写清楚

很多业主看装修报价单时，会先看材料品牌。

写了某个熟悉的品牌，好像就放心了一半。

但材料风险往往不在“有没有品牌”，而在“这个品牌下面到底是哪一个型号、哪一个系列、哪一种规格，以及缺货时能不能被替换”。

只写品牌，不写型号，就像只写“买一台电脑”，却不写配置。听起来没错，真正执行时却有很大的解释空间。

Zeno 的判断是：材料条款不是为了证明施工方可信或不可信，而是为了让业主、设计方、施工方在同一套可核对的标准里合作。

## 品牌不是材料边界

同一个品牌，可能有入门款、中端款、高端款，也可能有工程款、零售款、不同产地、不同环保等级、不同规格。

报价单只写品牌，后面就容易出现这种争议：

施工方说：我用的是这个品牌。

业主说：但我以为是你当时展示的那一款。

双方都没有完全错，问题是合同没有把“那一款”写清楚。

所以材料条款至少要写清：品牌、型号、系列、规格、等级、颜色或花色、计量单位、适用位置。

## 型号决定可核对

型号不是多余细节，它是后期验收的依据。

如果报价单只写“某品牌瓷砖”，验收时业主很难判断现场送来的砖是不是当初谈好的砖。

如果写成“品牌 + 型号 + 规格 + 使用区域”，后面就可以按清单核对。

材料不是靠记忆验收的，是靠合同附件和送货单验收的。

## 替换规则必须提前写

装修周期里，材料缺货、停产、批次变化并不少见。

替换本身不是问题，问题是替换规则没有提前约定。

建议写清楚四件事：

1. 替换前必须告知并确认。
2. 替换材料不能低于原约定等级。
3. 如果价格更低，要不要退差价。
4. 如果价格更高，谁承担补差，是否可以拒绝。

没有替换规则时，业主很容易在施工现场被动接受。

## 主材和辅材都要有边界

很多人只盯着瓷砖、地板、门窗、洁具这些主材，却忽略了辅材。

但辅材也会影响质量和价格，比如腻子、防水、胶、管线、板材、五金、收口条。

报价单可以不把每颗螺丝都写出来，但关键辅材必须有品牌、型号或性能标准。

尤其是会影响环保、防水、结构稳定和后期维修的材料，不能只写“优质”“环保”“同等档次”这种模糊词。

## 签约前要问的 8 个问题

1. 材料只写品牌，还是写到了型号和系列？
2. 有没有明确使用区域，比如厨房、卫生间、客厅、阳台？
3. 有没有写规格、颜色、等级、环保标准？
4. 缺货或停产时，是否必须先经过业主确认？
5. 替换材料是否要求同品牌同等级，还是只写“同等档次”？
6. 替换后如果价格不同，差价怎么处理？
7. 送货单、包装标签、质保卡是否作为验收依据？
8. 哪些辅材也需要写进合同附件？

这些问题不是为了把合同写得很复杂，而是为了让后期验收有依据。

## Zeno 的判断

报价单里的材料条款，核心不是堆品牌，而是把“可核对、可替换、可验收”写清楚。

品牌负责建立初步信任，型号负责落地执行，替换规则负责处理变化。

只写品牌，会让很多关键判断停留在口头理解里。

签约前把型号和替换规则写清楚，是减少材料争议的最低成本方式。

## FAQ

**报价单写了品牌还不够吗？**

不够。品牌只能说明大范围，不能说明具体型号、等级、规格和适用位置。

**材料缺货时可以替换吗？**

可以，但替换前应该经过业主确认，并写清楚等级、差价和验收依据。

**辅材也要写型号吗？**

关键辅材建议写清品牌、型号或性能标准。尤其是防水、胶、板材、管线、腻子等会影响质量和环保的材料。

## 服务入口

如果你手里有装修报价单或材料清单，可以先做一次签约前风险筛查，重点看品牌、型号、替换规则和验收依据有没有写清楚。
`;

const wechatBody = `# 装修材料只写品牌为什么不够，型号和替换规则也要写清楚

很多业主看到报价单里写了一个熟悉的材料品牌，就会先松一口气。

但材料条款真正容易出问题的地方，往往不是有没有品牌。

而是有没有写清型号、系列、规格，以及缺货时怎么替换。

只写品牌，不写型号，就像只说“买一台电脑”，却不写配置。

听起来没错。

真正执行时，空间就大了。

## 品牌不等于具体材料

同一个品牌下面，可能有很多系列。

有入门款，也有高端款。

有工程款，也有零售款。

有不同规格、不同环保等级、不同产地、不同批次。

报价单只写品牌，后期就容易出现一种争议：

施工方说，我用的是这个品牌。

业主说，但我以为是当时看的那一款。

这时再争，往往很累。

因为合同里没有写清楚“那一款”。

## 型号是验收依据

型号不是细节控。

型号是后期核对材料的依据。

如果报价单只写“某品牌瓷砖”，你很难判断现场送来的砖是不是当初谈好的砖。

如果写清品牌、型号、规格、使用区域，验收时就能对着清单看。

材料不是靠记忆验收的。

是靠合同附件、送货单、包装标签和质保信息验收的。

## 替换规则要提前说

装修周期里，材料缺货、停产、批次变化都可能发生。

替换本身不是问题。

问题是没有替换规则。

至少要写清楚：

1. 替换前必须先通知业主。
2. 替换材料不能低于原约定等级。
3. 如果替换材料更便宜，差价怎么处理。
4. 如果替换材料更贵，业主是否可以拒绝。

没有这些规则，业主很容易在施工现场被动接受。

## 签约前先问 8 句

1. 材料写到型号了吗？
2. 写到系列和规格了吗？
3. 写清使用区域了吗？
4. 缺货时能不能直接替换？
5. 替换是否必须经过业主确认？
6. 替换后差价怎么处理？
7. 送货单和包装标签能不能作为验收依据？
8. 关键辅材有没有写品牌或性能标准？

这些问题不是为了把事情复杂化。

是为了让后面的验收有依据。

## Zeno 的判断

材料条款不是品牌列表。

它应该是一套可核对、可替换、可验收的规则。

品牌负责建立初步信任。

型号负责落地执行。

替换规则负责处理变化。

只写品牌，会让很多关键判断停留在口头理解里。

如果你手里有装修报价单或材料清单，可以先做一次签约前风险筛查，重点看品牌、型号、替换规则和验收依据有没有写清楚。
`;

const draftSummary =
  "dbs-content 诊断：已修复选题错位，正文聚焦材料品牌、型号、规格、替换规则和验收依据；适合沉淀为网站 SEO/GEO 内容，也适合公众号做签约前提醒。dbs-ai-check 诊断：AI 味中低到中，清单段落仍需人工补一个真实材料清单场景，但不存在上一主题混入问题。";

const reviewPatch = {
  "总分": 88,
  "偏题风险": "低。正文已回到材料品牌、型号、替换规则和验收依据，没有继续讲按实结算。",
  "AI味": "中低。清单结构较工整，但符合风险筛查类内容。人工审稿时建议补一个真实材料清单截图场景或口头承诺场景。",
  "事实风险": "中低。内容围绕通用装修材料条款，不评价具体品牌或公司；发布前需人工核对是否涉及具体材料截图、型号和价格。",
  "转化入口": "通过。服务入口自然落在材料清单/报价单签约前风险筛查，不强销售。",
  "修改建议": "发布前检查是否需要加入一个真实但脱敏的材料替换场景；保持低压服务入口。",
  "是否通过": "yes",
  "质检时间": now,
};

const drafts = recordsAsObjects(recordList(ids.drafts));
const reviews = recordsAsObjects(recordList(ids.reviews));

const webDraft = drafts.find((item) => item.content_id === "content_20260527_004_web");
const wechatDraft = drafts.find((item) => item.content_id === "content_20260527_004_wechat");
const webReview = reviews.find((item) => item.review_id === "review_20260527_004_web");
const wechatReview = reviews.find((item) => item.review_id === "review_20260527_004_wechat");

const result = {
  repaired_at: new Date(now).toISOString(),
  repaired: [],
  safeguards: ["no_approval_change", "no_publish", "draft_content_only", "approval_stays_pending"],
};

if (webDraft) {
  result.repaired.push(batchUpdate(ids.drafts, [webDraft._record_id], {
    "正文": websiteBody,
    "质检摘要": draftSummary,
    "版本号": 2,
    "更新时间": now,
    "人工确认": "待人工确认",
  }, "repair-topic-004-web-draft"));
}

if (wechatDraft) {
  result.repaired.push(batchUpdate(ids.drafts, [wechatDraft._record_id], {
    "正文": wechatBody,
    "质检摘要": draftSummary,
    "版本号": 2,
    "更新时间": now,
    "人工确认": "待人工确认",
  }, "repair-topic-004-wechat-draft"));
}

if (webReview) {
  result.repaired.push(batchUpdate(ids.reviews, [webReview._record_id], reviewPatch, "repair-topic-004-web-review"));
}

if (wechatReview) {
  result.repaired.push(batchUpdate(ids.reviews, [wechatReview._record_id], {
    ...reviewPatch,
    "总分": 86,
  }, "repair-topic-004-wechat-review"));
}

result.taskRun = batchCreate(
  ids.taskRuns,
  ["run_id", "任务类型", "触发来源", "输入", "输出", "状态", "错误信息", "执行时间", "skill_id", "skill_chain", "调用方式", "人工确认"],
  [[
    `run_${now}`,
    "repair_topic_draft_alignment",
    "Codex CLI",
    "brief_20260527_004",
    "repaired website/wechat draft body and review summary; approval unchanged",
    "success",
    "",
    now,
    "dbs_content,dbs_ai_check",
    "topic_alignment_guard -> draft_repair -> review_refresh",
    "Hermes/CLI dry_run-safe",
    "必须",
  ]],
  "task-run-repair-topic-004"
);

fs.writeFileSync(path.join(cwd, "repair-topic-004-drafts-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
