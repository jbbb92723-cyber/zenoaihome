import type { AssistantCard, AssistantPersona } from './contracts'

type HistoryMessage = {
  role: 'user' | 'assistant'
  content: string
}

type RouteAssistantIntentInput = {
  message: string
  history?: HistoryMessage[]
  pagePath?: string
}

export type AssistantIntent = {
  persona: AssistantPersona
  card?: AssistantCard
}

const RENOVATION_PATTERN =
  /装修|报价(?:单)?|合同|签约|预算|增项|漏项|暂估|按实结算|风险词|施工|工地|水电|防水|泥工|木作|油漆|材料|工艺|付款|验收|监理|工程量/i

const RENOVATION_LEARNING_PATTERN =
  /(?:想学|学习|教我|怎么学|如何学).{0,12}(?:审核|审查|看懂|检查).{0,8}(?:装修|报价|合同)|(?:想学|学习|教我|怎么学|如何学).{0,12}(?:装修|报价|合同).{0,8}(?:审核|审查|看懂|检查)/i

const TRANSFORMATION_PATTERN =
  /转型|一人公司|OPC|个人公司|单人公司|一个人.{0,8}(?:怎么|如何|运营|经营|做)|你.{0,8}一个人.{0,8}(?:怎么|如何|做)|用的什么工具|(?:你|赞诺).{0,8}(?:用的|用了|在用).{0,5}什么工具|工作流|经验.{0,10}(?:变(?:成)?|转成|做成|整理成).{0,8}(?:资产|方法|系统)|经验资产|知识资产|用\s*AI\s*(?:做复用|整理经验|改造工作|做工作)/i

const SPARK_TOPIC_PATTERN = /星火者|星火计划|星火者计划|共同体/i
const SPARK_DIRECT_PATTERN = /副业|星火者|星火计划|共同体/i
const SPARK_NEGATION_PATTERN =
  /不想|不要|不打算|不准备|不考虑|不加入|不报名|没兴趣|没有兴趣|不感兴趣/i
const JOIN_PATTERN = /(?:想|要|希望|准备|打算|我要|我想|怎么|如何|可以|能否|申请).{0,8}(?:加入|报名|申请|参与)|(?:加入|报名|申请|参与).{0,8}(?:星火者|星火计划|共同体)/i
const STANDALONE_JOIN_PATTERN = /^(?:我)?(?:想|要|希望|准备|打算|可以|能否|怎么|如何)(?:申请)?(?:加入|报名|申请)(?:了|呢|吗|一下)?[？?。！!]*$/i
const LEARN_THIS_METHOD_PATTERN =
  /(?:想|希望|准备|打算).{0,6}(?:学|学习|掌握).{0,8}(?:这套|这一套|你的这套|赞诺这套).{0,8}(?:方法|模式|体系|做法)/i

const COMPLETE_DOCUMENT_PATTERN = /整份|完整(?:的)?|全套|全部材料|整套材料/i
const MULTIPLE_DOCUMENT_PATTERN = /多份|多版|多个版本|几份|几版|两份|三份/i
const FILE_PATTERN = /PDF|文件|附件|文档|材料原文|\d+\s*页/i
const ITEM_BY_ITEM_PATTERN = /逐项|一项一项|逐条|每一项/i
const MANUAL_REVIEW_PATTERN = /人工.{0,4}(?:审核|审查|复核|看)|(?:审核|审查|复核).{0,4}人工/i
const DIRECT_AUDIT_PATTERN =
  /(?:直接|请|能不能|可以|麻烦).{0,8}(?:帮我|替我).{0,8}(?:审核|审查|复核|审)|(?:帮我|替我).{0,8}(?:审核|审查|复核|审)/i
const DIRECT_LOOK_PATTERN = /(?:直接|请|能不能|可以|麻烦).{0,8}(?:帮我|替我).{0,8}看/i
const BOOK_REVIEW_PATTERN =
  /预约.{0,8}(?:审核|审查|复核|报价|合同|服务)|(?:审核|审查|复核|报价服务).{0,8}预约/i

