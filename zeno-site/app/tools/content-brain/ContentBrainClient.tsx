'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import ToolSeoAssetSection from '@/components/tools/ToolSeoAssetSection'
import { BridgePanel, ResultPanel, ToolPageShell } from '@/components/tools/ToolPageShell'
import { toolSeoAssets } from '@/data/toolSeoAssets'

type PlatformId = 'site' | 'xhs' | 'short-video' | 'wechat' | 'multi'
type GoalId = 'trust' | 'lead' | 'sale' | 'asset'
type OfferId = 'auto' | 'quote-guide' | 'budget-template' | 'ai-course' | 'creator-card' | 'ai-service' | 'renovation-service'
type Tone = 'good' | 'warn' | 'bad'

interface DiagnosisItem {
  title: string
  status: string
  tone: Tone
  body: string
  action: string
}

interface ContentBrainClientProps {
  canUseTool: boolean
  isLoggedIn: boolean
}

const platforms: Array<{ id: PlatformId; label: string; desc: string }> = [
  { id: 'site', label: '网站长文', desc: '先沉淀母版，适合 SEO、专题和长期信任。' },
  { id: 'xhs', label: '小红书图文', desc: '适合清单、避坑、对比和强保存价值。' },
  { id: 'short-video', label: '短视频口播', desc: '适合观点冲突、真实经历和前 5 秒抓人。' },
  { id: 'wechat', label: '公众号文章', desc: '适合深度解释、复盘和私域承接。' },
  { id: 'multi', label: '全平台拆条', desc: '先写网站母版，再拆图文、口播和公众号。' },
]

const goals: Array<{ id: GoalId; label: string; desc: string }> = [
  { id: 'asset', label: '沉淀资产', desc: '把经验变成可复用文章、专题和模板。' },
  { id: 'trust', label: '建立信任', desc: '让用户看到真实判断，而不是抽象概念。' },
  { id: 'lead', label: '领取资料', desc: '把内容导向清单、模板或登录领取。' },
  { id: 'sale', label: '产品转化', desc: '把内容导向课程、数字产品或咨询服务。' },
]

const offers: Array<{ id: Exclude<OfferId, 'auto'>; label: string; href: string; desc: string; keywords: string[] }> = [
  {
    id: 'quote-guide',
    label: '报价避坑指南',
    href: '/pricing/baojia-guide',
    desc: '适合报价、合同、漏项、增项和签约前内容。',
    keywords: ['报价', '合同', '漏项', '增项', '签约', '付款', '工艺'],
  },
  {
    id: 'budget-template',
    label: '预算模板 / 预算分配工具',
    href: '/tools/budget-structure',
    desc: '适合预算、超支、钱该怎么分和装修前规划内容。',
    keywords: ['预算', '超支', '省钱', '费用', '钱', '结构', '分配'],
  },
  {
    id: 'ai-course',
    label: '传统装修行业 AI 工作流小课',
    href: '/pricing#ai-workflow-course',
    desc: '适合传统行业 AI、提示词、工作流和内容系统内容。',
    keywords: ['AI', '提示词', '工作流', '内容', '效率', '自动化', '工具'],
  },
  {
    id: 'creator-card',
    label: '内容资产会员年卡',
    href: '/pricing#creator-yearly',
    desc: '适合个人品牌、一人公司、选题库和长期写作内容。',
    keywords: ['内容资产', '一人公司', '选题', '写作', '个人品牌', '长期', '会员'],
  },
  {
    id: 'ai-service',
    label: 'AI + 内容系统咨询',
    href: '/services/ai-workflow',
    desc: '适合已经有业务场景，但不知道怎么接入 AI 的用户。',
    keywords: ['咨询', '系统', '传统行业', '流程', 'SOP', '业务', '落地'],
  },
  {
    id: 'renovation-service',
    label: '装修判断服务',
    href: '/services/renovation',
    desc: '适合报价快审、预算诊断、签约前决策和居住场景服务。',
    keywords: ['装修', '业主', '验收', '施工', '材料', '居住', '南宁'],
  },
]

