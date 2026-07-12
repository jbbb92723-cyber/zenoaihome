import type { Metadata } from 'next'
import Container from '@/components/ui/Container'
import CTA from '@/components/ui/CTA'
import StructuredData from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: 'Zeno OS｜装修风险判断的开源方法论',
  description:
    '17年工地经验提炼的13边界装修报价审核框架，完全开源。你可以自己用、可以改、可以拿去赚钱。我们只赌一件事：执行比知识贵。',
  alternates: {
    canonical: 'https://zenoaihome.com/zeno-os',
  },
}

const principles = [
  {
    num: '01',
    title: '方法论开源，判断力收费',
    body: '13边界框架、风险词库、检查清单——全部免费公开。你拿着清单可以自己审报价。审完还是不确定？那个不确定感，是唯一需要付费的地方。',
  },
  {
    num: '02',
    title: '执行是壁垒，知识不是',
    body: '任何人都可以下载这13个边界。但能在报价单第3页第5行一眼看出"水电点位按个报价没写超出单价"——这需要17年。公开方法论不会让我少赚钱。它只会让更多人在试过自己审之后，发现"还是需要那个人看一眼"。',
  },
  {
    num: '03',
    title: '每交付一次，提取一个资产',
    body: '审核一份报价单，不止是帮一个客户。是从中提取一个脱敏案例、一条判断规则、一段方法论笔记。审100份 = 100个案例 = 一本不是理论书、是17年工地上真实发生过的血泪合集。',
  },
  {
    num: '04',
    title: '免费内容好到让人想付钱',
    body: '网上讲装修的太多了。但能把"这份报价单在施工第3周会变成加价通知"这件事讲清楚的人，很少。我们的免费内容不是引流诱饵——是让你拿着就能去跟施工方对峙的武器。',
  },
  {
    num: '05',
    title: '先让客户变内行，再让内行变客户',
    body: '传统生意是信息不对称赚钱——你越不懂，我越好赚。我们是反过来——先把你教会。教会了，你发现"知道怎么看"和"看了17年练出来的眼睛"是两回事。那个差距，是你愿意付钱的地方。',
  },
]

const boundaries = [
  { name: '基础部分总合计', detail: '是不是最终价，还是后面还有' },
  { name: '水电点位', detail: '"个"字背后的计量陷阱' },
  { name: '按实际结算', detail: '七个字底下该有的半页纸规则' },
  { name: '防水', detail: '品牌只回答了七分之一' },
  { name: '封窗', detail: '参数之外的增项来源' },
  { name: '垃圾外运', detail: '报价编号自己跟自己打架' },
  { name: '另计·甲供·暂估', detail: '三个词告诉你总价不完整' },
  { name: '口头承诺', detail: '没写进报价单等于没说过' },
  { name: '低价报价', detail: '便宜来自清晰取舍还是漏项少算' },
  { name: '付款节点', detail: '不是财务细节，是主动权安排' },
  { name: '验收质保', detail: '"已验收"三个字的背后' },
  { name: '材料型号', detail: '同品牌不同系列差价可达一倍' },
  { name: '工期顺延', detail: '60天从哪天算起' },
]

const stack = [
  {
    label: '免费工具',
    items: ['报价风险初筛 → /tools/quote-check', 'AI 居住诊断 → /living-diagnosis', '风险词典 → /risk-dictionary', '检查清单 → /checklists'],
  },
  {
    label: '开源方法论',
    items: ['Zeno OS 13边界（本页）', '装修报价风险六层框架 → /blog', '报价风险词库 → Obsidian 公开', '案例脱敏模板 → 即将开放'],
  },
  {
    label: '付费服务',
    items: ['¥2,500 零加价保障审查', '¥2,000起 施工节点顾问', '¥49 自查工具包'],
  },
  {
    label: '数字资产',
    items: ['100个脱敏案例库 → 建设中', '施工节点自检清单包 → 规划中', '装修判断力入门课程 → 规划中'],
  },
]

const faqs = [
  {
    q: '既然方法论都公开了，为什么还有人付¥2,500请你审？',
    a: '因为"知道该看什么"和"看了17年练出来的眼睛"是两回事。你拿着13边界清单审完一遍，可能会发现3-5个不确定的地方——那些不确定的地方，就是我帮你消除的东西。方法免费，判断收费。',
  },
  {
    q: '我可以拿你的13边界去做我自己的审核服务吗？',
    a: '可以。你拿去用、改、包装、卖——都可以。但有一个条件：你用的过程中发现的新问题、新案例、新风险——希望你也能公开回来。不是法律条款，是信誉约定。',
  },
  {
    q: '这和don哥的dbskill有什么不同？',
    a: 'dbskill是商业思维的操作系统，Zeno OS是装修风险判断的操作系统。同一个逻辑，不同赛道。don哥证明了"开源方法论能赚钱"——我们用装修验证一次。',
  },
  {
    q: 'Zeno OS 以后会收费吗？',
    a: '方法论本身永远免费。未来可能收费的是：①基于100个真实案例的深度课程 ②批量审核的企业服务 ③方法论培训。但13边界框架、风险词库、检查清单——永远免费。',
  },
]

