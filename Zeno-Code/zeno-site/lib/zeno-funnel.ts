/**
 * 赞诺官网从内容到项目交付的基础闭环。
 * 服务尚未完全标准化时，先确保每一步都有明确的下一步。
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
    name: '内容建立信任',
    owner: 'System',
    action: '公开传统行业 AI、装修实践、一人公司与共同体内容',
    check: '文章结尾只有一个主要下一步，并与文章主题一致',
    tool: 'components/features/content/ArticleCTA.tsx',
  },
  {
    step: 2,
    name: '进入服务入口',
    owner: 'System',
    action: '让访客按培训、工作流、知识库、智能体或网站需求选择入口',
    check: '每项服务都写清适用对象、输入、交付物和边界',
    tool: '/services',
  },
  {
    step: 3,
    name: '提交真实问题',
    owner: 'Zeno',
    action: '收集身份、当前做法、已有材料、期望结果和时间要求',
    check: '没有真实场景和材料时，不进入报价阶段',
    tool: '/contact',
  },
  {
    step: 4,
    name: '确认范围与报价',
    owner: 'Zeno',
    action: '明确任务边界、交付物、验收方式、周期和费用',
    check: '双方确认书面范围后再启动',
    tool: '项目说明与报价单',
  },
  {
    step: 5,
    name: '交付与交接',
    owner: 'Zeno',
    action: '用真实样本测试结果，交付操作说明和必要培训',
    check: '客户可以按说明继续使用和维护',
    tool: '项目交付记录',
  },
  {
    step: 6,
    name: '复盘与案例',
    owner: 'Zeno',
    action: '在获得许可后脱敏复盘，提取方法、模板和后续改进项',
    check: '不虚构结果，不公开客户敏感信息',
    tool: '内容系统与案例库',
  },
]

export function getFunnelStatus(): { step: number; name: string; ok: boolean; fix: string }[] {
  return ZENO_FUNNEL.map((item) => ({
    step: item.step,
    name: item.name,
    ok: true,
    fix: item.check,
  }))
}
