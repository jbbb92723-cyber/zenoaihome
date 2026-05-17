export interface RenovationProjectRiskItem {
  id: string
  project: string
  commonRisk: string
  mustAsk: string[]
  keywords: string[]
}

export const projectRiskLibrary: RenovationProjectRiskItem[] = [
  {
    id: 'water-electric',
    project: '水电',
    commonRisk: '按米/按点位/按实结算混用，最容易出增项。',
    mustAsk: ['开槽范围', '单价和计量方式', '是否含回填和恢复'],
    keywords: ['水电', '开槽', '点位', '按实结算'],
  },
  {
    id: 'waterproofing',
    project: '防水',
    commonRisk: '面积、遍数、闭水和节点没写清。',
    mustAsk: ['刷几遍', '闭水多久', '返工责任怎么算'],
    keywords: ['防水', '闭水', '卫生间', '厨卫'],
  },
  {
    id: 'demo-removal',
    project: '拆改',
    commonRisk: '垃圾外运、清运、保护和恢复常被漏掉。',
    mustAsk: ['是否含清运', '是否含成品保护', '拆后恢复范围'],
    keywords: ['拆改', '垃圾外运', '清运', '保护'],
  },
  {
    id: 'tile-work',
    project: '瓦工 / 瓷砖',
    commonRisk: '空鼓、找平、损耗和收口没说清。',
    mustAsk: ['损耗比例', '铺贴方式', '是否含找平和收口'],
    keywords: ['瓷砖', '瓦工', '空鼓', '找平'],
  },
  {
    id: 'woodwork-cabinet',
    project: '木作 / 柜体',
    commonRisk: '板材、封边、五金和尺寸确认最容易模糊。',
    mustAsk: ['板材型号', '封边标准', '五金品牌'],
    keywords: ['木作', '柜体', '封边', '五金'],
  },
  {
    id: 'paint-work',
    project: '油工 / 乳胶漆',
    commonRisk: '基层修补、遍数、颜色和涂布率容易说不清。',
    mustAsk: ['刷几遍', '是否含修补', '颜色返工怎么算'],
    keywords: ['油工', '乳胶漆', '基层', '涂布率'],
  },
  {
    id: 'windows-installation',
    project: '门窗 / 安装',
    commonRisk: '测量、收口、五金、安装调试容易临时加钱。',
    mustAsk: ['是否含安装调试', '收口是否含在内', '补货或返工怎么处理'],
    keywords: ['门窗', '安装', '调试', '收口'],
  },
  {
    id: 'equipment-installation',
    project: '设备 / 家电',
    commonRisk: '点位、安装条件和配套辅材经常被忽略。',
    mustAsk: ['是否含安装', '安装条件是否满足', '辅材是否含在报价里'],
    keywords: ['设备', '家电', '安装', '配套辅材'],
  },
]
