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
    title: '真实居住',
    tagline: '装修只是入口，居住才是真正的检验',
    description:
      '从预算、报价、材料、施工到真实居住体验出发，把一个复杂传统行业的问题拆清楚。这里不谈网红风和样板间幻想，只讨论住进去之后真正重要的事。',
    coreQuestion: '普通人如何在信息不对称的装修市场里做出更清醒的判断？',
    willWrite: [
      '预算结构与超支的真实原因',
      '报价单拆解和风险识别',
      '材料选择、光线、收纳与长期维护',
      '合同、沟通与施工方识别',
      '住五年、十年后的真实居住体验',
    ],
    forWho:
      '正在装修或准备装修的人，想建立自己的判断力而不是被信息牵着走。',
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
    imageAlt: '真实居住专题封面',
  },
  {
    id: '02',
    slug: 'chuantong-hangyeren-zenme-yong-ai',
    title: 'AI 实践',
    tagline: '不追热点，把 AI 接进真实工作流',
    description:
      '不是技术人也能用好 AI。关键不在工具本身，而在如何把行业经验和判断力与工具结合，用 AI 辅助内容生产、资料整理、工具开发和个人系统搭建。',
    coreQuestion: '一个传统行业出身的人，怎么把 AI 真正用到自己的工作里？',
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
    title: '工具与产品',
    tagline: '把经验变成可复用、可交易的资产',
    description:
      '内容资产、数字产品、在线工具、网站系统——把过去只能靠人讲的经验，变成可以使用和交易的东西。这不是下载站，而是经验产品化的实验场。',
    coreQuestion: '如何把个人经验和行业知识，变成可以持续运转的产品？',
    willWrite: [
      '内容资产作为第二生产线',
      '经验如何成为护城河而非负担',
      '网站母站：为什么需要自己的阵地',
      '我的内容系统是怎么建起来的',
      '数字产品的形态和交付方式',
    ],
    forWho:
      '想把自己的经验打包成可复用产品的传统行业人、内容创作者和小老板。',
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
