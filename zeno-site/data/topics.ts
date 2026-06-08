export interface Topic {
  id: string
  slug: string
  title: string
  tagline: string
  description: string
  coreQuestion: string
  willWrite: string[]
  forWho: string
  relatedSlugs: string[]
  color: string
  image?: string
  imageAlt?: string
}

export const topics: Topic[] = [
  {
    id: '01',
    slug: 'shi-zhu-pai-zhuangxiu',
    title: '美学与生活',
    tagline: '好看的设计，要经得起日常生活',
    description:
      '从光线、比例、材质、收纳、家务动线、家庭关系和预算取舍出发，把“想要的生活”翻译成能长期成立的空间判断。',
    coreQuestion: '什么样的美，能被真实生活长期承接？',
    willWrite: [
      '效果图美学和真实居住的差异',
      '光线、比例、材质和生活习惯的关系',
      '好看但难维护的设计为什么会失效',
      '预算应该先服务哪些长期体验',
      '从灵感图里拆出真正的审美偏好',
    ],
    forWho:
      '还没定方案，或者不只想避坑，也想把家真正住好的人。',
    relatedSlugs: [
      '02-jia-bu-shi-yangban-jian',
      'zhuangxiu-yusuan-weishenme-zongchao',
      'baojia-dan-zenme-kan',
      'article-01-03',
      'shuidian-gongcheng-zongchao-yusuan',
      'zhuangxiu-hou-hue-de-wu-jian',
      'article-01-07',
      'article-03-04',
      'article-03-02',
      'article-03-03',
    ],
    color: '#8B7355',
    image: '',
    imageAlt: '美学与生活专题封面',
  },
  {
    id: '02',
    slug: 'chuantong-hangyeren-zenme-yong-ai',
    title: 'AI 辅助整理',
    tagline: 'AI 只做辅助，不替人拍板',
    description:
      'AI 可以辅助整理居住需求、报价材料、追问清单、资料归纳和内容生产效率，但不能替代审美取舍、方案判断和签约责任。',
    coreQuestion: 'AI 在居住判断里，哪些事能帮忙，哪些事不能交给它？',
    willWrite: [
      '为什么传统行业人更需要学 AI',
      'AI 工具的真实边界与适用场景',
      '提示词作为工作流而非咒语',
      '用 AI 写内容如何保持自己的声音',
      'AI 在内容、沟通、报价分析中的实际应用',
    ],
    forWho:
      '来自传统行业，想认真用 AI 做升级，而不是只追热点或炫技的人。',
    relatedSlugs: [
      '04-wei-shenme-wo-kaishi-renzheng-xue-ai',
      'article-05-01',
      'article-05-07',
      'article-05-06',
      'article-05-05',
      'article-05-04',
      'geti-shengchanlv-sange-cengci',
    ],
    color: '#7A6B8A',
    image: '',
    imageAlt: 'AI 实践专题封面',
  },
  {
    id: '03',
    slug: 'meixue-yu-shenghuo',
    title: '报价合同风险',
    tagline: '把落地边界做成可复用清单',
    description:
      '风险词典、检查模板、项目风险库和报价初筛工具，把过去只能靠经验讲的判断过程整理成可使用、可复用的站内资产。',
    coreQuestion: '如何把报价、合同和交付风险，变成普通业主也能一步步使用的工具？',
    willWrite: [
      '风险词典怎么持续扩展',
      '检查模板怎么从真实报价里提炼',
      '免费初筛、风险词典和人工判断怎么分工',
      '工具结果如何连接对应人工判断',
      '结构化数据如何服务搜索和 AI 读取',
    ],
    forWho:
      '想自己先看懂报价，也想理解 Zeno 判断方法如何产品化的人。',
    relatedSlugs: [
      'article-05-02',
      'article-04-07',
      'neirong-xitong-jianqi',
      'article-05-09',
    ],
    color: '#8A6B5B',
    image: '',
    imageAlt: '工具与产品专题封面',
  },
  {
    id: '04',
    slug: 'changqi-zhuyi-shenghuo',
    title: '一人公司',
    tagline: '从重交付走向更轻、更自由的事业系统',
    description:
      '我正在验证：一个传统行业出身的人，如何用 AI、开发、内容和自动化，逐步摆脱重交付，建立更自由的事业。这里记录真实的一人公司实验过程。',
    coreQuestion: '一个人能不能建立一个不依赖大量人力的可持续事业？',
    willWrite: [
      '为什么不想只做一个教人装修的人',
      '从装修现场到一人公司的转型逻辑',
      '复利、方向与长期选择',
      '一件事做好的价值',
      '稳定、自由和事业系统的关系',
    ],
    forWho:
      '想摆脱重交付、探索更轻事业模式的传统行业人和个体创业者。',
    relatedSlugs: [
      'zeno-from-renovation-to-opc',
      'article-05-03',
      '01-wo-wei-shenme-bu-xiang-zhi-zuo-jiaoren-zhuangxiu',
      'article-04-09',
      'article-04-03',
      'article-04-05',
      'wending-bu-shi-lixiang-fanmian',
    ],
    color: '#5B6E8A',
    image: '',
    imageAlt: '一人公司专题封面',
  },
  {
    id: '05',
    slug: 'cong-gongdi-kan-shijie',
    title: '判断与生活',
    tagline: '在压力和噪音中，保持清醒的判断',
    description:
      '从工地看人性，从决策看取舍，从日常看长期。判断力不是天赋，是在真实场景里反复校准出来的能力。克制、长期选择、控制可控之事——这是底层内核。',
    coreQuestion: '如何在高噪音的环境里做出更清醒的判断和选择？',
    willWrite: [
      '工地现场的人性观察',
      '克制、排序与长期选择',
      '长期主义不是忍耐',
      '审美作为生活态度而非视觉追求',
      '低噪音生活的代价和收益',
    ],
    forWho:
      '想在日常决策中更清醒、更从容，不被短期情绪和外部噪音牵着走的人。',
    relatedSlugs: [
      '03-cong-gongdi-kan-shijie',
      '05-changqi-zhuyi-bushi-rennai',
      'article-04-02',
      'gongdi-guanlike',
      'gongdi-kan-qing-yige-ren',
      'article-02-03',
      'article-02-02',
      'article-04-10',
      'di-zaosheng-shenghuo',
    ],
    color: '#6B7A5E',
    image: '',
    imageAlt: '判断与生活专题封面',
  },
]

export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug)
}
