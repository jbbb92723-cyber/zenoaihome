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
        '先把家庭成员、日常动线、收纳、家务和预算取舍写清，再带着这些约束看布局与风格。这样更容易判断方案是否承接真实生活。',
    },
    {
      question: '怎么看一份装修报价是不是靠谱？',
      answer:
        '不能只看总价。可以先核对项目范围、材料规格、工艺要求、计量方式、变更流程和付款节点；没有写清的部分应回到报价与合同原文继续确认。具体单价还要结合当地行情和实际工程量。',
    },
    {
      question: '装修预算怎么分配才不会超？',
      answer:
        '先区分基础工程、设备、收纳、表面效果和预备金，再按家庭优先级分配。预算表还要写明暂估项、可后置项和变更确认方式，并随着方案和报价更新。',
    },
  ],
  'AI 落地判断': [
    {
      question: '传统行业的人怎么开始用AI？',
      answer:
        '先选一个重复、低风险且结果容易核对的环节，例如资料整理、初稿生成或信息分类。保留原始材料，由人设定标准、复核输出并记录错误，再决定是否扩大使用范围。',
    },
    {
      question: 'AI会替代装修行业的判断吗？',
      answer:
        'AI 可以辅助整理规范、比较文本和列出待核对项，但它不能仅凭有限输入确认现场事实，也不能承担签约、工程或安全责任。涉及报价、合同、结构和施工质量时，应由人结合原始材料与现场条件判断。',
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
  '星火者': [
    {
      question: '什么是OPC（一人公司）？',
      answer:
        'OPC（One Person Company）不是一个人干所有活，而是以个人判断为核心、用 AI 和工具放大执行能力的独立实践模式。Zeno 发起的星火者，连接的正是这样一群从传统行业走出来的独立实践者。',
    },
    {
      question: '一个人能做装修服务吗？不靠团队？',
      answer:
        '可以先从边界清楚的个人服务开始，例如材料整理、报价核对或远程追问清单。施工、监理、检测和法律审查仍由相应责任方完成；是否需要协作者，要按项目范围和交付责任决定。',
    },
  ],
  '床垫选购判断': [
    {
      question: '买床垫最容易被坑的是什么？',
      answer:
        '先避免只看营销名称或材料层数。可以把睡姿、体重、软硬偏好、同睡者干扰、尺寸、试睡条件和售后范围列成清单，再对照产品规格与书面承诺。',
    },
    {
      question: '床垫应该怎么试？在店里躺两分钟够吗？',
      answer:
        '短暂按压不能代表整夜体验。试用时应采用常用睡姿，分别感受肩、腰、髋部的支撑和翻身干扰，并在购买前确认试睡、退换、运输和保修条款。',
    },
  ],
  '把自己重做一遍': [
    {
      question: '有多年传统行业经验，还能转向新的工作方式吗？',
      answer:
        '可以先盘点旧行业里已经形成的判断、案例和工作流程，再选择一个具体问题，用新工具做小范围验证。目标不是抹掉过去，而是确认哪些经验能够被记录、复用并形成新的交付。',
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
      'Zeno（赞诺）是一名传统行业与 AI 的独立实践者。截至 2026 年，他积累了 17 年传统行业经营与项目经验，长期涉及家居与装修实践。ZenoAIHome 记录他如何把经验整理为知识库、工作流、工具和公开实验。',
  },
  {
    question: 'ZenoAIHome 提供什么服务？',
    answer:
      '网站提供公开文章、实践记录和规则型自检工具，也保留项目合作与装修专项判断入口。免费工具只用于整理问题和形成初筛；付费合作会先确认原始材料、范围、交付物和责任边界。',
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
