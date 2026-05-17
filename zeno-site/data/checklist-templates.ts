export type ChecklistTemplate = {
  id: string
  slug: string
  title: string
  subtitle: string
  suitableFor: string[]
  beforeYouStart: string[]
  sections: {
    title: string
    items: {
      check: string
      why: string
      relatedRiskIds: string[]
    }[]
  }[]
  nextStep: string
}

export type QuoteCheckTemplate = ChecklistTemplate & {
  /** legacy compatibility for existing pages */
  use: string
  output: string
}

export const checklistTemplates: ChecklistTemplate[] = [
  {
    id: 'ct-quote-initial-check',
    slug: 'quote-initial-check',
    title: '报价单初查模板',
    subtitle: '先判断这份报价能不能看懂、能不能继续谈，不急着判断贵不贵。',
    suitableFor: ['刚拿到报价单的人', '正在对比两三家装修公司的人', '看总价觉得便宜但心里没底的人'],
    beforeYouStart: [
      '准备完整报价单，不要只看销售发来的总价截图。',
      '把户型面积、装修方式、是否旧房翻新先写在旁边。',
      '先用红笔圈出“按实结算、暂估、另计、不含、以现场为准”等字样。',
    ],
    sections: [
      {
        title: '先看报价有没有拆开',
        items: [
          {
            check: '确认报价单是否按空间或工种拆开，不能只写“全屋装修一口价”或“基础套餐”。',
            why: '没有拆开就看不出哪些项目没写，也无法判断后面会不会补项。',
            relatedRiskIds: ['qr-04', 'qr-06', 'qr-07'],
          },
          {
            check: '逐行查看每个项目是否都有单位、数量、单价和小计，缺一项就标出来。',
            why: '单位和数量不清，后面很容易从低价变成按实际补钱。',
            relatedRiskIds: ['qr-05', 'qr-12'],
          },
          {
            check: '把“暂估、按实、另计、不含”的项目单独抄出来，数一数有几项。',
            why: '这些词不是一定有问题，但都代表签约前还没说清。',
            relatedRiskIds: ['qr-01', 'qr-06', 'qr-14'],
          },
        ],
      },
      {
        title: '再看材料和工艺是否说清',
        items: [
          {
            check: '查看主材和辅材是否分别写明品牌、型号、规格，不接受只写“知名品牌”。',
            why: '品牌相同不代表型号相同，型号和规格才决定真实配置。',
            relatedRiskIds: ['qr-02', 'qr-08', 'qr-16'],
          },
          {
            check: '检查防水、找平、墙面基层、水电开槽等项目是否写明做法、遍数或厚度。',
            why: '关键工艺只写“按规范施工”，后期验收会变成口头争议。',
            relatedRiskIds: ['qr-03', 'qr-11', 'qr-12', 'qr-17'],
          },
          {
            check: '确认报价里是否写了材料替换规则，尤其是缺货、升级、同档替换怎么处理。',
            why: '不写替换规则，后面就可能用“同档”替换掉你以为锁定的配置。',
            relatedRiskIds: ['qr-02', 'qr-16'],
          },
        ],
      },
      {
        title: '最后看变更和付款',
        items: [
          {
            check: '找到增减项条款，确认是否写明“先报价、先确认、再施工”。',
            why: '没有确认流程，现场一句“这个要加”就可能变成结算金额。',
            relatedRiskIds: ['qr-01', 'qr-14'],
          },
          {
            check: '检查付款节点是否和验收节点对应，不要只看付款比例是否顺眼。',
            why: '钱走得比工程快，后面整改和返工就很难推动。',
            relatedRiskIds: ['qr-13', 'qr-17'],
          },
          {
            check: '把报价里没写但现场一定会发生的项目列出来，比如清运、保护、收口、安装调试。',
            why: '这些小项经常不是最贵的，但最容易成为后补和扯皮入口。',
            relatedRiskIds: ['qr-04', 'qr-06', 'qr-20'],
          },
        ],
      },
    ],
    nextStep: '如果一份报价里出现 3 个以上没说清的高风险项，先不要签，先让对方按清单补充报价和合同备注。',
  },
  {
    id: 'ct-contract-pre-signing-check',
    slug: 'contract-pre-signing-check',
    title: '合同签约前检查模板',
    subtitle: '把口头承诺、报价边界、付款节点和售后责任，全部落到纸面上。',
    suitableFor: ['已经准备签合同的人', '销售催你交定金的人', '对方说“放心都包含”的人'],
    beforeYouStart: [
      '把报价单、合同正文、补充协议和聊天承诺放在一起看。',
      '不要只看合同首页金额，要逐条看附件和备注。',
      '所有不确定内容先写成问题，不要靠现场口头理解。',
    ],
    sections: [
      {
        title: '把报价边界写进合同',
        items: [
          {
            check: '确认报价单是否作为合同附件，并写明附件与合同正文具有同等效力。',
            why: '报价不进合同，后续争议时很难作为明确交付依据。',
            relatedRiskIds: ['qr-04', 'qr-15'],
          },
          {
            check: '确认每个套餐、赠送、升级项目都有数量、规格和交付条件。',
            why: '只写套餐名或赠送名，后面很容易变成解释空间。',
            relatedRiskIds: ['qr-07', 'qr-15'],
          },
          {
            check: '确认所有“不含、另计、按实”的项目都有计价方式和确认流程。',
            why: '这些是签约后最容易回头加钱的入口。',
            relatedRiskIds: ['qr-01', 'qr-06', 'qr-14'],
          },
        ],
      },
      {
        title: '把口头承诺变成文字',
        items: [
          {
            check: '把销售、设计师、工长说过的赠送、升级、返工承诺逐条写进补充协议。',
            why: '口头承诺在签约后最容易失效，文字才有执行力。',
            relatedRiskIds: ['qr-15'],
          },
          {
            check: '确认材料缺货、替换、升级时，是否必须提前得到业主书面确认。',
            why: '不写确认权，材料替换就可能变成单方决定。',
            relatedRiskIds: ['qr-02', 'qr-16'],
          },
          {
            check: '确认设计变更、现场变更、增减项由谁确认，微信确认是否有效。',
            why: '确认人不清，家人、设计师、工长说法不同都会引发争议。',
            relatedRiskIds: ['qr-14', 'qr-15'],
          },
        ],
      },
      {
        title: '检查验收、付款和售后',
        items: [
          {
            check: '确认每一笔付款对应具体完成节点和验收动作，不要只写日期。',
            why: '付款和验收脱钩，钱可能先付完，问题还没解决。',
            relatedRiskIds: ['qr-13', 'qr-17'],
          },
          {
            check: '确认合同写明未验收通过时，业主可以暂缓下一笔节点款。',
            why: '这是业主推动整改的基本主动权。',
            relatedRiskIds: ['qr-13', 'qr-17'],
          },
          {
            check: '确认质保范围写到具体项目、期限、响应时间和不保情形。',
            why: '只写“质保一年”太粗，真正出问题时很难判断谁负责。',
            relatedRiskIds: ['qr-19'],
          },
        ],
      },
      {
        title: '检查工期和现场责任',
        items: [
          {
            check: '确认开工、关键节点、竣工日期，以及哪些情况可以顺延。',
            why: '只写总工期，不写顺延条件，延期后很难界定责任。',
            relatedRiskIds: ['qr-18'],
          },
          {
            check: '确认成品保护、垃圾清运、现场损坏赔偿是否有明确责任人。',
            why: '现场责任不清，最后经常变成互相推。',
            relatedRiskIds: ['qr-04', 'qr-20'],
          },
          {
            check: '确认防水、隐蔽工程、拆改恢复等高风险项目是否有专项验收记录。',
            why: '这些项目出了问题返工成本高，必须提前留证。',
            relatedRiskIds: ['qr-09', 'qr-11', 'qr-17'],
          },
        ],
      },
    ],
    nextStep: '签约前把所有修改写成合同补充条款；对方只愿口头保证、不愿写清的内容，默认视为高风险。',
  },
  {
    id: 'ct-water-electric-check',
    slug: 'water-electric-check',
    title: '水电改造检查模板',
    subtitle: '水电不要只问多少钱一米，要先问点位、走线、开槽、恢复和封顶。',
    suitableFor: ['水电改造较多的人', '二手房翻新的人', '对智能家居或家电点位有要求的人'],
    beforeYouStart: [
      '准备平面图或手画户型图，先标出开关、插座、灯位、用水点。',
      '把厨房、卫生间、空调、新风、洗烘、净水等设备需求单独列出来。',
      '先确认是按米、按点位、按套内面积，还是按实结算。',
    ],
    sections: [
      {
        title: '确认点位和回路',
        items: [
          {
            check: '逐个房间核对插座、开关、灯位、网口、弱电点位是否写进报价或点位图。',
            why: '口头说有点位，报价里没写，后面就可能按新增点位收费。',
            relatedRiskIds: ['qr-05', 'qr-10', 'qr-14'],
          },
          {
            check: '确认厨房、卫生间、空调、大功率电器是否单独写明回路安排。',
            why: '回路不清会影响用电安全，也会影响后期增项和返工。',
            relatedRiskIds: ['qr-03', 'qr-10'],
          },
          {
            check: '确认水路点位、冷热水、排水、地漏、设备接口是否逐项列出。',
            why: '水路点位漏掉，后期补改通常更麻烦也更贵。',
            relatedRiskIds: ['qr-05', 'qr-10'],
          },
        ],
      },
      {
        title: '确认计价和封顶',
        items: [
          {
            check: '确认水电是按点位、按米还是按实际发生计价，不能混着写。',
            why: '计价口径混用，最后很难核对真实费用。',
            relatedRiskIds: ['qr-01', 'qr-10'],
          },
          {
            check: '如果写“按实结算”，要求写明单价、计算方式和总价上限。',
            why: '水电按实不设上限，是最容易超预算的地方。',
            relatedRiskIds: ['qr-01', 'qr-10', 'qr-13'],
          },
          {
            check: '确认开槽、穿管、布线、回填、封槽、修补是否都包含在报价里。',
            why: '只报布线，不报恢复，后面会出现一串补项。',
            relatedRiskIds: ['qr-04', 'qr-06', 'qr-10'],
          },
        ],
      },
      {
        title: '确认材料和施工做法',
        items: [
          {
            check: '确认电线、水管、线管、底盒、弱电线的品牌、型号、规格都写清。',
            why: '水电材料多是隐蔽材料，写不清后期很难再核实。',
            relatedRiskIds: ['qr-02', 'qr-16'],
          },
          {
            check: '确认强弱电间距、横平竖直或点对点走线规则、拍照留底方式。',
            why: '走线规则不清，会影响验收、维修和后期打孔。',
            relatedRiskIds: ['qr-03', 'qr-17'],
          },
          {
            check: '确认墙地面开槽限制，尤其是承重墙、梁柱、卫生间地面。',
            why: '不该开的地方开槽，后期风险和修复成本都高。',
            relatedRiskIds: ['qr-03', 'qr-09', 'qr-10'],
          },
        ],
      },
      {
        title: '确认验收和变更',
        items: [
          {
            check: '确认水电完工后是否做打压、通电、通网、拍照和业主签字。',
            why: '隐蔽工程封起来之后，问题会更难证明。',
            relatedRiskIds: ['qr-10', 'qr-17'],
          },
          {
            check: '确认现场新增点位必须先报价确认，不允许先做后补。',
            why: '点位新增看似小，累计起来就是水电超支主因。',
            relatedRiskIds: ['qr-10', 'qr-14'],
          },
          {
            check: '确认水电质保范围，特别是漏水、跳闸、接口松动由谁负责。',
            why: '水电问题通常不是当天暴露，质保边界必须提前写清。',
            relatedRiskIds: ['qr-19'],
          },
        ],
      },
    ],
    nextStep: '水电没有点位图、计价口径和封顶规则时，不建议直接签；先让对方补点位清单和水电计价说明。',
  },
  {
    id: 'ct-old-house-renovation-risk-check',
    slug: 'old-house-renovation-risk-check',
    title: '老房翻新风险检查模板',
    subtitle: '老房最怕“拆开再说”，签约前先把不可预见和恢复责任写清楚。',
    suitableFor: ['二手房翻新的人', '旧房局改的人', '需要拆改厨卫或墙地面的人'],
    beforeYouStart: [
      '准备现场照片、原始户型图和想拆改的位置说明。',
      '把必须保留的门窗、地板、柜体、电器先标出来。',
      '先问清“拆改报价”和“拆完后的恢复报价”是不是同一件事。',
    ],
    sections: [
      {
        title: '先查拆改范围',
        items: [
          {
            check: '确认拆除项目逐项列出：墙体、地面、吊顶、柜体、洁具、门窗、管线。',
            why: '老房拆改如果只写“整体拆除”，后期范围很容易扩大。',
            relatedRiskIds: ['qr-04', 'qr-09'],
          },
          {
            check: '确认拆除后垃圾清运、袋装、下楼、外运、物业费用是否包含。',
            why: '清运经常被漏掉，开工后再补很常见。',
            relatedRiskIds: ['qr-06', 'qr-09'],
          },
          {
            check: '确认拆除过程中发现空鼓、渗漏、管线老化时，是否先停工确认。',
            why: '老房不可预见问题多，不能边拆边自动加钱。',
            relatedRiskIds: ['qr-01', 'qr-09', 'qr-14'],
          },
        ],
      },
      {
        title: '再查恢复和基础处理',
        items: [
          {
            check: '确认拆完后的墙地面修补、找平、基层处理是否单独计价。',
            why: '拆除不是结束，恢复才是老房翻新的大变量。',
            relatedRiskIds: ['qr-06', 'qr-12'],
          },
          {
            check: '确认厨卫防水是否重做，面积、高度、遍数、闭水时间是否写清。',
            why: '旧房厨卫最怕漏水，防水边界不能模糊。',
            relatedRiskIds: ['qr-11', 'qr-17'],
          },
          {
            check: '确认墙面铲除、修补、挂网、找平、刷漆各自是否包含。',
            why: '墙面基层问题多，报价写粗了就容易后补。',
            relatedRiskIds: ['qr-03', 'qr-05', 'qr-12'],
          },
        ],
      },
      {
        title: '检查保留和保护责任',
        items: [
          {
            check: '列出所有要保留的地板、门窗、柜体、家电，确认保护方式和损坏赔偿。',
            why: '边拆边保护，如果责任不清，损坏后很难追。',
            relatedRiskIds: ['qr-20'],
          },
          {
            check: '确认公共区域、电梯、楼道、邻里影响由谁负责沟通和保护。',
            why: '老房施工常涉及物业和邻居，责任不清会拖慢进度。',
            relatedRiskIds: ['qr-18', 'qr-20'],
          },
          {
            check: '确认现场临时用水用电、材料堆放、噪音时间是否符合物业要求。',
            why: '这些没说清，开工后容易被物业叫停。',
            relatedRiskIds: ['qr-18', 'qr-20'],
          },
        ],
      },
      {
        title: '检查预算和工期弹性',
        items: [
          {
            check: '要求把“不可预见项目”的判断标准、计价方式和确认流程写清。',
            why: '不可预见不能变成所有增项的兜底理由。',
            relatedRiskIds: ['qr-01', 'qr-09', 'qr-14'],
          },
          {
            check: '确认老房项目是否预留复尺、拆后复核和报价调整节点。',
            why: '老房签约前无法完全看清，关键是调整规则要透明。',
            relatedRiskIds: ['qr-05', 'qr-09'],
          },
          {
            check: '确认工期是否包含拆改、修补、干燥、闭水、物业审批等等待时间。',
            why: '老房延期常常不是单一施工问题，节点必须拆开看。',
            relatedRiskIds: ['qr-18'],
          },
        ],
      },
    ],
    nextStep: '老房翻新不要接受“拆开再说”的空话；至少要先写明拆改范围、不可预见确认流程和恢复计价规则。',
  },
  {
    id: 'ct-payment-milestone-check',
    slug: 'payment-milestone-check',
    title: '付款节点检查模板',
    subtitle: '看付款不是看比例好不好看，而是看钱有没有跟着验收走。',
    suitableFor: ['已经拿到合同付款表的人', '首付款比例较高的人', '担心钱付出去后不好推动整改的人'],
    beforeYouStart: [
      '把合同里的付款表单独截出来，标出每一笔金额和比例。',
      '把每笔付款对应的施工节点写在旁边。',
      '看清尾款比例，不要只看首付款有没有优惠。',
    ],
    sections: [
      {
        title: '检查钱和工程是否同步',
        items: [
          {
            check: '确认每一笔付款都对应明确工程节点，比如水电验收、泥木验收、油漆验收、安装验收。',
            why: '只按日期付款，工程没完成也可能要付下一笔。',
            relatedRiskIds: ['qr-13', 'qr-17'],
          },
          {
            check: '检查首付款是否过高，尤其是开工前是否已经支付大部分款项。',
            why: '前期付款太多，后面业主推动整改的主动权会变弱。',
            relatedRiskIds: ['qr-13'],
          },
          {
            check: '确认尾款比例是否足够覆盖最后整改和收口，不要低到没有约束力。',
            why: '尾款太少，施工方对最后细节的动力会下降。',
            relatedRiskIds: ['qr-13', 'qr-17'],
          },
        ],
      },
      {
        title: '检查付款前置条件',
        items: [
          {
            check: '确认付款前必须完成现场验收，并由业主或指定人员签字确认。',
            why: '没有验收确认，付款就变成单方面催款。',
            relatedRiskIds: ['qr-13', 'qr-17'],
          },
          {
            check: '确认验收不通过时，可以暂停下一笔款项，直到问题整改完成。',
            why: '这是业主面对质量问题时最实际的控制点。',
            relatedRiskIds: ['qr-13', 'qr-17'],
          },
          {
            check: '确认增项费用不能混进节点款，必须另行确认后再支付。',
            why: '增项混入节点款，后面很难分清原合同和新增费用。',
            relatedRiskIds: ['qr-01', 'qr-14'],
          },
        ],
      },
      {
        title: '检查增项和扣款规则',
        items: [
          {
            check: '确认所有增减项都有独立报价单、确认记录和结算明细。',
            why: '没有明细，最后只能靠记忆和口头对账。',
            relatedRiskIds: ['qr-14', 'qr-15'],
          },
          {
            check: '确认施工延期、材料延误、验收不合格是否有扣款或赔付规则。',
            why: '没有责任规则，延期和返工只会变成协商。',
            relatedRiskIds: ['qr-18', 'qr-17'],
          },
          {
            check: '确认如果合同解除或项目取消，已付款和未施工项目如何结算。',
            why: '提前写清退出规则，可以减少极端情况下的损失。',
            relatedRiskIds: ['qr-01', 'qr-13'],
          },
        ],
      },
      {
        title: '检查收尾和售后',
        items: [
          {
            check: '确认最终付款前，是否必须完成清单整改、成品保护损坏赔偿和现场清理。',
            why: '最后一笔钱付完，收尾问题最容易被拖。',
            relatedRiskIds: ['qr-17', 'qr-20'],
          },
          {
            check: '确认质保开始时间是从竣工验收合格开始，而不是从签约或开工开始。',
            why: '质保起算点不同，实际保障时间会差很多。',
            relatedRiskIds: ['qr-19'],
          },
          {
            check: '确认付款凭证、发票或收据由谁开具，抬头和金额是否一致。',
            why: '付款记录不清，会影响后续售后和争议处理。',
            relatedRiskIds: ['qr-13', 'qr-19'],
          },
        ],
      },
    ],
    nextStep: '如果付款节点没有和验收绑定，先要求调整；签约前至少保留足够尾款，用来覆盖整改、收口和售后交接。',
  },
]

export const quoteCheckTemplates: QuoteCheckTemplate[] = checklistTemplates.map((template) => ({
  ...template,
  use: template.subtitle,
  output: template.nextStep,
}))

export function getChecklistTemplateBySlug(slug: string) {
  const slugAliases: Record<string, string> = {
    'contract-before-signing': 'contract-pre-signing-check',
  }

  return checklistTemplates.find((template) => template.slug === (slugAliases[slug] ?? slug))
}