const genericTerms = ['赋能', '闭环', '降本增效', '打造', '全链路', '底层逻辑', '抓手', '生态', '矩阵', '价值感', '干货', '深度剖析']
const concreteTerms = ['报价', '预算', '合同', '验收', '客户', '工地', '现场', '清单', '模板', '案例', '截图', '工具', '付款', '材料', '施工', 'AI', '提示词']
const conflictTerms = ['不是', '别', '为什么', '真正', '先', '后悔', '避坑', '别急', '反对', '误区', '坑']
const evidenceTerms = ['我', '客户', '现场', '工地', '报价单', '截图', '数据', '复盘', '南宁', '真实', '案例', '对话', '记录']

const toneClasses: Record<Tone, string> = {
  good: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  warn: 'border-amber-200 bg-amber-50 text-amber-950',
  bad: 'border-rose-200 bg-rose-50 text-rose-950',
}

const toneDotClasses: Record<Tone, string> = {
  good: 'bg-emerald-600',
  warn: 'bg-amber-500',
  bad: 'bg-rose-600',
}

function countHits(text: string, terms: string[]) {
  return terms.filter((term) => text.includes(term))
}

function compactText(text: string) {
  return text.replace(/\s+/g, '')
}

function getEmojiCount(text: string) {
  return Array.from(text).filter((char) => {
    const code = char.codePointAt(0) ?? 0
    return code > 0xffff
  }).length
}

