'use client'

import { useState } from 'react'

const CATEGORIES = [
  { key: 'effect', label: '效果' },
  { key: 'budget', label: '预算' },
  { key: 'pitfall', label: '避坑' },
  { key: 'quote', label: '报价' },
  { key: 'contract', label: '合同' },
  { key: 'construction', label: '施工' },
  { key: 'opening', label: '微信开场' },
] as const

type Template = {
  id: string
  category: string
  title: string
  scenario: string
  content: string
}

const TEMPLATES: Template[] = [
  // ── 效果 ──
  {
    id: 'eff-01',
    category: 'effect',
    title: '审核完真的能省多少钱？',
    scenario: '业主问效果/价值',
    content: `您好。这个问题我没办法给您一个"保证省多少"的数字——因为每份报价单的问题不一样。

但我可以告诉您我17年见过的规律：一份没被审过的报价单，隐藏加价项平均多算 2-5 万。这不是危言耸听，是真实数据。

我做的事情不是"帮您砍价"——是帮您把报价单里那些模糊的描述（比如"按实结算""同等品牌""常规工艺"）翻译成具体的数字和边界。让您在签字之前，清清楚楚知道每一块钱花在哪、哪些地方可能会变。

如果您现在手里有报价单，可以先做免费初筛工具扫一眼。做完如果您觉得"这东西我自己也能看"——那可能真的不用找我。如果做完您心里更没底了——那种"不确定感"就是我的价值。`,
  },
  {
    id: 'eff-02',
    category: 'effect',
    title: '审完之后施工方不认怎么办？',
    scenario: '业主担心审查没用',
    content: `这就是为什么我的旗舰服务有一个核心承诺：审核过的项目如果在施工中被变相加价，我帮您追回差额。追不回，全额退款。

不是"我帮您指出问题就完了"——是我帮您把模糊条款在签约前就改清楚，然后在施工中出了问题，我来帮您追。

17年里，审过的地方没有被加价成功的案例。这个保证没有赔过一分钱——不是因为运气好，是因为该堵的漏洞在签字之前就堵上了。`,
  },
  // ── 预算 ──
  {
    id: 'bud-01',
    category: 'budget',
    title: '我这个预算够不够？',
    scenario: '业主问预算是否合理',
    content: `首先要看您的"预算"具体指什么——是总预算还是半包预算？包含了哪些项目？

以南宁为例，毛坯房半包（含水电、防水、贴砖、木工、油漆）目前的市场行情大约在 XX-XX 元/㎡。但这个数字只是一个参考范围——真正的变量在：

1. 工程量：同样的户型，改水电的幅度不同，差价可以翻倍
2. 材料品牌：同一个品牌的不同系列，差价可达一倍
3. 工艺要求：瓷砖的规格、铺贴方式直接影响人工费

最准确的方法是——把报价单发我。我帮您拆开每一项，告诉您哪些合理、哪些偏高、哪些漏了。免费初筛也可以先扫一眼。`,
  },
  {
    id: 'bud-02',
    category: 'budget',
    title: '会不会越装越贵？怎么控制？',
    scenario: '业主担心超预算',
    content: `会。几乎所有装修都会超预算，区别只在于超多少、为什么超。

可控的超预算：您自己主动加项（比如原来没打算做柜子，后来决定做了）——这是您自己的选择。

不可控的超预算：报价单里埋了"按实结算""暂估""另计"这些词——这些是施工方的选择，您只能被动接受。

控制预算的关键不在施工阶段，在签约前。把报价单里每一个模糊的地方问清楚、写清楚。我的快审（¥499）和全审（¥2,500）就是在做这件事——把"可能多花"变成"确定不花"。

另外一个小技巧：预留 10-15% 的弹性预算。这部分钱不动，只在真正需要的时候用。这样心态上就不会崩。`,
  },
  // ── 避坑 ──
  {
    id: 'pit-01',
    category: 'pitfall',
    title: '装修最容易踩的坑是什么？',
    scenario: '业主问通用避坑',
    content: `干了17年，我总结最常见的坑就三类：

第一类：报价模糊。这是最普遍的——"按实结算""同等品牌""常规工艺""以现场为准"。这些词在报价单里看起来很合理，但它们真正的意思是：最终价格不由你定。签约前必须把这些词逐条追问清楚：按实结算的上限是多少？同等品牌具体是哪个型号？

第二类：付款节奏。签约付60%、水电完付35%、竣工付5%——这种比例意味着做完水电你已经付了95%，后面三个月的施工你没有任何筹码。合理比例是：签约30%、水电25%、木工贴砖25%、油漆15%、竣工5%。

第三类：口头承诺。设计师说"这个你放心，到时候给你弄好"——这句话在法律上没有任何效力。所有承诺必须写进合同或补充协议。不是"他答应了就行"，是"他没写就等于没答应"。

把报价单发我，免费初筛扫一眼。花两分钟，值得。`,
  },
  {
    id: 'pit-02',
    category: 'pitfall',
    title: '怎么看装修公司靠不靠谱？',
    scenario: '业主问如何选公司',
    content: `不靠"口碑"——口碑可以刷。不靠"规模"——大公司也有烂工地。不靠"热情"——签合同之前都热情。

靠三个东西：

第一，报价单的颗粒度。越详细越靠谱。一份好的报价单应该让你看到每一块钱花在哪——材料型号、工艺描述、计量单位、单价、数量。如果报价单上只有项目名称和总价，走。

第二，合同的关键条款。看付款比例（不能签约就付60%）、工期顺延条款（不能"由施工方确认"）、增项确认流程（必须有书面确认才算数）。

第三，在施工地。去他们正在做的工地看看——贴砖有没有空鼓、水电走线规不规范、现场干不干净。一个正在施工的工地比任何销售话术都诚实。

我有一个 ¥499 的快审服务，帮您在三家公司之间横向对比报价和合同。您把几份报价单发我，我帮您拆开看哪家更实在。`,
  },
  // ── 报价 ──
  {
    id: 'quo-01',
    category: 'quote',
    title: '报价单怎么看？一堆数字看不懂',
    scenario: '业主拿到报价不会看',
    content: `不用看懂全部。先看三件事：

第一，看总价下面有没有"另计""暂估""不含"这些词。有的话，这页纸上的总价不是最终价——实际完工价一定高于这个数字。

第二，看水电部分。这是最容易超的。报价上写的是"按实结算"还是"一口价包干"？如果是按实结算，有没有写清楚计量规则和单价上限？

第三，看付款比例。最后一笔（尾款）至少要留 5-10%，在所有验收完成后再付。不要签"签约付 60%"的合同。

您把报价单拍照发我，我帮您做免费初筛——2 分钟就能看出风险等级和重点问题。看不懂没关系，看得懂的人帮您看。`,
  },
  // ── 合同 ──
  {
    id: 'con-01',
    category: 'contract',
    title: '合同要注意哪些条款？',
    scenario: '业主准备签合同',
    content: `合同里最容易踩坑的五个地方：

1. 付款比例：签约付多少？水电完付多少？尾款留多少？尾款低于 5% = 你没有主动权。

2. 工期顺延："因不可抗力或甲方原因导致工期顺延"——这句话没问题。问题在于"甲方原因"的定义。您改一个插座位置算不算甲方原因？合同要写清楚。

3. 材料变更：施工方说"这个材料没货了，换一个同档次的"——"同档次"谁说了算？合同要写：材料变更须经甲方书面确认。

4. 增项确认：施工中发现"这个要做"——多出来的钱怎么算？必须有书面增项单、双方签字，按报价单里的单价计算。

5. 验收标准："按国家标准验收"——太模糊。要具体到：空鼓率不超过多少、平整度误差多少毫米。

¥2,500 全审服务帮您把合同和报价放在一起审——所有模糊条款在签字前改清楚。`,
  },
  // ── 施工 ──
  {
    id: 'con-02',
    category: 'construction',
    title: '施工中要注意什么？怎么验收？',
    scenario: '业主已开工',
    content: `七个关键节点，每个都不能省：

1. 水电验收：走线是否规范、管卡间距是否到位、强弱电距离、点位数量和位置与图纸是否一致
2. 防水验收：刷了几遍、厚度够不够、阴角处理、闭水试验 48 小时
3. 木工验收：吊顶龙骨间距、石膏板接缝处理
4. 贴砖验收：空鼓率（敲）、平整度（靠尺）、缝隙均匀度
5. 油漆验收：基层处理、遍数、阴阳角
6. 安装验收：橱柜、门、卫浴、开关面板
7. 竣工验收：整体观感、使用功能、遗留问题清单

每个节点去工地之前，我会告诉您该拍什么角度、问什么问题。拍照发我，我帮您判断有没有疑点。

施工全程节点顾问 ¥2,000 起——第一个节点不满意，后续全退。`,
  },
  // ── 微信开场 ──
  {
    id: 'ope-01',
    category: 'opening',
    title: '新加好友开场白',
    scenario: '新业主加微信',
    content: `您好！我是赞诺 Zeno，做了 17 年装修。

简单说下我做什么：帮业主在签约前审查报价单和合同，把隐藏的加价项和模糊条款找出来。审过的项目施工中被加价，我帮您追回——追不回，全额退款。

您可以先把报价单拍照发我，我帮您免费扫一眼，2 分钟出风险等级。先看看有没有明显问题，再决定要不要深入。

不着急，您方便的时候发过来就行。`,
  },
  {
    id: 'ope-02',
    category: 'opening',
    title: '业主说"再看看"的跟进',
    scenario: '业主犹豫/拖延',
    content: `完全理解，装修确实不能急。

不过有一个小提醒：报价是有时效的。您手里这份报价单上的价格，可能一个月后就变了——材料价格波动、人工费调整都有可能。

免费初筛工具不花您一分钱，花两分钟勾几个框，至少知道这份报价的风险等级。做完如果觉得安心，那可能真的没问题——¥2,500 的审查费省下来了。做完如果更不放心了，那种"不确定感"就是我可以帮您消除的。

随时把报价单发我，不着急。`,
  },
]

