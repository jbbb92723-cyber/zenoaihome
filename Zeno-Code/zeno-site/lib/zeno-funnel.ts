/**
 * lib/zeno-funnel.ts
 * Zeno 获客→转化→交付 闭环 SOP
 *
 * 六步闭环：
 *   文章 → 免费工具 → 加微信 → ¥499 快审 → 交付 → 案例 → 回到文章
 *
 * 每一步都有明确的所有者、动作、检查标准。
 */

export interface FunnelStep {
  step: number
  name: string
  owner: 'System' | 'Zeno'
  action: string
  check: string
  tool: string
}

export const ZENO_FUNNEL: FunnelStep[] = [
  {
    step: 1,
    name: '文章获客',
    owner: 'System',
    action: '每篇文章底部 CTA 优先推免费工具，次要推 ¥499',
    check: '文章底部 "下一步" 第一个按钮是 "免费初筛 →"，第二个是 "¥499 快审 →"',
    tool: 'components/features/content/ArticleCTA.tsx',
  },
  {
    step: 2,
    name: '免费工具 → 加微信',
    owner: 'System',
    action: '免费初筛结果页底部，强烈引导加微信："把结果发我，帮你判断下一步"',
    check: '工具结果页有明显入口指向微信 zanxiansheng2025',
    tool: 'QuoteCheckClient 底部结果区',
  },
  {
    step: 3,
    name: '微信沟通',
    owner: 'Zeno',
    action: '业主加微信后：确认需求 → 让发报价单 → 判断是否适合快审',
    check: '每次对话不超过 5 轮就到达 "发报价单" 或 "不适合" 的结论',
    tool: 'Zeno OS /admin/ai-reply（17 条模板可用）',
  },
  {
    step: 4,
    name: '¥499 成交',
    owner: 'System',
    action: '¥499 产品页上有明确的支付入口（二维码或链接）',
    check: '产品页 CTA 是 "立即支付 ¥499" 而不是 "联系我"',
    tool: '/services/quote-standard',
  },
  {
    step: 5,
    name: '交付审查',
    owner: 'Zeno',
    action: '收到报价单后 24h 内出审查报告，用模板回复',
    check: '每份审查在 Zeno OS 里标记为 completed，记录审查时间',
    tool: 'Zeno OS /admin/services + 17 条回复模板',
  },
  {
    step: 6,
    name: '案例回流',
    owner: 'Zeno',
    action: '审查完成后：脱敏 → 写成案例片段 → 发布为新文章',
    check: '每 3 单至少产出一篇案例文章',
    tool: 'Obsidian → 选题装配 → 网站发布',
  },
]

/**
 * 获取当前状态下每一步的断点检查
 */
export function getFunnelStatus(): { step: number; name: string; ok: boolean; fix: string }[] {
  return [
    { step: 1, name: '文章 CTA', ok: false, fix: 'ArticleCTA 装修类 primary 应指向 /tools/quote-check，secondary 指向 /services/quote-standard' },
    { step: 2, name: '工具→微信', ok: false, fix: 'QuoteCheckClient 结果底部需加强微信引导' },
    { step: 3, name: '微信沟通', ok: true, fix: '17 条 AI 回复模板已就绪，Zeno OS 可用' },
    { step: 4, name: '¥499 成交', ok: false, fix: '/services/quote-standard 底部 CTA 是 "联系我"，应改为支付入口' },
    { step: 5, name: '交付审查', ok: true, fix: 'Zeno OS 服务详情页已支持状态跟踪' },
    { step: 6, name: '案例回流', ok: true, fix: 'Obsidian + sync-to-website.js 已就绪' },
  ]
}
