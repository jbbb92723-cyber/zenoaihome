/**
 * lib/article-templates.ts
 *
 * 各内容版块的文章统一结尾模板。
 *
 * 使用方式：
 * 1. 文章发布时，将对应版块的 ending 模板追加到正文末尾。
 * 2. getEndingForCategory(categorySlug) 根据分类 slug 返回对应结尾。
 * 3. 这些模板不在代码层自动拼接——它们是作者发布时的参考和抄本。
 *    （如需在代码中自动拼接，可在 content 写入时调用 getEndingForCategory。）
 */

/* ─── 版块结尾模板 ─────────────────────────────────── */

const MATTRESS_ENDING = `---

我写这些，不是要砸谁的饭碗。我在这行16年了，卖过床垫，也拆过床垫，只是想让想买床垫的人，花的每一分钱都明明白白。

如果你看完还是拿不准，或者正在几款床垫之间纠结，可以去我的网站 zenoaihome.com 找我。简单的问题，我尽量免费帮你看；需要我帮你做完整的睡眠方案和一对一选购建议，这是我的付费服务。

不急。你先想好，觉得需要了再来。`

const RENOVATION_ENDING = `---

我写这些，是想让你在装修前看清楚——不是看清楚"该选什么风格"，而是看清楚这份报价、这份合同、这个决定，以后会不会让你后悔。

如果你手里已经有报价单、合同草稿，或者正在几家公司之间犹豫，可以去我的网站 zenoaihome.com 找我。简单的问题尽量免费帮你看。如果需要完整的报价审核、合同把关或签约前综合判断，这是我的付费服务。

别急着签。先把边界问清。`

const LIFESTYLE_ENDING = `---

我写这些，不是要教你"怎么生活"。我只是觉得，居住这件事被低估了——它影响你的情绪、你的关系、你每天醒来第一个感受。

如果你也在想"我想要的家到底是什么样的"，可以去我的网站 zenoaihome.com 看看其他文章。也许能找到一些答案，也许能问出更好的问题。

想深入聊聊你的具体情况，加我微信 zanxiansheng2025——简单的问题我尽量免费帮你看。`

const IP_ENDING = `---

我写这些，是因为我从0开始做过。不是理论派，是真金白银换来的经验。

传统行业的人做IP，有独特的优势——你有真实经历，有判断力，有行业认知。这些东西AI写不出来。

如果你也在做自己的IP，或者在考虑要不要开始，可以去我的网站 zenoaihome.com 看看。OPC社群里有一群和你一样的人——传统行业出身，用AI和新模式重新做一遍生意。`

const AI_ENDING = `---

AI不是魔法。它是一个工具——能帮你整理、对比、查漏，但不能替代你的判断、你的经验、你对人的理解。

我写AI实战，不追热点，不讲"颠覆"，只讲传统行业的人到底怎么把AI用进真实的工作流程里。

想了解更多工具、工作流和实战案例，去我的网站 zenoaihome.com。OPC·AI新学社 也在持续更新新手教程和轻陪跑项目。`

const OPC_ENDING = `---

OPC·同行有你，不是一个课程，也不是一个社群产品。它是一群传统行业的同行，用AI和新模式，重新做一遍生意的实验现场。

如果你也是传统行业出身，也在想"我能不能用AI做点不一样的事"——来网站 zenoaihome.com 的OPC版块看看。看项目、看复盘、看社群动态，觉得合适再来。

不急。我们都在路上。`

/* ─── 分类 slug → 结尾映射 ─────────────────────────── */

export const categoryEndings: Record<string, string> = {
  mattress: MATTRESS_ENDING,
  renovation: RENOVATION_ENDING,
  lifestyle: LIFESTYLE_ENDING,
  ip: IP_ENDING,
  ai: AI_ENDING,
  opc: OPC_ENDING,
}

/**
 * 根据一级分类 slug 获取对应版块的统一结尾。
 * 如果分类没有对应结尾，返回 null。
 */
export function getEndingForCategory(categorySlug: string): string | null {
  return categoryEndings[categorySlug] ?? null
}

/**
 * 从 article 的 parentCategory 获取结尾。
 * 兼容旧文章的 category 字段（尝试 slug 化后匹配）。
 */
export function getEndingForArticle(parentCategory?: string): string | null {
  if (!parentCategory) return null
  return getEndingForCategory(parentCategory)
}