export default function AiReplyClient() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [copied, setCopied] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiResult, setAiResult] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [matchedKnowledge, setMatchedKnowledge] = useState<Array<{ id: string; title: string; category: string; relevance: string }>>([])
  const [seeding, setSeeding] = useState(false)

  const filteredTemplates = activeCategory === 'all'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === activeCategory)

  function copyTemplate(content: string) {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  async function generateAiDraft() {
    if (!aiPrompt.trim()) return
    setAiLoading(true)
    setAiResult('')
    setMatchedKnowledge([])
    try {
      const res = await fetch('/api/admin/ai-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      })
      const data = await res.json()
      setAiResult(data.reply || '生成失败，请重试')
      if (data.matchedKnowledge?.length > 0) {
        setMatchedKnowledge(data.matchedKnowledge)
      }
    } catch {
      setAiResult('网络错误，请重试')
    } finally {
      setAiLoading(false)
    }
  }

  async function seedKnowledge() {
    setSeeding(true)
    try {
      const res = await fetch('/api/admin/knowledge/seed', { method: 'POST' })
      const data = await res.json()
      alert(`已预置 ${data.seeded} 条知识条目`)
    } catch {
      alert('预置失败')
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_380px] gap-5">
      {/* 左侧：分类 + 模板列表 */}
      <div className="space-y-4">
        {/* 分类标签 */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => { setActiveCategory('all'); setSelectedTemplate(null) }}
            className={`text-xs px-3 py-1.5 border font-semibold transition-colors ${activeCategory === 'all' ? 'border-[#C4A882] bg-[#C4A882]/10 text-[#C4A882]' : 'border-[#3A3530] text-[#706860] hover:border-[#504840]'}`}
          >
            全部
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => { setActiveCategory(cat.key); setSelectedTemplate(null) }}
              className={`text-xs px-3 py-1.5 border font-semibold transition-colors ${activeCategory === cat.key ? 'border-[#C4A882] bg-[#C4A882]/10 text-[#C4A882]' : 'border-[#3A3530] text-[#706860] hover:border-[#504840]'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 模板列表 */}
        <div className="border border-[#3A3530] bg-[#1f1d1a] divide-y divide-[#3A3530] max-h-[calc(100vh-280px)] overflow-y-auto">
          {filteredTemplates.map(tpl => (
            <button
              key={tpl.id}
              onClick={() => setSelectedTemplate(tpl)}
              className={`w-full text-left p-3 transition-colors ${selectedTemplate?.id === tpl.id ? 'bg-[#252320] border-l-2 border-[#C4A882]' : 'hover:bg-[#252320]'}`}
            >
              <p className="text-sm text-[#E8E2DA] font-medium">{tpl.title}</p>
              <p className="text-xs text-[#706860] mt-0.5">{tpl.scenario}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 中间：模板预览 */}
      <div className="border border-[#3A3530] bg-[#1f1d1a] p-5 min-h-[600px]">
        {selectedTemplate ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[#E8E2DA]">{selectedTemplate.title}</h2>
                <p className="text-xs text-[#706860] mt-1">场景：{selectedTemplate.scenario}</p>
              </div>
              <button
                onClick={() => copyTemplate(selectedTemplate.content)}
                className="shrink-0 px-4 py-2 text-xs font-semibold bg-[#C4A882] text-[#1C1A17] hover:bg-[#C4A882]/85 transition-colors"
              >
                {copied ? '已复制 ✓' : '复制全文'}
              </button>
            </div>
            <div className="border border-[#3A3530] bg-[#141410] p-5 overflow-y-auto max-h-[calc(100vh-380px)]">
              <pre className="text-sm text-[#A09890] leading-relaxed whitespace-pre-wrap font-sans">{selectedTemplate.content}</pre>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-[#706860]">
            选择一个模板查看内容
          </div>
        )}
      </div>

      {/* 右侧：AI 草稿 */}
      <div className="space-y-4">
        <div className="border border-[#3A3530] bg-[#1f1d1a] p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#E8E2DA]">AI 草稿</h2>
            <button
              onClick={seedKnowledge}
              disabled={seeding}
              className="text-xs px-2 py-1 border border-[#504840] text-[#706860] hover:border-[#C4A882] hover:text-[#C4A882] transition-colors disabled:opacity-40"
            >
              {seeding ? '预置中...' : '预置知识库'}
            </button>
          </div>
          <p className="text-xs text-[#706860] mb-3">
            输入业主的问题或场景，AI 自动匹配知识库 + 生成回复草稿。
          </p>
          <textarea
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
            rows={4}
            placeholder="例如：业主问"装了中央空调还需要装新风吗？预算不太够了""
            className="w-full bg-[#141410] border border-[#3A3530] text-sm text-[#E8E2DA] p-3 resize-y outline-none focus:border-[#C4A882] placeholder:text-[#504840]"
          />
          <button
            onClick={generateAiDraft}
            disabled={aiLoading || !aiPrompt.trim()}
            className="mt-3 w-full py-2 text-xs font-semibold bg-[#C4A882] text-[#1C1A17] hover:bg-[#C4A882]/85 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {aiLoading ? '生成中...' : '生成回复'}
          </button>
        </div>

        {aiResult && (
          <div className="border border-[#3A3530] bg-[#1f1d1a] p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-[#706860] uppercase tracking-widest">AI 草稿</h3>
              <button
                onClick={() => copyTemplate(aiResult)}
                className="text-xs text-[#C4A882] hover:underline"
              >
                {copied ? '已复制' : '复制'}
              </button>
            </div>
            <div className="text-sm text-[#A09890] leading-relaxed whitespace-pre-wrap">{aiResult}</div>

            {matchedKnowledge.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#3A3530]">
                <h4 className="text-xs font-semibold text-[#68aeb0] uppercase tracking-widest mb-2">
                  📚 匹配知识库 · {matchedKnowledge.length} 条
                </h4>
                <div className="space-y-2">
                  {matchedKnowledge.map(k => (
                    <div key={k.id} className="border border-[#3A3530] bg-[#252320] p-2 flex items-center gap-2">
                      <span className={`text-[0.6rem] px-1.5 py-0.5 rounded-sm font-semibold ${
                        k.relevance === '高' ? 'bg-green-400/15 text-green-400' :
                        k.relevance === '中' ? 'bg-[#C4A882]/15 text-[#C4A882]' :
                        'bg-[#504840]/30 text-[#706860]'
                      }`}>{k.relevance}</span>
                      <span className="text-xs text-[#A09890]">{k.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
