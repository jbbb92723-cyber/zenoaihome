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
      '还没定方案，或者不只想看风险，也想把家真正住好的人。',
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
    color: '#111111',
    image: '',
    imageAlt: '美学与生活专题封面',
  },
  {
    id: '02',
    slug: 'kongjian-yu-jiating-changjing',
    title: '空间与家庭场景',
    tagline: '空间不是堆功能，而是让日常更顺',
    description:
      '从老人同住、孩子成长、宠物、家务动线、居家办公、亲友聚餐和独处需求出发，看一套方案能否承接真实家庭关系。',
    coreQuestion: '这个家能不能让家务、陪伴、独处和社交更顺？',
    willWrite: [
      '家庭成员的一天如何在空间中发生',
      '老人同住、孩子成长和宠物家庭的空间边界',
      '家务动线、收纳系统和维护成本',
      '居家办公、独处和社交如何互不打架',
      '阳台、露台、餐厨和客厅如何真正服务生活',
    ],
    forWho:
      '家庭结构复杂，或者想让家真正支持日常秩序、关系和情绪状态的人。',
    relatedSlugs: [
      '02-jia-bu-shi-yangban-jian',
      'article-03-02',
      'article-03-03',
      'article-03-04',
      'zhuangxiu-hou-hue-de-wu-jian',
    ],
    color: '#111111',
    image: '',
    imageAlt: '空间与家庭场景专题封面',
  },
  {
    id: '03',
    slug: 'zhuangxiu-juece',
    title: '装修决策',
    tagline: '先做判断，再做选择',
    description:
      '装修公司、设计师、半包、全包、整装、预算分配和材料取舍，本质都不是选项题，而是基于家庭目标的排序题。',
    coreQuestion: '哪些选择值得投入，哪些只是被氛围带动的伪需求？',
    willWrite: [
      '装修公司和设计师怎么判断',
      '半包、全包、整装怎么取舍',
      '预算应该优先投入哪些长期体验',
      '哪些地方值得花钱，哪些可以晚点买',
      '为什么很多“想要”其实不是长期需求',
    ],
    forWho:
      '已经开始比较方案和服务方，但不想被单一价格、风格或销售话术带着走的人。',
    relatedSlugs: [
      'zhuangxiu-yusuan-weishenme-zongchao',
      'baojia-dan-zenme-kan',
      'shuidian-gongcheng-zongchao-yusuan',
      'article-01-07',
    ],
    color: '#111111',
    image: '',
    imageAlt: '装修决策专题封面',
  },
  {
    id: '04',
    slug: 'baojia-hetong-fengxian',
    title: '报价合同风险',
    tagline: '理想生活要被报价、合同和交付承接',
    description:
      '风险词典、检查模板、项目风险库和报价初筛工具，把过去只能靠经验讲的判断过程整理成普通业主也能一步步使用的资产。',
    coreQuestion: '报价、合同和交付边界，能不能承接这套生活方案？',
    willWrite: [
      '漏项、模糊项和增项口子怎么识别',
      '材料品牌型号、工艺和工程量怎么问清',
      '付款节点和验收节点为什么要绑定',
      '口头承诺怎样落到报价、合同或附件',
      '工具结果如何连接人工判断',
    ],
    forWho:
      '已经拿到报价、合同或付款节点，想在签约前把边界看清的人。',
    relatedSlugs: [
      'article-05-02',
      'article-04-07',
      'baojia-dan-zenme-kan',
      'shuidian-gongcheng-zongchao-yusuan',
    ],
    color: '#111111',
    image: '',
    imageAlt: '报价合同风险专题封面',
  },
  {
    id: '05',
    slug: 'jianzaozhe-shouji',
    title: '建造者手记',
    tagline: '记录一个居住判断系统如何被建造出来',
    description:
      '这里记录 ZenoAIHome 如何从工地经验、设计判断、内容沉淀、工具开发和真实服务里，一步步长成一个居住决策系统。',
    coreQuestion: '一个传统行业从业者，怎样把经验变成可复用的判断系统？',
    willWrite: [
      '从装修现场到居住判断系统的转型逻辑',
      '真实服务中的失败复盘和方法修正',
      '内容资产如何沉淀为网站数据和工具',
      '自动化、开发和人工判断如何分工',
      '长期主义、克制和判断力在项目里的体现',
    ],
    forWho:
      '想看方法背后的真实建造过程，或同样在传统行业里探索产品化的人。',
    relatedSlugs: [
      'zeno-from-renovation-to-opc',
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
    color: '#111111',
    image: '',
    imageAlt: '判断与生活专题封面',
  },
]

export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug)
}
