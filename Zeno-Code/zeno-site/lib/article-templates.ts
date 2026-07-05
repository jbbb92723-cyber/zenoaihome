/**
 * lib/article-templates.ts
 *
 * 各内容版块的文章统一结尾模板。
 *
 * 使用方式：
 * 1. 文章发布时，将对应版块的 ending 模板追加到正文末尾。
 * 2. getEndingForCategory(categorySlug) 根据分类 slug 返回对应结尾。
 * 3. 这些模板不在代码层自动拼接——它们是作者发布时的参考和抄本。
 *   （如需在代码中自动拼接，可在 content 写入时调用 getEndingForCategory。）
 */

/* ─── 版块结尾模板 ─────────────────────────────────── */

const MATTRESS_ENDING = `---

我在这行干了17年，卖过床垫也拆过床垫。写这些不是要砸谁饭碗，就是想让买床垫的人每分钱都花得明白。

如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。简单的问题尽量免费帮你看，需要完整睡眠方案是我的付费服务。不急，觉得需要了再来。`

const RENOVATION_ENDING = `---

我写这些，是让你在装修前看清楚——不是看风格，是看报价、看合同、看这个决定以后会不会让你后悔。

如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。手里有报价单或合同草稿的，发给我帮你看看，简单的问题尽量免费。需要完整审核、合同把关或签约前综合判断，是我的付费服务。不急，觉得需要了再来。`

const LIFESTYLE_ENDING = `---

我写这些，不是要教谁生活。我只是觉得居住这件事被低估了——它影响你的情绪、你的关系、你每天醒来第一个感觉。

如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。简单的问题尽量免费帮你看，需要完整方案是我的付费服务。不急，觉得需要了再来。`

const IP_ENDING = `---

我写这些，是因为我从零开始做过。不是理论派，是真金白银换来的经验。传统行业的人做IP，有独特的优势——你有真实经历，有判断力，有行业认知，这些东西AI写不出来。

如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。简单的问题尽量免费帮你看，需要完整方案是我的付费服务。不急，觉得需要了再来。`

const AI_ENDING = `---

AI不是魔法。它是一个工具——能帮你整理、对比、查漏，但不能替代你的判断、你的经验、你对人的理解。我写AI实战，不追热点，不讲"颠覆"，只讲传统行业的人怎么把AI用进真实工作里。

如果看完还是拿不准，可以去我网站 zenoaihome.com 找我。简单的问题尽量免费帮你看，需要完整方案是我的付费服务。不急，觉得需要了再来。`

const OPC_ENDING = `---

OPC·同行有你，不是一个课程，也不是一个社群产品。它是一群传统行业的同行，用AI和新模式重新做一遍生意的实验现场。

如果看完还是拿不准，可以去我网站 zenoaihome.com 的OPC版块看看。看项目、看复盘、看社群动态，觉得合适再来。不急，我们都在路上。`

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
