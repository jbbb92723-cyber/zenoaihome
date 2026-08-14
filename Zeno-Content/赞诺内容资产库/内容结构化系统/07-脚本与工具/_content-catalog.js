#!/usr/bin/env node

const ledgerCatalog = [
  { category: "用户问题", sourceType: "用户问题", dirs: ["业主提问"] },
  { category: "外部知识", sourceType: "外部研究素材", dirs: ["外部知识"] },
  { category: "外部素材", sourceType: "外部研究素材", dirs: ["外部素材"] },
  { category: "原始副本", sourceType: "原始素材副本", dirs: ["完整副本"] },
];

const sourceRules = [
  { keywords: ["业主提问"], type: "用户问题", code: "QST" },
  { keywords: ["外部知识"], type: "外部研究素材", code: "EXT" },
  { keywords: ["外部素材"], type: "外部研究素材", code: "EXT" },
  { keywords: ["短视频", "文稿"], type: "短视频", code: "VIDEO" },
  { keywords: ["公众号"], type: "公众号文章", code: "WX" },
  { keywords: ["观点与概念"], type: "观点与概念", code: "CON" },
  { keywords: ["爆款文稿"], type: "爆款文稿", code: "BK" },
  { keywords: ["推文"], type: "推文素材", code: "POST" },
  { keywords: ["其他作者"], type: "外部研究素材", code: "EXT" },
  { keywords: ["dontbesilent"], type: "本人内容", code: "USER" },
  { keywords: ["完整副本"], type: "原始素材副本", code: "COPY" },
];

function inferSourceRule(relPath) {
  const normalized = String(relPath || "").replaceAll("\\", "/");
  return (
    sourceRules.find((rule) => rule.keywords.every((keyword) => normalized.includes(keyword))) ||
    { type: "未分类素材", code: "MISC" }
  );
}

module.exports = { ledgerCatalog, sourceRules, inferSourceRule };
