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

function listFields(tableId) {
  return runLark(["base", "+field-list", "--base-token", baseToken, "--table-id", tableId, "--as", "bot"]).data.fields || [];
}

function ensureField(tableId, field) {
  const found = listFields(tableId).find((item) => item.name === field.name);
  if (found) return { name: field.name, status: "existing" };
  sleep(500);
  runLark([
    "base",
    "+field-create",
    "--base-token",
    baseToken,
    "--table-id",
    tableId,
    "--json",
    jsonArg(`field-draft-${tableId}-${field.name}`, field),
    "--as","bot",
  ]);
  return { name: field.name, status: "created" };
}

function recordList(tableId, limit = 200) {
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

function existingByField(tableId, fieldName) {
  const data = recordList(tableId);
  const idx = (data.fields || []).indexOf(fieldName);
  if (idx < 0) return new Set();
  return new Set((data.data || []).map((row) => row[idx]).filter(Boolean));
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

const now = Date.now();
const topicId = "topic_20260527_005";
const briefId = "brief_20260527_005";

const websiteDraft = `# 装修报价里的“基础部分总合计”，为什么不是最终价

很多业主拿到装修报价单，第一眼会看最后一行。

28306.60。

看起来很清楚，好像这就是整套装修要花的钱。

但如果这一行前面写的是“基础部分总合计”，就不能直接把它当成最终价。

这几个字很容易被忽略。它不像“另计”“暂估”那么刺眼，也不像红字备注那么明显。但在报价单里，它其实是在提醒你：这只是当前列出来的基础项目合计，不一定是你最后要付的钱。

我不是说这种报价一定有问题。装修现场有不确定性，尤其是拆改、水电、防水、封窗这些项目，确实会根据现场条件调整。

真正的问题不是有变化，而是变化的规则有没有在签约前说清楚。

我看报价单，第一眼通常不看贵不贵。我先看边界。

## “基础部分总合计”不是最终闭口价

一份报价单最后写“合计”或“总计”，业主很容易理解成最终价格。

但“基础部分总合计”不一样。

它更像是在说：目前这些基础项目，加起来是这个金额。

那问题来了。基础部分之外，还有没有别的部分？

很多报价单里，后面可能还会有主材费用、个性化项目、管理费、税费、物业相关费用、施工水电费、垃圾外运超出费用、现场确认后的增减项、玻璃门窗五金等升级补差。

这些东西如果没有写清，业主就会把“当前报价”误认为“完整成本”。

这就是很多预算超支的开始。不是你乱花钱，是一开始看到的价格就不是完整价格。

签约前先问一句：这是不是最终闭口价？如果不是，还有哪些费用没有包含？

这句话比砍价有用。

## 小字备注往往比总价更重要

我看过一份约 2.8 万的局部改造报价单。最后一行写的是“基础部分总合计”，底部备注还有一句：

“工程项目如有漏报、增加或减少，则按实际增减项目结算。”

这句话不能简单理解成坏。

装修里确实会有增减项。拆开以后基层不行，水电点位调整，业主临时改变需求，都可能影响费用。

但这句话必须配规则。

要问清楚：漏报怎么认定？增项按什么单价算？施工前是否必须业主确认？是微信确认，还是纸质签字？双方对工程量有争议，按什么标准处理？

如果这些都没有写，这句话就会变成一个口子。施工时一旦出现变化，双方只能靠各自理解。

业主觉得：这不是应该包含吗？

施工方觉得：这个本来就不在报价里。

矛盾就是这么来的。

我不反对增项。我反对不透明的增项。

## 前后备注冲突，签约前必须改

同一份报价里，还有一个很典型的问题。

明细里写了“装修垃圾外运：1 车 × 500 元”，但底部备注又写“本报价不含装修垃圾外运”。

这就是前后冲突。

这类问题，业主很容易跳过去。因为金额不大，看起来也不是主要项目。但真正施工时，它就会变成争议。

施工方可能说：表格里的 500 只是某一部分垃圾处理。

业主可能说：明细里明明写了垃圾外运，为什么还要加钱？

这时候再讲道理，已经晚了。签约前就应该改清楚。

比如写成：本报价已含 1 车垃圾外运，超出部分按 ___ 元/车计费。

或者写成：本报价仅含袋装清理至小区指定点，不含小区外运输费用。

两种写法都可以。关键是不要前后打架。

报价单不是越厚越安全。前后一致，才安全。

## 管理费和税点写了比例，金额是 0，也要问

有些业主看到费用栏是 0，就默认不用付。

这不稳。

比如报价底部写：工程施工管理费 8%，金额 0；开票税点 3%，金额 0。

你不能自己脑补成免收。

要直接问：管理费是免收，还是暂时没算？税费是已含，还是开票另加？如果后面要发票，是不是再加 3%？这些费用会不会进入正式合同？

最好的处理方式，是让对方写清楚：管理费已包含/免收；税费已包含/如需开票另计 ___%。

装修里很多费用不是突然冒出来的，是签约前没问，施工后才被看见。

## 每个具体项目，也要看边界

“基础部分总合计”只是一个提醒。

真正影响后期价格的，还是每一项有没有写清楚。

比如水电。报价里写“电路、水路改造：15 个 × 160 元”。这里的“个”是什么？

一个插座？一个水口？一个点位？一个回路？

有没有包含开槽、布管、穿线、修补？超出怎么计价？

如果没有点位清单，业主就没法判断 15 个够不够。后面一加点位，就变成增项。

再比如防水。报价里写了防水品牌，业主就以为防水都包了。但有些备注会写：某一层防水处理不含。这个如果没看见，后面就会觉得怎么又要加钱。

再比如封窗。铝材、玻璃、五金写得很漂亮，不代表边界完整。

还要看是否包含拆旧、运输上楼、打胶、防水、收口、吊装、物业审批要求、升级补差。

报价单最怕的不是有专业词。最怕的是专业词很多，但边界没写清。

## 签约前要问的 9 个问题

如果你手里有一份报价单，看到“基础部分总合计”或类似表达，先把下面这些问题问清楚。

1. 这份报价是最终闭口价，还是基础部分价？
2. 除这份报价外，还有哪些项目未包含？
3. 漏报、增加、减少，分别按什么单价结算？
4. 增项是否必须业主书面确认后才能施工？
5. 垃圾外运到底含不含？含几车？超出怎么收费？
6. 管理费是否免收？如果不免，金额是多少？
7. 税点是否另加？开票总价是多少？
8. 所有补差和升级项是否已经计入总价？
9. 有没有一份未包含项目清单？

这些问题不复杂。但施工开始以后，再问就不一样了。

签约前问，是确认边界。施工后问，往往就是争议。

## Zeno 的判断

报价单不是拿来比谁便宜的。至少不应该只这么看。

一份报价贵一点，但边界清楚，后面未必吃亏。

一份报价便宜很多，但到处都是“另计”“按实结算”“不含”，后面未必省钱。

真正危险的是：你以为自己买的是完整方案，实际签的是一个基础版本。

我在现场见过很多争议，最后不是因为价格差多少，而是因为一开始没有把“包含什么、不包含什么”说清楚。

施工方觉得：这个本来就不包含。

业主觉得：我以为已经包了。

这两个“以为”，就是后期争吵的开始。

所以签约前要做的，不是先砍价。是先把报价单里每一个模糊的地方，变成白纸黑字。

签约前多问一句，施工中少争一次。

## FAQ

**装修报价单上的总价是不是最终价？**

不一定。要看报价单是否写了“基础部分”“暂估”“另计”“按实际结算”等字样。如果只是基础部分合计，通常代表当前已列项目的合计，不代表后期不会增加费用。

**“基础部分总合计”是什么意思？**

它通常表示基础施工或当前报价范围内项目的合计，不一定包含主材、税费、管理费、物业费用、垃圾外运、个性化项目和后期增项。

**报价单写“按实际增减项目结算”正常吗？**

正常，但必须写清计价规则、确认流程和签字方式。否则这句话会变成后期增项入口。

**报价单前后备注冲突怎么办？**

签约前要求对方修改报价单或合同附件。比如明细里写了垃圾外运，底部又写不含垃圾外运，就要明确到底含几车、清到哪里、超出怎么计费。

**怎么看一份报价有没有后期增项风险？**

重点看三类内容：未包含项目、按实结算项目、备注里的限制条件。只看总价没有意义，真正决定后期费用的是边界有没有写清楚。

## 服务入口

如果你手里也有一份装修报价单，第一步不要急着问“贵不贵”。

先确认它是不是最终价，哪些项目没包含，哪些地方后期会按实际结算。

如果你自己看不出来，可以了解 ZenoAIHome 的装修报价单审核服务。我们不是帮你单纯砍价，而是帮你在签约前看清风险边界。`;

const wechatDraft = `# 装修报价里的“基础部分总合计”，为什么不是最终价？

很多人拿到装修报价单，第一眼只看最后一行。

28306.60。

看起来像总价。

但如果这一行前面写的是“基础部分总合计”，你就不能直接把它当成最终价。

这几个字不吓人，也不显眼。它不像“另计”“暂估”那么刺眼，所以很多业主会跳过去。

但它真正的意思可能是：

这只是当前列出来的基础项目合计，不一定是你最后要付的钱。

我不是说这种报价一定有问题。装修现场有很多不确定，拆改、水电、防水、封窗，确实会根据现场情况变化。

真正要看的不是有没有变化。

是变化的规则有没有提前写清楚。

## 1. 基础部分，不等于全部

“基础部分总合计”这几个字，重点在“基础部分”。

它通常不是在告诉你“这就是最终价”，而是在告诉你“目前这些基础项目加起来是这个金额”。

那基础部分之外，还有什么？

可能有主材、个性化项目、税费、管理费、物业相关费用、施工水电费、垃圾外运超出费用、现场增减项、升级补差。

如果这些没有写清楚，你看到的价格就不是完整价格。

很多预算超支，不是因为业主乱花钱。

是一开始看到的价格，就不是完整成本。

签约前先问一句：

这是不是最终闭口价？如果不是，还有哪些费用没包含？

这句话比砍价更重要。

## 2. 小字备注，比总价更要看

我看过一份约 2.8 万的局部改造报价单。最后写的是“基础部分总合计”，底部还有一句：

“工程项目如有漏报、增加或减少，则按实际增减项目结算。”

这句话本身不一定错。

装修现场确实可能有增减项。

但问题是，它有没有配规则？

你要问清楚：

- 漏报怎么认定？
- 增项按什么单价算？
- 施工前是否必须确认？
- 是微信确认，还是书面签字？
- 工程量有争议，按什么标准处理？

如果这些没写清，这句话就会变成后期争议的入口。

我不反对增项。

我反对不透明的增项。

## 3. 前后备注冲突，一定要改

同一份报价里，还有一个典型问题。

明细里写了“装修垃圾外运：1 车 × 500 元”。

但底部备注又写：“本报价不含装修垃圾外运”。

这就是前后冲突。

这种问题如果签约前不改，施工时就很容易扯皮。

施工方可能说：表格里的 500 只是某一部分处理。

业主可能说：明细里明明已经写了垃圾外运，为什么还要加钱？

谁对谁错先不说。

关键是这件事本来可以提前写清楚。

比如：

本报价已含 1 车垃圾外运，超出部分按 ___ 元/车计费。

或者：

本报价仅含袋装清理至小区指定点，不含小区外运输费用。

两种写法都可以。

关键是不要前后打架。

## 4. 金额写 0，也要问

有些报价单底部会写：

- 工程施工管理费：8%，金额 0
- 开票税点：3%，金额 0

很多业主看到 0，就默认不用付。

这不稳。

你要问：

管理费是免收，还是暂时没算？

税费是已含，还是开票另加？

如果后面要发票，是不是再加 3%？

这些费用会不会写进正式合同？

不要接受“这个后面再说”。

装修里很多费用不是突然冒出来的，是签约前没有问，施工后才被看见。

## 5. 每个项目都要看边界

“基础部分总合计”只是一个提醒。

真正影响后期价格的，是每一项有没有写清楚边界。

比如水电写“15 个 × 160 元”。

这里的“个”是什么？

插座？水口？点位？回路？

有没有包含开槽、布管、穿线、修补？

超出怎么计价？

再比如防水。

报价里写了防水品牌，不代表所有防水都包含。有些备注会写某一层处理不含。

再比如封窗。

铝材、玻璃、五金写得很专业，不代表拆旧、运输、打胶、防水、收口、吊装都包含。

报价单最怕的不是有专业词。

最怕的是专业词很多，但边界没写清。

## 签约前，先问这 9 个问题

如果你看到“基础部分总合计”或类似表达，先别急着签。

把这 9 个问题问清楚：

1. 这份报价是最终闭口价，还是基础部分价？
2. 除这份报价外，还有哪些项目未包含？
3. 漏报、增加、减少，分别按什么单价结算？
4. 增项是否必须业主书面确认后才能施工？
5. 垃圾外运到底含不含？含几车？超出怎么收费？
6. 管理费是否免收？如果不免，金额是多少？
7. 税点是否另加？开票总价是多少？
8. 所有补差和升级项是否已经计入总价？
9. 有没有一份未包含项目清单？

这些问题不复杂。

但时间点很重要。

签约前问，是确认边界。

施工后问，往往就是争议。

## Zeno 的判断

报价单不是只拿来比谁便宜。

一份报价贵一点，但边界清楚，后面未必吃亏。

一份报价便宜很多，但到处都是“另计”“按实结算”“不含”，后面未必省钱。

真正危险的是：你以为自己买的是完整方案，实际签的是基础版本。

装修里的很多争议，最后不是因为价格差多少。

而是因为一开始没有把“包含什么、不包含什么”说清楚。

签约前要做的，不是先砍价。

是先把报价单里每一个模糊的地方，变成白纸黑字。

签约前多问一句，施工中少争一次。

如果你手里也有一份报价单，第一步不要急着问贵不贵。先确认它是不是最终价，哪些项目没包含，哪些地方后期会按实际结算。`;

const reviewSummary =
  "dbs-content 诊断：选题适合做网站长文和公众号解释型文章；主线清楚，围绕报价边界、签约前确认和服务转化。dbs-ai-check 诊断：整体 AI 味中低，主要风险是句式较均匀、判断句密度偏高，公众号版已用短段落降低阅读压力。发布前仍需人工确认原始报价截图中的金额、备注和脱敏信息。";

const aiFlavor =
  "命中 3 个弱/中信号：1）部分段落连续使用“不是...而是...”判断结构；2）网站版 FAQ 和清单较工整，可能显得模板化；3）公众号版短句密度高，但属于公众号体裁可接受。建议人工审稿时加入 1 个更具体的业主场景或现场观察。";

const issueSummary =
  "事实风险中等：金额、垃圾外运冲突、管理费/税点比例需与原始截图复核；不得评价具体公司；案例继续脱敏。偏题风险低：内容始终围绕报价边界和签约前判断。转化入口低压，符合 Zeno 定位。";

const contentRows = [
  [
    "content_20260527_005_web",
    briefId,
    "装修报价里的“基础部分总合计”，为什么不是最终价",
    1,
    "reviewed",
    "Zeno",
    now,
    "website",
    websiteDraft,
    reviewSummary,
    "dbs_content -> dbs_ai_check",
    "待人工确认",
  ],
  [
    "content_20260527_005_wechat",
    briefId,
    "装修报价里的“基础部分总合计”，为什么不是最终价？",
    1,
    "reviewed",
    "Zeno",
    now,
    "wechat_oa",
    wechatDraft,
    reviewSummary,
    "dbs_content -> dbs_ai_check",
    "待人工确认",
  ],
];

const result = { fields: [], drafts: null, reviews: null, approvals: null, updates: [], taskRun: null, verification: {} };

for (const field of [
  { name: "平台", type: "text" },
  { name: "正文", type: "text" },
  { name: "质检摘要", type: "text" },
  { name: "skill_chain", type: "text" },
  { name: "人工确认", type: "text" },
]) {
  result.fields.push(ensureField(ids.drafts, field));
}

const existingContents = existingByField(ids.drafts, "content_id");
const newContentRows = contentRows.filter((row) => !existingContents.has(row[0]));
result.drafts = batchCreate(
  ids.drafts,
  ["content_id", "brief_id", "标题", "版本号", "当前状态", "负责人", "更新时间", "平台", "正文", "质检摘要", "skill_chain", "人工确认"],
  newContentRows,
  "first-drafts"
);

const existingReviews = existingByField(ids.reviews, "review_id");
const reviewRows = [
  [
    "review_20260527_005_web",
    "content_20260527_005_web",
    88,
    "低。没有偏离装修报价风险、签约判断和业主决策主线。",
    aiFlavor,
    issueSummary,
    "通过。服务入口自然落在报价单审核，不做强销售。",
    "发布前补一次人工事实复核；公众号版可加入一个更具体的业主场景；保留低压服务入口。",
    "yes",
    now,
  ],
  [
    "review_20260527_005_wechat",
    "content_20260527_005_wechat",
    86,
    "低。公众号版更适合解释和提醒，未娱乐化、未恐吓。",
    aiFlavor,
    issueSummary,
    "通过。结尾转化克制，适合进入人工确认。",
    "开头已经足够直接；人工审稿时检查是否需要补一张报价截图局部示意。",
    "yes",
    now,
  ],
].filter((row) => !existingReviews.has(row[0]));
result.reviews = batchCreate(
  ids.reviews,
  ["review_id", "content_id", "总分", "偏题风险", "AI味", "事实风险", "转化入口", "修改建议", "是否通过", "质检时间"],
  reviewRows,
  "first-reviews"
);

const existingApprovals = existingByField(ids.approvals, "approval_id");
const approvalRows = [
  ["approval_20260527_005_web", "content_20260527_005_web", "Zeno", "pending", "等待人工确认：事实、脱敏、服务入口、是否进入网站草稿。", now],
  ["approval_20260527_005_wechat", "content_20260527_005_wechat", "Zeno", "pending", "等待人工确认：事实、脱敏、语气、是否进入公众号草稿箱。", now],
].filter((row) => !existingApprovals.has(row[0]));
result.approvals = batchCreate(
  ids.approvals,
  ["approval_id", "content_id", "审批人", "审批结果", "审批意见", "审批时间"],
  approvalRows,
  "first-approvals"
);

const topic = recordsAsObjects(recordList(ids.topics)).find((item) => item.topic_id === topicId);
if (topic) result.updates.push(batchUpdate(ids.topics, [topic._record_id], { "状态": "reviewed", "下一步动作": "人工审批" }, "topic-reviewed"));

const brief = recordsAsObjects(recordList(ids.briefs)).find((item) => item.brief_id === briefId);
if (brief) result.updates.push(batchUpdate(ids.briefs, [brief._record_id], { "状态": "waiting_review" }, "brief-waiting-review"));

result.taskRun = batchCreate(
  ids.taskRuns,
  ["run_id", "任务类型", "触发来源", "输入", "输出", "状态", "错误信息", "执行时间", "skill_id", "skill_chain", "调用方式", "人工确认"],
  [[
    `run_${now}`,
    "generate_first_drafts_and_review",
    "Codex CLI",
    `brief_id=${briefId}`,
    "drafts=2; reviews=2; approvals=2; next=人工审批",
    "success",
    "",
    now,
    "dbs_content,dbs_ai_check",
    "dbs_content -> draft_generator -> dbs_ai_check -> approval_pending",
    "Hermes Skill Adapter / Codex CLI",
    "是",
  ]],
  "task-run-generate-first-drafts"
);

result.verification.drafts = recordsAsObjects(recordList(ids.drafts)).filter((item) => String(item.brief_id) === briefId);
result.verification.reviews = recordsAsObjects(recordList(ids.reviews)).filter((item) => String(item.content_id || "").includes("20260527_005"));
result.verification.approvals = recordsAsObjects(recordList(ids.approvals)).filter((item) => String(item.content_id || "").includes("20260527_005"));
result.verification.topic = recordsAsObjects(recordList(ids.topics)).filter((item) => item.topic_id === topicId);
result.verification.brief = recordsAsObjects(recordList(ids.briefs)).filter((item) => item.brief_id === briefId);

fs.writeFileSync(path.join(cwd, "first-drafts-review-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