export default function ZenoOSPage() {
  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Zeno OS — 装修风险判断的开源方法论',
            url: 'https://zenoaihome.com/zeno-os',
            description: '17年工地经验提炼的13边界装修报价审核框架，完全开源。方法论免费，判断力收费。',
            inLanguage: 'zh-CN',
          },
        ]}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-border bg-canvas">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(222,210,190,0.34),transparent_38%)]" aria-hidden />
        <Container size="content" className="relative py-14 sm:py-18">
          <div className="flex items-center gap-3 mb-5">
            <span className="bg-ink text-paper text-xs font-bold px-3 py-1">Zeno OS</span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone">开源方法论 v1</span>
          </div>
          <h1 className="editorial-display max-w-4xl text-[2.4rem] leading-[1.12] text-ink sm:text-[3.4rem]">
            装修风险判断，不应该是一个人的秘密。
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
            17年工地经验提炼成13个风险边界。全部公开。你可以自己用、可以改、可以拿去赚钱。
            我们只赌一件事：<b>执行比知识贵。</b>方法论免费，但17年的眼睛——你得来找我。
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <CTA href="/tools/quote-check" label="先用免费工具试试 →" variant="primary" />
            <CTA href="/services/quote-review" label="¥2,500 完整审核 →" variant="secondary" />
          </div>
        </Container>
      </section>

      <Container size="content" className="py-section">

        {/* 五个原则 */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-ink mb-3">开源五原则</h2>
          <p className="text-sm text-ink-muted mb-8 max-w-2xl">
            不是"我们很大方"。是这些原则经过验证——公开方法论的人，赚得比藏着掖着的人多。
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((p) => (
              <div key={p.num} className="border border-border bg-surface p-6">
                <p className="text-3xl font-bold text-stone/20 mb-3">{p.num}</p>
                <h3 className="text-sm font-semibold text-ink mb-2">{p.title}</h3>
                <p className="text-xs leading-relaxed text-ink-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 13边界 */}
        <section className="mb-16 border border-stone bg-surface-warm p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink mb-2">核心框架：13边界</h2>
          <p className="text-sm text-ink-muted mb-6 max-w-2xl">
            一份装修报价单该被13把尺子量过——不是我们发明的，是17年里每一个超预算的业主用真金白银买来的教训。
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {boundaries.map((b) => (
              <div key={b.name} className="border border-border bg-canvas p-4">
                <h3 className="text-sm font-semibold text-ink">{b.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">{b.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-ink-faint">
            这13个边界已经在生产环境中被验证。每一个都是真实工地上发生过的事。我们把它从一个人的脑子里拆出来，变成一套可复用的框架——这就是 Zeno OS。
          </p>
        </section>

        {/* 免费 → 开源 → 付费 → 资产 */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-ink mb-3">从免费到资产：四层结构</h2>
          <p className="text-sm text-ink-muted mb-8 max-w-2xl">
            不是"先用免费的勾引你然后卖贵的"。是每一层都有独立价值——你可以停在任何一层。
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stack.map((col) => (
              <div key={col.label} className="border border-border bg-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone mb-4">{col.label}</p>
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li key={item} className="text-xs text-ink-muted leading-relaxed flex gap-1.5">
                      <span className="text-stone shrink-0">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-ink mb-6">常见问题</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="border border-border bg-surface p-5">
                <h3 className="text-sm font-semibold text-ink mb-2">{faq.q}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 底部CTA */}
        <section className="border-2 border-stone bg-surface-warm p-6 sm:p-8 text-center">
          <h2 className="text-xl font-semibold text-ink mb-3">
            Zeno OS 是开源的。Zeno 的判断力不是。
          </h2>
          <p className="text-sm text-ink-muted mb-5 max-w-md mx-auto">
            下载13边界清单，自己试试。审完如果心里有底——免费的够了。审完如果觉得"还有几个地方不确定"——你知道怎么找我。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <CTA href="/tools/quote-check" label="免费初筛 →" variant="primary" />
            <CTA href="/services/quote-review" label="¥2,500 完整审核 →" variant="secondary" />
          </div>
        </section>

      </Container>
    </>
  )
}