function hasExplicitSparkInterest(message: string, userHistory: string): boolean {
  if (SPARK_NEGATION_PATTERN.test(message)) return false
  if (SPARK_DIRECT_PATTERN.test(message)) return true
  if (STANDALONE_JOIN_PATTERN.test(message.trim())) return true

  const joinsReferencedSpark = JOIN_PATTERN.test(message)
    && SPARK_TOPIC_PATTERN.test(`${message} ${userHistory}`)
  if (joinsReferencedSpark) return true

  // Learning renovation review remains a reviewer request even if phrased as "想学".
  return LEARN_THIS_METHOD_PATTERN.test(message)
    && !RENOVATION_LEARNING_PATTERN.test(message)
}

function needsComplexQuoteReview(message: string): boolean {
  const hasQuoteOrContract = /报价(?:单)?|合同/i.test(message)
  const hasBothQuoteAndContract = /报价(?:单)?/i.test(message) && /合同/i.test(message)
  const hasComplexMaterial = hasQuoteOrContract
    && (
      COMPLETE_DOCUMENT_PATTERN.test(message)
      || MULTIPLE_DOCUMENT_PATTERN.test(message)
      || FILE_PATTERN.test(message)
      || ITEM_BY_ITEM_PATTERN.test(message)
    )

  return hasBothQuoteAndContract
    || hasComplexMaterial
    || MANUAL_REVIEW_PATTERN.test(message)
    || DIRECT_AUDIT_PATTERN.test(message)
    || (hasQuoteOrContract && DIRECT_LOOK_PATTERN.test(message))
    || BOOK_REVIEW_PATTERN.test(message)
}

function personaFromText(text: string): AssistantPersona | undefined {
  if (!text) return undefined
  if (RENOVATION_LEARNING_PATTERN.test(text)) return 'reviewer'
  if (SPARK_TOPIC_PATTERN.test(text) || /副业/i.test(text)) return 'spark-recruiter'
  if (TRANSFORMATION_PATTERN.test(text)) return 'transformation-guide'
  if (RENOVATION_PATTERN.test(text)) return 'reviewer'
  return undefined
}

function personaFromPage(pagePath?: string): AssistantPersona | undefined {
  if (!pagePath) return undefined

  if (pagePath === '/community' || pagePath.startsWith('/community/')) {
    return 'spark-recruiter'
  }

  if (
    pagePath === '/opc-knowledge'
    || pagePath.startsWith('/opc-knowledge/')
    || pagePath === '/blog/zeno-from-renovation-to-opc'
  ) {
    return 'transformation-guide'
  }

  if (
    pagePath === '/renovation'
    || pagePath.startsWith('/risk-dictionary')
    || pagePath.startsWith('/project-risks')
    || pagePath.startsWith('/checklists')
    || pagePath.startsWith('/tools/quote-check')
    || pagePath.startsWith('/services/quote-')
  ) {
    return 'reviewer'
  }

  return undefined
}

export function routeAssistantIntent({
  message,
  history = [],
  pagePath,
}: RouteAssistantIntentInput): AssistantIntent {
  const currentMessage = message.trim()
  const recentUserHistory = history
    .filter((item) => item.role === 'user')
    .slice(-4)
    .map((item) => item.content)
    .join(' ')

  if (hasExplicitSparkInterest(currentMessage, recentUserHistory)) {
    return { persona: 'spark-recruiter', card: 'spark' }
  }

  if (needsComplexQuoteReview(currentMessage)) {
    return { persona: 'reviewer', card: 'service' }
  }

  const currentPersona = personaFromText(currentMessage)
  if (currentPersona) return { persona: currentPersona }

  const historyPersona = personaFromText(recentUserHistory)
  if (historyPersona) return { persona: historyPersona }

  const pagePersona = personaFromPage(pagePath)
  if (pagePersona) return { persona: pagePersona }

  return { persona: 'transformation-guide' }
}
