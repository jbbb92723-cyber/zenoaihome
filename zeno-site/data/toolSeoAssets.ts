export interface ToolFaq {
  question: string
  answer: string
}

export interface ToolInternalLink {
  label: string
  href: string
  desc: string
}

export interface ToolSeoAsset {
  key: string
  name: string
  path: string
  description: string
  searchIntent: string
  scenarioTitle: string
  scenario: string[]
  zenoNote: string
  nationalNote: string
  faqs: ToolFaq[]
  links: ToolInternalLink[]
}

export const toolSeoAssets = {
  quoteCheck: {
    key: 'quote-check',
    name: '装修报价初筛工具',
    path: '/tools/quote-check',
    description: '签装修合同前，先用报价初筛工具检查漏项、工艺模糊、材料边界、增项流程和付款节点。',
    searchIntent: '适合搜索“装修报价单怎么看”“装修报价漏项怎么查”“装修报价审核”的用户。',
    scenarioTitle: '典型场景：报价看起来便宜，但你不知道哪里会加钱',
    scenario: [
      '很多业主拿到报价单，第一反应是比较总价。总价低不一定是好事，真正危险的是项目写得太粗、材料写得太泛、工艺写得太虚。',
      '这个工具不替你判断“贵不贵”，先判断“能不能签”。如果报价里没有工程量规则、变更流程、验收标准和付款节点，再低的价格都可能在施工中变成被动。',
      '你后面可以把生成的追问清单发给装修公司或工长，让对方把模糊处写清楚。对方愿不愿意把边界说清，本身就是一种筛选。',
    ],
    zenoNote: '我的判断口径很简单：报价不是价格表，是未来责任的说明书。看报价，先看责任有没有写清楚。',
    nationalNote: '全国各地人工和材料单价不同，但报价风险的结构高度相似：漏项、模糊项、增项口子、付款过快，这些在哪个城市都要先看。',
    faqs: [
      { question: '装修报价初筛能替代人工报价审核吗？', answer: '不能。初筛工具适合先把明显风险找出来，人工审核适合在你已经准备签约、报价单较复杂或金额较高时进一步判断。' },
      { question: '报价单里最容易被忽略的风险是什么？', answer: '不是某个单价高一点，而是项目边界写得不清楚，比如工程量怎么算、材料能不能替换、变更是否先确认、验收不过是否能拒付。' },
      { question: '不同城市的装修报价能用同一个工具看吗？', answer: '可以。这个工具不做本地价格裁判，而是检查报价结构。具体单价要回到本地行情，但风险边界的判断逻辑全国通用。' },
    ],
    links: [
      { label: '签约前检查模板', href: '/checklists/quote-initial-check', desc: '把工具里的追问整理成签约前可对照的检查表。' },
      { label: '装修报价风险词典', href: '/risk-dictionary', desc: '查按实结算、暂估、品牌型号缺失等高频风险词。' },
      { label: '施工项目风险库', href: '/project-risks', desc: '按水电、防水、拆除、找平等项目看报价里该写清什么。' },
      { label: '标准版报价风险快审', href: '/services/renovation#quote-standard', desc: '完整报价已经拿到、准备继续谈或签约时再进入人工判断。' },
      { label: '合同签约前检查模板', href: '/checklists/contract-pre-signing-check', desc: '报价结构相对清楚后，继续核对合同和付款节点。' },
      { label: '报价单怎么看', href: '/blog/zhuangxiu-baojiadan-zenme-kan', desc: '文章归档保留为补充阅读，不作为主路径。' },
    ],
  },
  budgetStructure: {
    key: 'budget-structure',
    name: '装修预算分配工具',
    path: '/tools/budget-structure',
    description: '按简约够住、舒适耐用、精致改善三种取向，把装修预算拆成业主能看懂的几份钱。',
    searchIntent: '适合搜索“装修预算怎么分配”“装修预算表”“简约装修多少钱一平”“装修预算比例”的用户。',
    scenarioTitle: '典型场景：你有总预算，但不知道这个钱够做成什么样',
    scenario: [
      '很多预算失控，不是因为一开始没钱，而是业主不知道自己到底想做“简约够住”“舒适耐用”还是“精致改善”。取向没说清，后面每个选择都容易升级。',
      '预算分配工具先给出参考单方区间，再把总价拆成几份人话：基础施工、主材选择、柜子收纳、设备电器、家具软装和预留机动。你会看到每一类大概能放多少钱。',
      '这个结果不是最终报价，而是一张“取舍地图”。当某一项明显超出结构范围，你就知道要么提高总预算，要么从其他几份钱里主动取舍。',
    ],
    zenoNote: '预算的核心不是省钱，而是让钱先服务长期居住。真正该守住的是基础、收纳、动线和缓冲。',
    nationalNote: '不同城市的价格差异很大，工具里的单方区间只用于站内初筛。你可以先看取向和比例，再用本地报价修正金额。',
    faqs: [
      { question: '装修预算分配工具给出的比例是固定标准吗？', answer: '不是。它是普通家庭做初步判断的结构参考，具体比例要根据房屋状态、城市行情、家庭生活方式和装修目标调整。' },
      { question: '为什么改成简约、舒适、精致三档？', answer: '因为普通业主更容易理解“我想做成什么样”，而不是理解抽象的内部分类。三档只帮你先定取向，不等于最终报价。' },
      { question: '为什么一定要留缓冲金？', answer: '装修里几乎一定会遇到现场条件、临时调整或未写清费用。没有缓冲金，预算会被任何一个小变更打穿。' },
      { question: '预算分配和超预算原因自测有什么区别？', answer: '预算分配工具解决“钱怎么分”，超预算原因自测解决“为什么会超”。一个偏规划，一个偏诊断。' },
    ],
    links: [
      { label: '查超预算原因', href: '/tools/budget-risk', desc: '分配看完后，继续判断失控来自报价、流程还是需求。' },
      { label: '装修预算模板', href: '/resources#zhuangxiu-yusuan-moban', desc: '把预算分配记录下来，持续追踪版本。' },
      { label: '标准版报价风险快审', href: '/services/renovation#quote-standard', desc: '预算越算越乱时，先回到完整报价，看漏项、模糊项和增项口子。' },
      { label: '预算为什么总超', href: '/blog/zhuangxiu-yusuan-weishenme-zongchao', desc: '继续理解超预算背后的顺序问题。' },
    ],
  },
  unitConverter: {
    key: 'unit-converter',
    name: '装修单位换算工具',
    path: '/tools/unit-converter',
    description: '装修常见面积、长度、延米、坪和单方换算，帮助业主看懂报价单位。',
    searchIntent: '适合搜索“装修延米是什么意思”“平方米换算坪”“装修单方怎么算”的用户。',
    scenarioTitle: '典型场景：报价单位混在一起，你不知道能不能直接比较',
    scenario: [
      '装修报价里经常同时出现平方米、米、延米、项、点位和单方。单位不清，价格比较就会变成错位比较。',
      '比如柜体按延米，墙面按平方米，水电按点位或米，瓷砖按片或箱。你如果把这些数字当成同一种单位看，很容易误判贵和便宜。',
      '这个工具先解决基础换算，再提醒你哪些单位不能直接互相替代。看懂单位以后，再去看报价初筛、瓷砖和乳胶漆计算会更稳。',
    ],
    zenoNote: '很多装修争议，不是从价格开始的，而是从单位没说清开始的。单位不清，责任也不清。',
    nationalNote: '单位换算不受城市限制，全国业主都能用。真正需要本地化的是单价，而不是单位逻辑。',
    faqs: [
      { question: '延米和平方米有什么区别？', answer: '延米通常按长度计算，常见于柜体、台面、踢脚线等；平方米按面积计算，常见于墙面、地面、瓷砖和乳胶漆。两者不能直接比较。' },
      { question: '装修单方怎么算？', answer: '单方通常是总价除以建筑面积或套内面积，用来粗看预算压力。它不能单独判断报价合理性，还要看项目范围和配置。' },
      { question: '单位换算能判断报价贵不贵吗？', answer: '不能直接判断贵不贵，但能帮你发现报价单位是否混乱、是否存在重复计算或口径不一致。' },
    ],
    links: [
      { label: '报价初筛工具', href: '/tools/quote-check', desc: '单位看懂后，继续检查报价边界。' },
      { label: '瓷砖计算器', href: '/tools/tile-calculator', desc: '把面积换算用于瓷砖数量估算。' },
      { label: '乳胶漆计算器', href: '/tools/paint-calculator', desc: '把墙面面积用于乳胶漆用量估算。' },
      { label: '报价单初查模板', href: '/checklists/quote-initial-check', desc: '把单位、工程量和单价一起核对。' },
    ],
  },
  tileCalculator: {
    key: 'tile-calculator',
    name: '瓷砖计算器',
    path: '/tools/tile-calculator',
    description: '输入铺贴面积、瓷砖规格和每箱片数，估算瓷砖片数、箱数和损耗。',
    searchIntent: '适合搜索“瓷砖用量怎么算”“800x800瓷砖多少片一平方”“瓷砖损耗率”的用户。',
    scenarioTitle: '典型场景：买砖前，你想知道大概要多少片、多少箱',
    scenario: [
      '瓷砖数量不能只听一句“大概够”。铺贴面积、瓷砖规格、每箱片数、切割损耗都会影响采购数量。',
      '这个工具先按面积和规格算出基础片数，再按常规铺贴、复杂切割或小空间拼花增加损耗。结果适合你和商家、工长沟通采购范围。',
      '真正下单前，仍然要让现场复尺。尤其是厨卫墙地面、门槛、窗台、过门石、波打线，不要混在一个面积里粗算。',
    ],
    zenoNote: '材料计算的目标不是精确到一片不差，而是让你知道数量范围，避免被“差不多”牵着走。',
    nationalNote: '瓷砖计算逻辑全国通用，但品牌、规格、损耗习惯和送补货规则要按当地商家政策确认。',
    faqs: [
      { question: '瓷砖损耗一般按多少算？', answer: '常规铺贴可先按 8%左右估算，斜铺、异形、多切割可按 12%左右，小空间拼花或复杂造型可按 15%左右。最终以现场复尺和铺贴方案为准。' },
      { question: '瓷砖计算器结果能直接下单吗？', answer: '不建议直接下单。工具结果适合做初步估算和沟通，真正下单前要按现场复尺、铺贴方式和商家补货规则确认。' },
      { question: '墙砖和地砖可以一起算吗？', answer: '不建议混算。墙砖、地砖、门槛、窗台和特殊收口的规格、损耗和施工方式不同，最好分开估算。' },
    ],
    links: [
      { label: '单位换算工具', href: '/tools/unit-converter', desc: '先把面积和规格单位看清楚。' },
      { label: '预算分配工具', href: '/tools/budget-structure', desc: '把瓷砖费用放回主材选择这份钱里。' },
      { label: '验收节点向导', href: '/tools/inspection-guide', desc: '铺贴后检查空鼓、坡度、缝隙和收口。' },
      { label: '从工地看世界', href: '/blog/03-cong-gongdi-kan-shijie', desc: '理解为什么现场复尺和责任留痕重要。' },
    ],
  },
  paintCalculator: {
    key: 'paint-calculator',
    name: '乳胶漆计算器',
    path: '/tools/paint-calculator',
    description: '输入墙面面积、涂布率、桶规格和遍数，估算底漆、面漆升数和桶数。',
    searchIntent: '适合搜索“乳胶漆用量怎么算”“100平房子要多少乳胶漆”“墙面漆几桶够”的用户。',
    scenarioTitle: '典型场景：商家说几桶够，你想自己先算一遍',
    scenario: [
      '乳胶漆用量不是只看房屋面积。墙面面积、门窗洞口、柜体遮挡、涂布率、颜色深浅、基层状态和施工遍数都会影响用量。',
      '这个工具用墙面面积、每升可刷面积、桶容量和遍数来估算底漆、面漆。它适合你采购前做范围判断，不替代现场墙面测量。',
      '如果旧墙翻新、深色改浅色、基层开裂或有大面积修补，用量和施工步骤都可能变化，不要只用商家口头估算做决定。',
    ],
    zenoNote: '乳胶漆真正要看的不只是几桶，而是基层、遍数、修补和验收。材料数量只是第一步。',
    nationalNote: '乳胶漆用量公式全国通用，但产品涂布率、施工习惯和墙面基层状态差异很大，结果要按产品说明和现场修正。',
    faqs: [
      { question: '乳胶漆用量按建筑面积算准吗？', answer: '不够准。建筑面积只能粗估，真正影响用量的是墙面面积、层高、门窗洞口、柜体遮挡和施工遍数。' },
      { question: '底漆一定要刷吗？', answer: '多数新墙和基层处理后的墙面建议刷底漆。旧墙翻新、基层问题多、深色改浅色时，更不建议随便省掉底漆。' },
      { question: '为什么同样面积别人用量不一样？', answer: '产品涂布率、墙面吸水率、颜色、施工遍数、修补返工都会影响用量，所以同面积不同家庭不一定一样。' },
    ],
    links: [
      { label: '单位换算工具', href: '/tools/unit-converter', desc: '先看墙面面积和房屋面积的区别。' },
      { label: '验收节点向导', href: '/tools/inspection-guide', desc: '油漆完成后检查色差、流挂、裂纹和修补。' },
      { label: '预算分配工具', href: '/tools/budget-structure', desc: '把油漆费用放回基础施工或主材选择里。' },
      { label: '深度版签约前判断', href: '/services/renovation#quote-deep', desc: '需要把报价、合同和付款节点一起看时再进入服务。' },
    ],
  },
  inspectionGuide: {
    key: 'inspection-guide',
    name: '装修验收节点向导',
    path: '/tools/inspection-guide',
    description: '按水电、防水、泥工、木作、油漆、安装和竣工生成验收检查项、拍照点和风险信号。',
    searchIntent: '适合搜索“装修验收清单”“水电验收看什么”“防水验收怎么做”“竣工验收注意事项”的用户。',
    scenarioTitle: '典型场景：工程做到一半，你不知道现在该看什么',
    scenario: [
      '很多装修问题不是到竣工才出现，而是在水电、防水、泥工、油漆这些节点就已经埋下了。节点没看，后面返工成本会越来越高。',
      '验收节点向导把每个阶段拆成三件事：现场检查、必须拍照、高风险信号。你不用先懂所有施工标准，也能知道现在该先确认什么。',
      '它不替代第三方监理，但能帮助业主在付款前把明显问题留下证据。尤其是变更、增项和整改，一定要形成文字或图片记录。',
    ],
    zenoNote: '验收不是挑刺，是让问题停在该停的位置。越晚发现，越难改，也越容易伤关系。',
    nationalNote: '各地施工做法会有差异，但节点验收的底层逻辑全国通用：先确认、再封闭；先留痕、再付款。',
    faqs: [
      { question: '验收节点向导能替代监理吗？', answer: '不能。它适合业主做基础自查和留痕，复杂工程、争议现场或质量问题严重时，仍建议找专业人士现场判断。' },
      { question: '装修过程中最应该拍哪些照片？', answer: '至少要拍水电走向、防水闭水、瓷砖空鼓标记、隐蔽工程、设备铭牌、整改前后对比和竣工资料。照片要能看清位置和时间。' },
      { question: '验收不过可以不付下一笔款吗？', answer: '这取决于合同和付款节点是否写清。建议签约前就把“验收通过后付款”写进合同或补充协议。' },
    ],
    links: [
      { label: '报价初筛工具', href: '/tools/quote-check', desc: '验收前先看报价和合同有没有写清验收标准。' },
      { label: '验收清单资料', href: '/resources#yanshou-qingdan', desc: '把节点检查内容整理成可下载资料。' },
      { label: '找 Zeno 做签约前判断', href: '/services/renovation', desc: '报价、合同和付款节点仍不确定，可以提交资料。' },
      { label: '从工地看世界', href: '/blog/03-cong-gongdi-kan-shijie', desc: '理解为什么节点、责任和留痕决定装修结果。' },
    ],
  },
} satisfies Record<string, ToolSeoAsset>

export type ToolSeoKey = keyof typeof toolSeoAssets

export function buildToolStructuredData(asset: ToolSeoAsset): Array<Record<string, unknown>> {
  const url = `https://zenoaihome.com${asset.path}`
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: asset.name,
      url,
      description: asset.description,
      applicationCategory: 'HomeApplication',
      operatingSystem: 'Web',
      inLanguage: 'zh-CN',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'CNY',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: asset.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '首页', item: 'https://zenoaihome.com/' },
        { '@type': 'ListItem', position: 2, name: '工具工作台', item: 'https://zenoaihome.com/tools' },
        { '@type': 'ListItem', position: 3, name: asset.name, item: url },
      ],
    },
  ]
}