function inferOffer(text: string, selectedOfferId: OfferId) {
  if (selectedOfferId !== 'auto') {
    return offers.find((offer) => offer.id === selectedOfferId) ?? offers[0]
  }

  const scored = offers
    .map((offer) => ({
      offer,
      score: offer.keywords.reduce((sum, keyword) => sum + (text.includes(keyword) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score)

  return scored[0]?.score > 0 ? scored[0].offer : offers[3]
}

function inferFormat(platform: PlatformId, text: string, draftLength: number) {
  if (platform === 'site') return '网站长文母版'
  if (platform === 'xhs') return '小红书图文清单'
  if (platform === 'short-video') return '短视频口播'
  if (platform === 'wechat') return '公众号深度文章'
  if (draftLength > 900) return '网站长文母版 + 小红书拆条'
  if (countHits(text, conflictTerms).length > 0) return '短视频口播 + 网站复盘'
  if (text.includes('清单') || text.includes('模板') || text.includes('工具')) return '小红书图文 + 网站工具页'
  return '网站长文母版 + 公众号二次分发'
}

function buildTitles(topic: string, text: string) {
  const cleanTopic = topic.trim() || '这个选题'
  const shortTopic = cleanTopic.length > 26 ? `${cleanTopic.slice(0, 26)}...` : cleanTopic
  const riskWord = text.includes('报价') ? '总价' : text.includes('预算') ? '钱' : text.includes('AI') ? '工具' : '表面问题'
  const objectWord = text.includes('装修') ? '装修' : text.includes('AI') ? 'AI 内容' : '内容'

  return [
    `${shortTopic}：先别急着下结论`,
    `${objectWord}真正该看的不是${riskWord}，是判断顺序`,
    `为什么${shortTopic}总是越做越乱`,
    `普通人做${objectWord}，最容易漏掉的一个问题`,
    `我反对的不是${objectWord}，而是不先把边界问清楚`,
  ]
}

function buildDistribution(platform: PlatformId, format: string) {
  const base = [
    '网站：发布 1200-2000 字母版，保留案例、判断过程和站内链接。',
    '小红书：拆成 6-8 页图文，每页只讲一个判断点。',
    '短视频：只讲一个冲突，不复述全文，前 5 秒直接说反常识判断。',
    '公众号：保留完整逻辑，在结尾导向资料或服务入口。',
  ]

  if (platform === 'site') return [base[0], '发布后再拆小红书标题和短视频开头。', '把文章加入对应专题页，形成长期资产。']
  if (platform === 'xhs') return [base[1], '评论区收集新问题，下一篇回到网站写长文。', '封面优先放结论，不放抽象口号。']
  if (platform === 'short-video') return [base[2], '视频文案只留 3 个段落：冲突、现场证据、下一步。', '表现好的视频再扩成网站文章。']
  if (platform === 'wechat') return [base[3], '开头用真实问题，不要用大段时代背景。', '文末放一个明确领取或咨询入口。']
  return [`推荐形式：${format}。`, ...base]
}

function buildDbsPrompt(params: {
  topic: string
  audience: string
  platform: string
  goal: string
  offer: string
  evidence: string
  draft: string
}) {
  return `/dbs-content
平台：${params.platform}
选题：${params.topic || '请先补充一个明确选题'}
目标用户：${params.audience || '请先补充目标用户'}
内容目标：${params.goal}
转化出口：${params.offer}
真实证据/案例：${params.evidence || '暂无，需要先补现场证据'}

初稿：
${params.draft || '暂无初稿，请先按选题给出内容形式和第一步行动。'}

请按五维诊断输出：文字洁癖、封面/标题、表达效率、认知落差、AI 辅助工作流。最后给出网站母版、短视频开头、小红书标题和站内转化路径。`
}

function MemberGate({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <div className="grid gap-6 border border-border bg-surface p-6 sm:p-8 lg:grid-cols-[0.52fr_0.48fr] lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-stone">Creator Member Tool</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">这个工具适合放进你的创作会员权益。</h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            它不是公开流量工具，而是会员每次发内容前的审稿台：先判断选题值不值得做，再看标题、证据、表达和站内承接。会员得到的不是一篇代写稿，而是一套能反复训练内容判断力的流程。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={isLoggedIn ? '/pricing#creator-yearly' : '/login?callbackUrl=/tools/content-brain'} className="inline-flex h-10 items-center bg-stone px-4 text-sm font-semibold text-white hover:bg-stone/90">
              {isLoggedIn ? '升级创作会员' : '登录后使用'}
            </Link>
            <Link href="/pricing#creator-yearly" className="inline-flex h-10 items-center border border-stone px-4 text-sm font-semibold text-stone hover:bg-stone-pale">
              查看会员权益
            </Link>
          </div>
        </div>

        <div className="grid gap-3">
          {[
            ['诊断选题', '先看这篇内容有没有明确用户、真实问题和可验证场景。'],
            ['接入 /dbs-content', '网页生成可复制的技能调用文本，再交给本地 skill 深诊。'],
            ['沉淀资产', '把网站母版、小红书标题、短视频开头和转化入口放在一张报告里。'],
          ].map(([title, desc]) => (
            <div key={title} className="border border-border bg-canvas p-4">
              <p className="text-sm font-semibold text-ink">{title}</p>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function ContentBrainClient({ canUseTool, isLoggedIn }: ContentBrainClientProps) {
  const [topic, setTopic] = useState('')
  const [audience, setAudience] = useState('准备装修或想用 AI 做内容系统的传统行业人')
  const [platform, setPlatform] = useState<PlatformId>('multi')
  const [goal, setGoal] = useState<GoalId>('asset')
  const [offerId, setOfferId] = useState<OfferId>('auto')
  const [evidence, setEvidence] = useState('')
  const [draft, setDraft] = useState('')
  const [copied, setCopied] = useState(false)
  const [copiedDbsPrompt, setCopiedDbsPrompt] = useState(false)

  const report = useMemo(() => {
    const text = [topic, audience, evidence, draft].join('\n')
    const draftLength = compactText(draft).length
    const genericHits = countHits(text, genericTerms)
    const concreteHits = countHits(text, concreteTerms)
    const conflictHits = countHits(text, conflictTerms)
    const evidenceHits = countHits(text, evidenceTerms)
    const emojiCount = getEmojiCount(text)
    const offer = inferOffer(text, offerId)
    const format = inferFormat(platform, text, draftLength)

    const hygieneTone: Tone = genericHits.length >= 4 || emojiCount >= 4 ? 'bad' : genericHits.length >= 2 || emojiCount >= 2 ? 'warn' : 'good'
    const titleTone: Tone = topic.trim().length < 8 ? 'bad' : concreteHits.length === 0 || conflictHits.length === 0 ? 'warn' : 'good'
    const efficiencyTone: Tone = topic.trim().length < 8 || audience.trim().length < 6 ? 'bad' : draftLength > 1200 && !draft.includes('\n') ? 'warn' : 'good'
    const gapTone: Tone = evidence.trim().length < 12 && evidenceHits.length < 2 ? 'warn' : evidenceHits.length >= 2 ? 'good' : 'warn'
    const conversionTone: Tone = offerId === 'auto' && concreteHits.length === 0 ? 'warn' : 'good'

    const diagnosis: DiagnosisItem[] = [
      {
        title: '文字洁癖',
        status: hygieneTone === 'good' ? '干净' : hygieneTone === 'warn' ? '需要清洗' : '先重写',
        tone: hygieneTone,
        body:
          hygieneTone === 'good'
            ? '目前没有明显的堆词和情绪符号，语言还能继续往具体场景里压。'
            : `检测到 ${genericHits.slice(0, 4).join('、') || '过多情绪符号'}，容易让内容像通用 AI 稿。`,
        action: hygieneTone === 'good' ? '保留判断句，继续补真实细节。' : '先删掉抽象词，改成客户原话、报价项、现场动作或具体数字。',
      },
      {
        title: '封面/标题',
        status: titleTone === 'good' ? '有抓力' : titleTone === 'warn' ? '需要加边界' : '选题不清',
        tone: titleTone,
        body:
          titleTone === 'good'
            ? '选题里已经有具体对象和冲突感，适合拆成网站标题和平台标题。'
            : '标题还缺具体对象或冲突，用户不知道为什么现在要点开。',
        action: '把标题写成“谁在什么场景里，误判了什么”。',
      },
      {
        title: '表达效率',
        status: efficiencyTone === 'good' ? '顺序可用' : efficiencyTone === 'warn' ? '结构偏散' : '先补一句话',
        tone: efficiencyTone,
        body:
          efficiencyTone === 'good'
            ? '目标用户和内容方向基本明确，可以进入母版写作。'
            : '当前还不能一眼看出核心观点，容易写成经验堆叠。',
        action: '先写一句核心判断：这篇内容让用户停止做哪件错事。',
      },
      {
        title: '认知落差',
        status: gapTone === 'good' ? '有现场感' : '证据不足',
        tone: gapTone,
        body:
          gapTone === 'good'
            ? '你已经放入了真实场景信号，内容会比泛泛科普更可信。'
            : '现在更像观点，还缺案例、截图、客户问题或现场观察做支撑。',
        action: '补一个真实片段：客户怎么问、报价怎么写、现场发生了什么。',
      },
      {
        title: '转化路径',
        status: conversionTone === 'good' ? '可承接' : '先定出口',
        tone: conversionTone,
        body: `建议把这篇内容导向「${offer.label}」：${offer.desc}`,
        action: `文末放一个明确下一步，指向 ${offer.href}，不要只写“欢迎交流”。`,
      },
    ]

    const badCount = diagnosis.filter((item) => item.tone === 'bad').length
    const warnCount = diagnosis.filter((item) => item.tone === 'warn').length
    const overallTone: Tone = badCount > 0 ? 'bad' : warnCount >= 3 ? 'warn' : 'good'
    const firstAction = diagnosis.find((item) => item.tone === 'bad')?.action ?? diagnosis.find((item) => item.tone === 'warn')?.action ?? '直接写网站母版，再拆到平台。'
    const platformLabel = platforms.find((item) => item.id === platform)?.label ?? '全平台拆条'
    const goalLabel = goals.find((item) => item.id === goal)?.label ?? '沉淀资产'

    return {
      offer,
      format,
      diagnosis,
      overallTone,
      overallText:
        overallTone === 'good'
          ? '这篇内容可以进入写作，重点是保留现场证据和站内出口。'
          : overallTone === 'warn'
            ? '这篇内容有潜力，但需要先补标题边界、真实证据或转化路径。'
            : '先别急着写正文，选题和核心判断还需要收紧。',
      firstAction,
      titles: buildTitles(topic, text),
      distribution: buildDistribution(platform, format),
      dbsPrompt: buildDbsPrompt({
        topic,
        audience,
        platform: platformLabel,
        goal: goalLabel,
        offer: offer.label,
        evidence,
        draft,
      }),
    }
  }, [audience, draft, evidence, goal, offerId, platform, topic])

  async function copyReport() {
    const reportText = [
      `内容诊断大脑：${topic || '未命名选题'}`,
      `推荐形式：${report.format}`,
      `总体判断：${report.overallText}`,
      '',
      '五维诊断：',
      ...report.diagnosis.map((item) => `- ${item.title}：${item.status}。${item.body} 下一步：${item.action}`),
      '',
      `转化出口：${report.offer.label} ${report.offer.href}`,
      '',
      '标题方向：',
      ...report.titles.map((title) => `- ${title}`),
      '',
      '分发动作：',
      ...report.distribution.map((item) => `- ${item}`),
      '',
      `第一步：${report.firstAction}`,
    ].join('\n')

    await navigator.clipboard.writeText(reportText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  async function copyDbsPrompt() {
    await navigator.clipboard.writeText(report.dbsPrompt)
    setCopiedDbsPrompt(true)
    setTimeout(() => setCopiedDbsPrompt(false), 1600)
  }

  function fillSample() {
    setTopic('装修报价单真正该怎么看：别只盯总价')
    setAudience('第一次装修、已经拿到报价单但看不懂风险的普通业主')
    setPlatform('multi')
    setGoal('lead')
    setOfferId('quote-guide')
    setEvidence('最近客户给我看了一份 108 平半包报价，总价不高，但水电按实结算，辅材品牌没写，付款节点又很靠前。')
    setDraft('很多人看报价单，第一眼只看总价。总价当然重要，但更危险的是边界没写清。报价不是价格表，而是未来责任的说明书。你要先看有没有漏项、工艺有没有写清、材料能不能替换、增项是不是先确认再施工。')
  }

  return (
    <ToolPageShell
      label="Creator Member Tool"
      title="内容诊断大脑：创作会员的发布前审稿台"
      subtitle="每篇内容发布前，先过一遍选题、标题、证据、表达效率和转化路径。网页负责快速诊断，/dbs-content 负责继续深挖，最后把一次想法沉淀成网站资产。"
      bestFor="创作会员、传统行业内容创作者、一人公司"
      time="6-12 分钟"
      prepare={['选题', '目标用户', '真实案例或初稿']}
    >
      {!canUseTool ? (
        <MemberGate isLoggedIn={isLoggedIn} />
      ) : (
      <>
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.38fr_0.62fr]">
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="border border-border bg-surface p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-stone">Input</p>
                <h2 className="mt-2 text-xl font-semibold text-ink">先把材料放进来</h2>
              </div>
              <button type="button" onClick={fillSample} className="shrink-0 border border-border px-3 py-2 text-xs font-semibold text-stone hover:border-stone hover:bg-surface-warm">
                填入示例
              </button>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-ink">
                选题
                <input
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  placeholder="例如：装修报价单真正该怎么看"
                  className="mt-2 w-full border border-border bg-canvas px-3 py-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-stone"
                />
              </label>

              <label className="block text-sm font-semibold text-ink">
                目标用户
                <input
                  value={audience}
                  onChange={(event) => setAudience(event.target.value)}
                  className="mt-2 w-full border border-border bg-canvas px-3 py-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-stone"
                />
              </label>

              <div>
                <p className="mb-2 text-sm font-semibold text-ink">主要发布场景</p>
                <div className="grid gap-2">
                  {platforms.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPlatform(item.id)}
                      className={`border px-4 py-3 text-left transition-colors ${platform === item.id ? 'border-stone bg-stone/5' : 'border-border bg-canvas hover:border-stone/50'}`}
                    >
                      <span className="block text-sm font-semibold text-ink">{item.label}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-ink-muted">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <label className="block text-sm font-semibold text-ink">
                内容目标
                <select
                  value={goal}
                  onChange={(event) => setGoal(event.target.value as GoalId)}
                  className="mt-2 w-full border border-border bg-canvas px-3 py-3 text-sm text-ink outline-none focus:border-stone"
                >
                  {goals.map((item) => (
                    <option key={item.id} value={item.id}>{item.label}：{item.desc}</option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold text-ink">
                转化出口
                <select
                  value={offerId}
                  onChange={(event) => setOfferId(event.target.value as OfferId)}
                  className="mt-2 w-full border border-border bg-canvas px-3 py-3 text-sm text-ink outline-none focus:border-stone"
                >
                  <option value="auto">自动匹配站内入口</option>
                  {offers.map((item) => (
                    <option key={item.id} value={item.id}>{item.label}</option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold text-ink">
                真实证据 / 案例
                <textarea
                  value={evidence}
                  onChange={(event) => setEvidence(event.target.value)}
                  placeholder="写一段真实场景：客户怎么问、现场发生了什么、报价单哪里不对。"
                  className="mt-2 min-h-28 w-full resize-none border border-border bg-canvas px-3 py-3 text-sm leading-relaxed text-ink outline-none placeholder:text-ink-faint focus:border-stone"
                />
              </label>

              <label className="block text-sm font-semibold text-ink">
                初稿，可选
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="粘贴文章、口播稿或小红书草稿。没有初稿也可以先诊断选题。"
                  className="mt-2 min-h-40 w-full resize-none border border-border bg-canvas px-3 py-3 text-sm leading-relaxed text-ink outline-none placeholder:text-ink-faint focus:border-stone"
                />
              </label>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <ResultPanel
            title={report.format}
            actions={<button type="button" onClick={copyReport} className="inline-flex h-10 items-center bg-stone px-4 text-sm font-semibold text-white hover:bg-stone/90">{copied ? '已复制' : '复制诊断报告'}</button>}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center border px-3 py-1 text-xs font-semibold ${toneClasses[report.overallTone]}`}>
                <span className={`mr-2 h-2 w-2 ${toneDotClasses[report.overallTone]}`} />
                {report.overallTone === 'good' ? '可以进入写作' : report.overallTone === 'warn' ? '先补关键材料' : '先收紧选题'}
              </span>
              <span>{report.overallText}</span>
            </div>
            <p className="mt-3">第一步：<span className="font-semibold text-ink">{report.firstAction}</span></p>
          </ResultPanel>

          <section className="grid gap-4 md:grid-cols-2">
            {report.diagnosis.map((item) => (
              <article key={item.title} className="border border-border bg-surface p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-ink">{item.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.body}</p>
                  </div>
                  <span className={`shrink-0 border px-2.5 py-1 text-xs font-semibold ${toneClasses[item.tone]}`}>{item.status}</span>
                </div>
                <p className="mt-4 border-t border-border pt-3 text-xs leading-relaxed text-ink-muted">下一步：{item.action}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-5 lg:grid-cols-[0.45fr_0.55fr]">
            <article className="border border-border bg-surface p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone">Conversion</p>
              <h2 className="mt-3 text-xl font-semibold text-ink">站内转化路径</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                这篇内容优先承接到「{report.offer.label}」。文章中段给一个相关工具或资料，文末再给产品或服务。
              </p>
              <Link href={report.offer.href} className="mt-5 inline-flex h-10 items-center border border-stone px-4 text-sm font-semibold text-stone hover:bg-stone-pale">
                查看对应入口
              </Link>
            </article>

            <article className="border border-border bg-surface p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone">Titles</p>
              <h2 className="mt-3 text-xl font-semibold text-ink">标题方向</h2>
              <div className="mt-4 divide-y divide-border">
                {report.titles.map((title) => (
                  <p key={title} className="py-3 text-sm leading-relaxed text-ink-muted first:pt-0 last:pb-0">{title}</p>
                ))}
              </div>
            </article>
          </section>

          <section className="border border-border bg-surface p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone">Distribution</p>
            <h2 className="mt-3 text-xl font-semibold text-ink">分发拆条</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {report.distribution.map((item) => (
                <div key={item} className="border border-border bg-canvas p-4 text-sm leading-relaxed text-ink-muted">{item}</div>
              ))}
            </div>
          </section>

          <section className="border border-border bg-surface">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border bg-surface-warm px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-stone">继续调用技能</p>
                <h2 className="mt-2 text-xl font-semibold text-ink">复制到 Codex / Claude Code：<code className="font-mono text-stone">/dbs-content</code></h2>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">网页先做快速诊断，本地 skill 再按 dontbesilent 的完整流程做第二轮深诊。</p>
              </div>
              <button type="button" onClick={copyDbsPrompt} className="inline-flex h-10 shrink-0 items-center bg-stone px-4 text-sm font-semibold text-white hover:bg-stone/90">
                {copiedDbsPrompt ? '已复制' : '复制 /dbs-content'}
              </button>
            </div>
            <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap p-5 font-sans text-sm leading-relaxed text-ink sm:p-6">{report.dbsPrompt}</pre>
          </section>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-12 sm:px-8">
        <BridgePanel items={[
          { label: '创作工作台', href: '/tools/md2wechat', desc: '诊断后，把网站母版改成公众号排版。' },
          { label: 'AI 场景生成器', href: '/tools/prompts', desc: '把内容选题变成更完整的 AI 协作提示词。' },
          { label: '内容资产产品', href: '/pricing#creator-yearly', desc: '把选题、标题、模板和提示词沉淀成会员资产。' },
        ]} />
      </section>

      </>
      )}

      <ToolSeoAssetSection asset={toolSeoAssets.contentBrain} />
    </ToolPageShell>
  )
}
