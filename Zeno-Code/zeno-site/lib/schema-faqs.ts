/**
 * 分类 FAQ — 用于文章页 FAQPage schema
 *
 * 按文章分类匹配 2-3 个高频问题，GEO 用于抢占 AI 搜索中的问答位。
 * 每个 FAQ 的 answer 包含该分类文章的核心价值主张，
 * 不引用具体文章标题，确保同一分类的所有文章共用同一套 FAQ。
 */

export interface SchemaFaq {
  question: string
  answer: string
}

const categoryFaqs: Record<string, SchemaFaq[]> = {
  '装修全案判断': [
    {
      question: '装修前应该先考虑什么？',
      answer:
        '先考虑生活方式，不是风格。家庭关系、收纳习惯、家务动线和情绪需求决定了空间方案——风格是最后才定的。Zeno 把这个叫「居住判断先于设计判断」。',
    },
    {
      question: '怎么看一份装修报价是不是靠谱？',
      answer:
        '不只看总价。关键是五项：项目写没写清、材料有没有边界、工艺有没有标准、变更有没有流程、付款有没有节点。这五项有一项模糊，报价就不能签。',
    },
    {
      question: '装修预算怎么分配才不会超？',
      answer:
        '先把钱按功能块分开——不是按房间，是按「硬底子、面子、动线、收纳、设备」五块。硬底子别省，面子可以分期。预算超支最常见的不是花多了，是开工前没按这个逻辑分清楚。',
    },
  ],
  'AI 落地判断': [
    {
      question: '传统行业的人怎么开始用AI？',
      answer:
        '不从学技术开始，从拆自己的工作流程开始。找到每天重复劳动最多的环节（整理信息、写回复、查资料），先用AI替代搬运和整理，把时间留给判断和创造。Zeno 的方法论是：AI 替你搬运，你替AI判断。',
    },
    {
      question: 'AI会替代装修行业的判断吗？',
      answer:
        '不会。AI 可以整理规范、对比数据、列出风险项，但「这个报价漏项是不是故意的」「这道裂缝是结构问题还是正常沉降」——这些判断需要人跪在工地上看过几百次才做得出来。AI 替你翻信息，不替你担责任。',
    },
  ],
  '居住方式': [
    {
      question: '装修风格怎么选才不后悔？',
      answer:
        '不问「什么风格好看」，问「我们家怎么过日子」。有小孩的家庭和无小孩的、常做饭的和基本不开火的——同一个户型需要完全不同的空间方案。风格是生活的结果，不是起点。',
    },
    {
      question: '怎么判断一个空间设计是否适合长期居住？',
      answer:
        '一个测试：不看效果图，想象自己在这个空间里度过一个普通的周二——从起床到睡觉。动线顺不顺、收纳够不够、光线对不对，效果图不会告诉你这些。',
    },
  ],
  'OPC·同行有你': [
    {
      question: '什么是OPC（一人公司）？',
      answer:
        'OPC（One Person Company）不是一个人干所有活，而是以个人判断为核心、用AI和工具放大执行能力的独立实践模式。Zeno 的 OPC·同行有你社群，聚集的就是这样一群从传统行业走出来的独立实践者。',
    },
    {
      question: '一个人能做装修服务吗？不靠团队？',
      answer:
        '能，但不是靠一个人干所有活。核心是你提供判断（报价审核、方案诊断、节点验收），执行层（施工、材料、运输）由你筛选过的协作网络完成。AI 帮你把判断效率放大到原来不敢想的程度。',
    },
  ],
  '床垫选购判断': [
    {
      question: '买床垫最容易被坑的是什么？',
      answer:
        '不是价格贵，是你为不需要的技术买了单。独立袋装弹簧、乳胶、记忆棉各有适用的睡眠习惯——睡感不取决于材料堆了多少层，取决于你的体重、睡姿和伴侣翻身频率。先搞清楚自己的睡眠需求，再看配置。',
    },
    {
      question: '床垫应该怎么试？在店里躺两分钟够吗？',
      answer:
        '不够。两分钟你还没从「展示模式」切换到「睡眠模式」。至少躺 10-15 分钟，用你真实的睡姿，模拟入睡状态。最好穿平时睡觉穿的衣服去试。另外——如果店员一直在旁边讲话，你试不出真实感受。',
    },
  ],
  '把自己重做一遍': [
    {
      question: '30多岁转行还来得及吗？',
      answer:
        'Zeno 的答案是：不叫转行，叫重做。你不是放弃了之前的积累，是把旧行业的判断力迁移到新工具上。17 年装修经验不是包袱，是 AI 做不出来的判断数据库。',
    },
    {
      question: '传统行业的人怎么找到新方向？',
      answer:
        '不是去找「什么行业有前景」，是去找「你手上什么判断力别人没有」。你在旧行业里一眼就能看出的问题，对圈外人来说是黑箱。这个判断力就是你的新方向起点。',
    },
  ],
  'solo-method': [
    {
      question: 'What is the solo method for independent practitioners?',
      answer:
        'The solo method is about making your personal judgment the core asset, then using AI and tools to amplify execution. You don\'t need a team to start — you need a clear judgment edge and the discipline to document it.',
    },
    {
      question: 'How does AI help a solo practitioner?',
      answer:
        'AI handles the repetitive work — organizing information, drafting responses, searching references — so you can spend your time on judgment calls that only you can make. The formula: your judgment + AI execution = solo scale.',
    },
  ],
}

/** 文章分类未覆盖时使用的通用 FAQ */
const defaultFaqs: SchemaFaq[] = [
  {
    question: 'Zeno 是谁？',
    answer:
      'Zeno（赞诺）是一个在装修行业做了 17 年的老兵，从传统装修转型为 AI 全栈独立实践者。他运营着 ZenoAIHome.com——一个家装平权站，帮业主打破信息不对称，帮好工长找到对的业主。',
  },
  {
    question: 'ZenoAIHome 提供什么服务？',
    answer:
      '免费：AI 居住诊断、报价风险初筛、预算分配工具。付费：¥2,500 装修报价零加价保障审查、¥2,000+ 施工节点顾问。所有服务围绕一个核心——帮你把装修决策从「靠运气」变成「靠判断」。',
  },
]

/**
 * 根据文章分类返回匹配的 FAQ（最多 3 条）。
 * 分类未覆盖时返回通用 FAQ。
 */
export function getCategoryFaqs(category: string): SchemaFaq[] {
  const matched = categoryFaqs[category]
  if (matched && matched.length > 0) return matched.slice(0, 3)
  return defaultFaqs
}
